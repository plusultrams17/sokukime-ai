import { NextResponse } from "next/server";

/**
 * 【2026-04-10 廃止】買い切りプログラム (¥9,800) は販売終了。
 *
 * Option B+ 戦略に基づき、サブスクリプション (Starter ¥990 / Pro ¥1,980 / Master ¥4,980) に
 * 一本化しました。新規購入リクエストは 410 Gone を返し、フロント側で /pricing にリダイレクトします。
 *
 * 既存の購入者 (program_purchases テーブル + profiles.subscription_status='program')
 * は変更なく永続的に Pro 機能を利用できます。Webhook 側の処理も互換性のため維持。
 *
 * @deprecated 2026-04-10 — サブスクリプションへ統合。/pricing を案内してください。
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "program_discontinued",
      message:
        "買い切りプログラムは販売終了しました。月額サブスクリプション（Starter ¥990 / Pro ¥1,980 / Master ¥4,980）にすべての機能が含まれています。",
      redirect: "/pricing",
    },
    { status: 410 }, // 410 Gone
  );
}
