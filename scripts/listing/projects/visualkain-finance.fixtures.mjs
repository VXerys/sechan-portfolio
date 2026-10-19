// Invented records for the VisualKain Finance listing (BR-013). Every customer, vendor, order, and amount here is made
// up; nothing comes from the app's own seed file, which holds real customers. Business names use invented words, no
// phone number or real email exists anywhere, and amounts are round figures a small garment workshop could plausibly see.
// Dates sit in October 2026 because the app only books entries from 1 October 2026 onwards.

export const PROJECT_ID = 'demo-visualkain';
export const OWNER = {
  localId: 'sampel-admin-finansial',
  email: 'finance.sampel@example.test',
  // Only ever used against the local emulator; it is not anyone's password.
  password: 'listing-sample-only',
  displayName: 'Sampel Admin Finansial',
};
const STAMP = { createdBy: OWNER.displayName, createdByEmail: OWNER.email };

const OPENING_BALANCE = 15_000_000;
// The SOP: cutting and sewing start only once the customer has paid at least 70% (SOP_FINANCE.DP_THRESHOLD_PERCENT).
const DP_THRESHOLD = 0.7;
const PRODUCTION_STATUSES = new Set(['production', 'delivery', 'completed']);
const SIZES = ['S', 'M', 'L', 'XL'];

export const VENDORS = [
  { id: 'vnd-lentara', nama: 'Konveksi Lentara', pic: 'Sampel Lentara', alamat: 'Kota Contoh' },
  { id: 'vnd-pravesa', nama: 'Sablon Pravesa', pic: 'Sampel Pravesa', alamat: 'Kota Contoh' },
  { id: 'vnd-undira', nama: 'Jahit Undira', pic: 'Sampel Undira', alamat: 'Kota Lain' },
];

// cut: the sleeve field family the app prices by (pendek = short, panjang = long sleeve).
const ORDERS = [
  {
    id: 'ord-sampel-01', noInv: 'INV-SMP-2610-01', tanggal: '2026-10-02', customer: 'Kedai Arvela', project: 'Seragam Barista',
    kategori: 'Kemeja', bahan: 'American Drill', warna: 'Hitam', status: 'completed', vendorId: 'vnd-undira',
    cut: 'panjang', jual: 165_000, modal: 110_000, qty: { S: 4, M: 10, L: 8, XL: 2 }, opex: 75_000,
    customerPays: [['2026-10-02', 2_772_000, 'dp'], ['2026-10-12', 1_188_000, 'pelunasan']],
    vendorPays: [['2026-10-03', 1_848_000], ['2026-10-13', 792_000]],
  },
  {
    id: 'ord-sampel-02', noInv: 'INV-SMP-2610-02', tanggal: '2026-10-03', customer: 'Komunitas Lari Tarvega', project: 'Kaos Fun Run 2026',
    kategori: 'Kaos', bahan: 'Cotton Combed 30s', warna: 'Oranye', status: 'delivery', vendorId: 'vnd-pravesa',
    cut: 'pendek', jual: 68_000, modal: 44_000, qty: { S: 20, M: 45, L: 40, XL: 15 }, opex: 120_000,
    customerPays: [['2026-10-03', 5_712_000, 'dp']],
    vendorPays: [['2026-10-04', 3_696_000]],
  },
  {
    id: 'ord-sampel-03', noInv: 'INV-SMP-2610-03', tanggal: '2026-10-05', customer: 'Toko Kelvaya', project: 'Polo Staf Toko',
    kategori: 'Polo', bahan: 'Lacoste CVC', warna: 'Navy', status: 'completed', vendorId: 'vnd-lentara',
    cut: 'pendek', jual: 120_000, modal: 80_000, qty: { S: 6, M: 14, L: 12, XL: 4 }, opex: 50_000,
    customerPays: [['2026-10-05', 3_024_000, 'dp'], ['2026-10-09', 1_296_000, 'pelunasan']],
    vendorPays: [['2026-10-06', 2_016_000], ['2026-10-10', 864_000]],
  },
  {
    id: 'ord-sampel-04', noInv: 'INV-SMP-2610-04', tanggal: '2026-10-06', customer: 'Klub Sepeda Wiskana', project: 'Jersey Gowes Pagi',
    kategori: 'Jersey', bahan: 'Dryfit Milano', warna: 'Biru Muda', status: 'production', vendorId: 'vnd-pravesa',
    cut: 'pendek', jual: 135_000, modal: 92_000, qty: { S: 6, M: 18, L: 16, XL: 8 }, diskon: 180_000, opex: 90_000,
    customerPays: [['2026-10-06', 4_410_000, 'dp']],
    vendorPays: [['2026-10-07', 2_208_000]],
  },
  {
    id: 'ord-sampel-05', noInv: 'INV-SMP-2610-05', tanggal: '2026-10-08', customer: 'Studio Morasti', project: 'Hoodie Kru Produksi',
    kategori: 'Hoodie', bahan: 'Fleece Cotton', warna: 'Abu Tua', status: 'production', vendorId: 'vnd-lentara',
    cut: 'panjang', jual: 210_000, modal: 145_000, qty: { S: 4, M: 12, L: 10, XL: 4 }, biayaVendor: 300_000, opex: 60_000,
    customerPays: [['2026-10-08', 2_520_000, 'dp'], ['2026-10-10', 1_890_000, 'termin']],
    vendorPays: [['2026-10-11', 2_325_000]],
  },
  {
    id: 'ord-sampel-06', noInv: 'INV-SMP-2610-06', tanggal: '2026-10-14', customer: 'Yayasan Halvesa', project: 'Kemeja Panitia Bazar',
    kategori: 'Kemeja', bahan: 'Oxford', warna: 'Putih', status: 'payment', vendorId: 'vnd-undira',
    cut: 'panjang', jual: 150_000, modal: 98_000, qty: { S: 10, M: 22, L: 20, XL: 8 }, opex: 0,
    customerPays: [['2026-10-14', 2_700_000, 'dp']],
    vendorPays: [],
  },
  {
    id: 'ord-sampel-07', noInv: 'INV-SMP-2610-07', tanggal: '2026-10-15', customer: 'Bengkel Nolendra', project: 'Wearpack Mekanik',
    kategori: 'Wearpack', bahan: 'American Drill', warna: 'Hijau Army', status: 'production', vendorId: 'vnd-undira',
    cut: 'panjang', jual: 185_000, modal: 125_000, qty: { S: 2, M: 8, L: 7, XL: 3 }, opex: 40_000,
    customerPays: [['2026-10-15', 2_775_000, 'dp']],
    vendorPays: [['2026-10-16', 1_250_000]],
  },
  {
    id: 'ord-sampel-08', noInv: 'INV-SMP-2610-08', tanggal: '2026-10-17', customer: 'Panitia Pentas Sorvanda', project: 'Kaos Panitia Pentas',
    kategori: 'Kaos', bahan: 'Cotton Combed 24s', warna: 'Kuning', status: 'received', vendorId: 'vnd-pravesa',
    cut: 'pendek', jual: 65_000, modal: 42_000, qty: { S: 15, M: 30, L: 25, XL: 10 }, opex: 0,
    customerPays: [],
    vendorPays: [],
  },
];

// Non-order cash: the opening balance, one other income line, and the workshop's own running costs.
const KAS = [
  { id: 'kas-sampel-01', tanggal: '2026-10-01', jenis: 'masuk', kategori: 'Saldo Awal', nominal: OPENING_BALANCE, keterangan: 'Saldo awal rekening operasional Oktober' },
  { id: 'kas-sampel-02', tanggal: '2026-10-02', jenis: 'keluar', kategori: 'Perawatan Web/Sistem', nominal: 250_000, keterangan: 'Hosting dan domain bulanan' },
  { id: 'kas-sampel-03', tanggal: '2026-10-05', jenis: 'keluar', kategori: 'Operasional', nominal: 1_200_000, keterangan: 'Sewa ruang kantor dan listrik' },
  { id: 'kas-sampel-04', tanggal: '2026-10-08', jenis: 'keluar', kategori: 'Iklan/Marketing', nominal: 450_000, keterangan: 'Iklan media sosial katalog seragam' },
  { id: 'kas-sampel-05', tanggal: '2026-10-10', jenis: 'keluar', kategori: 'Gaji/Upah', nominal: 3_500_000, keterangan: 'Upah tim admin dan desain' },
  { id: 'kas-sampel-06', tanggal: '2026-10-13', jenis: 'masuk', kategori: 'Pendapatan Lain', nominal: 600_000, keterangan: 'Penjualan sisa kain potongan' },
  { id: 'kas-sampel-07', tanggal: '2026-10-16', jenis: 'keluar', kategori: 'Transport/Ongkir', nominal: 320_000, keterangan: 'Kurir pengiriman ke customer' },
];

export const CP_KATEGORI = [
  { id: 'cpk-kaos', nama: 'Kaos' },
  { id: 'cpk-kemeja', nama: 'Kemeja' },
  { id: 'cpk-hoodie', nama: 'Hoodie' },
  { id: 'cpk-jersey', nama: 'Jersey' },
  { id: 'cpk-polo', nama: 'Polo' },
];
export const CP_BAHAN = [
  { id: 'cpb-01', kategoriId: 'cpk-kaos', nama: 'Cotton Combed 30s', harga: 42_000 },
  { id: 'cpb-02', kategoriId: 'cpk-kaos', nama: 'Cotton Combed 24s', harga: 46_000 },
  { id: 'cpb-03', kategoriId: 'cpk-kemeja', nama: 'American Drill', harga: 78_000 },
  { id: 'cpb-04', kategoriId: 'cpk-kemeja', nama: 'Oxford', harga: 72_000 },
  { id: 'cpb-05', kategoriId: 'cpk-hoodie', nama: 'Fleece Cotton', harga: 115_000 },
  { id: 'cpb-06', kategoriId: 'cpk-jersey', nama: 'Dryfit Milano', harga: 58_000 },
  { id: 'cpb-07', kategoriId: 'cpk-polo', nama: 'Lacoste CVC', harga: 64_000 },
];
export const CP_MARKUP = [
  { id: 'cpm-01', qtyMin: 1, qtyMax: 12, persen: 60 },
  { id: 'cpm-02', qtyMin: 13, qtyMax: 48, persen: 45 },
  { id: 'cpm-03', qtyMin: 49, qtyMax: 120, persen: 35 },
  { id: 'cpm-04', qtyMin: 121, qtyMax: 500, persen: 28 },
];

const capitalize = (cut) => cut.charAt(0).toUpperCase() + cut.slice(1);

// Same arithmetic as the app's calculateOrderTotals for S to XL (no size surcharge): invoice net of discount, HPP
// is vendor base price times quantity plus the vendor's extra charge.
export function orderTotals(order) {
  const pcs = SIZES.reduce((sum, size) => sum + (order.qty[size] ?? 0), 0);
  const invoice = pcs * order.jual - (order.diskon ?? 0);
  const hpp = pcs * order.modal + (order.biayaVendor ?? 0);
  return { pcs, invoice, hpp, paid: sum(order.customerPays.map(([, nominal]) => nominal)), vendorPaid: sum(order.vendorPays.map(([, nominal]) => nominal)) };
}

const sum = (values) => values.reduce((total, value) => total + value, 0);

function orderDoc(order) {
  const { pcs, paid, vendorPaid } = orderTotals(order);
  const Cut = capitalize(order.cut);
  const sizes = Object.fromEntries(SIZES.map((size) => [`${order.cut}${size}`, order.qty[size] ?? 0]));
  const vendor = VENDORS.find((item) => item.id === order.vendorId);
  const pembayaranList = order.customerPays.map(([tanggal, nominal, jenis], index) => ({
    id: `${order.id}-p-${index + 1}`,
    orderId: order.id,
    noInv: order.noInv,
    tanggal,
    nominal,
    jenis,
    terminKe: index + 1,
    label: '',
    keterangan: jenis === 'pelunasan' ? 'Pelunasan via transfer' : jenis === 'dp' ? 'DP via transfer' : 'Termin via transfer',
    createdAt: `${tanggal}T03:00:00.000Z`,
    ...STAMP,
  }));
  return {
    id: order.id,
    noInv: order.noInv,
    tanggalInv: order.tanggal,
    namaCustomer: order.customer,
    namaProject: order.project,
    noWaCustomer: '',
    kategoriOrder: order.kategori,
    jenisBahan: order.bahan,
    warna: order.warna,
    deadline: '2026-11-07',
    jenisMetodeProduksi: 'Konveksi',
    status: order.status,
    vendorId: order.vendorId,
    [`harga${Cut}`]: order.jual,
    [`hargaVendor${Cut}`]: order.modal,
    ...sizes,
    totalPesanan: pcs,
    diskonHarga: order.diskon ?? 0,
    biayaLainnya: order.biayaVendor ?? 0,
    biayaOperasional: order.opex,
    dpPersen: 70,
    pembayaranList,
    riwayatPembayaran: pembayaranList.map(({ id, tanggal, nominal, jenis, terminKe, keterangan }) => ({ id, tanggal, nominal, jumlah: nominal, jenis, terminKe, catatan: keterangan, keterangan })),
    dpNominal: paid,
    totalUangMasukCustomer: paid,
    vendorPembayaranList: order.vendorPays.map(([tanggal, nominal], index) => ({
      id: `${order.id}-vp-${index + 1}`,
      orderId: order.id,
      vendorName: vendor.nama,
      tanggal,
      nominal,
      jenis: index === 0 ? 'dp_vendor' : 'termin_vendor',
      terminKe: index + 1,
      label: '',
      keterangan: 'Transfer ke vendor',
      catatan: 'Transfer ke vendor',
      createdAt: `${tanggal}T04:00:00.000Z`,
      ...STAMP,
    })),
    totalDibayarKeVendor: vendorPaid,
    dpNominalPO: vendorPaid,
    createdAt: new Date(`${order.tanggal}T02:00:00.000Z`),
    ...STAMP,
  };
}

/**
 * Fails the capture before any seeding when the invented numbers break the client's money rules:
 * production only after a 70% down payment, every vendor payment covered by the vendor's proportional share
 * (payment x HPP / invoice) of what the customer had paid by then, so vendors never eat VisualKain's margin, and
 * real cash = opening balance + money in - money out, never negative on any day.
 */
export function checkMoneyRules() {
  const ledger = [];
  const rows = ORDERS.map((order) => {
    const totals = orderTotals(order);
    const { invoice, hpp, paid, vendorPaid } = totals;
    if (paid > invoice || vendorPaid > hpp) throw new Error(`${order.id}: paid more than billed`);
    if (PRODUCTION_STATUSES.has(order.status) && paid < DP_THRESHOLD * invoice) throw new Error(`${order.id}: in ${order.status} below the 70% down payment`);
    if (order.status === 'completed' && paid !== invoice) throw new Error(`${order.id}: completed but not paid in full`);
    for (const [tanggal, nominal] of order.vendorPays) {
      const paidByThen = sum(order.customerPays.filter(([date]) => date <= tanggal).map(([, amount]) => amount));
      if (paidByThen < DP_THRESHOLD * invoice) throw new Error(`${order.id}: vendor paid on ${tanggal} before the 70% down payment`);
      const vendorByThen = sum(order.vendorPays.filter(([date]) => date <= tanggal).map(([, amount]) => amount));
      if (vendorByThen > paidByThen * (hpp / invoice) + 0.5) throw new Error(`${order.id}: vendor paid ${vendorByThen} by ${tanggal}, above its HPP share`);
      ledger.push([tanggal, -nominal]);
    }
    for (const [tanggal, nominal] of order.customerPays) ledger.push([tanggal, nominal]);
    if (order.opex) ledger.push([order.tanggal, -order.opex]);
    return { ...order, ...totals, hppShare: paid * (hpp / invoice), marginShare: paid * ((invoice - hpp) / invoice) };
  });
  for (const kas of KAS) if (kas.kategori !== 'Saldo Awal') ledger.push([kas.tanggal, kas.jenis === 'masuk' ? kas.nominal : -kas.nominal]);

  const moneyIn = sum(ledger.filter(([, amount]) => amount > 0).map(([, amount]) => amount));
  const moneyOut = -sum(ledger.filter(([, amount]) => amount < 0).map(([, amount]) => amount));
  let running = OPENING_BALANCE;
  for (const [tanggal, amount] of ledger.sort(([a, x], [b, y]) => a.localeCompare(b) || y - x)) {
    running += amount;
    if (running < 0) throw new Error(`cash goes negative on ${tanggal}`);
  }
  const realCash = OPENING_BALANCE + moneyIn - moneyOut;
  if (realCash !== running) throw new Error('real cash does not reconcile');
  return { openingBalance: OPENING_BALANCE, moneyIn, moneyOut, realCash, orders: rows };
}

export function buildFixtures() {
  return {
    users: [OWNER],
    collections: {
      vendors: VENDORS.map((vendor) => ({ ...vendor, createdAt: new Date('2026-09-20T02:00:00.000Z'), ...STAMP })),
      orders: ORDERS.map(orderDoc),
      kas: KAS.map(({ nominal, ...entry }) => ({ ...entry, nominal, jumlah: nominal, createdAt: new Date(`${entry.tanggal}T05:00:00.000Z`), ...STAMP })),
      cp_kategori: CP_KATEGORI.map((item) => ({ ...item, createdAt: new Date('2026-09-20T02:00:00.000Z'), ...STAMP })),
      cp_bahan: CP_BAHAN.map((item) => ({ ...item, createdAt: new Date('2026-09-20T02:00:00.000Z'), ...STAMP })),
      cp_markup: CP_MARKUP.map((item) => ({ ...item, createdAt: new Date('2026-09-20T02:00:00.000Z'), ...STAMP })),
    },
  };
}
