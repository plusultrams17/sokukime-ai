import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "料金プラン | 無料から始める営業ロープレAI",
  description:
    "営業ロープレAI練習ツール「成約コーチ AI」の料金。無料プランで毎日1回AIロープレ体験。Proプラン月額¥2,980で無制限に営業トレーニング。営業研修1回分の費用で1ヶ月使い放題。",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
