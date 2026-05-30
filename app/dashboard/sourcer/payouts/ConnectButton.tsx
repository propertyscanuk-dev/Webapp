"use client";

import { useState } from "react";

export default function ConnectButton({ isConnected, payoutsEnabled }: { isConnected: boolean; payoutsEnabled: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Something went wrong");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // Fully set up
  if (isConnected && payoutsEnabled) {
    return (
      <div className="flex items-center gap-2 text-teal font-semibold text-sm">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Account connected — you&apos;re set up to receive payouts
      </div>
    );
  }

  // Account created but onboarding not completed
  if (isConnected && !payoutsEnabled) {
    return (
      <div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
          <p className="text-amber-800 font-semibold text-sm">Onboarding incomplete</p>
          <p className="text-amber-700 text-xs mt-1">
            Your Stripe account was created but you haven&apos;t finished the setup. Complete it to receive payouts.
          </p>
        </div>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full bg-amber-500 text-white font-bold py-4 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Redirecting to Stripe…" : "Complete Stripe Setup →"}
        </button>
        <p className="text-navy/30 text-xs mt-3 text-center">
          Powered by Stripe Express. Your bank details are never stored on PropertyScan.
        </p>
      </div>
    );
  }

  // Not connected at all
  return (
    <div>
      {error && (
        <p className="text-red-600 text-sm mb-3">{error}</p>
      )}
      <button
        onClick={handleConnect}
        disabled={loading}
        className="w-full bg-navy text-white font-bold py-4 rounded-xl hover:bg-navy-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Redirecting to Stripe…" : "Connect Bank Account via Stripe"}
      </button>
      <p className="text-navy/30 text-xs mt-3 text-center">
        Powered by Stripe Express. Your bank details are never stored on PropertyScan.
      </p>
    </div>
  );
}
