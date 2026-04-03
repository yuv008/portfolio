"use client";

import { motion } from "framer-motion";

interface OutputMetric {
  metric: string;
  before?: string;
  after?: string;
  change: string;
}

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  input: string;
  process: string[];
  output: OutputMetric[];
}

const experiences: ExperienceItem[] = [
  {
    id: "voiceracx",
    company: "VoiceraCX",
    role: "AI Intern",
    period: "June 2025 – Present",
    input: "Voice agent platform with 3s response latency, ChromaDB bottleneck, redundant LLM API calls across pipeline",
    process: [
      "Built real-time voice pipelines using LiveKit for the voice agent platform",
      "Migrated vector storage from ChromaDB to Qdrant, enabling hybrid dense-sparse search",
      "Implemented LLM streaming inference, connection pooling, and smart caching",
    ],
    output: [
      { metric: "Response latency", before: "3s", after: "1.2s", change: "-60%" },
    ],
  },
  {
    id: "daostreet",
    company: "DAOStreet",
    role: "Software Development Intern",
    period: "Feb 2025 – June 2025",
    input: "Web application with open development tickets and UI/UX issues in Svelte framework",
    process: [
      "Developed and maintained features by solving development tickets in Svelte",
      "Debugged, optimized, and enhanced UI/UX components",
    ],
    output: [
      { metric: "Ticket resolution", change: "Consistent delivery" },
    ],
  },
  {
    id: "alesa",
    company: "Alesa AI Ltd, UK",
    role: "AI/ML Intern",
    period: "Nov 2024 – Mar 2025",
    input: "Astrology web app needing AI-powered dream interpretation with domain-specific understanding",
    process: [
      "Worked on Tangent Mind astrology platform",
      "Fine-tuned Llama-3.1-8B using PEFT on 10,000+ dream-related terms dataset",
    ],
    output: [
      { metric: "Dream interpretation", change: "Domain-specific LLM deployed" },
    ],
  },
];

const COLORS = ["primary", "secondary", "slate-600"];

export function Experience() {
  return (
    <section id="experience" className="container mx-auto px-8 relative pb-20">
      <motion.div 
        className="bg-surface-container-low glass-panel rounded-[64px] p-10 border border-white/5 flex flex-col"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
          <div className="mb-10">
              <h2 className="font-headline text-3xl font-bold mb-1">The_Pipeline</h2>
              <span className="font-label text-[10px] text-secondary uppercase tracking-widest">Chronological Expansion</span>
          </div>
          
          <div className="relative pl-10 flex-grow">
              {/* The Glowing Pipeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-secondary to-primary-container shadow-[0_0_15px_rgba(168,232,255,0.3)]"></div>
              
              <div className="space-y-16">
                  {experiences.map((exp, idx) => {
                      const color = COLORS[idx % COLORS.length];
                      const dotStyle = color === 'slate-600' ? { backgroundColor: '#475569' } : {};
                      const dotClass = color === 'slate-600' ? "" : `bg-${color} shadow-[0_0_10px_var(--color-${color})]`;

                      return (
                        <div key={exp.id} className="relative group">
                            <div 
                                className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-background transition-transform group-hover:scale-125 ${dotClass}`}
                                style={dotStyle}
                            ></div>
                            <div>
                                <h3 className="font-headline text-xl font-bold text-white transition-colors group-hover:text-primary">{exp.company}</h3>
                                <p className={`font-label text-[10px] uppercase mb-2 ${color === 'slate-600' ? 'text-slate-500' : 'text-' + color}`}>
                                    {exp.role} // {exp.period}
                                </p>
                                <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                                    {exp.input}
                                </p>

                                <div className="space-y-2 mt-4 ml-2 border-l border-outline-variant/20 pl-4 py-2">
                                  {exp.process.map((step, i) => (
                                    <div key={i} className="flex gap-2 items-start">
                                      <span className="text-[10px] font-label text-primary/70 mt-1">.0{i+1}</span>
                                      <p className="text-xs text-slate-400">{step}</p>
                                    </div>
                                  ))}
                                </div>
                            </div>
                        </div>
                      );
                  })}
              </div>
          </div>
      </motion.div>
    </section>
  );
}
