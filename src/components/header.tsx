"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { UserMenu } from "@/components/user-menu";
import { trackCTAClick } from "@/lib/tracking";

const navLinks = [
  { href: "/tools", label: "無料ツール" },
  { href: "/industry", label: "業種別" },
  { href: "/learn", label: "学習" },
  { href: "/blog", label: "ブログ" },
  { href: "/pricing", label: "料金プラン" },
];

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  return (
    <>
    <header className="site-header">
      <div className="relative z-10 mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="header-logo">
            <path d="M8 38c2-1 5-2 9-2s7 1 9 3" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M17 36c2-1.5 4-2 6-1.5 2.5 0.8 4 2.5 5 4.5 0.8 1.5 0.5 3-0.5 4s-2.5 1.5-4 1" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M56 38c-2-1-5-2-9-2s-7 1-9 3" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M47 36c-2-1.5-4-2-6-1.5-2.5 0.8-4 2.5-5 4.5-0.8 1.5-0.5 3 0.5 4s2.5 1.5 4 1" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M27 39c1.5-2 3.5-3 5-3s3.5 1 5 3c1 1.5 1 3 0 4s-2.5 1.5-5 1.5-4-0.5-5-1.5-1-2.5 0-4z" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M25.5 38.5c1-1 2-1.2 3-0.8 1.2 0.4 1.8 1.5 1.5 2.8" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M38.5 38.5c-1-1-2-1.2-3-0.8-1.2 0.4-1.8 1.5-1.5 2.8" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="32" cy="24" r="2" fill="var(--accent)" opacity="0.7" />
            <circle cx="24" cy="27" r="1.3" fill="var(--accent)" opacity="0.6" />
            <circle cx="40" cy="27" r="1.3" fill="var(--accent)" opacity="0.6" />
            <path d="M32 28v-5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <path d="M27 30l-2-3" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <path d="M37 30l2-3" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          </svg>
          <span className="header-wave-text" aria-label="成約コーチ AI">
            <span className="header-wave-text__outline">成約コーチ AI</span>
            <span className="header-wave-text__fill">成約コーチ AI</span>
          </span>
        </Link>

        {/* Desktop nav — links */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="header-link">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop nav — auth (right aligned) */}
        <div className="hidden items-center gap-4 lg:flex">
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <Link href="/login" className="header-link">
              ログイン
            </Link>
          )}
          <Link href="/roleplay" className="nav-btn" onClick={() => trackCTAClick("header_signup", "header", "/roleplay")}>
            <span>無料で試す</span>
          </Link>
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
          <div className="mobile-menu__divider" />
          <Link
            href="/learn"
            className="mobile-menu__cta-secondary"
            onClick={() => setOpen(false)}
          >
            まず営業の型を学ぶ
          </Link>
          {isLoggedIn ? (
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
                href="/roleplay"
                className="nav-btn mobile-menu__cta"
                onClick={() => setOpen(false)}
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
    </>
  );
}
