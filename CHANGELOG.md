# Changelog

Semua perubahan penting pada proyek SnapBooth dicatat di file ini.

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
