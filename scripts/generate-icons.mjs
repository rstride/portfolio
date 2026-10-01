import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

// All exports use outlined SVG geometry; no installed font is required.
const source = await readFile(new URL('../public/icon-source.svg', import.meta.url));
const png = (size) => sharp(source).resize(size, size).png().toBuffer();

for (const [path, size] of [
  ['../app/icon.png', 512],
  ['../app/apple-icon.png', 180],
  ['../public/icon-192.png', 192],
  ['../public/icon-512.png', 512],
]) {
  await writeFile(new URL(path, import.meta.url), await png(size));
}

// An ICO directory with separate images gives browsers a native tab-size export.
const sizes = [16, 32, 48, 256];
const frames = await Promise.all(sizes.map(png));
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2); // Icon resource.
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;

for (const [index, size] of sizes.entries()) {
  const entry = 6 + index * 16;
  directory[entry] = size === 256 ? 0 : size;
  directory[entry + 1] = size === 256 ? 0 : size;
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(frames[index].length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += frames[index].length;
}

await writeFile(new URL('../app/favicon.ico', import.meta.url), Buffer.concat([directory, ...frames]));
console.log('Generated favicon, Apple touch icon, and app icons from public/icon-source.svg.');
