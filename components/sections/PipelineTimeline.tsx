"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OutputMetric {
  metric: string;
  before?: string;
  after?: string;
  change: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  input: string;
  process: string[];
  output: OutputMetric[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const experiences: Experience[] = [
  {
    id: "voiceracx",
    company: "VoiceraCX",
    role: "AI Intern",
    period: "June 2025 – Present",
    input:
      "Voice agent platform with 3s response latency, ChromaDB bottleneck, redundant LLM API calls across pipeline",
    process: [
      "Built real-time voice pipelines using LiveKit for the voice agent platform",
      "Migrated vector storage from ChromaDB to Qdrant, enabling hybrid dense-sparse search",
      "Implemented LLM streaming inference, connection pooling, and smart caching",
    ],
    output: [
      { metric: "Response latency", before: "3s", after: "1.2s", change: "-60%" },
      { metric: "Query latency", change: "-90%" },
      { metric: "Redundant API calls", change: "-60%" },
      { metric: "Network latency", change: "-45%" },
    ],
  },
  {
    id: "daostreet",
    company: "DAOStreet",
    role: "Software Development Intern",
    period: "Feb 2025 – June 2025",
    input:
      "Web application with open development tickets and UI/UX issues in Svelte framework",
    process: [
      "Developed and maintained features by solving development tickets in Svelte",
      "Debugged, optimized, and enhanced UI/UX components",
    ],
    output: [
      { metric: "Ticket resolution", change: "Consistent delivery" },
      { metric: "UI responsiveness", change: "Improved" },
    ],
  },
  {
    id: "alesa",
    company: "Alesa AI Ltd, UK",
    role: "AI/ML Intern",
    period: "Nov 2024 – Mar 2025",
    input:
      "Astrology web app needing AI-powered dream interpretation with domain-specific understanding",
    process: [
      "Worked on Tangent Mind astrology platform (tarot, horoscopes, dream interpretation)",
      "Fine-tuned Llama-3.1-8B using PEFT on 10,000+ dream-related terms dataset",
    ],
    output: [
      { metric: "Dream interpretation", change: "Domain-specific LLM deployed" },
      { metric: "Dataset", change: "10,000+ custom web-scraped terms" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const nodeVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.12,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

const expandVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      height: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
      opacity: { duration: 0.25, delay: 0.1 },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      height: { duration: 0.3, ease: [0.55, 0, 0.1, 1] as [number, number, number, number] },
      opacity: { duration: 0.15 },
    },
  },
};

const connectorVariants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: (i: number) => ({
    scaleY: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: i * 0.12 + 0.3,
      ease: "easeOut" as const,
    },
  }),
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionLabel({ label }: { label: string }) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.75rem",
        textTransform: "uppercase" as const,
        letterSpacing: "0.1em",
        color: "var(--text-muted)",
        display: "block",
      }}
    >
      {label}
    </span>
  );
}

function ProcessStep({ step, index }: { step: string; index: number }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.75rem",
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.7rem",
          color: "var(--accent)",
          opacity: 0.7,
          marginTop: "0.2rem",
          flexShrink: 0,
          userSelect: "none",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {step}
      </p>
    </div>
  );
}

function OutputRow({ item }: { item: OutputMetric }) {
  const isPercentage = item.change.startsWith("-") || item.change.startsWith("+");
  const isPositiveChange = item.change.startsWith("-"); // for latency/calls, reduction is good

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "1rem",
        alignItems: "center",
        padding: "0.5rem 0.75rem",
        borderRadius: "0.375rem",
        background: "rgba(0, 212, 255, 0.03)",
        border: "1px solid rgba(0, 212, 255, 0.08)",
      }}
    >
      <span
        style={{
          fontSize: "0.8125rem",
          color: "var(--text-secondary)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {item.metric}
        {item.before && item.after && (
          <span style={{ color: "var(--text-muted)", marginLeft: "0.5rem" }}>
            {item.before} → {item.after}
          </span>
        )}
      </span>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.8125rem",
          fontWeight: 600,
          color: isPercentage
            ? isPositiveChange
              ? "var(--signal-green)"
              : "var(--signal-amber)"
            : "var(--accent)",
          whiteSpace: "nowrap",
        }}
      >
        {item.change}
      </span>
    </div>
  );
}

function PipelineNode({
  exp,
  index,
  isActive,
  onToggle,
  isLast,
}: {
  exp: Experience;
  index: number;
  isActive: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  return (
    <div style={{ position: "relative" }}>
      {/* Node card */}
      <motion.div
        custom={index}
        variants={nodeVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        layout
        style={{
          background: "var(--bg-card)",
          border: `1px solid ${isActive ? "var(--accent)" : "var(--accent-border)"}`,
          borderRadius: "0.5rem",
          padding: "1.5rem",
          cursor: "pointer",
          transition: "border-color 0.25s ease, box-shadow 0.25s ease",
          boxShadow: isActive
            ? "0 0 0 1px rgba(0,212,255,0.15), 0 4px 32px rgba(0,212,255,0.12)"
            : "none",
          position: "relative",
        }}
        onClick={onToggle}
        role="button"
        aria-expanded={isActive}
        aria-controls={`pipeline-body-${exp.id}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        {/* Subtle active accent line on left edge */}
        {isActive && (
          <motion.div
            layoutId={`accent-bar-${exp.id}`}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "3px",
              background:
                "linear-gradient(180deg, var(--accent) 0%, var(--accent-dim) 100%)",
              borderRadius: "0.5rem 0 0 0.5rem",
              transformOrigin: "top",
            }}
          />
        )}

        {/* Collapsed header — always visible */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            {/* Node indicator */}
            <span
              style={{
                color: isActive ? "var(--accent)" : "var(--accent-dim)",
                fontSize: "1.1rem",
                lineHeight: 1,
                marginTop: "0.15rem",
                flexShrink: 0,
                transition: "color 0.25s ease",
                fontFamily: "monospace",
              }}
              aria-hidden="true"
            >
              ◉
            </span>

            <div>
              <h3
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: isActive ? "var(--accent)" : "var(--text-primary)",
                  transition: "color 0.25s ease",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {exp.company}
              </h3>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginTop: "0.25rem",
                  letterSpacing: "0.02em",
                }}
              >
                {exp.role}
                <span style={{ margin: "0 0.4em", opacity: 0.4 }}>·</span>
                {exp.period}
              </p>
            </div>
          </div>

          {/* Expand cue */}
          <motion.span
            animate={{ rotate: isActive ? 90 : 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              flexShrink: 0,
              marginTop: "0.2rem",
              display: "inline-block",
            }}
            aria-hidden="true"
          >
            ▸
          </motion.span>
        </div>

        {/* Collapsed hint text */}
        <AnimatePresence initial={false}>
          {!isActive && (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.15 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.675rem",
                color: "var(--text-muted)",
                marginTop: "0.875rem",
                paddingLeft: "1.85rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
              aria-hidden="true"
            >
              ▸ Click to expand
            </motion.p>
          )}
        </AnimatePresence>

        {/* Expanded body */}
        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div
              key="expanded"
              id={`pipeline-body-${exp.id}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                height: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
                opacity: { duration: 0.25, delay: 0.08 },
              }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid var(--accent-border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                {/* INPUT */}
                <div>
                  <SectionLabel label="// INPUT" />
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      marginTop: "0.625rem",
                      lineHeight: 1.65,
                      paddingLeft: "0.875rem",
                      borderLeft: "2px solid rgba(0, 212, 255, 0.2)",
                    }}
                  >
                    {exp.input}
                  </p>
                </div>

                {/* PROCESS */}
                <div>
                  <SectionLabel label="// PROCESS" />
                  <div
                    style={{
                      marginTop: "0.625rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.625rem",
                    }}
                  >
                    {exp.process.map((step, i) => (
                      <ProcessStep key={i} step={step} index={i} />
                    ))}
                  </div>
                </div>

                {/* OUTPUT */}
                <div>
                  <SectionLabel label="// OUTPUT" />
                  <div
                    style={{
                      marginTop: "0.625rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.375rem",
                    }}
                  >
                    {exp.output.map((item, i) => (
                      <OutputRow key={i} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Connecting dashed line to next node */}
      {!isLast && (
        <motion.div
          custom={index}
          variants={connectorVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "2.5rem",
            transformOrigin: "top",
          }}
          aria-hidden="true"
        >
          {/* Vertical dashed line */}
          <div
            style={{
              width: "1px",
              flex: 1,
              background:
                "repeating-linear-gradient(to bottom, var(--accent-border) 0px, var(--accent-border) 4px, transparent 4px, transparent 10px)",
            }}
          />
          {/* Small arrow tip */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderTop: "5px solid var(--accent-border)",
              marginTop: "-1px",
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function PipelineTimeline() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="pipeline">
      <div className="container-main">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ marginBottom: "3.5rem" }}
        >
          <span className="mono-label" style={{ display: "block", marginBottom: "0.75rem" }}>
            // experience
          </span>
          <h2
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            The Pipeline
          </h2>
        </motion.div>

        {/* Pipeline nodes */}
        <div
          style={{
            maxWidth: "680px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {experiences.map((exp, index) => (
            <PipelineNode
              key={exp.id}
              exp={exp}
              index={index}
              isActive={activeId === exp.id}
              onToggle={() => handleToggle(exp.id)}
              isLast={index === experiences.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
