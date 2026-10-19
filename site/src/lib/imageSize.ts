import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type Size = { width: number; height: number };

// Reads the pixel size of a raster image in /public (PNG, JPEG, GIF, WebP) at build time.
// Returns null for remote URLs or unknown formats.
export function imageSize(src: string): Size | null {
  if (!src.startsWith('/')) return null;
  if (src.endsWith('.svg')) return svgRasterSize(src);
  let b: Buffer;
  try {
    b = readFileSync(join(process.cwd(), 'public', src));
  } catch {
    return null;
  }
  return bufferSize(b);
}

function bufferSize(b: Buffer): Size | null {
  // PNG
  if (b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  // GIF
  if (b.toString('ascii', 0, 3) === 'GIF') return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
  // WebP
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  }
  // JPEG: walk segments to the first SOF marker
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
  }
  return null;
}

// Many legacy SVGs are a screenshot wrapped in SVG (exported from Figma, Sketch or Google
// Slides). Their real resolution is the embedded raster's pixels per SVG unit, so work that
// out for each large embedded image and report the SVG's effective pixel width.
function svgRasterSize(src: string): Size | null {
  let svg: string;
  try {
    svg = readFileSync(join(process.cwd(), 'public', src), 'utf8');
  } catch {
    return null;
  }
  const vb = svg.match(/viewBox="[\d.-]+[\s,]+[\d.-]+[\s,]+([\d.]+)[\s,]+([\d.]+)"/);
  if (!vb) return null;
  const vw = Number(vb[1]);
  const vh = Number(vb[2]);
  // Use the sharpest of the large embedded images: low-res ones are usually soft backgrounds.
  let best = 0;
  for (const m of svg.matchAll(/<image\b([^>]*?)href="data:image\/[a-z]+;base64,([^"]+)"/g)) {
    const attrs = m[1];
    const px = bufferSize(Buffer.from(m[2].slice(0, 4096), 'base64'))?.width;
    const attrW = Number(attrs.match(/\swidth="([\d.]+)"/)?.[1]);
    if (!px || !attrW) continue;
    let rendered = attrW;
    const id = attrs.match(/\sid="([^"]+)"/)?.[1];
    if (id) {
      // Figma: <rect width=W fill="url(#pattern)"> → <pattern> → <use href="#image" transform="scale(a)">
      const use = svg.match(new RegExp(`<pattern id="([^"]+)"[^>]*>\\s*<use[^>]*href="#${id}"[^>]*transform="(?:scale|matrix)\\(([\\d.e-]+)`));
      const shape = use && svg.match(new RegExp(`<(rect|path)\\b[^>]*fill="url\\(#${use[1]}\\)"[^>]*>`))?.[0];
      const shapeW = shape && (shape.startsWith('<rect') ? Number(shape.match(/\swidth="([\d.]+)"/)?.[1]) : pathWidth(shape));
      if (use && shapeW) rendered = attrW * Number(use[2]) * shapeW;
    } else {
      // Google Slides: <g transform="matrix(a 0 0 d e f)"> wraps the <image>
      // (a <clipPath> may sit between the group and the image)
      const before = svg.slice(Math.max(0, m.index! - 800), m.index);
      const at = before.lastIndexOf('<g transform="matrix(');
      const matrix = at > -1 && !before.slice(at).includes('</g>') && before.slice(at).match(/matrix\(([\d.e-]+)/);
      if (matrix) rendered = attrW * Number(matrix[1]);
    }
    if (rendered >= vw * 0.25) best = Math.max(best, px / rendered);
  }
  if (!best) return null;
  const width = Math.round(vw * best);
  return { width, height: Math.round((width * vh) / vw) };
}

// Rough bounding-box width of a simple absolute path (M/L/H/C commands), e.g. "M31 0H620V331H31Z".
function pathWidth(tag: string): number {
  const d = tag.match(/\sd="([^"]+)"/)?.[1] ?? '';
  const xs: number[] = [];
  for (const [, cmd, args] of d.matchAll(/([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/g)) {
    const n = (args.match(/-?[\d.]+(?:e-?\d+)?/g) ?? []).map(Number);
    if (cmd === 'H') xs.push(...n);
    else if (cmd !== 'V' && cmd !== 'Z' && cmd !== 'A') n.forEach((v, i) => i % 2 === 0 && xs.push(v));
  }
  return xs.length ? Math.max(...xs) - Math.min(...xs) : 0;
}

// Attributes for an <img>: intrinsic size (prevents layout shift) and a max display
// width of half the pixel width, so raster images stay sharp on 2× screens.
export function sharpImg(src: string) {
  const size = imageSize(src);
  if (!size) return {};
  // Small sources would get tiny at half size, so never shrink below 1× (up to 280px).
  const cap = Math.round(Math.max(size.width / 2, Math.min(size.width, 280)));
  return { width: size.width, height: size.height, style: `max-width: min(100%, ${cap}px)` };
}
