import fs from 'node:fs';
import path from 'node:path';

export const LOOPBACK_HOSTS = Object.freeze(['localhost', '127.0.0.1', '::1']);

const HOST_NAME = /^(?=.{1,253}$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;
// These never leave the browser process, so they are neither allowed nor blocked traffic.
const LOCAL_SCHEMES = new Set(['data:', 'blob:', 'about:']);
const NETWORK_SCHEMES = new Set(['http:', 'https:', 'ws:', 'wss:']);

export function normalizeHost(hostname) {
  return String(hostname).toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');
}

export function isLoopback(hostname) {
  return LOOPBACK_HOSTS.includes(normalizeHost(hostname));
}

// Exact names only: a wildcard, scheme, or port here could widen the allowlist past what a reviewer reads in the shot list.
export function validateAllowHosts(list) {
  if (list === undefined || list === null) return [];
  if (!Array.isArray(list)) throw new Error('allowHosts must be an array of exact host names');
  return list.map((entry) => {
    const host = typeof entry === 'string' ? entry.toLowerCase() : '';
    if (!HOST_NAME.test(host)) {
      throw new Error(`allowHosts entry ${JSON.stringify(entry)} is not an exact host name (no scheme, port, path, or wildcard)`);
    }
    return host;
  });
}

// Returns null for in-browser URLs, otherwise the host key used in hosts.json and whether it may pass.
export function classify(url, allowed) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return { host: 'unparsable-url', ok: false };
  }
  if (LOCAL_SCHEMES.has(parsed.protocol)) return null;
  if (!NETWORK_SCHEMES.has(parsed.protocol)) return { host: parsed.protocol, ok: false };
  const host = normalizeHost(parsed.hostname);
  return { host, ok: allowed.has(host) };
}

export class BlockedRequestError extends Error {
  constructor(host) {
    super(`listing guard blocked a Node-side request to ${host}`);
    this.name = 'BlockedRequestError';
    this.host = host;
  }
}

// context.request, page.request (the same object), and route.fetch() run in the Playwright driver over Node http:
// Chrome never sees them, so the route, the request event, and the resolver rule all miss them. Every one of them
// goes through APIRequestContext._innerFetch, a private method, so the guard wraps that single funnel and refuses to
// start when it is missing rather than run blind. Redirects are not followed, because the driver would follow a
// Location to any host without asking; a 3xx comes back to the caller instead (route.fulfill hands it to Chrome,
// where the next hop meets the browser guard).
export function guardNodeRequests(apiRequest, judge) {
  const innerFetch = apiRequest?._innerFetch;
  if (typeof innerFetch !== 'function') {
    throw new Error('playwright-core no longer exposes APIRequestContext._innerFetch, so Node-side requests cannot be guarded; update scripts/listing/lib/guard.mjs before capturing');
  }
  apiRequest._innerFetch = async function guardedInnerFetch(options = {}) {
    const verdict = judge(String(options.url ?? options.request?.url() ?? ''));
    if (!verdict.ok) throw new BlockedRequestError(verdict.host);
    return innerFetch.call(this, { ...options, maxRedirects: 0 });
  };
}

export function createGuard(allowHosts) {
  const allowed = new Set([...LOOPBACK_HOSTS, ...validateAllowHosts(allowHosts)]);
  const log = { allowed: {}, blocked: {} };
  const count = (verdict) => {
    const bucket = verdict.ok ? log.allowed : log.blocked;
    bucket[verdict.host] = (bucket[verdict.host] ?? 0) + 1;
  };

  return {
    hosts: [...allowed],
    log,
    blockedHosts: () => Object.keys(log.blocked),

    // Counts from the request event, not the route, so a request that some later route let through still fails the run.
    // Runs before the project's setup, so the Node-side hook is in place before setup can seed or stub anything.
    watch(context) {
      context.on('request', (request) => {
        const verdict = classify(request.url(), allowed);
        if (verdict) count(verdict);
      });
      guardNodeRequests(context.request, (url) => {
        // data:, blob:, and about: are harmless in Chrome but meaningless to the driver, so here they count as blocked.
        const verdict = classify(url, allowed) ?? { host: new URL(url).protocol, ok: false };
        count(verdict);
        return verdict;
      });
    },

    // Registered after the project's stubs: Playwright runs the newest matching route first, so the guard decides before any stub can continue a request.
    async enforce(context) {
      await context.routeWebSocket(() => true, (socket) => {
        const verdict = classify(socket.url(), allowed) ?? { host: 'unparsable-url', ok: false };
        count(verdict);
        if (verdict.ok) socket.connectToServer();
        else socket.close({ code: 1008, reason: 'blocked by listing guard' });
      });
      await context.route('**/*', (route) => {
        const verdict = classify(route.request().url(), allowed);
        if (verdict && !verdict.ok) return route.abort('blockedbyclient');
        return route.fallback();
      });
    },
  };
}

const sortedEntries = (bucket) => Object.entries(bucket).sort(([a], [b]) => a.localeCompare(b));

export function writeHostLog(dir, log, name = 'hosts.json') {
  const sorted = (bucket) => Object.fromEntries(sortedEntries(bucket));
  const file = path.join(dir, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify({ allowed: sorted(log.allowed), blocked: sorted(log.blocked) }, null, 2)}\n`);
  return file;
}

export function printHostLog(log) {
  for (const [bucket, label] of [['allowed', 'allowed'], ['blocked', 'BLOCKED']]) {
    const entries = sortedEntries(log[bucket]);
    if (!entries.length) console.log(`  ${label}: none`);
    for (const [host, total] of entries) console.log(`  ${label}: ${host} x${total}`);
  }
}
