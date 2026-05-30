import Link from "next/link";

const dataWeCollect = [
  {
    category: "Identity Documents",
    who: "Both",
    details: "Photo ID, proof of address, and for investors: proof of funds and source of wealth. Stored encrypted, accessed only by our compliance team.",
    retention: "5 years (MLR 2017)",
  },
  {
    category: "Account Information",
    who: "Both",
    details: "Name, email address, company name (sourcers), role, and verification status. Used to operate your account and communicate with you.",
    retention: "Duration of account + 2 years",
  },
  {
    category: "Deal Data",
    who: "Sourcers",
    details: "Property details, photos, deal pack PDFs, asking price, sourcing fee, yield, ROI, and BMV figures submitted when listing a deal.",
    retention: "Duration of listing + 2 years",
  },
  {
    category: "Transaction Records",
    who: "Both",
    details: "Payment amounts, Stripe payment intent IDs, transfer IDs, sourcing fees, and fee breakdowns. Required for financial record-keeping and AML compliance.",
    retention: "5 years (MLR 2017)",
  },
  {
    category: "Messages",
    who: "Both",
    details: "Messages exchanged between sourcers and investors via the platform messaging system. Monitored for compliance (contact detail sharing is blocked).",
    retention: "2 years",
  },
  {
    category: "Technical Data",
    who: "Both",
    details: "IP address, browser type, and page visit logs collected automatically via Supabase. Used for security monitoring and fraud prevention.",
    retention: "90 days",
  },
];

const yourRights = [
  {
    right: "Right of Access",
    desc: "You can request a copy of all personal data we hold about you at any time. We will respond within 30 days.",
  },
  {
    right: "Right to Rectification",
    desc: "If any data we hold is inaccurate or incomplete, you can request it be corrected. Contact us and we will update it promptly.",
  },
  {
    right: "Right to Erasure",
    desc: "You can request deletion of your personal data where we no longer have a lawful basis to hold it. Note: data subject to AML retention requirements (5 years) cannot be deleted before that period expires.",
  },
  {
    right: "Right to Portability",
    desc: "You can request your personal data in a commonly used, machine-readable format to transfer to another service.",
  },
  {
    right: "Right to Object",
    desc: "You can object to processing of your data for direct marketing at any time. We will cease that processing immediately.",
  },
  {
    right: "Right to Restrict Processing",
    desc: "In certain circumstances you can request that we restrict processing of your data while a complaint or correction is being addressed.",
  },
];

const processors = [
  { name: "Supabase", role: "Database, authentication, and file storage", location: "EU / US (SCCs in place)" },
  { name: "Stripe", role: "Payment processing and Stripe Connect payouts", location: "US (SCCs in place)" },
  { name: "Resend", role: "Transactional email delivery", location: "US (SCCs in place)" },
  { name: "Vercel", role: "Application hosting and CDN", location: "US (SCCs in place)" },
];

const faqs = [
  {
    q: "What is the ICO and why does registration matter?",
    a: "The Information Commissioner's Office (ICO) is the UK's independent authority for data protection and privacy. Any organisation that processes personal data in the UK must be registered with the ICO under the Data Protection Act 2018. Operating without registration when required is a criminal offence.",
  },
  {
    q: "Is PropertyScan GDPR compliant?",
    a: "Yes. The UK GDPR (as retained and amended by the Data Protection Act 2018) applies to all personal data we process. We have a lawful basis for every category of data we collect, maintain a data processing register, and have Data Processing Agreements in place with all third-party processors.",
  },
  {
    q: "Are my verification documents safe?",
    a: "All documents are stored in Supabase Storage with row-level security (RLS), meaning no user can access another user's documents. Only authorised members of our compliance team can view verification documents. Documents are encrypted at rest and in transit.",
  },
  {
    q: "Can I withdraw consent?",
    a: "Where we rely on consent as our lawful basis, you can withdraw it at any time. Note that for some processing (such as AML record-keeping), we have a legal obligation that overrides withdrawal of consent — we will always be transparent about which basis applies.",
  },
  {
    q: "How do I make a data subject request or complaint?",
    a: "Email us at privacy@propertyscan.uk with your request. We will acknowledge within 5 working days and respond in full within 30 days. If you are unsatisfied with our response, you can escalate to the ICO at ico.org.uk.",
  },
];

export default function ICOPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-navy text-white py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/30 text-teal text-sm font-semibold px-5 py-2 rounded-full mb-10">
            🔒 DATA PROTECTION
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-8">
            ICO Registered.<br />
            <span className="text-teal">GDPR Compliant.</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            PropertyScan is registered with the Information Commissioner&apos;s Office and operates in full compliance with the UK GDPR and Data Protection Act 2018. Your personal data is never sold, never shared unnecessarily, and always protected.
          </p>
        </div>
      </section>

      {/* What data we collect */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">What Data We Collect and Why</h2>
            <p className="text-navy/60 max-w-2xl mx-auto">
              We only collect data that is necessary for operating a compliant property deal marketplace. Here is a full breakdown of every category of personal data we process.
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-4 font-semibold text-navy/60 text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-4 font-semibold text-navy/60 text-xs uppercase tracking-wider">Who</th>
                  <th className="text-left px-6 py-4 font-semibold text-navy/60 text-xs uppercase tracking-wider">Purpose</th>
                  <th className="text-left px-6 py-4 font-semibold text-navy/60 text-xs uppercase tracking-wider whitespace-nowrap">Retention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dataWeCollect.map((row) => (
                  <tr key={row.category} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-navy whitespace-nowrap">{row.category}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${row.who === "Both" ? "bg-teal/10 text-teal" : "bg-navy/5 text-navy/60"}`}>
                        {row.who}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-navy/60 leading-relaxed">{row.details}</td>
                    <td className="px-6 py-4 text-navy/60 whitespace-nowrap text-xs">{row.retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Third party processors */}
      <section className="bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy mb-4">Third-Party Data Processors</h2>
            <p className="text-navy/60 max-w-2xl mx-auto">
              We use the following sub-processors to operate PropertyScan. We have Data Processing Agreements in place with each. Standard Contractual Clauses (SCCs) govern any transfers outside the UK.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {processors.map((p) => (
              <div key={p.name} className="bg-white rounded-2xl border border-gray-200 p-6 flex gap-4 items-start">
                <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-teal font-bold text-sm">{p.name[0]}</span>
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1">{p.name}</h3>
                  <p className="text-navy/60 mb-1">{p.role}</p>
                  <p className="text-xs text-navy/40">📍 {p.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your rights */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/30 text-teal text-sm font-semibold px-5 py-2 rounded-full mb-6">
              YOUR RIGHTS UNDER UK GDPR
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">You Are in Control</h2>
            <p className="text-navy/60 max-w-2xl mx-auto">
              Under the UK GDPR, you have the following rights over your personal data. We take these seriously and will always respond promptly.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yourRights.map((r) => (
              <div key={r.right} className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <div className="w-8 h-8 bg-teal/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-teal font-bold text-sm">✓</span>
                </div>
                <h3 className="font-bold text-navy mb-2">{r.right}</h3>
                <p className="text-navy/60 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-navy/40 text-sm mt-8">
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:privacy@propertyscan.uk" className="text-teal hover:underline">
              privacy@propertyscan.uk
            </a>
          </p>
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
          <div className="mt-8 text-center">
            <Link href="/privacy" className="text-teal font-semibold hover:underline text-sm">
              Read our full Privacy Policy →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your data. Protected properly.
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            We are registered with the ICO, GDPR compliant, and handle your personal data with the care it deserves.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=investor" className="bg-teal text-navy font-bold px-8 py-4 rounded-xl hover:bg-teal-400 transition-colors">
              Join as an Investor
            </Link>
            <Link href="/privacy" className="bg-white/10 border border-white/25 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors">
              Read Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
