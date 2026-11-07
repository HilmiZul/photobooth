# Changelog

Semua perubahan penting pada proyek SnapBooth dicatat di file ini.

## 1.0.2 - 2026-11-07

### Bug Fix

- Menambah jarak antar teks footer (tagline → judul acara → tanggal) agar tidak terlalu rapat, baik pada preview edit maupun hasil foto:
  - Jarak judul acara dan tanggal diubah menjadi `6px` pada skala preview.
  - Line-height tagline disamakan persis dengan preview (`16px` untuk font `12px`).
- Menyamakan tinggi bingkai preview editor dengan rasio kertas hasil cetak:
  - Strip `2x6"`: `200x600px` (mobile `160x480px`).
  - Non-strip `4x6"`: `350x525px` (mobile `280x420px`).
- Menyamakan inset bingkai (padding `p-3` + border) pada renderer kanvas sehingga posisi foto dan footer hasil foto identik dengan saat edit.
- Commit:
  - `3811754` — `update: add footer text spacing and match preview frame ratio to print output`
  - `936b683` — `bug fix: align result footer spacing, line heights and frame inset with editor`

## 1.0.1 - 2026-11-07

### Bug Fix

- Menyamakan layout dan spacing teks pada hasil foto dengan tampilan saat edit:
  - Footer hasil foto kini mengikuti alur preview editor (subjudul → judul acara → tanggal) dan menempati ruang tersisa di bawah foto, bukan posisi statis.
  - Ukuran font, line-height, letter-spacing (`tracking-widest` / `tracking-tight`), dan padding mengikuti skala preview editor.
  - Teks panjang otomatis dibungkus (word-wrap) dan diperkecil agar tidak keluar dari bingkai.
- Menyesuaikan warna teks hasil foto dengan `textColor` bingkai yang dipilih, termasuk tanggal (opacity 75%) agar tidak menyatu dengan warna latar bingkai.
- Menambahkan label teks yang sebelumnya hanya tampil saat edit ke hasil foto: `POSTAGE #n`, `POSE #n`, judul pada Polaroid Wide, dan badge `STUDIO ISSUE` pada Magazine Cover.
- Memastikan webfont editor (Plus Jakarta Sans & Outfit) sudah siap sebelum kanvas hasil foto dirender.
- Commit: `aefc04e` — `bug fix: align result photo text layout, spacing and colors with editor`
