"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { DealStatus } from "@/types/database";

interface Props {
  dealId: string;
  currentStatus: DealStatus;
  hasPack: boolean;
}

export default function DealActions({ dealId, currentStatus, hasPack }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const packInputRef = useRef<HTMLInputElement>(null);

  async function setStatus(status: DealStatus) {
    setBusy(true);
    const supabase = createClient();
    await supabase.from("deals").update({ status }).eq("id", dealId);
    router.refresh();
    setBusy(false);
  }

  async function uploadPack(file: File) {
    setUploading(true);
    setUploadError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUploading(false); return; }

    const path = `${user.id}/${dealId}/deal-pack.pdf`;
    const { error: storageErr } = await supabase.storage
      .from("deal-packs")
      .upload(path, file, { upsert: true });

    if (storageErr) {
      setUploadError("Upload failed — please try again.");
    } else {
      await supabase.from("deals").update({ deal_pack_url: path }).eq("id", dealId);
      router.refresh();
    }
    setUploading(false);
    if (packInputRef.current) packInputRef.current.value = "";
  }

  const canUploadPack = currentStatus === "draft" || currentStatus === "active" || currentStatus === "withdrawn";

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        {/* Deal pack upload */}
        {canUploadPack && (
          <>
            <input
              ref={packInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPack(f); }}
            />
            <button
              onClick={() => packInputRef.current?.click()}
              disabled={uploading || busy}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                hasPack
                  ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  : "bg-navy/5 text-navy/60 hover:bg-navy/10 border border-dashed border-navy/20"
              }`}
            >
              {uploading ? "Uploading…" : hasPack ? "Replace Pack" : "Upload Pack"}
            </button>
          </>
        )}

        {/* Status actions */}
        {currentStatus === "draft" && (
          <button
            onClick={() => setStatus("active")}
            disabled={busy || uploading}
            className="text-xs bg-teal/10 text-teal font-medium px-3 py-1.5 rounded-lg hover:bg-teal/20 transition-colors disabled:opacity-50"
          >
            {busy ? "…" : "Publish"}
          </button>
        )}
        {currentStatus === "active" && (
          <button
            onClick={() => setStatus("withdrawn")}
            disabled={busy || uploading}
            className="text-xs bg-gray-100 text-gray-600 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {busy ? "…" : "Withdraw"}
          </button>
        )}
        {currentStatus === "withdrawn" && (
          <button
            onClick={() => setStatus("active")}
            disabled={busy || uploading}
            className="text-xs bg-teal/10 text-teal font-medium px-3 py-1.5 rounded-lg hover:bg-teal/20 transition-colors disabled:opacity-50"
          >
            {busy ? "…" : "Re-publish"}
          </button>
        )}
      </div>
      {uploadError && (
        <p className="text-xs text-red-500">{uploadError}</p>
      )}
    </div>
  );
}
