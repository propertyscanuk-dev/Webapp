export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

function fmt(pence: number) {
  return (pence / 100).toLocaleString("en-GB", {
    style: "currency", currency: "GBP", maximumFractionDigits: 0,
  });
}

export default async function PurchasesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  type TxRow = { id: string; investor_total: number; sourcing_fee: number; platform_fee: number; vat_amount: number; stripe_payment_intent_id: string | null; created_at: string; deals: { id: string; title: string; city: string; postcode: string; deal_type: string } | null };

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, deals(id, title, city, postcode, deal_type)")
    .eq("investor_id", user.id)
    .order("created_at", { ascending: false });

  const list: TxRow[] = (transactions as unknown as TxRow[]) ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-navy mb-2">My Purchases</h1>
      <p className="text-navy/50 text-sm mb-8">All deals you have successfully completed.</p>

      {list.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl px-8 py-16 text-center">
          <p className="text-navy/40 text-sm mb-4">No completed purchases yet.</p>
          <Link href="/deals" className="text-sm bg-teal text-navy font-semibold px-5 py-3 rounded-lg hover:bg-teal-400 transition-colors">
            Browse Deals
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {list.map((tx) => {
            const deal = tx.deals as { id: string; title: string; city: string; postcode: string; deal_type: string } | null;
            return (
              <div key={tx.id} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold bg-teal/10 text-teal px-2 py-0.5 rounded-full">
                        {deal?.deal_type ?? "Deal"}
                      </span>
                      <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    </div>
                    <p className="font-semibold text-navy">{deal?.title ?? "Deal"}</p>
                    <p className="text-navy/40 text-sm">{deal?.city} · {deal?.postcode}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-navy/40 mb-1">Total paid</p>
                    <p className="text-xl font-bold text-navy">{fmt(tx.investor_total)}</p>
                    <p className="text-xs text-navy/40 mt-1">
                      {new Date(tx.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-navy/40">Sourcing Fee</p>
                    <p className="text-sm font-semibold text-navy">{fmt(tx.sourcing_fee)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-navy/40">Buyer Protection Fee</p>
                    <p className="text-sm font-semibold text-navy">{fmt(tx.platform_fee)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-navy/40">VAT</p>
                    <p className="text-sm font-semibold text-navy">{fmt(tx.vat_amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-navy/40">Stripe Reference</p>
                    <p className="text-xs font-mono text-navy/60 truncate">{tx.stripe_payment_intent_id ?? "—"}</p>
                  </div>
                </div>

                {deal && (
                  <div className="mt-4">
                    <Link href={`/deals/${deal.id}`} className="text-sm text-teal font-semibold hover:text-teal-400 transition-colors">
                      View Deal →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}