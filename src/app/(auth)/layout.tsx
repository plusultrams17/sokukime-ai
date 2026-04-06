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
            <span className="inline-block h-4 w-4 rounded-full bg-accent" />
            <h1 className="mt-2 text-2xl font-bold">成約コーチ AI</h1>
          </Link>
          <p className="mt-2 text-sm text-muted">
            AI営業ロープレコーチ
          </p>
          <p className="mt-3 text-xs text-muted">
            登録不要・無料ですぐ試せる
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
