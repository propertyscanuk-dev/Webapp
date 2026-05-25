"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

const subjects = [
  "General Enquiry",
  "Account Support",
  "Verification Query",
  "Deal Question",
  "Payment / Billing",
  "Partnership",
  "Press & Media",
  "Other",
];

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: subjects[0],
    message: "",
  });

  const update = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: subjects[0], message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-navy text-sm placeholder:text-navy/30 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-all";

  if (status === "success") {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-navy font-bold text-xl mb-3">Message sent</h3>
        <p className="text-navy/60 text-sm leading-relaxed mb-6">
          Thanks for getting in touch. We&apos;ll get back to you within 1 business day.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-teal font-semibold hover:text-teal-400 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 flex flex-col gap-5"
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-navy/60 uppercase tracking-wider">Full Name</label>
          <input
            required
            type="text"
            placeholder="Anthony Hoffman"
            value={form.name}
            onChange={update("name")}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-navy/60 uppercase tracking-wider">Email Address</label>
          <input
            required
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={update("email")}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-navy/60 uppercase tracking-wider">Subject</label>
        <select
          value={form.subject}
          onChange={update("subject")}
          className={inputClass}
        >
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-navy/60 uppercase tracking-wider">Message</label>
        <textarea
          required
          rows={6}
          placeholder="How can we help you?"
          value={form.message}
          onChange={update("message")}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm">
          Something went wrong — please try again or email us directly at hello@propertyscan.uk.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-navy text-white font-bold px-8 py-4 rounded-xl hover:bg-navy-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
