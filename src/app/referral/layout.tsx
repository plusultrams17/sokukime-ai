import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "紹介プログラム | 成約コーチAI",
  description:
    "友達を紹介して¥1,000 OFF！成約コーチAIの紹介プログラムで、あなたも友達もお得に営業スキルアップ。",
};

export default function ReferralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
