"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportConfig } from "@/lib/animations";

interface UpcomingPost {
  title: string;
  highlighted?: boolean;
}

const upcomingPosts: UpcomingPost[] = [
  { title: "I trained a language model to speak — here's what broke", highlighted: true },
  { title: "Why I migrated from ChromaDB to Qdrant — and what broke" },
  { title: "Designing a semantic cache that actually works" },
  { title: "Building for offline-first in Tier-2/3 India" },
];

export function TheLab() {
  return (
    <section className="relative">
      <div className="container-main">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportConfig}
        >
          <motion.p variants={fadeInUp} className="mono-label mb-3">
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
            className="mt-2 mb-10"
            style={{ color: "var(--text-secondary)" }}
          >
            Where I think out loud about systems, infrastructure, and AI.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportConfig}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {upcomingPosts.map((post) => (
            <motion.div
              key={post.title}
              variants={fadeInUp}
              className="glow-card p-6 flex flex-col justify-between min-h-[160px]"
              style={post.highlighted ? { borderColor: "var(--accent)", background: "var(--bg-card)" } : undefined}
            >
              <div>
                <span
                  className="inline-block text-[10px] uppercase tracking-widest px-2 py-1 rounded mb-4"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: post.highlighted ? "var(--accent)" : "var(--text-muted)",
                    background: post.highlighted ? "var(--accent-glow)" : "var(--bg-elevated)",
                    border: `1px solid ${post.highlighted ? "var(--accent)" : "var(--accent-border)"}`,
                  }}
                >
                  {post.highlighted ? "// first post" : "// coming soon"}
                </span>
                <h3
                  className="text-base leading-snug"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "var(--text-primary)",
                  }}
                >
                  {post.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
