import { redirect } from "next/navigation";

/**
 * 【2026-04-10 廃止】
 *
 * 買い切りプログラム (¥9,800) は販売終了。
 * 月額サブスクリプション (ライト ¥2,980 / プロ ¥6,980 / 無制限 ¥14,800) に
 * 全機能を統合したため、このページは /pricing へ 308 リダイレクトします。
 *
 * 既存購入者は /program/resources で引き続き資料にアクセスできます。
 *
 * @deprecated 2026-04-10 — サブスクリプションへ統合
 */
export default function ProgramPage() {
  redirect("/pricing");
}
