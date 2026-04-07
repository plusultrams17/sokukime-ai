import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateUnsubscribeToken } from "@/lib/unsubscribe";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

/**
 * GET /api/unsubscribe?uid=xxx&token=xxx
 * Sets email_unsubscribed=true in profiles and shows confirmation page.
 */
export async function GET(request: NextRequest) {
  const uid = request.nextUrl.searchParams.get("uid");
  const token = request.nextUrl.searchParams.get("token");

  if (!uid || !token) {
    return new Response(htmlPage("無効なリンクです", "リンクが正しくありません。"), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const expectedToken = generateUnsubscribeToken(uid);
  if (token !== expectedToken) {
    return new Response(htmlPage("無効なリンクです", "リンクの有効期限が切れているか、不正なリンクです。"), {
      status: 403,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(htmlPage("エラー", "サービスが一時的に利用できません。"), {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  await supabase
    .from("profiles")
    .update({ email_unsubscribed: true })
    .eq("id", uid);

  return new Response(
    htmlPage(
      "配信を停止しました",
      "メール配信を停止しました。今後、お知らせメールは届きません。<br>サービスは引き続きご利用いただけます。<br><br>再度受信を希望される場合は、アプリ内の設定から変更できます。"
    ),
    {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }
  );
}

function htmlPage(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | 成約コーチAI</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Hiragino Kaku Gothic Pro','メイリオ',sans-serif">
<div style="max-width:480px;margin:0 auto;padding:64px 16px;text-align:center">
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
    <h1 style="font-size:20px;color:#111;margin:0 0 16px">${title}</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px">${body}</p>
    <a href="${APP_URL}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:bold">
      成約コーチAIに戻る
    </a>
  </div>
</div>
</body>
</html>`;
}
