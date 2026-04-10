import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "ページ移転 | 成約コーチAI",
  robots: { index: false },
};

/**
 * 【2026-04-10 廃止】
 *
 * 買い切りプログラムの購入完了画面。新規購入停止に伴い、
 * 既存購入者は /program/resources にアクセスすると資料を閲覧できます。
 * それ以外の訪問者は /pricing にリダイレクトします。
 */
export default function ProgramSuccessPage() {
  redirect("/program/resources");
}
