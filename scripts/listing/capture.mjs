#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

import { openGuardedSession } from './lib/browser.mjs';
import { createGuard, printHostLog, writeHostLog } from './lib/guard.mjs';
import { formatKb, writeImage } from './lib/images.mjs';
import { cacheDir, checkCaptureConfig, kitDir, loadProject, repoRoot } from './lib/project.mjs';
import { serveDir } from './lib/static-server.mjs';
import { captureShot } from './lib/waits.mjs';

const SELFCHECK_SLUG = '_selfcheck';
const SELFCHECK_TARGET = 'https://example.com/';
// Distinct from 1 so a guard that lets the self-check request through is never mistaken for the expected block.
const GUARD_LEAK_EXIT = 2;
const SELFCHECK_ERROR_EXIT = 3;

const relative = (file) => path.relative(repoRoot, file).replaceAll('\\', '/');

// Every run starts from an empty slate, so a run that fails early (no browser, a throwing setup) can never leave an
// older log or image behind as evidence it did not produce.
function clearPreviousRun(dir) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    if (file === 'hosts.json' || file.endsWith('.png')) fs.rmSync(path.join(dir, file), { force: true });
  }
}

function reportHosts(dir, guard) {
  const file = writeHostLog(dir, guard.log);
  console.log(`hosts log: ${relative(file)}`);
  printHostLog(guard.log);
  return guard.blockedHosts();
}

async function capture(slug) {
  const project = checkCaptureConfig(await loadProject(slug));
  const dir = cacheDir(slug);
  clearPreviousRun(dir);
  const base = new URL(project.baseUrl);
  // Created here rather than inside the session, so a setup that throws on a blocked request is still logged.
  const guard = createGuard(project.allowHosts);

  const { width, height, deviceScaleFactor } = project.viewport;
  const captures = [];
  let failure = null;
  let server = null;
  let session = null;
  try {
    if (project.serve) {
      server = await serveDir(project.serve, { host: base.hostname.replace(/^\[|\]$/g, ''), port: Number(base.port) || 80 });
      console.log(`serving ${relative(project.serve)} at ${server.origin}`);
    }
    session = await openGuardedSession({
      guard,
      contextOptions: { viewport: { width, height }, deviceScaleFactor },
      setup: project.setup,
    });
    for (const shot of project.shots) {
      const png = await captureShot(session.context, project.baseUrl, shot);
      // A strict stub that saw an unstubbed request fails here, before the shot counts as captured.
      session.verify();
      captures.push({ shot, png });
      console.log(`  ${shot.name}: captured`);
    }
  } catch (error) {
    failure = error;
  } finally {
    // Each step settles on its own: a browser or server that fails to close must not skip the emulator teardown, and a
    // teardown that throws synchronously (a plain function) is caught like a rejected one.
    const steps = [() => session?.close(), () => server?.close()];
    if (project.teardown) steps.push(() => project.teardown());
    for (const step of steps) {
      await Promise.resolve()
        .then(step)
        .catch((error) => {
          failure ??= error;
        });
    }
  }

  const blocked = reportHosts(dir, guard);
  if (blocked.length || failure) {
    if (blocked.length) console.error(`FAIL: blocked ${blocked.join(', ')}; no capture kept (AC-062, BR-012)`);
    if (failure) console.error(`FAIL: ${failure.message}`);
    return 1;
  }

  for (const { shot, png } of captures) {
    const { file, bytes, width: w, height: h } = await writeImage(dir, `${shot.name}.png`, png);
    console.log(`  wrote ${relative(file)}  ${w}x${h}  ${formatKb(bytes)}`);
  }
  return 0;
}

// Runs the same guard a real capture uses: a loopback page must pass, and a host outside the allowlist must be refused
// both from the browser and from the Node-side request context (AC-062).
async function selfcheck() {
  const dir = cacheDir(SELFCHECK_SLUG);
  const server = await serveDir(path.join(kitDir, 'fixtures'), { host: '127.0.0.1' });
  let session = null;
  let reached = false;
  let nodeReached = false;
  try {
    session = await openGuardedSession();
    const page = await session.context.newPage();
    await page.goto(`${server.origin}/selfcheck.html`, { waitUntil: 'load' });
    const blank = await session.context.newPage();
    reached = await blank
      .goto(SELFCHECK_TARGET, { waitUntil: 'load', timeout: 15_000 })
      .then(() => true)
      .catch((error) => {
        console.log(`browser request to ${SELFCHECK_TARGET} refused: ${error.message.split('\n')[0]}`);
        return false;
      });
    nodeReached = await session.context.request
      .get(SELFCHECK_TARGET, { timeout: 15_000 })
      .then(() => true)
      .catch((error) => {
        console.log(`Node-side request to ${SELFCHECK_TARGET} refused: ${error.message.split('\n')[0]}`);
        return false;
      });
  } finally {
    await session?.close();
    await server.close();
  }

  const blocked = reportHosts(dir, session.guard);
  if (reached || nodeReached || session.guard.log.blocked['example.com'] !== 2) {
    console.error('GUARD FAILURE: example.com was not blocked; do not capture anything until this is fixed');
    return GUARD_LEAK_EXIT;
  }
  console.error(`FAIL (expected): blocked ${blocked.join(', ')}; a real run stops here with exit 1`);
  return 1;
}

async function main() {
  const [arg] = process.argv.slice(2);
  if (!arg) {
    console.error('usage: npm run listing:capture -- <slug> | --selfcheck');
    return 64;
  }
  if (arg !== '--selfcheck') return capture(arg);
  // A self-check that cannot run must not look like the expected exit 1.
  return selfcheck().catch((error) => {
    console.error(`SELF-CHECK DID NOT RUN: ${error.message}`);
    return SELFCHECK_ERROR_EXIT;
  });
}

main().then(
  (code) => {
    process.exitCode = code;
  },
  (error) => {
    console.error(`FAIL: ${error.message}`);
    process.exitCode = 1;
  },
);
