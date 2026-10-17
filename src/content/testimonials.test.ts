import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { isConsentDate } from "../lib/testimonials.ts";
import { projects } from "./portfolio.ts";
import { testimonials } from "./testimonials.ts";

const filled = (value: string | null) => value !== null && value.trim().length > 0;

test("every testimonial is complete, approved or pending, and tied to a real project (AC-039)", () => {
  const slugs = new Set(projects.map((project) => project.slug));
  for (const item of testimonials) {
    assert.ok(filled(item.quote));
    assert.doesNotThrow(() => Intl.getCanonicalLocales(item.language), `bad language tag ${item.language}`);
    assert.ok(item.translation === null || filled(item.translation));
    assert.ok(!(item.language.startsWith("en") && item.translation !== null), "an English quote needs no translation");
    if (item.attribution.showName) {
      assert.ok(filled(item.attribution.name) && filled(item.attribution.role));
      assert.ok(item.attribution.organization === null || filled(item.attribution.organization));
    } else {
      assert.ok(filled(item.attribution.label));
    }
    assert.ok(item.projectSlug === null || slugs.has(item.projectSlug), `unknown project ${item.projectSlug}`);
    assert.ok(item.consentDate === null || isConsentDate(item.consentDate), `bad consent date ${item.consentDate}`);
    if (item.excerpt !== null) {
      assert.ok(filled(item.excerpt));
      assert.ok((item.translation ?? item.quote).includes(item.excerpt), "an excerpt must be a verbatim cut");
    }
  }
});

test("testimonials hold no phone numbers (BR-002, AC-060)", () => {
  assert.doesNotMatch(JSON.stringify(testimonials), /(\+62|\b08)\d[\d\s-]{7,}/);
});

test("no client component imports the testimonials content (AC-040)", () => {
  const src = join(import.meta.dirname, "..");
  const files = readdirSync(src, { recursive: true, encoding: "utf8" }).filter((file) => /\.tsx?$/.test(file));
  let clientFiles = 0;
  for (const file of files) {
    const code = readFileSync(join(src, file), "utf8");
    if (!/^\s*["']use client["']/.test(code)) continue;
    clientFiles += 1;
    assert.doesNotMatch(code, /content\/testimonials/, `${file} is a client component`);
  }
  // Guards against a wrong path turning this into a test that checks nothing.
  assert.ok(clientFiles > 0);
});
