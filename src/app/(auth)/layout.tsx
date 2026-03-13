import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <span className="text-3xl">🔥</span>
            <h1 className="mt-2 text-2xl font-bold">即キメAI</h1>
          </Link>
          <p className="mt-2 text-sm text-muted">
            AI即決営業ロープレコーチ
          </p>
          <p className="mt-3 text-xs text-muted">
            <span className="text-accent font-medium">500+</span> 人の営業マンが利用中
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
