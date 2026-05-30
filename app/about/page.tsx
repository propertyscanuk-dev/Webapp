import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — PropertyScan",
  description:
    "PropertyScan is the UK's first AML-compliant property deal marketplace. Built to bring trust and compliance to the property sourcing industry.",
};

const values = [
  {
    title: "Compliance First",
    body: "Every user — sourcer and investor — is verified before they can transact. AML, PRS, ICO, and identity checks are non-negotiable, not optional.",
  },
  {
    title: "Radical Transparency",
    body: "Every deal shows the full fee structure upfront. No hidden charges, no surprise deductions. What you see is what you pay and what you receive.",
  },
  {
    title: "Trust by Design",
    body: "We built the platform around the assumption that both sides of the market have been burned by bad actors. Our verification process is the product.",
  },
  {
    title: "Fair to Both Sides",
    body: "Sourcers keep 80% of their fee. Investors pay a modest 5% buyer protection fee. We only earn when a deal successfully completes — our incentives are aligned with yours.",
  },
];

const badges = [
  { label: "AML Compliant",   desc: "All users pass Anti-Money Laundering checks",               href: "/compliance/aml" },
  { label: "PRS Aligned",     desc: "All sourcers hold Property Redress Scheme membership",       href: "/compliance/prs" },
  { label: "ICO Registered",  desc: "GDPR-compliant data handling and storage",                   href: "/compliance/ico" },
  { label: "Escrow Protected", desc: "Payments held securely via Stripe until deal completion",   href: "/compliance/escrow" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-navy text-white py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/30 text-teal text-sm font-semibold px-5 py-2 rounded-full mb-10">
            ABOUT PROPERTYSCAN
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-8">
            Built to Fix a<br />
            <span className="text-teal">Broken Market.</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            The UK property sourcing industry has a trust problem. Unverified sourcers, unqualified investors,
            and cash-in-hand deals create risk for everyone. We built PropertyScan to change that.
          </p>
        </div>
      </section>

      {/* The problem */}
      <section className="bg-white py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-8">The Problem We Solve</h2>
            <div className="flex flex-col gap-6 text-navy/70 text-lg leading-relaxed">
              <p>
                Property sourcing in the UK is largely unregulated. Sourcers operate without AML checks, investors
                hand over sourcing fees with no recourse, and deals are done on trust alone.
              </p>
              <p>
                This creates real risk: sourcers who aren&apos;t PRS members, investors who aren&apos;t who they
                say they are, and transactions that have no paper trail.
              </p>
              <p>
                PropertyScan makes compliance the entry ticket. Every sourcer is verified against six compliance
                criteria before they can list a single deal. Every investor passes a five-document verification
                before they can see an address.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {badges.map((b) => (
              <Link key={b.label} href={b.href} className="border border-gray-200 rounded-xl p-6 flex gap-5 items-start hover:border-teal/40 hover:bg-teal/5 transition-colors group">
                <div className="w-6 h-6 rounded-full bg-teal flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-navy mb-1 group-hover:text-teal transition-colors">{b.label}</p>
                  <p className="text-navy/50 text-sm leading-snug">{b.desc}</p>
                </div>
                <span className="text-navy/30 group-hover:text-teal transition-colors text-sm mt-0.5">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our values */}
      <section className="bg-gray-50 border-t border-gray-100 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-6">What We Stand For</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-white border border-gray-200 rounded-2xl p-10">
                <h3 className="text-navy font-bold text-2xl mb-4">{v.title}</h3>
                <p className="text-navy/60 text-lg leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company info */}
      <section className="bg-white border-t border-gray-100 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-8">The Company</h2>
          <div className="flex flex-col gap-6 text-navy/60 text-lg leading-relaxed mb-12">
            <p>
              PropertyScan is built and operated by <strong className="text-navy">PropertyScan UK Ltd</strong>,
              a UK property company focused on compliant deal sourcing and investment.
            </p>
            <p>
              We are registered in England and Wales. PropertyScan operates as an introduction platform
              facilitating transactions between verified property sourcers and verified property investors.
            </p>
            <p>
              We are ICO registered and handle all user data in compliance with the UK GDPR.
            </p>
          </div>

          <div className="inline-flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-navy text-white font-bold px-8 py-4 rounded-xl hover:bg-navy-700 transition-colors"
            >
              Get in Touch
            </Link>
            <Link
              href="/register"
              className="bg-teal text-navy font-bold px-8 py-4 rounded-xl hover:bg-teal-400 transition-colors"
            >
              Join PropertyScan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
