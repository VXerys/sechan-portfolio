import demo from './_kit-demo.mjs';

// Same fixture at a phone viewport, so the phone frame and the label chip are proven before T-046 relies on them.
const project = {
  ...demo,
  slug: '_kit-demo-mobile',
  baseUrl: 'http://127.0.0.1:4318',
  viewport: { width: 390, height: 844, deviceScaleFactor: 3 },
  listing: {
    ...demo.listing,
    type: 'mobile',
    label: 'Full-stack',
    slides: [
      { shot: 'overview', caption: 'Cash in and out for the week on one screen' },
      { shot: 'orders', caption: 'Orders still waiting on their balance' },
      { shot: 'payment', caption: 'Each down payment against the order total' },
      { shot: 'reports', caption: 'Profit by product line at month end' },
    ],
  },
};

export default project;
