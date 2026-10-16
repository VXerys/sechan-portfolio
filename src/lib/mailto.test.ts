import { test } from "node:test";
import assert from "node:assert/strict";

import { mailtoHref } from "./mailto.ts";

test("mailto encodes subject and body (AC-025)", () => {
  const href = mailtoHref("a@b.co", "Hi & hello", "Line one\nLine two?");
  assert.equal(href, "mailto:a@b.co?subject=Hi%20%26%20hello&body=Line%20one%0ALine%20two%3F");
});
