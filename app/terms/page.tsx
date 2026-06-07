import Link from "next/link";

export const metadata = {
  title: "Terms of Service — PropertyScan",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-navy mb-3">{title}</h2>
      <div className="text-navy/70 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-navy text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
          <p className="text-white/50 text-sm">Last updated: June 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12">

          <Section title="1. About PropertyScan">
            <p>
              PropertyScan is operated by PropertyScan UK Ltd, a company registered in England and Wales. We operate a B2B marketplace connecting verified property sourcers with verified investors.
            </p>
            <p>
              We do not provide financial, investment, or legal advice. Nothing on this platform constitutes a financial promotion as defined under the Financial Services and Markets Act 2000.
            </p>
          </Section>

          <Section title="2. Eligibility">
            <p>By registering on PropertyScan, you confirm that you are:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Aged 18 or over;</li>
              <li>A professional operating in the UK property market (sourcer or investor);</li>
              <li>If registering as an investor, a sophisticated investor or high net worth individual as defined under the Financial Services and Markets Act 2000 (Financial Promotion) Order 2005;</li>
              <li>Able to enter into legally binding contracts under the laws of England and Wales.</li>
            </ul>
          </Section>

          <Section title="3. AML Compliance & Verification">
            <p>
              All users must complete identity verification and anti-money laundering (AML) checks before accessing deal listings or listing deals. We comply with the Money Laundering Regulations 2017.
            </p>
            <p>
              Sourcers must hold relevant qualifications including, where applicable, membership of the Property Redress Scheme (PRS), professional indemnity insurance, and registration with the Information Commissioner&apos;s Office (ICO).
            </p>
            <p>
              We reserve the right to reject or revoke any user&apos;s verification at our sole discretion.
            </p>
          </Section>

          <Section title="4. Sourcer Obligations">
            <p>As a sourcer, you agree to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Only list deals you have the right and authority to market;</li>
              <li>Ensure all information provided is accurate, complete, and not misleading;</li>
              <li>Maintain valid PRS membership, professional indemnity insurance, and ICO registration throughout your use of the platform;</li>
              <li>Pay the platform commission (20% of your sourcing fee + VAT) on all completed transactions;</li>
              <li>Connect a valid Stripe Express account to receive payouts.</li>
            </ul>
          </Section>

          <Section title="5. Investor Obligations">
            <p>As an investor, you agree to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Conduct your own due diligence on all deals before committing to purchase;</li>
              <li>Pay the sourcing fee plus buyer protection fee (5% + VAT) via Stripe on deal completion;</li>
              <li>Not share deal information, deal packs, or sourcer details with third parties;</li>
              <li>Acknowledge that sourcing fees are non-refundable once the deal pack has been accessed.</li>
            </ul>
          </Section>

          <Section title="6. Fees & Payments">
            <p>
              All payments are processed via Stripe. By using the platform you agree to Stripe&apos;s terms of service. PropertyScan is not responsible for payment processing delays, failures, or disputes beyond our reasonable control.
            </p>
            <p>
              A buyer protection fee of 5% of the sourcing fee (+ VAT at 20%) is charged to investors. A commission of 20% of the sourcing fee (+ VAT at 20%) is deducted from sourcer payouts. These fees are subject to change with 30 days&apos; notice.
            </p>
          </Section>

          <Section title="7. Disclaimers">
            <p>
              PropertyScan acts solely as an introduction platform. We make no representations or warranties about the accuracy of deal information, the suitability of any deal, or the financial returns of any investment.
            </p>
            <p>
              Property investment carries risk. The value of property can go down as well as up and you may not get back the amount you invest. Past performance is not indicative of future results.
            </p>
          </Section>

          <Section title="8. Intellectual Property">
            <p>
              All content, trademarks, and data on PropertyScan are the property of PropertyScan UK Ltd or its licensors. You may not reproduce, distribute, or create derivative works without our express written consent.
            </p>
          </Section>

          <Section title="9. Termination">
            <p>
              We may suspend or terminate your account at any time, with or without notice, if we reasonably believe you have breached these terms, failed AML checks, or posed a risk to the platform or its users.
            </p>
          </Section>

          <Section title="10. Governing Law">
            <p>
              These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>
              For any questions regarding these terms, please contact us via our{" "}
              <Link href="/contact" className="text-teal hover:underline">contact page</Link>.
            </p>
          </Section>

        </div>

        <p className="text-center text-xs text-navy/30 mt-8">
          © {new Date().getFullYear()} PropertyScan UK Ltd · Registered in England & Wales
        </p>
      </div>
    </div>
  );
}
