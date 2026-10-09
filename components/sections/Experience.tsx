"use client";

import { motion } from "framer-motion";

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  bullets: string[];
  metrics: { label: string; value: string }[];
  color: string;
  icon: string;
}

const experiences: ExperienceItem[] = [
  {
    id: "voiceracx",
    company: "VoiceraCX",
    role: "AI R&D Engineer",
    period: "June 2026 — Present",
    description: "Building a production voice-agent simulation and evaluation platform for concurrent Twilio and LiveKit calls.",
    bullets: [
      "Engineered scenario-driven callers to test unmodified voice agents with automated evaluation and per-turn voice telemetry.",
      "Built concurrency ramping and slot-based orchestration in Go; verified 200 concurrent calls with 0 transport errors.",
      "Implemented WER/CER, latency, tool-call, PII, and keyword checks alongside LLM-as-a-judge; excluded failed judge runs from pass-rate calculations.",
    ],
    metrics: [
      { label: "Calls verified", value: "200" },
      { label: "Transport errors", value: "0" },
    ],
    color: "#a8e8ff",
    icon: "sensors",
  },
  {
    id: "voiceracx-intern",
    company: "VoiceraCX",
    role: "Artificial Intelligence Intern",
    period: "June 2025 — June 2026",
    description: "Developed real-time voice pipelines and scalable vector retrieval for voice-agent products.",
    bullets: [
      "Built LiveKit voice pipelines with LLM streaming inference, connection pooling, and smart caching; reduced response time from 3s to 1.2s, redundant API calls by 60%, and network latency by 45%.",
      "Built a vector database microservice and migrated Chroma to Qdrant with hybrid dense-sparse search, reducing query latency by 90%.",
    ],
    metrics: [
      { label: "Response time", value: "3s → 1.2s" },
      { label: "Query latency", value: "−90%" },
      { label: "API calls", value: "−60%" },
    ],
    color: "#6ee7ff",
    icon: "graphic_eq",
  },
  {
    id: "daostreet",
    company: "DAOStreet",
    role: "Software Development Intern",
    period: "Feb 2025 — June 2025",
    description: "Developed and maintained Svelte web application features in a production development workflow.",
    bullets: [
      "Contributed to frontend architecture and feature development.",
      "Improved UI/UX and responsiveness across product screens.",
    ],
    metrics: [
      { label: "Tickets", value: "Consistent" },
      { label: "UI quality", value: "Improved" },
    ],
    color: "#dcb8ff",
    icon: "hub",
  },
  {
    id: "alesa",
    company: "Alesa AI Ltd, UK",
    role: "AI/ML Intern",
    period: "Nov 2024 — Mar 2025",
    description: "Worked on Tangent Mind, a tarot, horoscope, and dream-interpretation platform.",
    bullets: [
      "Fine-tuned Llama-3.1-8B with PEFT on a custom web-scraped dataset of 10,000+ dream-related terms.",
      "Improved relevance for domain-specific dream interpretation.",
    ],
    metrics: [
      { label: "Dataset", value: "10k+" },
      { label: "Model", value: "Llama 3.1-8B" },
    ],
    color: "#00d4ff",
    icon: "psychology",
  },
];

export function Experience() {
  return (
    <section id="experience" className="relative z-10 pb-24">
      <div className="container mx-auto px-8 md:px-24">
        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-4 mb-3">
            <span className="font-label text-secondary text-xs uppercase tracking-[0.2em]">
              Chronological_Expansion
            </span>
            <div className="h-px flex-grow bg-outline-variant/15" />
          </div>
          <h2 className="text-5xl md:text-7xl font-headline font-bold tracking-tight">
            The_Pipeline
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-6">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.id}
              className="group relative rounded-3xl border border-outline-variant/10 overflow-hidden transition-all duration-500 hover:border-opacity-30"
              style={{
                background: "rgba(22, 28, 34, 0.6)",
                backdropFilter: "blur(32px)",
                borderColor: `${exp.color}15`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${exp.color}40`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 40px ${exp.color}10`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${exp.color}15`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
            >
              {/* Colored left accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px] opacity-60"
                style={{ background: `linear-gradient(to bottom, ${exp.color}, transparent)` }}
              />

              <div className="p-8 pl-10 md:pl-12 grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* ── Left: role info ── */}
                <div className="md:col-span-5">
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${exp.color}18`, border: `1px solid ${exp.color}30` }}
                    >
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ color: exp.color }}
                      >
                        {exp.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-headline text-xl font-bold text-on-surface group-hover:brightness-110 transition-all">
                        {exp.company}
                      </h3>
                      <p
                        className="font-label text-[10px] uppercase tracking-widest mt-0.5"
                        style={{ color: exp.color }}
                      >
                        {exp.role}
                      </p>
                      <p className="font-label text-[10px] text-slate-500 mt-0.5">
                        {exp.period}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-on-surface-variant leading-relaxed mb-5">
                    {exp.description}
                  </p>

                  {/* Metric pills */}
                  <div className="flex flex-wrap gap-2">
                    {exp.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
                        style={{
                          background: `${exp.color}0d`,
                          borderColor: `${exp.color}25`,
                        }}
                      >
                        <span
                          className="font-headline text-sm font-bold"
                          style={{ color: exp.color }}
                        >
                          {m.value}
                        </span>
                        <span className="font-label text-[10px] text-slate-500 uppercase">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Right: process bullets ── */}
                <div className="md:col-span-7 flex flex-col justify-center">
                  <p
                    className="font-label text-[9px] text-slate-600 uppercase tracking-[0.2em] mb-4"
                    style={{ color: `${exp.color}80` }}
                  >
                    // PROCESS
                  </p>
                  <div className="space-y-4">
                    {exp.bullets.map((b, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <span
                          className="font-label text-[10px] mt-0.5 flex-shrink-0 w-6 text-right"
                          style={{ color: `${exp.color}60` }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div
                          className="w-px self-stretch flex-shrink-0"
                          style={{ background: `${exp.color}20` }}
                        />
                        <p className="text-sm text-on-surface-variant leading-relaxed">{b}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
