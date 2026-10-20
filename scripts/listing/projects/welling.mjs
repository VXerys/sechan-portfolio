// No capture step: Welling belongs to a Mangcoding client, so the set is composed from screenshots Sechan took during
// the internship (Mangcoding allowed it, A-004). The sources stay where they are; a real end user's name and photo,
// a stock photo of a person, and the dev terminal seen through the scan camera are covered in the frame instead.
const MANGCODING = 'D:/Projects/about-me/assets/mangcoding';

const PHOTO_PLACEHOLDER = '#ece6e3';
const VIEWFINDER = '#1c1c1c';

const project = {
  slug: 'welling',
  baseUrl: 'http://127.0.0.1:1',
  viewport: { width: 709, height: 1600, deviceScaleFactor: 1 },
  allowHosts: [],
  shots: [],
  listing: {
    type: 'mobile',
    label: 'UI slicing',
    sampleData: true,
    title: 'Welling',
    hook: "Community feeds and test-strip scans.",
    tagline: "Screens for Welling, a women's health app for a South Korean client, built during the Mangcoding internship.",
    cover: { shot: 'community' },
    slides: [
      { shot: 'community', caption: 'The Community screen with search, events, category filters and the post feed' },
      { shot: 'scan-guide', caption: 'A camera guide for placing the test strip before the scan' },
      { shot: 'scan-failed', caption: 'A failed photo tells the user why and offers a retake' },
      { shot: 'scan-result', caption: "The scan result screen, showing the analysis from the client's backend" },
    ],
    sources: {
      community: {
        file: `${MANGCODING}/welling_7.jpg`,
        cover: [
          // Event banner: a photo of a real person, and the edge of the next banner beside it.
          { x: 36, y: 428, w: 643, h: 343, kind: 'block', fill: PHOTO_PLACEHOLDER, radius: 28 },
          { x: 694, y: 428, w: 15, h: 343, kind: 'block', fill: PHOTO_PLACEHOLDER, radius: 10 },
          { x: 66, y: 1068, w: 80, h: 80, kind: 'avatar', value: 'Jiwoo Han', fill: '#ffffff' },
          { x: 154, y: 1072, w: 140, h: 36, kind: 'name', value: 'Jiwoo Han', fill: '#ffffff', color: '#111111', size: 25, weight: 700 },
        ],
      },
      'scan-guide': {
        file: `${MANGCODING}/welling_4.jpg`,
        // The camera preview shows the Expo dev server terminal; three overlapping blocks blank it while the guide
        // brackets at its corners stay visible.
        cover: [
          { x: 45, y: 609, w: 620, h: 279, kind: 'block', fill: VIEWFINDER, radius: 22 },
          { x: 116, y: 601, w: 478, h: 295, kind: 'block', fill: VIEWFINDER },
          { x: 36, y: 680, w: 637, h: 136, kind: 'block', fill: VIEWFINDER },
        ],
      },
      'scan-failed': `${MANGCODING}/welling_5.jpg`,
      'scan-result': `${MANGCODING}/welling_6.jpg`,
    },
  },
};

export default project;
