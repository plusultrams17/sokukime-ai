"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface KPISummary {
  mau: number;
  mrr: number;
  cvr: number;
  churnRate: number;
  npsScore: number;
  ltv: number;
  freeUsers: number;
  proUsers: number;
  newSignups: number;
  churnedUsers: number;
}

interface MonthlySnapshot {
  month: string;
  mrr: number;
  mau: number;
  cvr: number;
  churnRate: number;
  proUsers: number;
}

interface FunnelStep {
  step: string;
  label: string;
  count: number;
  rate: number;
}

interface CohortRow {
  month: string;
  userCount: number;
  retention: number[];
}

function DeltaIndicator({
  current,
  previous,
  inverse,
  suffix = "",
}: {
  current: number;
  previous: number | undefined;
  inverse?: boolean;
  suffix?: string;
}) {
  if (previous === undefined || previous === null) return null;
  const diff = current - previous;
  if (diff === 0) return <span className="text-xs text-gray-500">-- 前月比</span>;
  const isPositive = diff > 0;
  const isGood = inverse ? !isPositive : isPositive;
  return (
    <span className={`text-xs font-medium ${isGood ? "text-green-500" : "text-red-500"}`}>
      {isPositive ? "+" : ""}
      {suffix === "%" ? diff.toFixed(2) : diff.toLocaleString()}
      {suffix} 前月比
    </span>
  );
}

function KPICard({
  label,
  value,
  sub,
  current,
  previous,
  inverse,
  suffix,
}: {
  label: string;
  value: string;
  sub?: string;
  current: number;
  previous: number | undefined;
  inverse?: boolean;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      {sub && <div className="text-[11px] text-gray-500 mb-1">{sub}</div>}
      <DeltaIndicator
        current={current}
        previous={previous}
        inverse={inverse}
        suffix={suffix}
      />
    </div>
  );
}

function MRRChart({ data }: { data: MonthlySnapshot[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 py-12">
        月次スナップショットデータがありません
      </div>
    );
  }

  const maxMRR = Math.max(...data.map((d) => d.mrr), 1);

  return (
    <div className="flex items-end gap-1.5 h-48">
      {data.map((d) => {
        const height = (d.mrr / maxMRR) * 100;
        const label = d.month.slice(5, 7) + "月";
        return (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-gray-400">
              {d.mrr > 0 ? `¥${(d.mrr / 1000).toFixed(0)}k` : ""}
            </span>
            <div
              className="w-full rounded-t bg-orange-500 transition-all duration-500 min-h-[2px]"
              style={{ height: `${Math.max(height, 1)}%` }}
            />
            <span className="text-[10px] text-gray-500">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function FunnelChart({ data }: { data: FunnelStep[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 py-12">
        ファネルデータがありません
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((step, i) => {
        const width = (step.count / maxCount) * 100;
        const dropOff =
          i > 0 && data[i - 1].count > 0
            ? Math.round(
                ((data[i - 1].count - step.count) / data[i - 1].count) * 100
              )
            : 0;

        return (
          <div key={step.step}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-300">{step.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">
                  {step.count.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">{step.rate}%</span>
                {dropOff > 0 && (
                  <span className="text-xs text-red-500">-{dropOff}%</span>
                )}
              </div>
            </div>
            <div className="h-6 rounded bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
                style={{ width: `${Math.max(width, 1)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CohortTable({ data }: { data: CohortRow[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 py-12">
        コホートデータがありません
      </div>
    );
  }

  const maxMonths = Math.max(...data.map((d) => d.retention.length));

  function cellColor(pct: number): string {
    if (pct >= 80) return "bg-green-600/40 text-green-300";
    if (pct >= 60) return "bg-green-600/25 text-green-400";
    if (pct >= 40) return "bg-yellow-600/25 text-yellow-400";
    if (pct >= 20) return "bg-orange-600/25 text-orange-400";
    return "bg-red-600/20 text-red-400";
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500">
            <th className="text-left py-2 px-2 font-medium">コホート</th>
            <th className="text-center py-2 px-2 font-medium">人数</th>
            {Array.from({ length: maxMonths }, (_, i) => (
              <th key={i} className="text-center py-2 px-2 font-medium">
                M{i}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month} className="border-t border-gray-800">
              <td className="py-2 px-2 text-gray-300 font-medium whitespace-nowrap">
                {row.month}
              </td>
              <td className="py-2 px-2 text-center text-gray-400">
                {row.userCount}
              </td>
              {Array.from({ length: maxMonths }, (_, i) => {
                const pct = row.retention[i];
                if (pct === undefined) {
                  return (
                    <td key={i} className="py-2 px-2 text-center text-gray-700">
                      -
                    </td>
                  );
                }
                return (
                  <td
                    key={i}
                    className={`py-2 px-2 text-center font-medium rounded ${cellColor(pct)}`}
                  >
                    {pct}%
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function KPIDashboard() {
  const [kpiData, setKpiData] = useState<{
    current: KPISummary;
    previous: KPISummary | null;
    history: MonthlySnapshot[];
  } | null>(null);
  const [funnel, setFunnel] = useState<FunnelStep[]>([]);
  const [cohorts, setCohorts] = useState<CohortRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);

  const loadData = useCallback(async (s: string) => {
    try {
      setLoading(true);
      setError("");

      const [kpiRes, funnelRes, cohortRes] = await Promise.all([
        fetch(`/api/admin/kpi?secret=${encodeURIComponent(s)}`),
        fetch(`/api/admin/funnel?secret=${encodeURIComponent(s)}`),
        fetch(`/api/admin/cohort?secret=${encodeURIComponent(s)}`),
      ]);

      if (kpiRes.status === 401) {
        setError("認証エラー: ADMIN_SECRETが正しくありません");
        setAuthed(false);
        return;
      }

      if (!kpiRes.ok || !funnelRes.ok || !cohortRes.ok) {
        throw new Error("Failed to load data");
      }

      const [kpiJson, funnelJson, cohortJson] = await Promise.all([
        kpiRes.json(),
        funnelRes.json(),
        cohortRes.json(),
      ]);

      setKpiData(kpiJson);
      setFunnel(funnelJson.funnel);
      setCohorts(cohortJson.cohorts);
      setAuthed(true);
    } catch {
      setError("データの読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setSecret(hash);
      loadData(hash);
    }
  }, [loadData]);

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="w-full max-w-sm p-6">
          <h1 className="mb-6 text-xl font-bold text-center text-white">
            KPI Analytics
          </h1>
          {error && (
            <p className="mb-4 text-sm text-red-500 text-center">{error}</p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loadData(secret);
            }}
          >
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="ADMIN_SECRET"
              className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
            />
            <button
              type="submit"
              className="mt-3 w-full rounded-lg bg-orange-500 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              ログイン
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="text-sm text-gray-500 animate-pulse">読み込み中...</div>
      </div>
    );
  }

  if (!kpiData) return null;

  const { current, previous, history } = kpiData;

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Admin
            </Link>
            <span className="text-gray-700">/</span>
            <span className="text-lg font-bold text-white">KPI Analytics</span>
          </div>
          <button
            onClick={() => loadData(secret)}
            className="rounded-lg bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-500 transition hover:bg-orange-500/20"
          >
            更新
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* KPI Cards */}
        <h2 className="mb-4 text-sm font-bold text-orange-500 uppercase tracking-wider">
          Core KPIs
        </h2>
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
          <KPICard
            label="MAU (月間アクティブ)"
            value={current.mau.toLocaleString()}
            sub="過去30日のユニークユーザー"
            current={current.mau}
            previous={previous?.mau}
          />
          <KPICard
            label="MRR (月間定期収益)"
            value={`¥${current.mrr.toLocaleString()}`}
            sub={`Pro ${current.proUsers}人 x ¥2,980`}
            current={current.mrr}
            previous={previous?.mrr}
          />
          <KPICard
            label="CVR (転換率)"
            value={`${current.cvr}%`}
            sub="今月 Free → Pro"
            current={current.cvr}
            previous={previous?.cvr}
            suffix="%"
          />
          <KPICard
            label="Churn Rate (解約率)"
            value={`${current.churnRate}%`}
            sub="今月の有料解約率"
            current={current.churnRate}
            previous={previous?.churnRate}
            inverse
            suffix="%"
          />
          <KPICard
            label="NPS"
            value={`${current.npsScore}`}
            sub="推奨者% - 批判者%"
            current={current.npsScore}
            previous={previous?.npsScore}
          />
          <KPICard
            label="LTV (顧客生涯価値)"
            value={current.ltv > 0 ? `¥${current.ltv.toLocaleString()}` : "N/A"}
            sub="ARPU / 月次解約率"
            current={current.ltv}
            previous={previous?.ltv}
          />
        </div>

        {/* User Breakdown */}
        <h2 className="mb-4 text-sm font-bold text-orange-500 uppercase tracking-wider">
          User Breakdown
        </h2>
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KPICard
            label="Free ユーザー"
            value={current.freeUsers.toLocaleString()}
            current={current.freeUsers}
            previous={previous?.freeUsers}
          />
          <KPICard
            label="Pro ユーザー"
            value={current.proUsers.toLocaleString()}
            current={current.proUsers}
            previous={previous?.proUsers}
          />
          <KPICard
            label="新規登録 (今月)"
            value={current.newSignups.toLocaleString()}
            current={current.newSignups}
            previous={previous?.newSignups}
          />
          <KPICard
            label="解約 (今月)"
            value={current.churnedUsers.toLocaleString()}
            current={current.churnedUsers}
            previous={previous?.churnedUsers}
            inverse
          />
        </div>

        {/* MRR Trend Chart */}
        <h2 className="mb-4 text-sm font-bold text-orange-500 uppercase tracking-wider">
          MRR Trend (過去12ヶ月)
        </h2>
        <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-5">
          <MRRChart data={history} />
        </div>

        {/* Conversion Funnel */}
        <h2 className="mb-4 text-sm font-bold text-orange-500 uppercase tracking-wider">
          Conversion Funnel (過去30日)
        </h2>
        <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-5">
          <FunnelChart data={funnel} />
        </div>

        {/* Cohort Retention */}
        <h2 className="mb-4 text-sm font-bold text-orange-500 uppercase tracking-wider">
          Cohort Retention
        </h2>
        <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-5">
          <CohortTable data={cohorts} />
        </div>
      </div>
    </div>
  );
}
