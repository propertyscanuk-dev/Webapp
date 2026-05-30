import Link from "next/link";

const sourcerRequirements = [
  {
    title: "AML Certificate",
    body: "All sourcers must hold a current Anti-Money Laundering certificate from an HMRC-approved training provider. This must be renewed and re-submitted annually.",
  },
  {
    title: "Client Due Diligence (CDD)",
    body: "Sourcers are required to conduct Customer Due Diligence on vendors before listing any property. This includes verifying the vendor's identity and ownership of the asset.",
  },
  {
    title: "Source of Funds",
    body: "Where relevant, sourcers must obtain evidence that the vendor's funds are legitimate and not derived from criminal activity.",
  },
  {
    title: "HMRC Registration",
    body: "Property sourcing agents must be registered with HMRC under the Money Laundering Regulations 2017 (MLR 2017). PropertyScan verifies this registration before approval.",
  },
  {
    title: "Ongoing Monitoring",
    body: "Sourcers are expected to keep records of all due diligence for a minimum of 5 years and cooperate with any compliance requests from PropertyScan or relevant authorities.",
  },
];

const investorRequirements = [
  {
    title: "Photo ID",
    body: "A government-issued photo ID (passport or driving licence) is required to verify your identity in accordance with the MLR 2017 Know Your Customer (KYC) obligations.",
  },
  {
    title: "Proof of Address",
    body: "A utility bill or bank statement dated within the last 3 months confirming your current residential address.",
  },
  {
    title: "Proof of Funds",
    body: "Evidence that you have the financial capacity to complete on deals — for example, a bank statement, mortgage in principle, or investment account statement.",
  },
  {
    title: "Source of Wealth",
    body: "A brief explanation of how your investment funds were accumulated (employment, business income, inheritance, sale of assets, etc.). This is a standard AML requirement for all property transactions.",
  },
  {
    title: "Investor Questionnaire",
    body: "A short questionnaire assessing your experience with property investment, your risk appetite, and your understanding that PropertyScan does not provide regulated financial advice.",
  },
];

const faqs = [
  {
    q: "Why does AML compliance matter in property?",
    a: "Property has historically been exploited for money laundering due to high transaction values and complex ownership structures. UK law requires that anyone facilitating property transactions implements robust checks to prevent this.",
  },
  {
    q: "What legislation governs this?",
    a: "The Money Laundering, Terrorist Financing and Transfer of Funds (Information on the Payer) Regulations 2017 (MLR 2017), the Proceeds of Crime Act 2002 (POCA), and HMRC's guidance for estate agents and property sourcing agents.",
  },
  {
    q: "Is my data stored securely?",
    a: "Yes. All documents are encrypted at rest and in transit via Supabase Storage with row-level security. Only our authorised compliance team can access verification documents.",
  },
  {
    q: "What happens if I can't provide all documents?",
    a: "Verification will be paused until all required documents are submitted. We may ask for alternative documentation if your circumstances make standard documents difficult to obtain — contact us to discuss.",
  },
  {
    q: "How long are records kept?",
    a: "In line with MLR 2017, all verification records are retained for a minimum of 5 years from the end of the business relationship.",
  },
];

export default function AMLPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-navy text-white py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/30 text-teal text-sm font-semibold px-5 py-2 rounded-full mb-10">
            🛡 COMPLIANCE
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-8">
            AML Compliant.<br />
            <span className="text-teal">By Design.</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            PropertyScan is built around Anti-Money Laundering compliance. Every sourcer and investor on the platform has passed our rigorous KYC and AML verification process — before a single deal is listed or accessed.
          </p>
        </div>
      </section>

      {/* What is AML */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl font-bold text-navy mb-6">What is Anti-Money Laundering?</h2>
            <p className="text-navy/70 leading-relaxed mb-4">
              Anti-Money Laundering (AML) is a set of laws, regulations, and procedures designed to prevent criminals from disguising illegally obtained funds as legitimate income. Property is one of the highest-risk sectors for money laundering in the UK.
            </p>
            <p className="text-navy/70 leading-relaxed mb-4">
              Under the Money Laundering Regulations 2017 (MLR 2017), businesses facilitating property transactions — including property sourcers and sourcing platforms — are legally required to implement AML controls, conduct Customer Due Diligence (CDD), and report suspicious activity.
            </p>
            <p className="text-navy/70 leading-relaxed">
              PropertyScan operates in full compliance with MLR 2017 and HMRC guidance for the property sector. We do not allow any user — sourcer or investor — to transact on the platform without completing our verification process.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-navy mb-6">Regulatory Framework</h3>
            <div className="space-y-4">
              {[
                { label: "MLR 2017", desc: "Money Laundering Regulations 2017 — the primary AML legislation for UK businesses" },
                { label: "POCA 2002", desc: "Proceeds of Crime Act — criminalises money laundering and requires suspicious activity reporting" },
                { label: "HMRC", desc: "PropertyScan and all registered sourcers comply with HMRC's AML supervision guidance for estate agents" },
                { label: "FATF", desc: "Financial Action Task Force standards — international AML best practice adopted by the UK" },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <span className="shrink-0 w-20 text-xs font-bold text-teal bg-teal/10 rounded-lg px-2 py-1 h-fit text-center">{item.label}</span>
                  <p className="text-sm text-navy/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sourcer Requirements */}
      <section className="bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-navy/5 border border-navy/10 text-navy text-sm font-semibold px-5 py-2 rounded-full mb-6">
              FOR SOURCERS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">What We Require from Sourcers</h2>
            <p className="text-navy/60 max-w-2xl mx-auto">
              Every sourcer must meet our AML compliance checklist before their account is approved and any deals go live on the marketplace.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sourcerRequirements.map((req) => (
              <div key={req.title} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-8 h-8 bg-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-teal text-lg">🛡</span>
                </div>
                <h3 className="font-bold text-navy mb-2">{req.title}</h3>
                <p className="text-navy/60 leading-relaxed">{req.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/register?role=sourcer"
              className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-8 py-4 rounded-xl hover:bg-navy/90 transition-colors"
            >
              Register as a Sourcer →
            </Link>
          </div>
        </div>
      </section>

      {/* Investor Requirements */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/30 text-teal text-sm font-semibold px-5 py-2 rounded-full mb-6">
              FOR INVESTORS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">What We Require from Investors</h2>
            <p className="text-navy/60 max-w-2xl mx-auto">
              Investors must complete our Know Your Customer (KYC) process before accessing full deal details, deal packs, or completing any transactions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investorRequirements.map((req) => (
              <div key={req.title} className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <div className="w-8 h-8 bg-navy/5 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-navy text-lg">✓</span>
                </div>
                <h3 className="font-bold text-navy mb-2">{req.title}</h3>
                <p className="text-navy/60 leading-relaxed">{req.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/register?role=investor"
              className="inline-flex items-center gap-2 bg-teal text-navy font-semibold px-8 py-4 rounded-xl hover:bg-teal-400 transition-colors"
            >
              Register as an Investor →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-navy text-center mb-12">Common Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl border border-gray-200 p-6">
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
            Ready to join a compliant marketplace?
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            Every user on PropertyScan has passed AML verification. It&apos;s what makes the platform trustworthy for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=investor" className="bg-teal text-navy font-bold px-8 py-4 rounded-xl hover:bg-teal-400 transition-colors">
              Join as an Investor
            </Link>
            <Link href="/register?role=sourcer" className="bg-white/10 border border-white/25 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors">
              Join as a Sourcer
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-navy/95 py-6 px-4 text-center">
        <p className="text-white/30 text-xs max-w-3xl mx-auto">
          PropertyScan is an AML-compliant deal marketplace facilitating introductions between verified property professionals. This page is for information purposes only and does not constitute legal or financial advice.
        </p>
      </div>
    </div>
  );
}
