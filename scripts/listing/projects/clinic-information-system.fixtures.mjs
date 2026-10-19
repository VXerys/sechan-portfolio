// Invented records for the Klinik Cikidang Medika listing (BR-013). Every patient, doctor, visit, and amount here is
// made up: names are invented two-part names, places stop at district level, and no NIK, BPJS number, phone, or real
// email exists anywhere. Rows are generated from a fixed seed relative to the capture date, so the app's "today",
// "this month", and trend views all have data while two runs on the same day draw the same screens.

export const OWNER_AUTH_ID = '00000000-0000-4000-8000-00000000c1a0';
export const OWNER = { email: 'owner.sampel@example.test', name: 'Sampel Pemilik Klinik' };

const GIVEN_MALE = ['Arvend', 'Damor', 'Ilvan', 'Marvo', 'Sorin', 'Cendrik', 'Tarvo', 'Yasko', 'Belvan', 'Orvin', 'Kelvan', 'Rasvi', 'Dirvan', 'Halvo'];
const GIVEN_FEMALE = ['Arvela', 'Nirasa', 'Talvi', 'Wenara', 'Lisande', 'Ruvena', 'Fenaya', 'Kirvana', 'Selvia', 'Marisvi', 'Olvena', 'Danvira', 'Yelvia', 'Sarvina'];
const FAMILY = ['Lentara', 'Kelvaya', 'Arunda', 'Morasti', 'Selvadi', 'Wiskana', 'Tarvega', 'Nolendra', 'Pravesa', 'Undira', 'Halvesa', 'Sorvanda'];
// District (kecamatan) names only, never a street, village, or house.
const DISTRICTS = ['Cikidang', 'Cikidang', 'Cikidang', 'Cibadak', 'Parungkuda', 'Nagrak', 'Kalapanunggal', 'Cicurug', 'Luar Daerah'];

// minAge keeps the records clinically plausible: no child is treated for hypertension or diabetes.
const DIAGNOSES = [
  { code: 'J06.9', name: 'Infeksi saluran napas atas akut', weight: 9 },
  { code: 'I10', name: 'Hipertensi esensial', weight: 7, minAge: 35 },
  { code: 'K30', name: 'Dispepsia', weight: 6, minAge: 13 },
  { code: 'M79.1', name: 'Mialgia', weight: 5, minAge: 18 },
  { code: 'E11.9', name: 'Diabetes melitus tipe 2', weight: 4, minAge: 35 },
  { code: 'A09', name: 'Diare dan gastroenteritis', weight: 4 },
  { code: 'L30.9', name: 'Dermatitis', weight: 3 },
  { code: 'R50.9', name: 'Demam', weight: 3 },
  { code: 'K04.7', name: 'Abses periapikal', weight: 2 },
  { code: 'H10.9', name: 'Konjungtivitis', weight: 2 },
];

const CARE = {
  'J06.9': { keluhan: 'Batuk pilek dan nyeri tenggorokan sejak tiga hari', terapi: 'Paracetamol 500 mg 3x1\nAmbroxol 30 mg 3x1\nVitamin C 1x1' },
  I10: { keluhan: 'Pusing dan tengkuk terasa berat', terapi: 'Amlodipine 5 mg 1x1' },
  K30: { keluhan: 'Nyeri ulu hati dan mual setelah makan', terapi: 'Antasida 3x1\nOmeprazole 20 mg 1x1' },
  'M79.1': { keluhan: 'Pegal dan nyeri otot setelah bekerja', terapi: 'Ibuprofen 400 mg 3x1' },
  'E11.9': { keluhan: 'Kontrol gula darah rutin', terapi: 'Metformin 500 mg 2x1' },
  A09: { keluhan: 'BAB cair sejak semalam', terapi: 'Oralit\nZinc 20 mg 1x1' },
  'L30.9': { keluhan: 'Gatal kemerahan di lengan', terapi: 'Salep hidrokortison 2x sehari\nCetirizine 10 mg 1x1' },
  'R50.9': { keluhan: 'Demam naik turun sejak dua hari', terapi: 'Paracetamol 500 mg 3x1' },
  'K04.7': { keluhan: 'Gigi geraham nyeri dan bengkak', terapi: 'Amoksisilin 500 mg 3x1\nAsam mefenamat 500 mg 3x1' },
  'H10.9': { keluhan: 'Mata merah dan berair', terapi: 'Tetes mata antibiotik 4x1' },
};

const DOCTORS = [
  { id: 'doc-sampel-1', nama: 'Sampel Arunika', spesialisasi: 'Dokter Umum', aktif: true, created_at: '2025-01-06T01:00:00.000Z' },
  { id: 'doc-sampel-2', nama: 'Sampel Wiratma', spesialisasi: 'Dokter Umum', aktif: true, created_at: '2025-01-06T01:00:00.000Z' },
];

const HISTORY_DAYS = 150;
const PATIENT_COUNT = 168;
// The queue patient the rekam medis shot opens on; it gets earlier visits so the history timeline is filled.
const FEATURED_PATIENT = 7;

function seeded(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The app reads "today" in Asia/Jakarta (pendaftaran) and in the browser's local zone elsewhere; the clinic and the
// capture machine are both in WIB, so one Jakarta calendar date serves every screen.
function jakartaToday(now) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(now);
}

function addDays(ymd, days) {
  const date = new Date(`${ymd}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const weekday = (ymd) => new Date(`${ymd}T00:00:00Z`).getUTCDay();
const stamp = (ymd, time) => `${ymd}T${time}:00+07:00`;

export function buildFixtures({ now = new Date() } = {}) {
  const random = seeded(20261018);
  const pick = (list) => list[Math.floor(random() * list.length)];
  const between = (min, max, step = 1) => min + Math.floor(random() * ((max - min) / step + 1)) * step;
  const pickWeighted = (all, age = 40) => {
    const list = all.filter((item) => (item.minAge ?? 0) <= age);
    const total = list.reduce((sum, item) => sum + item.weight, 0);
    let roll = random() * total;
    for (const item of list) {
      roll -= item.weight;
      if (roll <= 0) return item;
    }
    return list[list.length - 1];
  };

  const today = jakartaToday(now);
  const currentYear = Number(today.slice(0, 4));

  const usedNames = new Set();
  const patients = [];
  for (let index = 0; index < PATIENT_COUNT; index += 1) {
    const male = random() < 0.46;
    let nama;
    do {
      nama = `${pick(male ? GIVEN_MALE : GIVEN_FEMALE)} ${pick(FAMILY)}`;
    } while (usedNames.has(nama) && usedNames.size < GIVEN_MALE.length * FAMILY.length);
    usedNames.add(nama);
    const usia = index % 9 === 0 ? between(4, 12) : between(18, 74);
    const gelar = usia < 13 ? 'An.' : male ? 'Tn.' : usia < 25 ? 'Nn.' : 'Ny.';
    const desa = pick(DISTRICTS);
    patients.push({
      id: `pat-${String(index + 1).padStart(4, '0')}`,
      no_rm: `${male ? '01' : '02'}9${String(index % 9)}${String(70001 + index).padStart(5, '0')}`,
      sumber_data: 'DATAPASIEN',
      gelar,
      nama,
      jenis_kelamin: male ? 'Laki-laki' : 'Perempuan',
      tanggal_lahir: `${currentYear - usia}-${String(between(1, 12)).padStart(2, '0')}-${String(between(1, 28)).padStart(2, '0')}`,
      usia,
      desa,
      alamat: `Kec. ${desa}`,
      no_ktp: null,
      no_bpjs: null,
      no_telepon: null,
      riwayat_alergi: index === FEATURED_PATIENT ? 'Amoksisilin' : 'Tidak ada',
      pekerjaan: usia < 18 ? 'Pelajar' : pick(['Petani', 'Wiraswasta', 'Ibu rumah tangga', 'Karyawan swasta', 'Guru', 'Buruh harian']),
      created_at: stamp(addDays(today, -HISTORY_DAYS - 40 + Math.floor(index / 4)), '08:00'),
    });
  }

  const visits = [];
  const makeVisit = ({ date, queue, patient, status, diagnosis, time, jenis }) => {
    const bpjs = jenis ? jenis === 'BPJS' : random() < 0.55;
    const settled = status === 'Lunas' || status === 'Ditanggung BPJS';
    const examined = Boolean(diagnosis);
    const care = diagnosis ? CARE[diagnosis.code] : null;
    const pendapatanLain = examined ? between(0, 85_000, 5_000) : 0;
    return {
      id: `vis-${date}-${String(queue).padStart(3, '0')}`,
      nomor_antrian: `A-${String(queue).padStart(3, '0')}`,
      pasien_id: patient.id,
      dokter_id: DOCTORS[queue % 3 === 0 ? 1 : 0].id,
      tanggal_periksa: date,
      jam_periksa: time,
      bulan: date.slice(0, 7),
      kode_icd10: diagnosis?.code ?? null,
      diagnosa_deskripsi: diagnosis?.name ?? null,
      keluhan_anamnesa: care?.keluhan ?? null,
      terapi_obat: care?.terapi ?? null,
      tindakan: null,
      keterangan_tindakan: null,
      bidan_rujukan: null,
      lab: null,
      lab_hasil: null,
      jenis_pasien: bpjs ? 'BPJS' : 'UMUM',
      kategori_program: 'UMUM',
      biaya_periksa: bpjs ? 0 : 150_000,
      pendapatan_lain: pendapatanLain,
      keterangan_pendapatan: pendapatanLain ? 'Obat dan bahan habis pakai' : null,
      jenis_pembayaran: settled ? (random() < 0.78 ? 'Tunai' : 'TF') : null,
      status_pembayaran: settled && bpjs ? 'Ditanggung BPJS' : settled ? 'Lunas' : status,
      is_gratis: false,
      created_at: stamp(date, time),
    };
  };

  for (let offset = HISTORY_DAYS; offset >= 1; offset -= 1) {
    const date = addDays(today, -offset);
    const sunday = weekday(date) === 0;
    const count = sunday ? between(0, 2) : between(4, 9);
    for (let queue = 1; queue <= count; queue += 1) {
      const featured = queue === 1 && [12, 47, 96].includes(offset);
      const patient = featured ? patients[FEATURED_PATIENT] : patients[between(0, PATIENT_COUNT - 1)];
      const diagnosis = featured ? DIAGNOSES[offset === 47 ? 2 : 0] : pickWeighted(DIAGNOSES, patient.usia);
      const time = `${String(8 + Math.floor(queue / 2)).padStart(2, '0')}:${queue % 2 ? '10' : '40'}`;
      visits.push(makeVisit({ date, queue, patient, status: 'Lunas', diagnosis, time }));
    }
  }

  // Today's queue: settled visits first, two waiting for the cashier, then the doctor's waiting list.
  const todayPlan = ['Lunas', 'Lunas', 'Lunas', 'Lunas', 'Lunas', 'Lunas', 'Menunggu Kasir', 'Menunggu Kasir', 'Menunggu Dokter', 'Menunggu Dokter', 'Menunggu Dokter', 'Menunggu Dokter'];
  const todayPatients = [12, 31, 44, 58, 73, 90, 101, 117, FEATURED_PATIENT, 129, 140, 152];
  todayPlan.forEach((status, index) => {
    const queue = index + 1;
    const patient = patients[todayPatients[index]];
    const diagnosis = status === 'Menunggu Dokter' ? null : pickWeighted(DIAGNOSES, patient.usia);
    const time = `${String(7 + Math.floor(queue / 2)).padStart(2, '0')}:${queue % 2 ? '35' : '55'}`;
    // The cashier queue holds general patients, so the terminal shows a real bill rather than a BPJS zero.
    const jenis = status === 'Menunggu Kasir' ? 'UMUM' : undefined;
    const visit = makeVisit({ date: today, queue, patient, status, diagnosis, time, jenis });
    if (status === 'Menunggu Dokter') visit.keluhan_anamnesa = index === 8 ? 'Batuk berdahak sejak dua hari' : null;
    visits.push(visit);
  });

  const cashFlows = [];
  let flowSeq = 0;
  const flow = (tanggal, jenis, kategori, nominal, keterangan, jenisPembayaran = 'Tunai') => {
    flowSeq += 1;
    cashFlows.push({
      id: `cf-${String(flowSeq).padStart(4, '0')}`,
      tanggal,
      jenis,
      kategori,
      nominal,
      keterangan,
      jenis_pembayaran: jenisPembayaran,
      created_at: stamp(tanggal, `${String(9 + (flowSeq % 8)).padStart(2, '0')}:15`),
    });
  };
  for (let offset = HISTORY_DAYS; offset >= 0; offset -= 1) {
    const date = addDays(today, -offset);
    const day = Number(date.slice(8, 10));
    const dow = weekday(date);
    if (day === 10) flow(date, 'Masuk', 'Kapitasi BPJS', between(7_800_000, 8_600_000, 50_000), 'Dana kapitasi BPJS bulanan', 'TF');
    if (day === 5) flow(date, 'Keluar', 'Operasional & Listrik/Air', between(780_000, 960_000, 10_000), 'Tagihan listrik dan air bulanan', 'TF');
    // Medicine and one honor run go by transfer and the drawer is emptied every other week, so the drawer balance
    // stays positive the way a working clinic's does.
    if (day === 1) flow(date, 'Keluar', 'Honor & Transport', between(1_400_000, 1_800_000, 50_000), 'Honor perawat jaga dan transport');
    if (day === 16) flow(date, 'Keluar', 'Honor & Transport', between(1_400_000, 1_800_000, 50_000), 'Honor perawat jaga dan transport', 'TF');
    if (dow === 2) flow(date, 'Keluar', 'Pengeluaran Obat', between(1_150_000, 2_400_000, 25_000), 'Belanja obat ke distributor', 'TF');
    if (dow === 6 && day % 14 >= 7) flow(date, 'Keluar', 'Setor ke Rekening Pemilik', between(1_800_000, 2_600_000, 100_000), 'Setoran kas ke rekening pemilik');
    if (dow === 4 && day % 2 === 0) flow(date, 'Masuk', 'Rujukan USG / Lab', between(150_000, 450_000, 25_000), 'Komisi rujukan pemeriksaan lab');
    if (dow === 3) flow(date, 'Keluar', 'Operasional', between(85_000, 240_000, 5_000), 'Alat tulis dan kebersihan');
  }
  flow(today, 'Keluar', 'Operasional', 65_000, 'Galon air minum ruang tunggu');
  flow(today, 'Masuk', 'Pendapatan Lain', 120_000, 'Surat keterangan sehat (2 lembar)');

  const tbcPrograms = [
    { id: 'tbc-1', pasien_id: patients[21].id, tanggal_mulai: addDays(today, -95), tipe_pasien: 'Kasus Baru', kategori_oat: 'Kategori 1', fase_pengobatan: 'Lanjutan', bulan_ke: 4, status_tbc: 'Dalam Pengobatan', created_at: stamp(addDays(today, -95), '09:00') },
    { id: 'tbc-2', pasien_id: patients[66].id, tanggal_mulai: addDays(today, -140), tipe_pasien: 'Kasus Baru', kategori_oat: 'Kategori 1', fase_pengobatan: 'Lanjutan', bulan_ke: 3, status_tbc: 'Mangkir', created_at: stamp(addDays(today, -140), '09:00') },
  ];
  const postCares = [
    { id: 'pc-1', pasien_id: patients[34].id, tanggal_kontrol_berikutnya: today, status_kontrol: 'Menunggu', created_at: stamp(addDays(today, -6), '10:00') },
    { id: 'pc-2', pasien_id: patients[80].id, tanggal_kontrol_berikutnya: addDays(today, -2), status_kontrol: 'Menunggu', created_at: stamp(addDays(today, -9), '10:00') },
    { id: 'pc-3', pasien_id: patients[95].id, tanggal_kontrol_berikutnya: addDays(today, 3), status_kontrol: 'Menunggu', created_at: stamp(addDays(today, -4), '10:00') },
  ];
  const circumcisions = [
    { id: 'sun-1', pasien_id: patients[9].id, dokter_id: DOCTORS[0].id, tanggal_tindakan: addDays(today, -3), metode: 'Klamp', biaya: 850_000, storage_provider: 'supabase', created_at: stamp(addDays(today, -3), '09:00') },
  ];

  return {
    today,
    tables: {
      doctors: DOCTORS,
      patients,
      visits,
      cash_flows: cashFlows,
      tbc_programs: tbcPrograms,
      post_cares: postCares,
      circumcisions,
    },
    relations: {
      visits: { patients: { local: 'pasien_id' }, doctors: { local: 'dokter_id' } },
    },
  };
}
