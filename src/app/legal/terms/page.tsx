import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "利用規約 | 成約コーチAI",
  description: "成約コーチAIの利用規約です。サービスのご利用条件をご確認ください。",
};

export default function TermsPage() {
  return (
    <article className="prose-custom">
      <h1 className="mb-8 text-3xl font-bold">利用規約</h1>
      <p className="mb-6 text-sm text-muted">最終更新日: 2026年4月14日</p>

      <p className="mb-6 text-sm leading-relaxed text-muted">
        この利用規約（以下「本規約」）は、成約コーチAI（以下「当サービス」）の利用条件を定めるものです。
        本規約において「運営者」とは、成約コーチAIを運営する個人事業主（屋号：HAKUSO）を指します。
        ユーザーの皆さま（以下「ユーザー」）には、本規約に同意いただいた上で当サービスをご利用いただきます。
      </p>

      <Section title="第1条（サービスの内容）">
        <p>
          当サービスは、AI（人工知能）を活用した営業ロールプレイング練習および成約メソッドに基づくコーチング・スコアリング機能を提供するWebアプリケーションです。
        </p>
      </Section>

      <Section title="第2条（アカウント登録）">
        <ol className="list-decimal pl-6 space-y-2">
          <li>当サービスの利用にはアカウント登録が必要です。</li>
          <li>
            ユーザーは、正確かつ最新の情報を提供し、登録情報に変更があった場合は速やかに更新するものとします。
          </li>
          <li>
            アカウントの管理責任はユーザーにあり、第三者への譲渡・貸与はできません。
          </li>
          <li>
            ユーザーは18歳以上であることを確認するものとします。
          </li>
        </ol>
      </Section>

      <Section title="第3条（料金・支払い）">
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            当サービスには無料プランと有料プラン（スタータープラン・プロプラン・マスタープラン）があります。
          </li>
          <li>
            各有料プランの料金は以下のとおりです。スタータープラン: 月額990円（税込）、プロプラン: 月額1,980円（税込）、マスタープラン: 月額4,980円（税込）。
          </li>
          <li>
            支払いはクレジットカード（Visa、Mastercard、JCB、American Express）による月額自動課金です。
          </li>
          <li>
            決済処理にはStripe社のサービスを利用します。
          </li>
          <li>
            有料プランは月単位の自動更新となり、解約手続きを行うまで自動的に更新されます。
          </li>
          <li>
            解約はいつでも可能です。解約後も現在の請求期間の終了までサービスをご利用いただけます。
          </li>
          <li>
            日割りでの返金は行いません。
          </li>
          <li>
            デジタルコンテンツの性質上、ご購入後の返金は原則として承っておりません。Freeプラン（累計5回まで無料）でサービス内容を十分にお試しいただけますので、ご納得いただいたうえでお申し込みください。
          </li>
        </ol>
      </Section>

      <Section title="第4条（禁止事項）">
        <p>ユーザーは以下の行為を行ってはなりません。</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>法令または公序良俗に違反する行為</li>
          <li>
            当サービスの運営を妨害する行為（不正アクセス、過度なAPIリクエスト等）
          </li>
          <li>当サービスのコンテンツを無断で複製・転載・再販する行為</li>
          <li>他のユーザーまたは第三者の権利を侵害する行為</li>
          <li>
            当サービスを営業目的での再販売やサブライセンスに利用する行為
          </li>
          <li>自動化ツール等を使用して大量にサービスを利用する行為</li>
        </ol>
      </Section>

      <Section title="第5条（知的財産権）">
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            当サービスに関する知的財産権（ソフトウェア、デザイン、テキスト、画像等）は運営者に帰属します。
          </li>
          <li>
            ユーザーがロープレ中に入力したテキストの著作権はユーザーに帰属しますが、
            運営者はサービス改善のために匿名化した上で利用できるものとします。
          </li>
        </ol>
      </Section>

      <Section title="第6条（AI生成コンテンツに関する免責）">
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            当サービスはAIによるフィードバック・スコアリングを提供しますが、これらは参考情報であり、専門的な営業コンサルティングや助言を構成するものではありません。
          </li>
          <li>
            AIの応答内容の正確性・完全性を保証するものではありません。
          </li>
          <li>
            当サービスの利用による営業成果について、運営者は一切の保証を行いません。
          </li>
        </ol>
      </Section>

      <Section title="第7条（サービスの変更・停止）">
        <p>
          運営者は、サービスの内容を変更、または一時的もしくは永続的にサービスの提供を停止する場合、合理的な期間を設けて事前に通知するよう努めます。
          ただし、緊急のメンテナンスやシステム障害等やむを得ない場合はこの限りではありません。
          これによりユーザーに生じた損害について、運営者は責任を負いません。
        </p>
      </Section>

      <Section title="第8条（免責事項）">
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            運営者は、当サービスに事実上または法律上の不具合や欠陥（契約不適合を含む。安全性、信頼性、正確性、完全性、有効性、特定目的への適合性等）がないことを保証しません。
          </li>
          <li>
            当サービスの利用に起因してユーザーに生じた損害について、運営者の故意または重過失による場合を除き、運営者は責任を負いません。
          </li>
          <li>
            運営者がユーザーに対して損害賠償責任を負う場合、その賠償額はユーザーが過去12ヶ月間に当サービスに支払った金額を上限とします。
          </li>
        </ol>
      </Section>

      <Section title="第9条（個人情報の取り扱い）">
        <p>
          ユーザーの個人情報の取り扱いについては、別途定める<Link href="/legal/privacy" className="text-accent hover:underline">プライバシーポリシー</Link>に従います。
        </p>
      </Section>

      <Section title="第10条（規約の変更）">
        <p>
          運営者は、必要に応じて本規約を変更できるものとします。変更後の規約は、当サービス上に表示した時点から効力を生じるものとします。
          重要な変更がある場合は、登録メールアドレスへの通知または当サービス上での告知を行います。
        </p>
      </Section>

      <Section title="第11条（準拠法・管轄裁判所）">
        <ol className="list-decimal pl-6 space-y-2">
          <li>本規約は日本法に準拠します。</li>
          <li>
            当サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
          </li>
        </ol>
      </Section>

      <div className="mt-12 rounded-xl border border-card-border bg-card p-6 text-sm text-muted">
        <p>お問い合わせ: seiyaku.coach.ai@gmail.com</p>
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
