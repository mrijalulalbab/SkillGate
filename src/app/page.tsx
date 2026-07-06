"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Users, Store, PieChart, School, Search, Briefcase, 
  CheckCircle2, Quote, ArrowRight, Sparkles, Zap, 
  ShieldCheck, ArrowUpRight, GraduationCap
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen text-slate-800 bg-[#f8fafc] selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="flex-grow pt-16">
        
        {/* HERO SECTION (Premium Light & Mesh Gradient) */}
        <section className="relative py-28 md:py-36 px-4 overflow-hidden border-b border-slate-200/40 bg-gradient-to-br from-indigo-50/40 via-white to-blue-50/20">
          {/* Abstract Radial Glows */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full bg-primary/10 blur-[80px] md:blur-[140px] pointer-events-none animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-secondary/10 blur-[70px] md:blur-[120px] pointer-events-none animate-pulse-slow"></div>
          
          {/* Grid Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.012)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-left animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pemberdayaan Digital Sleman</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-slate-900">
                Jembatan Karier <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-600 to-indigo-600">
                  Mahasiswa & UMKM
                </span>
              </h1>

              <p className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed font-medium">
                SkillGate membantu mahasiswa Sleman membangun portofolio riil, meraih pendapatan mandiri, dan mendorong UMKM lokal berkembang secara digital melalui proyek berskala mikro (*micro-gigs*).
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-primary to-[#6e44ff] text-white hover:opacity-95 text-base font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                >
                  Mulai Sekarang <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-base font-semibold px-8 py-4 rounded-xl shadow-sm transition-all"
                >
                  Pelajari Alur Kerja
                </a>
              </div>
            </div>
            
            {/* Right Visual (Interactive Dashboard UI Preview Mockup - Light Glass) */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl blur-2xl opacity-70 -z-10"></div>
              
              {/* Glassmorphic Mockup Frame */}
              <div className="bg-white/80 border border-slate-200/80 p-6 rounded-3xl shadow-xl backdrop-blur-xl space-y-6 animate-float">
                {/* Header Mockup */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">SkillGate Control Center</span>
                </div>

                {/* Dashboard Stats Preview */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Skor Kesiapan</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-primary">88%</span>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md">+5%</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Pendapatan</span>
                    <span className="text-xl font-bold text-slate-800">Rp 1,25jt</span>
                  </div>
                </div>

                {/* Active Task Preview */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">Desain Katalog Digital</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Batik Sleman Asri</p>
                    </div>
                    <span className="text-[10px] bg-secondary/15 text-secondary px-2 py-0.5 rounded-md font-bold">IN PROGRESS</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                      <span>Progress</span>
                      <span>85% selesai</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-secondary h-full rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS BANNER */}
        <section className="max-w-[1280px] mx-auto px-4 -mt-10 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Card 1 */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:-translate-y-1 hover:border-primary/30 transition-all duration-300">
              <div className="bg-primary/5 p-4 rounded-xl text-primary border border-primary/10">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">256K+</div>
                <div className="text-xs font-semibold text-slate-500">Potensi Mahasiswa Sleman</div>
              </div>
            </div>
            
            {/* Stat Card 2 */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:-translate-y-1 hover:border-secondary/30 transition-all duration-300">
              <div className="bg-secondary/5 p-4 rounded-xl text-secondary border border-secondary/10">
                <Store className="w-7 h-7" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">110K+</div>
                <div className="text-xs font-semibold text-slate-500">Target UMKM Sleman</div>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:-translate-y-1 hover:border-amber-500/30 transition-all duration-300">
              <div className="bg-amber-500/5 p-4 rounded-xl text-amber-500 border border-amber-500/10">
                <PieChart className="w-7 h-7" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">99,8%</div>
                <div className="text-xs font-semibold text-slate-500">Usaha Berbasis Mikro</div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-28 max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">Alur Kolaborasi Pintar</h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium text-sm md:text-base">Mekanisme kerja terintegrasi yang mudah, kredibel, dan aman bagi kedua belah pihak.</p>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white border border-slate-200/60 p-8 rounded-3xl flex flex-col items-center text-center space-y-5 hover:border-primary/20 hover:shadow-md transition-all group">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10 group-hover:rotate-6 transition-transform">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">1. Asesmen Kesiapan</h3>
                <p className="text-slate-500 text-sm leading-relaxed px-2 font-medium">Mahasiswa melengkapi data akademik dan melewati Kuis Asesmen untuk mendapatkan **Skor Kesiapan** sebelum melamar.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200/60 p-8 rounded-3xl flex flex-col items-center text-center space-y-5 hover:border-secondary/20 hover:shadow-md transition-all group">
              <div className="w-16 h-16 bg-secondary/5 rounded-2xl flex items-center justify-center text-secondary border border-secondary/10 group-hover:rotate-6 transition-transform">
                <Zap className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">2. Kirim Penawaran</h3>
                <p className="text-slate-500 text-sm leading-relaxed px-2 font-medium">UMKM memposting brief proyek digital yang dibutuhkan. Mahasiswa memilih lowongan kerja dan mengirimkan proposal bid harga.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-200/60 p-8 rounded-3xl flex flex-col items-center text-center space-y-5 hover:border-emerald-500/20 hover:shadow-md transition-all group">
              <div className="w-16 h-16 bg-emerald-500/5 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-500/10 group-hover:rotate-6 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">3. Proteksi Escrow</h3>
                <p className="text-slate-500 text-sm leading-relaxed px-2 font-medium">Dana ditahan di rekening penjamin (escrow) platform dan dilepas secara adil begitu tugas diserahkan dan dinilai klien.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FOR WHOM */}
        <section id="for-whom" className="py-28 bg-[#f1f5f9] border-y border-slate-200/60">
          <div className="max-w-[1280px] mx-auto px-4">
            
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900">Siapa yang Diuntungkan?</h2>
              <p className="text-slate-500 max-w-xl mx-auto font-medium text-sm">Menyelaraskan kurikulum akademik dengan hilirisasi usaha produktif daerah.</p>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Students Card */}
              <div className="bg-white border border-slate-200/80 p-8 md:p-12 rounded-3xl shadow-sm flex flex-col justify-between hover:border-primary/20 hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 flex items-center gap-2">
                    <GraduationCap className="w-8 h-8 text-primary" />
                    Untuk Mahasiswa
                  </h3>
                  <ul className="space-y-6">
                    {[
                      { title: "Portofolio Kerja Nyata", desc: "Bangun bukti portofolio digital yang dinilai langsung oleh klien nyata, bukan hanya proyek kelas simulasi." },
                      { title: "Kemandirian Keuangan", desc: "Dapatkan komisi yang kompetitif dan aman berkat sistem pembayaran escrow SkillGate." },
                      { title: "Modul & Mentor Gratis", desc: "Akses jalur pembelajaran MOOC gratis dan jadwalkan bimbingan langsung dengan dosen/mentor industri." }
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full shrink-0 text-primary">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block text-base mb-1">{item.title}</span>
                          <p className="text-sm font-medium text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-12 pt-6 border-t border-slate-100 relative z-10">
                  <Link href="/register/mahasiswa" className="inline-flex items-center text-primary font-bold hover:underline gap-1.5 group/link text-sm">
                    Daftar Sebagai Mahasiswa <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* MSMEs Card */}
              <div className="bg-white border border-slate-200/80 p-8 md:p-12 rounded-3xl shadow-sm flex flex-col justify-between hover:border-emerald-500/20 hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 flex items-center gap-2">
                    <Store className="w-8 h-8 text-emerald-500" />
                    Untuk Mitra UMKM
                  </h3>
                  <ul className="space-y-6">
                    {[
                      { title: "Hemat Anggaran Promosi", desc: "Dapatkan akses jasa desain feed, foto produk, dan kepenulisan sosial media berkualitas dengan biaya lokal bersahabat." },
                      { title: "Jaminan Kualitas Mahasiswa", desc: "Tinjau lamaran mahasiswa berdasarkan skor kesiapan kerja (*Readiness Score*) yang teruji objektif." },
                      { title: "Dukungan Ekonomi Lokal", desc: "Membantu menumbuhkan ekosistem ekonomi digital mahasiswa lokal di wilayah Kabupaten Sleman." }
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="bg-emerald-500/10 p-2 rounded-full shrink-0 text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block text-base mb-1">{item.title}</span>
                          <p className="text-sm font-medium text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-12 pt-6 border-t border-slate-100 relative z-10">
                  <Link href="/register/umkm" className="inline-flex items-center text-emerald-500 font-bold hover:underline gap-1.5 group/link text-sm">
                    Daftar Sebagai Mitra UMKM <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-28 max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">Kisah Sukses Dampak Nyata</h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium text-sm">Cerita kolaborator kami yang tumbuh bersama ekosistem SkillGate.</p>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testi 1 */}
            <div className="bg-white border border-slate-200/80 p-8 rounded-3xl flex flex-col justify-between hover:border-primary/20 hover:shadow-md transition-all duration-300">
              <div>
                <Quote className="w-8 h-8 text-primary/20 mb-6" />
                <p className="italic text-slate-600 text-lg font-medium mb-8 leading-relaxed">
                  &quot;Berkat kuis kesiapan kerja dan ulasan dari pemilik Batik Sleman, portofolio saya dinilai sangat baik dan langsung mengantarkan saya diterima magang sebelum lulus.&quot;
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-primary/10 flex items-center justify-center font-bold text-primary">
                  AS
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-base">Andi Setiawan</div>
                  <div className="text-xs font-semibold text-slate-500">Mahasiswa Informatika UII (Sleman)</div>
                </div>
              </div>
            </div>

            {/* Testi 2 */}
            <div className="bg-white border border-slate-200/80 p-8 rounded-3xl flex flex-col justify-between hover:border-secondary/20 hover:shadow-md transition-all duration-300">
              <div>
                <Quote className="w-8 h-8 text-secondary/20 mb-6" />
                <p className="italic text-slate-600 text-lg font-medium mb-8 leading-relaxed">
                  &quot;Awalnya ragu mempekerjakan mahasiswa, tapi asisten admin TikTok yang direkrut dari SkillGate sangat profesional. Akun toko kami bertumbuh 2x lipat hanya dalam sebulan.&quot;
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-secondary/10 flex items-center justify-center font-bold text-secondary">
                  DS
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-base">Ibu Darmi Sulistyo</div>
                  <div className="text-xs font-semibold text-slate-500">Pemilik Batik Sleman Asri</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER (Glowing Light Gradient Banner) */}
        <section className="max-w-[1280px] mx-auto px-4 pb-28">
          <div className="relative bg-gradient-to-r from-primary to-[#6e44ff] p-12 md:p-20 rounded-[2.5rem] text-center space-y-8 overflow-hidden shadow-xl shadow-primary/10">
            {/* Background SVG wave for texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg fill="none" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 100C100 0 200 200 300 100S500 0 600 100" stroke="white" strokeWidth="3"></path>
                <path d="M0 150C100 50 200 250 300 150S500 50 600 150" stroke="white" strokeWidth="3"></path>
              </svg>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white relative z-10 leading-tight">
              Siap Mengakselerasi Potensi Digital?
            </h2>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed relative z-10 font-medium">
              Mari bergabung bersama ribuan mahasiswa aktif Sleman dan mitra bisnis UMKM setempat untuk memperkuat daya saing ekonomi kreatif digital.
            </p>
            <div className="flex justify-center relative z-10 mt-10">
              <Link href="/login" className="inline-flex items-center justify-center bg-white text-primary hover:bg-slate-50 text-base font-bold px-10 py-5 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95">
                Gabung Sekarang <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
