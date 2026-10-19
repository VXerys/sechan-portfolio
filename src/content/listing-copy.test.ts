import assert from "node:assert/strict";
import test from "node:test";

import { listingCopy, listingNotice } from "./listing-copy.ts";
import { projects } from "./portfolio.ts";

test("every listing belongs to a real project and has four or five captions (AC-064, AC-066)", () => {
  const slugs = new Set(projects.map((project) => project.slug));
  for (const [slug, copy] of Object.entries(listingCopy)) {
    assert.ok(slugs.has(slug), `${slug} is not a project`);
    assert.ok(copy.captions.length >= 4 && copy.captions.length <= 5, `${slug} has ${copy.captions.length} captions`);
  }
});

test("captions follow the site's copy rules and work as alt text (BR-016)", () => {
  for (const copy of Object.values(listingCopy)) {
    for (const caption of copy.captions) {
      assert.ok(caption.trim().length > 0);
      assert.doesNotMatch(caption, /passionate|cutting-edge|seamless|leverage|award-winning|—/i);
    }
  }
});

test("sample-data sets carry a notice, and only client work mentions approval (AC-069)", () => {
  const sample = { coverAlt: "Sample", label: null, sampleData: true, captions: [] };
  assert.match(listingNotice(sample, true) ?? "", /client's approval/);
  assert.equal(listingNotice(sample, false), "Screens use sample data.");
  assert.equal(listingNotice({ ...sample, sampleData: false }, true), null);
});
