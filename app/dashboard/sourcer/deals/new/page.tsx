export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DealForm from "@/components/dashboard/DealForm";

const REQUIRED_DOCS = [
  "photo_id",
  "proof_of_address",
  "aml_certificate",
  "prs_membership",
  "pi_insurance",
  "ico_registration",
];

export default async function AddDealPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("verification_status")
    .eq("id", user.id)
    .single();

  const { data: approvedDocs } = await supabase
    .from("verification_documents")
    .select("document_type")
    .eq("user_id", user.id)
    .eq("status", "approved");

  const approvedTypes = new Set(approvedDocs?.map((d) => d.document_type) ?? []);
  const allDocsApproved = REQUIRED_DOCS.every((type) => approvedTypes.has(type));

  if (profile?.verification_status !== "approved" || !allDocsApproved) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-navy mb-2">Add Deal</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mt-6">
          <p className="text-sm font-semibold text-amber-800 mb-1">Verification required</p>
          <p className="text-sm text-amber-700 leading-relaxed">
            All 6 compliance documents must be submitted and approved before you can list deals on PropertyScan.
            {profile?.verification_status === "pending"
              ? " Your documents are currently under review — we'll notify you once approved."
              : " Upload your compliance documents to get started."}
          </p>
          <Link
            href="/dashboard/sourcer/verification"
            className="inline-block mt-4 text-sm bg-amber-700 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-amber-800 transition-colors"
          >
            Go to Verification →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Add Deal</h1>
        <p className="text-navy/50 text-sm mt-0.5">
          Fill in the details below. You can save as a draft or publish immediately.
        </p>
      </div>
      <DealForm />
    </div>
  );
}