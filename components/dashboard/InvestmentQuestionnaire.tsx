"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  userId: string;
  existingStatus?: "pending" | "approved" | "rejected" | null;
};

const STATUS_CONFIG = {
  pending:  { label: "Under review",  cls: "bg-amber-50 text-amber-700",  icon: "⏱" },
  approved: { label: "Approved",      cls: "bg-teal/10 text-teal",         icon: "✓" },
  rejected: { label: "Rejected",      cls: "bg-red-50 text-red-600",       icon: "✗" },
};

const CATEGORIES = [
  {
    id: "high_net_worth",
    label: "High-Net-Worth Investor",
    description:
      "My annual income exceeds £100,000, OR my net assets (excluding my primary residence and pension) exceed £250,000.",
  },
  {
    id: "sophisticated",
    label: "Sophisticated Investor",
    description:
      "I have made more than one investment in an unlisted company in the last 2 years, OR I am currently (or have been in the last 2 years) a director of a company with annual turnover of at least £1 million.",
  },
];

const RISK_STATEMENTS = [
  "I understand that investing in property deals carries significant risk, including the possible loss of capital.",
  "I understand that PropertyScan deals are not regulated financial products or advice.",
  "I accept full responsibility for my own investment decisions and am not relying on PropertyScan for financial guidance.",
  "I confirm that the information I have provided is accurate and I meet the criteria selected above.",
];

export default function InvestmentQuestionnaire({ userId, existingStatus }: Props) {
  const [category, setCategory] = useState<string | null>(null);
  const [risks, setRisks] = useState<boolean[]>(RISK_STATEMENTS.map(() => false));
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const status = submitted ? "pending" : existingStatus;

  if (status) {
    const cfg = STATUS_CONFIG[status];
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-navy">Investment Questionnaire</p>
            <p className="text-xs text-navy/50 mt-0.5">Self-certification of investor status</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.cls}`}>
            {cfg.icon} {cfg.label}
          </span>
        </div>
      </div>
    );
  }

  const allRisksTicked = risks.every(Boolean);
  const canSubmit = category !== null && allRisksTicked;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    const selectedCategory = CATEGORIES.find((c) => c.id === category);
    const answers = JSON.stringify({
      category: selectedCategory?.label,
      risks: "All acknowledged",
    });

    const supabase = createClient();
    const { error: err } = await supabase.from("verification_documents").insert({
      user_id:       userId,
      document_type: "investment_questionnaire",
      storage_path:  `questionnaire/${userId}/self-certification`,
      file_name:     "Self-Certification Questionnaire",
      status:        "pending",
      admin_notes:   answers,
    });

    setSubmitting(false);
    if (err) {
      setError("Failed to submit. Please try again.");
    } else {
      setSubmitted(true);
      fetch("/api/notify-verification", { method: "POST" }).catch(() => {});
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm font-semibold text-navy mb-0.5">Investment Questionnaire</p>
      <p className="text-xs text-navy/50 mb-5">
        To comply with FCA regulations, please self-certify your investor status below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category selection */}
        <div>
          <p className="text-xs font-semibold text-navy uppercase tracking-wide mb-3">
            Select the statement that applies to you
          </p>
          <div className="space-y-3">
            {CATEGORIES.map((cat) => (
              <label
                key={cat.id}
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  category === cat.id
                    ? "border-teal bg-teal/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={category === cat.id}
                  onChange={() => setCategory(cat.id)}
                  className="mt-0.5 accent-teal shrink-0"
                />
                <div>
                  <p className="text-sm font-semibold text-navy">{cat.label}</p>
                  <p className="text-xs text-navy/60 mt-0.5 leading-relaxed">{cat.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Risk acknowledgements */}
        <div>
          <p className="text-xs font-semibold text-navy uppercase tracking-wide mb-3">
            Risk acknowledgements — please tick all to confirm
          </p>
          <div className="space-y-2.5">
            {RISK_STATEMENTS.map((statement, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={risks[i]}
                  onChange={() =>
                    setRisks((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                  }
                  className="mt-0.5 accent-teal shrink-0"
                />
                <p className="text-xs text-navy/70 leading-relaxed group-hover:text-navy transition-colors">
                  {statement}
                </p>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="w-full py-2.5 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit self-certification"}
        </button>

        <p className="text-[10px] text-navy/30 text-center leading-relaxed">
          By submitting you confirm this declaration is accurate. False self-certification may result in account suspension.
        </p>
      </form>
    </div>
  );
}
