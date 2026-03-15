"use client";

import type { PhaseProps } from "@/types/worksheet";
import { SectionLabel } from "../SectionLabel";
import { Field } from "../Field";
import { Preview } from "../Preview";
import { AIButton } from "../AIButton";
import { PhaseCard } from "../PhaseCard";

export function Phase3Closing({
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
      title="クロージングシート"
      description="第三者の声・社会的証明・論理的理由・感情を組み合わせて決断を後押しする"
    >
      {/* ── 基本3技術 ── */}
      <SectionLabel color={color}>基本3技術</SectionLabel>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="第三者の声（カギカッコ）1"
          placeholder='例：「もっと早くやればよかった」'
          hint="実際のお客様の声をカギカッコで引用する"
          value={f("quote1")}
          onChange={set("quote1")}
        />
        <Field
          label="第三者の声（カギカッコ）2"
          placeholder='例：「想像以上に成果が出た」'
          value={f("quote2")}
          onChange={set("quote2")}
        />
      </div>
      <Field
        label="社会的証明（みなさん〜）"
        placeholder="例：同業種の80%が導入済み / 月間50社が新規契約"
        hint="「みなさんやっています」で安心感を与える"
        value={f("socialProof")}
        onChange={set("socialProof")}
      />
      <Field
        label="一貫性（前提設定との連動）"
        placeholder='例：「先ほど良いと思われたとおっしゃっていましたよね？であれば…」'
        hint="Phase1の前提設定と連動させ、一貫した行動を促す"
        value={f("consistency")}
        onChange={set("consistency")}
      />

      {/* ── ポジティブクロージング ── */}
      <SectionLabel color={color}>ポジティブクロージング</SectionLabel>
      <Field
        label="ポジティブIF"
        placeholder='例：「導入したら○○という未来が待っています」'
        hint="明るい未来を想像させて前向きな気持ちにする"
        value={f("posIf")}
        onChange={set("posIf")}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field
          label="ポジティブトリプル 1"
          placeholder="例：売上が上がる"
          hint="3つ連続で畳みかける"
          value={f("posTriple1")}
          onChange={set("posTriple1")}
        />
        <Field
          label="ポジティブトリプル 2"
          placeholder="例：コストが下がる"
          value={f("posTriple2")}
          onChange={set("posTriple2")}
        />
        <Field
          label="ポジティブトリプル 3"
          placeholder="例：時間が生まれる"
          value={f("posTriple3")}
          onChange={set("posTriple3")}
        />
      </div>

      {/* ── ネガティブクロージング ── */}
      <SectionLabel color={color}>ネガティブクロージング（ゆさぶり）</SectionLabel>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="逆SP（メリットなし版）"
          placeholder='例：「もし専任担当がいなかったら…」'
          hint="自社の強みがない世界を想像させる"
          value={f("negReverseSP")}
          onChange={set("negReverseSP")}
        />
        <Field
          label="逆ベネフィット（ネガティブ結末）"
          placeholder='例：「一から説明し直す手間がずっと続く」'
          hint="メリットの裏返し＝デメリットを伝える"
          value={f("negReverseBenefit")}
          onChange={set("negReverseBenefit")}
        />
      </div>
      <Field
        label="ネガティブIF"
        placeholder='例：「もし今やらなかったら、1年後には○○になっているかもしれません」'
        value={f("negIf")}
        onChange={set("negIf")}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field
          label="ネガティブトリプル 1"
          placeholder="例：競合に遅れる"
          hint="3つ連続で危機感を煽る"
          value={f("negTriple1")}
          onChange={set("negTriple1")}
        />
        <Field
          label="ネガティブトリプル 2"
          placeholder="例：コストが増える"
          value={f("negTriple2")}
          onChange={set("negTriple2")}
        />
        <Field
          label="ネガティブトリプル 3"
          placeholder="例：人材が流出する"
          value={f("negTriple3")}
          onChange={set("negTriple3")}
        />
      </div>

      {/* ── 欲求パターン ── */}
      <SectionLabel color={color}>欲求パターン</SectionLabel>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="積極的欲求（〜したい）"
          placeholder='例：「もっと売上を伸ばしたいですよね？」'
          hint="ポジティブな欲求を刺激する"
          value={f("activeDesire")}
          onChange={set("activeDesire")}
        />
        <Field
          label="消極的欲求（〜したくない）"
          placeholder='例：「このまま損し続けるのは嫌ですよね？」'
          hint="ネガティブ回避の欲求を刺激する"
          value={f("passiveDesire")}
          onChange={set("passiveDesire")}
        />
      </div>

      {/* ── 訴求フレーズ ── */}
      <SectionLabel color={color}>訴求フレーズ</SectionLabel>
      <Field
        multiline
        label="最終訴求フレーズ"
        placeholder='例：「○○と皆さんおっしゃってくれてます。同じ○○業界の方々もスタートされてますので、どうかこの機会にご決断ください。」'
        hint="全テクニックを集約した締めのフレーズ"
        value={f("appealPhrase")}
        onChange={set("appealPhrase")}
      />

      <Preview active={!!preview}>
        {preview ||
          "お客様の声＋社会的証明＋ポジティブ/ネガティブを組み合わせたクロージングトークをAIが生成します"}
      </Preview>
      <AIButton onClick={onGenerate} loading={isLoading}>
        AIで3パターン生成
      </AIButton>
    </PhaseCard>
  );
}
