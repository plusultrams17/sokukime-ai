"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SignupRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // /signup へのアクセスは /login にリダイレクト（パラメータ引き継ぎ）
    const params = new URLSearchParams(searchParams.toString());
    router.replace(`/login${params.toString() ? `?${params.toString()}` : ""}`);
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-sm text-muted">リダイレクト中...</div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupRedirect />
    </Suspense>
  );
}
