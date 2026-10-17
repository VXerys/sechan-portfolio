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

export function phoneFrame({ image }) {
  return `<div class="phone" style="--shot-ratio: ${image.width} / ${image.height}">
  <img class="shot" src="${image.dataUrl}" alt="" />
</div>`;
}

export function sampleTag(sampleData) {
  return sampleData ? `<span class="pill"><i class="pill-dot"></i>${escapeHtml(SAMPLE_DATA_TAG)}</span>` : '';
}

export function labelChip(label) {
  return label ? `<span class="chip">${escapeHtml(label)}</span>` : '';
}
