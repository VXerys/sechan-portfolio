import assert from 'node:assert/strict';
import { test } from 'node:test';

import { BlockedRequestError, classify, createGuard, guardNodeRequests, isLoopback, validateAllowHosts } from './guard.mjs';

const allowed = new Set(['localhost', '127.0.0.1', '::1', 'fonts.gstatic.com']);

test('loopback hosts pass, including bracketed IPv6', () => {
  assert.ok(isLoopback('localhost'));
  assert.ok(isLoopback('[::1]'));
  assert.equal(classify('http://[::1]:3000/', allowed).ok, true);
  assert.equal(classify('http://127.0.0.1:4317/a.css', allowed).ok, true);
});

test('hosts outside the allowlist are blocked by exact name (AC-062)', () => {
  assert.deepEqual(classify('https://example.com/', allowed), { host: 'example.com', ok: false });
  assert.equal(classify('https://fonts.gstatic.com.evil.test/x', allowed).ok, false);
  assert.equal(classify('https://sub.fonts.gstatic.com/x', allowed).ok, false);
  assert.equal(classify('wss://realtime.example.co/socket', allowed).ok, false);
});

test('non-network schemes are blocked, in-browser ones are ignored', () => {
  assert.deepEqual(classify('file:///C:/secret.txt', allowed), { host: 'file:', ok: false });
  assert.equal(classify('data:image/png;base64,AAAA', allowed), null);
  assert.equal(classify('blob:http://127.0.0.1/1', allowed), null);
});

test('allowHosts accepts exact names only, so nothing can allow every host', () => {
  assert.deepEqual(validateAllowHosts(['Fonts.GoogleAPIs.com']), ['fonts.googleapis.com']);
  for (const bad of ['*', '*.example.com', 'https://example.com', 'example.com:443', 'example.com/path', '', 'localhost', 42]) {
    assert.throws(() => validateAllowHosts([bad]), /exact host name/, `accepted ${bad}`);
  }
  assert.throws(() => validateAllowHosts('example.com'), /array/);
});

test('the guard log counts allowed and blocked hosts separately', () => {
  const guard = createGuard(['fonts.gstatic.com']);
  const handlers = [];
  guard.watch({ on: (event, handler) => handlers.push([event, handler]), request: { _innerFetch: async () => null } });
  const [[event, onRequest]] = handlers;
  assert.equal(event, 'request');
  for (const url of ['http://localhost:5173/', 'https://fonts.gstatic.com/a.woff2', 'https://example.com/', 'https://example.com/b']) {
    onRequest({ url: () => url });
  }
  assert.deepEqual(guard.log, { allowed: { localhost: 1, 'fonts.gstatic.com': 1 }, blocked: { 'example.com': 2 } });
  assert.deepEqual(guard.blockedHosts(), ['example.com']);
});

test('the Node-side hook refuses to start when the Playwright funnel is missing', () => {
  assert.throws(() => guardNodeRequests({}, () => ({ ok: true })), /_innerFetch/);
  assert.throws(() => guardNodeRequests(undefined, () => ({ ok: true })), /_innerFetch/);
});

test('the Node-side hook blocks before the driver is called and never follows redirects', async () => {
  const calls = [];
  const api = { _innerFetch: async (options) => calls.push(options) };
  const guard = createGuard([]);
  guard.watch({ on: () => {}, request: api });

  await assert.rejects(api._innerFetch({ url: 'https://example.com/rest/v1/patients' }), BlockedRequestError);
  await assert.rejects(api._innerFetch({ request: { url: () => 'https://staging.example.org/' } }), /staging\.example\.org/);
  await assert.rejects(api._innerFetch({ url: '/relative/path' }), /unparsable-url/);
  assert.equal(calls.length, 0);

  await api._innerFetch({ url: 'http://127.0.0.1:4317/seed', maxRedirects: 5 });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].maxRedirects, 0);
  assert.deepEqual(guard.log, {
    allowed: { '127.0.0.1': 1 },
    blocked: { 'example.com': 1, 'staging.example.org': 1, 'unparsable-url': 1 },
  });
});
