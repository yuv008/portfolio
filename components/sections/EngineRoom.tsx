"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Cloud, Settings, Zap, Play, Pause, Star } from "lucide-react";
import {
  projects,
  type Project,
  type JourneyPhase,
} from "@/components/projects/projectData";

// ─── Types ────────────────────────────────────────────────────────────────────

type SubTab = "architecture" | "decisions" | "metrics" | "reflection" | "journey";

// ─── Journey icon map ─────────────────────────────────────────────────────────

const journeyIcons: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  gear:     Wrench,
  cloud:    Cloud,
  settings: Settings,
  zap:      Zap,
};

// ─── Node color map ───────────────────────────────────────────────────────────
// Each type maps to: { stroke, fill, dot, dashed?, glow? }

interface NodeStyle {
  stroke: string;
  dot:    string;
  text:   string;
  dashed?: boolean;
  glow?:   boolean;
}

const NODE_STYLES: Record<string, NodeStyle> = {
  ai:        { stroke: "#ff6b9d",                  dot: "#ff6b9d",                  text: "#ff6b9d"                  },
  frontend:  { stroke: "#00d4ff",                  dot: "#00d4ff",                  text: "#00d4ff"                  },
  backend:   { stroke: "#00ff88",                  dot: "#00ff88",                  text: "#00ff88"                  },
  database:  { stroke: "#ffaa00",                  dot: "#ffaa00",                  text: "#ffaa00"                  },
  "vector-db": { stroke: "#ffaa00",               dot: "#ffaa00",                  text: "#ffaa00",   dashed: true   },
  process:   { stroke: "var(--text-secondary)",    dot: "var(--text-secondary)",    text: "var(--text-secondary)"    },
  infra:     { stroke: "#00ff88",                  dot: "#00ff88",                  text: "#00ff88",   glow: true     },
  data:      { stroke: "#0088cc",                  dot: "#0088cc",                  text: "#0088cc"                  },
  feature:   { stroke: "var(--text-secondary)",    dot: "var(--text-secondary)",    text: "var(--text-secondary)"    },
};

const DEFAULT_NODE_STYLE: NodeStyle = {
  stroke: "var(--accent-border)",
  dot:    "var(--text-muted)",
  text:   "var(--text-secondary)",
};

function getNodeStyle(type: string): NodeStyle {
  return NODE_STYLES[type] ?? DEFAULT_NODE_STYLE;
}

// ─── SVG layout maps ──────────────────────────────────────────────────────────

// Orpheus TTS — 11 nodes, viewBox 0 0 500 500 — pipeline flow top → bottom
// Nodes sized 130×36 (regular) and 130×48 (multiline / two-line labels)
const ORPHEUS_W   = 130;
const ORPHEUS_H   = 40;
const STANDARD_W  = 120;
const STANDARD_H  = 36;

const layoutMap: Record<
  string,
  Record<string, { x: number; y: number; w?: number; h?: number }>
> = {
  "orpheus-tts": {
    // Top tier: data sources
    "dataset":   { x: 60,  y: 20,  w: ORPHEUS_W, h: ORPHEUS_H },
    "audio-in":  { x: 310, y: 20,  w: ORPHEUS_W, h: ORPHEUS_H },
    // Second tier: codec + base model
    "snac":      { x: 60,  y: 110, w: ORPHEUS_W, h: ORPHEUS_H },
    "llama":     { x: 310, y: 110, w: ORPHEUS_W, h: ORPHEUS_H },
    // Third tier: adaptation
    "lora":      { x: 185, y: 200, w: ORPHEUS_W, h: ORPHEUS_H },
    // Fourth tier: post-processing
    "merge":     { x: 60,  y: 290, w: ORPHEUS_W, h: ORPHEUS_H },
    "gguf":      { x: 310, y: 290, w: ORPHEUS_W, h: ORPHEUS_H },
    // Fifth tier: runtime
    "llamacpp":  { x: 60,  y: 380, w: ORPHEUS_W, h: ORPHEUS_H },
    "gpu":       { x: 310, y: 380, w: ORPHEUS_W, h: ORPHEUS_H },
    // Bottom tier: serving + output
    "fastapi":   { x: 60,  y: 460, w: ORPHEUS_W, h: ORPHEUS_H },
    "audio-out": { x: 310, y: 460, w: ORPHEUS_W, h: ORPHEUS_H },
  },
  "smart-pathshala": {
    client:   { x: 140, y: 12  },
    api:      { x: 140, y: 90  },
    postgres: { x: 20,  y: 168 },
    qdrant:   { x: 260, y: 168 },
    crewai:   { x: 140, y: 168 },
    calendar: { x: 20,  y: 278 },
    examgen:  { x: 260, y: 278 },
  },
  "shetniyojan": {
    flask:        { x: 140, y: 12  },
    mongo:        { x: 260, y: 90  },
    llm:          { x: 20,  y: 90  },
    cv:           { x: 260, y: 168 },
    planning:     { x: 20,  y: 278 },
    growing:      { x: 140, y: 278 },
    distribution: { x: 260, y: 278 },
  },
  "legify": {
    input:   { x: 20,  y: 12  },
    stt:     { x: 260, y: 12  },
    django:  { x: 140, y: 90  },
    bertsum: { x: 20,  y: 190 },
    faiss:   { x: 260, y: 190 },
    rag:     { x: 260, y: 278 },
    tts:     { x: 20,  y: 278 },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nodeCenter(pos: { x: number; y: number; w?: number; h?: number }) {
  const w = pos.w ?? STANDARD_W;
  const h = pos.h ?? STANDARD_H;
  return { cx: pos.x + w / 2, cy: pos.y + h / 2 };
}

function edgePath(
  from: { x: number; y: number; w?: number; h?: number },
  to:   { x: number; y: number; w?: number; h?: number }
): { x1: number; y1: number; x2: number; y2: number } {
  const f   = nodeCenter(from);
  const t   = nodeCenter(to);
  const fw  = (from.w ?? STANDARD_W) / 2;
  const fh  = (from.h ?? STANDARD_H) / 2;
  const tw  = (to.w   ?? STANDARD_W) / 2;
  const th  = (to.h   ?? STANDARD_H) / 2;
  const dx  = t.cx - f.cx;
  const dy  = t.cy - f.cy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux  = dx / len;
  const uy  = dy / len;
  // Clip to nearest edge of each rect
  const tScale = Math.min(
    Math.abs(fw / (ux || 0.0001)),
    Math.abs(fh / (uy || 0.0001))
  );
  const startX = f.cx + ux * Math.min(tScale, fw + fh);
  const startY = f.cy + uy * Math.min(tScale, fw + fh);
  const endX   = t.cx - ux * (tw + 6);
  const endY   = t.cy - uy * (th + 6);
  return { x1: startX, y1: startY, x2: endX, y2: endY };
}

// ─── Architecture SVG ─────────────────────────────────────────────────────────

function ArchitectureDiagram({ project }: { project: Project }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const layout = layoutMap[project.id] ?? {};
  const isOrpheus = project.id === "orpheus-tts";
  const viewBox   = isOrpheus ? "0 0 500 520" : "0 0 400 350";

  const validEdges = project.architecture.edges.filter(
    (e) => layout[e.from] && layout[e.to]
  );
  const validNodes = project.architecture.nodes.filter((n) => layout[n.id]);

  return (
    <svg
      viewBox={viewBox}
      width="100%"
      aria-label={`${project.name} architecture diagram`}
      style={{ overflow: "visible" }}
    >
      <defs>
        <marker
          id={`arrow-${project.id}`}
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L8,3 z" fill="var(--accent-border)" opacity={0.9} />
        </marker>

        {/* Infra glow filter */}
        <filter id={`infra-glow-${project.id}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Hover glow filter */}
        <filter id={`hover-glow-${project.id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {validEdges.map((edge, i) => {
        const fromPos = layout[edge.from];
        const toPos   = layout[edge.to];
        const { x1, y1, x2, y2 } = edgePath(fromPos, toPos);
        const isHighlighted =
          hoveredNode === edge.from || hoveredNode === edge.to;

        return (
          <motion.line
            key={`${edge.from}-${edge.to}-${i}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={isHighlighted ? "var(--accent)" : "var(--accent-border)"}
            strokeWidth={isHighlighted ? 1.5 : 1}
            strokeOpacity={isHighlighted ? 0.9 : 0.4}
            markerEnd={`url(#arrow-${project.id})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
          />
        );
      })}

      {/* Nodes */}
      {validNodes.map((node, i) => {
        const pos      = layout[node.id];
        const style    = getNodeStyle(node.type);
        const nodeW    = pos.w ?? STANDARD_W;
        const nodeH    = pos.h ?? STANDARD_H;
        const isHovered = hoveredNode === node.id;

        // Split label on \n for multiline rendering
        const labelLines = node.label.split("\n");
        const isMulti    = labelLines.length > 1;
        const lineHeight = 11;
        const textY      = pos.y + nodeH / 2 - (isMulti ? lineHeight * (labelLines.length - 1) / 2 : 0);

        return (
          <motion.g
            key={node.id}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            style={{ cursor: "default" }}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: i * 0.06,
              ease: "easeOut" as const,
            }}
          >
            {/* Hover glow backdrop */}
            {isHovered && (
              <rect
                x={pos.x - 5}
                y={pos.y - 5}
                width={nodeW + 10}
                height={nodeH + 10}
                rx="10"
                fill={style.stroke}
                opacity={0.1}
              />
            )}

            {/* Node rectangle */}
            <rect
              x={pos.x}
              y={pos.y}
              width={nodeW}
              height={nodeH}
              rx="6"
              fill="var(--bg-elevated)"
              stroke={isHovered ? style.stroke : "var(--accent-border)"}
              strokeWidth={isHovered ? 1.5 : 1}
              strokeOpacity={isHovered ? 1 : 0.45}
              strokeDasharray={style.dashed ? "4 3" : undefined}
              filter={
                isHovered
                  ? `url(#hover-glow-${project.id})`
                  : style.glow
                  ? `url(#infra-glow-${project.id})`
                  : undefined
              }
              style={{ transition: "stroke 0.18s, stroke-opacity 0.18s" }}
            />

            {/* Color indicator dot */}
            <circle
              cx={pos.x + 12}
              cy={pos.y + nodeH / 2}
              r={3}
              fill={style.dot}
              opacity={isHovered ? 1 : 0.7}
              style={{ transition: "opacity 0.18s" }}
            />

            {/* Label — single or multi-line */}
            {labelLines.map((line, li) => (
              <text
                key={li}
                x={pos.x + 22}
                y={textY + li * lineHeight}
                dominantBaseline="middle"
                fontSize="9.5"
                fontFamily="'JetBrains Mono', monospace"
                fill={isHovered ? style.text : "var(--text-secondary)"}
                opacity={isHovered ? 1 : 0.82}
                style={{ transition: "fill 0.18s, opacity 0.18s", userSelect: "none" }}
              >
                {line}
              </text>
            ))}

            {/* Tooltip shown on hover (inline SVG foreignObject) */}
            {isHovered && node.tooltip && (
              <foreignObject
                x={pos.x + nodeW + 6}
                y={pos.y - 4}
                width={160}
                height={60}
                style={{ overflow: "visible" }}
              >
                <div
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--accent-border)",
                    borderRadius: 6,
                    padding: "6px 8px",
                    fontSize: "9px",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    pointerEvents: "none",
                    width: 155,
                  }}
                >
                  {node.tooltip}
                </div>
              </foreignObject>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}

// ─── Audio Player ─────────────────────────────────────────────────────────────

function formatTime(s: number): string {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function AudioPlayer({ bars }: { bars: number[] }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying]   = useState(false);
  const [progress, setProgress] = useState(0);   // 0–1
  const [duration, setDuration] = useState(0);
  const [current,  setCurrent]  = useState(0);
  const barContainerRef = useRef<HTMLDivElement>(null);

  // Sync progress from audio timeupdate
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
        setCurrent(audio.currentTime);
      }
    };
    const onLoaded = () => setDuration(audio.duration);
    const onEnded  = () => { setPlaying(false); setProgress(0); setCurrent(0); };
    audio.addEventListener("timeupdate",  onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended",       onEnded);
    return () => {
      audio.removeEventListener("timeupdate",     onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended",          onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  // Click on waveform to seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    setProgress(ratio);
  };

  const playedBars = Math.round(progress * bars.length);

  return (
    <div
      style={{
        marginTop:    "1.25rem",
        borderRadius: "0.5rem",
        border:       "1px solid var(--accent-border)",
        background:   "var(--bg-elevated)",
        padding:      "14px 16px",
      }}
    >
      {/* Hidden native audio element */}
      <audio ref={audioRef} src="/audio/orpheus-demo.wav" preload="metadata" />

      <p className="mono-label" style={{ marginBottom: "10px" }}>// audio sample</p>

      {/* Waveform — click to seek */}
      <div
        ref={barContainerRef}
        onClick={handleSeek}
        style={{
          display:     "flex",
          alignItems:  "center",
          gap:         "2px",
          height:      "36px",
          marginBottom: "10px",
          cursor:      "pointer",
        }}
        aria-label="Audio waveform — click to seek"
      >
        {bars.map((pct, i) => (
          <div
            key={i}
            style={{
              width:        3,
              height:       `${pct}%`,
              background:   i < playedBars ? "var(--accent)" : "var(--text-muted)",
              borderRadius: 1,
              opacity:      i < playedBars ? 0.9 : 0.35,
              flexShrink:   0,
              transition:   "background 0.05s, opacity 0.05s",
            }}
          />
        ))}
      </div>

      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Play / Pause button */}
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            width:          28,
            height:         28,
            borderRadius:   "50%",
            border:         `1px solid ${playing ? "var(--accent)" : "var(--accent-border)"}`,
            background:     playing ? "var(--accent-glow)" : "transparent",
            cursor:         "pointer",
            color:          playing ? "var(--accent)" : "var(--text-secondary)",
            flexShrink:     0,
            transition:     "border-color 0.2s, background 0.2s, color 0.2s",
          }}
        >
          {playing
            ? <Pause size={11} strokeWidth={2} />
            : <Play  size={11} strokeWidth={2} style={{ marginLeft: 1 }} />}
        </button>

        {/* Time display */}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize:   "0.68rem",
            color:      "var(--text-muted)",
            letterSpacing: "0.04em",
            userSelect: "none",
          }}
        >
          {formatTime(current)} / {formatTime(duration)}
        </span>

        {/* Label */}
        <span
          style={{
            marginLeft:  "auto",
            fontFamily:  "'JetBrains Mono', monospace",
            fontSize:    "0.62rem",
            color:       "var(--text-muted)",
            letterSpacing: "0.06em",
            userSelect:  "none",
          }}
        >
          Generated by fine-tuned Orpheus TTS
        </span>
      </div>
    </div>
  );
}

// ─── Stack pills ──────────────────────────────────────────────────────────────

function StackPills({ stack }: { stack: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
      {stack.map((tech) => (
        <span
          key={tech}
          style={{
            fontFamily:      "'JetBrains Mono', monospace",
            fontSize:        "0.7rem",
            letterSpacing:   "0.06em",
            background:      "var(--bg-elevated)",
            border:          "1px solid var(--accent-border)",
            color:           "var(--text-secondary)",
            padding:         "3px 10px",
            borderRadius:    "4px",
            display:         "inline-block",
          }}
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

// ─── Sub-tab content panels ───────────────────────────────────────────────────

function DecisionsPanel({ project }: { project: Project }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "4px" }}>
      {project.decisions.map((d, i) => (
        <div key={i}>
          <p
            style={{
              fontFamily:   "'JetBrains Mono', monospace",
              fontSize:     "0.8rem",
              color:        "var(--accent)",
              marginBottom: "6px",
              lineHeight:   1.5,
            }}
          >
            {d.question}
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            {d.answer}
          </p>
        </div>
      ))}
    </div>
  );
}

function MetricsPanel({ project }: { project: Project }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "4px" }}>
      {project.metrics.map((m, i) => (
        <div
          key={i}
          style={{
            background:   "var(--bg-elevated)",
            border:       "1px solid var(--accent-border)",
            borderRadius: "8px",
            padding:      "16px 18px",
            minWidth:     "130px",
            flex:         "1 1 130px",
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize:   "1.8rem",
              fontWeight: 600,
              color:      "var(--accent)",
              lineHeight: 1,
              marginBottom: "4px",
            }}
          >
            {m.value}
            {m.unit && (
              <span style={{ fontSize: "0.95rem", marginLeft: "3px", opacity: 0.75 }}>
                {m.unit}
              </span>
            )}
          </div>
          <div
            style={{
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:      "0.7rem",
              textTransform: "uppercase" as const,
              letterSpacing: "0.08em",
              color:         "var(--text-muted)",
              marginBottom:  "4px",
            }}
          >
            {m.label}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
            {m.detail}
          </div>
        </div>
      ))}
    </div>
  );
}

function ReflectionPanel({ project }: { project: Project }) {
  return (
    <blockquote
      style={{
        borderLeft:  "2px solid var(--accent-border)",
        paddingLeft: "16px",
        margin:      "4px 0 0 0",
      }}
    >
      <p
        style={{
          fontStyle:  "italic",
          color:      "var(--text-secondary)",
          fontSize:   "0.9rem",
          lineHeight: 1.75,
        }}
      >
        {project.reflection}
      </p>
    </blockquote>
  );
}

function ArchitectureInlinePanel({ project }: { project: Project }) {
  return (
    <div
      style={{
        background:   "var(--bg-elevated)",
        border:       "1px solid var(--accent-border)",
        borderRadius: "8px",
        padding:      "16px",
        marginTop:    "4px",
      }}
    >
      <ArchitectureDiagram project={project} />
    </div>
  );
}

// ─── Journey panel ────────────────────────────────────────────────────────────

const journeyItemVariants = {
  hidden:  { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      delay:    i * 0.15,
      ease:     [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

function JourneyPanel({ journey }: { journey: JourneyPhase[] }) {
  return (
    <div style={{ marginTop: "4px", position: "relative" }}>
      {/* Continuous vertical rail */}
      <div
        style={{
          position:    "absolute",
          left:        19,
          top:         8,
          bottom:      8,
          width:       1,
          background:  "var(--accent-border)",
          opacity:     0.4,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {journey.map((phase, i) => {
          const IconComponent = journeyIcons[phase.icon] ?? Zap;
          return (
            <motion.div
              key={i}
              custom={i}
              variants={journeyItemVariants}
              initial="hidden"
              animate="visible"
              style={{ display: "flex", gap: "16px", position: "relative" }}
            >
              {/* Icon / dot column */}
              <div
                style={{
                  flexShrink:     0,
                  width:          38,
                  display:        "flex",
                  justifyContent: "center",
                  paddingTop:     "2px",
                  zIndex:         1,
                }}
              >
                <div
                  style={{
                    width:          22,
                    height:         22,
                    borderRadius:   "50%",
                    border:         `1px solid ${phase.color}`,
                    background:     "var(--bg-primary)",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    color:          phase.color,
                  }}
                >
                  <IconComponent size={11} strokeWidth={2} />
                </div>
              </div>

              {/* Content column */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily:   "'JetBrains Mono', monospace",
                    fontSize:     "0.82rem",
                    fontWeight:   500,
                    color:        phase.color,
                    marginBottom: "6px",
                    lineHeight:   1.3,
                  }}
                >
                  {phase.phase}
                </p>
                <p
                  style={{
                    fontSize:   "0.85rem",
                    color:      "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  {phase.content}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sub-tab bar ──────────────────────────────────────────────────────────────

interface SubTabDef {
  id:    SubTab;
  label: string;
}

const BASE_SUB_TABS: SubTabDef[] = [
  { id: "decisions",    label: "Decisions"    },
  { id: "metrics",      label: "Metrics"      },
  { id: "reflection",   label: "Reflection"   },
];

const JOURNEY_TAB: SubTabDef = { id: "journey", label: "Journey" };

function SubTabBar({
  active,
  tabs,
  onChange,
}: {
  active:   SubTab;
  tabs:     SubTabDef[];
  onChange: (t: SubTab) => void;
}) {
  return (
    <div
      style={{
        display:      "flex",
        gap:          0,
        borderBottom: "1px solid var(--accent-border)",
        marginBottom: "20px",
        overflowX:    "auto",
      }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              background:    "none",
              border:        "none",
              borderBottom:  isActive
                ? "2px solid var(--accent)"
                : "2px solid transparent",
              padding:       "8px 14px",
              marginBottom:  "-1px",
              cursor:        "pointer",
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:      "0.7rem",
              letterSpacing: "0.07em",
              textTransform: "uppercase" as const,
              color:         isActive ? "var(--text-primary)" : "var(--text-muted)",
              whiteSpace:    "nowrap",
              transition:    "color 0.18s, border-color 0.18s",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Left panel ───────────────────────────────────────────────────────────────

function ProjectLeftPanel({ project }: { project: Project }) {
  const hasJourney = Array.isArray(project.journey) && project.journey.length > 0;
  const subTabs    = hasJourney ? [...BASE_SUB_TABS, JOURNEY_TAB] : BASE_SUB_TABS;

  const [subTab, setSubTab] = useState<SubTab>("decisions");

  // Reset sub-tab if switching projects and landing on "journey" for a project
  // that has no journey data
  const safeTab: SubTab =
    subTab === "journey" && !hasJourney ? "decisions" : subTab;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Project identity */}
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{
            fontFamily:   "'JetBrains Mono', monospace",
            fontSize:     "1.2rem",
            fontWeight:   500,
            color:        "var(--text-primary)",
            marginBottom: "6px",
          }}
        >
          {project.name}
        </h3>
        <p
          style={{
            color:      "var(--text-secondary)",
            fontSize:   "0.88rem",
            lineHeight: 1.65,
          }}
        >
          {project.tagline}
        </p>
        <StackPills stack={project.stack} />
        <p
          style={{
            marginTop:     "10px",
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      "0.68rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            color:         "var(--text-muted)",
          }}
        >
          {project.period}
        </p>
      </div>

      {/* Sub-tab bar */}
      <SubTabBar active={safeTab} tabs={subTabs} onChange={setSubTab} />

      {/* Sub-tab content */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={safeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {safeTab === "decisions"    && <DecisionsPanel          project={project} />}
            {safeTab === "metrics"      && <MetricsPanel            project={project} />}
            {safeTab === "reflection"   && <ReflectionPanel         project={project} />}
            {safeTab === "journey" && hasJourney && (
              <JourneyPanel journey={project.journey!} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Right panel: architecture diagram + optional AudioPlayer ────────────────

// Stable waveform bars, seeded outside component to avoid flicker.
const WAVEFORM_BARS = Array.from({ length: 40 }, (_, i) => {
  // Deterministic pseudo-random based on index so SSR and client match
  const t = Math.sin(i * 1.7 + 0.9) * 0.5 + 0.5;
  return Math.round(t * 80 + 20); // 20–100
});

const NODE_TYPE_LEGEND: Array<{ type: string; color: string; dashed?: boolean }> = [
  { type: "ai",        color: "#ff6b9d"                   },
  { type: "frontend",  color: "#00d4ff"                   },
  { type: "backend",   color: "#00ff88"                   },
  { type: "database",  color: "#ffaa00"                   },
  { type: "vector-db", color: "#ffaa00", dashed: true      },
  { type: "process",   color: "var(--text-secondary)"     },
  { type: "infra",     color: "#00ff88"                   },
  { type: "data",      color: "#0088cc"                   },
  { type: "feature",   color: "var(--text-secondary)"     },
];

function ProjectRightPanel({ project }: { project: Project }) {
  const isOrpheus = project.id === "orpheus-tts";

  // Only show legend entries that are actually used by this project's nodes
  const usedTypes = useMemo(
    () => new Set(project.architecture.nodes.map((n) => n.type)),
    [project.architecture.nodes]
  );

  const legend = NODE_TYPE_LEGEND.filter((entry) => usedTypes.has(entry.type as never));

  return (
    <div
      style={{
        background:     "var(--bg-elevated)",
        border:         "1px solid var(--accent-border)",
        borderRadius:   "12px",
        padding:        "20px",
        height:         "100%",
        display:        "flex",
        flexDirection:  "column",
        gap:            "12px",
      }}
    >
      {/* Header */}
      <p
        style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      "0.67rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          color:         "var(--text-muted)",
        }}
      >
        Architecture
      </p>

      {/* Node type legend (filtered to used types) */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {legend.map(({ type, color, dashed }) => (
          <span
            key={type}
            style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          "5px",
              fontFamily:   "'JetBrains Mono', monospace",
              fontSize:     "0.63rem",
              color:        "var(--text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            <span
              style={{
                width:        7,
                height:       7,
                borderRadius: "50%",
                background:   dashed ? "transparent" : color,
                border:       dashed ? `1.5px dashed ${color}` : undefined,
                flexShrink:   0,
                display:      "inline-block",
              }}
            />
            {type}
          </span>
        ))}
      </div>

      {/* SVG diagram — scrollable on mobile for complex diagrams */}
      <div style={{ flex: 1, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ minWidth: "280px" }}>
          <ArchitectureDiagram project={project} />
        </div>
      </div>

      {/* AudioPlayer placeholder — Orpheus TTS only */}
      {isOrpheus && <AudioPlayer bars={WAVEFORM_BARS} />}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

const projectEnterVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y:       0,
    transition: {
      duration: 0.28,
      ease:     [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y:       -10,
    transition: {
      duration: 0.18,
      ease:     "easeIn" as const,
    },
  },
};

export function EngineRoom() {
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0].id);
  const activeProject = projects.find((p) => p.id === activeProjectId) ?? projects[0];

  return (
    <section id="engine" style={{ background: "var(--bg-primary)" }}>
      <div className="container-main">

        {/* Section heading */}
        <div style={{ marginBottom: "40px" }}>
          <p className="mono-label" style={{ marginBottom: "10px" }}>
            // projects
          </p>
          <h2
            style={{
              fontFamily:    "'JetBrains Mono', monospace",
              fontWeight:    600,
              fontSize:      "1.75rem",
              letterSpacing: "-0.01em",
              color:         "var(--text-primary)",
            }}
          >
            The Engine Room
          </h2>
        </div>

        {/* Project tab bar */}
        <div
          style={{
            display:      "flex",
            gap:          0,
            borderBottom: "1px solid var(--accent-border)",
            marginBottom: "36px",
            overflowX:    "auto",
          }}
        >
          {projects.map((project) => {
            const isActive   = project.id === activeProjectId;
            const isFeatured = project.featured === true;

            return (
              <button
                key={project.id}
                onClick={() => setActiveProjectId(project.id)}
                style={{
                  position:      "relative",
                  background:    isFeatured ? "var(--accent-glow)" : "none",
                  border:        "none",
                  borderBottom:  isActive
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                  padding:       "10px 20px",
                  marginBottom:  "-1px",
                  cursor:        "pointer",
                  fontFamily:    "'JetBrains Mono', monospace",
                  fontSize:      "0.78rem",
                  letterSpacing: "0.04em",
                  whiteSpace:    "nowrap",
                  color:         isActive ? "var(--text-primary)" : "var(--text-muted)",
                  transition:    "color 0.18s, border-color 0.18s",
                  display:       "flex",
                  alignItems:    "center",
                  gap:           "6px",
                }}
              >
                {isFeatured && (
                  <Star
                    size={11}
                    fill="var(--accent)"
                    stroke="var(--accent)"
                    style={{ flexShrink: 0 }}
                  />
                )}
                {project.name}
              </button>
            );
          })}
        </div>

        {/* Project content — two column on ≥ 900 px */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProjectId}
            variants={projectEnterVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="engine-room-grid"
            style={{
              display:               "grid",
              gridTemplateColumns:   "1fr",
              gap:                   "28px",
            }}
          >
            <ProjectLeftPanel  project={activeProject} />
            <ProjectRightPanel project={activeProject} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Responsive grid override */}
      <style>{`
        @media (min-width: 900px) {
          .engine-room-grid {
            grid-template-columns: 60% 40% !important;
          }
        }
      `}</style>
    </section>
  );
}
