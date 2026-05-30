"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/service";
import { sendVerificationApproved, sendVerificationRejected } from "@/lib/email";

export async function approveUserAction(userId: string) {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email, full_name, role")
    .eq("id", userId)
    .single();

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
