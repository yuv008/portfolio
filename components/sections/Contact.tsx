"use client";

import { motion } from "framer-motion";

export function Contact() {
  return (
    <section id="contact" className="container mx-auto px-8 relative pt-20 pb-32">
      <header className="mb-16 md:ml-24">
        <p className="font-label text-primary text-sm tracking-[0.3em] uppercase mb-4">Channel: Transmission</p>
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter leading-none text-on-surface">
            Establish <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Connection</span>
        </h1>
        <p className="mt-6 text-on-surface-variant max-w-xl text-lg font-light leading-relaxed">
            Initiate a high-fidelity handshake. Send your parameters through the neural gateway or reach out via authenticated social nodes.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start md:ml-24">
        {/* CLI Terminal Form */}
        <motion.div 
            className="lg:col-span-7 bg-surface-container-low/60 backdrop-blur-2xl rounded-xl border border-outline-variant/15 overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
          <div className="bg-surface-container-highest px-6 py-3 flex items-center justify-between border-b border-outline-variant/15">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-error/40"></div>
              <div className="w-3 h-3 rounded-full bg-secondary/40"></div>
              <div className="w-3 h-3 rounded-full bg-primary/40"></div>
            </div>
            <span className="font-label text-[10px] text-slate-500 tracking-widest uppercase">system_session_3392</span>
          </div>

          <form className="p-8 font-label text-sm" onSubmit={(e) => e.preventDefault()}>
            <div className="mb-8 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-primary opacity-50">$</span>
                <span className="text-on-surface-variant">SET_SENDER_IDENTITY</span>
              </div>
              <div className="flex items-center gap-3 border-b border-outline-variant/30 focus-within:border-primary transition-colors pb-2">
                <span className="text-secondary">NAME:</span>
                <input className="bg-transparent border-none focus:ring-0 focus:outline-none text-primary w-full p-0 placeholder:text-slate-700" placeholder="John_Doe" type="text" />
              </div>
            </div>

            <div className="mb-8 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-primary opacity-50">$</span>
                <span className="text-on-surface-variant">SET_RETURN_PROTOCOL</span>
              </div>
              <div className="flex items-center gap-3 border-b border-outline-variant/30 focus-within:border-primary transition-colors pb-2">
                <span className="text-secondary">EMAIL:</span>
                <input className="bg-transparent border-none focus:ring-0 focus:outline-none text-primary w-full p-0 placeholder:text-slate-700" placeholder="user@neural.network" type="email" />
              </div>
            </div>

            <div className="mb-10 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-primary opacity-50">$</span>
                <span className="text-on-surface-variant">WRITE_PAYLOAD</span>
              </div>
              <div className="flex gap-3 min-h-[120px]">
                <span className="text-secondary mt-1">MSG:</span>
                <textarea className="bg-transparent border-none focus:ring-0 focus:outline-none text-primary w-full p-0 placeholder:text-slate-700 resize-none h-full" placeholder="Type your transmission here..."></textarea>
              </div>
              <div className="border-b border-primary/20 w-8 cursor-blink border-2"></div>
            </div>

            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-3 text-slate-500 text-[10px]">
                <span className="material-symbols-outlined text-xs">encrypted</span>
                <span>AES-256 ENCRYPTED</span>
              </div>
              <button className="group flex items-center gap-3 bg-primary/10 border border-primary/20 px-8 py-3 rounded-full text-primary hover:bg-primary hover:text-on-primary transition-all duration-300" type="submit">
                <span className="uppercase tracking-tighter font-bold">Transmit</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Social Nodes */}
        <motion.div 
            className="lg:col-span-5 space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="p-8 bg-surface-container-low/40 rounded-xl border border-outline-variant/15 glass-panel">
            <h3 className="font-label text-xs text-slate-500 uppercase tracking-[0.2em] mb-8">Social_Nodes</h3>
            <div className="grid grid-cols-1 gap-4">
              <a className="group flex items-center justify-between p-4 rounded-lg bg-surface-container-highest/30 hover:bg-primary/5 border border-transparent hover:border-primary/30 transition-all duration-300" href="https://linkedin.com/in/yuvrajsanghai" target="_blank" rel="noreferrer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest group-hover:shadow-[0_0_15px_rgba(168,232,255,0.3)] transition-all">
                    <span className="material-symbols-outlined text-primary">hub</span>
                  </div>
                  <span className="font-label text-sm tracking-tight group-hover:text-primary transition-colors">LinkedIn</span>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">arrow_outward</span>
              </a>

              <a className="group flex items-center justify-between p-4 rounded-lg bg-surface-container-highest/30 hover:bg-secondary/5 border border-transparent hover:border-secondary/30 transition-all duration-300" href="https://github.com/YuvrajSanghai" target="_blank" rel="noreferrer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest group-hover:shadow-[0_0_15px_rgba(220,184,255,0.3)] transition-all">
                    <span className="material-symbols-outlined text-secondary">code</span>
                  </div>
                  <span className="font-label text-sm tracking-tight group-hover:text-secondary transition-colors">GitHub</span>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:text-secondary transition-colors">arrow_outward</span>
              </a>

              <a className="group flex items-center justify-between p-4 rounded-lg bg-surface-container-highest/30 hover:bg-cyan-400/5 border border-transparent hover:border-cyan-400/30 transition-all duration-300" href="https://huggingface.co/yuv008" target="_blank" rel="noreferrer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-highest group-hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all">
                    <span className="material-symbols-outlined text-cyan-400">psychology</span>
                  </div>
                  <span className="font-label text-sm tracking-tight group-hover:text-cyan-400 transition-colors">Hugging Face</span>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:text-cyan-400 transition-colors">arrow_outward</span>
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-outline-variant/15 p-1">
            <div className="bg-surface-container-low p-6 rounded-lg relative z-10 glass-panel">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#3cd7ff] animate-pulse"></div>
                <span className="font-label text-[10px] text-primary uppercase tracking-[0.2em]">Neural_Status</span>
              </div>
              <p className="font-label text-xs text-on-surface-variant leading-loose">
                  LOC: 18.5204° N, 73.8567° E<br/>
                  TZ: UTC+05:30<br/>
                  AVAILABILITY: HIGH_PRIORITY
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
