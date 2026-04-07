export interface Benchmark {
  overall: number;
  categories: Record<string, number>;
}

const BENCHMARKS: Record<string, Benchmark> = {
  "保険": { overall: 58, categories: { "アプローチ": 62, "ヒアリング": 55, "プレゼン": 60, "クロージング": 52, "反論処理": 48 } },
  "不動産": { overall: 55, categories: { "アプローチ": 58, "ヒアリング": 52, "プレゼン": 56, "クロージング": 50, "反論処理": 45 } },
  "リフォーム": { overall: 52, categories: { "アプローチ": 56, "ヒアリング": 50, "プレゼン": 54, "クロージング": 48, "反論処理": 42 } },
  "SaaS": { overall: 60, categories: { "アプローチ": 58, "ヒアリング": 65, "プレゼン": 62, "クロージング": 55, "反論処理": 50 } },
  "法人": { overall: 57, categories: { "アプローチ": 55, "ヒアリング": 60, "プレゼン": 58, "クロージング": 52, "反論処理": 48 } },
};

const DEFAULT_BENCHMARK: Benchmark = {
  overall: 56,
  categories: { "アプローチ": 58, "ヒアリング": 55, "プレゼン": 57, "クロージング": 51, "反論処理": 46 },
};

const TOP_BENCHMARK: Benchmark = {
  overall: 85,
  categories: { "アプローチ": 88, "ヒアリング": 82, "プレゼン": 86, "クロージング": 84, "反論処理": 80 },
};

/** 業種名から部分一致でベンチマークを取得 */
export function getBenchmark(industry: string): { avg: Benchmark; top: Benchmark; label: string } {
  const normalized = industry.toLowerCase();
  for (const [key, bm] of Object.entries(BENCHMARKS)) {
    if (normalized.includes(key.toLowerCase())) {
      return { avg: bm, top: TOP_BENCHMARK, label: key + "営業" };
    }
  }
  return { avg: DEFAULT_BENCHMARK, top: TOP_BENCHMARK, label: "営業全体" };
}
