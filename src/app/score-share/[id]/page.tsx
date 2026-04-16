import Link from "next/link";
import { Header } from "@/components/header";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import { getGradeInfo, getGrade } from "@/lib/grade";

interface ScoreData {
  id: string;
  overall_score: number;
  category_scores: { name: string; score: number }[];
  difficulty: string | null;
  industry: string | null;
  created_at: string;
}

async function getScore(id: string): Promise<ScoreData | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) return null;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data } = await supabase
    .from("roleplay_scores")
    .select("id, overall_score, category_scores, difficulty, industry, created_at")
    .eq("id", id)
    .single();

  return data;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const score = await getScore(id);

  if (!score) {
    return { title: "スコアが見つかりません | 成約コーチAI" };
  }

  const gradeInfo = getGradeInfo(score.overall_score);
  const title = `営業スコア ${score.overall_score}点（${gradeInfo.grade}ランク: ${gradeInfo.label}）| 成約コーチAI`;
  const description = `30項目の行動チェックリストでAI採点。営業スコア${score.overall_score}点（${gradeInfo.grade}ランク）を獲得！あなたも無料で営業力を診断してみませんか？`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${appUrl}/score-share/${id}`,
      siteName: "成約コーチAI",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ScoreSharePage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const score = await getScore(id);

  if (!score) {
    notFound();
  }

  const gi = getGradeInfo(score.overall_score);
  const categories = (score.category_scores || []) as { name: string; score: number }[];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-lg px-6 py-12">
        {/* Score Hero */}
        <div className="mb-8 rounded-2xl border border-card-border bg-card p-5 text-center sm:p-8">
          <div className="mb-2 text-sm text-muted">営業ロープレ AIスコア</div>
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <span className={`text-5xl font-black sm:text-7xl ${gi.color}`}>
              {score.overall_score}
            </span>
            <span className="text-2xl font-black text-muted/30 sm:text-4xl">/ 100</span>
          </div>
          <div className={`mt-2 text-xl font-bold sm:text-2xl ${gi.color}`}>
            {gi.grade}ランク: {gi.label}
          </div>
          {score.industry && (
            <div className="mt-3 text-xs text-muted">
              業種: {score.industry}
              {score.difficulty && <> ・ 難易度: {score.difficulty}</>}
            </div>
          )}
          <div className="mt-3 text-[11px] text-muted/60">
            30項目の行動チェックリストに基づくAI採点
          </div>
        </div>

        {/* Category Scores */}
        {categories.length > 0 && (
          <div className="mb-8 rounded-2xl border border-card-border bg-card p-6">
            <h3 className="mb-4 text-sm font-medium text-muted">5ステップ分析</h3>
            <div className="space-y-3">
              {categories.map((cat) => {
                const cgi = getGradeInfo(cat.score);
                return (
                <div key={cat.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex h-5 items-center rounded px-1.5 text-[10px] font-black ${cgi.color}`}
                        style={{ backgroundColor: `${cgi.hex}15` }}>
                        {cgi.grade}
                      </span>
                      <span className={`text-sm font-bold ${cgi.color}`}>
                        {cat.score}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-card-border">
                    <div
                      className={`h-full rounded-full ${cgi.barClass}`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
          <h2 className="mb-2 text-lg font-bold">あなたの営業力は何点？</h2>
          <p className="mb-6 text-sm text-muted">
            AIが営業トークを5カテゴリで即座に採点。<br />
            無料・登録10秒・クレジットカード不要
          </p>
          <Link
            href="/roleplay"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover"
          >
            無料で営業力を診断する
          </Link>
          <p className="mt-3 text-[11px] text-muted">
            Googleログインで累計5回まで無料 ・ 有料プランなら月30回以上
          </p>
        </div>
      </div>
    </div>
  );
}
