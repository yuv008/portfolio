"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { StackWall } from "@/components/skills/StackWall";
import { STACK_HUBS } from "@/lib/stack";

// The graph (d3-force plus a canvas) is far below the fold, so it is fetched and set up only when it is near.
const StackGraph = dynamic(() => import("@/components/skills/StackGraph").then((m) => m.StackGraph), {
  ssr: false,
});

export function Skills() {
  // A hub id or a skill name that the wall, graph and tiles all light up together.
  const [focus, setFocus] = useState<string | null>(null);
  const [narrow, setNarrow] = useState(false);
  const [phone, setPhone] = useState(false);
  const [near, setNear] = useState(false);
  const graphBox = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = graphBox.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "500px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const pq = window.matchMedia("(max-width: 767px)");
    const update = () => {
      setNarrow(mq.matches);
      setPhone(pq.matches);
    };
    update();
    mq.addEventListener("change", update);
    pq.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      pq.removeEventListener("change", update);
    };
  }, []);

  return (
    <section id="skills" className="section-shell">
      <div className="section-container">
        <div className="mb-12">
          <p className="section-kicker mb-4">{"// System_Status: Operational"}</p>
          <h2 className="section-title">
            The_{" "}
            <span className="bg-gradient-to-r from-neural-cyan to-neural-violet bg-clip-text text-transparent">Matrix</span>
          </h2>
          <p className="section-copy mt-4 !text-base">
            <span className="md:hidden">The tools I build with, grouped by what they are for.</span>
            <span className="hidden md:inline">
              The tools I build with, and how they connect. Hover a logo or a node to see what connects to it, or drag the graph.
            </span>
          </p>
        </div>

        <StackWall focus={focus} onFocus={setFocus} />

        {/* Phones: the stack grouped by category. The graph needs room to read, so it (and its code) is desktop only. */}
        {phone && (
          <div className="mt-10 grid gap-3">
            {STACK_HUBS.map((h) => (
              <div key={h.id} className="tile p-5">
                <p className="font-display text-[11px] uppercase tracking-[0.18em] text-text-strong">{h.label}</p>
                <p className="mt-1 text-sm text-text-soft">{h.blurb}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {h.skills.map((s) => (
                    <li key={s} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-text-soft">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <figure ref={graphBox} className={`tile mt-14 overflow-hidden p-2 md:p-4 ${phone ? "hidden" : ""}`}>
          {near && !phone ? (
            <StackGraph focus={focus} onFocus={setFocus} height={narrow ? 700 : 640} />
          ) : (
            <div style={{ height: narrow ? 700 : 640 }} aria-hidden="true" />
          )}
          <figcaption className="sr-only">
            <ul>
              {STACK_HUBS.map((h) => (
                <li key={h.id}>
                  {h.label}: {h.skills.join(", ")}
                </li>
              ))}
            </ul>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
