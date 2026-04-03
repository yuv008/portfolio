export function Footer() {
  return (
    <footer className="w-full py-12 mt-20 border-t border-slate-800/20 bg-[#0e141a]">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 gap-6 max-w-screen-2xl mx-auto">
        <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
          <span className="font-mono text-cyan-500 text-sm">© {new Date().getFullYear()} NEURAL ARCHITECT // ALL_SYSTEMS_GO</span>
          <span className="text-[10px] font-label text-slate-600 uppercase tracking-widest">Built with systems thinking</span>
        </div>
        <div className="flex gap-8 items-center">
          <a className="text-slate-600 hover:text-cyan-400 transition-colors font-label text-xs uppercase tracking-tighter" href="https://github.com/YuvrajSanghai/Portfolio" target="_blank" rel="noreferrer">Repository</a>
          <a className="text-white underline underline-offset-4 font-label text-xs uppercase tracking-tighter pr-4" href="#contact">Transmission</a>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)] animate-pulse"></div>
          <span className="font-label text-[10px] text-slate-500 uppercase tracking-widest">Network_Optimized</span>
        </div>
      </div>
    </footer>
  );
}
