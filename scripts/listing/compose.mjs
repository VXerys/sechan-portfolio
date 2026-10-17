#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

import { openGuardedSession } from './lib/browser.mjs';
import { createGuard, printHostLog, writeHostLog } from './lib/guard.mjs';
import { encodeWebp, formatKb, KB, readImage, writeImage } from './lib/images.mjs';
import { cacheDir, checkListingConfig, loadProject, outputDir, repoRoot } from './lib/project.mjs';
import { browserFrame, fillTemplate, labelChip, loadTemplate, phoneFrame, sampleTag } from './lib/template.mjs';
import { settle, waitForFonts } from './lib/waits.mjs';

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
const FAMILIES = ['Archivo', 'Host Grotesk', 'JetBrains Mono', 'Instrument Serif'];
const FORMATS = {
  cover: { template: 'cover.html', width: 1600, height: 1000, maxBytes: 250 * KB },
  web: { template: 'slide-web.html', width: 1080, height: 1350, maxBytes: 200 * KB },
  mobile: { template: 'slide-mobile.html', width: 1080, height: 1920, maxBytes: 200 * KB },
};
const KIND = { web: 'Web app', mobile: 'Mobile app' };

const relative = (file) => path.relative(repoRoot, file).replaceAll('\\', '/');
const pad = (value) => String(value).padStart(2, '0');

// Captures are only trusted while the run that made them shows no blocked host (BR-012, NFR-002).
function assertCleanCapture(dir) {
  const file = path.join(dir, 'hosts.json');
  if (!fs.existsSync(file)) throw new Error(`no capture log at ${relative(file)}; run listing:capture first`);
  const { blocked = {} } = JSON.parse(fs.readFileSync(file, 'utf8'));
  const hosts = Object.keys(blocked);
  if (hosts.length) throw new Error(`the last capture blocked ${hosts.join(', ')}; recapture before composing`);
}

async function loadShots(project, listing) {
  const names = new Set([listing.cover.shot, ...listing.slides.map((slide) => slide.shot)]);
  const dir = cacheDir(project.slug);
  if ([...names].some((name) => !listing.sources[name])) assertCleanCapture(dir);
  const images = new Map();
  for (const name of names) {
    const file = listing.sources[name] ?? path.join(dir, `${name}.png`);
    if (!fs.existsSync(file)) throw new Error(`shot "${name}" has no image at ${file}`);
    images.set(name, await readImage(file));
  }
  return images;
}

// Runs in the page: shrinks [data-fit] text until its lines fit the element's max-height, down to the minimum size in
// the attribute. Line boxes are measured instead of scrollHeight because tight display leading lets glyphs overhang
// the box even when every line fits.
function fitText() {
  const overflowing = [];
  for (const element of document.querySelectorAll('[data-fit]')) {
    const min = Number(element.dataset.fit);
    const limit = parseFloat(getComputedStyle(element).maxHeight);
    let size = parseFloat(getComputedStyle(element).fontSize);
    element.style.maxHeight = 'none';
    const fits = () => element.getBoundingClientRect().height <= limit + 1 && element.scrollWidth <= element.clientWidth + 1;
    while (!fits() && size > min) {
      size -= 2;
      element.style.fontSize = `${size}px`;
    }
    if (!fits()) overflowing.push(element.textContent.trim());
    element.style.maxHeight = '';
  }
  return overflowing;
}

// Loads each family explicitly, so a template that happens not to use one (a phone frame has no bar title) still
// proves the font host answered, then reports the families with no loaded face.
async function missingFonts(families) {
  await Promise.all(families.map((family) => document.fonts.load(`16px "${family}"`).catch(() => [])));
  return families.filter(
    (family) => ![...document.fonts].some((face) => face.family.replace(/["']/g, '') === family && face.status === 'loaded'),
  );
}

async function render(context, html, format) {
  const page = await context.newPage();
  try {
    await page.setViewportSize({ width: format.width, height: format.height });
    await page.setContent(html, { waitUntil: 'networkidle', timeout: 30_000 });
    await waitForFonts(page);
    // A fallback font would still render, so a missing web font has to fail loudly instead of shipping the wrong type.
    const missing = await page.evaluate(missingFonts, FAMILIES);
    if (missing.length) throw new Error(`web fonts did not load: ${missing.join(', ')}`);
    const overflowing = await page.evaluate(fitText);
    if (overflowing.length) throw new Error(`text does not fit its box: ${overflowing.join(' | ')}`);
    await settle(page, 100);
    return await page.screenshot({ type: 'png' });
  } finally {
    await page.close();
  }
}

function buildJobs(listing, images) {
  const frame = (shot) =>
    listing.type === 'web' ? browserFrame({ title: listing.title, image: images.get(shot) }) : phoneFrame({ image: images.get(shot) });
  const shared = {
    type: listing.type,
    kind: KIND[listing.type],
    title: listing.title,
    chip: labelChip(listing.label),
    sample: sampleTag(listing.sampleData),
  };
  const total = pad(listing.slides.length);
  const cover = {
    name: 'cover.webp',
    format: FORMATS.cover,
    values: { ...shared, tagline: listing.tagline, frame: frame(listing.cover.shot) },
  };
  const slides = listing.slides.map((slide, index) => ({
    name: `${pad(index + 1)}.webp`,
    format: FORMATS[listing.type],
    values: { ...shared, index: pad(index + 1), total, caption: slide.caption, frame: frame(slide.shot) },
  }));
  return [cover, ...slides];
}

function warnStale(dir, jobs) {
  if (!fs.existsSync(dir)) return;
  const names = new Set(jobs.map((job) => job.name));
  for (const file of fs.readdirSync(dir)) {
    if (/^\d{2}\.webp$/.test(file) && !names.has(file)) console.warn(`  warning: ${relative(path.join(dir, file))} is not part of this set; remove it if the slide was dropped`);
  }
}

async function compose(slug) {
  const project = await loadProject(slug);
  const listing = checkListingConfig(project);
  const images = await loadShots(project, listing);
  const jobs = buildJobs(listing, images);
  const templates = Object.fromEntries(Object.values(FORMATS).map(({ template }) => [template, loadTemplate(template)]));

  const encoded = [];
  let failure = null;
  let session = null;
  const guard = createGuard(FONT_HOSTS);
  try {
    session = await openGuardedSession({
      guard,
      contextOptions: { viewport: { width: FORMATS.cover.width, height: FORMATS.cover.height }, deviceScaleFactor: 2 },
    });
    for (const job of jobs) {
      const png = await render(session.context, fillTemplate(templates[job.format.template], job.values), job.format);
      encoded.push({ ...(await encodeWebp(png, { ...job.format, name: job.name })), maxBytes: job.format.maxBytes });
    }
  } catch (error) {
    failure = error;
  } finally {
    await session?.close();
  }

  const logFile = writeHostLog(cacheDir(slug), guard.log, 'compose-hosts.json');
  console.log(`compose hosts log: ${relative(logFile)}`);
  printHostLog(guard.log);
  const blocked = guard.blockedHosts();
  if (blocked.length) console.error(`FAIL: blocked ${blocked.join(', ')}; nothing written`);
  if (failure) console.error(`FAIL: ${failure.message}`);
  if (blocked.length || failure) return 1;

  const dir = outputDir(slug);
  for (const { name, data, quality, maxBytes } of encoded) {
    const { file, bytes, width, height } = await writeImage(dir, name, data);
    console.log(`  ${relative(file)}  ${width}x${height}  ${formatKb(bytes)} (budget ${formatKb(maxBytes)}, quality ${quality})`);
  }
  warnStale(dir, jobs);
  return 0;
}

const [slug] = process.argv.slice(2);
if (!slug) {
  console.error('usage: npm run listing:compose -- <slug>');
  process.exitCode = 64;
} else {
  compose(slug).then(
    (code) => {
      process.exitCode = code;
    },
    (error) => {
      console.error(`FAIL: ${error.message}`);
      process.exitCode = 1;
    },
  );
}
