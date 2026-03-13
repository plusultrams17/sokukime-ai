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
  const fontSize = Math.round(dim * 0.6);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
          borderRadius: `${radius}px`,
          fontSize: `${fontSize}px`,
          fontWeight: 900,
          color: "#fff",
        }}
      >
        即
      </div>
    ),
    { width: dim, height: dim },
  );
}
