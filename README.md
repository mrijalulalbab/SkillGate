# SkillGate 🎓💼

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**SkillGate** adalah ekosistem digital berbasis web yang dirancang khusus untuk menjembatani kesenjangan struktural antara mahasiswa aktif di Yogyakarta (khususnya wilayah Sleman) dengan pelaku UMKM (*Usaha Mikro, Kecil, dan Menengah*) lokal melalui model proyek kerja mikro (*micro-gig*) yang aman, transparan, dan terpercaya.

Platform ini dikembangkan sebagai Proyek Tugas Besar untuk mata kuliah **Pengembangan Sistem Informasi (PSI)**, Program Studi Informatika, Fakultas Teknologi Industri, **Universitas Islam Indonesia (UII)**.

---

## 🚀 Fitur Utama

Sistem informasi SkillGate mengintegrasikan berbagai modul fungsional canggih:

1. **Bento-Grid Dashboard (Multi-Peran)**: Dashboard visual yang modular dan responsif untuk Mahasiswa (`/dashboard/student`) dan UMKM (`/dashboard/umkm`) untuk memantau status operasional secara terpusat.
2. **Modul Asesmen & Kuis Kesiapan Kerja**: Kuis studi kasus dinamis untuk menguji etika komunikasi dan kerja profesional mahasiswa, menghasilkan skor kesiapan (0-100%) sebelum diperbolehkan melamar proyek.
3. **Papan Lowongan Kerja (Gigs Board)**: Portal pencarian tugas mikro digital (desain grafis, data entry, penulisan konten, fotografi) lengkap dengan penyaringan kategori dan pencarian.
4. **Smart Match Recommendation (DSS)**: Perhitungan persentase kecocokan pelamar secara otomatis menggunakan kriteria bobot (Keahlian 40%, Kesiapan 35%, Rating Kinerja 25%) guna membantu UMKM merekrut talenta terbaik.
5. **SPK Kontrak Kerja Digital Otomatis**: Surat Perjanjian Kerja (SPK) digital yang dibuat otomatis menggunakan parameter data proyek dan tanda tangan kriptografis untuk kepastian hukum.
6. **Simulasi Rekening Bersama (Escrow)**: Jaminan keamanan transaksi di mana dana UMKM dikunci oleh sistem saat proyek dimulai dan dicairkan otomatis saat pekerjaan disetujui.
7. **Real-time Chat Collaboration**: Ruang diskusi interaktif langsung di dalam ruang kerja proyek menggunakan Supabase Realtime Channels.
8. **Portofolio Dinamis & AI Resume Summary**: Penyusunan portofolio otomatis berdasarkan proyek selesai dan generator draf deskripsi CV profesional menggunakan integrasi LLM (Google Gemini API).

---

## 🛠️ Stack Teknologi

* **Framework Utama**: Next.js 16.2 (React 19, App Router)
* **Compiler**: Turbopack (kecepatan bundling cepat)
* **Styling**: Tailwind CSS v4 & Lucide React (ikon)
* **Bahasa**: TypeScript (keamanan tipe data ketat)
* **Database & Layanan Cloud**:
  - **Supabase Auth**: Autentikasi sesi JWT terenkripsi aman
  - **Supabase PostgreSQL**: Database relasional transaksional ACID
  - **Supabase Realtime**: Obrolan instan sinkron
* **Kecerdasan Buatan (AI)**: Vercel AI SDK & Google AI Studio (Gemini 1.5 Pro)

---

## 💻 Panduan Menjalankan Proyek Secara Lokal

Ikuti langkah-langkah berikut untuk menjalankan prototipe pengembangan di komputer lokal Anda:

### 1. Prasyarat (*Prerequisites*)
Pastikan Anda sudah menginstal:
* [Node.js](https://nodejs.org/) v20 atau versi di atasnya.
* [Git](https://git-scm.com/).

### 2. Kloning Repositori
```bash
git clone https://github.com/mrijalulalbab/SkillGate.git
cd SkillGate
```

### 3. Instalasi Dependensi
Instal semua modul pustaka yang dibutuhkan:
```bash
npm install
```

### 4. Konfigurasi Variabel Lingkungan (*Environment Variables*)
Buat berkas bernama `.env.local` di direktori utama proyek, lalu isi kredensial Supabase & API Gemini Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
```

### 5. Jalankan Server Pengembangan
Aktifkan server lokal Next.js:
```bash
npm run dev
```
Buka browser Anda dan akses: **`http://localhost:3000`**

---

## 🔑 Akun Kredensial untuk Pengujian (Testing Accounts)

Gunakan akun siap pakai berikut di halaman login (`/login`) untuk menguji seluruh fitur platform:

| Peran (Role) | Email / Username | Sandi (Password) | Hak Akses Fitur |
|---|---|---|---|
| **Admin** | `admin@skillgate.com` | `password123` | Dashboard verifikasi UMKM, moderasi proyek, monitoring transaksi keuangan. |
| **UMKM (Darmi)** | `darmi@batiksleman.com` | `password123` | Memposting proyek, live preview, rekrutmen DSS, deposit escrow, tanda tangan SPK, chat, review. |
| **Mahasiswa (Andi)** | `andi@student.uii.ac.id` | `password123` | Mencari proyek, kirim proposal, pengerjaan proyek aktif, chatting, unduh portofolio AI (3 proyek selesai). |
| **Mahasiswa (Anto)** | `anto@student.uii.ac.id` | `password123` | Akun mahasiswa bersih terverifikasi untuk simulasi pengerjaan dari awal. |

---

## 👥 Anggota Kelompok Pengembang

Proyek ini dirancang dan dikembangkan oleh **Kelompok 2 - Kelas E - FTI UII**:

* **Muhammad Rijalul Albab** (NIM: 24523001) - *Project Lead & Backend Engineer*
* **Rifqi Aunnur Rohman** (NIM: 24523063) - *UI/UX Designer & Frontend Engineer*
* **Muhammad Farhan Yusuf Azizi** (NIM: 24523003) - *Research & Database Administrator*
* **Jawara** (NIM: 24523004) - *Content & Quality Assurance*
* **Naila Reyhantyas Nurkhalisha** (NIM: 24523050) - *Digital Prototyper & Docs Strategist*

---
**© 2026 Kelompok 2 Nexus — Universitas Islam Indonesia**
