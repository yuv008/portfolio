"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section id="hero" className="container mx-auto px-8 py-20 min-h-[calc(100vh-5rem)] flex flex-col md:flex-row items-center justify-between gap-16 relative">
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary-container/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-secondary-container/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Text Content */}
      <motion.div 
        className="w-full md:w-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/20 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-primary-container animate-pulse"></span>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary">Status: Systems_Optimal</span>
        </div>
        
        <h1 className="font-headline text-6xl md:text-8xl font-bold text-on-surface leading-[0.9] tracking-tighter mb-6">
            I build systems <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">that think.</span>
        </h1>
        
        <p className="font-body text-xl text-on-surface-variant max-w-lg mb-12 leading-relaxed">
            Exploring the frontier of AI, Infrastructure, and Systems Engineering. Architecting the bridges between neural logic and computational scale.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <button className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label font-bold tracking-widest overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(60,215,255,0.4)] active:scale-95">
            <span className="relative z-10">Initiate_Sequence</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          </button>
          <button className="px-8 py-4 rounded-full border border-outline-variant/30 hover:border-primary/50 text-on-surface font-label font-medium tracking-widest bg-surface/50 backdrop-blur-sm transition-all active:scale-95">
              View_Logs
          </button>
        </div>

        {/* Terminal Overlay Micro-UI */}
        <div className="mt-16 glass-panel rounded-xl border border-outline-variant/20 p-6 max-w-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
            </div>
            <span className="font-label text-[10px] text-on-surface-variant/50">core_process.sh</span>
          </div>
          <div className="font-label text-xs space-y-1.5">
            <div className="text-primary/80">&gt; Loading environment neural_net_v4.2...</div>
            <div className="text-on-surface/60">&gt; Hyperparameter tuning initiated [SUCCESS]</div>
            <div className="text-secondary/80">&gt; 12.4M Parameters synced across 8 nodes</div>
            <div className="flex items-center gap-2 text-on-surface/40">
              <span>&gt; Architecture scan</span>
              <span className="h-1 flex-1 bg-surface-container-highest rounded-full overflow-hidden">
                <span className="block h-full w-[72%] bg-primary"></span>
              </span>
              <span>72%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Central 3D Architecture Visual */}
      <motion.div 
        className="w-full md:w-1/2 flex justify-center items-center relative h-[600px] z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Rotating Rings */}
            <div className="absolute inset-0 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                <div className="w-[450px] h-[450px] rounded-full border-[1px] border-dashed border-primary/20"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]">
                <div className="w-[350px] h-[350px] rounded-full border-[1px] border-secondary/10"></div>
            </div>

            {/* The "Core" Orb */}
            <div className="relative z-20 w-80 h-80 rounded-full bg-gradient-to-br from-surface-container-highest to-surface-container-low p-1 shadow-[0_0_100px_rgba(60,215,255,0.15)] group">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                    <img alt="Neural Core Architecture" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 opacity-80 mix-blend-screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0L8mmq3R7aKmFCmIvdbi-PC_821kPTZrBmWOoS9bN0r-0JAirjvfQ8BkEaw0k_mPTe0PLkPQU3DLIJfW6zfoRgp_yxnBZuW1M1tky7V4Y0SxWQ6hAZiVvCqNWtP9QfAst0OtfxGcyhfHLzE9yFEV1WJCENBAR0S5GHXnoPEN7S7ueRsWVp0_OQcoPCwOUrq5nUzqE5XisEXKy5EQbKWDM4j19Qe_p43-DkgndoO_sHabX4lr0dgD86dsChvlwYSlLaJ3gvskqUZ0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-secondary/20 pointer-events-none"></div>
                </div>
            </div>

            {/* Floating Data Chips */}
            <div className="absolute top-20 right-10 glass-panel border border-primary/20 px-4 py-2 rounded-lg flex items-center gap-3 animate-bounce-subtle">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                <div className="font-label text-[10px]">
                    <div className="text-on-surface/40">LATENCY</div>
                    <div className="text-primary font-bold">14ms</div>
                </div>
            </div>
            
            <div className="absolute bottom-20 left-10 glass-panel border border-secondary/20 px-4 py-2 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>database</span>
                <div className="font-label text-[10px]">
                    <div className="text-on-surface/40">DATA_SET</div>
                    <div className="text-secondary font-bold">TERA_B8</div>
                </div>
            </div>

            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100">
                <line className="text-primary" stroke="currentColor" strokeWidth="0.1" x1="20" x2="40" y1="20" y2="40"></line>
                <line className="text-secondary" stroke="currentColor" strokeWidth="0.1" x1="80" x2="60" y1="80" y2="60"></line>
                <circle className="text-primary" cx="20" cy="20" fill="currentColor" r="1"></circle>
                <circle className="text-secondary" cx="80" cy="80" fill="currentColor" r="1"></circle>
            </svg>
        </div>
      </motion.div>
    </section>
  );
}
