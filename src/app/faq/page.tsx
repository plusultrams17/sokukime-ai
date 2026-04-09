import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { Footer } from "@/components/footer";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

export const metadata: Metadata = {
  title: "よくある質問（FAQ）",
  description:
    "成約コーチAIに関するよくある質問をまとめました。料金プラン、機能、使い方、解約方法など、お客様からよく寄せられるご質問にお答えします。",
  alternates: { canonical: `${SITE_URL}/faq` },
};

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: "サービスについて",
    icon: "",
    items: [
      {
        question: "成約コーチAIとは何ですか？",
        answer:
          "成約コーチAIは、営業心理学に基づく5ステップメソッドを使い、AIとのロープレ（模擬商談）を通じて営業スキルを鍛えるオンラインサービスです。24時間いつでもAI相手に練習でき、Proプランでは全5カテゴリの詳細スコアで自分の強み・弱みを可視化できます（無料プランは1カテゴリ）。",
      },
      {
        question: "どのようなシーンで練習できますか？",
        answer:
          "新規開拓・既存顧客フォロー・クレーム対応など、複数の営業シーンを選択できます。また、難易度（初級・中級・上級）や業界（保険・不動産・SaaSなど18業種）を指定して、実際の商談に近い環境で練習できます。",
      },
      {
        question: "スコアはどのように算出されますか？",
        answer:
          "AIが営業心理学の5カテゴリ（アプローチ・ヒアリング・プレゼン・クロージング・反論処理）で会話内容を分析し、各カテゴリ0〜20点（合計100点満点）で採点します。総合スコアはS〜Dの5段階ランクで表示されます。無料プランでは1カテゴリのみ、Proプランで全5カテゴリの詳細が確認できます。",
      },
      {
        question: "スマートフォンでも使えますか？",
        answer:
          "はい。PC・スマートフォン・タブレットの各ブラウザに対応しており、同一アカウントで全デバイスからご利用いただけます。PWA対応のため、ホーム画面に追加するとアプリのようにご利用いただけます。",
      },
      {
        question: "営業経験がなくても使えますか？",
        answer:
          "はい。初心者向けの学習コース（5ステップメソッド）が用意されており、営業の基礎から学べます。初級難易度のロープレから始めて、段階的にスキルアップできます。",
      },
    ],
  },
  {
    title: "料金・プラン",
    icon: "",
    items: [
      {
        question: "無料プランに制限はありますか？",
        answer:
          "無料プランは1日1回のロープレ制限があり、スコアは1カテゴリのみ詳細表示されます。Proプランでは全5カテゴリの詳細スコアとAI改善アドバイスが表示されます。",
      },
      {
        question: "Proプランの料金はいくらですか？",
        answer:
          "月額プラン：¥2,980/月、年額プラン：¥29,800/年（月額換算約¥2,483、2ヶ月分おトク）です。どちらのプランも7日間の無料トライアル付きです。",
      },
      {
        question: "7日間の無料トライアルとは？",
        answer:
          "Proプランに申し込むと、最初の7日間は無料で全機能をお試しいただけます。トライアル期間中にいつでもキャンセル可能で、キャンセルすれば一切課金されません。",
      },
      {
        question: "支払い方法は？",
        answer:
          "クレジットカード（Visa, Mastercard, JCB, American Express）でお支払いいただけます。Stripeによる安全な決済システムを使用しています。",
      },
      {
        question: "いつでも解約できますか？",
        answer:
          "はい、いつでも解約できます。解約後も現在の請求期間の終了までProプランをご利用いただけます。解約手続きはアプリ内の設定ページからワンクリックで行えます。",
      },
      {
        question: "年額プランはありますか？",
        answer:
          "はい。年額プラン（¥29,800/年）をご用意しています。月額換算で約¥2,483となり、2ヶ月分おトクです。",
      },
      {
        question: "領収書・請求書は発行できますか？",
        answer:
          "はい。Stripeの決済管理画面から領収書をダウンロードいただけます。法人利用の場合は経費精算にもご利用いただけます。ダッシュボードの「領収書・請求書」からアクセスできます。",
      },
      {
        question: "返金はできますか？",
        answer:
          "Proプランには14日間の返金保証があります。また、7日間の無料トライアル中にキャンセルすれば一切課金されません。解約後も現在の請求期間の終了までProプランをご利用いただけます。",
      },
    ],
  },
  {
    title: "使い方・機能",
    icon: "",
    items: [
      {
        question: "ロープレの所要時間はどれくらいですか？",
        answer:
          "1回のロープレは3〜5分程度です。通勤時間や休憩時間にサッと練習でき、スキマ時間を有効活用できます。",
      },
      {
        question: "AIコーチとは何ですか？",
        answer:
          "ロープレ中にリアルタイムでアドバイスをくれるAI機能です。「もう少しヒアリングを深めてみましょう」「ここでクロージングに入れます」など、状況に応じた具体的なフィードバックを提供します。",
      },
      {
        question: "スコア履歴は保存されますか？",
        answer:
          "はい。ログインしていれば全てのスコア履歴がダッシュボードに保存され、推移グラフで成長を可視化できます。",
      },
      {
        question: "友達紹介プログラムとは？",
        answer:
          "あなたの紹介リンクからお友達がProプランに登録すると、あなたもお友達も次回のお支払いから¥1,000 OFFになるプログラムです。紹介すればするほど割引が増えます。",
      },
      {
        question: "データのエクスポートはできますか？",
        answer:
          "現在、スコアデータのエクスポート機能は提供しておりませんが、ダッシュボードで全てのスコア履歴と推移を確認いただけます。",
      },
    ],
  },
  {
    title: "セキュリティ・プライバシー",
    icon: "",
    items: [
      {
        question: "個人情報はどのように保護されていますか？",
        answer:
          "お客様のデータはSupabase（SOC 2 Type II認証取得）上で暗号化して保管しています。決済情報はStripe（PCI DSS準拠）で安全に処理され、当社のサーバーにカード情報は保存されません。",
      },
      {
        question: "ロープレの会話内容は保存されますか？",
        answer:
          "ロープレの会話内容はスコア算出のために一時的に処理されますが、会話全文は永続的に保存されません。スコアとフィードバックのみが保存されます。",
      },
      {
        question: "メール配信を停止できますか？",
        answer:
          "はい。各メールのフッターにある「配信停止」リンク、またはアプリ内の設定ページからメール通知をオフにできます。",
      },
    ],
  },
];

const allFaqItems = faqCategories.flatMap((cat) => cat.items);

export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/faq#faqpage`,
        mainEntity: allFaqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/faq#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "よくある質問",
            item: `${SITE_URL}/faq`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <JsonLd data={faqJsonLd} />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <h1 className="mb-3 text-center text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
          よくある質問
        </h1>
        <p className="mb-12 text-center text-sm text-muted">
          成約コーチAIに関するよくある質問をまとめました
        </p>

        {faqCategories.map((category) => (
          <section key={category.title} className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              {category.icon ? <span>{category.icon}</span> : null}
              {category.title}
            </h2>
            <div className="space-y-3">
              {category.items.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-xl border border-card-border bg-card"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-3 text-sm font-medium transition hover:text-accent sm:p-4">
                    {item.question}
                    <span className="ml-2 text-muted transition group-open:rotate-180">
                      ▼
                    </span>
                  </summary>
                  <div className="border-t border-card-border px-3 py-3 text-sm leading-relaxed text-muted sm:px-4">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-accent/20 bg-accent/5 p-5 text-center sm:mt-12 sm:p-8">
          <h2 className="mb-2 text-lg font-bold">
            他にご質問がありますか？
          </h2>
          <p className="mb-4 text-sm text-muted">
            まずは無料でAIロープレを体験してみてください
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/roleplay"
              className="inline-flex h-11 items-center rounded-xl bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover"
            >
              無料でAIロープレを試す
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-11 items-center rounded-xl border border-card-border px-6 text-sm font-medium text-muted transition hover:text-foreground"
            >
              料金プランを見る
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
