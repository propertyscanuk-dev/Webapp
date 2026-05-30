import Link from "next/link";

const howItWorks = [
  {
    step: "01",
    title: "Investor Reserves a Deal",
    body: "When an investor clicks 'Reserve This Deal', they are taken to a secure Stripe Checkout page. At this point, no money has left their account.",
  },
  {
    step: "02",
    title: "Payment Captured by Stripe",
    body: "The investor completes payment via Stripe. Funds are captured by Stripe's secure payment infrastructure — not stored by PropertyScan. Stripe holds the payment in the platform account.",
  },
  {
    step: "03",
    title: "Webhook Confirmation",
    body: "Stripe sends a verified webhook event to PropertyScan confirming the payment was successful. Only at this point is the deal marked as sold and the deal pack made available.",
  },
  {
    step: "04",
    title: "Sourcer Payout via Stripe Connect",
    body: "Once confirmed, PropertyScan automatically initiates a Stripe Connect transfer of the net sourcing fee (80%) directly to the sourcer's verified bank account. This typically arrives within 2–3 business days.",
  },
];

const investorProtections = [
  {
    title: "Stripe's Payment Security",
    body: "All payments are processed by Stripe, which is PCI DSS Level 1 compliant — the highest level of payment security certification. Your card details are never stored by PropertyScan.",
  },
  {
    title: "No Access Before Payment Confirmation",
    body: "Deal packs and full property details are only unlocked after payment is fully confirmed. There is no scenario where you pay and receive nothing.",
  },
  {
    title: "Dispute Framework",
    body: "If a deal cannot complete after payment, you can request a refund through PropertyScan. Stripe's payment dispute process provides an additional layer of protection.",
  },
  {
    title: "Verified Sourcers Only",
    body: "You can only pay sourcers who have passed our full AML and PRS verification. You are never sending money to an unverified or anonymous party.",
  },
  {
    title: "Transparent Fee Breakdown",
    body: "The exact amount you pay — including sourcing fee, buyer protection fee, and VAT — is displayed before you confirm payment. No hidden charges.",
  },
  {
    title: "Traceable Transactions",
    body: "Every payment generates a Stripe payment reference that appears in your purchases dashboard. Full transaction history is always available.",
  },
];

const sourcerProtections = [
  {
    title: "Automatic Payouts",
    body: "When a deal completes, your payout is triggered automatically via Stripe Connect — no chasing invoices, no waiting for manual bank transfers.",
  },
  {
    title: "Direct to Your Bank",
    body: "Your net payout (80% of the sourcing fee) is transferred directly to the bank account connected to your Stripe Express account. PropertyScan does not hold your funds.",
  },
  {
    title: "Stripe Express Security",
    body: "Your bank account details are held securely by Stripe, not PropertyScan. Stripe's Express onboarding verifies your identity before any payouts are enabled.",
  },
  {
    title: "Deal Protected Until Sold",
    body: "Once a deal is reserved and payment initiated, the deal is locked and cannot be reserved by another investor — protecting your sourcing fee from double-reservation.",
  },
];

const faqs = [
  {
    q: "Is this true escrow?",
    a: "PropertyScan uses Stripe's payment infrastructure which captures and holds funds in a manner functionally similar to escrow during the payment confirmation window. Funds are not released to the sourcer until the payment is fully confirmed by Stripe's webhook system. We describe this as 'escrow-protected' to reflect the security model, though it is technically a Stripe platform payment rather than a formal escrow arrangement.",
  },
  {
    q: "What happens if I pay but the deal is no longer available?",
    a: "In the rare event that a deal is reserved by another investor at the same moment your payment processes, you will be issued a full refund. Our system uses atomic database locks to prevent this, but if it occurs, Stripe's refund process is initiated immediately.",
  },
  {
    q: "How long does a sourcer payout take?",
    a: "Stripe Connect payouts typically arrive in the sourcer's bank account within 2–3 business days of payment confirmation. The exact timing depends on the sourcer's bank and Stripe's payout schedule.",
  },
  {
    q: "Can PropertyScan access my payment details?",
    a: "No. Card details are handled entirely by Stripe's PCI-compliant infrastructure. PropertyScan only sees a Stripe payment intent ID — never your card number, expiry, or CVV.",
  },
  {
    q: "What is Stripe Connect?",
    a: "Stripe Connect is Stripe's multi-party payment platform that allows marketplaces to facilitate payments between buyers and sellers. It handles KYC verification of sourcers, payment splitting, and direct payouts — all within Stripe's regulated infrastructure.",
  },
  {
    q: "What is the buyer protection fee for?",
    a: "The 5% buyer protection fee covers PropertyScan's compliance infrastructure, deal verification processes, Stripe payment processing costs, messaging and dispute resolution systems, and customer support. It ensures the marketplace remains sustainable and trusted.",
  },
];

export default function EscrowPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-navy text-white py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/30 text-teal text-sm font-semibold px-5 py-2 rounded-full mb-10">
            ✓ PAYMENT SECURITY
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-8">
            Escrow Protected.<br />
            <span className="text-teal">Powered by Stripe.</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Every payment on PropertyScan is processed via Stripe — the world&apos;s most trusted payment infrastructure. Funds are captured securely and only released to verified sourcers once payment is fully confirmed.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">How the Payment Flow Works</h2>
            <p className="text-navy/60 max-w-2xl mx-auto">
              From reservation to payout, every step of the payment process is handled by Stripe&apos;s regulated payment infrastructure.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step) => (
              <div key={step.step} className="relative">
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 h-full">
                  <div className="text-4xl font-bold text-teal/20 mb-4">{step.step}</div>
                  <h3 className="font-bold text-navy mb-3 leading-tight">{step.title}</h3>
                  <p className="text-navy/60 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investor protections */}
      <section className="bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/30 text-teal text-sm font-semibold px-5 py-2 rounded-full mb-6">
              FOR INVESTORS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">How Your Payment is Protected</h2>
            <p className="text-navy/60 max-w-2xl mx-auto">
              Every investor payment is backed by Stripe&apos;s PCI DSS Level 1 payment security — and our own verification and dispute resolution systems.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investorProtections.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-8 h-8 bg-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-teal font-bold">✓</span>
                </div>
                <h3 className="font-bold text-navy mb-2">{p.title}</h3>
                <p className="text-navy/60 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/register?role=investor"
              className="inline-flex items-center gap-2 bg-teal text-navy font-semibold px-8 py-4 rounded-xl hover:bg-teal-400 transition-colors"
            >
              Browse Protected Deals →
            </Link>
          </div>
        </div>
      </section>

      {/* Sourcer protections */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-navy/5 border border-navy/10 text-navy text-sm font-semibold px-5 py-2 rounded-full mb-6">
              FOR SOURCERS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">How Your Payout is Protected</h2>
            <p className="text-navy/60 max-w-2xl mx-auto">
              When a deal completes, your payout is triggered automatically and sent directly to your verified bank account — no chasing, no delays, no risk.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {sourcerProtections.map((p) => (
              <div key={p.title} className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-navy mb-2">{p.title}</h3>
                <p className="text-navy/60 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/register?role=sourcer"
              className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-8 py-4 rounded-xl hover:bg-navy/90 transition-colors"
            >
              Connect Your Bank Account →
            </Link>
          </div>
        </div>
      </section>

      {/* Stripe badge section */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-xs font-semibold text-navy/40 uppercase tracking-widest mb-4">Payment Infrastructure</p>
            <h3 className="text-2xl font-bold text-navy mb-4">Powered by Stripe</h3>
            <p className="text-navy/60 max-w-xl mx-auto leading-relaxed mb-8">
              Stripe processes hundreds of billions of dollars annually for millions of businesses worldwide. As a Stripe partner, PropertyScan leverages the same payment infrastructure used by Amazon, Google, and Shopify.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-navy/50">
              {["PCI DSS Level 1", "256-bit encryption", "3D Secure 2", "Stripe Connect", "Webhook verified"].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5">
                  <span className="text-teal">✓</span> {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-navy text-center mb-12">Common Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-navy mb-3">{faq.q}</h3>
                <p className="text-navy/60 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Transact with confidence.
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            Every deal on PropertyScan is backed by Stripe&apos;s secure payment infrastructure and our buyer protection framework.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=investor" className="bg-teal text-navy font-bold px-8 py-4 rounded-xl hover:bg-teal-400 transition-colors">
              Browse Deals
            </Link>
            <Link href="/register?role=sourcer" className="bg-white/10 border border-white/25 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors">
              List Your Deals
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-navy/95 py-6 px-4 text-center">
        <p className="text-white/30 text-xs max-w-3xl mx-auto">
          PropertyScan uses Stripe for payment processing. &apos;Escrow Protected&apos; refers to the secure capture and controlled release of funds via Stripe&apos;s platform payment infrastructure. This is not a regulated escrow or client money arrangement.
        </p>
      </div>
    </div>
  );
}
