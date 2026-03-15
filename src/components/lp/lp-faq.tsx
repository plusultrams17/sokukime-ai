interface FaqItem {
  question: string;
  answer: string;
}

interface LpFaqProps {
  heading: string;
  subheading?: string;
  items: FaqItem[];
}

export function LpFaq({ heading, subheading, items }: LpFaqProps) {
  return (
    <section className="relative overflow-hidden px-6 py-16 sm:py-24">
      <div
        className="blob blob-cream"
        style={{ width: 250, height: 250, bottom: -40, left: -60 }}
      />
      <div className="relative z-10 mx-auto max-w-3xl">
        <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
          {heading}
        </h2>
        {subheading && (
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            {subheading}
          </p>
        )}
        <div className="space-y-3">
          {items.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl bg-white shadow-sm"
            >
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden list-none">
                <span>{faq.question}</span>
                <svg
                  className="h-5 w-5 flex-shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="border-t border-card-border px-6 pb-5 pt-4 text-sm leading-relaxed text-muted">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
