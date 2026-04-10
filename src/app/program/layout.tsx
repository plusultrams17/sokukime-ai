import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

export const metadata: Metadata = {
  title: "Pro会員特典 | 成約コーチAI",
  description:
    "成約コーチAI Pro会員特典ページ。22レッスン・PDF資料・反論切り返し30パターン・トークスクリプト集をすべて会員特典として提供。",
  alternates: {
    canonical: `${SITE_URL}/program/resources`,
  },
  robots: {
    index: false, // 旧買い切りURLの残骸なので検索除外
    follow: true,
  },
};

export default function ProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
