// Answers a Supabase client from fixtures, so an app built on Supabase renders signed in without any real project.
// Every request to the stub origin is fulfilled here and never continued: a path the fixtures do not cover gets an
// empty or 404 answer and a log line, so a missing stub shows up in the run output instead of as a silent blank screen.

const RESERVED_TLD = '.test';
// A .test name cannot resolve (RFC 6761), so even a request that slipped past the route could not reach a real host.
// The Supabase check is a second, readable wall: a config pointed at a real project fails before any route exists.
const SUPABASE_DOMAIN = /(^|\.)supabase\.(co|com|in|net|io)(\.|$)/;

const READ_PARAMS = new Set(['select', 'order', 'limit', 'offset', 'columns', 'on_conflict']);
const OPERATORS = new Set(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'is', 'in', 'like', 'ilike']);
const OBJECT_ACCEPT = 'application/vnd.pgrst.object+json';

export function assertStubOrigin(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Supabase stub origin "${value}" is not a URL`);
  }
  const host = url.hostname.toLowerCase();
  if (SUPABASE_DOMAIN.test(host)) throw new Error(`Supabase stub origin ${url.origin} is a real Supabase domain; use a name under ${RESERVED_TLD}`);
  if (!host.endsWith(RESERVED_TLD)) throw new Error(`Supabase stub origin ${url.origin} must be a name under ${RESERVED_TLD}, which never resolves`);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error(`Supabase stub origin ${url.origin} must be http or https`);
  if (url.pathname !== '/' || url.search || url.hash) throw new Error(`Supabase stub origin "${value}" must be an origin without a path`);
  return url.origin;
}

const base64url = (value) => Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)).toString('base64url');

// Unsigned on purpose: the client only decodes the payload for exp, and a token that verifies nowhere is the point.
export function stubAccessToken(claims) {
  return [base64url({ alg: 'none', typ: 'JWT' }), base64url(claims), base64url('stub-signature')].join('.');
}

export function sampleUser({ id, email, fullName, createdAt = '2026-01-05T08:00:00.000Z', metadata = {} }) {
  return {
    id,
    aud: 'authenticated',
    role: 'authenticated',
    email,
    email_confirmed_at: createdAt,
    phone: '',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { full_name: fullName, ...metadata },
    identities: [],
    created_at: createdAt,
    updated_at: createdAt,
  };
}

export function sampleSession(user, { origin, now = Date.now(), ttlSeconds = 12 * 60 * 60 } = {}) {
  const iat = Math.floor(now / 1000);
  const exp = iat + ttlSeconds;
  return {
    access_token: stubAccessToken({ iss: `${origin}/auth/v1`, sub: user.id, aud: 'authenticated', role: 'authenticated', email: user.email, iat, exp }),
    token_type: 'bearer',
    expires_in: ttlSeconds,
    expires_at: exp,
    refresh_token: 'stub-refresh-token',
    user,
  };
}

// Splits on commas outside parentheses, so an embedded resource stays one entry and can be reported as unsupported.
function splitTopLevel(text) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const char of text) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (char === ',' && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current);
  return parts.map((part) => part.trim()).filter(Boolean);
}

export function parseSelect(select) {
  if (!select) return { all: true, columns: [], unsupported: [] };
  const columns = [];
  const unsupported = [];
  let all = false;
  for (const entry of splitTopLevel(select)) {
    if (entry === '*') {
      all = true;
      continue;
    }
    if (entry.includes('(') || entry.includes('->')) {
      unsupported.push(entry);
      continue;
    }
    const [left, right] = entry.split('::')[0].split(':');
    const column = (right ?? left).trim();
    columns.push({ alias: left.trim(), column });
  }
  return { all, columns, unsupported };
}

function parseList(text) {
  const inner = text.replace(/^\(|\)$/g, '');
  return splitTopLevel(inner).map((item) => item.replace(/^"|"$/g, ''));
}

export function parseFilter(column, raw) {
  const negate = raw.startsWith('not.');
  const rest = negate ? raw.slice(4) : raw;
  const dot = rest.indexOf('.');
  const op = dot === -1 ? rest : rest.slice(0, dot);
  const value = dot === -1 ? '' : rest.slice(dot + 1);
  if (!OPERATORS.has(op)) return { column, op, value, negate, supported: false };
  return { column, op, value: op === 'in' ? parseList(value) : value, negate, supported: true };
}

function compare(rowValue, text) {
  if (typeof rowValue === 'number') return rowValue - Number(text);
  return String(rowValue).localeCompare(text);
}

function likeToRegExp(pattern, flags) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/[*%]/g, '.*').replace(/_/g, '.');
  return new RegExp(`^${escaped}$`, flags);
}

export function matches(row, { column, op, value, negate }) {
  const cell = row[column];
  let result;
  if (op === 'is') {
    const wanted = { null: null, true: true, false: false }[value.toLowerCase()];
    result = cell === wanted || (wanted === null && cell === undefined);
  } else if (cell === null || cell === undefined) {
    result = false;
  } else if (op === 'eq') result = String(cell) === value;
  else if (op === 'neq') result = String(cell) !== value;
  else if (op === 'in') result = value.includes(String(cell));
  else if (op === 'like') result = likeToRegExp(value, '').test(String(cell));
  else if (op === 'ilike') result = likeToRegExp(value, 'i').test(String(cell));
  else {
    const order = compare(cell, value);
    result = { gt: order > 0, gte: order >= 0, lt: order < 0, lte: order <= 0 }[op];
  }
  return negate ? !result : result;
}

// Postgres order: ascending puts nulls last and descending puts them first, unless the query says otherwise.
export function parseOrder(order) {
  if (!order) return [];
  return splitTopLevel(order).map((term) => {
    const [column, ...flags] = term.split('.');
    const descending = flags.includes('desc');
    const nullsFirst = flags.includes('nullsfirst') || (descending && !flags.includes('nullslast'));
    return { column, descending, nullsFirst };
  });
}

function sortRows(rows, terms) {
  return [...rows].sort((a, b) => {
    for (const { column, descending, nullsFirst } of terms) {
      const left = a[column] ?? null;
      const right = b[column] ?? null;
      if (left === right) continue;
      if (left === null) return nullsFirst ? -1 : 1;
      if (right === null) return nullsFirst ? 1 : -1;
      const order = typeof left === 'number' && typeof right === 'number' ? left - right : String(left).localeCompare(String(right));
      if (order !== 0) return descending ? -order : order;
    }
    return 0;
  });
}

function project(row, selection) {
  if (selection.all && !selection.columns.length) return { ...row };
  const picked = selection.all ? { ...row } : {};
  for (const { alias, column } of selection.columns) picked[alias] = row[column] ?? null;
  return picked;
}

// Pure PostgREST read: filter, then count, then order and slice, as the server does, so a count=exact answer
// reports every matching row while the body holds only the requested page.
export function queryRows(rows, searchParams) {
  const selection = parseSelect(searchParams.get('select'));
  const filters = [];
  const unsupported = selection.unsupported.map((entry) => `select ${entry}`);
  for (const [key, raw] of searchParams) {
    if (READ_PARAMS.has(key)) continue;
    if (key === 'or' || key === 'and' || key === 'not') {
      unsupported.push(`${key} filter`);
      continue;
    }
    const filter = parseFilter(key, raw);
    if (filter.supported) filters.push(filter);
    else unsupported.push(`${key}=${filter.op}`);
  }
  const matched = rows.filter((row) => filters.every((filter) => matches(row, filter)));
  const sorted = sortRows(matched, parseOrder(searchParams.get('order')));
  const offset = Number(searchParams.get('offset') ?? 0) || 0;
  const limitParam = searchParams.get('limit');
  const limit = limitParam === null ? Infinity : Number(limitParam);
  const page = sorted.slice(offset, offset + limit).map((row) => project(row, selection));
  return { rows: page, total: matched.length, offset, unsupported };
}

function contentRange(offset, length, total) {
  return length ? `${offset}-${offset + length - 1}/${total}` : `*/${total}`;
}

function corsHeaders(headers) {
  return {
    'access-control-allow-origin': headers.origin ?? '*',
    'access-control-allow-methods': 'GET, HEAD, POST, PATCH, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': headers['access-control-request-headers'] ?? 'authorization, apikey, content-type, prefer, range, x-client-info',
    'access-control-expose-headers': 'content-range, x-total-count',
  };
}

const json = (status, body, extra = {}) => ({ status, headers: { 'content-type': 'application/json; charset=utf-8', ...extra }, body: body === undefined ? '' : JSON.stringify(body) });
const notFound = (message) => json(404, { code: 'STUB404', message, details: null, hint: 'add it to the project stub fixtures' });

export function createSupabaseStub({ origin, user, session, tables = {}, rpc = {}, files = {}, storageKey, signedOutPaths = [], log = (line) => console.log(line) }) {
  const stubOrigin = assertStubOrigin(origin);
  if (!user?.id || !user?.email) throw new Error('Supabase stub needs a sample user with id and email (see sampleUser)');
  const activeSession = session ?? sampleSession(user, { origin: stubOrigin });
  const key = storageKey ?? `sb-${new URL(stubOrigin).hostname.split('.')[0]}-auth-token`;
  const misses = new Set();
  const served = new Set();

  const miss = (text) => {
    if (misses.has(text)) return;
    misses.add(text);
    log(`  supabase stub: MISSING ${text}`);
  };
  const serve = (text) => {
    if (served.has(text)) return;
    served.add(text);
    log(`  supabase stub: served ${text}`);
  };

  function auth(method, path) {
    if (path === '/auth/v1/user') return json(200, user);
    if (path === '/auth/v1/token') return json(200, activeSession);
    if (path === '/auth/v1/logout') return { status: 204, headers: {}, body: '' };
    miss(`auth ${method} ${path}`);
    return notFound(`no auth stub for ${path}`);
  }

  function rest(method, url, headers, postData) {
    const path = url.pathname.slice('/rest/v1/'.length);
    if (path.startsWith('rpc/')) {
      const name = path.slice(4);
      if (!(name in rpc)) {
        miss(`rpc ${name}`);
        return json(404, { code: 'PGRST202', message: `stub has no function ${name}`, details: null, hint: null });
      }
      serve(`rpc ${name}`);
      let args = {};
      try {
        args = postData ? JSON.parse(postData) : {};
      } catch {
        args = {};
      }
      return json(200, rpc[name](args));
    }

    const table = path;
    if (method !== 'GET' && method !== 'HEAD') {
      // A capture only reads; fixtures never change, so a write cannot leave state that differs between shots.
      miss(`write ${method} ${table} (not applied)`);
      return json(method === 'POST' ? 201 : 200, []);
    }
    if (!(table in tables)) {
      miss(`table ${table} (answered [])`);
      return json(200, [], { 'content-range': '*/0' });
    }
    const { rows, total, offset, unsupported } = queryRows(tables[table], url.searchParams);
    for (const entry of unsupported) miss(`${table} query ${entry} (ignored)`);
    serve(`table ${table}`);
    const counted = /count=(exact|planned|estimated)/.test(headers.prefer ?? '');
    const range = { 'content-range': contentRange(offset, rows.length, counted ? total : '*') };
    if (method === 'HEAD') return { status: 200, headers: range, body: '' };
    if ((headers.accept ?? '').includes(OBJECT_ACCEPT)) {
      if (rows.length !== 1) {
        return json(406, { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned', details: `The result contains ${rows.length} rows`, hint: null });
      }
      return json(200, rows[0], range);
    }
    return json(200, rows, range);
  }

  function storage(method, path) {
    const prefix = '/storage/v1/object/public/';
    const file = path.startsWith(prefix) ? files[decodeURIComponent(path.slice(prefix.length))] : undefined;
    if (!file) {
      miss(`storage ${method} ${path}`);
      return notFound(`no stub file at ${path}`);
    }
    serve(`storage ${path.slice(prefix.length).split('/')[0]}`);
    return { status: 200, headers: { 'content-type': file.contentType, 'cache-control': 'no-store' }, body: file.body };
  }

  // Plain data in, plain response out, so the unit tests exercise exactly what a capture serves.
  function handle({ method, url, headers = {}, postData = null }) {
    const parsed = new URL(url);
    let response;
    if (parsed.origin !== stubOrigin) throw new Error(`Supabase stub asked to answer ${parsed.origin}, not ${stubOrigin}`);
    if (method === 'OPTIONS') response = { status: 204, headers: {}, body: '' };
    else if (parsed.pathname.startsWith('/auth/v1/')) response = auth(method, parsed.pathname);
    else if (parsed.pathname.startsWith('/rest/v1/')) response = rest(method, parsed, headers, postData);
    else if (parsed.pathname.startsWith('/storage/v1/')) response = storage(method, parsed.pathname);
    else {
      miss(`${method} ${parsed.pathname}`);
      response = notFound(`no stub for ${parsed.pathname}`);
    }
    return { ...response, headers: { ...corsHeaders(headers), ...response.headers } };
  }

  async function install(context) {
    await context.addInitScript(
      ({ storageKey: name, value, signedOut }) => {
        try {
          if (signedOut.includes(window.location.pathname)) window.localStorage.removeItem(name);
          else window.localStorage.setItem(name, value);
        } catch {
          // An opaque frame (about:blank, a font iframe) has no storage; the app's own pages always do.
        }
      },
      { storageKey: key, value: JSON.stringify(activeSession), signedOut: signedOutPaths },
    );
    await context.route(
      (url) => url.origin === stubOrigin,
      async (route) => {
        const request = route.request();
        const response = handle({ method: request.method(), url: request.url(), headers: request.headers(), postData: request.postData() });
        await route.fulfill(response);
      },
    );
  }

  return { origin: stubOrigin, host: new URL(stubOrigin).hostname, storageKey: key, session: activeSession, misses, handle, install };
}
