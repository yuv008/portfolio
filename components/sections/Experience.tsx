"use client";

import { useState } from "react";
import { VideoLightbox } from "@/components/ui/VideoLightbox";


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
  /** Optional launch video and site for a product worked on in this role. */
  product?: { name: string; video: string; poster: string; site: string };
}

const experiences: ExperienceItem[] = [
  {
    id: "voiceracx",
    company: "VoiceraCX",
    role: "AI R&D Engineer · VEE Legion",
    period: "June 2026 — Present",
    description:
      "Building VEE Legion, an independent QA platform that tests voice and chat AI agents with simulated callers, automated scoring and red-team attacks. Details in the section above.",
    bullets: [
      "Defined the product scope and engineered VEE Legion, a production platform that tests unmodified voice and chat agents with scenario-driven callers across VEE, Twilio, Retell, Vapi and Synthflow.",
      "Built Go-based concurrency ramping and slot-based orchestration over Twilio and LiveKit; validated 200 concurrent calls with zero transport errors through controlled load testing.",
      "Developed automated evaluation across WER/CER, latency, tool calls, PII, scenario checks and LLM-as-a-judge, with safeguards against failed judge executions skewing pass rates.",
      "Added red-team callers (prompt injection, jailbreaks), turn-level failure analysis, and real-call import so production calls are scored with the same checks.",
    ],
    metrics: [
      { label: "Calls verified", value: "200" },
      { label: "Transport errors", value: "0" },
      { label: "Platforms tested", value: "5" },
    ],
    color: "#6ee7ff",
    icon: "sensors",
    product: {
      name: "VEE Legion",
      video: "/legion/legion-promo.mp4",
      poster: "/legion/legion-poster.webp",
      site: "https://legion.voiceracx.ai",
    },
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
    color: "#6ee7ff",
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
    color: "#6ee7ff",
    icon: "psychology",
  },
];

function ProductLinks({ product, color }: { product: NonNullable<ExperienceItem["product"]>; color: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group/video relative flex items-center gap-3 overflow-hidden rounded-2xl pr-4 transition-all hover:brightness-110"
        style={{ border: `1px solid ${color}40`, background: `${color}0d` }}
        aria-label={`Watch the ${product.name} launch video`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.poster} alt="" loading="lazy" decoding="async" className="h-14 w-24 object-cover" />
        <span className="flex items-center gap-1.5 font-label text-[10px] uppercase tracking-widest" style={{ color }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            play_arrow
          </span>
          Watch launch video
        </span>
      </button>
      <a
        href={product.site}
        target="_blank"
        rel="noopener noreferrer"
        className="font-label text-[10px] uppercase tracking-widest text-slate-400 transition-colors hover:text-on-surface"
      >
        legion.voiceracx.ai ↗
      </a>
      {open && <VideoLightbox src={product.video} poster={product.poster} title={`${product.name} launch video`} onClose={() => setOpen(false)} />}
    </div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="relative z-10 pb-24">
      <div className="container mx-auto px-8 md:px-24">
        {/* Header */}
        <div
          className="mb-14"
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
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="tile tile-hover overflow-hidden">
              <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-12 md:p-10">
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

                  {exp.product && <ProductLinks product={exp.product} color={exp.color} />}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
