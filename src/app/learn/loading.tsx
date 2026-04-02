export default function LearnLoading() {
  return (
    <div className="min-h-screen bg-background px-6 pt-24 pb-16">
      <div className="mx-auto max-w-4xl animate-pulse">
        {/* Title skeleton */}
        <div className="mb-4 flex justify-center">
          <div className="h-10 w-64 rounded-lg bg-card-border" />
        </div>
        <div className="mb-12 flex justify-center">
          <div className="h-5 w-96 rounded-lg bg-card-border" />
        </div>

        {/* Lesson cards skeleton */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl border border-card-border bg-card"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
