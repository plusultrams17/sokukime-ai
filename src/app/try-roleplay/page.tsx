"use client";

import "../roleplay/pixar.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ─── Config ─── */

const INDUSTRIES = [
  { value: "painting", label: "塗装", product: "外壁塗装", industry: "戸建て住宅オーナー" },
  { value: "construction", label: "建設", product: "リフォーム工事", industry: "戸建て住宅オーナー" },
  { value: "realestate", label: "不動産", product: "新築マンション", industry: "住宅購入検討者" },
  { value: "beauty", label: "美容", product: "美容サロン会員", industry: "美容・健康意識の高い層" },
  { value: "it", label: "IT", product: "法人向けクラウドサービス", industry: "IT企業" },
  { value: "insurance", label: "保険", product: "生命保険", industry: "保険見直し検討中" },
  { value: "education", label: "教育", product: "学習塾の入会", industry: "子育て世帯" },
  { value: "other", label: "その他", product: "商品・サービス", industry: "一般のお客さん" },
] as const;

const DIFFICULTIES = [
  {
    value: "friendly",
    label: "やさしい",
    description: "感じが良く話しやすい。まず慣れたい人向け",
  },
  {
    value: "cautious",
    label: "ふつう",
    description: "しっかり検討するリアルな顧客",
  },
  {
    value: "skeptical",
    label: "むずかしい",
    description: "疑り深く、厳しい質問をしてくる",
  },
] as const;

const SCENES = [
  { value: "phone", label: "電話", description: "テレアポ・電話商談" },
  { value: "visit", label: "訪問", description: "お客さん宅・会社に訪問" },
  { value: "inbound", label: "来店・問合せ", description: "お客さんからの問合せ対応" },
] as const;

/* ─── Session Storage Keys ─── */
const GUEST_SETUP_KEY = "guest-roleplay-setup";
const GUEST_COMPLETED_KEY = "guest-roleplay-completed";

export default function TryRoleplayPage() {
  const router = useRouter();
  const [industry, setIndustry] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [scene, setScene] = useState<string>("");
  const [alreadyTried, setAlreadyTried] = useState(false);

  const allSelected = industry !== "" && difficulty !== "" && scene !== "";
  const missingCount = [industry, difficulty, scene].filter((v) => v === "").length;

  // Check if user already completed guest trial
  useEffect(() => {
    try {
      const completed = sessionStorage.getItem(GUEST_COMPLETED_KEY);
      if (completed === "true") {
        setAlreadyTried(true);
      }
    } catch {
      // sessionStorage unavailable — proceed
    }
  }, []);

  function handleStart() {
    const selected = INDUSTRIES.find((i) => i.value === industry) ?? INDUSTRIES[0];
    const setup = {
      industry: selected.industry,
      product: selected.product,
      difficulty,
      scene,
      customerType: "individual",
      industryKey: selected.value,
    };
    try {
      sessionStorage.setItem(GUEST_SETUP_KEY, JSON.stringify(setup));
    } catch {
      // Fallback: pass via URL params
    }
    router.push("/try-roleplay/chat");
  }

  return (
    <div
      className="pixar-setup flex min-h-screen flex-col"
      style={{
        background: "#f0e4d4",
        fontFamily:
          '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#f5f1e8",
          borderBottom: "0.18em solid #4d4c4a",
        }}
      >
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span
              style={{
                fontSize: "1.05em",
                fontWeight: 800,
                color: "#4d4c4a",
              }}
            >
              成約コーチ AI
            </span>
          </Link>
          <div
            style={{
              fontSize: "0.7em",
              fontWeight: 800,
              color: "#fff",
              background: "#f48a58",
              padding: "0.3em 0.8em",
              borderRadius: "2em",
              border: "0.12em solid #c4693d",
              boxShadow: "0.08em 0.08em 0 #c4693d",
            }}
          >
            ゲスト体験モード ・ 1回だけ無料
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-start justify-center px-4 py-8">
        <div className="w-full max-w-xl space-y-5">
          {/* Title */}
          <div className="text-center">
            <h1
              className="mb-1 text-2xl font-extrabold sm:text-3xl"
              style={{ color: "#4d4c4a" }}
            >
              3分でAIロープレを体験
            </h1>
            <p
              className="text-sm font-semibold"
              style={{ color: "#8a8680" }}
            >
              3つ選ぶだけで開始 ・ 登録不要
            </p>
          </div>

          {/* Already tried banner */}
          {alreadyTried && (
            <div
              className="pixar-card"
              style={{
                borderColor: "#f48a58",
                background: "linear-gradient(135deg, #fff8f3, #fdf2f2)",
              }}
            >
              <div className="text-center">
                <div style={{ fontSize: "1.8em", marginBottom: "0.3em" }} aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f48a58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline"}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <p
                  style={{
                    fontSize: "1em",
                    fontWeight: 800,
                    color: "#4d4c4a",
                    marginBottom: "0.3em",
                  }}
                >
                  ゲスト体験は1回までです
                </p>
                <p
                  style={{
                    fontSize: "0.82em",
                    color: "#6a6560",
                    marginBottom: "0.8em",
                    lineHeight: 1.6,
                  }}
                >
                  無料登録すると毎日1回・Proなら無制限でロープレできます
                </p>
                <Link
                  href="/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "2.8em",
                    padding: "0 1.6em",
                    borderRadius: "2em",
                    background: "#f48a58",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "0.9em",
                    textDecoration: "none",
                    border: "0.12em solid #c4693d",
                    boxShadow: "0.12em 0.12em 0 #c4693d",
                  }}
                >
                  無料登録してロープレ続行 →
                </Link>
              </div>
            </div>
          )}

          {!alreadyTried && (
            <>
              {/* Industry */}
              <section className="pixar-card">
                <label
                  className="pixar-label"
                  style={{ fontSize: "0.9em", marginBottom: "0.6em" }}
                >
                  1. 業種を選ぶ
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {INDUSTRIES.map((i) => (
                    <button
                      key={i.value}
                      type="button"
                      onClick={() => setIndustry(i.value)}
                      className={`pixar-option text-center ${
                        industry === i.value
                          ? "pixar-option--active-sales"
                          : ""
                      }`}
                      style={{ padding: "0.6em 0.4em" }}
                    >
                      <div
                        style={{
                          fontSize: "0.85em",
                          fontWeight: 800,
                        }}
                      >
                        {i.label}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Difficulty */}
              <section className="pixar-card">
                <label
                  className="pixar-label"
                  style={{ fontSize: "0.9em", marginBottom: "0.6em" }}
                >
                  2. 難易度を選ぶ
                </label>
                <div className="flex flex-col gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDifficulty(d.value)}
                      className={`pixar-option text-left ${
                        difficulty === d.value
                          ? "pixar-option--active-sales"
                          : ""
                      }`}
                    >
                      <div
                        style={{
                          fontSize: "0.95em",
                          fontWeight: 800,
                          marginBottom: "0.1em",
                        }}
                      >
                        {d.label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75em",
                          opacity: 0.7,
                        }}
                      >
                        {d.description}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Scene */}
              <section className="pixar-card">
                <label
                  className="pixar-label"
                  style={{ fontSize: "0.9em", marginBottom: "0.6em" }}
                >
                  3. シーンを選ぶ
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {SCENES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setScene(s.value)}
                      className={`pixar-option text-center ${
                        scene === s.value ? "pixar-option--active-sales" : ""
                      }`}
                      style={{ padding: "0.5em 0.4em" }}
                    >
                      <div
                        style={{
                          fontSize: "0.85em",
                          fontWeight: 800,
                          marginBottom: "0.1em",
                        }}
                      >
                        {s.label}
                      </div>
                      <div style={{ fontSize: "0.65em", opacity: 0.7 }}>
                        {s.description}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Start button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={!allSelected}
                  className="pixar-start-btn"
                >
                  {allSelected ? "体験開始 →" : `あと${missingCount}つ選んでください`}
                </button>
                {!allSelected && (
                  <p
                    className="mt-2 text-center"
                    style={{
                      fontSize: "0.75em",
                      fontWeight: 700,
                      color: "#c4693d",
                    }}
                  >
                    ↑{" "}
                    {[
                      ...(industry === "" ? ["業種"] : []),
                      ...(difficulty === "" ? ["難易度"] : []),
                      ...(scene === "" ? ["シーン"] : []),
                    ].join("・")}
                    を選択してください
                  </p>
                )}
              </div>

              <p
                className="text-center"
                style={{
                  fontSize: "0.72em",
                  color: "#a09a90",
                  marginTop: "-0.5em",
                }}
              >
                登録不要 ・ クレカ不要 ・ 3分で完了
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
