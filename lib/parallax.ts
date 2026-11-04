import { LITE_EVENT } from "@/lib/lite";

/**
 * Scroll parallax in two small flavours, both done with the independent `translate` / `scale` CSS properties
 * so they never fight a tile's own hover `transform`:
 *   media   – a picture sits inside a fixed frame and drifts a little slower than the frame (depth inside a tile)
 *   stagger – whole tiles of a grid drift by slightly different amounts (depth between tiles)
 * One shared scroll listener, nothing is measured off screen, and everything switches off for Lite mode,
 * reduced motion and screens under 900px wide.
 */
type Mode = "media" | "stagger";
type Item = { el: HTMLElement; host: HTMLElement; mode: Mode; factor: number; visible: boolean };

const MEDIA_SCALE = 1.1; // a little larger than its frame so the drift never shows an edge
const STAGGER_MAX = 11; // px; tiles in a column are 24px apart, so neighbours can never touch

const items = new Set<Item>();
let observer: IntersectionObserver | null = null;
let frame = 0;
let listening = false;

const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

function enabled() {
  return (
    window.innerWidth >= 900 &&
    document.documentElement.dataset.lite !== "on" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function reset(it: Item) {
  it.el.style.translate = "";
  it.el.style.scale = "";
}

function apply(it: Item) {
  const r = it.host.getBoundingClientRect();
  const d = r.top + r.height / 2 - window.innerHeight / 2; // px below the screen centre
  if (it.mode === "media") {
    const max = r.height * ((MEDIA_SCALE - 1) / 2) * 0.9;
    it.el.style.scale = String(MEDIA_SCALE);
    it.el.style.translate = `0 ${clamp(-d * 0.05, max).toFixed(1)}px`;
  } else {
    it.el.style.translate = `0 ${clamp(-d * 0.012 * it.factor, STAGGER_MAX).toFixed(1)}px`;
  }
}

function update() {
  frame = 0;
  if (!enabled()) {
    items.forEach(reset);
    return;
  }
  items.forEach((it) => {
    if (it.visible) apply(it);
  });
}

const schedule = () => {
  if (!frame) frame = requestAnimationFrame(update);
};

function attach() {
  if (listening) return;
  listening = true;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        items.forEach((it) => {
          if (it.el === e.target) it.visible = e.isIntersecting;
        });
      });
      schedule();
    },
    { rootMargin: "150px 0px" },
  );
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener(LITE_EVENT, schedule);
}

function detach() {
  listening = false;
  observer?.disconnect();
  observer = null;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  window.removeEventListener(LITE_EVENT, schedule);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
}

export function registerParallax(el: HTMLElement, host: HTMLElement, mode: Mode, factor = 1) {
  const it: Item = { el, host, mode, factor, visible: false };
  items.add(it);
  attach();
  observer?.observe(el);
  schedule();
  return () => {
    observer?.unobserve(el);
    items.delete(it);
    reset(it);
    if (!items.size) detach();
  };
}
