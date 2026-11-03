"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArchitectureDiagram, NODE_TYPE_COLORS } from "./ArchitectureDiagram";
import { ProjectCover } from "./ProjectCover";
import type { Project } from "./projectData";

const TABS = ["Overview", "Architecture", "Decisions"] as const;
type Tab = (typeof TABS)[number];

export function ProjectDetail({ project, accent, onClose }: { project: Project; accent: string; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [open, setOpen] = useState<number | null>(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const usedTypes = Array.from(new Set(project.architecture.nodes.map((n) => n.type)));

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-3 md:p-8"
      style={{ background: "rgba(4,7,11,0.78)", backdropFilter: "blur(6px)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${project.name} details`}
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem]"
        style={{
          background: "rgba(16,22,30,0.98)",
          border: `1px solid ${accent}40`,
          boxShadow: `0 0 60px ${accent}18, 0 24px 60px rgba(0,0,0,0.5)`,
        }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full text-text-soft hover:text-text-strong"
          style={{ background: "rgba(8,12,18,0.7)", border: "1px solid rgba(255,255,255,0.14)" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            close
          </span>
        </button>

        <div className="overflow-y-auto">
          <div className="relative h-[200px] w-full md:h-[260px]">
            <ProjectCover project={project} />
            <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(16,22,30,0.98))" }} />
          </div>

          <div className="px-6 pb-8 md:px-10">
            <p className="font-display text-[10px] uppercase tracking-[0.2em]" style={{ color: accent }}>
              {project.period}
            </p>
            <h3 className="mt-1 font-display text-3xl font-semibold text-text-strong">{project.name}</h3>
            <p className="mt-2 max-w-2xl text-base text-text-soft">{project.tagline}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span key={s} className="rounded-full px-3 py-1 font-display text-[10px] uppercase tracking-[0.12em] text-text-soft" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {s}
                </span>
              ))}
            </div>

            {project.links && (
              <div className="mt-5 flex flex-wrap gap-3">
                {Object.entries(project.links).map(([k, url]) => (
                  <a
                    key={k}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full px-4 py-1.5 font-display text-[10px] uppercase tracking-[0.15em] text-text-strong"
                    style={{ border: `1px solid ${accent}55`, background: `${accent}12` }}
                  >
                    {k} ↗
                  </a>
                ))}
              </div>
            )}

            <div className="mt-7 flex gap-1 overflow-x-auto border-b border-surface-border/20 md:gap-2" role="tablist" aria-label="Project details">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={t === tab}
                  onClick={() => setTab(t)}
                  className="-mb-px whitespace-nowrap px-3 py-2 font-display text-[11px] uppercase tracking-[0.15em] transition-colors md:px-4"
                  style={{
                    color: t === tab ? "rgb(var(--neural-text))" : "rgb(var(--neural-text-muted))",
                    borderBottom: `2px solid ${t === tab ? accent : "transparent"}`,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-6" role="tabpanel">
              {tab === "Overview" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {project.metrics.map((m) => (
                      <div key={m.label} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <p className="font-display text-2xl font-semibold" style={{ color: accent }}>
                          {m.value}
                          {m.unit && <span className="ml-1 text-sm text-text-muted">{m.unit}</span>}
                        </p>
                        <p className="mt-1 font-display text-[10px] uppercase tracking-[0.14em] text-text-strong">{m.label}</p>
                        <p className="mt-1 text-xs leading-5 text-text-muted">{m.detail}</p>
                      </div>
                    ))}
                  </div>

                  {project.journey && (
                    <ol className="space-y-4 border-l border-surface-border/25 pl-5">
                      {project.journey.map((j) => (
                        <li key={j.phase} className="relative">
                          <span className="absolute -left-[1.62rem] top-1.5 h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
                          <h4 className="font-display text-sm font-semibold text-text-strong">{j.phase}</h4>
                          <p className="mt-1 text-sm leading-6 text-text-soft">{j.content}</p>
                        </li>
                      ))}
                    </ol>
                  )}

                  <div>
                    <h4 className="font-display text-[11px] uppercase tracking-[0.18em] text-text-muted">Looking back</h4>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-text-soft">{project.reflection}</p>
                  </div>
                </div>
              )}

              {tab === "Architecture" && (
                <div>
                  <div className="rounded-2xl p-4" style={{ background: "rgba(8,12,18,0.7)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <ArchitectureDiagram nodes={project.architecture.nodes} edges={project.architecture.edges} className="h-auto max-h-[420px] w-full" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {usedTypes.map((t) => (
                      <span key={t} className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-text-muted" style={{ fontFamily: "var(--font-display), monospace" }}>
                        <span className="h-2 w-2 rounded-full" style={{ background: NODE_TYPE_COLORS[t] }} />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tab === "Decisions" && (
                <ul className="space-y-3">
                  {project.decisions.map((d, i) => {
                    const isOpen = open === i;
                    return (
                      <li key={d.question} className="rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${isOpen ? accent + "40" : "rgba(255,255,255,0.06)"}` }}>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpen(isOpen ? null : i)}
                          className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                        >
                          <span className="text-sm font-medium text-text-strong">{d.question}</span>
                          <span className="material-symbols-outlined shrink-0 text-text-muted" style={{ fontSize: 20 }}>
                            {isOpen ? "remove" : "add"}
                          </span>
                        </button>
                        {isOpen && <p className="px-5 pb-5 text-sm leading-7 text-text-soft">{d.answer}</p>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
