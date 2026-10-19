import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const QUALITY_START = 82;
const QUALITY_FLOOR = 70;
const QUALITY_STEP = 2;

export const KB = 1024;

export function formatKb(bytes) {
  return `${(bytes / KB).toFixed(1)} KB`;
}

export async function readImage(file) {
  const data = fs.readFileSync(file);
  const { width, height, format } = await sharp(data).metadata();
  const mime = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
  return { width, height, dataUrl: `data:${mime};base64,${data.toString('base64')}` };
}

// Steps quality down until the file fits its NFR-001 budget; failing beats shipping a heavy or muddy image silently.
export async function encodeWebp(png, { width, height, maxBytes, name }) {
  let smallest = Infinity;
  for (let quality = QUALITY_START; quality >= QUALITY_FLOOR; quality -= QUALITY_STEP) {
    const data = await sharp(png)
      .resize(width, height, { fit: 'fill', kernel: 'lanczos3' })
      .webp({ quality, effort: 6, smartSubsample: true })
      .toBuffer();
    if (data.length <= maxBytes) return { name, data, quality };
    smallest = Math.min(smallest, data.length);
  }
  throw new Error(`${name} is ${formatKb(smallest)} at quality ${QUALITY_FLOOR}, over its ${formatKb(maxBytes)} budget`);
}

export async function writeImage(dir, name, data) {
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, name);
  fs.writeFileSync(file, data);
  const { width, height } = await sharp(data).metadata();
  return { file, bytes: data.length, width, height };
}
