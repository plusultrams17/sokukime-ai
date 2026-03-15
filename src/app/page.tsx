import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { StickyCTA } from "@/components/sticky-cta";
import { MethodCarousel } from "@/components/method-carousel";
import { HomepageCTATracker } from "@/components/homepage-cta-tracker";
import { HomeExitPopup } from "@/components/exit-popups/home-exit-popup";
import { ScrollSlideIn } from "@/components/scroll-slide-in";

/* ─── Data ─── */

const stats = [
  { value: "5ステップ", label: "営業心理学に基づく型" },
  { value: "24時間365日", label: "深夜の練習もOK" },
  { value: "0円", label: "メアド不要で今すぐ" },
];

const industries = ["不動産", "保険", "SaaS", "人材", "教育", "物販"];

const beforeCards = [
  { title: "ロープレ環境", desc: "先輩に頼まないとロープレできない" },
  { title: "本番への不安", desc: "練習不足で本番が怖い" },
  { title: "切り返し力", desc: "切り返しパターンが少ない" },
  { title: "弱点の把握", desc: "自分の弱点がわからない" },
];

const afterCards = [
  { title: "ロープレ環境", desc: "24時間いつでもAIとロープレ" },
  { title: "本番への自信", desc: "場数を踏んで自信がつく" },
  { title: "切り返し力", desc: "営業の型が体に染みつく" },
  { title: "弱点の把握", desc: "AIスコアで弱点を可視化" },
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

const serviceCategories = [
  { title: "ロープレ", desc: "AIと営業ロープレ", href: "/roleplay" },
  { title: "ワークシート", desc: "営業準備・分析シート", href: "/worksheet" },
  { title: "学習コース", desc: "22レッスン+認定試験", href: "/learn" },
  { title: "ブログ", desc: "営業ノウハウ記事", href: "/blog" },
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
  {
    q: "データの安全性は？",
    a: "通信はSSL暗号化で保護されています。ロープレの会話データはお客様のアカウントに紐づいて管理され、第三者に共有されることはありません。",
  },
  {
    q: "AIの採点はどの程度正確ですか？",
    a: "AIは営業心理学に基づく5ステップメソッドの評価基準に沿って採点します。人間のコーチと同じ基準でフィードバックを提供しますが、AIの特性上、参考値としてご活用ください。",
  },
  {
    q: "アカウントを削除できますか？",
    a: "はい。設定画面からいつでもアカウントを削除できます。削除すると、すべてのデータが完全に消去されます。",
  },
  {
    q: "法人・チームでの利用は可能ですか？",
    a: "現在はベータテスト期間中のため個人向けのプランのみですが、法人向けプランも準備中です。チームでの研修利用をご検討の方は、お問い合わせください。",
  },
  {
    q: "対応言語は日本語のみですか？",
    a: "はい。現在は日本語のみ対応しています。AIのロープレ・フィードバック・学習コースのすべてが日本語で提供されます。",
  },
];

/* ─── Shared SVG Icons ─── */

function CheckIcon() {
  return (
    <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <div>
      <div className="pencil" />
      <div className="folder">
        <div className="top">
          <svg viewBox="0 0 24 27" aria-hidden="true">
            <path d="M1,0 L23,0 C23.5522847,-1.01453063e-16 24,0.44771525 24,1 L24,8.17157288 C24,8.70200585 23.7892863,9.21071368 23.4142136,9.58578644 L20.5857864,12.4142136 C20.2107137,12.7892863 20,13.2979941 20,13.8284271 L20,26 C20,26.5522847 19.5522847,27 19,27 L1,27 C0.44771525,27 6.76353751e-17,26.5522847 0,26 L0,1 C-6.76353751e-17,0.44771525 0.44771525,1.01453063e-16 1,0 Z" />
          </svg>
        </div>
        <div className="paper" />
      </div>
    </div>
  );
}

/* ─── Before/After Card Illustrations ─── */

function BeforeScene({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden="true">
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
    case 1:
      return (
        <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden="true">
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
    case 2:
      return (
        <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden="true">
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
    case 3:
      return (
        <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden="true">
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
    case 0:
      return (
        <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden="true">
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
    case 1:
      return (
        <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden="true">
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
    case 2:
      return (
        <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden="true">
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
    case 3:
      return (
        <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden="true">
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
    case 0:
      return (
        <svg viewBox="0 0 64 56" className={cls} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
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
    case 1:
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M18 10a12 12 0 0 1 6 22c-2 2-3 4-3 6" />
          <path d="M18 10c-5 0-10 5-10 12s5 12 10 12" />
          <path d="M30 18a5 5 0 0 1 0 8" />
          <path d="M34 14a9 9 0 0 1 0 16" />
          <path d="M38 10a13 13 0 0 1 0 24" opacity="0.5" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="white" stroke="none" aria-hidden="true">
          <rect x="4" y="32" width="9" height="12" rx="1" />
          <rect x="17" y="24" width="9" height="20" rx="1" />
          <rect x="30" y="14" width="9" height="30" rx="1" />
          <path d="M6 30L22 18l14-8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <polygon points="38,8 42,14 34,14" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 48 40" className={cls} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 24l8-10 8 4 4-6" />
          <path d="M44 24l-8-10-8 4-4-6" />
          <path d="M12 24l6 6 5-3 5 5" />
          <path d="M36 24l-6 6-5-3-3 3" />
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
    case 0:
      return (
        <svg viewBox="0 0 56 48" className={cls} fill="none" stroke="#323232" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <rect x="4" y="8" width="48" height="32" rx="3" />
          <line x1="10" y1="16" x2="46" y2="16" opacity="0.3" />
          <line x1="10" y1="24" x2="38" y2="24" />
          <line x1="10" y1="30" x2="30" y2="30" opacity="0.5" />
          <rect x="38" y="28" width="10" height="6" rx="1" fill="#323232" opacity="0.15" />
          <path d="M12 20v-1" strokeWidth="2.5" />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 56 48" className={cls} fill="none" stroke="#323232" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
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
    case 2:
      return (
        <svg viewBox="0 0 56 48" className={cls} fill="none" stroke="#323232" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
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

/* ─── Reusable Primary CTA Button ─── */

function PrimaryCTA({ className = "" }: { className?: string }) {
  return (
    <Link href="/roleplay" className={`morph-btn ${className}`}>
      <span className="btn-fill" />
      <span className="shadow" />
      <span className="btn-text">
        {"今すぐAIと商談してみる".split("").map((char, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties}>{char}</span>
        ))}
      </span>
      <span className="orbit-dots">
        <span /><span /><span /><span />
      </span>
      <span className="corners">
        <span /><span /><span /><span />
      </span>
    </Link>
  );
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

  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://sokukime-ai.vercel.app";

  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#application`,
        name: "成約コーチ AI",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: siteUrl,
        description:
          "AIがリアルなお客さん役を演じる営業ロープレ練習アプリ。クロージング・反論処理を24時間練習。成約率を上げる5ステップメソッドで営業研修を効率化。",
        provider: { "@id": `${siteUrl}/#organization` },
        offers: [
          {
            "@type": "Offer",
            price: "0",
            priceCurrency: "JPY",
            name: "無料プラン",
            description: "1日1回AIロープレ・成約スコアリング・学習コース閲覧",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            price: "2980",
            priceCurrency: "JPY",
            name: "Proプラン",
            description: "AIロープレ無制限・22レッスン+認定試験・リアルタイムコーチング・優先サポート",
            availability: "https://schema.org/InStock",
          },
        ],
        featureList: "AIロープレ, 成約スコア分析, 22レッスン+認定試験, リアルタイムコーチング, 営業分析ワークシート",
        inLanguage: "ja",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ホーム",
            item: siteUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLdData} />
      <Header user={{ isLoggedIn }} />

      {/* ═══════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="hero-city" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Authority badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            <svg className="h-4 w-4 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            1,600件の商談から生まれたメソッド
          </div>

          <h1 className="sr-only">
            AIで営業ロープレ練習 — 成約率を上げる5ステップメソッド
          </h1>

          <p className="mb-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-6xl" role="presentation" style={{ textWrap: "balance" } as React.CSSProperties}>
            「考えます」で終わる商談を、
            <br />
            <span className="text-accent">「お願いします」で終わらせる。</span>
          </p>

          <p className="mx-auto mb-10 max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
            営業心理学に基づく5ステップの「型」をAIと反復練習。
            <br className="hidden sm:block" />
            先輩の空きを待つ必要はもうありません。
          </p>

          {/* Single Primary CTA */}
          <div className="flex flex-col items-center gap-4" data-hero-cta>
            <PrimaryCTA />
            <p className="text-sm text-white/50">
              &#10003; 無料で体験&ensp;&#10003; 登録不要&ensp;&#10003; 1分で最初の商談開始
            </p>
          </div>

          {/* Secondary text link */}
          <p className="mt-4 text-sm text-white/60">
            まずは学習コースから →{" "}
            <Link href="/learn" className="underline decoration-white/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white">
              コースを見る
            </Link>
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm sm:p-6">
                <div className="text-2xl font-bold text-accent sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-sm text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. SOCIAL PROOF
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-3 text-lg font-semibold text-foreground sm:text-xl">
            あなたの業界に対応しています
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {industries.map((name) => (
              <span key={name} className="rounded-full border border-card-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm">
                {name}
              </span>
            ))}
          </div>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            ベータテスト中 — テストユーザー募集中
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. BEFORE / AFTER
      ═══════════════════════════════════════════════ */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-2 text-center text-2xl font-bold text-foreground sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            先週のあなた vs. 来週のあなた
          </h2>
          <p className="mb-10 text-center text-sm text-muted sm:text-base">
            もう「練習相手がいない」と悩む必要はありません
          </p>

          {/* Before */}
          <div className="mb-3 text-center">
            <span className="inline-block rounded-full bg-red-100 px-4 py-1 text-sm font-bold text-red-500 border border-red-200">
              Before
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {beforeCards.map((card, i) => (
              <div key={card.title} className="ba-card ba-card--before">
                <div className="ba-card__illustration">
                  <BeforeScene index={i} />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-red-800/60">{card.title}</p>
                  <p className="text-sm font-medium leading-snug text-red-600">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="my-6 flex justify-center">
            <svg className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          {/* After */}
          <div className="mb-3 text-center">
            <span className="inline-block rounded-full bg-accent/20 px-4 py-1 text-sm font-bold text-accent">
              After
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {afterCards.map((card, i) => (
              <div key={card.title} className="ba-card">
                <div className="ba-card__illustration">
                  <AfterScene index={i} />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-600">{card.title}</p>
                  <p className="text-sm font-medium leading-snug text-emerald-500">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Intermediate CTA */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <PrimaryCTA />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. HOW IT WORKS
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div className="blob blob-pink" style={{ width: 300, height: 300, top: -40, right: -60 }} />
        <div className="relative z-10 mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            3ステップで、今日から営業練習が変わる
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:mb-16 sm:text-base">
            登録もダウンロードも不要。思い立った瞬間にロープレ開始。
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

      {/* ═══════════════════════════════════════════════
          5. 5-STEP METHOD
      ═══════════════════════════════════════════════ */}
      <section className="overflow-hidden py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            トップ営業マンが無意識にやっている5つのステップ
          </h2>
          <p className="mb-2 text-center text-sm font-medium text-accent">
            4年半・1,600件の現場経験を体系化した営業の型
          </p>
          <p className="mb-12 text-center text-sm text-muted sm:mb-16 sm:text-base">
            この流れを身につければ、どんな商材でも商談の型ができる
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

      {/* ═══════════════════════════════════════════════
          6. SERVICE CATEGORIES
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-foreground sm:text-3xl">
            あなたの営業力を上げる4つの武器
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
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

      {/* ═══════════════════════════════════════════════
          7. BETA TEST CTA
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            今なら全機能を無料で体験できます
          </h2>
          <p className="mb-10 text-sm text-muted sm:text-base">
            まずは1回、AIと商談してみてください。
            <br />
            あなたのフィードバックがサービスを育てます。
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
                    <span className="icon"><CheckIcon /></span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <div className="action">
                <Link href="/roleplay" className="button">今すぐAIと商談してみる</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8. FAQ
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div className="blob blob-cream" style={{ width: 250, height: 250, bottom: -40, left: -60 }} />
        <div className="relative z-10 mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            よくある質問
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            成約コーチ AIについてのよくある質問にお答えします
          </p>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-2xl bg-white shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden list-none">
                  <span>{faq.q}</span>
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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

      {/* ═══════════════════════════════════════════════
          9. FINAL CTA
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div className="blob blob-teal" style={{ width: 400, height: 400, top: -100, left: "30%" }} />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            明日の商談に間に合う。今すぐ練習を始めよう。
          </h2>
          <p className="mb-4 text-sm text-muted sm:text-base">
            無料アカウントで今日から練習できます。まずは1回、試してみてください。
          </p>
          <p className="mb-10 text-sm text-muted">
            &#10003; 無料で体験 &#10003; 登録不要 &#10003; いつでも解約OK
          </p>
          <div className="flex flex-col items-center gap-4">
            <PrimaryCTA />
          </div>
          <div className="mt-6">
            <Link href="/pricing" className="text-sm text-muted transition hover:text-accent hover:underline">
              料金プランを見る →
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-muted sm:gap-6">
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              SSL暗号化通信
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              データ安全保護
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              いつでも退会可能
            </span>
          </div>
        </div>
      </section>

      <Footer />
      <StickyCTA />
      <HomepageCTATracker />
      <HomeExitPopup />
      <ScrollSlideIn sessionKey="home-slide-in">
        <p className="mb-2 text-sm font-bold text-foreground">
          まだ試してない？
        </p>
        <p className="mb-3 text-xs text-muted">
          3分でAIがあなたの営業力を採点します
        </p>
        <Link
          href="/roleplay"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-accent px-4 text-xs font-bold text-white transition hover:bg-accent-hover"
        >
          無料で診断する
        </Link>
      </ScrollSlideIn>
    </div>
  );
}
