import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';

import { cacheDir } from './project.mjs';

export const EMULATOR_HOST = '127.0.0.1';
// Away from the emulator defaults (8080, 9099, 4400, 4500) so a developer's own emulator or dev server on the
// usual ports is never seeded or screenshotted by mistake.
export const DEFAULT_PORTS = Object.freeze({ auth: 9399, firestore: 8399, firestoreWebsocket: 9398, hub: 4399, logging: 4499 });
export const DEFAULT_JAVA_HOME = 'C:\\Program Files\\Android\\Android Studio\\jbr';

const START_TIMEOUT_MS = 90_000;
const STOP_TIMEOUT_MS = 15_000;
const PORT_NAMES = Object.keys(DEFAULT_PORTS);
// Firebase project ids are 6 to 30 lowercase letters, digits, and hyphens.
const PROJECT_ID = /^[a-z][a-z0-9-]{4,28}[a-z0-9]$/;
// The emulator's admin bypass: requests with this bearer skip security rules and are accepted only by an emulator.
const OWNER = { authorization: 'Bearer owner' };

// A demo- project has no real counterpart, so an SDK or CLI call that slips past the emulator fails instead of
// reaching a live Firebase project (BR-012).
export function assertDemoProjectId(projectId) {
  const id = String(projectId ?? '');
  if (!id.startsWith('demo-')) throw new Error(`Firebase emulator project id must start with "demo-" (BR-012); got ${JSON.stringify(projectId)}`);
  if (!PROJECT_ID.test(id)) throw new Error(`"${id}" is not a valid Firebase project id (6 to 30 lowercase letters, digits, hyphens)`);
  return id;
}

export function resolvePorts(ports = {}) {
  const merged = { ...DEFAULT_PORTS, ...ports };
  const unknown = Object.keys(merged).filter((name) => !PORT_NAMES.includes(name));
  if (unknown.length) throw new Error(`unknown emulator port name(s): ${unknown.join(', ')}`);
  for (const [name, port] of Object.entries(merged)) {
    if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error(`emulator port ${name} must be an integer from 1024 to 65535; got ${port}`);
  }
  if (new Set(Object.values(merged)).size !== PORT_NAMES.length) throw new Error('emulator ports must all differ');
  return Object.freeze(merged);
}

export function emulatorDir(slug) {
  return path.join(cacheDir(slug), 'emulator');
}

// The config lives in the gitignored cache, never in a client repository, and binds every emulator service to
// loopback; the UI stays off because the capture never needs it.
export function writeEmulatorConfig(slug, ports) {
  const resolved = resolvePorts(ports);
  const dir = emulatorDir(slug);
  const config = {
    emulators: {
      auth: { host: EMULATOR_HOST, port: resolved.auth },
      firestore: { host: EMULATOR_HOST, port: resolved.firestore, websocketPort: resolved.firestoreWebsocket },
      hub: { host: EMULATOR_HOST, port: resolved.hub },
      logging: { host: EMULATOR_HOST, port: resolved.logging },
      ui: { enabled: false },
      singleProjectMode: true,
    },
  };
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'firebase.json');
  fs.writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`);
  return { dir, file, config, ports: resolved };
}

// Plain JavaScript values to the Firestore REST Value shape. Whole numbers become integerValue, as the web SDK
// stores them; anything without an exact Firestore type throws rather than being stored as something else.
export function toFirestoreValue(value) {
  if (value === null) return { nullValue: null };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error(`cannot store ${value} in Firestore`);
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) throw new Error('cannot store an invalid Date in Firestore');
    return { timestampValue: value.toISOString() };
  }
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toFirestoreValue) } };
  if (typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    return { mapValue: { fields: toFirestoreFields(value) } };
  }
  throw new Error(`cannot store a ${typeof value} in Firestore`);
}

export function toFirestoreFields(object) {
  const fields = {};
  for (const [key, value] of Object.entries(object)) {
    if (value === undefined) continue;
    fields[key] = toFirestoreValue(value);
  }
  return fields;
}

// A CI token or service-account path in the caller's shell would let the CLI act as a real account; the emulator never
// needs either, so they are dropped. Windows env names are case-insensitive, so the match is too.
const DROPPED_ENV = new Set(['FIREBASE_TOKEN', 'GOOGLE_APPLICATION_CREDENTIALS']);

export function emulatorEnv(baseEnv, javaHome) {
  const entries = Object.entries(baseEnv);
  const basePath = entries.find(([name]) => name.toUpperCase() === 'PATH')?.[1] ?? '';
  // JAVA_HOME and PATH change for this child only; the CLI looks Java up on PATH, and the machine has none.
  const overrides = { JAVA_HOME: javaHome, PATH: `${path.join(javaHome, 'bin')}${path.delimiter}${basePath}`, NO_UPDATE_NOTIFIER: '1' };
  const env = {};
  for (const [name, value] of entries) {
    const upper = name.toUpperCase();
    // A "Path" next to the new "PATH" would leave Windows to pick one of the two.
    if (!DROPPED_ENV.has(upper) && !Object.hasOwn(overrides, upper)) env[name] = value;
  }
  return { ...env, ...overrides };
}

function firebaseCli() {
  if (process.env.FIREBASE_TOOLS_BIN) return process.env.FIREBASE_TOOLS_BIN;
  const globalRoot =
    process.platform === 'win32' && process.env.APPDATA
      ? path.join(process.env.APPDATA, 'npm', 'node_modules')
      : spawnSync('npm', ['root', '-g'], { encoding: 'utf8', shell: process.platform === 'win32' }).stdout.trim();
  return path.join(globalRoot, 'firebase-tools', 'lib', 'bin', 'firebase.js');
}

function javaBinary(javaHome) {
  return path.join(javaHome, 'bin', process.platform === 'win32' ? 'java.exe' : 'java');
}

function portOpen(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ host: EMULATOR_HOST, port });
    const done = (open) => {
      socket.destroy();
      resolve(open);
    };
    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
    socket.setTimeout(1_000, () => done(false));
  });
}

async function waitForPorts(ports, { open, timeoutMs, aborted }) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const states = await Promise.all(ports.map(portOpen));
    if (states.every((state) => state === open)) return;
    const reason = aborted?.();
    if (reason) throw new Error(reason);
    if (Date.now() > deadline) {
      const pending = ports.filter((_, index) => states[index] !== open);
      throw new Error(`emulator port(s) ${pending.join(', ')} still ${open ? 'closed' : 'open'} after ${timeoutMs / 1000} s`);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}

// The CLI starts Java as a grandchild, so the whole tree goes: on Windows through taskkill, elsewhere through the
// process group the child leads.
function killTree(child) {
  if (!child?.pid || child.exitCode !== null || child.signalCode !== null) return;
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    try {
      process.kill(-child.pid, 'SIGKILL');
    } catch {
      child.kill('SIGKILL');
    }
  }
}

async function expectOk(response, what) {
  if (response.ok()) return response;
  const body = (await response.text().catch(() => '')).slice(0, 300);
  throw new Error(`${what} answered ${response.status()}: ${body}`);
}

/**
 * Auth and Firestore emulators for one listing slug. Seeding takes the guarded `context.request` from `setup`, so
 * every seed call is checked against the allowlist and logged in hosts.json like the browser's own requests.
 */
export function firebaseEmulator({ slug, projectId, ports, javaHome = process.env.LISTING_JAVA_HOME || DEFAULT_JAVA_HOME, startTimeoutMs = START_TIMEOUT_MS } = {}) {
  const id = assertDemoProjectId(projectId);
  const resolved = resolvePorts(ports);
  const authOrigin = `http://${EMULATOR_HOST}:${resolved.auth}`;
  const firestoreOrigin = `http://${EMULATOR_HOST}:${resolved.firestore}`;
  const documentsPath = `projects/${id}/databases/(default)/documents`;
  let child = null;
  let exitHandlers = null;

  function detachExitHandlers() {
    if (!exitHandlers) return;
    process.off('exit', exitHandlers.exit);
    process.off('SIGINT', exitHandlers.signal);
    process.off('SIGTERM', exitHandlers.signal);
    exitHandlers = null;
  }

  // An interrupted or crashed capture must not leave Java listening on the fixed ports for the next run.
  function attachExitHandlers() {
    const exit = () => killTree(child);
    const signal = (name) => {
      killTree(child);
      process.exit(name === 'SIGINT' ? 130 : 143);
    };
    process.on('exit', exit);
    process.on('SIGINT', signal);
    process.on('SIGTERM', signal);
    exitHandlers = { exit, signal };
  }

  async function stop() {
    if (!child) return;
    const running = child;
    killTree(running);
    child = null;
    detachExitHandlers();
    await waitForPorts([resolved.auth, resolved.firestore], { open: false, timeoutMs: STOP_TIMEOUT_MS });
    if (running.logStream) await new Promise((resolve) => running.logStream.end(resolve));
  }

  async function start() {
    if (child) throw new Error('emulator already started');
    const java = javaBinary(javaHome);
    if (!fs.existsSync(java)) throw new Error(`no Java at ${java}; set LISTING_JAVA_HOME to a JDK 21 home`);
    const cli = firebaseCli();
    if (!fs.existsSync(cli)) throw new Error(`firebase-tools not found at ${cli}; install it globally or set FIREBASE_TOOLS_BIN`);
    const busy = (await Promise.all([resolved.auth, resolved.firestore].map(portOpen))).some(Boolean);
    if (busy) throw new Error(`emulator port ${resolved.auth} or ${resolved.firestore} is already in use; stop the other emulator first`);

    const { dir, file } = writeEmulatorConfig(slug, resolved);
    const logFile = path.join(dir, 'emulator.log');
    const logStream = fs.createWriteStream(logFile);
    const env = emulatorEnv(process.env, javaHome);
    child = spawn(process.execPath, [cli, 'emulators:start', '--only', 'auth,firestore', '--project', id, '--config', file], {
      cwd: dir,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: process.platform !== 'win32',
      windowsHide: true,
    });
    child.logStream = logStream;
    child.stdout.pipe(logStream, { end: false });
    child.stderr.pipe(logStream, { end: false });
    attachExitHandlers();

    let exited = null;
    child.once('exit', (code, signal) => {
      exited = `firebase emulators:start exited early (code ${code ?? signal}); see ${logFile}`;
    });
    try {
      await waitForPorts([resolved.auth, resolved.firestore], { open: true, timeoutMs: startTimeoutMs, aborted: () => exited });
    } catch (error) {
      await stop().catch(() => {});
      throw new Error(`${error.message}; see ${logFile}`);
    }
    return { authOrigin, firestoreOrigin, logFile };
  }

  async function clear(request) {
    await expectOk(await request.delete(`${firestoreOrigin}/emulator/v1/${documentsPath}`), 'clearing Firestore');
    await expectOk(await request.delete(`${authOrigin}/emulator/v1/projects/${id}/accounts`, { headers: OWNER }), 'clearing Auth');
  }

  // Users take a fixed localId so fixtures can reference the owner; documents go in one commit so a seed is all or nothing.
  async function seed(request, { users = [], collections = {} } = {}) {
    if (!child) throw new Error('start the emulator before seeding');
    await clear(request);
    for (const user of users) {
      const { localId, email, password, displayName } = user;
      if (!localId || !email || !password) throw new Error('every seeded user needs localId, email, and password');
      await expectOk(
        await request.post(`${authOrigin}/identitytoolkit.googleapis.com/v1/projects/${id}/accounts`, {
          headers: OWNER,
          data: { localId, email, password, displayName, emailVerified: true },
        }),
        `creating user ${email}`,
      );
    }
    const writes = [];
    for (const [collection, docs] of Object.entries(collections)) {
      for (const { id: docId, ...data } of docs) {
        if (!docId) throw new Error(`a ${collection} document has no id`);
        writes.push({ update: { name: `${documentsPath}/${collection}/${docId}`, fields: toFirestoreFields(data) } });
      }
    }
    if (writes.length) {
      await expectOk(await request.post(`${firestoreOrigin}/v1/${documentsPath}:commit`, { headers: OWNER, data: { writes } }), 'seeding Firestore');
    }
    return { users: users.length, documents: writes.length };
  }

  return { projectId: id, ports: resolved, authOrigin, firestoreOrigin, start, seed, stop };
}
