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

## 💻 Petunjuk Teknis & Panduan Instalasi Sistem

Ikuti panduan terstruktur di bawah ini untuk mereplikasi dan menjalankan aplikasi SkillGate secara lokal dari awal:

### 1. Prasyarat Sistem (*Prerequisites*)
Pastikan komputer Anda sudah terinstal:
*   [Node.js](https://nodejs.org/) (Sangat direkomendasikan versi LTS v20.x atau di atasnya).
*   [Git](https://git-scm.com/) (Untuk manajemen repositori).
*   Akun gratis di platform [Supabase Cloud](https://supabase.com/) dan [Google AI Studio](https://aistudio.google.com/) (untuk mendapatkan kunci akses Gemini API).

### 2. Kloning & Instalasi Dependensi
Jalankan perintah berikut di terminal/command prompt:
```bash
# 1. Kloning repositori GitHub
git clone https://github.com/mrijalulalbab/SkillGate.git

# 2. Masuk ke direktori proyek
cd SkillGate

# 3. Instalasi seluruh paket pustaka (dependencies)
npm install
```

### 3. Inisialisasi Database (Supabase PostgreSQL)
Aplikasi ini bergantung pada database relasional Supabase. Lakukan langkah berikut untuk menginisialisasi skema tabel:
1.  Buka dashboard [Supabase](https://supabase.com/) dan buat proyek baru (*Create New Project*).
2.  Setelah proyek siap, masuk ke menu **SQL Editor** pada menu sidebar kiri dashboard Supabase.
3.  Klik **New Query**, kemudian buka berkas skema fisik database lokal Anda di:  
    `supabase/migrations/20260619234322_init_schema.sql`
4.  Salin seluruh kode DDL SQL di dalam berkas tersebut, lalu tempel (*paste*) ke dalam SQL Editor Supabase Dashboard, kemudian klik **Run**.
    > [!NOTE]
    > Langkah ini secara otomatis membuat semua tabel (`users`, `student_profiles`, `umkm_profiles`, `gigs`, `applications`, `messages`, `reviews`, `notifications`), relasi referensial, custom triggers, fungsi, serta kebijakan Row Level Security (RLS).

### 4. Konfigurasi Autentikasi (Bypass Verifikasi Email)
Secara bawaan, Supabase mewajibkan verifikasi email nyata untuk pendaftaran akun baru. Agar Anda mudah melakukan demo pendaftaran mahasiswa dan UMKM baru tanpa perlu memverifikasi kotak masuk email:
1.  Buka dashboard Supabase Anda.
2.  Buka menu **Project Settings ➔ Authentication** (atau menu **Authentication ➔ Providers**).
3.  Di bawah bagian **Email Provider**, cari opsi **Confirm email**, lalu matikan (*disable*) toggle tersebut.
4.  Klik **Save** untuk menyimpan perubahan.

### 5. Konfigurasi Variabel Lingkungan (`.env.local`)
1.  Buat berkas baru bernama **`.env.local`** di direktori utama proyek (*workspace root*).
2.  Salin variabel berikut dan masukkan kredensial proyek Supabase serta Google Gemini API Anda:
    ```env
    # URL database Supabase Anda (Bisa disalin dari Settings -> API di Dashboard Supabase)
    NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
    
    # API Anon Key Supabase Anda
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    
    # Kunci API Google Gemini (Bisa didapatkan dari Google AI Studio)
    GEMINI_API_KEY=your-gemini-api-key
    ```

### 6. Menjalankan Server Aplikasi
Setelah konfigurasi selesai, jalankan server pengembangan Next.js lokal:
```bash
npm run dev
```
Setelah siap, buka browser web Anda dan akses: **`http://localhost:3000`**

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
