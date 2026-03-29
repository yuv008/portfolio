"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

// ─── Node Graph Geometry ────────────────────────────────────────────────────
//
// Desktop layout (SVG viewBox: 0 0 560 160):
//
//   N0(40,80) ─── N1(130,80) ─── N2(220,80) ─┬─ N3(310,40) ─── N4(400,40) ─┐
//                                              └─ N5(310,120) ─ N6(400,120) ─┴─ N6_merge(490,80)
//
// The signal travels: N0→N1→N2→N3→N4→N6_merge then N2→N5→N6→N6_merge
// For simplicity we animate a single dot along the longest path:
//   N0 → N1 → N2 → N3(branch-top) → N4 → N6_merge(490,80)
//   then after merge, we also show the bottom branch lighting up.
//
// Mobile layout (SVG viewBox: 0 0 340 120):
//   N0(30,60) ─ N1(100,60) ─ N2(170,60) ─ N3(240,40) ─ N4(310,60)
//                                        └─ N5(240,80) ─┘

interface Point {
  x: number;
  y: number;
}

// Desktop node positions
const DESKTOP_NODES: Point[] = [
  { x: 40, y: 80 },   // 0 – entry
  { x: 130, y: 80 },  // 1
  { x: 220, y: 80 },  // 2 – branch point
  { x: 310, y: 35 },  // 3 – upper branch
  { x: 400, y: 35 },  // 4 – upper branch end
  { x: 310, y: 125 }, // 5 – lower branch
  { x: 400, y: 125 }, // 6 – lower branch end
  { x: 490, y: 80 },  // 7 – merge / output
];

// Desktop edges as [fromIndex, toIndex] pairs
const DESKTOP_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 7],
  [2, 5],
  [5, 6],
  [6, 7],
];

// The primary signal path (upper branch): node indices in traversal order
const DESKTOP_SIGNAL_PATH = [0, 1, 2, 3, 4, 7];

// Secondary signal path (lower branch, starts from N2): node indices
const DESKTOP_SIGNAL_PATH_LOWER = [2, 5, 6, 7];

// Mobile node positions
const MOBILE_NODES: Point[] = [
  { x: 30, y: 60 },   // 0
  { x: 100, y: 60 },  // 1
  { x: 175, y: 60 },  // 2 – branch
  { x: 240, y: 30 },  // 3 – upper
  { x: 310, y: 60 },  // 4 – merge
  { x: 240, y: 90 },  // 5 – lower
];

const MOBILE_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [2, 5],
  [5, 4],
];

const MOBILE_SIGNAL_PATH = [0, 1, 2, 3, 4];
const MOBILE_SIGNAL_PATH_LOWER = [2, 5, 4];

// ─── Timing constants ────────────────────────────────────────────────────────

// How long the entire signal animation runs before text appears (ms)
const SIGNAL_TOTAL_MS = 2500;

// Edge draw duration for static line reveal (seconds per edge)
const EDGE_DRAW_DURATION = 0.35;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function distanceBetween(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/**
 * Given a path (array of Point), compute cumulative arc-length keyframes
 * normalised to [0, 1] so we can drive framer-motion's x/y with a
 * matching time keyframe array.
 */
function buildKeyframes(
  path: Point[],
): { xs: number[]; ys: number[]; times: number[] } {
  const segments: number[] = [];
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const d = distanceBetween(path[i], path[i + 1]);
    segments.push(d);
    total += d;
  }

  const xs: number[] = [path[0].x];
  const ys: number[] = [path[0].y];
  const times: number[] = [0];

  let accumulated = 0;
  for (let i = 0; i < segments.length; i++) {
    accumulated += segments[i];
    xs.push(path[i + 1].x);
    ys.push(path[i + 1].y);
    times.push(accumulated / total);
  }

  return { xs, ys, times };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface GraphProps {
  nodes: Point[];
  edges: [number, number][];
  signalPath: number[];
  lowerPath: number[];
  viewBox: string;
  isMobile?: boolean;
}

function NodeGraph({
  nodes,
  edges,
  signalPath,
  lowerPath,
  viewBox,
  isMobile = false,
}: GraphProps) {
  // Build keyframes for primary and secondary dots
  const primaryPoints = signalPath.map((i) => nodes[i]);
  const lowerPoints = lowerPath.map((i) => nodes[i]);

  const primary = buildKeyframes(primaryPoints);
  const lower = buildKeyframes(lowerPoints);

  // Total primary duration fraction — used to stagger lower branch start
  // Lower branch starts when primary reaches the branch-point node (index 2 in path)
  const branchNodeIndexInPath = signalPath.indexOf(2);
  const branchTimeFraction =
    branchNodeIndexInPath > 0
      ? (() => {
          const pts = signalPath.slice(0, branchNodeIndexInPath + 1).map((i) => nodes[i]);
          let d = 0;
          for (let i = 0; i < pts.length - 1; i++) d += distanceBetween(pts[i], pts[i + 1]);
          const total = (() => {
            let t = 0;
            for (let i = 0; i < signalPath.length - 1; i++)
              t += distanceBetween(nodes[signalPath[i]], nodes[signalPath[i + 1]]);
            return t;
          })();
          return d / total;
        })()
      : 0;

  const SIGNAL_DURATION_S = SIGNAL_TOTAL_MS / 1000;
  const primaryDuration = SIGNAL_DURATION_S * 0.85;
  const lowerDelay = primaryDuration * branchTimeFraction;
  const lowerDuration = SIGNAL_DURATION_S * 0.55;

  return (
    <motion.svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <defs>
        {/* Glow filter for the signal dot */}
        <filter id="signal-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Node glow */}
        <filter id="node-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Accent gradient for lit edges */}
        <linearGradient id="edge-lit" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent-dim)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* ── Static edges (dim, drawn in on mount) ── */}
      {edges.map(([from, to], idx) => {
        const a = nodes[from];
        const b = nodes[to];
        const len = distanceBetween(a, b);
        return (
          <motion.line
            key={`edge-${idx}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="var(--accent-border)"
            strokeWidth={isMobile ? 1 : 1.5}
            strokeLinecap="round"
            strokeDasharray={len}
            initial={{ strokeDashoffset: len }}
            animate={{ strokeDashoffset: 0 }}
            transition={{
              duration: EDGE_DRAW_DURATION,
              delay: 0.1 + idx * 0.08,
              ease: "easeOut",
            }}
          />
        );
      })}

      {/* ── Nodes ── */}
      {nodes.map((pt, idx) => (
        <motion.circle
          key={`node-${idx}`}
          cx={pt.x}
          cy={pt.y}
          r={isMobile ? 5 : 6}
          fill="var(--bg-elevated)"
          stroke="var(--accent-border)"
          strokeWidth={1.5}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.25,
            delay: 0.05 + idx * 0.07,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ filter: "url(#node-glow)" }}
        />
      ))}

      {/* ── Primary signal dot ── */}
      <motion.circle
        r={isMobile ? 3.5 : 4}
        fill="var(--accent)"
        style={{ filter: "url(#signal-glow)" }}
        initial={{ cx: primaryPoints[0].x, cy: primaryPoints[0].y, opacity: 0 }}
        animate={{
          cx: primary.xs,
          cy: primary.ys,
          opacity: [0, 1, 1, 1, 0.6],
        }}
        transition={{
          cx: {
            duration: primaryDuration,
            delay: 0.5,
            times: primary.times,
            ease: "linear",
          },
          cy: {
            duration: primaryDuration,
            delay: 0.5,
            times: primary.times,
            ease: "linear",
          },
          opacity: {
            duration: primaryDuration,
            delay: 0.5,
            times: [0, 0.05, 0.7, 0.9, 1],
            ease: "linear",
          },
        }}
      />

      {/* ── Lower branch signal dot ── */}
      <motion.circle
        r={isMobile ? 3 : 3.5}
        fill="var(--accent)"
        style={{ filter: "url(#signal-glow)", opacity: 0 }}
        animate={{
          cx: lower.xs,
          cy: lower.ys,
          opacity: [0, 0.85, 0.85, 0.4],
        }}
        transition={{
          cx: {
            duration: lowerDuration,
            delay: 0.5 + lowerDelay,
            times: lower.times,
            ease: "linear",
          },
          cy: {
            duration: lowerDuration,
            delay: 0.5 + lowerDelay,
            times: lower.times,
            ease: "linear",
          },
          opacity: {
            duration: lowerDuration,
            delay: 0.5 + lowerDelay,
            times: [0, 0.08, 0.85, 1],
            ease: "linear",
          },
        }}
      />

      {/* ── Terminal node lit state (output node pulses once signal arrives) ── */}
      <motion.circle
        cx={nodes[nodes.length - 1].x}
        cy={nodes[nodes.length - 1].y}
        r={isMobile ? 5 : 6}
        fill="transparent"
        stroke="var(--accent)"
        strokeWidth={1.5}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 0.4], scale: [0.8, 1.4, 1] }}
        transition={{
          duration: 0.6,
          delay: 0.5 + primaryDuration * 0.95,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.5, 1],
        }}
        style={{ filter: "url(#signal-glow)" }}
      />
    </motion.svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function HeroSignal() {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and on resize
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const nodes = isMobile ? MOBILE_NODES : DESKTOP_NODES;
  const edges = isMobile ? MOBILE_EDGES : DESKTOP_EDGES;
  const signalPath = isMobile ? MOBILE_SIGNAL_PATH : DESKTOP_SIGNAL_PATH;
  const lowerPath = isMobile ? MOBILE_SIGNAL_PATH_LOWER : DESKTOP_SIGNAL_PATH_LOWER;
  const viewBox = isMobile ? "0 0 340 120" : "0 0 560 160";
  const svgWidth = isMobile ? 340 : 560;
  const svgHeight = isMobile ? 120 : 160;

  return (
    <section
      id="hero"
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: "var(--bg-primary)",
        padding: "0 1.5rem",
      }}
      aria-label="Hero section"
    >
      {/* Radial glow at viewport center */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,212,255,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Node graph ── */}
      <div
        style={{
          width: "100%",
          maxWidth: svgWidth,
          height: svgHeight,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <NodeGraph
          key={isMobile ? "mobile" : "desktop"}
          nodes={nodes}
          edges={edges}
          signalPath={signalPath}
          lowerPath={lowerPath}
          viewBox={viewBox}
          isMobile={isMobile}
        />
      </div>

      {/* ── Text block ── always visible, fades in shortly after mount ── */}
      <div
        style={{
          marginTop: "2.5rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          minHeight: "8rem",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "var(--text-primary)",
            fontSize: "clamp(1.75rem, 5vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          Yuvraj Sanghai
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Satoshi', sans-serif",
            color: "var(--text-secondary)",
            fontSize: "1.125rem",
            lineHeight: 1.6,
            maxWidth: "42ch",
          }}
        >
          I build the systems behind the intelligence.
        </motion.p>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              bottom: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
            aria-label="Scroll to explore"
          >
            <motion.span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text-muted)",
                userSelect: "none",
              }}
              animate={{ y: [0, -2, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "loop",
              }}
            >
              // scroll to explore
            </motion.span>

            {/* Chevron arrow */}
            <motion.svg
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              aria-hidden="true"
              animate={{ y: [0, -2, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "loop",
                delay: 0.1,
              }}
            >
              <path
                d="M1 1.5L8 8.5L15 1.5"
                stroke="var(--text-muted)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.div>
    </section>
  );
}
