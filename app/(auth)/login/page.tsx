"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Get role and redirect to correct dashboard
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .single();

    const destinations: Record<string, string> = {
      sourcer: "/dashboard/sourcer",
      investor: "/dashboard/investor",
      admin: "/dashboard/admin",
    };

    router.push(profile?.role ? destinations[profile.role] : "/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <span className="text-navy font-bold text-2xl tracking-tight">
            Property<span className="text-teal">Scan</span>
          </span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-10">
          <h1 className="text-2xl font-bold text-navy mb-1">Welcome back</h1>
          <p className="text-navy/50 text-sm mb-8">
            Sign in to your PropertyScan account
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-navy mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-navy placeholder-navy/30 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-navy">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-teal hover:text-teal-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-navy placeholder-navy/30 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-white font-semibold py-3 rounded-lg hover:bg-navy-700 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-navy/50 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-teal font-medium hover:text-teal-400 transition-colors">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-navy/30 mt-6">
          Protected by 256-bit encryption · AML Compliant · ICO Registered
        </p>
      </div>
    </div>
  );
}
