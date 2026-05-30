"use client";

import { useState } from "react";

const steps = [
  {
    number: "01",
    label: "Register",
    title: "Create Your Sourcer Account",
    description:
      "Sign up in minutes. Choose the Sourcer role, enter your details, and you're in. No upfront cost — registration is completely free.",
    bullets: [
      "Select the Sourcer role at sign-up",
      "Enter your name, email, and password",
      "Confirm your email address",
      "Access your sourcer dashboard immediately",
    ],
    mockup: <RegisterMockup />,
  },
  {
    number: "02",
    label: "Get Verified",
    title: "Submit Your Compliance Documents",
    description:
      "Upload your six compliance documents. Our team reviews within 1 business day. Once approved, you can list deals immediately.",
    bullets: [
      "Photo ID — passport or driving licence",
      "Proof of address — utility bill or bank statement",
      "AML certificate from an HMRC-approved provider",
      "PRS membership certificate",
      "Professional indemnity insurance schedule",
      "ICO registration number",
    ],
    mockup: <VerifyMockup />,
  },
  {
    number: "03",
    label: "List Your Deal",
    title: "Package and Publish Your Deal",
    description:
      "Fill in the deal form with property details, financials, and photos. See your live fee breakdown as you type. Publish instantly or save as a draft.",
    bullets: [
      "Choose deal type: BTL, HMO, BRRR, or Flip",
      "Enter address, asking price, and sourcing fee",
      "Add yield, ROI, and BMV figures",
      "Upload property photos — first one becomes the hero image",
      "Publish live or save as draft",
    ],
    mockup: <ListDealMockup />,
  },
  {
    number: "04",
    label: "Get Paid",
    title: "Receive Your Payout via Stripe",
    description:
      "When an investor reserves your deal and payment clears, Stripe Connect automatically transfers your net proceeds directly to your bank account. No chasing invoices.",
    bullets: [
      "Connect your bank account via Stripe Express once",
      "Investor payment is captured securely by Stripe",
      "You receive 80% of your sourcing fee net of VAT",
      "Payout lands in your bank within 2–3 business days",
    ],
    mockup: <PayoutMockup />,
  },
];

export default function SourcerTutorial() {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <div>
      {/* Step tabs */}
      <div className="flex gap-2 mb-12 overflow-x-auto pb-1">
        {steps.map((s, i) => (
          <button
            key={s.number}
            onClick={() => setActive(i)}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
              active === i
                ? "bg-navy text-white border-navy shadow-lg"
                : "bg-white text-navy/50 border-gray-200 hover:border-navy/30 hover:text-navy"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                active === i ? "bg-teal text-navy" : "bg-gray-100 text-navy/40"
              }`}
            >
              {s.number}
            </span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <div className="inline-flex items-center gap-2 bg-teal/10 text-teal text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            Step {step.number}
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold text-navy mb-5 leading-tight">
            {step.title}
          </h3>
          <p className="text-navy/60 text-lg leading-relaxed mb-8">
            {step.description}
          </p>
          <ul className="space-y-3">
            {step.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-navy/70 text-sm leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>

          {/* Step nav */}
          <div className="flex items-center gap-3 mt-10">
            <button
              onClick={() => setActive((i) => Math.max(0, i - 1))}
              disabled={active === 0}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-navy/40 hover:text-navy hover:border-navy/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    active === i ? "w-6 bg-teal" : "w-1.5 bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setActive((i) => Math.min(steps.length - 1, i + 1))}
              disabled={active === steps.length - 1}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-navy/40 hover:text-navy hover:border-navy/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>

        {/* Mockup */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-teal/5 to-navy/5 rounded-3xl" />
          <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            {/* Browser chrome */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-3 bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400">
                propertyscan.uk
              </div>
            </div>
            {/* Screen content */}
            <div className="p-6 min-h-[380px]">
              {step.mockup}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step mockups ──────────────────────────────────────────────────────────────

function RegisterMockup() {
  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <p className="text-lg font-bold text-navy mb-1">Create your account</p>
        <p className="text-xs text-navy/40">Choose your role to get started</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="border-2 border-gray-200 rounded-xl p-4 opacity-50">
          <div className="w-8 h-8 bg-navy/5 rounded-lg mb-3 flex items-center justify-center">
            <svg className="w-4 h-4 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-navy">Investor</p>
          <p className="text-xs text-navy/40 mt-1">Browse &amp; buy deals</p>
        </div>
        <div className="border-2 border-teal bg-teal/5 rounded-xl p-4 relative">
          <div className="absolute top-2 right-2 w-4 h-4 bg-teal rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="w-8 h-8 bg-teal/20 rounded-lg mb-3 flex items-center justify-center">
            <svg className="w-4 h-4 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-sm font-bold text-teal">Sourcer</p>
          <p className="text-xs text-teal/60 mt-1">List &amp; sell deals</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <div className="text-xs text-navy/40 mb-1">Full name</div>
          <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-navy/60 bg-gray-50">James O'Brien</div>
        </div>
        <div>
          <div className="text-xs text-navy/40 mb-1">Email address</div>
          <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-navy/60 bg-gray-50">james@sourcingpro.co.uk</div>
        </div>
        <div className="bg-teal text-navy text-sm font-bold py-2.5 rounded-lg text-center">
          Create Sourcer Account →
        </div>
      </div>
    </div>
  );
}

function VerifyMockup() {
  const docs = [
    { label: "Photo ID", done: true },
    { label: "Proof of Address", done: true },
    { label: "AML Certificate", done: true },
    { label: "PRS Membership", done: false, active: true },
    { label: "PI Insurance", done: false },
    { label: "ICO Registration", done: false },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold text-navy">Verification Documents</p>
        <span className="text-xs bg-amber-50 text-amber-600 font-semibold px-2.5 py-1 rounded-full">3 of 6 complete</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
        <div className="bg-teal h-1.5 rounded-full" style={{ width: "50%" }} />
      </div>
      <div className="space-y-2">
        {docs.map((doc) => (
          <div
            key={doc.label}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
              doc.active
                ? "border-teal/40 bg-teal/5"
                : doc.done
                ? "border-gray-100 bg-gray-50"
                : "border-gray-100"
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              doc.done ? "bg-teal" : doc.active ? "bg-teal/20 border-2 border-teal" : "bg-gray-100"
            }`}>
              {doc.done && (
                <svg className="w-3 h-3 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-sm flex-1 ${doc.done ? "text-navy/40 line-through" : doc.active ? "text-teal font-semibold" : "text-navy/60"}`}>
              {doc.label}
            </span>
            {doc.active && (
              <span className="text-xs bg-teal text-navy font-bold px-2 py-0.5 rounded-full">Upload</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ListDealMockup() {
  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-navy mb-3">New Deal — Property Details</p>
      <div className="space-y-3">
        <div>
          <div className="text-xs text-navy/40 mb-1">Deal Title</div>
          <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-navy bg-gray-50">
            3-bed BTL, Levenshulme, Manchester
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-navy/40 mb-1">Asking Price</div>
            <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-navy bg-gray-50 flex">
              <span className="text-navy/30 mr-1">£</span>145,000
            </div>
          </div>
          <div>
            <div className="text-xs text-navy/40 mb-1">Sourcing Fee</div>
            <div className="border border-teal/40 rounded-lg px-3 py-2 text-sm text-navy bg-teal/5 flex">
              <span className="text-teal/60 mr-1">£</span>5,000
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[["Gross Yield", "8.2%"], ["ROI", "—"], ["BMV", "18%"]].map(([label, val]) => (
            <div key={label}>
              <div className="text-xs text-navy/40 mb-1">{label}</div>
              <div className="border border-gray-200 rounded-lg px-2 py-2 text-sm text-navy text-center bg-gray-50">{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Fee preview */}
      <div className="bg-navy/5 rounded-xl p-3 border border-navy/10">
        <p className="text-xs font-bold text-navy uppercase tracking-wide mb-2">Fee Breakdown Preview</p>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-navy/50">Investor pays</span>
            <span className="font-bold text-navy">£5,250</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-navy/50">You receive</span>
            <span className="font-bold text-teal">£3,800</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 text-center bg-gray-100 text-navy/50 text-xs font-semibold py-2.5 rounded-lg">Save Draft</div>
        <div className="flex-1 text-center bg-teal text-navy text-xs font-bold py-2.5 rounded-lg">Publish Deal →</div>
      </div>
    </div>
  );
}

function PayoutMockup() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold text-navy">Payouts</p>
        <span className="text-xs bg-teal/10 text-teal font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-teal rounded-full inline-block" />
          Bank Connected
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Total Earned", value: "£11,400", sub: "3 deals sold" },
          { label: "Pending", value: "£3,800", sub: "Clearing in 2 days" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-xs text-navy/40 mb-1">{s.label}</p>
            <p className="text-lg font-bold text-navy">{s.value}</p>
            <p className="text-xs text-teal mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent payouts */}
      <div className="space-y-2">
        {[
          { deal: "3-bed BTL, Manchester", amount: "£3,800", date: "Today", status: "pending" },
          { deal: "5-bed HMO, Leeds", amount: "£5,200", date: "12 May", status: "paid" },
          { deal: "2-bed BRRR, Birmingham", amount: "£2,400", date: "3 May", status: "paid" },
        ].map((p) => (
          <div key={p.deal} className="flex items-center gap-3 py-2 border-b border-gray-50">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-navy truncate">{p.deal}</p>
              <p className="text-xs text-navy/30">{p.date}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-navy">{p.amount}</p>
              <span className={`text-xs font-medium ${p.status === "paid" ? "text-teal" : "text-amber-500"}`}>
                {p.status === "paid" ? "Paid" : "Pending"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-navy/5 rounded-xl p-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center shrink-0">
          <span className="text-teal text-xs font-bold">S</span>
        </div>
        <div>
          <p className="text-xs font-bold text-navy">Stripe Connect</p>
          <p className="text-xs text-navy/40">Payouts to Barclays ••••4521</p>
        </div>
      </div>
    </div>
  );
}
