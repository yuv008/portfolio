// Regenerates public/fonts/material-symbols-subset.woff2 with only the icons the site uses.
// Run after adding a new Material Symbols icon: node scripts/build-icon-font.mjs
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const walk = (d) =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|jsx?)$/.test(f) ? [p] : [];
  });

const names = new Set();
for (const f of ["app", "components", "lib"].flatMap(walk)) {
  const s = readFileSync(f, "utf8");
  for (const m of s.matchAll(/icon:\s*"([a-z0-9_]+)"/g)) names.add(m[1]);
  for (const m of s.matchAll(/material-symbols-outlined[^>]*>\s*([a-z0-9_]+)\s*</g)) names.add(m[1]);
  for (const m of s.matchAll(/material-symbols-outlined[^>]*>\s*\{([^}]*)\}/g))
    for (const n of m[1].matchAll(/"([a-z0-9_]+)"/g)) names.add(n[1]);
}
const list = [...names].sort().join(",");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const css = await (
  await fetch(
    `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL@24,400..500,0..1&icon_names=${list}&display=block`,
    { headers: { "User-Agent": UA } },
  )
).text();
const url = css.match(/url\(([^)]+)\)/)?.[1];
if (!url) throw new Error("No font URL in the Google Fonts response");
const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
mkdirSync("public/fonts", { recursive: true });
writeFileSync("public/fonts/material-symbols-subset.woff2", buf);
console.log(`${names.size} icons, ${(buf.length / 1024).toFixed(1)} KiB`);
