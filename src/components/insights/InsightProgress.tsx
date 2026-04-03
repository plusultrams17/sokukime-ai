"use client";

interface InsightProgressProps {
  viewed: number;
  total: number;
}

export function InsightProgress({ viewed, total }: InsightProgressProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`inline-block h-2 w-2 rounded-full ${
              i < viewed ? "bg-accent" : "bg-card-border"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted">
        {viewed}/{total}
      </span>
    </div>
  );
}
