export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SettingsForm from "@/components/dashboard/SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, company_name")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/dashboard");

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-navy mb-1">Profile & Settings</h1>
      <p className="text-sm text-navy/50 mb-8">Update your personal and company details.</p>
      <SettingsForm
        id={profile.id}
        full_name={profile.full_name}
        email={profile.email}
        phone={profile.phone}
        company_name={profile.company_name}
      />
    </div>
  );
}
