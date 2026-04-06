import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ゲスト体験 — 3分でAIロープレ",
  description:
    "登録不要・3分で営業AIロープレを無料体験。8業種対応、難易度3段階から選べます",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TryRoleplayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
