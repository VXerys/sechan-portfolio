import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { test } from 'node:test';

import { openGuardedSession } from './browser.mjs';
import { cacheDir, kitDir } from './project.mjs';
import { serveDir } from './static-server.mjs';
import { assertStubOrigin, createSupabaseStub, parseFilter, parseSelect, queryRows, sampleUser } from './supabase-stub.mjs';

const ORIGIN = 'https://stub.listing.test';
const USER = sampleUser({ id: 'auth-0001', email: 'sample.artist@example.test', fullName: 'Sample Artist' });
const ROWS = [
  { id: 'a1', user_id: 'u1', title: 'Blue Study', status: 'sold', price: 9_000_000, is_archived: false, sold_at: '2026-09-02' },
  { id: 'a2', user_id: 'u1', title: 'Red Field', status: 'wip', price: 4_500_000, is_archived: false, sold_at: null },
  { id: 'a3', user_id: 'u1', title: 'Old Sketch', status: 'concept', price: null, is_archived: true, sold_at: null },
  { id: 'a4', user_id: 'u2', title: 'Someone Else', status: 'sold', price: 12_000_000, is_archived: false, sold_at: '2026-08-14' },
];

function makeStub(extra = {}) {
  const lines = [];
  const stub = createSupabaseStub({ origin: ORIGIN, user: USER, tables: { artworks: ROWS }, log: (line) => lines.push(line), ...extra });
  return { stub, lines };
}

const get = (stub, pathAndQuery, headers = {}) => stub.handle({ method: 'GET', url: `${ORIGIN}${pathAndQuery}`, headers });
const body = (response) => JSON.parse(response.body);

test('the stub origin must be a reserved .test name and never a Supabase domain', () => {
  assert.equal(assertStubOrigin('https://artconnect-stub.test'), 'https://artconnect-stub.test');
  for (const bad of ['https://abcd.supabase.co', 'https://abcd.supabase.co.test', 'https://api.supabase.com', 'https://stub.example.com', 'https://localhost', 'https://stub.test/rest', 'ftp://stub.test', 'not a url']) {
    assert.throws(() => assertStubOrigin(bad), /Supabase stub origin/, `accepted ${bad}`);
  }
  assert.throws(() => createSupabaseStub({ origin: 'https://xyz.supabase.co', user: USER }), /real Supabase domain/);
});

test('select lists pick and alias columns, parse embeds, and report hints and JSON paths instead of guessing', () => {
  assert.deepEqual(parseSelect('id, title:name, price::text'), {
    all: false,
    columns: [
      { alias: 'id', column: 'id' },
      { alias: 'title', column: 'name' },
      { alias: 'price', column: 'price' },
    ],
    embeds: [],
    unsupported: [],
  });
  const embedded = parseSelect('*,owner:users(id,name),contacts(*)');
  assert.deepEqual(
    embedded.embeds.map(({ alias, table, select }) => ({ alias, table, columns: select.columns.map((column) => column.column), all: select.all })),
    [
      { alias: 'owner', table: 'users', columns: ['id', 'name'], all: false },
      { alias: 'contacts', table: 'contacts', columns: [], all: true },
    ],
  );
  assert.deepEqual(parseSelect('*,users!inner(id),meta->>size').unsupported, ['users!inner(id)', 'meta->>size']);
  assert.deepEqual(parseSelect('*,users!inner(id)').embeds, []);
  assert.deepEqual(parseSelect('*,users!inner(id)').unsupported, ['users!inner(id)']);
});

test('an embed answers from a declared relation, and an undeclared or nested one is reported', () => {
  const { stub, lines } = makeStub({
    tables: {
      artworks: ROWS,
      users: [
        { id: 'u1', name: 'Sample Artist', city: 'Kota Contoh' },
        { id: 'u2', name: 'Other Sample', city: 'Kota Lain' },
      ],
    },
    relations: { artworks: { users: { local: 'user_id' } } },
  });
  const rows = body(get(stub, '/rest/v1/artworks?select=id,owner:users(name),users(*)&order=id.asc&limit=2'));
  assert.deepEqual(rows, [
    { id: 'a1', owner: { name: 'Sample Artist' }, users: { id: 'u1', name: 'Sample Artist', city: 'Kota Contoh' } },
    { id: 'a2', owner: { name: 'Sample Artist' }, users: { id: 'u1', name: 'Sample Artist', city: 'Kota Contoh' } },
  ]);
  get(stub, '/rest/v1/artworks?select=*,buyers(name)');
  get(stub, '/rest/v1/artworks?select=*,users(name,friends(name))');
  get(stub, '/rest/v1/artworks?select=*,users(name)&users.city=eq.Kota%20Contoh');
  assert.deepEqual(lines.filter((line) => line.includes('MISSING')), [
    '  supabase stub: MISSING artworks query select buyers(name) (no relation) (ignored)',
    '  supabase stub: MISSING artworks query select users(name,friends(name)) (nested) (ignored)',
    '  supabase stub: MISSING artworks query users.city filter on an embed (ignored)',
  ]);
});

test('eq filters, order, limit, and offset follow PostgREST, and the count covers every match', () => {
  const params = new URLSearchParams('select=id,title&user_id=eq.u1&is_archived=eq.false&order=price.desc.nullslast&offset=0&limit=1');
  const result = queryRows(ROWS, params);
  assert.deepEqual(result.rows, [{ id: 'a1', title: 'Blue Study' }]);
  assert.equal(result.total, 2);
  assert.deepEqual(result.unsupported, []);
});

test('the other comparison operators filter rows too', () => {
  const ids = (query) => queryRows(ROWS, new URLSearchParams(query)).rows.map((row) => row.id);
  assert.deepEqual(ids('price=gte.9000000&order=id.asc'), ['a1', 'a4']);
  assert.deepEqual(ids('sold_at=is.null&order=id.asc'), ['a2', 'a3']);
  assert.deepEqual(ids('status=in.(wip,concept)&order=id.asc'), ['a2', 'a3']);
  assert.deepEqual(ids('status=not.eq.sold&order=id.asc'), ['a2', 'a3']);
  assert.deepEqual(ids('title=ilike.*study*'), ['a1']);
  assert.deepEqual(ids('sold_at=gte.2026-09-01'), ['a1']);
  assert.deepEqual(parseFilter('tags', 'ov.{a}').supported, false);
});

test('a counted read answers Content-Range with the total, and HEAD answers the count without a body', () => {
  const { stub } = makeStub();
  const counted = get(stub, '/rest/v1/artworks?select=*&user_id=eq.u1&is_archived=eq.false&offset=0&limit=1', { prefer: 'count=exact' });
  assert.equal(counted.status, 200);
  assert.equal(counted.headers['content-range'], '0-0/2');
  assert.equal(body(counted).length, 1);

  const uncounted = get(stub, '/rest/v1/artworks?select=id&user_id=eq.u2');
  assert.equal(uncounted.headers['content-range'], '0-0/*');

  const head = stub.handle({ method: 'HEAD', url: `${ORIGIN}/rest/v1/artworks?select=*&status=eq.sold`, headers: { prefer: 'count=exact' } });
  assert.equal(head.body, '');
  assert.equal(head.headers['content-range'], '0-1/2');

  const none = get(stub, '/rest/v1/artworks?select=*&user_id=eq.nobody', { prefer: 'count=exact' });
  assert.equal(none.headers['content-range'], '*/0');
});

test('single() gets one object, or a 406 when the filter does not narrow to one row', () => {
  const { stub } = makeStub();
  const accept = 'application/vnd.pgrst.object+json';
  assert.equal(body(get(stub, '/rest/v1/artworks?select=*&id=eq.a2', { accept })).title, 'Red Field');
  const many = get(stub, '/rest/v1/artworks?select=*&user_id=eq.u1', { accept });
  assert.equal(many.status, 406);
  assert.equal(body(many).code, 'PGRST116');
});

test('an unknown table answers [] and is logged once, so a missing stub is visible in the run output', () => {
  const { stub, lines } = makeStub();
  for (let round = 0; round < 3; round += 1) {
    const response = get(stub, '/rest/v1/pipeline_items?select=*');
    assert.equal(response.status, 200);
    assert.deepEqual(body(response), []);
  }
  assert.deepEqual(lines, ['  supabase stub: MISSING table pipeline_items (answered [])']);
  assert.deepEqual([...stub.misses], ['table pipeline_items (answered [])']);
});

test('unsupported filters, unknown functions, writes, and unknown paths are all logged', () => {
  const { stub, lines } = makeStub({ rpc: { link_profile: (args) => [{ id: 'u1', echoed: args.p_auth_id }] } });
  get(stub, '/rest/v1/artworks?select=*&or=(title.ilike.*a*)');
  assert.equal(stub.handle({ method: 'POST', url: `${ORIGIN}/rest/v1/rpc/link_profile`, postData: '{"p_auth_id":"auth-0001"}' }).body, '[{"id":"u1","echoed":"auth-0001"}]');
  assert.equal(stub.handle({ method: 'POST', url: `${ORIGIN}/rest/v1/rpc/unknown_fn`, postData: '{}' }).status, 404);
  assert.equal(stub.handle({ method: 'PATCH', url: `${ORIGIN}/rest/v1/artworks?id=eq.a1`, postData: '{"status":"wip"}' }).status, 200);
  assert.equal(get(stub, '/functions/v1/send-mail').status, 404);
  assert.equal(get(stub, '/storage/v1/object/public/artworks/missing.svg').status, 404);
  const missing = lines.filter((line) => line.includes('MISSING'));
  assert.deepEqual(missing, [
    '  supabase stub: MISSING artworks query or filter (ignored)',
    '  supabase stub: MISSING rpc unknown_fn',
    '  supabase stub: MISSING write PATCH artworks (not applied)',
    '  supabase stub: MISSING GET /functions/v1/send-mail',
    '  supabase stub: MISSING storage GET /storage/v1/object/public/artworks/missing.svg',
  ]);
  assert.equal(ROWS[0].status, 'sold', 'a write must never change the fixtures');
});

test('auth answers the sample user and session, and nothing in it is a usable token', () => {
  const { stub } = makeStub();
  assert.equal(body(get(stub, '/auth/v1/user')).email, USER.email);
  const session = body(stub.handle({ method: 'POST', url: `${ORIGIN}/auth/v1/token?grant_type=refresh_token` }));
  assert.equal(session.user.id, USER.id);
  const [header, payload] = session.access_token.split('.').slice(0, 2).map((part) => JSON.parse(Buffer.from(part, 'base64url').toString()));
  assert.equal(header.alg, 'none');
  assert.equal(payload.sub, USER.id);
  assert.ok(payload.exp > Date.now() / 1000);
});

test('the stub refuses to answer for any origin but its own', () => {
  const { stub } = makeStub();
  assert.throws(() => stub.handle({ method: 'GET', url: 'https://abcd.supabase.co/rest/v1/artworks' }), /not https:\/\/stub\.listing\.test/);
});

test('a fixture that throws answers 500 with a MISSING line instead of leaving the request unanswered', () => {
  const { stub, lines } = makeStub({
    rpc: {
      broken: () => {
        throw new Error('fixture has no row for p_id');
      },
    },
  });
  const response = stub.answer({ method: 'POST', url: `${ORIGIN}/rest/v1/rpc/broken`, headers: { origin: 'http://127.0.0.1:3000' }, postData: '{}' });
  assert.equal(response.status, 500);
  assert.equal(body(response).code, 'STUB500');
  assert.equal(response.headers['access-control-allow-origin'], 'http://127.0.0.1:3000', 'a 500 the browser cannot read is as silent as no answer');
  assert.deepEqual(lines.filter((line) => line.includes('MISSING')), ['  supabase stub: MISSING error POST /rest/v1/rpc/broken: fixture has no row for p_id']);

  assert.throws(() => stub.handle({ method: 'GET', url: 'https://abcd.supabase.co/rest/v1/artworks' }));
  assert.equal(stub.answer({ method: 'GET', url: 'https://abcd.supabase.co/rest/v1/artworks' }).status, 500);
});

test('strict turns any MISSING line into a failed check, and a lenient stub only logs', () => {
  const lenient = makeStub().stub;
  get(lenient, '/rest/v1/patients?select=*');
  assert.doesNotThrow(() => lenient.verify());

  const strict = makeStub({ strict: true }).stub;
  get(strict, '/rest/v1/artworks?select=*&status=eq.sold');
  assert.doesNotThrow(() => strict.verify(), 'a fully stubbed read passes');
  get(strict, '/rest/v1/artworks?select=*&or=(title.ilike.*a*)');
  get(strict, '/rest/v1/patients?select=*');
  assert.throws(() => strict.verify(), /strict and 2 request\(s\) had no stub: artworks query or filter \(ignored\); table patients \(answered \[\]\)/);
});

function freePort() {
  return new Promise((resolve) => {
    const probe = net.createServer().listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

// Same pattern as the guard run tests: a _guard-test- project (gitignored) drives the real capture.mjs, and a stale
// image is planted first, so a failed strict run is shown to leave no PNG behind.
async function runStrictCapture(table) {
  const slug = `_guard-test-${process.pid}-${Math.random().toString(36).slice(2, 8)}`;
  const projectFile = path.join(kitDir, 'projects', `${slug}.mjs`);
  const dir = cacheDir(slug);
  const port = await freePort();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.png'), 'stale');
  const stubModule = pathToFileURL(path.join(kitDir, 'lib', 'supabase-stub.mjs')).href;
  fs.writeFileSync(
    projectFile,
    `import { createSupabaseStub, sampleUser } from ${JSON.stringify(stubModule)};

const stub = createSupabaseStub({
  origin: ${JSON.stringify(ORIGIN)},
  user: sampleUser({ id: 'auth-0001', email: 'sample.owner@example.test', fullName: 'Sample Owner' }),
  tables: { visits: [{ id: 'v1', status: 'done' }] },
  storageKey: 'strict-test-auth',
  strict: true,
});

const project = {
  slug: ${JSON.stringify(slug)},
  baseUrl: 'http://127.0.0.1:${port}',
  serve: ${JSON.stringify(path.join(kitDir, 'fixtures'))},
  viewport: { width: 800, height: 600, deviceScaleFactor: 1 },
  allowHosts: [stub.host],
  setup: (context) => stub.install(context),
  shots: [{ name: 'page', path: '/selfcheck.html', before: (page) => page.evaluate((url) => fetch(url).then((response) => response.json()), ${JSON.stringify(`${ORIGIN}/rest/v1/`)} + ${JSON.stringify(table)} + '?select=*') }],
};

export default project;
`,
  );
  try {
    const run = spawnSync(process.execPath, [path.join(kitDir, 'capture.mjs'), slug], { encoding: 'utf8', timeout: 90_000 });
    return { run, pngKept: fs.existsSync(path.join(dir, 'page.png')) };
  } finally {
    fs.rmSync(projectFile, { force: true });
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('a capture with a strict stub exits 1 and keeps no PNG when a shot reads an unstubbed table', async () => {
  const { run, pngKept } = await runStrictCapture('patients');
  assert.equal(run.status, 1, run.stdout + run.stderr);
  assert.match(run.stderr, /FAIL: Supabase stub is strict and 1 request\(s\) had no stub: table patients/);
  assert.equal(pngKept, false);
});

test('a capture with a strict stub keeps its PNG when every request is stubbed', async () => {
  const { run, pngKept } = await runStrictCapture('visits');
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.equal(pngKept, true);
});

test('in Chrome behind the guard, the stub answers a cross-origin Supabase-style fetch and nothing leaves', async () => {
  const server = await serveDir(path.join(kitDir, 'fixtures'), { host: '127.0.0.1' });
  const lines = [];
  const stub = createSupabaseStub({ origin: ORIGIN, user: USER, tables: { artworks: ROWS }, storageKey: 'stub-test-auth', log: (line) => lines.push(line) });
  const session = await openGuardedSession({ allowHosts: [stub.host], setup: (context) => stub.install(context) });
  try {
    const page = await session.context.newPage();
    await page.goto(`${server.origin}/selfcheck.html`);
    const result = await page.evaluate(async (origin) => {
      const response = await fetch(`${origin}/rest/v1/artworks?select=id,title&user_id=eq.u1&is_archived=eq.false&order=id.asc`, {
        headers: { apikey: 'dummy', authorization: 'Bearer dummy', prefer: 'count=exact', 'x-client-info': 'listing-test' },
      });
      return { status: response.status, range: response.headers.get('content-range'), rows: await response.json(), stored: localStorage.getItem('stub-test-auth') !== null };
    }, ORIGIN);
    assert.deepEqual(result, { status: 200, range: '0-1/2', rows: [{ id: 'a1', title: 'Blue Study' }, { id: 'a2', title: 'Red Field' }], stored: true });
    assert.deepEqual(session.guard.blockedHosts(), []);
    assert.ok(session.guard.log.allowed['stub.listing.test'] >= 1);
    assert.deepEqual(lines, ['  supabase stub: served table artworks']);
  } finally {
    await session.close();
    await server.close();
  }
});
