import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, stripe_account_id")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "sourcer") {
    return NextResponse.json({ error: "Sourcers only" }, { status: 403 });
  }

  let accountId = profile.stripe_account_id as string | null;

  if (!accountId) {
    const account = await stripe.accounts.create({ type: "express" });
    accountId = account.id;

    await supabase
      .from("profiles")
      .update({ stripe_account_id: accountId })
      .eq("id", user.id);
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/sourcer/payouts?refresh=true`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/sourcer/payouts?success=true`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}
