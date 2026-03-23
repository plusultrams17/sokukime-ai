"use client";

const ACCENT = "#0F6E56";
const DARK = "#1E293B";
const MUTED = "#64748B";
const LIGHT_BG = "#F1F5F9";
const WHITE = "#FFFFFF";
const FONT = "system-ui, sans-serif";

// =============================================
// Lesson 1: sales-mindset
// =============================================

// 効果本位の考え方 — Process vs Result comparison
function EffectOrientedDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 180"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Left: NG */}
        <rect x="20" y="20" width="200" height="60" fill="#FEE2E2" stroke="#FECACA" strokeWidth="1.5" />
        <text x="120" y="46" textAnchor="middle" fontSize="12" fill="#991B1B" fontWeight="bold">
          プロセス重視
        </text>
        <text x="120" y="66" textAnchor="middle" fontSize="11" fill="#991B1B">
          「頑張ったのにダメだった」
        </text>

        {/* VS */}
        <text x="260" y="56" textAnchor="middle" fontSize="14" fill={MUTED} fontWeight="bold">vs</text>

        {/* Right: OK */}
        <rect x="300" y="20" width="200" height="60" fill="#D1FAE5" stroke={ACCENT} strokeWidth="1.5" />
        <text x="400" y="46" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">
          効果本位（結果重視）
        </text>
        <text x="400" y="66" textAnchor="middle" fontSize="11" fill={ACCENT}>
          「結果から逆算して行動」
        </text>

        {/* Bottom flow */}
        <rect x="60" y="110" width="120" height="40" fill={LIGHT_BG} stroke={MUTED} strokeWidth="1" />
        <text x="120" y="135" textAnchor="middle" fontSize="11" fill={DARK}>結果が出ない</text>

        <line x1="180" y1="130" x2="220" y2="130" stroke={ACCENT} strokeWidth="2" />
        <polygon points="220,130 214,125 214,135" fill={ACCENT} />

        <rect x="225" y="110" width="120" height="40" fill={ACCENT} stroke="none" />
        <text x="285" y="135" textAnchor="middle" fontSize="11" fill={WHITE} fontWeight="bold">やり方を変える</text>

        <line x1="345" y1="130" x2="385" y2="130" stroke={ACCENT} strokeWidth="2" />
        <polygon points="385,130 379,125 379,135" fill={ACCENT} />

        <rect x="390" y="110" width="110" height="40" fill="#D1FAE5" stroke={ACCENT} strokeWidth="1.5" />
        <text x="445" y="135" textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="bold">再現性を構築</text>
      </svg>
    </div>
  );
}

// 自信の正体 — Formula: 知識 x 経験 x フィードバック
function ConfidenceFormulaDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 150"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Formula bar */}
        <rect x="20" y="15" width="480" height="50" fill={LIGHT_BG} stroke={ACCENT} strokeWidth="1.5" />
        <text x="260" y="48" textAnchor="middle" fontSize="16" fill={DARK} fontWeight="bold">
          自信 = 知識 x 経験 x フィードバック
        </text>

        {/* Three pillars */}
        <rect x="30" y="85" width="140" height="50" fill={ACCENT} stroke="none" />
        <text x="100" y="107" textAnchor="middle" fontSize="13" fill={WHITE} fontWeight="bold">知識</text>
        <text x="100" y="124" textAnchor="middle" fontSize="10" fill={WHITE}>商品・業界・手法</text>

        <rect x="190" y="85" width="140" height="50" fill={ACCENT} stroke="none" />
        <text x="260" y="107" textAnchor="middle" fontSize="13" fill={WHITE} fontWeight="bold">経験</text>
        <text x="260" y="124" textAnchor="middle" fontSize="10" fill={WHITE}>商談の場数</text>

        <rect x="350" y="85" width="140" height="50" fill={ACCENT} stroke="none" />
        <text x="420" y="107" textAnchor="middle" fontSize="13" fill={WHITE} fontWeight="bold">フィードバック</text>
        <text x="420" y="124" textAnchor="middle" fontSize="10" fill={WHITE}>改善と修正</text>
      </svg>
    </div>
  );
}

// 営業の4つのカテゴリー — 2x2 Matrix
function FourCategoriesDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 250"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Axes */}
        <line x1="100" y1="230" x2="500" y2="230" stroke={DARK} strokeWidth="2" />
        <line x1="100" y1="230" x2="100" y2="20" stroke={DARK} strokeWidth="2" />
        <polygon points="500,230 492,224 492,236" fill={DARK} />
        <polygon points="100,20 94,28 106,28" fill={DARK} />

        <text x="300" y="248" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">知識</text>
        <text x="88" y="130" fontSize="12" fill={DARK} fontWeight="bold" textAnchor="end"
          transform="rotate(-90, 88, 130)">自信</text>

        {/* Grid lines */}
        <line x1="300" y1="20" x2="300" y2="230" stroke={MUTED} strokeWidth="1" strokeDasharray="4,4" />
        <line x1="100" y1="125" x2="500" y2="125" stroke={MUTED} strokeWidth="1" strokeDasharray="4,4" />

        {/* Bottom-left */}
        <rect x="110" y="135" width="180" height="85" fill="#FEE2E2" stroke="#FECACA" strokeWidth="1" />
        <text x="200" y="175" textAnchor="middle" fontSize="13" fill="#991B1B" fontWeight="bold">売れない営業</text>
        <text x="200" y="195" textAnchor="middle" fontSize="10" fill="#991B1B">知識も自信もない</text>

        {/* Top-left */}
        <rect x="110" y="30" width="180" height="85" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />
        <text x="200" y="70" textAnchor="middle" fontSize="13" fill="#92400E" fontWeight="bold">押し売り営業</text>
        <text x="200" y="90" textAnchor="middle" fontSize="10" fill="#92400E">勢いだけで知識不足</text>

        {/* Bottom-right */}
        <rect x="310" y="135" width="180" height="85" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" />
        <text x="400" y="175" textAnchor="middle" fontSize="13" fill="#92400E" fontWeight="bold">御用聞き営業</text>
        <text x="400" y="195" textAnchor="middle" fontSize="10" fill="#92400E">知識はあるが受け身</text>

        {/* Top-right */}
        <rect x="310" y="30" width="180" height="85" fill="#D1FAE5" stroke={ACCENT} strokeWidth="2" />
        <text x="400" y="70" textAnchor="middle" fontSize="14" fill={ACCENT} fontWeight="bold">トップセールス</text>
        <text x="400" y="90" textAnchor="middle" fontSize="10" fill={ACCENT}>知識と自信を両立</text>
      </svg>
    </div>
  );
}

// 「買ってもらう」発想 — Transformation: 売る → 買ってもらう
function BuyingMindsetDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 150"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Left: NG */}
        <rect x="20" y="30" width="160" height="80" fill="#FEE2E2" stroke="#FECACA" strokeWidth="1.5" />
        <text x="100" y="60" textAnchor="middle" fontSize="14" fill="#991B1B" fontWeight="bold">「売る」</text>
        <text x="100" y="80" textAnchor="middle" fontSize="10" fill="#991B1B">営業が主導</text>
        <text x="100" y="96" textAnchor="middle" fontSize="10" fill="#991B1B">押し付ける行為</text>

        {/* Arrow */}
        <line x1="190" y1="70" x2="280" y2="70" stroke={ACCENT} strokeWidth="3" />
        <polygon points="280,70 270,63 270,77" fill={ACCENT} />
        <text x="235" y="58" textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="bold">転換</text>

        {/* Right: OK */}
        <rect x="290" y="30" width="210" height="80" fill="#D1FAE5" stroke={ACCENT} strokeWidth="2" />
        <text x="395" y="60" textAnchor="middle" fontSize="14" fill={ACCENT} fontWeight="bold">「買ってもらう」</text>
        <text x="395" y="80" textAnchor="middle" fontSize="10" fill={ACCENT}>お客様が主体的に判断</text>
        <text x="395" y="96" textAnchor="middle" fontSize="10" fill={ACCENT}>課題解決の手助け</text>
      </svg>
    </div>
  );
}

// =============================================
// Lesson 2: praise-technique
// =============================================

// 比較対象を使う褒め方 — Before/After
function ComparisonPraiseDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 160"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Left: NG */}
        <rect x="20" y="20" width="200" height="55" fill="#FEE2E2" stroke="#FECACA" strokeWidth="1.5" />
        <text x="120" y="43" textAnchor="middle" fontSize="12" fill="#991B1B" fontWeight="bold">
          ただの褒め言葉
        </text>
        <text x="120" y="62" textAnchor="middle" fontSize="10" fill="#991B1B">
          「すごいですね！」
        </text>

        {/* Arrow */}
        <text x="260" y="52" textAnchor="middle" fontSize="14" fill={MUTED} fontWeight="bold">vs</text>

        {/* Right: OK */}
        <rect x="300" y="20" width="200" height="55" fill="#D1FAE5" stroke={ACCENT} strokeWidth="1.5" />
        <text x="400" y="43" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">
          比較を使った褒め言葉
        </text>
        <text x="400" y="62" textAnchor="middle" fontSize="10" fill={ACCENT}>
          「○社中、御社が一番○○です」
        </text>

        {/* Bottom note */}
        <rect x="80" y="100" width="360" height="40" fill={LIGHT_BG} stroke="none" />
        <text x="260" y="118" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">
          比較対象 + 具体的な数字 = 信憑性のある褒め言葉
        </text>
        <text x="260" y="134" textAnchor="middle" fontSize="10" fill={MUTED}>
          経験や数字を入れることでお世辞ではなく本音に聞こえる
        </text>
      </svg>
    </div>
  );
}

// 2度褒めの技術 — Flow: 褒め → 謙遜 → 再褒め
function DoublePraiseDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 160"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Step 1 */}
        <rect x="20" y="30" width="120" height="50" fill={ACCENT} stroke="none" />
        <text x="80" y="52" textAnchor="middle" fontSize="12" fill={WHITE} fontWeight="bold">1回目の褒め</text>
        <text x="80" y="68" textAnchor="middle" fontSize="10" fill={WHITE}>まず褒める</text>

        {/* Arrow 1 */}
        <line x1="140" y1="55" x2="168" y2="55" stroke={ACCENT} strokeWidth="2" />
        <polygon points="168,55 162,50 162,60" fill={ACCENT} />

        {/* Step 2 */}
        <rect x="175" y="30" width="120" height="50" fill={LIGHT_BG} stroke={MUTED} strokeWidth="1" />
        <text x="235" y="52" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">お客様の反応</text>
        <text x="235" y="68" textAnchor="middle" fontSize="10" fill={MUTED}>「いやいや...」</text>

        {/* Arrow 2 */}
        <line x1="295" y1="55" x2="323" y2="55" stroke={ACCENT} strokeWidth="2" />
        <polygon points="323,55 317,50 317,60" fill={ACCENT} />

        {/* Step 3 */}
        <rect x="330" y="30" width="190" height="50" fill={ACCENT} stroke="none" />
        <text x="425" y="52" textAnchor="middle" fontSize="12" fill={WHITE} fontWeight="bold">2回目の褒め（具体的に）</text>
        <text x="425" y="68" textAnchor="middle" fontSize="10" fill={WHITE}>「特に○○が素晴らしい」</text>

        {/* Result */}
        <rect x="130" y="105" width="280" height="36" fill="#D1FAE5" stroke={ACCENT} strokeWidth="1.5" />
        <text x="270" y="128" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">
          「本気で言ってくれている」と実感 → 心が開く
        </text>
      </svg>
    </div>
  );
}

// 心が開くシグナル — Checklist/indicators
function OpenSignalsDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 180"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <text x="260" y="24" textAnchor="middle" fontSize="13" fill={DARK} fontWeight="bold">
          心が開いたサイン
        </text>

        {/* Signal indicators */}
        {[
          { label: "自然な笑顔", x: 30 },
          { label: "前傾姿勢", x: 155 },
          { label: "質問が増える", x: 280 },
          { label: "声のトーンUP", x: 405 },
        ].map((item, i) => (
          <g key={i}>
            <rect x={item.x} y="45" width="110" height="45" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
            <text x={item.x + 55} y="73" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">
              {item.label}
            </text>
          </g>
        ))}

        {/* Bottom scale */}
        <text x="260" y="120" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">
          心の開き度
        </text>
        <rect x="60" y="130" width="400" height="16" fill={LIGHT_BG} stroke={MUTED} strokeWidth="1" />
        <rect x="60" y="130" width="300" height="16" fill={ACCENT} stroke="none" />
        <text x="60" y="163" fontSize="10" fill={MUTED}>閉じている</text>
        <text x="460" y="163" textAnchor="end" fontSize="10" fill={ACCENT} fontWeight="bold">開いている</text>
      </svg>
    </div>
  );
}

// =============================================
// Lesson 3: premise-setting
// =============================================

// ゴール共有の4ステップ — Numbered steps flow
function FourStepsDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 180"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {[
          { num: "1", text: "精一杯ご説明", sub: "誠意を見せる" },
          { num: "2", text: "断ってOK", sub: "安心感を作る" },
          { num: "3", text: "スタートを", sub: "成約の道筋" },
          { num: "4", text: "よろしい？", sub: "合意を取る" },
        ].map((step, i) => {
          const x = 15 + i * 133;
          return (
            <g key={step.num}>
              <circle cx={x + 55} cy="30" r="14" fill={ACCENT} />
              <text x={x + 55} y="35" textAnchor="middle" fontSize="13" fill={WHITE} fontWeight="bold">
                {step.num}
              </text>
              <rect x={x} y="55" width="110" height="55" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
              <text x={x + 55} y="78" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">
                {step.text}
              </text>
              <text x={x + 55} y="96" textAnchor="middle" fontSize="10" fill={MUTED}>
                {step.sub}
              </text>
              {i < 3 && (
                <>
                  <line x1={x + 110} y1="82" x2={x + 133} y2="82" stroke={ACCENT} strokeWidth="2" />
                  <polygon points={`${x + 133},82 ${x + 127},77 ${x + 127},87`} fill={ACCENT} />
                </>
              )}
            </g>
          );
        })}

        {/* Result */}
        <rect x="100" y="130" width="340" height="35" fill={LIGHT_BG} stroke="none" />
        <text x="270" y="152" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">
          「はい」の合意 → 商談終了時に「検討します」が封じられる
        </text>
      </svg>
    </div>
  );
}

// なぜ2回行うのか — Timing diagram
function TwiceTimingDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 160"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Timeline */}
        <line x1="40" y1="60" x2="480" y2="60" stroke={MUTED} strokeWidth="2" />
        <polygon points="480,60 474,55 474,65" fill={MUTED} />
        <text x="490" y="64" fontSize="10" fill={MUTED}>時間</text>

        {/* Point 1 */}
        <circle cx="120" cy="60" r="8" fill={ACCENT} />
        <text x="120" y="45" textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="bold">1回目</text>
        <rect x="60" y="78" width="120" height="35" fill={WHITE} stroke={ACCENT} strokeWidth="1" />
        <text x="120" y="95" textAnchor="middle" fontSize="10" fill={DARK}>商談冒頭</text>
        <text x="120" y="108" textAnchor="middle" fontSize="9" fill={MUTED}>全体のルール設定</text>

        {/* Point 2 */}
        <circle cx="350" cy="60" r="8" fill={ACCENT} />
        <text x="350" y="45" textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="bold">2回目</text>
        <rect x="290" y="78" width="120" height="35" fill={WHITE} stroke={ACCENT} strokeWidth="1" />
        <text x="350" y="95" textAnchor="middle" fontSize="10" fill={DARK}>プレゼン前</text>
        <text x="350" y="108" textAnchor="middle" fontSize="9" fill={MUTED}>判断基準の再確認</text>

        {/* Effect */}
        <rect x="120" y="128" width="300" height="25" fill={LIGHT_BG} stroke="none" />
        <text x="270" y="146" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">
          2回繰り返すことで記憶に定着し、成約の前提が強化される
        </text>
      </svg>
    </div>
  );
}

// カクテルパーティー効果 — Brain filter
function CocktailPartyDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 160"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Left: many info */}
        <rect x="20" y="20" width="140" height="100" fill={LIGHT_BG} stroke={MUTED} strokeWidth="1" />
        <text x="90" y="45" textAnchor="middle" fontSize="11" fill={MUTED}>膨大な情報</text>
        <text x="90" y="65" textAnchor="middle" fontSize="10" fill={MUTED}>情報A</text>
        <text x="90" y="80" textAnchor="middle" fontSize="10" fill={MUTED}>情報B</text>
        <text x="90" y="95" textAnchor="middle" fontSize="10" fill={ACCENT} fontWeight="bold">決める前提</text>
        <text x="90" y="110" textAnchor="middle" fontSize="10" fill={MUTED}>情報C</text>

        {/* Arrow / Filter */}
        <line x1="160" y1="70" x2="210" y2="70" stroke={ACCENT} strokeWidth="2" />
        <polygon points="210,70 204,65 204,75" fill={ACCENT} />

        {/* Filter box */}
        <rect x="215" y="35" width="100" height="70" fill={ACCENT} stroke="none" />
        <text x="265" y="65" textAnchor="middle" fontSize="11" fill={WHITE} fontWeight="bold">選択的注意</text>
        <text x="265" y="82" textAnchor="middle" fontSize="10" fill={WHITE}>フィルター</text>

        {/* Arrow */}
        <line x1="315" y1="70" x2="365" y2="70" stroke={ACCENT} strokeWidth="2" />
        <polygon points="365,70 359,65 359,75" fill={ACCENT} />

        {/* Result */}
        <rect x="370" y="35" width="130" height="70" fill="#D1FAE5" stroke={ACCENT} strokeWidth="1.5" />
        <text x="435" y="60" textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="bold">
          「決める前提」
        </text>
        <text x="435" y="78" textAnchor="middle" fontSize="10" fill={ACCENT}>で話を聞く</text>
        <text x="435" y="93" textAnchor="middle" fontSize="10" fill={ACCENT}>状態になる</text>

        {/* Bottom label */}
        <text x="260" y="148" textAnchor="middle" fontSize="11" fill={MUTED}>
          事前に「今日決めてくださいね」と伝えておくと意識が変わる
        </text>
      </svg>
    </div>
  );
}

// =============================================
// Lesson 4: mehrabian-rule
// =============================================

// メラビアンの法則 — Stacked bar (7/38/55)
function MehrabianRuleDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 160"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Stacked bar */}
        <rect x="30" y="20" width="33" height="50" fill={MUTED} stroke={WHITE} strokeWidth="1" />
        <text x="46" y="50" textAnchor="middle" fontSize="11" fill={WHITE} fontWeight="bold">7%</text>

        <rect x="63" y="20" width="175" height="50" fill="#3B82F6" stroke={WHITE} strokeWidth="1" />
        <text x="150" y="50" textAnchor="middle" fontSize="13" fill={WHITE} fontWeight="bold">38%</text>

        <rect x="238" y="20" width="252" height="50" fill={ACCENT} stroke={WHITE} strokeWidth="1" />
        <text x="364" y="50" textAnchor="middle" fontSize="14" fill={WHITE} fontWeight="bold">55%</text>

        {/* Labels */}
        <text x="46" y="90" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">言語</text>
        <text x="46" y="104" textAnchor="middle" fontSize="9" fill={MUTED}>内容</text>

        <text x="150" y="90" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">聴覚</text>
        <text x="150" y="104" textAnchor="middle" fontSize="9" fill={MUTED}>声のトーン・速さ</text>

        <text x="364" y="90" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">視覚</text>
        <text x="364" y="104" textAnchor="middle" fontSize="9" fill={MUTED}>表情・姿勢・身振り</text>

        {/* Bottom note */}
        <rect x="80" y="120" width="360" height="28" fill={LIGHT_BG} stroke="none" />
        <text x="260" y="139" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">
          「何を言うか」より「どう言うか」が93%を占める
        </text>
      </svg>
    </div>
  );
}

// 所作の一致 — Match/Mismatch comparison
function GestureMatchDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 180"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <text x="260" y="22" textAnchor="middle" fontSize="13" fill={DARK} fontWeight="bold">
          言葉と態度の一致が信頼を生む
        </text>

        {/* Mismatch */}
        <rect x="20" y="40" width="220" height="80" fill="#FEE2E2" stroke="#FECACA" strokeWidth="1.5" />
        <text x="130" y="60" textAnchor="middle" fontSize="12" fill="#991B1B" fontWeight="bold">不一致</text>
        <text x="130" y="80" textAnchor="middle" fontSize="10" fill="#991B1B">「貢献します！」</text>
        <text x="130" y="95" textAnchor="middle" fontSize="10" fill="#991B1B">+ 目が泳いでいる</text>
        <text x="130" y="112" textAnchor="middle" fontSize="10" fill="#991B1B">→ 信頼されない</text>

        {/* Match */}
        <rect x="280" y="40" width="220" height="80" fill="#D1FAE5" stroke={ACCENT} strokeWidth="1.5" />
        <text x="390" y="60" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">一致</text>
        <text x="390" y="80" textAnchor="middle" fontSize="10" fill={ACCENT}>「貢献します！」</text>
        <text x="390" y="95" textAnchor="middle" fontSize="10" fill={ACCENT}>+ 真剣な表情・明るい声</text>
        <text x="390" y="112" textAnchor="middle" fontSize="10" fill={ACCENT}>→ 信頼される</text>

        {/* Scene examples */}
        {[
          { scene: "ポジティブな内容", action: "笑顔・明るい声", x: 30 },
          { scene: "問題提起", action: "真剣な表情", x: 200 },
          { scene: "共感場面", action: "うなずき・前傾", x: 370 },
        ].map((item, i) => (
          <g key={i}>
            <rect x={item.x} y="140" width="150" height="30" fill={WHITE} stroke={ACCENT} strokeWidth="1" />
            <text x={item.x + 75} y="155" textAnchor="middle" fontSize="10" fill={DARK}>
              {item.scene} → {item.action}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// 第一印象の重要性 — Timeline: 7秒
function FirstImpressionDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 150"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* 7-second bar */}
        <rect x="30" y="20" width="460" height="40" fill={LIGHT_BG} stroke={MUTED} strokeWidth="1" />
        <rect x="30" y="20" width="80" height="40" fill={ACCENT} stroke="none" />
        <text x="70" y="46" textAnchor="middle" fontSize="14" fill={WHITE} fontWeight="bold">7秒</text>
        <text x="300" y="46" textAnchor="middle" fontSize="12" fill={MUTED}>残りの商談時間</text>

        {/* Arrow */}
        <line x1="110" y1="40" x2="110" y2="68" stroke={ACCENT} strokeWidth="2" />
        <polygon points="110,68 105,62 115,62" fill={ACCENT} />

        <text x="260" y="85" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">
          最初の7秒で第一印象が決まる
        </text>

        {/* Checklist */}
        {[
          { label: "身だしなみ", x: 30 },
          { label: "自然な笑顔", x: 155 },
          { label: "背筋を伸ばす", x: 280 },
          { label: "はっきり挨拶", x: 405 },
        ].map((item, i) => (
          <g key={i}>
            <rect x={item.x} y="100" width="110" height="35" fill={WHITE} stroke={ACCENT} strokeWidth="1" />
            <text x={item.x + 55} y="122" textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="bold">
              {item.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// =============================================
// Lesson 5: drawer-phrases
// =============================================

// 第三者話法 — Flow: third person → safety → real talk
function ThirdPersonMethodDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 160"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Step 1 */}
        <rect x="15" y="30" width="150" height="55" fill={ACCENT} stroke="none" />
        <text x="90" y="53" textAnchor="middle" fontSize="11" fill={WHITE} fontWeight="bold">第三者を主語に</text>
        <text x="90" y="72" textAnchor="middle" fontSize="10" fill={WHITE}>「○○な方が多くて...」</text>

        {/* Arrow */}
        <line x1="165" y1="57" x2="195" y2="57" stroke={ACCENT} strokeWidth="2" />
        <polygon points="195,57 189,52 189,62" fill={ACCENT} />

        {/* Step 2 */}
        <rect x="200" y="30" width="140" height="55" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="270" y="53" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">安心感が生まれる</text>
        <text x="270" y="72" textAnchor="middle" fontSize="10" fill={MUTED}>「自分だけじゃない」</text>

        {/* Arrow */}
        <line x1="340" y1="57" x2="370" y2="57" stroke={ACCENT} strokeWidth="2" />
        <polygon points="370,57 364,52 364,62" fill={ACCENT} />

        {/* Step 3 */}
        <rect x="375" y="30" width="150" height="55" fill="#D1FAE5" stroke={ACCENT} strokeWidth="1.5" />
        <text x="450" y="53" textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="bold">本音が出てくる</text>
        <text x="450" y="72" textAnchor="middle" fontSize="10" fill={ACCENT}>ニーズを語り始める</text>

        {/* Bottom note */}
        <rect x="80" y="110" width="380" height="35" fill={LIGHT_BG} stroke="none" />
        <text x="270" y="128" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">
          直接質問では警戒される → 第三者を通じて安心させる
        </text>
        <text x="270" y="142" textAnchor="middle" fontSize="9" fill={MUTED}>
          「困っていることは？」ではなく「○○な悩みをよく聞きますが...」
        </text>
      </svg>
    </div>
  );
}

// 口語→文語パターン — Two-layer structure
function ColloquialFormalDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 170"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <text x="260" y="22" textAnchor="middle" fontSize="13" fill={DARK} fontWeight="bold">
          口語→文語パターン
        </text>

        {/* Line 1: Colloquial */}
        <rect x="20" y="40" width="60" height="45" fill={ACCENT} stroke="none" />
        <text x="50" y="60" textAnchor="middle" fontSize="11" fill={WHITE} fontWeight="bold">1行目</text>
        <text x="50" y="76" textAnchor="middle" fontSize="9" fill={WHITE}>口語</text>

        <rect x="90" y="40" width="410" height="45" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="295" y="60" textAnchor="middle" fontSize="11" fill={DARK}>
          「コストが上がって大変だよ」っておっしゃる方が多くて...
        </text>
        <text x="295" y="76" textAnchor="middle" fontSize="10" fill={MUTED}>
          リアリティを演出
        </text>

        {/* Arrow */}
        <line x1="260" y1="85" x2="260" y2="103" stroke={ACCENT} strokeWidth="2" />
        <polygon points="260,103 255,97 265,97" fill={ACCENT} />

        {/* Line 2: Formal */}
        <rect x="20" y="108" width="60" height="45" fill={ACCENT} stroke="none" />
        <text x="50" y="128" textAnchor="middle" fontSize="11" fill={WHITE} fontWeight="bold">2行目</text>
        <text x="50" y="144" textAnchor="middle" fontSize="9" fill={WHITE}>文語</text>

        <rect x="90" y="108" width="410" height="45" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="295" y="128" textAnchor="middle" fontSize="11" fill={DARK}>
          「○○様のところではいかがでしょうか？」
        </text>
        <text x="295" y="144" textAnchor="middle" fontSize="10" fill={MUTED}>
          丁寧さを保つ
        </text>
      </svg>
    </div>
  );
}

// 想定ニーズの3方向 — Three pillars
function ThreeNeedsDirectionDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 150"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <text x="260" y="22" textAnchor="middle" fontSize="13" fill={DARK} fontWeight="bold">
          想定ニーズの3つの方向性
        </text>

        {[
          { label: "コスト", sub: "経費削減・コスパ改善", x: 30 },
          { label: "時間", sub: "効率化・手間の削減", x: 195 },
          { label: "品質", sub: "品質向上・顧客満足度", x: 360 },
        ].map((item, i) => (
          <g key={i}>
            <rect x={item.x} y="40" width="140" height="70" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
            <text x={item.x + 70} y="68" textAnchor="middle" fontSize="14" fill={ACCENT} fontWeight="bold">
              {item.label}
            </text>
            <text x={item.x + 70} y="90" textAnchor="middle" fontSize="10" fill={MUTED}>
              {item.sub}
            </text>
          </g>
        ))}

        {/* Bottom note */}
        <rect x="80" y="125" width="360" height="22" fill={LIGHT_BG} stroke="none" />
        <text x="260" y="141" textAnchor="middle" fontSize="10" fill={DARK}>
          3方向から準備すれば、幅広いニーズに対応できる
        </text>
      </svg>
    </div>
  );
}

// =============================================
// Lesson 6: deepening
// =============================================

// 浅い質問→深い質問 — Before/After
function ShallowToDeepDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 150"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Shallow */}
        <rect x="20" y="20" width="200" height="60" fill="#FEE2E2" stroke="#FECACA" strokeWidth="1.5" />
        <text x="120" y="43" textAnchor="middle" fontSize="12" fill="#991B1B" fontWeight="bold">浅い質問</text>
        <text x="120" y="63" textAnchor="middle" fontSize="10" fill="#991B1B">「何かお困りですか？」</text>
        <text x="120" y="90" textAnchor="middle" fontSize="10" fill="#991B1B">→ 「特にないです」で終了</text>

        {/* Arrow */}
        <line x1="230" y1="50" x2="280" y2="50" stroke={ACCENT} strokeWidth="3" />
        <polygon points="280,50 272,44 272,56" fill={ACCENT} />
        <text x="255" y="38" textAnchor="middle" fontSize="10" fill={ACCENT} fontWeight="bold">転換</text>

        {/* Deep */}
        <rect x="290" y="20" width="210" height="60" fill="#D1FAE5" stroke={ACCENT} strokeWidth="1.5" />
        <text x="395" y="43" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">深い質問</text>
        <text x="395" y="63" textAnchor="middle" fontSize="10" fill={ACCENT}>「具体的にどんな場面で？」</text>
        <text x="395" y="90" textAnchor="middle" fontSize="10" fill={ACCENT}>→ 具体的なエピソードが出る</text>

        {/* Bottom key */}
        <rect x="100" y="110" width="320" height="28" fill={LIGHT_BG} stroke="none" />
        <text x="260" y="129" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">
          「具体的に」を2〜4回繰り返すことがポイント
        </text>
      </svg>
    </div>
  );
}

// 深掘り質問チェーン（5段階）— Vertical funnel
function QuestionChainDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 500 270"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {[
          { num: "1", label: "原因", question: "「何が原因だと思いますか？」", w: 400 },
          { num: "2", label: "時間軸", question: "「いつ頃からですか？」", w: 360 },
          { num: "3", label: "具体化", question: "「どのくらいの影響ですか？」", w: 320 },
          { num: "4", label: "放置結果", question: "「このまま放置するとどうなりますか？」", w: 280 },
          { num: "5", label: "感情", question: "「今どんなお気持ちですか？」", w: 240 },
        ].map((step, i) => {
          const y = 10 + i * 50;
          const x = (500 - step.w) / 2;
          const isLast = i === 4;
          return (
            <g key={step.num}>
              <rect x={x} y={y} width={step.w} height="38"
                fill={isLast ? ACCENT : WHITE}
                stroke={isLast ? ACCENT : MUTED}
                strokeWidth={isLast ? 2 : 1} />
              <text x={x + 25} y={y + 24} fontSize="12" fill={isLast ? WHITE : ACCENT} fontWeight="bold">
                {step.num}. {step.label}
              </text>
              <text x={x + step.w - 10} y={y + 24} textAnchor="end" fontSize="10" fill={isLast ? WHITE : MUTED}>
                {step.question}
              </text>
              {i < 4 && (
                <polygon points={`250,${y + 38} 244,${y + 42} 256,${y + 42} 250,${y + 50}`} fill={ACCENT} />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// 「いつから」で金額換算 — Calculation
function TimeCostCalcDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 160"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <text x="260" y="22" textAnchor="middle" fontSize="13" fill={DARK} fontWeight="bold">
          時間軸 → 金額換算で深刻さを可視化
        </text>

        {/* Calculation flow */}
        <rect x="20" y="40" width="120" height="50" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="80" y="62" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">月5万円のロス</text>
        <text x="80" y="78" textAnchor="middle" fontSize="10" fill={MUTED}>毎月の損失</text>

        <text x="165" y="70" textAnchor="middle" fontSize="18" fill={ACCENT} fontWeight="bold">x</text>

        <rect x="190" y="40" width="100" height="50" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="240" y="62" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">12ヶ月</text>
        <text x="240" y="78" textAnchor="middle" fontSize="10" fill={MUTED}>1年間</text>

        <text x="315" y="70" textAnchor="middle" fontSize="18" fill={ACCENT} fontWeight="bold">=</text>

        <rect x="340" y="40" width="160" height="50" fill={ACCENT} stroke="none" />
        <text x="420" y="62" textAnchor="middle" fontSize="14" fill={WHITE} fontWeight="bold">年間60万円</text>
        <text x="420" y="78" textAnchor="middle" fontSize="10" fill={WHITE}>の累積ロス</text>

        {/* Extended */}
        <rect x="100" y="110" width="320" height="40" fill="#FEE2E2" stroke="#FECACA" strokeWidth="1" />
        <text x="260" y="130" textAnchor="middle" fontSize="12" fill="#991B1B" fontWeight="bold">
          3年前から = 累計180万円の損失
        </text>
        <text x="260" y="144" textAnchor="middle" fontSize="10" fill="#991B1B">
          数字にすることで問題の深刻さに気づく
        </text>
      </svg>
    </div>
  );
}

// =============================================
// Lesson 7: benefit-method
// =============================================

// SPとベネフィットの違い — Side by side
function SpBenefitDifferenceDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 170"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* SP */}
        <rect x="20" y="20" width="210" height="80" fill={LIGHT_BG} stroke={MUTED} strokeWidth="1.5" />
        <text x="125" y="45" textAnchor="middle" fontSize="14" fill={DARK} fontWeight="bold">
          セールスポイント(SP)
        </text>
        <text x="125" y="65" textAnchor="middle" fontSize="11" fill={MUTED}>商品の機能・特徴・スペック</text>
        <text x="125" y="82" textAnchor="middle" fontSize="10" fill={MUTED}>
          例:「24時間サポート体制」
        </text>

        {/* Arrow with だから */}
        <line x1="240" y1="60" x2="285" y2="60" stroke={ACCENT} strokeWidth="2.5" />
        <polygon points="285,60 279,55 279,65" fill={ACCENT} />
        <text x="262" y="50" textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="bold">だから</text>

        {/* Benefit */}
        <rect x="295" y="20" width="210" height="80" fill={WHITE} stroke={ACCENT} strokeWidth="2" />
        <text x="400" y="45" textAnchor="middle" fontSize="14" fill={ACCENT} fontWeight="bold">
          ベネフィット
        </text>
        <text x="400" y="65" textAnchor="middle" fontSize="11" fill={MUTED}>お客様が得られる利益・変化</text>
        <text x="400" y="82" textAnchor="middle" fontSize="10" fill={ACCENT}>
          例:「業務が止まる心配がない」
        </text>

        {/* Bottom note */}
        <rect x="60" y="120" width="400" height="35" fill={LIGHT_BG} stroke="none" />
        <text x="260" y="138" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">
          お客様が興味を持つのはSPではなくベネフィット
        </text>
        <text x="260" y="152" textAnchor="middle" fontSize="9" fill={MUTED}>
          多くの営業はSPばかり語りがち → ベネフィットへの変換が必要
        </text>
      </svg>
    </div>
  );
}

// 3組のSP→ベネフィットを準備する — Three sets
function ThreeBenefitSetsDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 200"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <text x="260" y="22" textAnchor="middle" fontSize="13" fill={DARK} fontWeight="bold">
          3組のSP→ベネフィットを準備
        </text>

        {[
          { num: "1", purpose: "最大の課題に対応", x: 20 },
          { num: "2", purpose: "競合と差別化", x: 190 },
          { num: "3", purpose: "コスト・時間", x: 360 },
        ].map((set) => (
          <g key={set.num}>
            <circle cx={set.x + 70} cy="50" r="14" fill={ACCENT} />
            <text x={set.x + 70} y="55" textAnchor="middle" fontSize="12" fill={WHITE} fontWeight="bold">
              {set.num}
            </text>

            <rect x={set.x} y="75" width="140" height="35" fill={LIGHT_BG} stroke={MUTED} strokeWidth="1" />
            <text x={set.x + 70} y="97" textAnchor="middle" fontSize="10" fill={DARK}>SP（特徴）</text>

            <line x1={set.x + 70} y1="110" x2={set.x + 70} y2="125" stroke={ACCENT} strokeWidth="2" />
            <polygon points={`${set.x + 70},125 ${set.x + 65},119 ${set.x + 75},119`} fill={ACCENT} />

            <rect x={set.x} y="128" width="140" height="35" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
            <text x={set.x + 70} y="150" textAnchor="middle" fontSize="10" fill={ACCENT} fontWeight="bold">
              ベネフィット
            </text>

            <text x={set.x + 70} y="180" textAnchor="middle" fontSize="9" fill={MUTED}>
              {set.purpose}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// お客様目線の言い換え — Subject change
function CustomerPerspectiveDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 150"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <text x="260" y="22" textAnchor="middle" fontSize="13" fill={DARK} fontWeight="bold">
          主語の転換
        </text>

        {/* Before */}
        <rect x="20" y="40" width="210" height="50" fill="#FEE2E2" stroke="#FECACA" strokeWidth="1.5" />
        <text x="125" y="60" textAnchor="middle" fontSize="11" fill="#991B1B" fontWeight="bold">
          「当社のシステムは...」
        </text>
        <text x="125" y="78" textAnchor="middle" fontSize="10" fill="#991B1B">
          主語が自社 → 響かない
        </text>

        {/* Arrow */}
        <line x1="240" y1="65" x2="285" y2="65" stroke={ACCENT} strokeWidth="3" />
        <polygon points="285,65 279,60 279,70" fill={ACCENT} />

        {/* After */}
        <rect x="295" y="40" width="210" height="50" fill="#D1FAE5" stroke={ACCENT} strokeWidth="1.5" />
        <text x="400" y="60" textAnchor="middle" fontSize="11" fill={ACCENT} fontWeight="bold">
          「○○様は...できます」
        </text>
        <text x="400" y="78" textAnchor="middle" fontSize="10" fill={ACCENT}>
          主語がお客様 → 刺さる
        </text>

        {/* Bottom example */}
        <rect x="40" y="110" width="440" height="28" fill={LIGHT_BG} stroke="none" />
        <text x="260" y="128" textAnchor="middle" fontSize="10" fill={DARK}>
          x「処理速度が速いです」→ o「○○様は毎月の処理時間を半分に短縮できます」
        </text>
      </svg>
    </div>
  );
}

// =============================================
// Lesson 8: comparison-if
// =============================================

// 比較話法の3ステップ — Sequential flow
function ComparisonThreeStepsDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 540 160"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {[
          { num: "1", label: "他社の弱み", sub: "一般論として提示", color: LIGHT_BG, border: MUTED, textC: DARK },
          { num: "2", label: "自社の強み", sub: "解決策を提示", color: WHITE, border: ACCENT, textC: ACCENT },
          { num: "3", label: "顧客メリット", sub: "ベネフィットに変換", color: ACCENT, border: ACCENT, textC: WHITE },
        ].map((step, i) => {
          const x = 15 + i * 180;
          return (
            <g key={step.num}>
              <circle cx={x + 70} cy="25" r="14" fill={ACCENT} />
              <text x={x + 70} y="30" textAnchor="middle" fontSize="12" fill={WHITE} fontWeight="bold">
                {step.num}
              </text>
              <rect x={x} y="50" width="140" height="60" fill={step.color} stroke={step.border} strokeWidth="1.5" />
              <text x={x + 70} y="74" textAnchor="middle" fontSize="13" fill={step.textC} fontWeight="bold">
                {step.label}
              </text>
              <text x={x + 70} y="96" textAnchor="middle" fontSize="10" fill={step.textC === WHITE ? WHITE : MUTED}>
                {step.sub}
              </text>
              {i < 2 && (
                <>
                  <line x1={x + 140} y1="80" x2={x + 180} y2="80" stroke={ACCENT} strokeWidth="2" />
                  <polygon points={`${x + 180},80 ${x + 174},75 ${x + 174},85`} fill={ACCENT} />
                </>
              )}
            </g>
          );
        })}

        {/* Note */}
        <rect x="60" y="125" width="420" height="25" fill={LIGHT_BG} stroke="none" />
        <text x="270" y="142" textAnchor="middle" fontSize="10" fill={DARK}>
          特定の他社名は出さず「一般的に」「業界全体として」という表現を使う
        </text>
      </svg>
    </div>
  );
}

// 天国IF vs 地獄IF — Side by side with scale
function HeavenHellIfDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 200"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* 天国IF */}
        <rect x="20" y="20" width="220" height="90" fill={WHITE} stroke={ACCENT} strokeWidth="2" />
        <text x="130" y="45" textAnchor="middle" fontSize="14" fill={ACCENT} fontWeight="bold">
          天国IF
        </text>
        <text x="130" y="65" textAnchor="middle" fontSize="10" fill={MUTED}>ポジティブな未来を想像</text>
        <text x="130" y="85" textAnchor="middle" fontSize="10" fill={ACCENT}>
          「もし実現したら...」
        </text>
        <text x="130" y="100" textAnchor="middle" fontSize="10" fill={MUTED}>
          訴求力: 1倍
        </text>

        {/* 地獄IF */}
        <rect x="280" y="20" width="220" height="90" fill={WHITE} stroke="#DC2626" strokeWidth="2" />
        <text x="390" y="45" textAnchor="middle" fontSize="14" fill="#DC2626" fontWeight="bold">
          地獄IF
        </text>
        <text x="390" y="65" textAnchor="middle" fontSize="10" fill={MUTED}>ネガティブな未来を想像</text>
        <text x="390" y="85" textAnchor="middle" fontSize="10" fill="#DC2626">
          「もしこのままだと...」
        </text>
        <rect x="420" y="20" width="80" height="18" fill="#DC2626" />
        <text x="460" y="33" textAnchor="middle" fontSize="10" fill={WHITE} fontWeight="bold">2倍の訴求力</text>

        {/* Ideal order */}
        <text x="260" y="138" textAnchor="middle" fontSize="12" fill={DARK} fontWeight="bold">
          理想的な順序
        </text>

        {[
          { label: "天国IF", color: ACCENT, x: 60 },
          { label: "地獄IF", color: "#DC2626", x: 215 },
          { label: "天国IF", color: ACCENT, x: 370 },
        ].map((item, i) => (
          <g key={i}>
            <rect x={item.x} y="150" width="100" height="35" fill={item.color} stroke="none" />
            <text x={item.x + 50} y="172" textAnchor="middle" fontSize="12" fill={WHITE} fontWeight="bold">
              {item.label}
            </text>
            {i < 2 && (
              <>
                <line x1={item.x + 100} y1="167" x2={item.x + 115} y2="167" stroke={DARK} strokeWidth="2" />
                <polygon points={`${item.x + 115},167 ${item.x + 110},163 ${item.x + 110},171`} fill={DARK} />
              </>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

// 損失回避性 — Scale diagram
function LossAversionDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 170"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        <text x="260" y="22" textAnchor="middle" fontSize="13" fill={DARK} fontWeight="bold">
          損失回避性（プロスペクト理論）
        </text>

        {/* Gain bar */}
        <text x="50" y="55" textAnchor="end" fontSize="11" fill={ACCENT} fontWeight="bold">得る喜び</text>
        <rect x="60" y="42" width="150" height="22" fill={ACCENT} stroke="none" />
        <text x="215" y="58" fontSize="11" fill={ACCENT} fontWeight="bold">1倍</text>

        {/* Loss bar (2x) */}
        <text x="50" y="90" textAnchor="end" fontSize="11" fill="#DC2626" fontWeight="bold">損の恐怖</text>
        <rect x="60" y="77" width="300" height="22" fill="#DC2626" stroke="none" />
        <text x="365" y="93" fontSize="11" fill="#DC2626" fontWeight="bold">2倍</text>

        {/* Bottom explanation */}
        <rect x="40" y="115" width="440" height="40" fill={LIGHT_BG} stroke="none" />
        <text x="260" y="133" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">
          人は「得をする」よりも「損をする」方を2倍強く感じる
        </text>
        <text x="260" y="149" textAnchor="middle" fontSize="10" fill={MUTED}>
          ただし地獄IFの使いすぎは逆効果 → 最後はポジティブで締める
        </text>
      </svg>
    </div>
  );
}

// 脳は現実と想像を区別できない — Brain concept
function BrainImaginationDiagram() {
  return (
    <div className="my-6">
      <svg
        viewBox="0 0 520 150"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: FONT }}
      >
        {/* Left: Real */}
        <rect x="20" y="20" width="160" height="60" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="100" y="46" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">現実の体験</text>
        <text x="100" y="64" textAnchor="middle" fontSize="10" fill={MUTED}>実際に起きたこと</text>

        {/* Equals */}
        <text x="215" y="55" textAnchor="middle" fontSize="20" fill={ACCENT} fontWeight="bold">=</text>

        {/* Right: Imagination */}
        <rect x="250" y="20" width="160" height="60" fill={WHITE} stroke={ACCENT} strokeWidth="1.5" />
        <text x="330" y="46" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="bold">鮮明な想像</text>
        <text x="330" y="64" textAnchor="middle" fontSize="10" fill={MUTED}>IFで想像させた未来</text>

        {/* Arrow to brain */}
        <line x1="415" y1="50" x2="445" y2="50" stroke={ACCENT} strokeWidth="2" />
        <polygon points="445,50 439,45 439,55" fill={ACCENT} />

        <rect x="450" y="20" width="55" height="60" fill={ACCENT} stroke="none" />
        <text x="477" y="46" textAnchor="middle" fontSize="11" fill={WHITE} fontWeight="bold">脳</text>
        <text x="477" y="62" textAnchor="middle" fontSize="9" fill={WHITE}>同じ反応</text>

        {/* Bottom */}
        <rect x="40" y="100" width="440" height="35" fill={LIGHT_BG} stroke="none" />
        <text x="260" y="118" textAnchor="middle" fontSize="11" fill={DARK} fontWeight="bold">
          脳は現実と想像を完全には区別できない
        </text>
        <text x="260" y="132" textAnchor="middle" fontSize="10" fill={MUTED}>
          例: レモンを想像すると唾液が出る → IFで未来を体験させる
        </text>
      </svg>
    </div>
  );
}

// =============================================
// Export map
// =============================================

export const beginnerSectionDiagrams: Record<string, Record<string, React.ComponentType>> = {
  "sales-mindset": {
    "effect-oriented": EffectOrientedDiagram,
    "confidence-formula": ConfidenceFormulaDiagram,
    "four-categories": FourCategoriesDiagram,
    "buying-mindset": BuyingMindsetDiagram,
  },
  "praise-technique": {
    "comparison-praise": ComparisonPraiseDiagram,
    "double-praise": DoublePraiseDiagram,
    "open-signals": OpenSignalsDiagram,
  },
  "premise-setting": {
    "four-steps": FourStepsDiagram,
    "twice-timing": TwiceTimingDiagram,
    "cocktail-party": CocktailPartyDiagram,
  },
  "mehrabian-rule": {
    "mehrabian-ratio": MehrabianRuleDiagram,
    "gesture-match": GestureMatchDiagram,
    "first-impression": FirstImpressionDiagram,
  },
  "drawer-phrases": {
    "third-person-method": ThirdPersonMethodDiagram,
    "colloquial-formal": ColloquialFormalDiagram,
    "three-needs-direction": ThreeNeedsDirectionDiagram,
  },
  "deepening": {
    "shallow-to-deep": ShallowToDeepDiagram,
    "question-chain": QuestionChainDiagram,
    "time-cost-calc": TimeCostCalcDiagram,
  },
  "benefit-method": {
    "sp-benefit-difference": SpBenefitDifferenceDiagram,
    "three-benefit-sets": ThreeBenefitSetsDiagram,
    "customer-perspective": CustomerPerspectiveDiagram,
  },
  "comparison-if": {
    "comparison-three-steps": ComparisonThreeStepsDiagram,
    "heaven-hell-if": HeavenHellIfDiagram,
    "loss-aversion": LossAversionDiagram,
    "brain-imagination": BrainImaginationDiagram,
  },
};
