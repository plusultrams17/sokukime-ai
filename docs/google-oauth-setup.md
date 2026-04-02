# Google OAuth + Supabase 設定ガイド

## 1. Google Cloud Console での OAuth 設定

### 1.1 プロジェクト作成
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 左上の「プロジェクトを選択」→「新しいプロジェクト」
3. プロジェクト名: `sokukime-ai` → 作成

### 1.2 OAuth 同意画面の設定
1. 左メニュー「APIとサービス」→「OAuth 同意画面」
2. User Type: **外部** を選択 → 作成
3. 必須項目を入力:
   - **アプリ名**: `成約コーチ AI`
   - **ユーザーサポートメール**: あなたのメールアドレス
   - **承認済みドメイン**: 以下を追加
     - `sokukime-ai.vercel.app`
     - `supabase.co` (Supabase のドメイン)
   - **デベロッパー連絡先メール**: あなたのメールアドレス
4. スコープ: `email`, `profile`, `openid` を追加
5. テストユーザー: 開発中は自分のGmailを追加
6. 保存

### 1.3 OAuth クライアント ID の作成
1. 左メニュー「APIとサービス」→「認証情報」
2. 「+ 認証情報を作成」→「OAuth クライアント ID」
3. アプリケーションの種類: **ウェブ アプリケーション**
4. 名前: `成約コーチ AI Web`
5. **承認済みの JavaScript 生成元**:
   ```
   https://sokukime-ai.vercel.app
   http://localhost:3000
   ```
6. **承認済みのリダイレクト URI**:
   ```
   https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback
   ```
   ※ `<YOUR_SUPABASE_PROJECT_REF>` は Supabase のプロジェクト設定 > API から確認
7. 作成 → **クライアント ID** と **クライアント シークレット** をメモ

### 1.4 本番公開（重要）
1. OAuth 同意画面 → 「公開ステータス」
2. 「アプリを公開」をクリック
3. ※ テスト状態では Google アカウントが限定されるため、本番前に必ず公開する

---

## 2. Supabase での Google OAuth プロバイダ設定

### 2.1 Google プロバイダを有効化
1. [Supabase ダッシュボード](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. 左メニュー「Authentication」→「Providers」
4. **Google** を探してクリック
5. **Enable Google provider** をオンにする
6. 以下を入力:
   - **Client ID**: Google Cloud Console でメモしたクライアント ID
   - **Client Secret**: Google Cloud Console でメモしたクライアント シークレット
7. **Save**

### 2.2 メール認証の遅延化設定（推奨）
1. 左メニュー「Authentication」→「Settings」→「Email」
2. **Confirm email**: オフにする
   - これにより、メール登録ユーザーが即座にログインできるようになります
   - アプリ側で3回利用後にメール認証を要求するロジックを実装済み
3. **Double confirm email changes**: 必要に応じてオンのまま
4. **Save**

### 2.3 リダイレクト URL の設定
1. 左メニュー「Authentication」→「URL Configuration」
2. **Site URL**: `https://sokukime-ai.vercel.app`
3. **Redirect URLs** に以下を追加:
   ```
   https://sokukime-ai.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```
4. **Save**

---

## 3. 環境変数の確認

`.env.local` に以下が設定されていることを確認:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<YOUR_PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_ANON_KEY>
```

※ Google OAuth の Client ID/Secret は Supabase 側で管理するため、
アプリの `.env.local` への追加は不要です。

---

## 4. 動作確認チェックリスト

- [ ] `/signup` で「Googleで始める（推奨）」ボタンが表示される
- [ ] ボタンクリック → Google アカウント選択画面に遷移する
- [ ] Google 認証後 → `/auth/callback` → `/roleplay?welcome=true` にリダイレクト
- [ ] オンボーディングモーダルが表示される（業種選択 → シーン選択）
- [ ] `/login` でも Google ログインが機能する
- [ ] メール登録 → 即座にログイン → 3回利用後にメール認証要求
