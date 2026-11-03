"use client";

import { useCallback, useEffect, useState } from "react";
import { projects, type Project } from "@/components/projects/projectData";
import { ProjectCover } from "@/components/projects/ProjectCover";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { ArchitectureDiagram } from "@/components/projects/ArchitectureDiagram";
import { PROJECT_OPEN_EVENT, explainProject, meetWisp } from "@/lib/wisp";

const ACCENT: Record<string, string> = {
  weave: "#b9a8ff",
  "orpheus-tts": "#a8e8ff",
  "smart-pathshala": "#dcb8ff",
  shetniyojan: "#7ee0a6",
  warcast: "#ffb36b",
  legify: "#9fc2ff",
};

/** Bento placement. The first tile is the tall hero of the grid. */
const LAYOUT: Record<string, { span: string; hero?: boolean }> = {
  weave: { span: "md:col-span-2 lg:col-span-7 lg:row-span-2", hero: true },
  "orpheus-tts": { span: "lg:col-span-5" },
  "smart-pathshala": { span: "lg:col-span-5" },
  shetniyojan: { span: "lg:col-span-4" },
  warcast: { span: "lg:col-span-4" },
  legify: { span: "md:col-span-2 lg:col-span-4" },
};

function Tile({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const accent = ACCENT[project.id] ?? "#a8e8ff";
  const layout = LAYOUT[project.id] ?? { span: "lg:col-span-4" };
  const hero = !!layout.hero;
  const github = project.links?.github;
  const metrics = project.metrics.slice(0, hero ? 3 : 1);

  return (
    <article
      id={`project-${project.id}`}
      className={`tile tile-hover group relative flex flex-col overflow-hidden ${layout.span}`}
    >
      <div className="shrink-0 p-2.5 pb-0">
        <div className="tile-media cursor-pointer p-2" style={{ height: hero ? 340 : 210 }} onClick={onOpen}>
          <div className="relative h-full w-full overflow-hidden rounded-[0.8rem]">
            <ProjectCover project={project} />
          </div>
          <span className="pointer-events-none absolute left-5 top-4 h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
          {project.featured && (
            <span
              className="pointer-events-none absolute right-4 top-4 rounded-full px-3 py-1 text-[9px] uppercase tracking-[0.18em]"
              style={{ fontFamily: "var(--font-display), monospace", color: accent, background: "rgba(8,12,18,0.7)", border: `1px solid ${accent}40` }}
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

        <h3 className={`mt-2 font-semibold text-text-strong ${hero ? "text-4xl" : "text-2xl"}`} style={{ fontFamily: "var(--font-display), monospace" }}>
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
            <ul className="mt-3 space-y-2">
              {project.decisions.slice(0, 4).map((d) => (
                <li key={d.question} className="text-sm leading-6 text-text-soft">
                  <span className="mr-2" style={{ color: accent }}>›</span>
                  {d.question}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hero && (
          <div className="mt-5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted" style={{ fontFamily: "var(--font-display), monospace" }}>
              How it fits together
            </p>
            <div className="mt-3 h-[170px] rounded-2xl p-3" style={{ background: "rgba(8,12,18,0.7)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <ArchitectureDiagram nodes={project.architecture.nodes} edges={project.architecture.edges} compact className="h-full w-full" />
            </div>
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          <button
            type="button"
            onClick={onOpen}
            className="rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-text-strong transition-colors hover:brightness-125"
            style={{ fontFamily: "var(--font-display), monospace", background: `${accent}26`, border: `1px solid ${accent}55` }}
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => explainProject(project.id)}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-text-soft transition-colors hover:text-text-strong"
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
              className="px-2 py-2 text-[10px] uppercase tracking-[0.15em] text-text-muted transition-colors hover:text-text-strong"
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
              className="rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.15em] transition-colors hover:brightness-125"
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

export function Projects() {
  const [openId, setOpenId] = useState<string | null>(null);
  const close = useCallback(() => setOpenId(null), []);

  // Other sections (Achievements) can open a project's detail panel.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail?.id;
      if (id && projects.some((p) => p.id === id)) setOpenId(id);
    };
    window.addEventListener(PROJECT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(PROJECT_OPEN_EVENT, onOpen);
  }, []);
  const open = projects.find((p) => p.id === openId) ?? null;

  return (
    <section id="projects" className="relative z-10 px-8 pb-20 pt-28 md:px-20">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-neural-cyan" style={{ fontFamily: "var(--font-display), monospace" }}>
            Manifest_v{projects.length}.0
          </p>
          <h2 className="text-7xl font-bold leading-none tracking-tighter md:text-8xl" style={{ fontFamily: "var(--font-display), monospace" }}>
            THE{" "}
            <span className="bg-gradient-to-br from-[#a8e8ff] to-[#dcb8ff] bg-clip-text text-transparent">FORGE</span>
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-text-soft md:ml-auto md:text-right">
          Six projects, from voice models to company memory. Open any tile for its architecture and design decisions, or ask Wisp to explain it.
        </p>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-5 md:grid-cols-2 lg:grid-cols-12">
        {projects.map((p) => (
          <Tile key={p.id} project={p} onOpen={() => setOpenId(p.id)} />
        ))}
      </div>

      {open && <ProjectDetail project={open} accent={ACCENT[open.id] ?? "#a8e8ff"} onClose={close} />}
    </section>
  );
}
