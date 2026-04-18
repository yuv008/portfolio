"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";

// ─── Data ──────────────────────────────────────────────────────────
const CHAPTERS = [
  {
    id: "capture",
    num: "01",
    tone: "cyan" as const,
    label: "Capture",
    title: "Voice_Capture",
    blurb:
      "Raw PCM audio streams in over LiveKit. No buffering, no round-trip. Every 20ms frame is eligible for inference.",
    metric: { label: "Frame size", value: "20ms" },
  },
  {
    id: "transcribe",
    num: "02",
    tone: "cyan" as const,
    label: "Transcribe",
    title: "Stream_Transcription",
    blurb:
      "Rolling ASR window; partial transcripts flush to the orchestrator before the speaker finishes the sentence.",
    metric: { label: "First token", value: "180ms" },
  },
  {
    id: "embed",
    num: "03",
    tone: "violet" as const,
    label: "Embed",
    title: "Dense_Sparse_Embed",
    blurb:
      "Each partial is embedded twice — dense for semantics, sparse for lexical recall. Hybrid rank, not reranked.",
    metric: { label: "Dim", value: "768 + BM25" },
  },
  {
    id: "retrieve",
    num: "04",
    tone: "violet" as const,
    label: "Retrieve",
    title: "Qdrant_Retrieval",
    blurb:
      "Migrated off ChromaDB. Qdrant hybrid search + semantic cache cuts retrieval latency by 90%. Pooled connections, pre-warmed shards.",
    metric: { label: "Latency", value: "−90%" },
  },
  {
    id: "generate",
    num: "05",
    tone: "amber" as const,
    label: "Generate",
    title: "LLM_Orchestration",
    blurb:
      "Function-calling LLM fuses context, tools, and user intent. Cached prompts and speculative decoding shave another 60% off round-trip.",
    metric: { label: "API calls", value: "−60%" },
  },
  {
    id: "respond",
    num: "06",
    tone: "green" as const,
    label: "Respond",
    title: "Voice_Synthesis",
    blurb:
      "SNAC-codec TTS streams audio back within the same LiveKit session. End-to-end, input-to-speech: under 14ms ceiling.",
    metric: { label: "E2E", value: "14ms" },
  },
];

const TC: Record<string, string> = {
  cyan: "#6ee7ff",
  violet: "#ab8aff",
  amber: "#ffac5e",
  green: "#61ffab",
};

// ─── SVG Geometry ─────────────────────────────────────────────────
// 6 nodes on a 540×310 viewBox arranged in an S-wave
const NODES = [
  { x: 50,  y: 200 },
  { x: 146, y: 100 },
  { x: 242, y: 210 },
  { x: 338, y: 100 },
  { x: 434, y: 200 },
  { x: 490, y: 130 },
];

// Catmull-Rom → cubic bezier through all 6 nodes
const PIPELINE_PATH =
  "M 50 200 C 82 167 114 98 146 100 C 178 102 210 210 242 210 " +
  "C 274 210 306 102 338 100 C 370 98 410 195 434 200 " +
  "C 458 205 471 153 490 130";

// ─── Pipeline Diagram ─────────────────────────────────────────────
function PipelineDiagram({
  active,
  fillProgress,
}: {
  active: number;
  fillProgress: MotionValue<number>;
}) {
  return (
    <svg
      viewBox="0 0 540 310"
      className="w-full h-auto"
      style={{ overflow: "visible", maxHeight: 230 }}
      aria-hidden="true"
    >
      <defs>
        {/* Gradient along the path direction */}
        <linearGradient id="sc-pathGrad" gradientUnits="userSpaceOnUse" x1="50" y1="0" x2="490" y2="0">
          <stop offset="0%"   stopColor="#6ee7ff" />
          <stop offset="45%"  stopColor="#ab8aff" />
          <stop offset="80%"  stopColor="#ffac5e" />
          <stop offset="100%" stopColor="#61ffab" />
        </linearGradient>
        {/* Per-tone radial glow for active halos */}
        {(["cyan", "violet", "amber", "green"] as const).map((t) => (
          <radialGradient key={t} id={`sc-halo-${t}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={TC[t]} stopOpacity="0.7" />
            <stop offset="100%" stopColor={TC[t]} stopOpacity="0"   />
          </radialGradient>
        ))}
        <filter id="sc-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Ghost path — dim dashed */}
      <path
        d={PIPELINE_PATH}
        fill="none"
        stroke="rgba(110,231,255,0.1)"
        strokeWidth="1"
        strokeDasharray="5 5"
      />

      {/* Glow copy of progress path */}
      <motion.path
        d={PIPELINE_PATH}
        fill="none"
        stroke="url(#sc-pathGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeOpacity="0.18"
        style={{ pathLength: fillProgress }}
      />

      {/* Main progress path */}
      <motion.path
        d={PIPELINE_PATH}
        fill="none"
        stroke="url(#sc-pathGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ pathLength: fillProgress }}
      />

      {/* Spring-animated signal dot at active node */}
      <motion.circle
        r={4}
        fill="#a8e8ff"
        style={{ filter: "drop-shadow(0 0 6px #6ee7ff)" }}
        animate={{ cx: NODES[active].x, cy: NODES[active].y }}
        transition={{ type: "spring", stiffness: 60, damping: 18 }}
      />

      {/* Nodes */}
      {CHAPTERS.map((c, i) => {
        const n  = NODES[i];
        const lit = i <= active;
        const isActive = i === active;
        const col = TC[c.tone];
        const r = 8;

        return (
          <g key={c.id}>
            {/* Pulsing halo on active node */}
            {isActive && (
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={22}
                fill={`url(#sc-halo-${c.tone})`}
                animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.25, 0.6] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: `${n.x}px`, originY: `${n.y}px` }}
              />
            )}

            {/* Outer ring for lit nodes */}
            {lit && (
              <circle
                cx={n.x} cy={n.y} r={14}
                fill="none"
                stroke={col}
                strokeWidth="1"
                strokeOpacity="0.22"
              />
            )}

            {/* Diamond node */}
            <motion.polygon
              points={`${n.x},${n.y - r} ${n.x + r},${n.y} ${n.x},${n.y + r} ${n.x - r},${n.y}`}
              fill={lit ? col : "rgb(19,26,36)"}
              stroke={col}
              strokeWidth={isActive ? 1.5 : 1}
              strokeOpacity={lit ? 1 : 0.35}
              animate={{ scale: isActive ? 1.25 : 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{
                originX: `${n.x}px`,
                originY: `${n.y}px`,
                filter: lit ? `drop-shadow(0 0 ${isActive ? 10 : 5}px ${col})` : "none",
                transition: "fill 0.45s cubic-bezier(0.22,1,0.36,1), filter 0.45s",
              }}
            />

            {/* Node label */}
            <text
              x={n.x} y={n.y + 30}
              textAnchor="middle"
              fill={lit ? col : "rgba(126,142,156,0.45)"}
              fontSize="9"
              fontFamily="JetBrains Mono, monospace"
              letterSpacing="2"
              style={{ transition: "fill 0.4s" }}
            >
              {c.num}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Chapter Rail ──────────────────────────────────────────────────
function ChapterRail({
  active,
  onJump,
}: {
  active: number;
  onJump: (i: number) => void;
}) {
  return (
    <div
      className="relative flex flex-col gap-1"
      style={{
        padding: "18px 10px",
        background: "rgba(14,20,26,0.75)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(72,88,104,0.2)",
        borderRadius: 28,
        width: 148,
        flexShrink: 0,
        alignSelf: "flex-start",
      }}
    >
      {/* Vertical connector line */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: 21,
          top: 28,
          bottom: 28,
          width: 1,
          background:
            "linear-gradient(to bottom, rgba(110,231,255,0.2), rgba(171,138,255,0.18), rgba(97,255,171,0.18))",
        }}
      />

      {CHAPTERS.map((c, i) => {
        const isActive = i === active;
        const isPast   = i < active;
        const col = TC[c.tone];
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onJump(i)}
            suppressHydrationWarning
            className="relative z-10 text-left rounded-xl"
            style={{
              display: "grid",
              gridTemplateColumns: "14px 28px 1fr",
              alignItems: "center",
              gap: 8,
              padding: "7px 10px",
              background: isActive ? `${col}12` : "transparent",
              border: "none",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
          >
            {/* Dot */}
            <motion.span
              className="rounded-sm"
              style={{ width: 10, height: 10, display: "inline-block", rotate: 45 }}
              animate={{
                background: isActive || isPast ? col : "transparent",
                borderColor: isActive || isPast ? col : "rgba(110,231,255,0.25)",
                boxShadow: isActive ? `0 0 10px ${col}` : "none",
              }}
              transition={{ duration: 0.3 }}
              initial={false}
            />
            {/* Num */}
            <span
              style={{
                fontFamily: "var(--font-display), monospace",
                fontSize: 10,
                letterSpacing: "0.18em",
                color: isActive || isPast ? col : "rgb(126,142,156)",
                transition: "color 0.3s",
              }}
            >
              {c.num}
            </span>
            {/* Label */}
            <span
              style={{
                fontFamily: "var(--font-display), monospace",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: isActive ? "rgb(233,240,245)" : "rgb(126,142,156)",
                transition: "color 0.3s",
              }}
            >
              {c.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────
export function Scrollytelling() {
  const [active, setActive] = useState(0);
  const stageRef    = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── Scroll-linked smooth fill for the SVG path ──────────────────
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });
  const smoothFill = useSpring(
    useTransform(scrollYProgress, [0.02, 0.98], [0, 1]),
    { stiffness: 50, damping: 22, restDelta: 0.001 }
  );

  // ── Discrete chapter via IntersectionObserver ───────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.idx));
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    chapterRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const jump = (i: number) => {
    const el = chapterRefs.current[i];
    if (el)
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
  };

  const cur    = CHAPTERS[active];
  const curCol = TC[cur.tone];

  return (
    <section id="pipeline" className="section-shell">
      <div className="section-container">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-kicker mb-4">// Interactive_Scroll · 06 Chapters</p>
          <h2 className="section-title">
            The_{" "}
            <span className="bg-gradient-to-r from-neural-cyan to-neural-violet bg-clip-text text-transparent">
              Pipeline
            </span>
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-base leading-7 text-text-soft">
            Scroll through six beats of the voice-agent pipeline. Each chapter pins a node. The graph lights up as you move.
          </p>
        </motion.div>

        {/* ── Stage: sticky left + scrolling right ── */}
        <div
          ref={stageRef}
          className="grid gap-12"
          style={{ gridTemplateColumns: "1fr 1fr", alignItems: "stretch" }}
        >
          {/* ── Sticky left column (desktop only) ── */}
          <div className="hidden md:block relative">
            <div
              className="sticky"
              style={{
                top: 100,
                height: "min(720px, calc(100vh - 140px))",
                display: "flex",
                gap: 14,
              }}
            >
              <ChapterRail active={active} onJump={jump} />

              {/* Visual panel — clipped angular shape */}
              <div
                className="relative flex-1 flex flex-col gap-3 overflow-hidden"
                style={{
                  padding: "22px 20px",
                  background: "rgba(16,23,32,0.9)",
                  backdropFilter: "blur(32px)",
                  border: `1px solid ${curCol}30`,
                  borderRadius: 28,
                  clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)",
                  boxShadow: `0 0 0 1px ${curCol}18, 0 24px 80px rgba(0,0,0,0.4)`,
                  transition: "border-color 0.5s, box-shadow 0.5s",
                }}
              >
                {/* Scan line */}
                <motion.div
                  className="absolute inset-x-0 pointer-events-none"
                  style={{
                    height: 1,
                    background: `linear-gradient(to right, transparent, ${curCol}55, transparent)`,
                    zIndex: 10,
                  }}
                  animate={{ top: ["0%", "100%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                />

                {/* Background grid texture */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(110,231,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(110,231,255,1) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />

                {/* Chapter tag + title — AnimatePresence cross-fade */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`head-${active}`}
                    className="relative z-10 flex items-baseline justify-between gap-3 flex-wrap"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <span
                      className="rounded-full px-3 py-1"
                      style={{
                        fontFamily: "var(--font-display), monospace",
                        fontSize: 10,
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: curCol,
                        border: `1px solid ${curCol}55`,
                      }}
                    >
                      Chapter {cur.num} / 06
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display), monospace",
                        fontSize: 18,
                        fontWeight: 700,
                        color: "rgb(233,240,245)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {cur.title}
                    </span>
                  </motion.div>
                </AnimatePresence>

                {/* SVG diagram */}
                <div className="relative z-10 flex-1 min-h-0">
                  <PipelineDiagram active={active} fillProgress={smoothFill} />
                </div>

                {/* Terminal stream */}
                <div
                  className="relative z-10 rounded-2xl overflow-hidden"
                  style={{
                    fontFamily: "var(--font-display), monospace",
                    fontSize: 11,
                    lineHeight: "1.85",
                    background: "rgba(8,12,18,0.7)",
                    border: "1px solid rgba(72,88,104,0.2)",
                    padding: "10px 14px",
                    maxHeight: 110,
                  }}
                >
                  {CHAPTERS.slice(0, active + 1).map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ color: i === active ? TC[c.tone] : "rgba(126,142,156,0.65)" }}
                    >
                      <span style={{ color: `${TC[c.tone]}88` }}>&gt;</span>{" "}
                      {c.num} · {c.label.toLowerCase()}_complete{" "}
                      <span style={{ color: "#61ffab", opacity: i < active ? 1 : 0.45 }}>
                        {i < active ? "[OK]" : "[...]"}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Metric pill — AnimatePresence */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`metric-${active}`}
                    className="relative z-10 flex justify-between items-center rounded-2xl"
                    style={{
                      padding: "10px 14px",
                      background: "rgba(8,12,18,0.65)",
                      border: `1px solid ${curCol}35`,
                    }}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display), monospace",
                        fontSize: 10,
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: "rgb(126,142,156)",
                      }}
                    >
                      {cur.metric.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display), monospace",
                        fontSize: 20,
                        fontWeight: 700,
                        color: curCol,
                      }}
                    >
                      {cur.metric.value}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── Right: scrolling chapter cards ── */}
          <div className="flex flex-col pb-[18vh]">
            {CHAPTERS.map((c, i) => {
              const col = TC[c.tone];
              const isActive = active === i;
              return (
                <div
                  key={c.id}
                  data-idx={i}
                  ref={(el) => { chapterRefs.current[i] = el; }}
                  className="relative flex flex-col justify-center"
                  style={{ minHeight: "75vh", padding: "40px 8px 40px 28px" }}
                >
                  {/* Backdrop glow when active */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none rounded-3xl"
                    animate={{
                      opacity: isActive ? 1 : 0,
                      background: `radial-gradient(ellipse at 20% 50%, ${col}0d 0%, transparent 70%)`,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />

                  {/* Animated left accent bar */}
                  <motion.div
                    className="absolute left-0 top-8 bottom-8 w-[2px] rounded-full"
                    style={{ background: col, originY: 0.5 }}
                    animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 22 }}
                  />

                  {/* Mobile chapter tag */}
                  <div
                    className="md:hidden mb-3 relative z-10"
                    style={{
                      fontFamily: "var(--font-display), monospace",
                      fontSize: 10,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: col,
                    }}
                  >
                    Chapter {c.num} / 06
                  </div>

                  {/* Ghost watermark number — stroked outline */}
                  <div
                    className="relative z-10 select-none"
                    style={{
                      fontFamily: "var(--font-display), monospace",
                      fontSize: "clamp(72px, 14vw, 110px)",
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: "-0.08em",
                      color: "transparent",
                      WebkitTextStroke: `1px ${col}`,
                      opacity: isActive ? 0.18 : 0.07,
                      marginBottom: -24,
                      transition: "opacity 0.5s",
                    }}
                  >
                    {c.num}
                  </div>

                  {/* Kicker */}
                  <div
                    className="relative z-10 mb-1"
                    style={{
                      fontFamily: "var(--font-display), monospace",
                      fontSize: 10,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: col,
                    }}
                  >
                    // {c.label}_node
                  </div>

                  {/* Title */}
                  <h3
                    className="relative z-10"
                    style={{
                      fontFamily: "var(--font-display), monospace",
                      fontSize: "clamp(26px, 4.5vw, 42px)",
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: "-0.05em",
                      color: "rgb(233,240,245)",
                      margin: "8px 0 16px",
                    }}
                  >
                    {c.title}
                  </h3>

                  {/* Body */}
                  <p
                    className="relative z-10"
                    style={{
                      fontFamily: "var(--font-body), sans-serif",
                      fontSize: 16,
                      lineHeight: 1.75,
                      color: "rgb(191,205,218)",
                      maxWidth: 460,
                      margin: 0,
                    }}
                  >
                    {c.blurb}
                  </p>

                  {/* Metric pill */}
                  <div className="relative z-10 mt-6">
                    <span
                      className="inline-flex items-center rounded-full"
                      style={{
                        padding: "7px 14px",
                        fontFamily: "var(--font-display), monospace",
                        fontSize: 10,
                        letterSpacing: "0.24em",
                        textTransform: "uppercase",
                        color: col,
                        border: `1px solid ${col}55`,
                        background: `${col}10`,
                      }}
                    >
                      {c.metric.label} · {c.metric.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
