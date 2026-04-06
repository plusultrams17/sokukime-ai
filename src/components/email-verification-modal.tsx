"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface EmailVerificationModalProps {
  open: boolean;
  email: string;
  onClose: () => void;
  onVerified: () => void;
}

export function EmailVerificationModal({
  open,
  email,
  onClose,
  onVerified,
}: EmailVerificationModalProps) {
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleResend() {
    setIsResending(true);
    setError("");
    setResent(false);

    const supabase = createClient();
    if (!supabase) {
      setError("サービスが一時的に利用できません");
      setIsResending(false);
      return;
    }

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (resendError) {
      setError("メールの再送信に失敗しました。しばらく経ってからお試しください。");
    } else {
      setResent(true);
    }
    setIsResending(false);
  }

  async function handleCheckVerification() {
    const supabase = createClient();
    if (!supabase) return;

    // Refresh session to check if email is now verified
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email_confirmed_at) {
      onVerified();
    } else {
      setError("まだメール認証が完了していません。メール内のリンクをクリックしてください。");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-card-border bg-card p-8 text-center">
        <div className="mb-4"><svg className="mx-auto h-12 w-12 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg></div>
        <h2 className="mb-2 text-xl font-bold">メール認証をお願いします</h2>
        <p className="mb-2 text-sm text-muted">
          ご利用ありがとうございます！引き続きご利用いただくには、
          <br />
          メールアドレスの認証が必要です。
        </p>

        <div className="my-6 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
          <div className="text-xs text-muted mb-1">送信先</div>
          <div className="text-sm font-medium text-foreground">{email}</div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {resent && (
          <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
            確認メールを再送信しました
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleCheckVerification}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
          >
            認証済み・続行する
          </button>

          <button
            onClick={handleResend}
            disabled={isResending}
            className="flex h-12 w-full items-center justify-center rounded-xl border border-card-border text-sm font-medium text-muted transition hover:text-foreground disabled:opacity-60"
          >
            {isResending ? "送信中..." : "確認メールを再送信する"}
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-card-border bg-card/50 p-4 text-left">
          <div className="text-xs font-medium text-muted mb-2">
            メールが届かない場合:
          </div>
          <ul className="space-y-1.5 text-xs text-muted">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">1.</span>
              <span>迷惑メール（スパム）フォルダを確認してください</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">2.</span>
              <span>「プロモーション」タブに振り分けられている場合があります</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">3.</span>
              <span>
                上の「再送信」ボタンをお試しください
              </span>
            </li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-xs text-muted hover:text-foreground"
        >
          後で認証する
        </button>
      </div>
    </div>
  );
}
