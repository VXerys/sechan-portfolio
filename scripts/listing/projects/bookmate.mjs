// No capture step: the screens are raw screenshots of the production app taken on the owner's own test accounts, so
// compose reads them straight from the download folder through `sources` and never copies them into the repo.
const RAW = 'C:/Users/PLN/Downloads/listing-bookmate';

// Other readers appear on three screens (borrowers, the reader who listed a book, community members); their names and
// avatars get sample values in the frame. Sehan's own name and photo stay. Borrow cards 1 and 2 are the same reader.
const borrower = (y, value) => [
  { x: 54, y: y + 1, w: 56, h: 56, kind: 'avatar', value, fill: '#ffffff' },
  { x: 121, y, w: 137, h: 34, kind: 'name', value, fill: '#ffffff', color: '#111111', size: 26, weight: 600 },
];

const project = {
  slug: 'bookmate',
  baseUrl: 'http://127.0.0.1:1',
  viewport: { width: 709, height: 1600, deviceScaleFactor: 1 },
  allowHosts: [],
  shots: [],
  listing: {
    type: 'mobile',
    label: 'Full-stack',
    sampleData: true,
    title: 'BookMate',
    tagline: 'A reading-community app on Google Play for tracking reading progress, writing reflections and borrowing books.',
    cover: { shot: 'home' },
    slides: [
      { shot: 'home', caption: 'Resume the current book and see recent reading from the home screen' },
      { shot: 'reading', caption: 'Log pages, percent or chapters with a note and share it to a community' },
      { shot: 'borrow', caption: 'Approve or decline borrow requests from other readers' },
      { shot: 'community', caption: 'Run a private community with its members and shared book collection' },
    ],
    sources: {
      home: `${RAW}/home-screen-bookmate/home-screen-bookmate.jpg`,
      reading: {
        file: `${RAW}/activity-reading/detail-catat-bacaan.jpg`,
        cover: [{ x: 213, y: 370, w: 240, h: 34, kind: 'name', value: 'Nadia Putri', fill: '#ffffff', color: '#a1a1aa', size: 26, weight: 400 }],
      },
      borrow: {
        file: `${RAW}/aktivitas-pinjam/detail-aktivitas-pinjam-permintaanpinjam-saya.jpg`,
        cover: [...borrower(454, 'Raka'), ...borrower(911, 'Raka'), ...borrower(1266, 'Dimas')],
      },
      community: {
        file: `${RAW}/komunitas/detail-komunitas-section-1.jpg`,
        cover: [
          ['Raka', 175],
          ['Dimas', 289],
          ['Sari', 403],
          ['Wulan', 517],
        ].map(([value, x]) => ({ x, y: 1386, w: 98, h: 98, kind: 'avatar', value, fill: '#fcf9f4' })),
      },
    },
  },
};

export default project;
