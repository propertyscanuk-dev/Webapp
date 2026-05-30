import Link from "next/link";

const whatPRSDoes = [
  {
    title: "Independent Dispute Resolution",
    body: "If an investor has a complaint against a sourcer that cannot be resolved directly, they can escalate it to the PRS for a free, independent resolution — including potential compensation awards up to £25,000.",
  },
  {
    title: "Mandatory for Sourcing Agents",
    body: "Since 2014, all property sourcing agents operating in England are legally required to belong to a government-approved redress scheme. Operating without membership is a criminal offence.",
  },
  {
    title: "Code of Practice",
    body: "PRS members must adhere to a code of practice covering transparency, fair dealing, and professional conduct. Serious breaches can result in removal from the scheme.",
  },
  {
    title: "No Hidden Charges",
    body: "PRS membership requires sourcers to be transparent about all fees and charges upfront. Investors can have confidence that the sourcing fee shown on the platform is the full amount.",
  },
];

const sourcerBenefits = [
  {
    title: "Credibility Signal",
    body: "PRS membership demonstrates professionalism and regulatory compliance — making your listings more attractive to sophisticated investors.",
  },
  {
    title: "Legal Requirement",
    body: "You cannot legally operate as a property sourcing agent in England without redress scheme membership. PropertyScan requires proof of current membership before approval.",
  },
  {
    title: "Client Confidence",
    body: "Investors know that if they have a genuine grievance, there is a formal resolution process available. This reduces friction and builds trust in your listings.",
  },
  {
    title: "Professional Network",
    body: "PRS membership connects you to a community of compliant property professionals and signals that you take your legal and ethical obligations seriously.",
  },
];

const investorBenefits = [
  {
    title: "Guaranteed Recourse",
    body: "Every sourcer on PropertyScan holds PRS membership, meaning you always have a formal complaints pathway — independent of PropertyScan — if something goes wrong.",
  },
  {
    title: "Compensation Protection",
    body: "In the event of a valid complaint, the PRS can award compensation of up to £25,000. This is in addition to any refund processes via Stripe.",
  },
  {
    title: "Regulatory Assurance",
    body: "PRS membership means sourcers are operating legally. Dealing with unregistered sourcers outside the platform carries significant risk — on PropertyScan, that risk is eliminated.",
  },
  {
    title: "Pre-Verified",
    body: "You don't need to verify a sourcer's PRS status yourself. PropertyScan checks current membership at the point of verification and re-checks periodically.",
  },
];

const faqs = [
  {
    q: "What is the Property Redress Scheme (PRS)?",
    a: "The PRS is a government-approved independent redress scheme for property agents in England. It allows consumers to escalate complaints that haven't been resolved directly with the agent, providing free, impartial dispute resolution.",
  },
  {
    q: "Is PRS membership mandatory?",
    a: "Yes. Under the Redress Schemes for Lettings Agency Work and Property Management Work (Requirement to Belong to a Scheme) (England) Order 2014, all property sourcing agents operating in England must belong to an approved redress scheme. Failure to comply is a criminal offence carrying fines of up to £5,000.",
  },
  {
    q: "What happens if a sourcer's PRS membership lapses?",
    a: "If we become aware that a sourcer's PRS membership has lapsed, their account and listings are immediately suspended until valid membership is reconfirmed. They will be notified to re-submit documentation.",
  },
  {
    q: "How do I make a complaint against a sourcer?",
    a: "First, raise it directly with the sourcer via the PropertyScan messaging system. If unresolved, you may escalate to the PRS directly at theprs.co.uk. You can also contact PropertyScan's support team who can assist with the process.",
  },
  {
    q: "Does PropertyScan itself belong to a redress scheme?",
    a: "PropertyScan operates as an introduction platform, not a property agent. Complaints about our platform can be submitted via our contact form. For complaints about specific sourcers, the PRS provides independent resolution.",
  },
];

export default function PRSPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-navy text-white py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/30 text-teal text-sm font-semibold px-5 py-2 rounded-full mb-10">
            🏠 COMPLIANCE
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-8">
            PRS Aligned.<br />
            <span className="text-teal">Every Sourcer.</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Every sourcer on PropertyScan holds current membership of the Property Redress Scheme — the government-approved independent redress scheme mandatory for all property sourcing agents in England.
          </p>
        </div>
      </section>

      {/* What is PRS */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl font-bold text-navy mb-6">What is the Property Redress Scheme?</h2>
            <p className="text-navy/70 leading-relaxed mb-4">
              The Property Redress Scheme (PRS) is a government-approved independent dispute resolution service for property agents in England. It was established under the Enterprise and Regulatory Reform Act 2013 and became mandatory for property sourcing agents in 2014.
            </p>
            <p className="text-navy/70 leading-relaxed mb-4">
              The PRS provides consumers with access to a free, impartial complaints resolution service when disputes with property agents cannot be resolved directly. It operates independently of both the consumer and the agent, ensuring fair outcomes.
            </p>
            <p className="text-navy/70 leading-relaxed">
              PropertyScan requires proof of current PRS membership from every sourcer before their account is approved. This is not optional — it is a fundamental condition of listing on our platform.
            </p>
          </div>
          <div className="space-y-4">
            {whatPRSDoes.map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-navy/60 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sourcer Benefits */}
      <section className="bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-navy/5 border border-navy/10 text-navy text-sm font-semibold px-5 py-2 rounded-full mb-6">
              FOR SOURCERS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Why PRS Membership Benefits You</h2>
            <p className="text-navy/60 max-w-2xl mx-auto">
              PRS membership isn&apos;t just a legal requirement — it&apos;s a competitive advantage that signals professionalism to every investor on the platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {sourcerBenefits.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-navy mb-2">{b.title}</h3>
                <p className="text-navy/60 leading-relaxed">{b.body}</p>
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

      {/* Investor Benefits */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/30 text-teal text-sm font-semibold px-5 py-2 rounded-full mb-6">
              FOR INVESTORS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">How PRS Protects You</h2>
            <p className="text-navy/60 max-w-2xl mx-auto">
              When you transact with a sourcer on PropertyScan, you have the backing of the PRS dispute resolution framework — independent of our platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {investorBenefits.map((b) => (
              <div key={b.title} className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-navy mb-2">{b.title}</h3>
                <p className="text-navy/60 leading-relaxed">{b.body}</p>
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
            Every sourcer. Fully verified.
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            No unregistered agents. No guesswork. PropertyScan checks PRS membership on every sourcer before a single deal goes live.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=investor" className="bg-teal text-navy font-bold px-8 py-4 rounded-xl hover:bg-teal-400 transition-colors">
              Browse Verified Deals
            </Link>
            <Link href="/register?role=sourcer" className="bg-white/10 border border-white/25 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors">
              List Your Deals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
