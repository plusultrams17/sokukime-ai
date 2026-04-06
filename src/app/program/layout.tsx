import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

export const metadata: Metadata = {
  title: "成約5ステップ完全攻略プログラム｜営業の型を22レッスンで習得",
  description:
    "営業の「型」を身につければ成約率は変わる。22レッスン+認定試験+30パターン反論切り返しテンプレート+トークスクリプトテンプレート+AIコーチProアクセス権がセットになった買い切りプログラム。先着30名限定で¥9,800（通常¥14,800）。",
  alternates: {
    canonical: "/program",
  },
  openGraph: {
    title: "成約5ステップ完全攻略プログラム｜営業の型を22レッスンで習得",
    description:
      "営業の「型」を身につければ成約率は変わる。22レッスン+認定試験+反論切り返しテンプレート30パターン+トークスクリプトテンプレート+AIコーチProアクセス権がセットの買い切りプログラム。",
    type: "website",
    url: `${SITE_URL}/program`,
  },
  twitter: {
    card: "summary_large_image",
    title: "成約5ステップ完全攻略プログラム｜営業の型を22レッスンで習得",
    description:
      "営業の「型」を身につければ成約率は変わる。22レッスン+認定試験+反論切り返しテンプレート+AIコーチProアクセス権の買い切りプログラム。",
  },
};

export default function ProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = SITE_URL;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Product",
              "@id": `${siteUrl}/program#product`,
              name: "成約5ステップ完全攻略プログラム",
              description:
                "営業心理学に基づく成約5ステップメソッドを22レッスン+認定試験で体系的に学べる買い切り型オンライン営業プログラム。反論切り返しテンプレート30パターン・トークスクリプトテンプレート・AIコーチProアクセス権付き。",
              brand: {
                "@type": "Organization",
                name: "成約コーチ AI",
              },
              offers: {
                "@type": "Offer",
                price: "9800",
                priceCurrency: "JPY",
                availability: "https://schema.org/InStock",
                url: `${siteUrl}/program`,
                priceValidUntil: "2026-12-31",
                description:
                  "先着30名限定の特別価格。通常価格¥14,800。",
              },
              category: "営業研修・営業教育",
              audience: {
                "@type": "Audience",
                audienceType: "営業職・セールスパーソン",
              },
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${siteUrl}/program#breadcrumb`,
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "ホーム",
                  item: siteUrl,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "成約5ステップ完全攻略プログラム",
                  item: `${siteUrl}/program`,
                },
              ],
            },
          ],
        }}
      />
      {children}
    </>
  );
}
