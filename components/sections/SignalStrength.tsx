"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { fadeInUp, staggerContainer, viewportConfig } from "@/lib/animations";

const radarAxes = [
  { label: "Competition", value: 5 },
  { label: "Academics", value: 5 },
  { label: "Research", value: 3 },
  { label: "Building", value: 5 },
  { label: "Infrastructure", value: 4 },
];

const achievements = [
  {
    category: "Competition",
    items: [
      "Winner at Devclash 2025 — DY Patil Pimpri (ShetNiyojan)",
      "Winner at Synapse 2.0 — MKSSS CCOEW (Legify)",
      "Winner at L&T NeuroHack — COEP Mindspark 24 (WarCast)",
    ],
  },
  {
    category: "Academics",
    items: [
      "MHT-CET 2022 — 99.35 %ile, Rank 971 / 400,000+",
      "B.E. Computer Engineering, Honors in Data Science — PICT Pune",
    ],
  },
  {
    category: "Research",
    items: [
      "Co-authored paper on evidence-verified answer extraction for automated exam grading",
    ],
  },
  {
    category: "Open Source",
    items: [
      "Published fine-tuned TTS model + LoRA adapters on Hugging Face (yuv008)",
    ],
  },
];

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angle: number
): [number, number] {
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
    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView]);

  const cx = 150;
  const cy = 150;
  const maxR = 120;
  const numAxes = radarAxes.length;
  const angleStep = 360 / numAxes;

  const gridLevels = [1, 2, 3, 4, 5];

  const dataPoints = radarAxes.map((axis, i) => {
    const angle = i * angleStep;
    const r = (axis.value / 5) * maxR * progress;
    return polarToCartesian(cx, cy, r, angle);
  });

  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + "Z";

  return (
    <svg ref={ref} viewBox="0 0 300 300" className="w-full max-w-[300px] mx-auto">
      {/* Grid rings */}
      {gridLevels.map((level) => {
        const points = Array.from({ length: numAxes }, (_, i) =>
          polarToCartesian(cx, cy, (level / 5) * maxR, i * angleStep)
        );
        const path =
          points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + "Z";
        return (
          <path
            key={level}
            d={path}
            fill="none"
            stroke="var(--accent-border)"
            strokeWidth={0.5}
            opacity={0.3}
          />
        );
      })}

      {/* Axis lines */}
      {radarAxes.map((axis, i) => {
        const [ex, ey] = polarToCartesian(cx, cy, maxR, i * angleStep);
        const [lx, ly] = polarToCartesian(cx, cy, maxR + 20, i * angleStep);
        return (
          <g key={axis.label}>
            <line
              x1={cx}
              y1={cy}
              x2={ex}
              y2={ey}
              stroke="var(--accent-border)"
              strokeWidth={0.5}
              opacity={0.3}
            />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--text-muted)"
              fontSize={9}
              fontFamily="'JetBrains Mono', monospace"
            >
              {axis.label}
            </text>
          </g>
        );
      })}

      {/* Data area */}
      <path
        d={dataPath}
        fill="var(--accent)"
        fillOpacity={0.15}
        stroke="var(--accent)"
        strokeWidth={2}
      />

      {/* Data points */}
      {dataPoints.map((point, i) => (
        <circle
          key={i}
          cx={point[0]}
          cy={point[1]}
          r={4}
          fill="var(--accent)"
          stroke="var(--bg-primary)"
          strokeWidth={2}
        />
      ))}
    </svg>
  );
}

export function SignalStrength() {
  return (
    <section id="signal" className="relative">
      <div className="container-main">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportConfig}
        >
          <motion.p variants={fadeInUp} className="mono-label mb-3">
            // signal
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Signal Strength
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mt-12 items-start">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 0.6 }}
          >
            <RadarChart />
          </motion.div>

          {/* Achievement list */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={viewportConfig}
            className="space-y-8"
          >
            {achievements.map((group) => (
              <motion.div key={group.category} variants={fadeInUp}>
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "var(--accent)",
                  }}
                >
                  {group.category}
                </h3>
                <ul className="space-y-2">
                  {group.items.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm flex items-start gap-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: "var(--accent)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
