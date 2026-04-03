import Link from "next/link";

export function TopNavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-xl shadow-[0_0_30px_rgba(60,215,255,0.08)]">
      <div className="flex justify-between items-center px-12 py-6 max-w-screen-2xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-headline">
          NEURAL_ARCHITECT_v1.0
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link className="text-slate-400 font-label text-xs uppercase tracking-widest hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_10px_#a8e8ff]" href="#about">Nodes</Link>
          <Link className="text-slate-400 font-label text-xs uppercase tracking-widest hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_10px_#a8e8ff]" href="#projects">Matrix</Link>
          <Link className="text-slate-400 font-label text-xs uppercase tracking-widest hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_10px_#a8e8ff]" href="#experience">History</Link>
          <Link className="text-cyan-400 border-b-2 border-cyan-400/50 pb-1 font-label text-xs uppercase tracking-widest hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_10px_#a8e8ff]" href="#contact">Terminal</Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-slate-400">
            <span className="material-symbols-outlined hover:text-primary transition-colors cursor-pointer">memory</span>
            <span className="material-symbols-outlined hover:text-primary transition-colors cursor-pointer">sensors</span>
          </div>
          <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2 rounded-full font-label text-sm font-bold hover:shadow-[0_0_15px_#3cd7ff] transition-all active:scale-95 opacity-80">
              Connect
          </button>
        </div>
      </div>
    </nav>
  );
}
