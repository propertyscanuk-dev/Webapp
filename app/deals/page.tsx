import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Deal } from "@/types/database";

const TYPE_PHOTOS: Record<string, string> = {
  BTL:  "https://images.unsplash.com/photo-1582407947304-fd86f28f9f3e?w=800&q=80&auto=format&fit=crop",
  HMO:  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80&auto=format&fit=crop",
  BRRR: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80&auto=format&fit=crop",
  Flip: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop",
};

function formatGBP(pence: number) {
  return (pence / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });
}

const TYPE_COLOURS: Record<string, string> = {
  BTL:  "bg-blue-50 text-blue-700",
  HMO:  "bg-purple-50 text-purple-700",
  BRRR: "bg-orange-50 text-orange-700",
  Flip: "bg-pink-50 text-pink-600",
};

function DealCard({ deal }: { deal: Deal }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-teal/40 hover:shadow-sm transition-all group">
      {/* Photo */}
      <div className="h-40 relative">
        <Image
          src={TYPE_PHOTOS[deal.deal_type] ?? TYPE_PHOTOS.BTL}
          alt={deal.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLOURS[deal.deal_type] ?? "bg-gray-100 text-gray-600"}`}
        >
          {deal.deal_type}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-sm font-semibold text-navy leading-snug mb-1 group-hover:text-teal transition-colors line-clamp-2">
          {deal.title}
        </h3>
        <p className="text-xs text-navy/40 mb-4">
          {deal.city} · {deal.postcode}
        </p>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <p className="text-xs text-navy/40">Asking Price</p>
            <p className="text-sm font-semibold text-navy">{formatGBP(deal.asking_price)}</p>
          </div>
          <div>
            <p className="text-xs text-navy/40">Sourcing Fee</p>
            <p className="text-sm font-semibold text-teal">{formatGBP(deal.sourcing_fee)}</p>
          </div>
          {deal.gross_yield_percent && (
            <div>
              <p className="text-xs text-navy/40">Gross Yield</p>
              <p className="text-sm font-semibold text-navy">{deal.gross_yield_percent}%</p>
            </div>
          )}
          {deal.roi_percent && (
            <div>
              <p className="text-xs text-navy/40">ROI</p>
              <p className="text-sm font-semibold text-navy">{deal.roi_percent}%</p>
            </div>
          )}
          {deal.bmv_percent && (
            <div>
              <p className="text-xs text-navy/40">BMV</p>
              <p className="text-sm font-semibold text-navy">{deal.bmv_percent}%</p>
            </div>
          )}
          {deal.monthly_rent && (
            <div>
              <p className="text-xs text-navy/40">Monthly Rent</p>
              <p className="text-sm font-semibold text-navy">{formatGBP(deal.monthly_rent)}/mo</p>
            </div>
          )}
        </div>

        <Link
          href={`/deals/${deal.id}`}
          className="block w-full text-center text-sm bg-navy text-white font-medium py-2.5 rounded-lg hover:bg-navy-700 transition-colors"
        >
          View Deal
        </Link>
      </div>
    </div>
  );
}

export default async function DealsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch profile if logged in
  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("role, verification_status")
        .eq("id", user.id)
        .single()
    : { data: null };

  // Fetch active deals — RLS will return [] if user isn't a verified investor
  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const dealList = deals ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-navy text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Deal Marketplace</h1>
          <p className="text-white/60 text-sm">
            Verified off-market property deals from AML-compliant sourcers.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Not logged in */}
        {!user && (
          <div className="bg-white border border-gray-200 rounded-xl px-8 py-12 text-center max-w-lg mx-auto">
            <p className="text-navy font-semibold mb-2">Sign in to view deals</p>
            <p className="text-navy/50 text-sm mb-6">
              PropertyScan is a verified-only marketplace. Create an investor account to access all active deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login"
                className="text-sm bg-navy text-white font-semibold px-5 py-3 rounded-lg hover:bg-navy-700 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register?role=investor"
                className="text-sm bg-teal text-navy font-semibold px-5 py-3 rounded-lg hover:bg-teal-400 transition-colors"
              >
                Create Investor Account
              </Link>
            </div>
          </div>
        )}

        {/* Logged in but not verified investor */}
        {user && profile?.role === "investor" && profile.verification_status !== "approved" && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-8 py-10 text-center max-w-lg mx-auto">
            <p className="text-amber-800 font-semibold mb-2">Verification required</p>
            <p className="text-amber-700 text-sm mb-6">
              {profile.verification_status === "pending"
                ? "Your verification documents are under review. We'll notify you once your account is approved — usually within 1 business day."
                : "Complete your investor verification to access the deal marketplace."}
            </p>
            {profile.verification_status !== "pending" && (
              <Link
                href="/dashboard/investor/verification"
                className="text-sm bg-amber-700 text-white font-medium px-5 py-3 rounded-lg hover:bg-amber-800 transition-colors"
              >
                Complete Verification →
              </Link>
            )}
          </div>
        )}

        {/* Sourcer browsing */}
        {user && profile?.role === "sourcer" && (
          <div className="bg-white border border-gray-200 rounded-xl px-8 py-10 text-center max-w-lg mx-auto">
            <p className="text-navy font-semibold mb-2">You&apos;re logged in as a sourcer</p>
            <p className="text-navy/50 text-sm mb-6">
              The deal marketplace is for investors. Head to your dashboard to manage your deals.
            </p>
            <Link
              href="/dashboard/sourcer"
              className="text-sm bg-navy text-white font-semibold px-5 py-3 rounded-lg hover:bg-navy-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        {/* Verified investor — show deals */}
        {user && profile?.role === "investor" && profile.verification_status === "approved" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-navy/50">
                {dealList.length} {dealList.length === 1 ? "deal" : "deals"} available
              </p>
            </div>

            {dealList.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl px-8 py-16 text-center">
                <p className="text-navy/40 text-sm">No active deals at the moment. Check back soon.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {dealList.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
