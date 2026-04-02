# Part 4: 構造化データ（JSON-LD）完全実装ガイド

**実装日:** 2026-03-15

---

## 実装済みスキーマ一覧

### 1. ルートLayout (`src/app/layout.tsx`) — 実装済み
```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization" },
    { "@type": "WebSite" }
  ]
}
```

### 2. ホームページ (`src/app/page.tsx`) — 実装済み
```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SoftwareApplication", "offers": [...] },
    { "@type": "FAQPage" },
    { "@type": "BreadcrumbList" }
  ]
}
```

### 3. 料金ページ (`src/app/pricing/layout.tsx`) — 実装済み
```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Product", "offers": [...] },
    { "@type": "FAQPage" },
    { "@type": "BreadcrumbList" }
  ]
}
```

### 4. ブログ記事 (`src/app/blog/[slug]/page.tsx`) — 実装済み
```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Article" },
    { "@type": "BreadcrumbList" }
  ]
}
```

---

## 今回新規実装したスキーマ

### 5. /about — AboutPage + BreadcrumbList ✅
### 6. /features — WebPage + BreadcrumbList ✅
### 7. /use-cases — WebPage + BreadcrumbList ✅
### 8. /blog (一覧) — CollectionPage + ItemList + BreadcrumbList ✅
### 9. /worksheet — HowTo (5ステップ) + BreadcrumbList ✅
### 10. /learn — Course + BreadcrumbList ✅

---

## 追加実装テンプレート

### 11. VideoObject スキーマ（将来のデモ動画用テンプレート）

デモ動画を公開した際に、対応するページの JSON-LD `@graph` 配列に追加してください。

```typescript
// 使用方法: 任意のページのJSON-LD @graph配列に追加
{
  "@type": "VideoObject",
  name: "成約コーチ AI デモ動画 - AIロープレの使い方",
  description:
    "成約コーチ AIのAIロープレ機能のデモ動画です。業種・商材の入力からAIお客さんとの商談、成約スコアリングまでの一連の流れを紹介します。",
  thumbnailUrl: `${siteUrl}/images/demo-thumbnail.jpg`,
  uploadDate: "2026-03-15",
  duration: "PT3M30S", // 動画の長さ（ISO 8601形式）
  contentUrl: `${siteUrl}/videos/demo.mp4`, // または YouTube URL
  embedUrl: "https://www.youtube.com/embed/XXXXX", // YouTube埋め込みURL
  publisher: { "@id": `${siteUrl}/#organization` },
  inLanguage: "ja",
}
```

**React コンポーネントとして使う場合:**

```tsx
// src/components/video-json-ld.tsx
import { JsonLd } from "@/components/json-ld";

interface VideoJsonLdProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  contentUrl?: string;
  embedUrl?: string;
}

export function VideoJsonLd({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl,
  embedUrl,
}: VideoJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sokukime-ai.vercel.app";

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name,
        description,
        thumbnailUrl,
        uploadDate,
        duration,
        ...(contentUrl && { contentUrl }),
        ...(embedUrl && { embedUrl }),
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "ja",
      }}
    />
  );
}
```

### 12. /industry/[slug] 業種別ページ用テンプレート

```typescript
// 業種別ページで使用するJSON-LD
const industryJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/industry/${industry.slug}#webpage`,
      name: `${industry.name}向け営業ロープレAI練習 | 成約コーチ AI`,
      description: `成約コーチ AIの${industry.name}向けAIロープレでは、${industry.name}特有の商談シーンを再現し、成約5ステップメソッドに基づいた実践的な練習ができます。`,
      url: `${siteUrl}/industry/${industry.slug}`,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#application` },
      inLanguage: "ja",
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/industry/${industry.slug}#faq`,
      mainEntity: industry.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/industry/${industry.slug}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "業種別", item: `${siteUrl}/industry` },
        { "@type": "ListItem", position: 3, name: industry.name, item: `${siteUrl}/industry/${industry.slug}` },
      ],
    },
  ],
};
```

---

## スキーマ検証方法

実装後、以下のツールで検証してください:

1. **Google Rich Results Test:** https://search.google.com/test/rich-results
2. **Schema.org Validator:** https://validator.schema.org/
3. **Google Search Console:** 構造化データレポートでエラーを確認

---

## ページ別実装状況まとめ

| ページ | Organization | WebSite | BreadcrumbList | 固有スキーマ | 状態 |
|--------|:-----------:|:-------:|:--------------:|:----------:|:----:|
| layout.tsx | ✅ | ✅ | - | - | 完了 |
| / | - | - | ✅ | SoftwareApplication, FAQPage | 完了 |
| /pricing | - | - | ✅ | Product, Offer, FAQPage | 完了 |
| /blog/[slug] | - | - | ✅ | Article | 完了 |
| /about | - | - | ✅ | AboutPage | 完了 |
| /features | - | - | ✅ | WebPage | 完了 |
| /use-cases | - | - | ✅ | WebPage | 完了 |
| /blog | - | - | ✅ | CollectionPage, ItemList | 完了 |
| /worksheet | - | - | ✅ | HowTo (5ステップ) | 完了 |
| /learn | - | - | ✅ | Course | 完了 |
| /industry/[slug] | - | - | ✅ | WebPage, FAQPage | テンプレート準備済 |
| 動画ページ | - | - | - | VideoObject | テンプレート準備済 |
