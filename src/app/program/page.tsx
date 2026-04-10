import { redirect } from "next/navigation";

/**
 * 【2026-04-10 廃止】
 *
 * 買い切りプログラム (¥9,800) は販売終了。
 * Proプラン (¥2,980/月) に全機能を統合したため、
 * このページは /pricing へ 308 リダイレクトします。
 *
 * 既存購入者は /program/resources で引き続き資料にアクセスできます。
 *
 * @deprecated 2026-04-10 — Pro プランへ統合
 */
export default function ProgramPage() {
  redirect("/pricing");
}
