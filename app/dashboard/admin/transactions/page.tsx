export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/service";

function fmt(pence: number) {
  return (pence / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });
}

const STATUS_BADGE: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-700",
  completed: "bg-green-50 text-green-700",
  refunded:  "bg-red-50 text-red-500",
};

export default async function AdminTransactionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/dashboard");

  type TxRow = {
    id: string;
    sourcing_fee: number;
    platform_fee: number;
    vat_amount: number;
    investor_total: number;
    sourcer_commission: number;
    sourcer_commission_vat: number;
    sourcer_payout: number;
    platform_revenue: number;
    stripe_payment_intent_id: string | null;
    stripe_transfer_id: string | null;
    status: string;
    created_at: string;
    deals: { title: string; city: string; deal_type: string } | null;
    investor: { full_name: string | null } | null;
    sourcer: { full_name: string | null; company_name: string | null } | null;
  };

  const { data: transactions } = await supabaseAdmin
    .from("transactions")
    .select(`
      id, sourcing_fee, platform_fee, vat_amount, investor_total,
      sourcer_commission, sourcer_commission_vat, sourcer_payout, platform_revenue,
      stripe_payment_intent_id, stripe_transfer_id, status, created_at,
      deals(title, city, deal_type),
      investor:profiles!transactions_investor_id_fkey(full_name),
      sourcer:profiles!transactions_sourcer_id_fkey(full_name, company_name)
    `)
    .order("created_at", { ascending: false });

  const list: TxRow[] = (transactions as unknown as TxRow[]) ?? [];

  const totalRevenue  = list.reduce((s, t) => s + t.platform_revenue, 0);
  const totalVolume   = list.reduce((s, t) => s + t.investor_total, 0);
  const totalPayouts  = list.reduce((s, t) => s + t.sourcer_payout, 0);
  const completed     = list.filter((t) => t.status === "completed").length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy mb-1">Transactions</h1>
        <p className="text-navy/50 text-sm">{list.length} total · {completed} completed</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Volume",    value: fmt(totalVolume),   sub: "investor payments" },
          { label: "Platform Revenue",value: fmt(totalRevenue),  sub: "after commission" },
          { label: "Sourcer Payouts", value: fmt(totalPayouts),  sub: "net to sourcers" },
          { label: "Completed",       value: String(completed),  sub: `of ${list.length} transactions` },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-medium text-navy/40 uppercase tracking-wide mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-navy">{card.value}</p>
            <p className="text-xs text-navy/30 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-16 text-center">
          <p className="text-navy/40 text-sm">No transactions yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Deal", "Investor", "Sourcer", "Investor Paid", "Sourcer Payout", "Platform", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-navy leading-snug">{tx.deals?.title ?? "—"}</p>
                      <p className="text-xs text-navy/40">{tx.deals?.city} · {tx.deals?.deal_type}</p>
                    </td>
                    <td className="px-5 py-4 text-navy/70">
                      {tx.investor?.full_name ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-navy/70">{tx.sourcer?.full_name ?? "—"}</p>
                      {tx.sourcer?.company_name && (
                        <p className="text-xs text-navy/40">{tx.sourcer.company_name}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 font-semibold text-navy whitespace-nowrap">
                      {fmt(tx.investor_total)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-teal whitespace-nowrap">
                      {fmt(tx.sourcer_payout)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-navy whitespace-nowrap">
                      {fmt(tx.platform_revenue)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[tx.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-navy/40 text-xs whitespace-nowrap">
                      {new Date(tx.created_at).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer totals */}
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 flex items-center gap-8 text-xs text-navy/50 flex-wrap">
            <span>Total investor payments: <strong className="text-navy">{fmt(totalVolume)}</strong></span>
            <span>Total sourcer payouts: <strong className="text-teal">{fmt(totalPayouts)}</strong></span>
            <span>Total platform revenue: <strong className="text-navy">{fmt(totalRevenue)}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}