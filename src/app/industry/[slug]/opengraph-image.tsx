import { ImageResponse } from "next/og";
import { getIndustryBySlug, getAllIndustrySlugs } from "@/data/industries";

export const alt = "成約コーチ AI 業種別ロープレ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllIndustrySlugs().map((slug) => ({ slug }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);

  const name = industry?.name || "業種別";
  const title = industry?.heroTitle || `${name}営業ロープレ`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0f1a",
          position: "relative",
          overflow: "hidden",
          padding: "60px 80px",
        }}
      >
        {/* Background accent circles */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)",
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
              "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)",
            bottom: "-150px",
            left: "-100px",
          }}
        />

        {/* Top bar: logo + category */}
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
              成約コーチ AI
            </div>
          </div>

          <div
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#f97316",
              backgroundColor: "rgba(249,115,22,0.15)",
              borderRadius: "20px",
              padding: "8px 20px",
            }}
          >
            業種別ロープレ
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
              fontSize: title.length > 25 ? "48px" : "56px",
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
            AIがリアルなお客さん役を演じる営業ロープレ
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#f97316",
              fontWeight: 600,
            }}
          >
            seiyaku-coach.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
