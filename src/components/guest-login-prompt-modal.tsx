"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface GuestLoginPromptModalProps {
  open: boolean;
  onClose: () => void;
  /** ログイン後にリダイレクトするパス（既定: 現在の /roleplay） */
  redirectTo?: string;
}

/**
 * ゲストがロープレを送信した際に表示する Google ログイン誘導モーダル。
 * オレンジグラデーション + Google ログインボタン + 特典訴求のスタイル。
 */
export function GuestLoginPromptModal({
  open,
  onClose,
  redirectTo = "/roleplay",
}: GuestLoginPromptModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleGoogleLogin() {
    setError("");
    setIsLoading(true);

    const supabase = createClient();
    if (!supabase) {
      setError("サービスが一時的に利用できません");
      setIsLoading(false);
      return;
    }

    const callbackUrl = new URL("/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("redirect", redirectTo);

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });

    if (signInError) {
      setError("Googleログインに失敗しました。もう一度お試しください。");
      setIsLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guest-login-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl"
        style={{
          background:
            "linear-gradient(155deg, #ea580c 0%, #f97316 45%, #fb923c 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute right-10 bottom-20 h-20 w-20 rounded-full bg-white/5" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="閉じる"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/20 hover:text-white"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="relative px-7 pb-8 pt-10 text-center">
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>

          {/* Title */}
          <h2
            id="guest-login-title"
            className="mb-2 text-2xl font-extrabold text-white"
          >
            続けるにはログインが必要です
          </h2>
          <p className="mb-6 text-sm text-white/90">
            Googleで5秒ログインしてAIロープレを始めよう
          </p>

          {/* Reward box */}
          <div className="mb-6 rounded-2xl border-2 border-white/30 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3">
              <div
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-orange-700"
                style={{ background: "#fde047" }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 12 20 22 4 22 4 12" />
                  <rect x="2" y="7" width="20" height="5" />
                  <line x1="12" y1="22" x2="12" y2="7" />
                  <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
                  <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-extrabold text-white">
                  Googleログインで5回ロープレが使える
                </div>
                <div className="text-xs leading-relaxed text-white/85">
                  クレジットカード不要・完全無料
                  <br />
                  AI営業ロープレを体験
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-900/40 px-4 py-2.5 text-sm text-white">
              {error}
            </div>
          )}

          {/* Google login button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white text-base font-bold text-gray-800 shadow-lg transition hover:bg-gray-50 disabled:opacity-60"
          >
            {isLoading ? (
              "接続中..."
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Googleでログイン
              </>
            )}
          </button>

          {/* Trust badges */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-white/85">
            <span className="flex items-center gap-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              安全・安心
            </span>
            <span className="flex items-center gap-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              10秒で完了
            </span>
            <span className="flex items-center gap-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              無料でお試し
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
