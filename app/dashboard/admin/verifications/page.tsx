export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VerificationReview from "@/components/dashboard/VerificationReview";
import type { VerificationDocument } from "@/types/database";

export default async function AdminVerificationsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch all docs that are pending review
  const { data: pendingDocs } = await supabase
    .from("verification_documents")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const allDocs = pendingDocs ?? [];

  // Get unique user IDs who have at least one pending doc
  const userIds = [...new Set(allDocs.map((d) => d.user_id))];

  const { data: pendingProfiles } = userIds.length > 0
    ? await supabase
        .from("profiles")
        .select("id, full_name, email, role, verification_status")
        .in("id", userIds)
        .order("created_at", { ascending: true })
    : { data: [] };

  const profiles = pendingProfiles ?? [];

  const docsByUser: Record<string, VerificationDocument[]> = {};
  for (const doc of allDocs ?? []) {
    if (!docsByUser[doc.user_id]) docsByUser[doc.user_id] = [];
    docsByUser[doc.user_id]!.push(doc);
  }

  const users = profiles.map((p) => ({
    userId: p.id,
    fullName: p.full_name,
    email: p.email,
    role: p.role,
    verificationStatus: p.verification_status,
    documents: docsByUser[p.id] ?? [],
  }));

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Verifications</h1>
          <p className="text-navy/50 text-sm mt-0.5">
            {users.length === 0
              ? "No pending verifications"
              : `${users.length} account${users.length !== 1 ? "s" : ""} awaiting review`}
          </p>
        </div>
      </div>

      <VerificationReview users={users} adminId={user.id} />
    </div>
  );
}