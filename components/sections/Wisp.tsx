"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sectionIds } from "@/lib/constants";

/* ── Content ───────────────────────────────────────────────── */

const COMPANIONS = ["Wisp", "Knot", "Loaf", "Pebble", "Spark", "Spindle"];

const FLOW = [
  { icon: "keyboard", title: "Watch", text: "Notices that keys are pressed and stays near the text caret. It never reads or stores the characters." },
  { icon: "alternate_email", title: "Spot @bubble", text: "After a pause, finds each @bubble blank in the draft. Every blank is its own question." },
  { icon: "notifications_active", title: "Signal", text: "A purple dot and a small burst show that an answer is ready, without interrupting the typing." },
  { icon: "fact_check", title: "Show a card", text: "The card opens beside the pet with the answer, a short quote, and the source." },
  { icon: "check_circle", title: "Approve or reject", text: "Approve replaces only that token. Reject leaves the draft exactly as typed. Gmail is never sent for you." },
];

const SURFACES = [
  {
    title: "Cursor",
    icon: "terminal",
    points: [
      "Type @bubble and a question in the chat box, then pause",
      "@bubble turns purple when the pet sees it",
      "Approve replaces the @bubble sentence in place",
      "If the sentence is already gone, the answer is pasted or copied",
    ],
  },
  {
    title: "Gmail",
    icon: "mail",
    points: [
      "A Chrome extension reads the open compose box and never sends mail",
      "One blank fills a single sentence, for example a figure in a line",
      "A whole ask such as “@bubble draft an email about the budget” returns a draft",
      "Approve writes into the draft and you still press Send",
    ],
  },
];

const CONTROLS = [
  ["Left-click and drag", "Move the pet and pin it. It keeps facing the typing spot"],
  ["Right-click", "Eyes close and the body nudges (try it on the pet above)"],
  ["Double right-click", "Next companion. The choice is remembered"],
  ["Middle-click", "Hide while held so the click passes through"],
  ["Ctrl+Alt+.", "Jump to the pointer and follow the caret again"],
  ["Ctrl+Alt+W", "Close the pet"],
];

const PARTS = [
  { name: "Pet window", stack: "Transparent, always-on-top", text: "A frameless window hosting the HTML/SVG companion, so the pet floats above your editor." },
  { name: "Companions", stack: "SVG · CSS animation", text: "Six hand-drawn bodies with float, sway and blink. Eyes track the pointer and respect reduced-motion." },
  { name: "Answer card", stack: "HTML · CSS", text: "Summary, quote and source with Approve and Reject. A purple dot and burst announce a ready answer." },
  { name: "Draft tint", stack: "JavaScript", text: "Turns @bubble purple in the Cursor composer when the pet has seen it." },
  { name: "Gmail extension", stack: "Chrome MV3 · JavaScript", text: "Content script on the compose box that shows the tint and writes the approved text into the draft." },
];

const TABS = ["How it works", "Surfaces", "Controls", "Frontend parts"] as const;
type Tab = (typeof TABS)[number];

/* ── Demo (fake data) ──────────────────────────────────────── */

const ANSWERS = [
  { summary: "$2.4M", quote: "Profit came in at $2.4M this quarter.", source: "Demo data · Finance notes" },
  { summary: "$1.8M", quote: "Last quarter's profit was $1.8M.", source: "Demo data · Finance notes" },
];

type WispWin = Window & {
  chrome?: { webview: { postMessage: (m: { type: string }) => void } };
  weaveLook?: (gx: number, gy: number) => void;
  weaveNext?: () => void;
  weavePoke?: () => void;
  weaveReading?: (on: boolean) => void;
  weaveSuggestReading?: (text: string) => void;
  weaveSuggestReplace?: (p: { summary: string; quote: string; source: string }) => void;
  weaveSuggestClose?: () => void;
};

function Token({ filled, text }: { filled: boolean; text: string }) {
  return filled ? (
    <span className="text-neural-green">{text}</span>
  ) : (
    <span className="rounded bg-neural-violet/20 px-1 text-neural-violet">@bubble</span>
  );
}

function PetDemo() {
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const filledRef = useRef(0);
  const companion = useRef(0);
  const lastClick = useRef(0);
  const [filled, setFilled] = useState(0);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState(COMPANIONS[0]);

  const win = () => frame.current?.contentWindow as WispWin | null | undefined;

  const closeCard = useCallback(() => win()?.weaveSuggestClose?.(), []);

  const onFrameLoad = useCallback(() => {
    const w = win();
    if (!w) return;
    // The pet normally talks to its desktop host; here Approve / Reject land in the page.
    w.chrome = {
      webview: {
        postMessage: (m) => {
          if (m.type === "accept") {
            filledRef.current += 1;
            setFilled(filledRef.current);
            setBusy(false);
            w.weaveSuggestClose?.();
          } else if (m.type === "ignore") {
            setBusy(false);
            w.weaveSuggestClose?.();
          }
        },
      },
    };
  }, []);

  // Eyes follow the pointer anywhere on the page, like the desktop pet follows the caret.
  useEffect(() => {
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = box.current;
        const w = win();
        if (!el || !w?.weaveLook) return;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / 320;
        const dy = (e.clientY - (r.top + r.height / 2)) / 240;
        w.weaveLook(Math.max(-1, Math.min(1, dx)), Math.max(-1, Math.min(1, dy)));
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const ask = () => {
    const w = win();
    const n = filledRef.current;
    if (!w || busy || n >= ANSWERS.length) return;
    setBusy(true);
    w.weaveReading?.(true);
    w.weaveSuggestReading?.("Reading the company notes");
    window.setTimeout(() => {
      w.weaveReading?.(false);
      w.weaveSuggestReplace?.(ANSWERS[n]);
    }, 900);
  };

  const reset = () => {
    filledRef.current = 0;
    setFilled(0);
    setBusy(false);
    closeCard();
  };

  // Right-click pokes, double right-click switches companion, like the desktop pet.
  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const w = win();
    const now = Date.now();
    if (now - lastClick.current < 350) {
      w?.weaveNext?.();
      companion.current = (companion.current + 1) % COMPANIONS.length;
      setName(COMPANIONS[companion.current]);
    } else {
      w?.weavePoke?.();
    }
    lastClick.current = now;
  };

  const done = filled >= ANSWERS.length;

  return (
    <div className="glass-panel rounded-[1.5rem] p-5">
      <div
        ref={box}
        onContextMenu={onContextMenu}
        className="relative mx-auto h-[340px] w-full max-w-[420px] overflow-hidden rounded-xl bg-black/30"
      >
        <iframe
          ref={frame}
          src="/wisp/wisp-frame.html"
          title="Wisp desktop companion"
          onLoad={onFrameLoad}
          className="h-full w-full border-0"
          style={{ background: "transparent" }}
        />
        <span className="pointer-events-none absolute bottom-2 left-3 font-display text-[0.55rem] uppercase tracking-[0.18em] text-text-muted">
          {name} · right-click to poke · double right-click for next
        </span>
      </div>

      <div className="mt-5">
        <p className="font-display text-[0.6rem] uppercase tracking-[0.18em] text-text-muted">Try @bubble · demo data</p>
        <p className="mt-3 rounded-xl bg-black/30 p-4 font-mono text-sm leading-7 text-text-soft">
          hey, as per discussed the profit is <Token filled={filled > 0} text={ANSWERS[0].summary} /> it has grown
          from <Token filled={filled > 1} text={ANSWERS[1].summary} />
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {!done ? (
            <button
              type="button"
              onClick={ask}
              disabled={busy}
              className="rounded-full bg-neural-violet/25 px-4 py-1.5 font-display text-[0.6rem] uppercase tracking-[0.15em] text-text-strong transition-colors hover:bg-neural-violet/40 disabled:opacity-50"
            >
              {busy ? "Answer ready, check the card" : "Pause typing"}
            </button>
          ) : (
            <button
              type="button"
              onClick={reset}
              className="font-display text-[0.6rem] uppercase tracking-[0.15em] text-neural-cyan hover:underline"
            >
              Replay
            </button>
          )}
        </div>
        <p className="mt-3 text-xs leading-5 text-text-muted">
          Each @bubble is its own question. Approve fills only that token, and Reject leaves the sentence untouched.
        </p>
      </div>
    </div>
  );
}

/* ── Section ───────────────────────────────────────────────── */

export function Wisp() {
  const [tab, setTab] = useState<Tab>("How it works");

  return (
    <section id={sectionIds.wisp} className="section-shell">
      <div className="section-container">
        <div className="mb-10">
          <p className="section-kicker mb-4">// Companion</p>
          <h2 className="section-title">
            Meet Wisp<span className="text-neural-violet">_</span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-text-soft">
            The desktop pet that brings Weave to where you type. It follows your caret, and when you write
            <code className="mx-1 rounded bg-neural-violet/15 px-1.5 text-neural-violet">@bubble</code>
            in Cursor or Gmail it fills the blank from company memory, with the source on a card first.
            This is the real pet front-end running live. Windows only.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <PetDemo />

          <div className="glass-panel rounded-[1.5rem] p-5 md:p-6">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Wisp overview">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={t === tab}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-4 py-1.5 font-display text-[0.6rem] uppercase tracking-[0.15em] transition-colors ${
                    t === tab
                      ? "bg-neural-cyan/20 text-text-strong"
                      : "border border-surface-border/30 text-text-muted hover:text-text-soft"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-6" role="tabpanel">
              {tab === "How it works" && (
                <ol className="space-y-4">
                  {FLOW.map((s, i) => (
                    <li key={s.title} className="flex gap-4">
                      <span className="material-symbols-outlined mt-0.5 text-neural-violet" aria-hidden="true">
                        {s.icon}
                      </span>
                      <div>
                        <h4 className="font-display text-sm font-semibold text-text-strong">
                          {i + 1}. {s.title}
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-text-soft">{s.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              {tab === "Surfaces" && (
                <div className="grid gap-5 md:grid-cols-2">
                  {SURFACES.map((s) => (
                    <div key={s.title}>
                      <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-text-strong">
                        <span className="material-symbols-outlined text-neural-cyan" aria-hidden="true">
                          {s.icon}
                        </span>
                        {s.title}
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {s.points.map((p) => (
                          <li key={p} className="text-sm leading-6 text-text-soft">
                            <span className="mr-2 text-neural-violet">›</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {tab === "Controls" && (
                <dl className="divide-y divide-surface-border/20">
                  {CONTROLS.map(([k, v]) => (
                    <div key={k} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]">
                      <dt className="font-mono text-xs text-neural-cyan">{k}</dt>
                      <dd className="text-sm leading-6 text-text-soft">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {tab === "Frontend parts" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {PARTS.map((p) => (
                    <div key={p.name} className="rounded-xl border border-surface-border/20 bg-black/20 p-4">
                      <h4 className="font-display text-sm font-semibold text-text-strong">{p.name}</h4>
                      <p className="mt-1 font-mono text-[0.65rem] text-neural-violet">{p.stack}</p>
                      <p className="mt-2 text-xs leading-5 text-text-soft">{p.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-4 border-t border-surface-border/20 pt-4 font-display text-[0.6rem] uppercase tracking-[0.15em]">
              <a
                href="https://github.com/yuv008/Weave/tree/main/cursor-wisp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-neural-cyan"
              >
                Source ↗
              </a>
              <a
                href="https://www.youtube.com/watch?v=psdbCkjoa38"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-neural-cyan"
              >
                Demo video ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
