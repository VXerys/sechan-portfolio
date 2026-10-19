import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import sharp from 'sharp';

import { openGuardedSession } from './browser.mjs';
import { checkListingConfig, kitDir } from './project.mjs';
import { coverOverlay, phoneFrame } from './template.mjs';

// Built per platform, so the absolute-path check holds on the Linux CI runner as well as on Windows.
const SHOT = path.resolve('shots', 'a.png');

const SOURCE = { width: 200, height: 400 };

function listingWith(sources, type = 'mobile') {
  return {
    slug: 'cover-test',
    shots: [],
    listing: {
      type,
      label: null,
      sampleData: true,
      title: 'Cover test',
      hook: 'Covers stay covered',
      tagline: 'Checks cover regions',
      cover: { shot: 'a' },
      slides: Array.from({ length: type === 'web' ? 4 : 5 }, () => ({ shot: 'a', caption: 'A caption' })),
      sources,
    },
  };
}

test('sources accept a plain path or a file with cover regions', () => {
  const plain = checkListingConfig(listingWith({ a: SHOT }));
  assert.deepEqual(plain.sources.a, { file: SHOT, cover: [] });
  const region = { x: 1, y: 2, w: 30, h: 10, kind: 'name', value: 'Mina', fill: '#ffffff' };
  const covered = checkListingConfig(listingWith({ a: { file: SHOT, cover: [region] } }));
  assert.deepEqual(covered.sources.a.cover, [region]);
});

test('cover regions are rejected when they could leave a value uncovered or inject markup', () => {
  const bad = [
    { x: 0, y: 0, w: 10, h: 10, kind: 'blur', fill: '#fff' },
    { x: 0, y: 0, w: 10, h: 10, kind: 'name', fill: '#fff' },
    { x: 0, y: 0, w: 10, kind: 'block', fill: '#fff' },
    { x: -1, y: 0, w: 10, h: 10, kind: 'block', fill: '#fff' },
    { x: 0, y: 0, w: 10, h: 10, kind: 'block' },
    { x: 0, y: 0, w: 10, h: 10, kind: 'name', value: 'Mina', fill: '#fff', align: 'right' },
    { x: 0, y: 0, w: 10, h: 10, kind: 'block', fill: 'red" onload="x' },
  ];
  for (const region of bad) {
    assert.throws(() => checkListingConfig(listingWith({ a: { file: SHOT, cover: [region] } })), /cover\[0\]/);
  }
  const block = { x: 0, y: 0, w: 10, h: 10, kind: 'block', fill: '#fff' };
  assert.throws(() => checkListingConfig(listingWith({ a: { file: SHOT, cover: [block] } }, 'web')), /only drawn on mobile/);
});

test('the overlay uses the source pixel grid and escapes sample values', () => {
  const svg = coverOverlay({
    ...SOURCE,
    cover: [
      { x: 10, y: 20, w: 80, h: 20, kind: 'name', value: '<Mina & Co>', fill: '#ffffff' },
      { x: 100, y: 20, w: 40, h: 40, kind: 'avatar', value: 'mina' },
    ],
  });
  assert.match(svg, /viewBox="0 0 200 400"/);
  assert.match(svg, /&lt;Mina &amp; Co&gt;/);
  assert.match(svg, /<circle cx="120" cy="40" r="20"/);
  assert.match(svg, />M<\/text>/);
  const centred = coverOverlay({ ...SOURCE, cover: [{ x: 10, y: 0, w: 100, h: 20, kind: 'name', value: 'Mina', fill: '#fff', align: 'center' }] });
  assert.match(centred, /<text x="60" text-anchor="middle"/);
  assert.equal(coverOverlay({ ...SOURCE, cover: [] }), '');
  assert.throws(() => coverOverlay({ ...SOURCE, cover: [{ x: 190, y: 0, w: 20, h: 10, kind: 'block', fill: '#000' }] }), /outside/);
});

// Draws a red mark into a synthetic screenshot, covers exactly its pixels, and renders the phone at two sizes: no red
// may survive at either scale, which is what "over the original pixels at any scale" has to mean.
test('a cover region hides its source pixels at any rendered size', async () => {
  const mark = { x: 50, y: 100, w: 60, h: 30 };
  const red = await sharp({ create: { width: mark.w, height: mark.h, channels: 3, background: '#ff0000' } }).png().toBuffer();
  const png = await sharp({ create: { ...SOURCE, channels: 3, background: '#ffffff' } })
    .composite([{ input: red, left: mark.x, top: mark.y }])
    .png()
    .toBuffer();
  const image = {
    ...SOURCE,
    dataUrl: `data:image/png;base64,${png.toString('base64')}`,
    cover: [{ ...mark, kind: 'block', fill: '#0000ff' }],
  };
  const css = fs.readFileSync(path.join(kitDir, 'templates', 'listing.css'), 'utf8').replace(/^@import[^\n]*\n/m, '');
  const session = await openGuardedSession();
  try {
    for (const height of [333, 1210]) {
      const page = await session.context.newPage();
      await page.setViewportSize({ width: 1200, height: height + 40 });
      await page.setContent(`<style>${css}</style><div style="height:${height}px">${phoneFrame({ image })}</div>`, { waitUntil: 'load' });
      const shot = await page.locator('.screen').screenshot({ type: 'png' });
      await page.close();
      const { data, info } = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
      let redPixels = 0;
      let bluePixels = 0;
      for (let i = 0; i < data.length; i += info.channels) {
        const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        if (r > 150 && g < 110 && b < 110) redPixels += 1;
        if (b > 150 && r < 110 && g < 110) bluePixels += 1;
      }
      assert.equal(redPixels, 0, `red source pixels show through at height ${height}`);
      assert.ok(bluePixels > 0, `the cover was not drawn at height ${height}`);
    }
  } finally {
    await session.close();
  }
});
