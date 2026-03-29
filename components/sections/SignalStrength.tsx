"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { fadeInUp, staggerContainer, viewportConfig } from "@/lib/animations";

// ─── Data ─────────────────────────────────────────────────────────────────────

const radarAxes = [
  { label: "Competition", value: 5 },
  { label: "Academics",   value: 5 },
  { label: "Research",    value: 3 },
  { label: "Building",    value: 5 },
  { label: "Infra",       value: 4 },
];

const quickStats = [
  { value: "3×",       label: "hackathon wins"   },
  { value: "99.35%",   label: "MHT-CET percentile" },
  { value: "1",        label: "published paper"  },
  { value: "4+",       label: "projects shipped" },
];

// Category colour map — used for inline badges
const categoryColors: Record<string, string> = {
  Competition:   "var(--accent)",
  Academics:     "var(--signal-green)",
  Research:      "#ff6b9d",
  "Open Source": "var(--signal-amber)",
};

const achievements: { category: string; text: string }[] = [
  { category: "Competition",   text: "Winner — Devclash 2025, DY Patil Pimpri (ShetNiyojan)" },
  { category: "Competition",   text: "Winner — Synapse 2.0, MKSSS CCOEW (Legify)" },
  { category: "Competition",   text: "Winner — L&T NeuroHack, COEP Mindspark 24 (WarCast)" },
  { category: "Academics",     text: "MHT-CET 2022 — 99.35 %ile, Rank 971 / 400,000+" },
  { category: "Academics",     text: "B.E. Computer Engineering, Honors in Data Science — PICT Pune" },
  { category: "Research",      text: "Co-authored paper on evidence-verified answer extraction for automated exam grading" },
  { category: "Open Source",   text: "Published fine-tuned TTS model + LoRA adapters on Hugging Face (yuv008)" },
];

// ─── Radar chart ──────────────────────────────────────────────────────────────

function polarToCartesian(cx: number, cy: number, r: number, angle: number): [number, number] {
  const rad = (angle - 90) * (Math.PI / 180);
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function RadarChart() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start: number | null = null;
    const duration = 1500;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView]);

  const cx = 160;
  const cy = 160;
  const maxR = 110;
  const angleStep = 360 / radarAxes.length;

  const dataPoints = radarAxes.map((axis, i) => {
    const r = (axis.value / 5) * maxR * progress;
    return polarToCartesian(cx, cy, r, i * angleStep);
  });

  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ") + "Z";

  return (
    <svg
      ref={ref}
      viewBox="0 0 320 320"
      className="w-full"
      style={{ maxWidth: 360, margin: "0 auto", display: "block" }}
      aria-label="Radar chart showing skill signal strengths"
    >
      {/* Grid rings */}
      {[1, 2, 3, 4, 5].map((level) => {
        const pts = Array.from({ length: radarAxes.length }, (_, i) =>
          polarToCartesian(cx, cy, (level / 5) * maxR, i * angleStep)
        );
        const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ") + "Z";
        return (
          <path
            key={level}
            d={path}
            fill="none"
            stroke="var(--accent-border)"
            strokeWidth={level === 5 ? 1 : 0.5}
            opacity={level === 5 ? 0.35 : 0.2}
          />
        );
      })}

      {/* Axis lines + labels */}
      {radarAxes.map((axis, i) => {
        const [ex, ey] = polarToCartesian(cx, cy, maxR, i * angleStep);
        const [lx, ly] = polarToCartesian(cx, cy, maxR + 26, i * angleStep);
        return (
          <g key={axis.label}>
            <line
              x1={cx} y1={cy} x2={ex} y2={ey}
              stroke="var(--accent-border)" strokeWidth={0.5} opacity={0.25}
            />
            <text
              x={lx} y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--text-secondary)"
              fontSize={11}
              fontFamily="'JetBrains Mono', monospace"
            >
              {axis.label}
            </text>
          </g>
        );
      })}

      {/* Filled data area */}
      <path
        d={dataPath}
        fill="var(--accent)"
        fillOpacity={0.12}
        stroke="var(--accent)"
        strokeWidth={1.5}
      />

      {/* Data point dots */}
      {dataPoints.map((point, i) => (
        <circle
          key={i}
          cx={point[0]}
          cy={point[1]}
          r={3.5}
          fill="var(--accent)"
          stroke="var(--bg-primary)"
          strokeWidth={2}
        />
      ))}
    </svg>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function SignalStrength() {
  return (
    <section id="signal" className="relative">
      <div className="container-main">

        {/* Heading */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportConfig}
          style={{ marginBottom: "3rem" }}
        >
          <motion.p variants={fadeInUp} className="mono-label" style={{ marginBottom: "0.75rem" }}>
            // signal
          </motion.p>
          <motion.h2 variants={fadeInUp} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Signal Strength
          </motion.h2>
        </motion.div>

        {/* Radar chart — centered hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportConfig}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: 360, margin: "0 auto 3rem" }}
        >
          <RadarChart />
        </motion.div>

        {/* Quick-stat row */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportConfig}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1px",
            background: "var(--accent-border)",
            border: "1px solid var(--accent-border)",
            borderRadius: "0.75rem",
            overflow: "hidden",
            marginBottom: "3rem",
          }}
        >
          {quickStats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              style={{
                background: "var(--bg-card)",
                padding: "1.25rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.68rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)",
                }}
              >
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Flat achievement list */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportConfig}
        >
          <motion.p variants={fadeInUp} className="mono-label" style={{ marginBottom: "1.25rem" }}>
            // achievements
          </motion.p>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {achievements.map((item, i) => {
              const color = categoryColors[item.category] ?? "var(--accent)";
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "1rem",
                    padding: "0.875rem 0.5rem",
                    borderTop: "1px solid var(--accent-border)",
                    borderRadius: "4px",
                    cursor: "default",
                    transition: "background 0.15s ease",
                    ...(i === achievements.length - 1 ? { borderBottom: "1px solid var(--accent-border)" } : {}),
                  }}
                  whileHover={{
                    backgroundColor: "rgba(0, 212, 255, 0.04)",
                  }}
                >
                  {/* Category badge */}
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.62rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      color,
                      background: `${color}14`,
                      border: `1px solid ${color}40`,
                      padding: "2px 7px",
                      borderRadius: "4px",
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.category}
                  </span>

                  {/* Achievement text */}
                  <span
                    style={{
                      fontFamily: "'Satoshi', 'General Sans', sans-serif",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.text}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
