# テスター招待コード

URLを渡すだけでPro機能をテスト利用できる仕組み。Stripeを経由しないので、クレジットカード不要でテスターに使ってもらえる。

## セットアップ手順

### 1. DBマイグレーション

Supabase Dashboard の **SQL Editor** で `supabase-tester-setup.sql` の内容を実行する。

これで以下が作成される:
- `profiles.is_tester`, `profiles.tester_expires_at`, `profiles.tester_code` カラム
- `tester_codes` テーブル + 4種類の初期コード
- `tester_redemptions` テーブル
- RLS ポリシー

### 2. 動作確認

ブラウザで `https://seiyaku-coach.vercel.app/activate?code=TESTER14` を開く。
ログインしていなければGoogleログインに誘導され、ログイン後に自動でPro有効化される。

## 配布用URL一覧

| 用途 | コード | 期間 | 使用上限 | URL |
|---|---|---|---|---|
| バグ・UXフィードバック | `TESTER14` | 14日 | 50回 | https://seiyaku-coach.vercel.app/activate?code=TESTER14 |
| 友人・知人向け中期 | `FRIEND90` | 90日 | 30回 | https://seiyaku-coach.vercel.app/activate?code=FRIEND90 |
| アンバサダー・関係者 | `VIP` | 無期限 | 20回 | https://seiyaku-coach.vercel.app/activate?code=VIP |
| 商談中の見込み客 | `DEMO7` | 7日 | 100回 | https://seiyaku-coach.vercel.app/activate?code=DEMO7 |

## 仕組み

1. **`/activate?code=XXX` にアクセス**
   - ログイン済み → コード検証 → 「Pro機能を有効化する」ボタン
   - 未ログイン → Googleログイン誘導 → ログイン後に同じURLに自動的に戻る
2. **ボタンを押すと**
   - `profiles.is_tester = TRUE`
   - `profiles.tester_expires_at = now() + duration_days`
   - `profiles.plan = 'pro'`、`subscription_status = 'active'`
   - `tester_redemptions` に履歴が記録される
3. **Pro判定ロジック** (`src/lib/usage.ts`, `src/lib/lessons/access.ts`)
   - `is_tester=TRUE` かつ `tester_expires_at` が `NULL` または未来 → 無制限Pro扱い
   - 期限が過ぎたら自動的にFree扱いに戻る（DB値は残るが判定で除外）
4. **同じユーザーが同じコードを2回使うことはできない** (UNIQUE制約 + 引き換え時にチェック)
5. **コード単位の使用回数上限** (`max_uses`) で総数制限可能

## 既存課金ユーザーとの違い

| | テスター | Pro課金ユーザー |
|---|---|---|
| `is_tester` | TRUE | FALSE (デフォルト) |
| `plan` | `'pro'` | `'pro'` |
| `subscription_status` | `'active'` | `'active'` |
| `stripe_subscription_id` | NULL | あり |
| `tester_expires_at` | あり (or NULL=無期限) | NULL |

→ KPI集計時は `is_tester = FALSE` でフィルタすればテスターを除外できる。

## コードの追加・無効化

新しいコードを追加する場合:

```sql
INSERT INTO tester_codes (code, description, duration_days, max_uses, active)
VALUES ('PARTNER180', 'パートナー企業向け', 180, 10, TRUE);
```

既存コードを無効化する場合:

```sql
UPDATE tester_codes SET active = FALSE WHERE code = 'TESTER14';
```

特定のテスターのアクセスを取り消す場合:

```sql
UPDATE profiles
SET is_tester = FALSE, tester_expires_at = NULL, tester_code = NULL,
    plan = 'free', subscription_status = 'none'
WHERE id = '<user_id>';
```

## API

### `GET /api/activate?code=XXX`
コードの有効性を検証する（認証不要）。

```json
{ "valid": true, "code": "TESTER14", "description": "...", "durationDays": 14 }
```

### `POST /api/activate`
コードを引き換える（要ログイン）。

```json
// Request
{ "code": "TESTER14" }

// Response
{
  "success": true,
  "code": "TESTER14",
  "expiresAt": "2026-04-24T00:00:00.000Z",
  "durationDays": 14
}
```
