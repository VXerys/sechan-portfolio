import { test } from "node:test";
import assert from "node:assert/strict";

import { achievements, contact, experience, profile, projects, siteUrl, skills } from "./portfolio.ts";

const allText = JSON.stringify({ profile, projects, experience, achievements, skills, contact });

test("project slugs are unique (AC-002)", () => {
  const slugs = projects.map((project) => project.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("featured projects come before the rest (AC-002)", () => {
  const firstNonFeatured = projects.findIndex((project) => !project.featured);
  const lastFeatured = projects.findLastIndex((project) => project.featured);
  assert.ok(firstNonFeatured === -1 || lastFeatured < firstNonFeatured);
});

test("every section has content (AC-004)", () => {
  assert.ok(projects.length >= 4);
  assert.ok(experience.length > 0);
  assert.ok(achievements.length > 0);
  assert.ok(skills.every((group) => group.items.length > 0));
});

test("no phone numbers in public content (BR-002)", () => {
  assert.doesNotMatch(allText, /(\+62|\b08)\d[\d\s-]{7,}/);
});

test("contact links use https and the expected hosts (AC-005)", () => {
  for (const link of profile.links) assert.match(link.href, /^https:\/\/(github\.com|www\.linkedin\.com)\//);
  assert.ok(profile.email?.includes("@"));
});

test("copy avoids hype words and em dashes", () => {
  assert.doesNotMatch(allText, /passionate|cutting-edge|seamless|leverage|award-winning|—/i);
});

test("clinic stays unnamed until it approves (AC-013)", () => {
  assert.doesNotMatch(allText, /cikidang/i);
});

test("availability leads with freelance, then internships (AC-023)", () => {
  for (const text of [profile.availability, profile.intro]) {
    const freelance = text.toLowerCase().indexOf("freelance");
    const internship = text.toLowerCase().indexOf("internship");
    assert.ok(freelance >= 0, `no freelance mention in: ${text}`);
    assert.ok(internship === -1 || freelance < internship, `internships come first in: ${text}`);
  }
});

test("canonical site URL is the live https www origin (AC-027)", () => {
  assert.equal(siteUrl, "https://www.sechanalfarisi.dev");
  assert.equal(new URL(siteUrl).pathname, "/");
});
