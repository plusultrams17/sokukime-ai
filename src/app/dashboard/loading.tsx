export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background px-6 pt-24 pb-16">
      <div className="mx-auto max-w-4xl animate-pulse">
        {/* Header skeleton */}
        <div className="mb-8 flex items-center justify-between">
          <div className="h-8 w-48 rounded-lg bg-card-border" />
          <div className="h-10 w-32 rounded-xl bg-card-border" />
        </div>

        {/* Streak card skeleton */}
        <div className="mb-6 h-20 rounded-xl border border-card-border bg-card" />

        {/* Stats grid skeleton */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl border border-card-border bg-card"
            />
          ))}
        </div>

        {/* Chart skeleton */}
        <div className="mb-8 h-64 rounded-xl border border-card-border bg-card" />

        {/* History skeleton */}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl border border-card-border bg-card"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
