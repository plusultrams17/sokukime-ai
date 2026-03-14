import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ size: string }> },
) {
  const { size: sizeStr } = await params;
  const s = parseInt(sizeStr, 10);
  const dim = [192, 512].includes(s) ? s : 192;
  const radius = Math.round(dim * 0.2);
  const svgSize = Math.round(dim * 0.6);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1B6B5A 0%, #155A4A 100%)",
          borderRadius: `${radius}px`,
        }}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          width={svgSize}
          height={svgSize}
        >
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
          <path
            d="M27 39c1.5-2 3.5-3 5-3s3.5 1 5 3c1 1.5 1 3 0 4s-2.5 1.5-5 1.5-4-.5-5-1.5-1-2.5 0-4z"
            stroke="white"
            stroke-width="4.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="32" cy="24" r="2.5" fill="white" opacity="0.8" />
          <path d="M32 27v-4" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.7" />
        </svg>
      </div>
    ),
    { width: dim, height: dim },
  );
}
