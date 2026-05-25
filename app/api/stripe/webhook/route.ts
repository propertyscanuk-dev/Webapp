import { NextResponse } from "next/server";
import { stripe, calculateFees } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/service";
import { sendPaymentConfirmed } from "@/lib/email";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !sig) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { dealId, investorId } = session.metadata ?? {};
    if (!dealId || !investorId) return NextResponse.json({ ok: true });

    const { data: deal } = await supabaseAdmin
      .from("deals")
      .select("sourcer_id, sourcing_fee, title")
      .eq("id", dealId)
      .single();

    if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });

    const fees = calculateFees(deal.sourcing_fee);

    await supabaseAdmin
      .from("deals")
      .update({ status: "sold", reserved_by: investorId, reserved_at: new Date().toISOString() })
      .eq("id", dealId);

    const [{ data: investor }, { data: sourcer }] = await Promise.all([
      supabaseAdmin.from("profiles").select("email, full_name").eq("id", investorId).single(),
      supabaseAdmin.from("profiles").select("email, full_name").eq("id", deal.sourcer_id).single(),
    ]);

    await supabaseAdmin.from("transactions").insert({
      deal_id:                dealId,
      investor_id:            investorId,
      sourcer_id:             deal.sourcer_id,
      sourcing_fee:           deal.sourcing_fee,
      platform_fee:           fees.platformFee,
      vat_amount:             fees.platformFeeVat,
      investor_total:         fees.investorTotal,
      sourcer_commission:     fees.sourcerCommission,
      sourcer_commission_vat: fees.sourcerCommissionVat,
      sourcer_payout:         fees.sourcerPayout,
      platform_revenue:       fees.platformRevenue,
      stripe_payment_intent_id: typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? null),
      stripe_transfer_id: null,
      status: "completed",
    });

    if (investor && sourcer) {
      await sendPaymentConfirmed(
        investor.email, investor.full_name ?? "Investor",
        sourcer.email,  sourcer.full_name  ?? "Sourcer",
        deal.title ?? dealId, dealId,
        fees.investorTotal, fees.sourcerPayout,
      );
    }
  }

  return NextResponse.json({ ok: true });
}
