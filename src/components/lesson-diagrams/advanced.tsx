// Advanced lesson diagrams (7 lessons)
// Primary accent: #7C3AED
// Style: Clean, professional, educational — no emoji, no gradients, no shadows

const ACCENT = "#7C3AED";
const ACCENT_LIGHT = "#F3E0E0";
const DARK = "#1E293B";
const MUTED = "#64748B";
const FONT = "system-ui, sans-serif";

// ─── 1. RebuttalBasicsDiagram ────────────────────────────────────────────────

export function RebuttalBasicsDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 800 320"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="rb-arrow"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
          <marker
            id="rb-arrow-muted"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={MUTED} />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="400"
          y="28"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          反論処理の基本フレームワーク
        </text>

        {/* Foundation row label */}
        <text
          x="400"
          y="58"
          textAnchor="middle"
          fontSize="12"
          fontFamily={FONT}
          fill={MUTED}
        >
          基盤: 共感 + 感謝 + フック（小さなYES）
        </text>

        {/* Main flow boxes */}
        {[
          { x: 20, label: "反論", sub: "お客様の抵抗" },
          { x: 155, label: "共感+感謝", sub: "受け止める" },
          { x: 310, label: "フック", sub: "小さなYES" },
          { x: 455, label: "技法 1〜5", sub: "切り返し" },
          { x: 600, label: "AREA話法", sub: "説得構成" },
          { x: 710, label: "訴求", sub: "クロージング" },
        ].map((box, i) => {
          const w = i === 1 ? 120 : i === 5 ? 76 : 110;
          return (
            <g key={i}>
              <rect
                x={box.x}
                y={75}
                width={w}
                height={50}
                fill={i === 0 ? "#F8FAFC" : i >= 1 && i <= 2 ? ACCENT_LIGHT : i === 5 ? ACCENT : "#F8FAFC"}
                stroke={i === 5 ? ACCENT : i >= 1 && i <= 2 ? ACCENT : DARK}
                strokeWidth={i >= 1 && i <= 2 ? 2 : 1.5}
              />
              <text
                x={box.x + w / 2}
                y={96}
                textAnchor="middle"
                fontSize="13"
                fontWeight="bold"
                fontFamily={FONT}
                fill={i === 5 ? "#FFFFFF" : DARK}
              >
                {box.label}
              </text>
              <text
                x={box.x + w / 2}
                y={115}
                textAnchor="middle"
                fontSize="10"
                fontFamily={FONT}
                fill={i === 5 ? "#E8D0D0" : MUTED}
              >
                {box.sub}
              </text>
            </g>
          );
        })}

        {/* Arrows between boxes */}
        {[
          { x1: 130, x2: 150 },
          { x1: 275, x2: 305 },
          { x1: 420, x2: 450 },
          { x1: 565, x2: 595 },
          { x1: 710, x2: 705 },
        ].slice(0, 5).map((a, i) => (
          i < 4 ? (
            <line
              key={i}
              x1={a.x1}
              y1={100}
              x2={a.x2}
              y2={100}
              stroke={ACCENT}
              strokeWidth={1.5}
              markerEnd="url(#rb-arrow)"
            />
          ) : null
        ))}

        {/* Foundation bracket */}
        <rect
          x="155"
          y="130"
          width="275"
          height="3"
          fill={ACCENT}
        />
        <line x1="292" y1="133" x2="292" y2="148" stroke={ACCENT} strokeWidth={1.5} />
        <text
          x="292"
          y="163"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fontFamily={FONT}
          fill={ACCENT}
        >
          全ての反論処理の土台
        </text>

        {/* Repeat note */}
        <rect
          x="150"
          y="190"
          width="500"
          height="44"
          fill="#FFFFFF"
          stroke={ACCENT}
          strokeWidth={2}
          strokeDasharray="6 3"
        />
        <text
          x="400"
          y="210"
          textAnchor="middle"
          fontSize="13"
          fontFamily={FONT}
          fill={DARK}
        >
          このサイクルを
          <tspan fontWeight="bold" fill={ACCENT}>3〜5回</tspan>
          繰り返す
        </text>
        <text
          x="400"
          y="227"
          textAnchor="middle"
          fontSize="12"
          fontFamily={FONT}
          fill={MUTED}
        >
          80%以上が成約に至る
        </text>

        {/* Loop arrow */}
        <path
          d="M 650 100 Q 700 100 700 160 Q 700 270 400 270 Q 100 270 100 160 Q 100 100 150 100"
          fill="none"
          stroke={MUTED}
          strokeWidth={1}
          strokeDasharray="4 3"
          markerEnd="url(#rb-arrow-muted)"
        />
        <text
          x="710"
          y="185"
          fontSize="10"
          fontFamily={FONT}
          fill={MUTED}
        >
          繰り返し
        </text>

        {/* Steps summary at bottom */}
        <text
          x="400"
          y="305"
          textAnchor="middle"
          fontSize="11"
          fontFamily={FONT}
          fill={MUTED}
        >
          反論は「拒否」ではなく「関心の裏返し」 -- 共感から始めることで心を開かせる
        </text>
      </svg>
    </div>
  );
}

// ─── 2. RebuttalPatternDiagram ───────────────────────────────────────────────

export function RebuttalPatternDiagram() {
  const techniques = [
    "目的の振り返り",
    "第三者アタック",
    "+のシャワー",
    "すり替え",
    "価値の上乗せ",
  ];
  const situations = ["考えたい", "他社比較", "高い"];
  // Matrix: which technique applies to which situation
  const matrix = [
    [true, false, false],
    [true, true, false],
    [true, true, false],
    [true, true, false],
    [false, false, true],
  ];

  const colW = 100;
  const rowH = 40;
  const labelW = 150;
  const startX = 120;
  const startY = 80;

  return (
    <div className="my-8">
      <svg
        viewBox="0 0 600 360"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Title */}
        <text
          x="300"
          y="28"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          5つの技法と適用場面
        </text>
        <text
          x="300"
          y="50"
          textAnchor="middle"
          fontSize="11"
          fontFamily={FONT}
          fill={MUTED}
        >
          状況に応じて最適な技法を選択する
        </text>

        {/* Column headers */}
        {situations.map((s, i) => (
          <g key={`col-${i}`}>
            <rect
              x={startX + labelW + i * colW}
              y={startY}
              width={colW}
              height={rowH}
              fill={ACCENT}
              stroke={ACCENT}
              strokeWidth={1}
            />
            <text
              x={startX + labelW + i * colW + colW / 2}
              y={startY + 25}
              textAnchor="middle"
              fontSize="13"
              fontWeight="bold"
              fontFamily={FONT}
              fill="#FFFFFF"
            >
              {s}
            </text>
          </g>
        ))}

        {/* Row header label */}
        <rect
          x={startX}
          y={startY}
          width={labelW}
          height={rowH}
          fill={ACCENT}
          stroke={ACCENT}
          strokeWidth={1}
        />
        <text
          x={startX + labelW / 2}
          y={startY + 25}
          textAnchor="middle"
          fontSize="13"
          fontWeight="bold"
          fontFamily={FONT}
          fill="#FFFFFF"
        >
          技法
        </text>

        {/* Rows */}
        {techniques.map((tech, ri) => (
          <g key={`row-${ri}`}>
            {/* Row label */}
            <rect
              x={startX}
              y={startY + (ri + 1) * rowH}
              width={labelW}
              height={rowH}
              fill={ri % 2 === 0 ? "#F8FAFC" : "#FFFFFF"}
              stroke="#E2E8F0"
              strokeWidth={1}
            />
            <text
              x={startX + labelW / 2}
              y={startY + (ri + 1) * rowH + 25}
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fontFamily={FONT}
              fill={DARK}
            >
              {tech}
            </text>

            {/* Matrix cells */}
            {situations.map((_s, ci) => (
              <g key={`cell-${ri}-${ci}`}>
                <rect
                  x={startX + labelW + ci * colW}
                  y={startY + (ri + 1) * rowH}
                  width={colW}
                  height={rowH}
                  fill={ri % 2 === 0 ? "#F8FAFC" : "#FFFFFF"}
                  stroke="#E2E8F0"
                  strokeWidth={1}
                />
                {matrix[ri][ci] && (
                  <circle
                    cx={startX + labelW + ci * colW + colW / 2}
                    cy={startY + (ri + 1) * rowH + rowH / 2}
                    r={10}
                    fill={ACCENT}
                  />
                )}
              </g>
            ))}
          </g>
        ))}

        {/* Legend */}
        <circle cx={startX + 10} cy={340} r={8} fill={ACCENT} />
        <text
          x={startX + 26}
          y={344}
          fontSize="11"
          fontFamily={FONT}
          fill={MUTED}
        >
          = 効果的な組み合わせ
        </text>

        <text
          x="480"
          y={344}
          textAnchor="end"
          fontSize="11"
          fontFamily={FONT}
          fill={MUTED}
        >
          複数技法の組み合わせも有効
        </text>
      </svg>
    </div>
  );
}

// ─── 3. PurposeRecallDiagram ─────────────────────────────────────────────────

export function PurposeRecallDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 800 340"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="pr-arrow"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
          <marker
            id="pr-arrow-dark"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={DARK} />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="400"
          y="28"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          技法1: 目的の振り返り -- 木と森のメタファー
        </text>

        {/* Left: narrow view */}
        <rect
          x="40"
          y="55"
          width="180"
          height="120"
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth={1.5}
        />
        <text
          x="130"
          y="75"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fontFamily={FONT}
          fill={MUTED}
        >
          木を見ている
        </text>
        <text
          x="130"
          y="92"
          textAnchor="middle"
          fontSize="10"
          fontFamily={FONT}
          fill={MUTED}
        >
          (視野が狭い)
        </text>
        {/* Single tree icon */}
        <line x1="130" y1="110" x2="130" y2="155" stroke="#8B6914" strokeWidth={3} />
        <polygon points="130,100 110,140 150,140" fill="#6B8E23" />

        {/* Arrow */}
        <line
          x1="240"
          y1="115"
          x2="330"
          y2={115}
          stroke={ACCENT}
          strokeWidth={2}
          markerEnd="url(#pr-arrow)"
        />
        <text
          x="285"
          y="105"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fontFamily={FONT}
          fill={ACCENT}
        >
          目的の
        </text>
        <text
          x="285"
          y="120"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fontFamily={FONT}
          fill={ACCENT}
        >
          振り返り
        </text>

        {/* Right: wide view */}
        <rect
          x="340"
          y="55"
          width="260"
          height="120"
          fill="#F8FAFC"
          stroke={ACCENT}
          strokeWidth={2}
        />
        <text
          x="470"
          y="75"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          森を見る
        </text>
        <text
          x="470"
          y="92"
          textAnchor="middle"
          fontSize="10"
          fontFamily={FONT}
          fill={MUTED}
        >
          (視野が広い = 本来の目的)
        </text>
        {/* Multiple trees */}
        {[390, 430, 470, 510, 550].map((tx, i) => (
          <g key={i}>
            <line x1={tx} y1={120} x2={tx} y2={155} stroke="#8B6914" strokeWidth={2} />
            <polygon points={`${tx},110 ${tx - 14},140 ${tx + 14},140`} fill="#6B8E23" />
          </g>
        ))}

        {/* Key question */}
        <rect
          x="630"
          y="70"
          width="150"
          height="90"
          fill={ACCENT_LIGHT}
          stroke={ACCENT}
          strokeWidth={1.5}
        />
        <text
          x="705"
          y="95"
          textAnchor="middle"
          fontSize="11"
          fontFamily={FONT}
          fill={DARK}
        >
          「そもそも
        </text>
        <text
          x="705"
          y="112"
          textAnchor="middle"
          fontSize="11"
          fontFamily={FONT}
          fill={DARK}
        >
          何のために
        </text>
        <text
          x="705"
          y="129"
          textAnchor="middle"
          fontSize="11"
          fontFamily={FONT}
          fill={DARK}
        >
          ご検討を？」
        </text>
        <text
          x="705"
          y="150"
          textAnchor="middle"
          fontSize="10"
          fontFamily={FONT}
          fill={MUTED}
        >
          原点に戻す
        </text>

        {/* AREA cycle below */}
        <text
          x="400"
          y="205"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          AREA話法サイクル
        </text>

        {/* A -> R -> E -> A circular */}
        {[
          { cx: 260, cy: 275, label: "A", sub: "主張" },
          { cx: 400, cy: 235, label: "R", sub: "理由" },
          { cx: 540, cy: 275, label: "E", sub: "例え" },
          { cx: 400, cy: 315, label: "A", sub: "主張" },
        ].map((node, i) => (
          <g key={i}>
            <rect
              x={node.cx - 40}
              y={node.cy - 22}
              width={80}
              height={44}
              fill={i === 0 || i === 3 ? ACCENT : "#F8FAFC"}
              stroke={ACCENT}
              strokeWidth={1.5}
            />
            <text
              x={node.cx}
              y={node.cy - 3}
              textAnchor="middle"
              fontSize="16"
              fontWeight="bold"
              fontFamily={FONT}
              fill={i === 0 || i === 3 ? "#FFFFFF" : DARK}
            >
              {node.label}
            </text>
            <text
              x={node.cx}
              y={node.cy + 14}
              textAnchor="middle"
              fontSize="10"
              fontFamily={FONT}
              fill={i === 0 || i === 3 ? "#E8D0D0" : MUTED}
            >
              {node.sub}
            </text>
          </g>
        ))}

        {/* Arrows between AREA nodes */}
        <line x1="300" y1="260" x2="355" y2="242" stroke={DARK} strokeWidth={1.5} markerEnd="url(#pr-arrow-dark)" />
        <line x1="445" y1="242" x2="500" y2="260" stroke={DARK} strokeWidth={1.5} markerEnd="url(#pr-arrow-dark)" />
        <line x1="500" y1="290" x2="445" y2="308" stroke={DARK} strokeWidth={1.5} markerEnd="url(#pr-arrow-dark)" />
        <line x1="355" y1="308" x2="300" y2="290" stroke={DARK} strokeWidth={1.5} markerEnd="url(#pr-arrow-dark)" />
      </svg>
    </div>
  );
}

// ─── 4. ThirdPartyAttackDiagram ──────────────────────────────────────────────

export function ThirdPartyAttackDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 800 320"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="tpa-arrow"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
          <marker
            id="tpa-arrow-muted"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={MUTED} />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="400"
          y="28"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          技法2: 第三者アタック -- 効果の比較
        </text>

        {/* Top: logical approach - thin arrow */}
        <rect
          x="40"
          y="55"
          width="170"
          height="44"
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth={1.5}
        />
        <text
          x="125"
          y="82"
          textAnchor="middle"
          fontSize="13"
          fontFamily={FONT}
          fill={MUTED}
        >
          論理的説明
        </text>

        <line
          x1="220"
          y1="77"
          x2="460"
          y2="77"
          stroke={MUTED}
          strokeWidth={1}
          markerEnd="url(#tpa-arrow-muted)"
        />
        <text
          x="340"
          y="70"
          textAnchor="middle"
          fontSize="10"
          fontFamily={FONT}
          fill={MUTED}
        >
          頭で理解
        </text>

        <rect
          x="470"
          y="55"
          width="140"
          height="44"
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth={1.5}
        />
        <text
          x="540"
          y="82"
          textAnchor="middle"
          fontSize="13"
          fontFamily={FONT}
          fill={MUTED}
        >
          低い効果
        </text>

        {/* Bottom: emotional approach - thick arrow */}
        <rect
          x="40"
          y="120"
          width="170"
          height="44"
          fill={ACCENT_LIGHT}
          stroke={ACCENT}
          strokeWidth={2}
        />
        <text
          x="125"
          y="140"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          第三者エピソード
        </text>
        <text
          x="125"
          y="155"
          textAnchor="middle"
          fontSize="10"
          fontFamily={FONT}
          fill={MUTED}
        >
          (感情に訴える)
        </text>

        <line
          x1="220"
          y1="142"
          x2="460"
          y2="142"
          stroke={ACCENT}
          strokeWidth={4}
          markerEnd="url(#tpa-arrow)"
        />
        <text
          x="340"
          y="135"
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fontFamily={FONT}
          fill={ACCENT}
        >
          心で納得
        </text>

        <rect
          x="470"
          y="120"
          width="140"
          height="44"
          fill={ACCENT}
          stroke={ACCENT}
          strokeWidth={2}
        />
        <text
          x="540"
          y="147"
          textAnchor="middle"
          fontSize="13"
          fontWeight="bold"
          fontFamily={FONT}
          fill="#FFFFFF"
        >
          高い効果
        </text>

        {/* Impact note */}
        <rect
          x="640"
          y="90"
          width="140"
          height="60"
          fill="#FFFFFF"
          stroke={ACCENT}
          strokeWidth={1.5}
        />
        <text
          x="710"
          y="112"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fontFamily={FONT}
          fill={ACCENT}
        >
          地獄ストーリー
        </text>
        <text
          x="710"
          y="128"
          textAnchor="middle"
          fontSize="11"
          fontFamily={FONT}
          fill={MUTED}
        >
          {">"} 天国ストーリー
        </text>
        <text
          x="710"
          y="144"
          textAnchor="middle"
          fontSize="10"
          fontFamily={FONT}
          fill={MUTED}
        >
          (恐怖の方が動く)
        </text>

        {/* Story structure */}
        <text
          x="400"
          y="205"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          エピソード構成
        </text>

        {[
          { x: 140, label: "状況", sub: "第三者の背景" },
          { x: 340, label: "決断", sub: "行動/不行動" },
          { x: 540, label: "結果", sub: "良い/悪い結末" },
        ].map((box, i) => (
          <g key={i}>
            <rect
              x={box.x - 75}
              y={225}
              width={150}
              height={50}
              fill={i === 2 ? ACCENT_LIGHT : "#F8FAFC"}
              stroke={i === 2 ? ACCENT : "#E2E8F0"}
              strokeWidth={1.5}
            />
            <text
              x={box.x}
              y={248}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fontFamily={FONT}
              fill={DARK}
            >
              {box.label}
            </text>
            <text
              x={box.x}
              y={266}
              textAnchor="middle"
              fontSize="10"
              fontFamily={FONT}
              fill={MUTED}
            >
              {box.sub}
            </text>
          </g>
        ))}

        {/* Arrows between story boxes */}
        <line x1="215" y1="250" x2="258" y2="250" stroke={DARK} strokeWidth={1.5} markerEnd="url(#tpa-arrow)" />
        <line x1="415" y1="250" x2="458" y2="250" stroke={DARK} strokeWidth={1.5} markerEnd="url(#tpa-arrow)" />

        <text
          x="400"
          y="305"
          textAnchor="middle"
          fontSize="11"
          fontFamily={FONT}
          fill={MUTED}
        >
          実在する第三者の具体的体験を語ることで、論理ではなく感情で決断を促す
        </text>
      </svg>
    </div>
  );
}

// ─── 5. PositiveShowerDiagram ────────────────────────────────────────────────

export function PositiveShowerDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 800 350"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="ps-arrow"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="400"
          y="28"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          技法3: +のシャワー -- お客様自身にプラスを語らせる
        </text>

        {/* Step 1 */}
        <rect
          x="60"
          y="60"
          width="280"
          height="60"
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth={1.5}
        />
        <text
          x="80"
          y="82"
          fontSize="12"
          fontWeight="bold"
          fontFamily={FONT}
          fill={ACCENT}
        >
          STEP 1
        </text>
        <text
          x="80"
          y="105"
          fontSize="12"
          fontFamily={FONT}
          fill={DARK}
        >
          「どのポイントが良いですか？」
        </text>

        <line x1="350" y1="90" x2="420" y2="90" stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#ps-arrow)" />

        <rect
          x="430"
          y="60"
          width="180"
          height="60"
          fill={ACCENT_LIGHT}
          stroke={ACCENT}
          strokeWidth={1.5}
        />
        <text
          x="520"
          y="85"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          YES
        </text>
        <text
          x="520"
          y="105"
          textAnchor="middle"
          fontSize="10"
          fontFamily={FONT}
          fill={MUTED}
        >
          お客様が答える
        </text>

        {/* Descending arrow */}
        <line x1="200" y1="125" x2="200" y2="145" stroke={MUTED} strokeWidth={1} strokeDasharray="3 2" />

        {/* Step 2 */}
        <rect
          x="100"
          y="150"
          width="280"
          height="60"
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth={1.5}
        />
        <text
          x="120"
          y="172"
          fontSize="12"
          fontWeight="bold"
          fontFamily={FONT}
          fill={ACCENT}
        >
          STEP 2
        </text>
        <text
          x="120"
          y="195"
          fontSize="12"
          fontFamily={FONT}
          fill={DARK}
        >
          「なぜそのポイントが良い？」
        </text>

        <line x1="390" y1="180" x2="460" y2="180" stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#ps-arrow)" />

        <rect
          x="470"
          y="150"
          width="180"
          height="60"
          fill={ACCENT_LIGHT}
          stroke={ACCENT}
          strokeWidth={1.5}
        />
        <text
          x="560"
          y="175"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          YES (deeper)
        </text>
        <text
          x="560"
          y="195"
          textAnchor="middle"
          fontSize="10"
          fontFamily={FONT}
          fill={MUTED}
        >
          より深い回答
        </text>

        {/* Descending arrow */}
        <line x1="240" y1="215" x2="240" y2="235" stroke={MUTED} strokeWidth={1} strokeDasharray="3 2" />

        {/* Step 3 */}
        <rect
          x="140"
          y="240"
          width="280"
          height="60"
          fill={ACCENT_LIGHT}
          stroke={ACCENT}
          strokeWidth={2}
        />
        <text
          x="160"
          y="262"
          fontSize="12"
          fontWeight="bold"
          fontFamily={FONT}
          fill={ACCENT}
        >
          STEP 3
        </text>
        <text
          x="160"
          y="285"
          fontSize="12"
          fontFamily={FONT}
          fill={DARK}
        >
          3倍リアクション
        </text>

        <line x1="430" y1="270" x2="500" y2="270" stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#ps-arrow)" />

        <rect
          x="510"
          y="240"
          width="200"
          height="60"
          fill={ACCENT}
          stroke={ACCENT}
          strokeWidth={2}
        />
        <text
          x="610"
          y="265"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fontFamily={FONT}
          fill="#FFFFFF"
        >
          お客様がプラスに
        </text>
        <text
          x="610"
          y="285"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fontFamily={FONT}
          fill="#FFFFFF"
        >
          切り替わる
        </text>

        {/* Staircase visual line */}
        <line x1="50" y1="90" x2="50" y2="270" stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
        <text
          x="40"
          y="180"
          textAnchor="middle"
          fontSize="10"
          fontFamily={FONT}
          fill={MUTED}
          transform="rotate(-90 40 180)"
        >
          深さが増す
        </text>

        {/* Bottom note */}
        <rect
          x="180"
          y="315"
          width="440"
          height="28"
          fill="#FFFFFF"
          stroke={ACCENT}
          strokeWidth={1}
          strokeDasharray="4 3"
        />
        <text
          x="400"
          y="334"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fontFamily={FONT}
          fill={ACCENT}
        >
          お客様自身にプラスを語らせる = 自己説得効果
        </text>
      </svg>
    </div>
  );
}

// ─── 6. ReframeDiagram ───────────────────────────────────────────────────────

export function ReframeDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 800 340"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="rf-arrow"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
          <marker
            id="rf-arrow-dark"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={DARK} />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="400"
          y="28"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          技法4: すり替え -- 視点の転換
        </text>

        {/* Left: customer assertion */}
        <rect
          x="40"
          y="55"
          width="200"
          height="90"
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth={1.5}
        />
        <text
          x="140"
          y="78"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          お客様の主張
        </text>
        <text
          x="140"
          y="100"
          textAnchor="middle"
          fontSize="11"
          fontFamily={FONT}
          fill={MUTED}
        >
          「他も見たい」
        </text>
        <text
          x="140"
          y="118"
          textAnchor="middle"
          fontSize="11"
          fontFamily={FONT}
          fill={MUTED}
        >
          「考えたい」
        </text>
        <text
          x="140"
          y="136"
          textAnchor="middle"
          fontSize="11"
          fontFamily={FONT}
          fill={MUTED}
        >
          「相談したい」
        </text>

        {/* Center: pivot */}
        <rect
          x="310"
          y="65"
          width="120"
          height="70"
          fill={ACCENT}
          stroke={ACCENT}
          strokeWidth={2}
        />
        <text
          x="370"
          y="95"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fontFamily={FONT}
          fill="#FFFFFF"
        >
          すり替え
        </text>
        <text
          x="370"
          y="115"
          textAnchor="middle"
          fontSize="10"
          fontFamily={FONT}
          fill="#E8D0D0"
        >
          視点の転換
        </text>

        {/* Rotation arrow from left to center */}
        <line x1="245" y1="100" x2="305" y2="100" stroke={ACCENT} strokeWidth={2} markerEnd="url(#rf-arrow)" />

        {/* Curved rotation indicator */}
        <path
          d="M 350 60 A 30 30 0 1 1 390 60"
          fill="none"
          stroke={ACCENT}
          strokeWidth={1.5}
          markerEnd="url(#rf-arrow)"
        />

        {/* Right: reframed view */}
        <rect
          x="500"
          y="55"
          width="220"
          height="90"
          fill={ACCENT_LIGHT}
          stroke={ACCENT}
          strokeWidth={2}
        />
        <text
          x="610"
          y="78"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          別の角度
        </text>
        <text
          x="610"
          y="100"
          textAnchor="middle"
          fontSize="11"
          fontFamily={FONT}
          fill={DARK}
        >
          「迷っているだけ」
        </text>
        <text
          x="610"
          y="118"
          textAnchor="middle"
          fontSize="11"
          fontFamily={FONT}
          fill={DARK}
        >
          「問題の先送り」
        </text>
        <text
          x="610"
          y="136"
          textAnchor="middle"
          fontSize="11"
          fontFamily={FONT}
          fill={DARK}
        >
          「決断の回避」
        </text>

        <line x1="435" y1="100" x2="495" y2="100" stroke={ACCENT} strokeWidth={2} markerEnd="url(#rf-arrow)" />

        {/* Bottom: sequence */}
        <text
          x="400"
          y="185"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          否定誘導 + 補正のセット (必ずこの順序)
        </text>

        {/* Sequence boxes */}
        {[
          { x: 100, label: "敬意", sub: "相手を認める", accent: false },
          { x: 310, label: "否定誘導", sub: "本質を突く", accent: true },
          { x: 520, label: "補正(褒め)", sub: "フォローする", accent: false },
        ].map((box, i) => (
          <g key={i}>
            <rect
              x={box.x}
              y={210}
              width={160}
              height={55}
              fill={box.accent ? ACCENT : "#F8FAFC"}
              stroke={box.accent ? ACCENT : "#E2E8F0"}
              strokeWidth={1.5}
            />
            <text
              x={box.x + 80}
              y={235}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fontFamily={FONT}
              fill={box.accent ? "#FFFFFF" : DARK}
            >
              {box.label}
            </text>
            <text
              x={box.x + 80}
              y={255}
              textAnchor="middle"
              fontSize="10"
              fontFamily={FONT}
              fill={box.accent ? "#E8D0D0" : MUTED}
            >
              {box.sub}
            </text>
          </g>
        ))}

        {/* Arrows */}
        <line x1="265" y1="237" x2="305" y2="237" stroke={DARK} strokeWidth={1.5} markerEnd="url(#rf-arrow-dark)" />
        <line x1="475" y1="237" x2="515" y2="237" stroke={DARK} strokeWidth={1.5} markerEnd="url(#rf-arrow-dark)" />

        {/* Step numbers */}
        <text x="165" y="282" textAnchor="middle" fontSize="11" fontFamily={FONT} fill={MUTED}>1</text>
        <text x="375" y="282" textAnchor="middle" fontSize="11" fontFamily={FONT} fill={MUTED}>2</text>
        <text x="585" y="282" textAnchor="middle" fontSize="11" fontFamily={FONT} fill={MUTED}>3</text>

        {/* Warning */}
        <text
          x="400"
          y="320"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fontFamily={FONT}
          fill={ACCENT}
        >
          否定だけでは反感を買う -- 必ず「補正」でフォローすること
        </text>
      </svg>
    </div>
  );
}

// ─── 7. ValueStackingDiagram ─────────────────────────────────────────────────

export function ValueStackingDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 800 360"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="vs-arrow"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
          <marker
            id="vs-arrow-dark"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={DARK} />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="400"
          y="28"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          技法5: 価値の上乗せ -- 天秤のメタファー
        </text>

        {/* Scale base */}
        <line x1="200" y1="230" x2="600" y2="230" stroke={DARK} strokeWidth={2} />
        {/* Fulcrum triangle */}
        <polygon points="400,230 380,260 420,260" fill={DARK} />
        {/* Stand */}
        <line x1="400" y1="260" x2="400" y2="280" stroke={DARK} strokeWidth={3} />
        <line x1="360" y1="280" x2="440" y2="280" stroke={DARK} strokeWidth={3} />

        {/* Scale beam - tilted: left up (price light), right down (value heavy) */}
        <line x1="200" y1="200" x2="600" y2="170" stroke={DARK} strokeWidth={2.5} />

        {/* Left pan: price (one weight, going up = lighter) */}
        <line x1="200" y1="200" x2="200" y2="210" stroke={DARK} strokeWidth={1.5} />
        <rect
          x="150"
          y="140"
          width="100"
          height="55"
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth={1.5}
        />
        <text
          x="200"
          y="163"
          textAnchor="middle"
          fontSize="13"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          価格
        </text>
        <text
          x="200"
          y="183"
          textAnchor="middle"
          fontSize="10"
          fontFamily={FONT}
          fill={MUTED}
        >
          お客様の認識
        </text>

        {/* Label above left */}
        <text
          x="200"
          y="128"
          textAnchor="middle"
          fontSize="13"
          fontFamily={FONT}
          fill={MUTED}
        >
          「高い」
        </text>

        {/* Right pan: value (3 stacked weights, going down = heavier) */}
        <line x1="600" y1="170" x2="600" y2="180" stroke={DARK} strokeWidth={1.5} />

        {/* 3 stacked value blocks */}
        {[
          { y: 62, label: "SP+ベネフィット 1" },
          { y: 98, label: "SP+ベネフィット 2" },
          { y: 134, label: "SP+ベネフィット 3" },
        ].map((block, i) => (
          <g key={i}>
            <rect
              x="530"
              y={block.y}
              width="140"
              height="32"
              fill={i === 2 ? ACCENT : ACCENT_LIGHT}
              stroke={ACCENT}
              strokeWidth={1.5}
            />
            <text
              x="600"
              y={block.y + 21}
              textAnchor="middle"
              fontSize="11"
              fontWeight={i === 2 ? "bold" : "normal"}
              fontFamily={FONT}
              fill={i === 2 ? "#FFFFFF" : DARK}
            >
              {block.label}
            </text>
          </g>
        ))}

        {/* Label above right */}
        <text
          x="600"
          y="52"
          textAnchor="middle"
          fontSize="13"
          fontWeight="bold"
          fontFamily={FONT}
          fill={ACCENT}
        >
          価値（積み上げ）
        </text>

        {/* Arrow showing tip direction */}
        <path
          d="M 300 100 Q 400 80 500 100"
          fill="none"
          stroke={ACCENT}
          strokeWidth={1.5}
          strokeDasharray="4 3"
          markerEnd="url(#vs-arrow)"
        />
        <text
          x="400"
          y="78"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fontFamily={FONT}
          fill={ACCENT}
        >
          「高い」 → 「安い」
        </text>

        {/* Key text */}
        <rect
          x="160"
          y="290"
          width="280"
          height="30"
          fill="#FFFFFF"
          stroke={ACCENT}
          strokeWidth={1.5}
          strokeDasharray="6 3"
        />
        <text
          x="300"
          y="310"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fontFamily={FONT}
          fill={ACCENT}
        >
          値引きではなく価値を積み上げる
        </text>

        {/* Flow at bottom */}
        <text
          x="400"
          y="350"
          textAnchor="middle"
          fontSize="13"
          fontWeight="bold"
          fontFamily={FONT}
          fill={DARK}
        >
          手順:
        </text>

        {[
          { x: 470, label: "驚き" },
          { x: 560, label: "謝罪" },
          { x: 670, label: "SP+ベネフィット3連発" },
        ].map((step, i) => (
          <g key={i}>
            <text
              x={step.x}
              y={350}
              textAnchor="middle"
              fontSize="12"
              fontFamily={FONT}
              fill={i === 2 ? ACCENT : DARK}
              fontWeight={i === 2 ? "bold" : "normal"}
            >
              {step.label}
            </text>
            {i < 2 && (
              <text
                x={step.x + 40}
                y={350}
                textAnchor="middle"
                fontSize="12"
                fontFamily={FONT}
                fill={MUTED}
              >
                →
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
