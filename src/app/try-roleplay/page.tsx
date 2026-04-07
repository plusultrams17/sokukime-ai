"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";

/* ─── 4 core templates covering major sales verticals ─── */
const TEMPLATES = [
  {
    id: "insurance",
    name: "保険営業",
    emoji: "🏥",
    description: "30代に医療保険を電話で提案",
    product: "医療保険",
    industry: "保険見直し検討中の30代",
    difficulty: "skeptical",
    scene: "phone",
  },
  {
    id: "realestate",
    name: "不動産営業",
    emoji: "🏠",
    description: "30代夫婦にマンションを接客",
    product: "新築マンション",
    industry: "住宅購入検討者",
    difficulty: "cautious",
    scene: "inbound",
  },
  {
    id: "painting",
    name: "リフォーム訪問",
    emoji: "🎨",
    description: "40代夫婦に外壁塗装を提案",
    product: "外壁塗装",
    industry: "戸建て住宅オーナー",
    difficulty: "cautious",
    scene: "visit",
  },
  {
    id: "btob",
    name: "法人営業",
    emoji: "💼",
    description: "中小企業にSaaS導入を提案",
    product: "業務効率化SaaS",
    industry: "中小企業",
    difficulty: "cautious",
    scene: "phone",
  },
] as const;

/* ─── Session Storage Keys ─── */
const GUEST_SETUP_KEY = "guest-roleplay-setup";
const GUEST_COMPLETED_KEY = "guest-roleplay-completed";

export default function TryRoleplayPage() {
  const router = useRouter();
  const [alreadyTried, setAlreadyTried] = useState(false);
  const [customProduct, setCustomProduct] = useState("");
  const customInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const completed = sessionStorage.getItem(GUEST_COMPLETED_KEY);
      if (completed === "true") {
        setAlreadyTried(true);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  function navigateToChat(product: string, industry: string, difficulty: string, scene: string) {
    try { sessionStorage.removeItem(GUEST_COMPLETED_KEY); } catch {}
    try {
      sessionStorage.setItem(
        GUEST_SETUP_KEY,
        JSON.stringify({ industry, product, difficulty, scene, customerType: "individual" }),
      );
    } catch {}
    const params = new URLSearchParams({ product, industry, difficulty, scene });
    router.push(`/try-roleplay/chat?${params.toString()}`);
  }

  function handleTemplateClick(template: (typeof TEMPLATES)[number]) {
    navigateToChat(template.product, template.industry, template.difficulty, template.scene);
  }

  function handleCustomStart() {
    const product = customProduct.trim();
    if (!product) {
      customInputRef.current?.focus();
      return;
    }
    navigateToChat(product, "お客さん", "cautious", "visit");
  }

  function handleRetry() {
    try {
      sessionStorage.removeItem(GUEST_COMPLETED_KEY);
      sessionStorage.removeItem(GUEST_SETUP_KEY);
    } catch {}
    setAlreadyTried(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-xl px-4 py-8 sm:py-16">
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center">
            <p className="mb-2 text-xs font-bold text-accent tracking-wider">登録不要 ・ 3分で完了</p>
            <h1 className="mb-2 text-2xl font-extrabold text-foreground sm:text-3xl">
              AIロープレを無料体験
            </h1>
            <p className="text-sm text-muted leading-relaxed">
              AIがリアルなお客さん役を演じます。タップして即スタート。
            </p>
          </div>

          {/* Already tried banner */}
          {alreadyTried && (
            <div className="rounded-2xl border-2 border-accent bg-accent/5 p-6 text-center">
              <p className="mb-1 text-base font-bold text-foreground">
                ゲスト体験は1回までです
              </p>
              <p className="mb-4 text-sm text-muted leading-relaxed">
                無料登録すると毎日1回、Proなら無制限でロープレできます
              </p>
              <div className="flex flex-col items-center gap-3">
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover"
                >
                  無料登録してロープレ続行
                </Link>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="text-xs text-muted underline transition hover:text-foreground"
                >
                  もう一度体験する
                </button>
              </div>
            </div>
          )}

          {/* Template grid + custom input */}
          {!alreadyTried && (
            <>
              {/* 2x2 template grid */}
              <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTemplateClick(t)}
                    className="rounded-xl border border-card-border bg-card p-4 text-left transition hover:border-accent/50 hover:-translate-y-0.5 active:scale-[0.97]"
                    aria-label={`${t.name}のロープレを開始: ${t.description}`}
                  >
                    <div className="mb-1 text-xl" aria-hidden="true">{t.emoji}</div>
                    <div className="text-sm font-bold text-foreground">{t.name}</div>
                    <div className="mt-0.5 text-xs text-muted leading-relaxed">{t.description}</div>
                  </button>
                ))}
              </div>

              {/* Custom product input */}
              <div className="rounded-xl border border-card-border bg-card p-4">
                <div className="mb-2 text-sm font-bold text-foreground">
                  自分の商材で練習
                </div>
                <div className="flex gap-2">
                  <input
                    ref={customInputRef}
                    type="text"
                    value={customProduct}
                    onChange={(e) => setCustomProduct(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleCustomStart(); }}
                    placeholder="例: 生命保険、注文住宅、人材紹介..."
                    className="flex-1 rounded-lg border border-card-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={handleCustomStart}
                    className="shrink-0 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-white transition hover:bg-accent-hover"
                  >
                    開始
                  </button>
                </div>
              </div>

              <p className="text-center text-xs text-muted">
                登録不要 ・ 1回無料体験 ・ 3分で完了
              </p>
            </>
          )}

          {/* Back to top */}
          <div className="text-center">
            <Link
              href="/"
              className="text-xs text-muted underline transition hover:text-foreground"
            >
              ← トップページに戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
