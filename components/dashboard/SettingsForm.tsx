"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SettingsFormProps = {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  company_name: string | null;
};

export default function SettingsForm({ id, full_name, email, phone, company_name }: SettingsFormProps) {
  const [name, setName] = useState(full_name ?? "");
  const [phoneVal, setPhoneVal] = useState(phone ?? "");
  const [company, setCompany] = useState(company_name ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: name.trim() || null,
        phone: phoneVal.trim() || null,
        company_name: company.trim() || null,
      })
      .eq("id", id);

    setSaving(false);
    if (error) {
      setMessage({ type: "error", text: "Failed to save changes. Please try again." });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully." });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {/* Email — read only */}
      <div>
        <label className="block text-sm font-medium text-navy mb-1.5">Email address</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-400">Email cannot be changed here.</p>
      </div>

      {/* Full name */}
      <div>
        <label className="block text-sm font-medium text-navy mb-1.5">Full name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-navy mb-1.5">Phone number</label>
        <input
          type="tel"
          value={phoneVal}
          onChange={(e) => setPhoneVal(e.target.value)}
          placeholder="e.g. 07700 900000"
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition"
        />
      </div>

      {/* Company name */}
      <div>
        <label className="block text-sm font-medium text-navy mb-1.5">Company name</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Your company or trading name"
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition"
        />
      </div>

      {/* Feedback */}
      {message && (
        <p className={`text-sm font-medium ${message.type === "success" ? "text-teal" : "text-red-600"}`}>
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2.5 bg-teal text-navy text-sm font-semibold rounded-lg hover:bg-teal/90 transition disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
