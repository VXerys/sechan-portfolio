// Invented records for the InztaMoto ERP listing (BR-013). Every product name, reseller, staff entry, and amount here is
// made up; nothing comes from the app's own SEED_* constants, its import script, or any export. Product names use
// invented words, no phone number or real email exists anywhere, and amounts are round figures a small motorcycle bag
// workshop could plausibly see. Field names follow the writes in public/legacy/app-runtime.js (saveSale,
// saveProdOrder, savePurchase, savePayroll, the salary produksi form, and the reseller form).

export const PROJECT_ID = 'demo-inztamoto';
export const OWNER = {
  localId: 'sampel-owner-inztamoto',
  email: 'admin.sampel@example.test',
  // Only ever used against the local emulator; it is not anyone's password.
  password: 'listing-sample-only',
  displayName: 'Admin Sampel',
};

// The legacy runtime reads "today" and "this month" from the browser clock in UTC, so the capture pins the clock here
// and every date below is laid out around it.
export const TODAY = '2026-10-19';
export const CLOCK = new Date(`${TODAY}T03:00:00.000Z`);
const FIRST_DAY = '2026-08-01';
const STAMP = '2026-10-19T02:00:00.000Z';

const CATEGORIES = [
  ['cat-tail', 'Tail Bag', 'tail-bag', 'Tas bagasi belakang motor'],
  ['cat-side', 'Side Bag', 'side-bag', 'Tas samping motor'],
  ['cat-duff', 'Duffel Bag', 'duffel-bag', 'Tas duffel untuk touring'],
  ['cat-tank', 'Tank Bag', 'tank-bag', 'Tas tangki magnetik'],
  ['cat-tool', 'Tool Bag', 'tool-bag', 'Tas perkakas'],
  ['cat-dry', 'Dry Bag', 'dry-bag', 'Tas kedap air'],
  ['cat-pan', 'Pannier Bag', 'pannier-bag', 'Tas samping rangka besi'],
  ['cat-acc', 'Accessories', 'accessories', 'Aksesori riding'],
];

// [id, name, categoryId, sku, cost, price, stock, status]; status follows the app's own thresholds (0 is out of
// stock, 5 or fewer is low stock), and in_production marks a product whose next batch is on the floor.
const PRODUCTS = [
  ['prd-kestrel', 'Tail Bag Kestrel 18L', 'cat-tail', 'INZ-TAIL-01', 92_000, 189_000, 34, 'active'],
  ['prd-sorrel', 'Tail Bag Sorrel 12L', 'cat-tail', 'INZ-TAIL-02', 78_000, 159_000, 4, 'low_stock'],
  ['prd-marlin', 'Side Bag Marlin Pair', 'cat-side', 'INZ-SIDE-01', 135_000, 279_000, 21, 'active'],
  ['prd-taiga', 'Duffel Bag Taiga 45L', 'cat-duff', 'INZ-DUFF-01', 165_000, 329_000, 12, 'in_production'],
  ['prd-halcyon', 'Tank Bag Halcyon Magnetic', 'cat-tank', 'INZ-TANK-01', 98_000, 199_000, 17, 'active'],
  ['prd-quarry', 'Tool Roll Quarry', 'cat-tool', 'INZ-TOOL-01', 45_000, 95_000, 0, 'out_of_stock'],
  ['prd-fjord', 'Dry Bag Fjord 30L', 'cat-dry', 'INZ-DRY-01', 88_000, 175_000, 26, 'active'],
  ['prd-corvid', 'Pannier Corvid 2x25L', 'cat-pan', 'INZ-PAN-01', 245_000, 489_000, 3, 'low_stock'],
  ['prd-tern', 'Rain Cover Tern', 'cat-acc', 'INZ-ACC-01', 22_000, 49_000, 58, 'active'],
  ['prd-wren', 'Bungee Net Wren', 'cat-acc', 'INZ-ACC-02', 15_000, 35_000, 41, 'active'],
];

export const RESELLERS = [
  ['rsl-rantau', 'Garasi Rantau Moto'],
  ['rsl-lintas', 'Kios Lintas Touring'],
  ['rsl-sadel', 'Toko Sadel Kencana'],
  ['rsl-tapak', 'Tapak Roda Supply'],
];

// Real district and city names are public places, not people; no street address or customer name is stored.
const PLACES = [
  ['Coblong', 'Bandung'],
  ['Cibeunying', 'Bandung'],
  ['Cikole', 'Sukabumi'],
  ['Bogor Tengah', 'Bogor'],
  ['Tebet', 'Jakarta Selatan'],
  ['Depok Jaya', 'Depok'],
  ['Lowokwaru', 'Malang'],
  ['Banyumanik', 'Semarang'],
];
const MARKETPLACE_EXPEDITIONS = ['Shopee Express', 'J&T', 'SiCepat', 'JNE', 'Anteraja'];

// A fixed-seed generator keeps every run, and so every capture, identical.
function generator(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function days(from, to) {
  const list = [];
  for (let day = new Date(`${from}T00:00:00Z`); day <= new Date(`${to}T00:00:00Z`); day.setUTCDate(day.getUTCDate() + 1)) {
    list.push(day.toISOString().slice(0, 10));
  }
  return list;
}

const roundTo = (value, step) => Math.round(value / step) * step;

// Marketplaces sell a little under list price after vouchers, resellers buy at 85% of list, and the website and the
// shop sell at list price; the app records that gap as marketplaceDifference.
function unitPriceFor(channel, price) {
  if (channel === 'Shopee' || channel === 'Tokopedia') return roundTo(price * 0.95, 500);
  if (channel === 'Reseller') return roundTo(price * 0.85, 1000);
  return price;
}

function buildSales(products) {
  const random = generator(20261019);
  const pick = (list) => list[Math.floor(random() * list.length)];
  // Weighted toward the bags that sell most in a riding shop; the sold-out tool roll last sold in September.
  const weights = ['prd-kestrel', 'prd-kestrel', 'prd-kestrel', 'prd-marlin', 'prd-marlin', 'prd-halcyon', 'prd-halcyon', 'prd-fjord', 'prd-fjord', 'prd-taiga', 'prd-sorrel', 'prd-corvid', 'prd-tern', 'prd-tern', 'prd-wren', 'prd-quarry'];
  const channels = ['Shopee', 'Shopee', 'Shopee', 'Tokopedia', 'Tokopedia', 'Website', 'Reseller', 'Reseller', 'Offline Store'];
  const sales = [];
  for (const date of days(FIRST_DAY, TODAY)) {
    const month = date.slice(5, 7);
    const perDay = date === TODAY ? 6 : month === '10' ? 4 + Math.floor(random() * 4) : 2 + Math.floor(random() * 3);
    for (let n = 0; n < perDay; n += 1) {
      let productId = pick(weights);
      if (productId === 'prd-quarry' && month === '10') productId = 'prd-kestrel';
      const product = products.find((item) => item.id === productId);
      const channel = pick(channels);
      const reseller = channel === 'Reseller' ? pick(RESELLERS) : null;
      const quantity = reseller ? 2 + Math.floor(random() * 4) : random() < 0.8 ? 1 : 2;
      const [district, city] = pick(PLACES);
      const expedition = channel === 'Offline Store' ? '' : channel === 'Reseller' ? 'JNE' : pick(MARKETPLACE_EXPEDITIONS);
      const realUnitPrice = unitPriceFor(channel, product.sellingPrice);
      const standardRevenue = product.sellingPrice * quantity;
      const realRevenue = realUnitPrice * quantity;
      const modal = product.costPrice * quantity;
      sales.push({
        date,
        productId,
        productName: product.name,
        sku: product.sku,
        quantity,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        realUnitPrice,
        standardRevenue,
        realRevenue,
        revenue: realRevenue,
        modal,
        realProfit: realRevenue - modal,
        profit: realRevenue - modal,
        marketplaceDifference: realRevenue - standardRevenue,
        channel,
        resellerId: reseller ? reseller[0] : '',
        resellerName: reseller ? reseller[1] : '',
        expedition,
        district: channel === 'Offline Store' ? '' : district,
        city: channel === 'Offline Store' ? 'Sukabumi' : city,
        customer: '-',
        notes: '',
        createdAt: `${date}T04:00:00.000Z`,
      });
    }
  }
  return sales.map((sale, index) => ({ id: `sale-${String(index + 1).padStart(4, '0')}`, txNumber: `TXN-${String(1001 + index).padStart(5, '0')}`, ...sale }));
}

// [date, productId, target, completed, status, notes]
const PRODUCTION = [
  ['2026-08-04', 'prd-kestrel', 40, 40, 'completed', 'Batch Agustus'],
  ['2026-08-11', 'prd-marlin', 25, 25, 'completed', ''],
  ['2026-08-18', 'prd-fjord', 30, 30, 'completed', ''],
  ['2026-08-25', 'prd-halcyon', 20, 20, 'completed', ''],
  ['2026-09-01', 'prd-kestrel', 40, 40, 'completed', 'Batch September'],
  ['2026-09-08', 'prd-taiga', 15, 15, 'completed', ''],
  ['2026-09-15', 'prd-tern', 60, 60, 'completed', ''],
  ['2026-09-22', 'prd-corvid', 10, 10, 'completed', ''],
  ['2026-09-29', 'prd-sorrel', 20, 20, 'completed', ''],
  ['2026-10-02', 'prd-kestrel', 40, 40, 'completed', 'Batch Oktober'],
  ['2026-10-06', 'prd-marlin', 24, 24, 'completed', ''],
  ['2026-10-09', 'prd-wren', 50, 50, 'completed', ''],
  ['2026-10-13', 'prd-halcyon', 20, 18, 'qc', 'Cek ulang jahitan magnet'],
  ['2026-10-15', 'prd-fjord', 30, 21, 'in_progress', ''],
  ['2026-10-17', 'prd-taiga', 18, 6, 'in_progress', 'Bahan cordura datang 16 Okt'],
  ['2026-10-19', 'prd-kestrel', 20, 20, 'completed', 'Sisa batch Oktober'],
  ['2026-10-19', 'prd-corvid', 12, 4, 'in_progress', 'Rangka besi dari bengkel'],
  ['2026-10-19', 'prd-sorrel', 24, 10, 'in_progress', ''],
  ['2026-10-19', 'prd-quarry', 30, 0, 'pending', 'Restock tool roll'],
];

// [date, itemName, category, quantity, unit, unitPrice]
const PURCHASES = [
  ['2026-08-03', 'Cordura 600D hitam', 'Bahan', 40, 'meter', 38_000],
  ['2026-08-10', 'Webbing 25 mm', 'Aksesori', 100, 'meter', 3_500],
  ['2026-08-17', 'Buckle side release', 'Aksesori', 150, 'pcs', 2_500],
  ['2026-08-24', 'Busa EVA 5 mm', 'Bahan', 20, 'lembar', 27_000],
  ['2026-09-01', 'Cordura 600D hitam', 'Bahan', 45, 'meter', 38_000],
  ['2026-09-07', 'Resleting YKK no. 8', 'Aksesori', 80, 'pcs', 6_000],
  ['2026-09-14', 'Terpal PVC 500D', 'Bahan', 30, 'meter', 42_000],
  ['2026-09-21', 'Benang nilon', 'Bahan', 24, 'roll', 18_000],
  ['2026-09-28', 'Magnet neodymium', 'Aksesori', 60, 'pcs', 7_500],
  ['2026-10-01', 'Cordura 600D hitam', 'Bahan', 50, 'meter', 38_000],
  ['2026-10-05', 'Webbing 25 mm', 'Aksesori', 120, 'meter', 3_500],
  ['2026-10-08', 'Terpal PVC 500D', 'Bahan', 25, 'meter', 42_000],
  ['2026-10-12', 'Resleting YKK no. 8', 'Aksesori', 60, 'pcs', 6_000],
  ['2026-10-14', 'Strip reflektif', 'Aksesori', 40, 'meter', 9_000],
  ['2026-10-16', 'Cordura 1000D abu', 'Bahan', 20, 'meter', 52_000],
];

// [employeeName, employeeRole, period, paymentDate, base, bonus, deduction, status]
const PAYROLLS = [
  ['Sampel Staf Gudang', 'employee', '2026-08', '2026-08-30', 2_400_000, 0, 0, 'paid'],
  ['Sampel Staf Packing', 'employee', '2026-08', '2026-08-30', 2_100_000, 0, 0, 'paid'],
  ['Sampel Staf Gudang', 'employee', '2026-09', '2026-09-30', 2_400_000, 150_000, 0, 'paid'],
  ['Sampel Staf Packing', 'employee', '2026-09', '2026-09-30', 2_100_000, 0, 50_000, 'paid'],
  ['Sampel Staf Gudang', 'employee', '2026-10', '2026-10-30', 2_400_000, 0, 0, 'unpaid'],
  ['Sampel Staf Packing', 'employee', '2026-10', '2026-10-30', 2_100_000, 0, 0, 'unpaid'],
];

// Piece-rate sewing pay (gaji borongan): [periodDate, workerName, [productId, qty, upah per piece]].
const SALARIES = [
  ['2026-08-29', 'Sampel Penjahit A', [['prd-kestrel', 40, 12_000], ['prd-fjord', 30, 10_000]]],
  ['2026-08-29', 'Sampel Penjahit B', [['prd-marlin', 25, 15_000], ['prd-halcyon', 20, 11_000]]],
  ['2026-09-26', 'Sampel Penjahit A', [['prd-kestrel', 40, 12_000], ['prd-corvid', 10, 25_000]]],
  ['2026-09-26', 'Sampel Penjahit B', [['prd-taiga', 15, 18_000], ['prd-tern', 60, 4_000], ['prd-sorrel', 20, 10_000]]],
  ['2026-10-17', 'Sampel Penjahit A', [['prd-kestrel', 40, 12_000], ['prd-wren', 50, 3_000]]],
  ['2026-10-17', 'Sampel Penjahit B', [['prd-marlin', 24, 15_000]]],
];

export function buildFixtures() {
  const categories = CATEGORIES.map(([id, name, slug, description]) => ({ id, name, slug, description, productCount: 0, createdAt: STAMP, updatedAt: STAMP }));
  const products = PRODUCTS.map(([id, name, categoryId, sku, costPrice, sellingPrice, stock, status]) => ({
    id,
    name,
    sku,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    categoryId,
    description: `${name}, produk sampel untuk listing`,
    costPrice,
    sellingPrice,
    profit: sellingPrice - costPrice,
    margin: Math.round(((sellingPrice - costPrice) / sellingPrice) * 100),
    stock,
    status,
    featured: false,
    // Served by the capture's own route stub on the dev server origin, so no image host is ever asked.
    images: [{ publicId: `listing/${sku}`, imageUrl: `/__listing/product/${sku}.svg` }],
    createdAt: STAMP,
    updatedAt: STAMP,
  }));
  const productById = Object.fromEntries(products.map((product) => [product.id, product]));
  const sales = buildSales(products);
  const production = PRODUCTION.map(([date, productId, targetQty, completedQty, status, notes], index) => ({
    id: `po-${String(index + 1).padStart(3, '0')}`,
    productId,
    productName: productById[productId].name,
    sku: productById[productId].sku,
    targetQty,
    completedQty,
    date,
    status,
    notes,
  }));
  const weekKey = (date) => `${date.slice(0, 7)}-W${Math.min(5, Math.ceil(Number(date.slice(8, 10)) / 7))}`;
  const purchases = PURCHASES.map(([date, itemName, category, quantity, unit, unitPrice], index) => ({
    id: `pp-${String(index + 1).padStart(3, '0')}`,
    date,
    weekKey: weekKey(date),
    itemName,
    category,
    quantity,
    unit,
    unitPrice,
    totalCost: quantity * unitPrice,
    note: '',
    status: date.slice(0, 7) === TODAY.slice(0, 7) ? 'open' : 'closed',
    closedAt: null,
    createdAt: `${date}T03:00:00.000Z`,
    updatedAt: `${date}T03:00:00.000Z`,
  }));
  const payrolls = PAYROLLS.map(([employeeName, employeeRole, period, paymentDate, baseSalary, bonus, deduction, status], index) => ({
    id: `pay-${String(index + 1).padStart(3, '0')}`,
    employeeName,
    employeeRole,
    period,
    paymentDate,
    baseSalary,
    bonus,
    deduction,
    totalPaid: baseSalary + bonus - deduction,
    status,
    note: '',
    createdAt: `${paymentDate}T03:00:00.000Z`,
    updatedAt: `${paymentDate}T03:00:00.000Z`,
  }));
  const salaries = SALARIES.map(([periodDate, workerName, rows], index) => {
    const items = rows.map(([productId, qty, upah]) => ({ type: 'product', productId, productName: productById[productId].name, qty, upah, subtotal: qty * upah }));
    return {
      id: `sal-${String(index + 1).padStart(3, '0')}`,
      workerName,
      workers: [workerName],
      periodDate,
      items,
      grandTotal: items.reduce((sum, item) => sum + item.subtotal, 0),
      createdAt: `${periodDate}T03:00:00.000Z`,
      updatedAt: `${periodDate}T03:00:00.000Z`,
    };
  });
  // A finished batch enters stock on its date; units of a batch still on the floor do not. The last sales leave stock.
  const movements = production
    .filter((order) => order.status === 'completed')
    .map((order, index) => ({
      id: `sm-in-${String(index + 1).padStart(3, '0')}`,
      date: order.date,
      productId: order.productId,
      productName: order.productName,
      sku: order.sku,
      type: 'in',
      qty: order.completedQty,
      note: 'Hasil produksi',
      createdAt: `${order.date}T09:00:00.000Z`,
    }))
    .concat(
      sales
        .filter((sale) => sale.date >= '2026-10-16')
        .map((sale) => ({
          id: `sm-out-${sale.id}`,
          date: sale.date,
          productId: sale.productId,
          productName: sale.productName,
          sku: sale.sku,
          type: 'out',
          qty: sale.quantity,
          note: sale.expedition ? `Penjualan ${sale.channel} - ${sale.expedition}` : `Penjualan ${sale.channel}`,
          createdAt: sale.createdAt,
        })),
    );
  const resellers = RESELLERS.map(([id, name]) => ({ id, name, status: 'active', createdAt: STAMP, updatedAt: STAMP }));
  const users = [{ id: OWNER.localId, name: OWNER.displayName, email: OWNER.email, role: 'Owner', status: 'Aktif' }];

  return {
    users: [OWNER],
    collections: {
      users,
      categories,
      products,
      resellers,
      sales,
      production,
      production_purchases: purchases,
      payrolls,
      production_salaries: salaries,
      stock_movements: movements,
    },
  };
}

// The figures the dashboard (this month) and the profit report (this year) show, computed the way renderDashboard and
// renderReports do; the capture waits for them.
function figuresFor(prefix, fixtures) {
  const { sales, production_purchases: purchases, payrolls, production_salaries: salaries } = fixtures.collections;
  const inPeriod = (date) => (date ?? '').startsWith(prefix);
  const periodSales = sales.filter((sale) => inPeriod(sale.date));
  const revenue = periodSales.reduce((sum, sale) => sum + sale.revenue, 0);
  const profit = periodSales.reduce((sum, sale) => sum + sale.profit, 0);
  const purchaseTotal = purchases.filter((item) => inPeriod(item.date)).reduce((sum, item) => sum + item.totalCost, 0);
  const payrollTotal =
    payrolls.filter((item) => inPeriod(item.period || item.paymentDate)).reduce((sum, item) => sum + item.totalPaid, 0) +
    salaries.filter((item) => inPeriod(item.periodDate)).reduce((sum, item) => sum + item.grandTotal, 0);
  return { transactions: periodSales.length, revenue, profit, purchaseTotal, payrollTotal, netProfit: profit - purchaseTotal - payrollTotal };
}

export const monthFigures = (fixtures = buildFixtures()) => figuresFor(TODAY.slice(0, 7), fixtures);
export const yearFigures = (fixtures = buildFixtures()) => figuresFor(TODAY.slice(0, 4), fixtures);

// Wrong numbers fail here, before the emulator starts or any shot is taken.
export function checkFixtures(fixtures = buildFixtures()) {
  const { collections } = fixtures;
  const { products, sales, production } = collections;
  const problems = [];
  if (Object.values(collections).flat().length >= 500) problems.push('more than 500 documents would not fit one Firestore commit');
  for (const product of products) {
    const expected = product.stock === 0 ? 'out_of_stock' : product.stock <= 5 ? 'low_stock' : null;
    if (expected && product.status !== expected) problems.push(`${product.sku}: stock ${product.stock} needs status ${expected}`);
    if (!expected && !['active', 'in_production'].includes(product.status)) problems.push(`${product.sku}: status ${product.status} with stock ${product.stock}`);
    if (product.sellingPrice <= product.costPrice) problems.push(`${product.sku}: sells at or under cost`);
  }
  for (const sale of sales) {
    if (sale.revenue !== sale.realUnitPrice * sale.quantity) problems.push(`${sale.txNumber}: revenue is not unit price x quantity`);
    if (sale.profit !== sale.revenue - sale.costPrice * sale.quantity) problems.push(`${sale.txNumber}: profit is not revenue - HPP`);
    if (sale.profit <= 0) problems.push(`${sale.txNumber}: sold at a loss`);
    if (sale.date > TODAY) problems.push(`${sale.txNumber}: dated after ${TODAY}`);
    if ((sale.channel === 'Reseller') !== Boolean(sale.resellerId)) problems.push(`${sale.txNumber}: reseller set on a non-reseller sale or missing`);
  }
  for (const order of production) {
    if (order.completedQty > order.targetQty) problems.push(`${order.id}: more done than planned`);
    if ((order.status === 'completed') !== (order.completedQty === order.targetQty)) problems.push(`${order.id}: status ${order.status} with ${order.completedQty}/${order.targetQty}`);
  }
  // Stock Control derives the opening stock as current - today's in + today's out, so it must never go negative.
  for (const product of products) {
    const today = collections.stock_movements.filter((move) => move.date === TODAY && move.productId === product.id);
    const opening = today.reduce((stock, move) => stock + (move.type === 'in' ? -move.qty : move.qty), product.stock);
    if (opening < 0) problems.push(`${product.sku}: opening stock for ${TODAY} would be ${opening}`);
  }
  const figures = monthFigures(fixtures);
  if (figures.netProfit <= 0) problems.push(`net profit for ${TODAY.slice(0, 7)} is not positive (${figures.netProfit})`);
  if (yearFigures(fixtures).netProfit <= 0) problems.push(`net profit for ${TODAY.slice(0, 4)} is not positive`);
  if (!sales.some((sale) => sale.date === TODAY) || !production.some((order) => order.date === TODAY)) problems.push(`no sale or production order on ${TODAY}`);
  if (problems.length) throw new Error(`InztaMoto fixtures are inconsistent:\n  ${problems.join('\n  ')}`);
  return figures;
}
