import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { isLoopback, validateAllowHosts } from './guard.mjs';

export const kitDir = fileURLToPath(new URL('..', import.meta.url));
export const repoRoot = path.resolve(kitDir, '..', '..');

const SLUG = /^_?[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHOT_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LABELS = [null, 'Full-stack', 'UI slicing'];
const SLIDE_COUNTS = { web: [4], mobile: [4, 5] };
const WAIT_UNTIL = ['networkidle', 'load', 'domcontentloaded'];
// Same rule as the site's copy test (BR-016); captions double as alt text, so they follow the site's copy.
const COPY_RULE = /passionate|cutting-edge|seamless|leverage|award-winning|—/i;

export function cacheDir(slug) {
  return path.join(repoRoot, '.listing-cache', slug);
}

// Kit-internal slugs (leading underscore) always compose into the cache, so a demo can never land in the site's assets.
export function outputDir(slug) {
  return slug.startsWith('_') ? path.join(cacheDir(slug), 'out') : path.join(repoRoot, 'src', 'assets', 'images', 'listings', slug);
}

function fail(slug, message) {
  throw new Error(`projects/${slug}.mjs: ${message}`);
}

export async function loadProject(slug) {
  if (!SLUG.test(String(slug))) throw new Error(`"${slug}" is not a project slug (lowercase, digits, hyphens)`);
  const file = path.join(kitDir, 'projects', `${slug}.mjs`);
  if (!fs.existsSync(file)) throw new Error(`no project file at ${path.relative(repoRoot, file)}`);
  const { default: project } = await import(pathToFileURL(file).href);
  if (!project || typeof project !== 'object') fail(slug, 'must export a default object');
  if (project.slug !== slug) fail(slug, `slug "${project.slug}" does not match the file name`);
  return { ...project, allowHosts: validateAllowHosts(project.allowHosts) };
}

export function checkCaptureConfig(project) {
  const { slug } = project;
  let base;
  try {
    base = new URL(project.baseUrl);
  } catch {
    fail(slug, `baseUrl "${project.baseUrl}" is not a URL`);
  }
  if (!['http:', 'https:'].includes(base.protocol) || !isLoopback(base.hostname)) {
    fail(slug, `baseUrl must point at localhost, 127.0.0.1, or ::1 (BR-012); got ${project.baseUrl}`);
  }
  const { width, height, deviceScaleFactor } = project.viewport ?? {};
  if (![width, height, deviceScaleFactor].every((value) => Number.isFinite(value) && value > 0)) {
    fail(slug, 'viewport needs width, height, and deviceScaleFactor');
  }
  if (project.setup !== undefined && typeof project.setup !== 'function') fail(slug, 'setup must be a function');
  if (project.teardown !== undefined && typeof project.teardown !== 'function') fail(slug, 'teardown must be a function');
  if (project.serve !== undefined && !(typeof project.serve === 'string' && path.isAbsolute(project.serve) && fs.existsSync(project.serve))) {
    fail(slug, 'serve must be an absolute path to an existing fixture folder');
  }
  if (!Array.isArray(project.shots) || project.shots.length === 0) fail(slug, 'shots must list at least one shot');
  const names = new Set();
  for (const shot of project.shots) {
    if (!SHOT_NAME.test(String(shot?.name))) fail(slug, `shot name "${shot?.name}" must be lowercase words joined by hyphens`);
    if (names.has(shot.name)) fail(slug, `shot "${shot.name}" is listed twice`);
    names.add(shot.name);
    if (typeof shot.path !== 'string' || !shot.path.startsWith('/')) fail(slug, `shot "${shot.name}" needs a path starting with /`);
    if (shot.waitFor !== undefined && typeof shot.waitFor !== 'string') fail(slug, `shot "${shot.name}" waitFor must be a selector`);
    if (shot.before !== undefined && typeof shot.before !== 'function') fail(slug, `shot "${shot.name}" before must be a function`);
    if (shot.waitUntil !== undefined && !WAIT_UNTIL.includes(shot.waitUntil)) fail(slug, `shot "${shot.name}" waitUntil must be one of ${WAIT_UNTIL.join(', ')}`);
  }
  return project;
}

const COVER_KINDS = ['name', 'avatar', 'block'];
// Colors land in SVG attributes, so only plain hex is accepted.
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function checkCoverRegion(slug, field, region) {
  const { x, y, w, h, kind, value, fill, color, size, weight, radius, align } = region ?? {};
  if (![x, y].every((n) => Number.isFinite(n) && n >= 0) || ![w, h].every((n) => Number.isFinite(n) && n > 0)) {
    fail(slug, `${field} needs x, y, w, h in source pixels`);
  }
  if (!COVER_KINDS.includes(kind)) fail(slug, `${field}.kind must be one of ${COVER_KINDS.join(', ')}`);
  if (kind === 'name' && !(typeof value === 'string' && value.trim())) fail(slug, `${field} is a name and needs a sample value`);
  if (value !== undefined && typeof value !== 'string') fail(slug, `${field}.value must be a string`);
  if (align !== undefined && !['start', 'center'].includes(align)) fail(slug, `${field}.align must be start or center`);
  if (kind !== 'avatar' && fill === undefined) fail(slug, `${field} needs a fill matched to the surrounding UI`);
  for (const [key, paint] of Object.entries({ fill, color })) {
    if (paint !== undefined && !HEX.test(String(paint))) fail(slug, `${field}.${key} must be a hex color`);
  }
  for (const [key, number] of Object.entries({ size, weight, radius })) {
    if (number !== undefined && !(Number.isFinite(number) && number >= 0)) fail(slug, `${field}.${key} must be a non-negative number`);
  }
}

function checkCopy(slug, field, text) {
  if (typeof text !== 'string' || !text.trim()) fail(slug, `${field} must be a non-empty string`);
  if (COPY_RULE.test(text)) fail(slug, `${field} breaks the copy rules (hype word or em dash): "${text}"`);
}

export function checkListingConfig(project) {
  const { slug, listing } = project;
  if (!listing || typeof listing !== 'object') fail(slug, 'listing is missing');
  if (!(listing.type in SLIDE_COUNTS)) fail(slug, 'listing.type must be "web" or "mobile"');
  if (!LABELS.includes(listing.label ?? null)) fail(slug, `listing.label must be one of ${LABELS.map(String).join(', ')}`);
  if (typeof listing.sampleData !== 'boolean') fail(slug, 'listing.sampleData must be true or false');
  checkCopy(slug, 'listing.title', listing.title);
  checkCopy(slug, 'listing.tagline', listing.tagline);

  const sources = {};
  for (const [shot, entry] of Object.entries(listing.sources ?? {})) {
    const { file, cover = [] } = typeof entry === 'string' ? { file: entry } : (entry ?? {});
    if (typeof file !== 'string' || !path.isAbsolute(file)) fail(slug, `listing.sources.${shot} must be an absolute path`);
    if (!Array.isArray(cover)) fail(slug, `listing.sources.${shot}.cover must be a list of regions`);
    // Only the phone frame draws cover regions; a web slide would silently show the uncovered values.
    if (cover.length && listing.type !== 'mobile') fail(slug, `listing.sources.${shot}.cover is only drawn on mobile slides`);
    cover.forEach((region, index) => checkCoverRegion(slug, `listing.sources.${shot}.cover[${index}]`, region));
    sources[shot] = { file, cover };
  }
  const known = new Set([...(project.shots ?? []).map((shot) => shot.name), ...Object.keys(sources)]);
  const requireShot = (field, name) => {
    if (!known.has(name)) fail(slug, `${field} names shot "${name}", which is neither in shots nor in listing.sources`);
  };

  requireShot('listing.cover.shot', listing.cover?.shot);
  const counts = SLIDE_COUNTS[listing.type];
  if (!Array.isArray(listing.slides) || !counts.includes(listing.slides.length)) {
    fail(slug, `a ${listing.type} listing has ${counts.join(' or ')} slides (FR-037, FR-038); found ${listing.slides?.length ?? 0}`);
  }
  listing.slides.forEach((slide, index) => {
    requireShot(`listing.slides[${index}].shot`, slide?.shot);
    checkCopy(slug, `listing.slides[${index}].caption`, slide.caption);
  });
  return { ...listing, label: listing.label ?? null, sources };
}
