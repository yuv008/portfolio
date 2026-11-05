/**
 * The_Forge entrance: a pinned stage where twelve screenshots of the projects slide in by column, the grid opens
 * up, and the section title settles in the centre. Driven entirely by CSS scroll-driven animations (see
 * ".forge-intro" in globals.css), so it costs no JavaScript per frame. Phones, Lite mode, reduced motion and
 * browsers without scroll-driven animations get the plain header instead, and the images are never loaded there.
 */
const IMAGES = [
  { src: "weave-hero", alt: "Weave answering which provider was chosen for SSO" },
  { src: "warcast-home", alt: "WarCast home page" },
  { src: "legify-home", alt: "Legify landing page" },
  { src: "shetniyojan-home", alt: "ShetNiyojan home page" },
  { src: "orpheus-orb", alt: "The Orpheus TTS orb" },
  { src: "warcast-search", alt: "WarCast search results" },
  { src: "legify-dashboard", alt: "Legify document dashboard" },
  { src: "pathshala-architecture", alt: "Smart Pathshala architecture" },
  { src: "weave-architecture", alt: "Weave architecture" },
  { src: "warcast-code", alt: "WarCast scraper code" },
  { src: "shetniyojan-insights", alt: "ShetNiyojan cost suggestions" },
  { src: "warcast-dashboard", alt: "WarCast sentiment dashboard" },
];

const COLUMNS = [0, 1, 2].map((c) => IMAGES.filter((_, i) => i % 3 === c));

/** Reveal timing: the images start sliding in while the section is still scrolling up into view (so the stage is
 *  never empty when it pins) and are all in place by 38% of the pinned stage, each a little after the previous. */
function revealRange(column: number, row: number, rows: number) {
  // The outer columns drop in from above (their lowest image leads); the middle one rises from below (top leads).
  const order = column === 1 ? row : rows - 1 - row;
  return `entry ${35 + order * 15}% contain ${26 + order * 4}%`;
}

function Header({ count, centred = false }: { count: number; centred?: boolean }) {
  return (
    <>
      <div>
        <p
          className="mb-2 text-[10px] uppercase tracking-[0.2em] text-neural-cyan"
          style={{ fontFamily: "var(--font-display), monospace" }}
          data-nodecode={centred ? "" : undefined}
        >
          Manifest_v{count}.0
        </p>
        <h2 className="section-title">
          The_{" "}
          <span className="bg-gradient-to-r from-neural-cyan to-neural-violet bg-clip-text text-transparent">Forge</span>
        </h2>
      </div>
      <p className={`text-sm leading-relaxed text-text-soft ${centred ? "max-w-md" : "max-w-xs md:ml-auto md:text-right"}`}>
        Six projects, from voice models to company memory. Open any tile for its architecture and design decisions, or ask Wisp to explain it.
      </p>
    </>
  );
}

export function ForgeIntro({ count }: { count: number }) {
  return (
    <>
      {/* Plain header: phones, Lite mode, reduced motion, older browsers. */}
      <div className="forge-static mb-10 flex flex-col gap-4 px-8 pt-28 md:flex-row md:items-end md:px-20">
        <Header count={count} />
      </div>

      {/* Animated entrance. */}
      <div className="forge-intro">
        {/* Where the nav and the tour land: the moment the grid is open and the title has settled. */}
        <span id="projects-landing" className="forge-landing" aria-hidden="true" />
        <div className="forge-stage">
          <div className="forge-gallery" aria-hidden="true">
            {COLUMNS.map((col, c) => (
              <div key={c} className={`forge-col forge-col-${c}`}>
                {col.map((img, r) => (
                  <div
                    key={img.src}
                    className={`forge-item ${c === 1 ? (r < col.length / 2 ? "forge-up" : "forge-down") : ""}`}
                    style={{ animationRange: `${revealRange(c, r, col.length)}${c === 1 ? ", contain 58% contain 82%" : ""}` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/forge/${img.src}.webp`} alt="" loading="lazy" decoding="async" draggable={false} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="forge-content">
            <Header count={count} centred />
            <a href="#forge-grid" className="forge-cta hit relative">
              Explore the projects
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
