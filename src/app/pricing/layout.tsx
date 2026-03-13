import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sokukime.ai";

export const metadata: Metadata = {
  title: "料金プラン - 無料 & Proプラン",
  description:
    "即キメAIの料金プラン。無料プランで毎日1回ロープレ体験、Proプラン（月額¥2,980）で無制限にAIコーチングを受けられます。",
  alternates: {
    canonical: `${baseUrl}/pricing`,
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
