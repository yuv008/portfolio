"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="container mx-auto px-8 pb-32">
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
        >
            {/* Large Feature */}
            <div className="md:col-span-2 glass-panel p-8 rounded-[32px] border border-outline-variant/15 flex flex-col justify-end min-h-[300px] group transition-all hover:bg-surface-container-low hover:border-primary/30">
                <div className="mb-auto flex justify-between items-start">
                    <span className="material-symbols-outlined text-4xl text-primary">memory</span>
                    <span className="text-[10px] font-label text-on-surface/30 tracking-widest">CORE_ENGINEERING</span>
                </div>
                <div>
                    <h3 className="font-headline text-3xl font-bold mb-2 text-on-surface">High-Performance ML</h3>
                    <p className="text-on-surface-variant font-body text-sm">Optimizing inference pipelines for sub-millisecond real-time applications. Bridging the gap between theory and production.</p>
                </div>
            </div>

            {/* Small Feature */}
            <div className="glass-panel p-8 rounded-[32px] border border-outline-variant/15 flex flex-col items-center justify-center text-center group transition-all hover:bg-surface-container-low hover:border-secondary/30">
                <span className="material-symbols-outlined text-4xl text-secondary mb-4">hub</span>
                <h4 className="font-headline text-xl font-bold text-on-surface">Distributed Systems</h4>
                <p className="text-on-surface-variant font-body text-xs mt-2 opacity-80">Building resilient architectures across multiple nodes.</p>
            </div>

            {/* Small Feature */}
            <div className="glass-panel p-8 rounded-[32px] border border-outline-variant/15 flex flex-col items-center justify-center text-center group transition-all hover:bg-surface-container-low hover:border-primary-container/30">
                <span className="material-symbols-outlined text-4xl text-primary-container mb-4">terminal</span>
                <h4 className="font-headline text-xl font-bold text-on-surface">ML Ops</h4>
                <p className="text-on-surface-variant font-body text-xs mt-2 opacity-80">Automating training pipelines and continuous integration.</p>
            </div>
        </motion.div>
    </section>
  );
}
