import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DealActions from "@/components/dashboard/DealActions";
import type { DealStatus } from "@/types/database";

function formatGBP(pence: number) {
  return (pence / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });
}

const STATUS_BADGE: Record<DealStatus, string> = {
  draft:     "bg-gray-100 text-gray-600",
  active:    "bg-teal/10 text-teal",
  reserved:  "bg-amber-50 text-amber-700",
  sold:      "bg-green-50 text-green-700",
  withdrawn: "bg-red-50 text-red-500",
};

export default async function SourcerDealsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: deals } = await supabase
    .from("deals")
    .select("id, title, city, postcode, deal_type, status, asking_price, sourcing_fee, roi_percent, gross_yield_percent, created_at")
    .eq("sourcer_id", user.id)
    .order("created_at", { ascending: false });

  const dealList = deals ?? [];

  const counts = {
    total:  dealList.length,
    active: dealList.filter((d) => d.status === "active").length,
    draft:  dealList.filter((d) => d.status === "draft").length,
    sold:   dealList.filter((d) => d.status === "sold").length,
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">My Deals</h1>
          <p className="text-navy/50 text-sm mt-0.5">
            {counts.total} total · {counts.active} active · {counts.draft} draft
          </p>
        </div>
        <Link
          href="/dashboard/sourcer/deals/new"
          className="bg-teal text-navy font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-teal-400 transition-colors"
        >
          + Add Deal
        </Link>
      </div>

      {dealList.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-16 text-center">
          <p className="text-navy/40 text-sm mb-3">No deals listed yet.</p>
          <Link
            href="/dashboard/sourcer/deals/new"
            className="text-sm text-teal font-medium hover:text-teal-400 transition-colors"
          >
            List your first deal →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-semibold text-navy/40 uppercase tracking-wide">Deal</span>
            <span className="text-xs font-semibold text-navy/40 uppercase tracking-wide">Asking</span>
            <span className="text-xs font-semibold text-navy/40 uppercase tracking-wide">Fee</span>
            <span className="text-xs font-semibold text-navy/40 uppercase tracking-wide">Status</span>
            <span className="text-xs font-semibold text-navy/40 uppercase tracking-wide">Actions</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-50">
            {dealList.map((deal) => (
              <div
                key={deal.id}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-4"
              >
                {/* Deal info */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy truncate">{deal.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-navy/40">{deal.city} · {deal.deal_type}</span>
                    {deal.gross_yield_percent && (
                      <span className="text-xs text-navy/30">{deal.gross_yield_percent}% yield</span>
                    )}
                  </div>
                </div>

                {/* Asking price */}
                <span className="text-sm text-navy/70 whitespace-nowrap">
                  {formatGBP(deal.asking_price)}
                </span>

                {/* Sourcing fee */}
                <span className="text-sm font-semibold text-navy whitespace-nowrap">
                  {formatGBP(deal.sourcing_fee)}
                </span>

                {/* Status */}
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${STATUS_BADGE[deal.status as DealStatus] ?? ""}`}
                >
                  {deal.status}
                </span>

                {/* Actions */}
                <DealActions dealId={deal.id} currentStatus={deal.status as DealStatus} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
