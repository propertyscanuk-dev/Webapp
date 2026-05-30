import Link from "next/link";
import type { Metadata } from "next";
import DealPreviewCard, { type SampleDeal } from "@/components/DealPreviewCard";
import SourcerTutorial from "@/components/SourcerTutorial";

const sampleListing: SampleDeal = {
  type: "BTL",
  title: "3-bed mid-terrace, Levenshulme",
  location: "Manchester · M19",
  photo: "https://images.unsplash.com/photo-1582407947304-fd86f28f9f3e?w=800&q=80&auto=format&fit=crop",
  askingPrice: "£145,000",
  sourcingFee: "£3,500",
  grossYield: "8.2%",
  bmv: "18%",
  monthlyRent: "£995/mo",
};

export const metadata: Metadata = {
  title: "For Sourcers — PropertyScan",
  description:
    "List your packaged property deals to a network of verified, AML-compliant investors. Get paid via Stripe Connect with no cold outreach.",
};

const steps = [
  {
    step: "01",
    title: "Register & Verify",
    body: "Create your sourcer account and submit your compliance documents. We verify your AML certificate, PRS membership, PI insurance, photo ID, proof of address, and ICO registration.",
  },
  {
    step: "02",
    title: "Upload Your Deal Pack",
    body: "List your deal with full property details — asking price, sourcing fee, gross yield, ROI, BMV, monthly rent, and a deal pack PDF. Takes around 10 minutes per deal.",
  },
  {
    step: "03",
    title: "Investors Browse & Enquire",
    body: "Verified, qualified investors discover your deal on the marketplace. You receive a notification when an investor reserves a deal.",
  },
  {
    step: "04",
    title: "Get Paid via Stripe Connect",
    body: "Once the deal completes, Stripe Connect handles the full payment flow. Your 80% net proceeds are paid out instantly — no chasing invoices.",
  },
];

const docs = [
  { label: "Photo ID", detail: "Passport or driving licence" },
  { label: "Proof of Address", detail: "Utility bill or bank statement dated within 3 months" },
  { label: "AML Certificate", detail: "Current Anti-Money Laundering compliance certificate" },
  { label: "PRS Membership", detail: "Property Redress Scheme membership certificate" },
  { label: "PI Insurance", detail: "Professional indemnity insurance schedule" },
  { label: "ICO Registration", detail: "Information Commissioner's Office registration number" },
];

const faqs = [
  {
    q: "How much does it cost to list a deal?",
    a: "Nothing upfront. PropertyScan charges a 20% commission on the sourcing fee only when a deal successfully completes. If a deal doesn't sell, you pay nothing.",
  },
  {
    q: "How long does verification take?",
    a: "Most accounts are reviewed within 1 business day of submitting all required documents. You'll receive an email confirmation once approved.",
  },
  {
    q: "Can I list multiple deals at the same time?",
    a: "Yes. Once verified, you can list as many active deals as you like with no additional fees.",
  },
  {
    q: "What deal types are supported?",
    a: "Buy-to-Let (BTL), HMO, BRRR, and Flip deals are all supported on the marketplace.",
  },
  {
    q: "When do I receive my payout?",
    a: "Stripe Connect releases your net proceeds (sourcing fee minus 20% commission) as soon as the platform confirms payment from the investor. Standard Stripe payout times apply — typically 2–3 business days to your bank.",
  },
];

export default function SourcersPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-navy text-white py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/30 text-teal text-sm font-semibold px-5 py-2 rounded-full mb-10">
            FOR SOURCERS
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-8">
            Sell Deals Faster.<br />
            <span className="text-teal">No Cold Outreach.</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-12">
            List your fully packaged property deals to a network of verified, qualified investors.
            No chasing leads. No unqualified buyers. Just compliant transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?role=sourcer"
              className="bg-teal text-navy font-bold px-10 py-5 rounded-xl hover:bg-teal-400 transition-colors text-base sm:text-lg"
            >
              Register as a Sourcer
            </Link>
            <Link
              href="#how-it-works"
              className="bg-white/10 border border-white/25 text-white font-bold px-10 py-5 rounded-xl hover:bg-white/20 transition-colors text-base sm:text-lg"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Fee callout */}
      <section className="bg-teal py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left">
          <div>
            <p className="text-4xl font-bold text-navy">20%</p>
            <p className="text-navy/70 text-sm mt-1">Commission on sourcing fee<br />only when a deal completes</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-navy/20" />
          <div>
            <p className="text-4xl font-bold text-navy">£0</p>
            <p className="text-navy/70 text-sm mt-1">Upfront cost to list<br />or to join</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-navy/20" />
          <div>
            <p className="text-4xl font-bold text-navy">Instant</p>
            <p className="text-navy/70 text-sm mt-1">Stripe Connect payout<br />on deal completion</p>
          </div>
        </div>
      </section>

      {/* How it works — interactive tutorial */}
      <section id="how-it-works" className="bg-white py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-6">How It Works</h2>
            <p className="text-navy/60 text-xl max-w-xl mx-auto leading-relaxed">
              From registration to payout — walk through each step of the sourcer journey.
            </p>
          </div>
          <SourcerTutorial />
        </div>
      </section>

      {/* Deal preview */}
      <section className="bg-gray-50 border-t border-gray-100 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-6">
              Your Deal Goes Live Looking Like This
            </h2>
            <p className="text-navy/60 text-xl leading-relaxed mb-8">
              Once you&apos;re verified and your deal is submitted, it appears on the investor marketplace immediately — fully formatted with all your metrics displayed.
            </p>
            <Link
              href="/register?role=sourcer"
              className="inline-block bg-teal text-navy font-bold px-8 py-4 rounded-xl hover:bg-teal-400 transition-colors"
            >
              Start Listing Deals →
            </Link>
          </div>

          <div>
            <p className="text-xs font-bold text-navy/30 uppercase tracking-widest mb-4">Example Listing</p>
            <DealPreviewCard deal={sampleListing} />
            <p className="text-navy/30 text-xs mt-3 text-center">
              Sample deal shown for illustration only.
            </p>
          </div>
        </div>
      </section>

      {/* Verification docs */}
      <section className="bg-gray-50 border-t border-gray-100 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-6">Verification Requirements</h2>
            <p className="text-navy/60 text-xl max-w-xl mx-auto leading-relaxed">
              We verify every sourcer before they can list. This protects your reputation and gives investors the confidence to transact.
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

          <p className="text-center text-navy/40 text-sm mt-10">
            Verification is reviewed by our compliance team within 1 business day.
          </p>
        </div>
      </section>

      {/* Fee breakdown */}
      <section className="bg-white border-t border-gray-100 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-6">Fee Breakdown</h2>
            <p className="text-navy/60 text-xl leading-relaxed">
              A worked example on a £5,000 sourcing fee.
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-navy text-white px-8 py-5 flex justify-between text-sm font-semibold">
              <span>Item</span>
              <span>Amount</span>
            </div>
            {[
              { label: "Your sourcing fee", value: "£5,000" },
              { label: "PropertyScan commission (20%)", value: "−£1,000" },
              { label: "VAT on commission (20%)", value: "−£200" },
              { label: "You receive (net)", value: "£3,800", highlight: true },
            ].map((row) => (
              <div
                key={row.label}
                className={`px-8 py-5 flex justify-between items-center border-t border-gray-100 ${row.highlight ? "bg-teal/5" : ""}`}
              >
                <span className={`text-sm ${row.highlight ? "font-bold text-navy" : "text-navy/70"}`}>{row.label}</span>
                <span className={`text-sm font-bold ${row.highlight ? "text-teal text-lg" : "text-navy"}`}>{row.value}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-navy/40 text-xs mt-6">
            The investor pays £5,250 — your £5,000 fee plus a 5% buyer protection fee (£250), charged directly by PropertyScan. That charge does not affect your payout.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 border-t border-gray-100 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-6">Common Questions</h2>
          </div>

          <div className="flex flex-col gap-5">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white border border-gray-200 rounded-xl px-8 py-7">
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
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Ready to list your first deal?</h2>
          <p className="text-white/60 text-xl mb-10 leading-relaxed">
            Join verified sourcers already using PropertyScan to reach qualified investors without the cold outreach.
          </p>
          <Link
            href="/register?role=sourcer"
            className="inline-block bg-teal text-navy font-bold px-12 py-5 rounded-xl hover:bg-teal-400 transition-colors text-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
