import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "成約コーチ AI - AI営業ロープレコーチ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a2e",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Orange radial gradient */}
        <div
          style={{
            position: "absolute",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.05) 40%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Subtle top-right accent blob */}
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
            top: "-80px",
            right: "-60px",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          {/* Logo badge */}
          <div
            style={{
              fontSize: "36px",
              fontWeight: 800,
              color: "#ffffff",
              backgroundColor: "#f97316",
              borderRadius: "16px",
              padding: "12px 28px",
              marginBottom: "28px",
              boxShadow: "0 4px 24px rgba(249,115,22,0.3)",
            }}
          >
            SC
          </div>

          {/* Main title */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: "16px",
              letterSpacing: "-0.02em",
            }}
          >
            成約コーチ AI
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "32px",
              fontWeight: 600,
              color: "#f97316",
              marginBottom: "16px",
            }}
          >
            AIとロープレして成約率を上げろ。
          </div>

          {/* Sub text */}
          <div
            style={{
              fontSize: "20px",
              color: "#94a3b8",
            }}
          >
            営業心理学ベースのAIコーチング | 無料で始められる
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
