import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "料金プラン | 無料から始める営業ロープレAI",
  description:
    "成約コーチAI料金プラン。無料プランで累計5回ロープレ体験。Starter ¥990/月30回、Pro ¥1,980/月60回、Master ¥4,980/月200回の3つの有料プランから選べます。",
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
