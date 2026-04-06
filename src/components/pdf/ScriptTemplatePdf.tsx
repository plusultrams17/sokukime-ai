"use client";

import { forwardRef } from "react";

interface StepData {
  number: number;
  name: string;
  purpose: string;
  template: string[];
  customizePoints: string[];
  industryHints: { industry: string; hint: string }[];
}

const STEPS: StepData[] = [
  {
    number: 1,
    name: "褒める（アイスブレイク）",
    purpose: "相手の警戒心を解き、心理的な距離を縮める。第一印象で信頼の土台をつくる。",
    template: [
      "「本日はお忙しい中、お時間をいただきありがとうございます。」",
      "「御社の○○（具体的な点）、非常に素晴らしいですね。特に○○の部分は業界でも注目されています。」",
      "「○○様がご担当されていると伺いました。○○の分野で実績を出されていて、すごいですね。」",
    ],
    customizePoints: [
      "相手の会社・個人について事前リサーチした具体的な内容を入れる",
      "お世辞ではなく、事実に基づいた具体的な褒め言葉にする",
      "名前を呼ぶことで親近感を高める",
    ],
    industryHints: [
      { industry: "不動産", hint: "「この物件の立地条件、非常にいいですね」「エリアの相場をよくご存知ですね」" },
      { industry: "保険", hint: "「ご家族のことをしっかり考えられていて素晴らしいです」" },
      { industry: "建設", hint: "「この施工実績、品質の高さが伝わります」" },
      { industry: "IT", hint: "「御社のプロダクトのUI、使いやすさにこだわりが感じられます」" },
    ],
  },
  {
    number: 2,
    name: "事前合意（ゴール設定）",
    purpose: "商談のゴールを明確にし、お互いの時間を有意義にする。「検討します」を予防する。",
    template: [
      "「本日は30分ほどお時間をいただいていますが、最後にお互いに合う・合わないを率直にお伝えし合えればと思います。」",
      "「合わないと思われたら遠慮なくおっしゃってください。無理なお勧めは一切しません。」",
      "「逆に、良いと思われた場合は、具体的な進め方についてもお話できればと思いますが、よろしいですか？」",
    ],
    customizePoints: [
      "商談時間を明示して、相手に安心感を与える",
      "「断ってもいい」と伝えることで心理的プレッシャーを軽減する",
      "YESの場合の次のアクションも事前に合意しておく",
    ],
    industryHints: [
      { industry: "不動産", hint: "「この物件が合わなければ、別の条件も一緒に探しましょう」" },
      { industry: "保険", hint: "「無理にご加入いただく必要はありません。比較材料としてお聞きください」" },
      { industry: "建設", hint: "「概算で合わなければ、その場でお伝えします」" },
      { industry: "IT", hint: "「導入効果が見込めない場合は、正直にお伝えします」" },
    ],
  },
  {
    number: 3,
    name: "ニーズ喚起（ヒアリング）",
    purpose: "相手が自覚していない課題や不満を引き出し、「変えたい」という動機を生み出す。",
    template: [
      "「現在、○○についてどのように対応されていますか？」（現状の把握）",
      "「その中で、もし1つだけ改善できるとしたら、どの部分ですか？」（潜在課題の発掘）",
      "「もしそれが改善されたら、どのくらいの効果が期待できそうですか？」（理想の可視化）",
      "「逆に、このまま放置した場合、○ヶ月後にどうなりそうですか？」（リスクの意識化）",
    ],
    customizePoints: [
      "質問は「現状→課題→理想→リスク」の順番で深掘りする",
      "相手に「自分で気づいた」と感じさせることが重要",
      "数字で答えられる質問を混ぜて具体性を高める",
    ],
    industryHints: [
      { industry: "不動産", hint: "「今のお住まいで、通勤時間や間取りに不満はありますか？」" },
      { industry: "保険", hint: "「万が一の場合、ご家族の生活費は何年分確保できていますか？」" },
      { industry: "建設", hint: "「現在の設備で、メンテナンスコストはどのくらいかかっていますか？」" },
      { industry: "IT", hint: "「この作業に月何時間かかっていますか？それが半分になったら？」" },
    ],
  },
  {
    number: 4,
    name: "プレゼン（価値提案）",
    purpose: "相手の課題に対する解決策を提示し、「自分のための提案だ」と感じさせる。",
    template: [
      "「先ほどおっしゃっていた○○の課題に対して、当社では○○という形で解決しています。」",
      "「具体的には、○○様と同じ状況だった○○社様では、導入後○ヶ月で○○という成果が出ました。」",
      "「○○様のケースに当てはめると、○○という効果が見込めます。」",
      "「他社との違いは○○です。特に○○の点で選んでいただいています。」",
    ],
    customizePoints: [
      "ヒアリングで聞いた課題に直結する形で提案する",
      "機能説明ではなく「相手にとっての価値」で語る",
      "同業種・同規模の事例を必ず1つ入れる",
    ],
    industryHints: [
      { industry: "不動産", hint: "「この物件なら通勤時間が○分短縮、年間○時間の節約になります」" },
      { industry: "保険", hint: "「このプランなら、ご家族の生活を○年間守れます」" },
      { industry: "建設", hint: "「この工法なら工期を○日短縮、コストを○%削減できます」" },
      { industry: "IT", hint: "「導入企業の平均で、作業時間が○%削減されています」" },
    ],
  },
  {
    number: 5,
    name: "クロージング（決断促進）",
    purpose: "相手の背中を押し、「今、決める」ことの合理性を伝える。",
    template: [
      "「ここまでお聞きになって、率直にどう思われましたか？」（感想を聞く）",
      "「○○様のお話を伺った限り、十分に効果が見込めると考えています。」（確信を伝える）",
      "「もし始めるとしたら、AプランとBプランのどちらがイメージに近いですか？」（二者択一）",
      "「今月中のスタートですと、○○の特典もお付けできます。」（限定性の提示）",
    ],
    customizePoints: [
      "「買いますか？」ではなく「AとBどちらですか？」で選択を促す",
      "沈黙を恐れず、相手が考える時間を与える",
      "最後は「始める前提」で手続きの話に移行する",
    ],
    industryHints: [
      { industry: "不動産", hint: "「この条件の物件は次いつ出るかわかりません。内見だけでもいかがですか？」" },
      { industry: "保険", hint: "「健康なうちに加入されたほうが、保険料は確実にお安くなります」" },
      { industry: "建設", hint: "「繁忙期前にご発注いただければ、優先的にスケジュールを確保できます」" },
      { industry: "IT", hint: "「今月開始なら、初期設定のサポートを無料でお付けします」" },
    ],
  },
];

const ACCENT = "#f97316";

const S = {
  page: {
    width: "794px",
    padding: "40px",
    fontFamily: "system-ui, sans-serif",
    backgroundColor: "#FFFFFF",
    color: "#1E293B",
    fontSize: "11px",
    lineHeight: "1.6",
  },
  header: {
    borderBottom: `3px solid ${ACCENT}`,
    paddingBottom: "12px",
    marginBottom: "20px",
  },
  h1: { fontSize: "20px", fontWeight: "bold" as const, margin: 0 },
  subtitle: { color: "#64748B", margin: "4px 0 0", fontSize: "11px" },
  stepHeader: {
    backgroundColor: ACCENT,
    color: "#FFFFFF",
    padding: "8px 14px",
    fontSize: "14px",
    fontWeight: "bold" as const,
    marginBottom: "12px",
    marginTop: "22px",
  },
  purposeBox: {
    backgroundColor: "#FFF7ED",
    border: `1px solid ${ACCENT}40`,
    padding: "8px 12px",
    marginBottom: "12px",
    fontSize: "11px",
    color: "#92400E",
  },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: "bold" as const,
    color: ACCENT,
    marginBottom: "6px",
    borderBottom: `1px solid ${ACCENT}30`,
    paddingBottom: "3px",
  },
  templateLine: {
    fontSize: "11px",
    color: "#1E293B",
    padding: "4px 0 4px 10px",
    borderLeft: `2px solid ${ACCENT}`,
    marginBottom: "4px",
  },
  point: {
    fontSize: "10.5px",
    color: "#374151",
    paddingLeft: "10px",
    marginBottom: "3px",
  },
  hintRow: {
    display: "flex" as const,
    gap: "4px",
    marginBottom: "3px",
    fontSize: "10px",
  },
  hintLabel: {
    fontWeight: "bold" as const,
    color: ACCENT,
    minWidth: "40px",
    flexShrink: 0,
  },
  hintText: {
    color: "#64748B",
  },
  blankArea: {
    border: "1px dashed #CBD5E1",
    padding: "8px 12px",
    minHeight: "50px",
    marginTop: "8px",
    marginBottom: "12px",
    backgroundColor: "#FAFAFA",
    fontSize: "9px",
    color: "#94A3B8",
  },
  footer: {
    borderTop: "1px solid #E5DFD6",
    paddingTop: "10px",
    marginTop: "20px",
    textAlign: "center" as const,
    fontSize: "9px",
    color: "#94A3B8",
  },
} as const;

const ScriptTemplatePdf = forwardRef<HTMLDivElement>(
  function ScriptTemplatePdf(_props, ref) {
    return (
      <div ref={ref} style={S.page}>
        {/* Header */}
        <div style={S.header}>
          <h1 style={S.h1}>5ステップ トークスクリプト テンプレート</h1>
          <p style={S.subtitle}>
            成約コーチ AI | 成約5ステップメソッド準拠 | 出力日: {new Date().toLocaleDateString("ja-JP")}
          </p>
        </div>

        {/* Steps */}
        {STEPS.map((step) => (
          <div key={step.number}>
            <div style={S.stepHeader}>
              Step {step.number}: {step.name}
            </div>

            {/* Purpose */}
            <div style={S.purposeBox}>
              <strong>目的: </strong>{step.purpose}
            </div>

            {/* Template Talk */}
            <div style={{ marginBottom: "10px" }}>
              <div style={S.sectionLabel}>テンプレートトーク</div>
              {step.template.map((line, i) => (
                <div key={i} style={S.templateLine}>{line}</div>
              ))}
            </div>

            {/* Customize Points */}
            <div style={{ marginBottom: "10px" }}>
              <div style={S.sectionLabel}>カスタマイズのポイント</div>
              {step.customizePoints.map((p, i) => (
                <div key={i} style={S.point}>
                  {i + 1}. {p}
                </div>
              ))}
            </div>

            {/* Industry Hints */}
            <div style={{ marginBottom: "8px" }}>
              <div style={S.sectionLabel}>業種別ヒント</div>
              {step.industryHints.map((h, i) => (
                <div key={i} style={S.hintRow}>
                  <span style={S.hintLabel}>{h.industry}:</span>
                  <span style={S.hintText}>{h.hint}</span>
                </div>
              ))}
            </div>

            {/* Blank area for customization */}
            <div style={S.blankArea}>
              [あなたの商材・顧客に合わせたトークを記入]
            </div>
          </div>
        ))}

        {/* Footer */}
        <div style={S.footer}>
          成約コーチ AI - 5ステップ トークスクリプト テンプレート | 購入者限定資料 | 無断転載・再配布禁止
        </div>
      </div>
    );
  },
);

export default ScriptTemplatePdf;
