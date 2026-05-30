export const dynamic = "force-dynamic";

import VerificationDocs from "@/components/dashboard/VerificationDocs";
import type { DocConfig } from "@/components/dashboard/VerificationDocs";

const SOURCER_DOCS: DocConfig[] = [
  {
    type: "photo_id",
    label: "Photo ID",
    description: "Passport or driving licence. Must be valid and in date.",
    accept: "image/*,.pdf",
  },
  {
    type: "proof_of_address",
    label: "Proof of Address",
    description: "Utility bill or bank statement dated within the last 3 months.",
    accept: "image/*,.pdf",
  },
  {
    type: "aml_certificate",
    label: "AML Certificate",
    description: "Anti-Money Laundering compliance certificate from a recognised provider.",
    accept: "image/*,.pdf",
  },
  {
    type: "prs_membership",
    label: "PRS Membership",
    description: "Current Property Redress Scheme membership certificate.",
    accept: "image/*,.pdf",
  },
  {
    type: "pi_insurance",
    label: "Professional Indemnity Insurance",
    description: "Valid PI insurance certificate showing current coverage.",
    accept: "image/*,.pdf",
  },
  {
    type: "ico_registration",
    label: "ICO Registration",
    description: "Information Commissioner's Office data protection registration.",
    accept: "image/*,.pdf",
  },
];

export default function SourcerVerificationPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Verification</h1>
        <p className="text-navy/50 text-sm mt-0.5">
          Upload your compliance documents to activate your sourcer account and start listing deals.
        </p>
      </div>

      <div className="bg-navy/5 border border-navy/10 rounded-xl px-5 py-4 mb-6">
        <p className="text-xs font-semibold text-navy uppercase tracking-wide mb-1">Why we verify sourcers</p>
        <p className="text-xs text-navy/60 leading-relaxed">
          PropertyScan is AML-compliant and regulation-aligned. We verify every sourcer to protect investors and ensure all deals meet UK property sourcing regulations. Verification typically takes 1 business day.
        </p>
      </div>

      <VerificationDocs docs={SOURCER_DOCS} />
    </div>
  );
}