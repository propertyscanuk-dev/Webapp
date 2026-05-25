import { supabaseAdmin } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

function fmt(pence: number) {
  return (pence / 100).toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
}

const STATUS_BADGE: Record<string, string> = {
  draft:     "bg-gray-100 text-gray-500",
  active:    "bg-green-100 text-green-700",
  reserved:  "bg-amber-100 text-amber-700",
  sold:      "bg-blue-100 text-blue-700",
  withdrawn: "bg-red-100 text-red-700",
};

const TYPE_BADGE: Record<string, string> = {
  BTL:  "bg-blue-50 text-blue-700",
  HMO:  "bg-purple-50 text-purple-700",
  BRRR: "bg-orange-50 text-orange-700",
  Flip: "bg-pink-50 text-pink-600",
};

export default async function AdminDealsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: deals } = await supabaseAdmin
    .from("deals")
    .select("id, title, city, postcode, deal_type, asking_price, sourcing_fee, status, created_at, profiles!deals_sourcer_id_fkey(full_name, company_name)")
    .order("created_at", { ascending: false });

  const list = deals ?? [];
  const active   = list.filter(d => d.status === "active").length;
  const sold     = list.filter(d => d.status === "sold").length;
  const reserved = list.filter(d => d.status === "reserved").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy mb-1">All Deals</h1>
        <p className="text-navy/50 text-sm">
          {list.length} total · {active} active · {reserved} reserved · {sold} sold
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Deal</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Type</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Sourcer</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Asking</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Fee</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Listed</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.map((deal) => {
              const sourcer = deal.profiles as { full_name: string | null; company_name: string | null } | null;
              return (
                <tr key={deal.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-navy leading-snug">{deal.title}</p>
                    <p className="text-xs text-navy/40">{deal.city} · {deal.postcode}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${TYPE_BADGE[deal.deal_type] ?? "bg-gray-100 text-gray-600"}`}>
                      {deal.deal_type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-navy/60">
                    <p>{sourcer?.full_name ?? "—"}</p>
                    {sourcer?.company_name && <p className="text-xs text-navy/40">{sourcer.company_name}</p>}
                  </td>
                  <td className="px-5 py-4 font-semibold text-navy">{fmt(deal.asking_price)}</td>
                  <td className="px-5 py-4 font-semibold text-teal">{fmt(deal.sourcing_fee)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_BADGE[deal.status]}`}>
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-navy/40 text-xs">
                    {new Date(deal.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/deals/${deal.id}`} className="text-xs text-teal font-semibold hover:text-teal-400 transition-colors">
                      View →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {list.length === 0 && (
          <div className="px-5 py-16 text-center text-navy/40 text-sm">No deals yet.</div>
        )}
      </div>
    </div>
  );
}
