"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { heroStats, sectionIds } from "@/lib/constants";

export function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 120, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-25, 25]), springConfig);

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

      {/* ── Right: 3D Neural Core ── */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center items-center relative z-10"
        style={{ height: "600px", perspective: "1000px" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Mouse-tilt wrapper — rotates everything together */}
        <motion.div
          className="relative flex items-center justify-center"
          style={{ width: 300, height: 300, transformStyle: "preserve-3d", rotateX, rotateY }}
        >
          {/* Spinning shell — 3 orbital layers animate as one group */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateX: 360, rotateY: 360, rotateZ: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          >
            {/* Layer 1 — cyan */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                transform: "rotateX(45deg) rotateY(0deg)",
                border: "1px solid rgba(168,232,255,0.5)",
                background: "radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)",
                boxShadow: "0 0 40px rgba(60,215,255,0.1)",
              }}
            />
            {/* Layer 2 — purple */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                transform: "rotateX(-45deg) rotateY(45deg)",
                border: "1px solid rgba(220,184,255,0.4)",
                background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)",
              }}
            />
            {/* Layer 3 — blue */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                transform: "rotateX(0deg) rotateY(90deg)",
                border: "1px solid rgba(0,212,255,0.4)",
                background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)",
              }}
            />
          </motion.div>

          {/* Nucleus — stays centred, pulses independently */}
          <motion.div
            className="absolute rounded-full z-10"
            style={{
              width: 80,
              height: 80,
              background: "radial-gradient(circle, #a8e8ff 0%, #00d4ff 40%, transparent 80%)",
            }}
            animate={{
              scale: [0.9, 1.1, 0.9],
              boxShadow: [
                "0 0 60px #00d4ff, 0 0 100px #a8e8ff",
                "0 0 80px #00d4ff, 0 0 120px #a8e8ff",
                "0 0 60px #00d4ff, 0 0 100px #a8e8ff",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating readout — top left */}
          <motion.div
            className="absolute rounded-xl px-3 py-2"
            style={{
              top: -20,
              left: -40,
              background: "rgba(47,53,60,0.4)",
              border: "1px solid rgba(60,73,78,0.3)",
              backdropFilter: "blur(10px)",
              color: "#dde3ec",
              minWidth: 110,
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2 mb-1" style={{ color: "#a8e8ff" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>memory</span>
              <span className="text-[10px] uppercase tracking-wider" style={{ fontFamily: "var(--font-display), monospace" }}>Node Alpha</span>
            </div>
            <div className="text-xl font-bold" style={{ fontFamily: "var(--font-display), monospace" }}>99.98%</div>
            <div className="text-[10px] mt-1" style={{ fontFamily: "var(--font-display), monospace", color: "#bbc9cf" }}>EFFICIENCY</div>
          </motion.div>

          {/* Floating readout — bottom right */}
          <motion.div
            className="absolute rounded-xl px-3 py-2"
            style={{
              bottom: 20,
              right: -60,
              background: "rgba(47,53,60,0.4)",
              border: "1px solid rgba(60,73,78,0.3)",
              backdropFilter: "blur(10px)",
              color: "#dde3ec",
              minWidth: 110,
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="flex items-center gap-2 mb-1" style={{ color: "#dcb8ff" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>stream</span>
              <span className="text-[10px] uppercase tracking-wider" style={{ fontFamily: "var(--font-display), monospace" }}>Flux Rate</span>
            </div>
            <div className="text-xl font-bold" style={{ fontFamily: "var(--font-display), monospace" }}>1.4 TB/s</div>
            <div className="text-[10px] mt-1" style={{ fontFamily: "var(--font-display), monospace", color: "#bbc9cf" }}>STABLE</div>
          </motion.div>

          {/* Floating readout — bottom left (mini bar chart) */}
          <motion.div
            className="absolute rounded-xl px-3 py-2"
            style={{
              bottom: 40,
              left: -20,
              background: "rgba(47,53,60,0.4)",
              border: "1px solid rgba(168,232,255,0.2)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 0 20px rgba(168,232,255,0.1)",
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
          >
            <div className="flex items-end gap-1" style={{ width: 80, height: 40, opacity: 0.8 }}>
              {[20, 50, 90, 40, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${h}%`,
                    background: i === 4 ? "#a8e8ff" : `rgba(168,232,255,${0.3 + i * 0.15})`,
                    boxShadow: i === 4 ? "0 0 10px #a8e8ff" : "none",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
