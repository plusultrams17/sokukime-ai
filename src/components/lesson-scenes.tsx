"use client";

import React from "react";

/* ─── Shared helper: realistic human figure ─────────────────────────── */

interface FigureProps {
  x: number;          // center-x of the figure
  y: number;          // bottom of feet (ground line)
  height?: number;    // total height (default 110)
  opacity?: number;   // overall figure opacity (0-1, default 0.9)
  armLeft?: "down" | "hip" | "out" | "up" | "gesture" | "hold";
  armRight?: "down" | "hip" | "out" | "up" | "gesture" | "hold" | "point";
  hairStyle?: "short" | "parted" | "swept";
  hasTie?: boolean;
  smile?: boolean;
  id?: string;
}

function Figure({
  x,
  y,
  height = 110,
  opacity = 0.9,
  armLeft = "down",
  armRight = "down",
  hairStyle = "short",
  hasTie = true,
  smile = false,
  id = "",
}: FigureProps) {
  const s = height / 110; // scale factor
  const c = `rgba(255,255,255,${opacity})`;
  const cDark = `rgba(255,255,255,${Math.max(opacity - 0.1, 0.3)})`;
  const cHair = `rgba(255,255,255,${opacity * 0.65})`;
  const cFace = `rgba(255,255,255,${Math.min(opacity + 0.05, 1)})`;

  // key positions (relative to center-bottom)
  const headCY = y - height + 13 * s;
  const headR = 12 * s;
  const neckTop = headCY + headR;
  const neckBot = neckTop + 6 * s;
  const torsoBot = neckBot + 32 * s;
  const legLen = 30 * s;
  const shoulderW = 16 * s;

  // arm endpoints
  function armEnd(side: "left" | "right", pose: string) {
    const dir = side === "left" ? -1 : 1;
    const sx = x + dir * shoulderW;
    const sy = neckBot + 4 * s;
    let ex = sx + dir * 20 * s;
    let ey = torsoBot;
    if (pose === "hip") { ex = x + dir * (shoulderW + 6 * s); ey = torsoBot - 6 * s; }
    if (pose === "out") { ex = sx + dir * 28 * s; ey = sy + 4 * s; }
    if (pose === "up") { ex = sx + dir * 18 * s; ey = sy - 22 * s; }
    if (pose === "gesture") { ex = sx + dir * 24 * s; ey = sy - 8 * s; }
    if (pose === "hold") { ex = sx + dir * 14 * s; ey = sy + 18 * s; }
    if (pose === "point") { ex = sx + dir * 32 * s; ey = sy - 4 * s; }
    return { sx, sy, ex, ey };
  }

  const la = armEnd("left", armLeft);
  const ra = armEnd("right", armRight);

  return (
    <g data-figure={id}>
      {/* Hair */}
      {hairStyle === "short" && (
        <ellipse cx={x} cy={headCY - headR * 0.55} rx={headR * 1.05} ry={headR * 0.55} fill={cHair} />
      )}
      {hairStyle === "parted" && (
        <>
          <ellipse cx={x} cy={headCY - headR * 0.5} rx={headR * 1.1} ry={headR * 0.6} fill={cHair} />
          <line x1={x} y1={headCY - headR} x2={x + 3 * s} y2={headCY - headR * 0.3} stroke={`rgba(255,255,255,${opacity * 0.4})`} strokeWidth={0.8 * s} />
        </>
      )}
      {hairStyle === "swept" && (
        <path
          d={`M${x - headR * 1.1},${headCY - headR * 0.2} Q${x - headR * 0.5},${headCY - headR * 1.3} ${x + headR * 0.8},${headCY - headR * 0.9} Q${x + headR * 1.2},${headCY - headR * 0.6} ${x + headR * 1.1},${headCY - headR * 0.15}`}
          fill={cHair}
        />
      )}
      {/* Head */}
      <ellipse cx={x} cy={headCY} rx={headR} ry={headR * 1.08} fill={cFace} />
      {/* Eyes */}
      <circle cx={x - 4 * s} cy={headCY - 1 * s} r={1.2 * s} fill={`rgba(0,0,0,${opacity * 0.35})`} />
      <circle cx={x + 4 * s} cy={headCY - 1 * s} r={1.2 * s} fill={`rgba(0,0,0,${opacity * 0.35})`} />
      {/* Eyebrows */}
      <line x1={x - 6 * s} y1={headCY - 4 * s} x2={x - 2 * s} y2={headCY - 4.5 * s} stroke={`rgba(0,0,0,${opacity * 0.2})`} strokeWidth={0.9 * s} strokeLinecap="round" />
      <line x1={x + 2 * s} y1={headCY - 4.5 * s} x2={x + 6 * s} y2={headCY - 4 * s} stroke={`rgba(0,0,0,${opacity * 0.2})`} strokeWidth={0.9 * s} strokeLinecap="round" />
      {/* Mouth */}
      {smile ? (
        <path d={`M${x - 3 * s},${headCY + 4 * s} Q${x},${headCY + 7 * s} ${x + 3 * s},${headCY + 4 * s}`} fill="none" stroke={`rgba(0,0,0,${opacity * 0.2})`} strokeWidth={0.8 * s} strokeLinecap="round" />
      ) : (
        <line x1={x - 2.5 * s} y1={headCY + 4.5 * s} x2={x + 2.5 * s} y2={headCY + 4.5 * s} stroke={`rgba(0,0,0,${opacity * 0.18})`} strokeWidth={0.7 * s} strokeLinecap="round" />
      )}
      {/* Neck */}
      <rect x={x - 3 * s} y={neckTop} width={6 * s} height={6 * s} fill={cFace} />
      {/* Torso (jacket/suit shape) */}
      <path
        d={`M${x - shoulderW},${neckBot} L${x - shoulderW - 2 * s},${torsoBot} L${x + shoulderW + 2 * s},${torsoBot} L${x + shoulderW},${neckBot} Z`}
        fill={c}
      />
      {/* Collar lines */}
      <line x1={x - 2 * s} y1={neckBot} x2={x - 6 * s} y2={neckBot + 10 * s} stroke={`rgba(255,255,255,${opacity * 0.4})`} strokeWidth={0.8 * s} />
      <line x1={x + 2 * s} y1={neckBot} x2={x + 6 * s} y2={neckBot + 10 * s} stroke={`rgba(255,255,255,${opacity * 0.4})`} strokeWidth={0.8 * s} />
      {/* Tie */}
      {hasTie && (
        <>
          <polygon points={`${x},${neckBot + 1 * s} ${x - 2.5 * s},${neckBot + 6 * s} ${x},${neckBot + 20 * s} ${x + 2.5 * s},${neckBot + 6 * s}`} fill={`rgba(255,255,255,${opacity * 0.5})`} />
        </>
      )}
      {/* Button dots */}
      <circle cx={x} cy={torsoBot - 8 * s} r={0.8 * s} fill={`rgba(255,255,255,${opacity * 0.35})`} />
      <circle cx={x} cy={torsoBot - 14 * s} r={0.8 * s} fill={`rgba(255,255,255,${opacity * 0.35})`} />
      {/* Left arm */}
      <line x1={la.sx} y1={la.sy} x2={la.ex} y2={la.ey} stroke={cDark} strokeWidth={3 * s} strokeLinecap="round" />
      <ellipse cx={la.ex} cy={la.ey} rx={3 * s} ry={2.5 * s} fill={cFace} />
      {/* Right arm */}
      <line x1={ra.sx} y1={ra.sy} x2={ra.ex} y2={ra.ey} stroke={cDark} strokeWidth={3 * s} strokeLinecap="round" />
      <ellipse cx={ra.ex} cy={ra.ey} rx={3 * s} ry={2.5 * s} fill={cFace} />
      {/* Legs */}
      <line x1={x - 5 * s} y1={torsoBot} x2={x - 7 * s} y2={torsoBot + legLen} stroke={cDark} strokeWidth={3.5 * s} strokeLinecap="round" />
      <line x1={x + 5 * s} y1={torsoBot} x2={x + 7 * s} y2={torsoBot + legLen} stroke={cDark} strokeWidth={3.5 * s} strokeLinecap="round" />
      {/* Feet */}
      <ellipse cx={x - 7 * s - 3 * s} cy={torsoBot + legLen} rx={5 * s} ry={2 * s} fill={cDark} />
      <ellipse cx={x + 7 * s + 3 * s} cy={torsoBot + legLen} rx={5 * s} ry={2 * s} fill={cDark} />
    </g>
  );
}

/* ─── Small seated figure helper ─────────────────────────────────────── */

interface SeatedProps {
  x: number;
  y: number;       // seat level
  scale?: number;
  opacity?: number;
  hairStyle?: "short" | "parted" | "swept";
}

function SeatedFigure({ x, y, scale: s = 0.7, opacity = 0.7, hairStyle = "short" }: SeatedProps) {
  const c = `rgba(255,255,255,${opacity})`;
  const cF = `rgba(255,255,255,${Math.min(opacity + 0.05, 1)})`;
  const cH = `rgba(255,255,255,${opacity * 0.65})`;
  const headR = 9 * s;
  const headCY = y - 36 * s;
  return (
    <g>
      {/* hair */}
      {hairStyle === "short" && <ellipse cx={x} cy={headCY - headR * 0.5} rx={headR * 1.05} ry={headR * 0.5} fill={cH} />}
      {hairStyle === "parted" && <ellipse cx={x} cy={headCY - headR * 0.45} rx={headR * 1.1} ry={headR * 0.55} fill={cH} />}
      {hairStyle === "swept" && <ellipse cx={x} cy={headCY - headR * 0.45} rx={headR * 1.15} ry={headR * 0.55} fill={cH} />}
      {/* head */}
      <ellipse cx={x} cy={headCY} rx={headR} ry={headR * 1.05} fill={cF} />
      {/* eyes */}
      <circle cx={x - 3 * s} cy={headCY - 0.5 * s} r={0.9 * s} fill={`rgba(0,0,0,${opacity * 0.3})`} />
      <circle cx={x + 3 * s} cy={headCY - 0.5 * s} r={0.9 * s} fill={`rgba(0,0,0,${opacity * 0.3})`} />
      {/* neck */}
      <rect x={x - 2 * s} y={headCY + headR} width={4 * s} height={4 * s} fill={cF} />
      {/* torso */}
      <rect x={x - 10 * s} y={headCY + headR + 4 * s} width={20 * s} height={20 * s} rx={3 * s} fill={c} />
      {/* legs (bent, seated) */}
      <line x1={x - 6 * s} y1={y - 4 * s} x2={x - 10 * s} y2={y + 10 * s} stroke={c} strokeWidth={3 * s} strokeLinecap="round" />
      <line x1={x + 6 * s} y1={y - 4 * s} x2={x + 10 * s} y2={y + 10 * s} stroke={c} strokeWidth={3 * s} strokeLinecap="round" />
    </g>
  );
}

/* ====================================================================
   BEGINNER SCENES (gradient #0F6E56 → #0a4d3c)
   ==================================================================== */

function MindsetScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-mindset" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F6E56" />
          <stop offset="100%" stopColor="#0a4d3c" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-mindset)" />
      {/* Steps */}
      <rect x="100" y="190" width="60" height="30" rx="4" fill="rgba(255,255,255,0.12)" />
      <rect x="165" y="165" width="60" height="55" rx="4" fill="rgba(255,255,255,0.17)" />
      <rect x="230" y="135" width="60" height="85" rx="4" fill="rgba(255,255,255,0.22)" />
      {/* Confident person on top step, hands on hips */}
      <Figure x={260} y={135} height={100} armLeft="hip" armRight="hip" hairStyle="short" hasTie smile />
      {/* Glowing star above */}
      <polygon points="260,12 264,24 277,24 267,32 271,44 260,36 249,44 253,32 243,24 256,24" fill="#FFD700" opacity={0.85} />
      <circle cx={260} cy={28} r={20} fill="rgba(255,215,0,0.12)" />
      <circle cx={260} cy={28} r={32} fill="rgba(255,215,0,0.06)" />
      {/* Dashed upward path */}
      <line x1="120" y1="185" x2="245" y2="48" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="5,4" />
      {/* Sparkles */}
      <circle cx={150} cy={155} r={2} fill="rgba(255,255,255,0.4)" />
      <circle cx={200} cy={125} r={2} fill="rgba(255,255,255,0.45)" />
    </svg>
  );
}

function PraiseScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-praise" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F6E56" />
          <stop offset="100%" stopColor="#0a4d3c" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-praise)" />
      {/* Desk */}
      <rect x="120" y="155" width="160" height="6" rx="2" fill="rgba(255,255,255,0.2)" />
      <rect x="130" y="161" width="4" height="30" fill="rgba(255,255,255,0.12)" />
      <rect x="266" y="161" width="4" height="30" fill="rgba(255,255,255,0.12)" />
      {/* Salesperson (left) – gesturing positively */}
      <Figure x={110} y={210} height={105} armRight="gesture" armLeft="down" hairStyle="parted" hasTie smile id="sales" />
      {/* Customer (right) – happy */}
      <Figure x={290} y={210} height={105} armLeft="down" armRight="down" hairStyle="swept" hasTie={false} smile opacity={0.8} id="cust" />
      {/* Speech bubble */}
      <path d="M145,52 Q145,36 175,36 L240,36 Q260,36 260,52 L260,72 Q260,82 248,82 L175,82 L158,95 L162,82 L155,82 Q145,82 145,72 Z" fill="rgba(255,255,255,0.18)" />
      <text x="170" y="64" fill="rgba(255,255,255,0.85)" fontSize="10" fontFamily="system-ui">素晴らしいですね！</text>
      {/* Warm glow / hearts */}
      <circle cx={290} cy={110} r={40} fill="rgba(255,215,0,0.05)" />
      <text x="310" y="48" fill="rgba(255,200,200,0.45)" fontSize="10">&#9829;</text>
      <text x="275" y="38" fill="rgba(255,200,200,0.35)" fontSize="8">&#9829;</text>
    </svg>
  );
}

function PremiseScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-premise" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F6E56" />
          <stop offset="100%" stopColor="#0a4d3c" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-premise)" />
      {/* Whiteboard */}
      <rect x="180" y="30" width="190" height="130" rx="5" fill="rgba(255,255,255,0.15)" />
      <rect x="188" y="38" width="174" height="114" rx="3" fill="rgba(255,255,255,0.07)" />
      {/* Framework on board */}
      <rect x="210" y="52" width="130" height="18" rx="3" fill="rgba(255,255,255,0.25)" />
      <line x1="275" y1="74" x2="275" y2="88" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <rect x="218" y="90" width="50" height="15" rx="3" fill="rgba(255,255,255,0.18)" />
      <rect x="280" y="90" width="50" height="15" rx="3" fill="rgba(255,255,255,0.18)" />
      <rect x="225" y="115" width="36" height="12" rx="2" fill="rgba(255,255,255,0.13)" />
      <rect x="287" y="115" width="36" height="12" rx="2" fill="rgba(255,255,255,0.13)" />
      {/* Whiteboard stand */}
      <line x1="275" y1="160" x2="255" y2="218" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      <line x1="275" y1="160" x2="295" y2="218" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      {/* Presenter holding marker, pointing */}
      <Figure x={130} y={215} height={108} armRight="point" armLeft="hold" hairStyle="short" hasTie smile id="pres" />
      {/* Marker in hand (small rect near right hand) */}
      <rect x={162} y={96} width={14} height={3} rx="1" fill="rgba(255,255,255,0.6)" transform="rotate(-10, 168, 97)" />
      {/* Seated audience */}
      <SeatedFigure x={55} y={190} scale={0.65} opacity={0.5} hairStyle="parted" />
      <SeatedFigure x={85} y={195} scale={0.6} opacity={0.45} hairStyle="swept" />
    </svg>
  );
}

function MehrabianScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-mehrabian" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F6E56" />
          <stop offset="100%" stopColor="#0a4d3c" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-mehrabian)" />
      {/* Presenter */}
      <Figure x={90} y={210} height={105} armRight="gesture" armLeft="down" hairStyle="parted" hasTie id="pres" />
      {/* Sound waves */}
      <path d="M115,102 Q122,96 122,102 Q122,108 115,102" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      <path d="M120,102 Q130,92 130,102 Q130,112 120,102" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      {/* Bar: 視覚 55% */}
      <rect x="170" y="40" width="200" height="42" rx="8" fill="rgba(255,255,255,0.15)" />
      <rect x="174" y="44" width={192 * 0.55} height="34" rx="5" fill="rgba(255,255,255,0.25)" />
      <text x="185" y="66" fill="rgba(255,255,255,0.95)" fontSize="13" fontWeight="bold" fontFamily="system-ui">視覚 55%</text>
      {/* Eye icon */}
      <ellipse cx={350} cy={61} rx={10} ry={6} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
      <circle cx={350} cy={61} r={3} fill="rgba(255,255,255,0.45)" />
      {/* Bar: 聴覚 38% */}
      <rect x="170" y="92" width="200" height="42" rx="8" fill="rgba(255,255,255,0.12)" />
      <rect x="174" y="96" width={192 * 0.38} height="34" rx="5" fill="rgba(255,255,255,0.2)" />
      <text x="185" y="118" fill="rgba(255,255,255,0.9)" fontSize="13" fontWeight="bold" fontFamily="system-ui">聴覚 38%</text>
      {/* Wave icon */}
      <path d="M325,113 Q330,103 335,113 Q340,123 345,113" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      {/* Bar: 言語 7% */}
      <rect x="170" y="144" width="200" height="42" rx="8" fill="rgba(255,255,255,0.08)" />
      <rect x="174" y="148" width={192 * 0.07} height="34" rx="5" fill="rgba(255,255,255,0.15)" />
      <text x="185" y="170" fill="rgba(255,255,255,0.8)" fontSize="13" fontWeight="bold" fontFamily="system-ui">言語 7%</text>
    </svg>
  );
}

function DrawerScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-drawer" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F6E56" />
          <stop offset="100%" stopColor="#0a4d3c" />
        </linearGradient>
        <linearGradient id="gold-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#DAA520" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-drawer)" />
      {/* File cabinet */}
      <rect x="215" y="70" width="80" height="140" rx="4" fill="rgba(255,255,255,0.15)" />
      <rect x="220" y="75" width="70" height="30" rx="2" fill="rgba(255,255,255,0.1)" />
      <rect x="220" y="110" width="70" height="30" rx="2" fill="rgba(255,255,255,0.1)" />
      {/* Open drawer */}
      <rect x="210" y="145" width="90" height="35" rx="3" fill="rgba(255,255,255,0.2)" />
      <rect x="248" y="158" width="14" height="4" rx="2" fill="rgba(255,255,255,0.35)" />
      {/* Drawer handles */}
      <rect x="248" y="87" width="14" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="248" y="122" width="14" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
      {/* Salesperson pulling cards out */}
      <Figure x={130} y={215} height={110} armRight="out" armLeft="hold" hairStyle="short" hasTie smile id="sales" />
      {/* Golden cards flying out */}
      <rect x="220" y="118" width="34" height="18" rx="3" fill="url(#gold-card)" opacity={0.7} transform="rotate(-12, 237, 127)" />
      <rect x="235" y="96" width="34" height="18" rx="3" fill="url(#gold-card)" opacity={0.55} transform="rotate(5, 252, 105)" />
      <rect x="225" y="70" width="34" height="18" rx="3" fill="url(#gold-card)" opacity={0.4} transform="rotate(-8, 242, 79)" />
      {/* Sparkles */}
      <circle cx={275} cy={80} r={2.5} fill="#FFD700" opacity={0.6} />
      <circle cx={215} cy={68} r={2} fill="#FFD700" opacity={0.5} />
      <circle cx={268} cy={55} r={2} fill="#FFD700" opacity={0.45} />
      {/* Office desk edge */}
      <rect x="310" y="175" width="70" height="5" rx="2" fill="rgba(255,255,255,0.1)" />
    </svg>
  );
}

function DeepeningScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-deep" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F6E56" />
          <stop offset="100%" stopColor="#0a4d3c" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-deep)" />
      {/* Two people in conversation */}
      <Figure x={100} y={210} height={100} armRight="gesture" armLeft="down" hairStyle="parted" hasTie smile id="interviewer" />
      <Figure x={260} y={210} height={100} armLeft="down" armRight="hold" hairStyle="swept" hasTie={false} opacity={0.8} id="customer" />
      {/* Notepad in customer's hand area */}
      <rect x={280} y={148} width={18} height={24} rx="2" fill="rgba(255,255,255,0.25)" />
      <line x1={284} y1={154} x2={294} y2={154} stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <line x1={284} y1={158} x2={292} y2={158} stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <line x1={284} y1={162} x2={293} y2={162} stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      {/* Speech bubble 1 - なぜ？ */}
      <path d="M125,55 Q125,40 150,40 L180,40 Q195,40 195,55 L195,68 Q195,78 185,78 L155,78 L140,88 L143,78 L135,78 Q125,78 125,68 Z" fill="rgba(255,255,255,0.18)" />
      <text x="152" y="64" fill="rgba(255,255,255,0.85)" fontSize="12" fontFamily="system-ui">なぜ？</text>
      {/* Speech bubble 2 - 具体的には？ */}
      <path d="M140,15 Q140,2 165,2 L220,2 Q240,2 240,15 L240,28 Q240,38 228,38 L180,38 L165,48 L168,38 L150,38 Q140,38 140,28 Z" fill="rgba(255,255,255,0.13)" />
      <text x="160" y="24" fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="system-ui">具体的には？</text>
      {/* Depth layers (conversation depth) */}
      <ellipse cx={180} cy={140} rx={50} ry={8} fill="rgba(255,255,255,0.1)" />
      <ellipse cx={180} cy={155} rx={42} ry={7} fill="rgba(255,255,255,0.08)" />
      <ellipse cx={180} cy={168} rx={34} ry={6} fill="rgba(255,255,255,0.06)" />
      {/* Gold insight at depth */}
      <circle cx={180} cy={178} r={4} fill="rgba(255,215,0,0.4)" />
      <circle cx={180} cy={178} r={9} fill="rgba(255,215,0,0.1)" />
    </svg>
  );
}

function BenefitScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-benefit" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F6E56" />
          <stop offset="100%" stopColor="#0a4d3c" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-benefit)" />
      {/* Salesperson pointing at chart */}
      <Figure x={100} y={215} height={105} armRight="point" armLeft="down" hairStyle="short" hasTie smile id="sales" />
      {/* Chart panel */}
      <rect x="180" y="35" width="190" height="140" rx="6" fill="rgba(255,255,255,0.08)" />
      {/* Grid lines */}
      <line x1="195" y1="155" x2="355" y2="155" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="195" y1="120" x2="355" y2="120" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <line x1="195" y1="85" x2="355" y2="85" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      {/* Growth line */}
      <polyline points="200,150 225,142 250,135 275,115 300,88 325,65 345,55" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="200,150 225,142 250,135 275,115 300,88 325,65 345,55 345,155 200,155" fill="rgba(255,255,255,0.06)" />
      {/* Upward arrow */}
      <polygon points="348,50 342,60 354,60" fill="rgba(255,215,0,0.6)" />
      {/* Customer watching (seated on right side) */}
      <SeatedFigure x={340} y={200} scale={0.7} opacity={0.65} hairStyle="swept" />
      {/* Small chair for customer */}
      <rect x={325} y={200} width={30} height={4} rx="1" fill="rgba(255,255,255,0.1)" />
    </svg>
  );
}

function ComparisonScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-compare" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F6E56" />
          <stop offset="100%" stopColor="#0a4d3c" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-compare)" />
      {/* Split divider */}
      <line x1="200" y1="20" x2="200" y2="215" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="6,4" />
      {/* LEFT – problem side */}
      <text x="100" y="30" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontWeight="bold" fontFamily="system-ui">BEFORE</text>
      {/* Confused person */}
      <Figure x={100} y={180} height={90} armLeft="gesture" armRight="gesture" hairStyle="parted" hasTie={false} opacity={0.6} id="confused" />
      {/* Question marks */}
      <text x="60" y="75" fill="rgba(255,255,255,0.35)" fontSize="18">?</text>
      <text x="130" y="65" fill="rgba(255,255,255,0.28)" fontSize="14">?</text>
      {/* Red X */}
      <text x="95" y="200" textAnchor="middle" fill="rgba(255,100,100,0.5)" fontSize="22">✗</text>
      {/* RIGHT – solution side */}
      <text x="300" y="30" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="10" fontWeight="bold" fontFamily="system-ui">AFTER</text>
      {/* Happy person */}
      <Figure x={300} y={180} height={90} armLeft="down" armRight="up" hairStyle="swept" hasTie smile opacity={0.9} id="happy" />
      {/* Green check */}
      <text x="300" y="200" textAnchor="middle" fill="rgba(100,255,150,0.6)" fontSize="22">✓</text>
      {/* Star */}
      <text x="330" y="70" fill="rgba(255,215,0,0.6)" fontSize="16">&#9733;</text>
      {/* Sunshine rays on right */}
      <circle cx={340} cy={45} r={15} fill="rgba(255,215,0,0.12)" />
      <circle cx={340} cy={45} r={8} fill="rgba(255,215,0,0.2)" />
    </svg>
  );
}

/* ====================================================================
   INTERMEDIATE SCENES (gradient #2563EB → #1d4ed8)
   ==================================================================== */

function ClosingIntroScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-closing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-closing)" />
      {/* Meeting table */}
      <rect x="110" y="150" width="180" height="8" rx="3" fill="rgba(255,255,255,0.18)" />
      <rect x="140" y="158" width="6" height="40" fill="rgba(255,255,255,0.1)" />
      <rect x="254" y="158" width="6" height="40" fill="rgba(255,255,255,0.1)" />
      {/* Laptop on table */}
      <rect x="170" y="138" width="30" height="18" rx="2" fill="rgba(255,255,255,0.15)" />
      <rect x="165" y="150" width="40" height="3" rx="1" fill="rgba(255,255,255,0.2)" />
      {/* Salesperson extending hand (left) */}
      <Figure x={120} y={215} height={108} armRight="out" armLeft="down" hairStyle="short" hasTie smile id="sales" />
      {/* Customer extending hand (right) */}
      <Figure x={280} y={215} height={108} armLeft="out" armRight="down" hairStyle="swept" hasTie={false} smile opacity={0.8} id="cust" />
      {/* Handshake glow in center */}
      <ellipse cx={200} cy={140} rx={18} ry={8} fill="rgba(255,255,255,0.3)" />
      <circle cx={200} cy={138} r={14} fill="rgba(255,215,0,0.08)" />
      {/* Documents on table */}
      <rect x="220" y="140" width="16" height="12" rx="1" fill="rgba(255,255,255,0.15)" />
      <line x1="223" y1="144" x2="233" y2="144" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
      <line x1="223" y1="148" x2="231" y2="148" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
    </svg>
  );
}

function SocialProofScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-social" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-social)" />
      {/* Salesperson showing tablet */}
      <Figure x={120} y={215} height={108} armRight="gesture" armLeft="hold" hairStyle="short" hasTie smile id="sales" />
      {/* Tablet/screen */}
      <rect x="195" y="55" width="170" height="120" rx="8" fill="rgba(255,255,255,0.12)" />
      <rect x="200" y="60" width="160" height="110" rx="5" fill="rgba(255,255,255,0.06)" />
      {/* Testimonial 1 */}
      <circle cx={218} cy={80} r={8} fill="rgba(255,255,255,0.35)" />
      <line x1="232" y1="76" x2="290" y2="76" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="232" y1="84" x2="270" y2="84" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
      <text x="300" y="82" fill="rgba(255,215,0,0.6)" fontSize="8">★★★★★</text>
      {/* Testimonial 2 */}
      <circle cx={218} cy={110} r={8} fill="rgba(255,255,255,0.3)" />
      <line x1="232" y1="106" x2="285" y2="106" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="232" y1="114" x2="275" y2="114" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
      <text x="300" y="112" fill="rgba(255,215,0,0.55)" fontSize="8">★★★★★</text>
      {/* Testimonial 3 */}
      <circle cx={218} cy={140} r={8} fill="rgba(255,255,255,0.25)" />
      <line x1="232" y1="136" x2="282" y2="136" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="232" y1="144" x2="268" y2="144" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" strokeLinecap="round" />
      <text x="300" y="142" fill="rgba(255,215,0,0.5)" fontSize="8">★★★★☆</text>
      {/* Customer looking at tablet */}
      <Figure x={320} y={215} height={95} armLeft="down" armRight="down" hairStyle="swept" hasTie={false} opacity={0.75} id="cust" />
    </svg>
  );
}

function ConsistencyScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-consist" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-consist)" />
      {/* Person building path */}
      <Figure x={100} y={200} height={100} armRight="out" armLeft="hold" hairStyle="parted" hasTie smile id="builder" />
      {/* Connected blocks / chain – stepping stones */}
      <rect x="160" y="170" width="40" height="22" rx="4" fill="rgba(255,255,255,0.2)" />
      <text x="174" y="185" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">YES</text>
      {/* Chain link */}
      <line x1="200" y1="175" x2="215" y2="165" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <rect x="215" y="150" width="40" height="22" rx="4" fill="rgba(255,255,255,0.22)" />
      <text x="229" y="165" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">YES</text>
      <line x1="255" y1="155" x2="270" y2="145" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <rect x="270" y="130" width="40" height="22" rx="4" fill="rgba(255,255,255,0.24)" />
      <text x="284" y="145" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="8">YES</text>
      <line x1="310" y1="135" x2="322" y2="125" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <rect x="322" y="108" width="46" height="24" rx="5" fill="rgba(255,255,255,0.28)" stroke="rgba(255,215,0,0.35)" strokeWidth="1.5" />
      <text x="339" y="124" textAnchor="middle" fill="rgba(255,215,0,0.6)" fontSize="9" fontWeight="bold">契約</text>
      {/* Sparkle at end */}
      <circle cx={368} cy={108} r={3} fill="rgba(255,215,0,0.5)" />
      {/* Upward arrow */}
      <line x1="345" y1="175" x2="345" y2="95" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="4,4" />
      <polygon points="345,90 340,100 350,100" fill="rgba(255,255,255,0.15)" />
    </svg>
  );
}

function QuotationScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-quote" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-quote)" />
      {/* Salesperson quoting */}
      <Figure x={110} y={215} height={108} armRight="gesture" armLeft="down" hairStyle="short" hasTie smile id="sales" />
      {/* Large decorative quote marks */}
      <text x="175" y="55" fill="rgba(255,255,255,0.2)" fontSize="48" fontFamily="Georgia, serif">&ldquo;</text>
      <text x="345" y="115" fill="rgba(255,255,255,0.2)" fontSize="48" fontFamily="Georgia, serif">&rdquo;</text>
      {/* Speech bubble with quote */}
      <path d="M195,38 Q195,22 220,22 L340,22 Q360,22 360,38 L360,90 Q360,102 348,102 L230,102 L165,118 L185,102 L205,102 Q195,102 195,90 Z" fill="rgba(255,255,255,0.12)" />
      <text x="220" y="55" fill="rgba(255,255,255,0.8)" fontSize="11" fontFamily="system-ui">他のお客様も</text>
      <text x="220" y="72" fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="system-ui">同じことを</text>
      <text x="220" y="89" fill="rgba(255,255,255,0.65)" fontSize="11" fontFamily="system-ui">おっしゃっていました</text>
      {/* Referenced third party (faded) */}
      <Figure x={320} y={215} height={85} armLeft="down" armRight="down" hairStyle="swept" hasTie={false} opacity={0.35} id="third" />
      {/* Connection dashed line from third party up to quote */}
      <line x1="320" y1="130" x2="320" y2="108" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3,3" />
      <polygon points="320,105 316,112 324,112" fill="rgba(255,255,255,0.15)" />
    </svg>
  );
}

function PositiveClosingScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-posclose" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <radialGradient id="sun-glow" cx="50%" cy="20%" r="60%">
          <stop offset="0%" stopColor="rgba(255,215,0,0.18)" />
          <stop offset="100%" stopColor="rgba(255,215,0,0)" />
        </radialGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-posclose)" />
      {/* Warm sun glow */}
      <circle cx={200} cy={40} r={80} fill="url(#sun-glow)" />
      <circle cx={200} cy={35} r={18} fill="rgba(255,215,0,0.3)" />
      <circle cx={200} cy={35} r={12} fill="rgba(255,215,0,0.45)" />
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 200 + Math.cos(rad) * 22;
        const y1 = 35 + Math.sin(rad) * 22;
        const x2 = 200 + Math.cos(rad) * 32;
        const y2 = 35 + Math.sin(rad) * 32;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,215,0,0.25)" strokeWidth="2" strokeLinecap="round" />;
      })}
      {/* Person 1 (left) shaking hands, smiling */}
      <Figure x={155} y={215} height={108} armRight="out" armLeft="down" hairStyle="short" hasTie smile id="p1" />
      {/* Person 2 (right) shaking hands, smiling */}
      <Figure x={245} y={215} height={108} armLeft="out" armRight="down" hairStyle="swept" hasTie={false} smile opacity={0.85} id="p2" />
      {/* Handshake center */}
      <ellipse cx={200} cy={142} rx={14} ry={7} fill="rgba(255,255,255,0.35)" />
      {/* Sparkles */}
      <circle cx={185} cy={128} r={2.5} fill="rgba(255,215,0,0.55)" />
      <circle cx={215} cy={126} r={2.5} fill="rgba(255,215,0,0.55)" />
      <circle cx={200} cy={158} r={2} fill="rgba(255,215,0,0.4)" />
    </svg>
  );
}

function NegativeClosingScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-negclose" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-negclose)" />
      {/* Person at fork, pointing to paths */}
      <Figure x={200} y={170} height={100} armLeft="out" armRight="out" hairStyle="parted" hasTie smile id="guide" />
      {/* Fork in road */}
      <line x1="200" y1="175" x2="200" y2="190" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
      {/* Left path – warning */}
      <path d="M200,190 Q165,200 100,215" fill="none" stroke="rgba(255,100,100,0.35)" strokeWidth="3" strokeLinecap="round" />
      {/* Warning signs on left */}
      <polygon points="90,165 100,148 80,148" fill="none" stroke="rgba(255,100,100,0.5)" strokeWidth="2" />
      <text x="90" y="162" textAnchor="middle" fill="rgba(255,100,100,0.5)" fontSize="10" fontWeight="bold">!</text>
      {/* Storm cloud */}
      <ellipse cx={75} cy={135} rx={18} ry={9} fill="rgba(255,255,255,0.1)" />
      <ellipse cx={68} cy={138} rx={12} ry={7} fill="rgba(255,255,255,0.08)" />
      {/* X mark */}
      <text x="110" y="205" fill="rgba(255,100,100,0.55)" fontSize="18">✗</text>
      {/* Right path – sunshine */}
      <path d="M200,190 Q235,200 300,215" fill="none" stroke="rgba(100,255,150,0.35)" strokeWidth="3" strokeLinecap="round" />
      {/* Sunshine on right */}
      <circle cx={320} cy={135} r={16} fill="rgba(255,215,0,0.15)" />
      <circle cx={320} cy={135} r={10} fill="rgba(255,215,0,0.25)" />
      {[0, 60, 120, 180, 240, 300].map((a, i) => {
        const rad = (a * Math.PI) / 180;
        return <line key={i} x1={320 + Math.cos(rad) * 13} y1={135 + Math.sin(rad) * 13} x2={320 + Math.cos(rad) * 20} y2={135 + Math.sin(rad) * 20} stroke="rgba(255,215,0,0.2)" strokeWidth="1.5" strokeLinecap="round" />;
      })}
      {/* Check mark */}
      <text x="295" y="200" fill="rgba(100,255,150,0.6)" fontSize="18">✓</text>
    </svg>
  );
}

function DesirePatternsScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-desire" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-desire)" />
      {/* Central person */}
      <Figure x={200} y={200} height={100} armLeft="gesture" armRight="gesture" hairStyle="short" hasTie smile id="center" />
      {/* Radiating connection lines */}
      <line x1="180" y1="100" x2="110" y2="55" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="3,3" />
      <line x1="220" y1="100" x2="300" y2="55" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="3,3" />
      <line x1="175" y1="130" x2="85" y2="155" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="3,3" />
      <line x1="225" y1="130" x2="315" y2="155" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="3,3" />
      {/* Heart icon (愛) – top left */}
      <circle cx={95} cy={45} r={22} fill="rgba(255,150,150,0.12)" />
      <text x="95" y="42" textAnchor="middle" fill="rgba(255,150,150,0.6)" fontSize="18">♥</text>
      <text x="95" y="58" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="system-ui">愛</text>
      {/* Shield icon (安全) – bottom left */}
      <circle cx={70} cy={155} r={22} fill="rgba(150,200,255,0.12)" />
      <path d="M70,140 L56,148 L56,162 Q56,172 70,176 Q84,172 84,162 L84,148 Z" fill="none" stroke="rgba(150,200,255,0.5)" strokeWidth="1.5" />
      <text x="70" y="178" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="system-ui">安全</text>
      {/* Growth arrow (成長) – top right */}
      <circle cx={310} cy={45} r={22} fill="rgba(150,255,150,0.12)" />
      <polyline points="296,55 305,45 314,50 323,35" fill="none" stroke="rgba(150,255,150,0.5)" strokeWidth="2" strokeLinecap="round" />
      <polygon points="325,33 318,36 322,42" fill="rgba(150,255,150,0.5)" />
      <text x="310" y="60" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="system-ui">成長</text>
      {/* Money (利益) – bottom right */}
      <circle cx={330} cy={155} r={22} fill="rgba(255,215,0,0.12)" />
      <circle cx={330} cy={152} r={12} fill="none" stroke="rgba(255,215,0,0.4)" strokeWidth="1.5" />
      <text x="330" y="157" textAnchor="middle" fill="rgba(255,215,0,0.55)" fontSize="13" fontWeight="bold">¥</text>
      <text x="330" y="175" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="system-ui">利益</text>
    </svg>
  );
}

/* ====================================================================
   ADVANCED SCENES (gradient #7C3AED → #6d28d9)
   ==================================================================== */

function RebuttalBasicsScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-rebuttal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-rebuttal)" />
      {/* Calm salesperson with open palms */}
      <Figure x={220} y={215} height={110} armLeft="out" armRight="out" hairStyle="short" hasTie smile id="sales" />
      {/* Shield aura */}
      <ellipse cx={220} cy={140} rx={55} ry={70} fill="rgba(255,255,255,0.04)" />
      <ellipse cx={220} cy={140} rx={42} ry={55} fill="rgba(255,255,255,0.05)" />
      {/* Incoming speech bubbles with "考えます" */}
      <path d="M35,60 Q35,45 55,45 L110,45 Q125,45 125,60 L125,78 Q125,88 115,88 L85,88 L75,98 L78,88 L45,88 Q35,88 35,78 Z" fill="rgba(255,150,150,0.2)" />
      <text x="62" y="72" fill="rgba(255,255,255,0.65)" fontSize="10" fontFamily="system-ui">考えます...</text>
      <path d="M30,120 Q30,108 48,108 L100,108 Q115,108 115,120 L115,135 Q115,145 105,145 L75,145 L65,155 L68,145 L40,145 Q30,145 30,135 Z" fill="rgba(255,150,150,0.15)" />
      <text x="45" y="131" fill="rgba(255,255,255,0.55)" fontSize="10" fontFamily="system-ui">高いですね</text>
      <path d="M40,170 Q40,158 58,158 L95,158 Q108,158 108,170 L108,182 Q108,192 98,192 L72,192 L62,200 L65,192 L48,192 Q40,192 40,182 Z" fill="rgba(255,150,150,0.12)" />
      <text x="52" y="179" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="system-ui">また今度</text>
      {/* Deflection lines */}
      <line x1="125" y1="70" x2="170" y2="110" stroke="rgba(255,150,150,0.2)" strokeWidth="1.5" />
      <line x1="115" y1="128" x2="170" y2="140" stroke="rgba(255,150,150,0.15)" strokeWidth="1.5" />
      <line x1="108" y1="178" x2="170" y2="165" stroke="rgba(255,150,150,0.12)" strokeWidth="1.5" />
      {/* Deflected sparkles */}
      <circle cx={285} cy={110} r={3} fill="rgba(255,255,255,0.2)" />
      <circle cx={295} cy={145} r={2.5} fill="rgba(255,255,255,0.15)" />
      <circle cx={280} cy={170} r={2} fill="rgba(255,255,255,0.12)" />
    </svg>
  );
}

function RebuttalPatternScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-rebpat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-rebpat)" />
      {/* Person pointing at flow */}
      <Figure x={80} y={215} height={105} armRight="point" armLeft="down" hairStyle="parted" hasTie smile id="coach" />
      {/* Flow diagram boxes */}
      {/* Box 1: 共感 */}
      <rect x="155" y="40" width="70" height="36" rx="8" fill="rgba(255,255,255,0.18)" />
      <text x="190" y="63" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="12" fontFamily="system-ui">共感</text>
      {/* Arrow 1→2 */}
      <line x1="225" y1="58" x2="245" y2="58" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <polygon points="248,58 240,53 240,63" fill="rgba(255,255,255,0.35)" />
      {/* Box 2: フック */}
      <rect x="250" y="40" width="70" height="36" rx="8" fill="rgba(255,255,255,0.2)" />
      <text x="285" y="63" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="12" fontFamily="system-ui">フック</text>
      {/* Arrow 2→3 */}
      <line x1="285" y1="76" x2="285" y2="100" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <polygon points="285,104 280,96 290,96" fill="rgba(255,255,255,0.35)" />
      {/* Box 3: AREA */}
      <rect x="220" y="105" width="130" height="40" rx="8" fill="rgba(255,255,255,0.22)" stroke="rgba(255,215,0,0.3)" strokeWidth="1.5" />
      <text x="285" y="130" textAnchor="middle" fill="rgba(255,215,0,0.7)" fontSize="14" fontWeight="bold" fontFamily="system-ui">AREA</text>
      {/* Sub-labels under AREA */}
      <text x="230" y="160" fill="rgba(255,255,255,0.45)" fontSize="8" fontFamily="system-ui">Accept</text>
      <text x="265" y="160" fill="rgba(255,255,255,0.45)" fontSize="8" fontFamily="system-ui">Reframe</text>
      <text x="305" y="160" fill="rgba(255,255,255,0.45)" fontSize="8" fontFamily="system-ui">Evidence</text>
      <text x="346" y="160" fill="rgba(255,255,255,0.45)" fontSize="8" fontFamily="system-ui">Ask</text>
      {/* Glow around AREA */}
      <rect x="215" y="100" width="140" height="50" rx="10" fill="rgba(255,215,0,0.04)" />
    </svg>
  );
}

function PurposeRecallScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-purpose" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-purpose)" />
      {/* Person pointing to distance with compass */}
      <Figure x={150} y={210} height={108} armRight="point" armLeft="hold" hairStyle="short" hasTie smile id="guide" />
      {/* Compass in left hand area */}
      <circle cx={128} cy={155} r={14} fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <polygon points="128,142 125,155 131,155" fill="rgba(255,100,100,0.5)" />
      <polygon points="128,168 125,155 131,155" fill="rgba(255,255,255,0.25)" />
      <circle cx={128} cy={155} r={2.5} fill="rgba(255,215,0,0.6)" />
      {/* Goal flag in distance */}
      <line x1="330" y1="45" x2="330" y2="120" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      <polygon points="330,45 365,55 330,68" fill="rgba(255,215,0,0.45)" />
      {/* Glow behind flag */}
      <circle cx={345} cy={55} r={28} fill="rgba(255,215,0,0.06)" />
      {/* Second person following gaze */}
      <Figure x={250} y={215} height={95} armLeft="down" armRight="gesture" hairStyle="swept" hasTie={false} opacity={0.7} id="follower" />
      {/* Dotted line from people to flag */}
      <path d="M180,105 Q250,60 325,55" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="5,4" />
      {/* Mountain/distance silhouette */}
      <path d="M280,130 L310,90 L340,120 L370,80 L400,110 L400,140 L280,140 Z" fill="rgba(255,255,255,0.05)" />
    </svg>
  );
}

function ThirdPartyScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-third" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-third)" />
      {/* Customer (left) */}
      <Figure x={80} y={215} height={100} armRight="down" armLeft="down" hairStyle="swept" hasTie={false} opacity={0.75} id="cust" />
      {/* Salesperson (center) – gesturing to both */}
      <Figure x={200} y={210} height={108} armLeft="out" armRight="gesture" hairStyle="short" hasTie smile id="sales" />
      {/* Third party (right, more transparent) */}
      <Figure x={330} y={215} height={95} armLeft="down" armRight="down" hairStyle="parted" hasTie={false} opacity={0.45} id="third" />
      {/* Speech bubble referencing third party */}
      <path d="M240,50 Q240,35 260,35 L345,35 Q360,35 360,50 L360,78 Q360,88 350,88 L330,88 L320,100 L322,88 L250,88 Q240,88 240,78 Z" fill="rgba(255,255,255,0.12)" />
      {/* Mini third-party head inside bubble */}
      <circle cx={265} cy={62} r={7} fill="rgba(255,255,255,0.3)" />
      <line x1="275" y1="58" x2="340" y2="58" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="275" y1="66" x2="330" y2="66" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="275" y1="74" x2="320" y2="74" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Conversation arcs */}
      <path d="M108,115 Q150,85 178,108" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4,3" />
      <path d="M222,108 Q260,85 310,115" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4,3" />
      {/* Triangle connection */}
      <polygon points="80,200 200,195 330,200" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="5,5" />
      {/* Trust sparkles */}
      <circle cx={150} cy={95} r={2.5} fill="rgba(255,215,0,0.4)" />
      <circle cx={260} cy={92} r={2.5} fill="rgba(255,215,0,0.4)" />
    </svg>
  );
}

function PositiveShowerScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-shower" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-shower)" />
      {/* Salesperson enthusiastically presenting (upper left) */}
      <Figure x={100} y={165} height={95} armRight="up" armLeft="gesture" hairStyle="parted" hasTie smile id="sales" />
      {/* Customer receiving (center right) */}
      <Figure x={290} y={215} height={108} armLeft="down" armRight="down" hairStyle="swept" hasTie={false} smile opacity={0.8} id="cust" />
      {/* Glow around customer */}
      <circle cx={290} cy={160} r={55} fill="rgba(255,215,0,0.04)" />
      <circle cx={290} cy={160} r={38} fill="rgba(255,215,0,0.06)" />
      {/* Shower arc */}
      <path d="M140,65 Q220,15 340,60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <path d="M150,80 Q225,35 330,75" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      {/* Stars raining down */}
      <text x="175" y="48" fill="rgba(255,215,0,0.6)" fontSize="13">★</text>
      <text x="215" y="68" fill="rgba(255,215,0,0.5)" fontSize="11">★</text>
      <text x="250" y="52" fill="rgba(255,215,0,0.55)" fontSize="12">★</text>
      <text x="300" y="72" fill="rgba(255,215,0,0.45)" fontSize="10">★</text>
      <text x="195" y="88" fill="rgba(255,215,0,0.5)" fontSize="9">★</text>
      <text x="320" y="92" fill="rgba(255,215,0,0.4)" fontSize="11">★</text>
      <text x="240" y="100" fill="rgba(255,215,0,0.45)" fontSize="10">★</text>
      {/* Hearts */}
      <text x="168" y="72" fill="rgba(255,180,180,0.5)" fontSize="10">♥</text>
      <text x="280" y="62" fill="rgba(255,180,180,0.45)" fontSize="9">♥</text>
      <text x="230" y="42" fill="rgba(255,180,180,0.4)" fontSize="11">♥</text>
      {/* Plus signs */}
      <text x="192" y="62" fill="rgba(150,255,150,0.4)" fontSize="12" fontWeight="bold">+</text>
      <text x="260" y="88" fill="rgba(150,255,150,0.35)" fontSize="10" fontWeight="bold">+</text>
      <text x="315" y="52" fill="rgba(150,255,150,0.3)" fontSize="11" fontWeight="bold">+</text>
    </svg>
  );
}

function ReframeScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-reframe" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-reframe)" />
      {/* Person turning a frame */}
      <Figure x={200} y={215} height={100} armLeft="out" armRight="out" hairStyle="short" hasTie smile id="reframer" />
      {/* Dark frame (left, tilted) with "高い" */}
      <g transform="rotate(-10, 95, 80)">
        <rect x="55" y="40" width="80" height="65" rx="4" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
        <rect x="62" y="47" width="66" height="51" rx="2" fill="rgba(255,255,255,0.05)" />
        <text x="95" y="78" textAnchor="middle" fill="rgba(255,150,150,0.6)" fontSize="16" fontWeight="bold" fontFamily="system-ui">高い</text>
        {/* X over it */}
        <line x1="70" y1="55" x2="120" y2="90" stroke="rgba(255,100,100,0.25)" strokeWidth="2" />
        <line x1="120" y1="55" x2="70" y2="90" stroke="rgba(255,100,100,0.25)" strokeWidth="2" />
      </g>
      {/* Rotation arrow */}
      <path d="M148,80 Q175,55 202,60 Q230,65 240,82" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="4,3" />
      <polygon points="243,85 235,78 238,88" fill="rgba(255,255,255,0.25)" />
      {/* Bright frame (right) with "価値" */}
      <rect x="260" y="38" width="100" height="75" rx="4" fill="none" stroke="rgba(255,215,0,0.45)" strokeWidth="3" />
      <rect x="268" y="46" width="84" height="59" rx="2" fill="rgba(255,255,255,0.07)" />
      <text x="310" y="82" textAnchor="middle" fill="rgba(255,215,0,0.7)" fontSize="18" fontWeight="bold" fontFamily="system-ui">価値</text>
      {/* Checkmark inside bright frame */}
      <polyline points="290,60 300,70 325,48" fill="none" stroke="rgba(150,255,150,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Glow on bright frame */}
      <rect x="255" y="33" width="110" height="85" rx="6" fill="rgba(255,215,0,0.04)" />
      {/* Sparkles */}
      <circle cx={365} cy={42} r={2.5} fill="rgba(255,215,0,0.5)" />
      <circle cx={258} cy={35} r={2} fill="rgba(255,215,0,0.4)" />
      <circle cx={370} cy={108} r={2} fill="rgba(255,215,0,0.35)" />
    </svg>
  );
}

function ValueStackingScene() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-value" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="16" fill="url(#bg-value)" />
      {/* Person stacking blocks */}
      <Figure x={100} y={215} height={108} armRight="up" armLeft="hold" hairStyle="parted" hasTie smile id="stacker" />
      {/* Value tower blocks */}
      {/* Block 1 base: 保証 */}
      <rect x="195" y="185" width="130" height="28" rx="5" fill="rgba(255,255,255,0.18)" />
      <text x="260" y="204" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="11" fontFamily="system-ui">保証</text>
      {/* Block 2: 実績 */}
      <rect x="200" y="153" width="120" height="28" rx="5" fill="rgba(255,255,255,0.2)" />
      <text x="260" y="172" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="system-ui">実績</text>
      {/* Block 3: サポート */}
      <rect x="205" y="121" width="110" height="28" rx="5" fill="rgba(255,255,255,0.22)" />
      <text x="260" y="140" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="11" fontFamily="system-ui">サポート</text>
      {/* Block 4: 品質 */}
      <rect x="210" y="89" width="100" height="28" rx="5" fill="rgba(255,255,255,0.24)" />
      <text x="260" y="108" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="system-ui">品質</text>
      {/* Block 5 (being placed, highlighted) */}
      <rect x="218" y="57" width="84" height="28" rx="5" fill="rgba(255,255,255,0.28)" stroke="rgba(255,215,0,0.4)" strokeWidth="1.5" strokeDasharray="4,3" />
      <text x="260" y="76" textAnchor="middle" fill="rgba(255,215,0,0.7)" fontSize="11" fontWeight="bold" fontFamily="system-ui">信頼</text>
      {/* Customer watching */}
      <Figure x={350} y={215} height={95} armLeft="down" armRight="down" hairStyle="swept" hasTie={false} opacity={0.65} id="watcher" />
      {/* Upward arrow */}
      <line x1="340" y1="195" x2="340" y2="60" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="4,4" />
      <polygon points="340,55 335,65 345,65" fill="rgba(255,255,255,0.18)" />
      {/* Crown at top */}
      <polygon points="260,42 250,55 270,55" fill="rgba(255,215,0,0.4)" />
      <circle cx={260} cy={38} r={3} fill="rgba(255,215,0,0.55)" />
    </svg>
  );
}

/* ====================================================================
   SCENE MAP & EXPORTED COMPONENT
   ==================================================================== */

const SCENE_MAP: Record<string, React.ComponentType> = {
  // Beginner
  "sales-mindset": MindsetScene,
  "praise-technique": PraiseScene,
  "premise-setting": PremiseScene,
  "mehrabian-rule": MehrabianScene,
  "drawer-phrases": DrawerScene,
  "deepening": DeepeningScene,
  "benefit-method": BenefitScene,
  "comparison-if": ComparisonScene,
  // Intermediate
  "closing-intro": ClosingIntroScene,
  "social-proof": SocialProofScene,
  "consistency": ConsistencyScene,
  "quotation-method": QuotationScene,
  "positive-closing": PositiveClosingScene,
  "negative-closing": NegativeClosingScene,
  "desire-patterns": DesirePatternsScene,
  // Advanced
  "rebuttal-basics": RebuttalBasicsScene,
  "rebuttal-pattern": RebuttalPatternScene,
  "purpose-recall": PurposeRecallScene,
  "third-party-attack": ThirdPartyScene,
  "positive-shower": PositiveShowerScene,
  "reframe": ReframeScene,
  "value-stacking": ValueStackingScene,
};

export function LessonScene({ slug }: { slug: string }) {
  const Scene = SCENE_MAP[slug];
  if (!Scene) return null;
  return <Scene />;
}
