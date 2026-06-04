"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";
import NotificationBell from "@/components/dashboard/NotificationBell";

type TopBarProfile = Pick<Profile, "id" | "full_name" | "email" | "role" | "verification_status">;

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  approved:      { label: "Verified",        cls: "bg-teal/10 text-teal" },
  pending:       { label: "Pending Review",   cls: "bg-amber-50 text-amber-700" },
  not_submitted: { label: "Not Verified",     cls: "bg-gray-100 text-gray-500" },
  rejected:      { label: "Rejected",         cls: "bg-red-50 text-red-600" },
};

export default function TopBar({ profile }: { profile: TopBarProfile }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const badge = STATUS_BADGE[profile.verification_status] ?? STATUS_BADGE.not_submitted;

  const initials = (profile.full_name ?? profile.email)
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.cls}`}>
        {badge.label}
      </span>

      <div className="flex items-center gap-4">
        <NotificationBell userId={profile.id} />
        <div className="text-right">
          <p className="text-sm font-semibold text-navy leading-tight">
            {profile.full_name ?? profile.email}
          </p>
          <p className="text-xs text-navy/40 capitalize">{profile.role}</p>
        </div>

        <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center text-teal text-sm font-bold shrink-0">
          {initials}
        </div>

        <button
          onClick={handleSignOut}
          title="Sign out"
          className="text-navy/30 hover:text-navy transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
}
