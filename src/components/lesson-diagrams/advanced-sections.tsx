"use client";

const ACCENT = "#7C3AED";
const DARK = "#1E293B";
const MUTED = "#64748B";
const LIGHT_BG = "#F1F5F9";
const WHITE = "#FFFFFF";
const FONT = "system-ui, sans-serif";

// =====================================================================
// 1. rebuttal-basics  (3 diagrams)
// =====================================================================

/** Bar chart: rebuttal attempts vs success rate uplift */
function RebuttalMindsetDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 200"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <text x="260" y="20" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          反論 = 関心の証 -- 一貫性の法則
        </text>

        {/* Flow: 反論 -> 関心がある -> 一貫性活用 -> 成約 */}
        {[
          { x: 20, w: 100, label: "反論が出る", sub: "お客様の抵抗", bg: LIGHT_BG, stroke: MUTED, fg: DARK },
          { x: 140, w: 110, label: "関心がある証拠", sub: "買いたい vs 不安", bg: LIGHT_BG, stroke: ACCENT, fg: DARK },
          { x: 270, w: 120, label: "一貫性の法則", sub: "過去のYESを活用", bg: ACCENT, stroke: ACCENT, fg: WHITE },
          { x: 410, w: 90, label: "成約", sub: "不安を解消", bg: ACCENT, stroke: ACCENT, fg: WHITE },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={50} width={b.w} height={50} fill={b.bg} stroke={b.stroke} strokeWidth={1.5} />
            <text x={b.x + b.w / 2} y={72} textAnchor="middle" fontSize="11" fontWeight="bold" fill={b.fg}>{b.label}</text>
            <text x={b.x + b.w / 2} y={88} textAnchor="middle" fontSize="9" fill={b.fg === WHITE ? "#E8D0D0" : MUTED}>{b.sub}</text>
          </g>
        ))}

        {/* Arrows */}
        <defs>
          <marker id="as-rb-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={ACCENT} />
          </marker>
        </defs>
        <line x1="120" y1="75" x2="137" y2="75" stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#as-rb-arr)" />
        <line x1="250" y1="75" x2="267" y2="75" stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#as-rb-arr)" />
        <line x1="390" y1="75" x2="407" y2="75" stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#as-rb-arr)" />

        {/* Bottom note */}
        <text x="260" y="130" textAnchor="middle" fontSize="11" fill={MUTED}>
          本当に興味がなければ、反論すらせず即座に断る
        </text>

        {/* Contrast */}
        <rect x="100" y="145" width="320" height="40" fill={WHITE} stroke={ACCENT} strokeWidth={1} strokeDasharray="4 3" />
        <text x="260" y="163" textAnchor="middle" fontSize="10" fill={DARK}>
          {"「良いですね」と一度言ったお客様は、矛盾する行動（断る）を"}
        </text>
        <text x="260" y="178" textAnchor="middle" fontSize="10" fontWeight="bold" fill={ACCENT}>
          心理的に取りにくくなる
        </text>
      </svg>
    </div>
  );
}

/** Bar chart: rebuttal count vs success rate */
function RebuttalStatsDiagram() {
  const bars = [
    { label: "1回", pct: 15, w: 60 },
    { label: "2回", pct: 25, w: 100 },
    { label: "3回+", pct: 40, w: 160 },
  ];

  return (
    <div className="my-6">
      <svg
        viewBox="0 0 500 180"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <text x="250" y="20" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          切り返し回数と成約率向上
        </text>

        {bars.map((bar, i) => {
          const y = 40 + i * 48;
          return (
            <g key={i}>
              <text x="55" y={y + 22} textAnchor="end" fontSize="12" fontWeight="bold" fill={DARK}>{bar.label}</text>
              <rect x="65" y={y} width={bar.w} height={34} fill={i === 2 ? ACCENT : LIGHT_BG} stroke={ACCENT} strokeWidth={1.5} />
              <text x={65 + bar.w + 8} y={y + 22} fontSize="12" fontWeight="bold" fill={i === 2 ? ACCENT : DARK}>+{bar.pct}%</text>
            </g>
          );
        })}

        {/* Annotation */}
        <text x="350" y="65" fontSize="10" fill={MUTED}>多くの営業マンは</text>
        <text x="350" y="80" fontSize="10" fill={MUTED}>1回で引き下がる</text>
        <text x="350" y="148" fontSize="11" fontWeight="bold" fill={ACCENT}>粘り強さが成約を生む</text>
      </svg>
    </div>
  );
}

/** 6 psychology principles grid */
function PsychologyPrinciplesDiagram() {
  const principles = [
    { label: "社会的証明", sub: "皆がやっている" },
    { label: "一貫性", sub: "言行を一致させたい" },
    { label: "返報性", sub: "お返ししたい" },
    { label: "希少性", sub: "今だけ限定" },
    { label: "権威性", sub: "専門家の裏付け" },
    { label: "好意", sub: "信頼と親近感" },
  ];

  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 170"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <text x="270" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          反論処理に使える6つの心理学原則
        </text>

        {principles.map((p, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 10 + col * 180;
          const y = 32 + row * 68;
          return (
            <g key={i}>
              <rect x={x} y={y} width={165} height={56} fill={i === 0 ? ACCENT : WHITE} stroke={ACCENT} strokeWidth={1.5} />
              <text x={x + 82} y={y + 24} textAnchor="middle" fontSize="12" fontWeight="bold" fill={i === 0 ? WHITE : DARK}>{p.label}</text>
              <text x={x + 82} y={y + 42} textAnchor="middle" fontSize="9" fill={i === 0 ? "#E8D0D0" : MUTED}>{p.sub}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// =====================================================================
// 2. rebuttal-pattern  (3 diagrams)
// =====================================================================

/** AREA method formula diagram */
function AREAMethodDiagram() {
  const steps = [
    { letter: "A", label: "主張", desc: "Assertion" },
    { letter: "R", label: "理由", desc: "Reason" },
    { letter: "E", label: "具体例", desc: "Example" },
    { letter: "A", label: "再主張", desc: "Assertion" },
  ];

  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 150"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="as-area-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={ACCENT} />
          </marker>
        </defs>

        <text x="270" y="20" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          AREA話法
        </text>

        {steps.map((s, i) => {
          const x = 15 + i * 135;
          const isA = i === 0 || i === 3;
          return (
            <g key={i}>
              <rect x={x} y={35} width={115} height={60} fill={isA ? ACCENT : WHITE} stroke={ACCENT} strokeWidth={1.5} />
              <text x={x + 57} y={57} textAnchor="middle" fontSize="18" fontWeight="bold" fill={isA ? WHITE : ACCENT}>{s.letter}</text>
              <text x={x + 57} y={74} textAnchor="middle" fontSize="11" fontWeight="bold" fill={isA ? WHITE : DARK}>{s.label}</text>
              <text x={x + 57} y={88} textAnchor="middle" fontSize="9" fill={isA ? "#E8D0D0" : MUTED}>{s.desc}</text>
              {i < 3 && (
                <line x1={x + 115} y1={65} x2={x + 132} y2={65} stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#as-area-arr)" />
              )}
            </g>
          );
        })}

        <text x="270" y="120" textAnchor="middle" fontSize="10" fill={MUTED}>
          主張から始め、理由と具体例で裏付けし、再び主張で印象づける
        </text>

        <rect x="130" y="130" width="280" height="18" fill={LIGHT_BG} stroke="none" />
        <text x="270" y="144" textAnchor="middle" fontSize="10" fontWeight="bold" fill={ACCENT}>
          ステップ3「納得の取り直し」で使う
        </text>
      </svg>
    </div>
  );
}

/** 4-step rebuttal framework: 共感 -> 認識 -> 納得 -> 訴求 */
function FourStepFrameworkDiagram() {
  const steps = [
    { num: "1", label: "共感", sub: "気持ちに寄り添う" },
    { num: "2", label: "認識", sub: "納得不足を認める" },
    { num: "3", label: "納得の取り直し", sub: "不安を解消" },
    { num: "4", label: "訴求", sub: "クロージング" },
  ];

  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 160"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="as-4s-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={ACCENT} />
          </marker>
        </defs>

        <text x="270" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          切り返しの4ステップ
        </text>

        {steps.map((s, i) => {
          const x = 10 + i * 133;
          const isLast = i === 3;
          return (
            <g key={i}>
              {/* Number badge */}
              <rect x={x + 42} y={28} width={28} height={20} fill={ACCENT} />
              <text x={x + 56} y={42} textAnchor="middle" fontSize="11" fontWeight="bold" fill={WHITE}>{s.num}</text>

              {/* Box */}
              <rect x={x} y={52} width={115} height={55} fill={isLast ? ACCENT : WHITE} stroke={ACCENT} strokeWidth={1.5} />
              <text x={x + 57} y={74} textAnchor="middle" fontSize="12" fontWeight="bold" fill={isLast ? WHITE : DARK}>{s.label}</text>
              <text x={x + 57} y={92} textAnchor="middle" fontSize="9" fill={isLast ? "#E8D0D0" : MUTED}>{s.sub}</text>

              {/* Arrow */}
              {i < 3 && (
                <line x1={x + 115} y1={79} x2={x + 130} y2={79} stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#as-4s-arr)" />
              )}
            </g>
          );
        })}

        <text x="270" y="130" textAnchor="middle" fontSize="10" fill={MUTED}>
          共感フレーズ + 感謝フレーズ + フックYES質問 = 導入の3点セット
        </text>

        <text x="270" y="150" textAnchor="middle" fontSize="10" fontWeight="bold" fill={ACCENT}>
          最初の共感が最も重要
        </text>
      </svg>
    </div>
  );
}

/** Hook YES question: small YES -> consistency -> close */
function HookYesDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 150"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="as-hy-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={ACCENT} />
          </marker>
        </defs>

        <text x="260" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          フックYES質問の流れ
        </text>

        {/* Step boxes */}
        {[
          { x: 10, w: 140, label: "小さなYES質問", sub: "「良いと思いますか？」", bg: WHITE },
          { x: 180, w: 100, label: "YES獲得", sub: "肯定を得る", bg: LIGHT_BG },
          { x: 310, w: 100, label: "一貫性発動", sub: "心理的拘束", bg: ACCENT },
          { x: 440, w: 70, label: "成約", sub: "", bg: ACCENT },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={35} width={b.w} height={50} fill={b.bg} stroke={ACCENT} strokeWidth={1.5} />
            <text x={b.x + b.w / 2} y={57} textAnchor="middle" fontSize="11" fontWeight="bold" fill={b.bg === ACCENT ? WHITE : DARK}>{b.label}</text>
            {b.sub && <text x={b.x + b.w / 2} y={74} textAnchor="middle" fontSize="9" fill={b.bg === ACCENT ? "#E8D0D0" : MUTED}>{b.sub}</text>}
            {i < 3 && <line x1={b.x + b.w} y1={60} x2={b.x + b.w + 25} y2={60} stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#as-hy-arr)" />}
          </g>
        ))}

        <rect x="90" y="100" width="340" height="35" fill={WHITE} stroke={ACCENT} strokeWidth={1} strokeDasharray="4 3" />
        <text x="260" y="115" textAnchor="middle" fontSize="10" fill={DARK}>
          {"「良いと言ったからには買うべき」"}
        </text>
        <text x="260" y="129" textAnchor="middle" fontSize="10" fontWeight="bold" fill={ACCENT}>
          一貫性の法則で切り返しが効きやすくなる
        </text>
      </svg>
    </div>
  );
}

// =====================================================================
// 3. purpose-recall  (3 diagrams)
// =====================================================================

/** Tree vs forest visual metaphor */
function TreeForestDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 180"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="as-tf-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={ACCENT} />
          </marker>
        </defs>

        <text x="260" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          木を見て森を見ず -- 視野の転換
        </text>

        {/* Left: narrow view (single tree) */}
        <rect x="20" y="35" width="140" height="100" fill={LIGHT_BG} stroke={MUTED} strokeWidth={1.5} />
        <text x="90" y="52" textAnchor="middle" fontSize="10" fontWeight="bold" fill={MUTED}>視野が狭い</text>
        <line x1="90" y1="75" x2="90" y2="115" stroke="#8B6914" strokeWidth={3} />
        <polygon points="90,68 72,105 108,105" fill="#6B8E23" />
        <text x="90" y="130" textAnchor="middle" fontSize="9" fill={MUTED}>細部に囚われる</text>

        {/* Arrow */}
        <line x1="170" y1="85" x2="210" y2="85" stroke={ACCENT} strokeWidth={2} markerEnd="url(#as-tf-arr)" />
        <text x="190" y="75" textAnchor="middle" fontSize="9" fontWeight="bold" fill={ACCENT}>振り返り</text>

        {/* Right: wide view (forest) */}
        <rect x="220" y="35" width="180" height="100" fill={LIGHT_BG} stroke={ACCENT} strokeWidth={2} />
        <text x="310" y="52" textAnchor="middle" fontSize="10" fontWeight="bold" fill={DARK}>視野が広い = 本来の目的</text>
        {[250, 280, 310, 340, 370].map((tx, i) => (
          <g key={i}>
            <line x1={tx} y1={78} x2={tx} y2={115} stroke="#8B6914" strokeWidth={2} />
            <polygon points={`${tx},72 ${tx - 12},100 ${tx + 12},100`} fill="#6B8E23" />
          </g>
        ))}

        {/* Key phrase */}
        <rect x="420" y="50" width="90" height={70} fill={WHITE} stroke={ACCENT} strokeWidth={1.5} />
        <text x="465" y="72" textAnchor="middle" fontSize="10" fill={DARK}>「そもそも</text>
        <text x="465" y="86" textAnchor="middle" fontSize="10" fill={DARK}>何のために</text>
        <text x="465" y="100" textAnchor="middle" fontSize="10" fill={DARK}>来ましたか？」</text>

        <text x="260" y="165" textAnchor="middle" fontSize="10" fontWeight="bold" fill={ACCENT}>
          お客様を俯瞰的な視点に戻すのが営業マンの役割
        </text>
      </svg>
    </div>
  );
}

/** Purpose recall + AREA combination */
function PurposeAREAComboDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 160"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="as-pa-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={ACCENT} />
          </marker>
        </defs>

        <text x="270" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          目的の振り返り + AREA話法
        </text>

        {/* Purpose recall box */}
        <rect x="15" y="35" width="130" height="55" fill={ACCENT} stroke={ACCENT} strokeWidth={1.5} />
        <text x="80" y="57" textAnchor="middle" fontSize="11" fontWeight="bold" fill={WHITE}>目的の振り返り</text>
        <text x="80" y="74" textAnchor="middle" fontSize="9" fill="#E8D0D0">原点に戻す</text>

        <line x1="145" y1="62" x2="165" y2="62" stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#as-pa-arr)" />

        {/* AREA steps */}
        {[
          { x: 170, letter: "A", label: "今決断すべき" },
          { x: 265, letter: "R", label: "問題は悪化する" },
          { x: 360, letter: "E", label: "具体的ケース" },
          { x: 455, letter: "A", label: "今日始めよう" },
        ].map((s, i) => {
          const isA = i === 0 || i === 3;
          return (
            <g key={i}>
              <rect x={s.x} y={35} width={85} height={55} fill={isA ? LIGHT_BG : WHITE} stroke={ACCENT} strokeWidth={1.5} />
              <text x={s.x + 42} y={55} textAnchor="middle" fontSize="14" fontWeight="bold" fill={ACCENT}>{s.letter}</text>
              <text x={s.x + 42} y={74} textAnchor="middle" fontSize="9" fill={DARK}>{s.label}</text>
              {i < 3 && <line x1={s.x + 85} y1={62} x2={s.x + 100} y2={62} stroke={ACCENT} strokeWidth={1} markerEnd="url(#as-pa-arr)" />}
            </g>
          );
        })}

        {/* Effective cases */}
        <rect x="60" y="110" width="420" height="36" fill={LIGHT_BG} stroke="none" />
        <text x="270" y="127" textAnchor="middle" fontSize="10" fill={DARK}>
          {"有効: 「考えたい」「タイミングが今じゃない」「もう少し情報が欲しい」"}
        </text>
        <text x="270" y="142" textAnchor="middle" fontSize="10" fontWeight="bold" fill={ACCENT}>
          考えている間も問題は続いている
        </text>
      </svg>
    </div>
  );
}

/** Effective cases scale */
function PurposeEffectiveCasesDiagram() {
  const cases = [
    { objection: "考えたい", reframe: "考えても問題は解決しない" },
    { objection: "タイミングが今じゃない", reframe: "ベストタイミングは今" },
    { objection: "もう少し情報が欲しい", reframe: "必要な情報は既に揃っている" },
  ];

  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 170"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="as-pec-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={ACCENT} />
          </marker>
        </defs>

        <text x="260" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          目的の振り返りが特に有効なケース
        </text>

        {cases.map((c, i) => {
          const y = 32 + i * 46;
          return (
            <g key={i}>
              {/* Objection */}
              <rect x="20" y={y} width="180" height={36} fill={LIGHT_BG} stroke={MUTED} strokeWidth={1} />
              <text x="110" y={y + 22} textAnchor="middle" fontSize="11" fill={DARK}>
                {"\"" + c.objection + "\""}
              </text>

              {/* Arrow */}
              <line x1="200" y1={y + 18} x2="240" y2={y + 18} stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#as-pec-arr)" />

              {/* Reframe */}
              <rect x="248" y={y} width="250" height={36} fill={i === 0 ? ACCENT : WHITE} stroke={ACCENT} strokeWidth={1.5} />
              <text x="373" y={y + 22} textAnchor="middle" fontSize="11" fontWeight={i === 0 ? "bold" : "normal"} fill={i === 0 ? WHITE : DARK}>
                {c.reframe}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// =====================================================================
// 4. third-party-attack  (3 diagrams)
// =====================================================================

/** Heaven vs Hell episodes comparison */
function HeavenHellComparisonDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 200"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <text x="260" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          天国エピソード vs 地獄エピソード
        </text>

        {/* Heaven side */}
        <rect x="20" y="35" width="220" height="120" fill={WHITE} stroke={ACCENT} strokeWidth={1.5} />
        <rect x="20" y="35" width="220" height="26" fill={ACCENT} stroke={ACCENT} strokeWidth={1.5} />
        <text x="130" y="52" textAnchor="middle" fontSize="12" fontWeight="bold" fill={WHITE}>天国エピソード</text>

        <text x="130" y="82" textAnchor="middle" fontSize="10" fill={DARK}>決断した → 成功した</text>
        <text x="130" y="98" textAnchor="middle" fontSize="10" fill={DARK}>ビフォー・アフターを描写</text>
        <text x="130" y="118" textAnchor="middle" fontSize="10" fontWeight="bold" fill={ACCENT}>背中を押す</text>
        <text x="130" y="138" textAnchor="middle" fontSize="9" fill={MUTED}>やや前向きな時に使用</text>

        {/* Hell side */}
        <rect x="280" y="35" width="220" height="120" fill={WHITE} stroke={DARK} strokeWidth={1.5} />
        <rect x="280" y="35" width="220" height="26" fill={DARK} stroke={DARK} strokeWidth={1.5} />
        <text x="390" y="52" textAnchor="middle" fontSize="12" fontWeight="bold" fill={WHITE}>地獄エピソード</text>

        <text x="390" y="82" textAnchor="middle" fontSize="10" fill={DARK}>見送った → 後悔した</text>
        <text x="390" y="98" textAnchor="middle" fontSize="10" fill={DARK}>後悔の言葉を具体的に描写</text>
        <text x="390" y="118" textAnchor="middle" fontSize="10" fontWeight="bold" fill={DARK}>危機感を持たせる</text>
        <text x="390" y="138" textAnchor="middle" fontSize="9" fill={MUTED}>迷い・先延ばし時に使用</text>

        {/* Note */}
        <text x="260" y="180" textAnchor="middle" fontSize="10" fill={MUTED}>
          地獄エピソードの前には必ず敬意を添える
        </text>
        <text x="260" y="195" textAnchor="middle" fontSize="10" fontWeight="bold" fill={ACCENT}>
          {"「○○様に限っては当てはまらないですが」"}
        </text>
      </svg>
    </div>
  );
}

/** Episode structure flow */
function EpisodeStructureDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 150"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="as-ep-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={ACCENT} />
          </marker>
        </defs>

        <text x="260" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          エピソードの効果を高める3要素
        </text>

        {[
          { x: 15, w: 150, label: "具体性", sub: "「3ヶ月前の30代の方」", bg: WHITE },
          { x: 185, w: 150, label: "感情", sub: "自分の気持ちを入れる", bg: WHITE },
          { x: 355, w: 150, label: "長さ", sub: "多少長くてもOK", bg: WHITE },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={35} width={b.w} height={55} fill={b.bg} stroke={ACCENT} strokeWidth={1.5} />
            <text x={b.x + b.w / 2} y={57} textAnchor="middle" fontSize="12" fontWeight="bold" fill={DARK}>{b.label}</text>
            <text x={b.x + b.w / 2} y={74} textAnchor="middle" fontSize="9" fill={MUTED}>{b.sub}</text>
          </g>
        ))}

        {/* Bottom: story has power */}
        <rect x="80" y="105" width="360" height="32" fill={LIGHT_BG} stroke="none" />
        <text x="260" y="120" textAnchor="middle" fontSize="10" fill={DARK}>
          ストーリーには人を引き込む力がある
        </text>
        <text x="260" y="134" textAnchor="middle" fontSize="10" fontWeight="bold" fill={ACCENT}>
          論理ではなく感情で決断を促す
        </text>
      </svg>
    </div>
  );
}

/** Timing for heaven vs hell usage */
function EpisodeTimingDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 160"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <text x="260" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          使い分けのタイミング
        </text>

        {/* Scale / spectrum bar */}
        <rect x="50" y="40" width="420" height="30" fill={LIGHT_BG} stroke={MUTED} strokeWidth={1} />

        {/* Left label */}
        <text x="140" y="60" textAnchor="middle" fontSize="11" fontWeight="bold" fill={ACCENT}>前向き</text>

        {/* Right label */}
        <text x="380" y="60" textAnchor="middle" fontSize="11" fontWeight="bold" fill={DARK}>迷い・先延ばし</text>

        {/* Center divider */}
        <line x1="260" y1="40" x2="260" y2="70" stroke={MUTED} strokeWidth={1} strokeDasharray="3 2" />

        {/* Left: Heaven */}
        <rect x="60" y="85" width="180" height={50} fill={WHITE} stroke={ACCENT} strokeWidth={1.5} />
        <text x="150" y="106" textAnchor="middle" fontSize="12" fontWeight="bold" fill={ACCENT}>天国エピソード</text>
        <text x="150" y="122" textAnchor="middle" fontSize="9" fill={MUTED}>決断の後押し</text>

        {/* Right: Hell */}
        <rect x="280" y="85" width="180" height={50} fill={WHITE} stroke={DARK} strokeWidth={1.5} />
        <text x="370" y="106" textAnchor="middle" fontSize="12" fontWeight="bold" fill={DARK}>地獄エピソード</text>
        <text x="370" y="122" textAnchor="middle" fontSize="9" fill={MUTED}>危機感の醸成</text>

        {/* Arrows from bar to boxes */}
        <line x1="140" y1="70" x2="140" y2="85" stroke={ACCENT} strokeWidth={1.5} />
        <line x1="380" y1="70" x2="380" y2="85" stroke={DARK} strokeWidth={1.5} />

        <text x="260" y="155" textAnchor="middle" fontSize="10" fontWeight="bold" fill={ACCENT}>
          お客様の温度感を見極めて選択する
        </text>
      </svg>
    </div>
  );
}

// =====================================================================
// 5. positive-shower  (3 diagrams)
// =====================================================================

/** YES + question 3 steps */
function YesPlusQuestionDiagram() {
  const steps = [
    { num: "Q1", label: "どこが良い？", sub: "ポイントを聞く" },
    { num: "Q2", label: "なぜ良い？", sub: "理由を深掘り" },
    { num: "Q3", label: "他にも？", sub: "追加ポイント" },
  ];

  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 170"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="as-yq-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={ACCENT} />
          </marker>
        </defs>

        <text x="260" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          YES + 質問の3ステップ
        </text>

        {steps.map((s, i) => {
          const x = 15 + i * 175;
          return (
            <g key={i}>
              {/* Badge */}
              <rect x={x + 50} y={28} width={40} height={18} fill={ACCENT} />
              <text x={x + 70} y={41} textAnchor="middle" fontSize="10" fontWeight="bold" fill={WHITE}>{s.num}</text>

              {/* Box */}
              <rect x={x} y={50} width={150} height={55} fill={i === 2 ? ACCENT : WHITE} stroke={ACCENT} strokeWidth={1.5} />
              <text x={x + 75} y={72} textAnchor="middle" fontSize="12" fontWeight="bold" fill={i === 2 ? WHITE : DARK}>{s.label}</text>
              <text x={x + 75} y={90} textAnchor="middle" fontSize="9" fill={i === 2 ? "#E8D0D0" : MUTED}>{s.sub}</text>

              {/* Arrow */}
              {i < 2 && <line x1={x + 150} y1={77} x2={x + 172} y2={77} stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#as-yq-arr)" />}
            </g>
          );
        })}

        <rect x="90" y="120" width="340" height="35" fill={LIGHT_BG} stroke="none" />
        <text x="260" y="135" textAnchor="middle" fontSize="10" fill={DARK}>
          目標: お客様自身にプラスのポイントを
        </text>
        <text x="260" y="150" textAnchor="middle" fontSize="11" fontWeight="bold" fill={ACCENT}>
          最低3回語ってもらう
        </text>
      </svg>
    </div>
  );
}

/** Self-persuasion mechanism */
function SelfPersuasionDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 170"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="as-sp-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={ACCENT} />
          </marker>
        </defs>

        <text x="260" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          自己説得のメカニズム
        </text>

        {[
          { x: 10, w: 130, label: "自分で語る", sub: "「ここが良い」", bg: LIGHT_BG },
          { x: 155, w: 100, label: "耳に入る", sub: "自分の声", bg: WHITE },
          { x: 270, w: 120, label: "再認識", sub: "自分はこれを良いと\n思っている", bg: WHITE },
          { x: 405, w: 105, label: "自己説得", sub: "自分で決めた感覚", bg: ACCENT },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={35} width={b.w} height={55} fill={b.bg} stroke={ACCENT} strokeWidth={1.5} />
            <text x={b.x + b.w / 2} y={55} textAnchor="middle" fontSize="11" fontWeight="bold" fill={b.bg === ACCENT ? WHITE : DARK}>{b.label}</text>
            {b.sub.includes("\n") ? (
              <>
                <text x={b.x + b.w / 2} y={70} textAnchor="middle" fontSize="8" fill={MUTED}>{b.sub.split("\n")[0]}</text>
                <text x={b.x + b.w / 2} y={82} textAnchor="middle" fontSize="8" fill={MUTED}>{b.sub.split("\n")[1]}</text>
              </>
            ) : (
              <text x={b.x + b.w / 2} y={74} textAnchor="middle" fontSize="9" fill={b.bg === ACCENT ? "#E8D0D0" : MUTED}>{b.sub}</text>
            )}
            {i < 3 && <line x1={b.x + b.w} y1={62} x2={b.x + b.w + 12} y2={62} stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#as-sp-arr)" />}
          </g>
        ))}

        <text x="260" y="115" textAnchor="middle" fontSize="10" fill={DARK}>
          人は他人に言われたことよりも
        </text>
        <text x="260" y="130" textAnchor="middle" fontSize="11" fontWeight="bold" fill={ACCENT}>
          自分で言ったことの方を信じる
        </text>

        {/* Contrast */}
        <rect x="80" y="140" width="360" height="24" fill={WHITE} stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
        <text x="260" y="156" textAnchor="middle" fontSize="10" fill={MUTED}>
          {"営業マンに「説得された感」がなくなる"}
        </text>
      </svg>
    </div>
  );
}

/** Atmosphere transformation: battle -> cooperation */
function AtmosphereChangeDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 150"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="as-ac-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={ACCENT} />
          </marker>
        </defs>

        <text x="260" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          場の空気を変える -- 対立から協力へ
        </text>

        {/* Before */}
        <rect x="30" y="40" width="160" height={60} fill={LIGHT_BG} stroke={MUTED} strokeWidth={1.5} />
        <text x="110" y="62" textAnchor="middle" fontSize="12" fontWeight="bold" fill={DARK}>対立構造</text>
        <text x="110" y="80" textAnchor="middle" fontSize="9" fill={MUTED}>論理で押し合い</text>
        <text x="110" y="92" textAnchor="middle" fontSize="9" fill={MUTED}>バトルっぽい空気</text>

        {/* Arrow */}
        <line x1="195" y1="70" x2="230" y2="70" stroke={ACCENT} strokeWidth={2} markerEnd="url(#as-ac-arr)" />
        <text x="212" y="60" textAnchor="middle" fontSize="9" fontWeight="bold" fill={ACCENT}>聞く姿勢</text>

        {/* After */}
        <rect x="240" y="40" width="160" height={60} fill={ACCENT} stroke={ACCENT} strokeWidth={1.5} />
        <text x="320" y="62" textAnchor="middle" fontSize="12" fontWeight="bold" fill={WHITE}>協力構造</text>
        <text x="320" y="80" textAnchor="middle" fontSize="9" fill="#E8D0D0">お客様が協力的に</text>
        <text x="320" y="92" textAnchor="middle" fontSize="9" fill="#E8D0D0">冷静さを取り戻す</text>

        {/* Cases */}
        <text x="450" y="52" fontSize="10" fontWeight="bold" fill={DARK}>有効な場面:</text>
        <text x="450" y="67" fontSize="9" fill={MUTED}>- 論理で押し合い</text>
        <text x="450" y="82" fontSize="9" fill={MUTED}>- 感情的な場面</text>
        <text x="450" y="97" fontSize="9" fill={MUTED}>- 漠然とした反論</text>

        <text x="260" y="130" textAnchor="middle" fontSize="10" fontWeight="bold" fill={ACCENT}>
          質問に切り替えることで場の空気が一変する
        </text>
      </svg>
    </div>
  );
}

// =====================================================================
// 6. reframe  (3 diagrams)
// =====================================================================

/** Two-sidedness visualization: original claim -> hidden flip side */
function TwoSidednessDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 200"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="as-ts-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={ACCENT} />
          </marker>
        </defs>

        <text x="270" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          二面性の指摘 -- 裏側を見せる
        </text>

        {[
          { left: "「他も見たい」", right: "迷っているだけ" },
          { left: "「考えます」", right: "問題の先送り" },
          { left: "「相談してから」", right: "正しい判断は難しい" },
        ].map((pair, i) => {
          const y = 32 + i * 56;
          return (
            <g key={i}>
              {/* Original */}
              <rect x="30" y={y} width="170" height={42} fill={LIGHT_BG} stroke={MUTED} strokeWidth={1} />
              <text x="115" y={y + 26} textAnchor="middle" fontSize="11" fill={DARK}>{pair.left}</text>

              {/* Arrow with reframe label */}
              <line x1="200" y1={y + 21} x2="255" y2={y + 21} stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#as-ts-arr)" />
              {i === 0 && <text x="227" y={y + 13} textAnchor="middle" fontSize="8" fontWeight="bold" fill={ACCENT}>すり替え</text>}

              {/* Reframed */}
              <rect x="263" y={y} width="200" height={42} fill={i === 0 ? ACCENT : WHITE} stroke={ACCENT} strokeWidth={1.5} />
              <text x="363" y={y + 26} textAnchor="middle" fontSize="11" fontWeight={i === 0 ? "bold" : "normal"} fill={i === 0 ? WHITE : DARK}>{pair.right}</text>
            </g>
          );
        })}

        {/* Key */}
        <text x="270" y="195" textAnchor="middle" fontSize="10" fontWeight="bold" fill={ACCENT}>
          {"「そういう見方もあるのか」とお客様に気づかせる"}
        </text>
      </svg>
    </div>
  );
}

/** Negative induction + correction flow */
function NegativeInductionDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 170"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="as-ni-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={ACCENT} />
          </marker>
        </defs>

        <text x="270" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          否定誘導 + 補正テクニック
        </text>

        {/* Step 1: Negative question */}
        <rect x="15" y="35" width="150" height="55" fill={LIGHT_BG} stroke={MUTED} strokeWidth={1.5} />
        <text x="90" y="52" textAnchor="middle" fontSize="10" fontWeight="bold" fill={DARK}>1. 否定誘導</text>
        <text x="90" y="68" textAnchor="middle" fontSize="9" fill={MUTED}>「まさか○○じゃ</text>
        <text x="90" y="80" textAnchor="middle" fontSize="9" fill={MUTED}>ないですよね？」</text>

        <line x1="165" y1="62" x2="185" y2="62" stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#as-ni-arr)" />

        {/* Step 2: Customer denies */}
        <rect x="192" y="35" width="140" height="55" fill={WHITE} stroke={ACCENT} strokeWidth={1.5} />
        <text x="262" y="52" textAnchor="middle" fontSize="10" fontWeight="bold" fill={DARK}>2. お客様が否定</text>
        <text x="262" y="68" textAnchor="middle" fontSize="9" fill={MUTED}>「いえ、そんな</text>
        <text x="262" y="80" textAnchor="middle" fontSize="9" fill={MUTED}>ことはないです」</text>

        <line x1="332" y1="62" x2="352" y2="62" stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#as-ni-arr)" />

        {/* Step 3: Correction + praise */}
        <rect x="360" y="35" width="165" height="55" fill={ACCENT} stroke={ACCENT} strokeWidth={1.5} />
        <text x="442" y="52" textAnchor="middle" fontSize="10" fontWeight="bold" fill={WHITE}>3. 補正（褒め）</text>
        <text x="442" y="68" textAnchor="middle" fontSize="9" fill="#E8D0D0">「ですよね！○○様は</text>
        <text x="442" y="80" textAnchor="middle" fontSize="9" fill="#E8D0D0">本気の方ですから」</text>

        {/* Warning */}
        <rect x="60" y="105" width="420" height="24" fill={WHITE} stroke={ACCENT} strokeWidth={1} strokeDasharray="4 3" />
        <text x="270" y="121" textAnchor="middle" fontSize="10" fontWeight="bold" fill={ACCENT}>
          敬意を先に添えること -- 使い方を間違えるとお客様を不快にさせる
        </text>

        <text x="270" y="155" textAnchor="middle" fontSize="10" fill={MUTED}>
          否定させることで望む方向へ自然に誘導する高度テクニック
        </text>
      </svg>
    </div>
  );
}

/** 3 major patterns: comparison/consultation/timing */
function ThreePatternsDiagram() {
  const patterns = [
    { label: "他社比較", objection: "他も見たい", reframe: "良いものに出会っている\nのに決められない" },
    { label: "他者相談", objection: "相談したい", reframe: "使うのは自分自身\n直感を信じる" },
    { label: "先延ばし", objection: "来月から", reframe: "「いつか」は来ない\n今日がその日" },
  ];

  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 190"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="as-tp-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={ACCENT} />
          </marker>
        </defs>

        <text x="270" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          3つの主要パターンへの対応
        </text>

        {patterns.map((p, i) => {
          const y = 32 + i * 52;
          const lines = p.reframe.split("\n");
          return (
            <g key={i}>
              {/* Pattern label */}
              <rect x="15" y={y} width={80} height={42} fill={ACCENT} stroke={ACCENT} strokeWidth={1.5} />
              <text x="55" y={y + 26} textAnchor="middle" fontSize="11" fontWeight="bold" fill={WHITE}>{p.label}</text>

              {/* Objection */}
              <rect x="105" y={y} width={130} height={42} fill={LIGHT_BG} stroke={MUTED} strokeWidth={1} />
              <text x="170" y={y + 26} textAnchor="middle" fontSize="10" fill={DARK}>{"\"" + p.objection + "\""}</text>

              {/* Arrow */}
              <line x1="235" y1={y + 21} x2="265" y2={y + 21} stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#as-tp-arr)" />

              {/* Reframe */}
              <rect x="273" y={y} width={250} height={42} fill={WHITE} stroke={ACCENT} strokeWidth={1.5} />
              <text x="398" y={y + (lines.length === 1 ? 26 : 20)} textAnchor="middle" fontSize="10" fill={DARK}>{lines[0]}</text>
              {lines.length > 1 && <text x="398" y={y + 34} textAnchor="middle" fontSize="10" fill={DARK}>{lines[1]}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// =====================================================================
// 7. value-stacking  (3 diagrams)
// =====================================================================

/** Surprise -> Apology -> Value re-presentation initial reaction flow */
function SurpriseApologyDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 150"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="as-sa-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={ACCENT} />
          </marker>
        </defs>

        <text x="270" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          「高い」と言われた時の初動
        </text>

        {[
          { x: 15, w: 120, label: "驚き", sub: "「えっ、高いですか！」", bg: LIGHT_BG },
          { x: 155, w: 150, label: "謝罪", sub: "「伝え方が悪かった」", bg: WHITE },
          { x: 325, w: 195, label: "価値再提示 (SP x 3)", sub: "ベネフィット中心で語る", bg: ACCENT },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={35} width={b.w} height={55} fill={b.bg} stroke={ACCENT} strokeWidth={1.5} />
            <text x={b.x + b.w / 2} y={57} textAnchor="middle" fontSize="12" fontWeight="bold" fill={b.bg === ACCENT ? WHITE : DARK}>{b.label}</text>
            <text x={b.x + b.w / 2} y={74} textAnchor="middle" fontSize="9" fill={b.bg === ACCENT ? "#E8D0D0" : MUTED}>{b.sub}</text>
            {i < 2 && <line x1={b.x + b.w} y1={62} x2={b.x + b.w + 17} y2={62} stroke={ACCENT} strokeWidth={1.5} markerEnd="url(#as-sa-arr)" />}
          </g>
        ))}

        {/* Key insight */}
        <rect x="80" y="105" width="380" height="32" fill={WHITE} stroke={ACCENT} strokeWidth={1} strokeDasharray="4 3" />
        <text x="270" y="118" textAnchor="middle" fontSize="10" fill={DARK}>
          {"「価格が高い」ではなく「価値の伝え方が不十分だった」"}
        </text>
        <text x="270" y="132" textAnchor="middle" fontSize="10" fontWeight="bold" fill={ACCENT}>
          問題をすり替える
        </text>
      </svg>
    </div>
  );
}

/** SP x 3 stacking diagram */
function SPTripleDiagram() {
  const sps = [
    { num: "SP1", label: "メインのベネフィット", sub: "最大の課題を解決" },
    { num: "SP2", label: "付加価値", sub: "サポート・保証・特典" },
    { num: "SP3", label: "将来のリターン", sub: "投資対効果" },
  ];

  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 200"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <text x="260" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          SP(セールスポイント) x 3連発
        </text>

        {/* Stacked layers bottom to top */}
        {sps.map((sp, i) => {
          const y = 130 - i * 45;
          const isTop = i === 2;
          return (
            <g key={i}>
              <rect x="60" y={y} width="300" height={38} fill={isTop ? ACCENT : LIGHT_BG} stroke={ACCENT} strokeWidth={1.5} />
              <text x="80" y={y + 16} fontSize="11" fontWeight="bold" fill={isTop ? WHITE : ACCENT}>{sp.num}</text>
              <text x="210" y={y + 16} textAnchor="middle" fontSize="11" fontWeight="bold" fill={isTop ? WHITE : DARK}>{sp.label}</text>
              <text x="210" y={y + 32} textAnchor="middle" fontSize="9" fill={isTop ? "#E8D0D0" : MUTED}>{sp.sub}</text>
            </g>
          );
        })}

        {/* Right annotation */}
        <text x="400" y="55" fontSize="10" fontWeight="bold" fill={ACCENT}>積み上げ</text>
        <line x1="395" y1="60" x2="395" y2="155" stroke={ACCENT} strokeWidth={1.5} />
        <polygon points="395,155 390,145 400,145" fill={ACCENT} />
        <text x="400" y="170" fontSize="10" fill={MUTED}>価値が増す</text>

        {/* Bottom note */}
        <text x="260" y="192" textAnchor="middle" fontSize="10" fontWeight="bold" fill={ACCENT}>
          「○○円です」ではなく「○○が手に入ります」
        </text>
      </svg>
    </div>
  );
}

/** Split thinking: total -> daily cost comparison */
function SplitThinkingDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 170"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="as-st-arr" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0,7 2.5,0 5" fill={ACCENT} />
          </marker>
        </defs>

        <text x="260" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill={DARK}>
          分割思考法 + 目的達成型の訴求
        </text>

        {/* Total price (big, scary) */}
        <rect x="20" y="40" width="140" height={60} fill={LIGHT_BG} stroke={MUTED} strokeWidth={1.5} />
        <text x="90" y="62" textAnchor="middle" fontSize="14" fontWeight="bold" fill={DARK}>総額</text>
        <text x="90" y="80" textAnchor="middle" fontSize="10" fill={MUTED}>「高い...」</text>

        {/* Arrow: divide */}
        <line x1="160" y1="70" x2="195" y2="70" stroke={ACCENT} strokeWidth={2} markerEnd="url(#as-st-arr)" />
        <text x="177" y="60" textAnchor="middle" fontSize="8" fontWeight="bold" fill={ACCENT}>日割り</text>

        {/* Daily price (small, easy) */}
        <rect x="200" y="40" width="140" height={60} fill={WHITE} stroke={ACCENT} strokeWidth={2} />
        <text x="270" y="62" textAnchor="middle" fontSize="14" fontWeight="bold" fill={ACCENT}>1日○○円</text>
        <text x="270" y="80" textAnchor="middle" fontSize="10" fill={MUTED}>コーヒー1杯分</text>

        {/* Arrow: reposition */}
        <line x1="340" y1="70" x2="375" y2="70" stroke={ACCENT} strokeWidth={2} markerEnd="url(#as-st-arr)" />

        {/* Investment framing */}
        <rect x="380" y="40" width="130" height={60} fill={ACCENT} stroke={ACCENT} strokeWidth={1.5} />
        <text x="445" y="60" textAnchor="middle" fontSize="11" fontWeight="bold" fill={WHITE}>費用ではなく</text>
        <text x="445" y="78" textAnchor="middle" fontSize="13" fontWeight="bold" fill={WHITE}>投資</text>

        {/* Comparison note */}
        <rect x="60" y="120" width="400" height="36" fill={LIGHT_BG} stroke="none" />
        <text x="260" y="135" textAnchor="middle" fontSize="10" fill={DARK}>
          他社比較: 同じサービスを他社で受けると○○万円
        </text>
        <text x="260" y="150" textAnchor="middle" fontSize="10" fontWeight="bold" fill={ACCENT}>
          攻撃ではなく「参考情報」として客観的に提示
        </text>
      </svg>
    </div>
  );
}

// =====================================================================
// Export map
// =====================================================================

export const advancedSectionDiagrams: Record<string, Record<string, React.ComponentType>> = {
  "rebuttal-basics": {
    "rebuttal-mindset": RebuttalMindsetDiagram,
    "rebuttal-stats": RebuttalStatsDiagram,
    "psychology-principles": PsychologyPrinciplesDiagram,
  },
  "rebuttal-pattern": {
    "four-step-framework": FourStepFrameworkDiagram,
    "area-method": AREAMethodDiagram,
    "hook-yes": HookYesDiagram,
  },
  "purpose-recall": {
    "tree-forest": TreeForestDiagram,
    "purpose-area-combo": PurposeAREAComboDiagram,
    "purpose-effective-cases": PurposeEffectiveCasesDiagram,
  },
  "third-party-attack": {
    "heaven-hell-comparison": HeavenHellComparisonDiagram,
    "episode-structure": EpisodeStructureDiagram,
    "episode-timing": EpisodeTimingDiagram,
  },
  "positive-shower": {
    "yes-plus-question": YesPlusQuestionDiagram,
    "self-persuasion": SelfPersuasionDiagram,
    "atmosphere-change": AtmosphereChangeDiagram,
  },
  "reframe": {
    "two-sidedness": TwoSidednessDiagram,
    "negative-induction": NegativeInductionDiagram,
    "three-patterns": ThreePatternsDiagram,
  },
  "value-stacking": {
    "surprise-apology": SurpriseApologyDiagram,
    "sp-triple": SPTripleDiagram,
    "split-thinking": SplitThinkingDiagram,
  },
};
