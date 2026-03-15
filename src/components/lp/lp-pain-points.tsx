interface Challenge {
  icon: React.ReactNode;
  text: string;
}

interface LpPainPointsProps {
  heading: string;
  subheading: string;
  challenges: Challenge[];
  solutionHeading: string;
  solutionText: string;
}

export function LpPainPoints({
  heading,
  subheading,
  challenges,
  solutionHeading,
  solutionText,
}: LpPainPointsProps) {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h2
          className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {heading}
        </h2>
        <p className="mb-12 text-center text-sm text-muted sm:text-base">
          {subheading}
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {challenges.map((c) => (
            <div
              key={typeof c.text === "string" ? c.text : ""}
              className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50/60 p-6 text-center"
            >
              <div className="text-4xl">{c.icon}</div>
              <p className="text-sm font-semibold leading-snug text-red-700">
                {c.text}
              </p>
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div className="my-8 flex justify-center">
          <svg
            className="h-10 w-10 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>

        {/* Solution */}
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 text-center sm:p-8">
          <p className="text-lg font-bold text-accent sm:text-xl">
            {solutionHeading}
          </p>
          <p className="mt-2 text-sm text-muted">{solutionText}</p>
        </div>
      </div>
    </section>
  );
}
