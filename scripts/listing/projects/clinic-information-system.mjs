import { createSupabaseStub, sampleUser } from '../lib/supabase-stub.mjs';
import { buildFixtures, OWNER, OWNER_AUTH_ID } from './clinic-information-system.fixtures.mjs';

// The dev server must be started with NEXT_PUBLIC_SUPABASE_URL set to this origin (and never through npm run dev,
// whose predev copies a real env file into place), or the app calls another host and the guard fails the run.
const STUB_ORIGIN = 'https://clinic-stub.test';
const BASE_URL = 'http://localhost:3417';

const { tables, relations } = buildFixtures();
const stub = createSupabaseStub({
  origin: STUB_ORIGIN,
  // The app takes the role and display name from user_metadata; without a name it falls back to the real owners'.
  user: sampleUser({ id: OWNER_AUTH_ID, email: OWNER.email, fullName: OWNER.name, metadata: { role: 'owner', name: OWNER.name } }),
  tables,
  relations,
  // Patient and money screens are never shot with half their data answered.
  strict: true,
});

// @supabase/ssr keeps the session in a cookie, not localStorage, as "base64-" plus base64url JSON, split into
// numbered chunks past 3180 characters.
function sessionCookies() {
  const value = `base64-${Buffer.from(JSON.stringify(stub.session)).toString('base64url')}`;
  const size = 3180;
  if (value.length <= size) return [{ name: stub.storageKey, value, url: BASE_URL }];
  const chunks = [];
  for (let start = 0; start < value.length; start += size) {
    chunks.push({ name: `${stub.storageKey}.${chunks.length}`, value: value.slice(start, start + size), url: BASE_URL });
  }
  return chunks;
}

const BUSY_TEXT = ['Memverifikasi otentikasi', 'Mengalihkan', 'Memuat'];

// Every screen loads in the browser after the session check, so the shot waits for the shell and for every
// spinner, skeleton, and loading line to go.
async function pageLoaded(page) {
  await page.waitForFunction(
    (busy) => {
      const text = document.body.innerText;
      if (busy.some((line) => text.includes(line))) return false;
      if (!document.querySelector('main')) return false;
      return !document.querySelector('main .animate-spin, main [class*="skeleton"], main .animate-pulse.bg-slate-200, main .animate-pulse.bg-slate-100');
    },
    BUSY_TEXT,
    { timeout: 20_000 },
  );
}

// The shell scrolls inside <main>, not the window, so a section is brought up by scrolling that element.
async function scrollMainTo(page, selector, text, gap) {
  await page.evaluate(
    ({ css, needle, offset }) => {
      const main = document.querySelector('main');
      const target = [...main.querySelectorAll(css)].find((node) => node.textContent.includes(needle));
      if (!target) throw new Error(`no ${css} containing "${needle}"`);
      main.scrollTo(0, target.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - offset);
    },
    { css: selector, needle: text, offset: gap },
  );
}

// next dev draws its own "N" badge in the corner; it is dev tooling, not the clinic's UI.
async function hideDevBadge(page) {
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
}

async function ready(page) {
  await pageLoaded(page);
  await hideDevBadge(page);
}

// The list of today's visits sits below the cashier workstation; it is the registration desk's main view.
async function showVisitList(page) {
  await ready(page);
  await scrollMainTo(page, 'h3', 'Daftar Master Pasien', 24);
}

// The morbidity tab is the report the clinic hands on. The table is short, so main cannot scroll the filter card
// fully away; stopping at its action row keeps whole buttons on screen instead of a clipped strip.
async function showMorbidity(page) {
  await ready(page);
  await page.locator('main button', { hasText: '10 Besar Penyakit' }).click();
  await pageLoaded(page);
  await scrollMainTo(page, 'button', 'Reset Filter', 20);
  await page.mouse.move(0, 899);
}

const project = {
  slug: 'clinic-information-system',
  baseUrl: BASE_URL,
  viewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  allowHosts: ['fonts.googleapis.com', 'fonts.gstatic.com', stub.host],
  setup: async (context) => {
    await stub.install(context);
    await context.addCookies(sessionCookies());
  },
  shots: [
    // Recharts draws the trend charts over about 1.5 s with JavaScript, which animations: 'disabled' does not stop.
    { name: 'dashboard', path: '/', waitFor: 'main', before: ready, settle: 2500 },
    { name: 'buku-kas', path: '/buku-kas', waitFor: 'main', before: ready, settle: 1200 },
    { name: 'pendaftaran', path: '/pendaftaran', waitFor: 'main', before: showVisitList, settle: 1200 },
    { name: 'rekam-medis', path: '/rekam-medis', waitFor: 'main', before: ready, settle: 1200 },
    { name: 'laporan', path: '/laporan', waitFor: 'main', before: showMorbidity, settle: 1200 },
  ],
  listing: {
    type: 'web',
    label: null,
    sampleData: true,
    title: 'Klinik Cikidang Medika',
    hook: 'From spreadsheets to one patient record.',
    tagline: '7,493 legacy rows moved into PostgreSQL, with row-level security and two roles guarding patient data.',
    cover: { shot: 'dashboard' },
    slides: [
      { shot: 'buku-kas', caption: 'Keep the cash book and drawer balance in step every day' },
      { shot: 'pendaftaran', caption: 'Register patients, run the queue and take payment at one desk' },
      { shot: 'rekam-medis', caption: 'Call each patient from the queue with allergies flagged up front' },
      { shot: 'laporan', caption: 'Export visit, morbidity and cash reports for any period' },
    ],
    sources: {},
  },
};

export default project;
