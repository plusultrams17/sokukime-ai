import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ゲスト体験 — 3分でAIロープレ",
  description:
    "登録不要・ログイン不要で、今すぐAIロープレを体験できます。業種を選んで3分で完了。",
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
