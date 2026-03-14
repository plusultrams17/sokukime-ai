import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

export const metadata: Metadata = {
  title: "無料登録",
  description:
    "成約コーチ AIに無料登録して、AI営業ロープレコーチを体験しよう。メールアドレスだけで簡単登録。",
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
