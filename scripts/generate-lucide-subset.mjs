#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ICONS_DIR = path.resolve('node_modules/lucide-static/icons');
const OUT_FILE = path.resolve('public/lucide-subset.json');

function extractViewBox(svg) {
  const m = svg.match(/viewBox="([^"]+)"/);
  return m ? m[1] : '0 0 24 24';
}

function extractInner(svg) {
  const start = svg.indexOf('>');
  const end = svg.lastIndexOf('</svg>');
  let inner = start !== -1 && end !== -1 ? svg.slice(start + 1, end) : svg;
  // Remove fills to keep Lucide outline look
  inner = inner.replace(/\sfill="[^"]*"/g, '');
  return inner.trim();
}

function isSvgFile(file) {
  return file.toLowerCase().endsWith('.svg');
}

function buildSubset(limit = 480) {
  if (!fs.existsSync(ICONS_DIR)) {
    console.error('lucide-static not found. Run: npm i lucide-static');
    process.exit(1);
  }
  const files = fs.readdirSync(ICONS_DIR).filter(isSvgFile).slice(0, limit);
  const out = {};
  for (const file of files) {
    const name = path.basename(file, '.svg');
    const svg = fs.readFileSync(path.join(ICONS_DIR, file), 'utf8');
    const viewBox = extractViewBox(svg);
    const raw = extractInner(svg);
    out[name] = { viewBox, raw };
  }
  return out;
}

function main() {
  const subset = buildSubset();
  const dir = path.dirname(OUT_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(subset, null, 2));
  console.log(`Wrote ${Object.keys(subset).length} icons → ${OUT_FILE}`);
}

main(); 