"use client";

import { useEffect, useState } from "react";
import { StackGraph } from "@/components/skills/StackGraph";
import { StackWall } from "@/components/skills/StackWall";
import { STACK_HUBS } from "@/lib/stack";

export function Skills() {
  // A hub id or a skill name that the wall, graph and tiles all light up together.
  const [focus, setFocus] = useState<string | null>(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section id="skills" className="section-shell">
      <div className="section-container">
        <div className="mb-12">
          <p className="section-kicker mb-4">// System_Status: Operational</p>
          <h2 className="section-title w-fit bg-gradient-to-r from-neural-cyan to-neural-violet bg-clip-text text-transparent">THE MATRIX</h2>
          <p className="section-copy mt-4 !text-base">
            The tools I build with, and how they connect. Hover a logo or a node to see what connects to it, or drag the graph.
          </p>
        </div>

        <StackWall focus={focus} onFocus={setFocus} />

        <figure className="tile mt-14 overflow-hidden p-2 md:p-4">
          <StackGraph focus={focus} onFocus={setFocus} height={narrow ? 700 : 640} />
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
