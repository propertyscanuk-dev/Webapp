"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/service";
import { sendVerificationApproved, sendVerificationRejected } from "@/lib/email";

const REQUIRED_DOCS: Record<"sourcer" | "investor", string[]> = {
  sourcer: ["photo_id", "proof_of_address", "aml_certificate", "prs_membership", "pi_insurance", "ico_registration"],
  investor: ["photo_id", "proof_of_address", "proof_of_funds", "source_of_wealth", "investment_questionnaire"],
};

export async function approveUserAction(userId: string) {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email, full_name, role")
    .eq("id", userId)
    .single();

  if (profile && profile.role !== "admin") {
    const required = REQUIRED_DOCS[profile.role as "sourcer" | "investor"] ?? [];
    const { data: approvedDocs } = await supabaseAdmin
      .from("verification_documents")
      .select("document_type")
      .eq("user_id", userId)
      .eq("status", "approved");

    const approvedTypes = new Set(approvedDocs?.map((d) => d.document_type) ?? []);
    const missing = required.filter((type) => !approvedTypes.has(type));

    if (missing.length > 0) {
      throw new Error(`Cannot approve: missing approved documents — ${missing.join(", ")}`);
    }
  }

  await supabaseAdmin
    .from("profiles")
    .update({ verification_status: "approved" })
    .eq("id", userId);

  if (profile) {
    await sendVerificationApproved(
      profile.email,
      profile.full_name ?? "User",
      profile.role as "sourcer" | "investor",
    );
  }

  revalidatePath("/dashboard/admin/verifications");
}

export async function rejectUserAction(userId: string, reason?: string) {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email, full_name")
    .eq("id", userId)
    .single();

  await supabaseAdmin
    .from("profiles")
    .update({ verification_status: "rejected" })
    .eq("id", userId);

  if (profile) {
    await sendVerificationRejected(
      profile.email,
      profile.full_name ?? "User",
      reason,
    );
  }

  revalidatePath("/dashboard/admin/verifications");
}
