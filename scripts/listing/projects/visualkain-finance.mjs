import { firebaseEmulator } from '../lib/firebase-emulator.mjs';
import { OWNER, PROJECT_ID, buildFixtures, checkMoneyRules } from './visualkain-finance.fixtures.mjs';

// The dev server runs from a temporary worktree whose src/lib/firebase.ts carries a listing hook: it refuses any
// project id that does not start with demo-, connects Auth and Firestore to the emulator addresses below, and
// publishes what it connected to as window.__listingEmulator. Every NEXT_PUBLIC_FIREBASE_* variable is set, because
// the app's config falls back to the production project for each one that is missing.
const BASE_URL = 'http://127.0.0.1:3418';
const emulator = firebaseEmulator({ slug: 'visualkain-finance', projectId: PROJECT_ID });

// Wrong numbers fail here, before the emulator starts or any shot is taken.
const money = checkMoneyRules();
const rupiah = (amount) => `Rp ${amount.toLocaleString('id-ID')}`;

const BUSY_TEXT = ['Memverifikasi Otoritas', 'Menghubungkan', 'Memuat'];

// Firestore listeners fill the screens after the auth check; a shot waits until no loading line, spinner, or shimmer
// is left and the screen shows a value that only the seeded data can produce.
async function pageLoaded(page, needle) {
  await page.waitForFunction(
    ({ busy, text }) => {
      const body = document.body.innerText;
      if (busy.some((line) => body.includes(line))) return false;
      if (text && !body.includes(text)) return false;
      const main = document.querySelector('main');
      if (!main) return false;
      return !main.querySelector('.animate-spin, [class*="shimmer"], [class*="skeleton"]');
    },
    { busy: BUSY_TEXT, text: needle },
    { timeout: 20_000 },
  );
}

// next dev draws its own badge and toasts in the corner; they are dev tooling, not VisualKain's UI.
async function hideDevBadge(page) {
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
}

function ready(needle) {
  return async (page) => {
    await pageLoaded(page, needle);
    await hideDevBadge(page);
    await page.mouse.move(0, 899);
  };
}

// The calculator opens empty; picking a fabric and a quantity is how the workshop prices an order, and 36 pcs lands
// in the 13 to 48 markup band.
async function priceHoodie(page) {
  await pageLoaded(page, 'Kalkulator Estimasi Profit');
  const pick = async (trigger, option) => {
    await page.getByRole('combobox').filter({ hasText: trigger }).click();
    await page.getByRole('option', { name: option, exact: true }).click();
  };
  // The fabric trigger reads "Pilih kategori dulu" until a category is set, so the category match is anchored.
  await pick(/^Pilih kategori$/, 'Hoodie');
  await pick(/^Pilih bahan/, 'Fleece Cotton');
  const qty = page.locator('main input[inputmode="numeric"]').first();
  await qty.fill('36');
  await qty.blur();
  await pageLoaded(page, 'Rp 1.863.000');
  await hideDevBadge(page);
  await page.mouse.move(0, 899);
}

// Signs the sample owner in through the app's own login form, so the session lives in the browser exactly as a real
// login would; the shots then reuse it from IndexedDB. The hook's report is checked before any shot runs.
async function signIn(context) {
  const page = await context.newPage();
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'load' });
    await page.locator('input[type="email"]').fill(OWNER.email);
    await page.locator('input[type="password"]').fill(OWNER.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(`${BASE_URL}/`, { timeout: 30_000 });
    const connected = await page.evaluate(() => globalThis.__listingEmulator ?? null);
    if (connected?.projectId !== PROJECT_ID || connected.auth !== `127.0.0.1:${emulator.ports.auth}` || connected.firestore !== `127.0.0.1:${emulator.ports.firestore}`) {
      throw new Error(`the app is not on the listing emulator: ${JSON.stringify(connected)}`);
    }
  } finally {
    await page.close();
  }
}

const project = {
  slug: 'visualkain-finance',
  baseUrl: BASE_URL,
  viewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  allowHosts: ['fonts.googleapis.com', 'fonts.gstatic.com'],
  setup: async (context) => {
    await emulator.start();
    const seeded = await emulator.seed(context.request, buildFixtures());
    console.log(`  emulator ${PROJECT_ID}: ${seeded.users} user, ${seeded.documents} documents seeded`);
    await signIn(context);
  },
  teardown: () => emulator.stop(),
  // Firestore keeps its listen channel open, so no page ever reaches network idle; `ready` waits for the data instead.
  shots: [
    { name: 'dashboard', path: '/', waitUntil: 'load', waitFor: 'main', before: ready(rupiah(money.realCash)), settle: 2500 },
    { name: 'cash-in', path: '/?tab=cashin', waitUntil: 'load', waitFor: 'main', before: ready('INV-SMP'), settle: 2000 },
    { name: 'cash-out', path: '/?tab=cashout', waitUntil: 'load', waitFor: 'main', before: ready('INV-SMP'), settle: 2000 },
    { name: 'vendor', path: '/?tab=vendor', waitUntil: 'load', waitFor: 'main', before: ready('Konveksi Lentara'), settle: 2000 },
    { name: 'cost-profit', path: '/cost-profit', waitUntil: 'load', waitFor: 'main', before: priceHoodie, settle: 1200 },
  ],
  listing: {
    type: 'web',
    label: null,
    sampleData: true,
    title: 'VisualKain Finance',
    tagline: 'A finance system for a garment manufacturer that separates real cash from money that belongs to vendors.',
    cover: { shot: 'dashboard' },
    slides: [
      { shot: 'cash-in', caption: 'Track every customer payment against the 70% down payment rule' },
      { shot: 'cash-out', caption: 'See vendor payments, order costs and overheads in one outflow view' },
      { shot: 'vendor', caption: 'Compare vendor HPP with the profit VisualKain keeps per partner' },
      { shot: 'cost-profit', caption: 'Price a new order from fabric cost and quantity markup' },
    ],
    sources: {},
  },
};

export default project;
