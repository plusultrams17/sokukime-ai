import Link from "next/link";

interface LpMorphBtnProps {
  text: string;
  href: string;
}

export function LpMorphBtn({ text, href }: LpMorphBtnProps) {
  return (
    <Link href={href} className="morph-btn">
      <span className="btn-fill" />
      <span className="shadow" />
      <span className="btn-text">
        {text.split("").map((char, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties}>
            {char}
          </span>
        ))}
      </span>
      <span className="orbit-dots">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="corners">
        <span />
        <span />
        <span />
        <span />
      </span>
    </Link>
  );
}
