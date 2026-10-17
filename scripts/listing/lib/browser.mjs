import fs from 'node:fs';
import { chromium } from 'playwright-core';

import { createGuard } from './guard.mjs';

const DEFAULT_CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

export function chromePath() {
  return process.env.CHROME_PATH || DEFAULT_CHROME;
}

// The resolver rule is a second, browser-wide wall behind the route guard: a page route that continues a request,
// a preconnect, a worker, or an IP literal still cannot reach a host outside the allowlist (Chrome applies MAP * to
// IP literals too, so loopback addresses are excluded explicitly). The proxy is switched off so a system proxy
// cannot resolve names on the browser's behalf and sidestep the rule.
function launchArgs(hosts) {
  const rules = ['MAP * ~NOTFOUND', ...hosts.map((host) => `EXCLUDE ${host}`)].join(', ');
  return [`--host-resolver-rules=${rules}`, '--no-proxy-server'];
}

async function launchChrome(hosts) {
  const executablePath = chromePath();
  if (!fs.existsSync(executablePath)) {
    throw new Error(`Chrome not found at ${executablePath}. Set CHROME_PATH to an installed Chrome; the kit never downloads a browser.`);
  }
  return chromium.launch({ executablePath, headless: true, args: launchArgs(hosts) });
}

// The only way the kit opens a browser, so every run gets the same guard order: audit, project stubs, then the guard routes.
export async function openGuardedSession({ allowHosts = [], contextOptions = {}, setup } = {}) {
  const guard = createGuard(allowHosts);
  const browser = await launchChrome(guard.hosts);
  try {
    // Service workers fetch outside page routing, so they are blocked rather than trusted.
    const context = await browser.newContext({ ...contextOptions, serviceWorkers: 'block' });
    guard.watch(context);
    if (setup) await setup(context);
    await guard.enforce(context);
    return { context, guard, close: () => browser.close() };
  } catch (error) {
    await browser.close();
    throw error;
  }
}
