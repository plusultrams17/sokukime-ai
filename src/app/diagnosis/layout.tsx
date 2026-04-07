import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

export const metadata: Metadata = {
  title: "営業力診断 — 30秒であなたの営業タイプがわかる | 成約コーチAI",
  description:
    "5問の質問に答えるだけで、アプローチ・ヒアリング・プレゼン・クロージング・反論処理の5スキルを可視化。あなたの営業タイプと弱点が30秒でわかります。登録不要。",
  alternates: { canonical: "/diagnosis" },
  openGraph: {
    title: "営業力診断 — 30秒であなたの営業タイプがわかる",
    description:
      "5問の質問に答えるだけで営業力を5つの軸で可視化。登録不要・30秒で完了。",
    url: `${SITE_URL}/diagnosis`,
  },
};

export default function DiagnosisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
