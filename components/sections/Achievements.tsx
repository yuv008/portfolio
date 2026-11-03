"use client";

import { sectionIds } from "@/lib/constants";
import { openProject } from "@/lib/wisp";

type Win = {
  event: string;
  detail: string;
  result: string;
  project?: { id: string; name: string };
  icon: string;
};

const WINS: Win[] = [
  { event: "Devclash 2025", detail: "24-hour hackathon at DY Patil Pimpri", result: "1st prize", project: { id: "shetniyojan", name: "ShetNiyojan" }, icon: "emoji_events" },
  { event: "Synapse 2.0", detail: "AI hackathon at MKSSS CCOEW", result: "1st prize", project: { id: "legify", name: "Legify" }, icon: "emoji_events" },
  { event: "L&T NeuroHack", detail: "24-hour hackathon at COEP Mindspark 24", result: "1st prize", project: { id: "warcast", name: "WarCast" }, icon: "emoji_events" },
  { event: "MHT-CET 2022", detail: "Merit rank 971 among 400,000+ candidates", result: "99.35 percentile", icon: "military_tech" },
];

function Medal({ icon }: { icon: string }) {
  return (
    <div className="tile-media flex h-[120px] items-center justify-center" aria-hidden="true">
      <span className="relative flex h-16 w-16 items-center justify-center">
        <span
          className="tile-anim absolute inset-0 rounded-full border border-neural-cyan/50"
          style={{ animation: "tile-ping 2.8s ease-out infinite" }}
        />
        <span className="absolute inset-0 rounded-full border border-neural-cyan/35 bg-[radial-gradient(circle_at_35%_30%,rgba(143,240,255,0.28),rgba(171,138,255,0.12)_70%)]" />
        <span className="material-symbols-outlined relative text-neural-cyan" style={{ fontSize: 32, fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
        <span
          className="tile-anim pointer-events-none absolute inset-0 overflow-hidden rounded-full"
          style={{ background: "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.35) 50%, transparent 62%)", backgroundSize: "260% 100%", animation: "medal-shine 3.6s ease-in-out infinite" }}
        />
      </span>
    </div>
  );
}

export function Achievements() {
  return (
    <section id={sectionIds.achievements} className="section-shell">
      <div className="section-container">
        <div className="mb-10">
          <p className="section-kicker mb-4">// Recognition</p>
          <h2 className="section-title">
            Achievements<span className="text-neural-violet">_</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WINS.map((w) => (
            <article key={w.event} className="tile tile-hover flex flex-col p-2.5">
              <Medal icon={w.icon} />
              <div className="flex flex-1 flex-col p-4 pt-5">
                <p className="font-display text-xl font-semibold tracking-tight text-neural-cyan">{w.result}</p>
                <h3 className="tile-title mt-1.5 text-lg">{w.event}</h3>
                <p className="tile-body mt-1.5 text-[13px]">{w.detail}</p>
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
