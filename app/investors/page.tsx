import Link from "next/link";
import type { Metadata } from "next";
import DealPreviewCard, { type SampleDeal } from "@/components/DealPreviewCard";

const featuredDeal: SampleDeal = {
  type: "HMO",
  title: "5-bed HMO, Headingley",
  location: "Leeds · LS6",
  photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&auto=format&fit=crop",
  askingPrice: "£280,000",
  sourcingFee: "£6,500",
  grossYield: "11.4%",
  bmv: "12%",
  monthlyRent: "£2,650/mo",
};

export const metadata: Metadata = {
  title: "For Investors — PropertyScan",
  description:
    "Browse fully packaged BTL, HMO, BRRR and flip deals from AML-verified sourcers. Every deal includes ROI, yield, BMV, and a full deal pack.",
};

const dealTypes = [
  {
    type: "BTL",
    label: "Buy-to-Let",
    colour: "bg-blue-50 border-blue-100 text-blue-700",
    badge: "bg-blue-100 text-blue-700",
    desc: "Standard residential buy-to-let properties with single AST tenancies. Predictable income, lower management overhead. Great for portfolio building.",
  },
  {
    type: "HMO",
    label: "House in Multiple Occupation",
    colour: "bg-purple-50 border-purple-100 text-purple-700",
    badge: "bg-purple-100 text-purple-700",
    desc: "Multi-tenant properties with individual room lets. Higher gross yields than standard BTL, typically 8–12%. Requires HMO licence and additional compliance.",
  },
  {
    type: "BRRR",
    label: "Buy, Refurb, Refinance, Rent",
    colour: "bg-orange-50 border-orange-100 text-orange-700",
    badge: "bg-orange-100 text-orange-700",
    desc: "Distressed properties purchased below market value, refurbished, and refinanced to recycle capital. Higher upfront work, significant equity creation.",
  },
  {
    type: "Flip",
    label: "Flip",
    colour: "bg-pink-50 border-pink-100 text-pink-600",
    badge: "bg-pink-100 text-pink-600",
    desc: "Properties purchased below market value, refurbished, and sold for profit. Shorter hold period, no ongoing rental income. Best for capital growth.",
  },
];

const packItems = [
  { label: "Full property address & postcode" },
  { label: "Asking price & BMV percentage" },
  { label: "Sourcing fee (paid to sourcer)" },
  { label: "Gross yield & ROI projections" },
  { label: "Monthly rental income estimate" },
  { label: "Deal narrative & sourcer commentary" },
  { label: "Deal pack PDF (photos, comps, floorplan)" },
  { label: "Sourcer profile & verification status" },
];

const steps = [
  {
    step: "01",
    title: "Register & Verify",
    body: "Create your investor account and submit your five compliance documents. Our team reviews within 1 business day.",
  },
  {
    step: "02",
    title: "Browse the Marketplace",
    body: "Filter deals by location, deal type, gross yield, ROI, and BMV. View full deal details and download the deal pack PDF.",
  },
  {
    step: "03",
    title: "Reserve a Deal",
    body: "Found a deal you want to progress? Reserve it via Stripe — your sourcing fee payment is held securely while you conduct due diligence.",
  },
  {
    step: "04",
    title: "Complete & Transact",
    body: "Once you're happy to proceed, funds are released to the sourcer via Stripe Connect. You receive confirmation and full deal documentation.",
  },
];

const docs = [
  { label: "Photo ID", detail: "Passport or driving licence" },
  { label: "Proof of Address", detail: "Utility bill or bank statement dated within 3 months" },
  { label: "Proof of Funds", detail: "Bank statement showing available investment capital" },
  { label: "Source of Wealth", detail: "Explanation and evidence of how your investment funds were acquired" },
  { label: "Investor Questionnaire", detail: "Short suitability questionnaire to confirm investment experience" },
];

const faqs = [
  {
    q: "Can I see deal details before I'm verified?",
    a: "You can register and view the marketplace listing titles, but full deal details — including address, PDF deal packs, and financials — are only visible to verified investors.",
  },
  {
    q: "What does the 5% platform fee cover?",
    a: "The 5% platform fee (on the sourcing fee) covers our compliance infrastructure, deal verification, Stripe payments processing, and customer support. It is charged in addition to the sourcer's stated sourcing fee.",
  },
  {
    q: "Are the sourcers on PropertyScan regulated?",
    a: "All sourcers are verified against our compliance checklist — AML certificate, PRS membership, PI insurance, ICO registration, photo ID, and proof of address. PropertyScan is not FCA authorised and does not provide regulated financial advice.",
  },
  {
    q: "What happens if a deal falls through?",
    a: "If a deal cannot complete after reservation, your sourcing fee payment is refunded. Any disputes are handled through our resolution process and Stripe's payment dispute framework.",
  },
  {
    q: "Is my personal data secure?",
    a: "All verification documents are stored securely via Supabase Storage with row-level security. Only our compliance team can access your documents. We are ICO registered and GDPR compliant.",
  },
];

export default function InvestorsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-navy text-white py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/30 text-teal text-sm font-semibold px-5 py-2 rounded-full mb-10">
            FOR INVESTORS
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-8">
            Off-Market Deals.<br />
            <span className="text-teal">Fully Packaged.</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-12">
            Browse BTL, HMO, BRRR, and flip deals from AML-verified sourcers.
            Every listing includes yield, ROI, BMV, and a full deal pack PDF.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?role=investor"
              className="bg-teal text-navy font-bold px-10 py-5 rounded-xl hover:bg-teal-400 transition-colors text-base sm:text-lg"
            >
              Register as an Investor
            </Link>
            <Link
              href="/deals"
              className="bg-white/10 border border-white/25 text-white font-bold px-10 py-5 rounded-xl hover:bg-white/20 transition-colors text-base sm:text-lg"
            >
              Browse Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-teal py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-navy">5%</p>
            <p className="text-navy/70 text-sm mt-1">Platform fee on<br />sourcing fee only</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-navy/20" />
          <div>
            <p className="text-4xl font-bold text-navy">100%</p>
            <p className="text-navy/70 text-sm mt-1">Verified sourcers<br />only on the platform</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-navy/20" />
          <div>
            <p className="text-4xl font-bold text-navy">4</p>
            <p className="text-navy/70 text-sm mt-1">Deal types:<br />BTL, HMO, BRRR, Flip</p>
          </div>
        </div>
      </section>

      {/* Deal types */}
      <section className="bg-white py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-6">Deal Types</h2>
            <p className="text-navy/60 text-xl max-w-xl mx-auto leading-relaxed">
              Four property strategies, all sourced and packaged by verified professionals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {dealTypes.map((d) => (
              <div key={d.type} className={`border rounded-2xl p-8 ${d.colour}`}>
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${d.badge}`}>
                  {d.type}
                </span>
                <h3 className="font-bold text-xl mb-3">{d.label}</h3>
                <p className="text-sm leading-relaxed opacity-80">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's in a deal pack */}
      <section className="bg-gray-50 border-t border-gray-100 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-6">What&apos;s in a Deal Pack</h2>
            <p className="text-navy/60 text-xl leading-relaxed mb-8">
              Every deal on PropertyScan includes a fully documented pack so you can make an informed decision before reserving.
            </p>
            <div className="flex flex-col gap-3 mb-10">
              {packItems.map((item) => (
                <div key={item.label} className="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-navy text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
            <Link
              href="/register?role=investor"
              className="inline-block bg-navy text-white font-bold px-8 py-4 rounded-xl hover:bg-navy-700 transition-colors"
            >
              Access the Marketplace →
            </Link>
          </div>

          <div>
            <p className="text-xs font-bold text-navy/30 uppercase tracking-widest mb-4">Example Listing</p>
            <DealPreviewCard deal={featuredDeal} />
            <p className="text-navy/30 text-xs mt-3 text-center">
              Sample deal shown for illustration only.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-t border-gray-100 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-6">Your Investor Journey</h2>
            <p className="text-navy/60 text-xl max-w-xl mx-auto leading-relaxed">
              Four steps from registration to completing your first deal.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="border border-gray-100 rounded-2xl p-10 hover:border-teal/40 hover:shadow-lg transition-all">
                <div className="text-teal font-bold text-sm tracking-widest mb-4">STEP {s.step}</div>
                <h3 className="text-navy font-bold text-2xl mb-4">{s.title}</h3>
                <p className="text-navy/60 text-lg leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification docs */}
      <section className="bg-gray-50 border-t border-gray-100 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-6">Investor Verification</h2>
            <p className="text-navy/60 text-xl max-w-xl mx-auto leading-relaxed">
              We verify all investors to maintain the integrity of the marketplace and satisfy our AML obligations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {docs.map((doc) => (
              <div key={doc.label} className="bg-white border border-gray-200 rounded-xl p-6 flex gap-4 items-start">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-navy text-sm">{doc.label}</p>
                  <p className="text-navy/50 text-sm mt-1 leading-snug">{doc.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-t border-gray-100 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-6">Common Questions</h2>
          </div>

          <div className="flex flex-col gap-5">
            {faqs.map((faq) => (
              <div key={faq.q} className="border border-gray-200 rounded-xl px-8 py-7">
                <p className="font-semibold text-navy mb-3">{faq.q}</p>
                <p className="text-navy/60 leading-relaxed text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-28 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Start finding deals today.</h2>
          <p className="text-white/60 text-xl mb-10 leading-relaxed">
            Join verified investors already accessing off-market property deals through PropertyScan.
          </p>
          <Link
            href="/register?role=investor"
            className="inline-block bg-teal text-navy font-bold px-12 py-5 rounded-xl hover:bg-teal-400 transition-colors text-lg"
          >
            Create Investor Account
          </Link>
        </div>
      </section>
    </div>
  );
}
