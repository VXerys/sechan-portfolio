import { createSupabaseStub, sampleUser } from '../lib/supabase-stub.mjs';
import { ARTIST, ARTIST_AUTH_ID, buildFixtures } from './artconnect.fixtures.mjs';

// The dev server must be started with VITE_SUPABASE_URL set to this origin, or the app calls another host and the
// guard fails the run. A .test name never resolves, so nothing here can reach a real Supabase project.
const STUB_ORIGIN = 'https://artconnect-stub.test';

const { tables, rpc, files } = buildFixtures(STUB_ORIGIN);
const stub = createSupabaseStub({
  origin: STUB_ORIGIN,
  user: sampleUser({ id: ARTIST_AUTH_ID, email: ARTIST.email, fullName: ARTIST.fullName }),
  tables,
  rpc,
  files,
  // The app's own storage key (src/lib/supabase.ts), so it finds the sample session on first load.
  storageKey: 'artconnect-auth',
  // The landing page is what a first-time visitor sees, so it is captured signed out.
  signedOutPaths: ['/'],
});

// Each app page shows a spinner until the profile and its data arrive; the shot waits for it to go.
async function pageLoaded(page) {
  await page.waitForFunction(() => !document.body.innerText.includes('Memuat'), undefined, { timeout: 15_000 });
  await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0));
}

// At 1440 px the open sidebar pushes the fourth (sold) column off the board; the app's own collapse button makes room.
async function collapseSidebar(page) {
  await pageLoaded(page);
  await page.locator('aside button').first().click();
  await page.waitForFunction(() => document.querySelector('aside').getBoundingClientRect().width < 100);
  await page.mouse.move(0, 899);
}

// The charts sit below the fold; scrolling the summary heading to the top shows the figures and both charts.
async function showCharts(page) {
  await pageLoaded(page);
  await page.evaluate(() => {
    const heading = [...document.querySelectorAll('h2')].find((node) => node.textContent.includes('Ringkasan Performa'));
    window.scrollTo(0, heading.getBoundingClientRect().top + window.scrollY - 20);
  });
}

const project = {
  slug: 'artconnect',
  baseUrl: 'http://127.0.0.1:5173',
  viewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  allowHosts: ['fonts.googleapis.com', 'fonts.gstatic.com', stub.host],
  setup: async (context) => {
    await stub.install(context);
  },
  shots: [
    { name: 'pipeline', path: '/pipeline', waitFor: 'text=Kanban Board', before: collapseSidebar, settle: 900 },
    { name: 'landing', path: '/', waitFor: 'nav', before: pageLoaded },
    { name: 'artworks', path: '/artworks', waitFor: 'main img', before: pageLoaded },
    // Recharts draws its bars and donut over about 1.5 s with JavaScript, which animations: 'disabled' does not stop.
    { name: 'analytics', path: '/analytics', waitFor: 'text=Ringkasan Performa', before: showCharts, settle: 2500 },
  ],
  listing: {
    type: 'web',
    label: null,
    sampleData: true,
    title: 'ArtConnect',
    hook: 'From concept to sold, on one board.',
    tagline: 'Artworks move across the board instantly and roll back on their own if the save fails.',
    cover: { shot: 'pipeline' },
    slides: [
      { shot: 'landing', caption: 'Introduce the workspace to artists before they sign in' },
      { shot: 'pipeline', caption: 'Drag each artwork from concept to sold on one board' },
      { shot: 'artworks', caption: 'Browse the whole inventory with medium, size and price' },
      { shot: 'analytics', caption: 'Track monthly sales and how the collection is moving' },
    ],
    sources: {},
  },
};

export default project;
