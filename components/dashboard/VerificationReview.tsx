"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { approveUserAction, rejectUserAction } from "@/app/dashboard/admin/verifications/actions";
import type { VerificationDocument } from "@/types/database";

const DOC_LABELS: Record<string, string> = {
  photo_id:                 "Photo ID",
  proof_of_address:         "Proof of Address",
  aml_certificate:          "AML Certificate",
  prs_membership:           "PRS Membership",
  pi_insurance:             "PI Insurance",
  ico_registration:         "ICO Registration",
  proof_of_funds:           "Proof of Funds",
  source_of_wealth:         "Source of Wealth",
  investment_questionnaire: "Investment Questionnaire",
};

interface UserVerification {
  userId: string;
  fullName: string | null;
  email: string;
  role: string;
  verificationStatus: string;
  documents: VerificationDocument[];
}

interface Props {
  users: UserVerification[];
  adminId: string;
}

export default function VerificationReview({ users: initialUsers, adminId }: Props) {
  const supabase = createClient();
  const [users, setUsers] = useState(initialUsers);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({});
  const [rejectingUser, setRejectingUser] = useState<string | null>(null);
  const [rejectUserReason, setRejectUserReason] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  async function approveDoc(docId: string, userId: string) {
    setBusy((p) => ({ ...p, [docId]: true }));
    await supabase
      .from("verification_documents")
      .update({ status: "approved", reviewed_by: adminId, reviewed_at: new Date().toISOString() })
      .eq("id", docId);
    refreshUser(userId);
    setBusy((p) => ({ ...p, [docId]: false }));
  }

  async function rejectDoc(docId: string, userId: string) {
    const notes = rejectNotes[docId] ?? "";
    if (!notes.trim()) return;
    setBusy((p) => ({ ...p, [docId]: true }));
    await supabase
      .from("verification_documents")
      .update({ status: "rejected", admin_notes: notes, reviewed_by: adminId, reviewed_at: new Date().toISOString() })
      .eq("id", docId);
    setRejecting(null);
    refreshUser(userId);
    setBusy((p) => ({ ...p, [docId]: false }));
  }

  async function approveUser(userId: string) {
    setBusy((p) => ({ ...p, [userId]: true }));
    await approveUserAction(userId);
    setUsers((prev) => prev.filter((u) => u.userId !== userId));
    setBusy((p) => ({ ...p, [userId]: false }));
  }

  async function rejectUser(userId: string) {
    const reason = rejectUserReason[userId]?.trim();
    if (!reason) return;
    setBusy((p) => ({ ...p, [userId]: true }));
    await rejectUserAction(userId, reason);
    setUsers((prev) => prev.filter((u) => u.userId !== userId));
    setRejectingUser(null);
    setBusy((p) => ({ ...p, [userId]: false }));
  }

  async function refreshUser(userId: string) {
    const { data: docs } = await supabase
      .from("verification_documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setUsers((prev) =>
      prev.map((u) => (u.userId === userId ? { ...u, documents: docs ?? [] } : u))
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 px-6 py-16 text-center">
        <p className="text-navy/40 text-sm">No pending verifications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {users.map((user) => {
        const allDocsApproved = user.documents.length > 0 && user.documents.every((d) => d.status === "approved");

        return (
          <div key={user.userId} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* User header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div>
                <p className="text-sm font-semibold text-navy">
                  {user.fullName ?? user.email}
                </p>
                <p className="text-xs text-navy/40 mt-0.5">
                  {user.email} · <span className="capitalize">{user.role}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                {allDocsApproved && (
                  <button
                    onClick={() => approveUser(user.userId)}
                    disabled={busy[user.userId]}
                    className="text-sm bg-teal text-navy font-semibold px-4 py-2 rounded-lg hover:bg-teal-400 transition-colors disabled:opacity-50"
                  >
                    {busy[user.userId] ? "…" : "Approve Account"}
                  </button>
                )}
                {rejectingUser === user.userId ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Reason for rejection…"
                      value={rejectUserReason[user.userId] ?? ""}
                      onChange={(e) => setRejectUserReason((p) => ({ ...p, [user.userId]: e.target.value }))}
                      className="text-xs border border-red-200 rounded-lg px-3 py-2 text-navy placeholder-navy/30 focus:outline-none focus:ring-2 focus:ring-red-200 w-52"
                    />
                    <button
                      onClick={() => rejectUser(user.userId)}
                      disabled={busy[user.userId] || !rejectUserReason[user.userId]?.trim()}
                      className="text-xs bg-red-500 text-white font-medium px-3 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {busy[user.userId] ? "…" : "Confirm"}
                    </button>
                    <button
                      onClick={() => setRejectingUser(null)}
                      className="text-xs text-navy/40 hover:text-navy px-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setRejectingUser(user.userId)}
                    disabled={busy[user.userId]}
                    className="text-sm bg-red-50 text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    Reject Account
                  </button>
                )}
              </div>
            </div>

            {/* Documents */}
            {user.documents.length === 0 ? (
              <p className="px-6 py-4 text-xs text-navy/40">No documents uploaded yet.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {user.documents.map((doc) => (
                  <div key={doc.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-navy">
                            {DOC_LABELS[doc.document_type] ?? doc.document_type}
                          </p>
                          <StatusBadge status={doc.status} />
                        </div>
                        <p className="text-xs text-navy/40 mt-0.5 truncate">{doc.file_name}</p>
                        {doc.admin_notes && (
                          <p className="text-xs text-red-500 mt-1">{doc.admin_notes}</p>
                        )}

                        {rejecting === doc.id && (
                          <div className="mt-3 flex gap-2">
                            <input
                              type="text"
                              placeholder="Rejection reason…"
                              value={rejectNotes[doc.id] ?? ""}
                              onChange={(e) =>
                                setRejectNotes((p) => ({ ...p, [doc.id]: e.target.value }))
                              }
                              className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 text-navy placeholder-navy/30 focus:outline-none focus:ring-2 focus:ring-red-200"
                            />
                            <button
                              onClick={() => rejectDoc(doc.id, user.userId)}
                              disabled={busy[doc.id] || !rejectNotes[doc.id]?.trim()}
                              className="text-xs bg-red-500 text-white font-medium px-3 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setRejecting(null)}
                              className="text-xs text-navy/40 hover:text-navy px-2"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>

                      {doc.status === "pending" && rejecting !== doc.id && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => approveDoc(doc.id, user.userId)}
                            disabled={busy[doc.id]}
                            className="text-xs bg-teal/10 text-teal font-medium px-3 py-1.5 rounded-lg hover:bg-teal/20 transition-colors disabled:opacity-50"
                          >
                            {busy[doc.id] ? "…" : "Approve"}
                          </button>
                          <button
                            onClick={() => setRejecting(doc.id)}
                            className="text-xs bg-red-50 text-red-500 font-medium px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:       "bg-amber-50 text-amber-700",
    approved:      "bg-teal/10 text-teal",
    rejected:      "bg-red-50 text-red-600",
    not_submitted: "bg-gray-100 text-gray-500",
  };
  const labels: Record<string, string> = {
    pending: "Pending", approved: "Approved", rejected: "Rejected", not_submitted: "Not submitted",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] ?? ""}`}>
      {labels[status] ?? status}
    </span>
  );
}
