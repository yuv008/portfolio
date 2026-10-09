export function ContactGlobe() {
  return (
    <div aria-label="Stylized globe marking Pune" role="img" className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(110,231,255,0.08),transparent_68%)]">
      <div className="absolute h-36 w-36 rounded-full border border-neural-cyan/50 bg-[radial-gradient(circle_at_35%_30%,rgba(110,231,255,0.2),rgba(8,12,18,0.88)_68%)] shadow-[inset_0_0_24px_rgba(110,231,255,0.12)]">
        <span className="absolute inset-y-0 left-1/4 w-1/2 rounded-full border-x border-neural-cyan/25" />
        <span className="absolute inset-x-0 top-1/4 h-1/2 rounded-[50%] border-y border-neural-cyan/25" />
        <span className="absolute left-[61%] top-[41%] h-2.5 w-2.5 rounded-full border-2 border-neural-green bg-neural-green/30 shadow-[0_0_12px_rgba(97,255,171,0.6)]" />
      </div>
      <span className="absolute left-[20%] top-[24%] h-1 w-1 rounded-full bg-neural-cyan/60" />
      <span className="absolute right-[22%] top-[35%] h-1 w-1 rounded-full bg-neural-violet/70" />
      <span className="absolute bottom-[24%] right-[28%] h-1 w-1 rounded-full bg-neural-cyan/50" />
    </div>
  );
}
