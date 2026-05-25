import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

function formatGBP(pence: number) {
  return (pence / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });
}

const STATUS_BADGE: Record<string, string> = {
  draft:     "bg-gray-100 text-gray-600",
  active:    "bg-teal/10 text-teal",
  reserved:  "bg-amber-50 text-amber-700",
  sold:      "bg-green-50 text-green-700",
  withdrawn: "bg-red-50 text-red-600",
};

export default async function SourcerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: deals }, { data: transactions }] = await Promise.all([
    supabase
      .from("deals")
      .select("id, title, city, deal_type, status, sourcing_fee, created_at")
      .eq("sourcer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("transactions")
      .select("sourcer_payout, status")
      .eq("sourcer_id", user.id),
  ]);

  const dealList = deals ?? [];
  const txList = transactions ?? [];

  const stats = {
    total:    dealList.length,
    active:   dealList.filter((d) => d.status === "active").length,
    sold:     dealList.filter((d) => d.status === "sold").length,
    earnings: txList
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + (t.sourcer_payout ?? 0), 0),
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Overview</h1>
          <p className="text-navy/50 text-sm mt-0.5">Your sourcing activity at a glance</p>
        </div>
        <Link
          href="/dashboard/sourcer/deals/new"
          className="bg-teal text-navy font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-teal-400 transition-colors"
        >
          + Add Deal
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Deals Listed",    value: stats.total },
          { label: "Active",          value: stats.active },
          { label: "Sold",            value: stats.sold },
          { label: "Total Earnings",  value: formatGBP(stats.earnings) },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-navy/40 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold text-navy mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent deals */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-navy text-sm">Recent Deals</h2>
          <Link
            href="/dashboard/sourcer/deals"
            className="text-xs text-teal hover:text-teal-400 transition-colors font-medium"
          >
            View all →
          </Link>
        </div>

        {dealList.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-navy/40 text-sm">No deals yet.</p>
            <Link
              href="/dashboard/sourcer/deals/new"
              className="mt-3 inline-block text-sm text-teal font-medium hover:text-teal-400 transition-colors"
            >
              List your first deal →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {dealList.slice(0, 5).map((deal) => (
              <div key={deal.id} className="flex items-center justify-between px-6 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy truncate">{deal.title}</p>
                  <p className="text-xs text-navy/40 mt-0.5">
                    {deal.city} · {deal.deal_type}
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4 shrink-0">
                  <span className="text-sm font-semibold text-navy">
                    {formatGBP(deal.sourcing_fee)}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[deal.status] ?? ""}`}
                  >
                    {deal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
