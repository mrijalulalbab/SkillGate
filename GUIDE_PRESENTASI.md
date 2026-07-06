# Panduan Presentasi & Demo Program Tugas Besar: SkillGate

Dokumen ini disusun untuk membantu kelompok **Nexus** membagi peran secara adil dan terukur guna memenuhi batasan waktu presentasi:
*   **Presentasi Dokumen**: 5 Menit (5 Anggota @ 1 Menit)
*   **Demo Program**: Maksimal 10 Menit (Presenter Terpusat / Bergantian)
*   **Tanya Jawab (Q&A)**: 15 Menit

---

## 1. TIMELINE & PEMBAGIAN BICARA (5 MENIT)

| Durasi | Pembicara | Bagian Dokumen | Topik Utama |
| :---: | :--- | :--- | :--- |
| **00:00 - 01:00** | **Albab (Project Lead)** | Bab 1 & 2 | Pembuka, Latar Belakang (Masalah UII-Sleman), & Project Charter |
| **01:00 - 02:00** | **Yusuf (Research Lead)** | Bab 3 & 4 | Analisis Stakeholder & Kebutuhan Fungsional/Non-Fungsional |
| **02:00 - 03:00** | **Jawara (Content Lead)** | Bab 5 & 6 | Desain Proses Bisnis (BPMN), Use Case, & Skenario |
| **03:00 - 04:00** | **Naila (Prototyper)** | Bab 7 & 9 | Arsitektur Sistem (Serverless 3-Tier) & Skema Database (ERD) |
| **04:00 - 05:00** | **Rifqi (UI/UX Designer)** | Bab 8 & 12 | Integrasi LLM (Resume Summary) & Kesimpulan Proyek |

---

## 2. NASKAH BICARA ANGGOTA KELOMPOK (DRAFT 1 MENIT / ORANG)

### Pembicara 1: Albab (Project Lead) - Pembuka & Latar Belakang
> *"Selamat pagi bapak/ibu dosen penguji. Kami dari kelompok Nexus akan mempresentasikan **SkillGate**, sebuah platform ekosistem digital kampus-ke-freelance.*
>
> *Latar belakang proyek ini adalah tingginya angka mahasiswa di Sleman (lebih dari 256 ribu) yang butuh portofolio kerja nyata, berbanding lurus dengan 110 ribu UMKM Sleman yang butuh jasa digital terjangkau namun memiliki keterbatasan anggaran. SkillGate menjembatani ini dengan konsep proyek mikro (micro-gigs) yang aman.*
>
> *Berdasarkan Project Charter kami, proyek ini berlangsung selama 2 bulan dengan fokus membangun transparansi kerja dan meminimalisir penipuan transaksi melalui sistem penahanan dana (escrow) terpercaya."*

### Pembicara 2: Yusuf (Research Lead) - Stakeholder & Kebutuhan
> *"Saya Yusuf. Dari riset stakeholder yang kami lakukan, pengguna primer sistem ini adalah **Mahasiswa** yang membutuhkan portofolio terverifikasi, dan **Pemilik UMKM** yang membutuhkan efisiensi biaya.*
>
> *Untuk memenuhinya, kami merumuskan kebutuhan fungsional utama: Sistem harus menyediakan formulir registrasi multi-step bagi mahasiswa yang terintegrasi langsung dengan Kuis Kesiapan Kerja. Bagi UMKM, sistem wajib menyediakan modul posting proyek dengan live preview untuk meminimalisir kesalahan input.*
>
> *Secara non-fungsional, keamanan data dikontrol ketat melalui Row Level Security (RLS) database Supabase."*

### Pembicara 3: Jawara (Content Lead) - Proses Bisnis & Use Case
> *"Saya Jawara. Untuk proses bisnis, kami merancang alur kolaborasi dua arah. Berdasarkan diagram BPMN kami, alur dimulai dari posting proyek UMKM, pengajuan proposal mahasiswa, deposit escrow, tanda tangan kontrak SPK digital otomatis, hingga penyerahan hasil berkas kerja.*
>
> *Semua interaksi ini dipetakan ke dalam Use Case Diagram yang membagi wewenang secara jelas antara Mahasiswa, UMKM, dan Admin. Salah satu skenario krusial adalah seleksi pelamar, di mana UMKM didukung oleh modul rekomendasi kecocokan kandidat secara real-time."*

### Pembicara 4: Naila (Prototyper) - Arsitektur & Database
> *"Saya Naila. Proyek SkillGate ini dibangun di atas arsitektur serverless web modern 3-Tier menggunakan **Next.js 16 (App Router)** di sisi frontend dan **Supabase PostgreSQL** di sisi data layer. Hal ini memastikan performa load page di bawah 2 detik.*
>
> *Dari sisi desain database, Logical Data Model kami terdiri dari entitas users, profiles (mahasiswa & umkm), gigs, applications, reviews, dan messages. Kami menerapkan trigger otomatis di database untuk memutakhirkan rating rata-rata freelancer setiap kali proyek dinyatakan selesai oleh UMKM."*

### Pembicara 5: Rifqi (UI/UX Designer) - Integrasi LLM & Kesimpulan
> *"Saya Rifqi. Salah satu aspek inovasi di SkillGate adalah integrasi **Large Language Model (LLM)** menggunakan model Gemini. AI bertindak sebagai *Resume Summary Generator* yang merangkum riwayat kerja mahasiswa di platform secara otomatis.*
>
> *Kesimpulannya, prototipe SkillGate berhasil menjawab seluruh user stories dari PRD kami. Seluruh fungsionalitas, mulai dari kuis kesiapan hingga sistem notifikasi toast premium, telah lolos uji build produksi Next.js.*
>
> *Berikutnya, kami akan mensimulasikan alur kerja sistem melalui demo program."*

---

## 3. SKENARIO DEMO PROGRAM (10 MENIT)

*Disarankan demo dipandu oleh **Albab** atau **Naila** sebagai operator teknis utama.*

### Skenario 1: Onboarding & Asesmen Mahasiswa (Durasi: 2.5 Menit)
1. **Landing Page**: Perlihatkan estetika visual Landing Page. Soroti statistik interaktif platform.
2. **Registrasi Mahasiswa**: Masuk ke `/register/mahasiswa`, tunjukkan alur *multi-step form* yang rapi.
3. **Kuis Kesiapan**: Isi kuis kesiapan kerja (5 pertanyaan). Klik submit, lalu tunjukkan kalkulasi skor kesiapan dinamis.
4. **Dashboard Mahasiswa**: Perlihatkan layout Bento Grid. Tunjukkan nilai kesiapan kerja mahasiswa terpasang di salah satu kartu grid.

### Skenario 2: UMKM Posting Proyek dengan Live Preview (Durasi: 2.5 Menit)
1. **Login UMKM**: Masuk menggunakan akun `darmi@batiksleman.com` (password: `password123`).
2. **Posting Proyek**: Buka halaman `/umkm/buat-proyek`.
3. **Live Preview**: Ketik judul proyek (contoh: *"Desain Feed Instagram Batik Sleman"*), nominal budget, dan tenggat waktu. *Tunjukkan panel kanan yang berubah secara instan (real-time preview) saat Anda mengetik.*
4. **Publish**: Klik publish. Tunjukkan proyek berhasil tampil di dashboard UMKM proyek aktif.

### Skenario 3: Cari Kerja & Pengiriman Proposal Mahasiswa (Durasi: 2.5 Menit)
1. **Login Mahasiswa**: Masuk menggunakan akun `andi@student.uii.ac.id` (password: `password123`).
2. **Gig Board**: Buka `/gigs`. Cari proyek baru yang baru saja diposting UMKM.
3. **Detail & Match Score**: Buka detail proyek. Tunjukkan sistem secara otomatis menganalisis kecocokan keahlian mahasiswa dengan kriteria proyek.
4. **Submit Proposal**: Klik "Kirim Proposal". Isi cover letter, pilih proyek relevan dari riwayat kerja masa lalu (fitur highlight), unggah contoh file PDF/DOCX portofolio, lalu kirim. Tunjukkan notifikasi Toast yang muncul di pojok kanan atas.

### Skenario 4: Rekrutmen, Escrow, SPK & Review (Durasi: 2.5 Menit)
1. **Seleksi Pelamar**: Kembali ke akun UMKM. Buka pelamar proyek. Buka modal **Analisis Kecocokan** untuk melihat kontribusi bobot kriteria (Skills 40%, Kesiapan 35%, Rating 25%).
2. **Hire & Escrow**: Klik "Terima Pelamar". Sistem mengarahkan ke simulasi pembayaran Escrow. Lakukan transfer simulasi.
3. **Tanda Tangan Kontrak**: Tunjukkan layar kontrak SPK digital. Klik "Setujui SPK".
4. **Kerja Mahasiswa**: Masuk kembali sebagai Mahasiswa. Buka Ruang Kerja Proyek. Tunjukkan progress bar milestone. Centang beberapa tahap milestonenya (progres naik otomatis ke database).
5. **Kirim Deliverable**: Isi tautan kerja final (link drive) dan catatan deliverables. Kirim hasil kerja.
6. **Penyelesaian & Review**: Kembali ke akun UMKM. Klik "Terima Hasil & Selesai". Berikan rating bintang 5 dan ulasan.
7. **Verifikasi Portfolio**: Masuk ke profil Mahasiswa, tunjukkan tab `/student/portfolio` sekarang memiliki entri baru yang terisi otomatis berdasarkan proyek tersebut.

---

## 4. PREPARASI TANYA JAWAB (Q&A - 15 MENIT)

Berikut adalah pertanyaan yang sering diajukan oleh dosen Sistem Informasi beserta strategi jawabannya:

#### P1: *"Bagaimana logika algoritma Smart Recommendation Anda bekerja?"*
*   **Jawaban**: *"Sistem kami menggunakan metode Decision Support System (DSS) sederhana dengan pembobotan linear. Skor total (100%) dihitung dari: Kesesuaian Keahlian (40%)—menggunakan pencocokan array keahlian mahasiswa terhadap kriteria proyek; Skor Kesiapan (35%)—diambil langsung dari performa kuis onboarding; dan Rating Reputasi (25%)—rata-rata rating proyek sebelumnya. Ini dihitung real-time saat UMKM meninjau profil pelamar."*

#### P2: *"Mengapa menggunakan database PostgreSQL (Supabase) daripada NoSQL?"*
*   **Jawaban**: *"Kami memilih SQL karena transaksi di SkillGate melibatkan data sensitif seperti persetujuan kontrak kerja SPK dan status dana escrow. Hubungan relasional antar tabel (pelamar, proyek, pemberi kerja, ulasan) membutuhkan integritas referensial yang kuat (foreign keys & constraints) agar tidak ada status data yang menggantung atau hilang."*

#### P3: *"Bagaimana Anda menjamin keamanan data transaksi antar pengguna?"*
*   **Jawaban**: *"Kami menerapkan policy PostgreSQL Row Level Security (RLS) di database Supabase secara ketat. Mahasiswa tidak bisa melihat atau mengedit data workspace milik mahasiswa lain. Klien UMKM hanya diizinkan memodifikasi atau menyetujui proyek yang mereka posting sendiri. Kredensial penting disimpan aman di `.env` Vercel yang tidak di-push ke publik."*

#### P4: *"Bagaimana cara kerja sinkronisasi real-time pada modul chat kolaborasi?"*
*   **Jawaban**: *"Modul chat memanfaatkan fitur Supabase Realtime Channels. Ketika salah satu pengguna mengirim pesan baru (melakukan `INSERT` ke tabel `messages`), client lawan bicara yang sedang berlangganan (subscribe) ke channel gig tersebut akan langsung menerima event payload data baru tersebut secara instan tanpa perlu memuat ulang halaman (reload)."*
