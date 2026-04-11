"use client";

import { motion } from "framer-motion";

// ── Real skill data derived from projectData.ts + experience ──────────────────

const SKILL_CATEGORIES = [
  {
    label: "AI / ML",
    color: "#6ee7ff", // neural-cyan
    icon: "psychology",
    skills: ["Python", "PyTorch", "Llama 3.x", "LoRA / PEFT", "Unsloth", "SNAC Codec", "BERTSum", "CrewAI"],
  },
  {
    label: "Inference & Serving",
    color: "#ab8aff", // neural-violet
    icon: "bolt",
    skills: ["llama.cpp", "GGUF / Q4_K_M", "FastAPI", "Flask", "LiveKit", "LLM Streaming"],
  },
  {
    label: "Data & Vector",
    color: "#6ee7ff", // neural-cyan
    icon: "database",
    skills: ["Qdrant", "FAISS", "ChromaDB", "PostgreSQL", "MongoDB", "RAG Pipelines"],
  },
  {
    label: "Frontend & Infra",
    color: "#d1dce9", // neural-mist
    icon: "code_blocks",
    skills: ["React", "Next.js", "Svelte", "Django", "Docker", "Lightning AI / GPU"],
  },
];

// SVG node positions mapped to skills — diamond layout per category
const NODE_GROUPS = [
  // AI/ML — top quadrant
  { x: 200, y: 55,  label: "Python",   color: "#a8e8ff", r: 7 },
  { x: 310, y: 90,  label: "PyTorch",  color: "#a8e8ff", r: 5 },
  { x: 100, y: 90,  label: "LoRA",     color: "#a8e8ff", r: 5 },
  { x: 200, y: 125, label: "Llama 3",  color: "#a8e8ff", r: 6 },
  // Inference — right quadrant
  { x: 340, y: 195, label: "llama.cpp",color: "#dcb8ff", r: 6 },
  { x: 310, y: 300, label: "FastAPI",  color: "#dcb8ff", r: 5 },
  { x: 355, y: 250, label: "LiveKit",  color: "#dcb8ff", r: 4 },
  // Data — bottom quadrant
  { x: 200, y: 345, label: "Qdrant",   color: "#00d4ff", r: 7 },
  { x: 110, y: 310, label: "FAISS",    color: "#00d4ff", r: 5 },
  { x: 290, y: 340, label: "MongoDB",  color: "#00d4ff", r: 5 },
  // Infra — left quadrant
  { x: 60,  y: 195, label: "React",    color: "#d9dfe9", r: 5 },
  { x: 50,  y: 250, label: "Next.js",  color: "#d9dfe9", r: 4 },
  { x: 90,  y: 300, label: "Docker",   color: "#d9dfe9", r: 4 },
];

// Connector lines between related nodes (index pairs)
const EDGES = [
  [0, 3], [1, 3], [2, 3], // AI/ML -> Llama 3
  [3, 4], [4, 5], [4, 6], // Llama -> llama.cpp -> FastAPI / LiveKit
  [5, 7], [7, 8], [7, 9], // FastAPI -> Qdrant -> FAISS / MongoDB
  [7, 10],[10,11],[10,12],  // Qdrant -> React -> Next / Docker
  [3, 7], // Llama 3 -> Qdrant (RAG link)
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
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
        </motion.div>
      </div>

      <div className="container mx-auto px-8 md:px-24 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* ── Left: SVG Node Graph ── */}
        <motion.div
          className="lg:col-span-7 bg-surface-2/60 rounded-[48px] p-8 md:p-12 border border-surface-border/20 relative overflow-hidden"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-display), monospace" }}>Neural_Nodes</h3>
            <span className="text-neural-cyan text-[10px] uppercase tracking-widest" style={{ fontFamily: "var(--font-display), monospace" }}>
              Technical Proficiency Graph
            </span>
          </div>

          <div className="flex items-center justify-center">
            <svg viewBox="0 0 420 400" className="w-full max-w-[420px]" style={{ overflow: "visible" }}>
              <defs>
                <filter id="node-glow-matrix">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="edge-glow-matrix">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Background rings — animated rotation via framer-motion */}
              {[150, 100, 50].map((r, ri) => (
                <motion.circle
                  key={r}
                  cx="200" cy="200" r={r}
                  fill="none"
                  stroke="rgba(168,232,255,0.07)"
                  strokeDasharray="4 6"
                  animate={{ rotate: ri % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 30 + ri * 8, repeat: Infinity, ease: "linear" }}
                  style={{ originX: "200px", originY: "200px" }}
                />
              ))}

              {/* Edges — draw in on mount */}
              {EDGES.map(([a, b], i) => {
                const ax = NODE_GROUPS[a].x, ay = NODE_GROUPS[a].y;
                const bx = NODE_GROUPS[b].x, by = NODE_GROUPS[b].y;
                const len = Math.hypot(bx - ax, by - ay);
                return (
                  <motion.line
                    key={i}
                    x1={ax} y1={ay} x2={bx} y2={by}
                    stroke="rgba(168,232,255,0.15)"
                    strokeWidth="1"
                    strokeDasharray={len}
                    initial={{ strokeDashoffset: len, opacity: 0 }}
                    whileInView={{ strokeDashoffset: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.07, ease: "easeOut" }}
                  />
                );
              })}

              {/* Nodes */}
              {NODE_GROUPS.map((n, i) => (
                <motion.g key={i}>
                  {/* Outer halo */}
                  <motion.circle
                    cx={n.x} cy={n.y} r={n.r + 8}
                    fill={n.color}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: [0, 0.12, 0.06, 0.12] }}
                    viewport={{ once: false }}
                    transition={{ duration: 2.5, delay: i * 0.08, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* Node circle */}
                  <motion.circle
                    cx={n.x} cy={n.y} r={n.r}
                    fill={n.color}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.2 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    style={{ filter: `drop-shadow(0 0 6px ${n.color})`, originX: `${n.x}px`, originY: `${n.y}px` }}
                  />
                  {/* Label */}
                  <motion.text
                    x={n.x + (n.x > 200 ? n.r + 6 : -(n.r + 6))}
                    y={n.y + 4}
                    textAnchor={n.x > 200 ? "start" : n.x === 200 ? "middle" : "end"}
                    fill="rgba(221,227,236,0.8)"
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.07 }}
                  >
                    {n.label}
                  </motion.text>
                </motion.g>
              ))}

              {/* Center hub */}
              <motion.circle
                cx="200" cy="200" r="18"
                fill="rgba(0,212,255,0.1)"
                stroke="#00d4ff"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                style={{ originX: "200px", originY: "200px" }}
              />
              <text x="200" y="196" textAnchor="middle" fill="#00d4ff" fontSize="8" fontFamily="JetBrains Mono">CORE</text>
              <text x="200" y="207" textAnchor="middle" fill="#00d4ff" fontSize="8" fontFamily="JetBrains Mono">STACK</text>

              {/* Traveling signal dot along main path: 0→3→4→5→7→8 */}
              <motion.circle
                r="3"
                fill="#00d4ff"
                style={{ filter: "drop-shadow(0 0 4px #00d4ff)" }}
                animate={{
                  cx: [NODE_GROUPS[0].x, NODE_GROUPS[3].x, NODE_GROUPS[4].x, NODE_GROUPS[5].x, NODE_GROUPS[7].x, NODE_GROUPS[8].x, NODE_GROUPS[0].x],
                  cy: [NODE_GROUPS[0].y, NODE_GROUPS[3].y, NODE_GROUPS[4].y, NODE_GROUPS[5].y, NODE_GROUPS[7].y, NODE_GROUPS[8].y, NODE_GROUPS[0].y],
                  opacity: [0, 1, 1, 1, 1, 1, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              />
            </svg>
          </div>

          {/* Background texture */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <img
              className="w-full h-full object-cover"
              alt=""
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmquO-TmvSCNWbbe3E2ce4ZvzVkXzXPDXSxrgBOAc512e84U_4uGrk4iOi7sgll_Xm1aAcYVAygiuL0dBsZssU2NbzmG9iXOBN3kRNgFMLzd1cxpWYQnwmhc1kpQ5hseRWnHKwEqlYGIZo3vebhj9HsJedMzw09zEiUB5qboZqbbklWVnak8qeXa98BTSV9RfPrlDF_2SJncZG9wULo9Jpf07t5X40DocuWeo8EZNk2fVXzmNnY58mSuHysPTpA1gn4F2qFRDDG8A"
            />
          </div>
        </motion.div>

        {/* ── Right: Skill Category Chips ── */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {SKILL_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              className="group relative rounded-3xl overflow-hidden bg-surface-2/60 border border-surface-border/20 transition-all duration-300 hover:border-opacity-100"
              style={{
                borderColor: `${cat.color}40`,
              }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${cat.color}18`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "";
              }}
            >
              {/* Left colored accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-3xl pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom, ${cat.color}, transparent)`,
                }}
              />

              <div className="p-6 relative z-10">
                {/* Header: Icon + Label + Count Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="flex items-center justify-center w-10 h-10 rounded-full border"
                      style={{
                        borderColor: `${cat.color}40`,
                        background: `${cat.color}12`,
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <span className="material-symbols-outlined text-base" style={{ color: cat.color }}>
                        {cat.icon}
                      </span>
                    </motion.div>
                    <span
                      className="text-[10px] uppercase tracking-[0.2em] font-semibold"
                      style={{ fontFamily: "var(--font-display), monospace", color: cat.color }}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <div
                    className="rounded-full px-2 py-1 text-[9px] font-semibold text-text-muted"
                    style={{
                      fontFamily: "var(--font-display), monospace",
                      backgroundColor: `${cat.color}10`,
                      borderColor: `${cat.color}25`,
                      border: "1px solid",
                    }}
                  >
                    {cat.skills.length} modules
                  </div>
                </div>

                {/* Colored separator line */}
                <div
                  className="h-px mb-4 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(to right, ${cat.color}, transparent)`,
                  }}
                />

                {/* Skills chips */}
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, idx) => (
                    <motion.span
                      key={skill}
                      className="px-3 py-1.5 rounded-full text-[11px] border transition-all duration-300 hover:scale-110 cursor-default relative"
                      style={{
                        background: `${cat.color}0d`,
                        borderColor: `${cat.color}25`,
                        color: "rgb(221,227,236)",
                        fontFamily: "var(--font-display), monospace",
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.2 + idx * 0.03 }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLSpanElement).style.background = `${cat.color}25`;
                        (e.currentTarget as HTMLSpanElement).style.borderColor = `${cat.color}60`;
                        (e.currentTarget as HTMLSpanElement).style.color = cat.color;
                        (e.currentTarget as HTMLSpanElement).style.boxShadow = `0 0 10px ${cat.color}35`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLSpanElement).style.background = `${cat.color}0d`;
                        (e.currentTarget as HTMLSpanElement).style.borderColor = `${cat.color}25`;
                        (e.currentTarget as HTMLSpanElement).style.color = "";
                        (e.currentTarget as HTMLSpanElement).style.boxShadow = "";
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
