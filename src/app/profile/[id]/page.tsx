"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Star, MapPin, Calendar, Clock, Briefcase,
  GraduationCap, Award, ExternalLink, MessageSquare,
  CheckCircle2, Quote, Palette, Camera, BarChart3,
  Globe, Mail, Share2, TrendingUp
} from "lucide-react";

// Mock student data
const studentData: Record<string, {
  name: string;
  avatar: string;
  university: string;
  major: string;
  semester: number;
  location: string;
  joinedDate: string;
  bio: string;
  email: string;
  readinessScore: number;
  level: string;
  hoursPerWeek: string;
  rating: number;
  totalReviews: number;
  completedProjects: number;
  totalEarnings: string;
  responseRate: string;
  skills: string[];
  interests: string[];
  portfolio: {
    id: number;
    title: string;
    client: string;
    clientAvatar: string;
    category: string;
    rating: number;
    thumbnail: string;
    testimonial: string;
    date: string;
    budget: string;
  }[];
  reviews: {
    client: string;
    avatar: string;
    rating: number;
    text: string;
    project: string;
    date: string;
  }[];
}> = {
  "1": {
    name: "Andi Setiawan",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVHOmSXI0bZt5WFsfbAvT2cNq-UX9NujpGCcQ3xjx8lG5Odl-Ahyxc5BfMclPKdHM1-W-Pj9-9m8Q6UlwZKun-rvsETy4XwqP5wvSOQUTHyjpNE9RNP6yxaN_bNctYin2MomQMFAgHFr8d37WkCZYlsGuA0EWcILsGt3rGhBIEHg-cluM_cAx_mmbuYuAqTblKs52EvFRw2VwLw9niYgG7DqVZtFLqUjUVOQbpkk3Lb6uyStIbSvKKGO8YqixNWpRdGxp-4Y8rJr4",
    university: "Universitas Gadjah Mada (UGM)",
    major: "Desain Komunikasi Visual",
    semester: 5,
    location: "Sleman, Yogyakarta",
    joinedDate: "Mei 2026",
    bio: "Mahasiswa DKV semester 5 yang passionate di bidang desain grafis dan branding. Berpengalaman mengerjakan proyek desain untuk UMKM lokal, mulai dari desain feed Instagram, poster promosi, hingga katalog produk digital. Saya percaya desain yang baik bisa membantu UMKM kecil tampil lebih profesional dan menjangkau lebih banyak pelanggan.",
    email: "andi.setiawan@mail.ugm.ac.id",
    readinessScore: 78,
    level: "Intermediate",
    hoursPerWeek: "10-20 jam",
    rating: 4.8,
    totalReviews: 3,
    completedProjects: 3,
    totalEarnings: "Rp 450.000",
    responseRate: "95%",
    skills: ["Desain Grafis", "Canva", "Adobe Photoshop", "Adobe Illustrator", "Fotografi Produk", "Copywriting", "UI/UX Design"],
    interests: ["Fashion & Retail", "Kuliner (F&B)", "Kerajinan Tangan"],
    portfolio: [
      {
        id: 1,
        title: "Desain Poster Promosi Lebaran",
        client: "UMKM Batik Bu Darmi",
        clientAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1xJkiSjkhsR7Lvz7cxZtY5aMCaT5fYwI3Wl0EsDez7_UFZFXqofnMfWC2UjhmoaubyZnvXO5D3t8-lJJX1FGKtlcjWM0WNvZMYGJvx4EsPGVzmdf6NjvhlWqY1UQADJ4k-OtvnRsP4WxE37ZpeAbdmLa0AaZFGMkRIGco38B6mCu9zD7-wJYxZSY66RotmrZRtCeT90rfxgsAdDYQnZYg3gMm6qD08-HqFiX1ou-F5YvvHnhQDGqTlIwb-Jvwx61gRjmb8cVPS9Y",
        category: "Desain Grafis",
        rating: 5,
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfjWCwVg7ZwxiQ5U7NGSB7tkQHTqB_pEeGszjp0OK1UEnJFpxMPxk5P42KLCbwdQvnS1iJ1h7UZEDP7XTsHwm1KBt5cZ9JrTE5VtiWenS94sjNeRw1sAlrk2Uy2Ofwrsyumsmi3zBXBNS4mb4S8pHOwKDRiNzLL_w8cEGPJwvifcmDJiyZmummvy-nrCSKQf_6kAYqaN6Nv5wOruHKzDlWmz_B4OIMfR3gsdKNKjnpk7EqwnJbyWpM4aFPBJnGkv8fjVOgPKnu1rc",
        testimonial: "Andi sangat profesional dan responsif. Desain posternya luar biasa bagus!",
        date: "15 Jun 2026",
        budget: "Rp 150.000",
      },
      {
        id: 2,
        title: "Input Data Penjualan Toko",
        client: "Toko Kopi Jogja Brew",
        clientAvatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=150",
        category: "Administrasi",
        rating: 4,
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        testimonial: "Pekerjaannya rapi dan tepat waktu. Sangat membantu!",
        date: "10 Jun 2026",
        budget: "Rp 100.000",
      },
      {
        id: 3,
        title: "Foto Produk Kerajinan Tangan",
        client: "Kerajinan Bambu Pak Suryo",
        clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        category: "Fotografi",
        rating: 5,
        thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
        testimonial: "Foto produknya sangat profesional! Penjualan online kami naik 30%.",
        date: "2 Jun 2026",
        budget: "Rp 200.000",
      },
    ],
    reviews: [
      {
        client: "Bu Darmi",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1xJkiSjkhsR7Lvz7cxZtY5aMCaT5fYwI3Wl0EsDez7_UFZFXqofnMfWC2UjhmoaubyZnvXO5D3t8-lJJX1FGKtlcjWM0WNvZMYGJvx4EsPGVzmdf6NjvhlWqY1UQADJ4k-OtvnRsP4WxE37ZpeAbdmLa0AaZFGMkRIGco38B6mCu9zD7-wJYxZSY66RotmrZRtCeT90rfxgsAdDYQnZYg3gMm6qD08-HqFiX1ou-F5YvvHnhQDGqTlIwb-Jvwx61gRjmb8cVPS9Y",
        rating: 5,
        text: "Andi sangat profesional dan responsif. Desain posternya luar biasa bagus, melebihi ekspektasi saya. Pasti akan kerjasama lagi!",
        project: "Desain Poster Promosi Lebaran",
        date: "15 Jun 2026",
      },
      {
        client: "Jogja Brew",
        avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=150",
        rating: 4,
        text: "Pekerjaannya rapi dan tepat waktu. Sangat membantu dalam merapikan data penjualan kami selama 3 bulan terakhir.",
        project: "Input Data Penjualan Toko",
        date: "10 Jun 2026",
      },
      {
        client: "Pak Suryo",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        rating: 5,
        text: "Foto produknya sangat profesional! Setelah pakai foto dari Andi, penjualan online kami naik 30%. Terima kasih banyak!",
        project: "Foto Produk Kerajinan Tangan",
        date: "2 Jun 2026",
      },
    ],
  },
};

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const student = studentData[id] || studentData["1"];

  const scoreColor = student.readinessScore >= 75 ? "text-emerald-600" : student.readinessScore >= 50 ? "text-amber-600" : "text-blue-600";
  const scoreBg = student.readinessScore >= 75 ? "bg-emerald-100" : student.readinessScore >= 50 ? "bg-amber-100" : "bg-blue-100";
  const scoreRing = student.readinessScore >= 75 ? "border-emerald-400" : student.readinessScore >= 50 ? "border-amber-400" : "border-blue-400";

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
            <Link href="/umkm/chat">
              <Button size="sm" className="font-semibold bg-primary">
                <MessageSquare className="w-4 h-4 mr-2" /> Hubungi
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-[1100px] mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* Profile Header */}
        <section className="relative mb-10">
          {/* Cover */}
          <div className="h-36 md:h-48 bg-gradient-to-r from-primary via-[#4a2fbf] to-[#6e44ff] rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          </div>

          {/* Profile Info Card - overlaps cover */}
          <div className="relative -mt-16 md:-mt-20 mx-4 md:mx-8">
            <div className="bg-white rounded-2xl shadow-lg border border-border/40 p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Avatar */}
                <div className="shrink-0 -mt-16 md:-mt-20 self-center md:self-start">
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-muted">
                    <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{student.name}</h1>
                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                      </div>
                      <p className="text-primary font-semibold mb-1">{student.major}</p>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {student.university}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {student.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Bergabung {student.joinedDate}</span>
                      </div>
                    </div>

                    {/* Readiness Score Badge */}
                    <div className={`shrink-0 self-center md:self-start p-4 rounded-2xl ${scoreBg} border-2 ${scoreRing} text-center min-w-[120px]`}>
                      <div className={`text-3xl font-black ${scoreColor}`}>{student.readinessScore}</div>
                      <div className={`text-xs font-bold ${scoreColor} uppercase tracking-wider`}>{student.level}</div>
                      <div className="text-[10px] text-muted-foreground font-medium mt-0.5">Skor Kesiapan</div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-muted-foreground mt-4 leading-relaxed text-sm md:text-base max-w-2xl">{student.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Star, label: "Rating", value: student.rating.toString(), sub: `${student.totalReviews} ulasan`, color: "text-amber-500", bg: "bg-amber-50" },
            { icon: Briefcase, label: "Proyek Selesai", value: student.completedProjects.toString(), sub: "proyek", color: "text-primary", bg: "bg-primary/5" },
            { icon: Clock, label: "Ketersediaan", value: student.hoursPerWeek, sub: "per minggu", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: TrendingUp, label: "Respon", value: student.responseRate, sub: "tingkat respon", color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} rounded-2xl p-5 border border-border/20`}>
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs font-medium text-muted-foreground">{stat.sub}</div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Left Column: Skills & Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Skills */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" /> Keahlian
              </h3>
              <div className="flex flex-wrap gap-2">
                {student.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-primary/5 text-primary text-sm font-semibold rounded-lg border border-primary/10">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Industry Interests */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> Minat Industri
              </h3>
              <div className="flex flex-wrap gap-2">
                {student.interests.map(interest => (
                  <span key={interest} className="px-3 py-1.5 bg-muted text-foreground text-sm font-medium rounded-lg">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40">
              <h3 className="font-bold text-foreground mb-4">Informasi Kontak</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground font-medium truncate">{student.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <GraduationCap className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground font-medium">Semester {student.semester}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground font-medium">Tersedia {student.hoursPerWeek}/minggu</span>
                </div>
              </div>
              <Link href="/umkm/chat" className="mt-5 block">
                <Button className="w-full font-semibold">
                  <MessageSquare className="w-4 h-4 mr-2" /> Kirim Pesan
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Portfolio & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Portfolio Section */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" /> Portofolio
                <span className="text-sm font-medium text-muted-foreground ml-1">({student.portfolio.length} karya)</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {student.portfolio.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-border/40 overflow-hidden group hover:shadow-md hover:border-primary/20 transition-all">
                    <div className="relative h-40 overflow-hidden">
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-foreground">
                        {item.category}
                      </div>
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                        <span className="text-xs font-bold">{item.rating}.0</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                          <img src={item.clientAvatar} alt={item.client} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs text-muted-foreground">{item.client}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground pt-3 border-t border-border/30">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.date}</span>
                        <span className="font-bold text-primary">{item.budget}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <Quote className="w-5 h-5 text-primary" /> Ulasan dari Klien
                <span className="text-sm font-medium text-muted-foreground ml-1">({student.reviews.length})</span>
              </h2>
              <div className="space-y-4">
                {student.reviews.map((review, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-border/40">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-border/50 shrink-0">
                        <img src={review.avatar} alt={review.client} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                          <div>
                            <span className="font-bold text-foreground">{review.client}</span>
                            <span className="text-xs text-muted-foreground ml-2">untuk "{review.project}"</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex gap-0.5 mb-3">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "text-amber-500 fill-current" : "text-gray-200"}`} />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">"{review.text}"</p>
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
            <Link href="#" className="text-xs font-semibold text-muted-foreground hover:text-primary hover:underline transition-all">Tentang Kami</Link>
            <Link href="#" className="text-xs font-semibold text-muted-foreground hover:text-primary hover:underline transition-all">Pusat Bantuan</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
