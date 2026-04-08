import type { Metadata } from "next";
import { VirtualRoleplayClient } from "./client-wrapper";

export const metadata: Metadata = {
  title: "3Dバーチャル商談チャレンジ｜成約コーチAI",
  description:
    "3D仮想空間の社長室でAI相手にリアル商談。バーチャルオフィスで営業力を試せ。登録不要・無料。",
  alternates: { canonical: "/challenge/virtual-roleplay" },
};

export default function Page() {
  return <VirtualRoleplayClient />;
}
