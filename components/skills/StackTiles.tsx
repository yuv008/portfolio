"use client";

import { STACK_HUBS } from "@/lib/stack";

/**
 * One compact tile per area. The tool lists live in the wall and the graph, so each tile
 * says something new: where that area was used, with a real result. Hovering or focusing a
 * tile still lights its tools in the wall and the graph.
 */
export function StackTiles({
  focus,
  onFocus,
}: {
  focus: string | null;
  onFocus: (v: string | null) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {STACK_HUBS.map((hub) => {
        const active = focus === hub.id;
        return (
          <article
            key={hub.id}
            tabIndex={0}
            onMouseEnter={() => onFocus(hub.id)}
            onMouseLeave={() => onFocus(null)}
            onFocus={() => onFocus(hub.id)}
            onBlur={() => onFocus(null)}
            className="tile tile-hover flex min-h-[190px] flex-col p-6 outline-none focus-visible:ring-2 focus-visible:ring-neural-cyan/60"
            style={active ? { borderColor: "rgba(110,231,255,0.35)" } : undefined}
          >
            <div className="flex items-center gap-3">
              <span className="tile-icon">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">
                  {hub.icon}
                </span>
              </span>
              <h3 className="text-sm font-semibold text-text-strong">{hub.label}</h3>
            </div>

            <p className="mt-5 font-display text-2xl font-semibold tracking-tight text-neural-cyan">{hub.proof.stat}</p>
            <p className="tile-body mt-1.5 text-[13px]">{hub.proof.text}</p>
          </article>
        );
      })}
    </div>
  );
}
