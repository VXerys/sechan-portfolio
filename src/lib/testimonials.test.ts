import { test } from "node:test";
import assert from "node:assert/strict";

import type { Testimonial } from "../content/testimonials.ts";
import { isConsentDate, quoteForProject, showTestimonials } from "./testimonials.ts";

// Fixtures exist only inside this test; they are never content and never rendered (BR-003).
const base: Testimonial = {
  quote: "Fixture quote in English.",
  language: "en",
  translation: null,
  attribution: { showName: true, name: "Fixture Person", role: "Owner", organization: "Fixture Co" },
  projectSlug: "fixture-project",
  excerpt: null,
  consentDate: "2026-10-16",
};

test("entries without a valid consent date are hidden (AC-033)", () => {
  assert.deepEqual(showTestimonials([]), []);
  const pending = { ...base, consentDate: null };
  const malformed = { ...base, consentDate: "16-10-2026" };
  const impossible = { ...base, consentDate: "2026-02-30" };
  assert.deepEqual(showTestimonials([pending, malformed, impossible]), []);
  assert.equal(showTestimonials([pending, base]).length, 1);
});

test("consent dates must be real calendar days", () => {
  assert.equal(isConsentDate("2028-02-29"), true);
  assert.equal(isConsentDate("2026-02-29"), false);
  assert.equal(isConsentDate(""), false);
});

test("a named person shows name, role, and organization (AC-035)", () => {
  const [view] = showTestimonials([base]);
  assert.equal(view.person, "Fixture Person");
  assert.equal(view.detail, "Owner, Fixture Co");
  const [noOrganization] = showTestimonials([
    { ...base, attribution: { showName: true, name: "Fixture Person", role: "Supervisor", organization: null } },
  ]);
  assert.equal(noOrganization.detail, "Supervisor");
});

test("an unnamed person shows only the anonymous label (AC-035)", () => {
  const [view] = showTestimonials([{ ...base, attribution: { showName: false, label: "Owner of a fixture clinic" } }]);
  assert.equal(view.person, "Owner of a fixture clinic");
  assert.equal(view.detail, null);
  assert.doesNotMatch(JSON.stringify(view), /Fixture Person/);
});

test("a translated quote leads with English and keeps the original (AC-036)", () => {
  const [view] = showTestimonials([{ ...base, quote: "Kutipan contoh.", language: "id", translation: "Fixture translation." }]);
  assert.equal(view.text, "Fixture translation.");
  assert.equal(view.lang, "en");
  assert.deepEqual(view.original, { text: "Kutipan contoh.", lang: "id", languageName: "Indonesian" });
});

test("an untranslated quote keeps its own language (AC-037)", () => {
  const [view] = showTestimonials([{ ...base, quote: "Kutipan contoh.", language: "id" }]);
  assert.equal(view.text, "Kutipan contoh.");
  assert.equal(view.lang, "id");
  assert.equal(view.original, null);
});

test("a project shows the first approved quote that has an excerpt (AC-038)", () => {
  const views = showTestimonials([
    base,
    { ...base, excerpt: "Fixture quote" },
    { ...base, projectSlug: "other", excerpt: "Fixture" },
  ]);
  assert.equal(quoteForProject(views, "fixture-project")?.key, "fixture-project-1");
  assert.equal(quoteForProject(views, "missing"), null);
  assert.equal(quoteForProject(showTestimonials([{ ...base, excerpt: "x", consentDate: null }]), "fixture-project"), null);
});
