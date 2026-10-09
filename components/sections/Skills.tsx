"use client";

import { skillClusters, type AccentTone } from "@/lib/constants";

const CATEGORY_STYLE: Record<AccentTone, { color: string; icon: string }> = {
  cyan: { color: "#6ee7ff", icon: "psychology" },
  violet: { color: "#ab8aff", icon: "bolt" },
  amber: { color: "#ffac5e", icon: "database" },
  mist: { color: "#d1dce9", icon: "code_blocks" },
  green: { color: "#61ffab", icon: "terminal" },
};

// Skill map nodes use equal radii; size does not imply proficiency.
const NODE_GROUPS = [
  { x: 200, y: 55, label: "Python", color: "#d1dce9", r: 5 },
  { x: 310, y: 90, label: "C++", color: "#d1dce9", r: 5 },
  { x: 100, y: 90, label: "Go", color: "#d1dce9", r: 5 },
  { x: 200, y: 125, label: "PyTorch", color: "#6ee7ff", r: 5 },
  { x: 340, y: 195, label: "LangChain", color: "#6ee7ff", r: 5 },
  { x: 310, y: 300, label: "LoRA / PEFT", color: "#6ee7ff", r: 5 },
  { x: 355, y: 250, label: "LiveKit", color: "#ab8aff", r: 5 },
  { x: 200, y: 345, label: "Pipecat", color: "#ab8aff", r: 5 },
  { x: 110, y: 310, label: "FastAPI", color: "#ab8aff", r: 5 },
  { x: 290, y: 340, label: "Qdrant", color: "#ffac5e", r: 5 },
  { x: 60, y: 195, label: "PostgreSQL", color: "#ffac5e", r: 5 },
  { x: 50, y: 250, label: "Docker", color: "#ffac5e", r: 5 },
  { x: 90, y: 300, label: "Kubernetes", color: "#ffac5e", r: 5 },
  { x: 200, y: 260, label: "OpenTelemetry", color: "#ffac5e", r: 5 },
];

// Connector lines between related nodes (index pairs)
const EDGES = [
  [0, 3], [1, 3], [2, 3],
  [3, 4], [4, 5], [4, 6],
  [6, 7], [7, 8], [8, 9],
  [9, 10], [10, 11], [11, 12], [12, 13],
  [3, 9],
];

export function Skills() {
  return (
    <section id="skills" className="relative z-10 pb-20 overflow-hidden">
      {/* Vignette overlay to keep text legible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgb(8,12,18) 75%)",
          zIndex: 0,
        }}
      />
      {/* Section header */}
      <div className="container mx-auto px-8 md:px-24 pt-20 mb-12 relative z-10">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-neural-cyan text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-display), monospace" }}>
              System_Status: Operational
            </span>
            <div className="h-px flex-grow bg-surface-border/20" />
          </div>
          <h2 className="text-6xl md:text-8xl font-bold tracking-tight mb-4 bg-gradient-to-r from-neural-cyan to-neural-violet bg-clip-text text-transparent" style={{ fontFamily: "var(--font-display), monospace" }}>
            THE MATRIX
          </h2>
          <p className="text-text-soft text-sm max-w-lg" style={{ fontFamily: "var(--font-display), monospace" }}>
            A live map of the technical stack — from model training to production
            inference, data pipelines, and frontend delivery.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-8 md:px-24 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* ── Left: SVG Node Graph ── */}
        <div
          className="lg:col-span-7 bg-surface-2/60 rounded-[48px] p-8 md:p-12 border border-surface-border/20 relative overflow-hidden"
        >
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-display), monospace" }}>Neural_Nodes</h3>
            <span className="text-neural-cyan text-[10px] uppercase tracking-widest" style={{ fontFamily: "var(--font-display), monospace" }}>
              Technical Proficiency Graph
            </span>
          </div>

          <div className="flex items-center justify-center">
            <svg viewBox="0 0 420 400" className="w-full max-w-[420px]" style={{ overflow: "visible" }}>
              {/* Static rings keep the skill map lightweight while preserving its structure. */}
              {[150, 100, 50].map((r) => (
                <circle
                  key={r}
                  cx="200" cy="200" r={r}
                  fill="none"
                  stroke="rgba(168,232,255,0.07)"
                  strokeDasharray="4 6"
                />
              ))}

              {/* Edges — draw in on mount */}
              {EDGES.map(([a, b], i) => {
                const ax = NODE_GROUPS[a].x, ay = NODE_GROUPS[a].y;
                const bx = NODE_GROUPS[b].x, by = NODE_GROUPS[b].y;
                return (
                  <line
                    key={i}
                    x1={ax} y1={ay} x2={bx} y2={by}
                    stroke="rgba(168,232,255,0.15)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Nodes */}
              {NODE_GROUPS.map((n, i) => (
                <g key={i}>
                  <circle
                    cx={n.x} cy={n.y} r={n.r + 8}
                    fill={n.color}
                    opacity="0.08"
                  />
                  <circle
                    cx={n.x} cy={n.y} r={n.r}
                    fill={n.color}
                  />
                  <text
                    x={n.x + (n.x > 200 ? n.r + 6 : -(n.r + 6))}
                    y={n.y + 4}
                    textAnchor={n.x > 200 ? "start" : n.x === 200 ? "middle" : "end"}
                    fill="rgba(221,227,236,0.8)"
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {n.label}
                  </text>
                </g>
              ))}

              <circle
                cx="200" cy="200" r="18"
                fill="rgba(0,212,255,0.1)"
                stroke="#00d4ff"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text x="200" y="196" textAnchor="middle" fill="#00d4ff" fontSize="8" fontFamily="JetBrains Mono">CORE</text>
              <text x="200" y="207" textAnchor="middle" fill="#00d4ff" fontSize="8" fontFamily="JetBrains Mono">STACK</text>

            </svg>
          </div>

        </div>

        {/* ── Right: Skill Category Chips ── */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {skillClusters.map((cat) => {
            const style = CATEGORY_STYLE[cat.tone];
            return (
              <div
                key={cat.label}
                className="group relative rounded-3xl overflow-hidden bg-surface-2/60 border border-surface-border/20 transition-all duration-300 hover:border-opacity-100"
                style={{ borderColor: `${style.color}40` }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${style.color}18`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-3xl pointer-events-none"
                  style={{ background: `linear-gradient(to bottom, ${style.color}, transparent)` }}
                />

                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-full border transition-transform hover:scale-110 hover:rotate-[5deg]"
                        style={{ borderColor: `${style.color}40`, background: `${style.color}12` }}
                      >
                        <span className="material-symbols-outlined text-base" style={{ color: style.color }}>
                          {style.icon}
                        </span>
                      </div>
                      <span
                        className="text-[10px] uppercase tracking-[0.2em] font-semibold"
                        style={{ fontFamily: "var(--font-display), monospace", color: style.color }}
                      >
                        {cat.label}
                      </span>
                    </div>
                    <div
                      className="rounded-full px-2 py-1 text-[9px] font-semibold text-text-muted"
                      style={{
                        fontFamily: "var(--font-display), monospace",
                        backgroundColor: `${style.color}10`,
                        borderColor: `${style.color}25`,
                        border: "1px solid",
                      }}
                    >
                      {cat.skills.length} modules
                    </div>
                  </div>

                  <div
                    className="h-px mb-4 relative overflow-hidden"
                    style={{ background: `linear-gradient(to right, ${style.color}, transparent)` }}
                  />

                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-full text-[11px] border transition-all duration-300 hover:scale-110 cursor-default relative"
                        style={{
                          background: `${style.color}0d`,
                          borderColor: `${style.color}25`,
                          color: "rgb(221,227,236)",
                          fontFamily: "var(--font-display), monospace",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLSpanElement).style.background = `${style.color}25`;
                          (e.currentTarget as HTMLSpanElement).style.borderColor = `${style.color}60`;
                          (e.currentTarget as HTMLSpanElement).style.color = style.color;
                          (e.currentTarget as HTMLSpanElement).style.boxShadow = `0 0 10px ${style.color}35`;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLSpanElement).style.background = `${style.color}0d`;
                          (e.currentTarget as HTMLSpanElement).style.borderColor = `${style.color}25`;
                          (e.currentTarget as HTMLSpanElement).style.color = "";
                          (e.currentTarget as HTMLSpanElement).style.boxShadow = "";
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
