const BARS = Array.from({ length: 36 }, (_, index) => {
  const envelope = 0.24 + 0.76 * Math.abs(Math.sin((index / 35) * Math.PI));
  const detail = 0.35 + 0.65 * Math.abs(Math.sin(index * 2.17) * Math.cos(index * 0.63));
  return Math.round(10 + envelope * detail * 72);
});

export function OrpheusWaveform() {
  return (
    <div
      role="img"
      aria-label="Stylized audio waveform"
      className="relative flex h-full w-full items-center justify-center gap-[3px] overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(110,231,255,0.12),transparent_65%)] px-6"
    >
      {BARS.map((height, index) => (
        <span
          key={index}
          className="w-1 max-w-[2.5%] rounded-full bg-gradient-to-t from-neural-violet/70 to-neural-cyan"
          style={{ height: `${height}%`, opacity: 0.55 + (height / 100) * 0.45 }}
        />
      ))}
    </div>
  );
}
