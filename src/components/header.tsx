"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { UserMenu } from "@/components/user-menu";
import { trackCTAClick } from "@/lib/tracking";

const navLinks = [
  { href: "/learn", label: "学習コース" },
  { href: "/program", label: "教材" },
  { href: "/industry", label: "業種別" },
  { href: "/tools", label: "無料ツール" },
  { href: "/blog", label: "ブログ" },
  { href: "/pricing", label: "料金プラン" },
];

export function Header({ minimal = false }: { minimal?: boolean }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
      if (user) {
        supabase
          .from("profiles")
          .select("plan")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            if (data?.plan) setPlan(data.plan as "free" | "pro");
          });
        // Check team membership
        supabase
          .from("team_members")
          .select("id")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle()
          .then(({ data }) => {
            if (data) setIsTeamMember(true);
          });
      }
    });
  }, []);

  return (
    <>
    <header className="site-header">
      <div className="relative z-10 mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="text-xl font-black tracking-tight text-foreground" style={{ fontFamily: "var(--font-serif-jp), 'YuMincho', 'Hiragino Mincho ProN', serif" }}>
            成約コーチ<span style={{ color: "var(--lp-cta)" }}>AI</span>
          </span>
        </Link>

        {/* Desktop nav — links (hide when minimal) */}
        {!minimal && (
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="header-link">
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Desktop nav — auth (right aligned) */}
        <div className="hidden items-center gap-4 lg:flex">
          {!minimal && isLoggedIn && isTeamMember && (
            <Link href="/team" className="header-link">
              チーム
            </Link>
          )}
          {isLoggedIn && <UserMenu />}
          {minimal ? (
            <Link href="/learn" className="nav-btn" onClick={() => trackCTAClick("header_learn", "header", "/learn")}>
              <span>無料で学ぶ</span>
            </Link>
          ) : (
            <>
              {!isLoggedIn && (
                <Link href="/login" className="header-link">
                  ログイン
                </Link>
              )}
              {isLoggedIn && plan === "free" ? (
                <Link href="/pricing" className="nav-btn" onClick={() => trackCTAClick("header_upgrade", "header", "/pricing")}>
                  <span>Proにアップグレード</span>
                </Link>
              ) : isLoggedIn && plan === "pro" ? (
                <Link href="/roleplay" className="nav-btn" onClick={() => trackCTAClick("header_roleplay", "header", "/roleplay")}>
                  <span>ロープレを始める</span>
                </Link>
              ) : (
                <Link href="/learn" className="nav-btn" onClick={() => trackCTAClick("header_learn", "header", "/learn")}>
                  <span>無料で学ぶ</span>
                </Link>
              )}
            </>
          )}
        </div>

        {/* Mobile — hide hamburger when minimal, show CTA instead */}
        {minimal ? (
          <Link href="/learn" className="nav-btn lg:hidden" onClick={() => trackCTAClick("header_learn_mobile", "header", "/learn")}>
            <span>無料で学ぶ</span>
          </Link>
        ) : (
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
        )}
      </div>

      {/* Mobile menu overlay (hidden when minimal) */}
      {!minimal && (
        <div
          className={`mobile-menu lg:hidden ${open ? "mobile-menu--open" : ""}`}
        >
          <nav className="mobile-menu__nav">
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
            {isLoggedIn && isTeamMember && (
              <Link
                href="/team"
                className="mobile-menu__link"
                onClick={() => setOpen(false)}
              >
                チーム管理
              </Link>
            )}
            <div className="mobile-menu__divider" />
            <Link
              href="/learn"
              className="mobile-menu__cta-secondary"
              onClick={() => setOpen(false)}
            >
              まず営業の型を学ぶ
            </Link>
            {isLoggedIn && plan === "free" ? (
              <>
                <Link
                  href="/pricing"
                  className="nav-btn mobile-menu__cta"
                  onClick={() => { setOpen(false); trackCTAClick("header_upgrade_mobile", "mobile_menu", "/pricing"); }}
                >
                  <span>Proにアップグレード</span>
                </Link>
                <Link
                  href="/roleplay"
                  className="mobile-menu__link"
                  onClick={() => setOpen(false)}
                >
                  学んだらAIで練習
                </Link>
              </>
            ) : isLoggedIn && plan === "pro" ? (
              <Link
                href="/roleplay"
                className="nav-btn mobile-menu__cta"
                onClick={() => setOpen(false)}
              >
                <span>ロープレを始める</span>
              </Link>
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
                  href="/learn"
                  className="nav-btn mobile-menu__cta"
                  onClick={() => setOpen(false)}
                >
                  <span>無料で学ぶ</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
    {/* Spacer to offset fixed header height */}
    <div className="h-16" />
    </>
  );
}
