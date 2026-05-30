"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/service";
import { sendDealReserved } from "@/lib/email";

export async function reserveDeal(dealId: string): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to reserve a deal." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, verification_status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "investor") {
    return { error: "Only investors can reserve deals." };
  }
  if (profile.verification_status !== "approved") {
    return { error: "Your account must be verified before reserving deals." };
  }

  // .eq("status", "active") acts as an atomic guard — if deal was already reserved,
  // the update matches 0 rows and Supabase returns an empty result rather than an error.
  const { data: updated, error } = await supabase
    .from("deals")
    .update({
      status: "reserved",
      reserved_by: user.id,
      reserved_at: new Date().toISOString(),
    })
    .eq("id", dealId)
    .eq("status", "active")
    .select("id")
    .single();

  if (error || !updated) {
    return { error: "This deal is no longer available for reservation." };
  }

  // Notify sourcer that their deal has been reserved
  const { data: deal } = await supabaseAdmin
    .from("deals")
    .select("title, sourcer_id")
    .eq("id", dealId)
    .single();

  if (deal) {
    const { data: sourcer } = await supabaseAdmin
      .from("profiles")
      .select("email, full_name")
      .eq("id", deal.sourcer_id)
      .single();

    if (sourcer) {
      await sendDealReserved(
        sourcer.email,
        sourcer.full_name ?? "Sourcer",
        deal.title ?? dealId,
        dealId,
      );
    }
  }

  revalidatePath(`/deals/${dealId}`);
  revalidatePath("/deals");
  return { error: null };
}
