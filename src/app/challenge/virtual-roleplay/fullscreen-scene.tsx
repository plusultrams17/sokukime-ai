"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";
import type { ScenarioConfig, GameChoice, ChoiceQuality, SceneType } from "@/lib/scenarios/types";
import { getDefaultScenario, loadScenario } from "@/lib/scenarios";
import { recordPlay } from "@/lib/scenarios/player-data";
import { soundEngine } from "@/lib/sounds/sound-engine";
import { GameSession, DIFFICULTIES, type Achievement, type GameEvent, type StatusEffect, type DifficultyConfig } from "@/lib/game/systems";
import { CountdownTimer, StatusBar, AchievementToast, EventPopup, RelationshipMeter, ScoreMultiplierDisplay, DifficultySelector, GameOverStats } from "@/lib/game/hud-components";
import { ScreenVignette, ScreenShake, ParticleExplosion, DramaticOverlay, FocusLines, EmotionParticles, TimerPressureOverlay, TransitionWipe, ComboFlame, IntroLetterbox } from "@/lib/game/visual-effects";

/* ─── Types & Constants ─── */
type GamePhase = "difficulty" | "intro" | "playing" | "feedback" | "transition" | "ended";

/** Fisher-Yates shuffle (returns new array) */
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function qualityColor(q: ChoiceQuality) {
  switch (q) {
    case "excellent": return "text-green-400";
    case "good": return "text-blue-400";
    case "neutral": return "text-yellow-400";
    case "bad": return "text-red-400";
  }
}
function qualityLabel(q: ChoiceQuality) {
  switch (q) {
    case "excellent": return "最高の一手！";
    case "good": return "良い選択";
    case "neutral": return "普通";
    case "bad": return "NG行動…";
  }
}

/* ═══════════════════════════════════════════════════════════════
   3D SCENE COMPONENTS — Office (社長室 / 会議室)
═══════════════════════════════════════════════════════════════ */

function OfficeFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#a0855b" />
    </mesh>
  );
}

function OfficeWalls() {
  return (
    <group>
      <mesh position={[0, 2.5, -5]}>
        <boxGeometry args={[10, 5, 0.15]} />
        <meshStandardMaterial color="#e8dcc8" />
      </mesh>
      <mesh position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 5, 0.15]} />
        <meshStandardMaterial color="#ddd0bc" />
      </mesh>
      <mesh position={[5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[10, 5, 0.15]} />
        <meshStandardMaterial color="#ddd0bc" />
      </mesh>
    </group>
  );
}

function WindowDecor() {
  return (
    <group position={[-4.9, 2.5, -1.5]} rotation={[0, Math.PI / 2, 0]}>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[2.15, 1.95]} />
        <meshStandardMaterial color="#f5f0e8" />
      </mesh>
      <mesh>
        <planeGeometry args={[2, 1.8]} />
        <meshStandardMaterial color="#87ceeb" emissive="#4a90d9" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[2, 0.04, 0.02]} />
        <meshStandardMaterial color="#f5f0e8" />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[0.04, 1.8, 0.02]} />
        <meshStandardMaterial color="#f5f0e8" />
      </mesh>
    </group>
  );
}

function Desk() {
  const legs: [number, number, number][] = [
    [-1.05, 0.37, -0.4], [1.05, 0.37, -0.4],
    [-1.05, 0.37, 0.4], [1.05, 0.37, 0.4],
  ];
  return (
    <group position={[0, 0, -2.5]}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[2.4, 0.07, 1]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      {legs.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[0.06, 0.74, 0.06]} />
          <meshStandardMaterial color="#4a3728" />
        </mesh>
      ))}
      <mesh position={[0.4, 0.84, -0.15]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.45, 0.3, 0.015]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.4, 0.79, 0.08]} castShadow>
        <boxGeometry args={[0.45, 0.015, 0.3]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-0.5, 0.795, 0]} castShadow>
        <boxGeometry args={[0.3, 0.008, 0.4]} />
        <meshStandardMaterial color="#faf8f5" />
      </mesh>
      <mesh position={[-0.3, 0.8, 0.15]} rotation={[0, 0.3, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.18, 6]} />
        <meshStandardMaterial color="#1a1a6e" />
      </mesh>
    </group>
  );
}

function OfficePlant() {
  return (
    <group position={[3.5, 0, -4]}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.5, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
    </group>
  );
}

function Whiteboard() {
  return (
    <group position={[4.9, 2.2, -2.5]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[2.1, 1.4]} />
        <meshStandardMaterial color="#999" />
      </mesh>
      <mesh>
        <planeGeometry args={[2, 1.3]} />
        <meshStandardMaterial color="#f8f8f8" />
      </mesh>
    </group>
  );
}

function CustomerAvatar({ emotion }: { emotion: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const isPositive = emotion >= 50;
  const isNegative = emotion < 20;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 1.5) * 0.008;
    if (headRef.current) {
      headRef.current.rotation.x = isPositive
        ? Math.sin(clock.elapsedTime * 2) * 0.04 - 0.05
        : isNegative ? 0.05 : Math.sin(clock.elapsedTime * 0.5) * 0.02;
    }
    if (leftArmRef.current && rightArmRef.current) {
      if (isNegative) {
        leftArmRef.current.position.set(-0.15, 0.92, 0.15);
        leftArmRef.current.rotation.z = 0.4;
        rightArmRef.current.position.set(0.15, 0.92, 0.15);
        rightArmRef.current.rotation.z = -0.4;
      } else {
        leftArmRef.current.position.set(-0.3, 0.92, 0.08);
        leftArmRef.current.rotation.z = 0;
        rightArmRef.current.position.set(0.3, 0.92, 0.08);
        rightArmRef.current.rotation.z = 0;
      }
    }
  });

  const chairLegs: [number, number, number][] = [
    [-0.2, 0.22, -0.2], [0.2, 0.22, -0.2],
    [-0.2, 0.22, 0.2], [0.2, 0.22, 0.2],
  ];
  const suitColor = isNegative ? "#1a1a3e" : isPositive ? "#1e3a5f" : "#1e2a4f";

  return (
    <group ref={groupRef} position={[0, 0, -3.5]}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.5, 0.05, 0.5]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0, 0.85, -0.23]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {chairLegs.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.04, 0.44, 0.04]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
      <mesh position={[0, 1.05, -0.05]} castShadow>
        <boxGeometry args={[0.45, 0.55, 0.26]} />
        <meshStandardMaterial color={suitColor} />
      </mesh>
      <mesh ref={headRef} position={[0, 1.52, 0]} castShadow>
        <sphereGeometry args={[0.19, 16, 16]} />
        <meshStandardMaterial color="#deb887" />
      </mesh>
      <mesh position={[0, 1.62, -0.02]}>
        <sphereGeometry args={[0.17, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2c1810" />
      </mesh>
      <mesh ref={leftArmRef} position={[-0.3, 0.92, 0.08]} castShadow>
        <boxGeometry args={[0.12, 0.42, 0.14]} />
        <meshStandardMaterial color={suitColor} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.3, 0.92, 0.08]} castShadow>
        <boxGeometry args={[0.12, 0.42, 0.14]} />
        <meshStandardMaterial color={suitColor} />
      </mesh>
    </group>
  );
}

function UserChair() {
  const legs: [number, number, number][] = [
    [-0.2, 0.22, -0.2], [0.2, 0.22, -0.2],
    [-0.2, 0.22, 0.2], [0.2, 0.22, 0.2],
  ];
  return (
    <group position={[0, 0, -1.2]}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.5, 0.05, 0.5]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0, 0.85, 0.23]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {legs.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.04, 0.44, 0.04]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3D SCENE: Lobby (エントランス)
═══════════════════════════════════════════════════════════════ */

function LobbyFloor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.5]} receiveShadow>
        <planeGeometry args={[10, 7]} />
        <meshStandardMaterial color="#d4cfc7" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 4.5]} receiveShadow>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial color="#aaa8a0" />
      </mesh>
    </group>
  );
}

function LobbyWalls() {
  return (
    <group>
      <mesh position={[0, 2.5, -3.5]}>
        <boxGeometry args={[10, 5, 0.15]} />
        <meshStandardMaterial color="#f0ece4" />
      </mesh>
      <mesh position={[-5, 2.5, -0.25]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[6.5, 5, 0.15]} />
        <meshStandardMaterial color="#e8e2d8" />
      </mesh>
      <mesh position={[5, 2.5, -0.25]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[6.5, 5, 0.15]} />
        <meshStandardMaterial color="#e8e2d8" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.5, -0.5]}>
        <planeGeometry args={[10, 7]} />
        <meshStandardMaterial color="#f5f2ec" />
      </mesh>
      <mesh position={[0, 4.45, -0.5]}>
        <boxGeometry args={[1.8, 0.04, 0.3]} />
        <meshStandardMaterial color="#fff" emissive="#ffffcc" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function GlassFront() {
  return (
    <group>
      <mesh position={[-2.5, 2.2, 2.5]}>
        <boxGeometry args={[3, 4.4, 0.06]} />
        <meshStandardMaterial color="#b8d8e8" transparent opacity={0.12} roughness={0.05} metalness={0.3} />
      </mesh>
      <mesh position={[2.5, 2.2, 2.5]}>
        <boxGeometry args={[3, 4.4, 0.06]} />
        <meshStandardMaterial color="#b8d8e8" transparent opacity={0.12} roughness={0.05} metalness={0.3} />
      </mesh>
      <mesh position={[-0.55, 2.2, 2.5]}>
        <boxGeometry args={[0.1, 4.4, 0.08]} />
        <meshStandardMaterial color="#777" />
      </mesh>
      <mesh position={[0.55, 2.2, 2.5]}>
        <boxGeometry args={[0.1, 4.4, 0.08]} />
        <meshStandardMaterial color="#777" />
      </mesh>
      <mesh position={[0, 4.45, 2.5]}>
        <boxGeometry args={[10, 0.12, 0.1]} />
        <meshStandardMaterial color="#777" />
      </mesh>
    </group>
  );
}

function ReceptionDesk() {
  return (
    <group position={[0, 0, -1.2]}>
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[2.5, 0.08, 0.7]} />
        <meshStandardMaterial color="#3a3028" />
      </mesh>
      <mesh position={[0, 0.52, 0.33]} castShadow>
        <boxGeometry args={[2.5, 1.04, 0.05]} />
        <meshStandardMaterial color="#4a3828" />
      </mesh>
      <mesh position={[-1.23, 0.52, 0]} castShadow>
        <boxGeometry args={[0.05, 1.04, 0.7]} />
        <meshStandardMaterial color="#4a3828" />
      </mesh>
      <mesh position={[1.23, 0.52, 0]} castShadow>
        <boxGeometry args={[0.05, 1.04, 0.7]} />
        <meshStandardMaterial color="#4a3828" />
      </mesh>
      <mesh position={[0.5, 1.3, -0.1]} rotation={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.45, 0.3, 0.02]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.5, 1.13, -0.1]} castShadow>
        <boxGeometry args={[0.06, 0.08, 0.06]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

function ReceptionistAvatar() {
  const headRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.8) * 0.05;
    }
  });
  return (
    <group position={[0, 0, -1.8]}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.38, 0.5, 0.22]} />
        <meshStandardMaterial color="#2c4a6e" />
      </mesh>
      <mesh ref={headRef} position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#f5d0b0" />
      </mesh>
      <mesh position={[0, 1.58, -0.02]}>
        <sphereGeometry args={[0.14, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1008" />
      </mesh>
      <mesh position={[-0.25, 1.0, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.35, 0.12]} />
        <meshStandardMaterial color="#2c4a6e" />
      </mesh>
      <mesh position={[0.25, 1.0, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.35, 0.12]} />
        <meshStandardMaterial color="#2c4a6e" />
      </mesh>
    </group>
  );
}

function CompanySign({ text }: { text: string }) {
  return (
    <Html position={[0, 3.3, -3.4]} center>
      <div className="pointer-events-none select-none">
        <p
          className="whitespace-nowrap text-base font-bold tracking-[0.2em] text-gray-600 sm:text-lg"
          style={{ fontFamily: "serif" }}
        >
          {text}
        </p>
      </div>
    </Html>
  );
}

function LobbyDecor() {
  return (
    <>
      <group position={[-3.5, 0, 0.5]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.5, 8]} />
          <meshStandardMaterial color="#6B5842" />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial color="#2d6a27" />
        </mesh>
      </group>
      <group position={[3.5, 0, 0.5]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.5, 8]} />
          <meshStandardMaterial color="#6B5842" />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial color="#2d6a27" />
        </mesh>
      </group>
      <group position={[-3.5, 0, -2]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[1.2, 0.3, 0.5]} />
          <meshStandardMaterial color="#3a3530" />
        </mesh>
        <mesh position={[0, 0.55, -0.2]} castShadow>
          <boxGeometry args={[1.2, 0.25, 0.1]} />
          <meshStandardMaterial color="#3a3530" />
        </mesh>
      </group>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3D SCENE: Cafe (カフェ)
═══════════════════════════════════════════════════════════════ */

function CafeFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial color="#8B6F47" />
    </mesh>
  );
}

function CafeWalls() {
  return (
    <group>
      <mesh position={[0, 2.5, -5]}>
        <boxGeometry args={[12, 5, 0.15]} />
        <meshStandardMaterial color="#F5E6D3" />
      </mesh>
      <mesh position={[-6, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 5, 0.15]} />
        <meshStandardMaterial color="#E8D5C0" />
      </mesh>
      <mesh position={[6, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[10, 5, 0.15]} />
        <meshStandardMaterial color="#E8D5C0" />
      </mesh>
      {/* Large windows */}
      <mesh position={[5.9, 2.5, -2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[3, 2.5]} />
        <meshStandardMaterial color="#87ceeb" emissive="#4a90d9" emissiveIntensity={0.2} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function CafeTable() {
  return (
    <group position={[0, 0, -2]}>
      {/* Round table */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.04, 16]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      <mesh position={[0, 0.36, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.72, 8]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      {/* Coffee cups */}
      <mesh position={[-0.2, 0.78, 0.1]} castShadow>
        <cylinderGeometry args={[0.04, 0.035, 0.08, 8]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[0.2, 0.78, -0.1]} castShadow>
        <cylinderGeometry args={[0.04, 0.035, 0.08, 8]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
    </group>
  );
}

function CafeDecor() {
  return (
    <>
      {/* Counter bar */}
      <group position={[-4, 0, -3]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[2, 1.1, 0.6]} />
          <meshStandardMaterial color="#3a2a1a" />
        </mesh>
      </group>
      {/* Pendant lights */}
      <mesh position={[0, 3.8, -2]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#ffdd88" emissive="#ffcc44" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[2, 3.8, -3]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#ffdd88" emissive="#ffcc44" emissiveIntensity={0.4} />
      </mesh>
      {/* Bookshelf */}
      <group position={[-5.9, 1.5, -1]}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 2.5, 1.5]} />
          <meshStandardMaterial color="#5c4033" />
        </mesh>
      </group>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3D SCENE: Exhibition (展示会)
═══════════════════════════════════════════════════════════════ */

function ExhibitionFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[16, 16]} />
      <meshStandardMaterial color="#ccc8c0" />
    </mesh>
  );
}

function ExhibitionBooth() {
  return (
    <group>
      {/* Back panel */}
      <mesh position={[0, 1.5, -4]}>
        <boxGeometry args={[5, 3, 0.1]} />
        <meshStandardMaterial color="#1a3a6e" />
      </mesh>
      {/* Side panels */}
      <mesh position={[-2.5, 1.5, -2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[4, 3, 0.08]} />
        <meshStandardMaterial color="#1e4a7e" />
      </mesh>
      <mesh position={[2.5, 1.5, -2]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[4, 3, 0.08]} />
        <meshStandardMaterial color="#1e4a7e" />
      </mesh>
      {/* Counter */}
      <mesh position={[0, 0.9, -1.5]} castShadow>
        <boxGeometry args={[3, 0.06, 0.8]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[0, 0.45, -1.5]} castShadow>
        <boxGeometry args={[3, 0.9, 0.8]} />
        <meshStandardMaterial color="#1a3a6e" />
      </mesh>
      {/* Brochures */}
      {[-0.8, 0, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0.96, -1.5]} castShadow>
          <boxGeometry args={[0.2, 0.02, 0.3]} />
          <meshStandardMaterial color={["#ff6b35", "#35a0ff", "#35ff6b"][i]} />
        </mesh>
      ))}
      {/* Monitor */}
      <mesh position={[0, 2.2, -3.9]} castShadow>
        <boxGeometry args={[1.6, 0.9, 0.04]} />
        <meshStandardMaterial color="#111" emissive="#003366" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3D SCENE: Online (デスク + モニタ + Zoom画面)
═══════════════════════════════════════════════════════════════ */

function OnlineRoom() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#e8e2d8" />
      </mesh>
      {/* Walls */}
      <mesh position={[0, 2.5, -3]}>
        <boxGeometry args={[8, 5, 0.15]} />
        <meshStandardMaterial color="#f5f0e8" />
      </mesh>
      <mesh position={[-4, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[6, 5, 0.15]} />
        <meshStandardMaterial color="#f0ece4" />
      </mesh>
      <mesh position={[4, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[6, 5, 0.15]} />
        <meshStandardMaterial color="#f0ece4" />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.5, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#f8f6f2" />
      </mesh>
      {/* Ceiling light */}
      <mesh position={[0, 4.45, -1]}>
        <boxGeometry args={[1.2, 0.03, 0.25]} />
        <meshStandardMaterial color="#fff" emissive="#ffffee" emissiveIntensity={0.3} />
      </mesh>
      {/* Window with curtain */}
      <mesh position={[3.9, 2.3, -1]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color="#87ceeb" emissive="#4a90d9" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[3.88, 2.3, -1.8]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.5, 2.2]} />
        <meshStandardMaterial color="#e8dcc8" />
      </mesh>
      {/* Bookshelf on back wall */}
      <group position={[-2.5, 1.2, -2.9]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 1.8, 0.3]} />
          <meshStandardMaterial color="#5c4033" />
        </mesh>
        {[0.4, 0, -0.4].map((y, i) => (
          <mesh key={i} position={[0, y, 0.02]} castShadow>
            <boxGeometry args={[1.1, 0.02, 0.28]} />
            <meshStandardMaterial color="#4a3728" />
          </mesh>
        ))}
        {/* Books */}
        {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
          <mesh key={i} position={[x, 0.5, 0.05]} castShadow>
            <boxGeometry args={[0.12, 0.3, 0.18]} />
            <meshStandardMaterial color={["#2a4a6a", "#6a2a2a", "#2a6a3a", "#5a4a2a"][i]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function OnlineDesk({ showFace, emotion }: { showFace: boolean; emotion: number }) {
  const webcamRef = useRef<THREE.Mesh>(null);
  const isPositive = emotion >= 50;
  const isNegative = emotion < 20;

  useFrame(({ clock }) => {
    if (webcamRef.current && showFace) {
      webcamRef.current.material = webcamRef.current.material as THREE.MeshStandardMaterial;
      (webcamRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.3 + Math.sin(clock.elapsedTime * 3) * 0.1;
    }
  });

  const faceColor = isNegative ? "#c0a080" : isPositive ? "#e8c8a8" : "#deb887";

  return (
    <group position={[0, 0, -1.5]}>
      {/* Desktop */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[2.2, 0.05, 0.9]} />
        <meshStandardMaterial color="#f0ece4" />
      </mesh>
      {/* Legs */}
      {[[-1.0, 0.36, -0.4], [1.0, 0.36, -0.4], [-1.0, 0.36, 0.4], [1.0, 0.36, 0.4]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <boxGeometry args={[0.05, 0.72, 0.05]} />
          <meshStandardMaterial color="#555" />
        </mesh>
      ))}

      {/* Large monitor frame */}
      <mesh position={[0, 1.2, -0.3]} rotation={[-0.1, 0, 0]} castShadow>
        <boxGeometry args={[1.0, 0.6, 0.03]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Monitor stand */}
      <mesh position={[0, 0.82, -0.3]} castShadow>
        <boxGeometry args={[0.08, 0.12, 0.08]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, 0.76, -0.3]} castShadow>
        <boxGeometry args={[0.25, 0.02, 0.15]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Monitor screen — Zoom UI */}
      <mesh position={[0, 1.2, -0.28]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[0.92, 0.52]} />
        <meshStandardMaterial
          color={showFace ? "#1a1a2e" : "#1a2744"}
          emissive={showFace ? "#222244" : "#334488"}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Zoom face on screen (when meeting is active) */}
      {showFace && (
        <group position={[0, 1.22, -0.26]} rotation={[-0.1, 0, 0]}>
          {/* Face oval */}
          <mesh>
            <circleGeometry args={[0.12, 16]} />
            <meshStandardMaterial color={faceColor} />
          </mesh>
          {/* Hair */}
          <mesh position={[0, 0.06, -0.01]}>
            <circleGeometry args={[0.11, 16, 0, Math.PI]} />
            <meshStandardMaterial color="#2c1810" />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.035, 0.02, 0.01]}>
            <circleGeometry args={[0.012, 8]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[0.035, 0.02, 0.01]}>
            <circleGeometry args={[0.012, 8]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          {/* Mouth — changes with emotion */}
          <mesh position={[0, -0.04, 0.01]}>
            <planeGeometry args={[isPositive ? 0.05 : 0.04, 0.008]} />
            <meshStandardMaterial color={isNegative ? "#aa6655" : "#cc8877"} />
          </mesh>
          {/* Suit/shoulders */}
          <mesh position={[0, -0.16, -0.01]}>
            <planeGeometry args={[0.35, 0.12]} />
            <meshStandardMaterial color="#1e2a4f" />
          </mesh>
          {/* Zoom name bar */}
          <mesh position={[0, -0.22, 0.01]}>
            <planeGeometry args={[0.4, 0.03]} />
            <meshStandardMaterial color="#000" transparent opacity={0.6} />
          </mesh>
          {/* Zoom top bar */}
          <mesh position={[0, 0.24, 0.01]}>
            <planeGeometry args={[0.92, 0.02]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          {/* Zoom toolbar at bottom */}
          <mesh position={[0, -0.24, 0.01]}>
            <planeGeometry args={[0.92, 0.025]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
          {/* Self-view mini window (bottom right) */}
          <mesh position={[0.32, -0.15, 0.01]}>
            <planeGeometry args={[0.15, 0.1]} />
            <meshStandardMaterial color="#334455" />
          </mesh>
        </group>
      )}

      {/* Webcam on top of monitor */}
      <mesh position={[0, 1.52, -0.32]} castShadow>
        <boxGeometry args={[0.06, 0.04, 0.04]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Webcam indicator light */}
      <mesh ref={webcamRef} position={[0, 1.55, -0.3]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial
          color={showFace ? "#00ff00" : "#333"}
          emissive={showFace ? "#00ff00" : "#000"}
          emissiveIntensity={showFace ? 0.5 : 0}
        />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0, 0.76, 0.15]} castShadow>
        <boxGeometry args={[0.5, 0.02, 0.18]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Keyboard keys (subtle grid) */}
      {Array.from({ length: 3 }).map((_, r) =>
        Array.from({ length: 8 }).map((_, c) => (
          <mesh key={`${r}-${c}`} position={[-0.18 + c * 0.05, 0.775, 0.09 + r * 0.05]}>
            <boxGeometry args={[0.035, 0.005, 0.035]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
        ))
      )}

      {/* Mouse */}
      <mesh position={[0.45, 0.76, 0.15]} castShadow>
        <boxGeometry args={[0.06, 0.025, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Mouse pad */}
      <mesh position={[0.45, 0.75, 0.15]} castShadow>
        <boxGeometry args={[0.2, 0.005, 0.22]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Headset on desk */}
      <mesh position={[-0.7, 0.8, 0.1]} rotation={[0, 0.3, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[-0.7, 0.78, 0.02]} castShadow>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-0.7, 0.78, 0.18]} castShadow>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Coffee mug */}
      <mesh position={[0.75, 0.8, -0.1]} castShadow>
        <cylinderGeometry args={[0.035, 0.03, 0.09, 8]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      {/* Mug handle */}
      <mesh position={[0.79, 0.8, -0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.02, 0.005, 6, 8, Math.PI]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Notepad */}
      <mesh position={[-0.35, 0.76, 0.25]} rotation={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.18, 0.01, 0.25]} />
        <meshStandardMaterial color="#fff8e8" />
      </mesh>
      {/* Pen */}
      <mesh position={[-0.2, 0.77, 0.28]} rotation={[0, 0.8, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.005, 0.005, 0.15, 6]} />
        <meshStandardMaterial color="#1a1a6e" />
      </mesh>

      {/* Office chair (user's) */}
      <group position={[0, 0, 0.8]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.5, 0.06, 0.5]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        <mesh position={[0, 0.75, 0.22]} castShadow>
          <boxGeometry args={[0.5, 0.6, 0.06]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        {/* Chair wheels */}
        {[[-0.2, 0.08, -0.2], [0.2, 0.08, -0.2], [-0.2, 0.08, 0.15], [0.2, 0.08, 0.15]].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        ))}
        {/* Chair gas cylinder */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.35, 6]} />
          <meshStandardMaterial color="#444" />
        </mesh>
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3D SCENE: Restaurant Exterior (居酒屋の外観 — 商店街)
═══════════════════════════════════════════════════════════════ */

function RestaurantExterior() {
  return (
    <group>
      {/* Street / sidewalk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color="#888580" />
      </mesh>
      {/* Sidewalk curb */}
      <mesh position={[0, 0.05, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 4]} />
        <meshStandardMaterial color="#999590" />
      </mesh>

      {/* Restaurant building facade */}
      <mesh position={[0, 2, -3]}>
        <boxGeometry args={[6, 4, 0.2]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      {/* Store sign board */}
      <mesh position={[0, 3.5, -2.85]} castShadow>
        <boxGeometry args={[3, 0.6, 0.05]} />
        <meshStandardMaterial color="#2a1a0a" />
      </mesh>
      <Html position={[0, 3.5, -2.8]} center>
        <div className="pointer-events-none select-none">
          <p className="whitespace-nowrap text-lg font-bold text-yellow-200" style={{ fontFamily: "serif" }}>
            鳥源
          </p>
        </div>
      </Html>

      {/* Entrance - dark opening */}
      <mesh position={[0, 1.5, -2.89]}>
        <planeGeometry args={[2, 2.8]} />
        <meshStandardMaterial color="#1a0f08" />
      </mesh>

      {/* Noren (暖簾) hanging at entrance */}
      {[-0.7, -0.23, 0.23, 0.7].map((x, i) => (
        <mesh key={i} position={[x, 2.5, -2.85]}>
          <boxGeometry args={[0.42, 1.2, 0.02]} />
          <meshStandardMaterial color="#8b2500" />
        </mesh>
      ))}
      {/* Noren text */}
      <Html position={[0, 2.6, -2.82]} center>
        <div className="pointer-events-none select-none">
          <p className="text-base font-bold text-yellow-100/80" style={{ fontFamily: "serif" }}>鳥源</p>
        </div>
      </Html>

      {/* Paper lanterns outside */}
      {[-1.8, 1.8].map((x, i) => (
        <group key={i} position={[x, 3.2, -2.7]}>
          <mesh>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="#ffeecc" emissive="#ff8844" emissiveIntensity={0.6} transparent opacity={0.85} />
          </mesh>
          {/* Lantern string */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.3, 4]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </group>
      ))}

      {/* Menu board outside (立て看板) */}
      <group position={[2.2, 0, -1.5]} rotation={[0, -0.3, 0]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.5, 0.8, 0.04]} />
          <meshStandardMaterial color="#1a1008" />
        </mesh>
        {/* A-frame legs */}
        <mesh position={[-0.2, 0.3, 0.15]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.03, 0.6, 0.03]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0.2, 0.3, 0.15]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.03, 0.6, 0.03]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>

      {/* Bicycle parked outside */}
      <group position={[-2.5, 0, -1]}>
        <mesh position={[0, 0.35, 0]} rotation={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.8, 0.03, 0.04]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh position={[-0.35, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.015, 8, 16]} />
          <meshStandardMaterial color="#444" />
        </mesh>
        <mesh position={[0.35, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.015, 8, 16]} />
          <meshStandardMaterial color="#444" />
        </mesh>
      </group>

      {/* Neighboring shops (left & right) */}
      <mesh position={[-4.5, 2, -3]}>
        <boxGeometry args={[3, 4, 0.2]} />
        <meshStandardMaterial color="#e8dcc8" />
      </mesh>
      <mesh position={[4.5, 2, -3]}>
        <boxGeometry args={[3, 4, 0.2]} />
        <meshStandardMaterial color="#d8cbb8" />
      </mesh>

      {/* Street light */}
      <group position={[5, 0, 1]}>
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 4, 6]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        <mesh position={[0, 4, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#ffeecc" emissive="#ffcc88" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3D SCENE: Restaurant Interior (居酒屋 — 店内カウンター)
═══════════════════════════════════════════════════════════════ */

function RestaurantInterior({ emotion }: { emotion: number }) {
  const isNegative = emotion < 20;
  const isPositive = emotion >= 50;

  return (
    <group>
      {/* Floor - warm wood */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#6b4c30" />
      </mesh>
      {/* Walls */}
      <mesh position={[0, 2.5, -4]}>
        <boxGeometry args={[10, 5, 0.15]} />
        <meshStandardMaterial color="#7a5840" />
      </mesh>
      <mesh position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[8, 5, 0.15]} />
        <meshStandardMaterial color="#75533b" />
      </mesh>
      <mesh position={[5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[8, 5, 0.15]} />
        <meshStandardMaterial color="#75533b" />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.5, -1]}>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#5a4030" />
      </mesh>

      {/* Counter */}
      <mesh position={[0, 0.9, -2.5]} castShadow>
        <boxGeometry args={[5, 0.08, 0.7]} />
        <meshStandardMaterial color="#3a2a15" />
      </mesh>
      <mesh position={[0, 0.45, -2.85]} castShadow>
        <boxGeometry args={[5, 0.9, 0.05]} />
        <meshStandardMaterial color="#3a2a15" />
      </mesh>

      {/* Counter stools */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <group key={i} position={[x, 0, -1.5]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.04, 8]} />
            <meshStandardMaterial color="#4a3520" />
          </mesh>
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.03, 0.5, 6]} />
            <meshStandardMaterial color="#555" />
          </mesh>
          {/* Stool footrest ring */}
          <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.1, 0.01, 6, 12]} />
            <meshStandardMaterial color="#555" />
          </mesh>
        </group>
      ))}

      {/* Owner/Chef behind counter */}
      <group position={[0, 0, -3.2]}>
        {/* Body (white chef coat / happi) */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[0.45, 0.6, 0.25]} />
          <meshStandardMaterial color={isNegative ? "#e0d8d0" : "#f5f0e8"} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.55, 0]} castShadow>
          <sphereGeometry args={[0.17, 16, 16]} />
          <meshStandardMaterial color="#d4a87a" />
        </mesh>
        {/* Bandana / hachimaki */}
        <mesh position={[0, 1.63, 0.02]}>
          <boxGeometry args={[0.36, 0.05, 0.2]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        {/* Arms */}
        <mesh position={[-0.3, 0.95, 0.05]} castShadow>
          <boxGeometry args={[0.12, 0.4, 0.14]} />
          <meshStandardMaterial color={isNegative ? "#e0d8d0" : "#f5f0e8"} />
        </mesh>
        <mesh position={[0.3, 0.95, 0.05]} castShadow>
          <boxGeometry args={[0.12, 0.4, 0.14]} />
          <meshStandardMaterial color={isNegative ? "#e0d8d0" : "#f5f0e8"} />
        </mesh>
        {/* Apron */}
        <mesh position={[0, 0.85, 0.13]}>
          <boxGeometry args={[0.4, 0.5, 0.01]} />
          <meshStandardMaterial color="#2a3a6a" />
        </mesh>
      </group>

      {/* Bottles on shelf behind counter */}
      <group position={[0, 1.8, -3.9]}>
        {/* Shelf */}
        <mesh castShadow>
          <boxGeometry args={[4, 0.04, 0.2]} />
          <meshStandardMaterial color="#3a2a15" />
        </mesh>
        {/* Second shelf */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[4, 0.04, 0.2]} />
          <meshStandardMaterial color="#3a2a15" />
        </mesh>
        {/* Bottles bottom shelf */}
        {[-1.5, -1.0, -0.5, 0, 0.5, 1.0, 1.5].map((x, i) => (
          <mesh key={i} position={[x, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.35, 6]} />
            <meshStandardMaterial color={["#2a5a2a", "#5a2a1a", "#1a3a5a", "#5a4a1a", "#3a1a5a", "#1a5a3a", "#5a1a2a"][i]} />
          </mesh>
        ))}
        {/* Bottles top shelf */}
        {[-1.2, -0.4, 0.3, 1.1].map((x, i) => (
          <mesh key={i} position={[x, 0.72, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.3, 6]} />
            <meshStandardMaterial color={["#4a3a2a", "#2a4a3a", "#3a2a4a", "#5a4a2a"][i]} />
          </mesh>
        ))}
      </group>

      {/* Items on counter */}
      {/* Chopstick holders */}
      {[-1.2, 0.3, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 0.98, -2.3]} castShadow>
          <cylinderGeometry args={[0.04, 0.035, 0.1, 6]} />
          <meshStandardMaterial color="#5c4033" />
        </mesh>
      ))}
      {/* Soy sauce bottle */}
      <mesh position={[0.8, 0.98, -2.3]} castShadow>
        <cylinderGeometry args={[0.02, 0.025, 0.12, 6]} />
        <meshStandardMaterial color="#1a0a00" />
      </mesh>
      {/* Toothpick holder */}
      <mesh position={[-0.5, 0.97, -2.3]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.06, 6]} />
        <meshStandardMaterial color="#8B6F47" />
      </mesh>
      {/* Menu on counter */}
      <mesh position={[-0.8, 0.96, -2.1]} rotation={[-0.8, 0, 0.1]} castShadow>
        <boxGeometry args={[0.25, 0.35, 0.01]} />
        <meshStandardMaterial color="#2a1a0a" />
      </mesh>

      {/* Paper lanterns (提灯) — bright warm glow */}
      {[-2, 0, 2].map((x, i) => (
        <group key={i} position={[x, 3.2, -2]}>
          <mesh>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="#ffeecc" emissive="#ffaa55" emissiveIntensity={0.8} transparent opacity={0.85} />
          </mesh>
          <pointLight position={[0, -0.1, 0]} intensity={0.2} color="#ffcc88" distance={3} />
        </group>
      ))}

      {/* Menu board on wall */}
      <group position={[-4.9, 2, -2]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 1, 0.03]} />
          <meshStandardMaterial color="#1a0f08" />
        </mesh>
      </group>
      <Html position={[-4.8, 2, -2]} rotation={[0, Math.PI / 2, 0]} center>
        <div className="pointer-events-none select-none text-center">
          <p className="text-sm font-bold text-yellow-200" style={{ fontFamily: "serif" }}>
            本日のおすすめ
          </p>
          <p className="mt-1 text-[10px] text-yellow-100/60">焼鳥盛合せ ¥980</p>
          <p className="text-[10px] text-yellow-100/60">もつ煮込み ¥680</p>
        </div>
      </Html>

      {/* Kitchen area (behind counter, partially visible) */}
      {/* Grill / yakitori station */}
      <group position={[2, 0.9, -3.5]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.15, 0.4]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        {/* Grill glow */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.7, 0.05, 0.3]} />
          <meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Noren at entrance (behind camera) */}
      {[-0.8, -0.25, 0.25, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 2.5, 3.5]}>
          <boxGeometry args={[0.5, 1.2, 0.02]} />
          <meshStandardMaterial color="#8b2500" />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AMBIENT ANIMATIONS — subtle periodic movements per scene
═══════════════════════════════════════════════════════════════ */

function AmbientOffice() {
  const clockHandRef = useRef<THREE.Mesh>(null);
  const clockMinRef = useRef<THREE.Mesh>(null);
  const paperRef = useRef<THREE.Group>(null);
  const plantRef = useRef<THREE.Mesh>(null);
  const phoneLedRef = useRef<THREE.Mesh>(null);
  const curtainRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (clockHandRef.current) clockHandRef.current.rotation.z = -t * 1.05;
    if (clockMinRef.current) clockMinRef.current.rotation.z = -t * 0.018;
    if (paperRef.current) paperRef.current.rotation.z = Math.sin(t * 0.7 + 1) * 0.015;
    if (plantRef.current) plantRef.current.rotation.z = Math.sin(t * 0.3) * 0.02;
    if (phoneLedRef.current) {
      const blink = Math.sin(t * 0.4) > 0.92;
      (phoneLedRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = blink ? 1.2 : 0;
    }
    if (curtainRef.current) curtainRef.current.position.x = -4.9 + Math.sin(t * 0.25) * 0.02;
  });
  return (
    <group>
      {/* Wall clock with hour + minute hands */}
      <group position={[4.85, 3.2, -2]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh><circleGeometry args={[0.22, 20]} /><meshStandardMaterial color="#f5f0e8" /></mesh>
        <mesh position={[0, 0, -0.005]}><circleGeometry args={[0.23, 20]} /><meshStandardMaterial color="#5c4033" /></mesh>
        <mesh ref={clockHandRef} position={[0, 0, 0.015]}>
          <boxGeometry args={[0.008, 0.15, 0.004]} /><meshStandardMaterial color="#333" />
        </mesh>
        <mesh ref={clockMinRef} position={[0, 0, 0.012]}>
          <boxGeometry args={[0.006, 0.1, 0.004]} /><meshStandardMaterial color="#666" />
        </mesh>
        <mesh position={[0, 0, 0.02]}><circleGeometry args={[0.012, 8]} /><meshStandardMaterial color="#222" /></mesh>
      </group>

      {/* Papers on desk that rustle */}
      <group ref={paperRef} position={[-0.7, 0.8, -2.3]}>
        <mesh rotation={[-Math.PI / 2, 0, 0.05]}>
          <planeGeometry args={[0.18, 0.25]} /><meshStandardMaterial color="#faf8f5" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, -0.03]} position={[0.02, 0.002, 0.01]}>
          <planeGeometry args={[0.17, 0.24]} /><meshStandardMaterial color="#f5f0e8" />
        </mesh>
      </group>

      {/* Plant leaf sway */}
      <mesh ref={plantRef} position={[3.5, 0.95, -4]}>
        <sphereGeometry args={[0.25, 8, 6]} /><meshStandardMaterial color="#3a7a32" transparent opacity={0.7} />
      </mesh>

      {/* Coat rack */}
      <group position={[-4.5, 0, -4]}>
        <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.025, 0.035, 1.8, 6]} /><meshStandardMaterial color="#4a3728" /></mesh>
        <mesh position={[0, 1.8, 0]}><sphereGeometry args={[0.04, 6, 6]} /><meshStandardMaterial color="#5c4033" /></mesh>
        {/* Coat hooks */}
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 0.1, 1.7, Math.sin(a) * 0.1]} rotation={[0, a, Math.PI / 4]}>
            <cylinderGeometry args={[0.008, 0.008, 0.1, 4]} /><meshStandardMaterial color="#5c4033" />
          </mesh>
        ))}
        {/* Jacket hanging */}
        <mesh position={[0.1, 1.4, 0]}><boxGeometry args={[0.2, 0.5, 0.06]} /><meshStandardMaterial color="#2a3a5a" /></mesh>
      </group>

      {/* Desk phone with blinking LED */}
      <group position={[0.9, 0.79, -2.8]}>
        <mesh castShadow><boxGeometry args={[0.18, 0.04, 0.12]} /><meshStandardMaterial color="#222" /></mesh>
        <mesh position={[0, 0.04, -0.02]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.15, 0.08, 0.06]} /><meshStandardMaterial color="#222" />
        </mesh>
        <mesh ref={phoneLedRef} position={[0.06, 0.06, 0.03]}>
          <sphereGeometry args={[0.006, 6, 6]} /><meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0} />
        </mesh>
      </group>

      {/* Bookshelf on back wall */}
      <group position={[-3, 1.5, -4.9]}>
        <mesh><boxGeometry args={[1.4, 2.2, 0.3]} /><meshStandardMaterial color="#5c4033" /></mesh>
        {[-0.5, 0, 0.5].map((y, i) => (
          <mesh key={i} position={[0, y, 0.02]}><boxGeometry args={[1.3, 0.02, 0.28]} /><meshStandardMaterial color="#4a3728" /></mesh>
        ))}
        {/* Books */}
        {[-0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45].map((x, i) => (
          <mesh key={i} position={[x, 0.62, 0.04]}>
            <boxGeometry args={[0.1, 0.28, 0.18]} />
            <meshStandardMaterial color={["#2a4a6a", "#6a2a2a", "#2a6a3a", "#5a4a2a", "#4a2a5a", "#1a5a5a", "#6a4a1a"][i]} />
          </mesh>
        ))}
        {[-0.4, -0.15, 0.1, 0.35].map((x, i) => (
          <mesh key={i} position={[x, 0.1, 0.04]}>
            <boxGeometry args={[0.12, 0.25, 0.17]} />
            <meshStandardMaterial color={["#3a5a2a", "#5a3a4a", "#2a3a6a", "#6a5a2a"][i]} />
          </mesh>
        ))}
      </group>

      {/* Water dispenser */}
      <group position={[4.3, 0, -0.5]}>
        <mesh position={[0, 0.5, 0]}><boxGeometry args={[0.35, 1, 0.3]} /><meshStandardMaterial color="#e0e0e0" /></mesh>
        <mesh position={[0, 1.15, 0]}><cylinderGeometry args={[0.12, 0.12, 0.4, 8]} /><meshStandardMaterial color="#aaddff" transparent opacity={0.5} /></mesh>
      </group>

      {/* Calendar on wall */}
      <group position={[4.85, 2, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh><boxGeometry args={[0.3, 0.4, 0.01]} /><meshStandardMaterial color="#fff" /></mesh>
        <mesh position={[0, 0.15, 0.006]}><boxGeometry args={[0.28, 0.08, 0.005]} /><meshStandardMaterial color="#cc3333" /></mesh>
      </group>

      {/* Curtain sway near window */}
      <mesh ref={curtainRef} position={[-4.9, 2.5, -0.3]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.5, 2.2]} /><meshStandardMaterial color="#e8dcc8" side={THREE.DoubleSide} />
      </mesh>

      {/* Nameplate on desk */}
      <group position={[-0.1, 0.79, -2.1]}>
        <mesh><boxGeometry args={[0.2, 0.06, 0.04]} /><meshStandardMaterial color="#5c4033" /></mesh>
      </group>

      {/* Tea/coffee on customer side */}
      <group position={[0.3, 0.79, -3]}>
        <mesh castShadow><cylinderGeometry args={[0.03, 0.025, 0.07, 8]} /><meshStandardMaterial color="#f5f5f5" /></mesh>
        <mesh position={[0, 0.005, 0]}><cylinderGeometry args={[0.05, 0.05, 0.005, 8]} /><meshStandardMaterial color="#f0ece4" /></mesh>
      </group>
    </group>
  );
}

function AmbientCafe() {
  const steamRefs = useRef<THREE.Mesh[]>([]);
  const pendantRef = useRef<THREE.Group>(null);
  const pendant2Ref = useRef<THREE.Group>(null);
  const baristaArmRef = useRef<THREE.Mesh>(null);
  const bgCustomerRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Multiple coffee steam wisps
    steamRefs.current.forEach((s, i) => {
      if (!s) return;
      const off = i * 1.1;
      const base = i < 2 ? [-0.2 + i * 0.4, -2 + i * 0.3] : [0.1, -1.8];
      s.position.y = 0.82 + ((t * 0.4 + off) % 1.5) * 0.15;
      s.position.x = base[0] + Math.sin(t * 0.8 + off) * 0.03;
      const mat = s.material as THREE.MeshStandardMaterial;
      const life = ((t * 0.4 + off) % 1.5) / 1.5;
      mat.opacity = life < 0.8 ? 0.12 * (1 - life) : 0;
      s.scale.setScalar(0.5 + life * 0.8);
    });
    if (pendantRef.current) pendantRef.current.rotation.z = Math.sin(t * 0.4) * 0.03;
    if (pendant2Ref.current) pendant2Ref.current.rotation.z = Math.sin(t * 0.35 + 1) * 0.025;
    // Barista wiping motion
    if (baristaArmRef.current) baristaArmRef.current.rotation.z = Math.sin(t * 1.5) * 0.25;
    // Background customer slight sway
    if (bgCustomerRef.current) bgCustomerRef.current.position.y = Math.sin(t * 0.6) * 0.005;
  });
  return (
    <group>
      {/* Steam wisps from both cups + counter */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => { if (el) steamRefs.current[i] = el; }} position={[0, 0.82, -2]}>
          <sphereGeometry args={[0.03, 6, 6]} /><meshStandardMaterial color="#fff" transparent opacity={0.1} />
        </mesh>
      ))}
      {/* Pendant light sway */}
      <group ref={pendantRef} position={[0, 3.8, -2]}>
        <mesh position={[0, -0.2, 0]}><cylinderGeometry args={[0.005, 0.005, 0.4, 4]} /><meshStandardMaterial color="#333" /></mesh>
      </group>
      <group ref={pendant2Ref} position={[2, 3.8, -3]}>
        <mesh position={[0, -0.2, 0]}><cylinderGeometry args={[0.005, 0.005, 0.35, 4]} /><meshStandardMaterial color="#333" /></mesh>
      </group>

      {/* Barista behind counter */}
      <group position={[-4, 0, -3.5]}>
        <mesh position={[0, 1.1, 0]} castShadow><boxGeometry args={[0.38, 0.5, 0.22]} /><meshStandardMaterial color="#3a6a3a" /></mesh>
        <mesh position={[0, 1.5, 0]} castShadow><sphereGeometry args={[0.14, 12, 12]} /><meshStandardMaterial color="#deb887" /></mesh>
        <mesh position={[0, 1.56, -0.02]}><sphereGeometry args={[0.13, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#2c1810" /></mesh>
        {/* Apron */}
        <mesh position={[0, 0.9, 0.12]}><boxGeometry args={[0.34, 0.4, 0.01]} /><meshStandardMaterial color="#f5f0e8" /></mesh>
        {/* Wiping arm */}
        <mesh ref={baristaArmRef} position={[0.25, 1.0, 0.08]} castShadow><boxGeometry args={[0.1, 0.35, 0.1]} /><meshStandardMaterial color="#3a6a3a" /></mesh>
        <mesh position={[-0.25, 1.0, 0.05]} castShadow><boxGeometry args={[0.1, 0.35, 0.1]} /><meshStandardMaterial color="#3a6a3a" /></mesh>
      </group>

      {/* Espresso machine on counter */}
      <group position={[-4.5, 1.15, -3]}>
        <mesh castShadow><boxGeometry args={[0.4, 0.35, 0.25]} /><meshStandardMaterial color="#c0c0c0" metalness={0.5} /></mesh>
        <mesh position={[0.15, 0.15, 0.13]}><cylinderGeometry args={[0.015, 0.015, 0.08, 6]} /><meshStandardMaterial color="#888" metalness={0.7} /></mesh>
        <mesh position={[-0.1, 0.2, 0.02]}><sphereGeometry args={[0.03, 6, 6]} /><meshStandardMaterial color="#111" /></mesh>
      </group>

      {/* Pastry display case */}
      <group position={[-3.5, 1.15, -2.8]}>
        <mesh castShadow><boxGeometry args={[0.5, 0.3, 0.3]} /><meshStandardMaterial color="#ddd" transparent opacity={0.3} /></mesh>
        {/* Pastries inside */}
        <mesh position={[-0.1, -0.05, 0]}><sphereGeometry args={[0.05, 6, 6]} /><meshStandardMaterial color="#d4a060" /></mesh>
        <mesh position={[0.1, -0.05, 0.05]}><sphereGeometry args={[0.04, 6, 6]} /><meshStandardMaterial color="#8B4513" /></mesh>
      </group>

      {/* Background customer at far table */}
      <group ref={bgCustomerRef} position={[3.5, 0, -3.5]}>
        <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.35, 0.35, 0.03, 12]} /><meshStandardMaterial color="#5c4033" /></mesh>
        <mesh position={[0, 0.36, 0]}><cylinderGeometry args={[0.03, 0.03, 0.72, 6]} /><meshStandardMaterial color="#4a3728" /></mesh>
        {/* Seated person */}
        <mesh position={[0.2, 1.0, 0.3]}><boxGeometry args={[0.3, 0.4, 0.2]} /><meshStandardMaterial color="#5a3a6a" /></mesh>
        <mesh position={[0.2, 1.35, 0.3]}><sphereGeometry args={[0.12, 10, 10]} /><meshStandardMaterial color="#deb887" /></mesh>
        {/* Their laptop */}
        <mesh position={[0.15, 0.77, 0.05]} rotation={[-0.3, 0, 0]}><boxGeometry args={[0.25, 0.17, 0.008]} /><meshStandardMaterial color="#ccc" /></mesh>
        <mesh position={[0.15, 0.75, 0.15]}><boxGeometry args={[0.25, 0.008, 0.17]} /><meshStandardMaterial color="#bbb" /></mesh>
      </group>

      {/* Menu board on wall */}
      <group position={[-5.85, 2.2, -2]} rotation={[0, Math.PI / 2, 0]}>
        <mesh><boxGeometry args={[1.2, 0.8, 0.03]} /><meshStandardMaterial color="#1a1a0a" /></mesh>
      </group>
      <Html position={[-5.8, 2.2, -2]} rotation={[0, Math.PI / 2, 0]} center>
        <div className="pointer-events-none select-none text-center">
          <p className="text-[10px] font-bold text-yellow-100" style={{ fontFamily: "serif" }}>MENU</p>
          <p className="text-[8px] text-yellow-100/50">Latte ¥480</p>
          <p className="text-[8px] text-yellow-100/50">Cappuccino ¥500</p>
        </div>
      </Html>

      {/* Sugar pot & napkin holder on table */}
      <mesh position={[0.15, 0.78, -2.15]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.05, 6]} /><meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[-0.15, 0.77, -2.2]} castShadow>
        <boxGeometry args={[0.08, 0.06, 0.04]} /><meshStandardMaterial color="#5c4033" />
      </mesh>

      {/* Floor plant */}
      <group position={[5, 0, -1]}>
        <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.15, 0.18, 0.4, 8]} /><meshStandardMaterial color="#6B5842" /></mesh>
        <mesh position={[0, 0.7, 0]}><sphereGeometry args={[0.3, 8, 8]} /><meshStandardMaterial color="#2d6a27" /></mesh>
      </group>
    </group>
  );
}

function AmbientExhibition() {
  const walkerRefs = useRef<THREE.Group[]>([]);
  const spotRef = useRef<THREE.Mesh>(null);
  const neighborLedRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // 4 passersby walking at different speeds & depths
    const speeds = [0.4, 0.3, 0.5, 0.25];
    const offsets = [0, 3, 1.5, 5];
    const zPositions = [4, 5, 4.5, 5.5];
    walkerRefs.current.forEach((w, i) => {
      if (!w) return;
      const dir = i % 2 === 0 ? 1 : -1;
      const x = (((t * speeds[i] + offsets[i]) % 10) - 5) * dir;
      w.position.set(x, 0, zPositions[i]);
      w.visible = Math.abs(x) < 5;
      // Subtle walking bob
      w.position.y = Math.abs(Math.sin(t * speeds[i] * 8)) * 0.02;
    });
    if (spotRef.current) (spotRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + Math.sin(t * 0.8) * 0.15;
    if (neighborLedRef.current) {
      (neighborLedRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2 + Math.sin(t * 1.2 + 2) * 0.2;
    }
  });

  const walkerColors = [
    ["#2a2a4a", "#3a3a5a"], ["#4a2a2a", "#5a3a3a"],
    ["#2a4a2a", "#3a5a3a"], ["#3a3a2a", "#4a4a3a"],
  ];

  return (
    <group>
      {/* 4 passersby with varied looks */}
      {walkerColors.map((cols, i) => (
        <group key={i} ref={(el) => { if (el) walkerRefs.current[i] = el; }}>
          <mesh position={[0, 0.9, 0]}><capsuleGeometry args={[0.12, 0.5, 4, 8]} /><meshStandardMaterial color={cols[0]} /></mesh>
          <mesh position={[0, 1.5, 0]}><sphereGeometry args={[0.1, 8, 8]} /><meshStandardMaterial color={cols[1]} /></mesh>
          {/* Some carry bags */}
          {i % 2 === 0 && (
            <mesh position={[0.15, 0.6, 0]}><boxGeometry args={[0.15, 0.2, 0.06]} /><meshStandardMaterial color="#555" /></mesh>
          )}
        </group>
      ))}

      {/* Booth monitor glow pulse */}
      <mesh ref={spotRef} position={[0, 2.2, -3.9]}>
        <boxGeometry args={[1.5, 0.85, 0.01]} /><meshStandardMaterial color="#003366" emissive="#0066cc" emissiveIntensity={0.3} transparent opacity={0.4} />
      </mesh>

      {/* Neighboring booth (left) */}
      <group position={[-5, 0, -2]}>
        <mesh position={[0, 1.5, 0]}><boxGeometry args={[2, 3, 0.08]} /><meshStandardMaterial color="#6a2a4a" /></mesh>
        <mesh position={[0, 0.9, 1]}><boxGeometry args={[1.5, 0.06, 0.6]} /><meshStandardMaterial color="#fff" /></mesh>
        {/* Staff person */}
        <mesh position={[0, 1.1, 0.5]}><boxGeometry args={[0.35, 0.5, 0.2]} /><meshStandardMaterial color="#2a4a6a" /></mesh>
        <mesh position={[0, 1.5, 0.5]}><sphereGeometry args={[0.12, 10, 10]} /><meshStandardMaterial color="#deb887" /></mesh>
      </group>

      {/* Neighboring booth (right) with blinking screen */}
      <group position={[5, 0, -2]}>
        <mesh position={[0, 1.5, 0]}><boxGeometry args={[2, 3, 0.08]} /><meshStandardMaterial color="#2a4a6a" /></mesh>
        <mesh ref={neighborLedRef} position={[0, 2, 0.05]}>
          <boxGeometry args={[0.8, 0.5, 0.02]} /><meshStandardMaterial color="#112233" emissive="#0044aa" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Overhead direction signs */}
      <group position={[0, 3.8, 3]}>
        <mesh><boxGeometry args={[2, 0.3, 0.03]} /><meshStandardMaterial color="#1a3a6e" /></mesh>
      </group>
      <Html position={[0, 3.8, 3.02]} center>
        <div className="pointer-events-none select-none">
          <p className="text-[8px] font-bold text-white">A-Hall &rarr; IoT / DX Zone</p>
        </div>
      </Html>

      {/* Floor direction tape */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 2]}>
        <planeGeometry args={[0.1, 4]} /><meshStandardMaterial color="#ffcc00" />
      </mesh>

      {/* Brochure stand */}
      <group position={[1.8, 0, 0.5]}>
        <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.03, 0.05, 1.2, 6]} /><meshStandardMaterial color="#888" /></mesh>
        {[0, 0.2, 0.4].map((y, i) => (
          <mesh key={i} position={[0, 0.8 + y, 0.08]} rotation={[-0.3, 0, 0]}>
            <boxGeometry args={[0.2, 0.14, 0.005]} /><meshStandardMaterial color={["#ff6b35", "#35a0ff", "#35ff6b"][i]} />
          </mesh>
        ))}
      </group>

      {/* Swag bags on counter */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.98, -1.2]} castShadow>
          <boxGeometry args={[0.15, 0.18, 0.08]} /><meshStandardMaterial color={i === 0 ? "#fff" : "#1a3a6e"} />
        </mesh>
      ))}

      {/* Name badge on counter */}
      <mesh position={[0, 0.96, -1.1]} rotation={[-Math.PI / 2, 0, 0.1]}>
        <boxGeometry args={[0.08, 0.12, 0.002]} /><meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[0, 0.97, -1]} rotation={[-Math.PI / 2, 0, 0.1]}>
        <boxGeometry args={[0.01, 0.4, 0.002]} /><meshStandardMaterial color="#1a3a6e" />
      </mesh>
    </group>
  );
}

function AmbientOnline() {
  const notifRef = useRef<THREE.Mesh>(null);
  const screenGlow = useRef<THREE.PointLight>(null);
  const phoneRef = useRef<THREE.Group>(null);
  const clockHandRef = useRef<THREE.Mesh>(null);
  const curtainRef = useRef<THREE.Mesh>(null);
  const mugSteamRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (notifRef.current) {
      const blink = Math.sin(t * 0.8) > 0.95;
      (notifRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = blink ? 1 : 0.1;
    }
    if (screenGlow.current) screenGlow.current.intensity = 0.15 + Math.sin(t * 1.5) * 0.05;
    // Phone vibrate occasionally
    if (phoneRef.current) {
      const buzz = Math.sin(t * 0.3) > 0.93;
      phoneRef.current.rotation.z = buzz ? Math.sin(t * 30) * 0.03 : 0;
    }
    if (clockHandRef.current) clockHandRef.current.rotation.z = -t * 1.05;
    if (curtainRef.current) curtainRef.current.position.x = 3.88 + Math.sin(t * 0.2) * 0.015;
    // Mug steam
    if (mugSteamRef.current) {
      mugSteamRef.current.position.y = 0.88 + ((t * 0.3) % 1) * 0.1;
      (mugSteamRef.current.material as THREE.MeshStandardMaterial).opacity = 0.1 * (1 - ((t * 0.3) % 1));
      mugSteamRef.current.scale.setScalar(0.5 + ((t * 0.3) % 1) * 0.8);
    }
  });
  return (
    <group>
      {/* Notification LED */}
      <mesh ref={notifRef} position={[1.2, 0.88, -1.2]}>
        <sphereGeometry args={[0.012, 6, 6]} /><meshStandardMaterial color="#ff4444" emissive="#ff2222" emissiveIntensity={0.1} />
      </mesh>
      <pointLight ref={screenGlow} position={[0, 1.3, -1.8]} color="#aaccff" intensity={0.15} distance={2} />

      {/* Smartphone on desk */}
      <group ref={phoneRef} position={[0.8, 0.76, 0.05]}>
        <mesh><boxGeometry args={[0.06, 0.005, 0.12]} /><meshStandardMaterial color="#1a1a2e" /></mesh>
        <mesh position={[0, 0.004, 0]}><boxGeometry args={[0.05, 0.002, 0.1]} /><meshStandardMaterial color="#222244" emissive="#333366" emissiveIntensity={0.2} /></mesh>
      </group>

      {/* Wall clock */}
      <group position={[-3.9, 2.8, -1]} rotation={[0, Math.PI / 2, 0]}>
        <mesh><circleGeometry args={[0.18, 16]} /><meshStandardMaterial color="#f5f5f5" /></mesh>
        <mesh position={[0, 0, -0.005]}><circleGeometry args={[0.19, 16]} /><meshStandardMaterial color="#666" /></mesh>
        <mesh ref={clockHandRef} position={[0, 0, 0.01]}>
          <boxGeometry args={[0.006, 0.12, 0.004]} /><meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0, 0, 0.015]}><circleGeometry args={[0.01, 6]} /><meshStandardMaterial color="#222" /></mesh>
      </group>

      {/* Curtain near window - sways gently */}
      <mesh ref={curtainRef} position={[3.88, 2.3, -0.3]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.5, 2.2]} /><meshStandardMaterial color="#e0d8c8" side={THREE.DoubleSide} />
      </mesh>

      {/* Desk lamp */}
      <group position={[-0.85, 0.76, -1.3]}>
        <mesh position={[0, 0, 0]} castShadow><cylinderGeometry args={[0.06, 0.07, 0.02, 8]} /><meshStandardMaterial color="#333" /></mesh>
        <mesh position={[0, 0.15, 0]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.008, 0.008, 0.3, 4]} /><meshStandardMaterial color="#555" /></mesh>
        <mesh position={[0.08, 0.28, 0]} rotation={[0, 0, 0.5]}><coneGeometry args={[0.06, 0.08, 8]} /><meshStandardMaterial color="#444" /></mesh>
      </group>

      {/* Sticky notes on monitor bezel */}
      <mesh position={[-0.48, 1.35, -0.29]} rotation={[-0.1, 0, 0.05]}>
        <planeGeometry args={[0.06, 0.06]} /><meshStandardMaterial color="#ffee55" />
      </mesh>
      <mesh position={[-0.48, 1.27, -0.29]} rotation={[-0.1, 0, -0.03]}>
        <planeGeometry args={[0.06, 0.06]} /><meshStandardMaterial color="#ff9999" />
      </mesh>

      {/* Coffee mug steam */}
      <mesh ref={mugSteamRef} position={[0.75, 0.88, -0.1]}>
        <sphereGeometry args={[0.02, 6, 6]} /><meshStandardMaterial color="#fff" transparent opacity={0.1} />
      </mesh>

      {/* Small plant on desk */}
      <group position={[-0.9, 0.76, -1.0]}>
        <mesh castShadow><cylinderGeometry args={[0.03, 0.035, 0.06, 6]} /><meshStandardMaterial color="#8B6F47" /></mesh>
        <mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.04, 6, 6]} /><meshStandardMaterial color="#2d6a27" /></mesh>
      </group>

      {/* Calendar / poster on wall behind */}
      <group position={[1.5, 2.2, -2.9]}>
        <mesh><boxGeometry args={[0.5, 0.35, 0.005]} /><meshStandardMaterial color="#fff" /></mesh>
        <mesh position={[0, 0.13, 0.003]}><boxGeometry args={[0.48, 0.06, 0.003]} /><meshStandardMaterial color="#3366cc" /></mesh>
      </group>
    </group>
  );
}

function AmbientRestaurant() {
  const grillGlow = useRef<THREE.Mesh>(null);
  const smokeRefs = useRef<THREE.Mesh[]>([]);
  const lanternRefs = useRef<THREE.Group[]>([]);
  const ownerArmRef = useRef<THREE.Mesh>(null);
  const tvGlowRef = useRef<THREE.Mesh>(null);
  const beerTapRef = useRef<THREE.Mesh>(null);
  const bgCustomerRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Grill coals flickering
    if (grillGlow.current) {
      (grillGlow.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.4 + Math.sin(t * 3) * 0.2 + Math.sin(t * 7) * 0.1;
    }
    // Smoke wisps
    smokeRefs.current.forEach((s, i) => {
      if (!s) return;
      const offset = i * 1.3;
      const cycle = ((t * 0.3 + offset) % 3);
      s.position.y = 1.15 + cycle * 0.5;
      s.position.x = 2 + Math.sin(t * 0.5 + offset) * 0.2;
      const mat = s.material as THREE.MeshStandardMaterial;
      mat.opacity = cycle < 2 ? 0.15 * (1 - cycle / 2) : 0;
      s.scale.setScalar(0.5 + cycle * 0.5);
    });
    // Lanterns sway
    lanternRefs.current.forEach((l, i) => {
      if (!l) return;
      l.rotation.z = Math.sin(t * 0.6 + i * 2) * 0.04;
    });
    // Owner chopping/cooking motion
    if (ownerArmRef.current) {
      ownerArmRef.current.rotation.x = Math.sin(t * 2.5) * 0.2 - 0.3;
    }
    // TV screen flicker
    if (tvGlowRef.current) {
      (tvGlowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.25 + Math.sin(t * 4) * 0.05 + Math.sin(t * 11) * 0.03;
    }
    // Beer tap drip
    if (beerTapRef.current) {
      beerTapRef.current.scale.y = 0.8 + Math.abs(Math.sin(t * 0.5)) * 0.4;
    }
    // Background customer sway
    if (bgCustomerRef.current) bgCustomerRef.current.position.y = Math.sin(t * 0.4) * 0.005;
  });
  return (
    <group>
      {/* Grill glow overlay */}
      <mesh ref={grillGlow} position={[2, 0.97, -3.5]}>
        <boxGeometry args={[0.65, 0.03, 0.25]} />
        <meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={0.4} transparent opacity={0.7} />
      </mesh>
      {/* Yakitori skewers on grill */}
      {[-0.2, -0.05, 0.1, 0.25].map((x, i) => (
        <mesh key={i} position={[2 + x, 1.02, -3.5]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.005, 0.005, 0.25, 4]} /><meshStandardMaterial color="#8B6F47" />
        </mesh>
      ))}
      {/* Grilled meat on skewers */}
      {[-0.2, -0.05, 0.1, 0.25].map((x, i) => (
        <group key={i}>
          <mesh position={[2 + x, 1.03, -3.45]}><sphereGeometry args={[0.015, 4, 4]} /><meshStandardMaterial color="#8B4513" /></mesh>
          <mesh position={[2 + x, 1.03, -3.55]}><sphereGeometry args={[0.015, 4, 4]} /><meshStandardMaterial color="#8B4513" /></mesh>
        </group>
      ))}

      {/* Smoke wisps */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} ref={(el) => { if (el) smokeRefs.current[i] = el; }} position={[2, 1.15, -3.5]}>
          <sphereGeometry args={[0.05, 6, 6]} /><meshStandardMaterial color="#ccbbaa" transparent opacity={0.1} />
        </mesh>
      ))}

      {/* Lanterns sway (markers) */}
      {[-2, 0, 2].map((x, i) => (
        <group key={i} ref={(el) => { if (el) lanternRefs.current[i] = el; }} position={[x, 3.2, -2]}>
          <mesh><sphereGeometry args={[0.01, 4, 4]} /><meshStandardMaterial transparent opacity={0} /></mesh>
        </group>
      ))}

      {/* Owner's cooking arm animation */}
      <mesh ref={ownerArmRef} position={[0.3, 0.95, -3.05]} castShadow>
        <boxGeometry args={[0.12, 0.4, 0.14]} /><meshStandardMaterial color="#f5f0e8" />
      </mesh>

      {/* TV on upper wall showing sports */}
      <group position={[3.5, 2.8, -3.9]}>
        <mesh><boxGeometry args={[0.8, 0.5, 0.04]} /><meshStandardMaterial color="#111" /></mesh>
        <mesh ref={tvGlowRef} position={[0, 0, 0.025]}>
          <planeGeometry args={[0.72, 0.42]} /><meshStandardMaterial color="#112244" emissive="#2244aa" emissiveIntensity={0.25} />
        </mesh>
      </group>

      {/* Beer taps */}
      <group position={[-1.5, 1.2, -3.7]}>
        {[0, 0.15, 0.3].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            <mesh castShadow><cylinderGeometry args={[0.025, 0.025, 0.2, 6]} /><meshStandardMaterial color={["#ffcc00", "#222", "#cc4400"][i]} /></mesh>
            <mesh position={[0, -0.12, 0.03]}><cylinderGeometry args={[0.01, 0.01, 0.05, 4]} /><meshStandardMaterial color="#888" metalness={0.7} /></mesh>
          </group>
        ))}
        {/* Drip */}
        <mesh ref={beerTapRef} position={[0, -0.17, 0.03]}>
          <sphereGeometry args={[0.005, 4, 4]} /><meshStandardMaterial color="#ffcc00" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Sake barrels (樽) */}
      <group position={[-2.5, 0, -3.8]}>
        <mesh position={[0, 0.25, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.3, 8]} /><meshStandardMaterial color="#5c4033" />
        </mesh>
        <mesh position={[0.35, 0.25, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.25, 8]} /><meshStandardMaterial color="#4a3520" />
        </mesh>
      </group>

      {/* Background customer at far end of counter */}
      <group ref={bgCustomerRef} position={[-2, 0, -1.5]}>
        <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.15, 0.15, 0.04, 8]} /><meshStandardMaterial color="#4a3520" /></mesh>
        <mesh position={[0, 1.05, 0]}><boxGeometry args={[0.35, 0.5, 0.2]} /><meshStandardMaterial color="#4a5a3a" /></mesh>
        <mesh position={[0, 1.45, 0]}><sphereGeometry args={[0.14, 10, 10]} /><meshStandardMaterial color="#deb887" /></mesh>
        {/* Their beer glass */}
        <mesh position={[0.2, 0.96, -0.4]}>
          <cylinderGeometry args={[0.03, 0.025, 0.1, 6]} /><meshStandardMaterial color="#ffdd44" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Oshibori (wet towel) on counter */}
      {[-0.2, 1.0].map((x, i) => (
        <mesh key={i} position={[x, 0.96, -2.2]} rotation={[0, 0.2 * i, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 4]} /><meshStandardMaterial color="#f5f5f5" />
        </mesh>
      ))}

      {/* Ashtray (灰皿) */}
      <mesh position={[1.2, 0.96, -2.2]} castShadow>
        <cylinderGeometry args={[0.04, 0.035, 0.02, 8]} /><meshStandardMaterial color="#888" metalness={0.4} />
      </mesh>

      {/* Small dish (お通し皿) */}
      <mesh position={[0.5, 0.96, -2.15]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.015, 8]} /><meshStandardMaterial color="#e8dcc8" />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCENE REACTIONS — per-scene animated effects after choice
═══════════════════════════════════════════════════════════════ */

/** Floating score particle (+10, -5 etc) */
function ScoreParticle({ score, position }: { score: number; position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  const startY = useRef(position[1]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime % 100;
    ref.current.position.y = startY.current + t * 0.15;
  });
  return (
    <group ref={ref} position={position}>
      <Html center distanceFactor={3}>
        <div className={`pointer-events-none select-none text-xl font-black ${score > 0 ? "text-green-400" : score < 0 ? "text-red-400" : "text-yellow-400"}`}
          style={{ textShadow: "0 0 8px rgba(0,0,0,0.8)", animation: "fadeUp 2s ease-out forwards" }}>
          {score > 0 ? `+${score}` : score}
        </div>
      </Html>
    </group>
  );
}

function ReactionOffice({ quality }: { quality: ChoiceQuality }) {
  const stampRef = useRef<THREE.Group>(null);
  const docRef = useRef<THREE.Mesh>(null);
  const penTapRef = useRef<THREE.Mesh>(null);
  const cupRef = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    if (quality === "excellent") {
      // Customer taps desk approvingly, document slides forward
      if (docRef.current) {
        docRef.current.position.z = -2.8 + Math.min(t * 0.3, 0.4);
        docRef.current.rotation.z = Math.sin(t * 2) * 0.01;
      }
      if (stampRef.current) {
        // Approval stamp comes down
        stampRef.current.position.y = 1.0 + Math.max(0, 0.3 - t * 0.5);
        stampRef.current.rotation.x = Math.min(t * 2, 0.3);
      }
    } else if (quality === "good") {
      // Pen tapping thoughtfully
      if (penTapRef.current) {
        penTapRef.current.position.y = 0.82 + Math.abs(Math.sin(t * 4)) * 0.03;
        penTapRef.current.rotation.z = Math.sin(t * 4) * 0.1;
      }
    } else if (quality === "neutral") {
      // Coffee cup picked up
      if (cupRef.current) {
        cupRef.current.position.y = 0.82 + Math.min(t * 0.15, 0.15);
        cupRef.current.rotation.x = Math.min(t * 0.3, 0.2);
      }
    } else {
      // Papers pushed aside
      if (docRef.current) {
        docRef.current.position.x = Math.min(t * 0.5, 0.5);
        docRef.current.rotation.z = Math.min(t * 0.3, 0.2);
      }
    }
  });
  return (
    <group>
      {(quality === "excellent") && (
        <>
          <mesh ref={docRef} position={[-0.3, 0.8, -2.8]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.22, 0.3]} /><meshStandardMaterial color="#faf8f0" />
          </mesh>
          <group ref={stampRef} position={[-0.3, 1.3, -3]}>
            <mesh><cylinderGeometry args={[0.03, 0.03, 0.06, 8]} /><meshStandardMaterial color="#8B4513" /></mesh>
          </group>
        </>
      )}
      {quality === "good" && (
        <mesh ref={penTapRef} position={[0.2, 0.82, -3.2]} rotation={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.15, 4]} /><meshStandardMaterial color="#1a1a6e" />
        </mesh>
      )}
      {quality === "neutral" && (
        <mesh ref={cupRef} position={[0.3, 0.82, -3]}>
          <cylinderGeometry args={[0.03, 0.025, 0.08, 8]} /><meshStandardMaterial color="#f5f5f5" />
        </mesh>
      )}
      {quality === "bad" && (
        <mesh ref={docRef} position={[0, 0.8, -2.7]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 0.28]} /><meshStandardMaterial color="#faf8f5" />
        </mesh>
      )}
    </group>
  );
}

function ReactionCafe({ quality }: { quality: ChoiceQuality }) {
  const cupRef = useRef<THREE.Group>(null);
  const phoneRef = useRef<THREE.Mesh>(null);
  const napkinRef = useRef<THREE.Mesh>(null);
  const cardRef = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    if (quality === "excellent") {
      // Customer picks up cup to toast, card slides across
      if (cupRef.current) {
        cupRef.current.position.y = Math.min(t * 0.15, 0.2);
        cupRef.current.rotation.x = -Math.min(t * 0.2, 0.15);
      }
      if (cardRef.current) {
        cardRef.current.position.z = -1.8 + Math.min(t * 0.2, 0.3);
      }
    } else if (quality === "good") {
      // Napkin unfolded casually
      if (napkinRef.current) {
        napkinRef.current.scale.x = 1 + Math.min(t * 0.3, 0.5);
        napkinRef.current.rotation.z = Math.sin(t * 0.8) * 0.03;
      }
    } else if (quality === "neutral") {
      // Customer glances at phone
      if (phoneRef.current) {
        phoneRef.current.position.y = 0.76 + Math.min(t * 0.1, 0.1);
        phoneRef.current.rotation.x = -Math.min(t * 0.5, 0.5);
      }
    } else {
      // Cup pushed away
      if (cupRef.current) {
        cupRef.current.position.z = Math.min(t * 0.15, 0.2);
        cupRef.current.rotation.z = Math.min(t * 0.1, 0.05);
      }
    }
  });
  return (
    <group>
      {(quality === "excellent" || quality === "bad") && (
        <group ref={cupRef} position={[0.2, 0, -2.1]}>
          <mesh position={[0, 0.78, 0]}><cylinderGeometry args={[0.04, 0.035, 0.08, 8]} /><meshStandardMaterial color="#f5f5f5" /></mesh>
        </group>
      )}
      {quality === "excellent" && (
        <mesh ref={cardRef} position={[0.1, 0.76, -2.1]} rotation={[-Math.PI / 2, 0, 0.1]}>
          <planeGeometry args={[0.09, 0.055]} /><meshStandardMaterial color="#f5f0e8" />
        </mesh>
      )}
      {quality === "good" && (
        <mesh ref={napkinRef} position={[-0.15, 0.76, -1.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, 0.1]} /><meshStandardMaterial color="#fff" />
        </mesh>
      )}
      {quality === "neutral" && (
        <mesh ref={phoneRef} position={[-0.3, 0.76, -2.3]}>
          <boxGeometry args={[0.06, 0.005, 0.1]} /><meshStandardMaterial color="#1a1a2e" />
        </mesh>
      )}
    </group>
  );
}

function ReactionExhibition({ quality }: { quality: ChoiceQuality }) {
  const brochureRef = useRef<THREE.Mesh>(null);
  const stepRef = useRef<THREE.Group>(null);
  const watchRef = useRef<THREE.Mesh>(null);
  const turnRef = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    if (quality === "excellent") {
      // Customer steps closer, reaches for brochure
      if (stepRef.current) stepRef.current.position.z = -3.5 + Math.min(t * 0.3, 0.5);
      if (brochureRef.current) {
        brochureRef.current.position.y = 0.96 + Math.min(t * 0.1, 0.15);
        brochureRef.current.rotation.x = -Math.min(t * 0.3, 0.3);
      }
    } else if (quality === "good") {
      // Customer leans in to look at monitor
      if (stepRef.current) {
        stepRef.current.position.z = -3.5 + Math.min(t * 0.15, 0.2);
        stepRef.current.rotation.x = -Math.min(t * 0.05, 0.05);
      }
    } else if (quality === "neutral") {
      // Customer checks watch
      if (watchRef.current) {
        watchRef.current.position.y = 1.1 + Math.min(t * 0.15, 0.2);
        watchRef.current.rotation.x = -Math.min(t * 0.5, 0.8);
      }
    } else {
      // Customer turns body away
      if (turnRef.current) turnRef.current.rotation.y = Math.min(t * 0.3, 0.5);
    }
  });
  return (
    <group>
      {(quality === "excellent" || quality === "good") && (
        <group ref={stepRef} position={[0, 0, -3.5]}>
          <mesh><sphereGeometry args={[0.01, 4, 4]} /><meshStandardMaterial transparent opacity={0} /></mesh>
        </group>
      )}
      {quality === "excellent" && (
        <mesh ref={brochureRef} position={[0, 0.96, -1.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 0.28]} /><meshStandardMaterial color="#ff6b35" />
        </mesh>
      )}
      {quality === "neutral" && (
        <mesh ref={watchRef} position={[0.3, 1.1, -3.3]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.005, 8]} /><meshStandardMaterial color="#c0c0c0" metalness={0.7} />
        </mesh>
      )}
      {quality === "bad" && (
        <group ref={turnRef} position={[0, 0, -3.5]}>
          <mesh><sphereGeometry args={[0.01, 4, 4]} /><meshStandardMaterial transparent opacity={0} /></mesh>
        </group>
      )}
    </group>
  );
}

function ReactionOnline({ quality }: { quality: ChoiceQuality }) {
  const screenFlashRef = useRef<THREE.Mesh>(null);
  const thumbRef = useRef<THREE.Mesh>(null);
  const muteRef = useRef<THREE.Mesh>(null);
  const chatRef = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    if (quality === "excellent") {
      // Screen brightens, thumbs up, chat message appears
      if (screenFlashRef.current) {
        (screenFlashRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
          0.5 + Math.max(0, 0.5 - t * 0.3);
      }
      if (thumbRef.current) {
        thumbRef.current.position.y = 1.1 + Math.min(t * 0.15, 0.12);
        thumbRef.current.scale.setScalar(Math.min(t * 2, 1));
      }
      if (chatRef.current) {
        chatRef.current.position.x = 0.35 - Math.min(t * 0.15, 0.08);
        chatRef.current.scale.setScalar(Math.min(t * 1.5, 1));
      }
    } else if (quality === "good") {
      // Screen normal, subtle nod effect (screen glow pulse)
      if (screenFlashRef.current) {
        (screenFlashRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
          0.3 + Math.sin(t * 3) * 0.1;
      }
    } else if (quality === "neutral") {
      // Customer looks away (screen dims slightly)
      if (screenFlashRef.current) {
        (screenFlashRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
          Math.max(0.1, 0.4 - t * 0.15);
      }
    } else {
      // Mute icon appears, screen darkens
      if (screenFlashRef.current) {
        (screenFlashRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
          Math.max(0.05, 0.4 - t * 0.2);
      }
      if (muteRef.current) {
        muteRef.current.scale.setScalar(Math.min(t * 2, 1));
      }
    }
  });
  return (
    <group>
      {/* Screen glow overlay on monitor */}
      <mesh ref={screenFlashRef} position={[0, 1.2, -1.77]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[0.9, 0.5]} />
        <meshStandardMaterial color={
          quality === "excellent" ? "#1a3a2a" : quality === "bad" ? "#3a1a1a" : "#1a2a3a"
        } emissive={
          quality === "excellent" ? "#22aa44" : quality === "bad" ? "#aa2222" : "#3366aa"
        } emissiveIntensity={0.3} transparent opacity={0.3} />
      </mesh>

      {quality === "excellent" && (
        <>
          <mesh ref={thumbRef} position={[0.25, 1.1, -1.76]} rotation={[-0.1, 0, 0]} scale={0}>
            <circleGeometry args={[0.04, 8]} /><meshStandardMaterial color="#44aa44" />
          </mesh>
          <group ref={chatRef} position={[0.35, 0.98, -1.76]} scale={0}>
            <mesh rotation={[-0.1, 0, 0]}>
              <planeGeometry args={[0.18, 0.04]} /><meshStandardMaterial color="#335588" />
            </mesh>
          </group>
        </>
      )}

      {quality === "bad" && (
        <mesh ref={muteRef} position={[-0.3, 0.97, -1.76]} rotation={[-0.1, 0, 0]} scale={0}>
          <circleGeometry args={[0.025, 8]} /><meshStandardMaterial color="#cc3333" />
        </mesh>
      )}
    </group>
  );
}

function ReactionRestaurant({ quality }: { quality: ChoiceQuality }) {
  const bottleRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const dishRef = useRef<THREE.Group>(null);
  const towelRef = useRef<THREE.Mesh>(null);
  const knifeRef = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    if (quality === "excellent") {
      // Owner pours a drink (bottle tips, glass fills)
      if (bottleRef.current) {
        bottleRef.current.rotation.z = Math.min(t * 0.5, 0.8);
        bottleRef.current.position.x = 0.2 + Math.min(t * 0.1, 0.15);
      }
      if (glassRef.current) {
        glassRef.current.scale.y = Math.min(t * 0.5, 1);
      }
      // Bonus dish served
      if (dishRef.current && t > 1) {
        dishRef.current.position.z = -2.5 + Math.min((t - 1) * 0.3, 0.4);
        dishRef.current.visible = true;
      }
    } else if (quality === "good") {
      // Owner nods, places oshibori closer
      if (towelRef.current) {
        towelRef.current.position.z = -2.3 + Math.min(t * 0.15, 0.2);
      }
    } else if (quality === "neutral") {
      // Owner keeps chopping (knife visible)
      if (knifeRef.current) {
        knifeRef.current.position.y = 1.05 + Math.abs(Math.sin(t * 4)) * 0.08;
      }
    } else {
      // Owner turns back, picks up knife aggressively
      if (knifeRef.current) {
        knifeRef.current.position.y = 1.0 + Math.abs(Math.sin(t * 6)) * 0.12;
        knifeRef.current.rotation.z = Math.sin(t * 6) * 0.15;
      }
      if (bottleRef.current) {
        // Pulls bottle away
        bottleRef.current.position.z = -3.8 - Math.min(t * 0.1, 0.2);
      }
    }
  });
  return (
    <group>
      {(quality === "excellent" || quality === "bad") && (
        <group ref={bottleRef} position={[0.2, 1.2, -3.2]}>
          <mesh><cylinderGeometry args={[0.02, 0.025, 0.25, 6]} /><meshStandardMaterial color="#2a5a2a" /></mesh>
        </group>
      )}
      {quality === "excellent" && (
        <>
          <mesh ref={glassRef} position={[0.3, 0.97, -2.3]} scale={[1, 0, 1]}>
            <cylinderGeometry args={[0.025, 0.02, 0.08, 8]} /><meshStandardMaterial color="#ffdd44" transparent opacity={0.5} />
          </mesh>
          <group ref={dishRef} position={[0, 0.97, -2.5]} visible={false}>
            <mesh><cylinderGeometry args={[0.07, 0.07, 0.015, 8]} /><meshStandardMaterial color="#e8dcc8" /></mesh>
            <mesh position={[0, 0.015, 0]}><sphereGeometry args={[0.025, 6, 6]} /><meshStandardMaterial color="#8B4513" /></mesh>
            <mesh position={[0.03, 0.015, 0.02]}><sphereGeometry args={[0.02, 6, 6]} /><meshStandardMaterial color="#6B8E23" /></mesh>
          </group>
        </>
      )}
      {quality === "good" && (
        <mesh ref={towelRef} position={[0.1, 0.96, -2.3]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 4]} /><meshStandardMaterial color="#f5f5f5" />
        </mesh>
      )}
      {(quality === "neutral" || quality === "bad") && (
        <mesh ref={knifeRef} position={[0.4, 1.05, -3.2]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.015, 0.18, 0.005]} /><meshStandardMaterial color="#ccc" metalness={0.8} />
        </mesh>
      )}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED: Speech Bubble
═══════════════════════════════════════════════════════════════ */

function SpeechBubble({ text, position }: { text: string; position: [number, number, number] }) {
  if (!text) return null;
  const display = text.length > 100 ? text.slice(0, 100) + "..." : text;
  return (
    <Html position={position} center distanceFactor={3}>
      <div
        className="pointer-events-none relative w-max rounded-2xl bg-white/95 px-5 py-3 text-[26px] font-medium leading-[1.8] text-gray-800 shadow-xl backdrop-blur-sm"
        style={{ maxWidth: "min(560px, 80vw)" }}
      >
        {display}
        <div className="absolute -bottom-3 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent border-t-white/95" />
      </div>
    </Html>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3D INNER SCENE — selects environment by sceneType
═══════════════════════════════════════════════════════════════ */

function InnerScene({
  sceneType,
  activeScene,
  emotion,
  bubbleText,
  companyName,
  currentPhase,
  reactionQuality,
}: {
  sceneType: SceneType;
  activeScene: "lobby" | "main";
  emotion: number;
  bubbleText: string;
  companyName: string;
  currentPhase: number;
  reactionQuality: ChoiceQuality | null;
}) {
  if (activeScene === "lobby") {
    // Lobby for office, exterior for restaurant, overhead desk for online
    if (sceneType === "restaurant") {
      return (
        <>
          <RestaurantExterior />
          <SpeechBubble text={bubbleText} position={[0, 2.5, -2.5]} />
        </>
      );
    }
    if (sceneType === "online") {
      return (
        <>
          <OnlineRoom />
          <OnlineDesk showFace={false} emotion={emotion} />
          <SpeechBubble text={bubbleText} position={[0, 2.2, -1.5]} />
        </>
      );
    }
    return (
      <>
        <LobbyFloor />
        <LobbyWalls />
        <GlassFront />
        <ReceptionDesk />
        <ReceptionistAvatar />
        <CompanySign text={companyName} />
        <LobbyDecor />
        <SpeechBubble text={bubbleText} position={[0, 1.9, -1.8]} />
      </>
    );
  }

  // Main scene based on sceneType
  switch (sceneType) {
    case "cafe":
      return (
        <>
          <CafeFloor />
          <CafeWalls />
          <CafeTable />
          <CafeDecor />
          <AmbientCafe />
          <CustomerAvatar emotion={emotion} />
          {reactionQuality && <ReactionCafe quality={reactionQuality} />}
          <SpeechBubble text={bubbleText} position={[0, 2.1, -3.5]} />
        </>
      );
    case "exhibition":
      return (
        <>
          <ExhibitionFloor />
          <ExhibitionBooth />
          <AmbientExhibition />
          <CustomerAvatar emotion={emotion} />
          {reactionQuality && <ReactionExhibition quality={reactionQuality} />}
          <SpeechBubble text={bubbleText} position={[0, 2.1, -3.5]} />
        </>
      );
    case "online":
      return (
        <>
          <OnlineRoom />
          <OnlineDesk showFace={currentPhase >= 1} emotion={emotion} />
          <AmbientOnline />
          {reactionQuality && <ReactionOnline quality={reactionQuality} />}
          <SpeechBubble text={bubbleText} position={[0, 1.6, -1.5]} />
        </>
      );
    case "restaurant":
      return (
        <>
          <RestaurantInterior emotion={emotion} />
          <AmbientRestaurant />
          {reactionQuality && <ReactionRestaurant quality={reactionQuality} />}
          <SpeechBubble text={bubbleText} position={[0, 2.1, -3]} />
        </>
      );
    case "office":
    default:
      return (
        <>
          <OfficeFloor />
          <OfficeWalls />
          <WindowDecor />
          <Desk />
          <OfficePlant />
          <Whiteboard />
          <AmbientOffice />
          <CustomerAvatar emotion={emotion} />
          <UserChair />
          {reactionQuality && <ReactionOffice quality={reactionQuality} />}
          <SpeechBubble text={bubbleText} position={[0, 2.1, -3.5]} />
        </>
      );
  }
}

/* ═══════════════════════════════════════════════════════════════
   SCENE MANAGER — handles camera, lights, scene switching
═══════════════════════════════════════════════════════════════ */

function SceneManager({
  sceneType,
  activeScene,
  emotion,
  bubbleText,
  companyName,
  currentPhase,
  reactionQuality,
}: {
  sceneType: SceneType;
  activeScene: "lobby" | "main";
  emotion: number;
  bubbleText: string;
  companyName: string;
  currentPhase: number;
  reactionQuality: ChoiceQuality | null;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (activeScene === "lobby") {
      if (sceneType === "online") {
        // Bird's-eye view of desk before meeting
        camera.position.set(0, 3.5, 0.5);
        controlsRef.current?.target.set(0, 0.8, -1.5);
      } else if (sceneType === "restaurant") {
        // Street view looking at restaurant entrance
        camera.position.set(0, 1.7, 2);
        controlsRef.current?.target.set(0, 1.8, -2.5);
      } else {
        // Office lobby
        camera.position.set(0, 1.7, 3.5);
        controlsRef.current?.target.set(0, 1.2, -0.5);
      }
    } else if (sceneType === "online") {
      // Eye-level, facing the monitor with Zoom face
      camera.position.set(0, 1.3, 0.8);
      controlsRef.current?.target.set(0, 1.2, -1.5);
    } else if (sceneType === "cafe") {
      camera.position.set(1.5, 1.8, 0.5);
      controlsRef.current?.target.set(0, 1.0, -2);
    } else if (sceneType === "exhibition") {
      camera.position.set(0, 1.8, 2);
      controlsRef.current?.target.set(0, 1.2, -1.5);
    } else if (sceneType === "restaurant") {
      // Counter seat view, looking at the owner
      camera.position.set(0, 1.5, -0.5);
      controlsRef.current?.target.set(0, 1.2, -3);
    } else {
      camera.position.set(0, 2, 1.5);
      controlsRef.current?.target.set(0, 1.2, -2.5);
    }
    controlsRef.current?.update();
  }, [activeScene, sceneType, camera]);

  const isLobby = activeScene === "lobby";
  const isRestaurantExt = isLobby && sceneType === "restaurant";

  return (
    <>
      <ambientLight intensity={
        isRestaurantExt ? 0.4
        : isLobby ? 0.7
        : sceneType === "restaurant" ? 0.55
        : sceneType === "cafe" ? 0.6
        : 0.5
      } />
      <directionalLight position={[3, 5, 2]} intensity={isRestaurantExt ? 0.3 : 0.7} castShadow />
      <pointLight
        position={isLobby ? [0, 4, 0] : [-3, 3, -1]}
        intensity={sceneType === "cafe" ? 0.5 : sceneType === "restaurant" ? 0.6 : 0.3}
        color={sceneType === "restaurant" ? "#ffbb77" : sceneType === "cafe" ? "#ffddaa" : "#fff5e6"}
      />
      {/* Restaurant interior — warm multi-point lighting for visibility */}
      {!isLobby && sceneType === "restaurant" && (
        <>
          <pointLight position={[0, 3, -2]} intensity={0.5} color="#ffaa66" />
          <pointLight position={[2, 1.2, -3.5]} intensity={0.3} color="#ff6622" />
          <pointLight position={[-2, 2.5, -1]} intensity={0.35} color="#ffcc88" />
          <pointLight position={[0, 1.5, 0]} intensity={0.25} color="#ffeedd" />
        </>
      )}

      <InnerScene
        sceneType={sceneType}
        activeScene={activeScene}
        emotion={emotion}
        bubbleText={bubbleText}
        companyName={companyName}
        currentPhase={currentPhase}
        reactionQuality={reactionQuality}
      />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}
        minDistance={2}
        maxDistance={7}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        touches={{ ONE: 1, TWO: 2 }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   UI COMPONENTS
═══════════════════════════════════════════════════════════════ */

function PhaseBar({ currentPhase, labels }: { currentPhase: number; labels: string[] }) {
  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      {labels.map((label, i) => (
        <div key={label} className="flex items-center gap-0.5 sm:gap-1">
          <div
            className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold transition-all sm:px-2.5 sm:py-1 sm:text-[11px] ${
              i < currentPhase
                ? "bg-green-500/30 text-green-400"
                : i === currentPhase
                  ? "bg-accent/30 text-accent ring-1 ring-accent/50"
                  : "bg-white/10 text-white/30"
            }`}
          >
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.slice(0, 2)}</span>
          </div>
          {i < labels.length - 1 && (
            <div className={`h-px w-1.5 sm:w-3 ${i < currentPhase ? "bg-green-500/50" : "bg-white/10"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function EmotionMeter({ emotion }: { emotion: number }) {
  const clamped = Math.max(0, Math.min(100, emotion));
  const color = clamped >= 60 ? "bg-green-500" : clamped >= 35 ? "bg-yellow-500" : "bg-red-500";
  const label = clamped >= 60 ? "好感" : clamped >= 35 ? "普通" : "警戒";
  return (
    <div className="flex items-center gap-2 rounded-lg bg-black/50 px-2.5 py-1.5 backdrop-blur-sm sm:px-3">
      <span className="text-[10px] text-white/60 sm:text-xs">{label}</span>
      <div className="h-2 w-14 overflow-hidden rounded-full bg-white/10 sm:w-20">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

function ChoiceCard({ choice, index, onSelect }: { choice: GameChoice; index: number; onSelect: (c: GameChoice) => void }) {
  return (
    <button
      onClick={() => onSelect(choice)}
      onMouseEnter={() => soundEngine.playHover()}
      className="group flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3.5 text-left transition-all hover:border-accent/40 hover:bg-accent/10 active:scale-[0.98] active:bg-accent/15 sm:p-4"
    >
      <span className="mt-0.5 text-lg sm:text-xl">{choice.icon}</span>
      <span className="min-w-0 flex-1 text-xs font-medium leading-relaxed text-white/90 sm:text-sm">
        {choice.label}
      </span>
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/10 text-[10px] text-white/40 sm:h-6 sm:w-6 sm:text-xs">
        {index + 1}
      </span>
    </button>
  );
}

function FeedbackPanel({ choice, onNext, isLast }: { choice: GameChoice; onNext: () => void; isLast: boolean }) {
  const [step, setStep] = useState<"talk" | "response" | "result">("talk");

  useEffect(() => {
    soundEngine.playFeedbackStep("talk");
  }, []);

  useEffect(() => {
    if (step === "talk") {
      const t = setTimeout(() => {
        setStep("response");
        soundEngine.playFeedbackStep("response");
      }, 1800);
      return () => clearTimeout(t);
    }
    if (step === "response") {
      const t = setTimeout(() => {
        setStep("result");
        soundEngine.playFeedbackStep("result");
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div className="space-y-3">
      <div className={`rounded-xl border border-accent/20 bg-accent/5 p-3 transition-opacity duration-300 sm:p-4 ${step === "talk" ? "opacity-100" : "opacity-70"}`}>
        <p className="mb-1 text-[10px] font-bold text-accent sm:text-xs">あなた:</p>
        <p className="text-xs leading-relaxed text-white/80 sm:text-sm">{choice.salesTalk}</p>
      </div>

      {(step === "response" || step === "result") && (
        <div className="animate-fade-in rounded-xl border border-blue-400/20 bg-blue-500/5 p-3 sm:p-4">
          <p className="mb-1 text-[10px] font-bold text-blue-400 sm:text-xs">相手:</p>
          <p className="text-xs leading-relaxed text-white/80 sm:text-sm">{choice.customerResponse}</p>
        </div>
      )}

      {step === "result" && (
        <div className="animate-fade-in flex flex-wrap items-center gap-2">
          <span className={`rounded-lg px-3 py-1.5 text-xs font-bold ${qualityColor(choice.quality)} bg-white/5`}>
            {qualityLabel(choice.quality)}
          </span>
          {choice.technique && (
            <span className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/50">{choice.technique}</span>
          )}
          <span className={`ml-auto text-sm font-bold ${choice.score > 0 ? "text-green-400" : choice.score < 0 ? "text-red-400" : "text-white/40"}`}>
            {choice.score > 0 ? "+" : ""}{choice.score} pt
          </span>
        </div>
      )}

      {step === "result" && (
        <button onClick={onNext} className="animate-fade-in mt-1 w-full rounded-xl bg-accent py-3 text-sm font-bold text-white transition hover:bg-accent-hover">
          {isLast ? "結果を見る" : "次へ進む"}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */

export default function FullscreenScene({ scenarioId }: { scenarioId?: string }) {
  const [scenario, setScenario] = useState<ScenarioConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [gamePhase, setGamePhase] = useState<GamePhase>("difficulty");
  const [difficulty, setDifficulty] = useState("normal");
  const [introIndex, setIntroIndex] = useState(0);
  const [nodeIndex, setNodeIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [emotion, setEmotion] = useState(0);
  const [lastChoice, setLastChoice] = useState<GameChoice | null>(null);
  const [bubbleText, setBubbleText] = useState("");
  const [reactionQuality, setReactionQuality] = useState<ChoiceQuality | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  // Game systems state
  const [timerRemaining, setTimerRemaining] = useState(30);
  const [timerTotal, setTimerTotal] = useState(30);
  const [timerMultLabel, setTimerMultLabel] = useState("");
  const [timerExpired, setTimerExpired] = useState(false);
  const [activeEffects, setActiveEffects] = useState<StatusEffect[]>([]);
  const [pendingAchievement, setPendingAchievement] = useState<Achievement | null>(null);
  const [pendingEvent, setPendingEvent] = useState<GameEvent | null>(null);
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [particleType, setParticleType] = useState<"excellent" | "combo" | "achievement" | "ending-s">("excellent");
  const [dramaticType, setDramaticType] = useState<"tension" | "success" | "failure" | "critical_moment" | "revelation">("success");
  const [dramaticActive, setDramaticActive] = useState(false);
  const [scoreMultiplier, setScoreMultiplier] = useState({ timer: 1, status: 1, difficulty: 1 });
  const prevEmotion = useRef(0);
  const choiceIds = useRef<string[]>([]);
  const techniques = useRef<string[]>([]);
  const sessionRef = useRef<GameSession | null>(null);

  /** Initialize sound engine on first user gesture */
  const initSound = useCallback(() => {
    if (!soundEngine.initialized) soundEngine.init();
  }, []);

  /* ─── Load scenario ─── */
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const id = scenarioId || "office-visit";
      const s = await loadScenario(id);
      if (cancelled) return;
      const resolved = s ?? getDefaultScenario();
      setScenario(resolved);
      setEmotion(resolved.initialEmotion);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [scenarioId]);

  /* ─── Derived from scenario ─── */
  const introScenes = scenario?.introScenes ?? [];
  const gameNodes = scenario?.gameNodes ?? [];
  const nodeOrder = scenario?.nodeOrder ?? [];
  const phaseLabels = scenario?.phaseLabels ?? [];
  const totalNodes = nodeOrder.length;
  const sceneType = scenario?.meta.sceneType ?? "office";

  /* ─── Start game session when entering playing phase ─── */
  const startPlaying = useCallback(() => {
    setGamePhase("playing");
    soundEngine.playGameStart();
    soundEngine.startBGM(sceneType);
    // Create game session
    const session = new GameSession({
      sceneType,
      difficulty: difficulty as "easy" | "normal" | "hard",
      scenarioId: scenario?.meta.id ?? "office-visit",
    });
    session.setInitialEmotion(emotion);
    sessionRef.current = session;
    setTimerTotal(session.difficulty.timerDuration);
    // Start timer for first node
    session.startTimer(
      (rem) => { setTimerRemaining(rem); setTimerMultLabel(session.timer.getMultiplierInfo().label); },
      () => { setTimerExpired(true); }
    );
    const firstNode = gameNodes.find((n) => n.id === nodeOrder[0]);
    if (firstNode?.customerLine) setBubbleText(firstNode.customerLine);
  }, [sceneType, difficulty, scenario, emotion, gameNodes, nodeOrder]);

  /* ─── Intro auto-advance ─── */
  useEffect(() => {
    if (gamePhase !== "intro" || !scenario) return;
    const scene = introScenes[introIndex];
    if (!scene) return;
    const t = setTimeout(() => {
      if (introIndex < introScenes.length - 1) {
        setIntroIndex((i) => i + 1);
        soundEngine.playIntroAdvance();
      } else {
        startPlaying();
      }
    }, scene.duration);
    return () => clearTimeout(t);
  }, [gamePhase, introIndex, scenario, introScenes, startPlaying]);

  /* ─── Current node (with shuffled choices) ─── */
  const currentNode = useMemo(() => {
    const nodeId = nodeOrder[nodeIndex];
    const node = gameNodes.find((n) => n.id === nodeId);
    if (!node) return null;
    return { ...node, choices: shuffleArray(node.choices) };
  }, [nodeIndex, gameNodes, nodeOrder]);

  const currentPhaseNum = currentNode?.phase ?? 0;
  const isLastNode = nodeIndex >= totalNodes - 1;

  /* Active 3D scene: lobby/exterior for phase 0, main for phase 1+ */
  const hasLobby = sceneType === "office" || sceneType === "restaurant" || sceneType === "online";
  const activeScene: "lobby" | "main" =
    hasLobby && (gamePhase === "intro" || (gamePhase !== "transition" && currentNode?.phase === 0))
      ? "lobby"
      : gamePhase === "transition"
        ? "main"
        : "main";

  /* ─── Choice handler (GameSession integrated) ─── */
  const handleChoice = useCallback((choice: GameChoice) => {
    const session = sessionRef.current;
    setLastChoice(choice);
    setBubbleText(choice.customerResponse.slice(0, 60));
    setReactionQuality(choice.quality);
    setGamePhase("feedback");
    choiceIds.current.push(choice.id);
    if (choice.technique) techniques.current.push(choice.technique);
    soundEngine.playChoice(choice.quality);

    if (session) {
      // Process through GameSession
      const result = session.processChoice({
        baseScore: choice.score,
        baseEmotionDelta: choice.emotionDelta,
        quality: choice.quality,
      });

      // Update state from session
      setTotalScore(session.getTotalScore());
      const newEmo = session.getEmotion();
      const prevEmo = emotion;
      setEmotion(newEmo);
      prevEmotion.current = prevEmo;
      soundEngine.setEmotion(newEmo);
      if (newEmo >= 70 && prevEmo < 70) soundEngine.playEmotionUp();
      if (newEmo <= 20 && prevEmo > 20) soundEngine.playEmotionDown();

      // Combo
      const newCombo = session.getCombo();
      setComboCount(newCombo);
      setMaxCombo(session.getMaxCombo());
      if (newCombo >= 3 && (choice.quality === "excellent" || choice.quality === "good")) {
        setShowCombo(true);
        soundEngine.playComboMilestone(newCombo);
        setTimeout(() => setShowCombo(false), 2000);
      }

      // Multiplier display
      setScoreMultiplier({
        timer: result.timerInfo.multiplier,
        status: session.statusEffects.getScoreMultiplier(),
        difficulty: session.difficulty.scoreMultiplier,
      });

      // Status effects
      setActiveEffects([...session.statusEffects.getActiveEffects()]);

      // Visual effects based on quality
      if (choice.quality === "excellent") {
        setParticleType("excellent");
        setParticleTrigger((t) => t + 1);
        setDramaticType("success");
        setDramaticActive(true);
        setShakeTrigger((t) => t + 1);
      } else if (choice.quality === "bad") {
        setDramaticType("failure");
        setDramaticActive(true);
        setShakeTrigger((t) => t + 1);
      }

      // Combo particle
      if (newCombo >= 3 && (choice.quality === "excellent" || choice.quality === "good")) {
        setTimeout(() => {
          setParticleType("combo");
          setParticleTrigger((t) => t + 1);
        }, 500);
      }

      // Dynamic event
      if (result.event) {
        setPendingEvent(result.event);
      }

      // Achievements
      if (result.newAchievements.length > 0) {
        setPendingAchievement(result.newAchievements[0]);
        setParticleType("achievement");
        setParticleTrigger((t) => t + 1);
      }
    } else {
      // Fallback (no session)
      setTotalScore((s) => s + choice.score);
      setEmotion((e) => Math.max(0, Math.min(100, e + choice.emotionDelta)));
    }
  }, [emotion]);

  /* ─── Next handler ─── */
  const handleNext = useCallback(() => {
    setReactionQuality(null);
    setDramaticActive(false);
    setTimerExpired(false);
    soundEngine.playClick();
    const session = sessionRef.current;

    if (isLastNode) {
      setGamePhase("ended");
      setBubbleText("");
      soundEngine.stopBGM();
      if (scenario) {
        const endingResult = scenario.getEnding(totalScore, emotion);
        recordPlay(scenario.meta.id, totalScore, endingResult.grade, emotion, choiceIds.current, techniques.current);
        soundEngine.playEnding(endingResult.grade);
        if (endingResult.grade === "S") {
          setParticleType("ending-s");
          setParticleTrigger((t) => t + 1);
          setDramaticType("revelation");
          setDramaticActive(true);
        }
      }
      return;
    }
    const nextIdx = nodeIndex + 1;
    const nextNodeId = nodeOrder[nextIdx];
    const nextNode = gameNodes.find((n) => n.id === nextNodeId);
    const needsTransition = hasLobby && currentNode?.phase === 0 && (nextNode?.phase ?? 0) > 0;

    const resumePlay = () => {
      setNodeIndex(nextIdx);
      setGamePhase("playing");
      if (nextNode?.customerLine) setBubbleText(nextNode.customerLine);
      // Restart timer for next node
      if (session) {
        session.startTimer(
          (rem) => { setTimerRemaining(rem); setTimerMultLabel(session.timer.getMultiplierInfo().label); },
          () => { setTimerExpired(true); }
        );
      }
    };

    if (needsTransition) {
      setGamePhase("transition");
      setBubbleText("");
      setLastChoice(null);
      soundEngine.playTransition();
      setTimeout(resumePlay, 2500);
    } else {
      setLastChoice(null);
      resumePlay();
    }
  }, [nodeIndex, isLastNode, currentNode, hasLobby, gameNodes, nodeOrder, scenario, totalScore, emotion]);

  /* ─── Retry ─── */
  const handleRetry = useCallback(() => {
    sessionRef.current?.destroy();
    sessionRef.current = null;
    setGamePhase("difficulty");
    setIntroIndex(0);
    setNodeIndex(0);
    setTotalScore(0);
    setEmotion(scenario?.initialEmotion ?? 30);
    setLastChoice(null);
    setBubbleText("");
    setReactionQuality(null);
    setComboCount(0);
    setMaxCombo(0);
    setShowCombo(false);
    setActiveEffects([]);
    setPendingAchievement(null);
    setPendingEvent(null);
    setDramaticActive(false);
    setTimerExpired(false);
    choiceIds.current = [];
    techniques.current = [];
    soundEngine.stopBGM();
    soundEngine.playClick();
  }, [scenario]);

  /* ─── Timer expired → auto-select worst choice ─── */
  useEffect(() => {
    if (!timerExpired || gamePhase !== "playing" || !currentNode) return;
    // Find worst choice
    const worst = [...currentNode.choices].sort((a, b) => a.score - b.score)[0];
    if (worst) handleChoice(worst);
  }, [timerExpired, gamePhase, currentNode, handleChoice]);

  /* ─── Heartbeat at critical emotion ─── */
  const isCriticalEmotion = emotion <= 15;
  useEffect(() => {
    if (gamePhase !== "playing" || !isCriticalEmotion) return;
    const id = setInterval(() => soundEngine.playHeartbeat(), 1200);
    return () => clearInterval(id);
  }, [gamePhase, isCriticalEmotion]);

  /* ─── Cleanup on unmount ─── */
  useEffect(() => {
    return () => {
      soundEngine.dispose();
      sessionRef.current?.destroy();
    };
  }, []);

  /* ─── Keyboard 1-4 ─── */
  useEffect(() => {
    if (gamePhase !== "playing" || !currentNode) return;
    const handler = (e: KeyboardEvent) => {
      const key = parseInt(e.key);
      if (key >= 1 && key <= 4 && currentNode.choices[key - 1]) {
        handleChoice(currentNode.choices[key - 1]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [gamePhase, currentNode, handleChoice]);

  const ending = useMemo(
    () => scenario?.getEnding(totalScore, emotion) ?? { id: "", title: "", emoji: "", description: "", grade: "C" },
    [scenario, totalScore, emotion],
  );

  const showBubble = gamePhase === "playing" || gamePhase === "feedback";

  /* Company name for lobby sign */
  const companyName = scenario?.meta.location.split(" ")[0] ?? "";

  /* Transition text */
  const transitionTexts: Record<string, [string, string]> = {
    office: ["エレベーターで3階へ——", "社長室のドアの前で深呼吸する"],
    cafe: ["カフェに入り、席へ向かう——", "相手はすでに席に座っている"],
    exhibition: ["会場に到着——", "ブースの準備を整える"],
    online: ["Zoomミーティングに接続——", "カメラとマイクをONにする"],
    restaurant: ["暖簾をくぐって店内へ——", "カウンターに座る。店長がこちらを見ている"],
  };
  const [transitionText, transitionSubText] = transitionTexts[sceneType] ?? transitionTexts.office;

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#0a0e1a]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-sm text-white/60">シナリオを読み込み中...</p>
        </div>
      </div>
    );
  }

  const sessionStats = sessionRef.current?.getStats();

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#0a0e1a]">
      {/* ─── VFX Overlays (always rendered, pointer-events: none) ─── */}
      <ScreenVignette emotion={emotion} isTimerLow={timerRemaining < 5 && gamePhase === "playing"} gamePhase={gamePhase} />
      <EmotionParticles emotion={emotion} active={gamePhase === "playing" || gamePhase === "feedback"} />
      {gamePhase === "playing" && (
        <TimerPressureOverlay remaining={timerRemaining} total={timerTotal} />
      )}
      <FocusLines active={gamePhase === "playing" && emotion < 25} intensity={emotion < 15 ? "intense" : "normal"} />
      <ParticleExplosion trigger={particleTrigger} type={particleType} />
      <DramaticOverlay type={dramaticType} active={dramaticActive} />
      <IntroLetterbox active={gamePhase === "intro"} />

      {/* ─── Screen Shake Wrapper ─── */}
      <ScreenShake trigger={shakeTrigger} intensity="medium">
      {/* ─── 3D Canvas ─── */}
      <Canvas
        shadows
        camera={{ position: [0, 1.7, 3.5], fov: 55 }}
        gl={{ antialias: true }}
        className="!absolute inset-0"
      >
        <SceneManager
          sceneType={sceneType}
          activeScene={activeScene}
          emotion={emotion}
          bubbleText={showBubble ? bubbleText : ""}
          companyName={companyName}
          currentPhase={currentPhaseNum}
          reactionQuality={reactionQuality}
        />
      </Canvas>
      </ScreenShake>

      {/* ─── DIFFICULTY SELECTION ─── */}
      {gamePhase === "difficulty" && scenario && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0e1a]/90 backdrop-blur-md">
          <div className="w-full max-w-lg px-4">
            <div className="mb-6 text-center">
              <div className="mb-2 text-4xl">{scenario.meta.emoji}</div>
              <h2 className="mb-1 text-xl font-bold text-white sm:text-2xl">{scenario.meta.shortTitle}</h2>
              <p className="text-xs text-white/50 sm:text-sm">{scenario.meta.description}</p>
            </div>
            <DifficultySelector
              selected={difficulty}
              onSelect={setDifficulty}
              difficulties={DIFFICULTIES as Record<string, DifficultyConfig>}
            />
            <button
              onClick={() => {
                initSound();
                setGamePhase("intro");
              }}
              className="mt-6 w-full rounded-xl bg-accent py-4 text-base font-bold text-white transition hover:bg-accent-hover active:scale-[0.98]"
            >
              商談を始める
            </button>
          </div>
        </div>
      )}

      {/* ─── INTRO CINEMATIC ─── */}
      {gamePhase === "intro" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0e1a]/85 backdrop-blur-sm cursor-pointer" onClick={initSound}>
          <div className="animate-fade-in text-center" key={introIndex}>
            <p className="whitespace-pre-line text-xl font-bold text-white sm:text-3xl">
              {introScenes[introIndex]?.text}
            </p>
            {introScenes[introIndex]?.subText && (
              <p className="mt-3 text-sm text-white/50 sm:text-base">
                {introScenes[introIndex].subText}
              </p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              initSound();
              startPlaying();
            }}
            className="absolute bottom-6 right-4 rounded-lg bg-white/15 px-5 py-3 text-sm text-white/60 transition hover:bg-white/25 hover:text-white/90 active:bg-white/30 sm:bottom-8 sm:right-6 sm:px-4 sm:py-2 sm:text-xs"
          >
            スキップ &gt;
          </button>
        </div>
      )}

      {/* ─── TRANSITION ─── */}
      {gamePhase === "transition" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0e1a]">
          <div className="animate-fade-in text-center">
            <p className="text-lg font-bold text-white sm:text-2xl">{transitionText}</p>
            <p className="mt-3 text-sm text-white/50 sm:text-base">{transitionSubText}</p>
          </div>
        </div>
      )}

      {/* ─── TOP BAR ─── */}
      {(gamePhase === "playing" || gamePhase === "feedback") && (
        <div className="absolute left-0 right-0 top-0 z-10 px-2 py-2 sm:px-4 sm:py-3">
          {/* Row 1: Back + Phase + Timer + Sound + Emotion */}
          <div className="flex items-center justify-between gap-1.5">
            <Link
              href="/challenge"
              className="flex h-8 shrink-0 items-center gap-1 rounded-lg bg-black/50 px-2.5 text-xs text-white/70 backdrop-blur-sm transition hover:bg-black/70 hover:text-white sm:h-9 sm:px-3 sm:text-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="hidden sm:inline">戻る</span>
            </Link>
            <PhaseBar currentPhase={currentPhaseNum} labels={phaseLabels} />
            <div className="flex shrink-0 items-center gap-1.5">
              {gamePhase === "playing" && (
                <CountdownTimer remaining={timerRemaining} total={timerTotal} multiplierLabel={timerMultLabel} isExpired={timerExpired} />
              )}
              <button
                onClick={() => {
                  initSound();
                  const muted = soundEngine.toggleMute();
                  setIsMuted(muted);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white/70 backdrop-blur-sm transition hover:bg-black/70 hover:text-white sm:h-9 sm:w-9"
                title={isMuted ? "サウンドON" : "サウンドOFF"}
              >
                {isMuted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
              <RelationshipMeter emotion={emotion} prevEmotion={prevEmotion.current} />
            </div>
          </div>
          {/* Row 2: Status effects + Score multiplier */}
          <div className="mt-1 flex items-center justify-between">
            <StatusBar effects={activeEffects} />
            <ScoreMultiplierDisplay
              timerMultiplier={scoreMultiplier.timer}
              statusMultiplier={scoreMultiplier.status}
              difficultyMultiplier={scoreMultiplier.difficulty}
              comboCount={comboCount}
            />
          </div>
        </div>
      )}

      {/* ─── NARRATION BAR ─── */}
      {gamePhase === "playing" && currentNode?.narration && (
        <div className="absolute left-0 right-0 top-12 z-10 px-3 sm:top-14 sm:px-6">
          <div className="mx-auto max-w-2xl rounded-xl bg-black/50 px-4 py-2.5 text-center backdrop-blur-sm">
            <p className="text-xs leading-relaxed text-white/60 sm:text-sm">{currentNode.narration}</p>
          </div>
        </div>
      )}

      {/* ─── CHOICES ─── */}
      {gamePhase === "playing" && currentNode && (
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="pointer-events-none h-16 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="bg-black/80 px-3 pb-3 pt-2 backdrop-blur-md sm:px-6 sm:pb-4 sm:pt-3" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
            <div className="mx-auto max-w-2xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-medium text-white/40 sm:text-xs">{currentNode.phaseLabel} — {nodeIndex + 1}/{totalNodes}</p>
                <div className="flex items-center gap-2">
                  {comboCount >= 2 && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold sm:text-xs ${
                      comboCount >= 5 ? "bg-yellow-400/20 text-yellow-300" : comboCount >= 3 ? "bg-orange-400/20 text-orange-300" : "bg-blue-400/15 text-blue-300"
                    }`}>
                      {comboCount}x
                    </span>
                  )}
                  <p className="text-[10px] text-white/30 sm:text-xs">スコア: <span className="font-bold text-accent">{totalScore}</span></p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {currentNode.choices.map((c, i) => (
                  <ChoiceCard key={c.id} choice={c} index={i} onSelect={handleChoice} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── REACTION FLASH ─── */}
      {gamePhase === "feedback" && reactionQuality && (
        <div
          key={lastChoice?.id ?? "flash"}
          className="reaction-flash absolute inset-0 z-[5]"
          style={{
            background: reactionQuality === "excellent"
              ? "radial-gradient(circle at center, rgba(34,197,94,0.25) 0%, transparent 70%)"
              : reactionQuality === "good"
                ? "radial-gradient(circle at center, rgba(59,130,246,0.2) 0%, transparent 70%)"
                : reactionQuality === "neutral"
                  ? "radial-gradient(circle at center, rgba(234,179,8,0.15) 0%, transparent 70%)"
                  : "radial-gradient(circle at center, rgba(239,68,68,0.3) 0%, transparent 70%)",
          }}
        />
      )}

      {/* ─── SCORE POPUP ─── */}
      {gamePhase === "feedback" && lastChoice && (
        <div
          key={`score-${lastChoice.id}`}
          className="absolute left-1/2 top-1/3 z-[6] -translate-x-1/2 pointer-events-none"
          style={{ animation: "fadeUp 1.5s ease-out forwards" }}
        >
          <span className={`text-3xl font-black sm:text-4xl ${
            lastChoice.score > 0 ? "text-green-400" : lastChoice.score < 0 ? "text-red-400" : "text-yellow-400"
          }`} style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
            {lastChoice.score > 0 ? `+${lastChoice.score}` : lastChoice.score}
          </span>
        </div>
      )}

      {/* ─── COMBO DISPLAY ─── */}
      {showCombo && comboCount >= 3 && (
        <div
          key={`combo-${comboCount}`}
          className="absolute left-1/2 top-[22%] z-[7] -translate-x-1/2 pointer-events-none"
          style={{ animation: "comboPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, fadeUp 2s ease-out 0.5s forwards" }}
        >
          <div className="text-center">
            <span className={`text-2xl font-black sm:text-3xl ${
              comboCount >= 5 ? "text-yellow-300" : "text-orange-400"
            }`} style={{ textShadow: `0 0 20px ${comboCount >= 5 ? "rgba(253,224,71,0.5)" : "rgba(251,146,60,0.4)"}` }}>
              {comboCount} COMBO!
            </span>
            {comboCount >= 5 && (
              <div className="mt-1 text-xs font-bold text-yellow-300/80" style={{ textShadow: "0 0 10px rgba(253,224,71,0.3)" }}>
                PERFECT STREAK
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── EVENT POPUP ─── */}
      {pendingEvent && (
        <EventPopup event={pendingEvent} onDismiss={() => setPendingEvent(null)} />
      )}

      {/* ─── ACHIEVEMENT TOAST ─── */}
      {pendingAchievement && (
        <AchievementToast achievement={pendingAchievement} onDone={() => setPendingAchievement(null)} />
      )}

      {/* ─── FEEDBACK ─── */}
      {gamePhase === "feedback" && lastChoice && (
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="pointer-events-none h-8 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="max-h-[55vh] overflow-y-auto bg-black/80 px-3 pb-3 pt-3 backdrop-blur-md sm:px-6 sm:pb-4" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
            <div className="mx-auto max-w-2xl">
              <FeedbackPanel key={lastChoice.id} choice={lastChoice} onNext={handleNext} isLast={isLastNode} />
            </div>
          </div>
        </div>
      )}

      {/* ─── RESULTS ─── */}
      {gamePhase === "ended" && (
        <div className="absolute inset-0 z-20 flex items-start justify-center overflow-y-auto bg-black/70 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6">
          <div className="my-auto w-full max-w-md rounded-2xl border border-white/10 bg-[#1a2744]/95 p-4 text-center backdrop-blur-md sm:p-8">
            <div className="mb-2 text-5xl">{ending.emoji}</div>
            <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">{ending.title}</h2>
            <p className="mb-4 text-sm leading-relaxed text-white/60">{ending.description}</p>

            <GameOverStats
              totalScore={totalScore}
              emotion={emotion}
              maxCombo={maxCombo}
              grade={ending.grade}
              timerBonus={0}
              excellentCount={sessionStats?.excellentCount ?? 0}
              goodCount={sessionStats?.goodCount ?? 0}
              badCount={sessionStats?.badCount ?? 0}
              achievements={[]}
              timeSpent={sessionStats?.timeSpent ?? 0}
            />

            <div className="mt-5 flex flex-col gap-2.5">
              <Link href="/pricing" className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover">
                Proプランで本格練習する
              </Link>
              <button onClick={handleRetry} className="rounded-xl border border-white/20 px-6 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5">
                もう一度挑戦する
              </button>
              <Link href="/challenge" className="mt-1 text-xs text-white/40 underline transition hover:text-white/60">
                チャレンジ一覧に戻る
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out both;
        }
        @keyframes comboPopIn {
          0% { opacity: 0; transform: translateX(-50%) scale(0.3); }
          60% { opacity: 1; transform: translateX(-50%) scale(1.15); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
        @keyframes pulseGlow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }
      `}</style>
    </div>
  );
}
