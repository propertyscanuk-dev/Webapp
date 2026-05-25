"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { DealType } from "@/types/database";

const DEAL_TYPES: { value: DealType; label: string; desc: string }[] = [
  { value: "BTL",  label: "Buy to Let", desc: "Standard residential rental" },
  { value: "HMO",  label: "HMO",        desc: "House in Multiple Occupation" },
  { value: "BRRR", label: "BRRR",       desc: "Buy, Refurb, Refinance, Rent" },
  { value: "Flip", label: "Flip",       desc: "Buy, refurb, and sell" },
];

function poundsToPence(val: string): number {
  const n = parseFloat(val.replace(/,/g, ""));
  return isNaN(n) ? 0 : Math.round(n * 100);
}

function toPercent(val: string): number | null {
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

interface FormState {
  title: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postcode: string;
  deal_type: DealType;
  asking_price: string;
  sourcing_fee: string;
  monthly_rent: string;
  roi_percent: string;
  gross_yield_percent: string;
  bmv_percent: string;
  description: string;
}

const INITIAL: FormState = {
  title: "", address_line1: "", address_line2: "", city: "", postcode: "",
  deal_type: "BTL", asking_price: "", sourcing_fee: "", monthly_rent: "",
  roi_percent: "", gross_yield_percent: "", bmv_percent: "", description: "",
};

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-navy mb-1.5">
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function InputField({
  value, onChange, type = "text", placeholder, prefix, suffix, required,
}: {
  value: string; onChange: (v: string) => void; type?: string;
  placeholder?: string; prefix?: string; suffix?: string; required?: boolean;
}) {
  const base =
    "w-full px-4 py-2.5 border border-gray-200 text-navy text-sm placeholder-navy/30 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-colors";
  return (
    <div className="flex">
      {prefix && (
        <span className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-navy/40 text-sm shrink-0">
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        step="any"
        min="0"
        className={`${base} ${prefix ? "rounded-r-lg" : suffix ? "rounded-l-lg border-r-0" : "rounded-lg"}`}
      />
      {suffix && (
        <span className="flex items-center px-3 bg-gray-50 border border-l-0 border-gray-200 rounded-r-lg text-navy/40 text-sm shrink-0">
          {suffix}
        </span>
      )}
    </div>
  );
}

function FeeBreakdown({ sourcingFeeGBP }: { sourcingFeeGBP: number }) {
  const platformFee = sourcingFeeGBP * 0.05;
  const investorPays = sourcingFeeGBP + platformFee + platformFee * 0.2;
  const commission = sourcingFeeGBP * 0.2;
  const sourcerReceives = sourcingFeeGBP - commission - commission * 0.2;
  const fmt = (n: number) =>
    n.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

  return (
    <div className="mt-5 bg-navy/5 rounded-xl p-4 border border-navy/10">
      <p className="text-xs font-semibold text-navy uppercase tracking-wide mb-3">Fee Breakdown Preview</p>
      <div className="grid grid-cols-2 gap-y-1.5 text-xs">
        <span className="text-navy/50">Investor pays</span>
        <span className="font-semibold text-navy text-right">{fmt(investorPays)}</span>
        <span className="text-navy/50">You receive</span>
        <span className="font-semibold text-teal text-right">{fmt(sourcerReceives)}</span>
        <span className="text-navy/30 col-span-2 pt-1">
          Platform commission: {fmt(commission)} + VAT
        </span>
      </div>
    </div>
  );
}

export default function DealForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState<"draft" | "active" | null>(null);
  const [error, setError] = useState<string | null>(null);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(status: "draft" | "active") {
    if (!form.title || !form.address_line1 || !form.city || !form.postcode || !form.asking_price || !form.sourcing_fee) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(status);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { error: err } = await supabase.from("deals").insert({
      sourcer_id: user.id,
      title: form.title.trim(),
      address_line1: form.address_line1.trim(),
      address_line2: form.address_line2.trim() || null,
      city: form.city.trim(),
      postcode: form.postcode.trim().toUpperCase(),
      deal_type: form.deal_type,
      asking_price: poundsToPence(form.asking_price),
      sourcing_fee: poundsToPence(form.sourcing_fee),
      monthly_rent: form.monthly_rent ? poundsToPence(form.monthly_rent) : null,
      roi_percent: toPercent(form.roi_percent),
      gross_yield_percent: toPercent(form.gross_yield_percent),
      bmv_percent: toPercent(form.bmv_percent),
      description: form.description.trim() || null,
      status,
    });

    if (err) {
      setError(err.message);
      setLoading(null);
      return;
    }

    router.push("/dashboard/sourcer/deals");
    router.refresh();
  }

  const busy = loading !== null;
  const sourcingFeeGBP = parseFloat(form.sourcing_fee) || 0;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Deal type */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-navy mb-4">Deal Type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DEAL_TYPES.map((dt) => (
            <button
              key={dt.value}
              type="button"
              onClick={() => set("deal_type", dt.value)}
              className={`text-left p-3 rounded-lg border-2 transition-colors ${
                form.deal_type === dt.value
                  ? "border-teal bg-teal/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className={`text-sm font-semibold ${form.deal_type === dt.value ? "text-teal" : "text-navy"}`}>
                {dt.label}
              </p>
              <p className="text-xs text-navy/40 mt-0.5">{dt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Property details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-navy mb-5">Property Details</h2>
        <div className="space-y-4">
          <div>
            <FieldLabel label="Deal Title" required />
            <InputField
              value={form.title}
              onChange={(v) => set("title", v)}
              placeholder="e.g. 3-bed BTL in Birmingham City Centre"
              required
            />
          </div>
          <div>
            <FieldLabel label="Address Line 1" required />
            <InputField
              value={form.address_line1}
              onChange={(v) => set("address_line1", v)}
              placeholder="Street address"
              required
            />
          </div>
          <div>
            <FieldLabel label="Address Line 2" />
            <InputField
              value={form.address_line2}
              onChange={(v) => set("address_line2", v)}
              placeholder="Flat, unit, etc. (optional)"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel label="City" required />
              <InputField
                value={form.city}
                onChange={(v) => set("city", v)}
                placeholder="Birmingham"
                required
              />
            </div>
            <div>
              <FieldLabel label="Postcode" required />
              <InputField
                value={form.postcode}
                onChange={(v) => set("postcode", v.toUpperCase())}
                placeholder="B1 1BB"
                required
              />
            </div>
          </div>
          <div>
            <FieldLabel label="Description" />
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Key details: property condition, tenancy status, refurb required, comparable evidence, any caveats…"
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-navy text-sm placeholder-navy/30 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Financials */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-navy mb-5">Financials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel label="Asking Price" required />
            <InputField value={form.asking_price} onChange={(v) => set("asking_price", v)} prefix="£" placeholder="150,000" type="number" required />
          </div>
          <div>
            <FieldLabel label="Sourcing Fee" required />
            <InputField value={form.sourcing_fee} onChange={(v) => set("sourcing_fee", v)} prefix="£" placeholder="5,000" type="number" required />
          </div>
          <div>
            <FieldLabel label="Monthly Rent" />
            <InputField value={form.monthly_rent} onChange={(v) => set("monthly_rent", v)} prefix="£" placeholder="750" type="number" />
          </div>
          <div>
            <FieldLabel label="Gross Yield" />
            <InputField value={form.gross_yield_percent} onChange={(v) => set("gross_yield_percent", v)} suffix="%" placeholder="7.2" type="number" />
          </div>
          <div>
            <FieldLabel label="ROI" />
            <InputField value={form.roi_percent} onChange={(v) => set("roi_percent", v)} suffix="%" placeholder="12.5" type="number" />
          </div>
          <div>
            <FieldLabel label="Below Market Value" />
            <InputField value={form.bmv_percent} onChange={(v) => set("bmv_percent", v)} suffix="%" placeholder="15" type="number" />
          </div>
        </div>

        {sourcingFeeGBP > 0 && <FeeBreakdown sourcingFeeGBP={sourcingFeeGBP} />}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-4">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end pb-8">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={busy}
          className="text-sm text-navy/40 hover:text-navy transition-colors px-4 py-2.5"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => handleSubmit("draft")}
          disabled={busy}
          className="text-sm bg-gray-100 text-navy font-medium px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {loading === "draft" ? "Saving…" : "Save as Draft"}
        </button>
        <button
          type="button"
          onClick={() => handleSubmit("active")}
          disabled={busy}
          className="text-sm bg-teal text-navy font-semibold px-5 py-2.5 rounded-lg hover:bg-teal-400 transition-colors disabled:opacity-50"
        >
          {loading === "active" ? "Publishing…" : "Publish Deal"}
        </button>
      </div>
    </div>
  );
}
