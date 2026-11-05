"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

/**
 * Desktop presentation of The_Legion: the steps sit on a pinned horizontal rail. The card at the centre steps
 * toward the screen; cards that have passed step down and tilt away on the left; the ones still to come wait
 * smaller on the right. Each card's look is a pure function of its distance from the centre, so it all reverses
 * perfectly when scrolling back. Shown only on wide screens with motion allowed (see .legion-rail in globals.css).
 */
// Card size lives in CSS variables (see .legion-rail in globals.css) so short windows can switch to a wider,
// side-by-side card without any JavaScript.
const CARD_H = "var(--legion-h)";
const CARD_W = "var(--legion-w)";
const GAP = "3vw";
const SCREENS_PER_STEP = 0.85;

function Card({ i, f, active, children }: { i: number; f: MotionValue<number>; active: boolean; children: ReactNode }) {
  const transform = useTransform(f, (v) => {
    const d = i - v;
    const a = Math.min(Math.abs(d), 1);
    const left = d < 0;
    const scale = 1 - 0.2 * a;
    const rotY = (left ? 1 : -1) * 16 * a;
    const z = -140 * a + 40 * (1 - a); // the card in focus steps toward the screen
    const y = left ? 34 * a : -16 * (1 - a) + 10 * a; // and passed cards step down
    return `translate3d(0, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
  });
  const opacity = useTransform(f, (v) => 1 - 0.55 * Math.min(Math.abs(i - v), 1));
  return (
    <motion.li
      aria-hidden={!active}
      inert={!active}
      aria-current={active ? "step" : undefined}
      style={{ transform, opacity, width: CARD_W, height: CARD_H, flex: "none", transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.li>
  );
}

export function LegionRail({
  count,
  labels,
  renderCard,
}: {
  count: number;
  labels: string[];
  renderCard: (i: number, active: boolean) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const spring = useSpring(scrollYProgress, { stiffness: 220, damping: 42, mass: 1 });
  // A short hold at each end, so the first and last card rest in the centre before the section moves on.
  const f = useTransform(spring, (v) => Math.min(Math.max((v - 0.04) / 0.92, 0), 1) * (count - 1));
  const x = useTransform(f, (v) => `translate3d(calc(${-v} * (${CARD_W} + ${GAP})), 0, 0)`);
  useMotionValueEvent(f, "change", (v) => {
    const n = Math.round(v);
    setActive((a) => (a === n ? a : n));
  });

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * (0.04 + 0.92 * (i / (count - 1))), behavior: "smooth" });
  };

  return (
    <div ref={ref} className="legion-rail" style={{ height: `calc(${(count - 1) * SCREENS_PER_STEP + 1} * 100vh)` }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-4 overflow-hidden pt-16" style={{ perspective: "1400px" }}>
        <motion.ol
          className="flex items-center self-start"
          style={{ transform: x, gap: GAP, paddingLeft: `calc(50vw - ${CARD_W} / 2)`, transformStyle: "preserve-3d", width: "max-content" }}
        >
          {Array.from({ length: count }, (_, i) => (
            <Card key={i} i={i} f={f} active={i === active}>
              {renderCard(i, i === active)}
            </Card>
          ))}
        </motion.ol>
        <div className="flex items-center gap-2" role="group" aria-label="Legion steps">
          {labels.map((l, i) => (
            <button
              key={l}
              type="button"
              onClick={() => jump(i)}
              aria-label={`Go to step ${i + 1}: ${l}`}
              aria-current={i === active ? "step" : undefined}
              className="hit relative h-1.5 rounded-full transition-all duration-300"
              style={{ width: i === active ? 28 : 8, background: i === active ? "#e6e6e6" : "rgba(255,255,255,0.25)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
