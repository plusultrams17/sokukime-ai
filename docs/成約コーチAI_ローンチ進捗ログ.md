# 成約コーチAI B2Cローンチ 進捗ログ

> ※本来の保存先 .company/sales/ が本セッションに未接続だったため、暫定的にここ(sokukime-ai/docs)に保存。
> 次回運用時は .company フォルダを接続するか、本ファイルを .company/sales/ へ移動してください。

## 2026-07-24 | Day0: レジ開通（ほぼ完了・最終検証のみmiki待ち）

### 完了
- Stripe商品作成（scripts/setup-stripe-products.mjs, LIVEモードで実行）
  - STRIPE_STARTER_PRICE_ID=price_1TwdNP1hLF22ViMUFKX1Ut41  # ライト¥2,980
  - STRIPE_PRO_PRICE_ID=price_1TwdNQ1hLF22ViMUt08fCOzq       # プロ¥6,980
  - STRIPE_PRO_ANNUAL_PRICE_ID=price_1TwdNQ1hLF22ViMUPqvfcoR5 # プロ年額¥69,800
  - STRIPE_MASTER_PRICE_ID=price_1TwdNR1hLF22ViMUyhyCnOCU    # 無制限¥14,800
- .env.local にSTRIPE_SECRET_KEY＋4 Price ID を記入
- Vercel環境変数(seiyaku-coach)：STARTER/MASTER 新規追加、PRO/PRO_ANNUAL を新IDへ更新
  （旧annual=price_1TJMpP1hLF22ViMUAD70618d は本番リニューアル前の値だったため差し替え）
- 本番Redeploy（Production / seiyaku-coach.vercel.app）→ Ready
- 導線検証：/pricing「ライトを申し込む」→ /login へ正常遷移（決済導線OK、ログイン必須は想定通り）

### miki待ち（決済を伴うため私は実行しない）
- 最終検証：ログイン→/pricing→「ライトを申し込む」で Stripeチェックアウトが「ライトプラン ¥2,980」で開くか（＝無償で価格ID配線を確認できる）
- 課金テスト（任意）：実カードで決済→プランがライトに変わるか(Webhook確認)→即解約。※現行に¥990プランは無し、最安はライト¥2,980
- STRIPE_SECRET_KEY が Vercel で "Needs Attention"（全シークレット共通の注意表示）。商品作成に使った本番キーと同一アカウントか要確認
- 実行キット(.company/sales/)未接続 → Day1以降(配信文面/広告/動画/判定数字)は接続後

### 次にやること
- 上記の無償検証 or 課金テストでDay0クローズ → 合格ならDay1（X需要検証ポスト 17:40 等）へ

## 2026-07-24 追記（同日・夕方）: ログイン不能の原因を解消
- 現象：/pricthe→ライト申込→Googleログインで「このページに到達できません(DNS_PROBE_FINISHED_NXDOMAIN)」
- 原因：Supabaseプロジェクト「成約コーチAI」が無料枠で一時停止(paused)→ auth用ドメイン ocvrgcsyyimgvsfvdgdy.supabase.co がDNS未解決になっていた
- 対処：mikiがSupabaseダッシュボードから「Resume/Restore（日本語UIでは"履歴書"と誤訳表示）」で再開 → STATUS Healthy（Database/Auth/Storage/Realtime/PostgREST/Edge Functions 全緑）。URL・データは不変のためVercel再設定は不要
- 確認：本番/loginの「Googleで続ける」がGoogleアカウント選択画面まで正常到達（NXDOMAIN解消を確認）

### Day0の最終残タスク（miki本人のみ実施可）
- ログイン→/pricing→「ライトを申し込む」→ Stripe決済ページが「ライトプラン ¥2,980」で開くか目視（無償・課金なし）
- ここまでOKで Day0=レジ開通 完全クリア。以降は将来の一時停止防止のためSupabase有料化(Pro)も検討余地あり
