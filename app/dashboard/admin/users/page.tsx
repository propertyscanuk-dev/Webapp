export const dynamic = "force-dynamic";

import { supabaseAdmin } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const STATUS_BADGE: Record<string, string> = {
  not_submitted: "bg-gray-100 text-gray-500",
  pending:       "bg-amber-100 text-amber-700",
  approved:      "bg-green-100 text-green-700",
  rejected:      "bg-red-100 text-red-700",
};

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: users } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, email, role, verification_status, created_at, company_name")
    .order("created_at", { ascending: false });

  const list = users ?? [];
  const sourcers  = list.filter(u => u.role === "sourcer");
  const investors = list.filter(u => u.role === "investor");

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-1">All Users</h1>
          <p className="text-navy/50 text-sm">{list.length} total · {sourcers.length} sourcers · {investors.length} investors</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Role</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Verification</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-navy/40 uppercase tracking-wider">Joined</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-navy">{u.full_name ?? "—"}</p>
                  {u.company_name && <p className="text-xs text-navy/40">{u.company_name}</p>}
                </td>
                <td className="px-5 py-4 text-navy/60">{u.email}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    u.role === "sourcer" ? "bg-teal/10 text-teal" :
                    u.role === "admin"   ? "bg-purple-100 text-purple-700" :
                    "bg-blue-50 text-blue-700"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_BADGE[u.verification_status ?? "not_submitted"]}`}>
                    {(u.verification_status ?? "not_submitted").replace("_", " ")}
                  </span>
                </td>
                <td className="px-5 py-4 text-navy/40 text-xs">
                  {new Date(u.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-5 py-4">
                  {u.verification_status === "pending" && (
                    <Link href="/dashboard/admin/verifications" className="text-xs text-teal font-semibold hover:text-teal-400 transition-colors">
                      Review →
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {list.length === 0 && (
          <div className="px-5 py-16 text-center text-navy/40 text-sm">No users yet.</div>
        )}
      </div>
    </div>
  );
}