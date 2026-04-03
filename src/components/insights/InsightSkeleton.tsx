"use client";

export function InsightSkeleton() {
  return (
    <div className="space-y-4">
      {/* Featured skeleton */}
      <div className="animate-pulse rounded-xl border border-card-border bg-card p-6">
        <div className="mb-3 h-3 w-24 rounded bg-card-border" />
        <div className="mb-2 h-6 w-3/4 rounded bg-card-border" />
        <div className="mb-2 h-4 w-full rounded bg-card-border" />
        <div className="mb-4 h-4 w-2/3 rounded bg-card-border" />
        <div className="h-10 w-40 rounded-lg bg-card-border" />
      </div>
      {/* Grid skeletons */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-card-border bg-card p-5"
          >
            <div className="mb-2 h-3 w-20 rounded bg-card-border" />
            <div className="mb-2 h-5 w-3/4 rounded bg-card-border" />
            <div className="mb-1 h-3 w-full rounded bg-card-border" />
            <div className="h-3 w-1/2 rounded bg-card-border" />
          </div>
        ))}
      </div>
    </div>
  );
}
