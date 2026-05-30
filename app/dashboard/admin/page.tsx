export const dynamic = "force-dynamic";

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
  approved:      "bg-teal/10 text-teal",
  pending:       "bg-amber-50 text-amber-700",
  not_submitted: "bg-gray-100 text-gray-500",
  rejected:      "bg-red-50 text-red-600",
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: pendingVerifications },
    { count: activeDeals },
    { data: revenue },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "pending"),
    supabase
      .from("deals")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("transactions")
      .select("platform_revenue")
      .eq("status", "completed"),
    supabase
      .from("profiles")
      .select("id, full_name, email, role, verification_status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const platformRevenue = (revenue ?? []).reduce(
    (sum, t) => sum + (t.platform_revenue ?? 0),
    0
  );

  const statCards = [
    { label: "Total Users",            value: totalUsers ?? 0,           href: "/dashboard/admin/users" },
    { label: "Pending Verifications",  value: pendingVerifications ?? 0, href: "/dashboard/admin/verifications" },
    { label: "Active Deals",           value: activeDeals ?? 0,          href: "/dashboard/admin/deals" },
    { label: "Platform Revenue",       value: formatGBP(platformRevenue),href: "/dashboard/admin/transactions" },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Admin Overview</h1>
        <p className="text-navy/50 text-sm mt-0.5">Platform health at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-teal/40 transition-colors group"
          >
            <p className="text-xs font-medium text-navy/40 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold text-navy mt-2 group-hover:text-teal transition-colors">
              {s.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent users */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-navy text-sm">Recent Users</h2>
          <Link
            href="/dashboard/admin/users"
            className="text-xs text-teal hover:text-teal-400 transition-colors font-medium"
          >
            View all →
          </Link>
        </div>

        {(recentUsers ?? []).length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-navy/40 text-sm">No users yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {(recentUsers ?? []).map((u) => (
              <div key={u.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-navy">{u.full_name ?? u.email}</p>
                  <p className="text-xs text-navy/40 mt-0.5 capitalize">{u.role}</p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[u.verification_status] ?? ""}`}
                >
                  {u.verification_status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}