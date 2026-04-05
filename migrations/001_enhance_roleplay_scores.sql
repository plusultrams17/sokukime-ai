-- =============================================
-- Migration: roleplay_scores テーブル作成 + 強化（冪等版）
-- 目的: 新規環境でも既存環境でも安全に動作する統合マイグレーション
-- Supabase SQL Editor で実行してください（何度実行しても安全）
-- =============================================

-- =============================================
-- 0. 依存関係チェック: profiles テーブルが存在するか
-- =============================================
-- profiles テーブルは roleplay_scores の外部キー先として必須
-- 存在しない場合は最小限の定義で作成する

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'none',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 1. roleplay_scores テーブル作成（存在しない場合のみ）
-- =============================================

CREATE TABLE IF NOT EXISTS public.roleplay_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  overall_score INT NOT NULL,
  category_scores JSONB NOT NULL DEFAULT '[]',
  summary TEXT,                           -- AI総評
  strengths JSONB DEFAULT '[]',           -- 良かった点のリスト
  improvements JSONB DEFAULT '[]',        -- 改善点のリスト
  difficulty TEXT,
  industry TEXT,
  scene TEXT,
  customer_type TEXT,                     -- 顧客タイプ（individual/owner/manager/staff）
  product TEXT,                           -- 商材名
  conversation_log JSONB,                 -- 会話ログ [{role, content}, ...]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. 既存テーブルへのカラム追加（冪等）
-- テーブルが既に存在し、新しいカラムだけ不足している場合に必要
-- =============================================

ALTER TABLE public.roleplay_scores
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS strengths JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS improvements JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS customer_type TEXT,
  ADD COLUMN IF NOT EXISTS product TEXT,
  ADD COLUMN IF NOT EXISTS conversation_log JSONB,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 既存レコードの updated_at を created_at で埋める
UPDATE public.roleplay_scores
  SET updated_at = created_at
  WHERE updated_at IS NULL;

-- =============================================
-- 3. updated_at 自動更新トリガー
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
-- 4. インデックス（分析クエリ最適化）
-- =============================================

-- ユーザー別 + 日付でのスコア取得用（メイン）
CREATE INDEX IF NOT EXISTS idx_scores_user_date
  ON public.roleplay_scores(user_id, created_at DESC);

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
-- 5. RLS 有効化 + ポリシー設定
-- =============================================

-- RLS を有効化（これが最も重要な修正 -- 現状セキュリティホール）
ALTER TABLE public.roleplay_scores ENABLE ROW LEVEL SECURITY;

-- 既存ポリシーを削除してから再作成（冪等性担保）
DROP POLICY IF EXISTS "Users can read own scores" ON public.roleplay_scores;
DROP POLICY IF EXISTS "Users can insert own scores" ON public.roleplay_scores;
DROP POLICY IF EXISTS "Users can update own scores" ON public.roleplay_scores;

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
-- 6. スコア統計用のヘルパー関数
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

-- =============================================
-- 完了確認
-- =============================================
-- 実行後、以下のクエリで確認できます:
-- SELECT COUNT(*) FROM public.roleplay_scores;
-- SELECT policyname FROM pg_policies WHERE tablename = 'roleplay_scores';
