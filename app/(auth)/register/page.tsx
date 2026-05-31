"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types/database";

type Step = "role" | "details";

const roles: { value: UserRole; label: string; description: string; icon: string }[] = [
  {
    value: "investor",
    label: "Investor",
    description: "I want to browse and purchase verified property deals",
    icon: "💼",
  },
  {
    value: "sourcer",
    label: "Sourcer",
    description: "I source property deals and want to sell them to investors",
    icon: "🏠",
  },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedRole = searchParams.get("role") as UserRole | null;

  const [step, setStep] = useState<Step>(preselectedRole ? "details" : "role");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(preselectedRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRole) return;
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/confirm`,
          data: {
            full_name: fullName,
            role: selectedRole,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      router.push("/verify-email");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step === "role" || step === "details" ? "bg-teal" : "bg-gray-200"}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step === "details" ? "bg-teal" : "bg-gray-200"}`} />
          </div>

          {/* Step 1: Role selection */}
          {step === "role" && (
            <>
              <h1 className="text-2xl font-bold text-navy mb-1">Join PropertyScan</h1>
              <p className="text-navy/50 text-sm mb-8">How are you joining the platform?</p>

              <div className="space-y-3 mb-8">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                      selectedRole === role.value
                        ? "border-teal bg-teal/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{role.icon}</span>
                      <div>
                        <p className="font-semibold text-navy text-sm">{role.label}</p>
                        <p className="text-navy/50 text-xs mt-0.5 leading-relaxed">{role.description}</p>
                      </div>
                      {selectedRole === role.value && (
                        <div className="ml-auto mt-0.5 w-4 h-4 rounded-full bg-teal flex items-center justify-center shrink-0">
                          <svg className="w-2.5 h-2.5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={!selectedRole}
                onClick={() => setStep("details")}
                className="w-full bg-navy text-white font-semibold py-3 rounded-lg hover:bg-navy-700 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </>
          )}

          {/* Step 2: Account details */}
          {step === "details" && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setStep("role")}
                  className="text-navy/40 hover:text-navy transition-colors"
                  aria-label="Go back"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-navy leading-tight">Create your account</h1>
                  <p className="text-navy/50 text-xs mt-0.5">
                    Registering as a{" "}
                    <span className="text-teal font-semibold capitalize">{selectedRole}</span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-navy mb-1.5">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-navy placeholder-navy/30 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-colors"
                    placeholder="Anthony Hoffman"
                  />
                </div>

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
                  <label htmlFor="password" className="block text-sm font-medium text-navy mb-1.5">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-navy placeholder-navy/30 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-colors"
                    placeholder="Min. 8 characters"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-navy mb-1.5">
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  className="w-full bg-navy text-white font-semibold py-3 rounded-lg hover:bg-navy-700 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? "Creating account…" : "Create account"}
                </button>
              </form>

              <p className="text-center text-xs text-navy/40 mt-5 leading-relaxed">
                By registering you agree to our{" "}
                <Link href="/terms" className="text-teal hover:underline">Terms</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-teal hover:underline">Privacy Policy</Link>.
                Your data is processed in compliance with UK GDPR.
              </p>
            </>
          )}

          <p className="text-center text-sm text-navy/50 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-teal font-medium hover:text-teal-400 transition-colors">
              Sign in
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

export default function RegisterPage() {
  return <Suspense><RegisterForm /></Suspense>;
}
