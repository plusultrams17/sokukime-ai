"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/header";

/* ═══════════════════════════════════════════════════════════════
   SCENARIO DATA — branching story for "考えます" objection
═══════════════════════════════════════════════════════════════ */

interface Choice {
  label: string;
  text: string;
  nextId: string;
}

interface ScenarioNode {
  id: string;
  type: "scene" | "result";
  tag?: string;
  tagColor?: string;
  situation: string;
  customerSays?: string;
  choices?: Choice[];
  resultType?: "success" | "neutral" | "fail";
  resultTitle?: string;
  resultDescription?: string;
  lesson?: string;
  technique?: string;
}

const SCENARIOS: ScenarioNode[] = [
  // ── SCENE 1: Initial objection ──
  {
    id: "start",
    type: "scene",
    tag: "SCENE 01",
    tagColor: "#F97316",
    situation:
      "住宅リフォームの商談。1時間のプレゼンを終え、お客さんの反応も悪くない。見積もりを出した瞬間——",
    customerSays: "うーん、いいとは思うんですけど...ちょっと考えさせてください。",
    choices: [
      {
        label: "A",
        text: "「分かりました。ご検討よろしくお願いします」と引き下がる",
        nextId: "a1_retreat",
      },
      {
        label: "B",
        text: "「何が引っかかってますか？」と本音を聞く",
        nextId: "b1_probe",
      },
      {
        label: "C",
        text: "「もちろんです！ちなみに、良いなと思った点はどこですか？」と肯定を引き出す",
        nextId: "c1_affirm",
      },
    ],
  },

  // ── A route: Retreat ──
  {
    id: "a1_retreat",
    type: "result",
    resultType: "fail",
    situation: "あなたは丁寧にお礼を言って帰宅した。",
    customerSays: "（奥さんに）あの人感じよかったけど、まあいいかな。",
    resultTitle: "失注 — 放置パターン",
    resultDescription:
      "「考えます」を額面通りに受け取った結果、お客さんの検討はフェードアウト。3日後にフォローの電話をしたが「もう他社に頼みました」と言われた。",
    lesson:
      "「考えます」は90%以上のケースで断り文句です。引き下がった瞬間に競合に渡ります。",
    technique: "ポイント：この場で理由を特定し、解消する一手が必要でした。",
  },

  // ── B route: Probe ──
  {
    id: "b1_probe",
    type: "scene",
    tag: "SCENE 02",
    tagColor: "#2EC4B6",
    situation:
      "あなたは率直に聞いた。お客さんは少し考えてから口を開いた——",
    customerSays: "んー...やっぱりちょっと金額が気になるかな。",
    choices: [
      {
        label: "A",
        text: "「では値引きさせていただきます」と即座に値下げする",
        nextId: "b2_discount",
      },
      {
        label: "B",
        text: "「ご予算はどのくらいをイメージされてましたか？」と基準を聞く",
        nextId: "b2_budget",
      },
      {
        label: "C",
        text: "「金額ですね。ちなみに他のお見積りと比べてでしょうか？」と比較対象を確認",
        nextId: "b2_compare",
      },
    ],
  },

  {
    id: "b2_discount",
    type: "result",
    resultType: "neutral",
    situation: "あなたは10%の値引きを提示した。",
    customerSays: "じゃあ...それでお願いしようかな。",
    resultTitle: "成約 — しかし利益ダウン",
    resultDescription:
      "契約は取れたが、安易な値引きで粗利が圧縮。さらに「値引きできるなら最初から安く出せよ」と不信感が残った。",
    lesson:
      "値引きは最後の手段。先に「なぜ高く感じるか」を特定しないと、値引きが習慣化します。",
    technique: "ポイント：値引きの前に「質問」で理由を深掘りすれば、値引き不要で解消できることが多い。",
  },

  {
    id: "b2_budget",
    type: "scene",
    tag: "SCENE 03",
    tagColor: "#A855F7",
    situation:
      "あなたは予算感を聞いた。お客さんは——",
    customerSays: "正直、80万くらいで収まるかと思ってたんだよね。見積もりは120万でしょ。",
    choices: [
      {
        label: "A",
        text: "「月々にすると1日たった400円の差です」とリフレーミングする",
        nextId: "b3_reframe",
      },
      {
        label: "B",
        text: "「80万のプランもご用意できます。ただ——」と段階案を提示",
        nextId: "b3_tier",
      },
    ],
  },

  {
    id: "b3_reframe",
    type: "result",
    resultType: "success",
    situation:
      "あなたは差額を日割りで伝えつつ、10年後のメンテナンスコストまで計算して見せた。",
    customerSays: "なるほど...そう考えると、長い目で見たらこっちのほうが得か。やっぱりお願いします！",
    resultTitle: "成約 — フル価格で契約",
    resultDescription:
      "価格のリフレーミングに成功。お客さんは「高い」のではなく「判断基準がなかった」だけだった。日割り換算＋長期コスト比較が決め手。",
    lesson:
      "価格の反論は「金額」ではなく「判断基準の不足」が原因の場合が多い。",
    technique: "テクニック：日割り換算法＋長期コスト比較",
  },

  {
    id: "b3_tier",
    type: "result",
    resultType: "success",
    situation:
      "あなたは80万のプランを見せつつ「120万プランとの違い」を明確に説明した。",
    customerSays: "...この保証の差は大きいな。うーん、やっぱり120万のほうでお願いします。",
    resultTitle: "成約 — 自発的にアップグレード",
    resultDescription:
      "段階プランを提示したことで「選択肢を与えた」形に。お客さん自身が比較して上位プランを選んだため、納得度が高い。",
    lesson:
      "人は「選ぶ」と満足度が上がる。1つの選択肢を押し付けるより、2〜3の比較を提示する方が成約率が高い。",
    technique: "テクニック：松竹梅プラン提示法（アンカリング）",
  },

  {
    id: "b2_compare",
    type: "result",
    resultType: "success",
    situation:
      "比較対象を確認すると、お客さんは「なんとなくの相場感」だと判明。あなたは施工実例と相場データを見せた。",
    customerSays: "あ、この規模だと普通そのくらいかかるんだ。じゃあ適正価格なんだね。",
    resultTitle: "成約 — 相場理解で納得",
    resultDescription:
      "「高い」の正体は「相場を知らないだけ」だった。データで証明し、安心感を与えた。",
    lesson:
      "「高い」の裏には「何と比べて？」がある。比較基準を特定すれば、8割は解消できる。",
    technique: "テクニック：比較基準の特定法",
  },

  // ── C route: Affirm ──
  {
    id: "c1_affirm",
    type: "scene",
    tag: "SCENE 02",
    tagColor: "#3B82F6",
    situation:
      "あなたは笑顔で聞いた。お客さんは——",
    customerSays: "うん、デザインはすごく気に入ってる。あと保証が10年ついてるのもいいよね。",
    choices: [
      {
        label: "A",
        text: "「ありがとうございます！では今日決めていただけますか？」と即座にクロージング",
        nextId: "c2_rush",
      },
      {
        label: "B",
        text: "「ですよね！残りの不安点は何かありますか？」と懸念を引き出す",
        nextId: "c2_concern",
      },
    ],
  },

  {
    id: "c2_rush",
    type: "result",
    resultType: "fail",
    situation: "あなたは畳みかけた。お客さんの表情が固まった。",
    customerSays: "いや...もうちょっと家族と相談してからにするよ。",
    resultTitle: "失注 — 押し売り拒否",
    resultDescription:
      "ポジティブな反応を確認した直後にクロージングしたが、タイミングが早すぎた。「押された」と感じたお客さんは防御モードに入り、以後連絡がつかなくなった。",
    lesson:
      "肯定を引き出した後、すぐにクロージングするのはNG。次に「不安の解消」を挟むことで自然な流れになる。",
    technique: "ポイント：Yes → 不安解消 → クロージングの3ステップを踏む。",
  },

  {
    id: "c2_concern",
    type: "scene",
    tag: "SCENE 03",
    tagColor: "#F43F5E",
    situation:
      "あなたは慎重に不安を聞いた。お客さんは——",
    customerSays: "実は...妻がまだ乗り気じゃなくて。お金のことは妻も関わるから。",
    choices: [
      {
        label: "A",
        text: "「奥様にもぜひ一度お話させてください」と同席を提案",
        nextId: "c3_family",
      },
      {
        label: "B",
        text: "「奥様に見せやすい資料を一枚お渡ししますね」とツールを提供",
        nextId: "c3_material",
      },
    ],
  },

  {
    id: "c3_family",
    type: "result",
    resultType: "success",
    situation:
      "後日、奥様も交えた2回目の面談。あなたは奥様の不安を丁寧にヒアリングし、家族全員で納得の決断。",
    customerSays: "（奥様）ここまで丁寧に説明してくれるなら安心。お願いします。",
    resultTitle: "成約 — 家族全員で合意",
    resultDescription:
      "「考えます」の本当の理由は「家族の合意が取れていない」だった。決裁者全員と話す場を作ったことで、一発で成約。",
    lesson:
      "BtoC営業で「考えます」が出たら、決裁関与者が他にいないか必ず確認する。",
    technique: "テクニック：決裁者特定法（Cルート最適解）",
  },

  {
    id: "c3_material",
    type: "result",
    resultType: "neutral",
    situation:
      "あなたは「奥様説明用の1枚サマリー」を渡した。3日後にお客さんから電話が来た。",
    customerSays: "妻に見せたら「いいんじゃない」って。お願いします。",
    resultTitle: "成約 — 間接的に家族を説得",
    resultDescription:
      "直接面談には至らなかったが、ツールを介して奥様の不安を解消。成約率はAルート（同席）より低いが、押しつけ感なく成約できた。",
    lesson:
      "全員が同席できない場合は「伝言ツール」を渡す。一枚サマリーは最強の営業アシスタント。",
    technique: "テクニック：パンフレット作戦（間接説得法）",
  },
];

const SCENARIO_MAP = Object.fromEntries(SCENARIOS.map((s) => [s.id, s]));

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════════════════════════ */

function SceneView({
  node,
  onSelect,
}: {
  node: ScenarioNode;
  onSelect: (nextId: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = useCallback(
    (nextId: string) => {
      if (selected) return;
      setSelected(nextId);
      setTimeout(() => onSelect(nextId), 500);
    },
    [selected, onSelect],
  );

  return (
    <div className="animate-fade-in-up mx-auto max-w-lg">
      {node.tag && (
        <p
          className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em]"
          style={{ color: node.tagColor || "var(--accent)" }}
        >
          {node.tag}
        </p>
      )}

      <p className="mb-4 text-sm leading-relaxed text-muted">
        {node.situation}
      </p>

      {node.customerSays && (
        <div className="mb-6 rounded-2xl border border-card-border bg-card px-5 py-4">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
            お客さん
          </p>
          <p className="text-base font-medium leading-relaxed text-foreground">
            &ldquo;{node.customerSays}&rdquo;
          </p>
        </div>
      )}

      <p className="mb-4 text-sm font-bold text-foreground">
        あなたならどうする？
      </p>

      <div className="space-y-3">
        {node.choices?.map((choice) => {
          const isSelected = selected === choice.nextId;
          return (
            <button
              key={choice.nextId}
              onClick={() => handleSelect(choice.nextId)}
              disabled={selected !== null}
              className="group w-full rounded-xl border px-5 py-4 text-left text-sm leading-relaxed transition-all duration-200"
              style={{
                borderColor: isSelected
                  ? node.tagColor || "var(--accent)"
                  : "var(--card-border)",
                background: isSelected
                  ? `${node.tagColor || "#F97316"}08`
                  : "var(--card)",
                transform: isSelected ? "scale(1.02)" : undefined,
              }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    border: `1.5px solid ${isSelected ? node.tagColor || "var(--accent)" : "var(--card-border)"}`,
                    color: isSelected
                      ? node.tagColor || "var(--accent)"
                      : "var(--muted)",
                  }}
                >
                  {choice.label}
                </span>
                <span className={isSelected ? "font-semibold" : ""}>
                  {choice.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultView({
  node,
  onRetry,
}: {
  node: ScenarioNode;
  onRetry: () => void;
}) {
  const color =
    node.resultType === "success"
      ? "#22C55E"
      : node.resultType === "fail"
        ? "#EF4444"
        : "#EAB308";
  const icon =
    node.resultType === "success"
      ? "M20 6L9 17l-5-5"
      : node.resultType === "fail"
        ? "M18 6L6 18M6 6l12 12"
        : "M12 9v4m0 4h.01";

  return (
    <div className="animate-fade-in-up mx-auto max-w-lg">
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: `${color}15` }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={icon} />
          </svg>
        </div>
      </div>

      <h2
        className="mb-2 text-center text-xl font-bold"
        style={{ color }}
      >
        {node.resultTitle}
      </h2>

      {node.customerSays && (
        <div className="mb-4 rounded-2xl border border-card-border bg-card px-5 py-4">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
            お客さん
          </p>
          <p className="text-sm leading-relaxed text-foreground italic">
            &ldquo;{node.customerSays}&rdquo;
          </p>
        </div>
      )}

      <p className="mb-6 text-sm leading-relaxed text-muted">
        {node.resultDescription}
      </p>

      {/* Lesson card */}
      <div className="mb-4 rounded-2xl border border-accent/30 bg-accent/5 px-5 py-4">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
          Learning
        </p>
        <p className="text-sm font-medium leading-relaxed text-foreground">
          {node.lesson}
        </p>
      </div>

      {node.technique && (
        <div className="mb-8 rounded-2xl border border-card-border bg-card px-5 py-4">
          <p className="text-sm leading-relaxed text-muted">
            {node.technique}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 text-center">
        <button
          onClick={onRetry}
          className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-white transition hover:bg-accent-hover"
        >
          別のルートを試す
        </button>
        <Link
          href="/roleplay"
          className="block w-full rounded-xl border border-card-border bg-card py-3.5 text-sm font-medium text-muted transition hover:border-foreground/20 hover:text-foreground"
        >
          AIロープレで実践する
        </Link>

        {/* SNS share */}
        <div className="flex gap-3 pt-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`【営業シナリオ】「考えます」にどう返す？結果は「${node.resultTitle}」でした\nあなたも挑戦してみて`)}&url=${encodeURIComponent("https://seiyaku-coach.vercel.app/tools/objection-scenario")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-card-border bg-card px-4 py-2.5 text-xs font-medium text-foreground transition hover:border-foreground/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            X
          </a>
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent("https://seiyaku-coach.vercel.app/tools/objection-scenario")}&text=${encodeURIComponent(`【営業シナリオ】「考えます」にどう返す？結果は「${node.resultTitle}」でした`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-medium text-white transition hover:opacity-90"
            style={{ background: "#06C755" }}
          >
            LINE
          </a>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */

export default function ObjectionScenarioPage() {
  const [currentId, setCurrentId] = useState("start");
  const [history, setHistory] = useState<string[]>(["start"]);

  const current = SCENARIO_MAP[currentId];

  const handleSelect = useCallback(
    (nextId: string) => {
      setCurrentId(nextId);
      setHistory((h) => [...h, nextId]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [],
  );

  const handleRetry = useCallback(() => {
    setCurrentId("start");
    setHistory(["start"]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!current) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-2xl px-6 py-12">
        {/* Title */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted">
            Interactive Scenario
          </p>
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            「考えます」にどう返す？
          </h1>
          <p className="text-sm text-muted">
            選択肢を選んで、商談の結末を体験しよう
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {history.map((id, i) => {
            const node = SCENARIO_MAP[id];
            const isResult = node?.type === "result";
            const isCurrent = i === history.length - 1;
            return (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: isCurrent ? 24 : 8,
                  background: isResult
                    ? node.resultType === "success"
                      ? "#22C55E"
                      : node.resultType === "fail"
                        ? "#EF4444"
                        : "#EAB308"
                    : isCurrent
                      ? "var(--accent)"
                      : "var(--card-border)",
                }}
              />
            );
          })}
        </div>

        {/* Content */}
        {current.type === "scene" ? (
          <SceneView node={current} onSelect={handleSelect} />
        ) : (
          <ResultView node={current} onRetry={handleRetry} />
        )}
      </main>
    </div>
  );
}
