import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MessagesUI from "@/components/dashboard/MessagesUI";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  return <MessagesUI userId={user.id} role="admin" />;
}
