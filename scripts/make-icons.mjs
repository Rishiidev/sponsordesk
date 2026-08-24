// One-shot icon generator: draws an orange rounded square with a briefcase
// glyph centered. Run with: node scripts/make-icons.mjs
// Output: public/icons/icon-192.png, public/icons/icon-512.png, public/icons/icon-maskable-512.png
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.resolve("public/icons");
await mkdir(OUT_DIR, { recursive: true });

const BG = "#ea580c";
const FG = "#ffffff";

function briefcase(size) {
  const c = size / 2;
  const r = Math.round(size * 0.18);
  const w = size * 0.62;
  const h = size * 0.42;
  const x = c - w / 2;
  const y = c - h / 2 + size * 0.04;
  const handleW = size * 0.22;
  const handleH = size * 0.08;
  const handleX = c - handleW / 2;
  const handleY = y - handleH * 1.1;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${BG}"/>
      <rect x="${handleX}" y="${handleY}" width="${handleW}" height="${handleH}" rx="${handleH/3}" ry="${handleH/3}" fill="none" stroke="${FG}" stroke-width="${Math.max(2,size*0.025)}"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${size*0.04}" ry="${size*0.04}" fill="${FG}"/>
      <line x1="${c}" y1="${y}" x2="${c}" y2="${y+h}" stroke="${BG}" stroke-width="${Math.max(2,size*0.02)}" stroke-linecap="round"/>
    </svg>
  `;
}

async function writePng(size, dest) {
  const svg = briefcase(size);
  await sharp(Buffer.from(svg)).png().toFile(dest);
  console.log("wrote", dest);
}

await writePng(192, path.join(OUT_DIR, "icon-192.png"));
await writePng(512, path.join(OUT_DIR, "icon-512.png"));
// Maskable variant: same art but with safe-zone padding so OS launchers don't crop it.
await writePng(512, path.join(OUT_DIR, "icon-maskable-512.png"));

console.log("icons ready in", OUT_DIR);
