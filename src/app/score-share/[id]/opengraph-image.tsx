import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";
export const alt = "営業スコア | 成約コーチ AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Grade thresholds aligned with scoring rubric behavioral anchors
function getGrade(score: number) {
  if (score >= 81) return "S";
  if (score >= 61) return "A";
  if (score >= 41) return "B";
  if (score >= 21) return "C";
  return "D";
}

function getGradeLabel(score: number) {
  if (score >= 81) return "卓越";
  if (score >= 61) return "良好";
  if (score >= 41) return "標準";
  if (score >= 21) return "要改善";
  return "未実施";
}

function getScoreHex(score: number) {
  if (score >= 81) return "#4ade80";
  if (score >= 61) return "#22c55e";
  if (score >= 41) return "#eab308";
  if (score >= 21) return "#f97316";
  return "#ef4444";
}

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let overall = 0;
  let categories: { name: string; score: number }[] = [];
  let industry = "";

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { data } = await supabase
        .from("roleplay_scores")
        .select("overall_score, category_scores, industry")
        .eq("id", id)
        .single();

      if (data) {
        overall = data.overall_score;
        categories = (data.category_scores || []) as { name: string; score: number }[];
        industry = data.industry || "";
      }
    }
  } catch {
    // Fallback to default
  }

  const grade = getGrade(overall);
  const color = getScoreHex(overall);

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
          padding: "60px",
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: "absolute",
            width: "800px",
            height: "800px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
            top: "50%",
            left: "30%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Main content */}
        <div style={{ display: "flex", flex: 1, gap: "60px" }}>
          {/* Left: Score */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <div style={{ fontSize: "20px", color: "#9ca3af", marginBottom: "8px" }}>
              営業ロープレ AIスコア
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontSize: "140px", fontWeight: 900, color }}>
                {overall}
              </span>
              <span style={{ fontSize: "48px", fontWeight: 900, color: "#4b5563" }}>
                /100
              </span>
            </div>
            <div style={{ fontSize: "40px", fontWeight: 800, color, marginTop: "4px" }}>
              {grade}ランク: {getGradeLabel(overall)}
            </div>
            {industry && (
              <div style={{ fontSize: "18px", color: "#6b7280", marginTop: "16px" }}>
                業種: {industry}
              </div>
            )}
          </div>

          {/* Right: Categories */}
          {categories.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "16px",
                width: "380px",
              }}
            >
              {categories.map((cat) => (
                <div key={cat.name} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "18px" }}>
                    <span style={{ color: "#e5e7eb" }}>{cat.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{
                        fontSize: "13px",
                        fontWeight: 900,
                        color: getScoreHex(cat.score),
                        backgroundColor: `${getScoreHex(cat.score)}20`,
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}>
                        {getGrade(cat.score)}
                      </span>
                      <span style={{ color: getScoreHex(cat.score), fontWeight: 700 }}>
                        {cat.score}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      height: "10px",
                      borderRadius: "5px",
                      backgroundColor: "#374151",
                      overflow: "hidden",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        width: `${cat.score}%`,
                        height: "100%",
                        borderRadius: "5px",
                        backgroundColor: getScoreHex(cat.score),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px", fontWeight: 800, color: "#f97316" }}>
              成約コーチ AI
            </span>
            <span style={{ fontSize: "16px", color: "#6b7280" }}>
              30項目の行動チェックリストでAI採点
            </span>
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "#f97316",
              backgroundColor: "#f9731615",
              padding: "8px 20px",
              borderRadius: "8px",
              fontWeight: 700,
            }}
          >
            無料で診断する → seiyaku-coach.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
