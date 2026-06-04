export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendAdminNewVerification } from "@/lib/email";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role, verification_status")
    .eq("id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  // Send notification when starting a fresh submission or re-submitting after rejection.
  // Skip if already pending/approved so admin isn't spammed on every doc upload.
  const shouldNotify = profile.verification_status === "not_submitted" || profile.verification_status === "rejected";

  if (shouldNotify) {
    // Mark as pending so subsequent uploads don't re-trigger the email
    await supabase
      .from("profiles")
      .update({ verification_status: "pending" })
      .eq("id", user.id);

    await sendAdminNewVerification(
      profile.full_name ?? "Unknown",
      profile.email,
      profile.role,
    );
  }

  return NextResponse.json({ ok: true });
}
