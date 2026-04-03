"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { projects } from "@/components/projects/projectData";

// One distinct aesthetic image per project (by project index)
const PROJECT_IMAGES: Record<string, string> = {
  "orpheus-tts":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBGH2997hdFF4MNkLoOVa73F1hrtN2wecl2WKdJZynfB8Ky6yL87-1wy8zzq6YAKIFqSuiWHIa2ov923KqQLfXuHiLASFeEoTgIjH1ay-1haw_abu9mLDW6IShx_kD2SYsOz7hWJeb4v3OaLRCOZ7Skr_oXxjLFzTHB5Pv6-080_DG9ozG8SL87AD0a2EdyeO-6modikW4H53IyV6mXqHvYzX1DpXupcETbsu9mHqzSic-yz4JL0gB4tEnU9kBthfqXyAMisAmOg2U",
  "smart-pathshala":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD6cHkQFDKXdm41W923U7HJO1p-P_aOP3WoDgC6lvTOxYkC0BkoKdBPsl0x_4S0o8y4Vl7AYXLsGYcFM_jd9s-MKWsDt-I5TyNnvgnzULl7Z6PxpIosP-UAfaLdGhwB22UFCau5jkJguhn1wtrWvA6DjLtm7JKP17wdxGGvUHNvOydYb1b_4zpAQmr7o33Z7z8yf_4CYH9SQrW1KZQOuuSfCRCpNco8-2dzTakAI1IEHYvpgcMD-7M9HrajdXDdVQCnr2Hw_ORjmyc",
  "shetniyojan":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAgj1I9KS9fMDmNrpC-Zo1lgph-avGgDCFHUtk7ipFUoVjofugvkMMaptXHUH9d2VAG2OTnbT9qYjaLPcZs_Bs-8reG00aRsBbIeq7obJ_rTbVutXslZU7Wh17JXenWMYlg0YCY5I077TaBTudnlJ5HdGU5ndPk6VbPa3XHGL32o8RDP1IjNS6D5QowQGJ9mOTBQcJVy66vHjmKxNwBOJfMwoUKQC76o7oNxNTTTVP1mPw6_gV6mSUJGJnnlcsZNW-5VI_xPFrcSC0",
  "legify":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDmquO-TmvSCNWbbe3E2ce4ZvzVkXzXPDXSxrgBOAc512e84U_4uGrk4iOi7sgll_Xm1aAcYVAygiuL0dBsZssU2NbzmG9iXOBN3kRNgFMLzd1cxpWYQnwmhc1kpQ5hseRWnHKwEqlYGIZo3vebhj9HsJedMzw09zEiUB5qboZqbbklWVnak8qeXa98BTSV9RfPrlDF_2SJncZG9wULo9Jpf07t5X40DocuWeo8EZNk2fVXzmNnY58mSuHysPTpA1gn4F2qFRDDG8A",
};

const ACCENT_COLORS = ["primary", "secondary", "primary-container", "tertiary"];

// Return a top-level link for the project (GitHub, model, etc.)
function getPrimaryLink(links?: Record<string, string>): string | null {
  if (!links) return null;
  return links.github ?? links.model ?? links.demo ?? Object.values(links)[0] ?? null;
}

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        const available = scrollWidth - clientWidth;
        if (available > 0) setScrollProgress((scrollLeft / available) * 100);
      }
    };
    const el = containerRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll, { passive: true });
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <section id="projects" className="relative z-10 pt-32 pb-20">
      {/* Header */}
      <header className="px-12 md:px-32 mb-16">
        <motion.div
          className="flex flex-col md:flex-row items-end gap-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter leading-none">
            THE{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">
              FORGE
            </span>
          </h1>
          <div className="max-w-xs ml-auto text-right">
            <p className="font-label text-[10px] text-primary uppercase tracking-[0.2em] mb-2">
              Manifest_v{projects.length}.0
            </p>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Incubating neural architectures and decentralized systems. A gallery
              of synthetic intelligence.
            </p>
          </div>
        </motion.div>
      </header>

      {/* Horizontal scroll strip */}
      <div
        ref={containerRef}
        className="overflow-x-auto cursor-grab active:cursor-grabbing px-12 md:px-32 flex gap-12 pb-12 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {projects.map((project, idx) => {
          const color = ACCENT_COLORS[idx % ACCENT_COLORS.length];
          const img =
            PROJECT_IMAGES[project.id] ??
            Object.values(PROJECT_IMAGES)[idx % Object.values(PROJECT_IMAGES).length];
          const primaryLink = getPrimaryLink(project.links);
          // Top metric to surface (first in array)
          const topMetric = project.metrics?.[0];

          return (
            <motion.div
              key={project.id}
              className={`
                min-w-[85vw] md:min-w-[62vw] snap-center
                rounded-[48px] border border-outline-variant/15
                overflow-hidden flex flex-col md:flex-row
                group transition-all duration-500 relative
              `}
              style={{
                background: "rgba(22, 28, 34, 0.7)",
                backdropFilter: "blur(40px)",
                // subtle colored box-shadow on hover is done via tailwind group-hover utility below
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              {/* ── Image panel ── */}
              <div className="w-full md:w-[45%] h-56 md:h-auto relative overflow-hidden flex-shrink-0">
                <img
                  alt={project.name}
                  src={img}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                />
                {/* gradient overlay so text on image remains readable */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#161c22]/80 pointer-events-none" />

                {/* Featured badge */}
                {project.featured && (
                  <span className="absolute top-4 left-4 text-[9px] font-label uppercase tracking-[0.2em] bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full backdrop-blur-sm">
                    Featured
                  </span>
                )}
              </div>

              {/* ── Content panel ── */}
              <div className="flex-1 p-10 flex flex-col justify-between min-h-[420px]">
                {/* Top meta row */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`font-label text-[10px] uppercase tracking-widest text-${color}`}
                  >
                    {project.stack[0]}
                  </span>
                  <span className="font-label text-[10px] text-slate-500">
                    0x0{idx + 1} // {project.period.slice(0, 4)}
                  </span>
                </div>

                {/* Title & tagline */}
                <div className="mb-6">
                  <h2
                    className={`text-3xl md:text-4xl font-headline font-bold mb-3 text-on-surface transition-colors group-hover:text-${color}`}
                  >
                    {project.name}
                  </h2>
                  <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-3">
                    {project.tagline}
                  </p>
                </div>

                {/* Stack tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-surface-container-highest/60 rounded-full text-[10px] font-label text-tertiary border border-outline-variant/10"
                    >
                      {tech.toUpperCase()}
                    </span>
                  ))}
                  {project.stack.length > 4 && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-label text-slate-600">
                      +{project.stack.length - 4} more
                    </span>
                  )}
                </div>

                {/* Key metric highlight */}
                {topMetric && (
                  <div
                    className={`mb-8 p-4 rounded-xl border border-${color}/15 bg-${color}/5 flex items-center gap-4`}
                  >
                    <span
                      className={`font-headline text-2xl font-bold text-${color}`}
                    >
                      {topMetric.value}
                      {topMetric.unit && (
                        <span className="text-sm ml-1">{topMetric.unit}</span>
                      )}
                    </span>
                    <span className="text-xs text-on-surface-variant font-label leading-tight">
                      {topMetric.detail}
                    </span>
                  </div>
                )}

                {/* CTA row */}
                <div className="flex items-center gap-4">
                  {primaryLink ? (
                    <a
                      href={primaryLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        flex items-center gap-3 group/btn
                        border border-outline-variant/30 rounded-full px-5 py-2.5
                        hover:bg-${color}/10 hover:border-${color}/40 transition-all duration-300
                      `}
                    >
                      <span
                        className={`material-symbols-outlined text-base text-on-surface-variant group-hover/btn:text-${color} transition-colors`}
                      >
                        open_in_new
                      </span>
                      <span
                        className={`font-label text-[10px] font-bold tracking-widest text-on-surface-variant group-hover/btn:text-${color} transition-colors`}
                      >
                        VIEW_PROJECT
                      </span>
                    </a>
                  ) : (
                    <div
                      className="flex items-center gap-3 group/btn border border-outline-variant/20 rounded-full px-5 py-2.5 cursor-default opacity-50"
                    >
                      <span className="material-symbols-outlined text-base text-on-surface-variant">
                        lock
                      </span>
                      <span className="font-label text-[10px] tracking-widest text-on-surface-variant">
                        PRIVATE_REPO
                      </span>
                    </div>
                  )}

                  {/* Extra links (e.g. LoRA adapter) */}
                  {project.links && Object.entries(project.links).length > 1 &&
                    Object.entries(project.links).slice(1, 2).map(([key, url]) => (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-label text-[10px] uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
                      >
                        {key} ↗
                      </a>
                    ))
                  }

                  <div className="ml-auto w-8 h-[1px] bg-outline-variant/20 hidden md:block" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Scroll progress bar */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <span className="font-label text-[10px] text-slate-500 uppercase">
          {projects.length} projects — scroll to explore
        </span>
        <div className="w-48 h-[2px] bg-surface-container-highest relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-primary/50 transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>
    </section>
  );
}
