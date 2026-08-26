# Spec: Cutting Pattern Calculator
Status: ✅ Spec matematis selesai — ⬜ implementasi kode belum dimulai

Tujuan: kalkulator yang generate dimensi & pola potong material insulasi/cladding, siap dipakai di lapangan (idealnya render sebagai diagram SVG siap-print/jiplak).

## 1. Pipa Lurus (Straight Pipe)
**Input:** diameter luar pipa (OD), tebal insulasi (t), tebal cladding (opsional), overlap allowance (default 30–50mm)
**Formula:**
- Diameter luar insulasi = OD + 2t
- Lebar lembaran material = π × (OD + 2t) + overlap
**Output:** lebar lembaran (mm), panjang sesuai section pipa

## 2. Elbow (Belokan)
**Input:** OD pipa, tebal insulasi, sudut elbow (umumnya 90° atau 45°), radius belokan, jumlah potongan gore (2/3/5/7 — makin besar diameter & sudut, makin banyak potongan disarankan)
**Konsep:** pola gore/juring seperti kulit jeruk — tiap potongan berbentuk trapesium melengkung, disambung berurutan mengikuti kurva elbow
**Formula dasar:** sudut per gore = sudut elbow ÷ jumlah gore; tiap gore dihitung pakai geometri kerucut terpotong pada sisi dalam & luar elbow
**Output:** pola tiap gore (lebar atas, lebar bawah, tinggi, sudut potong) — idealnya divisualisasikan sebagai template SVG per potongan
**Referensi teknik:** dikenal sebagai "gore pattern development" / orange-peel pattern. Relevan langsung ke materi ujian praktik 熱絶縁施工技能士 (pola elbow 7-potongan) — lihat `../trade-practicum/certification-roadmap.md`

## 3. Tee / Percabangan
**Input:** OD pipa utama, OD pipa cabang, tebal insulasi, sudut percabangan (umumnya 90°)
**Konsep:** pola sadel (saddle pattern) di titik interseksi dua silinder — dikenal di Jepang sebagai bagian dari "ラッキングチーズ展開図" (lagging tee development drawing)
**Formula dasar:** pengembangan interpenetrasi dua silinder (perlu kurva sinusoidal buat garis potong sadel)
**Output:** pola cladding/insulasi di titik sambungan T

## 4. Reducer (Transisi Diameter)
**Input:** OD pipa besar, OD pipa kecil, panjang reducer
**Konsep:** radial line development dari frustum/kerucut terpotong
**Formula dasar:** sector kerucut dengan radius miring dihitung dari kedua diameter & panjang
**Output:** pola sector kerucut siap potong

## Prinsip Desain Tool
- Semua kalkulasi murni geometri/trigonometri — orisinal, legal, nggak nyontek sumber manapun
- Output idealnya render sebagai SVG dengan dimensi berlabel, bisa langsung diprint 1:1 (atau dengan skala tertera) buat jadi template fisik
- Satuan: mm (default, standar konstruksi Jepang), dengan opsi konversi
- Perlu validasi lapangan sebelum benar-benar diandalkan buat kerja — tambahkan disclaimer ini di UI-nya nanti

## Belum Diimplementasikan
1. Implementasi formula lengkap (terutama elbow gore & tee saddle, lebih kompleks dari pipa lurus/reducer)
2. UI kalkulator (kemungkinan HTML/JS standalone atau bagian dari PWA)
3. Rendering SVG otomatis dari hasil kalkulasi
4. Validasi akurasi pola vs praktik lapangan riil
