"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CancelSaveModal } from "@/components/cancel-save-modal";

interface UserMenuProps {
  initialPlan?: "free" | "pro";
}

export function UserMenu({ initialPlan }: UserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [plan, setPlan] = useState<"free" | "pro">(initialPlan || "free");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || null);
      }
    });
    if (!initialPlan) {
      supabase
        .from("profiles")
        .select("plan")
        .single()
        .then(({ data }) => {
          if (data?.plan) setPlan(data.plan as "free" | "pro");
        });
    }
  }, [initialPlan]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/");
    router.refresh();
  }

  async function handleManageSubscription() {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // ignore
    }
  }

  if (!email) {
    return (
      <Link
        href="/login"
        className="rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted transition hover:border-accent/50 hover:text-foreground"
      >
        ログイン
      </Link>
    );
  }

  return (
    <>
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-card-border px-3 py-1.5 text-sm transition hover:border-accent/50"
      >
        <span className="max-w-[120px] truncate text-xs text-muted">
          {email}
        </span>
        {plan === "pro" && (
          <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent">
            Pro
          </span>
        )}
        <span className="text-muted text-xs">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-card-border bg-card p-2 shadow-xl animate-fade-in-up z-50">
          <div className="border-b border-card-border px-3 py-2 mb-1">
            <div className="text-xs text-muted truncate">{email}</div>
            <div className="mt-1 text-xs font-medium">
              {plan === "pro" ? (
                <span className="text-accent">Pro プラン</span>
              ) : (
                <span className="text-muted">無料プラン</span>
              )}
            </div>
          </div>

          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-card-border hover:text-foreground"
          >
            マイダッシュボード
          </Link>

          <Link
            href="/pricing"
            onClick={() => setOpen(false)}
            className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-card-border hover:text-foreground"
          >
            料金プラン
          </Link>

          <Link
            href="/referral"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-card-border hover:text-foreground"
          >
            友達を紹介
            <span className="rounded-full bg-green-500/10 px-1.5 py-0.5 text-[10px] font-bold text-green-500">
              ¥1,000 OFF
            </span>
          </Link>

          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-card-border hover:text-foreground"
          >
            設定
          </Link>

          <Link
            href="/changelog"
            onClick={() => setOpen(false)}
            className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-card-border hover:text-foreground"
          >
            更新情報
          </Link>

          {plan === "pro" && (
            <button
              onClick={() => {
                setOpen(false);
                setShowCancelModal(true);
              }}
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-card-border hover:text-foreground"
            >
              サブスクリプション管理
            </button>
          )}

          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-red-500 transition hover:bg-red-500/10"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
    <CancelSaveModal
      open={showCancelModal}
      onClose={() => setShowCancelModal(false)}
      onProceedToCancel={handleManageSubscription}
    />
    </>
  );
}
