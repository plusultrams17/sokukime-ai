"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserMenu } from "@/components/user-menu";
import { Logo } from "@/components/logo";
import { trackCTAClick } from "@/lib/tracking";
import { CancelSaveModal } from "@/components/cancel-save-modal";

const navLinksPublic = [
  { href: "/learn", label: "学習コース" },
  { href: "/roleplay", label: "AIロープレ" },
  { href: "/challenge", label: "チャレンジ" },
  { href: "/pricing", label: "料金プラン" },
];

const navLinksLoggedIn = [
  { href: "/roleplay", label: "AIロープレ" },
  { href: "/dashboard", label: "ダッシュボード" },
  { href: "/learn", label: "学習コース" },
  { href: "/challenge", label: "チャレンジ" },
];

export function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [plan, setPlan] = useState<"free" | "starter" | "pro" | "master">("free");
  const [email, setEmail] = useState<string | null>(null);

  const isPaid = plan === "starter" || plan === "pro" || plan === "master";
  const planLabel = plan === "master" ? "Master" : plan === "pro" ? "Pro" : plan === "starter" ? "Starter" : "";
  const [open, setOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
      if (user) {
        setEmail(user.email || null);
        supabase
          .from("profiles")
          .select("plan")
          .eq("id", user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.warn("[header] profiles query failed:", error.message);
            }
            const rawPlan = data?.plan;
            const dbPlan: "free" | "starter" | "pro" | "master" =
              rawPlan === "starter" || rawPlan === "pro" || rawPlan === "master"
                ? rawPlan
                : "free";
            setPlan(dbPlan);

            // Fallback: DBがfreeでもStripeにサブスクがある可能性（Webhook遅延等）
            if (dbPlan === "free") {
              fetch("/api/stripe/sync", { method: "POST" })
                .then((r) => r.json())
                .then((syncData) => {
                  const syncPlan = syncData?.plan;
                  if (syncPlan === "starter" || syncPlan === "pro" || syncPlan === "master") {
                    setPlan(syncPlan);
                  }
                })
                .catch(() => {});
            }
          });
      }
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  async function handleManageSubscription() {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      console.error("[header] stripe portal failed:", res.status, data);
      alert(
        "サブスクリプション管理画面を開けませんでした。時間をおいて再度お試しください。\n問題が続く場合は support@seiyaku-coach.com までご連絡ください。"
      );
    } catch (err) {
      console.error("[header] stripe portal error:", err);
      alert(
        "サブスクリプション管理画面を開けませんでした。通信環境をご確認のうえ再度お試しください。"
      );
    }
  }

  const navLinks = isLoggedIn ? navLinksLoggedIn : navLinksPublic;

  return (
    <>
    <header className="site-header">
      <div className="relative z-10 mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="header-link">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA (right aligned) */}
        <div className="hidden items-center gap-4 lg:flex">
          {isLoggedIn ? (
            <>
              <UserMenu />
              {!isPaid ? (
                <Link href="/pricing" className="nav-btn" onClick={() => trackCTAClick("header_upgrade", "header", "/pricing")}>
                  <span>プランを見る</span>
                </Link>
              ) : (
                <Link href="/roleplay" className="nav-btn" onClick={() => trackCTAClick("header_roleplay", "header", "/roleplay")}>
                  <span>ロープレを始める</span>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/login" className="header-link">
                ログイン
              </Link>
              <Link href="/roleplay" className="nav-btn" onClick={() => trackCTAClick("header_try", "header", "/roleplay")}>
                <span>無料で試す</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="hamburger lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="メニュー"
          aria-expanded={open}
        >
          <span className={`hamburger__line ${open ? "hamburger__line--open" : ""}`} />
          <span className={`hamburger__line ${open ? "hamburger__line--open" : ""}`} />
          <span className={`hamburger__line ${open ? "hamburger__line--open" : ""}`} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`mobile-menu lg:hidden ${open ? "mobile-menu--open" : ""}`}
      >
        <nav className="mobile-menu__nav">
          {/* User info (logged in) */}
          {isLoggedIn && email && (
            <div className="px-1 pb-2">
              <div className="text-xs text-muted truncate">{email}</div>
              <div className="mt-0.5 text-xs font-medium">
                {isPaid ? (
                  <span className="text-accent">{planLabel} プラン</span>
                ) : (
                  <span className="text-muted">無料プラン</span>
                )}
              </div>
            </div>
          )}

          {isLoggedIn && <div className="mobile-menu__divider" />}

          {/* Main nav links */}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-menu__link"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Logged-in user menu items */}
          {isLoggedIn && (
            <>
              <div className="mobile-menu__divider" />
              <Link
                href="/pricing"
                className="mobile-menu__link"
                onClick={() => setOpen(false)}
              >
                料金プラン
              </Link>
              <Link
                href="/referral"
                className="mobile-menu__link flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                友達を紹介
                <span className="rounded-full bg-green-500/10 px-1.5 py-0.5 text-[10px] font-bold text-green-500">
                  ¥1,000 OFF
                </span>
              </Link>
              <Link
                href="/settings"
                className="mobile-menu__link"
                onClick={() => setOpen(false)}
              >
                設定
              </Link>
              <Link
                href="/changelog"
                className="mobile-menu__link"
                onClick={() => setOpen(false)}
              >
                更新情報
              </Link>
              {isPaid && (
                <button
                  onClick={() => {
                    setOpen(false);
                    setShowCancelModal(true);
                  }}
                  className="mobile-menu__link w-full text-left"
                >
                  サブスクリプション管理
                </button>
              )}
            </>
          )}

          <div className="mobile-menu__divider" />

          {/* CTA / Auth actions */}
          {isLoggedIn ? (
            <>
              {!isPaid ? (
                <Link
                  href="/pricing"
                  className="nav-btn mobile-menu__cta"
                  onClick={() => { setOpen(false); trackCTAClick("header_upgrade_mobile", "mobile_menu", "/pricing"); }}
                >
                  <span>プランを見る</span>
                </Link>
              ) : (
                <Link
                  href="/roleplay"
                  className="nav-btn mobile-menu__cta"
                  onClick={() => setOpen(false)}
                >
                  <span>ロープレを始める</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="mobile-menu__link w-full text-left text-red-500"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="mobile-menu__link"
                onClick={() => setOpen(false)}
              >
                ログイン
              </Link>
              <Link
                href="/roleplay"
                className="nav-btn mobile-menu__cta"
                onClick={() => { setOpen(false); trackCTAClick("header_try_mobile", "mobile_menu", "/roleplay"); }}
              >
                <span>無料で試す</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
    {/* Spacer to offset fixed header height */}
    <div className="h-16" />
    <CancelSaveModal
      open={showCancelModal}
      onClose={() => setShowCancelModal(false)}
      onProceedToCancel={handleManageSubscription}
    />
    </>
  );
}
