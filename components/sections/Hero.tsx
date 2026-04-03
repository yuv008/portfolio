"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { heroStats, sectionIds } from "@/lib/constants";

const PARTICLES = [
  { top: "18%", left: "62%", size: 2, delay: 0 },
  { top: "72%", left: "68%", size: 1.5, delay: 0.4 },
  { top: "42%", left: "82%", size: 2.5, delay: 0.8 },
  { top: "25%", left: "48%", size: 1, delay: 1.2 },
  { top: "60%", left: "38%", size: 2, delay: 0.6 },
  { top: "85%", left: "55%", size: 1.5, delay: 1.0 },
  { top: "10%", left: "72%", size: 1, delay: 0.2 },
];

export function Hero() {
  const orbRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 60, damping: 18 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      id={sectionIds.hero}
      className="relative z-10 mx-auto px-8 py-20 min-h-[calc(100vh-5rem)] flex flex-col md:flex-row items-center justify-between gap-16 overflow-hidden"
      style={{ maxWidth: "1400px" }}
    >
      {/* Background glows */}
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none blur-[120px]"
        style={{ background: "rgba(110,231,255,0.06)" }} />
      <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none blur-[120px]"
        style={{ background: "rgba(171,138,255,0.06)" }} />

      {/* ── Left: Text content ── */}
      <motion.div
        className="w-full md:w-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8"
          style={{
            background: "rgba(110,231,255,0.08)",
            border: "1px solid rgba(110,231,255,0.2)",
          }}
        >
          <span className="flex h-2 w-2 rounded-full animate-pulse" style={{ background: "#6ee7ff" }} />
          <span
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-display), monospace", color: "#6ee7ff" }}
          >
            Status: Systems_Optimal
          </span>
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
          Exploring the frontier of AI, Infrastructure, and Systems Engineering.
          Architecting the bridges between neural logic and computational scale.
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
            href={`#${sectionIds.contact}`}
            className="px-8 py-4 rounded-full tracking-widest backdrop-blur-sm transition-all active:scale-95"
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
        </div>

        {/* Terminal panel */}
        <div
          className="mt-16 rounded-xl p-6 max-w-md"
          style={{
            background: "rgba(14,20,26,0.7)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(110,231,255,0.12)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,112,120,0.5)" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,172,94,0.5)" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(97,255,171,0.5)" }} />
            </div>
            <span className="text-[10px] text-text-muted" style={{ fontFamily: "var(--font-display), monospace" }}>
              core_process.sh
            </span>
          </div>
          <div className="text-xs space-y-1.5" style={{ fontFamily: "var(--font-display), monospace" }}>
            <div style={{ color: "#6ee7ff99" }}>&gt; Loading environment neural_net_v4.2...</div>
            <div className="text-text-soft">&gt; Hyperparameter tuning initiated [SUCCESS]</div>
            <div style={{ color: "#ab8aff99" }}>&gt; 12.4M Parameters synced across 8 nodes</div>
            <div className="flex items-center gap-2 text-text-muted">
              <span>&gt; Architecture scan</span>
              <span className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <span className="block h-full" style={{ width: "72%", background: "#6ee7ff" }} />
              </span>
              <span>72%</span>
            </div>
          </div>

          {heroStats && heroStats.length > 0 && (
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {heroStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl p-4"
                  style={{ border: "1px solid rgba(110,231,255,0.1)", background: "rgba(14,20,26,0.6)" }}
                >
                  <p className="text-[0.6rem] uppercase tracking-[0.28em] text-text-muted"
                    style={{ fontFamily: "var(--font-display), monospace" }}>
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg text-text-strong" style={{ fontFamily: "var(--font-display), monospace" }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Right: Animated Orb ── */}
      <motion.div
        ref={orbRef}
        className="w-full md:w-1/2 flex justify-center items-center relative z-10 cursor-none"
        style={{ height: "600px", perspective: "1200px" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          {/* Pulsing ambient glow behind orb */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 340, height: 340 }}
            animate={{
              boxShadow: [
                "0 0 60px 20px rgba(110,231,255,0.08)",
                "0 0 100px 40px rgba(110,231,255,0.16)",
                "0 0 60px 20px rgba(110,231,255,0.08)",
              ],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Outer rotating dashed ring with orbital dot */}
          <motion.div
            className="absolute flex items-center justify-center"
            style={{ width: 450, height: 450 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full rounded-full" style={{ border: "1px dashed rgba(110,231,255,0.2)" }} />
            {/* Orbital dot on outer ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 8,
                height: 8,
                top: "50%",
                left: "100%",
                marginTop: -4,
                marginLeft: -4,
                background: "#6ee7ff",
                boxShadow: "0 0 12px 4px rgba(110,231,255,0.6)",
              }}
            />
          </motion.div>

          {/* Inner counter-rotating ring with orbital dot */}
          <motion.div
            className="absolute flex items-center justify-center"
            style={{ width: 350, height: 350 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full rounded-full" style={{ border: "1px solid rgba(171,138,255,0.18)" }} />
            {/* Orbital dot on inner ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 6,
                height: 6,
                top: 0,
                left: "50%",
                marginLeft: -3,
                marginTop: -3,
                background: "#ab8aff",
                boxShadow: "0 0 10px 3px rgba(171,138,255,0.6)",
              }}
            />
          </motion.div>

          {/* Innermost slow-rotating ring */}
          <motion.div
            className="absolute"
            style={{ width: 260, height: 260 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{ border: "1px solid rgba(110,231,255,0.07)", borderTopColor: "rgba(110,231,255,0.25)" }}
            />
          </motion.div>

          {/* Core orb */}
          <div
            className="relative z-20 rounded-full p-1 group"
            style={{
              width: 300,
              height: 300,
              background: "radial-gradient(circle at 35% 35%, rgba(110,231,255,0.12), rgba(14,20,26,0.95))",
              boxShadow: "0 0 0 1px rgba(110,231,255,0.15), 0 0 80px rgba(110,231,255,0.1), inset 0 0 40px rgba(110,231,255,0.05)",
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden relative">
              <img
                alt="Neural Core Architecture"
                className="w-full h-full object-cover opacity-85 mix-blend-screen scale-110 group-hover:scale-100 transition-transform duration-1000"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0L8mmq3R7aKmFCmIvdbi-PC_821kPTZrBmWOoS9bN0r-0JAirjvfQ8BkEaw0k_mPTe0PLkPQU3DLIJfW6zfoRgp_yxnBZuW1M1tky7V4Y0SxWQ6hAZiVvCqNWtP9QfAst0OtfxGcyhfHLzE9yFEV1WJCENBAR0S5GHXnoPEN7S7ueRsWVp0_OQcoPCwOUrq5nUzqE5XisEXKy5EQbKWDM4j19Qe_p43-DkgndoO_sHabX4lr0dgD86dsChvlwYSlLaJ3gvskqUZ0"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(circle at 30% 30%, rgba(110,231,255,0.18) 0%, transparent 60%)" }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(circle at 70% 75%, rgba(171,138,255,0.15) 0%, transparent 50%)" }}
              />
            </div>
          </div>

          {/* Floating particles */}
          {PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                top: p.top,
                left: p.left,
                width: p.size,
                height: p.size,
                background: i % 2 === 0 ? "#6ee7ff" : "#ab8aff",
                boxShadow: `0 0 ${p.size * 3}px ${i % 2 === 0 ? "rgba(110,231,255,0.8)" : "rgba(171,138,255,0.8)"}`,
              }}
              animate={{ y: [-6, 6, -6], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
            />
          ))}

          {/* LATENCY chip */}
          <motion.div
            className="absolute flex items-center gap-3 px-4 py-2 rounded-lg"
            style={{
              top: "18%",
              right: "8%",
              background: "rgba(8,12,18,0.82)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(110,231,255,0.25)",
              boxShadow: "0 4px 24px rgba(110,231,255,0.08)",
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="material-symbols-outlined text-sm" style={{ color: "#6ee7ff", fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
            <div style={{ fontFamily: "var(--font-display), monospace" }}>
              <div className="text-[10px] text-text-muted uppercase tracking-widest">LATENCY</div>
              <div className="font-bold text-sm" style={{ color: "#6ee7ff" }}>14ms</div>
            </div>
          </motion.div>

          {/* DATA_SET chip */}
          <motion.div
            className="absolute flex items-center gap-3 px-4 py-2 rounded-lg"
            style={{
              bottom: "18%",
              left: "8%",
              background: "rgba(8,12,18,0.82)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(171,138,255,0.25)",
              boxShadow: "0 4px 24px rgba(171,138,255,0.08)",
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <span className="material-symbols-outlined text-sm" style={{ color: "#ab8aff", fontVariationSettings: "'FILL' 1" }}>
              database
            </span>
            <div style={{ fontFamily: "var(--font-display), monospace" }}>
              <div className="text-[10px] text-text-muted uppercase tracking-widest">DATA_SET</div>
              <div className="font-bold text-sm" style={{ color: "#ab8aff" }}>TERA_B8</div>
            </div>
          </motion.div>

          {/* PARAMS chip */}
          <motion.div
            className="absolute flex items-center gap-3 px-4 py-2 rounded-lg"
            style={{
              bottom: "32%",
              right: "5%",
              background: "rgba(8,12,18,0.82)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(97,255,171,0.2)",
              boxShadow: "0 4px 24px rgba(97,255,171,0.06)",
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
          >
            <span className="material-symbols-outlined text-sm" style={{ color: "#61ffab", fontVariationSettings: "'FILL' 1" }}>
              memory
            </span>
            <div style={{ fontFamily: "var(--font-display), monospace" }}>
              <div className="text-[10px] text-text-muted uppercase tracking-widest">PARAMS</div>
              <div className="font-bold text-sm" style={{ color: "#61ffab" }}>12.4M</div>
            </div>
          </motion.div>

          {/* Corner bracket decorations */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 600">
            <path d="M40 80 L40 40 L80 40" stroke="rgba(110,231,255,0.25)" strokeWidth="1.5" fill="none" />
            <path d="M560 80 L560 40 L520 40" stroke="rgba(110,231,255,0.25)" strokeWidth="1.5" fill="none" />
            <path d="M40 520 L40 560 L80 560" stroke="rgba(171,138,255,0.25)" strokeWidth="1.5" fill="none" />
            <path d="M560 520 L560 560 L520 560" stroke="rgba(171,138,255,0.25)" strokeWidth="1.5" fill="none" />
            {/* Scan line */}
            <motion.line
              x1="40" y1="300" x2="560" y2="300"
              stroke="rgba(110,231,255,0.06)"
              strokeWidth="1"
            />
          </svg>

          {/* Animated scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(to right, transparent, rgba(110,231,255,0.3), transparent)" }}
            animate={{ top: ["15%", "85%", "15%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
