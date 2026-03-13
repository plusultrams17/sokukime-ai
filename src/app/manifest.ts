import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "即キメAI - AI即決営業ロープレコーチ",
    short_name: "即キメAI",
    description:
      "AIとロープレして即決営業スキルを磨こう。リアルな商談シミュレーションで成約率アップ。",
    start_url: "/",
    display: "standalone",
    theme_color: "#f97316",
    background_color: "#0a0a0a",
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
  };
}
