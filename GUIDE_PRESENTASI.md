# Panduan Presentasi & Demo Program Tugas Besar: SkillGate

Dokumen ini disusun untuk membantu kelompok **Nexus** membagi peran secara adil dan terukur guna memenuhi batasan waktu presentasi:
*   **Presentasi Dokumen**: 5 Menit (5 Anggota @ 1 Menit)
*   **Demo Program**: Maksimal 10 Menit (Presenter Terpusat / Bergantian)
*   **Tanya Jawab (Q&A)**: 15 Menit

---

## 1. TIMELINE & PEMBAGIAN BICARA (5 MENIT)

| Durasi | Pembicara | Bagian Dokumen | Topik Utama |
| :---: | :--- | :--- | :--- |
| **00:00 - 01:15** | **Albab (Project Lead)** | Bab 1 & 2 | Pembuka, Latar Belakang Masalah, Tujuan Proyek, & Project Charter (Risiko Escrow) |
| **01:15 - 02:30** | **Yusuf (Research Lead)** | Bab 3 & 4 | Analisis Stakeholder & Kebutuhan Fungsional/Non-Fungsional (Tabel FR & NFR) |
| **02:30 - 03:45** | **Naila (Prototyper)** | Bab 5, 6, 7 & 9 | Proses Bisnis (BPMN), Use Case, Arsitektur Sistem 3-Tier, & Database ERD |
| **03:45 - 05:00** | **Rifqi (UI/UX Designer)** | Bab 8, 10 & 12 | Integrasi AI/LLM (Resume Generator), Pengujian UAT, & Kesimpulan/Saran |

---

## 2. NASKAH BICARA ANGGOTA KELOMPOK (DRAFT 1 MENIT 15 DETIK / ORANG)

### Pembicara 1: Albab (Project Lead) - Pembuka, Pendahuluan & Project Charter
> *"Selamat pagi Bapak dan Ibu dosen penguji. Kami dari kelompok Nexus akan mempresentasikan **SkillGate**, platform ekosistem digital kampus-ke-freelance bagi mahasiswa dan UMKM lokal.
>
> Masalah utama yang kami angkat adalah kesenjangan struktural di Sleman: terdapat lebih dari 256 ribu mahasiswa aktif yang butuh portofolio kerja nyata, berdampingan dengan 110 ribu UMKM yang butuh jasa digital terjangkau namun tidak mampu menyewa agensi profesional.
>
> Proyek SkillGate dirancang untuk menyelesaikan masalah tersebut dengan menyediakan platform transaksi micro-gig yang aman. Melalui Project Charter yang kami susun, kami berasumsi mahasiswa UII memiliki keterampilan dasar yang mumpuni, dengan risiko utama berupa keamanan dana yang kami mitigasi melalui sistem pembayaran deposit escrow terintegrasi."*

### Pembicara 2: Yusuf (Research Lead) - Stakeholder & Kebutuhan Sistem
> *"Saya Yusuf. Dari hasil analisis stakeholder, kami memetakan dua pengguna primer utama: **Mahasiswa** yang membutuhkan portofolio terverifikasi, serta **UMKM** yang membutuhkan jasa digital berkualitas yang murah.
>
> Untuk memenuhi kebutuhan tersebut, kami merumuskan kebutuhan fungsional (FR) berprioritas High, seperti modul registrasi mahasiswa yang terintegrasi langsung dengan Kuis Kesiapan Kerja (FR-01 & FR-02), serta modul posting proyek UMKM dengan fitur live preview (FR-08) dan analisis smart recommendation pelamar (FR-09).
>
> Secara non-fungsional, sistem wajib memenuhi aspek performa (load time kurang dari 2 detik), keamanan ketat (database PostgreSQL RLS), serta usabilitas responsif (layout bento grid) untuk smartphone."*

### Pembicara 3: Naila (Prototyper) - Desain Proses Bisnis, Use Case, Arsitektur & Database
> *"Saya Naila. Kami merancang proses bisnis yang kolaboratif menggunakan BPMN, di mana alur pengerjaan terdokumentasi rapi mulai dari rekrutmen hingga penyelesaian proyek. Hak akses dari seluruh fungsi ini dikontrol secara terpusat melalui Use Case Diagram yang memetakan wewenang Mahasiswa, UMKM, dan Admin.
>
> Untuk arsitektur, kami mengimplementasikan Serverless React 3-Tier menggunakan Next.js 16 (App Router) di sisi frontend dan database relasional PostgreSQL (Supabase) di sisi backend. 
>
> Skema database ERD kami terdiri dari tabel users, profiles, gigs, applications, reviews, dan messages. Kami menambahkan database triggers untuk otomatis memperbarui skor reputasi rating mahasiswa secara real-time setiap kali proyek selesai disetujui."*

### Pembicara 4: Rifqi (UI/UX Designer) - Integrasi LLM, UAT & Kesimpulan
> *"Saya Rifqi. Pada aspek inovasi, kami mengintegrasikan Large Language Model (LLM) Gemini sebagai Resume Executive Summary Generator pada halaman portofolio mahasiswa untuk merangkum kinerja mereka secara otomatis.
>
> Kami telah melakukan verifikasi kompilasi build produksi Next.js secara sukses 100%. Pengujian fungsional dan User Acceptance Testing (UAT) dilakukan dengan mensimulasikan peran mahasiswa dan UMKM, serta memverifikasi keamanan policy RLS database.
>
> Kesimpulannya, prototipe SkillGate berhasil menjawab seluruh user stories dari PRD. Saran kami ke depan adalah mengintegrasikan payment gateway perbankan riil seperti Midtrans untuk menggantikan simulasi escrow. 
>
> Berikutnya, kami akan menyajikan demonstrasi program live."*

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
