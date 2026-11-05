/**
 * Soft blurred colour wash behind a tile's content, like the reference's blurred photo backdrops.
 * Give it an image (its colours become the wash) or two colours for a gradient wash.
 * The parent must be a `.tile` (it creates the stacking context and clips the wash).
 *
 * Images are not blurred live (a 64px CSS blur on a large image is very expensive to paint). Each one has a tiny
 * pre-blurred copy in /public/wash, made by scripts/build-washes.py; add new images to that script.
 */
const washFor = (src: string) => "/wash/" + src.replace(/^\//, "").replace(/\//g, "-").replace(/\.[a-z]+$/i, ".webp");

export function Wash({
  image,
  from = "#e6e6e6",
  to = "#acacac",
  dim = 0.5,
}: {
  image?: string;
  from?: string;
  to?: string;
  dim?: number;
}) {
  return (
    <div aria-hidden="true" className="wash pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={washFor(image)}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute -inset-1/4 h-[150%] w-[150%] max-w-none object-cover opacity-70"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(65% 75% at 10% 6%, ${from}66, transparent 70%), radial-gradient(60% 70% at 94% 96%, ${to}55, transparent 70%)`,
          }}
        />
      )}
      <div className="absolute inset-0" style={{ background: `rgba(14,19,27,${dim})` }} />
    </div>
  );
}
