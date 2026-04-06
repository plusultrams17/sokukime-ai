"use client";

import Link from "next/link";

export function InsightDashboardWidget() {
  return (
    <Link
      href="/insights"
      className="rounded-xl border border-card-border bg-card p-4 text-center transition hover:border-accent/30"
    >
      <div className="mb-1"><span className="inline-block h-3 w-3 rounded-full bg-accent" /></div>
      <div className="text-sm font-bold">インサイト</div>
      <div className="text-[11px] text-muted">業界最新情報</div>
    </Link>
  );
}
