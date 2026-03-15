import { JsonLd } from "@/components/json-ld";

interface VideoJsonLdProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  /** ISO 8601 duration format, e.g. "PT3M30S" */
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
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://sokukime-ai.vercel.app";

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
