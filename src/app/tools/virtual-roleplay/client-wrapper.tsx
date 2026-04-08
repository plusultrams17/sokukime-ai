"use client";

import dynamic from "next/dynamic";

const VirtualScene = dynamic(() => import("./virtual-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1729]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-sm text-white/60">3D空間を読み込み中...</p>
      </div>
    </div>
  ),
});

export function VirtualRoleplayClient() {
  return <VirtualScene />;
}
