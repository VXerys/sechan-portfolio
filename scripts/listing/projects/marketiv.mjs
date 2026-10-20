import { fileURLToPath } from 'node:url';

// No capture step: the shots are the public landing page on https://marketiv.id, Sechan's own venture, taken in a
// headless browser into the gitignored cache. The app screens inside the page already use the site's sample data.
const CACHE = fileURLToPath(new URL('../../../.listing-cache/marketiv/', import.meta.url));

const project = {
  slug: 'marketiv',
  baseUrl: 'http://127.0.0.1:1',
  viewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  allowHosts: [],
  shots: [],
  listing: {
    type: 'web',
    label: null,
    sampleData: false,
    title: 'Marketiv',
    hook: 'Paid only once the content is live.',
    tagline: 'The Marketiv landing page: two hiring modes, escrow that holds the money, and previews of the real app.',
    cover: { shot: 'hero' },
    slides: [
      { shot: 'solusi', caption: 'Three promises for MSMEs: funds held first, pay for results, work for creators' },
      { shot: 'mode', caption: 'Two ways to hire: pay-per-view campaigns or fixed-price rate cards' },
      { shot: 'escrow', caption: 'Escrow step by step, from Midtrans payment to the creator wallet' },
      { shot: 'preview', caption: 'Previews of the MSME dashboard and the creator job board' },
    ],
    sources: {
      hero: `${CACHE}hero.png`,
      solusi: `${CACHE}solusi.png`,
      mode: `${CACHE}mode.png`,
      escrow: `${CACHE}escrow.png`,
      preview: `${CACHE}preview.png`,
    },
  },
};

export default project;
