-- =============================================
-- Migration: roleplay_scores テーブル強化
-- 目的: RLS有効化 + 不足カラム追加 + ポリシー設定
-- Supabase SQL Editor で実行してください
-- =============================================

-- =============================================
-- 1. 不足カラムの追加
-- =============================================

-- AI が返す総評・強み・改善点を保存（ダッシュボード詳細表示・振り返り用）
ALTER TABLE public.roleplay_scores
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS strengths JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS improvements JSONB DEFAULT '[]';

-- ロールプレイのシナリオ条件を完全に保存（分析・フィルタリング用）
ALTER TABLE public.roleplay_scores
  ADD COLUMN IF NOT EXISTS customer_type TEXT,
  ADD COLUMN IF NOT EXISTS product TEXT;

-- 会話ログ保存（スコア詳細画面での会話再生・レビュー用）
-- JSONB配列: [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]
ALTER TABLE public.roleplay_scores
  ADD COLUMN IF NOT EXISTS conversation_log JSONB;

-- updated_at タイムスタンプ（プロジェクト規約準拠）
ALTER TABLE public.roleplay_scores
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 既存レコードの updated_at を created_at で埋める
UPDATE public.roleplay_scores
  SET updated_at = created_at
  WHERE updated_at IS NULL;

-- =============================================
-- 2. updated_at 自動更新トリガー
-- =============================================

-- 汎用の updated_at トリガー関数（他テーブルでも再利用可能）
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- roleplay_scores 用トリガー（冪等性のため DROP IF EXISTS + CREATE）
DROP TRIGGER IF EXISTS set_roleplay_scores_updated_at ON public.roleplay_scores;
CREATE TRIGGER set_roleplay_scores_updated_at
  BEFORE UPDATE ON public.roleplay_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 3. 追加インデックス（分析クエリ最適化）
-- =============================================

-- 業種別のスコア分析用
CREATE INDEX IF NOT EXISTS idx_scores_industry
  ON public.roleplay_scores(industry)
  WHERE industry IS NOT NULL;

-- 難易度別のスコア分析用
CREATE INDEX IF NOT EXISTS idx_scores_difficulty
  ON public.roleplay_scores(difficulty)
  WHERE difficulty IS NOT NULL;

-- ユーザー別 + 業種でのフィルタリング用（複合インデックス）
CREATE INDEX IF NOT EXISTS idx_scores_user_industry
  ON public.roleplay_scores(user_id, industry, created_at DESC);

-- =============================================
-- 4. RLS 有効化 + ポリシー設定
-- =============================================

-- RLS を有効化（これが最も重要な修正 -- 現状セキュリティホール）
ALTER TABLE public.roleplay_scores ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のスコア履歴のみ読み取り可能
CREATE POLICY "Users can read own scores"
  ON public.roleplay_scores
  FOR SELECT
  USING (auth.uid() = user_id);

-- ユーザーは自分のスコアのみ挿入可能
CREATE POLICY "Users can insert own scores"
  ON public.roleplay_scores
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のスコアのみ更新可能（将来のメモ追加等に備えて）
CREATE POLICY "Users can update own scores"
  ON public.roleplay_scores
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 注意: DELETE ポリシーは意図的に作成しない（スコア履歴の削除を防止）
-- 注意: シェアリンク（/api/score/[id]）は service role key でアクセスするため
--        RLS をバイパスする。公開読み取りポリシーは不要。

-- =============================================
-- 5. スコア統計用のヘルパー関数
-- =============================================

-- ユーザーの直近N件のスコア平均を取得
CREATE OR REPLACE FUNCTION public.get_user_avg_score(
  target_user_id UUID,
  last_n INTEGER DEFAULT 10
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avg_val NUMERIC;
BEGIN
  SELECT AVG(overall_score) INTO avg_val
  FROM (
    SELECT overall_score
    FROM public.roleplay_scores
    WHERE user_id = target_user_id
    ORDER BY created_at DESC
    LIMIT last_n
  ) AS recent;
  RETURN COALESCE(avg_val, 0);
END;
$$;

-- ユーザーのカテゴリ別平均スコアを取得（弱点分析用）
CREATE OR REPLACE FUNCTION public.get_user_category_averages(
  target_user_id UUID,
  last_n INTEGER DEFAULT 10
)
RETURNS TABLE(category_name TEXT, avg_score NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cat->>'name' AS category_name,
    ROUND(AVG((cat->>'score')::NUMERIC), 1) AS avg_score
  FROM (
    SELECT category_scores
    FROM public.roleplay_scores
    WHERE user_id = target_user_id
    ORDER BY created_at DESC
    LIMIT last_n
  ) AS recent,
  LATERAL jsonb_array_elements(recent.category_scores) AS cat
  GROUP BY cat->>'name'
  ORDER BY avg_score ASC;
END;
$$;
