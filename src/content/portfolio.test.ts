import { test } from "node:test";
import assert from "node:assert/strict";

import { achievements, contact, education, experience, profile, program, projects, siteUrl, skills } from "./portfolio.ts";

const allText = JSON.stringify({ profile, projects, experience, program, education, achievements, skills, contact });

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

test("clinic is named as approved (A-001, AC-059)", () => {
  const clinic = projects.find((project) => project.slug === "clinic-information-system");
  assert.equal(clinic?.client, "Klinik Cikidang Medika");
  const freelance = experience.find((entry) => entry.company === "Freelance");
  assert.ok(freelance?.points.some((point) => point.startsWith("Klinik Cikidang Medika:")));
  assert.doesNotMatch(allText, /primary care clinic in Sukabumi/i);
});

test("program shows no capstone partner (AC-055)", () => {
  for (const [field, value] of Object.entries(program)) {
    assert.ok(typeof value === "string" && value.trim().length > 0, `program.${field} is empty`);
  }
  assert.doesNotMatch(JSON.stringify(program), /capstone|HOWL/i);
});

test("education links only real projects (AC-057)", () => {
  const slugs = new Set(projects.map((project) => project.slug));
  for (const { slug } of education.projects) assert.ok(slugs.has(slug), `unknown project ${slug}`);
  assert.deepEqual(
    education.projects.map((project) => project.slug),
    ["webgis-gunung-puyuh", "artconnect", "cartify", "fluxa"],
  );
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

test("public copy uses the name Sechan (AC-033)", () => {
  assert.doesNotMatch(allText, /\bSehan\b/);
  assert.equal(profile.shortName, "Sechan");
});

test("Mangcoding is named by brand, with its legal entity alongside (AC-034)", () => {
  assert.doesNotMatch(allText, /PT Mangcoding/);
  const mangcoding = experience.find((entry) => entry.company === "Mangcoding");
  assert.equal(mangcoding?.legalName, "PT Nugraha Kreasi Digital");
});

test("on-hold projects are not presented as work (AC-035)", () => {
  assert.doesNotMatch(allText, /mangkasir/i);
  for (const project of projects) for (const link of project.links) assert.match(link.href, /^https:\/\//);
});
