"use client";

const ACCENT = "#2563EB";
const DARK = "#1E293B";
const MUTED = "#64748B";
const LIGHT_BG = "#F1F5F9";
const WHITE = "#FFFFFF";
const FONT = "system-ui, sans-serif";

// ═══════════════════════════════════════════════════════════════
// 1. closing-intro  (クロージング概論)
// ═══════════════════════════════════════════════════════════════

/** クロージングの基本公式: 理由 + 訴求 + 沈黙 = 成約 */
function ClosingFormulaDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 160"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="cf-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
        </defs>

        {/* Title */}
        <text x="270" y="24" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          {"クロージングの基本公式"}
        </text>

        {/* Box 1: 理由 */}
        <rect x="30" y="45" width="110" height="50" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" />
        <text x="85" y="66" textAnchor="middle" fontSize="14" fill={DARK} fontWeight="bold">{"理由"}</text>
        <text x="85" y="84" textAnchor="middle" fontSize="10" fill={MUTED}>{"なぜ今か"}</text>

        {/* + */}
        <text x="160" y="76" textAnchor="middle" fontSize="20" fill={ACCENT} fontWeight="bold">{"+"}</text>

        {/* Box 2: 訴求 */}
        <rect x="180" y="45" width="110" height="50" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" />
        <text x="235" y="66" textAnchor="middle" fontSize="14" fill={DARK} fontWeight="bold">{"訴求"}</text>
        <text x="235" y="84" textAnchor="middle" fontSize="10" fill={MUTED}>{"言い切る"}</text>

        {/* + */}
        <text x="310" y="76" textAnchor="middle" fontSize="20" fill={ACCENT} fontWeight="bold">{"+"}</text>

        {/* Box 3: 沈黙 */}
        <rect x="330" y="45" width="110" height="50" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" />
        <text x="385" y="66" textAnchor="middle" fontSize="14" fill={DARK} fontWeight="bold">{"沈黙"}</text>
        <text x="385" y="84" textAnchor="middle" fontSize="10" fill={MUTED}>{"間を取る"}</text>

        {/* = */}
        <text x="458" y="76" textAnchor="middle" fontSize="20" fill={ACCENT} fontWeight="bold">{"="}</text>

        {/* Result */}
        <rect x="475" y="45" width="55" height="50" fill={ACCENT} stroke={ACCENT} strokeWidth="1.5" />
        <text x="502" y="75" textAnchor="middle" fontSize="14" fill={WHITE} fontWeight="bold">{"成約"}</text>

        {/* Bottom note */}
        <text x="270" y="130" textAnchor="middle" fontSize="11" fill={MUTED}>
          {"この3要素を順番通りに実行することが鍵"}
        </text>
      </svg>
    </div>
  );
}

/** NGワード vs OKワード 比較 */
function NgWordsDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 220"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* NG side */}
        <rect x="20" y="10" width="240" height="130" fill={WHITE} stroke="#DC2626" strokeWidth="2" />
        <rect x="20" y="10" width="240" height="28" fill="#DC2626" />
        <text x="140" y="30" textAnchor="middle" fontSize="13" fill={WHITE} fontWeight="bold">{"NG (成約率ダウン)"}</text>

        <text x="40" y="60" fontSize="12" fill={DARK}>{"- 「どうしますか？」"}</text>
        <text x="40" y="80" fontSize="12" fill={DARK}>{"- 「考えてみてください」"}</text>
        <text x="40" y="100" fontSize="12" fill={DARK}>{"- 「ご検討ください」"}</text>
        <text x="40" y="124" fontSize="10" fill={MUTED}>{"判断の丸投げ / 先延ばし許可"}</text>

        {/* Arrow */}
        <line x1="270" y1="75" x2="290" y2="75" stroke={ACCENT} strokeWidth="2" />
        <polygon points="290,69 300,75 290,81" fill={ACCENT} />

        {/* OK side */}
        <rect x="310" y="10" width="210" height="130" fill={WHITE} stroke={ACCENT} strokeWidth="2" />
        <rect x="310" y="10" width="210" height="28" fill={ACCENT} />
        <text x="415" y="30" textAnchor="middle" fontSize="13" fill={WHITE} fontWeight="bold">{"OK (言い切り)"}</text>

        <text x="330" y="60" fontSize="12" fill={DARK} fontWeight="bold">{"- 「始めましょう。」"}</text>
        <text x="330" y="80" fontSize="12" fill={DARK} fontWeight="bold">{"- 「やりましょう。」"}</text>
        <text x="330" y="100" fontSize="12" fill={DARK} fontWeight="bold">{"- 「進めましょう。」"}</text>
        <text x="330" y="124" fontSize="10" fill={ACCENT}>{"断定形で安心感と勢いを与える"}</text>

        {/* Bottom */}
        <text x="270" y="170" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">
          {"訴求は必ず「。」で終える"}
        </text>
        <text x="270" y="190" textAnchor="middle" fontSize="11" fill={MUTED}>
          {"疑問形は判断の丸投げ。断定形が決断の後押しになる"}
        </text>
      </svg>
    </div>
  );
}

/** 営業マンの成約率: 20%〜80% */
function ClosingCountDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 180"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Title */}
        <text x="260" y="22" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          {"営業マンの成約率と3つの属性"}
        </text>

        {/* Rate bar */}
        <text x="40" y="60" textAnchor="end" fontSize="11" fill={DARK} fontWeight="bold">{"成約率"}</text>
        <rect x="50" y="46" width="420" height="24" fill={LIGHT_BG} stroke={MUTED} strokeWidth="1" />
        <rect x="50" y="46" width="100" height="24" fill={MUTED} />
        <text x="100" y="62" textAnchor="middle" fontSize="10" fill={WHITE} fontWeight="bold">{"20%"}</text>
        <rect x="370" y="46" width="100" height="24" fill={ACCENT} />
        <text x="420" y="62" textAnchor="middle" fontSize="10" fill={WHITE} fontWeight="bold">{"80%"}</text>

        {/* Three attributes */}
        {[
          { label: "即決する", sub: "すぐ決断", x: 60, color: ACCENT },
          { label: "悩む", sub: "クロージング次第", x: 210, color: "#D97706" },
          { label: "拒否する", sub: "買わない", x: 360, color: MUTED },
        ].map((item, i) => (
          <g key={i}>
            <rect x={item.x} y="90" width="120" height="45" fill={WHITE} stroke={item.color} strokeWidth="1.5" />
            <text x={item.x + 60} y="110" textAnchor="middle" fontSize="12" fill={item.color} fontWeight="bold">
              {item.label}
            </text>
            <text x={item.x + 60} y="126" textAnchor="middle" fontSize="9" fill={MUTED}>
              {item.sub}
            </text>
          </g>
        ))}

        {/* Bottom note */}
        <text x="260" y="160" textAnchor="middle" fontSize="11" fill={MUTED}>
          {"クロージング力が強い営業マンは「悩む」お客様を決断させられる"}
        </text>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 2. social-proof  (社会的証明)
// ═══════════════════════════════════════════════════════════════

/** 「みなさん」強調法 */
function MinasanEmphasisDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 160"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Before */}
        <rect x="20" y="20" width="200" height="50" fill={WHITE} stroke={MUTED} strokeWidth="1.5" />
        <text x="120" y="40" textAnchor="middle" fontSize="11" fill={MUTED}>{"弱い"}</text>
        <text x="120" y="58" textAnchor="middle" fontSize="13" fill={DARK}>{"「みなさん選ばれています」"}</text>

        {/* Arrow */}
        <line x1="230" y1="45" x2="280" y2="45" stroke={ACCENT} strokeWidth="2" />
        <polygon points="280,39 292,45 280,51" fill={ACCENT} />

        {/* After */}
        <rect x="300" y="20" width="200" height="50" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
        <text x="400" y="40" textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="bold">{"強い"}</text>
        <text x="400" y="58" textAnchor="middle" fontSize="13" fill={DARK} fontWeight="bold">
          {"「みなっっっさん選ばれて…」"}
        </text>

        {/* Impact meter */}
        <text x="20" y="100" fontSize="11" fill={MUTED}>{"心理的インパクト:"}</text>
        <rect x="140" y="88" width="360" height="16" fill={WHITE} stroke={MUTED} strokeWidth="1" />
        <rect x="140" y="88" width="120" height="16" fill={MUTED} />
        <text x="200" y="100" textAnchor="middle" fontSize="9" fill={WHITE} fontWeight="bold">{"通常"}</text>
        <rect x="260" y="88" width="240" height="16" fill={ACCENT} />
        <text x="380" y="100" textAnchor="middle" fontSize="9" fill={WHITE} fontWeight="bold">{"強調（伸ばす）"}</text>

        {/* Note */}
        <text x="260" y="135" textAnchor="middle" fontSize="11" fill={MUTED}>
          {"少し伸ばして強調するだけで「自分もそうすべき」という心理が芽生える"}
        </text>
      </svg>
    </div>
  );
}

/** レビュー心理: 評価 -> 安心感 -> 購買 */
function ReviewPsychologyDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 170"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="rp-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
        </defs>

        {/* Stars row */}
        <rect x="20" y="15" width="140" height="55" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" />
        <text x="90" y="38" textAnchor="middle" fontSize="16" fill={ACCENT} fontWeight="bold">{"4.5"}</text>
        <text x="90" y="58" textAnchor="middle" fontSize="11" fill={DARK}>{"高評価レビュー"}</text>

        <line x1="160" y1="42" x2="190" y2="42" stroke={ACCENT} strokeWidth="2" markerEnd="url(#rp-arrow)" />

        <rect x="200" y="15" width="120" height="55" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="260" y="38" textAnchor="middle" fontSize="13" fill={DARK} fontWeight="bold">{"安心感"}</text>
        <text x="260" y="56" textAnchor="middle" fontSize="10" fill={MUTED}>{"信頼の形成"}</text>

        <line x1="320" y1="42" x2="350" y2="42" stroke={ACCENT} strokeWidth="2" markerEnd="url(#rp-arrow)" />

        <rect x="360" y="15" width="140" height="55" fill={ACCENT} stroke={ACCENT} strokeWidth="1.5" />
        <text x="430" y="38" textAnchor="middle" fontSize="13" fill={WHITE} fontWeight="bold">{"購買行動"}</text>
        <text x="430" y="56" textAnchor="middle" fontSize="10" fill={WHITE}>{"決断の後押し"}</text>

        {/* Numbers row */}
        <rect x="20" y="90" width="140" height="55" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" />
        <text x="90" y="113" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">{"「○○人が利用中」"}</text>
        <text x="90" y="133" textAnchor="middle" fontSize="11" fill={DARK}>{"具体的な数字"}</text>

        <line x1="160" y1="118" x2="190" y2="118" stroke={ACCENT} strokeWidth="2" markerEnd="url(#rp-arrow)" />

        <rect x="200" y="90" width="120" height="55" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="260" y="113" textAnchor="middle" fontSize="13" fill={DARK} fontWeight="bold">{"信頼感"}</text>
        <text x="260" y="131" textAnchor="middle" fontSize="10" fill={MUTED}>{"多数派の証明"}</text>

        <line x1="320" y1="118" x2="350" y2="118" stroke={ACCENT} strokeWidth="2" markerEnd="url(#rp-arrow)" />

        <rect x="360" y="90" width="140" height="55" fill={ACCENT} stroke={ACCENT} strokeWidth="1.5" />
        <text x="430" y="113" textAnchor="middle" fontSize="13" fill={WHITE} fontWeight="bold">{"決断の後押し"}</text>
        <text x="430" y="131" textAnchor="middle" fontSize="10" fill={WHITE}>{"行動へ移る"}</text>
      </svg>
    </div>
  );
}

/** 繰り返し効果: 序盤 -> 中盤 -> 終盤 累積 */
function RepetitionEffectDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 180"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="re-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
        </defs>

        {/* Title */}
        <text x="260" y="22" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          {"繰り返しによる効果の蓄積"}
        </text>

        {/* Three stages */}
        <rect x="20" y="40" width="140" height="50" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="90" y="60" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">{"序盤"}</text>
        <text x="90" y="78" textAnchor="middle" fontSize="10" fill={MUTED}>{"「みなさん気に入る…」"}</text>

        <line x1="160" y1="65" x2="178" y2="65" stroke={ACCENT} strokeWidth="2" markerEnd="url(#re-arrow)" />

        <rect x="190" y="40" width="140" height="50" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="260" y="60" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">{"中盤"}</text>
        <text x="260" y="78" textAnchor="middle" fontSize="10" fill={MUTED}>{"「みなさん活用…」"}</text>

        <line x1="330" y1="65" x2="348" y2="65" stroke={ACCENT} strokeWidth="2" markerEnd="url(#re-arrow)" />

        <rect x="360" y="40" width="140" height="50" fill={ACCENT} stroke={ACCENT} strokeWidth="1.5" />
        <text x="430" y="60" textAnchor="middle" fontSize="12" fill={WHITE} fontWeight="bold">{"終盤"}</text>
        <text x="430" y="78" textAnchor="middle" fontSize="10" fill={WHITE}>{"「みなさんスタート…」"}</text>

        {/* Accumulation bar */}
        <text x="20" y="118" fontSize="11" fill={MUTED}>{"効果の蓄積:"}</text>
        <rect x="110" y="106" width="50" height="18" fill={MUTED} />
        <rect x="160" y="106" width="100" height="18" fill="#D97706" />
        <rect x="260" y="106" width="240" height="18" fill={ACCENT} />

        <text x="135" y="119" textAnchor="middle" fontSize="9" fill={WHITE}>{"低"}</text>
        <text x="210" y="119" textAnchor="middle" fontSize="9" fill={WHITE}>{"中"}</text>
        <text x="380" y="119" textAnchor="middle" fontSize="9" fill={WHITE} fontWeight="bold">{"高"}</text>

        {/* Note */}
        <text x="260" y="155" textAnchor="middle" fontSize="11" fill={MUTED}>
          {"1回では足りない。何度も繰り返すことで効果が蓄積される"}
        </text>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3. consistency  (一貫性の法則)
// ═══════════════════════════════════════════════════════════════

/** ゴール共有 -> 「はい」 -> 一貫性で断りにくい */
function PremiseClosingLinkDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 200"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="pcl-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
        </defs>

        {/* Title */}
        <text x="270" y="22" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          {"ゴール共有とクロージングの連動"}
        </text>

        {/* Step 1: 序盤 */}
        <rect x="20" y="40" width="150" height="60" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" />
        <text x="95" y="62" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">{"序盤（ゴール共有）"}</text>
        <text x="95" y="82" textAnchor="middle" fontSize="10" fill={MUTED}>{"「良ければスタートを」"}</text>

        {/* Arrow + はい */}
        <line x1="170" y1="70" x2="210" y2="70" stroke={ACCENT} strokeWidth="2" markerEnd="url(#pcl-arrow)" />
        <text x="190" y="62" textAnchor="middle" fontSize="10" fill={ACCENT} fontWeight="bold">{"「はい」"}</text>

        {/* Step 2: 商談 */}
        <rect x="220" y="40" width="100" height="60" fill={WHITE} stroke={MUTED} strokeWidth="1.5" />
        <text x="270" y="66" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">{"商談"}</text>
        <text x="270" y="84" textAnchor="middle" fontSize="10" fill={MUTED}>{"説明・提案"}</text>

        {/* Arrow */}
        <line x1="320" y1="70" x2="358" y2="70" stroke={ACCENT} strokeWidth="2" markerEnd="url(#pcl-arrow)" />

        {/* Step 3: 終盤 */}
        <rect x="368" y="40" width="155" height="60" fill={ACCENT} stroke={ACCENT} strokeWidth="1.5" />
        <text x="445" y="62" textAnchor="middle" fontSize="11" fill={WHITE} fontWeight="bold">{"終盤（クロージング）"}</text>
        <text x="445" y="82" textAnchor="middle" fontSize="10" fill={WHITE}>{"「始めましょう。」"}</text>

        {/* Consistency link */}
        <path d="M 95 100 L 95 140 L 445 140 L 445 100" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="6 3" />
        <text x="270" y="136" textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="bold">
          {"一貫性の心理が働く"}
        </text>

        {/* Bottom note */}
        <text x="270" y="175" textAnchor="middle" fontSize="11" fill={MUTED}>
          {"序盤の「はい」が終盤の決断を後押しする"}
        </text>
      </svg>
    </div>
  );
}

/** 嘘をつかせない設計 */
function NoLieDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 180"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Title */}
        <text x="260" y="22" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          {"嘘をつかせない設計"}
        </text>

        {/* Left: 序盤の発言 */}
        <rect x="20" y="40" width="200" height="55" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" />
        <text x="120" y="60" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">{"序盤の発言"}</text>
        <text x="120" y="80" textAnchor="middle" fontSize="12" fill={ACCENT}>{"「良ければやります」"}</text>

        {/* Right: 終盤に断る = 嘘 */}
        <rect x="300" y="40" width="200" height="55" fill={WHITE} stroke="#DC2626" strokeWidth="1.5" />
        <text x="400" y="60" textAnchor="middle" fontSize="11" fill="#DC2626" fontWeight="bold">{"終盤に断る"}</text>
        <text x="400" y="80" textAnchor="middle" fontSize="12" fill={DARK}>{"= 自分に嘘をつく"}</text>

        {/* = between */}
        <text x="260" y="72" textAnchor="middle" fontSize="18" fill={MUTED}>{"vs"}</text>

        {/* Bottom: 心理的負担 */}
        <rect x="120" y="115" width="280" height="40" fill={ACCENT} stroke={ACCENT} strokeWidth="1.5" />
        <text x="260" y="133" textAnchor="middle" fontSize="12" fill={WHITE}>
          {"心理的負担"}
        </text>
        <text x="260" y="148" textAnchor="middle" fontSize="11" fill={WHITE} fontWeight="bold">
          {"一貫性を保ちたい = 決断を後押し"}
        </text>
      </svg>
    </div>
  );
}

/** 「。」で言い切り、沈黙は味方 */
function SilenceAllyDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 160"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="sa-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
        </defs>

        {/* Flow */}
        <rect x="20" y="20" width="160" height="50" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" />
        <text x="100" y="42" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">{"訴求を言い切る"}</text>
        <text x="100" y="60" textAnchor="middle" fontSize="11" fill={ACCENT}>{"「始めましょう。」"}</text>

        <line x1="180" y1="45" x2="210" y2="45" stroke={ACCENT} strokeWidth="2" markerEnd="url(#sa-arrow)" />

        <rect x="220" y="20" width="120" height="50" fill={ACCENT} stroke={ACCENT} strokeWidth="1.5" />
        <text x="280" y="42" textAnchor="middle" fontSize="13" fill={WHITE} fontWeight="bold">{"沈黙"}</text>
        <text x="280" y="58" textAnchor="middle" fontSize="10" fill={WHITE}>{"3~5秒の間"}</text>

        <line x1="340" y1="45" x2="370" y2="45" stroke={ACCENT} strokeWidth="2" markerEnd="url(#sa-arrow)" />

        <rect x="380" y="20" width="120" height="50" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="440" y="42" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">{"一貫性が作動"}</text>
        <text x="440" y="58" textAnchor="middle" fontSize="10" fill={MUTED}>{"お客様が決断"}</text>

        {/* Warning */}
        <rect x="80" y="95" width="360" height="40" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1" />
        <text x="260" y="113" textAnchor="middle" fontSize="11" fill={DARK}>
          {"沈黙が怖くて自分から喋るのは逆効果"}
        </text>
        <text x="260" y="128" textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="bold">
          {"沈黙こそが一貫性の心理が働く時間"}
        </text>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 4. quotation-method  (第三者話法)
// ═══════════════════════════════════════════════════════════════

/** 自分の言葉 vs 第三者の声 */
function ThirdPartyVsDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 170"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Row 1: 営業の言葉 = 警戒 */}
        <rect x="20" y="15" width="250" height="45" fill={WHITE} stroke={MUTED} strokeWidth="1.5" />
        <text x="145" y="34" textAnchor="middle" fontSize="11" fill={MUTED}>{"営業の言葉"}</text>
        <text x="145" y="50" textAnchor="middle" fontSize="12" fill={DARK}>{"「この商品は素晴らしいです」"}</text>

        <text x="290" y="42" textAnchor="middle" fontSize="16" fill={MUTED}>{"="}</text>

        <rect x="310" y="15" width="210" height="45" fill={WHITE} stroke="#DC2626" strokeWidth="1.5" />
        <text x="415" y="34" textAnchor="middle" fontSize="11" fill="#DC2626" fontWeight="bold">{"警戒"}</text>
        <text x="415" y="50" textAnchor="middle" fontSize="10" fill={MUTED}>{"「セールストークでしょ…」"}</text>

        {/* Row 2: 第三者の声 = 信頼 */}
        <rect x="20" y="80" width="250" height="45" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
        <text x="145" y="99" textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="bold">{"第三者の声（証言引用）"}</text>
        <text x="145" y="115" textAnchor="middle" fontSize="12" fill={DARK}>{"「お客様が『よかった』と…」"}</text>

        <text x="290" y="107" textAnchor="middle" fontSize="16" fill={ACCENT}>{"="}</text>

        <rect x="310" y="80" width="210" height="45" fill={ACCENT} stroke={ACCENT} strokeWidth="1.5" />
        <text x="415" y="99" textAnchor="middle" fontSize="11" fill={WHITE} fontWeight="bold">{"信頼"}</text>
        <text x="415" y="115" textAnchor="middle" fontSize="10" fill={WHITE}>{"「それなら安心かも…」"}</text>

        {/* Bottom note */}
        <text x="270" y="152" textAnchor="middle" fontSize="11" fill={MUTED}>
          {"利害関係のない第三者の声は素直に受け入れやすい"}
        </text>
      </svg>
    </div>
  );
}

/** 定番証言引用フレーズ集 */
function QuotePhraseDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 200"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Title */}
        <text x="260" y="22" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          {"効果的な証言引用フレーズ"}
        </text>

        {/* Phrase boxes */}
        {[
          { text: "「もっと早くやればよかった」", y: 38 },
          { text: "「迷っていた時間がもったいなかった」", y: 78 },
          { text: "「最初は不安だったけど全然違った」", y: 118 },
          { text: "「家族にも勧めました」", y: 158 },
        ].map((item, i) => (
          <g key={i}>
            <rect x="80" y={item.y} width="360" height="32" fill={i === 0 ? ACCENT : LIGHT_BG} stroke={ACCENT} strokeWidth={i === 0 ? "2" : "1"} />
            <text x="260" y={item.y + 21} textAnchor="middle" fontSize="12" fill={i === 0 ? WHITE : DARK} fontWeight={i === 0 ? "bold" : "normal"}>
              {item.text}
            </text>
            {/* Impact indicator */}
            <rect x="450" y={item.y + 6} width={60 - i * 8} height="18" fill={ACCENT} opacity={1 - i * 0.15} />
          </g>
        ))}
      </svg>
    </div>
  );
}

/** 基本3技術の組み合わせ */
function ThreeTechniquesComboDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 180"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Three pillars */}
        <rect x="20" y="20" width="150" height="50" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" />
        <text x="95" y="40" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">{"社会的証明"}</text>
        <text x="95" y="58" textAnchor="middle" fontSize="10" fill={MUTED}>{"みなさん選ばれて…"}</text>

        <text x="185" y="50" textAnchor="middle" fontSize="18" fill={ACCENT} fontWeight="bold">{"+"}</text>

        <rect x="200" y="20" width="150" height="50" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" />
        <text x="275" y="40" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">{"一貫性"}</text>
        <text x="275" y="58" textAnchor="middle" fontSize="10" fill={MUTED}>{"最初に良いと…"}</text>

        <text x="365" y="50" textAnchor="middle" fontSize="18" fill={ACCENT} fontWeight="bold">{"+"}</text>

        <rect x="380" y="20" width="140" height="50" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" />
        <text x="450" y="40" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">{"証言引用"}</text>
        <text x="450" y="58" textAnchor="middle" fontSize="10" fill={MUTED}>{"『よかった』と…"}</text>

        {/* Down arrow */}
        <line x1="270" y1="70" x2="270" y2="100" stroke={ACCENT} strokeWidth="2" />
        <polygon points="264,100 276,100 270,112" fill={ACCENT} />

        {/* Result */}
        <rect x="150" y="118" width="240" height="44" fill={ACCENT} stroke={ACCENT} strokeWidth="2" />
        <text x="270" y="138" textAnchor="middle" fontSize="13" fill={WHITE} fontWeight="bold">
          {"最強のクロージング"}
        </text>
        <text x="270" y="154" textAnchor="middle" fontSize="10" fill={WHITE}>
          {"成約率が飛躍的に向上"}
        </text>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 5. positive-closing  (ポジティブクロージング)
// ═══════════════════════════════════════════════════════════════

/** 未来描写クロージングの流れ */
function PositiveSingleFlowDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 560 170"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="ps-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
        </defs>

        {/* Title */}
        <text x="280" y="22" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          {"未来描写クロージングの流れ"}
        </text>

        {/* Flow boxes */}
        {[
          { label: "SP", sub: "特徴提示", x: 10, w: 80 },
          { label: "ベネフィット", sub: "メリット", x: 108, w: 90 },
          { label: "天国想像", sub: "明るい未来", x: 216, w: 90 },
          { label: "証言引用", sub: "お客様の声", x: 324, w: 90 },
          { label: "訴求", sub: "言い切り", x: 432, w: 80, accent: true },
        ].map((item, i) => (
          <g key={i}>
            <rect
              x={item.x} y={40} width={item.w} height={50}
              fill={item.accent ? ACCENT : WHITE}
              stroke={ACCENT} strokeWidth="1.5"
            />
            <text x={item.x + item.w / 2} y={60} textAnchor="middle" fontSize="12"
              fill={item.accent ? WHITE : DARK} fontWeight="bold">{item.label}</text>
            <text x={item.x + item.w / 2} y={78} textAnchor="middle" fontSize="9"
              fill={item.accent ? WHITE : MUTED}>{item.sub}</text>
            {i < 4 && (
              <line x1={item.x + item.w} y1={65} x2={item.x + item.w + 16} y2={65}
                stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#ps-arrow)" />
            )}
          </g>
        ))}

        {/* Reaction note */}
        <rect x="120" y="110" width="320" height="36" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1" />
        <text x="280" y="126" textAnchor="middle" fontSize="11" fill={DARK}>
          {"リアクションは通常の"}
        </text>
        <text x="280" y="140" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">
          {"3倍 + オウム返しで共感を示す"}
        </text>
      </svg>
    </div>
  );
}

/** 三段ベネフィット訴求: 3連発リズム */
function PositiveTripleDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 200"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Title */}
        <text x="260" y="22" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          {"三段ベネフィット訴求（3連発リズム）"}
        </text>

        {/* Three boxes side by side */}
        {[
          { num: "1", label: "ベネフィット", connector: "しかも!", x: 20 },
          { num: "2", label: "ベネフィット", connector: "さらに!", x: 190 },
          { num: "3", label: "ベネフィット", connector: "", x: 360 },
        ].map((item, i) => (
          <g key={i}>
            <rect x={item.x} y={40} width="140" height="70" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" />
            <circle cx={item.x + 22} cy={58} r="12" fill={ACCENT} />
            <text x={item.x + 22} y={63} textAnchor="middle" fontSize="12" fill={WHITE} fontWeight="bold">{item.num}</text>
            <text x={item.x + 80} y={70} textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">{item.label}</text>
            <text x={item.x + 80} y={98} textAnchor="middle" fontSize="10" fill={MUTED}>{"コンパクトに"}</text>
            {item.connector && (
              <text x={item.x + 160} y={80} textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">{item.connector}</text>
            )}
          </g>
        ))}

        {/* Arrow down to 訴求 */}
        <line x1="260" y1="110" x2="260" y2="130" stroke={ACCENT} strokeWidth="2" />
        <polygon points="254,130 266,130 260,140" fill={ACCENT} />

        <rect x="200" y="146" width="120" height="36" fill={ACCENT} stroke={ACCENT} strokeWidth="1.5" />
        <text x="260" y="169" textAnchor="middle" fontSize="13" fill={WHITE} fontWeight="bold">{"訴求"}</text>
      </svg>
    </div>
  );
}

/** ピラミッドストラクチャー */
function PyramidStructureDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 200"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Title */}
        <text x="260" y="22" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          {"ピラミッドストラクチャー"}
        </text>

        {/* Pyramid - bottom (weak) */}
        <rect x="80" y="130" width="360" height="42" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1" />
        <text x="260" y="148" textAnchor="middle" fontSize="12" fill={DARK}>{"ベネフィット1（弱）"}</text>
        <text x="260" y="164" textAnchor="middle" fontSize="10" fill={MUTED}>{"導入"}</text>

        {/* Middle (medium) */}
        <rect x="140" y="82" width="240" height="42" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="260" y="100" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">{"ベネフィット2（中）"}</text>
        <text x="260" y="116" textAnchor="middle" fontSize="10" fill={MUTED}>{"展開"}</text>

        {/* Top (strong) */}
        <rect x="200" y="34" width="120" height="42" fill={ACCENT} stroke={ACCENT} strokeWidth="2" />
        <text x="260" y="52" textAnchor="middle" fontSize="12" fill={WHITE} fontWeight="bold">{"ベネフィット3"}</text>
        <text x="260" y="68" textAnchor="middle" fontSize="10" fill={WHITE}>{"最強"}</text>

        {/* Side labels */}
        <text x="460" y="155" fontSize="10" fill={MUTED}>{"弱"}</text>
        <text x="460" y="107" fontSize="10" fill={MUTED}>{"中"}</text>
        <text x="460" y="59" fontSize="10" fill={ACCENT} fontWeight="bold">{"強"}</text>
        <line x1="455" y1="60" x2="455" y2="155" stroke={MUTED} strokeWidth="1" strokeDasharray="3 3" />
        <polygon points="455,60 451,68 459,68" fill={MUTED} />

        {/* Bottom note */}
        <text x="260" y="192" textAnchor="middle" fontSize="11" fill={MUTED}>
          {"最も強いベネフィットを最後に置き、盛り上がる構成にする"}
        </text>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 6. negative-closing  (ネガティブクロージング)
// ═══════════════════════════════════════════════════════════════

/** 危機感クロージングの流れ */
function NegativeSingleFlowDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 150"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="nsf-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
        </defs>

        {/* Title */}
        <text x="270" y="22" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          {"危機感クロージングの流れ"}
        </text>

        {/* Boxes */}
        <rect x="20" y="40" width="140" height="50" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="90" y="60" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">{"逆SP"}</text>
        <text x="90" y="78" textAnchor="middle" fontSize="9" fill={MUTED}>{"商品がない場合の"}</text>

        <line x1="160" y1="65" x2="188" y2="65" stroke={ACCENT} strokeWidth="2" markerEnd="url(#nsf-arrow)" />

        <rect x="198" y="40" width="150" height="50" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="273" y="60" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">{"逆ベネフィット"}</text>
        <text x="273" y="78" textAnchor="middle" fontSize="9" fill={MUTED}>{"悪影響を伝える"}</text>

        <line x1="348" y1="65" x2="376" y2="65" stroke={ACCENT} strokeWidth="2" markerEnd="url(#nsf-arrow)" />

        <rect x="386" y="40" width="140" height="50" fill={ACCENT} stroke={ACCENT} strokeWidth="1.5" />
        <text x="456" y="60" textAnchor="middle" fontSize="12" fill={WHITE} fontWeight="bold">{"地獄IF想像"}</text>
        <text x="456" y="78" textAnchor="middle" fontSize="9" fill={WHITE}>{"暗い未来を描く"}</text>

        {/* Note */}
        <text x="270" y="120" textAnchor="middle" fontSize="11" fill={MUTED}>
          {"「何もしなかったらどうなるか」をイメージさせる"}
        </text>
      </svg>
    </div>
  );
}

/** 敬意を先に示す（必須ルール） */
function RespectFirstDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 200"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="rf-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
        </defs>

        {/* Title */}
        <text x="270" y="22" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          {"ネガティブの前に必ず敬意を示す"}
        </text>

        {/* NG pattern */}
        <rect x="20" y="40" width="240" height="55" fill={WHITE} stroke="#DC2626" strokeWidth="2" />
        <text x="140" y="58" textAnchor="middle" fontSize="11" fill="#DC2626" fontWeight="bold">{"NG: いきなりネガティブ"}</text>
        <text x="140" y="78" textAnchor="middle" fontSize="10" fill={DARK}>{"「このまま放置すると大変です」"}</text>
        <text x="280" y="68" fontSize="11" fill="#DC2626" fontWeight="bold">{"= 攻撃に感じる"}</text>

        {/* OK pattern */}
        <rect x="20" y="115" width="240" height="55" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
        <text x="140" y="133" textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="bold">{"OK: 敬意を先に"}</text>
        <text x="140" y="153" textAnchor="middle" fontSize="10" fill={DARK}>{"「○○様に限って…ないとは"}</text>
        <text x="140" y="165" textAnchor="middle" fontSize="10" fill={DARK}>{"思いますが…」"}</text>

        <line x1="260" y1="142" x2="290" y2="142" stroke={ACCENT} strokeWidth="2" markerEnd="url(#rf-arrow)" />

        <rect x="300" y="115" width="220" height="55" fill={ACCENT} stroke={ACCENT} strokeWidth="1.5" />
        <text x="410" y="138" textAnchor="middle" fontSize="11" fill={WHITE} fontWeight="bold">{"ネガティブの話へ"}</text>
        <text x="410" y="156" textAnchor="middle" fontSize="10" fill={WHITE}>{"お客様は受け入れやすい"}</text>

        {/* Bottom note */}
        <text x="270" y="192" textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="bold">
          {"敬意なきネガティブは逆効果"}
        </text>
      </svg>
    </div>
  );
}

/** 否定誘導と補正 */
function DenialGuidanceDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 200"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <defs>
          <marker id="dg-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={ACCENT} />
          </marker>
        </defs>

        {/* Title */}
        <text x="270" y="22" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          {"否定誘導のメカニズム"}
        </text>

        {/* Step 1: 営業の問いかけ */}
        <rect x="20" y="40" width="230" height="50" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" />
        <text x="135" y="58" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">{"営業の問いかけ"}</text>
        <text x="135" y="78" textAnchor="middle" fontSize="11" fill={ACCENT}>{"「まさか放置するお考えでは…」"}</text>

        <line x1="250" y1="65" x2="278" y2="65" stroke={ACCENT} strokeWidth="2" markerEnd="url(#dg-arrow)" />

        {/* Step 2: 顧客の否定 */}
        <rect x="288" y="40" width="230" height="50" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="403" y="58" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">{"顧客が自ら否定"}</text>
        <text x="403" y="78" textAnchor="middle" fontSize="11" fill={ACCENT}>{"「いえ、違います！」"}</text>

        {/* Down arrow */}
        <line x1="403" y1="90" x2="403" y2="115" stroke={ACCENT} strokeWidth="2" markerEnd="url(#dg-arrow)" />

        {/* Step 3: 行動へ誘導 */}
        <rect x="200" y="120" width="320" height="50" fill={ACCENT} stroke={ACCENT} strokeWidth="1.5" />
        <text x="360" y="142" textAnchor="middle" fontSize="12" fill={WHITE} fontWeight="bold">
          {"望む方向に自らを誘導 = 行動へ"}
        </text>
        <text x="360" y="160" textAnchor="middle" fontSize="10" fill={WHITE}>
          {"本人が否定した以上、一貫性の心理が働く"}
        </text>

        {/* Bottom note */}
        <text x="270" y="192" textAnchor="middle" fontSize="11" fill={MUTED}>
          {"お客様自身に否定させることが最大のポイント"}
        </text>
      </svg>
    </div>
  );
}

/** ネガティブの心理的インパクト (得 vs 損) */
function NegativeImpactDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 160"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Title */}
        <text x="260" y="22" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          {"心理的インパクトの比較"}
        </text>

        {/* Bar 1: 得する喜び */}
        <text x="115" y="55" textAnchor="end" fontSize="12" fill={DARK}>{"得する喜び"}</text>
        <rect x="125" y="40" width="140" height="26" fill={MUTED} />
        <text x="195" y="58" textAnchor="middle" fontSize="11" fill={WHITE} fontWeight="bold">{"x1"}</text>

        {/* Bar 2: 損する恐怖 */}
        <text x="115" y="95" textAnchor="end" fontSize="12" fill={DARK}>{"損する痛み"}</text>
        <rect x="125" y="80" width="280" height="26" fill={ACCENT} />
        <text x="265" y="98" textAnchor="middle" fontSize="11" fill={WHITE} fontWeight="bold">{"x2（約2倍）"}</text>

        {/* Bottom note */}
        <text x="260" y="135" textAnchor="middle" fontSize="11" fill={MUTED}>
          {"人は得する喜びより損する痛みを約2倍強く感じる"}
        </text>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 7. desire-patterns  (欲求パターン)
// ═══════════════════════════════════════════════════════════════

/** 積極的欲求 vs 消極的欲求 */
function DesireComparisonDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 180"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Title */}
        <text x="260" y="22" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          {"2つの欲求パターン"}
        </text>

        {/* Left: 積極的欲求 */}
        <rect x="20" y="38" width="220" height="90" fill={WHITE} stroke={MUTED} strokeWidth="1.5" />
        <text x="130" y="60" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">{"積極的欲求"}</text>
        <text x="130" y="80" textAnchor="middle" fontSize="11" fill={MUTED}>{"「~したい」「~なりたい」"}</text>
        <rect x="60" y="100" width="120" height="14" fill={WHITE} stroke={MUTED} strokeWidth="1" />
        <rect x="60" y="100" width="50" height="14" fill={MUTED} />
        <text x="130" y="124" textAnchor="middle" fontSize="10" fill={MUTED}>{"影響力: 中"}</text>

        {/* VS */}
        <text x="260" y="88" textAnchor="middle" fontSize="14" fill={MUTED} fontWeight="bold">{"vs"}</text>

        {/* Right: 消極的欲求 */}
        <rect x="280" y="38" width="220" height="90" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
        <text x="390" y="60" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">{"消極的欲求"}</text>
        <text x="390" y="80" textAnchor="middle" fontSize="11" fill={DARK}>{"「~したくない」「~避けたい」"}</text>
        <rect x="320" y="100" width="120" height="14" fill={WHITE} stroke={ACCENT} strokeWidth="1" />
        <rect x="320" y="100" width="110" height="14" fill={ACCENT} />
        <text x="390" y="124" textAnchor="middle" fontSize="10" fill={ACCENT} fontWeight="bold">{"影響力: 強"}</text>

        {/* Bottom note */}
        <text x="260" y="158" textAnchor="middle" fontSize="11" fill={MUTED}>
          {"消極的欲求の方が行動を起こす力が強い"}
        </text>
      </svg>
    </div>
  );
}

/** プロスペクト理論: 損失回避バイアス */
function ProspectTheoryDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 200"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Title */}
        <text x="270" y="22" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          {"プロスペクト理論（損失回避バイアス）"}
        </text>

        {/* Scale: fulcrum */}
        <polygon points="270,130 260,145 280,145" fill={DARK} />

        {/* Tilted beam */}
        <line x1="100" y1="100" x2="440" y2="125" stroke={DARK} strokeWidth="3" />

        {/* Left pan: 得 (lighter, higher) */}
        <line x1="100" y1="100" x2="100" y2="75" stroke={DARK} strokeWidth="1.5" />
        <rect x="45" y="45" width="110" height="32" fill={WHITE} stroke={MUTED} strokeWidth="1.5" />
        <text x="100" y="66" textAnchor="middle" fontSize="12" fill={MUTED} fontWeight="bold">{"得する喜び"}</text>
        <text x="100" y="40" textAnchor="middle" fontSize="14" fill={MUTED}>{"x1"}</text>

        {/* Right pan: 損 (heavier, lower) */}
        <line x1="440" y1="125" x2="440" y2="150" stroke={DARK} strokeWidth="1.5" />
        <rect x="385" y="150" width="110" height="32" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
        <text x="440" y="171" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">{"損する痛み"}</text>
        <text x="440" y="198" textAnchor="middle" fontSize="14" fill={ACCENT} fontWeight="bold">{"x2"}</text>

        {/* Example at bottom */}
        <text x="270" y="195" textAnchor="middle" fontSize="11" fill={MUTED}>
          {"例: 1万円を拾った喜び < 1万円を落とした悲しみ"}
        </text>
      </svg>
    </div>
  );
}

/** 理想的な配分: ネガティブ80% + ポジティブ20% */
function IdealRatioDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 200"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Title */}
        <text x="260" y="22" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          {"理想的なクロージング配分"}
        </text>

        {/* Full bar */}
        <rect x="40" y="40" width="320" height="50" fill={ACCENT} stroke={ACCENT} strokeWidth="2" />
        <text x="200" y="62" textAnchor="middle" fontSize="14" fill={WHITE} fontWeight="bold">{"ネガティブ 80%"}</text>
        <text x="200" y="80" textAnchor="middle" fontSize="10" fill={WHITE}>{"危機感を十分に感じてもらう"}</text>

        <rect x="360" y="40" width="120" height="50" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
        <text x="420" y="62" textAnchor="middle" fontSize="13" fill={DARK} fontWeight="bold">{"ポジ 20%"}</text>
        <text x="420" y="80" textAnchor="middle" fontSize="9" fill={MUTED}>{"希望の光"}</text>

        {/* Flow explanation */}
        <text x="200" y="118" textAnchor="middle" fontSize="11" fill={DARK}>
          {"ネガティブで危機感を与え"}
        </text>
        <text x="420" y="118" textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="bold">
          {"ポジで締める"}
        </text>

        {/* Result */}
        <rect x="100" y="140" width="320" height="40" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="260" y="157" textAnchor="middle" fontSize="11" fill={DARK}>
          {"「行動しなければ」+ 「行動すれば良い未来がある」"}
        </text>
        <text x="260" y="173" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">
          {"= 最強の決断の後押し"}
        </text>
      </svg>
    </div>
  );
}

/** フロイトの快楽原則 */
function FreudPrincipleDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 160"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Title */}
        <text x="260" y="22" textAnchor="middle" fontSize="13" fill={ACCENT} fontWeight="bold">
          {"フロイトの快楽原則"}
        </text>

        {/* Left: 快楽を求める */}
        <rect x="20" y="40" width="210" height="50" fill={WHITE} stroke={MUTED} strokeWidth="1.5" />
        <text x="125" y="62" textAnchor="middle" fontSize="12" fill={DARK}>{"快楽を求める動機"}</text>
        <text x="125" y="80" textAnchor="middle" fontSize="10" fill={MUTED}>{"「得したい」「成功したい」"}</text>

        {/* VS */}
        <text x="260" y="70" textAnchor="middle" fontSize="14" fill={MUTED}>{"<"}</text>

        {/* Right: 苦痛を避ける */}
        <rect x="290" y="40" width="210" height="50" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="2" />
        <text x="395" y="62" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">{"苦痛を避ける動機"}</text>
        <text x="395" y="80" textAnchor="middle" fontSize="10" fill={DARK}>{"「損したくない」「失敗を避けたい」"}</text>

        {/* Strength bars */}
        <text x="125" y="110" textAnchor="middle" fontSize="10" fill={MUTED}>{"動機の強さ"}</text>
        <rect x="50" y="116" width="150" height="12" fill={WHITE} stroke={MUTED} strokeWidth="1" />
        <rect x="50" y="116" width="70" height="12" fill={MUTED} />

        <text x="395" y="110" textAnchor="middle" fontSize="10" fill={ACCENT} fontWeight="bold">{"動機の強さ"}</text>
        <rect x="320" y="116" width="150" height="12" fill={WHITE} stroke={ACCENT} strokeWidth="1" />
        <rect x="320" y="116" width="140" height="12" fill={ACCENT} />

        {/* Bottom note */}
        <text x="260" y="150" textAnchor="middle" fontSize="11" fill={MUTED}>
          {"苦痛を避ける動機の方がはるかに強い = ネガティブが効果的"}
        </text>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Export map
// ═══════════════════════════════════════════════════════════════

export const intermediateSectionDiagrams: Record<string, Record<string, React.ComponentType>> = {
  "closing-intro": {
    "closing-formula": ClosingFormulaDiagram,
    "ng-words": NgWordsDiagram,
    "closing-count": ClosingCountDiagram,
  },
  "social-proof": {
    "minasan-emphasis": MinasanEmphasisDiagram,
    "review-psychology": ReviewPsychologyDiagram,
    "repetition-effect": RepetitionEffectDiagram,
  },
  "consistency": {
    "premise-closing-link": PremiseClosingLinkDiagram,
    "no-lie-design": NoLieDiagram,
    "silence-ally": SilenceAllyDiagram,
  },
  "quotation-method": {
    "third-party-vs": ThirdPartyVsDiagram,
    "quote-phrases": QuotePhraseDiagram,
    "three-techniques-combo": ThreeTechniquesComboDiagram,
  },
  "positive-closing": {
    "positive-single-flow": PositiveSingleFlowDiagram,
    "positive-triple": PositiveTripleDiagram,
    "pyramid-structure": PyramidStructureDiagram,
  },
  "negative-closing": {
    "negative-single-flow": NegativeSingleFlowDiagram,
    "respect-first": RespectFirstDiagram,
    "denial-guidance": DenialGuidanceDiagram,
    "negative-impact": NegativeImpactDiagram,
    "ideal-ratio": IdealRatioDiagram,
  },
  "desire-patterns": {
    "desire-comparison": DesireComparisonDiagram,
    "prospect-theory": ProspectTheoryDiagram,
    "freud-principle": FreudPrincipleDiagram,
    "ideal-ratio": IdealRatioDiagram,
  },
};
