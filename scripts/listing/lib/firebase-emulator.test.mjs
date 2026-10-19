import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, test } from 'node:test';

import {
  DEFAULT_PORTS,
  EMULATOR_HOST,
  assertDemoProjectId,
  emulatorDir,
  emulatorEnv,
  firebaseEmulator,
  resolvePorts,
  toFirestoreFields,
  toFirestoreValue,
  writeEmulatorConfig,
} from './firebase-emulator.mjs';
import { cacheDir, repoRoot } from './project.mjs';

const SLUG = '_firebase-emulator-test';

after(() => fs.rmSync(cacheDir(SLUG), { recursive: true, force: true }));

test('only demo- project ids are accepted, so a missed override can never reach a real Firebase project', () => {
  assert.equal(assertDemoProjectId('demo-visualkain'), 'demo-visualkain');
  assert.equal(assertDemoProjectId('demo-inztamoto'), 'demo-inztamoto');
  for (const bad of ['appkonveksi', 'visualkain-demo', 'Demo-visualkain', 'demo_visualkain', ' demo-visualkain', 'demo-', 'demo-x-', 'demo-UPPER', `demo-${'a'.repeat(30)}`, '', null, undefined]) {
    assert.throws(() => assertDemoProjectId(bad), /demo-|valid Firebase project id/, `accepted ${JSON.stringify(bad)}`);
  }
});

test('the emulator handle refuses a non-demo project before it can spawn anything', () => {
  assert.throws(() => firebaseEmulator({ slug: SLUG, projectId: 'appkonveksi' }), /must start with "demo-"/);
  assert.equal(fs.existsSync(emulatorDir(SLUG)), false, 'a refused handle wrote an emulator folder');
});

test('the config is written to the gitignored listing cache, binds loopback only, and keeps the UI off', () => {
  const { dir, file, config, ports } = writeEmulatorConfig(SLUG);
  assert.equal(dir, path.join(repoRoot, '.listing-cache', SLUG, 'emulator'));
  assert.equal(file, path.join(dir, 'firebase.json'));
  assert.deepEqual(JSON.parse(fs.readFileSync(file, 'utf8')), config);
  assert.deepEqual(ports, DEFAULT_PORTS);
  const { ui, singleProjectMode, ...services } = config.emulators;
  assert.deepEqual(ui, { enabled: false });
  assert.equal(singleProjectMode, true);
  assert.deepEqual(Object.keys(services).sort(), ['auth', 'firestore', 'hub', 'logging']);
  for (const [name, service] of Object.entries(services)) assert.equal(service.host, EMULATOR_HOST, `${name} is not on loopback`);
  assert.equal(services.firestore.websocketPort, DEFAULT_PORTS.firestoreWebsocket);
  assert.equal(Object.hasOwn(config, 'firestore'), false, 'no rules or indexes from a client repository are referenced');
});

test('ports can be overridden, but must be distinct, known, and unprivileged', () => {
  assert.equal(writeEmulatorConfig(SLUG, { auth: 9499, firestore: 8499 }).config.emulators.auth.port, 9499);
  assert.equal(resolvePorts({ firestore: 8499 }).firestore, 8499);
  assert.throws(() => resolvePorts({ auth: DEFAULT_PORTS.firestore }), /must all differ/);
  assert.throws(() => resolvePorts({ functions: 5001 }), /unknown emulator port/);
  assert.throws(() => resolvePorts({ auth: 80 }), /1024 to 65535/);
  assert.throws(() => resolvePorts({ auth: '9399' }), /1024 to 65535/);
});

test('seed values map to the Firestore REST shape and refuse anything without an exact type', () => {
  assert.deepEqual(
    toFirestoreFields({
      nama: 'Sample',
      qty: 24,
      rasio: 0.7,
      aktif: true,
      catatan: null,
      skip: undefined,
      dibuat: new Date('2026-10-02T03:00:00.000Z'),
      list: [{ nominal: 1_000_000 }],
    }),
    {
      nama: { stringValue: 'Sample' },
      qty: { integerValue: '24' },
      rasio: { doubleValue: 0.7 },
      aktif: { booleanValue: true },
      catatan: { nullValue: null },
      dibuat: { timestampValue: '2026-10-02T03:00:00.000Z' },
      list: { arrayValue: { values: [{ mapValue: { fields: { nominal: { integerValue: '1000000' } } } }] } },
    },
  );
  for (const bad of [Number.NaN, Infinity, new Date('nope'), () => {}, new Map(), 10n]) {
    assert.throws(() => toFirestoreValue(bad), /cannot store/, `accepted ${String(bad)}`);
  }
});

test('seeding before start is refused instead of writing to whatever listens on the port', async () => {
  const emulator = firebaseEmulator({ slug: SLUG, projectId: 'demo-listing-test' });
  await assert.rejects(emulator.seed({}, { collections: { orders: [{ id: 'o1' }] } }), /start the emulator before seeding/);
  await emulator.stop();
});

test('the emulator env drops a Firebase CI token and service-account path, whatever their case', () => {
  const env = emulatorEnv(
    { FIREBASE_TOKEN: 't', google_application_credentials: 'c', Path: '/usr/bin', java_home: '/old', KEEP: 'yes' },
    '/jbr',
  );
  assert.deepEqual(Object.keys(env).sort(), ['JAVA_HOME', 'KEEP', 'NO_UPDATE_NOTIFIER', 'PATH']);
  assert.equal(env.JAVA_HOME, '/jbr');
  assert.equal(env.PATH, `${path.join('/jbr', 'bin')}${path.delimiter}/usr/bin`);
});

// Drives the real start() with a stand-in CLI that records the env names it was given and exits, so the test proves
// the spawned child, not just the helper, never sees the two variables.
test('start() spawns the CLI without FIREBASE_TOKEN or GOOGLE_APPLICATION_CREDENTIALS', async () => {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'listing-emulator-env-'));
  const javaHome = path.join(work, 'jbr');
  fs.mkdirSync(path.join(javaHome, 'bin'), { recursive: true });
  fs.writeFileSync(path.join(javaHome, 'bin', process.platform === 'win32' ? 'java.exe' : 'java'), '');
  const dump = path.join(work, 'env.json');
  const cli = path.join(work, 'fake-firebase.mjs');
  fs.writeFileSync(cli, `import fs from 'node:fs';
fs.writeFileSync(${JSON.stringify(dump)}, JSON.stringify(Object.keys(process.env)));
`);
  const saved = { FIREBASE_TOOLS_BIN: process.env.FIREBASE_TOOLS_BIN, FIREBASE_TOKEN: process.env.FIREBASE_TOKEN, GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS };
  process.env.FIREBASE_TOOLS_BIN = cli;
  process.env.FIREBASE_TOKEN = 'not-a-real-token';
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(work, 'not-a-real-key.json');
  try {
    const emulator = firebaseEmulator({ slug: SLUG, projectId: 'demo-listing-test', javaHome, ports: { auth: 9499, firestore: 8499, firestoreWebsocket: 9498, hub: 4498, logging: 4497 }, startTimeoutMs: 10_000 });
    await assert.rejects(emulator.start(), /exited early/);
    const names = JSON.parse(fs.readFileSync(dump, 'utf8')).map((name) => name.toUpperCase());
    assert.equal(names.includes('FIREBASE_TOKEN'), false);
    assert.equal(names.includes('GOOGLE_APPLICATION_CREDENTIALS'), false);
    assert.equal(names.includes('JAVA_HOME'), true);
    assert.equal(names.includes('FIREBASE_TOOLS_BIN'), true, 'the rest of the env still reaches the child');
  } finally {
    for (const [name, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
    fs.rmSync(work, { recursive: true, force: true });
  }
});
