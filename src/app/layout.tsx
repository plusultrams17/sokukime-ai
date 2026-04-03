import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics, MicrosoftClarity } from "@/components/analytics";
import { ScrollDepthTracker } from "@/components/scroll-depth-tracker";
import { JsonLd } from "@/components/json-ld";
import { CookieConsent } from "@/components/cookie-consent";
import { PromoBanner } from "@/components/promo-banner";
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

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "業種別営業学習プログラム | 成約コーチ AI - 営業の「型」を体系的に習得",
    template: "%s | 成約コーチ AI",
  },
  description:
    "営業心理学に基づく「成約5ステップメソッド」を22レッスンで体系的に学べる業種別営業学習プログラム。業種別トークスクリプト・切り返し話法・AIロープレ練習で営業力を底上げ。無料で始められます。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: "成約コーチ AI",
    title: "業種別営業学習プログラム | 成約コーチ AI - 営業の「型」を体系的に習得",
    description:
      "営業心理学に基づく「成約5ステップメソッド」を22レッスンで体系的に学べる業種別営業学習プログラム。業種別トークスクリプト・切り返し話法・AIロープレ練習で営業力を底上げ。無料で始められます。",
  },
  twitter: {
    card: "summary_large_image",
    title: "業種別営業学習プログラム | 成約コーチ AI - 営業の「型」を体系的に習得",
    description:
      "営業心理学に基づく「成約5ステップメソッド」を22レッスンで体系的に学べる業種別営業学習プログラム。業種別トークスクリプト・切り返し話法・AIロープレ練習で営業力を底上げ。無料で始められます。",
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
    types: {
      "application/rss+xml": "/feed.xml",
    },
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
        <MicrosoftClarity />
        <ScrollDepthTracker />
        <PromoBanner />
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
                contactPoint: {
                  "@type": "ContactPoint",
                  email: "support@seiyaku-coach.com",
                  contactType: "customer support",
                  availableLanguage: "Japanese",
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
        <CookieConsent />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
