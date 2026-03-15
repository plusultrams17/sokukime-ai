"use client";

import { useState } from "react";
import Link from "next/link";

const INDUSTRIES = ["保険", "不動産", "リフォーム", "外壁塗装", "太陽光", "自動車", "人材紹介", "IT/SaaS", "広告", "医療機器", "印刷", "ブライダル", "その他"];
const TARGETS = ["個人（一般家庭）", "個人（富裕層）", "法人（中小企業）", "法人（大企業）"];

const STEP_COLORS = ["#0F6E56", "#185FA5", "#534AB7", "#993C1D", "#A32D2D"];
const STEP_NAMES = ["アプローチ", "ヒアリング", "プレゼン", "クロージング", "反論処理"];

interface ScriptData {
  approach: string[];
  hearing: string[];
  presentation: string[];
  closing: string[];
  objection: string[];
}

function generateScript(industry: string, product: string, target: string): ScriptData {
  const isB2B = target.includes("法人");
  const decisionMaker = isB2B ? "ご担当者様" : "お客様";
  const greeting = isB2B ? "お忙しいところ恐れ入ります。" : "こんにちは、突然のご訪問失礼いたします。";

  return {
    approach: [
      `【挨拶】\n「${greeting}${industry}の${product}についてご案内している、成約コーチの○○と申します。本日は${decisionMaker}にとって有益な情報をお持ちしました。」`,
      `【アイスブレイク】\n「${isB2B ? "御社のWebサイトを拝見して、○○の取り組みが素晴らしいと思いました。" : "素敵なお住まいですね。この辺りは住みやすそうですね。"}ちなみに${industry}について、以前検討されたことはありますか？」`,
      `【訪問目的】\n「本日は、${product}について3分だけお時間をいただき、${decisionMaker}のお役に立てるかどうか確認させていただければと思います。もし合わなければ遠慮なくおっしゃってください。」`,
    ],
    hearing: [
      `【現状確認】\n「現在、${industry}に関して何かお使いのもの（お取り組みされていること）はありますか？」\n「それはいつ頃から${isB2B ? "導入" : "ご利用"}されていますか？」\n「現状に対して、100点満点で何点くらいですか？」`,
      `【課題深掘り】\n「その点数の理由を教えていただけますか？」\n「もし理想的な状態があるとしたら、どんな状態ですか？」\n「その課題があることで、具体的にどんな影響がありますか？」`,
      `【ニーズ確認】\n「もしこれらの課題を解決できるとしたら、ご興味はありますか？」\n「今後、${industry}について見直すご予定はありますか？」`,
    ],
    presentation: [
      `【課題の要約】\n「ここまでお話を伺って、${decisionMaker}の一番の課題は○○ということですね。」`,
      `【解決策の提示】\n「その課題を解決するために、当社の${product}をご提案させてください。このサービスの最大の特徴は、○○できることです。」`,
      `【ベネフィット】\n「${product}を${isB2B ? "導入" : "ご利用"}いただくことで、\n・○○の時間が○%削減できます\n・○○のコストが年間○万円削減できます\n・○○の品質が向上します\nといった効果が期待できます。」`,
      `【社会的証明】\n「実際に、${isB2B ? "同業の○○社様" : "同じエリアの○○様"}でも導入いただいており、導入後○ヶ月で○○という成果が出ています。」`,
    ],
    closing: [
      `【テストクロージング】\n「ここまでのお話を聞いて、いかがですか？ご不明な点はありますか？」`,
      `【決断の促進】\n「もしご納得いただけましたら、○○の手続きを進めさせていただきたいのですが、いかがでしょうか？」`,
      `【条件提示】\n「${isB2B ? "まずは1ヶ月のトライアルから始めていただくこともできます" : "今月中にお申し込みいただければ、○○の特典をお付けできます"}。」`,
      `【二者択一】\n「開始時期としては、今月と来月、どちらがご都合よろしいですか？」`,
    ],
    objection: [
      `【「高い」への切り返し】\n「確かにご費用は気になりますよね。ちなみに、何と比較して高いとお感じですか？日割りに換算すると1日あたり○○円なんです。それで○○の効果が得られるとしたら、投資としていかがでしょうか？」`,
      `【「検討します」への切り返し】\n「もちろんです。ちなみに、何か気になる点がおありですか？もしお聞かせいただければ、今すぐお答えできるかもしれません。」`,
      `【「他社と比較したい」への切り返し】\n「比較検討は大切ですね。比較される際のポイントとして、○○と○○と○○の3点を確認されるとよいと思います。当社はこの3点すべてで自信を持っています。」`,
    ],
  };
}

export function ScriptGeneratorClient() {
  const [industry, setIndustry] = useState("");
  const [product, setProduct] = useState("");
  const [target, setTarget] = useState("");
  const [script, setScript] = useState<ScriptData | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!industry || !product || !target) return;
    setScript(generateScript(industry, product, target));
    setActiveTab(0);
  };

  const getFullScript = () => {
    if (!script) return "";
    const sections = [script.approach, script.hearing, script.presentation, script.closing, script.objection];
    return STEP_NAMES.map((name, i) => `【${name}】\n${sections[i].join("\n\n")}`).join("\n\n---\n\n");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getFullScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="rounded-2xl bg-white border border-card-border shadow-sm p-6 sm:p-8">
        <h3 className="text-base font-bold text-foreground mb-6">スクリプト生成条件</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">業種 <span className="text-red-500">*</span></label>
            <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent">
              <option value="">選択してください</option>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">商材名 <span className="text-red-500">*</span></label>
            <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="例: 生命保険" className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">ターゲット <span className="text-red-500">*</span></label>
            <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent">
              <option value="">選択してください</option>
              {TARGETS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button onClick={handleGenerate} disabled={!industry || !product || !target} className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed">
            スクリプトを生成する
          </button>
        </div>
      </div>

      {/* Generated Script */}
      {script && (
        <div className="rounded-2xl bg-white border border-card-border shadow-sm overflow-hidden animate-fade-in-up">
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-card-border">
            {STEP_NAMES.map((name, i) => (
              <button key={name} onClick={() => setActiveTab(i)} className={`flex-1 min-w-[100px] px-4 py-3 text-sm font-medium transition whitespace-nowrap ${activeTab === i ? "text-white" : "text-foreground hover:bg-gray-50"}`} style={activeTab === i ? { backgroundColor: STEP_COLORS[i] } : undefined}>
                {name}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground" style={{ color: STEP_COLORS[activeTab] }}>
                Step {activeTab + 1}: {STEP_NAMES[activeTab]}
              </h3>
              <button onClick={handleCopy} className="inline-flex items-center gap-1 rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-gray-50">
                {copied ? "✓ コピーしました" : "全文コピー"}
              </button>
            </div>
            <div className="space-y-4">
              {[script.approach, script.hearing, script.presentation, script.closing, script.objection][activeTab].map((text, i) => (
                <div key={i} className="rounded-xl bg-background p-4 text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-card-border bg-accent/5 p-6 text-center">
            <p className="text-sm text-muted mb-3">このスクリプトをAIロープレで実践してみましょう</p>
            <Link href="/roleplay" className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover">
              AIロープレで練習する
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
