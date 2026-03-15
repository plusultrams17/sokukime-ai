"use client";

import { useCallback, useRef } from "react";
import type { EngagementEventType } from "@/lib/engagement";

/** クライアント側エンゲージメント追跡フック（デバウンス付き） */
export function useEngagement() {
  const pendingRef = useRef<Set<string>>(new Set());

  const trackEvent = useCallback(
    (eventType: EngagementEventType, metadata?: Record<string, unknown>) => {
      // 同一イベントの重複送信を防止（1秒以内）
      const key = `${eventType}_${JSON.stringify(metadata || {})}`;
      if (pendingRef.current.has(key)) return;
      pendingRef.current.add(key);
      setTimeout(() => pendingRef.current.delete(key), 1000);

      fetch("/api/engagement/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType, metadata }),
      }).catch(() => {
        // サイレントに失敗（ユーザー体験を妨げない）
      });
    },
    []
  );

  return { trackEvent };
}
