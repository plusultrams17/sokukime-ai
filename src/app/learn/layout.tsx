import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "営業メソッド学習プログラム｜22レッスン+認定試験",
  description:
    "営業の5ステップメソッドを22レッスンで学習。初級〜上級まで段階的に営業心理学を習得できます",
  alternates: { canonical: "/learn" },
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

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
                  description: "無料プランで基本3レッスン閲覧可能",
                },
                {
                  "@type": "Offer",
                  price: "990",
                  priceCurrency: "JPY",
                  availability: "https://schema.org/InStock",
                  description: "Starterプラン（月額・税込）で全22レッスン＋認定試験・AIロープレ月30回",
                },
                {
                  "@type": "Offer",
                  price: "1980",
                  priceCurrency: "JPY",
                  availability: "https://schema.org/InStock",
                  description: "Proプラン（月額・税込）で全22レッスン＋認定試験・AIロープレ月60回",
                },
                {
                  "@type": "Offer",
                  price: "4980",
                  priceCurrency: "JPY",
                  availability: "https://schema.org/InStock",
                  description: "Masterプラン（月額・税込）で全22レッスン＋認定試験・AIロープレ月200回・優先サポート",
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
