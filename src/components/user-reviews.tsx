"use client";

import { useState, useEffect } from "react";

interface Review {
  display_name: string;
  role: string;
  review_text: string;
  roleplay_score: number | null;
}

export function UserReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || reviews.length === 0) return null;

  return (
    <div className="mt-20">
      <h2 className="mb-8 text-center text-2xl font-bold">利用者の声</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="rounded-2xl border border-card-border bg-card p-6"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="font-bold">{r.display_name}</p>
                {r.role && <p className="text-sm text-muted">{r.role}</p>}
              </div>
              {r.roleplay_score && (
                <div className="flex flex-col items-center rounded-lg bg-accent/10 px-3 py-1.5">
                  <span className="text-xs text-muted">スコア</span>
                  <span className="text-lg font-bold text-accent">
                    {r.roleplay_score}
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm leading-relaxed text-muted">
              &ldquo;{r.review_text}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
