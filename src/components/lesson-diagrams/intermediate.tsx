// Intermediate lesson diagrams (7 lessons)
// Pure SVG React components — educational style, no emoji, no gradients, no shadows

const ACCENT = "#2563EB";
const DARK = "#1E293B";
const MUTED = "#64748B";
const LIGHT_BG = "#FFF7ED";
const BORDER = "#CBD5E1";
const FONT = "system-ui, sans-serif";

// ─── 1. ClosingIntroDiagram ───────────────────────────────────────────────────
// Triangle of 3 closing weapons + positive/negative/appeal flow
export function ClosingIntroDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 600 400"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="クロージングの3大武器"
      >
        <defs>
          <marker
            id="ci-arrow"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
        </defs>

        {/* Triangle edges */}
        <line x1="300" y1="50" x2="130" y2="220" stroke={BORDER} strokeWidth="2" />
        <line x1="300" y1="50" x2="470" y2="220" stroke={BORDER} strokeWidth="2" />
        <line x1="130" y1="220" x2="470" y2="220" stroke={BORDER} strokeWidth="2" />

        {/* Top vertex */}
        <rect x="210" y="20" width="180" height="40" rx="0" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
        <text x="300" y="46" textAnchor="middle" fontSize="14" fontFamily={FONT} fill={DARK} fontWeight="bold">
          {"証言引用（第三者話法）"}
        </text>

        {/* Bottom-left vertex */}
        <rect x="40" y="210" width="180" height="40" rx="0" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
        <text x="130" y="236" textAnchor="middle" fontSize="14" fontFamily={FONT} fill={DARK} fontWeight="bold">
          {"社会的証明（多数派）"}
        </text>

        {/* Bottom-right vertex */}
        <rect x="380" y="210" width="180" height="40" rx="0" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
        <text x="470" y="236" textAnchor="middle" fontSize="14" fontFamily={FONT} fill={DARK} fontWeight="bold">
          {"一貫性通し"}
        </text>

        {/* Center label */}
        <text x="300" y="160" textAnchor="middle" fontSize="16" fontFamily={FONT} fill={ACCENT} fontWeight="bold">
          {"クロージングの3大武器"}
        </text>

        {/* Divider line */}
        <line x1="100" y1="280" x2="500" y2="280" stroke={BORDER} strokeWidth="1" />

        {/* Bottom flow: positive -> negative -> appeal */}
        <rect x="100" y="310" width="120" height="36" fill="white" stroke={ACCENT} strokeWidth="2" />
        <text x="160" y="334" textAnchor="middle" fontSize="14" fontFamily={FONT} fill={DARK} fontWeight="bold">
          {"ポジティブ"}
        </text>

        <line x1="220" y1="328" x2="238" y2="328" stroke={ACCENT} strokeWidth="2" markerEnd="url(#ci-arrow)" />

        <rect x="248" y="310" width="120" height="36" fill="white" stroke={ACCENT} strokeWidth="2" />
        <text x="308" y="334" textAnchor="middle" fontSize="14" fontFamily={FONT} fill={DARK} fontWeight="bold">
          {"ネガティブ"}
        </text>

        <line x1="368" y1="328" x2="386" y2="328" stroke={ACCENT} strokeWidth="2" markerEnd="url(#ci-arrow)" />

        <rect x="396" y="310" width="100" height="36" fill={ACCENT} stroke={ACCENT} strokeWidth="2" />
        <text x="446" y="334" textAnchor="middle" fontSize="14" fontFamily={FONT} fill="white" fontWeight="bold">
          {"訴求"}
        </text>

        <text x="300" y="375" textAnchor="middle" fontSize="12" fontFamily={FONT} fill={MUTED}>
          {"クロージングは必ずこの順番で行う"}
        </text>
      </svg>
    </div>
  );
}

// ─── 2. SocialProofDiagram ────────────────────────────────────────────────────
// Group influence: majority -> individual
export function SocialProofDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 600 320"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="社会的証明の図解"
      >
        <defs>
          <marker
            id="sp-arrow"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={ACCENT} />
          </marker>
        </defs>

        {/* Title */}
        <text x="300" y="30" textAnchor="middle" fontSize="16" fontFamily={FONT} fill={ACCENT} fontWeight="bold">
          {'"多数派"の力で安心感を与える'}
        </text>

        {/* Group box */}
        <rect x="40" y="50" width="300" height="200" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
        <text x="190" y="75" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={ACCENT} fontWeight="bold">
          {"大多数のお客様"}
        </text>

        {/* Person figures in group (simple head + body) */}
        {[
          [80, 120], [140, 120], [200, 120], [260, 120],
          [110, 180], [170, 180], [230, 180],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy as number - 15} r="12" fill={ACCENT} />
            <rect x={cx as number - 8} y={cy} width="16" height="24" fill={ACCENT} />
          </g>
        ))}

        <text x="190" y="235" textAnchor="middle" fontSize="12" fontFamily={FONT} fill={DARK}>
          {"みなさん選ばれています"}
        </text>

        {/* Arrow from group to individual */}
        <line x1="350" y1="150" x2="420" y2="150" stroke={ACCENT} strokeWidth="3" markerEnd="url(#sp-arrow)" />
        <text x="385" y="140" textAnchor="middle" fontSize="11" fontFamily={FONT} fill={MUTED}>
          {"影響"}
        </text>

        {/* Individual */}
        <rect x="440" y="80" width="130" height="140" fill="white" stroke={BORDER} strokeWidth="2" />
        <text x="505" y="105" textAnchor="middle" fontSize="12" fontFamily={FONT} fill={MUTED}>
          {"お客様（個人）"}
        </text>
        <circle cx="505" cy="140" r="16" fill={BORDER} />
        <rect x="495" y="160" width="20" height="30" fill={BORDER} />
        <text x="505" y="210" textAnchor="middle" fontSize="11" fontFamily={FONT} fill={DARK} fontWeight="bold">
          {"安心して決断"}
        </text>

        {/* Bottom note */}
        <text x="300" y="290" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={DARK}>
          {"他の人も選んでいる事実が、決断のハードルを下げる"}
        </text>
      </svg>
    </div>
  );
}

// ─── 3. ConsistencyDiagram ────────────────────────────────────────────────────
// Loop: ゴール共有 -> 商談 -> 一貫性通し, with start-end match
export function ConsistencyDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 600 360"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="一貫性通しの図解"
      >
        <defs>
          <marker
            id="co-arrow"
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
        <text x="300" y="30" textAnchor="middle" fontSize="16" fontFamily={FONT} fill={ACCENT} fontWeight="bold">
          {'"始め"と"終わり"を一致させる'}
        </text>

        {/* Circular flow: three boxes in a triangle-loop */}
        {/* Top-left: ゴール共有 */}
        <rect x="60" y="60" width="160" height="44" fill={ACCENT} stroke={ACCENT} strokeWidth="2" />
        <text x="140" y="88" textAnchor="middle" fontSize="14" fontFamily={FONT} fill="white" fontWeight="bold">
          {"ゴール共有（最初）"}
        </text>

        {/* Top-right: 商談 */}
        <rect x="380" y="60" width="160" height="44" fill="white" stroke={BORDER} strokeWidth="2" />
        <text x="460" y="88" textAnchor="middle" fontSize="14" fontFamily={FONT} fill={DARK} fontWeight="bold">
          {"商談"}
        </text>

        {/* Bottom-center: 一貫性通し */}
        <rect x="220" y="180" width="160" height="44" fill={ACCENT} stroke={ACCENT} strokeWidth="2" />
        <text x="300" y="208" textAnchor="middle" fontSize="14" fontFamily={FONT} fill="white" fontWeight="bold">
          {"一貫性通し（最後）"}
        </text>

        {/* Arrows forming a loop */}
        {/* ゴール共有 -> 商談 */}
        <line x1="220" y1="82" x2="370" y2="82" stroke={ACCENT} strokeWidth="2" markerEnd="url(#co-arrow)" />
        {/* 商談 -> 一貫性通し */}
        <line x1="460" y1="104" x2="365" y2="180" stroke={ACCENT} strokeWidth="2" markerEnd="url(#co-arrow)" />
        {/* 一貫性通し -> ゴール共有 (curved back) */}
        <path
          d="M 220 202 Q 50 202 100 104"
          fill="none"
          stroke={ACCENT}
          strokeWidth="2"
          strokeDasharray="6 3"
          markerEnd="url(#co-arrow)"
        />
        <text x="60" y="165" textAnchor="middle" fontSize="11" fontFamily={FONT} fill={MUTED}>
          {"一致"}
        </text>

        {/* Divider */}
        <line x1="80" y1="250" x2="520" y2="250" stroke={BORDER} strokeWidth="1" />

        {/* Example below */}
        <text x="300" y="275" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={MUTED}>
          {"具体例"}
        </text>

        {/* 前提 example */}
        <rect x="40" y="290" width="240" height="40" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" />
        <text x="160" y="306" textAnchor="middle" fontSize="11" fontFamily={FONT} fill={DARK}>
          {"前提「良いと思ったら"}
        </text>
        <text x="160" y="322" textAnchor="middle" fontSize="11" fontFamily={FONT} fill={DARK} fontWeight="bold">
          {"スタートしてくださいね」"}
        </text>

        {/* Arrow */}
        <line x1="285" y1="310" x2="315" y2="310" stroke={ACCENT} strokeWidth="2" markerEnd="url(#co-arrow)" />

        {/* 訴求 example */}
        <rect x="325" y="290" width="240" height="40" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" />
        <text x="445" y="306" textAnchor="middle" fontSize="11" fontFamily={FONT} fill={DARK}>
          {"訴求「良いと思ったから"}
        </text>
        <text x="445" y="322" textAnchor="middle" fontSize="11" fontFamily={FONT} fill={DARK} fontWeight="bold">
          {"スタートしましょう」"}
        </text>
      </svg>
    </div>
  );
}

// ─── 4. QuotationMethodDiagram ────────────────────────────────────────────────
// Speech bubble comparison: own words (weak) vs quoted words (strong)
export function QuotationMethodDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 600 350"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="証言引用（第三者話法）の図解"
      >
        <defs>
          <marker
            id="qm-arrow"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
          <marker
            id="qm-arrow-muted"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={BORDER} />
          </marker>
        </defs>

        {/* Row 1: Own words — weak */}
        <text x="30" y="40" fontSize="13" fontFamily={FONT} fill={MUTED} fontWeight="bold">
          {"自分の言葉"}
        </text>

        {/* Speech bubble (simple) */}
        <rect x="30" y="50" width="260" height="50" fill="white" stroke={BORDER} strokeWidth="2" />
        <text x="160" y="80" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={MUTED}>
          {"「これは本当に良い商品です」"}
        </text>
        {/* Bubble tail */}
        <polygon points="290,65 310,75 290,85" fill="white" stroke={BORDER} strokeWidth="2" />
        <line x1="290" y1="65" x2="290" y2="85" stroke="white" strokeWidth="3" />

        {/* Weak impact arrow */}
        <line x1="330" y1="75" x2="410" y2="75" stroke={BORDER} strokeWidth="2" markerEnd="url(#qm-arrow-muted)" />
        <text x="450" y="70" fontSize="12" fontFamily={FONT} fill={MUTED}>
          {"効果"}
        </text>
        <rect x="430" y="55" width="50" height="30" fill="white" stroke={BORDER} strokeWidth="1.5" />
        <text x="455" y="75" textAnchor="middle" fontSize="11" fontFamily={FONT} fill={MUTED}>
          {"小"}
        </text>

        {/* Row 2: Quoted words — strong */}
        <text x="30" y="140" fontSize="13" fontFamily={FONT} fill={ACCENT} fontWeight="bold">
          {"お客様の声（証言引用）"}
        </text>

        {/* Speech bubble (emphasized) */}
        <rect x="30" y="150" width="260" height="50" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
        <text x="160" y="172" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={DARK}>
          {"「前のお客様も、"}
        </text>
        <text x="160" y="190" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={DARK} fontWeight="bold">
          {"始めてよかった」と..."}
        </text>
        {/* Bubble tail */}
        <polygon points="290,165 310,175 290,185" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
        <line x1="290" y1="165" x2="290" y2="185" stroke={LIGHT_BG} strokeWidth="3" />

        {/* Strong impact arrow */}
        <line x1="330" y1="175" x2="410" y2="175" stroke={ACCENT} strokeWidth="3" markerEnd="url(#qm-arrow)" />
        <text x="450" y="170" fontSize="12" fontFamily={FONT} fill={ACCENT}>
          {"効果"}
        </text>
        <rect x="430" y="155" width="80" height="30" fill={ACCENT} stroke={ACCENT} strokeWidth="1.5" />
        <text x="470" y="175" textAnchor="middle" fontSize="13" fontFamily={FONT} fill="white" fontWeight="bold">
          {"大"}
        </text>

        {/* Divider */}
        <line x1="30" y1="225" x2="570" y2="225" stroke={BORDER} strokeWidth="1" />

        {/* Pattern flow: 「間」-> 証言引用 -> 「間」-> 効果 */}
        <text x="300" y="250" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={MUTED} fontWeight="bold">
          {"証言引用のパターン"}
        </text>

        <rect x="50" y="270" width="80" height="36" fill="white" stroke={BORDER} strokeWidth="1.5" />
        <text x="90" y="293" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={MUTED}>
          {"「間」"}
        </text>

        <line x1="130" y1="288" x2="160" y2="288" stroke={ACCENT} strokeWidth="2" markerEnd="url(#qm-arrow)" />

        <rect x="170" y="270" width="120" height="36" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
        <text x="230" y="293" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={DARK} fontWeight="bold">
          {"証言引用"}
        </text>

        <line x1="290" y1="288" x2="320" y2="288" stroke={ACCENT} strokeWidth="2" markerEnd="url(#qm-arrow)" />

        <rect x="330" y="270" width="80" height="36" fill="white" stroke={BORDER} strokeWidth="1.5" />
        <text x="370" y="293" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={MUTED}>
          {"「間」"}
        </text>

        <line x1="410" y1="288" x2="440" y2="288" stroke={ACCENT} strokeWidth="2" markerEnd="url(#qm-arrow)" />

        <rect x="450" y="270" width="100" height="36" fill={ACCENT} stroke={ACCENT} strokeWidth="2" />
        <text x="500" y="293" textAnchor="middle" fontSize="13" fontFamily={FONT} fill="white" fontWeight="bold">
          {"効果"}
        </text>

        <text x="300" y="330" textAnchor="middle" fontSize="12" fontFamily={FONT} fill={MUTED}>
          {"第三者の言葉は自分の言葉より説得力が高い"}
        </text>
      </svg>
    </div>
  );
}

// ─── 5. PositiveClosingDiagram ────────────────────────────────────────────────
// Single flow + triple rhythm
export function PositiveClosingDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 620 340"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="ポジティブクロージングの図解"
      >
        <defs>
          <marker
            id="pc-arrow"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
        </defs>

        {/* Section 1: 未来描写クロージング */}
        <text x="310" y="24" textAnchor="middle" fontSize="14" fontFamily={FONT} fill={ACCENT} fontWeight="bold">
          {"未来描写クロージング"}
        </text>

        {/* Flow: SP -> ベネフィット -> 天国IF -> 3倍リアクション -> 証言引用 -> 訴求 */}
        {[
          { label: "SP", x: 10, w: 60 },
          { label: "ベネフィット", x: 85, w: 95 },
          { label: "天国IF", x: 195, w: 70 },
          { label: "3倍\nリアクション", x: 280, w: 85 },
          { label: "証言引用", x: 380, w: 85 },
          { label: "訴求", x: 480, w: 70, accent: true },
        ].map((item, i) => (
          <g key={i}>
            <rect
              x={item.x}
              y={38}
              width={item.w}
              height={36}
              fill={item.accent ? ACCENT : "white"}
              stroke={ACCENT}
              strokeWidth="1.5"
            />
            {item.label.includes("\n") ? (
              <>
                <text
                  x={item.x + item.w / 2}
                  y={52}
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily={FONT}
                  fill={item.accent ? "white" : DARK}
                  fontWeight="bold"
                >
                  {item.label.split("\n")[0]}
                </text>
                <text
                  x={item.x + item.w / 2}
                  y={66}
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily={FONT}
                  fill={item.accent ? "white" : DARK}
                  fontWeight="bold"
                >
                  {item.label.split("\n")[1]}
                </text>
              </>
            ) : (
              <text
                x={item.x + item.w / 2}
                y={61}
                textAnchor="middle"
                fontSize="12"
                fontFamily={FONT}
                fill={item.accent ? "white" : DARK}
                fontWeight="bold"
              >
                {item.label}
              </text>
            )}
            {i < 5 && (
              <line
                x1={item.x + item.w}
                y1={56}
                x2={item.x + item.w + 12}
                y2={56}
                stroke={ACCENT}
                strokeWidth="1.5"
                markerEnd="url(#pc-arrow)"
              />
            )}
          </g>
        ))}

        {/* Divider */}
        <line x1="30" y1="100" x2="570" y2="100" stroke={BORDER} strokeWidth="1" />

        {/* Section 2: 三段ベネフィット訴求 */}
        <text x="310" y="126" textAnchor="middle" fontSize="14" fontFamily={FONT} fill={ACCENT} fontWeight="bold">
          {"三段ベネフィット訴求"}
        </text>
        <text x="310" y="145" textAnchor="middle" fontSize="12" fontFamily={FONT} fill={MUTED}>
          {"3つのベネフィットでリズムを作る"}
        </text>

        {/* Three equal boxes */}
        {[0, 1, 2].map((i) => {
          const x = 30 + i * 190;
          const num = i + 1;
          const connector = i === 0 ? "しかも!" : i === 1 ? "さらに!" : "";
          return (
            <g key={i}>
              <rect x={x} y={160} width="170" height="80" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
              {/* Number circle */}
              <circle cx={x + 20} cy={180} r="12" fill={ACCENT} />
              <text x={x + 20} y={185} textAnchor="middle" fontSize="13" fontFamily={FONT} fill="white" fontWeight="bold">
                {num}
              </text>
              <text x={x + 85} y={195} textAnchor="middle" fontSize="12" fontFamily={FONT} fill={DARK}>
                {"SP"}
              </text>
              <text x={x + 85} y={215} textAnchor="middle" fontSize="11" fontFamily={FONT} fill={MUTED}>
                {"ベネフィット"}
              </text>
              <text x={x + 85} y={230} textAnchor="middle" fontSize="12" fontFamily={FONT} fill={DARK} fontWeight="bold">
                {"天国IF"}
              </text>
              {connector && (
                <text
                  x={x + 180}
                  y={205}
                  textAnchor="middle"
                  fontSize="13"
                  fontFamily={FONT}
                  fill={ACCENT}
                  fontWeight="bold"
                >
                  {connector}
                </text>
              )}
            </g>
          );
        })}

        {/* Arrow to 訴求 */}
        <line x1="310" y1="250" x2="310" y2="278" stroke={ACCENT} strokeWidth="2" markerEnd="url(#pc-arrow)" />
        <rect x="255" y="286" width="110" height="36" fill={ACCENT} stroke={ACCENT} strokeWidth="2" />
        <text x="310" y="310" textAnchor="middle" fontSize="14" fontFamily={FONT} fill="white" fontWeight="bold">
          {"訴求"}
        </text>
      </svg>
    </div>
  );
}

// ─── 6. NegativeClosingDiagram ────────────────────────────────────────────────
// Balance/scale: gain vs loss + flow + note
export function NegativeClosingDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 600 380"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="ネガティブクロージングの図解"
      >
        <defs>
          <marker
            id="nc-arrow"
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
        <text x="300" y="28" textAnchor="middle" fontSize="15" fontFamily={FONT} fill={ACCENT} fontWeight="bold">
          {"プロスペクト理論"}
        </text>
        <text x="300" y="48" textAnchor="middle" fontSize="12" fontFamily={FONT} fill={MUTED}>
          {"人は「得する喜び」より「損する恐怖」を強く感じる"}
        </text>

        {/* Scale base / fulcrum */}
        <polygon points="300,175 290,190 310,190" fill={DARK} />
        <line x1="290" y1="190" x2="310" y2="190" stroke={DARK} strokeWidth="2" />

        {/* Tilted beam: left side up, right side down */}
        <line x1="120" y1="140" x2="480" y2="170" stroke={DARK} strokeWidth="3" />

        {/* Left pan (gain — lighter, higher) */}
        <line x1="120" y1="140" x2="120" y2="115" stroke={DARK} strokeWidth="1.5" />
        <rect x="60" y="80" width="120" height="36" fill="white" stroke={BORDER} strokeWidth="2" />
        <text x="120" y="103" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={MUTED} fontWeight="bold">
          {"得する喜び"}
        </text>
        <text x="120" y="70" textAnchor="middle" fontSize="18" fontFamily={FONT} fill={BORDER} fontWeight="bold">
          {"x1"}
        </text>

        {/* Right pan (loss — heavier, lower) */}
        <line x1="480" y1="170" x2="480" y2="195" stroke={DARK} strokeWidth="1.5" />
        <rect x="420" y="195" width="120" height="36" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
        <text x="480" y="218" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={ACCENT} fontWeight="bold">
          {"損する恐怖"}
        </text>
        <text x="480" y="250" textAnchor="middle" fontSize="18" fontFamily={FONT} fill={ACCENT} fontWeight="bold">
          {"x2"}
        </text>

        {/* Divider */}
        <line x1="60" y1="268" x2="540" y2="268" stroke={BORDER} strokeWidth="1" />

        {/* Flow: 逆SP -> 逆ベネフィット -> 地獄IF */}
        <text x="300" y="290" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={MUTED} fontWeight="bold">
          {"ネガティブクロージングの流れ"}
        </text>

        <rect x="80" y="302" width="110" height="36" fill="white" stroke={ACCENT} strokeWidth="1.5" />
        <text x="135" y="325" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={DARK} fontWeight="bold">
          {"逆SP"}
        </text>

        <line x1="190" y1="320" x2="218" y2="320" stroke={ACCENT} strokeWidth="2" markerEnd="url(#nc-arrow)" />

        <rect x="228" y="302" width="130" height="36" fill="white" stroke={ACCENT} strokeWidth="1.5" />
        <text x="293" y="325" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={DARK} fontWeight="bold">
          {"逆ベネフィット"}
        </text>

        <line x1="358" y1="320" x2="386" y2="320" stroke={ACCENT} strokeWidth="2" markerEnd="url(#nc-arrow)" />

        <rect x="396" y="302" width="110" height="36" fill={ACCENT} stroke={ACCENT} strokeWidth="2" />
        <text x="451" y="325" textAnchor="middle" fontSize="13" fontFamily={FONT} fill="white" fontWeight="bold">
          {"地獄IF"}
        </text>

        {/* Note at bottom */}
        <text x="300" y="365" textAnchor="middle" fontSize="12" fontFamily={FONT} fill={ACCENT}>
          {"※ 敬意を必ず添える"}
        </text>
      </svg>
    </div>
  );
}

// ─── 7. DesirePatternsDiagram ─────────────────────────────────────────────────
// Two columns: 積極的欲求 vs 消極的欲求, combined formula
export function DesirePatternsDiagram() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 600 340"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="欲求パターンの図解"
      >
        <defs>
          <marker
            id="dp-arrow-up"
            markerWidth="8"
            markerHeight="6"
            refX="4"
            refY="0"
            orient="auto"
          >
            <polygon points="0 6, 4 0, 8 6" fill={MUTED} />
          </marker>
          <marker
            id="dp-arrow-down"
            markerWidth="8"
            markerHeight="6"
            refX="4"
            refY="6"
            orient="auto"
          >
            <polygon points="0 0, 4 6, 8 0" fill={ACCENT} />
          </marker>
        </defs>

        {/* Title */}
        <text x="300" y="28" textAnchor="middle" fontSize="15" fontFamily={FONT} fill={ACCENT} fontWeight="bold">
          {"2つの欲求パターン"}
        </text>

        {/* Left column: 積極的欲求 */}
        <rect x="40" y="50" width="230" height="160" fill="white" stroke={BORDER} strokeWidth="2" />
        <text x="155" y="78" textAnchor="middle" fontSize="14" fontFamily={FONT} fill={DARK} fontWeight="bold">
          {"積極的欲求"}
        </text>
        <text x="155" y="100" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={MUTED}>
          {"「~したい」"}
        </text>

        {/* Up arrow */}
        <line x1="155" y1="160" x2="155" y2="118" stroke={MUTED} strokeWidth="3" markerEnd="url(#dp-arrow-up)" />

        {/* Strength bar — moderate */}
        <rect x="100" y="170" width="110" height="16" fill="white" stroke={BORDER} strokeWidth="1.5" />
        <rect x="100" y="170" width="60" height="16" fill={BORDER} />
        <text x="155" y="200" textAnchor="middle" fontSize="11" fontFamily={FONT} fill={MUTED}>
          {"影響力: 中"}
        </text>

        {/* Right column: 消極的欲求 */}
        <rect x="330" y="50" width="230" height="160" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
        <text x="445" y="78" textAnchor="middle" fontSize="14" fontFamily={FONT} fill={ACCENT} fontWeight="bold">
          {"消極的欲求"}
        </text>
        <text x="445" y="100" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={DARK}>
          {"「~したくない」"}
        </text>

        {/* Down arrow */}
        <line x1="445" y1="112" x2="445" y2="155" stroke={ACCENT} strokeWidth="3" markerEnd="url(#dp-arrow-down)" />

        {/* Strength bar — strong */}
        <rect x="390" y="170" width="110" height="16" fill="white" stroke={ACCENT} strokeWidth="1.5" />
        <rect x="390" y="170" width="100" height="16" fill={ACCENT} />
        <text x="445" y="200" textAnchor="middle" fontSize="11" fontFamily={FONT} fill={ACCENT} fontWeight="bold">
          {"影響力: 強"}
        </text>

        {/* Label: こちらが強い */}
        <line x1="520" y1="80" x2="545" y2="80" stroke={ACCENT} strokeWidth="1.5" />
        <line x1="545" y1="80" x2="545" y2="55" stroke={ACCENT} strokeWidth="1.5" />
        <text x="545" y="48" textAnchor="middle" fontSize="12" fontFamily={FONT} fill={ACCENT} fontWeight="bold">
          {"こちらが強い"}
        </text>

        {/* Divider */}
        <line x1="60" y1="230" x2="540" y2="230" stroke={BORDER} strokeWidth="1" />

        {/* Formula */}
        <text x="300" y="256" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={MUTED} fontWeight="bold">
          {"両方を組み合わせる"}
        </text>

        <rect x="40" y="270" width="140" height="40" fill="white" stroke={BORDER} strokeWidth="2" />
        <text x="110" y="295" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={DARK} fontWeight="bold">
          {"積極的欲求"}
        </text>

        <text x="205" y="296" textAnchor="middle" fontSize="22" fontFamily={FONT} fill={ACCENT} fontWeight="bold">
          {"+"}
        </text>

        <rect x="230" y="270" width="140" height="40" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
        <text x="300" y="295" textAnchor="middle" fontSize="13" fontFamily={FONT} fill={ACCENT} fontWeight="bold">
          {"消極的欲求"}
        </text>

        <text x="395" y="296" textAnchor="middle" fontSize="22" fontFamily={FONT} fill={ACCENT} fontWeight="bold">
          {"="}
        </text>

        <rect x="420" y="270" width="150" height="40" fill={ACCENT} stroke={ACCENT} strokeWidth="2" />
        <text x="495" y="295" textAnchor="middle" fontSize="13" fontFamily={FONT} fill="white" fontWeight="bold">
          {"訴求力最大化"}
        </text>

        <text x="300" y="332" textAnchor="middle" fontSize="12" fontFamily={FONT} fill={MUTED}>
          {"ポジティブ + ネガティブ = 最強の訴求"}
        </text>
      </svg>
    </div>
  );
}
