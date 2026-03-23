"use client";

import { useState, useRef } from "react";
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

function CopyIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function ScriptGeneratorClient() {
  const [industry, setIndustry] = useState("");
  const [product, setProduct] = useState("");
  const [target, setTarget] = useState("");
  const [script, setScript] = useState<ScriptData | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [sectionCopied, setSectionCopied] = useState(-1);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!industry || !product || !target) return;
    setScript(generateScript(industry, product, target));
    setActiveTab(0);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleSample = () => {
    setIndustry("保険");
    setProduct("生命保険");
    setTarget("個人（一般家庭）");
    setScript(generateScript("保険", "生命保険", "個人（一般家庭）"));
    setActiveTab(0);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const sections = script ? [script.approach, script.hearing, script.presentation, script.closing, script.objection] : [];

  const getFullScript = () => {
    if (!script) return "";
    return STEP_NAMES.map((name, i) => `【${name}】\n${sections[i].join("\n\n")}`).join("\n\n---\n\n");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getFullScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSectionCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setSectionCopied(index);
    setTimeout(() => setSectionCopied(-1), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="rounded-2xl border border-card-border bg-white p-6 shadow-sm sm:p-8">
        <h3 className="mb-6 text-base font-bold text-foreground">スクリプト生成条件</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">業種 <span className="text-red-500">*</span></label>
            <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent">
              <option value="">選択してください</option>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">商材名 <span className="text-red-500">*</span></label>
            <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="例: 生命保険" className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">ターゲット <span className="text-red-500">*</span></label>
            <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent">
              <option value="">選択してください</option>
              {TARGETS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center gap-3">
          <button onClick={handleGenerate} disabled={!industry || !product || !target} className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40">
            スクリプトを生成する
          </button>
          {!script && (
            <button onClick={handleSample} className="text-sm text-accent transition hover:underline">
              まずはサンプルを見る →
            </button>
          )}
        </div>
      </div>

      {/* Generated Script */}
      {script && (
        <div ref={resultRef} className="animate-fade-in-up overflow-hidden rounded-2xl border border-card-border bg-white shadow-sm">
          {/* Step Progress */}
          <div className="border-b border-card-border bg-background/50 px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {STEP_NAMES.map((name, i) => (
                  <button
                    key={name}
                    onClick={() => setActiveTab(i)}
                    className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium transition sm:px-3 sm:text-sm"
                    style={activeTab === i
                      ? { backgroundColor: STEP_COLORS[i], color: "white" }
                      : { color: "#6b7280" }
                    }
                  >
                    <span className="hidden sm:inline">{i + 1}.</span>
                    <span className="sm:hidden">{i + 1}</span>
                    <span className="hidden sm:inline">{name}</span>
                  </button>
                ))}
              </div>
              <button onClick={handleCopy} className="inline-flex items-center gap-1 rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-gray-50">
                <CopyIcon />
                {copied ? "OK!" : "全文"}
              </button>
            </div>
            {/* Mobile: show active step name */}
            <p className="mt-1.5 text-xs font-medium sm:hidden" style={{ color: STEP_COLORS[activeTab] }}>
              {STEP_NAMES[activeTab]}
            </p>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-8">
            <div className="space-y-3">
              {sections[activeTab].map((text, i) => (
                <div key={i} className="group relative rounded-xl bg-background p-4 text-sm leading-relaxed text-foreground whitespace-pre-line">
                  {text}
                  <button
                    onClick={() => handleSectionCopy(text, activeTab * 10 + i)}
                    className="absolute right-2 top-2 rounded-md border border-card-border bg-white p-1.5 text-muted opacity-0 transition hover:text-accent group-hover:opacity-100"
                    title="コピー"
                  >
                    {sectionCopied === activeTab * 10 + i
                      ? <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      : <CopyIcon />
                    }
                  </button>
                </div>
              ))}
            </div>

            {/* Next step navigation */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                disabled={activeTab === 0}
                className="inline-flex items-center gap-1 text-sm font-medium text-muted transition hover:text-foreground disabled:invisible"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                {activeTab > 0 ? STEP_NAMES[activeTab - 1] : ""}
              </button>
              <span className="text-xs text-muted">{activeTab + 1} / {STEP_NAMES.length}</span>
              <button
                onClick={() => setActiveTab(Math.min(4, activeTab + 1))}
                disabled={activeTab === 4}
                className="inline-flex items-center gap-1 text-sm font-medium transition hover:text-foreground disabled:invisible"
                style={{ color: activeTab < 4 ? STEP_COLORS[activeTab + 1] : undefined }}
              >
                {activeTab < 4 ? STEP_NAMES[activeTab + 1] : ""}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-card-border bg-accent/5 p-6 text-center">
            <p className="mb-1 text-sm font-medium text-foreground">台本を覚えたら、次はAIロープレで実践</p>
            <p className="mb-4 text-xs text-muted">台本 × 実践 = 生きたトーク力が身につく</p>
            <Link href="/roleplay" className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover">
              AIロープレで練習する
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
