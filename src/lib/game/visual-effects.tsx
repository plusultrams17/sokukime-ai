"use client";

/* =======================================================================
   成約コーチAI — Game Visual Effects
   React + TypeScript + Tailwind CSS 4
   Dark theme / orange accent (#f97316) / mobile-first / performance-first

   2D overlay effects rendered ON TOP of the 3D canvas.
   All overlays use pointer-events: none.
   Zero external dependencies — React + DOM APIs only.
======================================================================= */

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type FC,
  type ReactNode,
} from "react";

// ─────────────────────────────────────────────────────────────
// Shared VFX Keyframes — injected once into document.head
// ─────────────────────────────────────────────────────────────

const VFX_KEYFRAMES = `
/* ── ScreenVignette ── */
@keyframes vfx-vignette-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
@keyframes vfx-vignette-critical-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
@keyframes vfx-edge-flash-orange {
  0% { opacity: 0.6; }
  100% { opacity: 0; }
}

/* ── ScreenShake ── */
@keyframes vfx-shake-light {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-1px, 1px); }
  20% { transform: translate(2px, -1px); }
  30% { transform: translate(-1px, -1px); }
  40% { transform: translate(1px, 2px); }
  50% { transform: translate(-2px, 0px); }
  60% { transform: translate(1px, -1px); }
  70% { transform: translate(-1px, 1px); }
  80% { transform: translate(2px, 0px); }
  90% { transform: translate(-1px, -2px); }
}
@keyframes vfx-shake-medium {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-3px, 2px); }
  20% { transform: translate(4px, -2px); }
  30% { transform: translate(-2px, -3px); }
  40% { transform: translate(3px, 4px); }
  50% { transform: translate(-4px, 1px); }
  60% { transform: translate(2px, -3px); }
  70% { transform: translate(-3px, 2px); }
  80% { transform: translate(4px, -1px); }
  90% { transform: translate(-2px, -4px); }
}
@keyframes vfx-shake-heavy {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-6px, 4px); }
  20% { transform: translate(8px, -5px); }
  30% { transform: translate(-4px, -7px); }
  40% { transform: translate(6px, 8px); }
  50% { transform: translate(-8px, 2px); }
  60% { transform: translate(5px, -6px); }
  70% { transform: translate(-7px, 4px); }
  80% { transform: translate(8px, -3px); }
  90% { transform: translate(-5px, -8px); }
}

/* ── ParticleExplosion ── */
@keyframes vfx-particle-radiate {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform:
      translate(
        calc(var(--vfx-dx) * 1px),
        calc(var(--vfx-dy) * 1px)
      )
      scale(0);
    opacity: 0;
  }
}
@keyframes vfx-particle-spiral {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform:
      translate(
        calc(var(--vfx-dx) * 1px),
        calc(var(--vfx-dy) * 1px)
      )
      rotate(calc(var(--vfx-rot) * 1deg))
      scale(0);
    opacity: 0;
  }
}
@keyframes vfx-confetti-fall {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform:
      translate(
        calc(var(--vfx-dx) * 1px),
        calc(var(--vfx-dy) * 1px)
      )
      rotate(calc(var(--vfx-rot) * 1deg));
    opacity: 0;
  }
}
@keyframes vfx-star-explode {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(0);
    opacity: 1;
  }
  30% {
    transform:
      translate(
        calc(var(--vfx-dx) * 0.3px),
        calc(var(--vfx-dy) * 0.3px)
      )
      rotate(calc(var(--vfx-rot) * 0.3deg))
      scale(1.2);
    opacity: 1;
  }
  100% {
    transform:
      translate(
        calc(var(--vfx-dx) * 1px),
        calc(var(--vfx-dy) * 1px)
      )
      rotate(calc(var(--vfx-rot) * 1deg))
      scale(0);
    opacity: 0;
  }
}

/* ── DramaticOverlay ── */
@keyframes vfx-tension-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.55; }
}
@keyframes vfx-success-ring {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.8;
  }
  70% {
    opacity: 0.4;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}
@keyframes vfx-success-flash {
  0% { opacity: 0.5; }
  100% { opacity: 0; }
}
@keyframes vfx-failure-flash {
  0% { opacity: 0.4; }
  100% { opacity: 0; }
}
@keyframes vfx-failure-crack {
  0% { transform: scaleY(0); opacity: 0; }
  30% { transform: scaleY(1); opacity: 0.6; }
  100% { transform: scaleY(1); opacity: 0; }
}
@keyframes vfx-spotlight-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes vfx-revelation-flash {
  0% { opacity: 0.7; }
  30% { opacity: 0; }
  100% { opacity: 0; }
}
@keyframes vfx-revelation-glow {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
  30% { opacity: 0; }
  50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
}
@keyframes vfx-light-ray {
  0% { opacity: 0; transform: rotate(var(--vfx-ray-angle)) scaleY(0); }
  30% { opacity: 0; }
  50% { opacity: 0.4; transform: rotate(var(--vfx-ray-angle)) scaleY(1); }
  100% { opacity: 0; transform: rotate(var(--vfx-ray-angle)) scaleY(1.2); }
}

/* ── FocusLines ── */
@keyframes vfx-focus-pulse-slow {
  0%, 100% { opacity: var(--vfx-line-opacity); }
  50% { opacity: calc(var(--vfx-line-opacity) * 0.5); }
}
@keyframes vfx-focus-pulse-fast {
  0%, 100% { opacity: var(--vfx-line-opacity); transform: rotate(var(--vfx-line-angle)) scaleY(1); }
  50% { opacity: calc(var(--vfx-line-opacity) * 0.4); transform: rotate(var(--vfx-line-angle)) scaleY(0.95); }
}

/* ── EmotionParticles ── */
@keyframes vfx-float-down {
  0% { transform: translate(var(--vfx-start-x), -20px); opacity: 0; }
  15% { opacity: var(--vfx-p-opacity); }
  85% { opacity: var(--vfx-p-opacity); }
  100% { transform: translate(calc(var(--vfx-start-x) + var(--vfx-drift-x)), calc(100vh + 20px)); opacity: 0; }
}
@keyframes vfx-float-up {
  0% { transform: translate(var(--vfx-start-x), calc(100vh + 20px)); opacity: 0; }
  15% { opacity: var(--vfx-p-opacity); }
  85% { opacity: var(--vfx-p-opacity); }
  100% { transform: translate(calc(var(--vfx-start-x) + var(--vfx-drift-x)), -20px); opacity: 0; }
}
@keyframes vfx-float-neutral {
  0% { transform: translate(var(--vfx-start-x), 110vh); opacity: 0; }
  15% { opacity: var(--vfx-p-opacity); }
  50% { transform: translate(calc(var(--vfx-start-x) + var(--vfx-drift-x)), 50vh); }
  85% { opacity: var(--vfx-p-opacity); }
  100% { transform: translate(calc(var(--vfx-start-x) + var(--vfx-drift-x) * 2), -10vh); opacity: 0; }
}
@keyframes vfx-sparkle-float {
  0% { transform: translate(var(--vfx-start-x), calc(100vh + 20px)) scale(0.5); opacity: 0; }
  15% { opacity: var(--vfx-p-opacity); transform: translate(var(--vfx-start-x), 80vh) scale(1); }
  50% { transform: translate(calc(var(--vfx-start-x) + var(--vfx-drift-x)), 40vh) scale(1.2); }
  85% { opacity: var(--vfx-p-opacity); }
  100% { transform: translate(calc(var(--vfx-start-x) + var(--vfx-drift-x) * 1.5), -20px) scale(0.8); opacity: 0; }
}

/* ── TimerPressureOverlay ── */
@keyframes vfx-border-pulse-slow {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.4; }
}
@keyframes vfx-border-pulse-medium {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.6; }
}
@keyframes vfx-border-pulse-fast {
  0%, 50% { opacity: 0.3; }
  25%, 75% { opacity: 0.8; }
}
@keyframes vfx-border-pulse-critical {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
@keyframes vfx-corner-flash {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.7; }
}

/* ── TransitionWipe ── */
@keyframes vfx-wipe-left-in {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }
}
@keyframes vfx-wipe-left-out {
  0% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}
@keyframes vfx-wipe-right-in {
  0% { transform: translateX(100%); }
  100% { transform: translateX(0); }
}
@keyframes vfx-wipe-right-out {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
@keyframes vfx-wipe-circle-in {
  0% { clip-path: circle(0% at 50% 50%); }
  100% { clip-path: circle(150% at 50% 50%); }
}
@keyframes vfx-wipe-circle-out {
  0% { clip-path: circle(150% at 50% 50%); }
  100% { clip-path: circle(0% at 50% 50%); }
}

/* ── ComboFlame ── */
@keyframes vfx-flame-flicker {
  0%, 100% {
    transform: scaleY(1) scaleX(1) translateY(0);
    opacity: 0.8;
  }
  25% {
    transform: scaleY(1.15) scaleX(0.9) translateY(-3px);
    opacity: 0.9;
  }
  50% {
    transform: scaleY(0.85) scaleX(1.1) translateY(1px);
    opacity: 0.7;
  }
  75% {
    transform: scaleY(1.1) scaleX(0.95) translateY(-2px);
    opacity: 1;
  }
}
@keyframes vfx-lightning-crackle {
  0%, 100% { opacity: 0.3; transform: scaleX(1); }
  15% { opacity: 1; transform: scaleX(1.1); }
  30% { opacity: 0.2; transform: scaleX(0.9); }
  45% { opacity: 0.9; transform: scaleX(1.05); }
  60% { opacity: 0.1; transform: scaleX(1); }
  75% { opacity: 0.8; transform: scaleX(0.95); }
  90% { opacity: 0.4; transform: scaleX(1.02); }
}

/* ── IntroLetterbox ── */
@keyframes vfx-letterbox-in-top {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(0); }
}
@keyframes vfx-letterbox-in-bottom {
  0% { transform: translateY(100%); }
  100% { transform: translateY(0); }
}
@keyframes vfx-letterbox-out-top {
  0% { transform: translateY(0); }
  100% { transform: translateY(-100%); }
}
@keyframes vfx-letterbox-out-bottom {
  0% { transform: translateY(0); }
  100% { transform: translateY(100%); }
}

/* ── WeatherOverlay ── */
@keyframes vfx-rain-fall {
  0% { transform: translate(var(--vfx-start-x), -10px) rotate(-15deg); opacity: 0; }
  10% { opacity: var(--vfx-p-opacity); }
  90% { opacity: var(--vfx-p-opacity); }
  100% { transform: translate(calc(var(--vfx-start-x) - 40px), calc(100vh + 10px)) rotate(-15deg); opacity: 0; }
}
@keyframes vfx-snow-fall {
  0% { transform: translate(var(--vfx-start-x), -10px); opacity: 0; }
  10% { opacity: var(--vfx-p-opacity); }
  50% { transform: translate(calc(var(--vfx-start-x) + var(--vfx-drift-x)), 50vh); }
  90% { opacity: var(--vfx-p-opacity); }
  100% { transform: translate(calc(var(--vfx-start-x) + var(--vfx-drift-x) * 2), calc(100vh + 10px)); opacity: 0; }
}
@keyframes vfx-petal-fall {
  0% { transform: translate(var(--vfx-start-x), -20px) rotate(0deg); opacity: 0; }
  10% { opacity: var(--vfx-p-opacity); }
  25% { transform: translate(calc(var(--vfx-start-x) + var(--vfx-drift-x)), 25vh) rotate(90deg); }
  50% { transform: translate(calc(var(--vfx-start-x) - var(--vfx-drift-x)), 50vh) rotate(180deg); }
  75% { transform: translate(calc(var(--vfx-start-x) + var(--vfx-drift-x) * 1.5), 75vh) rotate(270deg); }
  90% { opacity: var(--vfx-p-opacity); }
  100% { transform: translate(calc(var(--vfx-start-x) + var(--vfx-drift-x)), calc(100vh + 20px)) rotate(360deg); opacity: 0; }
}
@keyframes vfx-fog-shift {
  0% { transform: translateX(0); opacity: 0.15; }
  25% { opacity: 0.25; }
  50% { transform: translateX(5%); opacity: 0.15; }
  75% { opacity: 0.2; }
  100% { transform: translateX(0); opacity: 0.15; }
}
@keyframes vfx-thunder-flash {
  0% { opacity: 0.9; }
  20% { opacity: 0; }
  30% { opacity: 0.6; }
  50% { opacity: 0; }
  100% { opacity: 0; }
}
@keyframes vfx-thunder-shake {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-4px, 3px); }
  20% { transform: translate(5px, -2px); }
  30% { transform: translate(-3px, -4px); }
  40% { transform: translate(4px, 3px); }
  50% { transform: translate(-5px, 1px); }
}
@keyframes vfx-sparkle-rain-fall {
  0% { transform: translate(var(--vfx-start-x), -10px) scale(0.5); opacity: 0; }
  15% { opacity: var(--vfx-p-opacity); transform: translate(var(--vfx-start-x), 15vh) scale(1); }
  50% { transform: translate(calc(var(--vfx-start-x) + var(--vfx-drift-x)), 50vh) scale(1.2); opacity: var(--vfx-p-opacity); }
  85% { opacity: calc(var(--vfx-p-opacity) * 0.5); }
  100% { transform: translate(calc(var(--vfx-start-x) + var(--vfx-drift-x) * 1.5), calc(100vh + 10px)) scale(0.3); opacity: 0; }
}

/* ── GlitchEffect ── */
@keyframes vfx-glitch-slice {
  0% { clip-path: inset(var(--vfx-slice-top) 0 var(--vfx-slice-bottom) 0); transform: translateX(0); }
  20% { transform: translateX(var(--vfx-glitch-offset)); }
  40% { transform: translateX(calc(var(--vfx-glitch-offset) * -0.5)); }
  60% { transform: translateX(var(--vfx-glitch-offset)); }
  80% { transform: translateX(0); }
  100% { transform: translateX(0); }
}
@keyframes vfx-glitch-color-shift {
  0% { opacity: 0; }
  15% { opacity: 0.3; }
  30% { opacity: 0; }
  45% { opacity: 0.2; }
  60% { opacity: 0; }
  100% { opacity: 0; }
}
@keyframes vfx-glitch-scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

/* ── FloatingTextPopup ── */
@keyframes vfx-text-float-up {
  0% { transform: translate(-50%, 0) scale(0.5); opacity: 0; }
  15% { transform: translate(-50%, -10px) scale(1.1); opacity: 1; }
  30% { transform: translate(-50%, -25px) scale(1); }
  100% { transform: translate(-50%, -80px); opacity: 0; }
}
@keyframes vfx-text-shake {
  0%, 100% { transform: translate(calc(-50% + 0px), var(--vfx-text-y)); }
  25% { transform: translate(calc(-50% + 3px), var(--vfx-text-y)); }
  50% { transform: translate(calc(-50% + -2px), var(--vfx-text-y)); }
  75% { transform: translate(calc(-50% + 2px), var(--vfx-text-y)); }
}
@keyframes vfx-text-critical {
  0% { transform: translate(-50%, 0) scale(0.3); opacity: 0; }
  10% { transform: translate(-50%, -5px) scale(1.5); opacity: 1; }
  25% { transform: translate(-50%, -20px) scale(1.2); }
  100% { transform: translate(-50%, -90px) scale(0.8); opacity: 0; }
}
@keyframes vfx-text-miss {
  0% { transform: translate(-50%, 0); opacity: 0; }
  20% { opacity: 0.6; }
  100% { transform: translate(calc(-50% + 20px), -40px); opacity: 0; }
}

/* ── EnergyWave ── */
@keyframes vfx-energy-ring {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 0.8; border-width: 4px; }
  50% { opacity: 0.4; border-width: 2px; }
  100% { transform: translate(-50%, -50%) scale(var(--vfx-ring-scale)); opacity: 0; border-width: 1px; }
}

/* ── CharacterEmote ── */
@keyframes vfx-emote-bounce {
  0% { transform: translate(-50%, 0) scale(0); opacity: 0; }
  30% { transform: translate(-50%, -15px) scale(1.3); opacity: 1; }
  50% { transform: translate(-50%, -20px) scale(1); }
  70% { transform: translate(-50%, -15px) scale(1.1); }
  85% { transform: translate(-50%, -18px) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -25px) scale(0.8); opacity: 0; }
}
@keyframes vfx-emote-spin {
  0% { transform: translate(-50%, -10px) rotate(0deg) scale(0); opacity: 0; }
  20% { transform: translate(-50%, -15px) rotate(90deg) scale(1.2); opacity: 1; }
  80% { transform: translate(-50%, -20px) rotate(270deg) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -25px) rotate(360deg) scale(0.5); opacity: 0; }
}
@keyframes vfx-emote-note-float {
  0% { transform: translate(var(--vfx-note-x), 0) scale(0); opacity: 0; }
  20% { transform: translate(var(--vfx-note-x), -10px) scale(1); opacity: 0.9; }
  60% { transform: translate(calc(var(--vfx-note-x) + var(--vfx-drift-x)), -30px) scale(1); opacity: 0.7; }
  100% { transform: translate(calc(var(--vfx-note-x) + var(--vfx-drift-x) * 2), -50px) scale(0.6); opacity: 0; }
}
@keyframes vfx-emote-dots {
  0%, 20% { content: '.'; opacity: 0.4; }
  40% { opacity: 0.7; }
  60% { opacity: 1; }
  80% { opacity: 0.7; }
  100% { opacity: 0; }
}
@keyframes vfx-emote-dot-appear-1 {
  0%, 10% { opacity: 0; }
  20%, 100% { opacity: 1; }
}
@keyframes vfx-emote-dot-appear-2 {
  0%, 35% { opacity: 0; }
  45%, 100% { opacity: 1; }
}
@keyframes vfx-emote-dot-appear-3 {
  0%, 60% { opacity: 0; }
  70%, 100% { opacity: 1; }
}
@keyframes vfx-emote-sweat-drop {
  0% { transform: translate(-50%, -20px) scale(0); opacity: 0; }
  20% { transform: translate(-50%, -18px) scale(1); opacity: 0.8; }
  80% { transform: translate(-50%, 5px) scale(0.8); opacity: 0.6; }
  100% { transform: translate(-50%, 15px) scale(0.5); opacity: 0; }
}
@keyframes vfx-emote-sparkle-pulse {
  0% { transform: translate(var(--vfx-spark-x), var(--vfx-spark-y)) scale(0) rotate(0deg); opacity: 0; }
  30% { transform: translate(var(--vfx-spark-x), var(--vfx-spark-y)) scale(1.2) rotate(90deg); opacity: 1; }
  70% { transform: translate(var(--vfx-spark-x), var(--vfx-spark-y)) scale(1) rotate(180deg); opacity: 0.8; }
  100% { transform: translate(var(--vfx-spark-x), var(--vfx-spark-y)) scale(0) rotate(360deg); opacity: 0; }
}
@keyframes vfx-emote-star-orbit {
  0% { transform: rotate(0deg) translateX(var(--vfx-orbit-r)) scale(0); opacity: 0; }
  15% { opacity: 1; transform: rotate(calc(0.15 * 360deg)) translateX(var(--vfx-orbit-r)) scale(1); }
  85% { opacity: 1; }
  100% { transform: rotate(360deg) translateX(var(--vfx-orbit-r)) scale(0.5); opacity: 0; }
}

/* ── AuraEffect ── */
@keyframes vfx-aura-pulse {
  0%, 100% { opacity: var(--vfx-aura-min); transform: scale(1); }
  50% { opacity: var(--vfx-aura-max); transform: scale(1.05); }
}
@keyframes vfx-aura-breathe {
  0%, 100% { opacity: var(--vfx-aura-min); transform: scale(1); }
  50% { opacity: var(--vfx-aura-max); transform: scale(1.02); }
}
@keyframes vfx-aura-danger-pulse {
  0%, 100% { opacity: var(--vfx-aura-min); }
  30% { opacity: var(--vfx-aura-max); }
  50% { opacity: var(--vfx-aura-min); }
  70% { opacity: calc(var(--vfx-aura-max) * 0.8); }
}
@keyframes vfx-aura-shimmer {
  0% { opacity: var(--vfx-aura-min); background-position: 0% 50%; }
  50% { opacity: var(--vfx-aura-max); background-position: 100% 50%; }
  100% { opacity: var(--vfx-aura-min); background-position: 0% 50%; }
}

/* ── ScreenTint ── */
/* No custom keyframes — uses CSS transition only */

/* ── SplitScreenEffect ── */
@keyframes vfx-split-v-top {
  0% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
}
@keyframes vfx-split-v-bottom {
  0% { transform: translateY(0); }
  40% { transform: translateY(8px); }
  100% { transform: translateY(0); }
}
@keyframes vfx-split-h-left {
  0% { transform: translateX(0); }
  40% { transform: translateX(-8px); }
  100% { transform: translateX(0); }
}
@keyframes vfx-split-h-right {
  0% { transform: translateX(0); }
  40% { transform: translateX(8px); }
  100% { transform: translateX(0); }
}
@keyframes vfx-split-d-tl {
  0% { transform: translate(0, 0); }
  40% { transform: translate(-6px, -6px); }
  100% { transform: translate(0, 0); }
}
@keyframes vfx-split-d-br {
  0% { transform: translate(0, 0); }
  40% { transform: translate(6px, 6px); }
  100% { transform: translate(0, 0); }
}
@keyframes vfx-split-gap-flash {
  0% { opacity: 0; }
  20% { opacity: 1; }
  60% { opacity: 1; }
  100% { opacity: 0; }
}

/* ── RippleEffect ── */
@keyframes vfx-ripple-expand {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
}

/* ── SpotlightSweep ── */
@keyframes vfx-spotlight-fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes vfx-spotlight-fade-out {
  0% { opacity: 1; }
  100% { opacity: 0; }
}
`;

/** Inject VFX keyframes into document.head once. */
function useVfxStyles() {
  useEffect(() => {
    const id = "vfx-keyframes";
    if (typeof document !== "undefined" && !document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = VFX_KEYFRAMES;
      document.head.appendChild(style);
    }
  }, []);
}

// ─────────────────────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────────────────────

/** Stable seeded random for deterministic particle placement. */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Clamp a value between min and max. */
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

// =================================================================
//  1. ScreenVignette — Dynamic edge darkening
// =================================================================

interface ScreenVignetteProps {
  emotion: number;     // 0-100
  isTimerLow: boolean; // timer < 5 seconds
  gamePhase: string;
}

export const ScreenVignette: FC<ScreenVignetteProps> = ({
  emotion,
  isTimerLow,
  gamePhase,
}) => {
  useVfxStyles();

  const [timerFlash, setTimerFlash] = useState(false);
  const prevTimerLowRef = useRef(isTimerLow);

  // Flash when timer becomes low
  useEffect(() => {
    if (isTimerLow && !prevTimerLowRef.current) {
      setTimerFlash(true);
      const t = setTimeout(() => setTimerFlash(false), 800);
      return () => clearTimeout(t);
    }
    prevTimerLowRef.current = isTimerLow;
  }, [isTimerLow]);

  const clamped = clamp(emotion, 0, 100);

  // Determine vignette style based on emotion
  const vignetteStyle = useMemo(() => {
    // High emotion: golden glow, no darkness
    if (clamped > 80) {
      return {
        background: `radial-gradient(ellipse at center,
          transparent 50%,
          rgba(245, 158, 11, 0.08) 80%,
          rgba(245, 158, 11, 0.15) 100%)`,
        animation: undefined as string | undefined,
      };
    }

    // Normal (30-80): subtle dark vignette
    if (clamped >= 30) {
      return {
        background: `radial-gradient(ellipse at center,
          transparent 40%,
          rgba(0, 0, 0, 0.2) 80%,
          rgba(0, 0, 0, 0.45) 100%)`,
        animation: undefined as string | undefined,
      };
    }

    // Critical (<15): heavy red vignette with pulse
    if (clamped < 15) {
      return {
        background: `radial-gradient(ellipse at center,
          transparent 20%,
          rgba(127, 29, 29, 0.35) 60%,
          rgba(127, 29, 29, 0.65) 85%,
          rgba(80, 10, 10, 0.8) 100%)`,
        animation: "vfx-vignette-critical-pulse 1.5s ease-in-out infinite",
      };
    }

    // Low (<30): intensified reddish vignette
    const redIntensity = 1 - (clamped - 15) / 15; // 0..1 as emotion 30->15
    const r = Math.round(80 + redIntensity * 47);
    const alpha1 = (0.15 + redIntensity * 0.2).toFixed(2);
    const alpha2 = (0.35 + redIntensity * 0.25).toFixed(2);
    return {
      background: `radial-gradient(ellipse at center,
        transparent 30%,
        rgba(${r}, 20, 20, ${alpha1}) 70%,
        rgba(${r}, 10, 10, ${alpha2}) 100%)`,
      animation:
        clamped < 20
          ? "vfx-vignette-pulse 2.5s ease-in-out infinite"
          : undefined,
    };
  }, [clamped]);

  return (
    <>
      {/* Main vignette */}
      <div
        className="fixed inset-0 z-[60] pointer-events-none"
        style={{
          ...vignetteStyle,
          transition: "background 1s ease, opacity 1s ease",
        }}
      />

      {/* Timer flash overlay */}
      {timerFlash && (
        <div
          className="fixed inset-0 z-[61] pointer-events-none"
          style={{
            boxShadow: "inset 0 0 80px 20px rgba(249, 115, 22, 0.5)",
            animation: "vfx-edge-flash-orange 0.8s ease-out forwards",
          }}
        />
      )}
    </>
  );
};

// =================================================================
//  2. ScreenShake — Camera shake effect wrapper
// =================================================================

interface ScreenShakeProps {
  trigger: number;
  intensity: "light" | "medium" | "heavy";
  children: ReactNode;
}

const SHAKE_CONFIG = {
  light:  { animation: "vfx-shake-light",  duration: 200 },
  medium: { animation: "vfx-shake-medium", duration: 300 },
  heavy:  { animation: "vfx-shake-heavy",  duration: 500 },
} as const;

export const ScreenShake: FC<ScreenShakeProps> = ({
  trigger,
  intensity,
  children,
}) => {
  useVfxStyles();

  const [shaking, setShaking] = useState(false);
  const prevTriggerRef = useRef(trigger);

  useEffect(() => {
    if (trigger !== prevTriggerRef.current) {
      prevTriggerRef.current = trigger;
      setShaking(true);
      const cfg = SHAKE_CONFIG[intensity];
      const t = setTimeout(() => setShaking(false), cfg.duration);
      return () => clearTimeout(t);
    }
  }, [trigger, intensity]);

  const cfg = SHAKE_CONFIG[intensity];

  return (
    <div
      style={{
        animation: shaking
          ? `${cfg.animation} ${cfg.duration}ms ease-in-out`
          : undefined,
      }}
    >
      {children}
    </div>
  );
};

// =================================================================
//  3. ParticleExplosion — 2D particle burst for celebrations
// =================================================================

interface ParticleExplosionProps {
  trigger: number;
  type: "excellent" | "combo" | "achievement" | "ending-s";
  x?: number; // center X percentage (default 50)
  y?: number; // center Y percentage (default 50)
}

interface Particle {
  id: number;
  dx: number;
  dy: number;
  rot: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  animation: string;
  shape: "circle" | "square" | "star";
}

const CONFETTI_COLORS = [
  "#f97316", "#eab308", "#22c55e", "#3b82f6",
  "#a855f7", "#ef4444", "#ec4899", "#fbbf24",
];

function generateParticles(
  type: ParticleExplosionProps["type"],
  seed: number,
): Particle[] {
  const rng = seededRandom(seed);
  const particles: Particle[] = [];

  if (type === "excellent") {
    // 12 golden sparkles radiating outward
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + (rng() - 0.5) * 0.3;
      const dist = 60 + rng() * 80;
      particles.push({
        id: i,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        rot: rng() * 360,
        size: 4 + rng() * 4,
        color: rng() > 0.3 ? "#fbbf24" : "#f59e0b",
        delay: rng() * 0.1,
        duration: 0.8 + rng() * 0.4,
        animation: "vfx-particle-radiate",
        shape: "circle",
      });
    }
  } else if (type === "combo") {
    // 20 orange/yellow spiral particles
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const dist = 40 + rng() * 120;
      particles.push({
        id: i,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        rot: 180 + rng() * 360,
        size: 3 + rng() * 5,
        color: rng() > 0.5 ? "#f97316" : "#fbbf24",
        delay: i * 0.03,
        duration: 1.0 + rng() * 0.5,
        animation: "vfx-particle-spiral",
        shape: rng() > 0.5 ? "circle" : "square",
      });
    }
  } else if (type === "achievement") {
    // 30 confetti pieces falling down
    for (let i = 0; i < 30; i++) {
      particles.push({
        id: i,
        dx: (rng() - 0.5) * 200,
        dy: 100 + rng() * 200,
        rot: rng() * 720,
        size: 4 + rng() * 6,
        color: CONFETTI_COLORS[Math.floor(rng() * CONFETTI_COLORS.length)],
        delay: rng() * 0.3,
        duration: 1.5 + rng() * 0.5,
        animation: "vfx-confetti-fall",
        shape: rng() > 0.3 ? "square" : "circle",
      });
    }
  } else if (type === "ending-s") {
    // 50 golden particles exploding upward
    for (let i = 0; i < 50; i++) {
      const angle = (rng() - 0.5) * Math.PI * 1.5 - Math.PI / 2; // bias upward
      const dist = 80 + rng() * 200;
      particles.push({
        id: i,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        rot: rng() * 720,
        size: 3 + rng() * 5,
        color: rng() > 0.4 ? "#fbbf24" : "#f59e0b",
        delay: rng() * 0.2,
        duration: 2.0 + rng() * 1.0,
        animation: "vfx-particle-radiate",
        shape: "circle",
      });
    }
    // 20 star shapes
    for (let i = 0; i < 20; i++) {
      const angle = (rng() - 0.5) * Math.PI * 2;
      const dist = 60 + rng() * 180;
      particles.push({
        id: 50 + i,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 40, // bias upward
        rot: rng() * 540,
        size: 6 + rng() * 8,
        color: rng() > 0.5 ? "#fbbf24" : "#ffffff",
        delay: 0.1 + rng() * 0.3,
        duration: 2.0 + rng() * 1.0,
        animation: "vfx-star-explode",
        shape: "star",
      });
    }
  }

  return particles;
}

/** CSS clip-path for a 5-point star. */
const STAR_CLIP =
  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";

export const ParticleExplosion: FC<ParticleExplosionProps> = ({
  trigger,
  type,
  x = 50,
  y = 50,
}) => {
  useVfxStyles();

  const [bursts, setBursts] = useState<
    { id: number; particles: Particle[] }[]
  >([]);
  const prevTriggerRef = useRef(trigger);
  const burstIdRef = useRef(0);

  useEffect(() => {
    if (trigger !== prevTriggerRef.current) {
      prevTriggerRef.current = trigger;
      const id = ++burstIdRef.current;
      const particles = generateParticles(type, id * 7919);

      setBursts((prev) => [...prev, { id, particles }]);

      // Clean up after the longest animation
      const maxDur = type === "ending-s" ? 3500 : type === "achievement" ? 2500 : type === "combo" ? 2000 : 1500;
      const t = setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, maxDur);

      return () => clearTimeout(t);
    }
  }, [trigger, type]);

  if (bursts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none overflow-hidden">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          {burst.particles.map((p) => (
            <div
              key={p.id}
              className="absolute"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.shape === "circle" ? "50%" : p.shape === "square" ? "2px" : 0,
                clipPath: p.shape === "star" ? STAR_CLIP : undefined,
                boxShadow: `0 0 ${p.size}px ${p.color}60`,
                left: -p.size / 2,
                top: -p.size / 2,
                ["--vfx-dx" as string]: p.dx,
                ["--vfx-dy" as string]: p.dy,
                ["--vfx-rot" as string]: p.rot,
                animation: `${p.animation} ${p.duration}s ease-out ${p.delay}s forwards`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// =================================================================
//  4. DramaticOverlay — Visual novel style dramatic moment
// =================================================================

interface DramaticOverlayProps {
  type: "tension" | "success" | "failure" | "critical_moment" | "revelation";
  active: boolean;
}

export const DramaticOverlay: FC<DramaticOverlayProps> = ({
  type,
  active,
}) => {
  useVfxStyles();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      const durations: Record<DramaticOverlayProps["type"], number> = {
        tension: 1500,
        success: 1000,
        failure: 1200,
        critical_moment: 1500,
        revelation: 1500,
      };
      const t = setTimeout(() => setVisible(false), durations[type]);
      return () => clearTimeout(t);
    }
  }, [active, type]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[80] pointer-events-none overflow-hidden">
      {/* ── Tension ── */}
      {type === "tension" && (
        <>
          {/* Dark pulsing overlay with red tint */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center,
                rgba(0, 0, 0, 0.1) 30%,
                rgba(80, 10, 10, 0.3) 70%,
                rgba(60, 0, 0, 0.5) 100%)`,
              animation: "vfx-tension-pulse 1.5s ease-in-out",
            }}
          />
          {/* Focus lines radiating inward */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * 360;
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                  width: "2px",
                  height: "50vh",
                  background: `linear-gradient(to bottom, transparent, rgba(255, 60, 60, 0.15))`,
                  transformOrigin: "top center",
                  transform: `rotate(${angle}deg)`,
                  animation: "vfx-tension-pulse 1.5s ease-in-out",
                }}
              />
            );
          })}
        </>
      )}

      {/* ── Success ── */}
      {type === "success" && (
        <>
          {/* Green/gold radial gradient flash */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center,
                rgba(34, 197, 94, 0.25) 0%,
                rgba(245, 158, 11, 0.15) 40%,
                transparent 70%)`,
              animation: "vfx-success-flash 1s ease-out forwards",
            }}
          />
          {/* Expanding ring */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              border: "3px solid rgba(34, 197, 94, 0.6)",
              transform: "translate(-50%, -50%)",
              animation: "vfx-success-ring 1s ease-out forwards",
            }}
          />
        </>
      )}

      {/* ── Failure ── */}
      {type === "failure" && (
        <>
          {/* Red flash */}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(220, 38, 38, 0.25)",
              animation: "vfx-failure-flash 0.5s ease-out forwards",
            }}
          />
          {/* Crack-like dark lines from edges */}
          {Array.from({ length: 6 }, (_, i) => {
            const positions = [
              { left: 0, top: "20%", width: "30%", height: "2px", origin: "left center" },
              { right: 0, top: "35%", width: "25%", height: "2px", origin: "right center" },
              { left: 0, top: "60%", width: "35%", height: "1px", origin: "left center" },
              { right: 0, top: "75%", width: "20%", height: "2px", origin: "right center" },
              { left: "15%", top: 0, width: "1px", height: "25%", origin: "center top" },
              { right: "20%", top: 0, width: "2px", height: "30%", origin: "center top" },
            ];
            const pos = positions[i];
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  ...pos as React.CSSProperties,
                  background: "linear-gradient(to right, rgba(30, 0, 0, 0.6), transparent)",
                  animation: `vfx-failure-crack 1.2s ease-out ${i * 0.05}s forwards`,
                }}
              />
            );
          })}
        </>
      )}

      {/* ── Critical Moment ── */}
      {type === "critical_moment" && (
        <>
          {/* Spotlight: everything dims except center */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center,
                transparent 10%,
                rgba(0, 0, 0, 0.5) 35%,
                rgba(0, 0, 0, 0.75) 100%)`,
              animation: "vfx-spotlight-in 0.5s ease-out forwards",
            }}
          />
          {/* Speed lines from edges */}
          {Array.from({ length: 16 }, (_, i) => {
            const angle = (i / 16) * 360;
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                  width: "1px",
                  height: "60vh",
                  background: `linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.08) 60%, rgba(255, 255, 255, 0.2) 100%)`,
                  transformOrigin: "top center",
                  transform: `rotate(${angle}deg)`,
                  animation: `vfx-spotlight-in 0.3s ease-out ${i * 0.02}s forwards`,
                  opacity: 0,
                }}
              />
            );
          })}
        </>
      )}

      {/* ── Revelation ── */}
      {type === "revelation" && (
        <>
          {/* White flash fading to nothing */}
          <div
            className="absolute inset-0 bg-white"
            style={{
              animation: "vfx-revelation-flash 1.5s ease-out forwards",
            }}
          />
          {/* Golden glow from center */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)`,
              transform: "translate(-50%, -50%)",
              animation: "vfx-revelation-glow 1.5s ease-out forwards",
            }}
          />
          {/* Light rays from center */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * 360;
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                  width: "3px",
                  height: "45vh",
                  background: `linear-gradient(to bottom, rgba(245, 158, 11, 0.5), transparent)`,
                  transformOrigin: "top center",
                  ["--vfx-ray-angle" as string]: `${angle}deg`,
                  animation: `vfx-light-ray 1.5s ease-out forwards`,
                  transform: `rotate(${angle}deg)`,
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

// =================================================================
//  5. FocusLines — Manga-style speed/concentration lines
// =================================================================

interface FocusLinesProps {
  active: boolean;
  intensity: "subtle" | "normal" | "intense";
  color?: string;
}

const FOCUS_CONFIG = {
  subtle:  { count: 16, opacity: 0.03, animation: "none" },
  normal:  { count: 24, opacity: 0.08, animation: "vfx-focus-pulse-slow 3s ease-in-out infinite" },
  intense: { count: 32, opacity: 0.15, animation: "vfx-focus-pulse-fast 1.2s ease-in-out infinite" },
} as const;

export const FocusLines: FC<FocusLinesProps> = ({
  active,
  intensity,
  color = "white",
}) => {
  useVfxStyles();

  if (!active) return null;

  const cfg = FOCUS_CONFIG[intensity];

  return (
    <div className="fixed inset-0 z-[65] pointer-events-none overflow-hidden">
      {Array.from({ length: cfg.count }, (_, i) => {
        const angle = (i / cfg.count) * 360;
        // Vary line thickness slightly for organic feel
        const width = intensity === "intense" ? (i % 3 === 0 ? 2 : 1) : 1;
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              width: `${width}px`,
              height: "70vh",
              background: `linear-gradient(to bottom, transparent 0%, ${color} 60%, ${color} 100%)`,
              transformOrigin: "top center",
              transform: `rotate(${angle}deg)`,
              opacity: cfg.opacity,
              ["--vfx-line-opacity" as string]: cfg.opacity,
              ["--vfx-line-angle" as string]: `${angle}deg`,
              animation: cfg.animation === "none" ? undefined : cfg.animation,
            }}
          />
        );
      })}
    </div>
  );
};

// =================================================================
//  6. EmotionParticles — Floating ambient particles
// =================================================================

interface EmotionParticlesProps {
  emotion: number;  // 0-100
  active: boolean;
}

interface EmotionParticleData {
  id: number;
  startX: string;
  driftX: string;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
  glow: boolean;
  animation: string;
}

function buildEmotionParticles(emotion: number, seed: number): EmotionParticleData[] {
  const rng = seededRandom(seed);
  const clamped = clamp(emotion, 0, 100);
  const count = 8 + Math.round(rng() * 7); // 8-15 particles
  const particles: EmotionParticleData[] = [];

  for (let i = 0; i < count; i++) {
    const startX = `${rng() * 100}vw`;
    const driftX = `${(rng() - 0.5) * 60}px`;
    const duration = 3 + rng() * 5; // 3-8s
    const delay = rng() * duration; // stagger so they do not all start at once

    let color: string;
    let opacity: number;
    let glow: boolean;
    let animation: string;
    let size: number;

    if (clamped <= 30) {
      // Dark/grey, slow downward drift (ashes)
      color = rng() > 0.5 ? "#6b7280" : "#4b5563";
      opacity = 0.25 + rng() * 0.15;
      glow = false;
      animation = "vfx-float-down";
      size = 3 + rng() * 3;
    } else if (clamped <= 60) {
      // Neutral white, gentle float
      color = "#d1d5db";
      opacity = 0.2 + rng() * 0.15;
      glow = false;
      animation = "vfx-float-neutral";
      size = 2 + rng() * 3;
    } else if (clamped <= 80) {
      // Warm golden, upward drift
      color = rng() > 0.4 ? "#fbbf24" : "#f59e0b";
      opacity = 0.3 + rng() * 0.2;
      glow = true;
      animation = "vfx-float-up";
      size = 3 + rng() * 3;
    } else {
      // Bright sparkle with glow, upward + sway
      color = rng() > 0.3 ? "#fbbf24" : "#ffffff";
      opacity = 0.4 + rng() * 0.3;
      glow = true;
      animation = "vfx-sparkle-float";
      size = 3 + rng() * 5;
    }

    particles.push({
      id: i,
      startX,
      driftX,
      size,
      opacity,
      duration,
      delay,
      color,
      glow,
      animation,
    });
  }

  return particles;
}

export const EmotionParticles: FC<EmotionParticlesProps> = ({
  emotion,
  active,
}) => {
  useVfxStyles();

  // Regenerate particles when the emotion band changes, not on every value
  const band = useMemo(() => {
    if (emotion <= 30) return 0;
    if (emotion <= 60) return 1;
    if (emotion <= 80) return 2;
    return 3;
  }, [emotion]);

  const seedRef = useRef(Date.now());

  // Change seed when band changes for fresh particles
  useEffect(() => {
    seedRef.current = Date.now();
  }, [band]);

  const particles = useMemo(
    () => buildEmotionParticles(emotion, seedRef.current),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [band],
  );

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[55] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: p.glow ? `0 0 ${p.size * 2}px ${p.color}80` : undefined,
            ["--vfx-start-x" as string]: p.startX,
            ["--vfx-drift-x" as string]: p.driftX,
            ["--vfx-p-opacity" as string]: p.opacity,
            animation: `${p.animation} ${p.duration}s linear ${p.delay}s infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
};

// =================================================================
//  7. TimerPressureOverlay — Edge pulse on timer pressure
// =================================================================

interface TimerPressureOverlayProps {
  remaining: number; // seconds remaining
  total: number;     // total seconds
}

export const TimerPressureOverlay: FC<TimerPressureOverlayProps> = ({
  remaining,
  total,
}) => {
  useVfxStyles();

  if (total <= 0) return null;

  const pct = remaining / total;

  // Invisible when > 50%
  if (pct > 0.5) return null;

  let borderColor: string;
  let animation: string;
  let extraDarken = false;
  let showCornerFlash = false;

  if (pct <= 0.05) {
    // <5%: Full red glow + screen darkens
    borderColor = "rgba(220, 38, 38, 0.8)";
    animation = "vfx-border-pulse-critical 0.5s ease-in-out infinite";
    extraDarken = true;
    showCornerFlash = true;
  } else if (pct <= 0.15) {
    // <15%: Red rapid pulse + corner flashes
    borderColor = "rgba(220, 38, 38, 0.6)";
    animation = "vfx-border-pulse-fast 0.5s ease-in-out infinite";
    showCornerFlash = true;
  } else if (pct <= 0.33) {
    // 15-33%: Orange pulse intensifies
    borderColor = "rgba(249, 115, 22, 0.5)";
    animation = "vfx-border-pulse-medium 1s ease-in-out infinite";
  } else {
    // 33-50%: Very subtle orange pulse
    borderColor = "rgba(249, 115, 22, 0.3)";
    animation = "vfx-border-pulse-slow 2s ease-in-out infinite";
  }

  return (
    <div className="fixed inset-0 z-[62] pointer-events-none">
      {/* Border glow */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: `inset 0 0 30px 8px ${borderColor}`,
          animation,
        }}
      />

      {/* Extra screen darkening at critical */}
      {extraDarken && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center,
              transparent 40%,
              rgba(0, 0, 0, 0.15) 100%)`,
          }}
        />
      )}

      {/* Corner flashes */}
      {showCornerFlash && (
        <>
          {/* Top-left */}
          <div
            className="absolute top-0 left-0 w-16 h-16"
            style={{
              background: `radial-gradient(circle at 0% 0%, ${borderColor}, transparent 70%)`,
              animation: "vfx-corner-flash 0.5s ease-in-out infinite",
            }}
          />
          {/* Top-right */}
          <div
            className="absolute top-0 right-0 w-16 h-16"
            style={{
              background: `radial-gradient(circle at 100% 0%, ${borderColor}, transparent 70%)`,
              animation: "vfx-corner-flash 0.5s ease-in-out 0.25s infinite",
            }}
          />
          {/* Bottom-left */}
          <div
            className="absolute bottom-0 left-0 w-16 h-16"
            style={{
              background: `radial-gradient(circle at 0% 100%, ${borderColor}, transparent 70%)`,
              animation: "vfx-corner-flash 0.5s ease-in-out 0.125s infinite",
            }}
          />
          {/* Bottom-right */}
          <div
            className="absolute bottom-0 right-0 w-16 h-16"
            style={{
              background: `radial-gradient(circle at 100% 100%, ${borderColor}, transparent 70%)`,
              animation: "vfx-corner-flash 0.5s ease-in-out 0.375s infinite",
            }}
          />
        </>
      )}
    </div>
  );
};

// =================================================================
//  8. TransitionWipe — Scene transition effect
// =================================================================

interface TransitionWipeProps {
  active: boolean;
  direction: "left" | "right" | "center";
  color?: string;
  onComplete?: () => void;
}

export const TransitionWipe: FC<TransitionWipeProps> = ({
  active,
  direction,
  color = "#000000",
  onComplete,
}) => {
  useVfxStyles();

  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");
  const prevActiveRef = useRef(active);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (active && !prevActiveRef.current) {
      prevActiveRef.current = true;
      setPhase("in");

      // At midpoint, call onComplete and start phase out
      const midpoint = setTimeout(() => {
        onCompleteRef.current?.();
        setPhase("out");
      }, 750);

      // After full animation, reset
      const end = setTimeout(() => {
        setPhase("idle");
        prevActiveRef.current = false;
      }, 1500);

      return () => {
        clearTimeout(midpoint);
        clearTimeout(end);
      };
    }
    if (!active) {
      prevActiveRef.current = false;
    }
  }, [active]);

  if (phase === "idle") return null;

  const animDuration = "0.75s";

  // For left/right wipe
  if (direction === "left" || direction === "right") {
    const animIn = direction === "left" ? "vfx-wipe-left-in" : "vfx-wipe-right-in";
    const animOut = direction === "left" ? "vfx-wipe-left-out" : "vfx-wipe-right-out";

    return (
      <div className="fixed inset-0 z-[100] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: color,
            animation:
              phase === "in"
                ? `${animIn} ${animDuration} ease-in-out forwards`
                : `${animOut} ${animDuration} ease-in-out forwards`,
          }}
        />
      </div>
    );
  }

  // Center circle wipe
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: color,
          animation:
            phase === "in"
              ? `vfx-wipe-circle-in ${animDuration} ease-in-out forwards`
              : `vfx-wipe-circle-out ${animDuration} ease-in-out forwards`,
        }}
      />
    </div>
  );
};

// =================================================================
//  9. ComboFlame — Fire/lightning effect behind combo counter
// =================================================================

interface ComboFlameProps {
  combo: number;
  position: { x: number; y: number };
}

export const ComboFlame: FC<ComboFlameProps> = ({ combo, position }) => {
  useVfxStyles();

  if (combo < 3) return null;

  const showFlame = combo >= 3;
  const showLightning = combo >= 5;
  const showBoth = combo >= 7;

  return (
    <div
      className="fixed z-[68] pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* ── Flame effect ── */}
      {showFlame && (
        <div className="absolute" style={{ left: "-30px", top: "-40px", width: "60px", height: "60px" }}>
          {/* Flame tongues via clip-path */}
          {Array.from({ length: 4 }, (_, i) => {
            const offsets = [
              { left: "10px", bottom: "0px", width: "14px", height: "36px" },
              { left: "22px", bottom: "0px", width: "16px", height: "44px" },
              { left: "34px", bottom: "0px", width: "12px", height: "30px" },
              { left: "16px", bottom: "0px", width: "10px", height: "26px" },
            ];
            const colors = [
              "linear-gradient(to top, #f97316, #fbbf24, transparent)",
              "linear-gradient(to top, #ef4444, #f97316, transparent)",
              "linear-gradient(to top, #f97316, #fbbf24, transparent)",
              "linear-gradient(to top, #dc2626, #f97316, transparent)",
            ];
            const pos = offsets[i];
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  ...pos,
                  background: colors[i],
                  borderRadius: "50% 50% 20% 20%",
                  clipPath: "ellipse(50% 50% at 50% 100%)",
                  animation: `vfx-flame-flicker ${0.6 + i * 0.15}s ease-in-out ${i * 0.1}s infinite`,
                  opacity: showBoth ? 0.9 : 0.8,
                  filter: "blur(1px)",
                }}
              />
            );
          })}
        </div>
      )}

      {/* ── Lightning effect ── */}
      {showLightning && (
        <div className="absolute" style={{ left: "-35px", top: "-35px", width: "70px", height: "70px" }}>
          {/* Lightning bolts as thin lines */}
          {Array.from({ length: 4 }, (_, i) => {
            const angles = [30, 120, 210, 300];
            const lengths = [28, 35, 25, 32];
            return (
              <div
                key={`l-${i}`}
                className="absolute"
                style={{
                  left: "35px",
                  top: "35px",
                  width: "2px",
                  height: `${lengths[i]}px`,
                  background: `linear-gradient(to bottom, #38bdf8, #818cf8, transparent)`,
                  transformOrigin: "top center",
                  transform: `rotate(${angles[i]}deg)`,
                  animation: `vfx-lightning-crackle ${0.3 + i * 0.1}s linear ${i * 0.07}s infinite`,
                  boxShadow: "0 0 6px #38bdf8, 0 0 12px #6366f1",
                  filter: "blur(0.5px)",
                }}
              />
            );
          })}
          {/* Central glow */}
          <div
            className="absolute rounded-full"
            style={{
              left: "25px",
              top: "25px",
              width: "20px",
              height: "20px",
              background: "radial-gradient(circle, rgba(56, 189, 248, 0.3), transparent)",
              animation: "vfx-lightning-crackle 0.4s linear infinite",
            }}
          />
        </div>
      )}
    </div>
  );
};

// =================================================================
//  10. IntroLetterbox — Cinematic letterbox bars
// =================================================================

interface IntroLetterboxProps {
  active: boolean;
}

export const IntroLetterbox: FC<IntroLetterboxProps> = ({ active }) => {
  useVfxStyles();

  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const prevActiveRef = useRef(active);

  useEffect(() => {
    if (active && !prevActiveRef.current) {
      // Entering
      setVisible(true);
      setPhase("in");
    } else if (!active && prevActiveRef.current) {
      // Exiting
      setPhase("out");
      const t = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(t);
    }
    prevActiveRef.current = active;
  }, [active]);

  if (!visible) return null;

  const barHeight = "12vh";

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none">
      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 bg-black"
        style={{
          height: barHeight,
          animation:
            phase === "in"
              ? "vfx-letterbox-in-top 0.8s ease-out forwards"
              : "vfx-letterbox-out-top 0.5s ease-in forwards",
        }}
      />
      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-black"
        style={{
          height: barHeight,
          animation:
            phase === "in"
              ? "vfx-letterbox-in-bottom 0.8s ease-out forwards"
              : "vfx-letterbox-out-bottom 0.5s ease-in forwards",
        }}
      />
    </div>
  );
};

// =================================================================
//  11. WeatherOverlay — 天候エフェクト
// =================================================================

interface WeatherOverlayProps {
  type: "rain" | "snow" | "cherry_blossoms" | "fog" | "thunder" | "sparkle_rain";
  intensity: "light" | "normal" | "heavy";
  active: boolean;
}

const WEATHER_PARTICLE_COUNT = {
  rain:            { light: 40, normal: 60, heavy: 80 },
  snow:            { light: 20, normal: 35, heavy: 50 },
  cherry_blossoms: { light: 15, normal: 22, heavy: 30 },
  fog:             { light: 1,  normal: 1,  heavy: 1 },
  thunder:         { light: 1,  normal: 1,  heavy: 1 },
  sparkle_rain:    { light: 30, normal: 45, heavy: 60 },
} as const;

interface WeatherParticle {
  id: number;
  startX: string;
  driftX: string;
  opacity: number;
  size: number;
  length: number;
  duration: number;
  delay: number;
}

function buildWeatherParticles(
  type: WeatherOverlayProps["type"],
  intensity: WeatherOverlayProps["intensity"],
  seed: number,
): WeatherParticle[] {
  const rng = seededRandom(seed);
  const count = WEATHER_PARTICLE_COUNT[type][intensity];
  const particles: WeatherParticle[] = [];

  for (let i = 0; i < count; i++) {
    const startX = `${rng() * 110 - 5}vw`;
    const driftX = `${(rng() - 0.5) * 40}px`;
    let opacity: number;
    let size: number;
    let length: number;
    let duration: number;
    let delay: number;

    switch (type) {
      case "rain":
        opacity = 0.4 + rng() * 0.3;
        size = 1 + rng() * 1; // 1-2px width
        length = 30 + rng() * 50; // 30-80px
        duration = 0.6 + rng() * 0.6;
        delay = rng() * 2;
        break;
      case "snow":
        opacity = 0.5 + rng() * 0.3;
        size = 3 + rng() * 3; // 3-6px
        length = size;
        duration = 4 + rng() * 4;
        delay = rng() * 4;
        break;
      case "cherry_blossoms":
        opacity = 0.5 + rng() * 0.3;
        size = 4 + rng() * 4; // 4-8px
        length = size;
        duration = 5 + rng() * 5;
        delay = rng() * 5;
        break;
      case "sparkle_rain":
        opacity = 0.5 + rng() * 0.4;
        size = 3 + rng() * 3;
        length = size;
        duration = 2 + rng() * 3;
        delay = rng() * 3;
        break;
      default:
        opacity = 0.5;
        size = 4;
        length = 4;
        duration = 3;
        delay = 0;
    }

    particles.push({ id: i, startX, driftX, opacity, size, length, duration, delay });
  }
  return particles;
}

export const WeatherOverlay: FC<WeatherOverlayProps> = ({
  type,
  intensity,
  active,
}) => {
  useVfxStyles();

  const seedRef = useRef(42);
  const particles = useMemo(
    () => buildWeatherParticles(type, intensity, seedRef.current),
    [type, intensity],
  );

  // Thunder: flash + auto-retrigger
  const [thunderFlash, setThunderFlash] = useState(false);
  useEffect(() => {
    if (!active || type !== "thunder") return;
    let timer: ReturnType<typeof setTimeout>;
    const flash = () => {
      setThunderFlash(true);
      setTimeout(() => setThunderFlash(false), 300);
      const intervalBase = intensity === "heavy" ? 1500 : intensity === "normal" ? 3000 : 5000;
      timer = setTimeout(flash, intervalBase + Math.random() * 2000);
    };
    flash();
    return () => {
      clearTimeout(timer);
      setThunderFlash(false);
    };
  }, [active, type, intensity]);

  if (!active) return null;

  // ── Fog ──
  if (type === "fog") {
    const fogOpacity =
      intensity === "heavy" ? 0.3 : intensity === "normal" ? 0.2 : 0.1;
    return (
      <div className="fixed inset-0 z-[56] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              180deg,
              rgba(255,255,255,${fogOpacity}) 0%,
              rgba(255,255,255,${fogOpacity * 0.4}) 40%,
              transparent 70%,
              rgba(255,255,255,${fogOpacity * 0.6}) 100%
            )`,
            animation: "vfx-fog-shift 8s ease-in-out infinite",
          }}
        />
      </div>
    );
  }

  // ── Thunder ──
  if (type === "thunder") {
    return (
      <div className="fixed inset-0 z-[56] pointer-events-none">
        {thunderFlash && (
          <div
            className="absolute inset-0 bg-white"
            style={{
              animation: "vfx-thunder-flash 0.3s ease-out forwards",
            }}
          />
        )}
      </div>
    );
  }

  // ── Rain ──
  if (type === "rain") {
    return (
      <div className="fixed inset-0 z-[56] pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute"
            style={{
              width: `${p.size}px`,
              height: `${p.length}px`,
              background: `linear-gradient(to bottom, transparent, #60a5fa)`,
              borderRadius: "1px",
              ["--vfx-start-x" as string]: p.startX,
              ["--vfx-p-opacity" as string]: p.opacity,
              animation: `vfx-rain-fall ${p.duration}s linear ${p.delay}s infinite`,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>
    );
  }

  // ── Snow ──
  if (type === "snow") {
    return (
      <div className="fixed inset-0 z-[56] pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: "#ffffff",
              ["--vfx-start-x" as string]: p.startX,
              ["--vfx-drift-x" as string]: p.driftX,
              ["--vfx-p-opacity" as string]: p.opacity,
              animation: `vfx-snow-fall ${p.duration}s linear ${p.delay}s infinite`,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>
    );
  }

  // ── Cherry Blossoms ──
  if (type === "cherry_blossoms") {
    return (
      <div className="fixed inset-0 z-[56] pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: "#f9a8d4",
              transform: "rotate(45deg)",
              borderRadius: "2px",
              ["--vfx-start-x" as string]: p.startX,
              ["--vfx-drift-x" as string]: p.driftX,
              ["--vfx-p-opacity" as string]: p.opacity,
              animation: `vfx-petal-fall ${p.duration}s linear ${p.delay}s infinite`,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>
    );
  }

  // ── Sparkle Rain ──
  return (
    <div className="fixed inset-0 z-[56] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: "#fbbf24",
            boxShadow: `0 0 ${p.size * 2}px #fbbf2480, 0 0 ${p.size * 4}px #fbbf2440`,
            ["--vfx-start-x" as string]: p.startX,
            ["--vfx-drift-x" as string]: p.driftX,
            ["--vfx-p-opacity" as string]: p.opacity,
            animation: `vfx-sparkle-rain-fall ${p.duration}s linear ${p.delay}s infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
};

// =================================================================
//  12. GlitchEffect — デジタルグリッチ
// =================================================================

interface GlitchEffectProps {
  active: boolean;
  intensity: "subtle" | "medium" | "heavy";
}

const GLITCH_CONFIG = {
  subtle: { slices: 3, maxOffset: 4, scanlines: 1 },
  medium: { slices: 5, maxOffset: 8, scanlines: 2 },
  heavy:  { slices: 8, maxOffset: 15, scanlines: 3 },
} as const;

export const GlitchEffect: FC<GlitchEffectProps> = ({ active, intensity }) => {
  useVfxStyles();

  const [glitching, setGlitching] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seedRef = useRef(0);

  // Auto-trigger: glitch for 300-500ms, pause 2-4s
  useEffect(() => {
    if (!active) {
      setGlitching(false);
      if (intervalRef.current) clearTimeout(intervalRef.current);
      return;
    }

    const cycle = () => {
      seedRef.current = Date.now();
      setGlitching(true);
      const dur = 300 + Math.random() * 200;
      const pauseTimer = setTimeout(() => {
        setGlitching(false);
        const pause = 2000 + Math.random() * 2000;
        intervalRef.current = setTimeout(cycle, pause);
      }, dur);
      intervalRef.current = pauseTimer;
    };

    cycle();
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [active]);

  if (!glitching) return null;

  const cfg = GLITCH_CONFIG[intensity];
  const rng = seededRandom(seedRef.current);

  // Build slices
  const slices = Array.from({ length: cfg.slices }, (_, i) => {
    const segHeight = 100 / cfg.slices;
    const top = `${(i * segHeight).toFixed(1)}%`;
    const bottom = `${(100 - (i + 1) * segHeight).toFixed(1)}%`;
    const offset = ((rng() - 0.5) * 2 * cfg.maxOffset).toFixed(1);
    const hasTint = rng() > 0.6;
    const tintColor = rng() > 0.5 ? "rgba(239,68,68,0.15)" : "rgba(34,211,238,0.15)";
    return { id: i, top, bottom, offset, hasTint, tintColor };
  });

  // Build scanlines
  const scanlines = Array.from({ length: cfg.scanlines }, (_, i) => ({
    id: i,
    delay: (rng() * 0.3).toFixed(2),
    duration: (0.15 + rng() * 0.15).toFixed(2),
  }));

  return (
    <div className="fixed inset-0 z-[85] pointer-events-none overflow-hidden">
      {/* Glitch slices */}
      {slices.map((s) => (
        <div
          key={s.id}
          className="absolute inset-0"
          style={{
            ["--vfx-slice-top" as string]: s.top,
            ["--vfx-slice-bottom" as string]: s.bottom,
            ["--vfx-glitch-offset" as string]: `${s.offset}px`,
            clipPath: `inset(${s.top} 0 ${s.bottom} 0)`,
            transform: `translateX(${s.offset}px)`,
            animation: `vfx-glitch-slice 0.4s steps(4) infinite`,
            background: s.hasTint ? s.tintColor : undefined,
          }}
        />
      ))}

      {/* Scanlines */}
      {scanlines.map((sl) => (
        <div
          key={`sl-${sl.id}`}
          className="absolute left-0 right-0"
          style={{
            height: "2px",
            top: "-2px",
            background: "rgba(255, 255, 255, 0.15)",
            animation: `vfx-glitch-scanline ${sl.duration}s linear ${sl.delay}s infinite`,
          }}
        />
      ))}

      {/* Color shift layer */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, rgba(239,68,68,0.08), transparent 30%, transparent 70%, rgba(34,211,238,0.08))",
          animation: "vfx-glitch-color-shift 0.4s steps(3) infinite",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
};

// =================================================================
//  13. FloatingTextPopup — フローティングテキスト
// =================================================================

interface FloatingTextPopupProps {
  trigger: number;
  text: string;
  type: "damage" | "heal" | "bonus" | "critical" | "miss";
  x?: number; // percentage 0-100
  y?: number; // percentage 0-100
}

interface ActiveText {
  id: number;
  text: string;
  type: FloatingTextPopupProps["type"];
  x: number;
  y: number;
  createdAt: number;
}

const TEXT_TYPE_STYLES: Record<
  FloatingTextPopupProps["type"],
  { color: string; fontSize: string; fontWeight: number; animation: string; duration: number; glow?: string }
> = {
  damage: {
    color: "#ef4444",
    fontSize: "1.25rem",
    fontWeight: 700,
    animation: "vfx-text-float-up 1.5s ease-out forwards",
    duration: 1500,
  },
  heal: {
    color: "#22c55e",
    fontSize: "1.125rem",
    fontWeight: 600,
    animation: "vfx-text-float-up 1.5s ease-out forwards",
    duration: 1500,
  },
  bonus: {
    color: "#f97316",
    fontSize: "1.25rem",
    fontWeight: 700,
    animation: "vfx-text-float-up 1.5s ease-out forwards",
    duration: 1500,
    glow: "0 0 8px #f9731680, 0 0 16px #f9731640",
  },
  critical: {
    color: "#fbbf24",
    fontSize: "1.75rem",
    fontWeight: 800,
    animation: "vfx-text-critical 1.5s ease-out forwards",
    duration: 1500,
    glow: "0 0 12px #fbbf2480, 0 0 24px #fbbf2440",
  },
  miss: {
    color: "#9ca3af",
    fontSize: "0.95rem",
    fontWeight: 400,
    animation: "vfx-text-miss 1.2s ease-out forwards",
    duration: 1200,
  },
};

export const FloatingTextPopup: FC<FloatingTextPopupProps> = ({
  trigger,
  text,
  type,
  x = 50,
  y = 50,
}) => {
  useVfxStyles();

  const [activeTexts, setActiveTexts] = useState<ActiveText[]>([]);
  const prevTriggerRef = useRef(trigger);
  const idRef = useRef(0);

  useEffect(() => {
    if (trigger !== prevTriggerRef.current) {
      prevTriggerRef.current = trigger;
      const id = ++idRef.current;
      const now = Date.now();
      const entry: ActiveText = { id, text, type, x, y, createdAt: now };
      setActiveTexts((prev) => [...prev, entry]);

      const style = TEXT_TYPE_STYLES[type];
      const t = setTimeout(() => {
        setActiveTexts((prev) => prev.filter((at) => at.id !== id));
      }, style.duration);
      return () => clearTimeout(t);
    }
  }, [trigger, text, type, x, y]);

  if (activeTexts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[75] pointer-events-none overflow-hidden">
      {activeTexts.map((at) => {
        const style = TEXT_TYPE_STYLES[at.type];
        return (
          <div
            key={at.id}
            className="absolute"
            style={{
              left: `${at.x}%`,
              top: `${at.y}%`,
              color: style.color,
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              textShadow: style.glow ?? `0 1px 3px rgba(0,0,0,0.5)`,
              animation: style.animation,
              whiteSpace: "nowrap",
              fontFamily: "system-ui, sans-serif",
              letterSpacing: at.type === "critical" ? "0.05em" : undefined,
            }}
          >
            {at.text}
          </div>
        );
      })}
    </div>
  );
};

// =================================================================
//  14. EnergyWave — エネルギー波動
// =================================================================

interface EnergyWaveProps {
  trigger: number;
  color?: string;
}

interface WaveBurst {
  id: number;
}

export const EnergyWave: FC<EnergyWaveProps> = ({
  trigger,
  color = "#f97316",
}) => {
  useVfxStyles();

  const [bursts, setBursts] = useState<WaveBurst[]>([]);
  const prevTriggerRef = useRef(trigger);
  const idRef = useRef(0);

  useEffect(() => {
    if (trigger !== prevTriggerRef.current) {
      prevTriggerRef.current = trigger;
      const id = ++idRef.current;
      setBursts((prev) => [...prev, { id }]);
      const t = setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [trigger]);

  if (bursts.length === 0) return null;

  const rings = [0, 1, 2];
  const ringScale = 15; // scale factor: 20px * 15 = 300px

  return (
    <div className="fixed inset-0 z-[72] pointer-events-none overflow-hidden">
      {bursts.map((burst) => (
        <div key={burst.id}>
          {rings.map((i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: "50%",
                top: "50%",
                width: "20px",
                height: "20px",
                border: `3px solid ${color}`,
                ["--vfx-ring-scale" as string]: ringScale,
                animation: `vfx-energy-ring 1s ease-out ${i * 0.1}s forwards`,
                boxShadow: `0 0 10px ${color}60, inset 0 0 10px ${color}30`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// =================================================================
//  15. CharacterEmote — キャラクター感情表現
// =================================================================

interface CharacterEmoteProps {
  emote: "surprise" | "anger" | "happy" | "confused" | "impressed" | "thinking" | "sweat" | "sparkle";
  active: boolean;
  position?: { x: number; y: number };
}

export const CharacterEmote: FC<CharacterEmoteProps> = ({
  emote,
  active,
  position = { x: 70, y: 25 },
}) => {
  useVfxStyles();

  const [visible, setVisible] = useState(false);
  const prevActiveRef = useRef(active);

  useEffect(() => {
    if (active && !prevActiveRef.current) {
      setVisible(true);
      const dur = emote === "thinking" ? 2500 : 2000;
      const t = setTimeout(() => setVisible(false), dur);
      prevActiveRef.current = true;
      return () => clearTimeout(t);
    }
    if (!active) {
      prevActiveRef.current = false;
    }
  }, [active, emote]);

  if (!visible) return null;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: `${position.x}%`,
    top: `${position.y}%`,
    transform: "translate(-50%, -50%)",
    fontFamily: "system-ui, sans-serif",
  };

  // ── Surprise: "!" bouncing ──
  if (emote === "surprise") {
    return (
      <div className="fixed inset-0 z-[76] pointer-events-none">
        <div
          style={{
            ...baseStyle,
            color: "#fbbf24",
            fontSize: "2.5rem",
            fontWeight: 900,
            textShadow: "0 0 12px #fbbf2480",
            animation: "vfx-emote-bounce 1.5s ease-out forwards",
          }}
        >
          !
        </div>
      </div>
    );
  }

  // ── Anger: "#" shaking ──
  if (emote === "anger") {
    return (
      <div className="fixed inset-0 z-[76] pointer-events-none">
        <div
          style={{
            ...baseStyle,
            color: "#ef4444",
            fontSize: "2rem",
            fontWeight: 900,
            textShadow: "0 0 8px #ef444480",
            animation: "vfx-shake-light 0.15s linear infinite, vfx-emote-bounce 2s ease-out forwards",
          }}
        >
          #
        </div>
      </div>
    );
  }

  // ── Happy: musical notes floating ──
  if (emote === "happy") {
    const notes = ["♪", "♫", "♪"];
    return (
      <div className="fixed inset-0 z-[76] pointer-events-none">
        {notes.map((note, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${position.x}%`,
              top: `${position.y}%`,
              color: "#fbbf24",
              fontSize: "1.5rem",
              fontWeight: 700,
              textShadow: "0 0 6px #fbbf2460",
              ["--vfx-note-x" as string]: `${(i - 1) * 15}px`,
              ["--vfx-drift-x" as string]: `${(i - 1) * 8}px`,
              animation: `vfx-emote-note-float 2s ease-out ${i * 0.25}s forwards`,
              opacity: 0,
            }}
          >
            {note}
          </div>
        ))}
      </div>
    );
  }

  // ── Confused: "?" spinning ──
  if (emote === "confused") {
    return (
      <div className="fixed inset-0 z-[76] pointer-events-none">
        <div
          style={{
            ...baseStyle,
            color: "#9ca3af",
            fontSize: "2rem",
            fontWeight: 700,
            animation: "vfx-emote-spin 2s ease-out forwards",
          }}
        >
          ?
        </div>
      </div>
    );
  }

  // ── Impressed: stars orbiting ──
  if (emote === "impressed") {
    const starCount = 5;
    return (
      <div className="fixed inset-0 z-[76] pointer-events-none">
        <div style={{ ...baseStyle, width: 0, height: 0 }}>
          {Array.from({ length: starCount }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                color: "#fbbf24",
                fontSize: "0.875rem",
                ["--vfx-orbit-r" as string]: "24px",
                animation: `vfx-emote-star-orbit 2s ease-out ${i * 0.15}s forwards`,
                opacity: 0,
              }}
            >
              ★
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Thinking: "..." dots appearing one by one ──
  if (emote === "thinking") {
    return (
      <div className="fixed inset-0 z-[76] pointer-events-none">
        <div
          style={{
            ...baseStyle,
            display: "flex",
            gap: "4px",
            animation: "vfx-emote-bounce 2.5s ease-out forwards",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#9ca3af",
                animation: `vfx-emote-dot-appear-${i + 1} 1.5s ease-out forwards`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Sweat: blue teardrop sliding down ──
  if (emote === "sweat") {
    return (
      <div className="fixed inset-0 z-[76] pointer-events-none">
        <div
          style={{
            ...baseStyle,
            width: "10px",
            height: "14px",
            background: "linear-gradient(to bottom, #60a5fa, #3b82f6)",
            borderRadius: "50% 50% 50% 50% / 30% 30% 70% 70%",
            animation: "vfx-emote-sweat-drop 1.5s ease-in forwards",
            boxShadow: "0 0 6px #60a5fa60",
          }}
        />
      </div>
    );
  }

  // ── Sparkle: crosses appearing in sequence ──
  const sparkles = [
    { x: "-15px", y: "-15px" },
    { x: "15px",  y: "-10px" },
    { x: "-10px", y: "15px" },
    { x: "12px",  y: "12px" },
  ];

  return (
    <div className="fixed inset-0 z-[76] pointer-events-none">
      <div style={{ ...baseStyle, width: 0, height: 0 }}>
        {sparkles.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              color: "#fbbf24",
              fontSize: "1.25rem",
              textShadow: "0 0 8px #fbbf2480",
              ["--vfx-spark-x" as string]: s.x,
              ["--vfx-spark-y" as string]: s.y,
              animation: `vfx-emote-sparkle-pulse 1.5s ease-out ${i * 0.2}s forwards`,
              opacity: 0,
            }}
          >
            ✦
          </div>
        ))}
      </div>
    </div>
  );
};

// =================================================================
//  16. AuraEffect — オーラエフェクト
// =================================================================

interface AuraEffectProps {
  type: "power" | "calm" | "danger" | "golden" | "ice";
  active: boolean;
}

const AURA_STYLES: Record<
  AuraEffectProps["type"],
  {
    background: string;
    animation: string;
    minOpacity: number;
    maxOpacity: number;
    extra?: React.CSSProperties;
  }
> = {
  power: {
    background: `radial-gradient(circle at center, rgba(249,115,22,0.15) 0%, rgba(239,68,68,0.1) 40%, transparent 70%)`,
    animation: "vfx-aura-pulse 2s ease-in-out infinite",
    minOpacity: 0.05,
    maxOpacity: 0.15,
  },
  calm: {
    background: `radial-gradient(ellipse at center,
      transparent 30%,
      rgba(59,130,246,0.08) 60%,
      rgba(34,197,94,0.06) 80%,
      rgba(59,130,246,0.1) 100%)`,
    animation: "vfx-aura-breathe 3s ease-in-out infinite",
    minOpacity: 0.04,
    maxOpacity: 0.12,
  },
  danger: {
    background: `radial-gradient(ellipse at center,
      transparent 20%,
      rgba(127,29,29,0.2) 50%,
      rgba(127,29,29,0.35) 80%,
      rgba(80,10,10,0.45) 100%)`,
    animation: "vfx-aura-danger-pulse 0.5s ease-in-out infinite",
    minOpacity: 0.1,
    maxOpacity: 0.35,
  },
  golden: {
    background: `linear-gradient(135deg,
      rgba(251,191,36,0.08) 0%,
      rgba(245,158,11,0.12) 25%,
      rgba(251,191,36,0.06) 50%,
      rgba(245,158,11,0.1) 75%,
      rgba(251,191,36,0.08) 100%)`,
    animation: "vfx-aura-shimmer 4s ease-in-out infinite",
    minOpacity: 0.06,
    maxOpacity: 0.14,
    extra: { backgroundSize: "200% 200%" },
  },
  ice: {
    background: "transparent",
    animation: "vfx-aura-breathe 3s ease-in-out infinite",
    minOpacity: 0.05,
    maxOpacity: 0.15,
    extra: {
      boxShadow: `inset 0 0 80px 30px rgba(147,197,253,0.12),
        inset 0 0 120px 60px rgba(147,197,253,0.06)`,
    },
  },
};

export const AuraEffect: FC<AuraEffectProps> = ({ type, active }) => {
  useVfxStyles();

  if (!active) return null;

  const cfg = AURA_STYLES[type];

  return (
    <div className="fixed inset-0 z-[57] pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background: cfg.background,
          ["--vfx-aura-min" as string]: cfg.minOpacity,
          ["--vfx-aura-max" as string]: cfg.maxOpacity,
          animation: cfg.animation,
          ...cfg.extra,
        }}
      />
    </div>
  );
};

// =================================================================
//  17. ScreenTint — スクリーンティント
// =================================================================

interface ScreenTintProps {
  color: string;
  opacity: number;
  active: boolean;
  transition?: number; // ms, default 500
}

export const ScreenTint: FC<ScreenTintProps> = ({
  color,
  opacity,
  active,
  transition = 500,
}) => {
  useVfxStyles();

  return (
    <div
      className="fixed inset-0 z-[58] pointer-events-none"
      style={{
        backgroundColor: color,
        opacity: active ? clamp(opacity, 0, 1) : 0,
        transition: `opacity ${transition}ms ease`,
      }}
    />
  );
};

// =================================================================
//  18. RippleEffect — 波紋エフェクト
// =================================================================

interface RippleEffectProps {
  trigger: number;
  x?: number;   // percentage 0-100
  y?: number;   // percentage 0-100
  color?: string;
}

interface RippleBurst {
  id: number;
  x: number;
  y: number;
}

export const RippleEffect: FC<RippleEffectProps> = ({
  trigger,
  x = 50,
  y = 50,
  color = "rgba(249, 115, 22, 0.4)",
}) => {
  useVfxStyles();

  const [bursts, setBursts] = useState<RippleBurst[]>([]);
  const prevTriggerRef = useRef(trigger);
  const idRef = useRef(0);

  useEffect(() => {
    if (trigger !== prevTriggerRef.current) {
      prevTriggerRef.current = trigger;
      const id = ++idRef.current;
      setBursts((prev) => [...prev, { id, x, y }]);
      const t = setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [trigger, x, y]);

  if (bursts.length === 0) return null;

  const rings = [0, 1, 2];

  return (
    <div className="fixed inset-0 z-[71] pointer-events-none overflow-hidden">
      {bursts.map((burst) => (
        <div key={burst.id}>
          {rings.map((i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${burst.x}%`,
                top: `${burst.y}%`,
                width: "400px",
                height: "400px",
                border: `2px solid ${color}`,
                animation: `vfx-ripple-expand 0.8s ease-out ${i * 0.15}s forwards`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
