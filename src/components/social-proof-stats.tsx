"use client";

import { useState, useEffect } from "react";

export function SocialProofStats() {
  const [stats, setStats] = useState<{ totalUsers: number; totalSessions: number } | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats || stats.totalUsers < 3) return null;

  return (
    <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-5 py-2.5 text-sm text-white/80 backdrop-blur-sm">
      <span className="font-bold text-accent">{stats.totalUsers.toLocaleString()}</span>
      <span>人が</span>
      <span className="font-bold text-accent">{stats.totalSessions.toLocaleString()}</span>
      <span>回の商談練習を実施</span>
    </div>
  );
}
