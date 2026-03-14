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
          backgroundColor: "#FBF8F3",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Teal radial gradient circle */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(27,107,90,0.2) 0%, rgba(27,107,90,0.05) 50%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
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
              backgroundColor: "#1B6B5A",
              borderRadius: "16px",
              padding: "12px 24px",
              marginBottom: "24px",
            }}
          >
            SC
          </div>

          {/* Main title */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#1E293B",
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
              color: "#1B6B5A",
              marginBottom: "16px",
            }}
          >
            AIとロープレして成約率を上げろ。
          </div>

          {/* Sub text */}
          <div
            style={{
              fontSize: "20px",
              color: "#64748B",
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
