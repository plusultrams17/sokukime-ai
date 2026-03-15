"use client";

import type { PhaseProps } from "@/types/worksheet";
import { SectionLabel } from "../SectionLabel";
import { Field } from "../Field";
import { Preview } from "../Preview";
import { AIButton } from "../AIButton";
import { PhaseCard } from "../PhaseCard";

export function Phase2Presentation({
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
      title="価値提案シート（プレゼン）"
      description="「特徴」を「お客様のメリット」に変換して、比較で優位性を伝える"
    >
      <SectionLabel color={color}>
        利点話法（SP → ベネフィット変換）3つ
      </SectionLabel>
      {[1, 2, 3].map((n) => (
        <div key={n} className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label={`セールスポイント ${n}`}
            placeholder={
              n === 1
                ? "例：専任担当制"
                : n === 2
                  ? "例：月次レポート"
                  : "例：初期費用0円"
            }
            value={f(`feature${n}`)}
            onChange={set(`feature${n}`)}
          />
          <Field
            label={`だから → ベネフィット ${n}`}
            placeholder={
              n === 1
                ? "例：何度も説明し直す手間がない"
                : n === 2
                  ? "例：数字で効果が見える"
                  : "例：リスクなく始められる"
            }
            value={f(`benefit${n}`)}
            onChange={set(`benefit${n}`)}
          />
        </div>
      ))}

      <SectionLabel color={color}>比較話法</SectionLabel>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label="他社のやり方"
          placeholder="例：担当がコロコロ変わる"
          value={f("compCompetitor")}
          onChange={set("compCompetitor")}
        />
        <Field
          label="当社のやり方"
          placeholder="例：専任1人が最後まで対応"
          value={f("compOurs")}
          onChange={set("compOurs")}
        />
        <Field
          label="お客様のメリット"
          placeholder="例：一貫した対応で安心"
          value={f("compBenefit")}
          onChange={set("compBenefit")}
        />
      </div>

      <SectionLabel color={color}>IF活用（想像させる）</SectionLabel>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="天国IF（ポジティブ想像）"
          placeholder='例：「もし導入したら、3ヶ月後には○○という状態になっているかもしれません」'
          hint="導入後の理想の未来を想像させる"
          multiline
          value={f("heavenIf")}
          onChange={set("heavenIf")}
        />
        <Field
          label="地獄IF（ネガティブ想像）"
          placeholder='例：「もしこのまま何もしなかったら、1年後には○○になっているかもしれません」'
          hint="導入しない場合の悲惨な未来を想像させる"
          multiline
          value={f("hellIf")}
          onChange={set("hellIf")}
        />
      </div>

      <Preview active={!!preview}>
        {preview ||
          "ベネフィット変換＋比較＋IF活用を組み合わせたプレゼントークをAIが生成します"}
      </Preview>
      <AIButton onClick={onGenerate} loading={isLoading}>
        AIでトーク生成
      </AIButton>
    </PhaseCard>
  );
}
