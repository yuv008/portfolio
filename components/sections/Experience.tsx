"use client";

import { useState } from "react";
import { ConcurrencyRamp } from "@/components/ui/TileVisuals";

type Item = {
  id: string;
  company: string;
  role: string;
  period: string;
  place: string;
  summary: string;
  bullets: string[];
  metrics?: { label: string; value: string }[];
  current?: boolean;
};

const ROLES: Item[] = [
  {
    id: "voiceracx",
    company: "VoiceraCX",
    role: "AI R&D Engineer · VEE Legion",
    period: "June 2026 — Present",
    place: "Pune",
    summary:
      "Building VEE Legion, an independent QA platform that tests voice and chat AI agents with simulated callers, automated scoring and red-team attacks.",
    bullets: [
      "Defined the product scope and engineered VEE Legion, a production platform that tests unmodified voice and chat agents with scenario-driven callers across VEE, Twilio, Retell, Vapi and Synthflow.",
      "Built Go-based concurrency ramping and slot-based orchestration over Twilio and LiveKit; validated 200 concurrent calls with zero transport errors through controlled load testing.",
      "Developed automated evaluation across WER/CER, latency, tool calls, PII, scenario checks and LLM-as-a-judge, with safeguards against failed judge executions skewing pass rates. Added red-team callers, turn-level failure analysis and real-call import.",
    ],
    metrics: [
      { label: "calls verified", value: "200" },
      { label: "transport errors", value: "0" },
      { label: "platforms tested", value: "5" },
    ],
    current: true,
  },
  {
    id: "voiceracx-intern",
    company: "VoiceraCX",
    role: "Artificial Intelligence Intern",
    period: "June 2025 — June 2026",
    place: "Pune",
    summary: "Real-time voice pipelines and scalable vector retrieval for voice-agent products.",
    bullets: [
      "Built LiveKit voice pipelines with LLM streaming inference, connection pooling and smart caching; reduced response time from 3s to 1.2s, redundant API calls by 60% and network latency by 45%.",
      "Built a vector database microservice and migrated Chroma to Qdrant with hybrid dense-sparse search, reducing query latency by 90%.",
    ],
    metrics: [
      { label: "response time", value: "3s → 1.2s" },
      { label: "query latency", value: "−90%" },
      { label: "API calls", value: "−60%" },
    ],
  },
  {
    id: "daostreet",
    company: "DAOStreet",
    role: "Software Development Intern",
    period: "Feb 2025 — June 2025",
    place: "Remote",
    summary: "Svelte web application features in a production workflow.",
    bullets: ["Contributed to frontend architecture and feature development.", "Improved UI/UX and responsiveness across product screens."],
  },
  {
    id: "alesa",
    company: "Alesa AI Ltd, UK",
    role: "AI/ML Intern",
    period: "Nov 2024 — Mar 2025",
    place: "Remote",
    summary: "Tangent Mind, a tarot, horoscope and dream-interpretation platform.",
    bullets: [
      "Fine-tuned Llama-3.1-8B with PEFT on a custom web-scraped dataset of 10,000+ dream-related terms.",
      "Improved relevance for domain-specific dream interpretation.",
    ],
    metrics: [
      { label: "dataset", value: "10k+" },
      { label: "model", value: "Llama 3.1 8B" },
    ],
  },
];

const EDUCATION = {
  school: "Pune Institute of Computer Technology",
  degree: "Bachelor of Engineering in Computer Engineering",
  honors: "Honors in Data Science",
  period: "Nov 2022 — Jul 2026",
  place: "Pune",
};

function Pill({ value, label }: { value: string; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-2 rounded-full border border-white/10 bg-black/25 px-3.5 py-1.5">
      <span className="font-display text-sm font-semibold text-neural-cyan">{value}</span>
      <span className="text-[11px] text-text-muted">{label}</span>
    </span>
  );
}

function CurrentRole({ item }: { item: Item }) {
  return (
    <article className="tile p-2.5">
      <div className="grid gap-2.5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative">
          <ConcurrencyRamp />
          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 font-display text-[10px] uppercase tracking-[0.16em] text-neural-green backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-neural-green shadow-[0_0_8px_rgba(97,255,171,0.9)]" />
            Current role
          </span>
        </div>

        <div className="flex flex-col p-4 md:p-5">
          <p className="tile-label">
            {item.period} · {item.place}
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-text-strong">{item.company}</h3>
          <p className="mt-0.5 text-sm font-medium text-neural-cyan">{item.role}</p>
          <p className="tile-body mt-3">{item.summary}</p>
          <ul className="mt-4 space-y-2.5">
            {item.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-[13px] leading-6 text-text-soft">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neural-cyan" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
            {item.metrics?.map((m) => (
              <Pill key={m.label} value={m.value} label={m.label} />
            ))}
            <a
              href="#stress-test"
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-text-soft transition-colors hover:text-neural-cyan"
            >
              See VEE Legion
              <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden="true">
                arrow_upward
              </span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function CompactRole({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="tile tile-hover">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 rounded-[inherit] p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-neural-cyan/60 md:p-6"
      >
        <span className="min-w-0">
          <span className="tile-label block">
            {item.period} · {item.place}
          </span>
          <span className="mt-1.5 flex flex-wrap items-baseline gap-x-3">
            <span className="text-lg font-semibold text-text-strong">{item.company}</span>
            <span className="text-sm text-neural-cyan">{item.role}</span>
          </span>
          <span className="tile-body mt-1.5 block">{item.summary}</span>
          {item.metrics && (
            <span className="mt-3 flex flex-wrap gap-2">
              {item.metrics.map((m) => (
                <Pill key={m.label} value={m.value} label={m.label} />
              ))}
            </span>
          )}
        </span>
        <span className="material-symbols-outlined mt-1 shrink-0 text-text-muted" style={{ fontSize: 22 }} aria-hidden="true">
          {open ? "remove" : "add"}
        </span>
      </button>
      {open && (
        <ul className="space-y-2.5 px-5 pb-5 md:px-6 md:pb-6">
          {item.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-[13px] leading-6 text-text-soft">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neural-cyan" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function Experience() {
  const [current, ...rest] = ROLES;
  return (
    <section id="experience" className="section-shell">
      <div className="section-container">
        <div className="mb-12">
          <p className="section-kicker mb-4">// Work · Education</p>
          <h2 className="section-title">
            The_{" "}
            <span className="bg-gradient-to-r from-neural-cyan to-neural-violet bg-clip-text text-transparent">Journey</span>
          </h2>
        </div>

        <div className="relative space-y-4 md:pl-8">
          <span
            className="absolute bottom-3 left-[7px] top-3 hidden w-px bg-gradient-to-b from-neural-cyan/50 via-white/10 to-transparent md:block"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="absolute -left-8 top-8 hidden h-3.5 w-3.5 rounded-full border-2 border-neural-cyan bg-background shadow-[0_0_12px_rgba(110,231,255,0.7)] md:block" aria-hidden="true" />
            <CurrentRole item={current} />
          </div>
          {rest.map((item) => (
            <div key={item.id} className="relative">
              <span className="absolute -left-8 top-8 hidden h-3 w-3 rounded-full border-2 border-white/30 bg-background md:block" aria-hidden="true" />
              <CompactRole item={item} />
            </div>
          ))}

          <div id="education" className="relative">
            <span className="absolute -left-8 top-8 hidden h-3 w-3 rounded-full border-2 border-neural-violet/70 bg-background md:block" aria-hidden="true" />
            <article className="tile flex flex-wrap items-center justify-between gap-4 p-5 md:p-6">
              <div className="flex items-center gap-4">
                <span className="tile-icon" style={{ color: "rgb(var(--neural-violet))" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">
                    school
                  </span>
                </span>
                <div>
                  <p className="tile-label">
                    {EDUCATION.period} · {EDUCATION.place}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-text-strong">{EDUCATION.school}</h3>
                  <p className="text-sm text-text-soft">
                    {EDUCATION.degree} · {EDUCATION.honors}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
