import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { test } from 'node:test';

import { cacheDir, checkCaptureConfig, kitDir } from './project.mjs';

// A project that starts an emulator relies on teardown running on every path, including a setup that throws; these
// drive the real capture.mjs with a gitignored _guard-test- project, like the guard and stub run tests.

function freePort() {
  return new Promise((resolve) => {
    const probe = net.createServer().listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

async function runCapture({ setupThrows }) {
  const slug = `_guard-test-${process.pid}-${Math.random().toString(36).slice(2, 8)}`;
  const projectFile = path.join(kitDir, 'projects', `${slug}.mjs`);
  const dir = cacheDir(slug);
  const marker = path.join(dir, 'teardown.txt');
  const port = await freePort();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    projectFile,
    `import fs from 'node:fs';

const project = {
  slug: ${JSON.stringify(slug)},
  baseUrl: 'http://127.0.0.1:${port}',
  serve: ${JSON.stringify(path.join(kitDir, 'fixtures'))},
  viewport: { width: 800, height: 600, deviceScaleFactor: 1 },
  setup: async () => { ${setupThrows ? "throw new Error('setup broke on purpose');" : ''} },
  teardown: async () => fs.writeFileSync(${JSON.stringify(marker)}, 'stopped'),
  shots: [{ name: 'page', path: '/selfcheck.html', waitUntil: 'load', waitFor: 'body' }],
};

export default project;
`,
  );
  try {
    const run = spawnSync(process.execPath, [path.join(kitDir, 'capture.mjs'), slug], { encoding: 'utf8', timeout: 90_000 });
    return { run, tornDown: fs.existsSync(marker), pngKept: fs.existsSync(path.join(dir, 'page.png')) };
  } finally {
    fs.rmSync(projectFile, { force: true });
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('teardown runs after a setup that throws, and the run still fails', async () => {
  const { run, tornDown, pngKept } = await runCapture({ setupThrows: true });
  assert.equal(run.status, 1, run.stderr);
  assert.match(run.stderr, /setup broke on purpose/);
  assert.equal(tornDown, true, 'teardown did not run');
  assert.equal(pngKept, false);
});

test('a load-wait shot captures and teardown runs after a clean run', async () => {
  const { run, tornDown, pngKept } = await runCapture({ setupThrows: false });
  assert.equal(run.status, 0, run.stderr);
  assert.equal(tornDown, true, 'teardown did not run');
  assert.equal(pngKept, true);
});

test('the config check rejects a teardown that is not a function and an unknown waitUntil', () => {
  const base = { slug: 'x', baseUrl: 'http://localhost:3000', viewport: { width: 10, height: 10, deviceScaleFactor: 1 }, shots: [{ name: 'a', path: '/' }] };
  assert.throws(() => checkCaptureConfig({ ...base, teardown: 'stop' }), /teardown must be a function/);
  assert.throws(() => checkCaptureConfig({ ...base, shots: [{ name: 'a', path: '/', waitUntil: 'idle' }] }), /waitUntil must be one of/);
  assert.equal(checkCaptureConfig({ ...base, shots: [{ name: 'a', path: '/', waitUntil: 'load' }] }).slug, 'x');
});
