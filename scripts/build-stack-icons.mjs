// Generates public/stack/<slug>.svg from the Simple Icons set (CC0), filled with each
// brand's colour. Brands too dark for the dark theme get a light fill instead.
// Run: node scripts/build-stack-icons.mjs
import * as si from "simple-icons";
import { mkdirSync, writeFileSync } from "node:fs";

const SLUGS = [
  "python", "pytorch", "go", "cplusplus", "typescript", "react", "nextdotjs", "svelte",
  "tailwindcss", "fastapi", "postgresql", "mongodb", "mysql", "docker", "kubernetes", "qdrant",
  "livekit", "langchain", "crewai", "pipecat", "opentelemetry", "jaeger", "lightning",
];

const lum = (hex) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

mkdirSync("public/stack", { recursive: true });
const manifest = {};
for (const slug of SLUGS) {
  const key = "si" + slug[0].toUpperCase() + slug.slice(1);
  const icon = si[key];
  if (!icon) {
    console.warn("missing", slug);
    continue;
  }
  const brand = icon.hex;
  const fill = lum(brand) < 0.22 ? "E9F0F5" : brand;
  const svg = icon.svg
    .replace(/<title>.*?<\/title>/, "")
    .replace("<svg ", `<svg fill="#${fill}" `);
  writeFileSync(`public/stack/${slug}.svg`, svg);
  manifest[slug] = { title: icon.title, brand: `#${fill}` };
}
writeFileSync("scripts/stack-icons.manifest.json", JSON.stringify(manifest, null, 2));
console.log(Object.keys(manifest).length, "icons written");
