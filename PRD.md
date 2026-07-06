# PRODUCT REQUIREMENTS DOCUMENT

## SkillGate

**Platform Web Mobile-Responsive — Penghubung Mahasiswa & UMKM untuk Micro-Gig Digital**

**Versi 2 — Technical PRD (Overview, Architecture, Tech Stack, Development Flow)**

---

## Daftar Isi

1. [Overview](#1-overview)
2. [Requirements](#2-requirements)
3. [Core Features](#3-core-features)
4. [User Flow](#4-user-flow)
5. [Architecture](#5-architecture)
6. [Database Schema](#6-database-schema)
7. [Tech Stack](#7-tech-stack)
8. [Design Guidelines](#8-design-guidelines)
9. [Development Process Flow](#9-development-process-flow)

---

## 1. Overview

### 1.1 Ringkasan Produk

SkillGate adalah platform digital berbasis web (mobile-responsive) yang menghubungkan mahasiswa di Kabupaten Sleman dengan UMKM lokal untuk pengerjaan micro-gig di bidang digital — seperti desain grafis, fotografi produk, penulisan konten, dan pengelolaan media sosial.

Platform ini berfungsi sebagai **marketplace dua sisi (two-sided marketplace)** yang memungkinkan mahasiswa membangun portofolio nyata sembari membantu UMKM melakukan transformasi digital dengan biaya terjangkau.

### 1.2 Latar Belakang Singkat

Sleman memiliki populasi mahasiswa terbesar di DIY (256.208 mahasiswa) dan 110.399 UMKM, namun kedua kelompok ini tidak memiliki kanal terstruktur untuk saling terhubung. Mahasiswa kesulitan mendapat pengalaman kerja nyata, sementara UMKM kesulitan mengakses talenta digital yang terjangkau dan terpercaya. SkillGate dibangun untuk menjembatani kesenjangan ini.

### 1.3 Target Pengguna

| Jenis Pengguna | Peran di Platform |
|----------------|-------------------|
| **Mahasiswa (Talent)** | Membuat profil/portofolio, melamar gig, mengerjakan proyek, membangun reputasi |
| **Pemilik UMKM (Client)** | Memposting gig, memilih talent, memberikan brief, melakukan pembayaran & rating |
| **Admin Platform** | Moderasi konten, verifikasi pengguna, monitoring transaksi |

### 1.4 Tujuan Produk (MVP)

- Menyediakan marketplace gig digital yang sederhana dan rendah-risiko bagi mahasiswa pemula.
- Memberi UMKM akses mudah ke talenta lokal terpercaya tanpa biaya agensi.
- Membangun riwayat portofolio & reputasi terverifikasi untuk setiap mahasiswa.
- Platform ringan, cepat diakses dari mobile browser (karena mayoritas UMKM & mahasiswa mobile-first).

---

## 2. Requirements

### 2.1 Functional Requirements

#### Mahasiswa (Talent)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Registrasi & verifikasi akun (email kampus / NIM) | **Must** |
| FR-02 | Membuat & mengedit profil portofolio (skill, contoh karya, CV ringkas) | **Must** |
| FR-03 | Mencari & memfilter gig berdasarkan kategori, lokasi, budget | **Must** |
| FR-04 | Mengajukan lamaran (apply) ke gig dengan pesan singkat | **Must** |
| FR-05 | Chat dengan UMKM setelah lamaran diterima | **Must** |
| FR-06 | Menandai gig selesai & menerima rating/ulasan | **Must** |
| FR-07 | Melihat riwayat gig dan reputasi (rating rata-rata) | **Should** |
| FR-08 | Notifikasi status lamaran/gig (in-app) | **Should** |

#### Pemilik UMKM (Client)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-09 | Registrasi & verifikasi akun usaha (nama usaha, kontak, lokasi) | **Must** |
| FR-10 | Memposting gig baru (judul, deskripsi, kategori, budget, deadline) | **Must** |
| FR-11 | Melihat & menyeleksi daftar pelamar gig | **Must** |
| FR-12 | Menerima/menolak pelamar, lalu chat dengan talent terpilih | **Must** |
| FR-13 | Menandai gig selesai & memberi rating/ulasan ke talent | **Must** |
| FR-14 | Melihat riwayat gig yang pernah diposting | **Should** |

#### Admin

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-15 | Moderasi & verifikasi akun baru (mahasiswa & UMKM) | **Must** |
| FR-16 | Menghapus/menangguhkan konten atau akun yang melanggar | **Should** |
| FR-17 | Dashboard ringkas: jumlah user, gig aktif, transaksi | **Could** |

### 2.2 Non-Functional Requirements

- **Responsive** di semua ukuran layar (mobile-first, breakpoint utama: 375px, 768px, 1280px).
- **Waktu load** halaman awal < 3 detik pada koneksi 4G rata-rata.
- **Keamanan** data pengguna sesuai standar dasar (hashed password via Supabase Auth, RLS aktif di semua tabel).
- **Aksesibilitas** dasar: kontras warna cukup, label form jelas, dapat dioperasikan via keyboard.
- **Skalabilitas**: arsitektur mendukung pertumbuhan dari puluhan ke ribuan pengguna tanpa migrasi besar.

---

## 3. Core Features

### 3.1 Modul MVP

| Modul | Deskripsi Singkat |
|-------|-------------------|
| **Autentikasi & Profil** | Login/register terpisah untuk Mahasiswa & UMKM, lengkapi profil & portofolio |
| **Gig Listing** | UMKM posting gig; mahasiswa browse & filter (kategori, lokasi, budget) |
| **Aplikasi & Seleksi** | Mahasiswa apply ke gig; UMKM review & pilih talent |
| **Chat** | Komunikasi 1:1 antara UMKM & talent setelah match |
| **Penyelesaian Gig & Rating** | Tandai gig selesai, beri & terima rating/ulasan |
| **Notifikasi** | Notifikasi in-app untuk status lamaran, pesan baru, gig selesai |
| **Admin Panel (ringan)** | Verifikasi user & moderasi dasar |

### 3.2 Di Luar Scope MVP (Fase Berikutnya)

- Payment gateway terintegrasi (escrow) — MVP cukup status pembayaran manual/konfirmasi.
- Aplikasi mobile native (Android/iOS) — fokus dulu ke web responsive.
- Sistem rekomendasi gig berbasis AI/matching otomatis.
- Integrasi dengan sistem kampus (SIM Akademik) untuk verifikasi otomatis.

---

## 4. User Flow

### 4.1 Flow Utama: Mahasiswa Mendapatkan Gig

1. Mahasiswa membuka landing page → klik "Daftar sebagai Mahasiswa".
2. Registrasi (email/NIM) → verifikasi → lengkapi profil & portofolio.
3. Browse daftar gig → filter berdasarkan kategori/lokasi/budget.
4. Pilih gig → baca detail → klik "Apply" + kirim pesan singkat.
5. Menunggu respons UMKM (status: pending).
6. Jika diterima → chat terbuka otomatis dengan UMKM untuk koordinasi.
7. Mahasiswa mengerjakan gig → submit hasil/laporan via chat.
8. UMKM menandai gig selesai → memberi rating & ulasan.
9. Mahasiswa menerima rating → tampil di profil sebagai riwayat portofolio.

### 4.2 Flow Utama: UMKM Memposting Gig

1. UMKM registrasi & verifikasi akun usaha.
2. Klik "Posting Gig Baru" → isi judul, deskripsi, kategori, budget, deadline.
3. Gig tayang di listing → menerima lamaran masuk.
4. Review profil pelamar → pilih satu talent → terima lamaran.
5. Chat dengan talent terpilih untuk briefing detail.
6. Setelah hasil diterima → tandai gig selesai → beri rating.

### 4.3 Decision Points & Edge Case

| Skenario | Penanganan |
|----------|------------|
| Tidak ada pelamar dalam X hari | Sistem kirim reminder ke UMKM untuk revisi gig |
| Mahasiswa membatalkan gig di tengah jalan | Status gig kembali "open", riwayat dicatat |
| UMKM tidak merespons lamaran | Auto-expire lamaran setelah periode tertentu |

---

## 5. Architecture

### 5.1 Gambaran Umum

Arsitektur SkillGate menggunakan pendekatan **monolithic-modern** yang ringan: satu aplikasi Next.js menangani frontend dan backend (API Routes), terhubung langsung ke Supabase sebagai Backend-as-a-Service (BaaS) untuk database, autentikasi, dan storage.

Pendekatan ini dipilih agar tim kecil dapat membangun dan men-deploy cepat tanpa mengelola server/infrastruktur sendiri.

### 5.2 Diagram Lapisan (High-Level)
┌─────────────────────────────────────────────────────────────┐
│ CLIENT (Browser)                                            │
│ Mobile & Desktop - Next.js App Router                       │
│ + Tailwind CSS                                              │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────▼─────────────────────────────────┐
│ APPLICATION LAYER                                           │
│ Vercel / Next.js                                            │
│ - API Routes / Server Actions                               │
│ - Validasi input, business logic                            │
│ - Otorisasi tambahan (selain RLS)                           │
└───────────────────────────┬─────────────────────────────────┘
                            │ Supabase Client SDK / REST
┌───────────────────────────▼─────────────────────────────────┐
│ SUPABASE (BaaS)                                             │
│ - PostgreSQL Database (+ Row Level Security)                │
│ - Auth (Email/Password, OTP)                                │
│ - Storage (foto profil, portofolio, bukti gig)              │
│ - Realtime (notifikasi & chat)                              │
└─────────────────────────────────────────────────────────────┘

### 5.3 Catatan Arsitektur

| Komponen | Pendekatan |
|----------|------------|
| **Read operations** | Client langsung memanggil Supabase via SDK (cepat) |
| **Write/validasi** | Next.js API Route / Server Action (logic terpusat & aman) |
| **Keamanan** | RLS di Supabase: mahasiswa hanya ubah data miliknya, UMKM hanya kelola gig miliknya |
| **Chat & Notifikasi** | Supabase Realtime (subscription langsung dari client) — tidak perlu WebSocket server terpisah |
| **Ekspansi** | Mudah tambah Supabase Edge Function tanpa mengubah arsitektur inti |

---

## 6. Database Schema

Skema awal (MVP) menggunakan PostgreSQL via Supabase. Semua tabel mengaktifkan **Row Level Security (RLS)** .

### 6.1 Tabel Utama

#### `users` (extends Supabase auth.users)

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | uuid (PK) | Referensi ke auth.users.id |
| `role` | text | 'mahasiswa' \| 'umkm' \| 'admin' |
| `full_name` | text | Nama lengkap |
| `phone` | text | Nomor kontak |
| `avatar_url` | text | Link foto profil (Supabase Storage) |
| `created_at` | timestamptz | Default now() |

#### `student_profiles`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `user_id` | uuid (FK → users.id) | Relasi ke akun mahasiswa |
| `nim` | text | Nomor induk mahasiswa |
| `university` | text | Nama kampus |
| `skills` | text[] | Daftar skill (desain, foto, dll) |
| `bio` | text | Deskripsi singkat |
| `portfolio_links` | text[] | Link portofolio eksternal (opsional) |
| `rating_avg` | numeric | Rata-rata rating, default 0 |

#### `umkm_profiles`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `user_id` | uuid (FK → users.id) | Relasi ke akun UMKM |
| `business_name` | text | Nama usaha |
| `category` | text | Kategori usaha |
| `address` | text | Alamat / lokasi |
| `rating_avg` | numeric | Rata-rata rating, default 0 |

#### `gigs`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | uuid (PK) | ID gig |
| `umkm_id` | uuid (FK → users.id) | Pemilik gig |
| `title` | text | Judul gig |
| `description` | text | Deskripsi/brief pekerjaan |
| `category` | text | Kategori (desain, foto, konten, dll) |
| `budget` | numeric | Estimasi budget (Rp) |
| `deadline` | date | Tenggat waktu |
| `status` | text | 'open' \| 'in_progress' \| 'completed' \| 'cancelled' |
| `created_at` | timestamptz | Default now() |

#### `applications`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | uuid (PK) | ID lamaran |
| `gig_id` | uuid (FK → gigs.id) | Gig yang dilamar |
| `student_id` | uuid (FK → users.id) | Mahasiswa pelamar |
| `message` | text | Pesan lamaran singkat |
| `status` | text | 'pending' \| 'accepted' \| 'rejected' |
| `created_at` | timestamptz | Default now() |

#### `messages`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | uuid (PK) | ID pesan |
| `gig_id` | uuid (FK → gigs.id) | Konteks gig terkait |
| `sender_id` | uuid (FK → users.id) | Pengirim pesan |
| `content` | text | Isi pesan |
| `created_at` | timestamptz | Default now() |

#### `reviews`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | uuid (PK) | ID ulasan |
| `gig_id` | uuid (FK → gigs.id) | Gig yang diulas |
| `reviewer_id` | uuid (FK → users.id) | Pemberi ulasan |
| `reviewee_id` | uuid (FK → users.id) | Penerima ulasan |
| `rating` | int | 1–5 |
| `comment` | text | Komentar (opsional) |
| `created_at` | timestamptz | Default now() |

### 6.2 Relasi Singkat
users 1---1 student_profiles (jika role = mahasiswa)
users 1---1 umkm_profiles (jika role = umkm)
users 1---N gigs (sebagai pemilik gig/umkm)
gigs 1---N applications
applications N---1 users (mahasiswa)
gigs 1---N messages
gigs 1---N reviews

---

## 7. Tech Stack

| Layer | Teknologi | Alasan Pemilihan |
|-------|-----------|------------------|
| **Frontend** | Next.js (App Router) + Tailwind CSS | Satu framework untuk web responsive, SSR/SEO bagus, mudah di-generate AI |
| **Backend** | Next.js API Routes / Server Actions | Tidak perlu server terpisah; logic bisnis cukup di layer yang sama |
| **Database** | Supabase (PostgreSQL) | Managed Postgres + RLS bawaan, cocok untuk marketplace |
| **Autentikasi** | Supabase Auth | Email/password & OTP siap pakai, terintegrasi langsung dengan DB |
| **Storage** | Supabase Storage | Untuk foto profil, portofolio, bukti hasil kerja |
| **Realtime** | Supabase Realtime | Chat & notifikasi tanpa server WebSocket terpisah |
| **Hosting Frontend+API** | Vercel | Auto-deploy dari Git, gratis untuk skala MVP |
| **Hosting Database** | Supabase Cloud | Terkelola, gratis untuk skala awal |
| **UI Komponen** | shadcn/ui (opsional) | Komponen siap pakai berbasis Tailwind, mempercepat build UI |

### 7.1 Catatan Tambahan

| Aspek | Spesifikasi |
|-------|-------------|
| **Versi minimum** | Node.js 18+, Next.js 14+ |
| **Package manager** | npm atau pnpm (pnpm lebih cepat) |
| **Environment variables** | Supabase URL & anon key di `.env.local`, tidak di-commit ke repo |
| **Repository** | 1 repository (monorepo sederhana) — frontend & backend menyatu di Next.js |

---

## 8. Design Guidelines

Desain visual (warna, tipografi, layout komponen, mockup halaman) mengacu pada hasil rancangan di Stitch dan akan diisi langsung dari sana.

### Prinsip Dasar

| Prinsip | Deskripsi |
|---------|-----------|
| **Mobile-first** | Rancang dari layar kecil (375px) dulu, baru perbesar ke tablet/desktop |
| **Konsistensi** | Sistem desain dari Stitch — jangan membuat token warna/spacing baru di luar itu |
| **Komponen** | Gunakan komponen Tailwind/shadcn agar selaras dengan tech stack |
| **Aksesibilitas** | Pastikan kontras teks & ukuran tap-target tombol nyaman digunakan di mobile |

### Referensi

- **File Desain**: Stitch (via MCP)
- **Style Guide**: Lihat output Prompt 13 — Konsistensi Sistem & Komponen Global

---

## 9. Development Process Flow

UTAMANYA
FRONTEND
BACKEND
INTEGRATION

### 9.1 Tahapan Pengembangan (MVP)

| # | Tahapan | Deskripsi |
|---|---------|-----------|
| 1 | **Setup proyek** | Inisialisasi Next.js + Tailwind, setup project Supabase, konfigurasi environment |
| 2 | **Desain database** | Skema database & aktifkan RLS dasar untuk setiap tabel |
| 3 | **Autentikasi** | Registrasi/login mahasiswa & UMKM dengan Supabase Auth |
| 4 | **Profil & portofolio** | Form, upload foto via Supabase Storage |
| 5 | **Fitur Gig** | Posting gig (UMKM), listing & filter gig (mahasiswa) |
| 6 | **Fitur Lamaran** | Apply, terima/tolak, status lamaran |
| 7 | **Fitur Chat** | Chat sederhana menggunakan Supabase Realtime |
| 8 | **Penyelesaian & Rating** | Tandai selesai & rating/ulasan |
| 9 | **Notifikasi** | Notifikasi in-app dasar |
| 10 | **Testing** | Functional + responsive check di berbagai ukuran layar |
| 11 | **Deploy** | Deploy ke Vercel (staging → production) |
| 12 | **User Testing** | Testing terbatas dengan mahasiswa & UMKM nyata di Sleman |

### 9.2 Alur Kerja Tim (Disarankan)

| Aspek | Pendekatan |
|-------|------------|
| **Branching** | `main` (production) ← `develop` ← `feature/*` |
| **Review** | Setiap fitur di branch terpisah, merge via pull request setelah review |
| **Preview** | Deploy preview otomatis di Vercel untuk setiap PR |
| **Iterasi** | Mingguan: kumpulkan feedback dari tim/dosen pembimbing, prioritaskan perbaikan |

---

## Revision History

| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| v1 | Mei 2026 | Problem statement, objectives, scope, functional requirements awal |
| v2 | Juni 2026 | Penambahan Overview, Architecture, Database Schema, Tech Stack, Design Guidelines, Development Process Flow |

---

**© 2026 SkillGate — Sleman, Yogyakarta**