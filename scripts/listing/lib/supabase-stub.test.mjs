import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';

import { openGuardedSession } from './browser.mjs';
import { kitDir } from './project.mjs';
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

test('select lists pick and alias columns, and embeds are reported instead of guessed', () => {
  assert.deepEqual(parseSelect('id, title:name, price::text'), {
    all: false,
    columns: [
      { alias: 'id', column: 'id' },
      { alias: 'title', column: 'name' },
      { alias: 'price', column: 'price' },
    ],
    unsupported: [],
  });
  assert.deepEqual(parseSelect('*, contacts(name, email)').unsupported, ['contacts(name, email)']);
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
