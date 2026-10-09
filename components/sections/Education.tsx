"use client";

import { motion } from "framer-motion";
import { sectionIds } from "@/lib/constants";

export function Education() {
  return (
    <section id={sectionIds.education} className="section-shell">
      <div className="section-container">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-kicker mb-4">// Academic_Record</p>
          <h2 className="section-title">
            Education<span className="text-neural-cyan">_</span>
          </h2>
        </motion.div>

        <motion.article
          className="glass-panel relative overflow-hidden rounded-[2rem] p-7 md:p-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
        >
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-neural-cyan via-neural-violet to-transparent" />
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.22em] text-neural-cyan">
                Pune, Maharashtra
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-text-strong md:text-3xl">
                Pune Institute of Computer Technology
              </h3>
              <p className="mt-3 text-base text-text-soft">
                Bachelor of Engineering in Computer Engineering
              </p>
              <p className="mt-1 text-sm text-text-muted">Honors in Data Science</p>
            </div>
            <p className="shrink-0 font-display text-xs uppercase tracking-[0.16em] text-text-muted">
              Nov 2022 — Jul 2026
            </p>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
