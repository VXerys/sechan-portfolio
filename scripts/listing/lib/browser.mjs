import fs from 'node:fs';
import { chromium } from 'playwright-core';

import { createGuard } from './guard.mjs';

// Windows is the owner's machine; the others are where Chrome sits on CI runners, so the guard tests in npm test run there too.
const DEFAULT_CHROME = {
  win32: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  linux: '/usr/bin/google-chrome',
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
};

export function chromePath() {
  return process.env.CHROME_PATH || DEFAULT_CHROME[process.platform] || DEFAULT_CHROME.win32;
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

// The only way the kit opens a browser, so every run gets the same guard order: audit and Node-side hook, project
// stubs, then the guard routes. A caller that must log even a failed setup creates the guard itself and passes it in.
export async function openGuardedSession({ allowHosts = [], guard = createGuard(allowHosts), contextOptions = {}, setup } = {}) {
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
