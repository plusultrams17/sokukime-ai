import Link from "next/link";

interface CrossSellItem {
  title: string;
  description: string;
  href: string;
  subtext: string;
  icon: React.ReactNode;
}

interface LpCrossSellProps {
  heading: string;
  subheading: string;
  items: CrossSellItem[];
}

export function LpCrossSell({ heading, subheading, items }: LpCrossSellProps) {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
          {heading}
        </h2>
        <p className="mb-12 text-center text-sm text-muted sm:text-base">
          {subheading}
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex items-start gap-4 rounded-2xl border border-card-border bg-white p-6 shadow-sm transition hover:border-accent/40 hover:shadow-md"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                {item.icon}
              </div>
              <div>
                <p className="text-sm text-muted">{item.subtext}</p>
                <p className="text-base font-bold text-foreground group-hover:text-accent transition-colors">
                  {item.title} →
                </p>
                <p className="mt-1 text-xs text-muted">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
