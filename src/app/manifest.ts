import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "成約コーチ AI - AI営業ロープレコーチ",
    short_name: "成約コーチ AI",
    description:
      "AIとロープレして営業スキルを磨こう。リアルな商談シミュレーションで成約率アップ。",
    start_url: "/",
    display: "standalone",
    theme_color: "#1B6B5A",
    background_color: "#FBF8F3",
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
