"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  dealId: string;
  revieweeId: string;
  revieweeName: string;
  existingRating?: number;
  existingComment?: string | null;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-7 h-7 transition-colors ${filled ? "text-amber-400" : "text-gray-200"}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function LeaveReviewButton({ dealId, revieweeId, revieweeName, existingRating, existingComment }: Props) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(existingRating ?? 0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(existingComment ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(!!existingRating);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (rating === 0) { setError("Please select a star rating."); return; }
    setSubmitting(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not authenticated."); setSubmitting(false); return; }

    const { error: dbError } = await supabase.from("reviews").insert({
      deal_id: dealId,
      reviewer_id: user.id,
      reviewee_id: revieweeId,
      rating,
      comment: comment.trim() || null,
    });

    if (dbError) {
      setError(dbError.message.includes("unique") ? "You have already reviewed this deal." : dbError.message);
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setOpen(false);
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-1.5 mt-3">
        {[1,2,3,4,5].map((s) => <StarIcon key={s} filled={s <= rating} />)}
        <span className="text-xs text-navy/40 ml-1">Your review</span>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-sm font-semibold text-teal hover:text-teal-400 transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Rate {revieweeName}
        </button>
      ) : (
        <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-5">
          <p className="text-sm font-semibold text-navy mb-3">Rate {revieweeName}</p>

          <div className="flex items-center gap-1 mb-4">
            {[1,2,3,4,5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                className="focus:outline-none"
              >
                <StarIcon filled={s <= (hover || rating)} />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-navy/40">
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
              </span>
            )}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment (optional)…"
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal resize-none mb-3"
          />

          {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              onClick={submit}
              disabled={submitting}
              className="text-sm font-bold bg-teal text-navy px-5 py-2.5 rounded-lg hover:bg-teal-400 transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-navy/40 hover:text-navy transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
