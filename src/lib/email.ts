import { Resend } from "resend";

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

// ── Email Templates ──

function welcomeEmail(): { subject: string; html: string } {
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
    <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0">
      無料プランでも1日1回AIロープレが体験できます
    </p>
  </div>
  <p style="font-size:11px;color:#9ca3af;text-align:center;margin:16px 0 0">
    © 成約コーチ AI　|　<a href="${APP_URL}" style="color:#9ca3af">seiyaku-coach.com</a>
  </p>
</div>
</body>
</html>`,
  };
}

function firstRoleplayEmail(): { subject: string; html: string } {
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
  <p style="font-size:11px;color:#9ca3af;text-align:center;margin:16px 0 0">
    © 成約コーチ AI　|　<a href="${APP_URL}" style="color:#9ca3af">seiyaku-coach.com</a>
  </p>
</div>
</body>
</html>`,
  };
}

function thirdRoleplayEmail(): { subject: string; html: string } {
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
  <p style="font-size:11px;color:#9ca3af;text-align:center;margin:16px 0 0">
    © 成約コーチ AI　|　<a href="${APP_URL}" style="color:#9ca3af">seiyaku-coach.com</a>
  </p>
</div>
</body>
</html>`,
  };
}

// ── Email Types ──

export type OnboardingEmailType = "welcome" | "first_roleplay" | "third_roleplay";

const EMAIL_TEMPLATES: Record<OnboardingEmailType, () => { subject: string; html: string }> = {
  welcome: welcomeEmail,
  first_roleplay: firstRoleplayEmail,
  third_roleplay: thirdRoleplayEmail,
};

// ── Sending Logic ──

/**
 * Send an onboarding email. Fire-and-forget — never throws.
 * Returns true if sent successfully, false otherwise.
 */
export async function sendOnboardingEmail(
  to: string,
  emailType: OnboardingEmailType
): Promise<boolean> {
  try {
    const resend = getResend();
    if (!resend) return false;

    const template = EMAIL_TEMPLATES[emailType]();
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

    // Send email
    const sent = await sendOnboardingEmail(userEmail, emailType);
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
