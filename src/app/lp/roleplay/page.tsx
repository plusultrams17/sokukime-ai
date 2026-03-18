import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { StickyCTA } from "@/components/sticky-cta";
import { ScrollSlideIn } from "@/components/scroll-slide-in";
import { RoleplayLpExitPopup } from "@/components/exit-popups/roleplay-lp-exit-popup";
import { SalesAnalyzer } from "@/components/sales-analyzer";

/* ─── SEO Metadata ─── */

export const metadata: Metadata = {
  title: "AI営業分析ツール｜URLを入れるだけで営業トーク・競合分析を自動生成",
  description:
    "URLまたは商材名を入力するだけでAIがセリングポイント分析・競合分析・成約トークスクリプトを自動生成。営業ロープレ練習アプリ。無料・登録不要で今すぐ使える。",
  alternates: { canonical: "/lp/roleplay" },
  openGraph: {
    title: "AI営業分析ツール｜10秒であなたの商材を営業武器に変える",
    description:
      "URLを入れるだけ。AIがセリングポイント・競合分析・成約トークスクリプトを自動生成。無料・登録不要。",
    url: "/lp/roleplay",
  },
};

/* ─── Data ─── */

const painPoints = [
  {
    icon: "user-x",
    title: "先輩が忙しくてロープレを頼めない",
    desc: "「いま忙しい」「後でね」——結局練習できないまま本番を迎えていませんか？",
  },
  {
    icon: "calendar-off",
    title: "本番前に練習したいのに環境がない",
    desc: "大事な商談の前に練習したいのに、深夜や早朝に付き合ってくれる人はいません。",
  },
  {
    icon: "repeat",
    title: "同じパターンばかりで切り返しが増えない",
    desc: "同僚とのロープレはいつも同じ展開。新しい反論パターンが身につきません。",
  },
];

const features = [
  {
    title: "リアルなAI顧客役",
    desc: "業種・商材を入力するだけで、そのシーンに合ったリアルなお客さん役をAIが生成。不動産・保険・SaaS・人材など幅広く対応。",
    icon: "users",
  },
  {
    title: "成約5ステップスコアリング",
    desc: "アプローチ・ヒアリング・プレゼン・クロージング・反論処理の5カテゴリで、あなたの営業力を100点満点で採点。",
    icon: "chart",
  },
  {
    title: "5カテゴリ詳細採点",
    desc: "各ステップごとに具体的な改善ポイントを提示。何ができていて、何が足りないかが一目でわかります。",
    icon: "clipboard",
  },
  {
    title: "リアルタイムコーチング",
    desc: "ロープレ中にAIコーチが的確なアドバイスをリアルタイムで提供。その場で修正しながら上達できます。",
    icon: "lightbulb",
  },
  {
    title: "難易度選択",
    desc: "初級・中級・上級から選べる難易度設定。初心者は基本の型から、上級者は厳しい反論処理まで練習可能。",
    icon: "sliders",
  },
];

const beforeCards = [
  { title: "ロープレ環境", desc: "先輩に頼まないとロープレできない" },
  { title: "本番への不安", desc: "練習不足で本番が怖い" },
  { title: "切り返し力", desc: "切り返しパターンが少ない" },
];

const afterCards = [
  { title: "ロープレ環境", desc: "24時間いつでもAIとロープレ" },
  { title: "本番への自信", desc: "場数を踏んで自信がつく" },
  { title: "切り返し力", desc: "営業の型が体に染みつく" },
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

const industries = ["不動産", "保険", "SaaS", "人材", "教育", "物販"];

const lpFaqs = [
  {
    q: "本当に無料で使えますか？",
    a: "はい。登録不要で今すぐロープレを体験できます。無料アカウントで1日1回AIロープレが可能です。もっと練習したい方にはProプラン（月額¥2,980）をご用意しています。",
  },
  {
    q: "どんな業種・商材でも使えますか？",
    a: "はい。業種・商材を入力すると、AIがそのシーンに合ったお客さん役を演じます。不動産、保険、SaaS、人材、教育、物販など幅広くご利用いただけます。",
  },
  {
    q: "AIのロープレはリアルですか？",
    a: "AIは実際の商談で起こりうる反応（質問、反論、沈黙など）を再現します。業種や商材に応じた具体的なシナリオで、リアルな練習が可能です。",
  },
  {
    q: "一人で練習して効果はありますか？",
    a: "はい。成約5ステップメソッドに基づく客観的なスコアリングで、自分の弱点を正確に把握できます。反復練習で営業の型が体に染みつき、本番での再現性が高まります。",
  },
  {
    q: "スマートフォンでも使えますか？",
    a: "はい。ブラウザから利用でき、スマートフォン・タブレット・PCすべてに対応しています。通勤中や移動中でも練習できます。",
  },
  {
    q: "データの安全性は？",
    a: "通信はSSL暗号化で保護されています。ロープレの会話データはお客様のアカウントに紐づいて管理され、第三者に共有されることはありません。",
  },
];

/* ─── SVG Illustrations ─── */

function PainPointIcon({ type }: { type: string }) {
  const cls = "h-8 w-8 text-accent";
  switch (type) {
    case "user-x":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
        </svg>
      );
    case "calendar-off":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "repeat":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
        </svg>
      );
    default:
      return null;
  }
}

function FeatureIcon({ type }: { type: string }) {
  const cls = "h-10 w-10 text-accent";
  switch (type) {
    case "users":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      );
    case "chart":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      );
    case "clipboard":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      );
    case "lightbulb":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      );
    case "sliders":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
      );
    default:
      return null;
  }
}

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
    default:
      return null;
  }
}

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

function CheckIcon() {
  return (
    <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" />
    </svg>
  );
}

/* ─── LP-specific Primary CTA ─── */

function LpPrimaryCTA({ text = "今すぐAIとロープレする", className = "" }: { text?: string; className?: string }) {
  return (
    <Link href="/roleplay" className={`morph-btn ${className}`}>
      <span className="btn-fill" />
      <span className="shadow" />
      <span className="btn-text">
        {text.split("").map((char, i) => (
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

export default async function RoleplayLP() {
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
    process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/lp/roleplay#application`,
        name: "成約コーチ AI — 営業ロープレ",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: `${siteUrl}/lp/roleplay`,
        description:
          "AIが本気の顧客役になる営業ロープレ練習アプリ。24時間いつでも何度でも営業トレーニング。業種・商材カスタマイズ対応。",
        offers: [
          {
            "@type": "Offer",
            price: "0",
            priceCurrency: "JPY",
            name: "無料プラン",
            description: "1日1回AIロープレ",
          },
          {
            "@type": "Offer",
            price: "2980",
            priceCurrency: "JPY",
            name: "Proプラン",
            description: "AIロープレ無制限・リアルタイムコーチング",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/lp/roleplay#faq`,
        mainEntity: lpFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "営業ロープレ AI練習", item: `${siteUrl}/lp/roleplay` },
        ],
      },
      {
        "@type": "HowTo",
        name: "AIで営業ロープレを始める方法",
        step: steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.title,
          text: s.desc,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLdData} />
      <Header user={{ isLoggedIn }} />

      {/* ═══════════════════════════════════════════════
          1. HERO — 即座に価値を体験
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="hero-city" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            <svg className="h-4 w-4 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            1,600件の商談データから構築したAI営業分析
          </div>

          <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            あなたの商材、<span className="text-accent">10秒で営業武器に変える。</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
            URLまたは商材名を入力するだけ。
            <br className="hidden sm:block" />
            AIがセリングポイント・競合分析・成約トークスクリプトを自動生成。
          </p>

          <div data-hero-cta>
            <SalesAnalyzer />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {[
              { value: "10秒", label: "で営業武器が完成" },
              { value: "3つの分析", label: "セリング・競合・トーク" },
              { value: "0円", label: "登録不要で今すぐ" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm sm:p-6">
                <div className="text-2xl font-bold text-accent sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-sm text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. PAIN POINTS / EMPATHY
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            こんなお悩みありませんか？
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            営業ロープレの「あるある」な悩み
          </p>

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {painPoints.map((point) => (
              <div key={point.title} className="flex items-start gap-4 rounded-2xl border border-card-border bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <PainPointIcon type={point.icon} />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">{point.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          <p className="mt-4 text-center text-lg font-bold text-accent sm:text-xl">
            成約コーチ AIなら、この3つを全部解決します
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. FEATURE DETAILS
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            成約コーチ AIの5つの武器
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            営業ロープレに必要なすべてが揃っています
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {features.map((feat) => (
              <div key={feat.title} className="rounded-2xl border border-card-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                  <FeatureIcon type={feat.icon} />
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground">{feat.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. BEFORE / AFTER
      ═══════════════════════════════════════════════ */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-2 text-center text-2xl font-bold text-foreground sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            ロープレ前 vs. ロープレ後
          </h2>
          <p className="mb-10 text-center text-sm text-muted sm:text-base">
            もう「練習相手がいない」と悩む必要はありません
          </p>

          <div className="mb-3 text-center">
            <span className="inline-block rounded-full bg-red-100 px-4 py-1 text-sm font-bold text-red-500 border border-red-200">
              Before
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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

          <div className="my-6 flex justify-center">
            <svg className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          <div className="mb-3 text-center">
            <span className="inline-block rounded-full bg-accent/20 px-4 py-1 text-sm font-bold text-accent">
              After
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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

          <div className="mt-10 flex flex-col items-center gap-4">
            <LpPrimaryCTA />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. HOW IT WORKS
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div className="blob blob-pink" style={{ width: 300, height: 300, top: -40, right: -60 }} />
        <div className="relative z-10 mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            3ステップで今日からロープレ開始
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
          6. INDUSTRIES
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
            あらゆる業種・商材に対応
          </h2>
          <p className="mb-8 text-sm text-muted sm:text-base">
            あなたの業種を入力すれば、AIがその業界のリアルな顧客を再現します
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {industries.map((name) => (
              <span key={name} className="rounded-full border border-card-border bg-white px-5 py-2.5 text-sm font-medium text-foreground shadow-sm">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7. PRICING (SIMPLIFIED)
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            シンプルな料金プラン
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            まずは無料で体験。もっと練習したくなったらProへ。
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Free Plan */}
            <div className="rounded-2xl border border-card-border bg-white p-8">
              <p className="mb-1 text-sm font-medium text-muted">無料プラン</p>
              <p className="mb-4 text-3xl font-bold text-foreground">¥0</p>
              <ul className="space-y-3 text-sm text-muted">
                <li className="flex items-center gap-2">
                  <span className="text-accent"><CheckIcon /></span>
                  AIロープレ 1日1回
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent"><CheckIcon /></span>
                  成約スコアリング
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent"><CheckIcon /></span>
                  登録不要で今すぐ開始
                </li>
              </ul>
              <Link
                href="/roleplay"
                className="mt-6 flex h-12 w-full items-center justify-center rounded-xl border-2 border-accent text-base font-bold text-accent transition hover:bg-accent hover:text-white"
              >
                無料で始める
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="relative rounded-2xl border-2 border-accent bg-white p-8 shadow-lg">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-white">
                おすすめ
              </span>
              <p className="mb-1 text-sm font-medium text-muted">Proプラン</p>
              <p className="mb-1 text-3xl font-bold text-foreground">
                ¥2,980<span className="text-base font-normal text-muted">/月</span>
              </p>
              <p className="mb-4 text-xs text-muted">1日あたり約99円</p>
              <ul className="space-y-3 text-sm text-muted">
                <li className="flex items-center gap-2">
                  <span className="text-accent"><CheckIcon /></span>
                  AIロープレ <strong className="text-foreground">無制限</strong>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent"><CheckIcon /></span>
                  5カテゴリ詳細スコア
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent"><CheckIcon /></span>
                  リアルタイムコーチング
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent"><CheckIcon /></span>
                  全ワークシート利用可
                </li>
              </ul>
              <Link
                href="/pricing"
                className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
              >
                Proプランを見る
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <LpPrimaryCTA text="まずは無料でロープレする" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8. CROSS-SELL
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            ロープレ以外にも
          </h2>
          <p className="mb-10 text-center text-sm text-muted sm:text-base">
            営業力を総合的に高める機能をご用意しています
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <Link
              href="/lp/learn"
              className="group flex items-start gap-4 rounded-2xl border border-card-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <div>
                <p className="text-base font-bold text-foreground group-hover:text-accent">
                  学習コース
                  <span className="ml-2 text-xs font-normal text-muted">22レッスン + 認定試験</span>
                </p>
                <p className="mt-1 text-sm text-muted">
                  ロープレの前に営業の基礎を学びたい方へ。成約5ステップを体系的にマスター。
                </p>
              </div>
            </Link>

            <Link
              href="/lp/worksheet"
              className="group flex items-start gap-4 rounded-2xl border border-card-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div>
                <p className="text-base font-bold text-foreground group-hover:text-accent">
                  ワークシート
                  <span className="ml-2 text-xs font-normal text-muted">営業準備・分析</span>
                </p>
                <p className="mt-1 text-sm text-muted">
                  商談前の準備に。顧客分析・提案構成・反論予測シートで本番に万全の状態で臨めます。
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9. FAQ
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div className="blob blob-cream" style={{ width: 250, height: 250, bottom: -40, left: -60 }} />
        <div className="relative z-10 mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            営業ロープレ AIのよくある質問
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            AIロープレに関するよくあるご質問にお答えします
          </p>
          <div className="space-y-3">
            {lpFaqs.map((faq) => (
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
          10. FINAL CTA
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div className="blob blob-teal" style={{ width: 400, height: 400, top: -100, left: "30%" }} />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            今日から営業ロープレを変えよう
          </h2>
          <p className="mb-4 text-sm text-muted sm:text-base">
            先輩の空きを待つ必要はもうありません。AIがいつでも本気の練習相手になります。
          </p>
          <p className="mb-10 text-sm text-muted">
            &#10003; 無料で体験 &#10003; 登録不要 &#10003; いつでも解約OK
          </p>
          <div className="flex flex-col items-center gap-4">
            <LpPrimaryCTA />
          </div>
          <div className="mt-6">
            <Link href="/pricing" className="text-sm text-muted transition hover:text-accent hover:underline">
              料金プランの詳細を見る →
            </Link>
          </div>

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
      <StickyCTA
        ctaText="無料で営業武器を作成"
        subtitle="URLを入れるだけ・登録不要"
        trackingId="lp_roleplay_sticky"
        ctaHref="/lp/roleplay"
      />
      <RoleplayLpExitPopup />
      <ScrollSlideIn sessionKey="lp-roleplay-slide-in">
        <p className="mb-2 text-sm font-bold text-foreground">
          あなたの商材、分析した？
        </p>
        <p className="mb-3 text-xs text-muted">
          URLを入れるだけでAIが営業トーク・競合分析を自動生成
        </p>
        <Link
          href="/lp/roleplay"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-accent px-4 text-xs font-bold text-white transition hover:bg-accent-hover"
        >
          無料で分析する
        </Link>
      </ScrollSlideIn>
    </div>
  );
}
