import { firebaseEmulator } from '../lib/firebase-emulator.mjs';
import { CLOCK, OWNER, PROJECT_ID, buildFixtures, checkFixtures, yearFigures } from './inztamoto-erp.fixtures.mjs';

// The dev server runs from a temporary worktree with three listing-only edits: app-runtime.js refuses any project id
// that does not start with demo-, calls useEmulator on the compat Auth and Firestore instances with the addresses
// below, and publishes them as window.__listingEmulator; LegacyScripts.jsx and layout.jsx load the Firebase compat
// SDK, Chart.js, Font Awesome, and Plus Jakarta Sans from local copies instead of gstatic, jsDelivr, cdnjs, and Google
// Fonts. So the page never asks a Google, Firebase, or CDN host, and allowHosts stays empty.
const BASE_URL = 'http://127.0.0.1:3419';
const emulator = firebaseEmulator({ slug: 'inztamoto-erp', projectId: PROJECT_ID });

// Wrong numbers fail here, before the emulator starts or any shot is taken.
const month = checkFixtures();
const year = yearFigures();
const rupiah = (amount) => `Rp ${amount.toLocaleString('id-ID')}`;

// Product photos live on Cloudinary in the real app. The sample products point at a path on the dev server origin
// instead, and this stub answers it with a drawn bag, so the request stays on loopback and passes the guard.
const SHAPES = {
  TAIL: '<rect x="14" y="22" width="36" height="24" rx="6"/><rect x="20" y="16" width="24" height="8" rx="3"/>',
  SIDE: '<path d="M14 18h16v30H18a4 4 0 0 1-4-4z"/><path d="M34 18h16v26a4 4 0 0 1-4 4H34z"/>',
  DUFF: '<rect x="10" y="24" width="44" height="22" rx="11"/><path d="M24 24v-6h16v6" fill="none" stroke-width="3"/>',
  TANK: '<path d="M16 40c0-14 8-22 16-22s16 8 16 22z"/><rect x="14" y="40" width="36" height="6" rx="3"/>',
  TOOL: '<rect x="12" y="22" width="40" height="20" rx="4"/><path d="M12 32h40" stroke-width="2"/>',
  DRY: '<path d="M22 14h20l-2 6h-16z"/><rect x="20" y="20" width="24" height="30" rx="8"/>',
  PAN: '<rect x="12" y="16" width="18" height="32" rx="3"/><rect x="34" y="16" width="18" height="32" rx="3"/>',
  ACC: '<circle cx="32" cy="32" r="16"/><circle cx="32" cy="32" r="7" fill="#fff7e6"/>',
};
const TINTS = ['#b45309', '#92400e', '#78350f', '#a16207', '#7c2d12'];

function productImage(sku) {
  const family = sku.split('-')[1] ?? 'ACC';
  const tint = TINTS[[...sku].reduce((sum, char) => sum + char.charCodeAt(0), 0) % TINTS.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="#fff7e6"/><g fill="${tint}" stroke="${tint}">${SHAPES[family] ?? SHAPES.ACC}</g></svg>`;
}

// The runtime renders after its Firestore listeners fire; a shot waits until the page shows a value that only the
// seeded data can produce, every thumbnail has loaded, and no spinner or toast is left on screen.
async function pageLoaded(page, { selector, text }) {
  await page.waitForFunction(
    ({ selector: css, needle }) => {
      const shell = document.querySelector('#appShell');
      if (!shell || getComputedStyle(shell).display === 'none') return false;
      const target = document.querySelector(css);
      if (!target || !target.innerText.includes(needle)) return false;
      if (document.querySelector('.page.active .fa-spinner, .page.active .fa-spin')) return false;
      return [...document.images].every((image) => image.complete && image.naturalWidth > 0);
    },
    { selector, needle: text },
    { timeout: 20_000 },
  );
}

// The sales report opens by default; the profit report is the one that shows what each product earns after HPP.
async function profitReport(page) {
  await page.locator('#reportType').selectOption('profit');
}

async function tidy(page) {
  // next dev draws its own error badge and toast host; they are dev tooling, not InztaMoto's UI.
  await page.addStyleTag({ content: 'nextjs-portal, #toastContainer, .toast-container { display: none !important; }' });
  await page.mouse.move(0, 899);
}

function screen(name, wait, prepare) {
  return async (page) => {
    if (name !== 'dashboard') {
      await page.locator(`.nav-item[data-page="${name}"]`).click();
    }
    await prepare?.(page);
    await pageLoaded(page, wait);
    await tidy(page);
  };
}

// Signs the sample owner in through the app's own login form, so the session lives in IndexedDB exactly as a real
// login would; each shot reopens "/" with it. The hook's report is checked before any shot runs.
async function signIn(context) {
  const page = await context.newPage();
  try {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'load' });
    await page.locator('#loginEmail').waitFor({ state: 'visible', timeout: 30_000 });
    await page.locator('#loginEmail').fill(OWNER.email);
    await page.locator('#loginPassword').fill(OWNER.password);
    await page.locator('#loginBtn').click();
    await page.locator('#appShell').waitFor({ state: 'visible', timeout: 30_000 });
    const connected = await page.evaluate(() => globalThis.__listingEmulator ?? null);
    if (connected?.projectId !== PROJECT_ID || connected.auth !== `127.0.0.1:${emulator.ports.auth}` || connected.firestore !== `127.0.0.1:${emulator.ports.firestore}`) {
      throw new Error(`the app is not on the listing emulator: ${JSON.stringify(connected)}`);
    }
  } finally {
    await page.close();
  }
}

const project = {
  slug: 'inztamoto-erp',
  baseUrl: BASE_URL,
  viewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  allowHosts: [],
  setup: async (context) => {
    // The runtime reads "today" and "this month" from the browser clock; starting it at a set time keeps every rerun on
    // the same view. setSystemTime rather than setFixedTime, because Chart.js times its draw-in with Date.now and a
    // frozen clock leaves every bar at zero.
    await context.clock.setSystemTime(CLOCK);
    await context.route('**/__listing/product/*.svg', (route) => {
      const sku = decodeURIComponent(new URL(route.request().url()).pathname.split('/').pop().replace(/\.svg$/, ''));
      return route.fulfill({ status: 200, contentType: 'image/svg+xml', body: productImage(sku) });
    });
    await emulator.start();
    const seeded = await emulator.seed(context.request, buildFixtures());
    console.log(`  emulator ${PROJECT_ID}: ${seeded.users} user, ${seeded.documents} documents seeded`);
    await signIn(context);
  },
  teardown: () => emulator.stop(),
  // Firestore keeps its listen channel open, so no page ever reaches network idle; `screen` waits for the data instead.
  shots: [
    { name: 'dashboard', path: '/', waitUntil: 'load', waitFor: '#appShell', before: screen('dashboard', { selector: '#dashStats', text: rupiah(month.revenue) }), settle: 2500 },
    { name: 'penjualan', path: '/', waitUntil: 'load', waitFor: '#appShell', before: screen('penjualan', { selector: '#saleBody', text: 'TXN-' }), settle: 2000 },
    { name: 'inventaris', path: '/', waitUntil: 'load', waitFor: '#appShell', before: screen('inventaris', { selector: '#pageInventaris', text: 'INZ-PAN-01' }), settle: 2000 },
    { name: 'produksi', path: '/', waitUntil: 'load', waitFor: '#appShell', before: screen('produksi', { selector: '#prodStats', text: 'Hari Ini' }), settle: 2000 },
    { name: 'laporan', path: '/', waitUntil: 'load', waitFor: '#appShell', before: screen('laporan', { selector: '#pageLaporan', text: rupiah(year.profit) }, profitReport), settle: 2500 },
  ],
  listing: {
    type: 'web',
    label: null,
    sampleData: true,
    title: 'InztaMoto ERP',
    tagline: 'An internal ERP for a motorcycle bag and riding gear brand, moved into a Next.js shell without stopping daily operations.',
    cover: { shot: 'dashboard' },
    slides: [
      { shot: 'penjualan', caption: 'Log sales from Shopee, Tokopedia, resellers and the shop in one list' },
      { shot: 'inventaris', caption: 'Track stock in and out per product, with low and empty stock flagged' },
      { shot: 'produksi', caption: 'Follow every production batch from pending to quality control' },
      { shot: 'laporan', caption: 'Turn sales, materials and wages into a monthly profit report' },
    ],
    sources: {},
  },
};

export default project;
