import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sokukime.ai";

export const metadata: Metadata = {
  title: "無料登録",
  description:
    "即キメAIに無料登録して、AI即決営業ロープレコーチを体験しよう。メールアドレスだけで簡単登録。",
  alternates: {
    canonical: `${baseUrl}/signup`,
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
