"use client";

import type { PhaseProps } from "@/types/worksheet";
import { SectionLabel } from "../SectionLabel";
import { Field } from "../Field";
import { Preview } from "../Preview";
import { AIButton } from "../AIButton";
import { PhaseCard } from "../PhaseCard";

export function Phase1Hearing({
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
      title="課題発掘シート（ヒアリング）"
      description="お客様の「浅い悩み」を「深い問題」に変える質問リストを準備する"
    >
      <SectionLabel color={color}>
        想定されるお客様のニーズ（3つ準備）
      </SectionLabel>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label="想定ニーズ 1"
          placeholder="例：集客に困っている"
          value={f("need1")}
          onChange={set("need1")}
        />
        <Field
          label="想定ニーズ 2"
          placeholder="例：コストを抑えたい"
          value={f("need2")}
          onChange={set("need2")}
        />
        <Field
          label="想定ニーズ 3"
          placeholder="例：人手が足りない"
          value={f("need3")}
          onChange={set("need3")}
        />
      </div>

      <SectionLabel color={color}>
        ニーズ発掘フレーズ（第三者話法）
      </SectionLabel>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label="ニーズ発掘フレーズ 1"
          placeholder='例：「同じ業界の方から○○というお悩みをよく伺うのですが…」'
          hint="第三者を引き合いに出してニーズを引き出す"
          value={f("drawer1")}
          onChange={set("drawer1")}
        />
        <Field
          label="ニーズ発掘フレーズ 2"
          placeholder='例：「最近よく○○で困っているという声を聞くのですが…」'
          value={f("drawer2")}
          onChange={set("drawer2")}
        />
        <Field
          label="ニーズ発掘フレーズ 3"
          placeholder='例：「皆さん最初は○○とおっしゃるのですが、実は△△だった…」'
          value={f("drawer3")}
          onChange={set("drawer3")}
        />
      </div>

      <SectionLabel color={color}>深掘り質問チェーン</SectionLabel>
      <Field
        label="原因の深掘り"
        placeholder="例：何が原因だと感じていますか？"
        hint="表面的な悩みの根本原因を探る"
        value={f("cause")}
        onChange={set("cause")}
      />
      <Field
        label="いつから？（時間軸・金額換算）"
        placeholder="例：いつ頃からその状況ですか？月にどれくらい損失ですか？"
        hint="問題の長さや金額に換算して重大さを認識させる"
        value={f("since")}
        onChange={set("since")}
      />
      <Field
        label="具体的にはどんな影響？"
        placeholder="例：具体的にどんな影響が出ていますか？"
        value={f("concrete")}
        onChange={set("concrete")}
      />
      <Field
        label="放置するとどうなる？"
        placeholder="例：このまま続くとどうなりそうですか？"
        hint="放置のリスクを自分の言葉で語らせる"
        value={f("neglect")}
        onChange={set("neglect")}
      />
      <Field
        label="気分はどうですか？"
        placeholder="例：それってどんな気持ちになりますか？"
        hint="感情に訴えて問題意識を高める"
        value={f("feeling")}
        onChange={set("feeling")}
      />

      <Preview active={!!preview}>
        {preview ||
          "ニーズ発掘→引き出し→深掘りの流れをAIがスクリプトに変換します"}
      </Preview>
      <AIButton onClick={onGenerate} loading={isLoading}>
        AIでスクリプト生成
      </AIButton>
    </PhaseCard>
  );
}
