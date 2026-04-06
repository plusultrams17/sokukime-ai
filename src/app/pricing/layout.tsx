import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "料金プラン | 無料から始める営業ロープレAI",
  description:
    "成約コーチAI料金プラン。22レッスン無料、Proプラン月額2,980円でAIロープレ無制限",
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
