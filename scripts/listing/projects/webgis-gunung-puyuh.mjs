const REPO_DIR = 'D:\\Projects\\accessibility-gap-analysis-webgis';

// The app starts a patrol simulation on load that calls OpenRouteService with the empty key, and the chat assistant
// would call Groq. Neither has an off switch, and neither host may be allowed, so the page's own fetch refuses them
// before a request exists. The app then takes its normal failure path (straight patrol legs), as it does with no key.
const API_HOSTS = ['api.openrouteservice.org', 'api.groq.com'];

function refuseApiCalls(hosts) {
  const realFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : (input?.url ?? String(input));
    if (hosts.some((host) => url.includes(host))) return Promise.reject(new TypeError('Failed to fetch'));
    return realFetch(input, init);
  };
}

// The collapsed layer list sits over its own toggle in the app's CSS, so a real click lands by position, as a visitor's does.
async function openLayerList(page) {
  const box = await page.locator('.leaflet-control-layers-toggle').boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.locator('.leaflet-control-layers-expanded').waitFor();
}

async function enterMap(page) {
  await page.locator('#splash-screen').waitFor({ state: 'hidden', timeout: 15_000 });
  await page.locator('.nav-link[data-target="map"]').click();
  // The landing page fades out and stays in layout, so Playwright never calls it hidden; its opacity is the signal.
  await page.waitForFunction(() => getComputedStyle(document.getElementById('landing-page')).opacity === '0');
  await page.locator('#loading').waitFor({ state: 'hidden' });
}

// Leaflet marks a tile loading until its image arrives (EC-004), and a pan or zoom animation keeps the pane moving.
async function mapSettled(page) {
  await page.waitForFunction(
    () =>
      document.querySelectorAll('.leaflet-tile-loading').length === 0 &&
      document.querySelectorAll('.leaflet-tile-loaded').length > 0 &&
      !document.querySelector('.leaflet-zoom-anim') &&
      !document.querySelector('.leaflet-pan-anim'),
    undefined,
    { timeout: 30_000 },
  );
  await page.waitForFunction(() => [...document.images].every((image) => image.complete));
}

const project = {
  slug: 'webgis-gunung-puyuh',
  baseUrl: 'http://127.0.0.1:4321',
  serve: REPO_DIR,
  viewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  allowHosts: ['unpkg.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com', 'a.tile.openstreetmap.org', 'b.tile.openstreetmap.org', 'c.tile.openstreetmap.org'],
  setup: async (context) => {
    await context.addInitScript(refuseApiCalls, API_HOSTS);
  },
  shots: [
    {
      name: 'splash',
      path: '/',
      waitFor: '#landing-page.active',
      before: async (page) => {
        // The app hides the splash 1.5 s after load and removes it 0.8 s later; showing it again before that
        // would be undone by its own timer.
        await page.waitForFunction(() => getComputedStyle(document.getElementById('splash-screen')).display === 'none');
        await page.evaluate(() => {
          const splash = document.getElementById('splash-screen');
          splash.style.display = '';
          splash.classList.remove('hidden');
        });
      },
    },
    {
      name: 'service-area',
      path: '/',
      before: async (page) => {
        await enterMap(page);
        await page.locator('#iso-btn').click();
        await page.locator('#map').click({ position: { x: 720, y: 430 } });
        await mapSettled(page);
        await page.evaluate(() => AnalysisUtils.closeSidebar());
        await page.locator('.leaflet-popup-close-button').click();
        await mapSettled(page);
      },
    },
    {
      name: 'gap',
      path: '/',
      before: async (page) => {
        await enterMap(page);
        await page.locator('#gap-btn').click();
        await page.locator('#map').click({ position: { x: 640, y: 420 } });
        await page.locator('.leaflet-popup-close-button').click();
        await mapSettled(page);
      },
    },
    {
      name: 'health',
      path: '/',
      before: async (page) => {
        await enterMap(page);
        await openLayerList(page);
        for (const name of ['SDN/SD/SDIT', 'SMP/SMPN/SMPIT', 'SMA/SMAN/SMK', 'Universitas', 'Madrasah']) {
          await page.locator('.leaflet-control-layers-overlays label').filter({ hasText: name }).click();
        }
        // A pointer left on the last row would keep its hover highlight in the screenshot.
        await page.mouse.move(1300, 500);
        await mapSettled(page);
      },
    },
    {
      name: 'popup',
      path: '/',
      before: async (page) => {
        await enterMap(page);
        const point = await page.evaluate(() => {
          const feature = GeoJSONLoader.allFacilities.find((item) => item.properties.SDN === 'SDN Kopeng 1');
          const box = AnalysisUtils.getMarker(feature.properties.fid).getElement().getBoundingClientRect();
          return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
        });
        await page.mouse.click(point.x, point.y);
        await page.locator('.leaflet-popup').waitFor();
        await mapSettled(page);
      },
    },
  ],
  listing: {
    type: 'web',
    label: null,
    sampleData: false,
    title: 'Gunung Puyuh WebGIS',
    tagline: 'An interactive map of which Gunung Puyuh neighbourhoods sit too far from schools and health facilities.',
    cover: { shot: 'service-area' },
    slides: [
      { shot: 'splash', caption: 'Start with a short intro to the Gunung Puyuh accessibility study' },
      { shot: 'gap', caption: 'Check if a spot has schools or clinics within 250 and 500 metres' },
      { shot: 'health', caption: 'Switch school and health layers on and off to compare coverage' },
      { shot: 'popup', caption: 'Open any school to see its name and photo on the map' },
    ],
    sources: {},
  },
};

export default project;
