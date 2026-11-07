# SnapBooth Kiosk • Autonomous Self-Service Photobooth Studio 📸✨

A modern, high-value, commercial-grade self-service photobooth web application built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**. Designed for photo studios, wedding events, cafe pop-ups, festivals, shopping malls, and corporate gatherings.

---

## 🌟 Fitur Unggulan (Key Features)

### 1. 20 Format Cetak Kekinian (20 Trendy Print Formats)
Tersedia beragam format tata letak cetak standar industri photobooth:
- **Photostrip 2x6 Inci**:
  - `Classic 4-Cut Strip`: 4 foto vertikal standar photobooth studio.
  - `Tall 3-Cut Strip`: 3 foto vertikal lebih tinggi & ekspresif.
  - `Duo Split Strip`: 2 foto potret berukuran besar.
  - `5-Cut Cine Strip`: 5 foto vertikal berurutan sinematik.
  - `6-Cut Film Reel`: 6 foto vertikal roll klise film bioskop.
- **Grid Album 4x6 Inci**:
  - `2x2 Quad Grid`: 4 foto kotak simetris untuk album kenangan.
  - `6-Shot Studio Matrix`: 6 foto mini (3 baris x 2 kolom).
  - `9-Shot Micro Matrix`: 9 foto mosaik untuk kelompok seru.
  - `Twin Landscape Stack`: 2 foto lanskap bertingkat.
- **Editorial & Magazine (4x6 Inci)**:
  - `Solo Full Portrait`: 1 potret penuh resolusi tajam.
  - `Hero Left + 2 Stack`: 1 foto utama kiri + 2 foto bertingkat kanan.
  - `Hero Banner + 3 Strip`: 1 foto lanskap atas + 3 foto mini bawah.
  - `Spotlight Center Stage`: 1 foto besar tengah diapit 2 foto samping.
  - `Cinematic 2.39:1 Dual`: 2 frame ultra-wide layar lebar.
  - `Editorial Magazine Cover`: 1 foto cover majalah + 2 inset thumbnail.
- **Kreatif & Unik**:
  - `Polaroid Wide Shot`: 1 foto lanskap bingkai polaroid retro.
  - `Triptych 3-Panorama`: 3 foto vertikal berdampingan horisontal.
  - `Asymmetric Collage`: 4 foto kolase ukuran dinamis & modern.
  - `Postage Stamp Quad`: 4 foto prangko klasik bernomor seri dengan tepi perforasi.
  - `4 Mini Polaroids Sheet`: 4 kartu polaroid mini dalam 1 lembar cetak.

---

### 2. 20 Bingkai Kreatif & Artistik (20 Non-Rigid Frame Themes)
Bingkai dinamis dan tidak kaku dengan berbagai gaya artistik:
- **Gradasi Estetik**: *Sunset Horizon, Aurora Borealis, Cotton Candy Pastel, Electric Cyber Violet, Golden Hour Glam, Matcha Forest, Cherry Blossom, Neon Cyan, Lavender Dusk, Midnight Royal Blue, Terracotta Warm, Champagne Glitz*.
- **Vintage & Film**:
  - *Film 35mm Classic*: Efek klise film dengan lubang sprocket perforasi kiri-kanan.
  - *Warm Polaroid Paper*: Tekstur kertas retro khas polaroid.
  - *Checkerboard Retro*: Pola papan catur dua warna modis.
  - *Retro Cream Paper*: Kertas album foto nostalgia tahun 90-an.
- **Studio Minimalis**: *Onyx Studio Black, Pure Gallery White, Emerald Noir, Charcoal Slate*.

---

### 3. 20 Filter Modern & Beautiful
Filter pencahayaan studio terbagi dalam 5 kategori:
- **Natural**: *Original Studio, Soft Glow, Clean Minimalist, Golden Hour, Peach Sunkissed, Warm Cashmere*.
- **Vintage**: *Vintage 35mm, Retro Polaroid 80s, Sepia Antique, Pastel Dream*.
- **Monochrome**: *Mono Noir Studio, Silver Halide B&W, Matte Editorial*.
- **Cinematic**: *Nordic Cool, Cinematic Teal, Emerald Luxe, Velvet Dusk*.
- **Vibrant**: *Cyber Neon, Candid Flash, Vivid Pop Art*.

---

### 4. Pemandu Suara Manusia Nyata (*Voice-Only Guidance*)
- Bebas suara detik atau *beep* elektronik yang mengganggu telinga.
- Menggunakan **Web Speech API** bahasa Indonesia yang ramah & natural:
  - *"Pose 1"*, *"Pose 2"*, dst.
  - Hitung mundur suara: *"Tiga"*, *"Dua"*, *"Satu"*.
  - Aba-aba jepretan kamera: *"Senyum!"*.
  - Disertai animasi kilatan lampu *flash* layar dan suara rana (*shutter*) mekanik.

---

### 5. Stiker Interaktif & Generator Badge Kustom
- **Drag & Drop Sentuh Bebas**: Stiker dapat digeser di atas lembar foto.
- **Batas Aman (Frame Clamping)**: Stiker dikunci secara matematis di dalam bingkai (8% – 92%), tidak akan pernah keluar atau terpotong tepi.
- **Ukuran & Rotasi**: Tombol perbesar, perkecil, dan putar 360°.
- **Kategori Terpisah**: Palet emoji pesta dan *Word Badges* (SMILE, BESTIES, LOVE, PARTY, dll).
- **Custom Badge Maker**: Pengunjung dapat mengetik kata/nama mereka sendiri untuk dijadikan stiker lencana studio instan.

---

### 6. Siap Cetak Komersial & Pengiriman Digital
- **Resolusi Tinggi 300 DPI**: Render berbasis HTML5 Canvas beresolusi cetak tinggi (1200x1800 px untuk 4x6", 600x1800 px untuk strip 2x6").
- **Mode Cetak Strip Kembar (Twin-Strip 4x6")**: Cetak 2 strip sekaligus berdampingan dengan garis potong putus-putus pada kertas printer 4x6 inci (hemat kertas printer DNP/HiTi/Citizen).
- **Cetak Bebas Margin (`@media print`)**: Tombol, header, dan UI layar otomatis disembunyikan saat mencetak fisik.
- **Download Langsung**: Unduh file PNG resolusi penuh.
- **Scan QR Code ke HP**: QR code instan untuk menyimpan foto ke smartphone tanpa kabel.
- **Kirim ke WhatsApp**: Tombol satu-klik untuk membagikan tautan hasil foto ke WhatsApp.
- **Live Boomerang Preview**: Simulasi animasi gerak *boomerang* loop dari seluruh pose yang diambil.

---

### 7. Panel Pengaturan Kiosk Terproteksi PIN
- Akses melalui ikon gear (⚙️) di header studio.
- **PIN Default**: `1234`
- **Fitur Pemilik Bisnis**:
  - Total sesi hari ini & total lembar tercetak.
  - Estimasi pendapatan harian (IDR / kustom mata uang).
  - Indikator sisa kapasitas roll kertas printer foto.
  - Ganti nama event, sub-judul, dan upload custom logo watermark.
  - Aktif/nonaktifkan mode pembayaran QRIS dan ubah harga per sesi.
  - Pengaturan durasi countdown (3s, 5s, 8s) dan timer auto-reset kiosk.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

- **Frontend Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **QR Code Engine**: [node-qrcode](https://github.com/soldair/node-qrcode)
- **Audio Synthesizer**: Web Audio API (Osilator sintesis instan tanpa aset eksternal)
- **Voice Guidance**: Web Speech Synthesis API (`id-ID`)
- **Camera Capture**: HTML5 WebRTC `navigator.mediaDevices.getUserMedia`

---

## 🚀 Panduan Menjalankan Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18+ atau yang lebih baru.
- Web browser modern (Google Chrome, Microsoft Edge, Safari).

### Instalasi & Menjalankan
```bash
# 1. Clone repository ini
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME

# 2. Install seluruh dependensi
npm install

# 3. Jalankan development server
npm run dev
```

Buka browser Anda di `http://localhost:3000`.

Untuk membangun bundle produksi:
```bash
npm run build
npm run preview
```

---

## 📤 Langkah-Langkah Upload ke GitHub

Jika Anda ingin mengunggah project ini ke akun GitHub Anda, ikuti langkah berikut di Terminal:

```bash
# 1. Masuk ke direktori project
cd /Users/imasmasruroh/Downloads/Web/coba/photobooth

# 2. Inisialisasi Git (jika belum ada)
git init

# 3. Tambahkan semua file (node_modules sudah otomatis diabaikan oleh .gitignore)
git add .

# 4. Buat commit pertama
git commit -m "feat: complete self-service commercial photobooth with 20 layouts, 20 frames, and 20 filters"

# 5. Buat repository baru di https://github.com/new (misalnya beri nama: photobooth-kiosk)

# 6. Hubungkan remote repository dan push ke GitHub (ganti USERNAME dan REPO_NAME):
git branch -M main
git remote add origin https://github.com/USERNAME/photobooth-kiosk.git
git push -u origin main
```

---

## 📄 Lisensi
Project ini didistribusikan di bawah lisensi [MIT](LICENSE). Bebas digunakan dan dikembangkan untuk keperluan personal maupun komersial.
