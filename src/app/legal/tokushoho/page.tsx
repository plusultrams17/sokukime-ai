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
      <p className="mb-8 text-sm text-muted">最終更新日: 2026年3月15日</p>

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
                  <div className="font-medium mb-1">■ AIコーチ（サブスクリプション）</div>
                  <div>無料プラン: 0円</div>
                  <div>Proプラン: 月額2,980円（税込）</div>
                  <div className="font-medium mt-3 mb-1">■ 成約5ステップ攻略プログラム（買い切り）</div>
                  <div>ローンチ記念価格: 9,800円（税込10,780円）</div>
                  <div className="text-xs mt-1">※ 価格は予告なく変更される場合があります。</div>
                </>
              }
            />
            <Row
              label="無料トライアル"
              value="Proプラン初回お申込み時に7日間の無料トライアルをご利用いただけます。トライアル期間中はいつでもキャンセル可能で、キャンセルした場合は課金されません。トライアル終了後に自動的に有料プランに移行します。（買い切りプログラムにはトライアルはありません）"
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
              value={
                <>
                  <div>■ Proプラン: 申込時に7日間の無料トライアル開始。トライアル終了後に初回課金。以降は毎月自動更新時に課金。</div>
                  <div className="mt-1">■ 買い切りプログラム: 購入手続き完了時に一括課金。</div>
                </>
              }
            />
            <Row
              label="サービス提供時期"
              value={
                <>
                  <div>■ Proプラン: お支払い完了後、即時ご利用いただけます。</div>
                  <div className="mt-1">■ 買い切りプログラム: お支払い完了後、即時アクセス可能。コンテンツは無期限でご利用いただけます。</div>
                </>
              }
            />
            <Row
              label="返品・キャンセル"
              value={
                <>
                  <div className="font-medium mb-1">■ Proプラン（サブスクリプション）</div>
                  <div>
                    いつでも解約可能です。解約手続き後も、現在の請求期間の終了日までサービスをご利用いただけます。
                  </div>
                  <div className="mt-1">
                    日割りでの返金は行っておりません。
                  </div>
                  <div className="font-medium mt-3 mb-1">■ 買い切りプログラム</div>
                  <div>
                    デジタルコンテンツの性質上、購入後の返品・返金は原則お受けしておりません（特定商取引法第15条の4に基づくクーリングオフの対象外です）。
                  </div>
                  <div className="mt-1">
                    ただし、コンテンツに重大な不備・瑕疵がある場合は、seiyaku.coach.ai@gmail.com までご連絡ください。
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
                  <div className="mt-1">買い切りプログラムの内容は予告なくアップデート・改善される場合があります。</div>
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
