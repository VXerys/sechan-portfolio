import fs from 'node:fs';
import path from 'node:path';

import { kitDir } from './project.mjs';

const templatesDir = path.join(kitDir, 'templates');
const STYLESHEET_LINK = '<link rel="stylesheet" href="listing.css" />';

export const SAMPLE_DATA_TAG = 'Sample data · client records replaced';

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

// Templates keep a plain stylesheet link so they open in a browser while being designed; setContent has no base URL, so the CSS is inlined here.
export function loadTemplate(name) {
  const html = fs.readFileSync(path.join(templatesDir, name), 'utf8');
  if (!html.includes(STYLESHEET_LINK)) throw new Error(`templates/${name} must link listing.css`);
  const css = fs.readFileSync(path.join(templatesDir, 'listing.css'), 'utf8');
  return html.replace(STYLESHEET_LINK, () => `<style>\n${css}</style>`);
}

// {{key}} is escaped text, {{{key}}} is markup built by the kit. A missing key throws, so a template typo never ships as literal braces.
export function fillTemplate(html, values) {
  return html.replace(/\{\{\{\s*(\w+)\s*\}\}\}|\{\{\s*(\w+)\s*\}\}/g, (match, rawKey, textKey) => {
    const key = rawKey ?? textKey;
    if (!(key in values)) throw new Error(`template value "${key}" is missing`);
    return rawKey ? String(values[key]) : escapeHtml(values[key]);
  });
}

export function browserFrame({ title, image }) {
  return `<div class="browser" style="--shot-ratio: ${image.width} / ${image.height}">
  <div class="browser-bar"><span class="dots"><i></i><i></i><i></i></span><span class="browser-title">${escapeHtml(title)}</span></div>
  <img class="shot" src="${image.dataUrl}" alt="" />
</div>`;
}

const AVATAR_FILL = '#e4e4e7';
const AVATAR_INK = '#71717a';
const round = (value) => Math.round(value * 100) / 100;

// Regions that share a frame draw the same art at the same place, so several clipped regions read as one picture.
function artShape({ x, y, w, h, art, frame = { x, y, w, h }, radius = 0 }, index) {
  const data = fs.readFileSync(path.join(kitDir, art)).toString('base64');
  const id = `art-${index}`;
  return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}"/></clipPath><image href="data:image/svg+xml;base64,${data}" x="${frame.x}" y="${frame.y}" width="${frame.w}" height="${frame.h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`;
}

function coverShape(region, index) {
  const { x, y, w, h, kind, value, fill, color = '#18181b', size, weight = 600, radius = 0, align = 'start' } = region;
  const rect = (paint, rx = radius) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${paint}"/>`;
  if (kind === 'block') return rect(fill);
  if (kind === 'art') return rect(fill) + artShape(region, index);
  if (kind === 'name') {
    const fontSize = round(size ?? h * 0.7);
    const anchor = align === 'center' ? `x="${round(x + w / 2)}" text-anchor="middle"` : `x="${x}"`;
    return `${rect(fill)}<text ${anchor} y="${round(y + h / 2)}" dominant-baseline="central" font-size="${fontSize}" font-weight="${weight}" fill="${color}">${escapeHtml(value)}</text>`;
  }
  const r = round(Math.min(w, h) / 2);
  const cx = round(x + w / 2);
  const cy = round(y + h / 2);
  const initial = value ? [...String(value).trim()][0]?.toUpperCase() ?? '' : '';
  // The backdrop square hides the anti-aliased rim of a round photo, which a circle of the same size leaves behind.
  return `${fill ? rect(fill, 0) : ''}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${AVATAR_FILL}"/>${
    initial ? `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-size="${round(r * 0.9)}" font-weight="600" fill="${AVATAR_INK}">${escapeHtml(initial)}</text>` : ''
  }`;
}

// The SVG shares the screenshot's pixel grid through its viewBox, so a region recorded in source pixels lands on the
// same pixels at whatever size the frame draws the phone.
export function coverOverlay({ width, height, cover = [] }) {
  if (!cover.length) return '';
  for (const { x, y, w, h } of cover) {
    if (x + w > width || y + h > height) throw new Error(`cover region ${x},${y} ${w}x${h} falls outside the ${width}x${height} source`);
  }
  return `<svg class="cover-mask" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">${cover.map(coverShape).join('')}</svg>`;
}

export function phoneFrame({ image }) {
  return `<div class="phone" style="--shot-ratio: ${image.width} / ${image.height}">
  <div class="screen"><img class="shot" src="${image.dataUrl}" alt="" />${coverOverlay(image)}</div>
</div>`;
}

export function sampleTag(sampleData) {
  return sampleData ? `<span class="pill"><i class="pill-dot"></i>${escapeHtml(SAMPLE_DATA_TAG)}</span>` : '';
}

export function labelChip(label) {
  return label ? `<span class="chip">${escapeHtml(label)}</span>` : '';
}
