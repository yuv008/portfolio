"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { isLite } from "@/lib/lite";
import { projects, type Project } from "@/components/projects/projectData";
import { ProjectCover } from "@/components/projects/ProjectCover";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { ForgeIntro } from "@/components/sections/ForgeIntro";
import { Wash } from "@/components/ui/Wash";
import { useStagger } from "@/components/ui/Parallax";
import { PROJECT_OPEN_EVENT, explainProject, meetWisp } from "@/lib/wisp";

/** Each project keeps its own coloured glow behind the tile, even though the rest of the UI is monochrome. */
const GLOW: Record<string, string> = {
  weave: "#b9a8ff",
  "orpheus-tts": "#a8e8ff",
  "smart-pathshala": "#dcb8ff",
  shetniyojan: "#7ee0a6",
  warcast: "#ffb36b",
  legify: "#9fc2ff",
};

const ACCENT: Record<string, string> = {
  weave: "#c6c6c6",
  "orpheus-tts": "#f4f4f4",
  "smart-pathshala": "#dbdbdb",
  shetniyojan: "#dddddd",
  warcast: "#d3d3d3",
  legify: "#d4d4d4",
};

/** Bento placement. The first tile is the tall hero of the grid. `drift` is the tile's scroll-parallax direction. */
const LAYOUT: Record<string, { span: string; hero?: boolean; drift: number }> = {
  weave: { span: "md:col-span-2 lg:col-span-7 lg:row-span-2", hero: true, drift: -1 },
  "orpheus-tts": { span: "lg:col-span-5", drift: 1 },
  "smart-pathshala": { span: "lg:col-span-5", drift: 1 },
  shetniyojan: { span: "lg:col-span-4", drift: 1 },
  warcast: { span: "lg:col-span-4", drift: -1 },
  legify: { span: "md:col-span-2 lg:col-span-4", drift: 1 },
};

function Tile({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const accent = ACCENT[project.id] ?? "#f4f4f4";
  const glow = GLOW[project.id] ?? accent;
  const layout = LAYOUT[project.id] ?? { span: "lg:col-span-4", drift: 0 };
  const articleRef = useRef<HTMLElement>(null);
  useStagger(articleRef, layout.drift);
  const hero = !!layout.hero;
  const washImage =
    project.cover.kind === "hover-video" ? project.cover.image : project.cover.kind === "slides" ? project.cover.images[0] : undefined;
  const github = project.links?.github;
  const metrics = project.metrics.slice(0, hero ? 3 : 1);

  return (
    <article
      ref={articleRef}
      id={`project-${project.id}`}
      className={`tile tile-hover group relative flex flex-col overflow-hidden ${layout.span}`}
    >
      <Wash image={washImage} from={glow} to={glow} dim={washImage ? 0.52 : 0.6} />
      <div className="shrink-0 p-2.5 pb-0">
        <div data-vt="media" className="tile-media cursor-pointer p-2" style={{ height: hero ? 430 : 210 }} onClick={onOpen}>
          <div className="relative h-full w-full overflow-hidden rounded-[0.8rem]">
            <ProjectCover project={project} />
          </div>
          <span className="pointer-events-none absolute left-5 top-4 h-2 w-2 rounded-full" style={{ background: glow, boxShadow: `0 0 8px ${glow}` }} />
          {project.featured && (
            <span
              className="pointer-events-none absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em]"
              style={{ fontFamily: "var(--font-display), monospace", color: accent, background: "rgba(12,12,12,0.7)", border: `1px solid ${accent}40` }}
            >
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-display), monospace", color: accent }}>
            {project.stack[0]}
          </p>
          <p className="text-[10px] uppercase tracking-[0.15em] text-text-muted" style={{ fontFamily: "var(--font-display), monospace" }}>
            {project.period}
          </p>
        </div>

        <h3 data-vt="title" className={`mt-2 w-fit font-serif font-normal tracking-[-0.01em] text-text-strong ${hero ? "text-6xl" : "text-4xl"}`}>
          {project.name}
        </h3>
        <p className="mt-2 text-sm leading-6 text-text-soft">{project.tagline}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.slice(0, hero ? 6 : 4).map((s) => (
            <span key={s} className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.1em] text-text-soft" style={{ fontFamily: "var(--font-display), monospace", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {s}
            </span>
          ))}
          {project.stack.length > (hero ? 6 : 4) && (
            <span className="px-1 py-1 text-[10px] text-text-muted">+{project.stack.length - (hero ? 6 : 4)}</span>
          )}
        </div>

        <div className={`mt-5 grid gap-3 ${hero ? "grid-cols-3" : "grid-cols-1"}`}>
          {metrics.map((m) => (
            <div key={m.label} className="rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xl font-semibold" style={{ fontFamily: "var(--font-display), monospace", color: accent }}>
                {m.value}
                {m.unit && <span className="ml-1 text-xs text-text-muted">{m.unit}</span>}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-text-muted">{hero ? m.label : m.detail}</p>
            </div>
          ))}
        </div>

        {hero && (
          <div className="mt-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted" style={{ fontFamily: "var(--font-display), monospace" }}>
              Design questions it answers
            </p>
            <ul className="mt-3 space-y-2.5">
              {project.decisions.map((d) => (
                <li key={d.question} className="text-sm leading-6 text-text-soft">
                  <span className="mr-2" style={{ color: accent }}>›</span>
                  {d.question}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          <button
            type="button"
            onClick={onOpen}
            className="hit relative rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-text-strong transition-colors hover:brightness-125"
            style={{ fontFamily: "var(--font-display), monospace", background: `${accent}26`, border: `1px solid ${accent}55` }}
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => explainProject(project.id)}
            className="hit relative flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-text-soft transition-colors hover:text-text-strong"
            style={{ fontFamily: "var(--font-display), monospace", border: "1px solid rgba(255,255,255,0.12)" }}
            aria-label={`Ask Wisp to explain ${project.name}`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              chat_bubble
            </span>
            Ask Wisp
          </button>
          {github ? (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="hit relative px-2 py-2 text-[10px] uppercase tracking-[0.15em] text-text-muted transition-colors hover:text-text-strong"
              style={{ fontFamily: "var(--font-display), monospace" }}
            >
              GitHub ↗
            </a>
          ) : (
            <span className="flex items-center gap-1 px-2 py-2 text-[10px] uppercase tracking-[0.15em] text-text-muted opacity-60" style={{ fontFamily: "var(--font-display), monospace" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>lock</span>
              Private
            </span>
          )}
          {project.id === "weave" && (
            <button
              type="button"
              onClick={(e) => meetWisp(e.currentTarget)}
              className="hit relative rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.15em] transition-colors hover:brightness-125"
              style={{ fontFamily: "var(--font-display), monospace", color: accent, border: `1px solid ${accent}55` }}
            >
              Meet Wisp
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Opening a project morphs its tile's picture and name into the detail panel (and back on close) with the
 * browser's View Transitions API. Falls back to an instant open where that is unsupported, in Lite mode, with
 * reduced motion, or when the tile is off screen (e.g. opened from an Achievements link).
 */
function morphParts(id: string) {
  const tile = document.getElementById(`project-${id}`);
  const media = tile?.querySelector<HTMLElement>('[data-vt="media"]');
  const title = tile?.querySelector<HTMLElement>('[data-vt="title"]');
  if (!tile || !media || !title) return null;
  // Only morph when most of the picture is on screen; otherwise it would fly in from off the edge.
  const r = media.getBoundingClientRect();
  const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
  if (visible < r.height * 0.5) return null;
  return { media, title };
}
const canMorph = () =>
  typeof document !== "undefined" &&
  "startViewTransition" in document &&
  !isLite() &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const name = (els: { media: HTMLElement; title: HTMLElement }, on: boolean) => {
  els.media.style.viewTransitionName = on ? "vt-project-media" : "";
  els.title.style.viewTransitionName = on ? "vt-project-title" : "";
};

export function Projects() {
  const [openId, setOpenIdRaw] = useState<string | null>(null);
  const openIdRef = useRef<string | null>(null);
  openIdRef.current = openId;

  const setOpenId = useCallback((id: string | null) => {
    const current = openIdRef.current;
    const parts = canMorph() ? morphParts(id ?? current ?? "") : null;
    if (!parts) {
      setOpenIdRaw(id);
      return;
    }
    if (id) {
      // Opening: the tile carries the names in the old snapshot, the panel carries them in the new one.
      name(parts, true);
      document.startViewTransition(() => {
        name(parts, false);
        flushSync(() => setOpenIdRaw(id));
      });
    } else {
      const vt = document.startViewTransition(() => {
        flushSync(() => setOpenIdRaw(null));
        name(parts, true);
      });
      vt.finished.finally(() => name(parts, false));
    }
  }, []);
  const close = useCallback(() => setOpenId(null), [setOpenId]);

  // Other sections (Achievements) can open a project's detail panel.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail?.id;
      if (id && projects.some((p) => p.id === id)) setOpenId(id);
    };
    window.addEventListener(PROJECT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(PROJECT_OPEN_EVENT, onOpen);
  }, [setOpenId]);
  const open = projects.find((p) => p.id === openId) ?? null;

  return (
    <section id="projects" className="relative z-10 pb-20">
      <ForgeIntro count={projects.length} />

      <div id="forge-grid" className="forge-grid scroll-mt-24 px-8 md:px-20">
      <div className="mx-auto grid max-w-[1400px] gap-6 md:grid-cols-2 lg:grid-cols-12">
        {projects.map((p) => (
          <Tile key={p.id} project={p} onOpen={() => setOpenId(p.id)} />
        ))}
      </div>
      </div>

      {open &&<ProjectDetail project={open} accent={ACCENT[open.id] ?? "#f4f4f4"} onClose={close} />}
    </section>
  );
}
