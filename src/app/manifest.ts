import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "成約コーチAI - AI営業ロープレコーチ",
    short_name: "成約コーチAI",
    description:
      "AIとロープレして営業スキルを磨こう。リアルな商談シミュレーションで成約率アップ。",
    start_url: "/",
    display: "standalone",
    theme_color: "#f97316",
    background_color: "#FBF8F3",
    categories: ["education", "productivity", "business"],
    icons: [
      {
        src: "/pwa-icon/192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-icon/512",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "ロープレを開始",
        url: "/roleplay",
        description: "AIとの営業ロープレを開始します",
      },
      {
        name: "営業の型を学ぶ",
        url: "/learn",
        description: "成約5ステップメソッドを学習します",
      },
    ],
  };
}
