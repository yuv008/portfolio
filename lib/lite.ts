"use client";

import { useEffect, useState } from "react";

/**
 * Lite mode: fewer particles, no blurred washes, still posters instead of video loops, paused CSS
 * animations and a static graph. It switches on by itself for reduced motion, data-saver, very low-end
 * devices or a measured low frame rate, and visitors can turn it on or off from the footer. `?lite=1` and
 * `?lite=0` override it for testing.
 */
export const LITE_EVENT = "lite:change";
const KEY = "lite";

export type LiteReason = "user" | "url" | "auto" | "off";

type Nav = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

function readStored(): "on" | "off" | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "on" || v === "off" ? v : null;
  } catch {
    return null;
  }
}

export function isLite(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.lite === "on";
}

export function liteReason(): LiteReason {
  return ((typeof document !== "undefined" && document.documentElement.dataset.liteReason) || "off") as LiteReason;
}

export function setLite(on: boolean, reason: LiteReason, persist = false) {
  const el = document.documentElement;
  el.dataset.lite = on ? "on" : "off";
  el.dataset.liteReason = on ? reason : "off";
  delete el.dataset.liteFps;
  if (persist) {
    try {
      window.localStorage.setItem(KEY, on ? "on" : "off");
    } catch {
      /* storage unavailable */
    }
  }
  window.dispatchEvent(new Event(LITE_EVENT));
}

/** Weak-device hints that justify starting in Lite mode. */
function weakDevice(): boolean {
  const n = navigator as Nav;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  if (n.connection?.saveData) return true;
  if (typeof n.deviceMemory === "number" && n.deviceMemory <= 2) return true;
  if (typeof n.hardwareConcurrency === "number" && n.hardwareConcurrency <= 2) return true;
  return false;
}

/** Called once on load. Returns a cleanup function. */
export function initLite(): () => void {
  const q = new URLSearchParams(window.location.search).get("lite");
  const stored = readStored();
  let cancelled = false;

  if (q === "1" || q === "0") {
    setLite(q === "1", "url");
    return () => undefined;
  }
  if (stored) {
    setLite(stored === "on", "user");
    return () => undefined;
  }
  if (weakDevice()) {
    setLite(true, "auto");
    return () => undefined;
  }
  setLite(false, "off");

  // Otherwise watch the frame rate for a few seconds once the page has settled; a sustained low rate
  // means this device cannot keep up, so drop to Lite mode for the session.
  let raf = 0;
  let timer = 0;
  const watch = () => {
    let frames = 0;
    let start = 0;
    let slowWindows = 0;
    const tick = (t: number) => {
      if (cancelled) return;
      if (document.hidden) {
        start = 0;
        frames = 0;
        raf = requestAnimationFrame(tick);
        return;
      }
      if (!start) start = t;
      frames += 1;
      if (t - start >= 2500) {
        const fps = (frames * 1000) / (t - start);
        slowWindows = fps < 24 ? slowWindows + 1 : 0;
        if (slowWindows >= 2) {
          setLite(true, "auto");
          // Flag that this came from the frame-rate watch, so layouts do not swap under someone mid-scroll.
          document.documentElement.dataset.liteFps = "1";
          return;
        }
        start = t;
        frames = 0;
        if (slowWindows === 0 && t > 20000) return; // healthy for long enough: stop watching
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  timer = window.setTimeout(watch, 4000);
  return () => {
    cancelled = true;
    window.clearTimeout(timer);
    cancelAnimationFrame(raf);
  };
}

export function useLite(): boolean {
  const [lite, setState] = useState(false);
  useEffect(() => {
    const update = () => setState(isLite());
    update();
    window.addEventListener(LITE_EVENT, update);
    return () => window.removeEventListener(LITE_EVENT, update);
  }, []);
  return lite;
}
