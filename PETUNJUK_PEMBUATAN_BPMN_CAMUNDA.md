# Panduan Pembuatan BPMN SkillGate di Camunda Modeler

Laporan ini menyajikan panduan teknis langkah demi langkah untuk merancang diagram *Business Process Model Notation* (BPMN) sistem **SkillGate** secara mandiri menggunakan perangkat lunak **Camunda Modeler** (Desktop) maupun **Camunda Web Modeler**.

---

## 1. Persiapan Struktur Kanvas (Pool & Lanes)

Sebelum memasukkan simbol proses, buat wadah (*container*) pembagian wewenang (*separation of concerns*) untuk masing-masing aktor:

1. **Membuat Pool**:
   - Pilih tool **Create Pool/Participant** dari palet kiri Camunda Modeler.
   - Tarik kotak tersebut secara mendatar (panjang horizontal) di kanvas.
   - Klik ganda pada label pool di sisi kiri, lalu beri nama: `SkillGate Platform`.
2. **Membagi Lane (Aktor)**:
   - Klik kanan pada Pool `SkillGate Platform`.
   - Pilih ikon **Divide into Two Lanes** (atau gunakan ikon pembagi lane di menu melayang).
   - Buat Pool terbagi menjadi **2 Lane horizontal** berikut:
     - **Lane Atas**: Beri nama `Mahasiswa (Pelaksana Jasa)`
     - **Lane Bawah**: Beri nama `UMKM (Mitra Bisnis / Pemberi Kerja)`

---

## 2. Definisi Tipe Elemen Camunda

Untuk keakuratan notasi BPMN, gunakan fitur **Kunci Inggris (Wrench/Change Type)** pada Camunda Modeler untuk menyesuaikan tipe tugas dari persegi bawaan (*task*) ke tipe spesifik:

| Nama Aktivitas di Kanvas | Tipe Elemen BPMN | Ikon Visual | Rationale / Alasan Penggunaan |
|---|---|---|---|
| Semua Titik Mulai | **Start Event** | Lingkaran Tipis | Menandai trigger awal dimulainya proses bisnis. |
| Pengisian Formulir & Kuis | **User Task** | Persegi dengan Ikon Orang | Memerlukan interaksi antarmuka pengguna (UI) manusia secara aktif. |
| Verifikasi & Pencairan Dana | **Service Task** | Persegi dengan Ikon Roda Gigi | Proses otomatisasi terprogram yang dieksekusi di server/backend database. |
| Hubungan dalam Satu Lane | **Sequence Flow** | Garis Panah Lurus Padat | Menggambarkan alur aktivitas berurutan pada aktor yang sama. |
| Hubungan Antar-Lane | **Message Flow** | Garis Panah Putus-putus | Menggambarkan komunikasi/kiriman pesan antar peran yang berbeda. |
| Semua Titik Akhir | **End Event** | Lingkaran Tebal Hitam | Menandai hasil akhir/selesainya status proses bisnis. |

---

## 3. Langkah-Langkah Pembuatan Alur Proses Kerja

### Fase 1: Pendaftaran & Kelayakan Akun

#### **Alur Kerja Mahasiswa (Lane Atas):**
1. Taruh **Start Event** di ujung kiri lane Mahasiswa. Beri nama: `Akun Mahasiswa Terdaftar`.
2. Tarik garis panah (*Sequence Flow*) ke kanan, buat **User Task**: `Melengkapi Profil Akademik & Keahlian`.
3. Buat **User Task**: `Mengikuti Kuis Kesiapan Kerja` (FR-02).
4. Hubungkan ke **Exclusive Gateway** (Belah ketupat bertanda "X"): `Apakah Nilai >= 60?`.
   - **Jalur Tidak Lolos (< 60)**: Tarik panah ke atas menuju **User Task**: `Mengakses Jalur Belajar (Rekomendasi Kursus)`. Hubungkan output tugas ini kembali ke `Mengikuti Kuis Kesiapan Kerja` (membentuk putaran perbaikan keahlian).
   - **Jalur Lolos (>= 60)**: Tarik panah ke kanan menuju **User Task**: `Mencari Lowongan Proyek di Gig Board`. Beri label pada garis panah: `Ya`.

#### **Alur Kerja UMKM (Lane Bawah):**
1. Taruh **Start Event** di ujung kiri lane UMKM (sejajar secara vertikal dengan Start Mahasiswa). Beri nama: `Akun UMKM Terdaftar`.
2. Tarik panah ke kanan, buat **User Task**: `Melengkapi Profil Bisnis & Mengunggah NIB/KTP`.
3. Hubungkan ke **Service Task**: `Verifikasi Dokumen UMKM oleh Admin` (Sistem melakukan validasi perizinan).
4. Hubungkan ke **User Task**: `Membuat Brief Proyek dengan Live Preview` (F-02).
5. Hubungkan ke **User Task**: `Mempublikasikan Proyek`.

---

### Fase 2: Pengajuan Lamaran & Pembayaran Escrow

1. Tarik garis komunikasi **Message Flow** (garis putus-putus dengan panah terbuka) dari **User Task** Mahasiswa `Mengirim Proposal & Lampiran Portofolio` ke bawah menuju Lane UMKM.
2. Di Lane UMKM, hubungkan ke **User Task**: `Tinjau Proposal & Skor Rekomendasi Pelamar (Match Score)` (F-04).
3. Hubungkan ke **Exclusive Gateway**: `Pilih Pelamar Terbaik?`.
   - **Jalur Tidak**: Hubungkan kembali ke task `Tinjau Proposal...` (menunggu atau menolak pelamar).
   - **Jalur Ya**: Hubungkan ke **User Task**: `Melakukan Deposit Dana Escrow` (UMKM mengunci dana pengerjaan di sistem).
4. Hubungkan ke **User Task**: `Menandatangani Kontrak SPK Digital`.

---

### Fase 3: Kolaborasi Kerja & Penyerahan Output

1. Hubungkan task `Menandatangani Kontrak SPK Digital` (UMKM) ke atas menggunakan **Message Flow** menuju **User Task** Mahasiswa: `Menyetujui Kontrak SPK & Memulai Pengerjaan`.
2. Di Lane Mahasiswa, hubungkan secara berurutan (*Sequence Flow*) ke:
   - **User Task**: `Mengerjakan Proyek & Memperbarui Checklist Milestone` (FR-07).
   - **User Task**: `Mengirimkan Hasil Kerja Akhir (Upload File)`.
3. Tarik garis komunikasi **Message Flow** dari task `Mengirimkan Hasil Kerja Akhir` (Mahasiswa) ke bawah menuju **User Task** UMKM: `Meninjau Hasil Kerja Mahasiswa`.
4. Hubungkan ke **Exclusive Gateway**: `Hasil Kerja Disetujui?`.
   - **Jalur Tidak (Revisi)**: Tarik panah ke atas melintasi lane, hubungkan kembali ke task Mahasiswa `Mengerjakan Proyek & Memperbarui Checklist Milestone`. Beri label garis: `Tidak (Revisi)`.
   - **Jalur Ya**: Hubungkan ke **User Task**: `Menyelesaikan Proyek & Memberikan Ulasan/Rating`. Beri label garis: `Ya`.

---

### Fase 4: Transaksi Akhir & Penutupan Proyek

1. Di Lane UMKM, hubungkan task `Menyelesaikan Proyek...` ke **Service Task**: `Mencairkan Dana Escrow ke Saldo Mahasiswa` (dana dilepas otomatis oleh sistem).
2. Tarik garis **Message Flow** dari task pencairan dana ke atas menuju **Receive Task** Mahasiswa: `Menerima Honorarium Proyek`.
3. Akhiri proses kedua aktor dengan **End Event**:
   - Di ujung kanan Lane Mahasiswa: `Proyek Selesai & Sukses` (Selesai menerima honor).
   - Di ujung kanan Lane UMKM: `Proyek Selesai & Ditutup` (Selesai mencairkan dana).

---

## 4. Tips Menggambar Diagram di Camunda agar Rapi dan Premium

Agar diagram Anda terlihat sangat profesional di depan dosen penguji, ikuti aturan estetika berikut:

*   **Penyelarasan Vertikal & Horizontal (Alignment)**:
    Gunakan fitur **Align** pada toolbar atas Camunda Modeler. Blok barisan kotak task yang sejalur, lalu klik *Align Middle* agar garis lurus horizontal tidak berlekuk-lekuk.
*   **Titik Belok Garis (Waypoints)**:
    Pastikan semua garis penghubung membentuk sudut siku-siku 90 derajat. Geser jangkar (*anchor point*) pada garis Camunda untuk merapikan garis silang yang memotong kotak teks.
*   **Pewarnaan Elemen (Coloring)**:
    Camunda Modeler menyediakan panel warna di menu melayang objek (*Properties Panel*):
    - Beri warna hijau muda pada semua *Start Event*.
    - Beri warna merah muda pada semua *End Event*.
    - Beri warna biru muda pada modul kritis database (seperti *Kuis Kesiapan* dan *Dana Escrow*) untuk membedakan aspek fungsionalitas sistem.
*   **Ekspor Berkualitas Tinggi**:
    Jangan gunakan screenshot layar biasa. Klik **File ➔ Export As ➔ SVG / PNG** pada Camunda Modeler untuk mendapatkan berkas gambar resolusi tinggi tanpa pecah saat dicetak ke kertas laporan.
