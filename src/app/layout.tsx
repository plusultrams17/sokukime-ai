import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics";
import { ScrollDepthTracker } from "@/components/scroll-depth-tracker";
import { JsonLd } from "@/components/json-ld";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "営業ロープレAI練習アプリ | 成約コーチ AI - 無料で営業研修",
    template: "%s | 成約コーチ AI",
  },
  description:
    "AIがリアルなお客さん役を演じる営業ロープレ練習アプリ。クロージング・反論処理を24時間練習。成約率を上げる5ステップメソッドで営業研修を効率化。登録不要・無料。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: "成約コーチ AI",
    title: "営業ロープレAI練習アプリ | 成約コーチ AI - 無料で営業研修",
    description:
      "AIがリアルなお客さん役を演じる営業ロープレ練習アプリ。クロージング・反論処理を24時間練習。成約率を上げる5ステップメソッドで営業研修を効率化。登録不要・無料。",
  },
  twitter: {
    card: "summary_large_image",
    title: "営業ロープレAI練習アプリ | 成約コーチ AI - 無料で営業研修",
    description:
      "AIがリアルなお客さん役を演じる営業ロープレ練習アプリ。クロージング・反論処理を24時間練習。成約率を上げる5ステップメソッドで営業研修を効率化。登録不要・無料。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <GoogleAnalytics />
        <ScrollDepthTracker />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                name: "成約コーチ AI",
                url: SITE_URL,
                description:
                  "AI × 営業心理学メソッドで営業力を鍛えるロープレコーチングサービス",
                logo: {
                  "@type": "ImageObject",
                  url: `${SITE_URL}/favicon.ico`,
                },
              },
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                name: "成約コーチ AI",
                url: SITE_URL,
                description:
                  "AIがリアルなお客さん役を演じる営業ロープレ練習アプリ。成約率を上げる5ステップメソッドで営業研修を効率化。",
                publisher: { "@id": `${SITE_URL}/#organization` },
                inLanguage: "ja",
              },
            ],
          }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
