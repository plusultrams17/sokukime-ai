import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md";
}

export function Logo({ size = "md" }: LogoProps) {
  const textClass = size === "sm" ? "text-lg" : "text-xl";
  return (
    <Link href="/" className="flex items-center gap-2">
      <span
        className={`${textClass} font-black tracking-tight text-foreground`}
        style={{
          fontFamily:
            "var(--font-serif-jp), 'YuMincho', 'Hiragino Mincho ProN', serif",
        }}
      >
        成約コーチ<span style={{ color: "var(--lp-cta)" }}>AI</span>
      </span>
    </Link>
  );
}
