import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | 成約コーチAI",
  description:
    "成約コーチAIのプライバシーポリシーです。個人情報の取り扱いについてご確認ください。",
};

export default function PrivacyPage() {
  return (
    <article className="prose-custom">
      <h1 className="mb-8 text-3xl font-bold">プライバシーポリシー</h1>
      <p className="mb-6 text-sm text-muted">最終更新日: 2026年4月14日</p>

      <p className="mb-6 text-sm leading-relaxed text-muted">
        成約コーチAI（以下「当サービス」）は、ユーザーの個人情報の保護を重要視しています。
        本プライバシーポリシーは、当サービスにおける個人情報の収集、利用、管理について定めるものです。
        当サービスは、個人情報の保護に関する法律（個人情報保護法）を遵守します。
      </p>

      <Section title="1. 収集する情報">
        <h3 className="font-semibold text-foreground mb-2">
          (1) ユーザーが直接提供する情報
        </h3>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Googleアカウント情報（メールアドレス、表示名、プロフィール画像 — Google OAuth認証経由）</li>
          <li>ロープレ中の入力テキスト（営業練習内容）</li>
        </ul>

        <h3 className="font-semibold text-foreground mb-2">
          (2) 自動的に収集される情報
        </h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>利用日時・頻度</li>
          <li>ロープレのスコア・採点結果</li>
          <li>
            デバイス情報（ブラウザ種類、OS、画面解像度）
          </li>
          <li>IPアドレス</li>
          <li>
            Cookie情報（セッション管理、ログイン状態の維持）
          </li>
        </ul>
      </Section>

      <Section title="2. 情報の利用目的">
        <p>収集した情報は以下の目的で利用します。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>アカウントの作成・認証・管理</li>
          <li>AIロープレ・コーチング・スコアリング機能の提供</li>
          <li>利用状況の把握（無料プランの累計利用上限管理等）</li>
          <li>サブスクリプションの決済処理</li>
          <li>サービスの改善・新機能の開発</li>
          <li>お問い合わせへの対応</li>
          <li>重要なお知らせの送信（規約変更等）</li>
        </ul>
      </Section>

      <Section title="3. 第三者サービスとの情報共有">
        <p>
          当サービスは、以下の第三者サービスと連携しており、これらのサービスに対して必要最小限の情報を提供します。
        </p>
        <div className="mt-4 space-y-4">
          <ThirdParty
            name="Supabase"
            purpose="ユーザー認証・データベース管理"
            data="メールアドレス、パスワード（暗号化）、利用データ"
            url="https://supabase.com/privacy"
          />
          <ThirdParty
            name="Stripe"
            purpose="決済処理・サブスクリプション管理"
            data="メールアドレス、決済情報（カード情報はStripeが直接管理）"
            url="https://stripe.com/jp/privacy"
          />
          <ThirdParty
            name="OpenAI"
            purpose="AIロープレ（会話生成）・リアルタイムコーチング"
            data="ロープレ中の会話テキスト（匿名化された状態で送信）"
            url="https://openai.com/policies/privacy-policy"
          />
          <ThirdParty
            name="Anthropic"
            purpose="AIスコアリング・インサイト分析・ワークシート生成"
            data="ロープレ中の会話テキスト（匿名化された状態で送信）"
            url="https://www.anthropic.com/privacy"
          />
          <ThirdParty
            name="Google Analytics"
            purpose="アクセス解析・サービス改善"
            data="ページ閲覧情報、デバイス情報、IPアドレス（匿名化）"
            url="https://policies.google.com/privacy"
          />
        </div>
      </Section>

      <Section title="4. データの保存期間">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            アカウント情報: アカウント削除後30日以内に削除
          </li>
          <li>
            ロープレ会話データ: セッション終了後、サーバーに保存しません（リアルタイム処理のみ）
          </li>
          <li>利用履歴・スコアデータ: アカウント存続期間中保存</li>
          <li>決済情報: Stripeの規定に従い保存</li>
        </ul>
      </Section>

      <Section title="5. Cookieの使用">
        <p>当サービスでは以下の目的でCookieを使用します。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <span className="font-medium text-foreground">
              必須Cookie:
            </span>{" "}
            ログイン状態の維持、セッション管理
          </li>
          <li>
            <span className="font-medium text-foreground">
              分析Cookie:
            </span>{" "}
            Google Analytics によるアクセス解析（匿名化）
          </li>
        </ul>
        <p className="mt-2">
          ブラウザの設定でCookieを無効にすることが可能ですが、一部の機能（ログイン等）が利用できなくなる場合があります。
        </p>
      </Section>

      <Section title="6. ユーザーの権利">
        <p>ユーザーは以下の権利を有します。</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <span className="font-medium text-foreground">
              アクセス権:
            </span>{" "}
            自己の個人情報の開示を請求する権利
          </li>
          <li>
            <span className="font-medium text-foreground">
              訂正権:
            </span>{" "}
            不正確な個人情報の訂正を請求する権利
          </li>
          <li>
            <span className="font-medium text-foreground">
              削除権:
            </span>{" "}
            アカウントの削除とともに個人情報の削除を請求する権利
          </li>
          <li>
            <span className="font-medium text-foreground">
              利用停止権:
            </span>{" "}
            個人情報の利用停止を請求する権利
          </li>
        </ul>
        <p className="mt-2">
          上記の権利を行使する場合は、下記のお問い合わせ先までご連絡ください。
        </p>
      </Section>

      <Section title="7. セキュリティ対策">
        <ul className="list-disc pl-6 space-y-1">
          <li>SSL/TLS暗号化通信</li>
          <li>Google OAuth認証による安全なログイン</li>
          <li>アクセス制御（認証・認可）</li>
          <li>
            決済情報のPCI DSS準拠（Stripe社が管理）
          </li>
        </ul>
      </Section>

      <Section title="8. 未成年者のプライバシー">
        <p>
          当サービスは18歳未満の方を対象としていません。18歳未満の方のアカウント登録はご遠慮ください。
          万が一、18歳未満の方の個人情報を収集していることが判明した場合、速やかに削除いたします。
        </p>
      </Section>

      <Section title="9. ポリシーの変更">
        <p>
          運営者は、必要に応じて本ポリシーを変更することがあります。重要な変更がある場合は、
          当サービス上での告知または登録メールアドレスへの通知を行います。
          変更後のポリシーは、当サービス上に掲載した時点から効力を生じます。
        </p>
      </Section>

      <Section title="10. お問い合わせ">
        <p>
          個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください。
        </p>
      </Section>

      <div className="mt-12 rounded-xl border border-card-border bg-card p-6 text-sm text-muted">
        <p>成約コーチAI 個人情報保護担当</p>
        <p>メール: seiyaku.coach.ai@gmail.com</p>
      </div>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      <div className="text-sm leading-relaxed text-muted space-y-3">
        {children}
      </div>
    </section>
  );
}

function ThirdParty({
  name,
  purpose,
  data,
  url,
}: {
  name: string;
  purpose: string;
  data: string;
  url: string;
}) {
  return (
    <div className="rounded-lg border border-card-border bg-card p-4">
      <div className="font-medium text-foreground mb-1">{name}</div>
      <div className="space-y-1">
        <div>
          <span className="text-muted">目的:</span> {purpose}
        </div>
        <div>
          <span className="text-muted">共有データ:</span> {data}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          プライバシーポリシー →
        </a>
      </div>
    </div>
  );
}
