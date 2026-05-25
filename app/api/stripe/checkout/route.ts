import { NextResponse } from "next/server";
import { stripe, calculateFees } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/service";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { dealId } = await request.json();
  if (!dealId) return NextResponse.json({ error: "Missing dealId" }, { status: 400 });

  const { data: deal } = await supabaseAdmin
    .from("deals")
    .select("id, title, city, postcode, sourcing_fee, status, sourcer_id")
    .eq("id", dealId)
    .eq("status", "active")
    .single();

  if (!deal) return NextResponse.json({ error: "Deal not found or no longer active" }, { status: 404 });

  const { data: sourcerProfile } = await supabaseAdmin
    .from("profiles")
    .select("stripe_account_id")
    .eq("id", deal.sourcer_id)
    .single();

  if (!sourcerProfile?.stripe_account_id) {
    return NextResponse.json({ error: "Sourcer has not connected their Stripe account yet" }, { status: 400 });
  }

  const { investorTotal, sourcerPayout } = calculateFees(deal.sourcing_fee);
  const platformCut = investorTotal - sourcerPayout;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: investorTotal,
          product_data: {
            name: deal.title,
            description: `Sourcing fee + 5% platform fee + VAT — ${deal.city}, ${deal.postcode}`,
          },
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: platformCut,
      transfer_data: { destination: sourcerProfile.stripe_account_id },
      metadata: { dealId, investorId: user.id },
    },
    metadata: { dealId, investorId: user.id },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/deals/${dealId}?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/deals/${dealId}?payment=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
