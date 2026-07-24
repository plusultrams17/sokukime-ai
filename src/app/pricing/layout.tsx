import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "料金プラン | 無料から始める営業ロープレAI",
  description:
    "成約コーチAI料金プラン。無料プランで累計5回ロープレ体験。ライト ¥2,980/月30回、プロ ¥6,980/月100回、無制限 ¥14,800/実質無制限（月300回）の3つの有料プランから選べます。",
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
