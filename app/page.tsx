import Link from "next/link";
import DealPreviewCard, { type SampleDeal } from "@/components/DealPreviewCard";

const sampleDeals: SampleDeal[] = [
  {
    type: "BTL",
    title: "3-bed mid-terrace, Levenshulme",
    location: "Manchester · M19",
    photo: "https://images.unsplash.com/photo-1582407947304-fd86f28f9f3e?w=800&q=80&auto=format&fit=crop",
    askingPrice: "£145,000",
    sourcingFee: "£3,500",
    grossYield: "8.2%",
    bmv: "18%",
    monthlyRent: "£995/mo",
  },
  {
    type: "HMO",
    title: "5-bed HMO, Headingley",
    location: "Leeds · LS6",
    photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&auto=format&fit=crop",
    askingPrice: "£280,000",
    sourcingFee: "£6,500",
    grossYield: "11.4%",
    bmv: "12%",
    monthlyRent: "£2,650/mo",
  },
  {
    type: "BRRR",
    title: "2-bed refurb opportunity, Erdington",
    location: "Birmingham · B23",
    photo: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80&auto=format&fit=crop",
    askingPrice: "£85,000",
    sourcingFee: "£4,000",
    roi: "31%",
    bmv: "24%",
  },
];

const badges = [
  { label: "AML Compliant", icon: "🛡" },
  { label: "PRS Aligned", icon: "🏠" },
  { label: "ICO Registered", icon: "🔒" },
  { label: "FCA Aligned", icon: "✓" },
];

const sourcerSteps = [
  {
    step: "01",
    title: "Get Verified",
    description:
      "Submit your AML certificate, PRS membership, PI insurance, ICO registration, photo ID, and proof of address. Reviewed within 1 business day.",
  },
  {
    step: "02",
    title: "List Your Deal",
    description:
      "Upload your deal pack — asking price, sourcing fee, yield, ROI, BMV, and a PDF. Your listing goes live to all verified investors.",
  },
  {
    step: "03",
    title: "Get Paid via Stripe",
    description:
      "Investor reserves the deal. Stripe Connect handles payment. You receive 80% of your sourcing fee on completion — no chasing invoices.",
  },
];

const investorSteps = [
  {
    step: "01",
    title: "Verify Your Identity",
    description:
      "Submit photo ID, proof of address, proof of funds, source of wealth, and a short investor questionnaire. Reviewed within 1 business day.",
  },
  {
    step: "02",
    title: "Browse the Marketplace",
    description:
      "Filter BTL, HMO, BRRR, and flip deals by location, yield, ROI, and BMV. Download full deal pack PDFs from verified sourcers.",
  },
  {
    step: "03",
    title: "Reserve & Complete",
    description:
      "Reserve your chosen deal via Stripe. Funds are held securely while you conduct due diligence. Release payment when you're ready to proceed.",
  },
];

const stats = [
  { value: "£0", label: "Upfront cost to join" },
  { value: "5%", label: "Investor platform fee" },
  { value: "20%", label: "Sourcer commission" },
  { value: "100%", label: "Verified users only" },
];

const footerNav = [
  {
    heading: "Platform",
    links: [
      { label: "For Sourcers", href: "/sourcers" },
      { label: "For Investors", href: "/investors" },
      { label: "Browse Deals", href: "/deals" },
      { label: "How It Works", href: "/#how-it-works" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log In", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
];

const LogoIcon = () => (
  <svg viewBox="0 0 40 36" className="w-7 h-6 text-teal" fill="none" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
    <path d="M3 15v19h22V15" strokeWidth="2" />
    <path d="M1 15L14 2l13 13" strokeWidth="2" />
    <rect x="9" y="19" width="8" height="8" strokeWidth="1.5" />
    <line x1="13" y1="19" x2="13" y2="27" strokeWidth="1.5" />
    <line x1="9" y1="23" x2="17" y2="23" strokeWidth="1.5" />
    <circle cx="30" cy="22" r="7" strokeWidth="2" />
    <line x1="35.5" y1="27.5" x2="39" y2="31" strokeWidth="2.5" />
  </svg>
);

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="bg-navy text-white min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center w-full py-24">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {badges.map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-2 text-sm font-semibold bg-white/10 border border-white/25 text-teal rounded-full px-5 py-2"
              >
                <span className="text-base">{b.icon}</span>
                {b.label}
              </span>
            ))}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight mb-8">
            Verified Deals.{" "}
            <span className="text-teal">Verified Investors.</span>
          </h1>

          <p className="text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            The UK&apos;s first AML-compliant property deal marketplace.
            Off-market BTL, HMO, BRRR and flip deals — from fully verified
            sourcers to qualified investors only.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?role=investor"
              className="bg-teal text-navy font-bold px-10 py-5 rounded-xl hover:bg-teal-400 transition-colors text-base sm:text-lg"
            >
              Find Deals as an Investor
            </Link>
            <Link
              href="/register?role=sourcer"
              className="bg-white/10 border border-white/25 text-white font-bold px-10 py-5 rounded-xl hover:bg-white/20 transition-colors text-base sm:text-lg"
            >
              List Deals as a Sourcer
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────────── */}
      <section className="bg-navy-800 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-bold text-teal">{s.value}</p>
              <p className="text-sm sm:text-base text-white/60 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-white py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold text-navy mb-6">
              How PropertyScan Works
            </h2>
            <p className="text-navy/60 text-xl max-w-2xl mx-auto leading-relaxed">
              A compliant, transparent marketplace built around trust.
              Every user verified before they transact.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Sourcer journey */}
            <div>
              <div className="inline-flex items-center gap-2 bg-teal/10 text-teal text-sm font-semibold px-4 py-1.5 rounded-full mb-8">
                FOR SOURCERS
              </div>
              <div className="flex flex-col gap-6">
                {sourcerSteps.map((item) => (
                  <div key={item.step} className="flex gap-6">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
                      <span className="text-teal font-bold text-sm">{item.step}</span>
                    </div>
                    <div className="pt-1">
                      <h3 className="text-navy font-bold text-xl mb-2">{item.title}</h3>
                      <p className="text-navy/60 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-2">
                  <Link
                    href="/sourcers"
                    className="inline-flex items-center gap-1 text-teal font-semibold text-sm hover:text-teal-400 transition-colors"
                  >
                    Learn more about listing deals →
                  </Link>
                </div>
              </div>
            </div>

            {/* Investor journey */}
            <div>
              <div className="inline-flex items-center gap-2 bg-navy/5 text-navy text-sm font-semibold px-4 py-1.5 rounded-full mb-8">
                FOR INVESTORS
              </div>
              <div className="flex flex-col gap-6">
                {investorSteps.map((item) => (
                  <div key={item.step} className="flex gap-6">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center">
                      <span className="text-navy font-bold text-sm">{item.step}</span>
                    </div>
                    <div className="pt-1">
                      <h3 className="text-navy font-bold text-xl mb-2">{item.title}</h3>
                      <p className="text-navy/60 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-2">
                  <Link
                    href="/investors"
                    className="inline-flex items-center gap-1 text-navy font-semibold text-sm hover:text-teal transition-colors"
                  >
                    Learn more about finding deals →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Deal preview ───────────────────────────────────────────── */}
      <section className="bg-gray-50 border-t border-gray-100 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-6">
              What Deals Look Like
            </h2>
            <p className="text-navy/60 text-xl max-w-2xl mx-auto leading-relaxed">
              Every listing is fully packaged by a verified sourcer — location, financials, yield, and a downloadable deal pack.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {sampleDeals.map((deal) => (
              <DealPreviewCard key={deal.title} deal={deal} />
            ))}
          </div>

          <p className="text-center text-navy/30 text-xs">
            Sample deals shown for illustration. Real listings visible to verified investors only.
          </p>
        </div>
      </section>

      {/* ── Dual CTA ───────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-t border-gray-100 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 gap-8">
          {/* Investor CTA */}
          <div className="bg-white border border-gray-200 rounded-2xl p-10">
            <div className="inline-flex items-center gap-2 bg-teal/10 text-teal text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              FOR INVESTORS
            </div>
            <h3 className="text-navy font-bold text-3xl mb-4">
              Access Off-Market Deals
            </h3>
            <p className="text-navy/60 leading-relaxed mb-8">
              Browse fully packaged BTL, HMO, BRRR and flip deals from
              AML-verified sourcers. Every deal includes ROI, yield, BMV, and
              a full deal pack PDF.
            </p>
            <Link
              href="/investors"
              className="inline-block text-sm text-teal font-semibold hover:text-teal-400 transition-colors mb-6"
            >
              See how it works for investors →
            </Link>
            <div>
              <Link
                href="/register?role=investor"
                className="inline-block bg-navy text-white font-bold px-8 py-4 rounded-xl hover:bg-navy-700 transition-colors text-base"
              >
                Register as Investor →
              </Link>
            </div>
          </div>

          {/* Sourcer CTA */}
          <div className="bg-navy border border-navy-700 rounded-2xl p-10">
            <div className="inline-flex items-center gap-2 bg-teal/20 text-teal text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              FOR SOURCERS
            </div>
            <h3 className="text-white font-bold text-3xl mb-4">
              Sell Deals Faster
            </h3>
            <p className="text-white/60 leading-relaxed mb-8">
              List your packaged deals to a network of verified, qualified
              investors. Get paid via Stripe Connect with instant payout
              options. No cold outreach needed.
            </p>
            <Link
              href="/sourcers"
              className="inline-block text-sm text-teal font-semibold hover:text-teal-400 transition-colors mb-6"
            >
              See how it works for sourcers →
            </Link>
            <div>
              <Link
                href="/register?role=sourcer"
                className="inline-block bg-teal text-navy font-bold px-8 py-4 rounded-xl hover:bg-teal-400 transition-colors text-base"
              >
                Register as Sourcer →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-navy border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <LogoIcon />
                <span className="text-teal font-bold text-lg">
                  Property<span className="text-white">Scan</span>
                </span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                The UK&apos;s first AML-compliant property deal marketplace. Connecting verified sourcers with qualified investors.
              </p>
            </div>

            {/* Nav columns */}
            {footerNav.map((col) => (
              <div key={col.heading}>
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-5">{col.heading}</p>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-white/30 text-xs">
              © 2026 O&apos;Gorman Property Group Ltd · Registered in England and Wales
            </p>
            <p className="text-white/20 text-xs max-w-md">
              PropertyScan is not authorised by the FCA. We are an AML-compliant deal marketplace facilitating introductions between verified professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
