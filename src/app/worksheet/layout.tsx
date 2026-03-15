import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "営業トークスクリプト自動生成ワークシート",
  description:
    "AIが営業トークスクリプトを自動生成。5フェーズの穴埋めワークシートで商談準備を体系化。ヒアリング・プレゼン・クロージングの流れを可視化して成約率アップ。",
  alternates: { canonical: "/worksheet" },
};

export default function WorksheetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={notoSansJP.variable}
      style={{ fontFamily: "var(--font-noto), sans-serif" }}
    >
      {children}
    </div>
  );
}
