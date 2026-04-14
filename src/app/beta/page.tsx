import { redirect } from "next/navigation";

// ベータ募集はリリース済みのため終了。料金ページへリダイレクト。
export default function BetaPage() {
  redirect("/pricing");
}
