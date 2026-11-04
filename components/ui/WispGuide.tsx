"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";
import { WISP_EXPLAIN_EVENT, WISP_MEET_EVENT, type WispMeetDetail } from "@/lib/wisp";
import { projects } from "@/components/projects/projectData";
import { isLite, LITE_EVENT } from "@/lib/lite";

/* ── Tour content (grounded in what each section shows) ─────── */

type Stop = { id: string; label: string; tip: string; fact?: string; project?: boolean };

const BASE_STOPS: Stop[] = [
  { id: "hero", label: "Home", tip: "This is Yuvraj, an AI R&D engineer who builds voice-agent systems, evaluation platforms and AI infrastructure." },
  { id: "stress-test", label: "VEE Legion", tip: "This is VEE Legion, the QA platform he built at VoiceraCX. Scroll to see how simulated callers test an AI agent, then try the demo at the end.", fact: "Verified at 200 concurrent calls with 0 transport errors." },
  { id: "about", label: "About", tip: "Three things he has built: real-time voice pipelines, hybrid vector search, and fine-tuned models.", fact: "Response time cut from 3 seconds to 1.2 seconds." },
  { id: "experience", label: "Journey", tip: "His career drawn like a commit graph: work on the main line and his degree running alongside as a branch that merges in July 2026. Open a role for details, or press Ask Wisp on one and I'll explain it.", fact: "B.E. in Computer Engineering, Honors in Data Science, at PICT, Pune."},
  { id: "projects", label: "Projects", tip: "Weave, Orpheus TTS, Smart Pathshala, ShetNiyojan, WarCast and Legify. Hover the Weave card to see the demo.", fact: "Scroll sideways to browse them all." },
  { id: "skills", label: "Skills", tip: "The stack as a logo wall and a draggable graph. Hover a logo or a node and everything linked to it lights up.", fact: "Evaluation & Testing links to Voice & Inference through Twilio and LiveKit." },
  { id: "achievements", label: "Achievements", tip: "Three first prizes at hackathons plus a 99.35 percentile in MHT-CET. Each prize links to the project that won it."},
  { id: "contact", label: "Contact", tip: "Last stop. Email is fastest, and the form opens your mail app. Resume, LinkedIn and GitHub are one click away."},
];

/** Section stops, with one stop per project tile right after the Projects intro. */
const JOURNEY_STOPS: Stop[] = [
  { id: "journey-voiceracx", label: "VoiceraCX · VEE Legion", project: true, tip: "Today he builds VEE Legion at VoiceraCX: simulated callers and red-team attacks that test voice and chat AI agents, verified at 200 concurrent calls.", fact: "0 transport errors across 5 platforms." },
  { id: "journey-voiceracx-intern", label: "VoiceraCX · Intern", project: true, tip: "As an AI intern there he cut voice response time from 3 seconds to 1.2, and moved retrieval from Chroma to Qdrant, cutting query latency by 90%.", fact: "Redundant API calls down 60%." },
  { id: "journey-daostreet", label: "DAOStreet", project: true, tip: "At DAOStreet he built Svelte frontend features in a production workflow.", fact: "Feb to June 2025, remote." },
  { id: "journey-alesa", label: "Alesa AI", project: true, tip: "At Alesa AI in the UK he fine-tuned Llama-3.1-8B with PEFT on a 10,000+ term dream-interpretation dataset.", fact: "Nov 2024 to Mar 2025, remote." },
  { id: "journey-pict", label: "PICT", project: true, tip: "All of this ran alongside his Computer Engineering degree at PICT, with Honors in Data Science, from Nov 2022.", fact: "The branch that merges into main in July 2026." },
];

const STOPS: Stop[] = BASE_STOPS.flatMap((stop) =>
  stop.id === "experience"
    ? [stop, ...JOURNEY_STOPS]
    : stop.id === "projects"
    ? [
        { ...stop, tip: "Six projects in a bento grid. Tap any tile for its architecture and design decisions, or press Ask Wisp on a tile and I'll explain it." },
        ...projects.map((p) => ({ id: `project-${p.id}`, label: p.name, tip: p.petScript, fact: p.petFact, project: true })),
      ]
    : [stop],
);

const MEET = {
  tip: "Hi, I'm Wisp, the desktop companion from Weave. On Windows I follow your caret and fill @bubble blanks from company memory. Here, I can walk you through the site.",
  fact: "Windows desktop app. This is a live copy of its front-end.",
};

const STORAGE_KEY = "wisp-guide";
const COMPANIONS = 6;

type Bubble = "tip" | "meet" | null;
type Mode = "initial" | "tour" | "free";

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
  const spyIdx = Math.max(0, STOPS.findIndex((s) => s.id === activeId));
  const [override, setOverride] = useState<number | null>(null); // set when a tile's "Ask Wisp" is pressed
  const stopIdx = override ?? spyIdx;
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
  const goToRef = useRef<(idx: number, scroll: boolean, openBubble: boolean) => void>(() => undefined);
  const markSeenRef = useRef<() => void>(() => undefined);
  const navUntil = useRef(0); // ignore scroll-spy changes while we are scrolling on purpose

  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>("initial");
  const [bubble, setBubble] = useState<Bubble>(null);
  const [chip, setChip] = useState(false); // small first-visit "Take the tour" hint, never a popup
  const chipCleanup = useRef<(() => void) | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [bubblePos, setBubblePos] = useState<{ left: number; top: number; maxH?: number } | null>(null);

  const win = () => frame.current?.contentWindow as WispWin | null | undefined;
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  /* Where the pet rests for a section: alternate sides as the tour moves. */
  const restPos = useCallback((idx: number) => {
    const { w, h } = size.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const leftEdge = vw >= 1280 ? 116 : 16; // clear of the side nav on wide screens
    const el = STOPS[idx]?.project ? document.getElementById(STOPS[idx].id) : null;
    if (el && vw >= 768) {
      // Explaining a tile: stand at the viewport edge on the opposite side of it.
      const r = el.getBoundingClientRect();
      const right = r.left + r.width / 2 < vw / 2;
      return { x: right ? vw - w - 16 : leftEdge, y: vh - h - 20, right };
    }
    const right = idx % 2 === 0;
    return { x: right ? vw - w - 16 : leftEdge, y: vh - h - 20, right };
  }, []);

  /* Put the bubble where it fits on screen: above, below or beside the pet. */
  const placeBubble = useCallback(() => {
    const el = bubbleRef.current;
    if (!el || pos.current.x === -9999) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const { w, h } = size.current;
    const px = pos.current.x;
    const py = pos.current.y;
    const bw = el.offsetWidth;
    el.style.maxHeight = "none"; // measure the natural height
    const bh = el.scrollHeight;
    el.style.maxHeight = "";
    const gap = 6;
    const edge = 8;
    const top = vw >= 768 ? 88 : 72; // clear of the nav bar
    const rightAligned = px + w / 2 > vw / 2;
    const clampX = (x: number) => Math.max(edge, Math.min(x, vw - bw - edge));
    const clampY = (y: number) => Math.max(top, Math.min(y, vh - bh - edge));
    const fits = (x: number, y: number) => x >= edge && y >= top && x + bw <= vw - edge && y + bh <= vh - edge;
    const alignedX = clampX(rightAligned ? px + w - bw : px);
    const options = [
      { x: alignedX, y: py - bh - gap }, // above
      { x: alignedX, y: py + h + gap }, // below
      { x: px + w + gap, y: clampY(py + h / 2 - bh / 2) }, // right of the pet
      { x: px - bw - gap, y: clampY(py + h / 2 - bh / 2) }, // left of the pet
    ];
    let chosen = options.find((o) => fits(o.x, o.y));
    let maxH: number | undefined;
    if (!chosen) {
      // Nothing fits: use the roomier of above/below and let the bubble scroll.
      const spaceAbove = py - top - gap;
      const spaceBelow = vh - (py + h) - gap - edge;
      if (spaceAbove >= spaceBelow) {
        maxH = Math.max(120, spaceAbove);
        chosen = { x: alignedX, y: top };
      } else {
        maxH = Math.max(120, spaceBelow);
        chosen = { x: alignedX, y: py + h + gap };
      }
    }
    setBubblePos({ left: chosen.x - px, top: chosen.y - py, maxH });
  }, []);

  /* Fly in an arc to (x, y) and settle with a little wiggle. */
  const flyTo = useCallback((x: number, y: number, poke = true) => {
    const el = wrap.current;
    if (!el) return;
    const from = { ...pos.current };
    pos.current = { x, y };
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
      chipCleanup.current?.();
    };
  }, []);

  /* Lite mode: stop the pet's looping CSS animations (float, sway, blink) inside its frame. */
  const applyLite = useCallback(() => {
    const doc = frame.current?.contentDocument;
    if (!doc) return;
    let st = doc.getElementById("lite-style");
    if (isLite()) {
      if (!st) {
        st = doc.createElement("style");
        st.id = "lite-style";
        st.textContent = "*, *::before, *::after { animation: none !important; }";
        doc.head.appendChild(st);
      }
    } else st?.remove();
  }, []);
  useEffect(() => {
    window.addEventListener(LITE_EVENT, applyLite);
    return () => window.removeEventListener(LITE_EVENT, applyLite);
  }, [applyLite]);

  const onFrameLoad = () => {
    applyLite();
    const r = restPos(0);
    lastRight.current = r.right ? 1 : 0;
    pos.current = { x: -9999, y: -9999 };
    flyTo(r.x, r.y, false);
    later(() => win()?.weaveSuggest?.({ summary: "tip" }), 1400);
    // First visit on a desktop-class screen: hint once after the first scroll or 5 s, then never again.
    const wide = window.innerWidth >= 768 && window.matchMedia("(pointer: fine)").matches;
    if (!seen.current && wide) {
      let shown = false;
      const show = () => {
        if (shown) return;
        shown = true;
        window.removeEventListener("scroll", onScroll);
        setChip(true);
        later(() => {
          setChip(false);
          markSeenRef.current();
        }, 7000);
      };
      const onScroll = () => {
        if (window.scrollY > 240) show();
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      chipCleanup.current = () => window.removeEventListener("scroll", onScroll);
      later(show, 5000);
    }
  };

  /* Keep the pet parked correctly on resize. */
  useEffect(() => {
    const onResize = () => {
      if (pos.current.x === -9999 || !wrap.current) return;
      const r = restPos(stopIdx);
      pos.current = { x: r.x, y: r.y };
      wrap.current.style.transform = `translate(${r.x}px, ${r.y}px)`;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [restPos, stopIdx]);

  /* Roam: follow the active section. */
  useEffect(() => {
    if (!ready || pos.current.x === -9999) return;
    if (Date.now() < navUntil.current) return;
    setOverride(null);
    const r = restPos(spyIdx);
    flyTo(r.x, r.y);
    if (mode === "initial") {
      setMode("free");
    } else if (mode === "tour") {
      later(() => setBubble("tip"), 1000);
    } else {
      setBubble((b) => (b === "meet" ? b : null));
      later(() => win()?.weaveSuggest?.({ summary: "tip" }), 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  /* Place the bubble once it has rendered, and again when the window changes. */
  useEffect(() => {
    setBubblePos(null);
    if (!bubble) return;
    const id = requestAnimationFrame(placeBubble);
    const onResize = () => placeBubble();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
    };
  }, [bubble, stopIdx, placeBubble]);

  /* Outline the tile Wisp is currently explaining. */
  useEffect(() => {
    const st = STOPS[stopIdx];
    if (!st?.project || bubble !== "tip") return;
    const el = document.getElementById(st.id);
    el?.setAttribute("data-wisp-active", "true");
    return () => el?.removeAttribute("data-wisp-active");
  }, [stopIdx, bubble]);

  /* An "Ask Wisp" button on a project tile: fly over and explain that project. */
  useEffect(() => {
    const onExplain = (e: Event) => {
      const d = (e as CustomEvent<{ id: string; exact?: boolean }>).detail;
      const idx = STOPS.findIndex((st) => st.id === (d?.exact ? d.id : `project-${d?.id}`));
      if (idx < 0 || pos.current.x === -9999) return;
      setMode("free");
      goToRef.current(idx, false, true);
    };
    window.addEventListener(WISP_EXPLAIN_EVENT, onExplain);
    return () => window.removeEventListener(WISP_EXPLAIN_EVENT, onExplain);
  }, []);

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
  markSeenRef.current = markSeen;

  const scrollTo = (id: string) => {
    const isTile = STOPS.find((st) => st.id === id)?.project;
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: isTile ? "center" : "start" });
  };

  /* Go to an exact stop: scroll there, fly the pet over, then explain it (when touring). */
  const goTo = (idx: number, scroll: boolean, openBubble: boolean) => {
    const target = STOPS[idx];
    if (!target) return;
    navUntil.current = Date.now() + (scroll ? 2000 : 1300);
    setOverride(idx);
    setBubble(null);
    win()?.weaveSuggestClose?.();
    if (scroll) scrollTo(target.id);
    later(
      () => {
        const r = restPos(idx);
        flyTo(r.x, r.y);
      },
      scroll && !reducedMotion() ? 800 : 0,
    );
    if (openBubble) later(() => setBubble("tip"), scroll && !reducedMotion() ? 1800 : 1000);
  };

  goToRef.current = goTo;

  const startTour = () => {
    setChip(false);
    markSeen();
    win()?.weaveSuggestClose?.();
    setMode("tour");
    setBubble("tip");
  };

  const endTour = () => {
    markSeen();
    setMode("free");
    setBubble(null);
  };

  const next = () => {
    // Step from the stop being explained, even if it was opened with "Ask Wisp".
    goTo(stopIdx >= STOPS.length - 1 ? 0 : stopIdx + 1, true, true);
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
    bubble === "meet"
      ? { tip: MEET.tip, fact: MEET.fact, source: "Weave · desktop pet" }
      : { tip: stop.tip, fact: stop.fact, source: `Stop ${stopIdx + 1} of ${STOPS.length} · ${stop.project ? (stop.id.startsWith("journey-") ? "Journey · " : "Projects · ") : ""}${stop.label}` };

  const primary =
    bubble === "meet"
      ? { label: "Start tour", run: startTour }
      : { label: isLast ? "Back to top" : "Next stop", run: next };
  const secondary =
    bubble === "meet"
      ? { label: "Thanks", run: endTour }
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

      {chip && !bubble && (
        <button
          type="button"
          onClick={startTour}
          className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 font-body text-[12px] font-semibold text-text-strong shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl transition-colors hover:bg-white/20"
          style={{ pointerEvents: "auto" }}
        >
          Take the tour
        </button>
      )}

      {bubble && (
        <div
          ref={bubbleRef}
          role="dialog"
          aria-label="Wisp tour"
          className="absolute w-[min(300px,calc(100vw-32px))] rounded-2xl p-4"
          style={{
            pointerEvents: "auto",
            left: bubblePos?.left ?? 0,
            top: bubblePos?.top ?? 0,
            visibility: bubblePos ? "visible" : "hidden",
            maxHeight: bubblePos?.maxH,
            overflowY: bubblePos?.maxH ? "auto" : undefined,
            background: "rgba(26,26,26,0.97)",
            border: "1px solid rgba(172,172,172,0.35)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.45), 0 0 24px rgba(172,172,172,0.12)",
          }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.18em]"
            style={{ fontFamily: "var(--font-display), monospace", color: "#acacac" }}
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
                style={{ fontFamily: "var(--font-display), monospace", background: "rgba(172,172,172,0.28)" }}
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
                    style={{ background: i === stopIdx ? "#acacac" : "rgba(255,255,255,0.18)" }}
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
