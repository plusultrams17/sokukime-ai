interface FeatureItem {
  title: string;
  desc: string;
  items: string[];
  illustration?: React.ReactNode;
}

interface LpFeatureDetailProps {
  heading: string;
  subheading?: string;
  features: FeatureItem[];
}

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 flex-shrink-0 text-accent"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export function LpFeatureDetail({
  heading,
  subheading,
  features,
}: LpFeatureDetailProps) {
  return (
    <section className="relative overflow-hidden px-6 py-16 sm:py-24">
      <div
        className="blob blob-pink"
        style={{ width: 300, height: 300, top: -40, left: -60 }}
      />
      <div className="relative z-10 mx-auto max-w-5xl">
        <h2
          className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {heading}
        </h2>
        {subheading && (
          <p className="mb-12 text-center text-sm text-muted sm:mb-16 sm:text-base">
            {subheading}
          </p>
        )}

        <div className="space-y-8">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className={`flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8 md:flex-row md:items-center md:gap-10 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Illustration */}
              {feat.illustration && (
                <div className="flex-shrink-0 mx-auto w-48 h-32 md:w-56 md:h-36">
                  {feat.illustration}
                </div>
              )}
              {/* Text */}
              <div className="flex-1">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                  機能 {i + 1}
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">
                  {feat.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-muted">
                  {feat.desc}
                </p>
                <ul className="space-y-2">
                  {feat.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
