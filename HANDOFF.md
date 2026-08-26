# HANDOFF — Baca Ini Dulu

Dokumen ini buat siapa pun (agent atau sesi baru) yang lanjutin project ini tanpa konteks percakapan sebelumnya. "Do not assume anything" — semua asumsi penting ditulis di sini.

## Konteks Personal

- Owner project akan kerja sebagai mechanical/piping insulator di **日建工業 Nikken Kogyo**, bagian **Midori Group**, Iwakuni, Yamaguchi Prefecture, Jepang.
- ZERO pengalaman/pengetahuan di trade ini sebelumnya.
- Nggak mampu bayar kursus formal — project ini dibangun via AI-assisted self-study sebagai gantinya.
- Owner juga menjalankan project terpisah "Nugget Nihongo" (edukasi bahasa Jepang buat kandidat SSW konstruksi Indonesia). Skill-set beririsan (bahasa Jepang, konten edukasi terstruktur), tapi project INI beda fokus: trade insulation, bukan bahasa.
- Gaya komunikasi owner: terse, bilingual ID/EN (+ istilah Jepang di project ini), act-don't-explain, gas sekarang.

## Kurikulum Awal — Starting Point, Bukan Tujuan Akhir

Owner nemu kurikulum "Insulation Inspection (Technical & Industrial Standard)" (12 poin, lihat `modules/`) lewat googling sendiri — bukan dari instansi/kursus tertentu. Gaya kurikulum ini condong ke **QA/QC Inspector** ala industri Oil & Gas / petrochemical internasional: standar ASTM/API/ASME/SSPC, dokumentasi ITP/MIR/RFI/NCR/CAR, fokus besar ke Corrosion Under Insulation.

**INSIGHT UTAMA yang mengubah arah project:** kerjaan owner nanti itu **installer/tukang** (hands-on), BUKAN inspector. Beda emphasis:
- Inspector → audit, dokumentasi, standar compliance
- Installer → motong & bentuk material, bikin pola jacketing, pasang di lapangan, baca gambar kerja

Makanya project dipecah jadi 3 track. Kurikulum awal tetap dipakai (Track 1) sebagai fundamental teori — masih berguna, cuma bukan satu-satunya lapisan.

## 3 Track

### Track 1 — `modules/` — Fundamental Teknis
12 modul dari kurikulum awal. Modul 1 selesai, 2–12 baru outline (sub-topik dari kurikulum asli + catatan relevansi installer vs inspector di tiap file).

### Track 2 — `trade-practicum/` — Trade Jepang + Sertifikasi
Fokus ke kerjaan nyata:
- Nama resmi trade: **保温工事** (hoon kouji) / **熱絶縁施工** (netsu zetsuen sekou) — sumber: situs job tag Kemenaker Jepang (MHLW)
- Sertifikasi nasional: **熱絶縁施工技能士** (1級/2級), technical skill test (技能検定)
- Dua sub-kategori kerja: 保温保冷工事作業 (umum) vs 吹付け硬質ウレタンフォーム断熱工事作業 (spray foam) — **belum dikonfirmasi Nikken Kogyo pakai yang mana**
- Nikken Kogyo terkonfirmasi condong ke **building/facility insulation** (AC sekolah, boiler room, pipa gedung publik) — BUKAN plant/refinery industrial insulation
- Data pasar kerja sangat positif: rasio lowongan 7.7 (kekurangan tenaga kerja parah), nggak butuh pendidikan formal, pass rate ujian 49–65%

### Track 3 — `cheat-sheet/` — Field Reference & Calculator
Spec kalkulator pola potong (straight pipe, elbow gore, tee saddle, reducer cone). Saat ini BARU spec matematis dalam .md — belum ada implementasi kode.

## Constraint yang Harus Dijaga

- **Copyright:** ASTM/ISO/API/ASME/SSPC = dokumen berbayar, BUKAN open source. Boleh jelasin cakupan/tujuan standar dari info publik, JANGAN PERNAH kutip/reproduksi isi pasalnya.
- Semua konten harus original/parafrase — termasuk dari sumber "legal open" kayak 日本保温保冷工業協会 atau job tag MHLW.
- Ilustrasi: pakai diagram/SVG original (kalkulator geometri/trigonometri legal dibikin sendiri dari nol), bukan hasil scraping gambar dari web.

## Belum Dikerjakan / Next Steps

1. Modul 2–12 (Track 1) — baru outline, belum ditulis lengkap
2. Implementasi teknis kalkulator (Track 3) — butuh HTML/JS, di luar scope sesi ini yang cuma ".md"
3. Riset lanjutan: kategori 吹付け硬質ウレタンフォーム断熱工事作業, kalau ternyata itu yang dipakai Nikken Kogyo
4. Belum ada keputusan platform format akhir (static site? PWA? plain repo doang?) — masih terbuka
5. Glossary kosakata Jepang teknis trade ini — belum disusun, padahal overlap sama expertise "Nugget Nihongo" milik owner
