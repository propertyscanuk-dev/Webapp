import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROLE_DASHBOARDS: Record<string, string> = {
  sourcer: "/dashboard/sourcer",
  investor: "/dashboard/investor",
  admin: "/dashboard/admin",
};

export async function middleware(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    if (user && (pathname === "/login" || pathname === "/register")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const destination = profile?.role && ROLE_DASHBOARDS[profile.role]
        ? ROLE_DASHBOARDS[profile.role]
        : "/dashboard/investor";

      return NextResponse.redirect(new URL(destination, request.url));
    }

    if (pathname.startsWith("/dashboard") && !user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return supabaseResponse;
  } catch (err) {
    console.error("[middleware] error:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
