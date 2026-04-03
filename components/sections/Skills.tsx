"use client";

import { motion } from "framer-motion";

export function Skills() {
  return (
    <section id="skills" className="container mx-auto px-8 py-20 relative">
      <header className="mb-20">
          <div className="flex items-center gap-4 mb-2">
              <span className="font-label text-primary text-xs uppercase tracking-[0.2em]">System_Status: Operational</span>
              <div className="h-px flex-grow bg-outline-variant/15"></div>
          </div>
          <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tight mb-6">THE MATRIX</h1>
          <p className="font-label text-slate-500 text-sm max-w-xl">
              A visualization of cognitive synthesis and architectural evolution. Mapping the neural pathways of development from baseline to current iterations.
          </p>
      </header>

      <motion.div 
        className="bg-surface-container-low glass-panel rounded-[64px] p-12 relative overflow-hidden min-h-[500px] border border-white/5"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
          <div className="relative z-10 flex flex-col h-full">
              <div className="mb-8">
                  <h2 className="font-headline text-3xl font-bold mb-1 text-on-surface">Neural_Nodes</h2>
                  <span className="font-label text-[10px] text-primary uppercase tracking-widest">Technical Proficiency Spectrum</span>
              </div>
              
              <div className="flex-grow flex items-center justify-center">
                  <div className="relative w-full h-full max-w-md aspect-square">
                      <svg className="w-full h-full" viewBox="0 0 400 400">
                          <circle cx="200" cy="200" fill="none" r="150" stroke="rgba(168, 232, 255, 0.1)" strokeDasharray="4 4"></circle>
                          <circle cx="200" cy="200" fill="none" r="100" stroke="rgba(168, 232, 255, 0.1)" strokeDasharray="4 4"></circle>
                          <circle cx="200" cy="200" fill="none" r="50" stroke="rgba(168, 232, 255, 0.1)" strokeDasharray="4 4"></circle>
                          
                          <path d="M200 50 L350 200 L200 350 L50 200 Z" fill="rgba(60, 215, 255, 0.05)" stroke="#00d4ff" strokeLinejoin="round" strokeWidth="2"></path>
                          <path d="M200 80 L300 200 L200 320 L100 200 Z" fill="rgba(220, 184, 255, 0.1)" stroke="#dcb8ff" strokeDasharray="4" strokeWidth="1"></path>
                          
                          <g>
                              <circle className="shadow-[0_0_10px_#00d4ff]" cx="200" cy="50" fill="#00d4ff" r="6"></circle>
                              <text fill="white" fontFamily="JetBrains Mono" fontSize="12" x="210" y="45">Python</text>
                          </g>
                          <g>
                              <circle cx="350" cy="200" fill="#00d4ff" r="6"></circle>
                              <text fill="white" fontFamily="JetBrains Mono" fontSize="12" x="360" y="205">PyTorch</text>
                          </g>
                          <g>
                              <circle cx="200" cy="350" fill="#00d4ff" r="6"></circle>
                              <text fill="white" fontFamily="JetBrains Mono" fontSize="12" x="210" y="365">Llama 3</text>
                          </g>
                          <g>
                              <circle cx="50" cy="200" fill="#00d4ff" r="6"></circle>
                              <text fill="white" fontFamily="JetBrains Mono" fontSize="12" x="-40" y="205">Node.js</text>
                          </g>
                          <g>
                              <circle cx="300" cy="120" fill="#dcb8ff" r="4"></circle>
                              <text fill="#bbc9cf" fontFamily="JetBrains Mono" fontSize="10" x="310" y="115">CUDA</text>
                          </g>
                          <g>
                              <circle cx="100" cy="120" fill="#dcb8ff" r="4"></circle>
                              <text fill="#bbc9cf" fontFamily="JetBrains Mono" fontSize="10" x="50" y="115">FastAPI</text>
                          </g>
                      </svg>
                  </div>
              </div>
          </div>
          
          <div className="absolute inset-0 opacity-10 pointer-events-none">
              <img className="w-full h-full object-cover" alt="Background Texture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmquO-TmvSCNWbbe3E2ce4ZvzVkXzXPDXSxrgBOAc512e84U_4uGrk4iOi7sgll_Xm1aAcYVAygiuL0dBsZssU2NbzmG9iXOBN3kRNgFMLzd1cxpWYQnwmhc1kpQ5hseRWnHKwEqlYGIZo3vebhj9HsJedMzw09zEiUB5qboZqbbklWVnak8qeXa98BTSV9RfPrlDF_2SJncZG9wULo9Jpf07t5X40DocuWeo8EZNk2fVXzmNnY58mSuHysPTpA1gn4F2qFRDDG8A" />
          </div>
      </motion.div>
    </section>
  );
}
