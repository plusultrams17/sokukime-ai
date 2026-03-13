import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "即キメAI - AI即決営業ロープレコーチ";
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
          backgroundColor: "#0a0a0a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Orange radial gradient circle */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.3) 0%, rgba(249,115,22,0.05) 50%, transparent 70%)",
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
          {/* Fire emoji */}
          <div style={{ fontSize: "72px", marginBottom: "16px" }}>🔥</div>

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
            即キメAI
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
              color: "#9ca3af",
            }}
          >
            AI × 即決営業メソッド | 無料で始められる
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
