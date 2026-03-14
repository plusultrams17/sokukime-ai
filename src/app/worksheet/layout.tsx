import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "営業準備ワークシート",
  description:
    "成約コーチ AIの営業準備ワークシート。業界理解・自社理解・競合分析・反論処理の知識を自己チェック。AIによる自動生成も可能。",
  alternates: { canonical: "/worksheet" },
};

export default function WorksheetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
