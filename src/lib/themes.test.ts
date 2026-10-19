import { test } from "node:test";
import assert from "node:assert/strict";

import { blendThemes, contrast, THEME_NAMES, THEMES, isThemeName } from "./themes.ts";

test("every theme keeps body and muted text at 4.5:1 or more (AC-074)", () => {
  for (const name of THEME_NAMES) {
    const theme = THEMES[name];
    assert.ok(contrast(theme.paper, theme.ink) >= 4.5, `${name} body`);
    assert.ok(contrast(theme.muted, theme.ink) >= 4.5, `${name} muted`);
    assert.ok(contrast(theme.muted, theme["ink-2"]) >= 4.5, `${name} muted on raised`);
    assert.ok(contrast(theme.ink, theme.accent) >= 4.5, `${name} chip text on accent`);
  }
});

test("a blend returns its endpoints at 0 and 1 and stays between them (AC-071)", () => {
  assert.deepEqual(blendThemes("ink", "paper", 0), THEMES.ink);
  assert.deepEqual(blendThemes("ink", "paper", 1), THEMES.paper);
  const middle = blendThemes("ink", "paper", 0.5);
  assert.equal(middle.ink, "#7e7d79");
});

test("text keeps readable contrast through the whole blend", () => {
  for (const [from, to] of [["ink", "paper"], ["paper", "ink"], ["paper", "lime"], ["ink", "lime"]] as const) {
    let worst = Infinity;
    for (let step = 0; step <= 100; step += 1) {
      const palette = blendThemes(from, to, step / 100);
      worst = Math.min(worst, contrast(palette.paper, palette.ink));
    }
    assert.ok(worst >= 3, `${from} to ${to} dips to ${worst.toFixed(2)}:1`);
  }
});

test("progress outside 0..1 is clamped", () => {
  assert.deepEqual(blendThemes("paper", "lime", -2), THEMES.paper);
  assert.deepEqual(blendThemes("paper", "lime", 3), THEMES.lime);
});

test("only known theme names pass", () => {
  assert.equal(isThemeName("paper"), true);
  assert.equal(isThemeName("pink"), false);
  assert.equal(isThemeName(undefined), false);
});
