"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// ─── Neural Network Layout ────────────────────────────────────────────────────

interface NeuralNode {
  id: string;
  layer: number;
  indexInLayer: number;
  x: number;
  y: number;
  label?: string;
  isOutput?: boolean;
}

interface NeuralEdge {
  fromId: string;
  toId: string;
  fromLayer: number;
}

function buildNeuralNodes(
  layerSizes: number[],
  layerXs: number[],
  svgH: number,
  paddingTop: number,
  usableH: number,
  inputLabels: string[],
  outputLabels: string[],
): NeuralNode[] {
  const nodes: NeuralNode[] = [];
  const lastLayerIdx = layerSizes.length - 1;

  layerSizes.forEach((count, layerIdx) => {
    const x = layerXs[layerIdx];
    const spacing = count > 1 ? usableH / (count - 1) : 0;
    const isInput = layerIdx === 0;
    const isOutput = layerIdx === lastLayerIdx;

    for (let i = 0; i < count; i++) {
      const y = count > 1 ? paddingTop + i * spacing : paddingTop + usableH / 2;
      nodes.push({
        id: `L${layerIdx}-N${i}`,
        layer: layerIdx,
        indexInLayer: i,
        x,
        y,
        label: isInput ? inputLabels[i] : isOutput ? outputLabels[i] : undefined,
        isOutput,
      });
    }
  });

  return nodes;
}

function buildNeuralEdges(
  nodes: NeuralNode[],
  layerCount: number,
  connections: number[][][],
): NeuralEdge[] {
  const edges: NeuralEdge[] = [];
  for (let layerIdx = 0; layerIdx < layerCount - 1; layerIdx++) {
    const conn = connections[layerIdx];
    for (let fromIdx = 0; fromIdx < conn.length; fromIdx++) {
      const fromId = `L${layerIdx}-N${fromIdx}`;
      for (const toIdx of conn[fromIdx]) {
        edges.push({ fromId, toId: `L${layerIdx + 1}-N${toIdx}`, fromLayer: layerIdx });
      }
    }
  }
  return edges;
}

// ─── Desktop config ───────────────────────────────────────────────────────────
// 4 layers: [3, 5, 5, 2]   viewBox 0 0 620 210

const D_LAYER_SIZES = [3, 5, 5, 2];
const D_LAYER_XS   = [58, 208, 398, 568];
const D_SVG_W = 620;
const D_SVG_H = 210;
const D_PAD_TOP  = 18;
const D_USABLE_H = 162; // space for 5 nodes from top to bottom
const D_NODE_R   = 6;
const D_CONNECTIONS: number[][][] = [
  // 3→5
  [[0, 1], [1, 2, 3], [3, 4]],
  // 5→5
  [[0, 1], [0, 1, 2], [1, 2, 3], [2, 3, 4], [3, 4]],
  // 5→2
  [[0], [0, 1], [0, 1], [0, 1], [1]],
];

// ─── Mobile config ────────────────────────────────────────────────────────────
// 4 layers: [3, 4, 4, 2]   viewBox 0 0 380 165

const M_LAYER_SIZES = [3, 4, 4, 2];
const M_LAYER_XS   = [30, 127, 250, 352];
const M_SVG_W = 380;
const M_SVG_H = 165;
const M_PAD_TOP  = 16;
const M_USABLE_H = 120;
const M_NODE_R   = 5;
const M_CONNECTIONS: number[][][] = [
  // 3→4
  [[0, 1], [1, 2], [2, 3]],
  // 4→4
  [[0, 1], [0, 1, 2], [1, 2, 3], [2, 3]],
  // 4→2
  [[0], [0, 1], [0, 1], [1]],
];

const INPUT_LABELS  = ["audio", "query", "context"];
const OUTPUT_LABELS = ["speech", "insight"];
const LAYER_LABELS  = ["INPUT", "EMBED", "PROCESS", "OUTPUT"];

// ─── Animation timing ─────────────────────────────────────────────────────────

// ms offset from wave start when each layer "fires"
const LAYER_DELAYS  = [0, 480, 950, 1380];
// ms offset when edges between layer N and N+1 activate
const EDGE_DELAYS   = [220, 700, 1170];
const EDGE_DURATION = 300; // ms edges stay lit
const WAVE_TOTAL    = 2000; // ms before reset
const WAVE_PAUSE    = 1800; // ms between waves
const MOUNT_DELAY   = 750;  // ms before first wave

// ─── NeuralNet component ──────────────────────────────────────────────────────

function NeuralNet({ isMobile }: { isMobile: boolean }) {
  const layerSizes  = isMobile ? M_LAYER_SIZES : D_LAYER_SIZES;
  const layerXs     = isMobile ? M_LAYER_XS    : D_LAYER_XS;
  const svgW        = isMobile ? M_SVG_W        : D_SVG_W;
  const svgH        = isMobile ? M_SVG_H        : D_SVG_H;
  const padTop      = isMobile ? M_PAD_TOP      : D_PAD_TOP;
  const usableH     = isMobile ? M_USABLE_H     : D_USABLE_H;
  const nodeR       = isMobile ? M_NODE_R        : D_NODE_R;
  const connections = isMobile ? M_CONNECTIONS  : D_CONNECTIONS;

  const nodes   = buildNeuralNodes(layerSizes, layerXs, svgH, padTop, usableH, INPUT_LABELS, OUTPUT_LABELS);
  const edges   = buildNeuralEdges(nodes, layerSizes.length, connections);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const [activeLayer, setActiveLayer]           = useState<number | null>(null);
  const [activeEdgeLayers, setActiveEdgeLayers] = useState<Set<number>>(new Set());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function s(fn: () => void, ms: number) {
      const t = setTimeout(fn, ms);
      timers.current.push(t);
    }

    function runWave(offset: number) {
      // Fire each layer
      LAYER_DELAYS.forEach((delay, li) => {
        s(() => setActiveLayer(li), offset + delay);
      });

      // Light/unlight edge groups
      EDGE_DELAYS.forEach((delay, eli) => {
        s(() => setActiveEdgeLayers((p) => new Set([...p, eli])), offset + delay);
        s(() => {
          setActiveEdgeLayers((p) => {
            const n = new Set(p);
            n.delete(eli);
            return n;
          });
        }, offset + delay + EDGE_DURATION);
      });

      // Reset
      s(() => { setActiveLayer(null); setActiveEdgeLayers(new Set()); }, offset + WAVE_TOTAL);

      // Next wave
      s(() => runWave(0), offset + WAVE_TOTAL + WAVE_PAUSE);
    }

    s(() => runWave(0), MOUNT_DELAY);
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, []);

  // Label y: just below SVG node area
  const labelY = svgH - 6;

  return (
    <motion.svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      width="100%"
      height="100%"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id="nn-node-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="nn-output-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* HUD corner brackets */}
      <path d="M8 22 L8 8 L22 8"       fill="none" stroke="rgba(0,212,255,0.22)" strokeWidth="1" />
      <path d={`M${svgW-22} 8 L${svgW-8} 8 L${svgW-8} 22`} fill="none" stroke="rgba(0,212,255,0.22)" strokeWidth="1" />
      <path d={`M8 ${svgH-22} L8 ${svgH-8} L22 ${svgH-8}`} fill="none" stroke="rgba(0,212,255,0.22)" strokeWidth="1" />
      <path d={`M${svgW-22} ${svgH-8} L${svgW-8} ${svgH-8} L${svgW-8} ${svgH-22}`} fill="none" stroke="rgba(0,212,255,0.22)" strokeWidth="1" />

      {/* Edges */}
      {edges.map((edge) => {
        const from = nodeMap.get(edge.fromId);
        const to   = nodeMap.get(edge.toId);
        if (!from || !to) return null;
        const lit = activeEdgeLayers.has(edge.fromLayer);
        return (
          <line
            key={`${edge.fromId}>${edge.toId}`}
            x1={from.x} y1={from.y}
            x2={to.x}   y2={to.y}
            stroke={lit ? "var(--accent)" : "var(--accent-border)"}
            strokeWidth={lit ? 1.4 : 0.65}
            strokeOpacity={lit ? 0.7 : 0.18}
            style={{ transition: "stroke 0.2s ease, stroke-opacity 0.2s ease, stroke-width 0.2s ease" }}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node, idx) => {
        const active   = activeLayer === node.layer;
        const isOutput = !!node.isOutput;
        const accentColor = isOutput ? "var(--signal-green)" : "var(--accent)";
        const delay = active ? `${node.indexInLayer * 0.045}s` : "0s";

        return (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.06 + idx * 0.035, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Outer glow ring */}
            <circle
              cx={node.x} cy={node.y}
              r={nodeR + 7}
              fill={accentColor}
              opacity={active ? 0.07 : 0}
              style={{ transition: `opacity 0.22s ease ${delay}` }}
            />

            {/* Node body */}
            <circle
              cx={node.x} cy={node.y}
              r={nodeR}
              fill={active
                ? (isOutput ? "rgba(0,255,136,0.13)" : "rgba(0,212,255,0.13)")
                : "var(--bg-elevated)"}
              stroke={active ? accentColor : "rgba(0,212,255,0.22)"}
              strokeWidth={active ? 1.5 : 0.9}
              filter={active ? (isOutput ? "url(#nn-output-glow)" : "url(#nn-node-glow)") : undefined}
              style={{ transition: `fill 0.22s ease ${delay}, stroke 0.22s ease ${delay}, stroke-width 0.18s ease ${delay}` }}
            />

            {/* Inner dot when active */}
            <circle
              cx={node.x} cy={node.y}
              r={nodeR * 0.36}
              fill={accentColor}
              opacity={active ? 0.9 : 0}
              style={{ transition: `opacity 0.18s ease ${delay}` }}
            />

            {/* Label — input (left side) / output (right side) */}
            {node.label && (
              <text
                x={node.layer === 0 ? node.x - nodeR - 6 : node.x + nodeR + 6}
                y={node.y}
                textAnchor={node.layer === 0 ? "end" : "start"}
                dominantBaseline="middle"
                fill={active ? accentColor : "var(--text-muted)"}
                fontSize={isMobile ? 7 : 8}
                fontFamily="'JetBrains Mono', monospace"
                letterSpacing="0.05em"
                style={{ transition: `fill 0.2s ease ${delay}`, userSelect: "none" }}
              >
                {node.label}
              </text>
            )}
          </motion.g>
        );
      })}

      {/* Layer column labels */}
      {LAYER_LABELS.map((label, li) => (
        <text
          key={label}
          x={layerXs[li]}
          y={labelY}
          textAnchor="middle"
          fill={activeLayer === li ? "var(--accent)" : "var(--text-muted)"}
          fontSize={isMobile ? 6 : 7}
          fontFamily="'JetBrains Mono', monospace"
          letterSpacing="0.12em"
          opacity={0.5}
          style={{ transition: "fill 0.2s ease", userSelect: "none" }}
        >
          {label}
        </text>
      ))}
    </motion.svg>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function HeroSignal() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const svgWidth  = isMobile ? M_SVG_W : D_SVG_W;
  const svgHeight = isMobile ? M_SVG_H : D_SVG_H;

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
      {/* Skip to content */}
      <a
        href="#pipeline"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded focus:bg-[var(--bg-elevated)] focus:text-[var(--accent)] focus:border focus:border-[var(--accent-border)] focus:font-mono focus:text-sm"
      >
        Skip to content
      </a>

      {/* Radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,212,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Neural net graph */}
      <div
        style={{
          width: "100%",
          maxWidth: svgWidth,
          height: svgHeight,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <NeuralNet key={isMobile ? "mobile" : "desktop"} isMobile={isMobile} />
      </div>

      {/* Text block */}
      <div
        style={{
          marginTop: "2.5rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          minHeight: "clamp(7rem, 10vh, 9rem)",
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

        {/* CTA */}
        <motion.a
          href="#pipeline"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: "0.5rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.55rem 1.25rem",
            border: "1px solid var(--accent-border)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--accent)",
            textDecoration: "none",
            background: "transparent",
            cursor: "pointer",
            transition: "background 0.2s ease, border-color 0.2s ease",
          }}
          whileHover={{ backgroundColor: "rgba(0,212,255,0.08)", borderColor: "var(--accent)" }}
          whileTap={{ scale: 0.97 }}
        >
          Explore My Work
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1v10M1 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
      </div>

      {/* Scroll indicator */}
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
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
        >
          // scroll to explore
        </motion.span>
        <motion.svg
          width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatType: "loop", delay: 0.1 }}
        >
          <path d="M1 1.5L8 8.5L15 1.5" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </section>
  );
}
