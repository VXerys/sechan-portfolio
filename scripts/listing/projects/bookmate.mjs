// No capture step: the screens are raw screenshots of the production app taken on the owner's own test accounts, so
// compose reads them straight from the download folder through `sources` and never copies them into the repo.
const RAW = 'C:/Users/PLN/Downloads/listing-bookmate';

const project = {
  slug: 'bookmate',
  baseUrl: 'http://127.0.0.1:1',
  viewport: { width: 709, height: 1600, deviceScaleFactor: 1 },
  allowHosts: [],
  shots: [],
  listing: {
    type: 'mobile',
    label: 'Full-stack',
    sampleData: false,
    title: 'BookMate',
    tagline: 'A reading-community app on Google Play for tracking reading progress, writing reflections and borrowing books.',
    cover: { shot: 'home' },
    slides: [
      { shot: 'home', caption: 'Resume the current book and see recent reading from the home screen' },
      { shot: 'reading', caption: 'Log pages, percent or chapters with a note and share it to a community' },
      { shot: 'borrow', caption: 'Approve or decline borrow requests from other readers' },
      { shot: 'community', caption: 'Run a private community with its members and shared book collection' },
      { shot: 'chat', caption: 'Chat with the borrower about pickup, inside the loan' },
    ],
    sources: {
      home: `${RAW}/home-screen-bookmate/home-screen-bookmate.jpg`,
      reading: `${RAW}/activity-reading/detail-catat-bacaan.jpg`,
      borrow: `${RAW}/aktivitas-pinjam/detail-aktivitas-pinjam-permintaanpinjam-saya.jpg`,
      community: `${RAW}/komunitas/detail-komunitas-section-1.jpg`,
      chat: `${RAW}/chat-bookmate.png`,
    },
  },
};

export default project;
