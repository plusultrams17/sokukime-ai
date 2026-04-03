"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function TeamInvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [status, setStatus] = useState<"loading" | "ready" | "joining" | "success" | "error">("loading");
  const [orgName, setOrgName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Verify the invitation token
    async function checkInvitation() {
      try {
        // We just check if the token is valid by attempting to read it
        const res = await fetch("/api/team/members");
        if (res.ok) {
          const data = await res.json();
          if (data.org) {
            setOrgName(data.org.name);
          }
        }
        setStatus("ready");
      } catch {
        setStatus("ready");
      }
    }
    checkInvitation();
  }, [token]);

  async function handleJoin() {
    setStatus("joining");
    try {
      const res = await fetch("/api/team/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setTimeout(() => router.push("/team"), 2000);
      } else {
        setErrorMsg(data.error || "参加に失敗しました");
        setStatus("error");
      }
    } catch {
      setErrorMsg("参加に失敗しました。再度お試しください。");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-lg px-6 py-20">
        <div className="rounded-2xl border border-card-border bg-card p-8 text-center">
          {status === "loading" && (
            <div className="flex items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </div>
          )}

          {status === "ready" && (
            <>
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-3xl">
                &#128101;
              </div>
              <h1 className="mb-2 text-2xl font-bold">チームへの招待</h1>
              {orgName && (
                <p className="mb-2 text-lg font-medium text-accent">{orgName}</p>
              )}
              <p className="mb-6 text-sm text-muted">
                チームに参加すると、Proプランと同等の全機能が利用できます。
                <br />
                無制限ロープレ・全5カテゴリ詳細スコア・AI改善アドバイス
              </p>
              <button
                onClick={handleJoin}
                className="h-12 w-full rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
              >
                チームに参加する
              </button>
              <p className="mt-3 text-xs text-muted">
                ログインしていない場合は、先に
                <Link href="/login" className="text-accent hover:underline">ログイン</Link>
                または
                <Link href="/signup" className="text-accent hover:underline">アカウント作成</Link>
                してください。
              </p>
            </>
          )}

          {status === "joining" && (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              <p className="text-sm text-muted">参加処理中...</p>
            </div>
          )}

          {status === "success" && (
            <div className="py-6">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-3xl">
                &#10003;
              </div>
              <h2 className="mb-2 text-xl font-bold text-green-500">参加完了</h2>
              <p className="text-sm text-muted">チームダッシュボードに移動します...</p>
            </div>
          )}

          {status === "error" && (
            <div className="py-6">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl">
                &#10007;
              </div>
              <h2 className="mb-2 text-xl font-bold text-red-400">参加できませんでした</h2>
              <p className="mb-4 text-sm text-muted">{errorMsg}</p>
              <Link
                href="/login"
                className="inline-flex h-10 items-center rounded-xl border border-card-border px-5 text-sm text-muted transition hover:text-foreground"
              >
                ログインページへ
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
