"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportConfig } from "@/lib/animations";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface FeaturedPost {
  badge: string;
  title: string;
  excerpt: string;
  tags: string[];
  readTime: string;
  status: "first-post";
}

interface QueuePost {
  title: string;
  tags: string[];
  note?: string;
}

const featuredPost: FeaturedPost = {
  badge: "// first post",
  title: "I trained a language model to speak — here's what broke",
  excerpt:
    "A walk through fine-tuning Orpheus TTS on a single GPU: SNAC codec token offsets, why CPU inference is a memory bandwidth problem, and how 30× faster inference on a T4 changes what's worth shipping.",
  tags: ["TTS", "Fine-tuning", "llama.cpp", "Voice AI"],
  readTime: "~12 min read",
  status: "first-post",
};

const writingQueue: QueuePost[] = [
  {
    title: "Why I migrated from ChromaDB to Qdrant — and what broke",
    tags: ["RAG", "Vector DBs", "VoiceraCX"],
    note: "Hybrid dense-sparse search, production migration pain points",
  },
  {
    title: "Designing a semantic cache that actually works",
    tags: ["Caching", "Embeddings", "Latency"],
    note: "Similarity thresholds, cache invalidation, and the -60% API call reduction",
  },
  {
    title: "Building for offline-first in Tier-2/3 India",
    tags: ["Architecture", "Sync", "Smart Pathshala"],
    note: "Why CRDT sync beats PostgreSQL replication for schools with spotty connectivity",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function TheLab() {
  return (
    <section className="relative">
      <div className="container-main">

        {/* ── Section heading ── */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportConfig}
          style={{ marginBottom: "3rem" }}
        >
          <motion.p variants={fadeInUp} className="mono-label" style={{ marginBottom: "0.75rem" }}>
            // lab
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            The Lab
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            style={{ color: "var(--text-secondary)", marginTop: "0.5rem", maxWidth: "52ch" }}
          >
            Where I think out loud about systems, infrastructure, and AI.
          </motion.p>
        </motion.div>

        {/* ── Featured post ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--accent)",
              borderRadius: "0.75rem",
              padding: "2rem",
              position: "relative",
              overflow: "hidden",
              marginBottom: "2.5rem",
            }}
          >
            {/* Subtle accent glow in top-left */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "40%",
                height: "100%",
                background: "radial-gradient(ellipse 80% 60% at 0% 30%, rgba(0,212,255,0.06) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            {/* Top row: badge + read time */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--accent)",
                  background: "var(--accent-glow)",
                  border: "1px solid var(--accent)",
                  padding: "3px 10px",
                  borderRadius: "4px",
                }}
              >
                {featuredPost.badge}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.05em",
                }}
              >
                {featuredPost.readTime}
              </span>
            </div>

            {/* Title */}
            <h3
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                fontWeight: 600,
                color: "var(--text-primary)",
                lineHeight: 1.35,
                marginBottom: "1rem",
                maxWidth: "60ch",
              }}
            >
              {featuredPost.title}
            </h3>

            {/* Excerpt */}
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.75,
                maxWidth: "68ch",
                marginBottom: "1.5rem",
              }}
            >
              {featuredPost.excerpt}
            </p>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {featuredPost.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.68rem",
                    color: "var(--accent)",
                    background: "rgba(0,212,255,0.07)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    letterSpacing: "0.04em",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Writing queue ── */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportConfig}
        >
          {/* Queue heading */}
          <motion.p
            variants={fadeInUp}
            className="mono-label"
            style={{ marginBottom: "1.25rem" }}
          >
            // writing queue
          </motion.p>

          {/* Queue items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {writingQueue.map((post, i) => (
              <motion.div
                key={post.title}
                variants={fadeInUp}
                style={{
                  borderTop: "1px solid var(--accent-border)",
                  padding: "1.25rem 0",
                  ...(i === writingQueue.length - 1 ? { borderBottom: "1px solid var(--accent-border)" } : {}),
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" }}>
                  {/* Left: title + note */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                        lineHeight: 1.4,
                        marginBottom: post.note ? "0.4rem" : 0,
                      }}
                    >
                      {post.title}
                    </p>
                    {post.note && (
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          lineHeight: 1.5,
                        }}
                      >
                        {post.note}
                      </p>
                    )}
                  </div>

                  {/* Right: tags + coming-soon badge */}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.65rem",
                          color: "var(--text-muted)",
                          background: "var(--bg-elevated)",
                          border: "1px solid var(--accent-border)",
                          padding: "2px 7px",
                          borderRadius: "4px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.65rem",
                        color: "var(--text-muted)",
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        opacity: 0.55,
                      }}
                    >
                      // soon
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
