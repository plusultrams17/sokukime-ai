import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | 成約コーチAI",
  description:
    "成約コーチAIの特定商取引法に基づく表記です。事業者情報・販売条件をご確認ください。",
};

export default function TokushohoPage() {
  return (
    <article>
      <h1 className="mb-8 text-3xl font-bold">特定商取引法に基づく表記</h1>
      <p className="mb-8 text-sm text-muted">最終更新日: 2026年4月10日</p>

      <div className="overflow-hidden rounded-2xl border border-card-border">
        <table className="w-full">
          <tbody>
            <Row label="販売事業者" value="HAKUSO（サービス名：成約コーチAI）" />
            <Row
              label="代表者"
              value="※ご請求いただければ遅滞なく開示いたします"
            />
            <Row
              label="所在地"
              value="※ご請求いただければ遅滞なく開示いたします"
            />
            <Row
              label="電話番号"
              value="※ご請求いただければ遅滞なく開示いたします（メールにてお問い合わせください）"
            />
            <Row
              label="メールアドレス"
              value="seiyaku.coach.ai@gmail.com"
            />
            <Row
              label="販売URL"
              value="https://seiyaku-coach.vercel.app"
            />
            <Row
              label="販売価格"
              value={
                <>
                  <div>無料プラン: 0円</div>
                  <div>Proプラン: 月額2,980円（税込）</div>
                  <div className="text-xs mt-1">※ 価格は予告なく変更される場合があります。</div>
                </>
              }
            />
            <Row
              label="無料プラン"
              value="Googleアカウントでログインすると、無料プランでAIロープレを累計5回まで（生涯の上限）お試しいただけます。クレジットカード登録不要です。"
            />
            <Row
              label="商品代金以外の必要料金"
              value="なし（インターネット接続料金等はお客様のご負担となります）"
            />
            <Row
              label="支払い方法"
              value="クレジットカード（Visa、Mastercard、JCB、American Express）※Stripe社の決済サービスを利用"
            />
            <Row
              label="支払い時期"
              value="Proプランお申込み時に初回課金。以降は毎月自動更新時に課金されます。"
            />
            <Row
              label="サービス提供時期"
              value="お支払い完了後、即時ご利用いただけます。"
            />
            <Row
              label="返品・キャンセル"
              value={
                <>
                  <div>
                    いつでも解約可能です。解約手続き後も、現在の請求期間の終了日までサービスをご利用いただけます。
                  </div>
                  <div className="mt-1">
                    日割りでの返金は行っておりません。
                  </div>
                  <div className="mt-3">
                    デジタルコンテンツの性質上、ご購入後の返金は原則として承っておりません。Freeプラン（Googleログインで累計5回まで無料）で十分にAIロープレをお試しいただけますので、内容にご納得いただいたうえでProプランをお申し込みください。
                  </div>
                  <div className="mt-1 text-xs">
                    ※ デジタルコンテンツの性質上、特定商取引法第15条の4に基づくクーリングオフの対象外です。
                  </div>
                  <div className="mt-1 text-xs">
                    ※ 当社の責に帰すべき事由（システム障害により長期間サービスが提供されなかった場合等）がある場合は、個別に対応いたします。seiyaku.coach.ai@gmail.com までご連絡ください。
                  </div>
                </>
              }
            />
            <Row
              label="動作環境"
              value={
                <>
                  <div>
                    対応ブラウザ: Google Chrome、Safari、Firefox、Microsoft
                    Edge（いずれも最新版）
                  </div>
                  <div>対応デバイス: PC、スマートフォン、タブレット</div>
                  <div>インターネット接続が必要です。</div>
                </>
              }
            />
            <Row
              label="特記事項"
              value={
                <>
                  <div>当サービスはAIによる営業ロープレ練習ツールおよび営業学習教材であり、営業成果（成約率・売上等）を保証するものではありません。効果には個人差があります。</div>
                  <div className="mt-1">サービス内容・レッスン・テンプレート等は予告なくアップデート・改善される場合があります。</div>
                </>
              }
            />
          </tbody>
        </table>
      </div>

      <div className="mt-12 rounded-xl border border-card-border bg-card p-6 text-sm text-muted">
        <p className="font-medium text-foreground mb-2">
          事業者情報の開示について
        </p>
        <p>
          個人事業主のため、住所・電話番号・代表者名は、ご請求いただければ遅滞なく開示いたします。
          開示をご希望の方は、seiyaku.coach.ai@gmail.com までメールでご連絡ください。
        </p>
      </div>
    </article>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <tr className="border-b border-card-border last:border-b-0">
      <th className="bg-card px-6 py-4 text-left text-sm font-medium text-muted align-top w-1/3 min-w-[140px]">
        {label}
      </th>
      <td className="px-6 py-4 text-sm leading-relaxed">{value}</td>
    </tr>
  );
}
