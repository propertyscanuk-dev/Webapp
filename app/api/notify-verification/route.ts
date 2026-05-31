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
    .select("full_name, email, role")
    .eq("id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  // Only send on first document upload (count existing docs)
  const { count } = await supabase
    .from("verification_documents")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (count === 1) {
    await sendAdminNewVerification(
      profile.full_name ?? "Unknown",
      profile.email,
      profile.role,
    );
  }

  return NextResponse.json({ ok: true });
}
