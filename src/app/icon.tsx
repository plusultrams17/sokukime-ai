import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B6B5A",
          borderRadius: "6px",
        }}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          width="26"
          height="26"
        >
          {/* Left arm */}
          <path
            d="M8 38c2-1 5-2 9-2s7 1 9 3"
            stroke="white"
            stroke-width="4.5"
            stroke-linecap="round"
          />
          <path
            d="M17 36c2-1.5 4-2 6-1.5 2.5.8 4 2.5 5 4.5.8 1.5.5 3-.5 4s-2.5 1.5-4 1"
            stroke="white"
            stroke-width="4.5"
            stroke-linecap="round"
          />
          {/* Right arm */}
          <path
            d="M56 38c-2-1-5-2-9-2s-7 1-9 3"
            stroke="white"
            stroke-width="4.5"
            stroke-linecap="round"
          />
          <path
            d="M47 36c-2-1.5-4-2-6-1.5-2.5.8-4 2.5-5 4.5-.8 1.5-.5 3 .5 4s2.5 1.5 4 1"
            stroke="white"
            stroke-width="4.5"
            stroke-linecap="round"
          />
          {/* Clasp */}
          <path
            d="M27 39c1.5-2 3.5-3 5-3s3.5 1 5 3c1 1.5 1 3 0 4s-2.5 1.5-5 1.5-4-.5-5-1.5-1-2.5 0-4z"
            stroke="white"
            stroke-width="4.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          {/* Sparkle */}
          <circle cx="32" cy="24" r="2.5" fill="white" opacity="0.8" />
          <path d="M32 27v-4" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.7" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
