// Invented sample data for the ArtConnect listing (BR-013). No row is copied from the live app, its backend, or any
// export: the artist, every contact, every artwork, and every amount here were made up for the screenshots. Emails use
// the reserved example.com domain, and phone numbers are left empty so no real number can appear on a slide.
// The file name has a dot, which the kit's slug rule rejects, so this module can never be loaded as a project itself.

export const ARTIST_AUTH_ID = '6f1e2d3c-0000-4000-8000-00000000a001';
export const ARTIST_PROFILE_ID = '6f1e2d3c-0000-4000-8000-00000000b001';
export const ARTIST = { fullName: 'Kirana Sasmita', email: 'kirana.studio@example.com' };

// Dates are relative to the capture, because the analytics page buckets sales into the six months before "now".
const NOW = new Date();
function monthsAgo(months, day, hour = 10) {
  const date = new Date(NOW.getFullYear(), NOW.getMonth() - months, 1, hour);
  const lastDay = months === 0 ? NOW.getDate() : new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.max(1, Math.min(day, lastDay)));
  return date.toISOString();
}
const daysAgo = (days, hour = 9) => new Date(NOW.getTime() - days * 86_400_000 + hour * 3_600_000).toISOString();

// Abstract compositions drawn from a few shapes, so every thumbnail is plainly not a photo of a person or a real work.
const PALETTES = {
  dusk: ['#2b1d3a', '#8c3f5d', '#e0805a', '#f3c98b'],
  sea: ['#0f2e3d', '#1f6f78', '#7fbcb2', '#e8e1c9'],
  clay: ['#3b2618', '#a0522d', '#d9a066', '#f1e3c6'],
  moss: ['#1d2b1f', '#4f6d3a', '#a3b86c', '#efe6c4'],
  indigo: ['#141b3c', '#2f4b9a', '#8aa3d6', '#f0ece2'],
  ember: ['#2a0f12', '#b2332e', '#f08a3c', '#fbe3b0'],
};

function artworkSvg(seed, paletteName, kind) {
  const [deep, mid, light, paper] = PALETTES[paletteName];
  const shapes = {
    bands: `<rect width="600" height="450" fill="${paper}"/><rect y="40" width="600" height="120" fill="${light}"/><rect y="170" width="600" height="150" fill="${mid}"/><rect y="330" width="600" height="80" fill="${deep}"/><circle cx="${420 + (seed % 5) * 20}" cy="120" r="56" fill="${paper}" opacity="0.85"/>`,
    circles: `<rect width="600" height="450" fill="${deep}"/><circle cx="210" cy="225" r="150" fill="${mid}"/><circle cx="${330 + (seed % 4) * 15}" cy="200" r="110" fill="${light}" opacity="0.8"/><circle cx="420" cy="290" r="60" fill="${paper}" opacity="0.9"/>`,
    waves: `<rect width="600" height="450" fill="${paper}"/><path d="M0 200 Q150 ${120 + seed * 3} 300 200 T600 200 V450 H0Z" fill="${light}"/><path d="M0 280 Q150 220 300 280 T600 ${270 - seed} V450 H0Z" fill="${mid}"/><path d="M0 360 Q150 320 300 360 T600 350 V450 H0Z" fill="${deep}"/>`,
    grid: `<rect width="600" height="450" fill="${paper}"/><rect x="40" y="40" width="250" height="170" fill="${mid}"/><rect x="310" y="40" width="250" height="250" fill="${deep}"/><rect x="40" y="230" width="250" height="180" fill="${light}"/><rect x="310" y="310" width="250" height="100" fill="${mid}" opacity="0.6"/>`,
    arcs: `<rect width="600" height="450" fill="${deep}"/><path d="M60 450 A240 240 0 0 1 540 450Z" fill="${mid}"/><path d="M140 450 A160 160 0 0 1 460 450Z" fill="${light}"/><path d="M220 450 A80 80 0 0 1 380 450Z" fill="${paper}"/><circle cx="${120 + seed * 7}" cy="90" r="34" fill="${light}"/>`,
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">${shapes[kind]}</svg>`;
}

// [title, medium, dimensions, year, status, price IDR, palette, composition, months ago (sold) or days ago (others)]
const ARTWORKS = [
  ['Hujan di Pelataran', 'Cat minyak di kanvas', '90 x 120 cm', 2026, 'sold', 18_500_000, 'indigo', 'waves', 0],
  ['Arus Tenang', 'Akrilik di kanvas', '80 x 100 cm', 2026, 'sold', 14_000_000, 'sea', 'waves', 0],
  ['Senja Terakota', 'Cat minyak di kanvas', '60 x 80 cm', 2026, 'sold', 11_750_000, 'clay', 'arcs', 1],
  ['Komposisi Daun No. 4', 'Cat air di kertas', '42 x 56 cm', 2026, 'sold', 6_500_000, 'moss', 'grid', 1],
  ['Fragmen Ombak', 'Akrilik di kanvas', '100 x 100 cm', 2025, 'sold', 21_000_000, 'sea', 'circles', 2],
  ['Peta Ingatan', 'Mixed media di panel', '70 x 70 cm', 2025, 'sold', 9_800_000, 'dusk', 'grid', 3],
  ['Ritme Bambu', 'Tinta di kertas', '50 x 70 cm', 2025, 'sold', 5_200_000, 'moss', 'bands', 3],
  ['Jendela Merah', 'Cat minyak di kanvas', '60 x 90 cm', 2025, 'sold', 12_400_000, 'ember', 'grid', 4],
  ['Lanskap Biru No. 3', 'Akrilik di kanvas', '80 x 120 cm', 2025, 'sold', 16_000_000, 'indigo', 'bands', 5],
  ['Bayang Kapas', 'Cat air di kertas', '38 x 56 cm', 2026, 'finished', 4_800_000, 'dusk', 'circles', 6],
  ['Musim Kering', 'Cat minyak di kanvas', '100 x 140 cm', 2026, 'finished', 27_500_000, 'clay', 'bands', 11],
  ['Rumah Lumut', 'Akrilik di kanvas', '60 x 60 cm', 2026, 'finished', 8_900_000, 'moss', 'arcs', 18],
  ['Pagi Tanpa Suara', 'Cetak cukil kayu', '40 x 60 cm', 2026, 'finished', 3_600_000, 'indigo', 'circles', 25],
  ['Garis Pasang Surut', 'Akrilik di kanvas', '90 x 90 cm', 2026, 'wip', 15_000_000, 'sea', 'bands', 3],
  ['Kebun Indigo', 'Cat minyak di kanvas', '70 x 100 cm', 2026, 'wip', 13_500_000, 'indigo', 'arcs', 5],
  ['Studi Tekstur Batu', 'Mixed media di panel', '50 x 50 cm', 2026, 'wip', 7_200_000, 'clay', 'circles', 9],
  ['Nyala Pelan', 'Cat air di kertas', '42 x 56 cm', 2026, 'wip', 4_500_000, 'ember', 'waves', 14],
  ['Sketsa Dermaga', 'Pensil dan tinta di kertas', '30 x 42 cm', 2026, 'concept', null, 'sea', 'grid', 2],
  ['Serial Jendela Pagi', 'Akrilik di kanvas', '60 x 80 cm', 2026, 'concept', 9_000_000, 'dusk', 'bands', 4],
  ['Lapisan Tanah Liat', 'Mixed media di panel', '80 x 80 cm', 2026, 'concept', null, 'clay', 'waves', 8],
];

export function buildFixtures(origin) {
  const files = {};
  const artworks = ARTWORKS.map(([title, medium, dimensions, year, status, price, palette, kind, age], index) => {
    const id = `7a2b0c00-0000-4000-8000-${String(index + 1).padStart(12, '0')}`;
    const file = `artworks/${id}.svg`;
    files[file] = { contentType: 'image/svg+xml', body: artworkSvg(index + 1, palette, kind) };
    const updated = status === 'sold' ? monthsAgo(age, 3 + ((index * 5) % 20)) : daysAgo(age);
    return {
      id,
      user_id: ARTIST_PROFILE_ID,
      title,
      description: `Karya ${medium.toLowerCase()} dari seri studio ${year}.`,
      medium,
      dimensions,
      year,
      status,
      price,
      currency: 'IDR',
      image_url: `${origin}/storage/v1/object/public/${file}`,
      thumbnail_url: null,
      images: [],
      category: 'Lukisan',
      tags: [],
      is_featured: index < 3,
      is_archived: false,
      sold_at: status === 'sold' ? updated : null,
      sold_price: status === 'sold' ? price : null,
      buyer_contact_id: null,
      notes: null,
      metadata: {},
      // Created before the update so a "recent first" order matches what an artist would have entered.
      created_at: new Date(new Date(updated).getTime() - 20 * 86_400_000).toISOString(),
      updated_at: updated,
    };
  });

  // [name, type, company, city]
  const CONTACTS = [
    ['Galeri Rumah Kaca', 'gallery', 'Galeri Rumah Kaca', 'Bandung'],
    ['Ruang Tepi Barat', 'gallery', 'Ruang Tepi Barat', 'Yogyakarta'],
    ['Studio Lantai Dua', 'gallery', 'Studio Lantai Dua', 'Jakarta'],
    ['Museum Kota Lama', 'museum', 'Museum Kota Lama', 'Semarang'],
    ['Arunika Prameswari', 'collector', null, 'Jakarta'],
    ['Bima Satria Wardana', 'collector', null, 'Surabaya'],
    ['Citra Laksmi Handayani', 'collector', null, 'Bandung'],
    ['Dimas Arya Pratama', 'collector', null, 'Denpasar'],
    ['Elok Kusumawati', 'collector', null, 'Malang'],
    ['Fajar Nugraha Putra', 'collector', null, 'Bogor'],
    ['Gita Maharani', 'curator', 'Kurasi Lepas', 'Yogyakarta'],
    ['Hendra Saputra Wijaya', 'collector', null, 'Medan'],
    ['Intan Permatasari', 'curator', 'Ruang Tepi Barat', 'Yogyakarta'],
  ];
  const contacts = CONTACTS.map(([name, type, company, location], index) => ({
    id: `7c0c0000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
    user_id: ARTIST_PROFILE_ID,
    name,
    type,
    email: `kontak${index + 1}@example.com`,
    phone: null,
    location,
    address: null,
    website: null,
    company,
    position: null,
    rating: 3 + (index % 3),
    notes: null,
    tags: [],
    social_media: {},
    preferences: {},
    total_purchases: 0,
    purchase_count: 0,
    last_contact_at: daysAgo(index * 4 + 1),
    is_active: true,
    is_vip: index % 4 === 0,
    created_at: daysAgo(200 - index * 9),
    updated_at: daysAgo(index * 4 + 1),
  }));

  const activityTypes = ['artwork_created', 'artwork_updated', 'contact_added', 'artwork_sold'];
  const activity_logs = Array.from({ length: 26 }, (_, index) => ({
    id: `7d0a0000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
    user_id: ARTIST_PROFILE_ID,
    activity_type: activityTypes[index % activityTypes.length],
    title: 'Aktivitas studio',
    description: null,
    entity_type: 'artwork',
    entity_id: null,
    entity_title: null,
    metadata: {},
    ip_address: null,
    user_agent: null,
    created_at: daysAgo(index * 6 + 1),
  }));

  const notifications = [
    ['Karya terjual', 'Hujan di Pelataran ditandai terjual', 'success', false, 1],
    ['Kontak baru', 'Galeri Rumah Kaca ditambahkan ke kontak', 'info', false, 2],
    ['Pengingat', 'Perbarui foto karya Garis Pasang Surut', 'warning', true, 6],
  ].map(([title, message, type, isRead, age], index) => ({
    id: `7e0e0000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
    user_id: ARTIST_AUTH_ID,
    title,
    message,
    type,
    is_read: isRead,
    action_url: null,
    metadata: {},
    created_at: daysAgo(age),
  }));

  const profile = {
    id: ARTIST_PROFILE_ID,
    auth_id: ARTIST_AUTH_ID,
    firebase_uid: null,
    email: ARTIST.email,
    full_name: ARTIST.fullName,
    avatar_url: null,
    phone: null,
    role: 'artist',
    business_name: 'Studio Sasmita',
    bio: null,
    website: null,
    location: 'Bandung',
    currency: 'IDR',
    timezone: 'Asia/Jakarta',
    settings: {},
    is_active: true,
    email_verified: true,
    last_login_at: daysAgo(0),
    created_at: '2026-01-05T08:00:00.000Z',
    updated_at: daysAgo(0),
  };

  return {
    tables: { artworks, contacts, activity_logs, notifications, users: [profile] },
    rpc: { link_or_create_profile: () => [profile] },
    files,
  };
}
