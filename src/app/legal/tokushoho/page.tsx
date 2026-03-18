import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | 成約コーチ AI",
  description:
    "成約コーチ AIの特定商取引法に基づく表記です。事業者情報・販売条件をご確認ください。",
};

export default function TokushohoPage() {
  return (
    <article>
      <h1 className="mb-8 text-3xl font-bold">特定商取引法に基づく表記</h1>
      <p className="mb-8 text-sm text-muted">最終更新日: 2026年3月15日</p>

      <div className="overflow-hidden rounded-2xl border border-card-border">
        <table className="w-full">
          <tbody>
            <Row label="販売事業者" value="HAKUSO（サービス名：成約コーチ AI）" />
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
                  <div>
                    Proプラン: 月額2,980円（税込）
                  </div>
                </>
              }
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
              value="Proプラン申込時に初月分を即時決済。以降毎月自動更新時に課金。"
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
                  <div className="mt-1">
                    デジタルコンテンツの性質上、サービス提供開始後の返金はいたしかねます。
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
              value="当サービスはAIによる営業ロープレ練習ツールであり、営業成果を保証するものではありません。"
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
