"use client";

import type { PhaseProps } from "@/types/worksheet";
import { SectionLabel } from "../SectionLabel";
import { Field } from "../Field";
import { Preview } from "../Preview";
import { AIButton } from "../AIButton";
import { PhaseCard } from "../PhaseCard";

export function Phase0Approach({
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
      title="信頼構築シート（アプローチ）"
      description="商談相手に「この人の話を聞きたい」と思わせる最初の一言を準備する"
    >
      <SectionLabel color={color}>褒めポイントを3つ準備</SectionLabel>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label="外見・雰囲気"
          placeholder="例：明るくて話しやすい雰囲気ですね"
          hint="見た目、服装、声のトーンなど"
          value={f("praise1")}
          onChange={set("praise1")}
        />
        <Field
          label="会社・店舗"
          placeholder="例：オフィスが綺麗で働きやすそう"
          hint="立地、内装、設備など"
          value={f("praise2")}
          onChange={set("praise2")}
        />
        <Field
          label="実績・評判"
          placeholder="例：口コミの評価がすごく高い"
          hint="受賞歴、メディア掲載、口コミなど"
          value={f("praise3")}
          onChange={set("praise3")}
        />
      </div>

      <SectionLabel color={color}>ゴール共有（事前合意）</SectionLabel>
      <Field
        multiline
        placeholder="例：本日は弊社サービスについてご説明させてください。もし良いなと思われたら、ぜひこの機会にスタートしてみてください。もし合わないと感じたら遠慮なくおっしゃってください。"
        hint="「聞いて良ければ契約、合わなければ断ってOK」を事前に伝える文"
        value={f("premise")}
        onChange={set("premise")}
      />

      <Preview active={!!preview}>
        {preview || "ここに入力内容からトーク例が自動生成されます"}
      </Preview>
      <AIButton onClick={onGenerate} loading={isLoading}>
        AIでトーク例を生成
      </AIButton>
    </PhaseCard>
  );
}
