import type { Metadata } from "next";
import { VirtualRoleplayClient } from "./client-wrapper";

export const metadata: Metadata = {
  title: "3Dバーチャル営業ロープレ｜成約コーチAI",
  description:
    "3D仮想空間でリアルな営業ロープレを体験。AIがお客さん役を演じ、バーチャルオフィスで商談の練習ができます。登録不要・無料。",
  alternates: { canonical: "/tools/virtual-roleplay" },
};

export default function VirtualRoleplayPage() {
  return <VirtualRoleplayClient />;
}
