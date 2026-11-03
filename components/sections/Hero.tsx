"use client";

import { heroStats, sectionIds } from "@/lib/constants";
import { meetWisp } from "@/lib/wisp";

export function Hero() {
  return (
    <section
      id={sectionIds.hero}
      className="relative z-10 mx-auto px-8 py-20 min-h-[calc(100vh-5rem)] flex flex-col md:flex-row items-center justify-between gap-16 overflow-hidden"
      style={{ maxWidth: "1400px", contain: "layout" }}
    >
      {/* Background glows — use box-shadow instead of blur() to avoid costly raster */}
      <div className="absolute top-1/4 -right-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ boxShadow: "0 0 200px 100px rgba(110,231,255,0.07)" }} />
      <div className="absolute bottom-1/4 -left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ boxShadow: "0 0 200px 100px rgba(171,138,255,0.07)" }} />

      {/* ── Left: Text content ── */}
      <div className="relative w-full md:w-1/2 z-10">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
          style={{
            background: "rgba(110,231,255,0.08)",
            border: "1px solid rgba(110,231,255,0.2)",
          }}
        >
          <span className="flex h-2 w-2 rounded-full" style={{ background: "#6ee7ff" }} />
          <span
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-display), monospace", color: "#6ee7ff" }}
          >
            AI R&D Engineer
          </span>
        </div>
        <a
          href="#stress-test"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full transition-colors hover:brightness-125"
          style={{ background: "rgba(171,138,255,0.08)", border: "1px solid rgba(171,138,255,0.25)" }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-display), monospace", color: "#ab8aff" }}
          >
            Now building · VEE Legion ↗
          </span>
        </a>
        </div>

        <h1
          className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter mb-6"
          style={{ fontFamily: "var(--font-display), monospace", color: "rgb(var(--neural-text))" }}
        >
          I build systems{" "}
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(to right, #6ee7ff, #ab8aff)" }}
          >
            that think.
          </span>
        </h1>

        <p className="text-xl text-text-soft max-w-lg mb-12 leading-relaxed">
          I build production voice-agent systems and evaluation platforms like VEE Legion, plus the AI infrastructure behind them, from real-time pipelines to fine-tuned models.
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href={`#${sectionIds.projects}`}
            className="group relative px-8 py-4 rounded-full font-bold tracking-widest overflow-hidden transition-all active:scale-95"
            style={{
              fontFamily: "var(--font-display), monospace",
              background: "linear-gradient(to right, #6ee7ff, #a8e8ff)",
              color: "#001f27",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 30px rgba(110,231,255,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            <span className="relative z-10">Initiate_Sequence</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
          </a>
          <a
            href="#stress-test"
            className="px-8 py-4 rounded-full tracking-widest transition-all active:scale-95"
            style={{
              fontFamily: "var(--font-display), monospace",
              border: "1px solid rgba(110,231,200,0.4)",
              color: "#6ee7c8",
              background: "rgba(110,231,200,0.08)",
            }}
          >
            See_Legion
          </a>
          <a
            href={`#${sectionIds.contact}`}
            className="px-8 py-4 rounded-full tracking-widest transition-all active:scale-95"
            style={{
              fontFamily: "var(--font-display), monospace",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgb(var(--neural-text))",
              background: "rgba(14,20,26,0.5)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(171,138,255,0.5)";
              (e.currentTarget as HTMLAnchorElement).style.color = "#ab8aff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)";
              (e.currentTarget as HTMLAnchorElement).style.color = "rgb(var(--neural-text))";
            }}
          >
            Open_Channel
          </a>
          <button
            type="button"
            onClick={(e) => meetWisp(e.currentTarget)}
            className="px-8 py-4 rounded-full tracking-widest transition-all active:scale-95"
            style={{
              fontFamily: "var(--font-display), monospace",
              border: "1px solid rgba(171,138,255,0.35)",
              color: "#ab8aff",
              background: "rgba(171,138,255,0.08)",
            }}
          >
            Meet_Wisp
          </button>
        </div>

        {/* Stats grid — pulled out as standalone cards below CTAs */}
        {heroStats && heroStats.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
            {heroStats.map((item) => {
              const statColors: Record<string, string> = {
                cyan: "#6ee7ff",
                violet: "#ab8aff",
                amber: "#ffac5e",
              };
              const col = statColors[item.tone] ?? "#6ee7ff";
              return (
                <div
                  key={item.label}
                  className="relative rounded-2xl p-3"
                  style={{
                    border: "1px solid rgba(110,231,255,0.1)",
                    background: "rgba(14,20,26,0.6)",
                  }}
                >
                  {item.label === "Concurrent calls" && (
                    <a
                      href="#stress-test"
                      className="absolute inset-0 rounded-2xl"
                      aria-label="See how VEE Legion was tested at 200 concurrent calls"
                    />
                  )}
                  <p
                    className="text-[0.6rem] uppercase tracking-[0.28em]"
                    style={{ fontFamily: "var(--font-display), monospace", color: "rgb(126,142,156)" }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="mt-2 text-xl font-bold"
                    style={{ fontFamily: "var(--font-display), monospace", color: col }}
                  >
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
