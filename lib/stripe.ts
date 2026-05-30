import Stripe from "stripe";

let _stripe: Stripe | null = null;

function getInstance(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-04-22.dahlia",
    });
  }
  return _stripe;
}

// Proxy so callers keep using `stripe.xxx` unchanged
export const stripe = new Proxy({} as Stripe, {
  get(_, prop: string) {
    return (getInstance() as any)[prop];
  },
});

export const PLATFORM_FEE_PERCENT    = 0.05;
export const SOURCER_COMMISSION_PERCENT = 0.2;
export const VAT_RATE                = 0.2;

export function calculateFees(sourcingFeePence: number) {
  const platformFee          = Math.round(sourcingFeePence * PLATFORM_FEE_PERCENT);
  const platformFeeVat       = Math.round(platformFee * VAT_RATE);
  const investorTotal        = sourcingFeePence + platformFee + platformFeeVat;
  const sourcerCommission    = Math.round(sourcingFeePence * SOURCER_COMMISSION_PERCENT);
  const sourcerCommissionVat = Math.round(sourcerCommission * VAT_RATE);
  const sourcerPayout        = sourcingFeePence - sourcerCommission - sourcerCommissionVat;
  const platformRevenue      = platformFee + platformFeeVat + sourcerCommission + sourcerCommissionVat;

  return {
    platformFee,
    platformFeeVat,
    investorTotal,
    sourcerCommission,
    sourcerCommissionVat,
    sourcerPayout,
    platformRevenue,
  };
}
