import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <span className="text-navy font-bold text-2xl tracking-tight">
            Property<span className="text-teal">Scan</span>
          </span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-10 text-center">
          <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-navy mb-2">Check your email</h1>
          <p className="text-navy/50 text-sm leading-relaxed mb-6">
            We&apos;ve sent a verification link to your email address.
            Click the link to confirm your account and get started.
          </p>

          <div className="bg-gray-50 rounded-xl px-5 py-4 mb-6 text-left space-y-2">
            <p className="text-xs font-semibold text-navy/40 uppercase tracking-wider">
              What happens next
            </p>
            {[
              "Verify your email address",
              "Complete your identity verification",
              "Admin reviews your documents (1–2 business days)",
              "Access the deal marketplace",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-navy/10 text-navy text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-navy/60">{step}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-navy/40 leading-relaxed">
            Didn&apos;t receive the email? Check your spam folder, or{" "}
            <Link href="/register" className="text-teal hover:underline">
              try again with a different address
            </Link>
            .
          </p>
        </div>

        <p className="text-center text-xs text-navy/30 mt-6">
          Protected by 256-bit encryption · AML Compliant · ICO Registered
        </p>
      </div>
    </div>
  );
}
