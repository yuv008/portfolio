"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

const STATS = [
  { value: "2+", label: "years building AI infrastructure" },
  { value: "4", label: "production systems shipped" },
  { value: "∞", label: "systems thinking" },
];

export function ValueBand() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-10% 0px" }}
      style={{
        borderTop: "1px solid var(--accent-border)",
        borderBottom: "1px solid var(--accent-border)",
        background: "var(--bg-secondary)",
        padding: "1.25rem 1.5rem",
      }}
    >
      <div
        className="container-main"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem 2.5rem",
        }}
      >
        {STATS.map((stat, i) => (
          <span
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.78rem",
              color: "var(--text-secondary)",
            }}
          >
            <span
              style={{
                color: "var(--accent)",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              {stat.value}
            </span>
            {stat.label}
            {i < STATS.length - 1 && (
              <span
                aria-hidden="true"
                style={{
                  marginLeft: "1.25rem",
                  color: "var(--accent-border)",
                  userSelect: "none",
                }}
              >
                ·
              </span>
            )}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
