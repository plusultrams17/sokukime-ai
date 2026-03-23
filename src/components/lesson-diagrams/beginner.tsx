"use client";

const ACCENT = "#0F6E56";
const DARK = "#1E293B";
const MUTED = "#64748B";
const LIGHT_BG = "#F1F5F9";
const WHITE = "#FFFFFF";
const FONT = "system-ui, sans-serif";

// ─────────────────────────────────────────────
// 1. SalesMindsetDiagram (sales-mindset)
//    2x2 matrix + formula
// ─────────────────────────────────────────────

export function SalesMindsetDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 560 400"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Axes */}
        <line x1="120" y1="280" x2="520" y2="280" stroke={DARK} strokeWidth="2" />
        <line x1="120" y1="280" x2="120" y2="40" stroke={DARK} strokeWidth="2" />

        {/* X-axis arrow */}
        <polygon points="520,280 510,274 510,286" fill={DARK} />
        {/* Y-axis arrow */}
        <polygon points="120,40 114,50 126,50" fill={DARK} />

        {/* Axis labels */}
        <text x="320" y="310" textAnchor="middle" fontSize="13" fill={DARK} fontWeight="bold">
          知識
        </text>
        <text x="530" y="284" fontSize="11" fill={MUTED}>高</text>
        <text x="108" y="295" fontSize="11" fill={MUTED} textAnchor="end">低</text>
        <text x="108" y="160" fontSize="13" fill={DARK} fontWeight="bold" textAnchor="end"
          transform="rotate(-90, 108, 160)">
          自信
        </text>
        <text x="116" y="50" fontSize="11" fill={MUTED} textAnchor="end">高</text>

        {/* Grid divider lines */}
        <line x1="320" y1="40" x2="320" y2="280" stroke={MUTED} strokeWidth="1" strokeDasharray="4,4" />
        <line x1="120" y1="160" x2="520" y2="160" stroke={MUTED} strokeWidth="1" strokeDasharray="4,4" />

        {/* Quadrant: bottom-left (low/low) */}
        <rect x="130" y="170" width="180" height="100" fill="#FEE2E2" stroke="#FECACA" strokeWidth="1" />
        <text x="220" y="218" textAnchor="middle" fontSize="14" fill="#991B1B" fontWeight="bold">
          売れない営業
        </text>
        <text x="220" y="240" textAnchor="middle" fontSize="11" fill="#991B1B">
          知識も自信もない
        </text>

        {/* Quadrant: top-left (low knowledge / high confidence) */}
        <rect x="130" y="50" width="180" height="100" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />
        <text x="220" y="98" textAnchor="middle" fontSize="14" fill="#92400E" fontWeight="bold">
          押し売り営業
        </text>
        <text x="220" y="120" textAnchor="middle" fontSize="11" fill="#92400E">
          自信だけで知識不足
        </text>

        {/* Quadrant: bottom-right (high knowledge / low confidence) */}
        <rect x="330" y="170" width="180" height="100" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />
        <text x="420" y="218" textAnchor="middle" fontSize="14" fill="#92400E" fontWeight="bold">
          御用聞き営業
        </text>
        <text x="420" y="240" textAnchor="middle" fontSize="11" fill="#92400E">
          知識はあるが自信なし
        </text>

        {/* Quadrant: top-right (high/high) */}
        <rect x="330" y="50" width="180" height="100" fill="#D1FAE5" stroke={ACCENT} strokeWidth="2" />
        <text x="420" y="98" textAnchor="middle" fontSize="15" fill={ACCENT} fontWeight="bold">
          トップセールス
        </text>
        <text x="420" y="120" textAnchor="middle" fontSize="11" fill={ACCENT}>
          知識と自信を両立
        </text>

        {/* Formula below */}
        <rect x="120" y="340" width="400" height="40" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" rx="0" />
        <text x="320" y="366" textAnchor="middle" fontSize="14" fill={DARK} fontWeight="bold">
          自信 = 知識 x 経験 x フィードバック
        </text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. PraiseTechniqueDiagram (praise-technique)
//    Horizontal flow + 2度褒める loop
// ─────────────────────────────────────────────

export function PraiseTechniqueDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 640 240"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="praise-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto-start-auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={ACCENT} />
          </marker>
        </defs>

        {/* Step 1 */}
        <rect x="20" y="40" width="120" height="50" fill={ACCENT} stroke="none" />
        <text x="80" y="70" textAnchor="middle" fontSize="14" fill={WHITE} fontWeight="bold">褒める</text>

        {/* Arrow 1 */}
        <line x1="140" y1="65" x2="170" y2="65" stroke={ACCENT} strokeWidth="2" markerEnd="url(#praise-arrow)" />

        {/* Step 2 */}
        <rect x="178" y="40" width="130" height="50" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="243" y="62" textAnchor="middle" fontSize="12" fill={DARK}>心の扉が</text>
        <text x="243" y="78" textAnchor="middle" fontSize="12" fill={DARK}>開く</text>

        {/* Arrow 2 */}
        <line x1="308" y1="65" x2="338" y2="65" stroke={ACCENT} strokeWidth="2" markerEnd="url(#praise-arrow)" />

        {/* Step 3 */}
        <rect x="346" y="40" width="120" height="50" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="406" y="70" textAnchor="middle" fontSize="13" fill={DARK} fontWeight="bold">信頼構築</text>

        {/* Arrow 3 */}
        <line x1="466" y1="65" x2="496" y2="65" stroke={ACCENT} strokeWidth="2" markerEnd="url(#praise-arrow)" />

        {/* Step 4 */}
        <rect x="504" y="40" width="120" height="50" fill={ACCENT} stroke="none" />
        <text x="564" y="60" textAnchor="middle" fontSize="11" fill={WHITE}>提案を</text>
        <text x="564" y="78" textAnchor="middle" fontSize="11" fill={WHITE} fontWeight="bold">聞いてもらえる</text>

        {/* 2度褒める loop section */}
        <text x="320" y="130" textAnchor="middle" fontSize="13" fill={DARK} fontWeight="bold">
          「2度褒める」テクニック
        </text>

        {/* Loop diagram */}
        <rect x="120" y="150" width="100" height="40" fill={ACCENT} stroke="none" />
        <text x="170" y="175" textAnchor="middle" fontSize="12" fill={WHITE} fontWeight="bold">1回目の褒め</text>

        <line x1="220" y1="170" x2="270" y2="170" stroke={ACCENT} strokeWidth="2" markerEnd="url(#praise-arrow)" />

        <rect x="278" y="150" width="100" height="40" fill={LIGHT_BG} stroke={MUTED} strokeWidth="1" />
        <text x="328" y="175" textAnchor="middle" fontSize="12" fill={DARK}>相手の反応</text>

        <line x1="378" y1="170" x2="428" y2="170" stroke={ACCENT} strokeWidth="2" markerEnd="url(#praise-arrow)" />

        <rect x="436" y="150" width="100" height="40" fill={ACCENT} stroke="none" />
        <text x="486" y="175" textAnchor="middle" fontSize="12" fill={WHITE} fontWeight="bold">2回目の褒め</text>

        {/* Loop-back arrow */}
        <path d="M 486 190 L 486 210 L 170 210 L 170 190" fill="none" stroke={MUTED} strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="328" y="225" textAnchor="middle" fontSize="11" fill={MUTED}>繰り返すことで信頼が深まる</text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// 3. PremiseSettingDiagram (premise-setting)
//    4-step numbered flow
// ─────────────────────────────────────────────

export function PremiseSettingDiagram() {
  const steps = [
    { num: "1", text: "精一杯ご説明" },
    { num: "2", text: "気に入らなければ\n断ってOK" },
    { num: "3", text: "良ければ\nスタート" },
    { num: "4", text: "よろしい\nですか？" },
  ];

  return (
    <div className="my-8">
      <svg
        viewBox="0 0 620 200"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="premise-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto-start-auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={ACCENT} />
          </marker>
        </defs>

        {/* Title */}
        <text x="310" y="28" textAnchor="middle" fontSize="14" fill={DARK} fontWeight="bold">
          ゴール共有の4ステップ
        </text>

        {steps.map((step, i) => {
          const x = 30 + i * 150;
          const lines = step.text.split("\n");
          return (
            <g key={step.num}>
              {/* Number circle */}
              <circle cx={x + 55} cy="60" r="14" fill={ACCENT} />
              <text x={x + 55} y="65" textAnchor="middle" fontSize="13" fill={WHITE} fontWeight="bold">
                {step.num}
              </text>

              {/* Step box */}
              <rect x={x} y="85" width="110" height="55" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
              {lines.length === 1 ? (
                <text x={x + 55} y="118" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">
                  {lines[0]}
                </text>
              ) : (
                <>
                  <text x={x + 55} y="108" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">
                    {lines[0]}
                  </text>
                  <text x={x + 55} y="126" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">
                    {lines[1]}
                  </text>
                </>
              )}

              {/* Arrow between boxes */}
              {i < 3 && (
                <line x1={x + 110} y1="112" x2={x + 150} y2="112"
                  stroke={ACCENT} strokeWidth="2" markerEnd="url(#premise-arrow)" />
              )}
            </g>
          );
        })}

        {/* Bottom note */}
        <rect x="130" y="160" width="360" height="30" fill={LIGHT_BG} stroke="none" />
        <text x="310" y="180" textAnchor="middle" fontSize="12" fill={MUTED}>
          事前に断る選択肢を与えることで、お客様の心理的負担を軽減する
        </text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// 4. MehrabianDiagram (mehrabian-rule)
//    Stacked bar (7-38-55) + PREP法
// ─────────────────────────────────────────────

export function MehrabianDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 580 320"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="mehr-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto-start-auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={ACCENT} />
          </marker>
        </defs>

        {/* Title */}
        <text x="290" y="28" textAnchor="middle" fontSize="14" fill={DARK} fontWeight="bold">
          メラビアンの法則
        </text>

        {/* Stacked horizontal bar */}
        {/* 言語 7% */}
        <rect x="60" y="50" width="38" height="50" fill={MUTED} stroke={WHITE} strokeWidth="1" />
        <text x="79" y="80" textAnchor="middle" fontSize="11" fill={WHITE} fontWeight="bold">7%</text>

        {/* 聴覚 38% */}
        <rect x="98" y="50" width="180" height="50" fill="#3B82F6" stroke={WHITE} strokeWidth="1" />
        <text x="188" y="80" textAnchor="middle" fontSize="13" fill={WHITE} fontWeight="bold">38%</text>

        {/* 視覚 55% */}
        <rect x="278" y="50" width="262" height="50" fill={ACCENT} stroke={WHITE} strokeWidth="1" />
        <text x="409" y="80" textAnchor="middle" fontSize="14" fill={WHITE} fontWeight="bold">55%</text>

        {/* Labels below bar */}
        <text x="79" y="118" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">言語</text>
        <text x="79" y="134" textAnchor="middle" fontSize="10" fill={MUTED}>話の内容</text>

        <text x="188" y="118" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">聴覚</text>
        <text x="188" y="134" textAnchor="middle" fontSize="10" fill={MUTED}>声のトーン・速さ</text>

        <text x="409" y="118" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">視覚</text>
        <text x="409" y="134" textAnchor="middle" fontSize="10" fill={MUTED}>表情・身振り・姿勢</text>

        {/* Divider */}
        <line x1="60" y1="160" x2="540" y2="160" stroke={LIGHT_BG} strokeWidth="2" />

        {/* PREP法 */}
        <text x="290" y="190" textAnchor="middle" fontSize="14" fill={DARK} fontWeight="bold">
          PREP法（言語7%を最大化する構成）
        </text>

        {/* PREP boxes */}
        {[
          { letter: "P", label: "結論", x: 60 },
          { letter: "R", label: "理由", x: 190 },
          { letter: "E", label: "具体例", x: 320 },
          { letter: "P", label: "結論", x: 450 },
        ].map((item, i) => (
          <g key={`prep-${i}`}>
            <rect x={item.x} y="210" width="90" height="60" fill={i === 0 || i === 3 ? ACCENT : WHITE}
              stroke={ACCENT} strokeWidth="1.5" />
            <text x={item.x + 45} y="236" textAnchor="middle" fontSize="18" fontWeight="bold"
              fill={i === 0 || i === 3 ? WHITE : ACCENT}>
              {item.letter}
            </text>
            <text x={item.x + 45} y="258" textAnchor="middle" fontSize="12"
              fill={i === 0 || i === 3 ? WHITE : DARK}>
              {item.label}
            </text>
            {i < 3 && (
              <line x1={item.x + 90} y1="240" x2={item.x + 190} y2="240"
                stroke={ACCENT} strokeWidth="2" markerEnd="url(#mehr-arrow)" />
            )}
          </g>
        ))}

        {/* Bottom note */}
        <text x="290" y="300" textAnchor="middle" fontSize="11" fill={MUTED}>
          結論から述べ、理由と具体例で補強し、最後に結論を繰り返す
        </text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// 5. DrawerPhrasesDiagram (drawer-phrases)
//    Speech pattern flow
// ─────────────────────────────────────────────

export function DrawerPhrasesDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 600 300"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="drawer-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto-start-auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={ACCENT} />
          </marker>
        </defs>

        {/* Title */}
        <text x="300" y="28" textAnchor="middle" fontSize="14" fill={DARK} fontWeight="bold">
          ニーズ発掘フレーズの構造
        </text>

        {/* Main flow: 3 boxes */}
        <rect x="20" y="50" width="150" height="50" fill={ACCENT} stroke="none" />
        <text x="95" y="72" textAnchor="middle" fontSize="12" fill={WHITE} fontWeight="bold">第三者話法</text>
        <text x="95" y="88" textAnchor="middle" fontSize="10" fill={WHITE}>（口語）</text>

        <line x1="170" y1="75" x2="210" y2="75" stroke={ACCENT} strokeWidth="2" markerEnd="url(#drawer-arrow)" />

        <rect x="218" y="50" width="150" height="50" fill={ACCENT} stroke="none" />
        <text x="293" y="72" textAnchor="middle" fontSize="12" fill={WHITE} fontWeight="bold">質問</text>
        <text x="293" y="88" textAnchor="middle" fontSize="10" fill={WHITE}>（文語）</text>

        <line x1="368" y1="75" x2="408" y2="75" stroke={ACCENT} strokeWidth="2" markerEnd="url(#drawer-arrow)" />

        <rect x="416" y="50" width="150" height="50" fill={ACCENT} stroke="none" />
        <text x="491" y="80" textAnchor="middle" fontSize="13" fill={WHITE} fontWeight="bold">ニーズ発掘</text>

        {/* Speech pattern section */}
        <text x="300" y="140" textAnchor="middle" fontSize="13" fill={DARK} fontWeight="bold">
          会話パターン
        </text>

        {/* Pattern box 1: Third person */}
        <rect x="40" y="160" width="230" height="50" fill={LIGHT_BG} stroke={MUTED} strokeWidth="1" />
        <text x="50" y="178" fontSize="10" fill={MUTED}>第三者話法</text>
        <text x="155" y="198" textAnchor="middle" fontSize="12" fill={DARK}>
          「〇〇と悩んでいる方が
        </text>
        <text x="155" y="198" textAnchor="middle" fontSize="12" fill={DARK}>
          {"「〇〇と悩んでいる方が多いのですが」"}
        </text>

        {/* Arrow */}
        <line x1="270" y1="185" x2="310" y2="185" stroke={ACCENT} strokeWidth="2" markerEnd="url(#drawer-arrow)" />

        {/* Pattern box 2: Direct question */}
        <rect x="318" y="160" width="240" height="50" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" />
        <text x="328" y="178" fontSize="10" fill={ACCENT} fontWeight="bold">自分への質問</text>
        <text x="438" y="198" textAnchor="middle" fontSize="12" fill={DARK}>
          {"「○○さんはいかがですか？」"}
        </text>

        {/* Bottom: key point */}
        <rect x="100" y="240" width="400" height="40" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="300" y="265" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">
          第三者の話で共感を得てから、本人に質問する流れがポイント
        </text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// 6. DeepeningDiagram (deepening)
//    Vertical funnel
// ─────────────────────────────────────────────

export function DeepeningDiagram() {
  const steps = [
    { label: "表面的な悩み", question: "", width: 400 },
    { label: "", question: "原因は？", width: 360 },
    { label: "", question: "いつから？（金額換算）", width: 320 },
    { label: "", question: "具体的には？", width: 280 },
    { label: "", question: "放置したら？", width: 240 },
    { label: "", question: "気分は？", width: 200 },
    { label: "本質的な問題", question: "", width: 180 },
  ];

  return (
    <div className="my-8">
      <svg
        viewBox="0 0 500 380"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Title */}
        <text x="250" y="24" textAnchor="middle" fontSize="14" fill={DARK} fontWeight="bold">
          深掘りの流れ（ファネル）
        </text>

        {steps.map((step, i) => {
          const y = 40 + i * 46;
          const x = (500 - step.width) / 2;
          const isFirst = i === 0;
          const isLast = i === steps.length - 1;
          const bgColor = isFirst ? LIGHT_BG : isLast ? ACCENT : WHITE;
          const textColor = isLast ? WHITE : DARK;

          return (
            <g key={i}>
              <rect x={x} y={y} width={step.width} height="36"
                fill={bgColor} stroke={isLast ? ACCENT : MUTED}
                strokeWidth={isFirst || isLast ? "2" : "1"} />

              {step.label ? (
                <text x={250} y={y + 23} textAnchor="middle" fontSize="13"
                  fill={textColor} fontWeight="bold">
                  {step.label}
                </text>
              ) : (
                <text x={250} y={y + 23} textAnchor="middle" fontSize="12" fill={DARK}>
                  {step.question}
                </text>
              )}

              {/* Down arrow between rows */}
              {i < steps.length - 1 && (
                <polygon
                  points={`250,${y + 36} 244,${y + 36 + 2} 256,${y + 36 + 2} 250,${y + 36 + 10}`}
                  fill={ACCENT}
                />
              )}
            </g>
          );
        })}

        {/* Side label */}
        <text x="480" y="80" fontSize="10" fill={MUTED} textAnchor="end">浅い</text>
        <text x="480" y="350" fontSize="10" fill={ACCENT} fontWeight="bold" textAnchor="end">深い</text>
        <line x1="470" y1="90" x2="470" y2="340" stroke={MUTED} strokeWidth="1" strokeDasharray="3,3" />
        <polygon points="470,340 466,330 474,330" fill={MUTED} />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// 7. BenefitMethodDiagram (benefit-method)
//    SP -> だから -> ベネフィット transformation
// ─────────────────────────────────────────────

export function BenefitMethodDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 600 280"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="benefit-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto-start-auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={ACCENT} />
          </marker>
        </defs>

        {/* Title */}
        <text x="300" y="28" textAnchor="middle" fontSize="14" fill={DARK} fontWeight="bold">
          ベネフィット話法
        </text>

        {/* Wrong pattern (crossed out) */}
        <text x="300" y="58" textAnchor="middle" fontSize="12" fill="#DC2626" fontWeight="bold">
          特徴だけでは売れない
        </text>
        <line x1="200" y1="54" x2="400" y2="54" stroke="#DC2626" strokeWidth="2" />

        {/* Left box: SP */}
        <rect x="40" y="80" width="160" height="70" fill={LIGHT_BG} stroke={MUTED} strokeWidth="1.5" />
        <text x="120" y="108" textAnchor="middle" fontSize="14" fill={DARK} fontWeight="bold">
          セールスポイント
        </text>
        <text x="120" y="128" textAnchor="middle" fontSize="12" fill={MUTED}>
          (SP: 商品の特徴)
        </text>

        {/* Arrow with だから */}
        <line x1="200" y1="115" x2="370" y2="115" stroke={ACCENT} strokeWidth="2.5" markerEnd="url(#benefit-arrow)" />
        <rect x="248" y="95" width="60" height="22" fill={WHITE} stroke="none" />
        <text x="278" y="111" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          だから
        </text>

        {/* Right box: ベネフィット */}
        <rect x="380" y="80" width="180" height="70" fill={WHITE} stroke={ACCENT} strokeWidth="2" />
        <text x="470" y="108" textAnchor="middle" fontSize="14" fill={ACCENT} fontWeight="bold">
          ベネフィット
        </text>
        <text x="470" y="128" textAnchor="middle" fontSize="12" fill={MUTED}>
          (お客様のメリット)
        </text>

        {/* Correct pattern example */}
        <text x="300" y="190" textAnchor="middle" fontSize="13" fill={DARK} fontWeight="bold">
          正しいパターン
        </text>

        <rect x="30" y="205" width="160" height="45" fill={LIGHT_BG} stroke={MUTED} strokeWidth="1" />
        <text x="110" y="224" textAnchor="middle" fontSize="11" fill={DARK}>SP</text>
        <text x="110" y="240" textAnchor="middle" fontSize="10" fill={MUTED}>「この機能があります」</text>

        <line x1="190" y1="228" x2="230" y2="228" stroke={ACCENT} strokeWidth="2" markerEnd="url(#benefit-arrow)" />

        <rect x="238" y="205" width="80" height="45" fill={ACCENT} stroke="none" />
        <text x="278" y="232" textAnchor="middle" fontSize="12" fill={WHITE} fontWeight="bold">だから</text>

        <line x1="318" y1="228" x2="358" y2="228" stroke={ACCENT} strokeWidth="2" markerEnd="url(#benefit-arrow)" />

        <rect x="366" y="205" width="200" height="45" fill={WHITE} stroke={ACCENT} strokeWidth="2" />
        <text x="466" y="224" textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="bold">ベネフィット</text>
        <text x="466" y="240" textAnchor="middle" fontSize="10" fill={MUTED}>「お客様は〇〇できます」</text>

        {/* Bottom note */}
        <text x="300" y="272" textAnchor="middle" fontSize="11" fill={MUTED}>
          お客様が得られる未来を具体的に伝えることで、購買意欲が高まる
        </text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// 8. ComparisonIfDiagram (comparison-if)
//    比較話法 + 天国IF / 地獄IF
// ─────────────────────────────────────────────

export function ComparisonIfDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 600 380"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="comp-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto-start-auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={ACCENT} />
          </marker>
          <marker id="comp-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto-start-auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#DC2626" />
          </marker>
        </defs>

        {/* === Top section: 比較話法 === */}
        <text x="300" y="24" textAnchor="middle" fontSize="14" fill={DARK} fontWeight="bold">
          比較話法
        </text>

        {/* Left column: 他社 / このまま */}
        <rect x="40" y="40" width="180" height="50" fill={LIGHT_BG} stroke={MUTED} strokeWidth="1.5" />
        <text x="130" y="62" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">
          他社 / このまま
        </text>
        <text x="130" y="80" textAnchor="middle" fontSize="10" fill={MUTED}>現状の比較対象</text>

        {/* VS label */}
        <text x="258" y="70" textAnchor="middle" fontSize="14" fill={MUTED} fontWeight="bold">vs</text>

        {/* Right column: 自社 */}
        <rect x="290" y="40" width="140" height="50" fill={WHITE} stroke={ACCENT} strokeWidth="2" />
        <text x="360" y="62" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">
          自社
        </text>
        <text x="360" y="80" textAnchor="middle" fontSize="10" fill={MUTED}>提案する商品</text>

        {/* Arrow to benefit */}
        <line x1="430" y1="65" x2="470" y2="65" stroke={ACCENT} strokeWidth="2" markerEnd="url(#comp-arrow)" />

        <rect x="478" y="40" width="100" height="50" fill={ACCENT} stroke="none" />
        <text x="528" y="62" textAnchor="middle" fontSize="12" fill={WHITE} fontWeight="bold">ベネフィット</text>
        <text x="528" y="78" textAnchor="middle" fontSize="10" fill={WHITE}>差分を訴求</text>

        {/* Note */}
        <text x="300" y="115" textAnchor="middle" fontSize="11" fill={MUTED}>
          比較によって自社の優位性を客観的に示す
        </text>

        {/* Divider */}
        <line x1="40" y1="135" x2="560" y2="135" stroke={LIGHT_BG} strokeWidth="2" />

        {/* === Bottom section: IF活用 === */}
        <text x="300" y="162" textAnchor="middle" fontSize="14" fill={DARK} fontWeight="bold">
          IF活用
        </text>

        {/* 天国IF (positive) */}
        <rect x="50" y="180" width="220" height="120" fill={WHITE} stroke={ACCENT} strokeWidth="2" />
        <text x="160" y="205" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          天国IF
        </text>
        <text x="160" y="225" textAnchor="middle" fontSize="11" fill={MUTED}>
          （ポジティブ）
        </text>

        {/* Up arrow */}
        <line x1="160" y1="270" x2="160" y2="240" stroke={ACCENT} strokeWidth="2.5" markerEnd="url(#comp-arrow)" />
        <text x="160" y="288" textAnchor="middle" fontSize="11" fill={ACCENT}>
          「もし〇〇したら...」
        </text>

        {/* 地獄IF (negative) */}
        <rect x="330" y="180" width="220" height="120" fill={WHITE} stroke="#DC2626" strokeWidth="2" />
        <text x="440" y="205" textAnchor="middle" fontSize="13" fill="#DC2626" fontWeight="bold">
          地獄IF
        </text>
        <text x="440" y="225" textAnchor="middle" fontSize="11" fill={MUTED}>
          （ネガティブ）
        </text>

        {/* Down arrow */}
        <line x1="440" y1="240" x2="440" y2="270" stroke="#DC2626" strokeWidth="2.5" markerEnd="url(#comp-arrow-red)" />
        <text x="440" y="288" textAnchor="middle" fontSize="11" fill="#DC2626">
          「もしこのままだと...」
        </text>

        {/* 2倍の訴求力 label on 地獄IF */}
        <rect x="460" y="178" width="96" height="20" fill="#DC2626" />
        <text x="508" y="192" textAnchor="middle" fontSize="10" fill={WHITE} fontWeight="bold">
          2倍の訴求力
        </text>

        {/* Bottom note */}
        <text x="300" y="335" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">
          人は得をするより損を避けたい（プロスペクト理論）
        </text>
        <text x="300" y="355" textAnchor="middle" fontSize="11" fill={MUTED}>
          天国IFと地獄IFを組み合わせて訴求力を最大化する
        </text>
      </svg>
    </div>
  );
}
