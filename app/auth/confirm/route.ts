import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function createProfile(supabase: Awaited<ReturnType<typeof createClient>>) {
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
  return user;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  // PKCE flow — Supabase redirects here with ?code=
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const user = await createProfile(supabase);
      const role = user?.user_metadata?.role ?? "investor";
      const destination = role === "sourcer" ? "/dashboard/sourcer" : "/dashboard/investor";
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  // Token hash flow (email OTP)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      const user = await createProfile(supabase);
      const role = user?.user_metadata?.role ?? "investor";
      const destination = role === "sourcer" ? "/dashboard/sourcer" : "/dashboard/investor";
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  return NextResponse.redirect(new URL("/login?error=invalid_link", request.url));
}
