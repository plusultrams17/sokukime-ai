"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/header";

/* ═══════════════════════════════════════════════════════════════
   SCENARIO DATA — 賃貸物件の内見 反論切り返しチャレンジ
═══════════════════════════════════════════════════════════════ */

interface ChallengeScenario {
  id: number;
  situation: string;
  customerSays: string;
  keywords: string[];
  modelAnswer: string;
  technique: string;
  tip: string;
}

const SCENARIOS: ChallengeScenario[] = [
  {
    id: 1,
    situation:
      "駅近1LDK・築5年の物件を内見中。設備や日当たりに満足そうだったお客さんが、家賃を聞いた瞬間——",
    customerSays: "うーん…ちょっと高くないですか？もう少し安い物件ないですか？",
    keywords: [
      "相場",
      "比較",
      "駅近",
      "設備",
      "日割り",
      "月",
      "差額",
      "トータル",
      "光熱費",
      "通勤",
      "時間",
      "築年数",
      "新しい",
      "初期費用",
      "フリーレント",
      "交渉",
    ],
    modelAnswer:
      "「おっしゃる通り、家賃は大事なポイントですよね。ちなみにこのエリアの同条件の相場は約◯万円なので、設備と駅徒歩3分を考えると実はかなりお得なんです。仮に駅から遠い物件にすると、毎月の通勤時間をお金に換算すると差額以上になることが多いんですよ。それでも気になるようでしたら、フリーレントの交渉も一度オーナーさんに聞いてみますね。」",
    technique: "相場比較＋日割りリフレーミング",
    tip: "「高い」の裏には判断基準の不足がある。相場データ＋隠れコストの可視化で納得感を作る。",
  },
  {
    id: 2,
    situation:
      "2LDK・駅徒歩8分の物件。間取りも収納も申し分なし。内見を終えて出口で——",
    customerSays: "いい物件ですね。でも、もう少し考えてからにします。",
    keywords: [
      "気に入",
      "良い",
      "いい",
      "不安",
      "心配",
      "引っかか",
      "懸念",
      "家族",
      "相談",
      "他",
      "比較",
      "検討",
      "期限",
      "人気",
      "問い合わせ",
      "内見",
      "予約",
    ],
    modelAnswer:
      "「ありがとうございます！気に入っていただけて嬉しいです。ちなみに、'考える'というのは、何か引っかかる点がありましたか？もし気になる点があれば今のうちに解消しておきたくて。実はこの物件、今週だけで3件お問い合わせがあるので、もし前向きでしたら仮押さえだけでもしておくと安心ですよ。」",
    technique: "本音の深掘り＋緊急性の提示",
    tip: "「考えます」は90%が断り文句。本音を引き出し、緊急性で背中を押す。",
  },
  {
    id: 3,
    situation:
      "ファミリー向け3LDK。子ども部屋の広さに奥様は満足。しかし旦那さんが——",
    customerSays: "他の物件も見てから決めたいんですよね。",
    keywords: [
      "比較",
      "条件",
      "優先",
      "基準",
      "何",
      "どの",
      "ポイント",
      "譲れない",
      "重視",
      "ここ",
      "メリット",
      "気に入",
      "一緒",
      "ご案内",
      "紹介",
    ],
    modelAnswer:
      "「もちろんです！比較して決めるのは大事ですよね。ちなみに、他の物件で特にチェックしたいポイントって何ですか？……なるほど、◯◯ですね。実はその条件だとこのエリアではこの物件がほぼ唯一なんです。もしよろしければ、比較用にあと2件ご案内しますので、今日中に見比べてみませんか？」",
    technique: "比較基準の特定＋即日案内",
    tip: "「他も見たい」=判断基準が曖昧。基準を一緒に整理し、比較を自分がリードする。",
  },
  {
    id: 4,
    situation:
      "築2年のきれいなワンルーム。内装は文句なし。物件情報シートの「駅徒歩12分」を見て——",
    customerSays: "駅からちょっと遠いですよね…毎日の通勤がしんどそう。",
    keywords: [
      "バス",
      "自転車",
      "実際",
      "歩い",
      "慣れ",
      "静か",
      "環境",
      "安い",
      "家賃",
      "差額",
      "分",
      "駅近",
      "騒音",
      "メリット",
      "商店街",
      "スーパー",
      "ルート",
    ],
    modelAnswer:
      "「確かに数字だけ見ると遠く感じますよね。実は私も最初そう思ったんですが、実際に歩いてみると平坦な道で信号もなく体感8分なんです。しかも駅近の同条件だと家賃が1.5万円ほど上がります。月1.5万円を12ヶ月で18万円——その分、設備の良いこちらのほうが『住んでからの満足度』は断然高いですよ。」",
    technique: "体感時間の再定義＋年間コスト換算",
    tip: "物件のデメリットは「数字の印象」であることが多い。体感と年間コストで再評価させる。",
  },
  {
    id: 5,
    situation:
      "1LDK・駅徒歩5分。リノベ済みで内装は新品同然。ただ、物件概要の築年数を見て——",
    customerSays: "築25年かぁ…地震とか大丈夫ですかね？古い建物はちょっと不安で。",
    keywords: [
      "耐震",
      "リノベ",
      "リフォーム",
      "新耐震",
      "基準",
      "1981",
      "昭和56",
      "改修",
      "補強",
      "管理",
      "修繕",
      "内装",
      "新品",
      "きれい",
      "メンテナンス",
      "安全",
      "構造",
    ],
    modelAnswer:
      "「不安になりますよね、よくわかります。実はこの物件は1981年以降の新耐震基準で建てられていて、さらに3年前に大規模修繕と耐震補強を済ませています。内装もフルリノベーションで配管まで交換済みなので、むしろ築浅で管理が雑な物件より安全性は高いんです。管理組合の修繕記録もお見せしますね。」",
    technique: "事実提示＋比較逆転法",
    tip: "「古い=危ない」は思い込み。データで安心感を与え、むしろ優位性に変える。",
  },
  {
    id: 6,
    situation:
      "築10年・2DK。立地も価格も条件ピッタリ。しかし部屋に入った瞬間——",
    customerSays: "思ったより狭いかな…荷物入るかちょっと心配です。",
    keywords: [
      "収納",
      "レイアウト",
      "配置",
      "家具",
      "測",
      "図面",
      "工夫",
      "使い方",
      "実際",
      "住ん",
      "広",
      "見え",
      "クローゼット",
      "棚",
      "整理",
      "ロフト",
      "空間",
    ],
    modelAnswer:
      "「なるほど、広さって実際に見ると印象変わりますよね。ちなみに今お使いの家具の大きさを教えてもらえますか？……実はこの間取り、クローゼットが2箇所で合計3畳分あるので、収納力は見た目以上なんです。前の入居者さんもダブルベッド+デスクで快適に住まれてました。よろしければ家具配置のシミュレーションを出しますね。」",
    technique: "具体化＋前住者の実例",
    tip: "「狭い」は主観。具体的なサイズ確認と実例で『住んだらどうなるか』をイメージさせる。",
  },
];

/* ═══════════════════════════════════════════════════════════════
   SCORING
═══════════════════════════════════════════════════════════════ */

function calcScore(
  answer: string,
  scenario: ChallengeScenario,
  timeLeft: number,
): { total: number; timeScore: number; contentScore: number; grade: string } {
  // Time score: 0-40 points (proportional to remaining time)
  const timeScore = Math.round((timeLeft / 60) * 40);

  // Content score: 0-60 points (keyword matching + length)
  const lower = answer.toLowerCase();
  const matched = scenario.keywords.filter((kw) =>
    lower.includes(kw.toLowerCase()),
  ).length;
  const keywordRatio = Math.min(matched / 5, 1); // Cap at 5 keywords
  const lengthBonus = Math.min(answer.length / 80, 1); // Bonus for substantive answers
  const contentScore = Math.round(keywordRatio * 45 + lengthBonus * 15);

  const total = Math.min(timeScore + contentScore, 100);

  const grade =
    total >= 90
      ? "S"
      : total >= 75
        ? "A"
        : total >= 55
          ? "B"
          : total >= 35
            ? "C"
            : "D";

  return { total, timeScore, contentScore, grade };
}

const GRADE_COLORS: Record<string, string> = {
  S: "#F59E0B",
  A: "#22C55E",
  B: "#3B82F6",
  C: "#A855F7",
  D: "#EF4444",
};

const GRADE_LABELS: Record<string, string> = {
  S: "即戦力の切り返し！",
  A: "優秀！実践レベル",
  B: "良い線いってる！",
  C: "もう少し具体性を",
  D: "基本を押さえよう",
};

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════════════════════════ */

// Circular countdown timer
function CountdownTimer({
  timeLeft,
  total,
}: {
  timeLeft: number;
  total: number;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / total;
  const offset = circumference * (1 - progress);
  const urgent = timeLeft <= 10;
  const color = urgent ? "#EF4444" : timeLeft <= 20 ? "#EAB308" : "#22C55E";

  return (
    <div className="rc-timer-wrap">
      <svg width="140" height="140" viewBox="0 0 120 120">
        {/* Background ring */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#1E293B"
          strokeWidth="8"
        />
        {/* Progress ring */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          className="transition-all duration-1000 ease-linear"
          style={{
            filter: urgent ? `drop-shadow(0 0 8px ${color}80)` : undefined,
          }}
        />
      </svg>
      <div className="rc-timer-text">
        <span
          className={`text-3xl font-black tabular-nums ${urgent ? "rc-timer-urgent" : ""}`}
          style={{ color }}
        >
          {timeLeft}
        </span>
        <span className="text-[10px] font-medium text-[#64748B] tracking-wider">
          SEC
        </span>
      </div>
    </div>
  );
}

// Intro screen
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-fade-in-up mx-auto max-w-lg text-center">
      {/* Timer icon */}
      <div className="rc-intro-icon-wrap mb-8">
        <div className="rc-intro-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2 2" />
            <path d="M5 3L2 6" />
            <path d="M22 6l-3-3" />
            <path d="M12 5V3" />
            <path d="M10 3h4" />
          </svg>
        </div>
      </div>

      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
        Rebuttal Challenge
      </p>
      <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
        60秒 切り返しチャレンジ
      </h2>
      <p className="mb-8 text-sm leading-relaxed text-muted">
        賃貸物件の内見中、お客さんの反論に
        <strong className="text-foreground">60秒以内</strong>
        で切り返せ。
        <br />
        即座に採点＋模範トークを表示します。
      </p>

      {/* Rules */}
      <div className="mb-8 mx-auto max-w-sm space-y-3 text-left">
        {[
          { icon: "M12 8v4l3 3", label: "制限時間60秒で回答を入力" },
          { icon: "M9 12l2 2 4-4", label: "スピード＋内容の2軸で採点" },
          {
            icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
            label: "模範トーク＋テクニック解説付き",
          },
        ].map((rule, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-card-border bg-card px-4 py-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={rule.icon} />
              </svg>
            </div>
            <span className="text-sm font-medium text-foreground">
              {rule.label}
            </span>
          </div>
        ))}
      </div>

      <button onClick={onStart} className="rc-start-btn">
        <span className="rc-start-btn-glow" />
        <span className="relative z-10 flex items-center gap-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          チャレンジ開始
        </span>
      </button>

      <p className="mt-4 text-xs text-muted">
        全{SCENARIOS.length}問 ・ 賃貸物件の内見シーン
      </p>
    </div>
  );
}

// Challenge screen
function ChallengeScreen({
  scenario,
  questionNum,
  onSubmit,
}: {
  scenario: ChallengeScenario;
  questionNum: number;
  onSubmit: (answer: string, timeLeft: number) => void;
}) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [answer, setAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleSubmit = useCallback(() => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    onSubmit(answer, timeLeft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer, timeLeft, isSubmitted, onSubmit]);

  return (
    <div className="animate-fade-in-up mx-auto max-w-lg">
      {/* Question header */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
          Question {questionNum}/{SCENARIOS.length}
        </p>
        <div className="flex items-center gap-2">
          {Array.from({ length: SCENARIOS.length }, (_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i + 1 === questionNum ? 16 : 6,
                background:
                  i + 1 < questionNum
                    ? "var(--accent)"
                    : i + 1 === questionNum
                      ? "var(--accent)"
                      : "#1E293B",
              }}
            />
          ))}
        </div>
      </div>

      {/* Timer */}
      <div className="mb-6 flex justify-center">
        <CountdownTimer timeLeft={timeLeft} total={60} />
      </div>

      {/* Situation */}
      <p className="mb-4 text-sm leading-relaxed text-muted">
        {scenario.situation}
      </p>

      {/* Customer objection */}
      <div className="rc-objection-card mb-6">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
          お客さん
        </p>
        <p className="text-base font-medium leading-relaxed text-foreground">
          &ldquo;{scenario.customerSays}&rdquo;
        </p>
      </div>

      {/* Answer input */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-bold text-foreground">
          あなたの切り返し
        </label>
        <textarea
          ref={textareaRef}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={isSubmitted}
          placeholder="60秒以内にお客さんへの返答を入力..."
          rows={4}
          className="w-full rounded-xl border border-card-border bg-white px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition-all duration-200 placeholder:text-[#B4B0A8] focus:border-accent focus:shadow-[0_0_0_3px_rgba(249,115,22,0.1)] disabled:opacity-50 resize-none"
        />
        <p className="mt-1 text-right text-xs text-muted">
          {answer.length}文字
        </p>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitted || answer.trim().length === 0}
        className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSubmitted ? "採点中..." : "回答を提出する"}
      </button>
    </div>
  );
}

// Result screen with 3D card flip for model answer
function ResultScreen({
  scenario,
  answer,
  score,
  questionNum,
  onNext,
  onFinish,
}: {
  scenario: ChallengeScenario;
  answer: string;
  score: { total: number; timeScore: number; contentScore: number; grade: string };
  questionNum: number;
  onNext: () => void;
  onFinish: () => void;
}) {
  const [showModel, setShowModel] = useState(false);
  const gradeColor = GRADE_COLORS[score.grade] || "#64748B";
  const isLast = questionNum === SCENARIOS.length;

  return (
    <div className="animate-fade-in-up mx-auto max-w-lg">
      {/* Grade display */}
      <div className="mb-6 text-center">
        <div
          className="rc-grade-badge"
          style={
            {
              "--grade-color": gradeColor,
            } as React.CSSProperties
          }
        >
          <span className="rc-grade-letter">{score.grade}</span>
        </div>
        <p className="mt-3 text-sm font-bold" style={{ color: gradeColor }}>
          {GRADE_LABELS[score.grade]}
        </p>
      </div>

      {/* Score breakdown */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-card-border bg-card p-3 text-center">
          <p className="text-2xl font-black text-foreground">{score.total}</p>
          <p className="text-[10px] font-medium text-muted">総合スコア</p>
        </div>
        <div className="rounded-xl border border-card-border bg-card p-3 text-center">
          <p className="text-2xl font-black text-foreground">
            {score.timeScore}
          </p>
          <p className="text-[10px] font-medium text-muted">スピード</p>
        </div>
        <div className="rounded-xl border border-card-border bg-card p-3 text-center">
          <p className="text-2xl font-black text-foreground">
            {score.contentScore}
          </p>
          <p className="text-[10px] font-medium text-muted">内容</p>
        </div>
      </div>

      {/* Your answer */}
      <div className="mb-4 rounded-xl border border-card-border bg-card px-5 py-4">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
          あなたの回答
        </p>
        <p className="text-sm leading-relaxed text-foreground">
          {answer || "（未回答）"}
        </p>
      </div>

      {/* Model answer — 3D flip card */}
      <div className="rc-flip-container mb-6">
        <div className={`rc-flip-card ${showModel ? "rc-flipped" : ""}`}>
          {/* Front — tap to reveal */}
          <button
            className="rc-flip-front"
            onClick={() => setShowModel(true)}
            type="button"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <span className="text-sm font-bold text-accent">
                タップして模範トークを見る
              </span>
            </div>
          </button>
          {/* Back — model answer */}
          <div className="rc-flip-back">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
              Model Answer
            </p>
            <p className="mb-4 text-sm leading-relaxed text-foreground">
              {scenario.modelAnswer}
            </p>
            <div className="rounded-lg bg-accent/5 border border-accent/20 px-3 py-2">
              <p className="text-xs font-bold text-accent">
                {scenario.technique}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {scenario.tip}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {isLast ? (
          <button
            onClick={onFinish}
            className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-white transition hover:bg-accent-hover"
          >
            最終結果を見る
          </button>
        ) : (
          <button
            onClick={onNext}
            className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-white transition hover:bg-accent-hover"
          >
            次の問題へ →
          </button>
        )}
      </div>
    </div>
  );
}

// Final summary screen
function SummaryScreen({
  results,
  onRetry,
}: {
  results: {
    scenario: ChallengeScenario;
    answer: string;
    score: { total: number; timeScore: number; contentScore: number; grade: string };
  }[];
  onRetry: () => void;
}) {
  const avgScore = Math.round(
    results.reduce((sum, r) => sum + r.score.total, 0) / results.length,
  );
  const avgGrade =
    avgScore >= 90
      ? "S"
      : avgScore >= 75
        ? "A"
        : avgScore >= 55
          ? "B"
          : avgScore >= 35
            ? "C"
            : "D";
  const gradeColor = GRADE_COLORS[avgGrade] || "#64748B";

  const shareText = `【60秒切り返しチャレンジ】\n賃貸内見の反論対応で平均${avgScore}点（${avgGrade}ランク）でした！\nあなたも挑戦してみて`;
  const shareUrl = "https://seiyaku-coach.vercel.app/tools/rebuttal-challenge";

  return (
    <div className="animate-fade-in-up mx-auto max-w-lg">
      {/* Final grade */}
      <div className="mb-8 text-center">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted">
          Final Result
        </p>
        <div
          className="rc-grade-badge rc-grade-final"
          style={
            {
              "--grade-color": gradeColor,
            } as React.CSSProperties
          }
        >
          <span className="rc-grade-letter">{avgGrade}</span>
        </div>
        <p className="mt-4 text-3xl font-black text-foreground">
          {avgScore}
          <span className="text-lg font-medium text-muted">/100</span>
        </p>
        <p className="mt-1 text-sm font-bold" style={{ color: gradeColor }}>
          {GRADE_LABELS[avgGrade]}
        </p>
      </div>

      {/* Per-question breakdown */}
      <div className="mb-8 space-y-2">
        {results.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-card-border bg-card px-4 py-3"
          >
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
              style={{ background: GRADE_COLORS[r.score.grade] }}
            >
              {r.score.grade}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                Q{i + 1}: &ldquo;{r.scenario.customerSays.slice(0, 30)}…&rdquo;
              </p>
              <div className="mt-1 h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${r.score.total}%`,
                    background: GRADE_COLORS[r.score.grade],
                  }}
                />
              </div>
            </div>
            <span className="text-sm font-bold text-foreground tabular-nums">
              {r.score.total}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-white transition hover:bg-accent-hover"
        >
          もう一度チャレンジ
        </button>
        <Link
          href="/try-roleplay"
          className="block w-full rounded-xl border border-card-border bg-card py-3.5 text-center text-sm font-medium text-muted transition hover:border-foreground/20 hover:text-foreground"
        >
          AIロープレで実践する
        </Link>

        {/* SNS share */}
        <div className="flex gap-3 pt-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-card-border bg-card px-4 py-2.5 text-xs font-medium text-foreground transition hover:border-foreground/20"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            結果をシェア
          </a>
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-medium text-white transition hover:opacity-90"
            style={{ background: "#06C755" }}
          >
            LINE
          </a>
        </div>
      </div>

      {/* Related tools */}
      <div className="mt-8 pt-6 border-t border-card-border">
        <p className="mb-3 text-center text-xs font-bold text-muted uppercase tracking-wider">
          Related Tools
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/tools/objection-handbook"
            className="rounded-xl border border-card-border bg-card p-3 text-center text-xs font-medium text-foreground transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            反論切り返しトーク集
          </Link>
          <Link
            href="/tools/objection-scenario"
            className="rounded-xl border border-card-border bg-card p-3 text-center text-xs font-medium text-foreground transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            「考えます」シナリオ
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */

type Phase = "intro" | "challenge" | "result" | "summary";

export default function RebuttalChallengePage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [results, setResults] = useState<
    {
      scenario: ChallengeScenario;
      answer: string;
      score: { total: number; timeScore: number; contentScore: number; grade: string };
    }[]
  >([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [currentScore, setCurrentScore] = useState<{
    total: number;
    timeScore: number;
    contentScore: number;
    grade: string;
  } | null>(null);

  const handleStart = useCallback(() => {
    setPhase("challenge");
    setQuestionIndex(0);
    setResults([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = useCallback(
    (answer: string, timeLeft: number) => {
      const scenario = SCENARIOS[questionIndex];
      const score = calcScore(answer, scenario, timeLeft);
      setCurrentAnswer(answer);
      setCurrentScore(score);
      setTimeout(() => {
        setPhase("result");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 600);
    },
    [questionIndex],
  );

  const handleNext = useCallback(() => {
    if (!currentScore) return;
    setResults((prev) => [
      ...prev,
      {
        scenario: SCENARIOS[questionIndex],
        answer: currentAnswer,
        score: currentScore,
      },
    ]);
    setQuestionIndex((prev) => prev + 1);
    setCurrentAnswer("");
    setCurrentScore(null);
    setPhase("challenge");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [questionIndex, currentAnswer, currentScore]);

  const handleFinish = useCallback(() => {
    if (!currentScore) return;
    const finalResults = [
      ...results,
      {
        scenario: SCENARIOS[questionIndex],
        answer: currentAnswer,
        score: currentScore,
      },
    ];
    setResults(finalResults);
    setPhase("summary");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [results, questionIndex, currentAnswer, currentScore]);

  const handleRetry = useCallback(() => {
    setPhase("intro");
    setQuestionIndex(0);
    setResults([]);
    setCurrentAnswer("");
    setCurrentScore(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-2xl px-6 py-12">
        {/* Title — always visible */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted">
            60-Second Rebuttal Challenge
          </p>
          <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
            60秒<span className="text-accent">切り返し</span>チャレンジ
          </h1>
          <p className="text-sm text-muted">
            お客さんの反論に、制限時間内に切り返せ
          </p>
        </div>

        {/* Phase content */}
        {phase === "intro" && <IntroScreen onStart={handleStart} />}

        {phase === "challenge" && (
          <ChallengeScreen
            key={questionIndex}
            scenario={SCENARIOS[questionIndex]}
            questionNum={questionIndex + 1}
            onSubmit={handleSubmit}
          />
        )}

        {phase === "result" && currentScore && (
          <ResultScreen
            scenario={SCENARIOS[questionIndex]}
            answer={currentAnswer}
            score={currentScore}
            questionNum={questionIndex + 1}
            onNext={handleNext}
            onFinish={handleFinish}
          />
        )}

        {phase === "summary" && (
          <SummaryScreen results={results} onRetry={handleRetry} />
        )}
      </main>
    </div>
  );
}
