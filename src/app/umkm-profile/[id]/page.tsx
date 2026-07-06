"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Star, MapPin, Calendar, Briefcase,
  ExternalLink, MessageSquare, CheckCircle2, Quote, 
  Globe, Mail, Share2, Award, Users, ChevronRight
} from "lucide-react";

// Mock UMKM data
const umkmData: Record<string, {
  name: string;
  logo: string;
  industry: string;
  owner: string;
  location: string;
  joinedDate: string;
  bio: string;
  email: string;
  website: string;
  rating: number;
  totalReviews: number;
  completedGigs: number;
  activeGigs: number;
  satisfactionRate: string;
  historyGigs: {
    id: number;
    title: string;
    category: string;
    budget: string;
    student: string;
    studentAvatar: string;
    rating: number;
    review: string;
    date: string;
  }[];
  activeProjectList: {
    id: number;
    title: string;
    category: string;
    budget: string;
    deadline: string;
  }[];
}> = {
  "1": {
    name: "Batik Sleman Bu Darmi",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1xJkiSjkhsR7Lvz7cxZtY5aMCaT5fYwI3Wl0EsDez7_UFZFXqofnMfWC2UjhmoaubyZnvXO5D3t8-lJJX1FGKtlcjWM0WNvZMYGJvx4EsPGVzmdf6NjvhlWqY1UQADJ4k-OtvnRsP4WxE37ZpeAbdmLa0AaZFGMkRIGco38B6mCu9zD7-wJYxZSY66RotmrZRtCeT90rfxgsAdDYQnZYg3gMm6qD08-HqFiX1ou-F5YvvHnhQDGqTlIwb-Jvwx61gRjmb8cVPS9Y",
    industry: "Fashion & Kerajinan Tekstil",
    owner: "Bu Darmi",
    location: "Sleman, Yogyakarta",
    joinedDate: "Maret 2026",
    bio: "Batik Sleman Bu Darmi telah berdiri sejak tahun 2021 sebagai pusat pelestarian motif batik khas Kabupaten Sleman (Batik Parijoto). Kami berkomitmen penuh untuk memberdayakan pengrajin lokal di pedesaan, menggunakan bahan pewarna alami yang ramah lingkungan, serta memperkenalkan keindahan wastra nusantara kepada generasi muda melalui desain yang modern dan dinamis.",
    email: "kontak@batikbudarmi.com",
    website: "www.batikbudarmi.com",
    rating: 4.8,
    totalReviews: 8,
    completedGigs: 14,
    activeGigs: 1,
    satisfactionRate: "98%",
    activeProjectList: [
      {
        id: 1,
        title: "Buat Poster Promosi untuk Batik Sleman",
        category: "Desain Grafis",
        budget: "Rp 75.000",
        deadline: "3 hari lagi"
      }
    ],
    historyGigs: [
      {
        id: 10,
        title: "Desain Poster Promosi Lebaran",
        category: "Desain Grafis",
        budget: "Rp 150.000",
        student: "Andi Setiawan",
        studentAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVHOmSXI0bZt5WFsfbAvT2cNq-UX9NujpGCcQ3xjx8lG5Odl-Ahyxc5BfMclPKdHM1-W-Pj9-9m8Q6UlwZKun-rvsETy4XwqP5wvSOQUTHyjpNE9RNP6yxaN_bNctYin2MomQMFAgHFr8d37WkCZYlsGuA0EWcILsGt3rGhBIEHg-cluM_cAx_mmbuYuAqTblKs52EvFRw2VwLw9niYgG7DqVZtFLqUjUVOQbpkk3Lb6uyStIbSvKKGO8YqixNWpRdGxp-4Y8rJr4",
        rating: 5,
        review: "Andi sangat profesional dan responsif. Desain posternya luar biasa bagus, melebihi ekspektasi saya. Pasti akan bekerjasama lagi!",
        date: "15 Jun 2026"
      },
      {
        id: 11,
        title: "Pencatatan Penjualan Harian via Excel",
        category: "Administrasi",
        budget: "Rp 100.000",
        student: "Siti Rahma",
        studentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
        rating: 4,
        review: "Pekerjaan rapi dan cepat selesai. Sangat membantu operasional toko batik kami.",
        date: "28 Mei 2026"
      },
      {
        id: 12,
        title: "Foto Produk Katalog Batik Baru",
        category: "Fotografi",
        budget: "Rp 200.000",
        student: "Budi Pratama",
        studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        rating: 5,
        review: "Hasil fotonya sangat jernih dan detail kain batiknya kelihatan sekali. Terima kasih banyak!",
        date: "10 Mei 2026"
      }
    ]
  }
};

export default function UmkmProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const umkm = umkmData[id] || umkmData["1"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/30 shadow-sm">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 -ml-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Link href="/" className="font-bold text-xl text-primary">SkillGate</Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="font-semibold hidden sm:flex">
              <Share2 className="w-4 h-4 mr-2" /> Bagikan Profil
            </Button>
            <Link href="/chat">
              <Button size="sm" className="font-semibold bg-primary">
                <MessageSquare className="w-4 h-4 mr-2" /> Hubungi UMKM
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-[1100px] mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* Profile Header */}
        <section className="relative mb-10">
          {/* Cover */}
          <div className="h-36 md:h-48 bg-gradient-to-r from-secondary via-[#f58c1f] to-[#f9a826] rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          </div>

          {/* Profile Info Card - overlaps cover */}
          <div className="relative -mt-16 md:-mt-20 mx-4 md:mx-8">
            <div className="bg-white rounded-2xl shadow-lg border border-border/40 p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Avatar */}
                <div className="shrink-0 -mt-16 md:-mt-20 self-center md:self-start">
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
                    <img src={umkm.logo} alt={umkm.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{umkm.name}</h1>
                        <CheckCircle2 className="w-6 h-6 text-secondary shrink-0" />
                      </div>
                      <p className="text-secondary font-semibold mb-1">{umkm.industry}</p>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {umkm.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Bergabung {umkm.joinedDate}</span>
                      </div>
                    </div>

                    {/* Stats Badge */}
                    <div className="shrink-0 self-center md:self-start p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-center min-w-[120px]">
                      <div className="text-3xl font-black text-amber-600">{umkm.rating}</div>
                      <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Klien Terbaik</div>
                      <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{umkm.totalReviews} ulasan mahasiswa</div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-muted-foreground mt-4 leading-relaxed text-sm md:text-base max-w-2xl">{umkm.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Star, label: "Rating Klien", value: umkm.rating.toString(), sub: `${umkm.totalReviews} ulasan`, color: "text-amber-500", bg: "bg-amber-50" },
            { icon: Briefcase, label: "Proyek Diposting", value: (umkm.completedGigs + umkm.activeGigs).toString(), sub: "proyek keseluruhan", color: "text-secondary", bg: "bg-secondary/5" },
            { icon: Users, label: "Pemberdayaan", value: umkm.satisfactionRate, sub: "tingkat kepuasan mahasiswa", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: CheckCircle2, label: "Proyek Selesai", value: umkm.completedGigs.toString(), sub: "selesai sukses", color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} rounded-2xl p-5 border border-border/20`}>
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs font-medium text-muted-foreground">{stat.sub}</div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Left Column: Contact & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40">
              <h3 className="font-bold text-foreground mb-4">Informasi Bisnis</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground font-medium truncate">{umkm.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground font-medium">{umkm.website}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground font-medium">Pemilik: {umkm.owner}</span>
                </div>
              </div>
              <Link href="/chat" className="mt-5 block">
                <Button className="w-full font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <MessageSquare className="w-4 h-4 mr-2" /> Tanya Tentang Proyek
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Active Gigs & History Reviews */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Active Projects */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-secondary" /> Proyek Aktif / Dibuka
                <span className="text-sm font-medium text-muted-foreground ml-1">({umkm.activeGigs})</span>
              </h2>
              <div className="space-y-4">
                {umkm.activeProjectList.map(project => (
                  <div key={project.id} className="bg-white rounded-2xl p-6 shadow-sm border border-border/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-secondary/30 transition-all group">
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-secondary/10 text-secondary rounded-full">{project.category}</span>
                      <h4 className="font-bold text-foreground mt-2 group-hover:text-secondary transition-colors">{project.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Tenggat pengerjaan: {project.deadline}</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Honorarium</p>
                        <p className="font-bold text-emerald-600">{project.budget}</p>
                      </div>
                      <Link href={`/gigs/${project.id}`}>
                        <Button size="sm" className="font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground">Detail <ChevronRight className="w-4 h-4 ml-1" /></Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Reviews Section */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <Quote className="w-5 h-5 text-secondary" /> Ulasan dari Mahasiswa
                <span className="text-sm font-medium text-muted-foreground ml-1">({umkm.historyGigs.length})</span>
              </h2>
              <div className="space-y-4">
                {umkm.historyGigs.map((review, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-border/40">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-border/50 shrink-0 bg-muted">
                        <img src={review.studentAvatar} alt={review.student} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                          <div>
                            <span className="font-bold text-foreground">{review.student}</span>
                            <span className="text-xs text-muted-foreground ml-2">untuk "{review.title}"</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex gap-0.5 mb-3">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "text-amber-500 fill-current" : "text-gray-200"}`} />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">"{review.review}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border/30">
        <div className="max-w-[1100px] mx-auto py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <div className="font-bold text-lg text-foreground mb-1">SkillGate</div>
            <p className="text-sm text-muted-foreground">© 2026 SkillGate. Menghubungkan Potensi Mahasiswa dengan UMKM Indonesia.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="#" className="text-xs font-semibold text-muted-foreground hover:text-secondary hover:underline transition-all">Tentang Kami</Link>
            <Link href="#" className="text-xs font-semibold text-muted-foreground hover:text-secondary hover:underline transition-all">Pusat Bantuan</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
