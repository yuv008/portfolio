"use client";

import { sectionIds } from "@/lib/constants";

const achievements = [
  {
    event: "Devclash 2025",
    detail: "24-hour hackathon at DY Patil Pimpri",
    project: "ShetNiyojan",
  },
  {
    event: "Synapse 2.0",
    detail: "AI hackathon at MKSSS CCOEW",
    project: "LegiFy",
  },
  {
    event: "L&T NeuroHack",
    detail: "24-hour hackathon at COEP Mindspark 24",
    project: "WarCast",
  },
];

export function Achievements() {
  return (
    <section id={sectionIds.achievements} className="section-shell">
      <div className="section-container">
        <div className="mb-10">
          <p className="section-kicker mb-4">// Selected_Recognition</p>
          <h2 className="section-title">
            Achievements<span className="text-neural-violet">_</span>
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {achievements.map((item) => (
            <article key={item.event} className="tile tile-hover flex min-h-[240px] flex-col justify-between p-7">
              <div className="flex items-start justify-between">
                <span className="tile-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">
                    emoji_events
                  </span>
                </span>
                <span className="tile-label">1st prize</span>
              </div>

              <div>
                <h3 className="tile-title">{item.event}</h3>
                <p className="tile-body mt-2">{item.detail}</p>
                <p className="tile-label mt-5 border-t border-white/[0.07] pt-4">Built {item.project}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
