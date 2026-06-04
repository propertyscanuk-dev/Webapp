export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VerificationDocs from "@/components/dashboard/VerificationDocs";
import InvestmentQuestionnaire from "@/components/dashboard/InvestmentQuestionnaire";
import type { DocConfig } from "@/components/dashboard/VerificationDocs";

const INVESTOR_DOCS: DocConfig[] = [
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
    type: "proof_of_funds",
    label: "Proof of Funds",
    description: "Bank statement or solicitor's letter confirming available investment capital.",
    accept: "image/*,.pdf",
  },
  {
    type: "source_of_wealth",
    label: "Source of Wealth",
    description: "Evidence explaining the origin of your investment funds (e.g. business sale, inheritance, employment income).",
    accept: "image/*,.pdf",
  },
];

export default async function InvestorVerificationPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: questionnaireDoc } = await supabase
    .from("verification_documents")
    .select("status")
    .eq("user_id", user.id)
    .eq("document_type", "investment_questionnaire")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Verification</h1>
        <p className="text-navy/50 text-sm mt-0.5">
          Complete your investor verification to access the deal marketplace.
        </p>
      </div>

      <div className="bg-navy/5 border border-navy/10 rounded-xl px-5 py-4 mb-6">
        <p className="text-xs font-semibold text-navy uppercase tracking-wide mb-1">Why we verify investors</p>
        <p className="text-xs text-navy/60 leading-relaxed">
          As an AML-compliant platform, we are required to verify the identity and source of funds for all investors before they can access or purchase property deals. This protects both you and our sourcing partners. Verification typically takes 1 business day.
        </p>
      </div>

      <VerificationDocs docs={INVESTOR_DOCS} />

      <div className="mt-4">
        <InvestmentQuestionnaire
          userId={user.id}
          existingStatus={questionnaireDoc?.status ?? null}
        />
      </div>
    </div>
  );
}
