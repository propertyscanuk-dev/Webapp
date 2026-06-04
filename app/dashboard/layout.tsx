export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, verification_status, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Profile missing — create it from auth metadata then reload
    await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name ?? null,
      role: user.user_metadata?.role ?? "investor",
      verification_status: "not_submitted",
    });
    redirect("/dashboard");
  }

  return (
    <DashboardShell profile={profile}>
      {children}
    </DashboardShell>
  );
}
