"use client";

import { useEffect, useRef, useState } from "react";
import { LossCurve } from "@/components/ui/TileVisuals";

/* ── Small helpers ─────────────────────────────────────────── */

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useSeen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/** Counts from one value to another once it scrolls into view. Shows the final value straight away if motion is reduced. */
function CountUp({ from = 0, to, decimals = 0, run }: { from?: number; to: number; decimals?: number; run: boolean }) {
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!run || reduced()) {
      setV(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 1400);
      const e = 1 - Math.pow(1 - k, 3);
      setV(from + (to - from) * e);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    setV(from);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, from, to]);
  return <>{v.toFixed(decimals)}</>;
}

/** Real before/after figures as two bars that grow when seen. */
function Compare({ before, after, afterPct, run }: { before: string; after: string; afterPct: number; run: boolean }) {
  const row = (label: string, value: string, pct: number, strong: boolean) => (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between font-display text-[10px] uppercase tracking-[0.16em]">
        <span className="text-text-muted">{label}</span>
        <span className={strong ? "text-text-strong" : "text-text-muted"}>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full"
          style={{
            width: run ? `${pct}%` : "0%",
            background: strong ? "linear-gradient(90deg,#bdbdbd,#ffffff)" : "rgba(255,255,255,0.28)",
            transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>
    </div>
  );
  return (
    <div className="tile-media flex h-[132px] flex-col justify-center gap-4 px-6" aria-hidden="true">
      {row("Before", before, 100, false)}
      {row("After", after, afterPct, true)}
    </div>
  );
}

/* ── The three impact tiles ────────────────────────────────── */

type Card = {
  icon: string;
  kicker: string;
  title: string;
  body: string;
  stat: React.ReactNode;
  visual: (run: boolean) => React.ReactNode;
};

const CARDS = (run: boolean): Card[] => [
  {
    icon: "graphic_eq",
    kicker: "Voice systems",
    title: "Real-Time Voice Infrastructure",
    body: "Built LiveKit voice pipelines with streaming inference, connection pooling, and smart caching, reducing response time from 3 seconds to 1.2 seconds.",
    stat: (
      <>
        3s → <CountUp from={3} to={1.2} decimals={1} run={run} />s
      </>
    ),
    visual: (r) => <Compare before="3.0 s" after="1.2 s" afterPct={40} run={r} />,
  },
  {
    icon: "manage_search",
    kicker: "Retrieval",
    title: "Hybrid Vector Search",
    body: "Migrated Chroma to Qdrant with hybrid dense-sparse search, reducing query latency by 90% for voice-agent workloads.",
    stat: (
      <>
        −<CountUp to={90} run={run} />%
      </>
    ),
    visual: (r) => <Compare before="Chroma" after="Qdrant, −90%" afterPct={10} run={r} />,
  },
  {
    icon: "model_training",
    kicker: "Models",
    title: "Fine-Tuning & Evaluation",
    body: "Fine-tuned Llama-3.1-8B with PEFT on a 10,000+ term dream-interpretation dataset and trained Orpheus TTS to generate SNAC audio tokens.",
    stat: (
      <>
        <CountUp to={10} run={run} />k+ terms
      </>
    ),
    visual: () => <LossCurve />,
  },
];

/* ── The flow: where each piece sits in a voice agent ──────── */

type Stage = { id: string; label: string; sub: string; card?: number };

const STAGES: Stage[] = [
  { id: "in", label: "Caller audio", sub: "speech in" },
  { id: "voice", label: "LiveKit pipeline", sub: "streaming · pooling · caching", card: 0 },
  { id: "retrieval", label: "Hybrid retrieval", sub: "Qdrant · dense + sparse", card: 1 },
  { id: "model", label: "Fine-tuned LLM", sub: "Llama-3.1-8B · PEFT", card: 2 },
  { id: "tts", label: "Speech out", sub: "Orpheus TTS · SNAC tokens", card: 2 },
];

function Connector() {
  return (
    <div className="relative hidden items-center self-center lg:flex" aria-hidden="true">
      <span
        className="tile-anim h-px w-full"
        style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0 6px, transparent 6px 14px)", backgroundSize: "28px 1px", animation: "flow-x 1.6s linear infinite" }}
      />
      <span
        className="tile-anim absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
        style={{ animation: "flow-pulse 2.4s ease-in-out infinite" }}
      />
    </div>
  );
}

function Flow({ active, setActive }: { active: number | null; setActive: (n: number | null) => void }) {
  return (
    <div className="mb-8">
      <div
        className="flex flex-col gap-2 lg:grid lg:items-stretch lg:gap-0 lg:[grid-template-columns:repeat(4,minmax(0,1fr)_40px)_minmax(0,1fr)]"
        role="list"
        aria-label="How these pieces fit in a voice agent"
      >
        {STAGES.map((s, i) => {
          const mine = s.card !== undefined;
          const on = mine && active === s.card;
          return (
            <div key={s.id} className="contents" role="listitem">
              <button
                type="button"
                disabled={!mine}
                onMouseEnter={() => mine && setActive(s.card!)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => mine && setActive(s.card!)}
                onBlur={() => setActive(null)}
                className="rounded-2xl px-4 py-3 text-left outline-none transition-all focus-visible:ring-2 focus-visible:ring-white/60 disabled:cursor-default"
                style={{
                  background: on ? "rgba(34,34,36,0.95)" : mine ? "rgba(18,18,20,0.88)" : "transparent",
                  border: mine ? `1px solid ${on ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.14)"}` : "1px dashed rgba(255,255,255,0.14)",
                  transform: on ? "translateY(-2px)" : undefined,
                  boxShadow: on ? "0 10px 30px -12px rgba(255,255,255,0.25)" : undefined,
                }}
              >
                <p className={`font-display text-[13px] font-semibold ${mine ? "text-text-strong" : "text-text-muted"}`}>{s.label}</p>
                <p className="mt-0.5 text-[11px] text-text-muted">{s.sub}</p>
              </button>
              {i < STAGES.length - 1 && <Connector />}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-text-muted">
        The generic path of a voice agent. The solid stages are parts I built, across VoiceraCX, Alesa AI and the Orpheus TTS project.
      </p>
    </div>
  );
}

export function About() {
  const [active, setActive] = useState<number | null>(null);
  const [ref, seen] = useSeen<HTMLDivElement>();
  const cards = CARDS(seen);

  return (
    <section id="about" className="section-shell">
      <div className="section-container">
        <header className="mb-10">
          <p className="section-kicker mb-4">{"// Manifest_v5.0"}</p>
          <h2 className="section-title">
            The_{" "}
            <span className="bg-gradient-to-r from-neural-cyan to-neural-violet bg-clip-text text-transparent">Architecture</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-text-soft">
            Three layers of a voice agent that I have built and measured: how it talks, what it knows, and the models behind it.
          </p>
        </header>

        <Flow active={active} setActive={setActive} />

        <div ref={ref} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((card, i) => (
            <article
              key={card.kicker}
              className="tile tile-hover flex flex-col p-2.5 transition-shadow"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              style={active === i ? { borderColor: "rgba(255,255,255,0.4)", boxShadow: "0 18px 50px -20px rgba(255,255,255,0.22)" } : undefined}
            >
              {card.visual(seen)}
              <div className="flex flex-1 flex-col p-4 pt-5">
                <div className="flex items-start justify-between">
                  <span className="tile-icon">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">
                      {card.icon}
                    </span>
                  </span>
                  <span className="tile-label">{card.kicker}</span>
                </div>

                <p className="mt-5 font-display text-3xl font-semibold tracking-tight text-neural-cyan">{card.stat}</p>
                <h3 className="tile-title mt-4">{card.title}</h3>
                <p className="tile-body mt-3">{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
