import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { StickyCTA } from "@/components/sticky-cta";
import { MethodCarousel } from "@/components/method-carousel";

/* ─── Data ─── */

const stats = [
  { value: "5ステップ", label: "成約メソッド" },
  { value: "24時間", label: "いつでも練習可能" },
  { value: "無料", label: "登録不要で体験" },
];

const serviceCategories = [
  { title: "ロープレ", desc: "AIと営業ロープレ", href: "/roleplay" },
  { title: "ワークシート", desc: "営業準備・分析シート", href: "/worksheet" },
  { title: "学習コース", desc: "22レッスン+認定試験", href: "/learn" },
  { title: "ブログ", desc: "営業ノウハウ記事", href: "/blog" },
  { title: "料金プラン", desc: "Free / Pro プラン比較", href: "/pricing" },
];

const beforeCards = [
  { title: "練習機会", subtitle: "営業ロープレ", stat: "0回", unit: "月", desc: "先輩の都合待ち" },
  { title: "成約率", subtitle: "直近3ヶ月", stat: "23%", unit: "目標50%", desc: "伸び悩み中" },
  { title: "切り返し", subtitle: "反論処理", stat: "2", unit: "パターン", desc: "引き出し不足" },
  { title: "弱点把握", subtitle: "フィードバック", stat: "0件", unit: "月", desc: "客観的評価なし" },
];

const afterCards = [
  { title: "練習機会", subtitle: "AIロープレ", stat: "無制限", unit: "24時間", desc: "いつでもAIと練習" },
  { title: "成約率", subtitle: "スキルUP", stat: "UP", unit: "目標達成", desc: "型が身につく" },
  { title: "切り返し", subtitle: "学習コース", stat: "22", unit: "レッスン", desc: "引き出し豊富" },
  { title: "弱点把握", subtitle: "AI分析", stat: "毎回", unit: "スコア", desc: "即座にフィードバック" },
];

const steps = [
  {
    num: "01",
    title: "業種・商材を入力",
    desc: "あなたの営業シーンに合わせたリアルなお客さんをAIが生成",
  },
  {
    num: "02",
    title: "AIとロープレ開始",
    desc: "AIが実際のお客さんのように反応。アプローチからクロージングまで実践",
  },
  {
    num: "03",
    title: "成約スコアで採点",
    desc: "アプローチ・ヒアリング・クロージング・反論処理を成約メソッドで分析",
  },
];

const LEVEL_COLORS: Record<string, string> = {
  "初級": "#0F6E56",
  "中級": "#2563EB",
  "上級": "#7C3AED",
};

const methods = [
  { name: "アプローチ", desc: "信頼構築→前提設定→心理的安全の確保", level: "初級" },
  { name: "ヒアリング", desc: "質問でニーズを引き出し、問題を深掘り", level: "初級" },
  { name: "プレゼン", desc: "特徴ではなく価値（ベネフィット）で伝える", level: "初級" },
  { name: "クロージング", desc: "社会的証明・一貫性の活用・お客様の声・段階的訴求", level: "中級" },
  { name: "反論処理", desc: "共感→確認→根拠提示→行動促進の4ステップ", level: "上級" },
];

const betaFeatures = [
  "AIロープレ（1日1回無料）",
  "営業分析ワークシート",
  "22レッスン+認定試験",
  "成約スコアリング",
  "リアルタイムコーチング",
];

const faqs = [
  {
    q: "本当に無料で使えますか？",
    a: "はい。登録不要でロープレ・分析を体験できます。無料アカウントで1日1回AIロープレが可能です。",
  },
  {
    q: "どんな業種・商材でも使えますか？",
    a: "はい。あなたの業種・商材を入力すると、AIがそのシーンに合ったお客さん役を演じます。不動産、保険、SaaS、教育など幅広くご利用いただけます。",
  },
  {
    q: "成約コーチ AIのメソッドとは？",
    a: "成約5ステップメソッドは、アプローチ→ヒアリング→プレゼン→クロージング→反論処理の5段階で構成された、営業心理学に基づく体系的な営業手法です。各ステップをAIが評価し、改善ポイントを提示します。",
  },
  {
    q: "Proプランはいつでも解約できますか？",
    a: "はい、いつでも解約可能です。解約後も現在の請求期間の終了まで利用できます。",
  },
  {
    q: "スマートフォンでも使えますか？",
    a: "はい。ブラウザから利用でき、スマートフォン・タブレット・PCすべてに対応しています。",
  },
];

/* ─── Folder SVG (shared across all service buttons) ─── */
function FolderIcon() {
  return (
    <div>
      <div className="pencil" />
      <div className="folder">
        <div className="top">
          <svg viewBox="0 0 24 27">
            <path d="M1,0 L23,0 C23.5522847,-1.01453063e-16 24,0.44771525 24,1 L24,8.17157288 C24,8.70200585 23.7892863,9.21071368 23.4142136,9.58578644 L20.5857864,12.4142136 C20.2107137,12.7892863 20,13.2979941 20,13.8284271 L20,26 C20,26.5522847 19.5522847,27 19,27 L1,27 C0.44771525,27 6.76353751e-17,26.5522847 0,26 L0,1 C-6.76353751e-17,0.44771525 0.44771525,1.01453063e-16 1,0 Z" />
          </svg>
        </div>
        <div className="paper" />
      </div>
    </div>
  );
}

/* ─── Check icon SVG ─── */
function CheckIcon() {
  return (
    <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" />
    </svg>
  );
}


/* ─── Before/After Card Illustrations ─── */
function BeforeScene({ index }: { index: number }) {
  switch (index) {
    case 0: // 練習機会 0回 - Dejected, alone at desk
      return (
        <svg viewBox="0 0 120 80" className="w-full h-full">
          <rect x="15" y="54" width="90" height="2" fill="#4a5568" />
          <rect x="20" y="56" width="3" height="18" fill="#3a4050" />
          <rect x="97" y="56" width="3" height="18" fill="#3a4050" />
          <circle cx="45" cy="22" r="8" fill="#c8a882" />
          <path d="M37 18Q45 10 53 18" fill="#3d2b1f" />
          <ellipse cx="42" cy="22" rx="1" ry="1.2" fill="#1a1a1a" />
          <ellipse cx="48" cy="22" rx="1" ry="1.2" fill="#1a1a1a" />
          <path d="M41 27Q45 25 49 27" stroke="#6b4c3b" fill="none" strokeWidth="0.8" />
          <path d="M39 31L36 54h18L51 31Q45 29 39 31z" fill="#5a6478" />
          <path d="M43 31v12" stroke="#3d4556" strokeWidth="3" />
          <path d="M51 36L62 48v6" stroke="#c8a882" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M39 36L30 46v8" stroke="#c8a882" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="75" y="40" width="16" height="14" rx="2" fill="#2d3548" opacity="0.4" />
          <rect x="73" y="52" width="20" height="2" rx="1" fill="#3a4050" opacity="0.4" />
          <path d="M56 14l4-4" stroke="#6b7b8d" strokeWidth="0.7" opacity="0.6" />
          <path d="M58 18l5-3" stroke="#6b7b8d" strokeWidth="0.7" opacity="0.6" />
          <path d="M60 16l3-5" stroke="#6b7b8d" strokeWidth="0.7" opacity="0.4" />
        </svg>
      );
    case 1: // 成約率 23% - Slumped, declining chart
      return (
        <svg viewBox="0 0 120 80" className="w-full h-full">
          <line x1="68" y1="16" x2="68" y2="65" stroke="#3a4050" strokeWidth="0.8" />
          <line x1="68" y1="65" x2="112" y2="65" stroke="#3a4050" strokeWidth="0.8" />
          <rect x="72" y="55" width="7" height="10" fill="#4a5568" rx="1" />
          <rect x="82" y="45" width="7" height="20" fill="#4a5568" rx="1" />
          <rect x="92" y="35" width="7" height="30" fill="#4a5568" rx="1" />
          <rect x="102" y="48" width="7" height="17" fill="#9b2c2c" rx="1" />
          <path d="M76 52L86 42L96 32L106 45" stroke="#e53e3e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <polygon points="106,42 110,47 104,47" fill="#e53e3e" />
          <circle cx="35" cy="25" r="8" fill="#c8a882" />
          <path d="M27 21Q35 13 43 21" fill="#3d2b1f" />
          <ellipse cx="32" cy="25" rx="1" ry="1.2" fill="#1a1a1a" />
          <ellipse cx="38" cy="25" rx="1" ry="1.2" fill="#1a1a1a" />
          <path d="M31 30Q35 28 39 30" stroke="#6b4c3b" fill="none" strokeWidth="0.8" />
          <path d="M29 33L26 60h18L41 33Q35 31 29 33z" fill="#5a6478" />
          <path d="M33 33v12" stroke="#3d4556" strokeWidth="3" />
          <path d="M41 40L50 50" stroke="#c8a882" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M29 40L20 50" stroke="#c8a882" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M26 60L22 74" stroke="#5a6478" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M44 60L48 74" stroke="#5a6478" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 2: // 切り返し 2パターン - Frustrated, few resources
      return (
        <svg viewBox="0 0 120 80" className="w-full h-full">
          <circle cx="60" cy="22" r="8" fill="#c8a882" />
          <path d="M52 18Q60 10 68 18" fill="#3d2b1f" />
          <ellipse cx="57" cy="21" rx="1" ry="1.2" fill="#1a1a1a" />
          <ellipse cx="63" cy="21" rx="1" ry="1.2" fill="#1a1a1a" />
          <path d="M55 14L51 10" stroke="#c8a882" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M65 14L69 10" stroke="#c8a882" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M57 27Q60 25 63 27" stroke="#6b4c3b" fill="none" strokeWidth="0.8" />
          <path d="M54 31L51 58h18L66 31Q60 29 54 31z" fill="#5a6478" />
          <path d="M58 31v12" stroke="#3d4556" strokeWidth="3" />
          <path d="M54 36L42 28" stroke="#c8a882" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M66 36L78 28" stroke="#c8a882" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M40 26l-2-4 2 0-1-4" stroke="#c8a882" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M80 26l2-4-2 0 1-4" stroke="#c8a882" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <rect x="20" y="60" width="8" height="10" fill="#4a5568" rx="1" />
          <rect x="30" y="62" width="8" height="8" fill="#4a5568" rx="1" />
          <text x="84" y="52" fontSize="14" fill="#6b7b8d" opacity="0.5" fontWeight="bold">?</text>
          <text x="94" y="44" fontSize="10" fill="#6b7b8d" opacity="0.4" fontWeight="bold">?</text>
          <path d="M51 58L47 74" stroke="#5a6478" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M69 58L73 74" stroke="#5a6478" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 3: // 弱点把握 0件 - Alone in the dark
      return (
        <svg viewBox="0 0 120 80" className="w-full h-full">
          <circle cx="60" cy="40" r="35" fill="#131a2e" opacity="0.5" />
          <circle cx="60" cy="24" r="8" fill="#c8a882" />
          <path d="M52 20Q60 12 68 20" fill="#3d2b1f" />
          <ellipse cx="57" cy="24" rx="1" ry="1.2" fill="#1a1a1a" />
          <ellipse cx="63" cy="24" rx="1" ry="1.2" fill="#1a1a1a" />
          <path d="M57 29Q60 27 63 29" stroke="#6b4c3b" fill="none" strokeWidth="0.8" />
          <path d="M54 33L51 60h18L66 33Q60 31 54 33z" fill="#5a6478" />
          <path d="M58 33v12" stroke="#3d4556" strokeWidth="3" />
          <path d="M54 38L46 48" stroke="#c8a882" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M66 38L74 48" stroke="#c8a882" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M51 60L47 74" stroke="#5a6478" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M69 60L73 74" stroke="#5a6478" strokeWidth="3" fill="none" strokeLinecap="round" />
          <text x="25" y="30" fontSize="14" fill="#4a5568" opacity="0.5" fontWeight="bold">?</text>
          <text x="88" y="35" fontSize="12" fill="#4a5568" opacity="0.4" fontWeight="bold">?</text>
          <text x="30" y="60" fontSize="10" fill="#4a5568" opacity="0.3" fontWeight="bold">?</text>
          <text x="85" y="58" fontSize="16" fill="#4a5568" opacity="0.5" fontWeight="bold">?</text>
          <circle cx="60" cy="40" r="30" fill="none" stroke="#2d3548" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      );
    default:
      return null;
  }
}

function AfterScene({ index }: { index: number }) {
  switch (index) {
    case 0: // 練習機会 無制限 - Fist pump with laptop
      return (
        <svg viewBox="0 0 120 80" className="w-full h-full">
          <circle cx="45" cy="20" r="8" fill="#d4a574" />
          <path d="M37 16Q45 8 53 16" fill="#2d1f14" />
          <ellipse cx="42" cy="19" rx="1" ry="1.2" fill="#1a1a1a" />
          <ellipse cx="48" cy="19" rx="1" ry="1.2" fill="#1a1a1a" />
          <path d="M41 24Q45 27 49 24" stroke="#8b5e3c" fill="none" strokeWidth="0.8" />
          <path d="M39 29L36 56h18L51 29Q45 27 39 29z" fill="#1e3a2f" />
          <path d="M43 29v12" stroke="#2a5e47" strokeWidth="3" />
          <path d="M51 34L62 22" stroke="#d4a574" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="63" cy="20" r="3" fill="#d4a574" />
          <path d="M39 36L28 46" stroke="#d4a574" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M36 56L32 72" stroke="#1e3a2f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M54 56L58 72" stroke="#1e3a2f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="72" y="38" width="30" height="22" rx="2" fill="#e8f5e9" stroke="#43a047" strokeWidth="1" />
          <rect x="72" y="38" width="30" height="5" rx="2" fill="#43a047" />
          <rect x="76" y="47" width="10" height="2" rx="1" fill="#81c784" />
          <rect x="76" y="51" width="16" height="2" rx="1" fill="#a5d6a7" />
          <rect x="76" y="55" width="12" height="2" rx="1" fill="#81c784" />
          <path d="M66 10l-1.5 3h3z" fill="#f9a825" opacity="0.7" />
          <path d="M58 6l-1 2.5h2z" fill="#f9a825" opacity="0.5" />
          <path d="M70 16l-1 2h2z" fill="#f9a825" opacity="0.6" />
        </svg>
      );
    case 1: // 成約率 UP - Both arms up celebrating, rising chart
      return (
        <svg viewBox="0 0 120 80" className="w-full h-full">
          <line x1="10" y1="68" x2="55" y2="68" stroke="#81c784" strokeWidth="0.8" />
          <line x1="10" y1="20" x2="10" y2="68" stroke="#81c784" strokeWidth="0.8" />
          <rect x="14" y="58" width="7" height="10" fill="#66bb6a" rx="1" />
          <rect x="24" y="50" width="7" height="18" fill="#66bb6a" rx="1" />
          <rect x="34" y="40" width="7" height="28" fill="#43a047" rx="1" />
          <rect x="44" y="28" width="7" height="40" fill="#2e7d32" rx="1" />
          <path d="M18 55L28 47L38 37L48 25" stroke="#1b5e20" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <polygon points="48,22 52,27 46,27" fill="#1b5e20" />
          <circle cx="82" cy="22" r="8" fill="#d4a574" />
          <path d="M74 18Q82 10 90 18" fill="#2d1f14" />
          <ellipse cx="79" cy="21" rx="1" ry="1.2" fill="#1a1a1a" />
          <ellipse cx="85" cy="21" rx="1" ry="1.2" fill="#1a1a1a" />
          <path d="M78 26Q82 29 86 26" stroke="#8b5e3c" fill="none" strokeWidth="0.8" />
          <path d="M76 31L73 58h18L88 31Q82 29 76 31z" fill="#1e3a2f" />
          <path d="M80 31v12" stroke="#2a5e47" strokeWidth="3" />
          <path d="M76 35L66 18" stroke="#d4a574" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M88 35L98 18" stroke="#d4a574" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="65" cy="16" r="2.5" fill="#d4a574" />
          <circle cx="99" cy="16" r="2.5" fill="#d4a574" />
          <path d="M73 58L69 72" stroke="#1e3a2f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M91 58L95 72" stroke="#1e3a2f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M82 6l-1.5 3h3z" fill="#f9a825" opacity="0.7" />
          <path d="M72 8l-1 2h2z" fill="#f9a825" opacity="0.5" />
          <path d="M92 8l-1 2h2z" fill="#f9a825" opacity="0.5" />
        </svg>
      );
    case 2: // 切り返し 22レッスン - Confident, pointing up, books
      return (
        <svg viewBox="0 0 120 80" className="w-full h-full">
          <circle cx="55" cy="20" r="8" fill="#d4a574" />
          <path d="M47 16Q55 8 63 16" fill="#2d1f14" />
          <ellipse cx="52" cy="19" rx="1" ry="1.2" fill="#1a1a1a" />
          <ellipse cx="58" cy="19" rx="1" ry="1.2" fill="#1a1a1a" />
          <path d="M51 24Q55 27 59 24" stroke="#8b5e3c" fill="none" strokeWidth="0.8" />
          <path d="M49 29L46 56h18L61 29Q55 27 49 29z" fill="#1e3a2f" />
          <path d="M53 29v12" stroke="#2a5e47" strokeWidth="3" />
          <path d="M61 34L72 18" stroke="#d4a574" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="72" cy="15" r="2" fill="#d4a574" />
          <path d="M72 13v-5" stroke="#f9a825" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M49 36L38 46" stroke="#d4a574" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M46 56L42 72" stroke="#1e3a2f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M64 56L68 72" stroke="#1e3a2f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="85" y="42" width="18" height="4" rx="1" fill="#43a047" />
          <rect x="85" y="47" width="18" height="4" rx="1" fill="#66bb6a" />
          <rect x="85" y="52" width="18" height="4" rx="1" fill="#43a047" />
          <rect x="85" y="57" width="18" height="4" rx="1" fill="#81c784" />
          <rect x="85" y="62" width="18" height="4" rx="1" fill="#66bb6a" />
          <rect x="85" y="67" width="18" height="4" rx="1" fill="#43a047" />
          <text x="88" y="50" fontSize="3" fill="white" fontWeight="bold">22</text>
          <circle cx="76" cy="8" r="5" fill="none" stroke="#f9a825" strokeWidth="1" />
          <path d="M76 5v6M73 8h6" stroke="#f9a825" strokeWidth="1" />
        </svg>
      );
    case 3: // 弱点把握 毎回 - Thumbs up, dashboard with scores
      return (
        <svg viewBox="0 0 120 80" className="w-full h-full">
          <circle cx="38" cy="22" r="8" fill="#d4a574" />
          <path d="M30 18Q38 10 46 18" fill="#2d1f14" />
          <ellipse cx="35" cy="21" rx="1" ry="1.2" fill="#1a1a1a" />
          <ellipse cx="41" cy="21" rx="1" ry="1.2" fill="#1a1a1a" />
          <path d="M34 26Q38 29 42 26" stroke="#8b5e3c" fill="none" strokeWidth="0.8" />
          <path d="M32 31L29 58h18L44 31Q38 29 32 31z" fill="#1e3a2f" />
          <path d="M36 31v12" stroke="#2a5e47" strokeWidth="3" />
          <path d="M44 36L54 30" stroke="#d4a574" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="55" cy="28" r="3" fill="#d4a574" />
          <path d="M55 25v-3" stroke="#d4a574" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M32 38L22 48" stroke="#d4a574" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M29 58L25 72" stroke="#1e3a2f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M47 58L51 72" stroke="#1e3a2f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="65" y="18" width="45" height="50" rx="3" fill="#e8f5e9" stroke="#43a047" strokeWidth="1" />
          <rect x="65" y="18" width="45" height="8" rx="3" fill="#43a047" />
          <text x="75" y="24" fontSize="5" fill="white" fontWeight="bold">SCORE</text>
          <rect x="70" y="32" width="6" height="18" rx="1" fill="#a5d6a7" />
          <rect x="79" y="38" width="6" height="12" rx="1" fill="#81c784" />
          <rect x="88" y="28" width="6" height="22" rx="1" fill="#66bb6a" />
          <rect x="97" y="34" width="6" height="16" rx="1" fill="#43a047" />
          <path d="M70 55l2 3 5-6" stroke="#2e7d32" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M82 55l2 3 5-6" stroke="#2e7d32" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M94 55l2 3 5-6" stroke="#2e7d32" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Method Step SVG Illustrations ─── */
function MethodScene({ step }: { step: number }) {
  const cls = "w-20 h-20";
  switch (step) {
    case 0: // アプローチ - Two people meeting
      return (
        <svg viewBox="0 0 64 56" className={cls} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="18" cy="14" r="6" fill="white" />
          <path d="M18 20v14M18 26l-8-5M18 26l8 5" />
          <path d="M18 34l-5 14M18 34l5 14" />
          <circle cx="46" cy="14" r="6" fill="white" />
          <path d="M46 20v14M46 26l8-5M46 26l-8 5" />
          <path d="M46 34l-5 14M46 34l5 14" />
          <path d="M32 4l-2 4h4z" fill="white" stroke="none" />
          <path d="M32 2v3M29 5h6" strokeWidth="1.5" />
        </svg>
      );
    case 1: // ヒアリング - Ear with sound waves
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 10a12 12 0 0 1 6 22c-2 2-3 4-3 6" />
          <path d="M18 10c-5 0-10 5-10 12s5 12 10 12" />
          <path d="M30 18a5 5 0 0 1 0 8" />
          <path d="M34 14a9 9 0 0 1 0 16" />
          <path d="M38 10a13 13 0 0 1 0 24" opacity="0.5" />
        </svg>
      );
    case 2: // プレゼン - Chart going up
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="white" stroke="none">
          <rect x="4" y="32" width="9" height="12" rx="1" />
          <rect x="17" y="24" width="9" height="20" rx="1" />
          <rect x="30" y="14" width="9" height="30" rx="1" />
          <path d="M6 30L22 18l14-8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <polygon points="38,8 42,14 34,14" />
        </svg>
      );
    case 3: // クロージング - Handshake
      return (
        <svg viewBox="0 0 48 40" className={cls} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 24l8-10 8 4 4-6" />
          <path d="M44 24l-8-10-8 4-4-6" />
          <path d="M12 24l6 6 5-3 5 5" />
          <path d="M36 24l-6 6-5-3-3 3" />
        </svg>
      );
    case 4: // 反論処理 - Shield with checkmark
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 4L6 12v12c0 10 8 16 18 20 10-4 18-10 18-20V12L24 4z" />
          <path d="M16 24l5 5 10-10" strokeWidth="3" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── How-to Step SVG Illustrations ─── */
function HowtoScene({ step }: { step: number }) {
  const cls = "w-full h-full";
  switch (step) {
    case 0: // 業種・商材を入力 - Form/input
      return (
        <svg viewBox="0 0 56 48" className={cls} fill="none" stroke="#323232" strokeWidth="2" strokeLinecap="round">
          <rect x="4" y="8" width="48" height="32" rx="3" />
          <line x1="10" y1="16" x2="46" y2="16" opacity="0.3" />
          <line x1="10" y1="24" x2="38" y2="24" />
          <line x1="10" y1="30" x2="30" y2="30" opacity="0.5" />
          <rect x="38" y="28" width="10" height="6" rx="1" fill="#323232" opacity="0.15" />
          <path d="M12 20v-1" strokeWidth="2.5" />
        </svg>
      );
    case 1: // AIとロープレ開始 - Chat bubbles
      return (
        <svg viewBox="0 0 56 48" className={cls} fill="none" stroke="#323232" strokeWidth="2" strokeLinecap="round">
          <rect x="2" y="4" width="26" height="16" rx="4" />
          <path d="M10 20l4 5" />
          <circle cx="10" cy="12" r="1.5" fill="#323232" />
          <circle cx="15" cy="12" r="1.5" fill="#323232" />
          <circle cx="20" cy="12" r="1.5" fill="#323232" />
          <rect x="28" y="22" width="26" height="16" rx="4" />
          <path d="M46 38l4 5" />
          <circle cx="36" cy="30" r="1.5" fill="#323232" />
          <circle cx="41" cy="30" r="1.5" fill="#323232" />
          <circle cx="46" cy="30" r="1.5" fill="#323232" />
        </svg>
      );
    case 2: // 成約スコアで採点 - Score/star
      return (
        <svg viewBox="0 0 56 48" className={cls} fill="none" stroke="#323232" strokeWidth="2" strokeLinecap="round">
          <rect x="8" y="2" width="40" height="44" rx="3" />
          <path d="M28 12l3 6 6.5 1-4.7 4.6 1.1 6.4-5.9-3.1-5.9 3.1 1.1-6.4-4.7-4.6 6.5-1z" fill="#323232" opacity="0.12" stroke="#323232" />
          <line x1="16" y1="36" x2="40" y2="36" />
          <line x1="16" y1="40" x2="32" y2="40" opacity="0.5" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Page ─── */

export default async function Home() {
  let isLoggedIn = false;
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      isLoggedIn = !!user;
    }
  } catch {
    // Supabase unavailable — render as guest
  }

  const roleplayHref = "/roleplay";
  const worksheetHref = "/worksheet";

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "成約コーチ AI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "AI × 成約メソッドで営業ロープレを何度でも練習。成約5ステップを身につけて成約率を上げる。",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "JPY",
        description: "無料プラン（1日1回）",
      },
      {
        "@type": "Offer",
        price: "2980",
        priceCurrency: "JPY",
        description: "Proプラン（無制限）",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLdData} />

      {/* Header */}
      <Header user={{ isLoggedIn }} />

      {/* Hero — Cityscape Background + Flashlight */}
      <section className="relative overflow-hidden px-6 pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div className="hero-city" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
            営業心理学ベースのAIコーチング
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            AIとロープレして
            <br />
            <span className="text-accent">成約率を上げろ。</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/70">
            「考えます」を「お願いします」に変える営業の型を、AIと反復練習。
            <br />
            24時間いつでも、何度でも。
          </p>

          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center" data-hero-cta>
            <Link href={roleplayHref} className="morph-btn">
              <span className="btn-fill" />
              <span className="shadow" />
              <span className="btn-text">
                <span style={{ "--i": 0 } as React.CSSProperties}>ロ</span>
                <span style={{ "--i": 1 } as React.CSSProperties}>ー</span>
                <span style={{ "--i": 2 } as React.CSSProperties}>プ</span>
                <span style={{ "--i": 3 } as React.CSSProperties}>レ</span>
                <span style={{ "--i": 4 } as React.CSSProperties}>す</span>
                <span style={{ "--i": 5 } as React.CSSProperties}>る</span>
              </span>
              <span className="orbit-dots">
                <span /><span /><span /><span />
              </span>
              <span className="corners">
                <span /><span /><span /><span />
              </span>
            </Link>
            <div className="button-borders">
              <Link href={worksheetHref} className="primary-button">
                分析を行う
              </Link>
            </div>
            <div className="button-borders">
              <Link href="/learn" className="primary-button">
                学習する
              </Link>
            </div>
          </div>

          <p className="mt-4 text-xs text-white/50">
            &#10003; 無料で体験可能 &#10003; 登録不要で今すぐ試せる
          </p>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="text-3xl font-bold text-accent">{s.value}</div>
                <div className="mt-1 text-sm text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories — Continue Application Buttons */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-foreground">
            サービスカテゴリ
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((cat) => (
              <Link key={cat.title} href={cat.href} className="continue-application">
                <FolderIcon />
                {cat.title}
                <span className="continue-application__desc">{cat.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Beta Test CTA — Plan Card */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            現在ベータテスト中
          </h2>
          <p className="mb-10 text-muted">
            成約コーチ AIは現在ベータ版として公開中です。<br />
            テストユーザーとしてお試しいただき、フィードバックをお聞かせください。
          </p>

          <div className="plan">
            <div className="inner">
              <span className="pricing">
                <span>無料 <small>ベータ版</small></span>
              </span>
              <p className="title">ベータテストプラン</p>
              <p className="info">全機能を無料でお試しいただけます。フィードバックをお待ちしています。</p>
              <ul className="features">
                {betaFeatures.map((feat) => (
                  <li key={feat}>
                    <span className="icon">
                      <CheckIcon />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <div className="action">
                <Link href="/roleplay" className="button">
                  今すぐ無料で試す
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before / After — Full-screen Comparison */}
      <section className="flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-6xl">
          <h2 className="mb-2 text-center text-3xl font-bold text-foreground">
            成約コーチ AIで変わること
          </h2>
          <p className="mb-8 text-center text-sm text-muted">
            練習環境の悩みを解消し、営業力を飛躍させる
          </p>

          {/* Before */}
          <div className="mb-3 text-center">
            <span className="inline-block rounded-full bg-red-100 px-4 py-1 text-sm font-bold text-red-500 border border-red-200">
              Before
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {beforeCards.map((card, i) => (
              <div key={card.title} className="ba-card ba-card--before">
                <div className="ba-card__illustration">
                  <BeforeScene index={i} />
                </div>
                <div className="mt-3">
                  <p className="text-sm font-semibold text-red-800/60">{card.title}</p>
                  <p className="text-2xl font-bold text-red-600">
                    {card.stat} <span className="text-sm font-normal text-red-800/40">/ {card.unit}</span>
                  </p>
                  <p className="text-xs text-red-800/50">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Divider Arrow */}
          <div className="my-6 flex justify-center">
            <svg className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          {/* After */}
          <div className="mb-3 text-center">
            <span className="inline-block rounded-full bg-accent/20 px-4 py-1 text-sm font-bold text-accent">
              After
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {afterCards.map((card, i) => (
              <div key={card.title} className="ba-card">
                <div className="ba-card__illustration">
                  <AfterScene index={i} />
                </div>
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-emerald-500">
                    {card.stat} <span className="text-sm font-normal text-gray-400">/ {card.unit}</span>
                  </p>
                  <p className="text-xs text-gray-500">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — Profile Card Style */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="blob blob-pink" style={{ width: 300, height: 300, top: -40, right: -60 }} />

        <div className="relative z-10 mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground">
            使い方は3ステップ
          </h2>
          <p className="mb-16 text-center text-muted">
            複雑な設定は不要。すぐにロープレを始められます。
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="howto-card">
                <div className="howto-card__photo">
                  <HowtoScene step={i} />
                </div>
                <div className="howto-card__num">{step.num}</div>
                <div className="howto-card__title">
                  {step.title}
                  <br />
                  <span>{step.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Method — Comic Cards */}
      <section className="overflow-hidden py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground">
            成約コーチ 5ステップメソッド
          </h2>
          <p className="mb-16 text-center text-muted">
            体系化された営業の「型」をAIが正確に評価します
          </p>
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
            {Object.entries(LEVEL_COLORS).map(([label, color]) => (
              <span key={label} className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold text-white" style={{ backgroundColor: color }}>
                {label}
              </span>
            ))}
          </div>
          <MethodCarousel>
            {methods.map((m, i) => {
              const color = LEVEL_COLORS[m.level] || "#0F6E56";
              return (
                <div key={m.name} className="comic-card" style={{ "--level-color": color } as React.CSSProperties}>
                  <div className="card-header">
                    <div className="card-avatar">{i + 1}</div>
                    <div className="card-user-info">
                      <p className="card-username">{m.name}</p>
                      <p className="card-handle" style={{ color }}>{m.level}</p>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="card-image-container">
                      <MethodScene step={i} />
                    </div>
                    <p className="card-caption">{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </MethodCarousel>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="blob blob-cream" style={{ width: 250, height: 250, bottom: -40, left: -60 }} />

        <div className="relative z-10 mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground">
            よくある質問
          </h2>
          <p className="mb-12 text-center text-muted">
            成約コーチ AIについてのよくある質問にお答えします
          </p>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden list-none">
                  <span>{faq.q}</span>
                  <svg
                    className="h-4 w-4 flex-shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="border-t border-card-border px-6 pb-5 pt-4 text-sm leading-relaxed text-muted">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="blob blob-teal" style={{ width: 400, height: 400, top: -100, left: '30%' }} />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            今すぐ営業力を鍛えよう
          </h2>
          <p className="mb-4 text-muted">
            無料アカウントで1日1回ロープレできます。Proプランなら無制限。
          </p>
          <p className="mb-10 text-xs text-muted">
            &#10003; クレジットカード不要 &#10003; 30秒で登録完了 &#10003;
            いつでも解約OK
          </p>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <Link href={roleplayHref} className="morph-btn">
              <span className="btn-fill" />
              <span className="shadow" />
              <span className="btn-text">
                <span style={{ "--i": 0 } as React.CSSProperties}>ロ</span>
                <span style={{ "--i": 1 } as React.CSSProperties}>ー</span>
                <span style={{ "--i": 2 } as React.CSSProperties}>プ</span>
                <span style={{ "--i": 3 } as React.CSSProperties}>レ</span>
                <span style={{ "--i": 4 } as React.CSSProperties}>す</span>
                <span style={{ "--i": 5 } as React.CSSProperties}>る</span>
              </span>
              <span className="orbit-dots">
                <span /><span /><span /><span />
              </span>
              <span className="corners">
                <span /><span /><span /><span />
              </span>
            </Link>
            <div className="button-borders">
              <Link href={worksheetHref} className="primary-button">
                分析を行う
              </Link>
            </div>
            <div className="button-borders">
              <Link href="/learn" className="primary-button">
                学習する
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/pricing"
              className="text-sm text-muted transition hover:text-accent hover:underline"
            >
              料金プランを見る →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Sticky CTA (client component) */}
      <StickyCTA />
    </div>
  );
}
