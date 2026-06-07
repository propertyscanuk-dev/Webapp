import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — PropertyScan",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-navy mb-3">{title}</h2>
      <div className="text-navy/70 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-navy text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-white/50 text-sm">Last updated: June 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12">

          <Section title="1. Who We Are">
            <p>
              PropertyScan is operated by PropertyScan UK Ltd (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), a company registered in England and Wales. We are the data controller for the personal data collected through this platform.
            </p>
            <p>
              We are registered with the Information Commissioner&apos;s Office (ICO) as required under UK data protection law.
            </p>
          </Section>

          <Section title="2. What Data We Collect">
            <p>We collect and process the following categories of personal data:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Identity data:</strong> full name, date of birth, company name;</li>
              <li><strong>Contact data:</strong> email address, phone number;</li>
              <li><strong>Verification data:</strong> government-issued photo ID, proof of address, proof of funds, professional qualifications (AML certificate, PRS membership, PI insurance, ICO registration);</li>
              <li><strong>Financial data:</strong> sourcing fee amounts, transaction records, Stripe account identifiers;</li>
              <li><strong>Usage data:</strong> login activity, page views, deal interactions;</li>
              <li><strong>Communications:</strong> messages sent through the platform.</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Data">
            <p>We process your personal data for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>To verify your identity and comply with Anti-Money Laundering (AML) obligations under the Money Laundering Regulations 2017;</li>
              <li>To operate and maintain your account on the platform;</li>
              <li>To facilitate transactions between sourcers and investors;</li>
              <li>To process payments and payouts via Stripe;</li>
              <li>To send transactional emails (account verification, payment confirmations, deal notifications) via Resend;</li>
              <li>To comply with our legal obligations;</li>
              <li>To improve the platform and detect fraudulent activity.</li>
            </ul>
          </Section>

          <Section title="4. Legal Basis for Processing">
            <p>We process your data on the following legal bases under UK GDPR:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Contract:</strong> processing necessary to provide our services to you;</li>
              <li><strong>Legal obligation:</strong> AML compliance, fraud prevention, and tax reporting;</li>
              <li><strong>Legitimate interests:</strong> platform security, fraud detection, and improving our services.</li>
            </ul>
          </Section>

          <Section title="5. Data Sharing">
            <p>We share your data with the following third parties only where necessary:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Supabase</strong> — cloud database and authentication (data stored in the EU);</li>
              <li><strong>Stripe</strong> — payment processing and sourcer payouts;</li>
              <li><strong>Resend</strong> — transactional email delivery;</li>
              <li><strong>Vercel</strong> — platform hosting.</li>
            </ul>
            <p>
              We do not sell your personal data to third parties. We do not use your data for advertising purposes.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              We retain your personal data for as long as your account is active and for a period of 5 years thereafter to comply with AML record-keeping requirements under the Money Laundering Regulations 2017.
            </p>
            <p>
              Verification documents are retained for a minimum of 5 years from the end of the business relationship.
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p>Under UK GDPR, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access the personal data we hold about you;</li>
              <li>Correct inaccurate personal data;</li>
              <li>Request erasure of your data (subject to our legal retention obligations);</li>
              <li>Object to or restrict processing of your data;</li>
              <li>Data portability — receive your data in a machine-readable format;</li>
              <li>Withdraw consent where processing is based on consent.</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us via our{" "}
              <Link href="/contact" className="text-teal hover:underline">contact page</Link>.
              We will respond within 30 days.
            </p>
          </Section>

          <Section title="8. Cookies">
            <p>
              PropertyScan uses strictly necessary cookies to manage your authentication session. We do not use tracking, advertising, or analytics cookies.
            </p>
          </Section>

          <Section title="9. Security">
            <p>
              We implement industry-standard security measures including encryption in transit (TLS), encryption at rest, and row-level security on our database. Access to personal data is restricted to authorised personnel only.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify registered users of material changes via email. Continued use of the platform after changes constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="11. Complaints">
            <p>
              If you are unhappy with how we handle your personal data, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO) at{" "}
              <span className="text-navy font-medium">ico.org.uk</span> or by calling 0303 123 1113.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              For any privacy-related queries, please contact us via our{" "}
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
