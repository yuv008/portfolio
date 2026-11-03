/** Stylised globe marking Pune. CSS only, with a pulsing marker. */
export function ContactGlobe() {
  return (
    <div
      aria-label="Stylised globe marking Pune, India"
      role="img"
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(110,231,255,0.10), transparent 62%)" }}
    >
      <div
        className="absolute h-44 w-44 rounded-full border border-neural-cyan/60"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, rgba(143,240,255,0.55), rgba(110,231,255,0.16) 38%, rgba(171,138,255,0.14) 70%, rgba(8,12,18,0.4))",
          boxShadow: "0 0 60px -6px rgba(110,231,255,0.35), inset 0 0 34px rgba(110,231,255,0.18)",
        }}
      >
        <span className="absolute inset-y-0 left-1/4 w-1/2 rounded-full border-x border-neural-cyan/30" />
        <span className="absolute inset-y-0 left-[42%] w-[16%] rounded-full border-x border-neural-cyan/20" />
        <span className="absolute inset-x-0 top-1/4 h-1/2 rounded-[50%] border-y border-neural-cyan/30" />
        <span className="absolute inset-x-0 top-[42%] h-[16%] rounded-[50%] border-y border-neural-cyan/20" />
        <span className="absolute inset-x-0 top-1/2 h-px bg-neural-cyan/25" />
        <span className="absolute left-[61%] top-[41%] h-3 w-3 -translate-x-1/2 -translate-y-1/2">
          <span
            className="tile-anim absolute inset-0 rounded-full bg-neural-green"
            style={{ animation: "tile-ping 2.2s ease-out infinite" }}
          />
          <span className="absolute inset-0 rounded-full border-2 border-neural-green bg-neural-green shadow-[0_0_14px_rgba(97,255,171,0.9)]" />
        </span>
      </div>
      <span className="absolute left-[18%] top-[22%] h-1 w-1 rounded-full bg-neural-cyan/60" />
      <span className="absolute right-[20%] top-[32%] h-1 w-1 rounded-full bg-neural-violet/70" />
      <span className="absolute bottom-[20%] right-[26%] h-1 w-1 rounded-full bg-neural-cyan/50" />
      <span className="absolute bottom-[26%] left-[24%] h-1 w-1 rounded-full bg-neural-violet/50" />
    </div>
  );
}
