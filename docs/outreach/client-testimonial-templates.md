---
id: OUTREACH-TESTIMONIALS
title: Client permission and testimonial request templates
status: active
owner: "M Sechan Alfarisi"
last_updated: "2026-10-16"
---

# Template chat: izin dan testimoni klien

Template WhatsApp untuk meminta izin menampilkan proyek dan meminta testimoni. Ganti teks di dalam `[...]`. Kirim dari nomor pribadi, satu klien satu chat, jangan broadcast.

Aturan yang dipegang (BR-003, A-003):

- Testimoni harus kata-kata klien sendiri. Kamu boleh merapikan ejaan atau menggabungkan jawaban mereka, tapi teks final wajib mereka setujui dulu.
- Catat tanggal persetujuan. Tanggal itu diisi di `consentDate` pada `src/content/testimonials.ts`.
- Izin menampilkan nama terpisah dari izin testimoni. Kalau klien tidak mau namanya tampil, jangan simpan namanya di repo sama sekali; cukup label anonim (BR-006).
- Terjemahan Inggris dan potongan kutipan (`excerpt`) juga harus mereka setujui, sama seperti teks aslinya (BR-007).
- Untuk klinik, jangan minta atau menampilkan data pasien, angka keuangan, atau nama staf tanpa izin terpisah.

## 1. Klinik: izin menampilkan nama dan minta testimoni

> Assalamu'alaikum [dr./Bapak/Ibu] [Nama], semoga sehat selalu. Saya Sechan, yang mengerjakan Sistem Informasi Klinik [Nama Klinik].
>
> Saya sedang menyusun portfolio online untuk melamar magang di perusahaan teknologi. Saya ingin menampilkan proyek sistem klinik ini sebagai salah satu karya utama. Sebelum itu saya mau izin dulu untuk dua hal:
>
> 1. Bolehkah nama [Nama Klinik] ditampilkan di portfolio? Kalau belum berkenan, saya tulis sebagai "klinik pratama di Sukabumi" saja.
> 2. Bolehkah saya menampilkan tangkapan layar sistem? Semua data pasien, nama staf, dan angka keuangan akan saya ganti dengan data contoh, jadi tidak ada data asli yang terlihat.
>
> Selain itu, kalau [dr./Bapak/Ibu] berkenan, saya ingin minta testimoni singkat (2 sampai 4 kalimat) tentang pengalaman memakai sistemnya. Supaya mudah, boleh jawab beberapa pertanyaan ini saja:
>
> - Sebelum ada sistem ini, bagian mana yang paling merepotkan?
> - Apa yang paling terasa berubah setelah sistem dipakai?
> - Bagaimana pengalaman bekerja sama dengan saya selama pengerjaan?
>
> Nanti jawabannya saya rapikan jadi satu paragraf, lalu saya kirim lagi untuk [dr./Bapak/Ibu] cek dan setujui sebelum dipasang. Tidak ada yang tayang tanpa persetujuan [dr./Bapak/Ibu].
>
> Terima kasih banyak atas waktunya.

## 2. InztaMoto, VisualKain, dan klien freelance lain: minta testimoni

> Halo [Bapak/Ibu/Kak] [Nama], semoga lancar terus usahanya. Saya Sechan, yang mengerjakan [nama sistem, misalnya ERP InztaMoto / sistem keuangan VisualKain].
>
> Saya sedang menyiapkan portfolio online dan proyek [nama proyek] akan saya tampilkan di sana. Kalau berkenan, saya ingin minta testimoni singkat, 2 sampai 4 kalimat, dari sudut pandang [Bapak/Ibu/Kak] sebagai pengguna.
>
> Boleh menjawab pertanyaan ini saja kalau lebih mudah:
>
> - Masalah apa yang paling terbantu setelah sistem ini dipakai?
> - Bagian sistem mana yang paling sering dipakai sehari-hari?
> - Bagaimana pengalaman kerja sama dengan saya (komunikasi, ketepatan waktu, revisi)?
>
> Jawabannya nanti saya rapikan dan saya kirim balik untuk disetujui dulu sebelum tayang. Saya juga perlu izin untuk menulis nama dan jabatan [Bapak/Ibu/Kak], misalnya "[Nama], Owner [Nama Usaha]". Kalau lebih nyaman tanpa nama lengkap, cukup bilang saja.
>
> Terima kasih banyak.

## 3. Pembimbing atau atasan magang (PT Mangcoding)

> Selamat [pagi/siang] [Bapak/Ibu] [Nama]. Saya Sechan, intern Mobile Engineer di Mangcoding.
>
> Saya sedang menyusun portfolio untuk melamar program magang lanjutan. Saya izin menampilkan BookMate dan MangKasir Ritel sebagai proyek yang saya kerjakan selama magang, sesuai bagian yang memang saya kerjakan.
>
> Jika [Bapak/Ibu] berkenan, saya juga ingin meminta testimoni singkat (2 sampai 3 kalimat) tentang kinerja saya selama magang, misalnya soal kualitas kerja, tanggung jawab, atau cara saya berkolaborasi dengan tim. Teks finalnya akan saya kirimkan dulu untuk [Bapak/Ibu] setujui sebelum dipublikasikan.
>
> Terima kasih atas bimbingannya selama ini, [Bapak/Ibu].

## 4. Pengingat (kirim 4 sampai 5 hari setelah pesan pertama, cukup sekali)

> Halo [Bapak/Ibu] [Nama], maaf mengganggu. Saya mau menindaklanjuti pesan saya soal testimoni untuk portfolio. Kalau sedang sibuk, tidak apa-apa, cukup satu atau dua kalimat saja juga sudah sangat membantu. Terima kasih 🙏

## 5. Konfirmasi teks final

> Terima kasih banyak, [Bapak/Ibu]. Berikut teks yang akan saya tampilkan:
>
> "[teks testimoni final]"
>
> Ditulis atas nama: [Nama], [Jabatan], [Nama Usaha atau Klinik]
>
> Apakah teks dan nama di atas sudah sesuai dan boleh saya tayangkan? Kalau ada yang ingin diubah, silakan langsung dikoreksi.

## 6. Terima kasih setelah tayang

> [Bapak/Ibu] [Nama], testimoninya sudah tayang di portfolio saya: [link]. Terima kasih banyak atas dukungannya. Kalau nanti ada kebutuhan pengembangan sistem lagi, saya siap membantu.

## Setelah disetujui

1. Tambahkan entri ke `testimonials` di `src/content/testimonials.ts` (F-006):
   - `quote`: teks final persis seperti yang disetujui, dalam bahasa aslinya; `language`: `"id"` atau `"en"`.
   - `translation`: versi Inggris yang juga disetujui, atau `null` kalau kutipannya sudah bahasa Inggris atau terjemahannya belum disetujui.
   - `attribution`: `{ showName: true, name, role, organization }` kalau nama boleh tampil (`organization` boleh `null`), atau `{ showName: false, label: "Owner of a primary care clinic in Sukabumi" }` kalau tidak.
   - `projectSlug`: slug proyek di `portfolio.ts`, atau `null` untuk pekerjaan yang tidak ada di daftar proyek (misalnya situs undangan pernikahan).
   - `excerpt`: potongan pendek yang persis ada di teks yang tampil (terjemahan kalau ada) untuk ditampilkan di kartu proyek, atau `null`.
   - `consentDate`: tanggal persetujuan `YYYY-MM-DD`. Selama masih `null`, entri tidak tampil di situs.
2. Untuk klinik, jika nama boleh tampil: ubah `client` proyek `clinic-information-system`, hapus test "clinic stays unnamed" di `portfolio.test.ts` dan pemeriksaan `cikidang` di `testimonials.test.ts`, lalu ubah A-001 menjadi `confirmed`.
3. Jalankan `npm test` dan `npm run build`.
