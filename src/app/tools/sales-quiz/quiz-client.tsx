"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ToolUpsellCTA } from "@/components/tool-upsell-cta";
import { ToolEmailGate } from "@/components/tool-email-gate";

type Category = "アプローチ" | "ヒアリング" | "プレゼン" | "クロージング" | "反論処理";

interface Question {
  text: string;
  category: Category;
  options: { label: string; score: number }[];
}

const CATEGORY_COLORS: Record<Category, string> = {
  "アプローチ": "#0F6E56",
  "ヒアリング": "#185FA5",
  "プレゼン": "#534AB7",
  "クロージング": "#993C1D",
  "反論処理": "#A32D2D",
};

const questions: Question[] = [
  {
    // 正解: C
    text: "初回訪問で最初にすべきことは？",
    category: "アプローチ",
    options: [
      { label: "商品の特徴を説明する", score: 1 },
      { label: "雑談で場を和ませてから本題に入る", score: 3 },
      { label: "自己紹介と訪問目的を伝え、相手の話を聞く姿勢を見せる", score: 4 },
      { label: "すぐにニーズを質問する", score: 2 },
    ],
  },
  {
    // 正解: D
    text: "お客様との信頼関係を築くために最も重要なのは？",
    category: "アプローチ",
    options: [
      { label: "商品の値引きを提示する", score: 1 },
      { label: "実績や資格をアピールする", score: 2 },
      { label: "有名企業との取引実績を紹介する", score: 3 },
      { label: "相手の業界・状況に関心を示し、共感する", score: 4 },
    ],
  },
  {
    // 正解: A
    text: "ヒアリングで「お客様自身が課題を言語化できる」ようにするために必要なのは？",
    category: "ヒアリング",
    options: [
      { label: "オープンクエスチョンを重ねて深掘りする", score: 4 },
      { label: "事前に用意したアンケートに回答してもらう", score: 1 },
      { label: "業界の一般的な課題を提示して確認する", score: 3 },
      { label: "自分が聞きたい質問を効率よく聞く", score: 2 },
    ],
  },
  {
    // 正解: B
    text: "お客様が「特に困っていることはない」と言った場合の対応は？",
    category: "ヒアリング",
    options: [
      { label: "他社の事例を紹介して潜在課題を引き出す", score: 3 },
      { label: "将来の変化やリスクについて質問し、潜在ニーズを探る", score: 4 },
      { label: "そのまま引き下がって次の機会を待つ", score: 1 },
      { label: "「本当ですか？」と食い下がる", score: 1 },
    ],
  },
  {
    // 正解: D
    text: "プレゼンで最も効果的な伝え方は？",
    category: "プレゼン",
    options: [
      { label: "他社との比較表を見せる", score: 2 },
      { label: "導入事例を中心に説明する", score: 3 },
      { label: "商品の全機能を網羅的に説明する", score: 1 },
      { label: "お客様の課題に直結するベネフィットに絞って伝える", score: 4 },
    ],
  },
  {
    // 正解: A
    text: "提案書を作る際に最も重視すべきことは？",
    category: "プレゼン",
    options: [
      { label: "ヒアリングで聞いた課題と解決策の対応関係を明確にする", score: 4 },
      { label: "デザインや見た目の美しさ", score: 1 },
      { label: "自社の強みを最大限アピールする", score: 3 },
      { label: "価格のお得感を強調する", score: 2 },
    ],
  },
  {
    // 正解: B
    text: "お客様が「いいと思います」と言った時の最適な行動は？",
    category: "クロージング",
    options: [
      { label: "「本当に大丈夫ですか？」と確認する", score: 1 },
      { label: "「では契約書をご用意しますね」と自然に次のステップへ進む", score: 4 },
      { label: "「ありがとうございます」と言って帰る", score: 1 },
      { label: "さらに詳しく説明を続ける", score: 2 },
    ],
  },
  {
    // 正解: C
    text: "クロージングのタイミングとして最も適切なのは？",
    category: "クロージング",
    options: [
      { label: "値引きを提示する時", score: 1 },
      { label: "プレゼンが終わった直後", score: 2 },
      { label: "お客様の不安や疑問がすべて解消された瞬間", score: 4 },
      { label: "お客様から「で、いくらですか？」と聞かれた時", score: 3 },
    ],
  },
  {
    // 正解: D
    text: "「検討します」と言われた時の最善の対応は？",
    category: "反論処理",
    options: [
      { label: "今日決めてくれたら値引きすると伝える", score: 2 },
      { label: "「わかりました」と引き下がり、後日連絡する", score: 1 },
      { label: "資料を追加で送ると伝える", score: 2 },
      { label: "「何か気になる点がありますか？」と具体的な懸念を聞き出す", score: 4 },
    ],
  },
  {
    // 正解: A
    text: "「高い」と言われた時の最も効果的な切り返しは？",
    category: "反論処理",
    options: [
      { label: "「何と比較して高いと感じますか？」と基準を確認する", score: 4 },
      { label: "安いプランを代わりに提案する", score: 3 },
      { label: "すぐに値引きを提案する", score: 1 },
      { label: "「品質を考えればお得です」と反論する", score: 2 },
    ],
  },
];

const GRADES = [
  { min: 36, grade: "S", label: "トップ営業マンレベル", color: "#F59E0B", desc: "素晴らしいスキルです。さらに磨きをかけてチームの手本になりましょう。" },
  { min: 30, grade: "A", label: "優秀な営業パーソン", color: "#10B981", desc: "高いスキルをお持ちです。弱点を補強すればさらに成約率が上がります。" },
  { min: 22, grade: "B", label: "平均的なレベル", color: "#3B82F6", desc: "基本はできています。苦手分野を集中的に練習して差をつけましょう。" },
  { min: 14, grade: "C", label: "改善の余地あり", color: "#F97316", desc: "伸びしろがたくさんあります。基本の型を身につけることが最優先です。" },
  { min: 0, grade: "D", label: "基礎から学ぼう", color: "#EF4444", desc: "まずは営業の基本スキルを体系的に学ぶところから始めましょう。" },
];

function getGrade(score: number) {
  return GRADES.find((g) => score >= g.min) || GRADES[GRADES.length - 1];
}

export function SalesQuizClient() {
  const [state, setState] = useState<"intro" | "quiz" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [emailUnlocked, setEmailUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("tool_email_captured") === "true") {
      setEmailUnlocked(true);
    }
  }, []);

  const handleAnswer = (score: number) => {
    setSelected(score);
    setTimeout(() => {
      const newAnswers = [...answers, score];
      setAnswers(newAnswers);
      setSelected(null);
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        setState("result");
      }
    }, 400);
  };

  const reset = () => {
    setState("intro");
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
  };

  // Calculate category scores
  const categoryScores: Record<Category, number> = {
    "アプローチ": 0, "ヒアリング": 0, "プレゼン": 0, "クロージング": 0, "反論処理": 0,
  };
  answers.forEach((score, i) => {
    if (i < questions.length) categoryScores[questions[i].category] += score;
  });
  const totalScore = answers.reduce((a, b) => a + b, 0);
  const grade = getGrade(totalScore);

  const weakest = Object.entries(categoryScores).reduce((a, b) =>
    a[1] <= b[1] ? a : b
  );

  if (state === "intro") {
    return (
      <div className="rounded-2xl bg-white border border-card-border shadow-sm p-8 text-center">
        <div className="mb-4"><Image src="/images/misc/tool-sales-quiz.png" alt="営業力診断テスト" width={64} height={64} className="mx-auto rounded-xl" /></div>
        <h3 className="text-xl font-bold text-foreground mb-2">営業力診断テスト</h3>
        <p className="text-sm text-muted mb-6">10問の質問であなたの営業スキルを5項目で診断します。所要時間は約3分です。</p>
        <ul className="text-left text-sm text-muted space-y-2 mb-8 max-w-xs mx-auto">
          {(Object.keys(CATEGORY_COLORS) as Category[]).map((cat) => (
            <li key={cat} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
              {cat}（2問）
            </li>
          ))}
        </ul>
        <button
          onClick={() => setState("quiz")}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover"
        >
          診断を始める
        </button>
      </div>
    );
  }

  if (state === "quiz") {
    const q = questions[current];
    const progress = ((current) / questions.length) * 100;

    return (
      <div className="rounded-2xl bg-white border border-card-border shadow-sm p-6 sm:p-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted mb-2">
            <span>質問 {current + 1} / {questions.length}</span>
            <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: `${CATEGORY_COLORS[q.category]}20`, color: CATEGORY_COLORS[q.category] }}>
              {q.category}
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question */}
        <h3 key={current} className="text-lg font-bold text-foreground mb-6 animate-fade-in-up">
          {q.text}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt.score)}
              disabled={selected !== null}
              className={`w-full text-left rounded-xl border p-4 text-sm transition-all duration-200 ${
                selected === opt.score
                  ? "border-accent bg-accent/10 text-accent font-medium"
                  : "border-card-border bg-white text-foreground hover:border-accent/50 hover:bg-accent/5"
              }`}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-muted mr-3">
                {String.fromCharCode(65 + i)}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Result
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Grade Card */}
      <div className="rounded-2xl bg-white border border-card-border shadow-sm p-8 text-center">
        <p className="text-sm text-muted mb-2">あなたの営業力スコア</p>
        <div className="text-6xl font-bold mb-1" style={{ color: grade.color }}>
          {grade.grade}
        </div>
        <p className="text-lg font-bold text-foreground mb-1">{grade.label}</p>
        <p className="text-3xl font-bold text-foreground mb-4">
          {totalScore}<span className="text-lg text-muted font-normal"> / 40点</span>
        </p>
        <p className="text-sm text-muted">{grade.desc}</p>
      </div>

      {/* Email gate or detailed results */}
      {!emailUnlocked ? (
        <ToolEmailGate toolName="sales-quiz" onUnlock={() => setEmailUnlocked(true)} />
      ) : (
        <>
          {/* Category Breakdown */}
          <div className="rounded-2xl bg-white border border-card-border shadow-sm p-6 sm:p-8">
            <h3 className="text-base font-bold text-foreground mb-6">カテゴリ別スコア</h3>
            <div className="space-y-4">
              {(Object.entries(categoryScores) as [Category, number][]).map(([cat, score]) => {
                const maxScore = 8;
                const pct = (score / maxScore) * 100;
                const color = CATEGORY_COLORS[cat];
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-foreground">{cat}</span>
                      <span className="text-muted">{score} / {maxScore}</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-100">
                      <div
                        className="h-3 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weak Point */}
          <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-6">
            <h3 className="text-base font-bold text-foreground mb-2">
              重点改善ポイント: {weakest[0]}
            </h3>
            <p className="text-sm text-muted mb-4">
              {weakest[0]}のスコアが最も低くなっています。この分野を集中的に練習することで、全体の成約率が大きく改善する可能性があります。
            </p>
            <Link
              href="/roleplay"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover"
            >
              AIロープレで{weakest[0]}を練習する
            </Link>
          </div>
        </>
      )}

      {/* Program CTA */}
      <div className="rounded-2xl border-2 border-accent bg-accent/5 p-6 sm:p-8 text-center">
        <p className="mb-2 text-sm font-medium text-accent">
          スコアを伸ばしたい方へ
        </p>
        <h3 className="mb-3 text-xl font-bold text-foreground">
          成約5ステップ完全攻略プログラム
        </h3>
        <p className="mb-4 text-sm text-muted leading-relaxed">
          22レッスンで営業の「型」を体系的に習得。弱点を集中的に改善し、成約率を引き上げるための実践プログラムです。
        </p>
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="text-sm text-muted line-through">¥14,800</span>
          <span className="text-2xl font-bold text-accent">¥9,800</span>
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">先着30名</span>
        </div>
        <Link
          href="/program"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover"
        >
          プログラムの詳細を見る
        </Link>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/roleplay"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover"
        >
          AIロープレで弱点を克服する
        </Link>
        <button
          onClick={reset}
          className="inline-flex h-12 items-center justify-center rounded-xl border border-card-border bg-white px-8 text-base font-bold text-foreground transition hover:bg-gray-50"
        >
          もう一度診断する
        </button>
      </div>

      {/* Pro Upsell */}
      <ToolUpsellCTA />
    </div>
  );
}
