"use client";

import { motion } from "framer-motion";

const CARDS = [
  {
    color: "#6ee7ff",
    kicker: "Core_Engineering",
    title: "High-Performance ML",
    body: "Optimizing inference pipelines for sub-millisecond real-time applications. Bridging the gap between theory and production.",
  },
  {
    color: "#ab8aff",
    kicker: "Systems_Design",
    title: "Vector + RAG Infrastructure",
    body: "Migrated ChromaDB → Qdrant with hybrid dense-sparse search. Added semantic caching and connection pooling across the orchestration layer.",
  },
  {
    color: "#ffac5e",
    kicker: "Research_Frontier",
    title: "Domain Fine-tuning",
    body: "LoRA / PEFT adaptations on Llama 3.x for narrow, consumer-grade AI verticals. 10k+ term datasets, shipped weights.",
  },
];

export function About() {
  return (
    <section id="about" className="section-shell">
      <div className="section-container">
        <motion.header
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-kicker mb-4">// Manifest_v5.0</p>
          <h2 className="section-title">
            The_{" "}
            <span className="bg-gradient-to-r from-neural-cyan to-neural-violet bg-clip-text text-transparent">
              Architecture
            </span>
          </h2>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.kicker}
              className="relative rounded-[32px] overflow-hidden group"
              style={{
                padding: 28,
                background: "rgba(20,27,35,0.85)",
                backdropFilter: "blur(32px)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
                transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.borderColor = `${card.color}40`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 48px ${card.color}12, 0 24px 80px rgba(0,0,0,0.28)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 24px 80px rgba(0,0,0,0.28)";
              }}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[32px] pointer-events-none"
                style={{ background: `linear-gradient(to bottom, ${card.color}, transparent)` }}
              />

              {/* Dot indicator */}
              <div
                className="w-2 h-2 rounded-full mb-3"
                style={{ background: card.color, boxShadow: `0 0 8px ${card.color}` }}
              />

              <p
                className="mb-2"
                style={{
                  fontFamily: "var(--font-display), monospace",
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: card.color,
                }}
              >
                {card.kicker}
              </p>

              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-display), monospace",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "rgb(233,240,245)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.3,
                }}
              >
                {card.title}
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "rgb(191,205,218)",
                  margin: 0,
                }}
              >
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
