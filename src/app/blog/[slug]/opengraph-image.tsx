import { ImageResponse } from "next/og";
import { getBlogPost, getAllBlogPosts } from "@/lib/blog";

export const alt = "成約コーチAI ブログ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({
    slug: post.slug,
  }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  const title = post?.title || "ブログ記事";
  const tags = post?.tags || [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#1a1a2e",
          position: "relative",
          overflow: "hidden",
          padding: "60px 80px",
        }}
      >
        {/* Background accent */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
            top: "-200px",
            right: "-100px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
            bottom: "-150px",
            left: "-100px",
          }}
        />

        {/* Top bar: logo + tags */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "40px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#ffffff",
                backgroundColor: "#f97316",
                borderRadius: "10px",
                padding: "6px 16px",
              }}
            >
              SC
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              成約コーチAI
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {tags.slice(0, 3).map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#f97316",
                  backgroundColor: "rgba(249,115,22,0.15)",
                  borderRadius: "20px",
                  padding: "6px 16px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Main title */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: title.length > 30 ? "48px" : "56px",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "18px",
              color: "#94a3b8",
            }}
          >
            営業ノウハウブログ
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#f97316",
              fontWeight: 600,
            }}
          >
            seiyaku-coach.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
