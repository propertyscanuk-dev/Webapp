export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MessagesUI from "@/components/dashboard/MessagesUI";

export default async function InvestorMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ deal?: string; with?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { deal, with: withId } = await searchParams;

  return (
    <MessagesUI
      userId={user.id}
      role="investor"
      initialDealId={deal}
      initialWithId={withId}
    />
  );
}