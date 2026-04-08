"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const FullscreenScene = dynamic(() => import("./fullscreen-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-dvh items-center justify-center bg-[#0a0e1a]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-sm text-white/60">3D空間を読み込み中...</p>
      </div>
    </div>
  ),
});

function SceneWithParams() {
  const params = useSearchParams();
  const scenarioId = params.get("scenario") ?? undefined;
  return <FullscreenScene scenarioId={scenarioId} />;
}

export function VirtualRoleplayClient() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center bg-[#0a0e1a]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="text-sm text-white/60">読み込み中...</p>
          </div>
        </div>
      }
    >
      <SceneWithParams />
    </Suspense>
  );
}
