import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/roleplay"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/", "/auth/", "/roleplay"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/api/", "/auth/", "/roleplay"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/", "/auth/", "/roleplay"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "Amazonbot",
        allow: "/",
        disallow: ["/api/", "/auth/", "/roleplay"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
