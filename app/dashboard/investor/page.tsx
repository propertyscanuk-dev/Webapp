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
  pending:   "bg-amber-50 text-amber-700",
  completed: "bg-teal/10 text-teal",
  refunded:  "bg-gray-100 text-gray-600",
  disputed:  "bg-red-50 text-red-600",
};

export default async function InvestorDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, investor_total, status, created_at")
    .eq("investor_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const txList = transactions ?? [];

  const stats = {
    purchased:     txList.filter((t) => t.status === "completed").length,
    totalInvested: txList
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + (t.investor_total ?? 0), 0),
    pending:       txList.filter((t) => t.status === "pending").length,
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Overview</h1>
          <p className="text-navy/50 text-sm mt-0.5">Your investment activity</p>
        </div>
        <Link
          href="/deals"
          className="bg-teal text-navy font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-teal-400 transition-colors"
        >
          Browse Deals
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Deals Purchased",  value: stats.purchased },
          { label: "Total Invested",   value: formatGBP(stats.totalInvested) },
          { label: "Pending",          value: stats.pending },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-navy/40 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold text-navy mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-navy text-sm">Recent Transactions</h2>
          <Link
            href="/dashboard/investor/purchases"
            className="text-xs text-teal hover:text-teal-400 transition-colors font-medium"
          >
            View all →
          </Link>
        </div>

        {txList.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-navy/40 text-sm">No purchases yet.</p>
            <Link
              href="/deals"
              className="mt-3 inline-block text-sm text-teal font-medium hover:text-teal-400 transition-colors"
            >
              Browse available deals →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {txList.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-navy">Deal Purchase</p>
                  <p className="text-xs text-navy/40 mt-0.5">
                    {new Date(tx.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <span className="text-sm font-semibold text-navy">
                    {formatGBP(tx.investor_total)}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[tx.status] ?? ""}`}
                  >
                    {tx.status}
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
