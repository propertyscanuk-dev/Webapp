import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/service";
import { sendNewMessage } from "@/lib/email";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { deal_id, recipient_id, body } = await req.json();
  if (!deal_id || !recipient_id || !body?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data: msg, error } = await supabase.from("messages").insert({
    deal_id,
    sender_id: user.id,
    recipient_id,
    body: body.trim(),
    read_at: null,
  }).select("id, created_at").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Fire email notification — don't block the response
  (async () => {
    try {
      const [dealRes, senderRes, recipientRes, recipientAuthRes] = await Promise.all([
        supabaseAdmin.from("deals").select("title").eq("id", deal_id).single(),
        supabaseAdmin.from("profiles").select("full_name").eq("id", user.id).single(),
        supabaseAdmin.from("profiles").select("full_name, role").eq("id", recipient_id).single(),
        supabaseAdmin.auth.admin.getUserById(recipient_id),
      ]);

      const recipientEmail = recipientAuthRes.data.user?.email;
      const recipientRole = recipientRes.data?.role;

      if (recipientEmail && (recipientRole === "sourcer" || recipientRole === "investor")) {
        await sendNewMessage(
          recipientEmail,
          recipientRes.data?.full_name ?? "there",
          senderRes.data?.full_name ?? "Someone",
          dealRes.data?.title ?? "a deal",
          deal_id,
          recipientRole,
          user.id,
        );
      }
    } catch (e) {
      console.error("[messages/send] email error", e);
    }
  })();

  return NextResponse.json({ id: msg.id, created_at: msg.created_at });
}
