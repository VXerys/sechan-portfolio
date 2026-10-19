import { errors } from 'playwright-core';

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_SETTLE_MS = 600;

function trackPending(page) {
  const pending = new Set();
  page.on('request', (request) => pending.add(request));
  page.on('requestfinished', (request) => pending.delete(request));
  page.on('requestfailed', (request) => pending.delete(request));
  return () => [...pending].map((request) => `${request.method()} ${request.url()}`);
}

export async function waitForFonts(page) {
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

// Two frames after the timer, so anything a transition or GSAP tween scheduled on the last frame has painted.
export async function settle(page, ms = DEFAULT_SETTLE_MS) {
  await page.waitForTimeout(ms);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function attempt(page, url, shot, timeout) {
  // Apps that hold a request open for good (a Firestore listen channel) never reach network idle; they wait on 'load'
  // and prove their data arrived in `before` instead.
  const response = await page.goto(url, { waitUntil: shot.waitUntil ?? 'networkidle', timeout });
  // Only errors fail the shot: a dev server answers a repeat load in the same context with 304, which is a good page.
  if (response && response.status() >= 400) {
    throw new Error(`${url} answered ${response.status()}`);
  }
  await waitForFonts(page);
  if (shot.waitFor) await page.locator(shot.waitFor).first().waitFor({ state: 'visible', timeout });
  await page.waitForFunction(() => [...document.images].every((image) => image.complete), undefined, { timeout });
  if (shot.before) {
    await shot.before(page);
    await waitForFonts(page);
  }
  await settle(page, shot.settle);
  return page.screenshot({ type: 'png', animations: 'disabled', caret: 'hide' });
}

// One retry covers a slow font or tile response (EC-004); a second timeout fails with what was still in flight.
export async function captureShot(context, baseUrl, shot) {
  const url = new URL(shot.path, baseUrl).href;
  const timeout = shot.timeout ?? DEFAULT_TIMEOUT_MS;
  for (let round = 1; round <= 2; round += 1) {
    const page = await context.newPage();
    const pendingRequests = trackPending(page);
    try {
      return await attempt(page, url, shot, timeout);
    } catch (error) {
      const timedOut = error instanceof errors.TimeoutError;
      if (timedOut && round === 1) {
        console.warn(`  ${shot.name}: timed out, retrying once`);
        continue;
      }
      const pending = pendingRequests();
      const detail = pending.length ? `\n  pending requests:\n${pending.map((line) => `    ${line}`).join('\n')}` : '';
      throw new Error(`shot "${shot.name}" failed: ${error.message.split('\n')[0]}${detail}`, { cause: error });
    } finally {
      await page.close();
    }
  }
  throw new Error(`shot "${shot.name}" failed`);
}
