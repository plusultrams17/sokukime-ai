import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

export const alt = "成約コーチ AI - 業種別営業学習プログラム";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const logoData = await readFile(join(process.cwd(), "public", "logo.png"));
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

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
          backgroundColor: "#e8e6e1",
        }}
      >
        {/* Logo */}
        <img
          src={logoBase64}
          width={400}
          height={400}
          style={{ marginBottom: "24px" }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#1E293B",
          }}
        >
          業種別営業学習プログラム
        </div>
      </div>
    ),
    { ...size },
  );
}
