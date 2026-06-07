export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ReserveButton from "./ReserveButton";

const TYPE_COLOURS: Record<string, string> = {
  BTL:  "bg-blue-100 text-blue-800",
  HMO:  "bg-purple-100 text-purple-800",
  BRRR: "bg-orange-100 text-orange-800",
  Flip: "bg-pink-100 text-pink-800",
};

const TYPE_LABELS: Record<string, string> = {
  BTL:  "Buy to Let",
  HMO:  "House in Multiple Occupation",
  BRRR: "Buy, Refurb, Refinance, Rent",
  Flip: "Buy, Refurb & Sell",
};

const STATUS_DISPLAY: Record<string, { label: string; classes: string }> = {
  active:    { label: "Available",    classes: "bg-green-100 text-green-800" },
  reserved:  { label: "Reserved",     classes: "bg-amber-100 text-amber-800" },
  sold:      { label: "Sold",         classes: "bg-gray-100 text-gray-500"   },
  withdrawn: { label: "Unavailable",  classes: "bg-red-100 text-red-700"     },
};

function formatGBP(pence: number) {
  return (pence / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });
}

function MetricCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <p className="text-xs font-medium text-navy/40 uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? "text-teal" : "text-navy"}`}>{value}</p>
    </div>
  );
}

export default async function DealDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string }>;
}) {
  const { id } = await params;
  const { payment } = await searchParams;
  const paymentSuccess = payment === "success";
  const supabase = await createClient();

  const [
    { data: { user } },
    { data: deal },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("deals").select("*").eq("id", id).single(),
  ]);

  if (!deal) {
    if (paymentSuccess) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-10 max-w-md w-full text-center">
            <div className="w-14 h-14 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-navy mb-2">Payment Confirmed</h1>
            <p className="text-navy/50 text-sm leading-relaxed mb-6">
              Your payment was successful. The deal pack will be available in your dashboard shortly.
            </p>
            <Link
              href="/dashboard/investor/purchases"
              className="block w-full bg-teal text-navy font-bold py-3.5 px-6 rounded-xl hover:bg-teal-400 transition-colors text-sm"
            >
              View My Purchases →
            </Link>
          </div>
        </div>
      );
    }
    notFound();
  }

  // Fetch supporting data in parallel
  const [
    { data: photos },
    profileResult,
    sourcerResult,
    { data: sourcerReviews },
  ] = await Promise.all([
    supabase
      .from("deal_photos")
      .select("*")
      .eq("deal_id", id)
      .order("display_order", { ascending: true }),
    user
      ? supabase.from("profiles").select("role, verification_status").eq("id", user.id).single()
      : Promise.resolve({ data: null }),
    supabase
      .from("profiles")
      .select("id, full_name, company_name, verification_status")
      .eq("id", deal.sourcer_id)
      .single(),
    supabase
      .from("reviews")
      .select("id, rating, comment, created_at, reviewer:profiles!reviews_reviewer_id_fkey(full_name)")
      .eq("reviewee_id", deal.sourcer_id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const profile = profileResult.data;
  const sourcer = sourcerResult.data;
  const photoList = photos ?? [];

  type ReviewRow = { id: string; rating: number; comment: string | null; created_at: string; reviewer: { full_name: string | null } | null };
  const reviews = (sourcerReviews ?? []) as unknown as ReviewRow[];
  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const photoUrl = (path: string) =>
    `${supabaseUrl}/storage/v1/object/public/deal-photos/${path}`;

  // Deal pack is generated on-demand via /api/deals/[id]/pack
  const dealPackUrl = `/api/deals/${id}/pack`;

  const isVerifiedInvestor =
    user && profile?.role === "investor" && profile.verification_status === "approved";

  const reservedByMe = deal.reserved_by === user?.id;

  const platformFee = Math.round(deal.sourcing_fee * 0.05);
  const platformFeeVat = Math.round(platformFee * 0.2);
  const investorTotal = deal.sourcing_fee + platformFee + platformFeeVat;

  const heroPhoto = photoList[0];
  const galleryPhotos = photoList.slice(1);

  const statusDisplay = STATUS_DISPLAY[deal.status] ?? STATUS_DISPLAY.active;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero Image ──────────────────────────────────────────────── */}
      <div className="relative bg-navy h-72 sm:h-96 lg:h-[480px] overflow-hidden">
        {heroPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl(heroPhoto.storage_path)}
            alt={deal.title}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-24 h-24 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
            </svg>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />

        {/* Badges overlaid bottom-left */}
        <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 flex items-center gap-3">
          <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${TYPE_COLOURS[deal.deal_type] ?? "bg-gray-100 text-gray-600"}`}>
            {deal.deal_type}
          </span>
          <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${statusDisplay.classes}`}>
            {statusDisplay.label}
          </span>
        </div>

        {/* Breadcrumb top-left */}
        <div className="absolute top-5 left-5 sm:top-6 sm:left-8">
          <Link
            href="/deals"
            className="text-white/70 hover:text-white text-sm flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Deal Marketplace
          </Link>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">

          {/* ── Left column (2/3) ────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8 mb-10 lg:mb-0">

            {/* Title + address */}
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs font-semibold text-teal uppercase tracking-widest">
                  {TYPE_LABELS[deal.deal_type] ?? deal.deal_type}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-navy leading-snug mb-3">
                {deal.title}
              </h1>
              <p className="text-navy/50 flex items-center gap-1.5">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {[deal.address_line1, deal.address_line2, deal.city, deal.postcode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>

            {/* Financial metrics */}
            <div>
              <h2 className="text-sm font-semibold text-navy/40 uppercase tracking-widest mb-4">
                Financial Overview
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <MetricCard label="Asking Price"    value={formatGBP(deal.asking_price)} />
                <MetricCard label="Sourcing Fee"    value={formatGBP(deal.sourcing_fee)} highlight />
                {deal.monthly_rent && (
                  <MetricCard label="Monthly Rent"  value={`${formatGBP(deal.monthly_rent)}/mo`} />
                )}
                {deal.gross_yield_percent != null && (
                  <MetricCard label="Gross Yield"   value={`${deal.gross_yield_percent}%`} />
                )}
                {deal.roi_percent != null && (
                  <MetricCard label="ROI"           value={`${deal.roi_percent}%`} />
                )}
                {deal.bmv_percent != null && (
                  <MetricCard label="Below Market Value" value={`${deal.bmv_percent}%`} />
                )}
              </div>
            </div>

            {/* Description */}
            {deal.description && (
              <div>
                <h2 className="text-sm font-semibold text-navy/40 uppercase tracking-widest mb-4">
                  Deal Overview
                </h2>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <p className="text-navy/70 leading-relaxed whitespace-pre-line">
                    {deal.description}
                  </p>
                </div>
              </div>
            )}

            {/* Photo gallery */}
            {galleryPhotos.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-navy/40 uppercase tracking-widest mb-4">
                  Property Photos
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {galleryPhotos.map((photo) => (
                    <div key={photo.id} className="aspect-video rounded-xl overflow-hidden bg-navy/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoUrl(photo.storage_path)}
                        alt=""
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sourcer reviews */}
            {reviews.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-navy/40 uppercase tracking-widest mb-4">
                  Sourcer Reviews
                </h2>
                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-5">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map((s) => (
                            <svg key={s} className={`w-4 h-4 ${s <= r.rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-navy/30">
                          {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-navy mb-1">{r.reviewer?.full_name ?? "Verified Investor"}</p>
                      {r.comment && <p className="text-sm text-navy/60 leading-relaxed">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compliance disclaimer */}
            <div className="bg-navy/5 rounded-xl border border-navy/10 p-6">
              <p className="text-xs font-semibold text-navy/40 uppercase tracking-widest mb-3">
                Important Compliance Information
              </p>
              <div className="space-y-2 text-xs text-navy/50 leading-relaxed">
                <p>
                  PropertyScan is an AML-compliant property deal marketplace that facilitates introductions between verified property professionals. We do not provide financial advice.
                </p>
                <p>
                  All sourcers on this platform have completed AML verification in line with the Money Laundering Regulations 2017. Investors are responsible for conducting their own due diligence before transacting. Past returns are not indicative of future performance.
                </p>
                <p>
                  Sourcing fees are non-refundable once a deal pack has been accessed. By reserving a deal, you confirm you are a sophisticated investor or high net worth individual as defined under the Financial Services and Markets Act 2000 (Financial Promotion) Order 2005.
                </p>
              </div>
            </div>
          </div>

          {/* ── Right column — sticky sidebar (1/3) ──────────────────── */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 space-y-5">

              {/* Sourcer card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <p className="text-xs font-semibold text-navy/40 uppercase tracking-widest mb-4">
                  Listed by
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">
                      {sourcer?.full_name ?? "Verified Sourcer"}
                    </p>
                    {sourcer?.company_name && (
                      <p className="text-navy/50 text-xs">{sourcer.company_name}</p>
                    )}
                  </div>
                </div>
                {sourcer?.verification_status === "approved" && (
                  <div className="mt-4 flex items-center gap-2 bg-teal/10 rounded-lg px-3 py-2.5">
                    <svg className="w-4 h-4 text-teal shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-teal text-xs font-semibold">AML Verified · PRS Aligned</span>
                  </div>
                )}
                {avgRating !== null && (
                  <div className="mt-3 flex items-center gap-1.5">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                    <span className="text-xs text-navy/40 ml-1">{avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
                  </div>
                )}
              </div>

              {/* Fee summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <p className="text-xs font-semibold text-navy/40 uppercase tracking-widest mb-4">
                  Fee Summary
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-navy/60">Asking price</span>
                    <span className="font-semibold text-navy">{formatGBP(deal.asking_price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-navy/60">Sourcing fee</span>
                    <span className="font-semibold text-navy">{formatGBP(deal.sourcing_fee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-navy/60">Buyer protection fee (5%)</span>
                    <span className="font-medium text-navy">{formatGBP(platformFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-navy/60">VAT on buyer protection fee</span>
                    <span className="font-medium text-navy">{formatGBP(platformFeeVat)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                    <span className="font-semibold text-navy text-sm">You pay (sourcing fee total)</span>
                    <span className="font-bold text-teal text-xl">{formatGBP(investorTotal)}</span>
                  </div>
                </div>
                <p className="text-navy/30 text-xs mt-3 leading-relaxed">
                  Property price negotiated directly with the vendor. Sourcing fee payable to PropertyScan via Stripe.
                </p>
              </div>

              {/* Action area */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">

                {/* Not logged in */}
                {!user && (
                  <div className="space-y-3">
                    <p className="text-navy font-semibold text-sm">Sign in to reserve this deal</p>
                    <p className="text-navy/50 text-xs leading-relaxed">
                      PropertyScan is a verified-only marketplace. Create an investor account to access deal packs and reserve deals.
                    </p>
                    <Link
                      href="/register?role=investor"
                      className="block w-full text-center bg-teal text-navy font-bold py-3.5 px-6 rounded-xl hover:bg-teal-400 transition-colors text-sm"
                    >
                      Create Investor Account
                    </Link>
                    <Link
                      href="/login"
                      className="block w-full text-center text-navy/60 font-medium py-3 px-6 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
                    >
                      Log In
                    </Link>
                  </div>
                )}

                {/* Sourcer browsing */}
                {user && profile?.role === "sourcer" && (
                  <div>
                    <p className="text-navy/60 text-sm leading-relaxed">
                      You&apos;re logged in as a sourcer. The marketplace is for investors.
                    </p>
                    <Link
                      href="/dashboard/sourcer"
                      className="block mt-3 text-center text-sm text-teal font-medium hover:underline"
                    >
                      Go to your dashboard →
                    </Link>
                  </div>
                )}

                {/* Investor — not verified */}
                {user && profile?.role === "investor" && profile.verification_status !== "approved" && (
                  <div className="space-y-3">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                      <p className="text-amber-800 font-semibold text-sm mb-1">Verification required</p>
                      <p className="text-amber-700 text-xs leading-relaxed">
                        {profile.verification_status === "pending"
                          ? "Your documents are under review. You'll be notified once approved — usually within 1 business day."
                          : "Complete your investor verification to reserve deals."}
                      </p>
                    </div>
                    {profile.verification_status !== "pending" && (
                      <Link
                        href="/dashboard/investor/verification"
                        className="block w-full text-center bg-amber-600 text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-amber-700 transition-colors text-sm"
                      >
                        Complete Verification →
                      </Link>
                    )}
                  </div>
                )}

                {/* Verified investor — deal active */}
                {isVerifiedInvestor && deal.status === "active" && (
                  <ReserveButton
                    dealId={deal.id}
                    dealTitle={deal.title}
                    sourcingFee={deal.sourcing_fee}
                    paymentSuccess={paymentSuccess}
                  />
                )}

                {/* Verified investor — reserved by them */}
                {isVerifiedInvestor && deal.status === "reserved" && reservedByMe && (
                  <div className="bg-teal/10 border border-teal/30 rounded-xl px-5 py-5 text-center">
                    <div className="text-teal font-bold text-base mb-1">Reserved by You</div>
                    <p className="text-navy/60 text-xs leading-relaxed">
                      Our team will contact you within 1 business day to arrange payment.
                    </p>
                  </div>
                )}

                {/* Verified investor — reserved by someone else */}
                {isVerifiedInvestor && deal.status === "reserved" && !reservedByMe && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-5 text-center">
                    <div className="text-amber-800 font-bold text-base mb-1">Currently Reserved</div>
                    <p className="text-amber-700 text-xs">
                      This deal is reserved. Check back if it becomes available again.
                    </p>
                  </div>
                )}

                {/* Sold */}
                {isVerifiedInvestor && deal.status === "sold" && (
                  <div className="bg-gray-100 rounded-xl px-5 py-5 text-center">
                    <div className="text-gray-500 font-bold text-base">Deal Sold</div>
                    <Link href="/deals" className="text-teal text-xs mt-1 block hover:underline">
                      Browse other deals →
                    </Link>
                  </div>
                )}

              </div>

              {/* Message sourcer */}
              {isVerifiedInvestor && sourcer && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-xs font-semibold text-navy/40 uppercase tracking-widest mb-4">
                    Contact Sourcer
                  </p>
                  <Link
                    href={`/dashboard/investor/messages?deal=${deal.id}&with=${sourcer.id}`}
                    className="flex items-center gap-3 w-full bg-gray-50 border border-gray-200 text-navy font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors text-sm"
                  >
                    <svg className="w-4 h-4 shrink-0 text-navy/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Message {sourcer.full_name ?? "Sourcer"}
                  </Link>
                </div>
              )}

              {/* Deal pack download */}
              {isVerifiedInvestor && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-xs font-semibold text-navy/40 uppercase tracking-widest mb-4">
                    Deal Pack
                  </p>
                  <a
                    href={dealPackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full bg-navy text-white font-semibold py-3.5 px-5 rounded-xl hover:bg-navy-700 transition-colors text-sm"
                  >
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Deal Pack PDF
                  </a>
                  <p className="text-navy/30 text-xs mt-3 leading-relaxed">
                    Branded PropertyScan deal pack generated from verified deal data. Confidential — do not distribute.
                  </p>
                </div>
              )}

              {/* Compliance badges */}
              <div className="bg-navy rounded-xl p-5">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-4">
                  Platform Compliance
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: "🛡", label: "AML Compliant" },
                    { icon: "🏠", label: "PRS Aligned" },
                    { icon: "🔒", label: "ICO Registered" },
                    { icon: "✓",  label: "Escrow Protected" },
                  ].map((b) => (
                    <div
                      key={b.label}
                      className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
                    >
                      <span className="text-sm">{b.icon}</span>
                      <span className="text-white/70 text-xs font-medium">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
