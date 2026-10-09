"use client";

import { motion } from "framer-motion";
import { sectionIds } from "@/lib/constants";

const achievements = [
  {
    event: "Devclash 2025",
    result: "1st Prize",
    detail: "24-hour hackathon at DY Patil Pimpri",
    project: "ShetNiyojan",
    color: "#6ee7ff",
  },
  {
    event: "Synapse 2.0",
    result: "1st Prize",
    detail: "AI hackathon at MKSSS CCOEW",
    project: "LegiFy",
    color: "#ab8aff",
  },
  {
    event: "L&T NeuroHack",
    result: "1st Prize",
    detail: "24-hour hackathon at COEP Mindspark 24",
    project: "WarCast",
    color: "#ffac5e",
  },
];

export function Achievements() {
  return (
    <section id={sectionIds.achievements} className="section-shell">
      <div className="section-container">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-kicker mb-4">// Selected_Recognition</p>
          <h2 className="section-title">
            Achievements<span className="text-neural-violet">_</span>
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {achievements.map((item, index) => (
            <motion.article
              key={item.event}
              className="glass-panel relative overflow-hidden rounded-[1.75rem] p-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: `linear-gradient(to right, ${item.color}, transparent)` }}
              />
              <div className="flex items-center justify-between gap-3">
                <span className="material-symbols-outlined" style={{ color: item.color }} aria-hidden="true">
                  emoji_events
                </span>
                <span
                  className="rounded-full px-3 py-1 font-display text-[0.6rem] uppercase tracking-[0.18em]"
                  style={{ color: item.color, background: `${item.color}14`, border: `1px solid ${item.color}35` }}
                >
                  {item.result}
                </span>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-text-strong">{item.event}</h3>
              <p className="mt-2 text-sm leading-6 text-text-soft">{item.detail}</p>
              <p className="mt-5 border-t border-surface-border/20 pt-4 font-display text-[0.65rem] uppercase tracking-[0.15em] text-text-muted">
                Built {item.project}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
