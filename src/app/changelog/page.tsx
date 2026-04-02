import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "更新履歴",
  description: "成約コーチ AIの最新アップデートと機能改善の履歴です。",
};

interface ChangelogEntry {
  date: string;
  version: string;
  title: string;
  changes: string[];
}

const entries: ChangelogEntry[] = [
  {
    date: "2026-03-30",
    version: "1.5.0",
    title: "設定ページ・更新履歴・Cookie同意バナー",
    changes: [
      "設定ページを追加（メール通知トグル・請求管理）",
      "更新履歴ページを追加",
      "Cookie同意バナーを追加（APPI対応）",
      "APIレート制限を追加（コスト保護）",
      "ダッシュボードにストリーク表示を追加",
      "ホームページに動的ユーザー数・セッション数を表示",
    ],
  },
  {
    date: "2026-03-28",
    version: "1.4.0",
    title: "収益化パイプライン完成",
    changes: [
      "24種類のライフサイクルメール自動配信",
      "退出ポップアップ（ホーム・料金・ロープレ）",
      "友達紹介プログラム（¥1,000 OFFクーポン）",
      "チェックアウト離脱メール自動送信",
      "Stripe決済失敗時のダニングメール自動化",
    ],
  },
  {
    date: "2026-03-25",
    version: "1.3.0",
    title: "スコア共有・OGP画像・ダッシュボード",
    changes: [
      "ロープレスコアの共有リンク機能",
      "スコア共有用OGP画像の自動生成",
      "マイダッシュボード（スコア推移グラフ・弱点分析）",
      "ワークシート機能を追加",
    ],
  },
  {
    date: "2026-03-20",
    version: "1.2.0",
    title: "学習コース・業種別ロープレ",
    changes: [
      "22レッスンの学習コース",
      "初級・中級・上級の認定試験",
      "8業種対応の業種別ロープレ",
      "無料ツール4種（営業力診断・スクリプト生成・反論トーク集・クロージング率計算）",
    ],
  },
  {
    date: "2026-03-15",
    version: "1.1.0",
    title: "AIコーチ・スコアリング",
    changes: [
      "リアルタイムAIコーチング機能",
      "成約5ステップのスコアリング機能",
      "Proプラン（¥2,980/月）の決済対応",
      "年間プラン（¥29,800/年）を追加",
    ],
  },
  {
    date: "2026-03-10",
    version: "1.0.0",
    title: "正式リリース",
    changes: [
      "AIロープレ機能（お客さん役AI）",
      "Google認証・メール認証",
      "無料プラン（1日1回）",
      "ダークモードUI",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-card-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-bold">
            成約コーチ AI
          </Link>
          <Link
            href="/roleplay"
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            ロープレを始める
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-2 text-2xl font-bold">更新履歴</h1>
        <p className="mb-10 text-sm text-muted">成約コーチ AIの最新アップデート</p>

        <div className="relative space-y-0">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-card-border" />

          {entries.map((entry) => (
            <div key={entry.version} className="relative pl-8 pb-10">
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-accent bg-background" />

              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
                  v{entry.version}
                </span>
                <span className="text-xs text-muted">
                  {new Date(entry.date).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h2 className="mb-3 text-lg font-bold">{entry.title}</h2>
              <ul className="space-y-1.5">
                {entry.changes.map((change) => (
                  <li key={change} className="flex items-start gap-2 text-sm text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent/50" />
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
