import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "営業メソッド学習プログラム｜22レッスン+認定試験",
  description:
    "成約5ステップメソッドを体系的に学べる営業学習コース。初級（アプローチ・ヒアリング・プレゼン）8レッスン、中級（クロージング）7レッスン、上級（反論処理）7レッスン＋認定試験。営業心理学に基づく実践的なカリキュラム。",
  alternates: { canonical: "/learn" },
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sokukime-ai.vercel.app";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Course",
              "@id": `${siteUrl}/learn#course`,
              name: "成約5ステップメソッド学習プログラム",
              description:
                "営業心理学に基づく成約5ステップメソッド（アプローチ・ヒアリング・プレゼン・クロージング・反論処理）を22レッスン+認定試験で体系的に学ぶオンライン営業学習コース。",
              provider: { "@id": `${siteUrl}/#organization` },
              educationalLevel: "Beginner to Advanced",
              inLanguage: "ja",
              numberOfLessons: 22,
              hasCourseInstance: {
                "@type": "CourseInstance",
                courseMode: "Online",
                courseWorkload: "PT10H",
              },
              offers: [
                {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "JPY",
                  availability: "https://schema.org/InStock",
                  description: "無料プランで閲覧可能",
                },
              ],
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${siteUrl}/learn#breadcrumb`,
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
                { "@type": "ListItem", position: 2, name: "学習コース", item: `${siteUrl}/learn` },
              ],
            },
          ],
        }}
      />
      {children}
    </>
  );
}
