export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import ConnectButton from "./ConnectButton";

export default async function PayoutsPage({
  searchParams,
}: {
  searchParams: { success?: string; refresh?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_account_id, full_name")
    .eq("id", user.id)
    .single();

  const isConnected = !!profile?.stripe_account_id;

  // Check if Stripe has actually enabled payouts on this account
  let payoutsEnabled = false;
  if (profile?.stripe_account_id) {
    try {
      const account = await stripe.accounts.retrieve(profile.stripe_account_id);
      payoutsEnabled = account.payouts_enabled ?? false;
    } catch {
      // Account may have been deleted on Stripe side — treat as not connected
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-navy mb-2">Payouts</h1>
      <p className="text-navy/50 text-sm mb-8">
        Connect your bank account via Stripe to receive deal proceeds.
      </p>

      {searchParams.success && (
        <div className="bg-teal/10 border border-teal/30 rounded-xl px-6 py-4 mb-6">
          <p className="text-teal font-semibold text-sm">Stripe account connected successfully.</p>
          <p className="text-navy/50 text-xs mt-1">You can now receive payouts when deals complete.</p>
        </div>
      )}

      {searchParams.refresh && !searchParams.success && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-4 mb-6">
          <p className="text-amber-800 font-semibold text-sm">Setup incomplete.</p>
          <p className="text-amber-700 text-xs mt-1">Please complete your Stripe onboarding to receive payouts.</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex items-start gap-5 mb-8">
          <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-navy mb-1">
              {isConnected ? "Stripe Connected" : "Connect Your Bank Account"}
            </p>
            <p className="text-navy/50 text-sm leading-relaxed">
              {isConnected && payoutsEnabled
                ? "Your Stripe Express account is fully connected. When a deal completes, your net proceeds are paid directly to your bank account within 2–3 business days."
                : isConnected && !payoutsEnabled
                ? "Your Stripe account was created but onboarding is incomplete. Finish the setup to receive payouts."
                : "Connect via Stripe Express to receive payouts. Takes around 5 minutes — you'll need your bank account details and proof of identity."}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <p className="text-xs font-bold text-navy/40 uppercase tracking-widest mb-3">Payout Structure</p>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-navy/60">Your sourcing fee</span>
              <span className="text-navy font-medium">100%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-navy/60">PropertyScan commission</span>
              <span className="text-navy font-medium">−20%</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <span className="text-navy font-semibold">You receive</span>
              <span className="text-teal font-bold">80%</span>
            </div>
          </div>
        </div>

        <ConnectButton isConnected={isConnected} payoutsEnabled={payoutsEnabled} />
      </div>
    </div>
  );
}