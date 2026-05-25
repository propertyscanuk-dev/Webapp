import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      // Create profile row on first confirmation
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata.full_name ?? null,
          role: user.user_metadata.role ?? "investor",
          verification_status: "not_submitted",
        });
      }

      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(new URL("/login?error=invalid_link", request.url));
}
