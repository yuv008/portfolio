"use client";

import { STACK_LOGOS, isLit } from "@/lib/stack";

/** Logo wall: dim and monochrome by default, full brand colour on hover or when linked. */
export function StackWall({
  focus,
  onFocus,
}: {
  focus: string | null;
  onFocus: (v: string | null) => void;
}) {
  return (
    <ul className="grid grid-cols-4 gap-y-10 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12" aria-label="Tools I use">
      {STACK_LOGOS.map((logo) => {
        const lit = logo.match.some((m) => isLit(focus, m));
        return (
          <li
            key={logo.name}
            title={logo.name}
            className="group flex h-8 items-center justify-center"
            onMouseEnter={() => onFocus(logo.match[0])}
            onMouseLeave={() => onFocus(null)}
          >
            {logo.slug ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/stack/${logo.slug}.svg`}
                alt={logo.name}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-7 w-7 object-contain transition-[filter,opacity] duration-300"
                style={{ filter: lit ? "none" : "brightness(0) invert(1)", opacity: lit ? 1 : 0.5 }}
              />
            ) : (
              <span
                className="font-display text-sm font-semibold tracking-tight transition-colors duration-300"
                style={{ color: lit ? logo.color : "rgba(255,255,255,0.5)" }}
              >
                {logo.name}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
