# PRODUCT REQUIREMENTS DOCUMENT

## SkillGate

**Ekosistem digital kampus-ke-freelance yang menghubungkan mahasiswa dengan UMKM lokal untuk micro-gig, pembangunan portofolio, dan pengembangan keterampilan.**

---

| **Version** | v1.0 - Draft |
|-------------|--------------|
| **Date** | 15 Mei 2026 |
| **Team** | Nexus — Albab (Project Lead), Rifqi (UI/UX Designer), Yusuf (Research & Validation Lead), Jawara (Content & Community Strategist), Naila (Digital Prototyper) |
| **Product Owner** | Albab |
| **Client / Stakeholder** | Mata Kuliah Pengembangan Sistem Informasi (PSI) — juga didaftarkan ke ICDD 2026 Hackathon |
| **Status** | Draft |

---

## Daftar Isi

1. [Problem Statement](#1-problem-statement)
2. [Objectives](#2-objectives)
3. [Success Metrics](#3-success-metrics)
4. [Scope](#4-scope)
5. [Functional Requirements](#5-functional-requirements)
6. [User Workflows](#6-user-workflows)

---

## 1. Problem Statement

### 1.1 Background & Context

Kabupaten Sleman merupakan wilayah dengan konsentrasi mahasiswa tertinggi di Daerah Istimewa Yogyakarta, dengan total **256.208 mahasiswa aktif** yang tersebar di berbagai perguruan tinggi negeri dan swasta (PDDikti/BPS). Di saat yang sama, Sleman memiliki **110.399 UMKM** — 99,8% di antaranya adalah usaha mikro (Bapperida, 2025). Kedua kelompok ini adalah aset ekonomi dan sosial terbesar Sleman, namun hidup berdampingan tanpa koneksi yang terstruktur.

Penelitian lapangan tim Nexus melalui survei, wawancara, dan studi data sekunder mengidentifikasi **tiga kesenjangan struktural** yang saling memperburuk:

1. **Mahasiswa** mempelajari keterampilan digital di kampus — desain grafis, fotografi produk, penulisan konten, pengelolaan media sosial — tetapi tidak memiliki saluran terstruktur untuk menerapkannya secara profesional. Mereka lulus tanpa portofolio kerja nyata yang dapat ditunjukkan kepada calon pemberi kerja.

2. **UMKM** sangat membutuhkan layanan digital — poster promosi, konten Instagram, foto produk, pengelolaan toko online — namun tidak mampu menyewa agensi profesional. Mereka juga tidak mengetahui cara menemukan talenta digital lokal yang terjangkau dan terpercaya di sekitar mereka.

3. Terdapat **kesenjangan keterampilan** antara kurikulum kampus yang bersifat idealis-teoretis dengan kebutuhan UMKM yang sangat praktis. Mahasiswa belajar teori desain, namun tidak dipersiapkan untuk menangani klien dengan anggaran Rp50.000 dan tenggat waktu dua hari.

Konteks kebijakan mempertegas urgensi ini: Pemerintah telah menetapkan Sleman sebagai lokasi percontohan nasional untuk **Program Pelatihan Ekonomi Gig 2026** (Kementerian Ketenagakerjaan RI) — sebuah sinyal bahwa platform yang menjembatani kesenjangan ini tidak hanya relevan secara akademis, tetapi juga strategis secara nasional.

### 1.2 Problem Statement

Mahasiswa di Sleman tidak dapat mengakses peluang freelance yang terstruktur dan berisiko rendah untuk membangun portofolio profesional karena tidak ada sistem informasi yang menghubungkan mereka langsung dengan UMKM lokal yang membutuhkan layanan digital terjangkau — yang mengakibatkan lulusan memasuki pasar kerja tanpa pengalaman kerja yang dapat ditunjukkan, dan UMKM tetap tidak mampu melakukan transformasi digital.

### 1.3 Who is Affected

| No | Stakeholder | Dampak |
|----|-------------|--------|
| 1 | **Mahasiswa** (Pengguna Primer) | Tidak memiliki portofolio dan pengalaman kerja nyata. Platform freelance global terlalu kompetitif bagi pemula, dan tidak menyediakan micro-gig dari bisnis di sekitar mereka. |
| 2 | **Pemilik UMKM Mikro dan Kecil** (Pengguna Primer) | Membutuhkan layanan digital namun tidak mampu membayar agensi profesional; tidak mengetahui cara menemukan freelancer lokal yang dapat dipercaya; pernah mengalami pengalaman buruk dengan bantuan informal yang tidak profesional. |
| 3 | **Perguruan Tinggi dan Dosen** (Pengguna Sekunder) | Tidak ada sistem untuk memantau atau memfasilitasi kesiapan freelance mahasiswa secara terstruktur, dan tidak ada jembatan antara pembelajaran kurikuler dengan praktik kerja nyata di lapangan. |
| 4 | **Pemerintah Daerah** (Pemangku Kepentingan Tersier) | Visi Sleman sebagai hub talenta digital terhambat oleh absennya pipeline terstruktur yang menghubungkan talenta dengan bisnis lokal. |

---

## 2. Objectives

### 2.1 Business Objectives

| # | Objective | Why it matters | Success indicator |
|---|-----------|----------------|-------------------|
| 1 | Menghubungkan 500+ mahasiswa dengan minimal satu micro-gig yang diselesaikan dalam 3 bulan setelah peluncuran. | Memvalidasi proposisi nilai inti platform dalam menurunkan hambatan first-gig bagi pemula yang belum memiliki rekam jejak profesional. | Jumlah mahasiswa dengan ≥1 proyek selesai tercatat di portofolio mereka. |
| 2 | Onboarding 100+ UMKM yang memposting proyek dalam 3 bulan pertama. | Membuktikan demand nyata dari sisi bisnis dan membangun pipeline proyek yang cukup aktif agar gig board tidak tampak kosong bagi mahasiswa baru. | Jumlah akun UMKM unik dengan ≥1 proyek terpublikasi di platform. |
| 3 | Mencapai tingkat penyelesaian proyek 80% (proposal diterima → proyek terkirim). | Mendemonstrasikan reliabilitas platform dan profesionalisme mahasiswa, membangun kepercayaan UMKM untuk terus menggunakan SkillGate. | Rasio proyek yang selesai terhadap proposal yang diterima per periode. |
| 4 | Tingkat kepuasan UMKM ≥80% pada akhir proyek pertama mereka. | UMKM yang puas berpotensi menjadi pengguna berulang dan merekomendasikan platform ke sesama pelaku usaha, mendorong pertumbuhan organik. | Skor testimoni rata-rata dan survei singkat kepuasan klien setelah proyek selesai. |

### 2.2 User Objectives

| Actor | What they need to accomplish | What stops them today |
|-------|------------------------------|-----------------------|
| **Mahasiswa** | Membangun portofolio profesional melalui proyek nyata, berbayar, dan berdurasi pendek bersama klien sungguhan. | Tidak ada akses ke klien yang ramah pemula; platform freelance global terlalu kompetitif; takut tidak dibayar atau ditipu. |
| **Pemilik UMKM** | Mendapatkan layanan digital terjangkau (desain, konten, foto) dari talenta lokal yang dapat diandalkan dan mudah ditemukan. | Tidak mampu membayar agensi; tidak tahu cara menemukan freelancer terpercaya; pernah kecewa dengan bantuan informal sebelumnya. |
| **Perguruan Tinggi / Program Studi** | Memantau dan mendukung kesiapan freelance serta employability mahasiswa secara terstruktur sebagai bagian dari kurikulum. | Tidak ada sistem yang menghubungkan pembelajaran kurikuler dengan praktik freelance nyata; tidak ada visibilitas terhadap kesenjangan keterampilan mahasiswa. |

---

## 3. Success Metrics

| Metric | Baseline (now) | Target (3 months) | How it is measured |
|--------|---------------|-------------------|-------------------|
| Tingkat pembuatan portofolio mahasiswa | 0% — platform belum ada | 70% mahasiswa aktif menyelesaikan ≥1 entri portofolio | Database platform: proyek selesai dengan testimoni klien terlampir. |
| Tingkat posting proyek UMKM | 0 proyek | 100 UMKM memposting ≥1 proyek | Database platform: akun UMKM unik dengan gig terpublikasi. |
| Waktu dari posting proyek ke proposal pertama | N/A | Di bawah 48 jam | Timestamp sisi server: proyek dipublikasi vs. proposal pertama diterima. |
| Tingkat penyelesaian Skor Kesiapan Freelance | 0% | 90% mahasiswa terdaftar menyelesaikan asesmen | Analitik platform: funnel penyelesaian kuis (langkah 1 vs. layar hasil tercapai). |
| Rata-rata proposal per proyek | Tidak ada koneksi | ≥3 proposal per proyek | Database platform: jumlah proposal per proyek aktif. |
| Tingkat kepuasan UMKM setelah proyek selesai | N/A | ≥80% memberi skor positif | Survei singkat 1–3 pertanyaan yang dikirimkan otomatis setelah proyek ditandai selesai. |

---

## 4. Scope

### 4.1 In Scope & Out of Scope (MVP)

| ✅ IN Scope (MVP) | ❌ OUT of Scope (v1) |
|-------------------|---------------------|
| Onboarding mahasiswa dan pembuatan profil keterampilan. | Algoritma pencocokan otomatis antara mahasiswa dan proyek. |
| Skor Kesiapan Freelance: asesmen 5 pertanyaan dengan hasil dan rekomendasi personal. | Sistem pembayaran escrow dan pelacakan milestone proyek. |
| Micro-Gig Board dengan daftar proyek, filter kategori, dan tampilan detail. | Dashboard mitra kampus untuk program studi atau universitas. |
| Quick Brief Form untuk UMKM memposting proyek. | Sistem sertifikasi dan lencana digital bagi mahasiswa. |
| Formulir pengiriman proposal dengan upload sampel portofolio. | Marketplace mentorship (pemesanan sesi mentor berbayar). |
| Portfolio Builder otomatis setelah proyek diselesaikan. | Dashboard analitik kompetensi untuk ketua program studi. |
| Rekomendasi Jalur Belajar (kursus MOOC dan saran mentor berdasarkan kesenjangan kesiapan). | Pelaporan dampak ekonomi dan pelacakan nilai sosial platform. |
| Pelacakan status proyek (terbuka, dalam proses, selesai). | Program inkubator freelance terstruktur. |
| Notifikasi proposal masuk untuk UMKM. | Dukungan multibahasa di luar Bahasa Indonesia. |

### 4.2 Assumptions & Constraints

| Type | Description |
|------|-------------|
| **Assumption** | Mahasiswa memiliki akses smartphone dan konektivitas internet yang memadai untuk menggunakan platform web yang mobile-responsive. |
| **Assumption** | UMKM bersedia memposting proyek dengan anggaran kecil (Rp50.000–Rp150.000) untuk layanan digital mikro. |
| **Assumption** | Perguruan tinggi di Sleman akan mengizinkan promosi platform melalui BEM, unit karir mahasiswa, dan kanal komunikasi kampus resmi. |
| **Assumption** | Mahasiswa telah memiliki keterampilan digital dasar (alat desain, media sosial, fotografi dasar) dari pembelajaran perkuliahan sebelumnya. |
| **Assumption** | UMKM memiliki akses ke perangkat smartphone untuk menerima notifikasi dan meninjau proposal yang masuk. |
| **Constraint** | MVP harus dapat diserahkan sebagai prototipe interaktif (Stitch AI / Figma) paling lambat 10 Mei 2026 untuk pengiriman ICDD 2026 Hackathon. |
| **Constraint** | Platform harus mematuhi Undang-Undang Perlindungan Data Pribadi Indonesia (UU PDP No. 27 Tahun 2022). Data pribadi pengguna tidak boleh disimpan dalam bentuk teks biasa. |
| **Constraint** | Ruang lingkup awal dibatasi pada Kabupaten Sleman; ekspansi ke wilayah lain adalah agenda pasca-MVP. |
| **Constraint** | MVP adalah prototipe, bukan aplikasi siap produksi; tidak ada pengembangan backend pada fase ini. |

---

## 5. Functional Requirements

### 5.1 FR Table: Mahasiswa

| FR ID | Actor | The system shall... | Condition / Trigger | Priority | MoSCoW |
|-------|-------|---------------------|---------------------|----------|--------|
| **FR-001** | Mahasiswa | Mengizinkan mahasiswa membuat profil dengan nama, universitas, jurusan, keterampilan (tag multi-pilih), dan bio singkat. | Saat mahasiswa mengetuk "Mulai" di layar onboarding. | Tinggi | **M** |
| **FR-002** | Mahasiswa | Mengizinkan mahasiswa mengatur ketersediaan mingguan dalam jam menggunakan kontrol slider. | Selama pembuatan profil, setelah pemilihan keterampilan. | Tinggi | **M** |
| **FR-003** | Mahasiswa | Menampilkan Kuis Kesiapan 5 pertanyaan pilihan ganda yang mencakup keterampilan teknis, komunikasi klien, manajemen waktu, dan wawasan bisnis. | Saat mahasiswa menyelesaikan profil dan mengetuk "Ikuti Kuis Kesiapan." | Tinggi | **M** |
| **FR-004** | Sistem | Menampilkan Skor Kesiapan Freelance sebagai persentase dengan grafik radar/batang di empat kategori beserta rekomendasi personal. | Segera setelah kuis selesai. | Tinggi | **M** |
| **FR-005** | Mahasiswa | Menampilkan Micro-Gig Board yang dapat difilter, memperlihatkan proyek aktif dengan judul, nama klien, anggaran, tenggat, dan tag kategori. | Saat mahasiswa mengetuk "Jelajahi Proyek" dari layar hasil kesiapan atau navigasi utama. | Tinggi | **M** |
| **FR-006** | Mahasiswa | Menampilkan detail proyek lengkap termasuk brief klien, persyaratan, anggaran, tenggat, dan rating klien. | Saat mahasiswa mengetuk kartu proyek di Gig Board. | Tinggi | **M** |
| **FR-007** | Mahasiswa | Mengizinkan mahasiswa mengirimkan proposal berisi deskripsi pendekatan, upload sampel portofolio, estimasi waktu penyelesaian, dan pesan untuk klien. | Saat mahasiswa mengetuk "Kirim Proposal" di layar detail proyek. | Tinggi | **M** |
| **FR-008** | Sistem | Menghasilkan entri portofolio secara otomatis dengan judul proyek, nama klien, gambar hasil kerja, dan testimoni klien. | Saat UMKM menandai proyek sebagai selesai. | Tinggi | **M** |
| **FR-009** | Mahasiswa | Menampilkan rekomendasi kursus MOOC dan saran mentor berdasarkan kesenjangan skor kesiapan mahasiswa. | Di layar Jalur Belajar, dapat diakses setelah hasil kesiapan atau setelah entri portofolio pertama dibuat. | Sedang | **S** |
| **FR-010** | Mahasiswa | Mengizinkan mahasiswa melacak status semua proyek yang dilamar (Menunggu, Diterima, Dalam Proses, Selesai) dalam satu tab terpadu. | Saat mahasiswa mengetuk tab "Proyek Saya" di navigasi utama. | Sedang | **S** |

### 5.2 FR Table: Pemilik UMKM

| FR ID | Actor | The system shall... | Condition / Trigger | Priority | MoSCoW |
|-------|-------|---------------------|---------------------|----------|--------|
| **FR-011** | UMKM | Mengizinkan UMKM membuat brief proyek dengan judul, kategori, deskripsi, anggaran, tenggat, dan keterampilan yang dibutuhkan. | Saat UMKM mengetuk "Posting Proyek Baru." | Tinggi | **M** |
| **FR-012** | UMKM | Menampilkan pratinjau proyek sebagaimana yang akan dilihat mahasiswa di Gig Board sebelum dipublikasikan. | Saat UMKM mengetuk "Pratinjau" pada formulir brief. | Sedang | **S** |
| **FR-013** | UMKM | Mempublikasikan proyek ke Micro-Gig Board sehingga mahasiswa dapat melihat dan melamar. | Saat UMKM mengetuk "Posting Proyek" setelah melengkapi formulir. | Tinggi | **M** |
| **FR-014** | Sistem | Mengirimkan notifikasi kepada UMKM saat mahasiswa mengirimkan proposal untuk proyek mereka. | Saat proposal dikirimkan oleh mahasiswa. | Sedang | **S** |
| **FR-015** | UMKM | Mengizinkan UMKM meninjau semua proposal yang masuk dan memilih satu untuk diterima. | Saat UMKM membuka tab "Proposal Masuk" di dashboard mereka. | Tinggi | **M** |
| **FR-016** | UMKM | Mengizinkan UMKM menandai proyek sebagai selesai dan memberikan testimoni singkat tentang hasil kerja mahasiswa. | Saat mahasiswa menyerahkan hasil kerja final. | Tinggi | **M** |

### 5.3 MoSCoW Reference

| Kode | Keterangan |
|------|------------|
| **M** | **Must Have** — produk tidak dapat dirilis tanpa fitur ini. |
| **S** | **Should Have** — bernilai signifikan, diharapkan di sprint atau rilis berikutnya. |
| **C** | **Could Have** — nice to have; hanya disertakan jika item prioritas lebih tinggi selesai. |
| **W** | **Won't Have** (this time) — ditunda. Ditulis di sini agar tidak diam-diam masuk ke scope. |

---

## 6. User Workflows

### 6.1 Workflow: Mahasiswa — Mencari & Mendapatkan Proyek

| **Actor** | Mahasiswa |
|-----------|-----------|
| **Goal** | Menyelesaikan profil, menilai kesiapan freelance, menemukan proyek, dan mengirimkan proposal |
| **FRs covered** | FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007 |

#### Ideal Path

| # | Step description |
|---|------------------|
| **1** | Mahasiswa membuka SkillGate untuk pertama kalinya. Aplikasi menampilkan layar onboarding dengan pengenalan platform. Mahasiswa mengetuk "Mulai." |
| **2** | Sistem menampilkan formulir pembuatan profil. Mahasiswa memasukkan nama, memilih universitas dari dropdown, memilih jurusan, dan memilih keterampilan dari tag multi-pilih (mis. Desain Grafis, Fotografi, Penulisan Konten). |
| **3** | Sistem menampilkan layar ketersediaan. Mahasiswa mengatur jam mingguan menggunakan slider, memilih bidang minat melalui kotak centang, menulis bio singkat, lalu mengetuk "Simpan Profil." |
| **4** | Sistem menampilkan layar pengenalan Kuis Kesiapan. Mahasiswa mengetuk "Mulai Kuis." Sistem menampilkan pertanyaan pertama dengan empat pilihan jawaban. |
| **5** | Mahasiswa menjawab semua 5 pertanyaan. Sistem menghitung skor dan menampilkan layar hasil dengan persentase, grafik breakdown di empat kategori, dan rekomendasi personal. |
| **6** | Mahasiswa mengetuk "Jelajahi Proyek." Sistem menampilkan Micro-Gig Board dengan kartu proyek. Mahasiswa memfilter berdasarkan kategori "Desain Grafis." |
| **7** | Mahasiswa mengetuk kartu proyek. Sistem menampilkan detail proyek lengkap: brief klien, anggaran, tenggat, persyaratan, dan rating klien. |
| **8** | Mahasiswa mengetuk "Kirim Proposal." Sistem menampilkan formulir proposal. Mahasiswa menulis pendekatan pengerjaan, mengunggah sampel portofolio, mengkonfirmasi harga, dan mengetuk "Kirim." |
| **9** | Sistem menampilkan pesan konfirmasi: "Proposal Terkirim!" dan menambahkan proyek ke tab Proyek Saya mahasiswa dengan status "Menunggu." |

#### Decision Points

| Decision Point | YES / Success path | NO / Error path |
|----------------|-------------------|-----------------|
| **Skor kesiapan ≥50%?** | Mahasiswa melihat "Siap untuk micro-gig" dan langsung diarahkan ke Gig Board. | Mahasiswa melihat "Terus berlatih" dengan rekomendasi Jalur Belajar spesifik sebelum dapat menelusuri proyek. |
| **Sampel portofolio diunggah dalam proposal?** | Proposal berhasil dikirim dan muncul di kotak masuk UMKM. | Sistem menampilkan: "Tambahkan minimal satu sampel untuk memperkuat proposal Anda" dan memblokir pengiriman hingga file terlampir. |
| **Profil lengkap sebelum menelusuri Gig Board?** | Mahasiswa dapat langsung mengakses Gig Board dan mengirim proposal. | Sistem menampilkan peringatan: "Lengkapi profil Anda terlebih dahulu agar klien dapat mengenal kemampuan Anda." |

#### Edge Cases

| Edge Case | What the system must do |
|-----------|--------------------------|
| **Mahasiswa menutup aplikasi di tengah kuis.** | Sistem menyimpan progres per pertanyaan. Saat kembali, mahasiswa melanjutkan dari pertanyaan terakhir yang dijawab; timer tidak direset. |
| **Tidak ada proyek yang cocok dengan filter keterampilan mahasiswa.** | Sistem menampilkan: "Belum ada proyek di kategori ini. Coba jelajahi semua kategori atau kembali lagi nanti." disertai pintasan "Hapus filter." |
| **UMKM sudah menerima proposal lain untuk proyek yang sama.** | Sistem memperbarui status proyek menjadi "Ditutup" dan mengirimkan notifikasi kepada semua mahasiswa yang telah mengirimkan proposal atau menyimpan proyek tersebut. |
| **Mahasiswa mengirim proposal untuk proyek yang sudah melewati tenggat posting.** | Sistem memblokir pengiriman dan menampilkan: "Proyek ini sudah tidak menerima proposal. Cari proyek lain yang masih terbuka." |
| **Koneksi internet terputus saat mengisi formulir proposal.** | Sistem menyimpan draf proposal secara lokal dan menampilkan banner: "Draf tersimpan. Sambungkan kembali untuk mengirimkan." Data tidak hilang. |

---

### 6.2 Workflow: Pemilik UMKM — Memposting & Mengelola Proyek

| **Actor** | Pemilik UMKM |
|-----------|--------------|
| **Goal** | Memposting proyek micro-gig, menerima dan meninjau proposal, lalu menandai proyek selesai. |
| **FRs covered** | FR-011, FR-012, FR-013, FR-014, FR-015, FR-016 |

#### Ideal Path

| # | Step description |
|---|------------------|
| **1** | UMKM mengetuk "Posting Proyek Baru" dari dashboard mereka. Sistem menampilkan Quick Brief Form. |
| **2** | UMKM memasukkan judul proyek, memilih kategori dari dropdown, dan menulis deskripsi kebutuhan di area teks. |
| **3** | UMKM mengisi anggaran (Rp) dan memilih tenggat dari pemilih tanggal. UMKM memilih keterampilan yang dibutuhkan dari tag multi-pilih. |
| **4** | UMKM mengetuk "Pratinjau." Sistem menampilkan ringkasan brief proyek persis sebagaimana yang akan dilihat mahasiswa di Gig Board. |
| **5** | UMKM mengetuk "Posting Proyek." Sistem mempublikasikan gig ke Micro-Gig Board dan menampilkan layar konfirmasi beserta tautan langsung ke proyek. |
| **6** | Saat mahasiswa mengirimkan proposal, sistem mengirimkan notifikasi ke UMKM. UMKM membuka tab Proposal Masuk, meninjau setiap proposal, dan mengetuk "Terima" pada pilihan terbaik. |
| **7** | Setelah mahasiswa menyerahkan hasil kerja final, UMKM meninjau hasilnya. Jika puas, UMKM mengetuk "Tandai Selesai." Sistem meminta testimoni singkat. |
| **8** | UMKM menulis testimoni dan mengkonfirmasi. Sistem memperbarui status proyek, mengirimkan notifikasi kepada mahasiswa, dan memicu Portfolio Builder untuk membuat entri portofolio secara otomatis. |

#### Decision Points

| Decision Point | YES / Success path | NO / Error path |
|----------------|-------------------|-----------------|
| **Semua field wajib terisi?** | Tombol Pratinjau menjadi aktif dan UMKM dapat melanjutkan ke langkah berikutnya. | Sistem menyoroti field kosong yang wajib dengan garis merah dan pesan: "Harap lengkapi semua field wajib." |
| **Testimoni diisi saat penyelesaian?** | Proyek ditandai selesai; entri portofolio lengkap (dengan testimoni) dihasilkan untuk mahasiswa. | Sistem menerima penyelesaian tanpa testimoni namun menampilkan prompt opsional: "Testimoni membantu mahasiswa membangun portofolio mereka." |
| **UMKM menerima proposal yang sudah ada?** | Proposal diterima dan status proyek diperbarui menjadi "Dalam Proses." | Sistem meminta konfirmasi sebelum mengubah pilihan jika UMKM ingin mengganti proposal yang sudah diterima sebelumnya. |

#### Edge Cases

| Edge Case | What the system must do |
|-----------|--------------------------|
| **UMKM memasukkan anggaran di bawah Rp10.000.** | Sistem menampilkan peringatan: "Proyek dengan anggaran di bawah Rp10.000 kemungkinan mendapat lebih sedikit proposal. Pertimbangkan untuk menaikkan anggaran." Posting tidak diblokir. |
| **UMKM ingin mengedit proyek setelah posting namun sebelum ada proposal masuk.** | Sistem mengizinkan pengeditan deskripsi, anggaran, dan tenggat. Setelah ada proposal masuk, semua field dikunci; UMKM harus membatalkan proyek untuk membuat perubahan. |
| **Tidak ada proposal diterima dalam 5 hari setelah posting.** | Sistem mengirimkan notifikasi kepada UMKM: "Belum ada proposal. Coba sesuaikan anggaran atau kategori untuk menarik lebih banyak mahasiswa." |
| **UMKM membatalkan proyek setelah menerima proposal dari mahasiswa.** | Sistem meminta konfirmasi pembatalan dan mengirimkan notifikasi kepada mahasiswa yang proposalnya sudah diterima, disertai permintaan maaf otomatis dari platform. |
| **Mahasiswa tidak menyerahkan hasil kerja sesuai tenggat.** | Sistem mengirimkan pengingat kepada mahasiswa H-1 dan H tenggat. Jika tenggat terlampaui tanpa penyerahan, UMKM dapat menandai proyek sebagai bermasalah untuk ditinjau. |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| v0.1 | 18 Mei 2026 | All | Initial draft |

---

**© 2026 SkillGate — Sleman, Yogyakarta**