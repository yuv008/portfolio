export function SideNavBar() {
  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 h-[716px] rounded-full w-20 bg-[#0e141a]/80 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,212,255,0.05)] border border-outline-variant/15 flex flex-col items-center justify-around py-8 z-40 hidden xl:flex">
      <div className="flex flex-col items-center gap-1 group w-full px-4 text-center cursor-default">
        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-primary/20">
            <img alt="Neural Core Status" className="w-6 h-6" src="/ContactHub_image.png" style={{ objectFit: 'contain' }} />
        </div>
        <span className="text-[8px] font-label text-primary uppercase tracking-tighter mt-2">Active</span>
      </div>
      <div className="flex flex-col gap-6">
        <button className="flex items-center justify-center text-slate-500 w-12 h-12 hover:scale-110 transition-transform duration-500 hover:text-primary">
          <span className="material-symbols-outlined">radar</span>
        </button>
        <button className="flex items-center justify-center text-slate-500 w-12 h-12 hover:scale-110 transition-transform duration-500 hover:text-primary">
          <span className="material-symbols-outlined">hub</span>
        </button>
        <button className="flex items-center justify-center text-slate-500 w-12 h-12 hover:scale-110 transition-transform duration-500 hover:text-primary">
          <span className="material-symbols-outlined">query_stats</span>
        </button>
        <button className="flex items-center justify-center bg-gradient-to-b from-cyan-400 to-cyan-600 text-white rounded-full w-12 h-12 shadow-[0_0_15px_#00d4ff] hover:scale-110 transition-transform duration-500">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <button className="text-slate-500 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <button className="text-slate-500 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">terminal</span>
        </button>
      </div>
    </aside>
  );
}
