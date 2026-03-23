"use client";

import type { PhaseProps } from "@/types/worksheet";
import { SectionLabel } from "../SectionLabel";
import { Field } from "../Field";
import { Preview } from "../Preview";
import { AIButton } from "../AIButton";
import { PhaseCard } from "../PhaseCard";

const OBJECTION_PATTERNS = [
  {
    num: 1,
    title: "意思決定の壁",
    tagColor: { bg: "#FEF3C7", text: "#92400E" },
    scriptPlaceholder: "例：上司に相談しないと…",
    rebuttalPlaceholder:
      "例：そうですよね、慎重にされたいですよね。ちなみに○○様ご自身はいかがですか？",
  },
  {
    num: 2,
    title: "比較検討",
    tagColor: { bg: "#DBEAFE", text: "#1E40AF" },
    scriptPlaceholder: "例：他社も見てから決めたい",
    rebuttalPlaceholder:
      "例：もちろんです。ちなみに弊社自体は良いと思ってくださってますか？",
  },
  {
    num: 3,
    title: "予算の壁",
    tagColor: { bg: "#D1FAE5", text: "#065F46" },
    scriptPlaceholder: "例：ちょっと高いかな…",
    rebuttalPlaceholder:
      '例：高く感じさせてしまってすみません。実は皆さん「値段以上」とおっしゃってまして…',
  },
  {
    num: 4,
    title: "タイミングの壁",
    tagColor: { bg: "#FEE2E2", text: "#991B1B" },
    scriptPlaceholder: "例：今はまだいいかな",
    rebuttalPlaceholder:
      "例：いつかはやりたいとは思ってくださってますか？実は先送りが一番リスクが大きくて…",
  },
];

export function Phase4Objection({
  data,
  onChange,
  preview,
  onGenerate,
  isLoading,
  color,
}: PhaseProps) {
  const f = (key: string) => data[key] || "";
  const set = (key: string) => (value: string) => onChange(key, value);

  return (
    <PhaseCard
      title="反論処理シート"
      description="「考えます」と言われた時の切り返しパターンを事前準備する"
    >
      {/* ── 4大パターン ── */}
      <SectionLabel color={color}>想定される反論（4大パターン）</SectionLabel>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {OBJECTION_PATTERNS.map((pattern) => (
          <div
            key={pattern.num}
            className="rounded-xl border border-[#E8E4DD] bg-[#FAFAF8] p-5 transition-shadow hover:shadow-sm"
          >
            <div className="mb-3 flex items-center gap-2">
              <span
                className="inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-bold"
                style={{
                  background: pattern.tagColor.bg,
                  color: pattern.tagColor.text,
                }}
              >
                {pattern.title}
              </span>
            </div>
            <Field
              label="想定セリフ"
              placeholder={pattern.scriptPlaceholder}
              value={f(`obj${pattern.num}Script`)}
              onChange={set(`obj${pattern.num}Script`)}
            />
            <Field
              label="切り返し"
              placeholder={pattern.rebuttalPlaceholder}
              multiline
              value={f(`obj${pattern.num}Rebuttal`)}
              onChange={set(`obj${pattern.num}Rebuttal`)}
            />
          </div>
        ))}
      </div>

      {/* ── 切り返しの型（共通フレーム） ── */}
      <SectionLabel color={color}>切り返しの型（共通フレーム）</SectionLabel>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field
          label="共感フレーズ"
          placeholder='例：「そうですよね、おっしゃる通りです」'
          hint="まず相手の気持ちに寄り添う"
          value={f("empathy")}
          onChange={set("empathy")}
        />
        <Field
          label="感謝フレーズ"
          placeholder='例：「正直に言っていただきありがとうございます」'
          hint="反論してくれたことに感謝する"
          value={f("gratitude")}
          onChange={set("gratitude")}
        />
        <Field
          label="フックYES質問"
          placeholder='例：「ちなみに、サービス自体は良いと思ってくださってますか？」'
          hint="YES を引き出してから切り返す"
          value={f("hook")}
          onChange={set("hook")}
        />
      </div>

      {/* ── 5つの切り返し技法 ── */}
      <SectionLabel color={color}>5つの切り返し技法</SectionLabel>

      {/* 技法1: 目的の振り返り + 切り返しの公式 */}
      <div className="mb-4 rounded-xl border border-[#E8E4DD] bg-[#FAFAF8] p-5">
        <p className="mb-3 text-xs font-bold text-[#6B7280]">
          <span
            className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ background: color }}
          >
            1
          </span>
          目的の振り返り ＋ 切り返しの公式
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="目的の振り返り"
            placeholder='例：「そもそも今日お話を聞こうと思った理由を思い出してみてください」'
            hint="相手の初期動機に立ち返らせる"
            value={f("tech1Recall")}
            onChange={set("tech1Recall")}
          />
          <Field
            label="切り返しの公式"
            placeholder='例：A(同意) → R(理由) → E(具体例) → A(提案)'
            hint="論理的な4ステップで説得する"
            value={f("tech1Area")}
            onChange={set("tech1Area")}
          />
        </div>
      </div>

      {/* 技法2: 第三者エピソード */}
      <div className="mb-4">
        <Field
          label="② 第三者エピソード"
          placeholder='例：「実は以前、同じようにおっしゃっていたお客様がいたのですが、その方は結局…」'
          hint="同じ状況だった人の成功体験を語る"
          value={f("tech2Episode")}
          onChange={set("tech2Episode")}
        />
      </div>

      {/* 技法3: YESの積み上げ */}
      <div className="mb-4">
        <Field
          label="③ YESの積み上げ（自己説得法）"
          placeholder='例：「ちなみに○○は良いと思いますか？」→「△△はどうですか？」→「□□はいかがですか？」'
          hint="YESを連続で引き出してポジティブな流れを作る"
          multiline
          value={f("tech3YesPlus")}
          onChange={set("tech3YesPlus")}
        />
      </div>

      {/* 技法4: すり替え（リフレーミング） */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="④ すり替え（リフレーミング）"
          placeholder='例：「高い」→「実は1日あたりにすると缶コーヒー1本分です」'
          hint="反論の視点を別のフレームに変換する"
          value={f("tech4Reframe")}
          onChange={set("tech4Reframe")}
        />
        <Field
          label="④ 補正・褒め"
          placeholder='例：「そこまでしっかり考えていらっしゃるのは素晴らしい」'
          hint="反論を褒め言葉に変換する"
          value={f("tech4Correction")}
          onChange={set("tech4Correction")}
        />
      </div>

      {/* 技法5: 驚き＋謝罪 → 価値の再提示 */}
      <div className="mb-4 rounded-xl border border-[#E8E4DD] bg-[#FAFAF8] p-5">
        <p className="mb-3 text-xs font-bold text-[#6B7280]">
          <span
            className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ background: color }}
          >
            5
          </span>
          驚き＋謝罪 → 価値の再提示
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="驚き＋謝罪"
            placeholder='例：「えっ、そうなんですか！伝え方が悪くてすみません…」'
            hint="あえて驚いて謝ることで相手の心を開く"
            value={f("tech5Apology")}
            onChange={set("tech5Apology")}
          />
          <Field
            label="価値の再提示（SP×3連発）"
            placeholder='例：「実はまだお伝えしていないのですが、①○○ ②△△ ③□□ という特典もあるんです」'
            hint="セールスポイントを3つ畳みかける"
            multiline
            value={f("tech5Value")}
            onChange={set("tech5Value")}
          />
        </div>
      </div>

      <Preview active={!!preview}>
        {preview || "4大パターン＋5つの切り返し技法を組み合わせた反論処理フローをAIが生成します"}
      </Preview>
      <AIButton onClick={onGenerate} loading={isLoading}>
        AIで反論ロープレ生成
      </AIButton>
    </PhaseCard>
  );
}
