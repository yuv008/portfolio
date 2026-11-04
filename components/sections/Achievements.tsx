"use client";

import { useEffect, useRef, useState } from "react";
import { sectionIds } from "@/lib/constants";
import { openProject } from "@/lib/wisp";
import { Wash } from "@/components/ui/Wash";

type Win = {
  wash: [string, string];
  event: string;
  detail: string;
  result: string;
  project?: { id: string; name: string };
  /** What the tile shows large: a rank numeral, or a ring that fills to a percentile. */
  visual: { kind: "rank"; big: string; sub: string } | { kind: "ring"; value: number; label: string };
};

const WINS: Win[] = [
  { wash: ["#dddddd", "#e6e6e6"], event: "Devclash 2025", detail: "24-hour hackathon at DY Patil Pimpri", result: "1st prize", project: { id: "shetniyojan", name: "ShetNiyojan" }, visual: { kind: "rank", big: "1ST", sub: "Prize" } },
  { wash: ["#d4d4d4", "#acacac"], event: "Synapse 2.0", detail: "AI hackathon at MKSSS CCOEW", result: "1st prize", project: { id: "legify", name: "Legify" }, visual: { kind: "rank", big: "1ST", sub: "Prize" } },
  { wash: ["#d3d3d3", "#ff7078"], event: "L&T NeuroHack", detail: "24-hour hackathon at COEP Mindspark 24", result: "1st prize", project: { id: "warcast", name: "WarCast" }, visual: { kind: "rank", big: "1ST", sub: "Prize" } },
  { wash: ["#acacac", "#e6e6e6"], event: "MHT-CET 2022", detail: "Merit rank 971 among 400,000+ candidates", result: "99.35 percentile", visual: { kind: "ring", value: 99.35, label: "percentile" } },
];

const DOTS = "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px) 0 0 / 14px 14px";

function Rank({ big, sub }: { big: string; sub: string }) {
  return (
    <div className="relative flex flex-col items-center">
      <span
        className="tile-anim select-none font-display text-[64px] font-bold leading-none tracking-tighter text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.95) 50%, transparent 62%), linear-gradient(180deg, #ffffff 0%, #8a8a8a 100%)",
          backgroundSize: "260% 100%, 100% 100%",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          animation: "medal-shine 3.6s ease-in-out infinite",
        }}
      >
        {big}
      </span>
      <span className="mt-1 font-display text-[10px] uppercase tracking-[0.4em] text-text-muted">{sub}</span>
    </div>
  );
}

/* Ring that fills to the percentile when it scrolls into view. */
function Ring({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const C = 2 * Math.PI * 40;
  return (
    <div ref={ref} className="relative h-[104px] w-[104px]">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" />
        <circle
          className="ring-arc"
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#f4f4f4"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={on ? C * (1 - value / 100) : C}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[22px] font-bold leading-none text-text-strong">{value}</span>
        <span className="mt-1 font-display text-[8px] uppercase tracking-[0.25em] text-text-muted">{label}</span>
      </div>
    </div>
  );
}

function Visual({ v }: { v: Win["visual"] }) {
  return (
    <div className="tile-media flex h-[140px] items-center justify-center" style={{ background: `${DOTS}, #080808` }} aria-hidden="true">
      <span className="material-symbols-outlined pointer-events-none absolute -right-3 -top-3 text-[110px] text-white/[0.04]" style={{ fontVariationSettings: "'FILL' 1" }}>
        {v.kind === "rank" ? "emoji_events" : "military_tech"}
      </span>
      {v.kind === "rank" ? <Rank big={v.big} sub={v.sub} /> : <Ring value={v.value} label={v.label} />}
    </div>
  );
}

export function Achievements() {
  return (
    <section id={sectionIds.achievements} className="section-shell">
      <div className="section-container">
        <div className="mb-10">
          <p className="section-kicker mb-4">{"// Recognition"}</p>
          <h2 className="section-title">
            Achievements<span className="text-neural-violet">_</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WINS.map((w) => (
            <article
              key={w.event}
              className="tile tile-hover tile-spot flex flex-col p-2.5"
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
            >
              <Wash from={w.wash[0]} to={w.wash[1]} dim={0.55} />
              <Visual v={w.visual} />
              <div className="flex flex-1 flex-col p-4 pt-5">
                <p className="sr-only">{w.result}</p>
                <h3 className="tile-title text-xl">{w.event}</h3>
                <p className="tile-body mt-2 text-[13px]">{w.detail}</p>
                {w.project && (
                  <button
                    type="button"
                    onClick={() => openProject(w.project!.id)}
                    className="mt-auto self-start pt-5 text-xs font-semibold text-text-soft underline-offset-4 transition-colors hover:text-neural-cyan hover:underline"
                  >
                    Built {w.project.name} →
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
