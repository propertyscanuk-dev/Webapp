"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { VerificationDocument } from "@/types/database";

export type DocConfig = {
  type: string;
  label: string;
  description: string;
  accept: string;
  downloadUrl?: string;
  downloadLabel?: string;
};

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  not_submitted: { label: "Not submitted", cls: "bg-gray-100 text-gray-500" },
  pending:       { label: "Under review",  cls: "bg-amber-50 text-amber-700" },
  approved:      { label: "Approved",      cls: "bg-teal/10 text-teal" },
  rejected:      { label: "Rejected",      cls: "bg-red-50 text-red-600" },
};

function IconCheck() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function DocRow({
  config,
  record,
  isUploading,
  error,
  onUpload,
}: {
  config: DocConfig;
  record: VerificationDocument | undefined;
  isUploading: boolean;
  error: string | undefined;
  onUpload: (file: File) => void;
})
 {
  const inputRef = useRef<HTMLInputElement>(null);
  const status = record?.status ?? "not_submitted";
  const sc = STATUS_CONFIG[status] ?? STATUS_CONFIG.not_submitted;
  const canUpload = status === "not_submitted" || status === "rejected";

  return (
    <div
      className={`bg-white rounded-xl border p-5 transition-colors ${
        status === "rejected" ? "border-red-200" : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1 flex-wrap">
            <p className="text-sm font-semibold text-navy">{config.label}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sc.cls}`}>
              {sc.label}
            </span>
          </div>
          <p className="text-xs text-navy/50 leading-relaxed">{config.description}</p>

          {config.downloadUrl && (
            <a
              href={config.downloadUrl}
              download
              className="inline-flex items-center gap-1 text-xs text-teal font-medium mt-2 hover:underline"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {config.downloadLabel ?? "Download template"}
            </a>
          )}

          {record?.file_name && status !== "not_submitted" && (
            <p className="text-xs text-navy/30 mt-1.5 truncate">
              {record.file_name}
            </p>
          )}

          {status === "rejected" && record?.admin_notes && (
            <p className="text-xs text-red-600 mt-2.5 bg-red-50 rounded-lg px-3 py-2 leading-relaxed">
              <strong>Reason: </strong>{record.admin_notes}
            </p>
          )}

          {error && (
            <p className="text-xs text-red-600 mt-2">{error}</p>
          )}
        </div>

        <div className="shrink-0 flex items-center">
          {canUpload && (
            <>
              <input
                ref={inputRef}
                type="file"
                accept={config.accept}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUpload(file);
                    e.target.value = "";
                  }
                }}
              />
              <button
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
                className="text-sm bg-navy text-white font-medium px-4 py-2 rounded-lg hover:bg-navy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isUploading ? "Uploading…" : status === "rejected" ? "Re-upload" : "Upload"}
              </button>
            </>
          )}

          {status === "pending" && (
            <span className="text-amber-500"><IconClock /></span>
          )}
          {status === "approved" && (
            <span className="text-teal"><IconCheck /></span>
          )}
        </div>
      </div>
    </div>
  );
}

interface VerificationDocsProps {
  docs: DocConfig[];
}

export default function VerificationDocs({ docs }: VerificationDocsProps) {
  const supabase = createClient();
  const [records, setRecords] = useState<VerificationDocument[]>([]);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("verification_documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setRecords(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  async function handleUpload(docType: string, file: File) {
    setUploading((prev) => ({ ...prev, [docType]: true }));
    setErrors((prev) => ({ ...prev, [docType]: "" }));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Max 10 MB
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [docType]: "File must be under 10 MB." }));
      setUploading((prev) => ({ ...prev, [docType]: false }));
      return;
    }

    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${user.id}/${docType}/${Date.now()}.${ext}`;

    const { error: storageError } = await supabase.storage
      .from("verification-docs")
      .upload(path, file);

    if (storageError) {
      setErrors((prev) => ({ ...prev, [docType]: storageError.message }));
      setUploading((prev) => ({ ...prev, [docType]: false }));
      return;
    }

    const { error: dbError } = await supabase.from("verification_documents").insert({
      user_id: user.id,
      document_type: docType,
      storage_path: path,
      file_name: file.name,
      status: "pending",
    });

    if (dbError) {
      setErrors((prev) => ({ ...prev, [docType]: dbError.message }));
    } else {
      await fetchRecords();
    }

    setUploading((prev) => ({ ...prev, [docType]: false }));
  }

  function getRecord(docType: string) {
    return records.find((r) => r.document_type === docType);
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {docs.map((d) => (
          <div key={d.type} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
            <div className="h-4 w-32 bg-gray-100 rounded mb-2" />
            <div className="h-3 w-64 bg-gray-50 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const statusOf = (d: DocConfig) => getRecord(d.type)?.status ?? "not_submitted";
  const allApproved = docs.every((d) => statusOf(d) === "approved");
  const allSubmitted = docs.every((d) => statusOf(d) !== "not_submitted");
  const anyPending = docs.some((d) => statusOf(d) === "pending");
  const submittedCount = docs.filter((d) => statusOf(d) !== "not_submitted").length;

  return (
    <div>
      {/* Progress indicator */}
      {!allApproved && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-navy">Progress</p>
            <p className="text-sm text-navy/50">
              {submittedCount} / {docs.length} submitted
            </p>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-2 bg-teal rounded-full transition-all duration-500"
              style={{ width: `${(submittedCount / docs.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Status banners */}
      {allApproved && (
        <div className="bg-teal/10 border border-teal/30 text-teal rounded-xl px-5 py-4 mb-6 text-sm font-semibold">
          All documents verified — your account is fully approved.
        </div>
      )}
      {!allApproved && allSubmitted && anyPending && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-5 py-4 mb-6 text-sm font-medium">
          Documents submitted and under review. We&apos;ll notify you once verification is complete (usually within 1 business day).
        </div>
      )}

      {/* Document list */}
      <div className="space-y-3">
        {docs.map((doc) => (
          <DocRow
            key={doc.type}
            config={doc}
            record={getRecord(doc.type)}
            isUploading={uploading[doc.type] ?? false}
            error={errors[doc.type]}
            onUpload={(file) => handleUpload(doc.type, file)}
          />
        ))}
      </div>

      {/* Help text */}
      <p className="text-xs text-navy/30 mt-6 text-center">
        Accepted formats: PDF, JPG, PNG · Max 10 MB per file · All documents are encrypted and stored securely.
      </p>
    </div>
  );
}
