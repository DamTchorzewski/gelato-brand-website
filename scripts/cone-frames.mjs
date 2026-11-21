// Turns the Blender renders of blender-projects/gelato-brand-website into the site's files:
//   - the frame sequence (PNG with alpha) → public/cone/desktop/f_NN.webp (450 × 900) and public/cone/mobile/ (300 × 600)
//   - the large still → src/assets/hero/cone.png (trimmed to the cone, 1400 px tall), used by the hero and the static layout
// Usage: node scripts/cone-frames.mjs <frames folder> <cone-still.png>
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [framesDir, still] = process.argv.slice(2);
if (!framesDir || !still) {
  console.error("usage: node scripts/cone-frames.mjs <frames folder> <cone-still.png>");
  process.exit(1);
}

const sets = [
  { name: "desktop", width: 450, height: 900, quality: 74 },
  { name: "mobile", width: 300, height: 600, quality: 72 },
];
const frames = fs
  .readdirSync(framesDir)
  .filter((f) => f.endsWith(".png"))
  .sort();

for (const set of sets) {
  const out = path.join("public", "cone", set.name);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  let bytes = 0;
  for (const [i, file] of frames.entries()) {
    const target = path.join(out, `f_${String(i + 1).padStart(2, "0")}.webp`);
    await sharp(path.join(framesDir, file))
      .resize(set.width, set.height)
      .webp({ quality: set.quality, alphaQuality: 80, effort: 6 })
      .toFile(target);
    bytes += fs.statSync(target).size;
  }
  console.log(`${set.name}: ${frames.length} frames, ${(bytes / 1024).toFixed(0)} kB`);
}

await sharp(still)
  .trim({ threshold: 1 })
  .resize({ height: 1400 })
  .png({ compressionLevel: 9 })
  .toFile("src/assets/hero/cone.png");
console.log("hero still: src/assets/hero/cone.png");
