import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PurchaseFlow } from "./purchase-flow";

export const metadata: Metadata = {
  title: "購入完了｜成約5ステップ完全攻略プログラム",
  robots: { index: false },
};

export default function ProgramSuccessPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f7f8ea" }}>
      <Header />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24 text-sm text-muted">
            読み込み中...
          </div>
        }
      >
        <PurchaseFlow />
      </Suspense>
      <Footer />
    </div>
  );
}
