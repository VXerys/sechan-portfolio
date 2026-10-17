import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { after, before, test } from 'node:test';

import { openGuardedSession } from './browser.mjs';
import { cacheDir, kitDir } from './project.mjs';

// These drive the real playwright-core and Chrome, so a Playwright upgrade that moves the Node-side request funnel
// fails here instead of letting a capture reach production unlogged.

const OUTSIDE = 'https://example.com/';
const STUB_HOST = 'stub.listing.test';
const BLOCKED = /listing guard blocked a Node-side request to example\.com/;

let origin;
let loopback;

before(async () => {
  loopback = http.createServer((request, response) => {
    if (request.url === '/redirect') response.writeHead(302, { location: OUTSIDE }).end();
    else response.writeHead(200, { 'content-type': 'text/plain' }).end('ok');
  });
  await new Promise((resolve) => loopback.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${loopback.address().port}`;
});

after(() => new Promise((resolve) => loopback.close(resolve)));

function freePort() {
  return new Promise((resolve) => {
    const probe = net.createServer().listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

async function withSession(options, run) {
  const session = await openGuardedSession(options);
  try {
    return await run(session);
  } finally {
    await session.close();
  }
}

test('playwright-core still funnels Node-side requests through the hooked method (pin)', async () => {
  await withSession({}, async ({ context }) => {
    assert.equal(context.request._innerFetch.name, 'guardedInnerFetch');
    const page = await context.newPage();
    assert.equal(page.request, context.request, 'page.request is no longer the context request; guard it separately');
  });
});

test('every context.request verb to a host outside the allowlist throws and is logged', async () => {
  await withSession({}, async ({ context, guard }) => {
    const verbs = ['get', 'post', 'put', 'patch', 'delete', 'head', 'fetch'];
    for (const verb of verbs) await assert.rejects(context.request[verb](OUTSIDE), BLOCKED, verb);
    assert.equal(guard.log.blocked['example.com'], verbs.length);
    assert.deepEqual(guard.blockedHosts(), ['example.com']);
  });
});

test('page.request to a host outside the allowlist throws and is logged', async () => {
  await withSession({}, async ({ context, guard }) => {
    const page = await context.newPage();
    await assert.rejects(page.request.get(OUTSIDE), BLOCKED);
    assert.equal(guard.log.blocked['example.com'], 1);
  });
});

test('route.fetch({ url }) from a setup stub and from a page route throws and is logged', async () => {
  const caught = [];
  const stub = async (route) => {
    await route.fetch({ url: OUTSIDE }).catch((error) => caught.push(error.message));
    await route.fulfill({ contentType: 'text/plain', body: 'stubbed' });
  };
  await withSession({ allowHosts: [STUB_HOST], setup: (context) => context.route(`https://${STUB_HOST}/context/**`, stub) }, async ({ context, guard }) => {
    const page = await context.newPage();
    await page.route(`https://${STUB_HOST}/page/**`, stub);
    for (const where of ['context', 'page']) {
      const response = await page.goto(`https://${STUB_HOST}/${where}/data`);
      assert.equal(await response.text(), 'stubbed');
    }
    assert.equal(caught.length, 2);
    for (const message of caught) assert.match(message, BLOCKED);
    assert.equal(guard.log.blocked['example.com'], 2);
    assert.equal(guard.log.allowed[STUB_HOST], 2);
  });
});

test('allowed Node-side requests pass and are logged, and a redirect is handed back instead of followed', async () => {
  await withSession({}, async ({ context, guard }) => {
    assert.equal(await (await context.request.get(`${origin}/seed`)).text(), 'ok');
    const redirect = await context.request.get(`${origin}/redirect`, { maxRedirects: 5 });
    assert.equal(redirect.status(), 302);
    assert.equal(redirect.headers().location, OUTSIDE);
    assert.deepEqual(guard.log, { allowed: { '127.0.0.1': 2 }, blocked: {} });
  });
});

test('a capture run whose project reaches outside hosts from Node exits 1, logs each host, and keeps no PNG', async () => {
  const slug = `_guard-test-${process.pid}`;
  const projectFile = path.join(kitDir, 'projects', `${slug}.mjs`);
  const dir = cacheDir(slug);
  const fixtures = path.join(kitDir, 'fixtures');
  const port = await freePort();
  fs.writeFileSync(
    projectFile,
    `const project = {
  slug: ${JSON.stringify(slug)},
  baseUrl: 'http://127.0.0.1:${port}',
  serve: ${JSON.stringify(fixtures)},
  viewport: { width: 800, height: 600, deviceScaleFactor: 1 },
  allowHosts: [${JSON.stringify(STUB_HOST)}],
  setup: async (context) => {
    await context.request.get('https://seed.example.net/').catch(() => null);
    await context.route('https://${STUB_HOST}/**', async (route) => {
      const response = await route.fetch({ url: 'https://upstream.example.org/' }).catch(() => null);
      await route.fulfill(response ? { response } : { body: 'stub', headers: { 'access-control-allow-origin': '*' } });
    });
  },
  shots: [
    {
      name: 'page',
      path: '/selfcheck.html',
      before: async (page) => {
        await page.request.get('https://api.example.com/').catch(() => null);
        await page.evaluate(() => fetch('https://${STUB_HOST}/data').catch(() => null));
      },
    },
  ],
};

export default project;
`,
  );
  try {
    const run = spawnSync(process.execPath, [path.join(kitDir, 'capture.mjs'), slug], { encoding: 'utf8', timeout: 90_000 });
    assert.equal(run.status, 1, run.stdout + run.stderr);
    const log = JSON.parse(fs.readFileSync(path.join(dir, 'hosts.json'), 'utf8'));
    assert.deepEqual(Object.keys(log.blocked).sort(), ['api.example.com', 'seed.example.net', 'upstream.example.org']);
    assert.equal(fs.existsSync(path.join(dir, 'page.png')), false);
  } finally {
    fs.rmSync(projectFile, { force: true });
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
