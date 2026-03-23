import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StickyCTA } from "@/components/sticky-cta";
import { JsonLd } from "@/components/json-ld";
import { HandbookFilter } from "./handbook-filter";

export const metadata: Metadata = {
  title: "営業の反論切り返しトーク集｜断り文句への対処法30選",
  description: "「高い」「検討します」「必要ない」—営業でよくある断り文句への切り返しトーク30パターンを無料公開。即決営業メソッドに基づく実践的な対処法。",
  alternates: { canonical: "/tools/objection-handbook" },
};

export interface ObjectionItem {
  objection: string;
  context: string;
  ngResponse: string;
  responses: string[];
  technique: string;
  tip: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
  items: ObjectionItem[];
}

const categories: Category[] = [
  {
    id: "price", name: "価格・費用", icon: "💰", image: "/images/pages/objection-price.png",
    items: [
      { objection: "高いですね", context: "見積もり提示後に最もよく聞く反論", ngResponse: "すぐに値引きを提案する", responses: ["「何と比較して高いと感じますか？」と基準を確認し、価値の再提示につなげる", "日割り・月額換算で「1日コーヒー1杯分」と伝え、費用対効果を可視化する"], technique: "質問法＋日割り換算", tip: "「高い」は断り文句ではなく、納得材料が不足しているサイン" },
      { objection: "予算がありません", context: "予算を理由に断る場合", ngResponse: "「そうですか」と引き下がる", responses: ["「予算の問題をクリアできる方法があるとしたら、ご検討いただけますか？」と仮定で聞く", "分割払い・リース・補助金など、支払い方法の選択肢を提示する"], technique: "仮定法＋代替手段の提案", tip: "予算がないのか、優先順位が低いのかを見極めることが重要" },
      { objection: "他社のほうが安いです", context: "競合との価格比較を持ち出された時", ngResponse: "値引きで対抗する", responses: ["「比較されたのですね。ちなみに見積もりの内訳は同じ条件でしたか？」と条件の違いを確認", "「安い理由」を質問し、品質・サポート・保証の違いを整理して伝える"], technique: "条件比較法", tip: "価格で負けても、トータルコストや品質で勝てる場合は多い" },
      { objection: "今のままで十分です", context: "コスト意識が高く現状維持を好む場合", ngResponse: "「でも当社の製品は…」と反論する", responses: ["「おっしゃる通りですね。ちなみに、もし○○の部分がさらに良くなるとしたら？」と改善の可能性を示す", "現状維持のリスク（競合の動き・市場変化）を穏やかに提示する"], technique: "共感＋リスク提示", tip: "現状満足の裏に潜在的な不満が隠れていることが多い" },
      { objection: "費用対効果がわかりません", context: "ROIを示せていない場合", ngResponse: "「使ってみればわかります」と抽象的に返す", responses: ["具体的な数値シミュレーション（○ヶ月で回収、年間○万円の削減）を提示する", "同業種・同規模の導入事例で得られた効果を具体的に紹介する"], technique: "定量化＋事例提示", tip: "数字で語れない提案は、お客様の社内稟議も通らない" },
    ],
  },
  {
    id: "timing", name: "時期・タイミング", icon: "⏰", image: "/images/pages/objection-timing.png",
    items: [
      { objection: "今は忙しいです", context: "話を聞く時間がないと断る場合", ngResponse: "「では改めます」とすぐ引き下がる", responses: ["「お忙しいところ恐れ入ります。3分だけ要点をお伝えしてもよろしいですか？」と短時間を提案", "「お忙しい方ほどメリットが大きい提案なんです」と興味を引く一言を添える"], technique: "時間限定法", tip: "「忙しい」は反論ではなく、興味を持つ理由を提示できていないサイン" },
      { objection: "来月検討します", context: "先延ばしにしようとする場合", ngResponse: "「承知しました。来月お電話します」と素直に待つ", responses: ["「来月ですと○○の条件が変わる可能性があります。今決めることのメリットをお伝えしてもいいですか？」", "「来月までに検討される材料として、お見積もりだけお渡ししてもいいですか？」と接点を維持"], technique: "緊急性の提示＋接点維持", tip: "「来月」は永遠に来ない。今日の商談で次のアクションを確約すること" },
      { objection: "もう少し様子を見たい", context: "決断を先延ばしにする場合", ngResponse: "「わかりました」と受け入れる", responses: ["「何がクリアになれば決断できますか？」と判断基準を明確にする", "「様子を見ている間のコスト（機会損失）はご存知ですか？」と先延ばしのリスクを提示"], technique: "判断基準の明確化", tip: "お客様が「何を」様子見したいのかを特定することが鍵" },
      { objection: "今すぐは必要ない", context: "緊急性を感じていない場合", ngResponse: "「必要になったらご連絡ください」と放置する", responses: ["「おっしゃる通り、今は困っていないかもしれません。ただ、○○のタイミングで必要になった時、今準備しておくと○○のメリットがあります」", "将来の変化やリスクを具体的に提示し、予防の重要性を伝える"], technique: "予防提案法", tip: "緊急性がない商材こそ、将来のリスクを可視化する提案力が問われる" },
      { objection: "導入時期が合わない", context: "繁忙期や決算期を理由にする場合", ngResponse: "「いつがよろしいですか？」と相手任せにする", responses: ["「導入時期を柔軟に調整できます。お客様のベストなタイミングに合わせてスケジュールを組みましょう」", "「今お申し込みいただいて、開始は○月からという形も可能です」と分離を提案"], technique: "契約と開始の分離提案", tip: "決断のタイミングと導入のタイミングは分けて提案できる" },
    ],
  },
  {
    id: "consider", name: "検討・保留", icon: "🤔", image: "/images/pages/objection-consider.png",
    items: [
      { objection: "検討させてください", context: "最も多い反論。商談の最後に出やすい", ngResponse: "「ぜひご検討ください」と帰る", responses: ["「もちろんです。何か気になる点がありますか？今お答えできるかもしれません」と懸念を引き出す", "「検討される際のポイントを3つお伝えしますね」と情報提供で主導権を維持"], technique: "懸念引き出し法", tip: "「検討します」の裏には必ず理由がある。その理由を聞き出すことが重要" },
      { objection: "上に相談してみます", context: "決裁者が別にいる場合", ngResponse: "「お願いします」と相手任せにする", responses: ["「ぜひ。上の方にご説明しやすいよう、ポイントをまとめた資料をお作りしましょうか？」", "「よろしければ、次回上の方もご同席いただけると、直接ご質問にお答えできます」と同席を提案"], technique: "稟議サポート＋決裁者同席", tip: "担当者を「社内営業マン」にするための武器を渡すこと" },
      { objection: "家族と話してから", context: "個人向け商材で家族の同意が必要な場合", ngResponse: "「わかりました」と引き下がる", responses: ["「ご家族の意見も大切ですね。ご説明しやすいよう、メリットを整理した資料をお渡しします」", "「次回ご家族もご一緒にいかがですか？直接ご質問にお答えできます」と次回アポを確約"], technique: "家族同伴アポ", tip: "家族への説明資料を用意し、担当者が説明しやすい武器を渡す" },
      { objection: "もう少し情報が欲しい", context: "判断材料が不足している場合", ngResponse: "大量の資料を送りつける", responses: ["「どんな情報があれば判断しやすくなりますか？」と具体的に聞く", "「一番気になっているポイントを教えていただければ、そこを重点的にお答えします」"], technique: "ピンポイント情報提供", tip: "「情報が欲しい」は興味があるサイン。的を絞った情報で背中を押す" },
      { objection: "資料だけいただけますか", context: "対面での説明を避けたい場合", ngResponse: "資料を渡して終わり", responses: ["「もちろんお渡しします。ただ、資料だけではお伝えしきれない部分もありますので、5分だけ補足説明させてください」", "「資料と一緒に、御社向けのシミュレーション結果もお持ちします。○日にお届けしてもよろしいですか？」"], technique: "資料＋アポのセット提案", tip: "資料請求は次回アポの最大のチャンス" },
    ],
  },
  {
    id: "competitor", name: "競合・比較", icon: "🏢", image: "/images/pages/objection-competitor.png",
    items: [
      { objection: "他社も見ています", context: "比較検討中の場合", ngResponse: "他社の悪口を言う", responses: ["「比較検討は大切ですね。比較される際のチェックポイントを3つお伝えします」と比較基準を教育する", "「当社の強みは○○です。他社さんにもぜひ同じ基準で確認してみてください」と自信を見せる"], technique: "比較基準の教育", tip: "比較基準をこちらが設定できれば、有利な土俵で戦える" },
      { objection: "今の業者に満足しています", context: "既存取引先がある場合", ngResponse: "「うちのほうがいいですよ」と張り合う", responses: ["「素晴らしいお取引先ですね。ちなみに、もし1点だけ改善できるとしたら何ですか？」と潜在不満を引き出す", "「補完的にご活用いただくケースも多いです。1回だけお試しいただけませんか？」"], technique: "潜在不満の発掘＋補完利用", tip: "既存取引先を否定せず、補完的な価値を提案する" },
      { objection: "前に他社で失敗しました", context: "過去の失敗経験がある場合", ngResponse: "「うちは違います」と安易に否定する", responses: ["「その経験は辛かったですね。具体的にどんな点が問題でしたか？」と傾聴する", "「その問題が起きない仕組みを当社では○○で対策しています」と具体的な対策を示す"], technique: "傾聴＋具体的対策の提示", tip: "過去の失敗を丁寧に聞くことで、信頼が一気に深まる" },
      { objection: "知り合いに頼む予定です", context: "紹介・コネクションでの取引を予定", ngResponse: "「それは残念です」と諦める", responses: ["「知り合いの方は安心ですよね。ただ、万が一の時に言いにくいというお声もあります。比較材料として、お見積もりだけいかがですか？」"], technique: "第三者のメリット提示", tip: "知り合いのリスク（言いにくさ・甘え）を穏やかに伝える" },
      { objection: "まだ決められません", context: "判断を保留したい場合", ngResponse: "何度も催促する", responses: ["「決められない理由をお聞かせいただけますか？一つずつ解消していきましょう」と障壁を特定", "「AプランとBプラン、どちらが近いですか？」と二者択一で選択肢を狭める"], technique: "障壁の特定＋二者択一", tip: "「決められない」の裏にある具体的な懸念を1つずつクリアする" },
    ],
  },
  {
    id: "need", name: "必要性", icon: "❌", image: "/images/pages/objection-noneed.png",
    items: [
      { objection: "うちには必要ありません", context: "ニーズを感じていない場合", ngResponse: "「いえ、必要です」と否定する", responses: ["「おっしゃる通りかもしれません。ちなみに、○○について現在どのように対応されていますか？」と質問で切り返す", "「同じように思っていた○○様が、実は○○という課題を抱えていたことがわかった事例があります」"], technique: "質問転換法＋事例提示", tip: "「必要ない」はニーズ喚起が不足しているサイン" },
      { objection: "興味がありません", context: "門前払いの場合", ngResponse: "しつこく食い下がる", responses: ["「失礼しました。ちなみに○○のお悩みもありませんか？1分だけ確認させてください」と別角度で切り込む", "「ご興味がないのは当然です。ただ、○○についてだけお伝えさせてください。もし不要でしたらすぐに失礼します」"], technique: "別角度アプローチ＋時間限定", tip: "一度断られても、切り口を変えれば突破できることがある" },
      { objection: "間に合っています", context: "現状に不満がない場合", ngResponse: "「本当ですか？」と疑う", responses: ["「素晴らしいですね。ちなみに、100点満点で今の状態は何点くらいですか？」と定量化して聞く", "満点でない場合→「その足りない部分を補えるかもしれません」と提案につなげる"], technique: "定量化質問法", tip: "「間に合っている」を100点満点で聞くと、改善余地が見えてくる" },
      { objection: "困っていません", context: "課題を認識していない場合", ngResponse: "「困るはずです」と押しつける", responses: ["「今は問題がなくても、○○が起きた場合のリスクはお考えですか？」と将来リスクを提示", "「困っていない今だからこそ、予防的に対策できるメリットがあります」"], technique: "予防提案法", tip: "保険や予防商材は「困ってから」では遅い。将来のリスクを可視化" },
      { objection: "既に対策済みです", context: "同種のサービスを利用中の場合", ngResponse: "「では結構です」と諦める", responses: ["「対策されているんですね。最後に確認したのはいつ頃ですか？状況が変わっている可能性もあります」", "「補完的に使うことで、既存の対策がさらに効果的になるケースもあります」"], technique: "時間経過＋補完提案", tip: "対策済みでも、時間の経過で状況が変わっていることは多い" },
    ],
  },
  {
    id: "trust", name: "不信・不安", icon: "😟", image: "/images/pages/objection-distrust.png",
    items: [
      { objection: "本当に効果あるんですか？", context: "効果に懐疑的な場合", ngResponse: "「絶対に効果があります」と断言する", responses: ["「その質問をされるのは当然です。○○様と同じ状況だった○○社の事例をご紹介します」と実例で示す", "「効果を保証するのは難しいですが、もし効果がなかった場合の○○制度もあります」とリスク軽減策を提示"], technique: "事例提示＋リスクヘッジ", tip: "「効果がある」と言うより「効果が出た事例」を見せるほうが100倍説得力がある" },
      { objection: "実績はありますか？", context: "会社や製品の信頼性を確認したい場合", ngResponse: "パンフレットを渡すだけ", responses: ["「はい。○○業界で○○社、○○社様にご利用いただいています。特に○○社様では○○という成果が出ています」と具体的に答える", "「導入事例集をお見せしましょう。御社と同じ規模・業種の事例もあります」"], technique: "具体的実績の提示", tip: "実績は数字と固有名詞（許可済み）で語ると説得力が増す" },
      { objection: "解約できますか？", context: "縛られることへの不安", ngResponse: "「規約に書いてあります」と事務的に返す", responses: ["「はい、いつでも解約可能です。だからこそ、まずはお気軽にお試しください」と安心感を与える", "「解約のハードルが低いからこそ、品質で選んでいただける自信があります」"], technique: "安心感の付与", tip: "解約の容易さは信頼の証。自信を持って伝えると好印象" },
      { objection: "うまくいかなかったら？", context: "失敗のリスクを心配している場合", ngResponse: "「うまくいきます」と根拠なく保証する", responses: ["「サポート体制が充実しているので、一緒に成果を出していきます。万が一の場合は○○の保証もあります」", "「最初の○ヶ月はトライアル期間として、効果を見ながら判断していただけます」"], technique: "サポート体制＋トライアル提案", tip: "不安を取り除くには「保険」と「伴走」の両方を提示する" },
      { objection: "騙されたくないので", context: "過去の悪い経験や業界への不信感", ngResponse: "「当社は違います」と主張する", responses: ["「そのお気持ちはよくわかります。無理におすすめすることは絶対にしません。まずは情報提供だけさせてください」と安全な距離感を保つ", "「判断はすべてお客様にお任せします。私の役割は、正確な情報を提供することです」と中立的な姿勢を見せる"], technique: "安全距離法", tip: "不信感が強い相手には、売り込まない姿勢が最大の武器になる" },
    ],
  },
];

export default function ObjectionHandbookPage() {
  const allItems = categories.flatMap((c) => c.items);
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map((item) => ({
      "@type": "Question",
      name: `営業で「${item.objection}」と言われた時の切り返し方は？`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${item.responses.join(" ")} テクニック: ${item.technique}。${item.tip}`,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLdData} />
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f1729] to-[#1a2744] px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"><Image src="/images/pages/objection-badge.png" alt="" width={24} height={24} className="rounded" /> 30パターン・登録不要</div>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            営業の<span className="text-accent">反論切り返し</span>トーク集
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
            「高い」「検討します」「必要ない」—営業でよくある断り文句30パターンへの実践的な切り返しトークを6カテゴリで整理。
          </p>
        </div>
      </section>

      {/* Value Props */}
      <section className="px-6 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-card-border bg-white p-4 text-center">
              <p className="text-lg font-bold text-accent">30パターン</p>
              <p className="text-xs text-muted">よくある断り文句を網羅</p>
            </div>
            <div className="rounded-2xl border border-card-border bg-white p-4 text-center">
              <p className="text-lg font-bold text-accent">6カテゴリ</p>
              <p className="text-xs text-muted">価格・時期・比較など</p>
            </div>
            <div className="rounded-2xl border border-card-border bg-white p-4 text-center">
              <p className="text-lg font-bold text-accent">実践トーク付</p>
              <p className="text-xs text-muted">そのまま使える例文</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-4xl">
          <HandbookFilter categories={categories} />
        </div>
      </section>

      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">切り返しトークをAIロープレで実践しよう</h2>
          <p className="mb-8 text-sm text-muted sm:text-base">知識として知るだけでなく、実際の商談で使えるレベルまで繰り返し練習しましょう。</p>
          <Link href="/roleplay" className="morph-btn">
            <span className="btn-fill" />
            <span className="shadow" />
            <span className="btn-text">{"反論処理をAIで練習する".split("").map((char, i) => (<span key={i} style={{ "--i": i } as React.CSSProperties}>{char}</span>))}</span>
            <span className="orbit-dots"><span /><span /><span /><span /></span>
            <span className="corners"><span /><span /><span /><span /></span>
          </Link>
        </div>
      </section>

      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-xl font-bold text-foreground">関連ツール</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { href: "/tools/sales-quiz", name: "営業力診断テスト", icon: "📊" },
              { href: "/tools/script-generator", name: "トークスクリプト生成", icon: "📝" },
              { href: "/tools/closing-calculator", name: "クロージング率計算", icon: "🧮" },
            ].map((t) => (
              <Link key={t.href} href={t.href} className="rounded-xl border border-card-border bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-sm">
                <div className="text-2xl mb-1">{t.icon}</div>
                <div className="text-sm font-medium text-foreground">{t.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <StickyCTA />
    </div>
  );
}
