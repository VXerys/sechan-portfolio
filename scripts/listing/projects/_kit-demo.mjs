import { fileURLToPath } from 'node:url';

const STUB_HOST = 'api.harbor.test';

// Kit self-test: the kit serves its own fixture on loopback, and the leading underscore keeps the output in
// .listing-cache/_kit-demo/out/, never in src/assets. The session stub shows a fake host passing the guard only
// because it is listed and answered locally.
const project = {
  slug: '_kit-demo',
  baseUrl: 'http://127.0.0.1:4317',
  serve: fileURLToPath(new URL('../fixtures/kit-demo/', import.meta.url)),
  viewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  allowHosts: ['fonts.googleapis.com', 'fonts.gstatic.com', STUB_HOST],
  setup: async (context) => {
    await context.route(`https://${STUB_HOST}/v1/session`, (route) =>
      route.fulfill({
        status: 200,
        headers: { 'access-control-allow-origin': '*' },
        contentType: 'application/json',
        body: JSON.stringify({ name: 'Sample Admin', initials: 'SA', role: 'owner' }),
      }),
    );
  },
  shots: [
    { name: 'overview', path: '/', waitFor: '[data-session="ready"]' },
    {
      name: 'orders',
      path: '/orders.html',
      waitFor: '#rows',
      before: async (page) => {
        await page.getByRole('button', { name: 'Waiting on balance' }).click();
      },
    },
    { name: 'payment', path: '/order.html', waitFor: '.timeline' },
    { name: 'reports', path: '/reports.html', waitFor: '.donut' },
  ],
  listing: {
    type: 'web',
    label: null,
    sampleData: true,
    title: 'Harbor Ledger',
    tagline: 'A kit demo with invented orders, payments, and margins.',
    cover: { shot: 'overview' },
    slides: [
      { shot: 'overview', caption: 'See cash in and out for the week at a glance' },
      { shot: 'orders', caption: 'Filter the orders still waiting on their balance' },
      { shot: 'payment', caption: 'Track each down payment against the order total' },
      { shot: 'reports', caption: 'Read profit by product line when the month closes' },
    ],
    sources: {},
  },
};

export default project;
