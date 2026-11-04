"use client";

import { useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Wash } from "@/components/ui/Wash";
import { explainStop } from "@/lib/wisp";

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

function BranchChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-1 font-display text-[10px] uppercase tracking-[0.14em] text-text-soft">
      {children}
    </span>
  );
}

function AskWisp({ id, name }: { id: string; name: string }) {
  return (
    <button
      type="button"
      onClick={() => explainStop(id)}
      aria-label={`Ask Wisp to explain ${name}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.15em] text-text-soft transition-colors hover:text-text-strong"
    >
      <span className="material-symbols-outlined" style={{ fontSize: 14 }} aria-hidden="true">
        chat_bubble
      </span>
      Ask Wisp
    </button>
  );
}

/** A small, looping grid of calls ramping up: the thing the current role is about. Static in Lite mode. */
function MiniRamp() {
  const cols = 20;
  const rows = 4;
  return (
    <div className="hidden shrink-0 sm:block" aria-hidden="true">
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${cols}, 7px)` }}>
        {Array.from({ length: cols * rows }, (_, i) => (
          <span
            key={i}
            className="tile-anim h-[7px] rounded-[2px]"
            style={{ background: "#e6e6e6", opacity: 0.14, animation: `slot-on 5.2s ease-in-out ${(((i % cols) * 0.11) + Math.floor(i / cols) * 0.04).toFixed(2)}s infinite` }}
          />
        ))}
      </div>
      <p className="mt-2 font-display text-[9px] uppercase tracking-[0.16em] text-text-muted">Concurrency ramp · illustrative</p>
    </div>
  );
}

function CurrentRole({ item }: { item: Item }) {
  return (
    <article className="tile p-5 md:p-6">
      <Wash from="#e6e6e6" to="#acacac" dim={0.5} />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <BranchChip>
              <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
              HEAD → main
            </BranchChip>
            <BranchChip>⑂ merged pict · Jul 2026</BranchChip>
          </div>
          <p className="tile-label mt-4">
            {item.period} · {item.place}
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-text-strong">{item.company}</h3>
          <p className="mt-0.5 text-sm font-medium text-neural-cyan">{item.role}</p>
        </div>
        <MiniRamp />
      </div>
      <p className="tile-body mt-3">{item.summary}</p>
      <ul className="mt-4 space-y-2.5">
        {item.bullets.map((b) => (
          <li key={b} className="flex gap-3 text-[13px] leading-6 text-text-soft">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neural-cyan" aria-hidden="true" />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {item.metrics?.map((m) => (
          <Pill key={m.label} value={m.value} label={m.label} />
        ))}
        <span className="ml-auto flex items-center gap-3">
          <AskWisp id={`journey-${item.id}`} name={item.company} />
          <a href="#stress-test" className="inline-flex items-center gap-1 text-xs font-semibold text-text-soft transition-colors hover:text-neural-cyan">
            See VEE Legion
            <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden="true">
              arrow_upward
            </span>
          </a>
        </span>
      </div>
    </article>
  );
}

function CompactRole({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="tile tile-hover p-5 md:p-6">
      <p className="tile-label">
        {item.period} · {item.place}
      </p>
      <h3 className="mt-1.5 flex flex-wrap items-baseline gap-x-3">
        <span className="text-lg font-semibold text-text-strong">{item.company}</span>
        <span className="text-sm font-normal text-neural-cyan">{item.role}</span>
      </h3>
      <p className="tile-body mt-1.5">{item.summary}</p>
      {item.metrics && (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.metrics.map((m) => (
            <Pill key={m.label} value={m.value} label={m.label} />
          ))}
        </div>
      )}
      {open && (
        <ul id={`details-${item.id}`} className="mt-4 space-y-2.5">
          {item.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-[13px] leading-6 text-text-soft">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neural-cyan" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`details-${item.id}`}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 font-display text-[10px] uppercase tracking-[0.15em] text-text-muted transition-colors hover:text-text-strong"
        >
          {open ? "Hide details" : "Details"}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform .2s" }}>
            <path d="M2 3.5 5 6.5 8 3.5" />
          </svg>
        </button>
        <span className="ml-auto">
          <AskWisp id={`journey-${item.id}`} name={item.company} />
        </span>
      </div>
    </article>
  );
}

function EducationCard() {
  return (
    <article className="tile p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="tile-icon">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">
              school
            </span>
          </span>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <BranchChip>⑂ pict/b.e. · ran alongside everything above</BranchChip>
            </div>
            <p className="tile-label">
              {EDUCATION.period} · {EDUCATION.place}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-text-strong">{EDUCATION.school}</h3>
            <p className="text-sm text-text-soft">
              {EDUCATION.degree} · {EDUCATION.honors}
            </p>
          </div>
        </div>
        <AskWisp id="journey-pict" name="PICT" />
      </div>
    </article>
  );
}

/* ── The graph gutter: lanes, nodes and the merge curve ────── */

const X_MAIN = 22;
const X_PICT = 62;
const NODE_Y = 44;

type LaneMode = "none" | "full" | "toNode" | "fromNode";
type Row = { id: string; main: LaneMode; pict: LaneMode; node: "main" | "pict"; head?: boolean; merge?: boolean };

const ROWS: Row[] = [
  { id: "voiceracx", main: "fromNode", pict: "fromNode", node: "main", head: true, merge: true },
  { id: "voiceracx-intern", main: "full", pict: "full", node: "main" },
  { id: "daostreet", main: "full", pict: "full", node: "main" },
  { id: "alesa", main: "toNode", pict: "full", node: "main" },
  { id: "pict", main: "none", pict: "toNode", node: "pict" },
];

function Lane({ x, mode, lit, start = NODE_Y }: { x: number; mode: LaneMode; lit: boolean; start?: number }) {
  if (mode === "none") return null;
  const top = mode === "fromNode" ? start : 0;
  const bottom = mode === "toNode" ? `calc(100% - ${NODE_Y}px)` : 0;
  return (
    <span
      className="absolute w-0.5 -translate-x-1/2 transition-colors duration-700"
      style={{ left: x, top, bottom, background: lit ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.16)" }}
    />
  );
}

function Gutter({ row, lit }: { row: Row; lit: boolean }) {
  const x = row.node === "main" ? X_MAIN : X_PICT;
  const size = row.head ? 16 : 12;
  return (
    <div className="relative hidden md:block" aria-hidden="true">
      <Lane x={X_MAIN} mode={row.main} lit={lit} />
      {/* The degree branch runs in grey the whole way; it only turns bright where its own node is. */}
      <Lane x={X_PICT} mode={row.pict} lit={row.node === "pict" ? lit : false} start={row.merge ? NODE_Y + 40 : NODE_Y} />
      {row.merge && (
        <svg className="absolute" style={{ left: X_MAIN, top: NODE_Y }} width={X_PICT - X_MAIN} height={40} viewBox={`0 0 ${X_PICT - X_MAIN} 40`} fill="none">
          <path d={`M${X_PICT - X_MAIN} 40 C${X_PICT - X_MAIN} 16, 0 24, 0 0`} stroke={lit ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.22)"} strokeWidth="2" style={{ transition: "stroke .7s" }} />
        </svg>
      )}
      <span
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-500"
        style={{
          left: x,
          top: NODE_Y,
          width: size,
          height: size,
          background: lit ? "#ffffff" : "#0a0a0b",
          borderColor: lit ? "#ffffff" : "rgba(255,255,255,0.35)",
          boxShadow: lit ? "0 0 14px rgba(255,255,255,0.65)" : undefined,
        }}
      />
    </div>
  );
}

function TimelineRow({ row, children }: { row: Row; children: React.ReactNode }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  // A role lights up once it has scrolled into the upper part of the screen.
  const seen = useInView(ref, { margin: "0px 0px -45% 0px", once: true });
  const lit = !!reduce || seen;
  return (
    <li ref={ref} className="grid gap-x-3 md:grid-cols-[92px_minmax(0,1fr)]">
      <Gutter row={row} lit={lit} />
      <div className="pb-4">
        {/* The id sits on the card itself so Wisp's outline hugs the card, not the graph beside it. */}
        <div id={`journey-${row.id}`} className="rounded-[1.75rem]">
          {children}
        </div>
      </div>
    </li>
  );
}

export function Experience() {
  const [current, ...rest] = ROLES;
  return (
    <section id="experience" className="section-shell">
      <div className="section-container">
        <div className="mb-12">
          <p className="section-kicker mb-4">{"// Work · Education"}</p>
          <h2 className="section-title">
            The_{" "}
            <span className="bg-gradient-to-r from-neural-cyan to-neural-violet bg-clip-text text-transparent">Journey</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-text-soft">
            Drawn like a commit graph: my work on the main line, and my degree running alongside it as a branch that merged in July 2026.
          </p>
        </div>

        <ol>
          <TimelineRow row={ROWS[0]}>
            <CurrentRole item={current} />
          </TimelineRow>
          {rest.map((item, i) => (
            <TimelineRow key={item.id} row={ROWS[i + 1]}>
              <CompactRole item={item} />
            </TimelineRow>
          ))}
          <TimelineRow row={ROWS[4]}>
            <div id="education">
              <EducationCard />
            </div>
          </TimelineRow>
        </ol>
      </div>
    </section>
  );
}
