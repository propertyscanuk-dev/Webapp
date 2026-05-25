import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — PropertyScan",
  description: "Get in touch with the PropertyScan team. We typically respond within 1 business day.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-navy text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/30 text-teal text-sm font-semibold px-5 py-2 rounded-full mb-10">
            CONTACT US
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-white/70 leading-relaxed">
            Questions about the platform, your account, or a deal? We typically respond within 1 business day.
          </p>
        </div>
      </section>

      {/* Form + details */}
      <section className="bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
          {/* Left — contact details */}
          <div className="md:col-span-1 flex flex-col gap-8">
            <div>
              <h2 className="text-lg font-bold text-navy mb-4">PropertyScan UK</h2>
              <p className="text-navy/60 text-sm leading-relaxed">
                Operated by O&apos;Gorman Property Group Ltd<br />
                Registered in England and Wales
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-navy/40 uppercase tracking-widest mb-3">Email</p>
              <a
                href="mailto:hello@propertyscan.uk"
                className="text-teal font-semibold hover:text-teal-400 transition-colors text-sm"
              >
                hello@propertyscan.uk
              </a>
            </div>

            <div>
              <p className="text-xs font-bold text-navy/40 uppercase tracking-widest mb-3">Response Time</p>
              <p className="text-navy/60 text-sm leading-relaxed">
                We aim to respond to all enquiries within 1 business day (Mon–Fri, 9am–5pm GMT).
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-navy/40 uppercase tracking-widest mb-3">Account Issues</p>
              <p className="text-navy/60 text-sm leading-relaxed">
                For login problems or verification queries, please select &ldquo;Account Support&rdquo; in the subject field.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="md:col-span-2">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
