"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";
import { WISP_MEET_EVENT, type WispMeetDetail } from "@/lib/wisp";

/* ── Tour content (grounded in what each section shows) ─────── */

type Stop = { id: string; label: string; tip: string; fact?: string; dock?: "top-right" };

const STOPS: Stop[] = [
  { id: "hero", label: "Home", tip: "This is Yuvraj, an AI R&D engineer who builds voice-agent systems, evaluation platforms and AI infrastructure." },
  { id: "about", label: "About", tip: "Three things he has built: real-time voice pipelines, hybrid vector search, and fine-tuned models.", fact: "Response time cut from 3 seconds to 1.2 seconds." },
  { id: "pipeline", label: "Pipeline", tip: "An interactive scroll through six chapters. Keep scrolling inside it to move from step to step." },
  { id: "experience", label: "Experience", tip: "Four roles: AI R&D Engineer and AI intern at VoiceraCX, plus internships at DAOStreet and Alesa AI Ltd, UK." },
  { id: "education", label: "Education", tip: "B.E. in Computer Engineering with Honors in Data Science at Pune Institute of Computer Technology." },
  { id: "projects", label: "Projects", dock: "top-right", tip: "Weave, Orpheus TTS, Smart Pathshala, ShetNiyojan, WarCast and Legify. Hover the Weave card to see the demo.", fact: "Scroll sideways to browse them all." },
  { id: "skills", label: "Skills", tip: "A map of the stack: Python, PyTorch, LiveKit, Qdrant, FastAPI, Kubernetes and more." },
  { id: "achievements", label: "Achievements", tip: "Three first prizes at hackathons: Devclash 2025, Synapse 2.0 and L&T NeuroHack." },
  { id: "contact", label: "Contact", tip: "Last stop. Send a message from the terminal, or use one of the social links." },
];

const MEET = {
  tip: "Hi, I'm Wisp! I'm the desktop companion from Weave. On a real desktop I follow your caret and fill in @bubble blanks from company memory. Here, I can walk you through the site.",
  fact: "Windows desktop app. This is a live copy of its front-end.",
};

const STORAGE_KEY = "wisp-guide";
const COMPANIONS = 6;

type Bubble = "greeting" | "tip" | "meet" | null;
type Mode = "greeting" | "tour" | "free";

type WispWin = Window & {
  weaveLook?: (gx: number, gy: number) => void;
  weaveNext?: () => void;
  weavePoke?: () => void;
  weaveReading?: (on: boolean) => void;
  weaveSuggest?: (p: { summary: string }) => void;
  weaveSuggestClose?: () => void;
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function WispGuide() {
  const items = useMemo(() => STOPS.map((s) => ({ id: s.id })), []);
  const activeId = useScrollSpy(items);
  const stopIdx = Math.max(0, STOPS.findIndex((s) => s.id === activeId));
  const stop = STOPS[stopIdx];

  const wrap = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const pos = useRef({ x: -9999, y: -9999 });
  const size = useRef({ w: 150, h: 130 });
  const lastRight = useRef(0);
  const companion = useRef(0);
  const flight = useRef<Animation | null>(null);
  const timers = useRef<number[]>([]);
  const seen = useRef(false);

  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>("greeting");
  const [bubble, setBubble] = useState<Bubble>(null);
  const [placement, setPlacement] = useState({ above: true, right: true });

  const win = () => frame.current?.contentWindow as WispWin | null | undefined;
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  /* Where the pet rests for a section: alternate sides as the tour moves. */
  const restPos = useCallback((idx: number) => {
    const { w, h } = size.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (STOPS[idx]?.dock === "top-right" && vw >= 1024) {
      // Sections whose content fills the screen: perch in the empty gap beside the heading.
      return { x: Math.round(vw * 0.52 - w / 2), y: 104, right: false };
    }
    const right = idx % 2 === 0;
    const leftEdge = vw >= 1280 ? 116 : 16; // clear of the side nav on wide screens
    return { x: right ? vw - w - 16 : leftEdge, y: vh - h - 20, right };
  }, []);

  const fixPlacement = (x: number, y: number) =>
    setPlacement({ above: y > 260, right: x + size.current.w / 2 > window.innerWidth / 2 });

  /* Fly in an arc to (x, y) and settle with a little wiggle. */
  const flyTo = useCallback((x: number, y: number, poke = true) => {
    const el = wrap.current;
    if (!el) return;
    const from = { ...pos.current };
    pos.current = { x, y };
    fixPlacement(x, y);
    flight.current?.cancel();

    const finish = () => {
      el.style.transform = `translate(${x}px, ${y}px)`;
      win()?.weaveLook?.(0, 0);
      if (poke) win()?.weavePoke?.();
    };

    if (from.x === -9999 || reducedMotion()) {
      finish();
      return;
    }
    const dir = x >= from.x ? 1 : -1;
    win()?.weaveLook?.(dir, -0.3);
    const midX = (from.x + x) / 2;
    const midY = Math.min(from.y, y) - 70;
    const anim = el.animate(
      [
        { transform: `translate(${from.x}px, ${from.y}px)` },
        { transform: `translate(${midX}px, ${midY}px)`, offset: 0.5 },
        { transform: `translate(${x}px, ${y}px)` },
      ],
      { duration: 1100, easing: "cubic-bezier(.45,.05,.2,1)" },
    );
    flight.current = anim;
    anim.onfinish = finish;
    anim.oncancel = () => undefined;
  }, []);

  /* Mount: pick a size, load the frame lazily, place the pet. */
  useEffect(() => {
    const small = window.innerWidth < 640;
    size.current = small ? { w: 105, h: 91 } : { w: 150, h: 130 };
    try {
      seen.current = window.localStorage.getItem(STORAGE_KEY) === "seen";
    } catch {
      /* storage unavailable */
    }
    const start = () => setReady(true);
    if (document.readyState === "complete") later(start, 800);
    else window.addEventListener("load", () => later(start, 800), { once: true });
    const t = timers.current;
    return () => {
      t.forEach((id) => window.clearTimeout(id));
      flight.current?.cancel();
    };
  }, []);

  const onFrameLoad = () => {
    const r = restPos(0);
    lastRight.current = r.right ? 1 : 0;
    pos.current = { x: -9999, y: -9999 };
    flyTo(r.x, r.y, false);
    if (!seen.current) later(() => setBubble("greeting"), 1400);
    else later(() => win()?.weaveSuggest?.({ summary: "tip" }), 1400);
  };

  /* Keep the pet parked correctly on resize. */
  useEffect(() => {
    const onResize = () => {
      if (pos.current.x === -9999 || !wrap.current) return;
      const r = restPos(stopIdx);
      pos.current = { x: r.x, y: r.y };
      wrap.current.style.transform = `translate(${r.x}px, ${r.y}px)`;
      fixPlacement(r.x, r.y);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [restPos, stopIdx]);

  /* Roam: follow the active section. */
  useEffect(() => {
    if (!ready || pos.current.x === -9999) return;
    const r = restPos(stopIdx);
    flyTo(r.x, r.y);
    if (mode === "greeting") {
      setMode("free");
      setBubble(null);
    } else if (mode === "tour") {
      later(() => setBubble("tip"), 1000);
    } else {
      setBubble((b) => (b === "meet" ? b : null));
      later(() => win()?.weaveSuggest?.({ summary: "tip" }), 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  /* The "Meet Wisp" button: fly to it, wiggle, introduce. */
  useEffect(() => {
    const onMeet = (e: Event) => {
      const d = (e as CustomEvent<WispMeetDetail>).detail;
      if (!d || pos.current.x === -9999) return;
      const { w, h } = size.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const rightOf = d.left + d.width + 12;
      const beside = rightOf + w < vw - 8 ? rightOf : d.left - w - 12;
      const x = clamp(beside, 8, vw - w - 8);
      const y = clamp(d.top + d.height / 2 - h / 2, 76, vh - h - 8);
      win()?.weaveSuggestClose?.();
      setMode("free");
      setBubble(null);
      flyTo(x, y);
      later(() => win()?.weavePoke?.(), 1500);
      later(() => setBubble("meet"), 1500);
    };
    window.addEventListener(WISP_MEET_EVENT, onMeet);
    return () => window.removeEventListener(WISP_MEET_EVENT, onMeet);
  }, [flyTo]);

  /* Eyes follow the pointer. */
  useEffect(() => {
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = win();
        if (!w?.weaveLook || pos.current.x === -9999) return;
        const cx = pos.current.x + size.current.w / 2;
        const cy = pos.current.y + size.current.h / 2;
        w.weaveLook(clamp((e.clientX - cx) / 360, -1, 1), clamp((e.clientY - cy) / 260, -1, 1));
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const markSeen = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "seen");
    } catch {
      /* storage unavailable */
    }
    seen.current = true;
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
  };

  const startTour = () => {
    markSeen();
    win()?.weaveSuggestClose?.();
    setMode("tour");
    if (stopIdx === 0 || bubble === "greeting") {
      setBubble("tip");
    } else {
      setBubble("tip");
    }
  };

  const endTour = () => {
    markSeen();
    setMode("free");
    setBubble(null);
  };

  const next = () => {
    win()?.weaveSuggestClose?.();
    if (stopIdx >= STOPS.length - 1) {
      setBubble(null);
      scrollTo(STOPS[0].id);
      return;
    }
    setBubble(null);
    scrollTo(STOPS[stopIdx + 1].id);
  };

  /* Clicking the pet opens the tip for the section you are on. */
  const poke = () => {
    win()?.weaveSuggestClose?.();
    win()?.weavePoke?.();
    setBubble((b) => (b ? null : "tip"));
  };

  const lastClick = useRef(0);
  const onContext = (e: React.MouseEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastClick.current < 350) {
      win()?.weaveNext?.();
      companion.current = (companion.current + 1) % COMPANIONS;
    } else {
      win()?.weavePoke?.();
    }
    lastClick.current = now;
  };

  const isLast = stopIdx >= STOPS.length - 1;
  const content =
    bubble === "greeting"
      ? { tip: "Hi, I'm Wisp! Want a quick tour of the portfolio?", fact: undefined, source: "Wisp · guide" }
      : bubble === "meet"
        ? { tip: MEET.tip, fact: MEET.fact, source: "Weave · desktop pet" }
        : { tip: stop.tip, fact: stop.fact, source: `Stop ${stopIdx + 1} of ${STOPS.length} · ${stop.label}` };

  const primary =
    bubble === "greeting" || bubble === "meet"
      ? { label: "Start tour", run: startTour }
      : { label: isLast ? "Back to top" : "Next stop", run: next };
  const secondary =
    bubble === "greeting" || bubble === "meet"
      ? { label: bubble === "meet" ? "Thanks" : "No thanks", run: endTour }
      : { label: mode === "tour" ? "End tour" : "Close", run: endTour };

  return (
    <div
      ref={wrap}
      className="fixed left-0 top-0 z-[45]"
      style={{
        width: size.current.w,
        height: size.current.h,
        pointerEvents: "none",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.6s ease",
        willChange: "transform",
      }}
    >
      {ready && (
        <iframe
          ref={frame}
          src="/wisp/wisp-frame.html"
          title="Wisp, the site guide"
          onLoad={onFrameLoad}
          className="border-0"
          style={{
            width: 300,
            height: 260,
            transformOrigin: "top left",
            transform: `scale(${size.current.w / 300})`,
            background: "transparent",
            colorScheme: "normal",
            pointerEvents: "none",
          }}
          tabIndex={-1}
          aria-hidden
        />
      )}

      <button
        type="button"
        onClick={poke}
        onContextMenu={onContext}
        aria-label="Wisp, the site guide. Press Enter for a tip about this section."
        title="Click for a tip · right-click to poke · double right-click for the next companion"
        className="absolute inset-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-neural-violet"
        style={{ pointerEvents: "auto", background: "transparent", cursor: "pointer" }}
      />

      {bubble && (
        <div
          role="dialog"
          aria-label="Wisp tour"
          className="absolute w-[min(300px,calc(100vw-32px))] rounded-2xl p-4"
          style={{
            pointerEvents: "auto",
            [placement.above ? "bottom" : "top"]: "calc(100% + 6px)",
            [placement.right ? "right" : "left"]: 0,
            background: "rgba(20,27,35,0.97)",
            border: "1px solid rgba(171,138,255,0.35)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.45), 0 0 24px rgba(171,138,255,0.12)",
          }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.18em]"
            style={{ fontFamily: "var(--font-display), monospace", color: "#ab8aff" }}
          >
            {content.source}
          </p>
          <p className="mt-2 text-sm leading-6 text-text-strong">{content.tip}</p>
          {content.fact && (
            <p className="mt-2 border-l-2 border-neural-violet/50 pl-3 text-xs italic leading-5 text-text-soft">
              {content.fact}
            </p>
          )}
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={primary.run}
                className="whitespace-nowrap rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.15em] text-text-strong transition-colors"
                style={{ fontFamily: "var(--font-display), monospace", background: "rgba(171,138,255,0.28)" }}
              >
                {primary.label}
              </button>
              <button
                type="button"
                onClick={secondary.run}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-text-muted transition-colors hover:text-text-soft"
                style={{ fontFamily: "var(--font-display), monospace", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                {secondary.label}
              </button>
            </div>
            {bubble === "tip" && (
              <div className="flex gap-1.5" aria-hidden>
                {STOPS.map((s, i) => (
                  <span
                    key={s.id}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: i === stopIdx ? "#ab8aff" : "rgba(255,255,255,0.18)" }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
