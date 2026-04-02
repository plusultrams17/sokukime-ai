import { Resend } from "resend";
import { getUnsubscribeUrl } from "@/lib/unsubscribe";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "成約コーチ AI <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.com";

/** Common email footer with unsubscribe link (特定電子メール法 compliance) */
function emailFooter(unsubscribeUrl?: string): string {
  const unsubLine = unsubscribeUrl
    ? `<a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline">配信停止</a>　|　`
    : "";
  return `<p style="font-size:11px;color:#9ca3af;text-align:center;margin:16px 0 0">
    ${unsubLine}© 成約コーチ AI　|　<a href="${APP_URL}" style="color:#9ca3af">seiyaku-coach.com</a>
  </p>`;
}

// ── Email Templates ──

function welcomeEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "成約コーチ AIへようこそ！まず営業の「型」を学びましょう",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">成約コーチ AIへようこそ！</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      登録ありがとうございます。<br>
      成約コーチ AIは、営業心理学に基づく<strong>5ステップメソッド</strong>で営業力を鍛えるAIコーチです。
    </p>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 8px">
      <strong>おすすめの始め方：</strong>
    </p>
    <ol style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px;padding-left:20px">
      <li>まず<strong>営業の型を学ぶ</strong>（5分で基本がわかります）</li>
      <li>AIとロープレで<strong>実践練習</strong></li>
      <li><strong>スコア</strong>で自分の弱点を確認</li>
    </ol>
    <div style="text-align:center;margin:0 0 24px">
      <a href="${APP_URL}/learn" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        まず営業の型を学ぶ →
      </a>
    </div>
    <div style="background:#fff7ed;border-radius:8px;padding:12px 16px;margin:0 0 8px;text-align:center">
      <p style="font-size:13px;color:#f97316;font-weight:bold;margin:0 0 4px">
        🎁 7日間の無料Pro体験が始まりました！
      </p>
      <p style="font-size:12px;color:#374151;margin:0">
        無制限ロープレ・AIコーチ・詳細スコアが7日間すべて無料。
      </p>
    </div>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

function firstRoleplayEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "初回ロープレ完了！スコアの見方と伸ばし方",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">初回ロープレ、お疲れさまでした！</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      AIとの商談練習、いかがでしたか？<br>
      最初は緊張するかもしれませんが、回数を重ねるごとに<strong>確実にスコアは上がります。</strong>
    </p>
    <div style="background:#f0fdf4;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#166534;margin:0 0 8px"><strong>スコアの伸ばし方</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li><strong>アプローチ：</strong>最初の30秒で信頼を掴む挨拶を練習</li>
        <li><strong>ヒアリング：</strong>お客さんの課題を深掘りする質問力がカギ</li>
        <li><strong>クロージング：</strong>タイミングを逃さない決め台詞を磨く</li>
      </ul>
    </div>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      研究によると、営業スキルの定着には<strong>最低20回の反復練習</strong>が必要とされています。<br>
      まずは毎日1回のロープレを3日間続けてみましょう。
    </p>
    <div style="text-align:center;margin:0 0 24px">
      <a href="${APP_URL}/roleplay" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        もう1回練習する →
      </a>
    </div>
    <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0">
      スコアが20点上がったユーザーの平均練習回数は7回です
    </p>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

function thirdRoleplayEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "3回のロープレで成長が見え始めています",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">3回目のロープレ、素晴らしい！</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      3回続けたあなたは、すでに<strong>上位10%</strong>の行動力です。<br>
      ここから本当の上達フェーズに入ります。
    </p>
    <div style="background:#fffbeb;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#92400e;margin:0 0 8px"><strong>無料プランの制限</strong></p>
      <p style="font-size:13px;color:#374151;line-height:1.6;margin:0">
        無料プランは1日1回まで。成約率を本気で上げるなら、<strong>毎日複数回の集中練習</strong>が効果的です。
      </p>
    </div>
    <div style="background:#f0f9ff;border-radius:8px;padding:16px;margin:0 0 24px">
      <p style="font-size:13px;color:#1e40af;margin:0 0 8px"><strong>Proプランなら</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>ロープレ<strong>無制限</strong>（1日何回でもOK）</li>
        <li>商談前のウォームアップに毎回使える</li>
        <li>月¥2,980 — 営業研修の<strong>1/20以下</strong>のコスト</li>
      </ul>
    </div>
    <div style="text-align:center;margin:0 0 16px">
      <a href="${APP_URL}/pricing" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        Proプランを見る →
      </a>
    </div>
    <div style="text-align:center;margin:0 0 24px">
      <a href="${APP_URL}/roleplay" style="font-size:13px;color:#1B6B5A;text-decoration:underline">
        まず今日の無料ロープレを使う
      </a>
    </div>
    <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0">
      いつでもキャンセル可能。まずは1ヶ月試してみてください
    </p>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

// ── Trial Expiration Email Templates ──

function trialExpiring3DaysEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "無料トライアル残り3日 — Proの全機能を使い切りましたか？",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">トライアル残り3日です</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      7日間の無料トライアルが<strong>あと3日</strong>で終了します。<br>
      Proプランの全機能は使い切れましたか？
    </p>
    <div style="background:#f0f9ff;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#1e40af;margin:0 0 8px"><strong>残り3日でやっておきたいこと</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li><strong>ロープレ3回以上：</strong>無制限の今こそ集中練習のチャンス</li>
        <li><strong>全5カテゴリのスコア確認：</strong>自分の弱点を把握する</li>
        <li><strong>AI改善アドバイスを活用：</strong>具体的な改善ポイントを確認</li>
      </ul>
    </div>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      トライアル期間中にスコアが伸びた方の<strong>87%</strong>が、そのままProプランを継続されています。
    </p>
    <div style="text-align:center;margin:0 0 24px">
      <a href="${APP_URL}/roleplay" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        今すぐロープレする →
      </a>
    </div>
    <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0">
      何もしなければ自動的にProプランに移行します。いつでもキャンセル可能です。
    </p>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

function trialExpiring6DaysEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "Proトライアル残り1日 — 最後の無制限ロープレを見逃さないで",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">トライアル最終日です</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      Proプランの無料トライアルが<strong>本日中に終了</strong>します。<br>
      無制限でロープレできる最後のチャンスです。
    </p>
    <div style="background:#fef3c7;border-radius:8px;padding:16px;margin:0 0 16px;border:1px solid #fcd34d">
      <p style="font-size:13px;color:#92400e;margin:0 0 8px"><strong>明日から変わること</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>ロープレ回数: 無制限 → <strong>1日1回</strong></li>
        <li>詳細スコア: 全5カテゴリ → <strong>1カテゴリのみ</strong></li>
        <li>AI改善アドバイス: → <strong>利用不可</strong></li>
      </ul>
    </div>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      Proを継続する場合は何もしなくてOKです（月額¥2,980）。<br>
      不要な場合はいつでもキャンセルできます。
    </p>
    <div style="text-align:center;margin:0 0 16px">
      <a href="${APP_URL}/roleplay" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        最後の無制限ロープレへ →
      </a>
    </div>
    <div style="text-align:center">
      <a href="${APP_URL}/pricing" style="font-size:12px;color:#9ca3af;text-decoration:underline">
        プランの詳細・キャンセルはこちら
      </a>
    </div>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

function trialExpiring1DayEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "【明日終了】無料トライアルが明日で終わります",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">トライアル、明日で終了です</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      7日間の無料トライアルが<strong>明日</strong>で終了します。
    </p>
    <div style="background:#fffbeb;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#92400e;margin:0 0 8px"><strong>明日以降の変更点</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>ロープレが<strong>1日1回</strong>に制限されます</li>
        <li>詳細スコアが<strong>1カテゴリのみ</strong>になります</li>
        <li>AI改善アドバイスが<strong>利用不可</strong>になります</li>
      </ul>
    </div>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 8px">
      <strong>Proプランを継続する場合：</strong>何もしなければ自動的にProプラン（月額¥2,980）に移行します。
    </p>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      <strong>継続しない場合：</strong>下のリンクからいつでもキャンセルできます。無料プランに戻るだけで、アカウントやデータは残ります。
    </p>
    <div style="text-align:center;margin:0 0 16px">
      <a href="${APP_URL}/roleplay" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        最後の無制限ロープレ →
      </a>
    </div>
    <div style="text-align:center">
      <a href="${APP_URL}/pricing" style="font-size:12px;color:#9ca3af;text-decoration:underline">
        プランの詳細・キャンセルはこちら
      </a>
    </div>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

function trialExpiredEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "トライアルが終了しました — いつでもProに戻れます",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">無料トライアルが終了しました</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      7日間のトライアル、お疲れさまでした。<br>
      現在は無料プラン（1日1回）でご利用いただけます。
    </p>
    <div style="background:#f0fdf4;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#166534;margin:0 0 8px"><strong>営業スキルは「継続」で伸びます</strong></p>
      <p style="font-size:13px;color:#374151;line-height:1.6;margin:0">
        トップ営業マンは毎日の練習を欠かしません。<br>
        無料プランでも毎日1回の練習を続ければ着実にスコアは上がります。<br>
        もっと練習したくなったら、いつでもProプランに戻れます。
      </p>
    </div>
    <div style="text-align:center;margin:0 0 16px">
      <a href="${APP_URL}/roleplay" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        今日のロープレを始める →
      </a>
    </div>
    <div style="text-align:center">
      <a href="${APP_URL}/pricing" style="font-size:13px;color:#1B6B5A;text-decoration:underline">
        Proプランに戻る（月額¥2,980）
      </a>
    </div>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

function inactiveReminderEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "最近ロープレしていませんね — 1回5分で営業力は維持できます",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">お久しぶりです！</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      最後のロープレから1週間以上経ちました。<br>
      せっかく身についた営業スキル、<strong>使わないと忘れてしまいます。</strong>
    </p>
    <div style="background:#f0f9ff;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#1e40af;margin:0 0 8px"><strong>1回5分で維持できます</strong></p>
      <p style="font-size:13px;color:#374151;line-height:1.6;margin:0">
        研究によると、学んだスキルは<strong>1週間練習しないと40%減少</strong>します。<br>
        でも、1日5分のAIロープレを続ければ、スキルを維持・向上できます。
      </p>
    </div>
    <div style="text-align:center;margin:0 0 24px">
      <a href="${APP_URL}/roleplay" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        5分だけロープレする →
      </a>
    </div>
    <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0">
      無料プランでも1日1回のロープレが可能です
    </p>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

// ── Pre-Activation Reminder Email Template ──

function noRoleplayDay3Email(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "まだロープレを試していませんか？ 3分で営業力がわかります",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">まだ最初のロープレがお済みでないようです</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      登録ありがとうございます。<br>
      まだAIロープレを試されていないようなので、ご案内します。
    </p>
    <div style="background:#f0f9ff;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#1e40af;margin:0 0 8px"><strong>たった3分で営業スコアがわかります</strong></p>
      <ol style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>売りたい商材を入力（例：保険、不動産）</li>
        <li>AIのお客さん役と商談を体験</li>
        <li>5カテゴリの営業スコアが即座に判明</li>
      </ol>
    </div>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      多くのユーザーが<strong>初回のスコアに驚いて</strong>練習を始めています。<br>
      まずは自分の現在地を知ることが、営業力アップの第一歩です。
    </p>
    <div style="text-align:center;margin:0 0 16px">
      <a href="${APP_URL}/roleplay" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        3分で営業力を診断する →
      </a>
    </div>
    <div style="text-align:center">
      <a href="${APP_URL}/learn" style="font-size:13px;color:#1B6B5A;text-decoration:underline">
        まず営業の型を学んでから始める
      </a>
    </div>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

// ── Pro Welcome Email Template ──

function proWelcomeEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "Proプランへようこそ！無制限ロープレを始めましょう",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">Proプランへようこそ！</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      Proプランへのアップグレードありがとうございます。<br>
      これで<strong>営業力を最速で鍛える環境</strong>が整いました。
    </p>
    <div style="background:#f0f9ff;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#1e40af;margin:0 0 8px"><strong>Proで使える全機能</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>AIロープレ<strong>回数無制限</strong></li>
        <li>全5カテゴリの<strong>詳細スコア＆レーダーチャート</strong></li>
        <li>AIによる<strong>改善アドバイス</strong></li>
        <li>全シーン・全ワークシート解放</li>
      </ul>
    </div>
    <div style="background:#f0fdf4;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#166534;margin:0 0 8px"><strong>最初の1週間でやるべきこと</strong></p>
      <ol style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>まず<strong>3回ロープレ</strong>して現在のスコアを把握</li>
        <li>一番低いカテゴリを<strong>集中的に練習</strong></li>
        <li>1日3回以上で<strong>最速のスコアアップ</strong>を実現</li>
      </ol>
    </div>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      Proユーザーの平均：初月のスコアが<strong>23%向上</strong>しています。<br>
      早速始めましょう！
    </p>
    <div style="text-align:center;margin:0 0 24px">
      <a href="${APP_URL}/roleplay" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        今すぐロープレを始める →
      </a>
    </div>
    <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0">
      ご不明な点があれば support@seiyaku-coach.com までお気軽にお問い合わせください
    </p>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

// ── Weekly Progress Digest Email Template ──

function weeklyDigestEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "今週のロープレまとめ — あなたの成長を確認しましょう",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">今週のロープレまとめ</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      今週もお疲れさまでした。<br>
      あなたのトレーニング進捗を振り返りましょう。
    </p>
    <div style="background:#f0f9ff;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#1e40af;margin:0 0 8px"><strong>今週のポイント</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>ダッシュボードでスコアの<strong>推移グラフ</strong>を確認</li>
        <li>最も低いカテゴリを<strong>重点練習</strong>して弱点を克服</li>
        <li>毎日3回以上の練習で<strong>スコアアップが加速</strong></li>
      </ul>
    </div>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      継続は力なり。来週も一緒に営業力を磨きましょう！
    </p>
    <div style="text-align:center;margin:0 0 16px">
      <a href="${APP_URL}/dashboard" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        ダッシュボードで成長を確認 →
      </a>
    </div>
    <div style="text-align:center">
      <a href="${APP_URL}/roleplay" style="font-size:13px;color:#1B6B5A;text-decoration:underline">
        今すぐロープレする
      </a>
    </div>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

// ── Post-Pro Onboarding Email Templates (Day 1, 3, 7) ──

function proOnboardingDay1Email(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "Pro初日ガイド — 今日やるべき3つのこと",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">Pro初日を最大限活用しましょう！</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      Proプラン初日です！<br>
      初日に<strong>3回以上ロープレ</strong>した方は、1ヶ月後のスコアが平均<strong>30%高い</strong>というデータがあります。
    </p>
    <div style="background:#f0fdf4;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#166534;margin:0 0 8px"><strong>今日やるべき3つのこと</strong></p>
      <ol style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li><strong>3回ロープレ</strong>して各シーンのスコアを確認</li>
        <li><strong>レーダーチャート</strong>で5カテゴリの強み・弱みを把握</li>
        <li>最も低いカテゴリの<strong>AIアドバイス</strong>を読んで次回に活かす</li>
      </ol>
    </div>
    <div style="text-align:center;margin:0 0 24px">
      <a href="${APP_URL}/roleplay" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        今すぐロープレする →
      </a>
    </div>
    <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0">
      Pro会員なら何回でも練習できます
    </p>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

function proOnboardingDay3Email(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "Pro3日目 — スコアの変化をチェックしましょう",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">3日間、お疲れさまでした！</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      Pro開始から3日目。<br>
      ダッシュボードで<strong>スコアの推移</strong>を確認してみましょう。
    </p>
    <div style="background:#f0f9ff;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#1e40af;margin:0 0 8px"><strong>3日目のチェックポイント</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>初日と比べてスコアは<strong>上がっていますか？</strong></li>
        <li>最も低いカテゴリに<strong>集中練習</strong>していますか？</li>
        <li>同じシーンを3回繰り返すと<strong>上達が加速</strong>します</li>
      </ul>
    </div>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      多くのProユーザーは3日目から<strong>スコアの上昇</strong>を実感し始めます。<br>
      ここからが本当の成長フェーズです。
    </p>
    <div style="text-align:center;margin:0 0 16px">
      <a href="${APP_URL}/dashboard" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        スコア推移を確認する →
      </a>
    </div>
    <div style="text-align:center">
      <a href="${APP_URL}/roleplay" style="font-size:13px;color:#1B6B5A;text-decoration:underline">
        ロープレで弱点を克服する
      </a>
    </div>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

function proOnboardingDay7Email(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "Pro1週間の成果 — あなたの成長を振り返りましょう",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">Pro1週間、おめでとうございます！</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      Proプラン開始から1週間が経ちました。<br>
      ダッシュボードであなたの<strong>成長の軌跡</strong>を確認しましょう。
    </p>
    <div style="background:#f0fdf4;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#166534;margin:0 0 8px"><strong>次のステップ</strong></p>
      <ol style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>ダッシュボードで<strong>スコア推移グラフ</strong>を確認</li>
        <li>改善したカテゴリと改善余地のあるカテゴリを分析</li>
        <li>同僚にシェアして<strong>¥1,000 OFF</strong>をゲット</li>
      </ol>
    </div>
    <div style="background:#fffbeb;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#92400e;margin:0 0 8px"><strong>友達紹介でお得に</strong></p>
      <p style="font-size:13px;color:#374151;line-height:1.6;margin:0">
        営業チームの同僚にシェアすれば、お互い<strong>¥1,000 OFF</strong>。<br>
        チーム全体のスキルアップにも繋がります。
      </p>
    </div>
    <div style="text-align:center;margin:0 0 16px">
      <a href="${APP_URL}/dashboard" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        成長を確認する →
      </a>
    </div>
    <div style="text-align:center">
      <a href="${APP_URL}/referral" style="font-size:13px;color:#1B6B5A;text-decoration:underline">
        友達紹介で ¥1,000 OFF →
      </a>
    </div>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

// ── Pause Resume Notification Email Template ──

function pauseResuming3DaysEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "【ご確認】Proプランが3日後に自動再開されます",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">Proプランが3日後に再開されます</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      一時停止中のProプランが<strong>3日後に自動的に再開</strong>され、次回の請求が行われます。
    </p>
    <div style="background:#f0f9ff;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#1e40af;margin:0 0 8px"><strong>再開後に使える機能</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>AIロープレ<strong>回数無制限</strong></li>
        <li>全5カテゴリの<strong>詳細スコア</strong></li>
        <li>AI<strong>改善アドバイス</strong></li>
      </ul>
    </div>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      再開を希望されない場合は、下のボタンからサブスクリプションを管理できます。
    </p>
    <div style="text-align:center;margin:0 0 16px">
      <a href="${APP_URL}/roleplay" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        再開に備えてロープレする →
      </a>
    </div>
    <div style="text-align:center">
      <a href="${APP_URL}/api/stripe/portal" style="font-size:12px;color:#6b7280;text-decoration:underline">
        サブスクリプションを管理する
      </a>
    </div>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

// ── Dunning Email Templates (Day 4 & Day 7) ──

function paymentFailedDay4Email(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "【再通知】お支払いの更新がまだ完了していません",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">お支払いの更新をお忘れではないですか？</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      先日お知らせしたお支払いの問題が、まだ解決されていません。<br>
      <strong>このままですと、まもなくProプランが停止</strong>されます。
    </p>
    <div style="background:#fffbeb;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#92400e;margin:0 0 8px"><strong>Proプラン停止で失われるもの</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>無制限ロープレ → <strong>1日1回に制限</strong></li>
        <li>詳細スコア5カテゴリ → <strong>1カテゴリのみ</strong></li>
        <li>AI改善アドバイス → <strong>利用不可</strong></li>
      </ul>
    </div>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      カードの更新は1分で完了します。
    </p>
    <div style="text-align:center;margin:0 0 24px">
      <a href="${APP_URL}/api/stripe/portal" style="display:inline-block;background:#dc2626;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        今すぐ支払い方法を更新 →
      </a>
    </div>
    <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0">
      ご不明な点は support@seiyaku-coach.com までお問い合わせください
    </p>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

function paymentFailedDay7Email(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "【最終通知】Proプランが停止される前にお支払い方法を更新してください",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#dc2626;margin:0 0 16px;text-align:center">Proプランがまもなく停止されます</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      お支払いの問題が1週間以上解決されていないため、<strong>Proプランが間もなく自動的にキャンセル</strong>されます。
    </p>
    <div style="background:#fef2f2;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#991b1b;margin:0 0 8px"><strong>これが最終のお知らせです</strong></p>
      <p style="font-size:13px;color:#374151;line-height:1.6;margin:0">
        お支払い方法を更新いただければ、Proプランをそのまま継続できます。<br>
        更新がない場合、無料プラン（1日1回制限）に自動移行します。
      </p>
    </div>
    <div style="text-align:center;margin:0 0 16px">
      <a href="${APP_URL}/api/stripe/portal" style="display:inline-block;background:#dc2626;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        今すぐ支払い方法を更新 →
      </a>
    </div>
    <div style="text-align:center">
      <a href="${APP_URL}/pricing" style="font-size:12px;color:#6b7280;text-decoration:underline">
        プランの詳細を見る
      </a>
    </div>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

// ── Referral Reward Notification Email Template ──

function referralRewardEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "紹介特典 ¥1,000 OFF が適用されました！",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">紹介特典が適用されました！</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      あなたが紹介した方がProプランに登録しました！<br>
      紹介特典として、次回のお支払いから<strong>¥1,000 OFF</strong>が自動適用されます。
    </p>
    <div style="background:#f0fdf4;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#166534;margin:0 0 8px"><strong>紹介を続けてさらにお得に</strong></p>
      <p style="font-size:13px;color:#374151;line-height:1.6;margin:0">
        紹介すればするほど割引が増えます。<br>
        あなたの紹介リンクをシェアして、仲間と一緒にスキルアップしましょう。
      </p>
    </div>
    <div style="text-align:center;margin:0 0 24px">
      <a href="${APP_URL}/referral" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        紹介リンクを確認する →
      </a>
    </div>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

// ── Transactional Email Templates ──

function paymentFailedEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "【重要】お支払いに問題が発生しました",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">お支払いの更新をお願いします</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      Proプランの更新にあたり、登録されているお支払い方法で決済ができませんでした。
    </p>
    <div style="background:#fef2f2;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#991b1b;margin:0 0 8px"><strong>このままだとProプランが停止されます</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>ロープレが<strong>1日1回</strong>に制限されます</li>
        <li>全5カテゴリの<strong>詳細スコア</strong>が見られなくなります</li>
        <li>AI改善アドバイスが利用できなくなります</li>
      </ul>
    </div>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      下のボタンからお支払い方法を更新してください。<br>
      カードの有効期限切れ・限度額超過が主な原因です。
    </p>
    <div style="text-align:center;margin:0 0 16px">
      <a href="${APP_URL}/api/stripe/portal" style="display:inline-block;background:#dc2626;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        お支払い方法を更新する →
      </a>
    </div>
    <div style="text-align:center;margin:0 0 24px">
      <a href="${APP_URL}/pricing" style="font-size:12px;color:#6b7280;text-decoration:underline">
        プランの詳細を見る
      </a>
    </div>
    <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0">
      ご不明な点は support@seiyaku-coach.com までお問い合わせください
    </p>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

function subscriptionCanceledEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "Proプランが解約されました — いつでも再開でき���す",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">Proプランを解約しました</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      ご利用ありがとうございました。<br>
      引き続き無料プラン（1日1回）でAIロープレをご利用いただけます。
    </p>
    <div style="background:#f0fdf4;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#166534;margin:0 0 8px"><strong>練習を続けることが大切��す</strong></p>
      <p style="font-size:13px;color:#374151;line-height:1.6;margin:0">
        無料プランでも毎日1回の練習で着実にスキルは上がります。<br>
        もっと練習したくなったら、いつでもProに再登録できます。
      </p>
    </div>
    <div style="text-align:center;margin:0 0 16px">
      <a href="${APP_URL}/roleplay" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        今日のロープレを始める →
      </a>
    </div>
    <div style="text-align:center">
      <a href="${APP_URL}/pricing" style="font-size:13px;color:#1B6B5A;text-decoration:underline">
        Proプランに再登録する
      </a>
    </div>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

// ── Win-back Email Templates (Day 7 & Day 30 after cancellation) ──

function winback7DaysEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "営業スコアが下がっていませんか？ 1週間の変化をチェック",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">Pro解約から1週間が経ちました</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      無料プランでの営業練習は順調ですか？<br>
      1日1回の制限で、練習量が足りていない方が多いです。
    </p>
    <div style="background:#fffbeb;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#92400e;margin:0 0 8px"><strong>練習量とスコアの関係</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>1日1回 → スコア<strong>維持</strong>がやっと</li>
        <li>1日3回以上 → スコアが<strong>平均20点UP</strong></li>
        <li>練習なし → 1週間で<strong>スキルが40%低下</strong></li>
      </ul>
    </div>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      まだダッシュボードであなたのスコア履歴が見れます。<br>
      Proに戻れば、スコアの回復も早くなります。
    </p>
    <div style="text-align:center;margin:0 0 16px">
      <a href="${APP_URL}/pricing" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        Proプランに戻る（月額¥2,980）→
      </a>
    </div>
    <div style="text-align:center">
      <a href="${APP_URL}/dashboard" style="font-size:13px;color:#6b7280;text-decoration:underline">
        スコア履歴を確認する
      </a>
    </div>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

function winback30DaysEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "営業成績、伸び悩んでいませんか？ 成約コーチ AIで突破口を",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">お久しぶりです</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      Pro解約から1ヶ月が経ちました。<br>
      その後、営業成績はいかがですか？
    </p>
    <div style="background:#f0f9ff;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#1e40af;margin:0 0 8px"><strong>成約コーチ AIは進化し続けています</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>AIコーチの精度が<strong>さらに向上</strong></li>
        <li>あなたのスコア履歴は<strong>そのまま残っています</strong></li>
        <li>再開すれば<strong>続きから</strong>練習できます</li>
      </ul>
    </div>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      営業は毎日の練習がモノを言います。<br>
      月額¥2,980 — 営業研修1回分の<strong>1/20以下</strong>のコストで、毎日AIと練習できます。
    </p>
    <div style="text-align:center;margin:0 0 16px">
      <a href="${APP_URL}/pricing" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        Proプランに再登録する →
      </a>
    </div>
    <div style="text-align:center">
      <a href="${APP_URL}/roleplay" style="font-size:13px;color:#6b7280;text-decoration:underline">
        まず無料で1回試してみる
      </a>
    </div>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

// ── Power User Upgrade Email Template ──

function powerUserUpgradeEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "あなたは上位3%のヘビーユーザーです — Proで一気に伸ばしませんか？",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">毎日の練習、素晴らしいです！</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      3日以上連続でロープレしているあなたは、<strong>全ユーザーの上位3%</strong>です。<br>
      毎日制限にぶつかっていませんか？
    </p>
    <div style="background:#fef3c7;border-radius:8px;padding:16px;margin:0 0 16px;border:1px solid #fcd34d">
      <p style="font-size:13px;color:#92400e;margin:0 0 8px"><strong>あなたのような方にProが最も効果的です</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>制限解除 → 1日に<strong>何回でも</strong>練習</li>
        <li>全5カテゴリのスコア → <strong>弱点を特定</strong></li>
        <li>AI改善アドバイス → <strong>ピンポイントで成長</strong></li>
      </ul>
    </div>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      毎日練習する習慣がすでにあるあなたなら、Proの効果を<strong>最大限</strong>引き出せます。<br>
      7日間無料で試してみませんか？
    </p>
    <div style="text-align:center;margin:0 0 16px">
      <a href="${APP_URL}/pricing" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        7日間無料でProを試す →
      </a>
    </div>
    <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0">
      7日間完全無料 → ¥2,980/月 ・ いつでも解約OK
    </p>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

// ── Referral Nudge Email Template ──

function checkoutAbandonedEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "チェックアウトがお済みでないようです — 7日間無料トライアルを始めませんか？",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">登録を完了しませんか？</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      先ほどProプランのチェックアウトを途中で離れたようです。<br>
      何か問題がありましたか？
    </p>
    <div style="background:#f0f9ff;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#1e40af;margin:0 0 8px"><strong>Proプランに含まれるもの</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>AIロープレ<strong>回数無制限</strong></li>
        <li>全5カテゴリの<strong>詳細スコア</strong></li>
        <li>AI<strong>改善アドバイス</strong></li>
        <li><strong>7日間完全無料</strong>で試せます</li>
      </ul>
    </div>
    <div style="background:#f0fdf4;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#166534;margin:0 0 8px"><strong>安心ポイント</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.6;margin:0;padding-left:16px">
        <li>7日間は<strong>完全無料</strong> — 課金は8日目から</li>
        <li>いつでも<strong>ワンクリックで解約</strong>OK</li>
        <li>クレジットカード情報は<strong>Stripeが安全に管理</strong></li>
      </ul>
    </div>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      まずは無料で7日間、無制限にAIロープレを体験してみてください。
    </p>
    <div style="text-align:center;margin:0 0 16px">
      <a href="${APP_URL}/pricing" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        7日間無料でProを試す →
      </a>
    </div>
    <div style="text-align:center">
      <a href="${APP_URL}/roleplay" style="font-size:13px;color:#6b7280;text-decoration:underline">
        まず無料ロープレを試してみる
      </a>
    </div>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

function referralNudgeEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "同僚にシェアして ¥1,000 OFF — 紹介プログラムのご案内",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">友達紹介で ¥1,000 OFF</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      成約コーチ AIで営業力を鍛えていますか？<br>
      同僚や営業仲間にもシェアして、<strong>お互いに ¥1,000 OFF</strong> を手に入れましょう。
    </p>
    <div style="background:#f0fdf4;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#166534;margin:0 0 8px"><strong>紹介プログラムの仕組み</strong></p>
      <ol style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>マイページから紹介リンクをコピー</li>
        <li>同僚やチームメンバーにシェア</li>
        <li>相手がProに登録 → <strong>あなたも相手も ¥1,000 OFF</strong></li>
      </ol>
    </div>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      紹介すればするほど割引が増えます。<br>
      チーム全員で営業スキルを上げれば、<strong>部門全体の成約率アップ</strong>にもつながります。
    </p>
    <div style="text-align:center;margin:0 0 24px">
      <a href="${APP_URL}/referral" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        紹介リンクを取得する →
      </a>
    </div>
    <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0">
      紹介された方には7日間の無料トライアルが付きます
    </p>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

// ─��� Email Types ──

// ── NPS Survey Email Template ──

function npsSurveyEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "1問だけ聞かせてください — 成約コーチ AIの満足度調査",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">ご利用ありがとうございます！</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      成約コーチ AIをご利用いただき2週間が経ちました。<br>
      <strong>1問だけ</strong>聞かせてください。
    </p>
    <div style="background:#f0f9ff;border-radius:8px;padding:16px;margin:0 0 24px">
      <p style="font-size:14px;color:#1e40af;margin:0 0 12px;font-weight:bold;text-align:center">
        成約コーチ AIを同僚に勧めたいと思いますか？
      </p>
      <p style="font-size:12px;color:#374151;text-align:center;margin:0 0 8px">0（全く勧めない）〜 10（強く勧めたい）</p>
      <div style="text-align:center">
        <a href="${APP_URL}/nps?score=0" style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;background:#fca5a5;border-radius:4px;text-decoration:none;color:#111;font-size:11px;font-weight:bold;margin:2px">0</a>
        <a href="${APP_URL}/nps?score=1" style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;background:#fca5a5;border-radius:4px;text-decoration:none;color:#111;font-size:11px;font-weight:bold;margin:2px">1</a>
        <a href="${APP_URL}/nps?score=2" style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;background:#fca5a5;border-radius:4px;text-decoration:none;color:#111;font-size:11px;font-weight:bold;margin:2px">2</a>
        <a href="${APP_URL}/nps?score=3" style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;background:#fca5a5;border-radius:4px;text-decoration:none;color:#111;font-size:11px;font-weight:bold;margin:2px">3</a>
        <a href="${APP_URL}/nps?score=4" style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;background:#fca5a5;border-radius:4px;text-decoration:none;color:#111;font-size:11px;font-weight:bold;margin:2px">4</a>
        <a href="${APP_URL}/nps?score=5" style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;background:#fca5a5;border-radius:4px;text-decoration:none;color:#111;font-size:11px;font-weight:bold;margin:2px">5</a>
        <a href="${APP_URL}/nps?score=6" style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;background:#fca5a5;border-radius:4px;text-decoration:none;color:#111;font-size:11px;font-weight:bold;margin:2px">6</a>
        <a href="${APP_URL}/nps?score=7" style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;background:#fde68a;border-radius:4px;text-decoration:none;color:#111;font-size:11px;font-weight:bold;margin:2px">7</a>
        <a href="${APP_URL}/nps?score=8" style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;background:#fde68a;border-radius:4px;text-decoration:none;color:#111;font-size:11px;font-weight:bold;margin:2px">8</a>
        <a href="${APP_URL}/nps?score=9" style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;background:#86efac;border-radius:4px;text-decoration:none;color:#111;font-size:11px;font-weight:bold;margin:2px">9</a>
        <a href="${APP_URL}/nps?score=10" style="display:inline-block;width:26px;height:26px;line-height:26px;text-align:center;background:#86efac;border-radius:4px;text-decoration:none;color:#111;font-size:11px;font-weight:bold;margin:2px">10</a>
      </div>
    </div>
    <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0">
      クリックするだけで回答完了です。30秒もかかりません。
    </p>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

/** At-risk health score intervention email */
function atRiskInterventionEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "最近ロープレしていませんね。スキルが下がる前に練習しませんか？",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">営業スキルは「使わないと落ちる」</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      研究によると、営業スキルは練習を止めて<strong>2週間で最大20%低下</strong>することが分かっています。
    </p>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      たった5分のロープレで感覚を取り戻せます。今日1回だけ練習してみませんか？
    </p>
    <div style="text-align:center;margin:0 0 24px">
      <a href="${APP_URL}/roleplay" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        5分だけ練習する →
      </a>
    </div>
    <div style="background:#fff7ed;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#374151;margin:0;line-height:1.6">
        💡 <strong>Pro会員なら</strong>、AIコーチがリアルタイムでアドバイス。弱点を効率的に改善できます。
      </p>
    </div>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

/** Predictive churn intervention email — sent when health score is declining but not yet critical */
function predictiveChurnEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "最近の練習ペースが落ちていませんか？",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">ちょっとお知らせです</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      あなたのロープレ練習のペースが以前より下がっているようです。<br>
      忙しいときこそ、<strong>短い5分間の練習</strong>で感覚を維持しましょう。
    </p>
    <div style="background:#f0fdf4;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#166534;margin:0 0 8px"><strong>研究データより</strong></p>
      <p style="font-size:13px;color:#374151;line-height:1.6;margin:0">
        営業スキルは<strong>2週間の空白で約30%</strong>低下するとされています。<br>
        週2-3回の短い練習でスキルを維持できます。
      </p>
    </div>
    <div style="background:#eff6ff;border-radius:8px;padding:16px;margin:0 0 24px">
      <p style="font-size:13px;color:#1e40af;margin:0 0 8px"><strong>おすすめ：5分ロープレ</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>通勤中にスマホでサクッと1回</li>
        <li>昼休みにクロージング練習</li>
        <li>商談前のウォームアップに</li>
      </ul>
    </div>
    <div style="text-align:center;margin:0 0 24px">
      <a href="${APP_URL}/roleplay" style="display:inline-block;background:#1B6B5A;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        5分ロープレを始める →
      </a>
    </div>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

/** Streak milestone celebration email — 競合失敗分析: 習慣形成メールがDAUを20-30%向上 */
function streakMilestoneEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "🔥 ストリーク達成おめでとうございます！",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <div style="text-align:center;font-size:48px;margin:0 0 16px">🔥</div>
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">連続練習記録を更新中！</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      毎日の練習を続けているあなたは、本当に素晴らしいです。<br>
      研究によると、<strong>毎日練習を続ける営業マンは、週1回の人より3倍速くスコアが伸びます。</strong>
    </p>
    <div style="background:#fff7ed;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#92400e;margin:0 0 8px"><strong>ストリーク継続のコツ</strong></p>
      <ul style="font-size:13px;color:#374151;line-height:1.8;margin:0;padding-left:16px">
        <li>毎日同じ時間に練習する（習慣化）</li>
        <li>通勤中や昼休みの5分でOK</li>
        <li>弱点カテゴリに絞って短く集中</li>
      </ul>
    </div>
    <div style="text-align:center;margin:0 0 16px">
      <a href="${APP_URL}/roleplay" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        今日もロープレする →
      </a>
    </div>
    <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0">
      ダッシュボードでストリーク記録を確認できます
    </p>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

/** Cron failure alert email for admin */
function cronFailureAlertEmail(data: AdminAlertData): { subject: string; html: string } {
  const nowStr = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  return {
    subject: `[成約コーチ AI] ⚠️ Cronジョブ異常アラート`,
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#dc2626;margin:0 0 8px;text-align:center">⚠️ Cronジョブ異常</h1>
    <p style="font-size:13px;color:#9ca3af;text-align:center;margin:0 0 24px">${nowStr}</p>
    <div style="background:#fef2f2;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:14px;color:#991b1b;margin:0 0 8px"><strong>検出内容</strong></p>
      <p style="font-size:14px;color:#374151;line-height:1.8;margin:0">${data.details}</p>
    </div>
    <p style="font-size:13px;color:#374151;line-height:1.8;margin:0 0 24px">
      連続失敗回数: <strong>${data.value}回</strong>（閾値: ${data.threshold}回）<br>
      メール自動配信が停止している可能性があります。早急にログを確認してください。
    </p>
    <div style="text-align:center">
      <a href="${APP_URL}/admin" style="display:inline-block;background:#dc2626;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        管理画面を確認 →
      </a>
    </div>
  </div>
  <p style="font-size:11px;color:#9ca3af;text-align:center;margin:16px 0 0">
    © 成約コーチ AI　|　<a href="${APP_URL}" style="color:#9ca3af">seiyaku-coach.com</a>
  </p>
</div>
</body>
</html>`,
  };
}

/** Admin alert email for churn spikes / MRR drops */
function adminAlertEmail(data: AdminAlertData): { subject: string; html: string } {
  const alertLabels: Record<AdminAlertType, string> = {
    churn_spike: "チャーン急増アラート",
    mrr_drop: "MRR低下アラート",
    cron_failure: "Cronジョブ異常アラート",
    predictive_churn_spike: "チャーン予測アラート",
  };
  const alertEmoji: Record<AdminAlertType, string> = {
    churn_spike: "🚨",
    mrr_drop: "📉",
    cron_failure: "⚠️",
    predictive_churn_spike: "📊",
  };
  const label = alertLabels[data.alertType];
  const emoji = alertEmoji[data.alertType];
  const nowStr = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });

  return {
    subject: `[成約コーチ AI] ${emoji} ${label}`,
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#dc2626;margin:0 0 8px;text-align:center">${emoji} ${label}</h1>
    <p style="font-size:13px;color:#9ca3af;text-align:center;margin:0 0 24px">${nowStr}</p>
    <div style="background:#fef2f2;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:14px;color:#991b1b;margin:0 0 8px"><strong>検出内容</strong></p>
      <p style="font-size:14px;color:#374151;line-height:1.8;margin:0">${data.details}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:0 0 16px">
      <tr>
        <td style="padding:8px 0;font-size:13px;color:#9ca3af;border-bottom:1px solid #e5e7eb">検出値</td>
        <td style="padding:8px 0;font-size:14px;color:#dc2626;font-weight:bold;text-align:right;border-bottom:1px solid #e5e7eb">${data.value}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-size:13px;color:#9ca3af">閾値</td>
        <td style="padding:8px 0;font-size:14px;color:#374151;font-weight:bold;text-align:right">${data.threshold}</td>
      </tr>
    </table>
    <div style="text-align:center">
      <a href="${APP_URL}/admin" style="display:inline-block;background:#dc2626;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        管理画面を確認 →
      </a>
    </div>
  </div>
  <p style="font-size:11px;color:#9ca3af;text-align:center;margin:16px 0 0">
    © 成約コーチ AI　|　<a href="${APP_URL}" style="color:#9ca3af">seiyaku-coach.com</a>
  </p>
</div>
</body>
</html>`,
  };
}

/** Weekly admin revenue report email */
function weeklyRevenueReportEmail(data: WeeklyRevenueData): { subject: string; html: string } {
  const weekDate = new Date().toLocaleDateString("ja-JP", { month: "long", day: "numeric" });
  return {
    subject: `[成約コーチ AI] 週次レポート ${weekDate} — MRR ¥${data.mrr.toLocaleString()}`,
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 8px;text-align:center">📊 週次レベニューレポート</h1>
    <p style="font-size:13px;color:#9ca3af;text-align:center;margin:0 0 24px">${weekDate}</p>

    <table style="width:100%;border-collapse:collapse;margin:0 0 24px">
      <tr>
        <td style="padding:12px;background:#f0fdf4;border-radius:8px 0 0 0;text-align:center;border-bottom:2px solid #fff">
          <div style="font-size:24px;font-weight:bold;color:#166534">¥${data.mrr.toLocaleString()}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:4px">MRR</div>
        </td>
        <td style="padding:12px;background:#eff6ff;border-radius:0 8px 0 0;text-align:center;border-bottom:2px solid #fff">
          <div style="font-size:24px;font-weight:bold;color:#1e40af">${data.proUsers}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:4px">Pro会員数</div>
        </td>
      </tr>
      <tr>
        <td style="padding:12px;background:#fff7ed;border-radius:0 0 0 8px;text-align:center">
          <div style="font-size:24px;font-weight:bold;color:#c2410c">${data.totalUsers}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:4px">総ユーザー数</div>
        </td>
        <td style="padding:12px;background:#faf5ff;border-radius:0 0 8px 0;text-align:center">
          <div style="font-size:24px;font-weight:bold;color:#7e22ce">${data.totalSessions}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:4px">総セッション</div>
        </td>
      </tr>
    </table>

    <h2 style="font-size:14px;color:#111;margin:0 0 12px;border-bottom:1px solid #e5e7eb;padding-bottom:8px">今週のハイライト</h2>
    <table style="width:100%;font-size:13px;color:#374151;line-height:2">
      <tr><td>新規ユーザー</td><td style="text-align:right;font-weight:bold">+${data.newUsersThisWeek}</td></tr>
      <tr><td>今週のセッション</td><td style="text-align:right;font-weight:bold">${data.sessionsThisWeek}</td></tr>
      <tr><td>トライアル→Pro転換</td><td style="text-align:right;font-weight:bold">${data.trialConversions}</td></tr>
      <tr><td>解約</td><td style="text-align:right;font-weight:bold;color:${data.churnedThisWeek > 0 ? '#ef4444' : '#10b981'}">${data.churnedThisWeek}</td></tr>
      <tr><td>リード獲得</td><td style="text-align:right;font-weight:bold">${data.leadsCaptured}</td></tr>
    </table>

    <div style="text-align:center;margin:24px 0 0">
      <a href="${APP_URL}/admin" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        管理ダッシュボードを開く →
      </a>
    </div>
  </div>
  <p style="font-size:11px;color:#9ca3af;text-align:center;margin:16px 0 0">
    © 成約コーチ AI — Admin Report
  </p>
</div>
</body>
</html>`,
  };
}

/** Monthly-to-annual upgrade prompt email */
function monthlyToAnnualEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "【年間プランに切替で2ヶ月分お得】いつもご利用ありがとうございます",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">年間プランで2ヶ月分お得に</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      いつも成約コーチ AIをご利用いただきありがとうございます。
    </p>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">
      月額プランを継続いただいている感謝を込めて、<strong>年間プランのご案内</strong>です。
    </p>
    <div style="background:#fff7ed;border-radius:12px;padding:20px;margin:0 0 24px;text-align:center">
      <div style="margin:0 0 8px">
        <span style="font-size:14px;color:#9ca3af;text-decoration:line-through">月額 ¥2,980 × 12ヶ月 = ¥35,760</span>
      </div>
      <div style="font-size:28px;font-weight:bold;color:#f97316;margin:0 0 4px">
        ¥29,800<span style="font-size:14px;color:#374151;font-weight:normal">/年</span>
      </div>
      <div style="font-size:13px;color:#f97316;font-weight:bold">
        ¥5,960お得（約2ヶ月分無料）
      </div>
    </div>
    <div style="text-align:center;margin:0 0 24px">
      <a href="${APP_URL}/settings" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:bold">
        年間プランに切り替える →
      </a>
    </div>
    <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0">
      設定ページの「請求・サブスクリプション管理」から変更できます
    </p>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

export type AdminAlertType = "churn_spike" | "mrr_drop" | "cron_failure" | "predictive_churn_spike";

export interface AdminAlertData {
  alertType: AdminAlertType;
  value: number;
  threshold: number;
  details: string;
}

export type AdminEmailType = "weekly_revenue_report" | "admin_alert";

export interface WeeklyRevenueData {
  totalUsers: number;
  newUsersThisWeek: number;
  proUsers: number;
  mrr: number;
  totalSessions: number;
  sessionsThisWeek: number;
  churnedThisWeek: number;
  trialConversions: number;
  leadsCaptured: number;
}

function programPurchasedEmail(unsubscribeUrl?: string): { subject: string; html: string } {
  return {
    subject: "【購入完了】成約5ステップ完全攻略プログラム — さっそく学習を始めましょう",
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px;text-align:center">ご購入ありがとうございます！</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 16px">
      「成約5ステップ完全攻略プログラム」のお支払いが完了しました。22レッスンで営業の「型」を体系的に習得できます。
    </p>
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:16px;margin:0 0 16px">
      <p style="font-size:13px;color:#9a3412;margin:0;font-weight:bold">まず最初にやること：</p>
      <p style="font-size:13px;color:#374151;margin:8px 0 0;line-height:1.8">
        1. 学習コースを開始する（1レッスン約5分）<br>
        2. 各ステップを学んだらAIロープレで実践<br>
        3. スコアで弱点を発見し集中改善
      </p>
    </div>
    <div style="text-align:center;margin:24px 0">
      <a href="${APP_URL}/learn" style="display:inline-block;background:#f97316;color:#fff;font-size:14px;font-weight:bold;padding:12px 32px;border-radius:8px;text-decoration:none">
        学習を始める
      </a>
    </div>
    <p style="font-size:12px;color:#6b7280;text-align:center;margin:16px 0 0">
      買い切り型なので、いつでも何度でも復習できます。
    </p>
  </div>
  ${emailFooter(unsubscribeUrl)}
</div>
</body>
</html>`,
  };
}

export type OnboardingEmailType = "welcome" | "first_roleplay" | "third_roleplay";
export type TransactionalEmailType = "payment_failed" | "payment_failed_day4" | "payment_failed_day7" | "subscription_canceled" | "pro_welcome" | "pro_onboarding_day1" | "pro_onboarding_day3" | "pro_onboarding_day7" | "pause_resuming_3days" | "referral_reward" | "winback_7days" | "winback_30days" | "checkout_abandoned" | "weekly_digest" | "program_purchased";
export type TrialEmailType = "trial_expiring_3days" | "trial_expiring_1day" | "trial_expiring_6days" | "trial_expired";
export type EngagementEmailType = "inactive_reminder" | "no_roleplay_day3" | "power_user_upgrade" | "referral_nudge" | "nps_survey" | "at_risk_intervention" | "monthly_to_annual" | "predictive_churn" | "streak_milestone";

const EMAIL_TEMPLATES: Record<OnboardingEmailType, (unsubscribeUrl?: string) => { subject: string; html: string }> = {
  welcome: welcomeEmail,
  first_roleplay: firstRoleplayEmail,
  third_roleplay: thirdRoleplayEmail,
};

const TRANSACTIONAL_TEMPLATES: Record<TransactionalEmailType, (unsubscribeUrl?: string) => { subject: string; html: string }> = {
  payment_failed: paymentFailedEmail,
  payment_failed_day4: paymentFailedDay4Email,
  payment_failed_day7: paymentFailedDay7Email,
  subscription_canceled: subscriptionCanceledEmail,
  pro_welcome: proWelcomeEmail,
  pro_onboarding_day1: proOnboardingDay1Email,
  pro_onboarding_day3: proOnboardingDay3Email,
  pro_onboarding_day7: proOnboardingDay7Email,
  pause_resuming_3days: pauseResuming3DaysEmail,
  referral_reward: referralRewardEmail,
  winback_7days: winback7DaysEmail,
  winback_30days: winback30DaysEmail,
  checkout_abandoned: checkoutAbandonedEmail,
  weekly_digest: weeklyDigestEmail,
  program_purchased: programPurchasedEmail,
};

const TRIAL_TEMPLATES: Record<TrialEmailType, (unsubscribeUrl?: string) => { subject: string; html: string }> = {
  trial_expiring_3days: trialExpiring3DaysEmail,
  trial_expiring_1day: trialExpiring1DayEmail,
  trial_expiring_6days: trialExpiring6DaysEmail,
  trial_expired: trialExpiredEmail,
};

const ENGAGEMENT_TEMPLATES: Record<EngagementEmailType, (unsubscribeUrl?: string) => { subject: string; html: string }> = {
  inactive_reminder: inactiveReminderEmail,
  no_roleplay_day3: noRoleplayDay3Email,
  power_user_upgrade: powerUserUpgradeEmail,
  referral_nudge: referralNudgeEmail,
  nps_survey: npsSurveyEmail,
  at_risk_intervention: atRiskInterventionEmail,
  monthly_to_annual: monthlyToAnnualEmail,
  predictive_churn: predictiveChurnEmail,
  streak_milestone: streakMilestoneEmail,
};

// ── Sending Logic ──

/**
 * Send an onboarding email. Fire-and-forget — never throws.
 * Returns true if sent successfully, false otherwise.
 */
export async function sendOnboardingEmail(
  to: string,
  emailType: OnboardingEmailType,
  userId?: string
): Promise<boolean> {
  try {
    const resend = getResend();
    if (!resend) return false;

    const unsubscribeUrl = userId ? getUnsubscribeUrl(userId) : undefined;
    const template = EMAIL_TEMPLATES[emailType](unsubscribeUrl);
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: template.subject,
      html: template.html,
    });
    return true;
  } catch (err) {
    console.error(`[email] Failed to send ${emailType} to ${to}:`, err);
    return false;
  }
}

/**
 * Check if an onboarding email has already been sent, and send it if not.
 * Uses Supabase table `onboarding_emails` to track sent emails.
 * Designed to be called from API routes — never blocks/throws.
 */
/**
 * Send a transactional email (payment failures, cancellations, etc.).
 * Fire-and-forget — never throws.
 */
export async function sendTransactionalEmail(
  to: string,
  emailType: TransactionalEmailType,
  userId?: string
): Promise<boolean> {
  try {
    const resend = getResend();
    if (!resend) return false;

    const unsubscribeUrl = userId ? getUnsubscribeUrl(userId) : undefined;
    const template = TRANSACTIONAL_TEMPLATES[emailType](unsubscribeUrl);
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: template.subject,
      html: template.html,
    });
    return true;
  } catch (err) {
    console.error(`[email] Failed to send ${emailType} to ${to}:`, err);
    return false;
  }
}

/**
 * Send a trial-related email. Fire-and-forget — never throws.
 */
export async function sendTrialEmail(
  to: string,
  emailType: TrialEmailType,
  userId?: string
): Promise<boolean> {
  try {
    const resend = getResend();
    if (!resend) return false;

    const unsubscribeUrl = userId ? getUnsubscribeUrl(userId) : undefined;
    const template = TRIAL_TEMPLATES[emailType](unsubscribeUrl);
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: template.subject,
      html: template.html,
    });
    return true;
  } catch (err) {
    console.error(`[email] Failed to send ${emailType} to ${to}:`, err);
    return false;
  }
}

/**
 * Send an engagement email. Fire-and-forget — never throws.
 */
export async function sendEngagementEmail(
  to: string,
  emailType: EngagementEmailType,
  userId?: string
): Promise<boolean> {
  try {
    const resend = getResend();
    if (!resend) return false;

    const unsubscribeUrl = userId ? getUnsubscribeUrl(userId) : undefined;
    const template = ENGAGEMENT_TEMPLATES[emailType](unsubscribeUrl);
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: template.subject,
      html: template.html,
    });
    return true;
  } catch (err) {
    console.error(`[email] Failed to send ${emailType} to ${to}:`, err);
    return false;
  }
}

/**
 * Send admin revenue report email. Fire-and-forget — never throws.
 */
export async function sendAdminEmail(
  to: string,
  emailType: AdminEmailType,
  data: WeeklyRevenueData | AdminAlertData
): Promise<boolean> {
  try {
    const resend = getResend();
    if (!resend) return false;

    let template;
    if (emailType === "admin_alert") {
      const alertData = data as AdminAlertData;
      template = alertData.alertType === "cron_failure"
        ? cronFailureAlertEmail(alertData)
        : adminAlertEmail(alertData);
    } else {
      template = weeklyRevenueReportEmail(data as WeeklyRevenueData);
    }
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: template.subject,
      html: template.html,
    });
    return true;
  } catch (err) {
    console.error(`[email] Failed to send admin ${emailType} to ${to}:`, err);
    return false;
  }
}

/**
 * Send an email with optional A/B test variant override.
 * If abSubjectOverride is provided, it replaces the default subject line.
 */
export async function sendEmailWithABVariant(
  to: string,
  emailType: EngagementEmailType | TransactionalEmailType | TrialEmailType,
  userId?: string,
  abSubjectOverride?: string
): Promise<boolean> {
  try {
    const resend = getResend();
    if (!resend) return false;

    const unsubscribeUrl = userId ? getUnsubscribeUrl(userId) : undefined;

    // Try each template map
    let template: { subject: string; html: string } | null = null;
    if (emailType in ENGAGEMENT_TEMPLATES) {
      template = ENGAGEMENT_TEMPLATES[emailType as EngagementEmailType](unsubscribeUrl);
    } else if (emailType in TRANSACTIONAL_TEMPLATES) {
      template = TRANSACTIONAL_TEMPLATES[emailType as TransactionalEmailType](unsubscribeUrl);
    } else if (emailType in TRIAL_TEMPLATES) {
      template = TRIAL_TEMPLATES[emailType as TrialEmailType](unsubscribeUrl);
    }

    if (!template) return false;

    // Apply A/B test subject override
    const subject = abSubjectOverride || template.subject;

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: template.html,
    });
    return true;
  } catch (err) {
    console.error(`[email] Failed to send ${emailType} to ${to}:`, err);
    return false;
  }
}

export async function trySendOnboardingEmail(
  supabase: { from: (table: string) => ReturnType<import("@supabase/supabase-js").SupabaseClient["from"]> },
  userId: string,
  userEmail: string,
  emailType: OnboardingEmailType
): Promise<void> {
  try {
    // Check if already sent
    const { data } = await supabase
      .from("onboarding_emails")
      .select("id")
      .eq("user_id", userId)
      .eq("email_type", emailType)
      .limit(1);

    if (data && data.length > 0) return; // Already sent

    // Send email with unsubscribe link
    const sent = await sendOnboardingEmail(userEmail, emailType, userId);
    if (!sent) return;

    // Record that we sent it
    await supabase.from("onboarding_emails").insert({
      user_id: userId,
      email_type: emailType,
    });
  } catch {
    // Never block the main flow — silently fail
  }
}
