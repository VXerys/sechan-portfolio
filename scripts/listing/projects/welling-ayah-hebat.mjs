// No capture step: both apps belong to Mangcoding clients, so the set is composed from screenshots Sechan took during
// the internship (Mangcoding allowed it, A-004). The sources stay where they are; real end users' names and photos,
// a stock photo of a person, his own test-account handle, and the dev terminal seen through the scan camera are
// covered in the frame instead.
const MANGCODING = 'D:/Projects/about-me/assets/mangcoding';
const AYAH_HEBAT_RANKING = 'C:/Users/PLN/Downloads/ranking-ayahhebat.jpg';

// Ranking rows sit 136 px apart in the 709x1600 source.
const ROW = 136;
const rankingName = (row, value, w = 253) => ({ x: 234, y: 674 + ROW * row, w, h: 44, kind: 'name', value, fill: '#ffffff', color: '#1f1f1f', size: 29, weight: 600 });
const rankingAvatar = (row, value) => ({ x: 134, y: 650 + ROW * row, w: 88, h: 88, kind: 'avatar', value, fill: '#ffffff' });

const PHOTO_PLACEHOLDER = '#ece6e3';
const VIEWFINDER = '#1c1c1c';

const project = {
  slug: 'welling-ayah-hebat',
  baseUrl: 'http://127.0.0.1:1',
  viewport: { width: 709, height: 1600, deviceScaleFactor: 1 },
  allowHosts: [],
  shots: [],
  listing: {
    type: 'mobile',
    label: 'UI slicing',
    sampleData: true,
    title: 'Welling and Ayah Hebat',
    tagline: "UI work on two Mangcoding client apps: a women's health app for a South Korean client and an Islamic parenting app.",
    cover: { shot: 'community' },
    slides: [
      { shot: 'community', caption: 'Welling: the Community screen with search, events, category filters and the post feed' },
      { shot: 'scan-guide', caption: 'Welling: a camera guide for placing the test strip before the scan' },
      { shot: 'scan-failed', caption: 'Welling: a failed photo tells the user why and offers a retake' },
      { shot: 'scan-result', caption: "Welling: the scan result screen, showing the analysis from the client's backend" },
      { shot: 'ranking', caption: "Ayah Hebat: Daily, Monthly and Ever rankings with the user's own position on top" },
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
      ranking: {
        file: AYAH_HEBAT_RANKING,
        cover: [
          { x: 230, y: 455, w: 250, h: 42, kind: 'name', value: 'Fikri Ramadhan', fill: '#ffffff', color: '#1f1f1f', size: 30, weight: 600, align: 'center' },
          rankingAvatar(0, 'Admin'),
          rankingAvatar(1, 'Fajar'),
          rankingName(1, 'Fajar'),
          rankingAvatar(2, 'Hamid'),
          rankingName(2, 'Hamid'),
          rankingAvatar(3, 'Rizal'),
          rankingName(3, 'Rizal'),
          rankingAvatar(4, 'Bilal'),
          rankingName(4, 'Bilal'),
          // The truncated name ends in an ellipsis that runs up to the trophy.
          rankingName(5, 'Yusuf Hakim', 271),
        ],
      },
    },
  },
};

export default project;
