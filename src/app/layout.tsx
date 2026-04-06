import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_JP } from "next/font/google";
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

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-serif-jp",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "業種別営業学習プログラム | 成約コーチ AI - 営業の「型」を体系的に習得",
    template: "%s | 成約コーチ AI",
  },
  description:
    "成約コーチAIは営業心理学に基づく22レッスンとAIロープレで営業スキルを体系的に習得できる無料サービスです",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: "成約コーチ AI",
    title: "業種別営業学習プログラム | 成約コーチ AI - 営業の「型」を体系的に習得",
    description:
      "成約コーチAIは営業心理学に基づく22レッスンとAIロープレで営業スキルを体系的に習得できる無料サービスです",
  },
  twitter: {
    card: "summary_large_image",
    title: "業種別営業学習プログラム | 成約コーチ AI - 営業の「型」を体系的に習得",
    description:
      "成約コーチAIは営業心理学に基づく22レッスンとAIロープレで営業スキルを体系的に習得できる無料サービスです",
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
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerifJP.variable} font-sans antialiased`}
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
