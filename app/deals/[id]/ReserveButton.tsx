"use client";

import { useState } from "react";

function fmt(pence: number) {
  return (pence / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });
}

interface Props {
  dealId: string;
  dealTitle: string;
  sourcingFee: number;
  paymentSuccess?: boolean;
}

export default function ReserveButton({ dealId, dealTitle, sourcingFee, paymentSuccess }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const platformFee = Math.round(sourcingFee * 0.05);
  const platformFeeVat = Math.round(platformFee * 0.2);
  const investorTotal = sourcingFee + platformFee + platformFeeVat;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="bg-teal/10 border border-teal/30 rounded-xl px-5 py-5 text-center">
        <div className="text-teal font-bold text-lg mb-1">Payment Confirmed</div>
        <p className="text-navy/60 text-sm leading-relaxed">
          Your payment was successful. The deal pack will be available shortly and our team will be in touch within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-teal text-navy font-bold py-4 px-6 rounded-xl hover:bg-teal-400 transition-colors text-base"
      >
        Reserve This Deal
      </button>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-navy font-bold text-xl mb-1">Confirm Reservation</h3>
            <p className="text-navy/50 text-sm mb-6 leading-relaxed">
              You&apos;re reserving{" "}
              <span className="font-semibold text-navy">{dealTitle}</span>.
              You&apos;ll be taken to Stripe to complete payment securely.
            </p>

            <div className="bg-gray-50 rounded-xl p-5 mb-5 space-y-3">
              <p className="text-xs font-semibold text-navy/40 uppercase tracking-widest mb-4">
                Fee Breakdown
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-navy/60">Sourcing fee</span>
                <span className="font-medium text-navy">{fmt(sourcingFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-navy/60">Buyer protection fee (5%)</span>
                <span className="font-medium text-navy">{fmt(platformFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-navy/60">VAT on buyer protection fee (20%)</span>
                <span className="font-medium text-navy">{fmt(platformFeeVat)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                <span className="font-semibold text-navy">Total payable</span>
                <span className="font-bold text-teal text-xl">{fmt(investorTotal)}</span>
              </div>
            </div>

            <p className="text-navy/40 text-xs mb-6 leading-relaxed">
              Payment is processed securely via Stripe. Sourcing fees are non-refundable once a deal pack has been accessed.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 text-navy/60 font-medium py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 bg-teal text-navy font-bold py-3 rounded-xl hover:bg-teal-400 transition-colors text-sm disabled:opacity-50"
              >
                {loading ? "Redirecting…" : "Pay via Stripe →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
