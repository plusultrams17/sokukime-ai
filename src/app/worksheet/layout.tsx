import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { JsonLd } from "@/components/json-ld";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "営業トークスクリプト自動生成ワークシート",
  description:
    "AIが営業トークスクリプトを自動生成。5フェーズの穴埋めワークシートで商談準備を体系化。ヒアリング・プレゼン・クロージングの流れを可視化して成約率アップ。",
  alternates: { canonical: "/worksheet" },
};

export default function WorksheetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

  return (
    <div
      className={notoSansJP.variable}
      style={{ fontFamily: "var(--font-noto), sans-serif" }}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "HowTo",
              "@id": `${siteUrl}/worksheet#howto`,
              name: "営業トークスクリプトの作り方（AI自動生成ワークシート）",
              description:
                "成約コーチ AIのワークシートを使って、営業トークスクリプトを5ステップで自動生成する方法。業種・商材を入力するだけで、アプローチからクロージングまでの完全なトークスクリプトが完成します。",
              totalTime: "PT15M",
              tool: {
                "@type": "HowToTool",
                name: "成約コーチ AI ワークシート",
              },
              step: [
                {
                  "@type": "HowToStep",
                  position: 1,
                  name: "アプローチの準備",
                  text: "業種・商材を入力し、第一印象・信頼構築・ゴール共有など、アプローチに必要な情報を穴埋め形式で入力します。",
                  url: `${siteUrl}/worksheet`,
                },
                {
                  "@type": "HowToStep",
                  position: 2,
                  name: "ヒアリング項目の整理",
                  text: "お客様のニーズ・課題・予算感など、ヒアリングで確認すべき項目を整理します。状況質問・問題質問・示唆質問のテンプレートを活用できます。",
                  url: `${siteUrl}/worksheet`,
                },
                {
                  "@type": "HowToStep",
                  position: 3,
                  name: "プレゼン・クロージングの設計",
                  text: "ベネフィット提示・クロージングトーク・想定される反論と切り返しを準備します。社会的証明や一貫性の原理を活用したトークを設計します。",
                  url: `${siteUrl}/worksheet`,
                },
                {
                  "@type": "HowToStep",
                  position: 4,
                  name: "AIでトークスクリプトを自動生成",
                  text: "入力内容をもとに、AIがあなた専用の営業トークスクリプトを自動生成します。アプローチからクロージングまでの一連の流れが完成します。",
                  url: `${siteUrl}/worksheet`,
                },
                {
                  "@type": "HowToStep",
                  position: 5,
                  name: "ロープレで実践練習",
                  text: "生成されたトークスクリプトをもとに、AIロープレで実践練習します。スコアリングで弱点を特定し、スクリプトを改善していきます。",
                  url: `${siteUrl}/roleplay`,
                },
              ],
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${siteUrl}/worksheet#breadcrumb`,
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
                { "@type": "ListItem", position: 2, name: "ワークシート", item: `${siteUrl}/worksheet` },
              ],
            },
          ],
        }}
      />
      {children}
    </div>
  );
}
