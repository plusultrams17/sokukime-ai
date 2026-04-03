"use client";

interface IndustrySelectorProps {
  industries: { slug: string; label: string }[];
  selected: string;
  onSelect: (slug: string) => void;
}

export function IndustrySelector({
  industries,
  selected,
  onSelect,
}: IndustrySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible">
      {industries.map((ind) => (
        <button
          key={ind.slug}
          onClick={() => onSelect(ind.slug)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            selected === ind.slug
              ? "bg-accent text-white"
              : "border border-card-border bg-card text-muted hover:border-accent/30 hover:text-foreground"
          }`}
        >
          {ind.label}
        </button>
      ))}
    </div>
  );
}
