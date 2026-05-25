"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { DealStatus } from "@/types/database";

interface Props {
  dealId: string;
  currentStatus: DealStatus;
}

export default function DealActions({ dealId, currentStatus }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(status: DealStatus) {
    setBusy(true);
    const supabase = createClient();
    await supabase.from("deals").update({ status }).eq("id", dealId);
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex items-center gap-2">
      {currentStatus === "draft" && (
        <button
          onClick={() => setStatus("active")}
          disabled={busy}
          className="text-xs bg-teal/10 text-teal font-medium px-3 py-1.5 rounded-lg hover:bg-teal/20 transition-colors disabled:opacity-50"
        >
          {busy ? "…" : "Publish"}
        </button>
      )}
      {currentStatus === "active" && (
        <button
          onClick={() => setStatus("withdrawn")}
          disabled={busy}
          className="text-xs bg-gray-100 text-gray-600 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {busy ? "…" : "Withdraw"}
        </button>
      )}
      {currentStatus === "withdrawn" && (
        <button
          onClick={() => setStatus("active")}
          disabled={busy}
          className="text-xs bg-teal/10 text-teal font-medium px-3 py-1.5 rounded-lg hover:bg-teal/20 transition-colors disabled:opacity-50"
        >
          {busy ? "…" : "Re-publish"}
        </button>
      )}
    </div>
  );
}
