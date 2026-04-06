"use client";

import { forwardRef } from "react";

interface ObjectionPattern {
  objection: string;
  responses: string[];
  technique: string;
}

interface CategoryData {
  name: string;
  items: ObjectionPattern[];
}

const CATEGORIES: CategoryData[] = [
  {
    name: "価格・費用",
    items: [
      { objection: "高いですね", responses: ["「何と比較して高いと感じますか？」と基準を確認し、価値の再提示につなげる", "日割り・月額換算で費用対効果を可視化する"], technique: "質問法+日割り換算" },
      { objection: "予算がありません", responses: ["「予算の問題をクリアできる方法があるとしたら、ご検討いただけますか？」と仮定で聞く", "分割払い・リース・補助金など支払い方法の選択肢を提示する"], technique: "仮定法+代替手段" },
      { objection: "他社のほうが安いです", responses: ["「見積もりの内訳は同じ条件でしたか？」と条件の違いを確認する", "品質・サポート・保証の違いを整理して伝える"], technique: "条件比較法" },
      { objection: "今のままで十分です", responses: ["「もし○○の部分がさらに良くなるとしたら？」と改善の可能性を示す", "現状維持のリスク（競合の動き・市場変化）を穏やかに提示する"], technique: "共感+リスク提示" },
      { objection: "費用対効果がわかりません", responses: ["具体的な数値シミュレーション（○ヶ月で回収、年間○万円の削減）を提示する", "同業種・同規模の導入事例で得られた効果を紹介する"], technique: "定量化+事例提示" },
    ],
  },
  {
    name: "時期・タイミング",
    items: [
      { objection: "今は忙しいです", responses: ["「3分だけ要点をお伝えしてもよろしいですか？」と短時間を提案する", "「お忙しい方ほどメリットが大きい提案です」と興味を引く"], technique: "時間限定法" },
      { objection: "来月検討します", responses: ["「今決めることのメリットをお伝えしてもいいですか？」と緊急性を伝える", "「検討材料としてお見積もりだけお渡しします」と接点を維持する"], technique: "緊急性+接点維持" },
      { objection: "もう少し様子を見たい", responses: ["「何がクリアになれば決断できますか？」と判断基準を明確にする", "様子を見ている間のコスト（機会損失）を穏やかに提示する"], technique: "判断基準の明確化" },
      { objection: "今すぐは必要ない", responses: ["「今準備しておくと○○のメリットがあります」と予防の重要性を伝える", "将来の変化やリスクを具体的に提示する"], technique: "予防提案法" },
      { objection: "導入時期が合わない", responses: ["「お客様のベストなタイミングに合わせてスケジュールを組みます」と柔軟性を示す", "「今お申し込み、開始は○月から」と契約と開始を分離する"], technique: "契約と開始の分離" },
    ],
  },
  {
    name: "検討・保留",
    items: [
      { objection: "検討させてください", responses: ["「何か気になる点がありますか？今お答えできるかもしれません」と懸念を引き出す", "「検討される際のポイントを3つお伝えします」と情報提供で主導権を維持"], technique: "懸念引き出し法" },
      { objection: "上に相談してみます", responses: ["「上の方にご説明しやすいよう、ポイントをまとめた資料をお作りします」", "「次回上の方もご同席いただけると直接ご質問にお答えできます」と同席提案"], technique: "稟議サポート+同席" },
      { objection: "家族と話してから", responses: ["「ご説明しやすいよう、メリットを整理した資料をお渡しします」", "「次回ご家族もご一緒にいかがですか？」と次回アポを確約する"], technique: "家族同伴アポ" },
      { objection: "もう少し情報が欲しい", responses: ["「どんな情報があれば判断しやすくなりますか？」と具体的に聞く", "「一番気になっているポイントを教えてください」と的を絞る"], technique: "ピンポイント情報提供" },
      { objection: "資料だけいただけますか", responses: ["「資料だけではお伝えしきれない部分もありますので、5分だけ補足します」", "「御社向けのシミュレーション結果もお持ちします」と次回アポにつなげる"], technique: "資料+アポのセット" },
    ],
  },
  {
    name: "競合・比較",
    items: [
      { objection: "他社も見ています", responses: ["「比較される際のチェックポイントを3つお伝えします」と比較基準を教育する", "「当社の強みは○○です。他社にも同じ基準で確認してみてください」"], technique: "比較基準の教育" },
      { objection: "今の業者に満足しています", responses: ["「もし1点だけ改善できるとしたら何ですか？」と潜在不満を引き出す", "「補完的にご活用いただくケースも多いです」と補完提案する"], technique: "潜在不満の発掘" },
      { objection: "前に他社で失敗しました", responses: ["「具体的にどんな点が問題でしたか？」とまず傾聴する", "「その問題が起きない仕組みを当社では○○で対策しています」"], technique: "傾聴+具体的対策" },
      { objection: "知り合いに頼む予定です", responses: ["「万が一の時に言いにくいというお声もあります」とリスクを穏やかに伝える", "「比較材料として、お見積もりだけいかがですか？」と接点を残す"], technique: "第三者のメリット" },
      { objection: "まだ決められません", responses: ["「決められない理由をお聞かせください。一つずつ解消していきます」", "「AプランとBプラン、どちらが近いですか？」と二者択一で選択肢を狭める"], technique: "障壁特定+二者択一" },
    ],
  },
  {
    name: "必要性",
    items: [
      { objection: "うちには必要ありません", responses: ["「○○について現在どのように対応されていますか？」と質問で切り返す", "「同じように思っていた方が実は○○という課題を抱えていた事例があります」"], technique: "質問転換法+事例" },
      { objection: "興味がありません", responses: ["「○○のお悩みもありませんか？1分だけ確認させてください」と別角度で切り込む", "「○○についてだけお伝えさせてください。不要でしたらすぐに失礼します」"], technique: "別角度+時間限定" },
      { objection: "間に合っています", responses: ["「100点満点で今の状態は何点くらいですか？」と定量化して聞く", "満点でない場合、「その足りない部分を補えるかもしれません」と提案する"], technique: "定量化質問法" },
      { objection: "困っていません", responses: ["「○○が起きた場合のリスクはお考えですか？」と将来リスクを提示する", "「困っていない今だからこそ、予防的に対策できるメリットがあります」"], technique: "予防提案法" },
      { objection: "既に対策済みです", responses: ["「最後に確認したのはいつ頃ですか？状況が変わっている可能性もあります」", "「補完的に使うことで既存の対策がさらに効果的になるケースもあります」"], technique: "時間経過+補完提案" },
    ],
  },
  {
    name: "不信・不安",
    items: [
      { objection: "本当に効果あるんですか？", responses: ["「○○様と同じ状況だった○○社の事例をご紹介します」と実例で示す", "「効果がなかった場合の○○制度もあります」とリスク軽減策を提示する"], technique: "事例+リスクヘッジ" },
      { objection: "実績はありますか？", responses: ["「○○業界で○○社様にご利用いただいています」と具体的に答える", "「御社と同じ規模・業種の導入事例もあります」と関連性を示す"], technique: "具体的実績の提示" },
      { objection: "解約できますか？", responses: ["「いつでも解約可能です。まずはお気軽にお試しください」と安心感を与える", "「解約のハードルが低いからこそ、品質で選んでいただける自信があります」"], technique: "安心感の付与" },
      { objection: "うまくいかなかったら？", responses: ["「サポート体制が充実しています。万が一の場合は○○の保証もあります」", "「最初の○ヶ月はトライアル期間として効果を見ながら判断いただけます」"], technique: "サポート+トライアル" },
      { objection: "騙されたくないので", responses: ["「無理におすすめすることは絶対にしません。まずは情報提供だけさせてください」", "「判断はすべてお客様にお任せします。正確な情報を提供することが私の役割です」"], technique: "安全距離法" },
    ],
  },
];

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
    borderBottom: "3px solid #f97316",
    paddingBottom: "12px",
    marginBottom: "20px",
  },
  h1: { fontSize: "20px", fontWeight: "bold" as const, margin: 0, color: "#1E293B" },
  subtitle: { color: "#64748B", margin: "4px 0 0", fontSize: "11px" },
  categoryHeader: {
    backgroundColor: "#f97316",
    color: "#FFFFFF",
    padding: "6px 14px",
    fontSize: "13px",
    fontWeight: "bold" as const,
    marginBottom: "10px",
    marginTop: "18px",
  },
  itemBox: {
    border: "1px solid #E5DFD6",
    padding: "8px 12px",
    marginBottom: "6px",
  },
  objection: {
    fontSize: "12px",
    fontWeight: "bold" as const,
    color: "#1E293B",
    marginBottom: "4px",
  },
  response: {
    fontSize: "10.5px",
    color: "#374151",
    lineHeight: "1.5",
    marginBottom: "2px",
    paddingLeft: "8px",
  },
  technique: {
    fontSize: "9px",
    color: "#f97316",
    fontWeight: "bold" as const,
    marginTop: "2px",
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

const ObjectionCheatsheetPdf = forwardRef<HTMLDivElement>(
  function ObjectionCheatsheetPdf(_props, ref) {
    return (
      <div ref={ref} style={S.page}>
        {/* Header */}
        <div style={S.header}>
          <h1 style={S.h1}>反論切り返し30パターン チートシート</h1>
          <p style={S.subtitle}>
            成約コーチ AI | 6カテゴリ x 5パターン | 出力日: {new Date().toLocaleDateString("ja-JP")}
          </p>
        </div>

        {/* Categories */}
        {CATEGORIES.map((cat, ci) => (
          <div key={ci}>
            <div style={S.categoryHeader}>
              {ci + 1}. {cat.name}
            </div>
            {cat.items.map((item, ii) => (
              <div key={ii} style={S.itemBox}>
                <div style={S.objection}>
                  「{item.objection}」
                </div>
                {item.responses.map((r, ri) => (
                  <div key={ri} style={S.response}>
                    {ri + 1}. {r}
                  </div>
                ))}
                <div style={S.technique}>
                  [{item.technique}]
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Footer */}
        <div style={S.footer}>
          成約コーチ AI - 反論切り返し30パターン チートシート | 購入者限定資料 | 無断転載・再配布禁止
        </div>
      </div>
    );
  },
);

export default ObjectionCheatsheetPdf;
