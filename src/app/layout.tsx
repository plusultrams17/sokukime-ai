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

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "成約コーチ AI | AI営業ロープレコーチ",
    template: "%s | 成約コーチ AI",
  },
  description:
    "AIがお客さん役になって営業ロープレ。営業心理学に基づくリアルタイムフィードバックで、あなたの成約率を劇的に上げる。",
  keywords: [
    "営業ロープレ",
    "AIコーチ",
    "営業トレーニング",
    "セールス練習",
    "成約コーチ AI",
    "営業力向上",
    "成約率アップ",
    "営業心理学",
  ],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: "成約コーチ AI",
    title: "成約コーチ AI | AI営業ロープレコーチ",
    description:
      "AIがお客さん役になって営業ロープレ。営業心理学に基づくリアルタイムフィードバックで、あなたの成約率を劇的に上げる。",
  },
  twitter: {
    card: "summary_large_image",
    title: "成約コーチ AI | AI営業ロープレコーチ",
    description:
      "AIがお客さん役になって営業ロープレ。営業心理学に基づくリアルタイムフィードバックで、あなたの成約率を劇的に上げる。",
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
            name: "成約コーチ AI",
            url: SITE_URL,
            description:
              "AI × 成約メソッドで営業力を鍛えるロープレコーチングサービス",
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "成約コーチ AI",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: SITE_URL,
            description:
              "AIがお客さん役になって営業ロープレ。営業心理学に基づくリアルタイムフィードバックで、あなたの成約率を劇的に上げる。",
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
