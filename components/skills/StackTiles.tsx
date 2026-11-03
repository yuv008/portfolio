"use client";

import { STACK_HUBS } from "@/lib/stack";

/** One tile per category. Hovering or focusing a tile lights its tools in the wall and the graph. */
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
            className="tile tile-hover flex min-h-[230px] flex-col justify-between p-6 outline-none focus-visible:ring-2 focus-visible:ring-neural-cyan/60"
            style={active ? { borderColor: "rgba(110,231,255,0.35)" } : undefined}
          >
            <div className="flex items-start justify-between">
              <span className="tile-icon">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">
                  {hub.icon}
                </span>
              </span>
              <span className="tile-label">{hub.skills.length} tools</span>
            </div>
            <div>
              <h3 className="tile-title">{hub.label}</h3>
              <p className="tile-body mt-1.5 text-[13px]">{hub.blurb}</p>
              <p className="mt-3 text-xs leading-5 text-text-muted">{hub.skills.join(" · ")}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
