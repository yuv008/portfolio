"use client";

/* Small looping visuals for tiles. Pure CSS/SVG animation, so they cost almost nothing. */

export function VoiceBars() {
  const bars = Array.from({ length: 34 }, (_, i) => ({
    d: 0.8 + ((i * 37) % 9) / 10,
    delay: -((i * 53) % 17) / 10,
  }));
  return (
    <div className="tile-media flex h-[132px] items-center justify-center gap-[3px] px-5" aria-hidden="true">
      {bars.map((b, i) => (
        <span
          key={i}
          className="tile-anim block h-14 w-[3px] origin-center rounded-full"
          style={{
            background: "linear-gradient(to top, #e6e6e6, #acacac)",
            animation: `tile-bar ${b.d}s ease-in-out ${b.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

const POINTS: [number, number][] = [
  [30, 30], [58, 18], [86, 36], [118, 22], [150, 40], [178, 20], [38, 74], [72, 62], [132, 78], [170, 70],
  [22, 108], [64, 112], [104, 100], [146, 112], [186, 104],
];
const HITS = [7, 8, 3];

export function VectorSearch() {
  return (
    <div className="tile-media h-[132px]" aria-hidden="true">
      <svg viewBox="0 0 210 132" className="h-full w-full">
        {POINTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2.2} fill="#5e5e5e" />
        ))}
        <g>
          <circle cx="105" cy="66" r="9" fill="none" stroke="#e6e6e6" strokeWidth="1" className="tile-anim" style={{ transformOrigin: "105px 66px", animation: "tile-ping 2.4s ease-out infinite" }} />
          <circle cx="105" cy="66" r="4.5" fill="#e6e6e6" />
        </g>
        {HITS.map((idx, n) => {
          const [x, y] = POINTS[idx];
          return (
            <g key={idx} className="tile-anim" style={{ animation: `tile-hit 3.6s ease-in-out ${n * 0.5}s infinite` }}>
              <line x1="105" y1="66" x2={x} y2={y} stroke="#e6e6e6" strokeWidth="1" strokeOpacity="0.7" />
              <circle cx={x} cy={y} r="4" fill="#e6e6e6" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function LossCurve() {
  const d = "M12 22 C 40 24, 56 72, 84 92 S 140 112, 198 116";
  return (
    <div className="tile-media h-[132px]" aria-hidden="true">
      <svg viewBox="0 0 210 132" className="h-full w-full">
        {[34, 66, 98].map((y) => (
          <line key={y} x1="12" y1={y} x2="198" y2={y} stroke="#ffffff" strokeOpacity="0.06" />
        ))}
        <line x1="12" y1="122" x2="198" y2="122" stroke="#ffffff" strokeOpacity="0.14" />
        <path
          d={d}
          fill="none"
          stroke="url(#loss)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="520"
          className="tile-anim"
          style={{ animation: "tile-draw 4.2s ease-out infinite" }}
        />
        <defs>
          <linearGradient id="loss" x1="12" y1="0" x2="198" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#acacac" />
            <stop offset="1" stopColor="#e6e6e6" />
          </linearGradient>
        </defs>
        <circle
          r="4"
          fill="#e6e6e6"
          className="tile-anim"
          style={{ offsetPath: `path("${d}")`, animation: "tile-dot 4.2s ease-out infinite" }}
        />
      </svg>
    </div>
  );
}

/** Illustrative concurrency ramp: 200 call slots light up in waves, then reset. */
export function ConcurrencyRamp() {
  const cols = 20;
  const rows = 10;
  return (
    <div className="tile-media flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-4 p-5" aria-hidden="true">
      <div className="grid gap-[5px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, width: "100%", maxWidth: 420 }}>
        {Array.from({ length: cols * rows }, (_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const delay = (col * 0.11 + row * 0.04).toFixed(2);
          return (
            <span
              key={i}
              className="tile-anim aspect-square rounded-[3px]"
              style={{ background: "#e6e6e6", opacity: 0.12, animation: `slot-on 5.2s ease-in-out ${delay}s infinite` }}
            />
          );
        })}
      </div>
      <p className="font-display text-[10px] uppercase tracking-[0.18em] text-text-muted">Concurrency ramp · illustrative</p>
    </div>
  );
}
