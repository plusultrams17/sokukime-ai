import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics";
import { JsonLd } from "@/components/json-ld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sokukime.ai";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "即キメAI | AI即決営業ロープレコーチ",
    template: "%s | 即キメAI",
  },
  description:
    "AIがお客さん役になって営業ロープレ。即決営業メソッドに基づくリアルタイムフィードバックで、あなたの成約率を劇的に上げる。",
  keywords: [
    "即決営業",
    "営業ロープレ",
    "AIコーチ",
    "営業トレーニング",
    "セールス練習",
    "即キメAI",
    "営業力向上",
    "成約率アップ",
  ],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: "即キメAI",
    title: "即キメAI | AI即決営業ロープレコーチ",
    description:
      "AIがお客さん役になって営業ロープレ。即決営業メソッドに基づくリアルタイムフィードバックで、あなたの成約率を劇的に上げる。",
  },
  twitter: {
    card: "summary_large_image",
    title: "即キメAI | AI即決営業ロープレコーチ",
    description:
      "AIがお客さん役になって営業ロープレ。即決営業メソッドに基づくリアルタイムフィードバックで、あなたの成約率を劇的に上げる。",
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
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "即キメAI",
            url: SITE_URL,
            description:
              "AI × 即決営業メソッドで営業力を鍛えるロープレコーチングサービス",
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "即キメAI",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: SITE_URL,
            description:
              "AIがお客さん役になって営業ロープレ。即決営業メソッドに基づくリアルタイムフィードバックで、あなたの成約率を劇的に上げる。",
            offers: {
              "@type": "Offer",
              price: "2980",
              priceCurrency: "JPY",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
