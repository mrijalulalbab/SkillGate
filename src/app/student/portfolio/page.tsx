"use client";

import { StudentLayout } from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import {
  Briefcase, Star, Calendar, ExternalLink, Download,
  Share2, Eye, Award, TrendingUp, CheckCircle2, Quote,
  Palette, Camera, PenTool, BarChart3, Globe, Sparkles, Copy, Check, Loader2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const portfolioEntries = [
  {
    id: 1,
    title: "Desain Poster Promosi Lebaran",
    client: "UMKM Batik Bu Darmi",
    clientAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1xJkiSjkhsR7Lvz7cxZtY5aMCaT5fYwI3Wl0EsDez7_UFZFXqofnMfWC2UjhmoaubyZnvXO5D3t8-lJJX1FGKtlcjWM0WNvZMYGJvx4EsPGVzmdf6NjvhlWqY1UQADJ4k-OtvnRsP4WxE37ZpeAbdmLa0AaZFGMkRIGco38B6mCu9zD7-wJYxZSY66RotmrZRtCeT90rfxgsAdDYQnZYg3gMm6qD08-HqFiX1ou-F5YvvHnhQDGqTlIwb-Jvwx61gRjmb8cVPS9Y",
    category: "Desain Grafis",
    categoryIcon: Palette,
    completedDate: "15 Jun 2026",
    budget: "Rp 150.000",
    rating: 5,
    testimonial: "Andi sangat profesional dan responsif. Desain posternya luar biasa bagus, melebihi ekspektasi saya. Pasti akan kerjasama lagi!",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfjWCwVg7ZwxiQ5U7NGSB7tkQHTqB_pEeGszjp0OK1UEnJFpxMPxk5P42KLCbwdQvnS1iJ1h7UZEDP7XTsHwm1KBt5cZ9JrTE5VtiWenS94sjNeRw1sAlrk2Uy2Ofwrsyumsmi3zBXBNS4mb4S8pHOwKDRiNzLL_w8cEGPJwvifcmDJiyZmummvy-nrCSKQf_6kAYqaN6Nv5wOruHKzDlWmz_B4OIMfR3gsdKNKjnpk7EqwnJbyWpM4aFPBJnGkv8fjVOgPKnu1rc",
    skills: ["Canva", "Adobe Photoshop", "Copywriting"],
    deliverables: ["5 desain poster (1080×1080)", "1 cover highlight IG"],
  },
  {
    id: 2,
    title: "Input Data Penjualan Toko Online",
    client: "Toko Kopi Jogja Brew",
    clientAvatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=150",
    category: "Administrasi",
    categoryIcon: BarChart3,
    completedDate: "10 Jun 2026",
    budget: "Rp 100.000",
    rating: 4,
    testimonial: "Pekerjaannya rapi dan tepat waktu. Sangat membantu dalam merapikan data penjualan kami selama 3 bulan terakhir.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    skills: ["Microsoft Excel", "Google Sheets", "Data Entry"],
    deliverables: ["Spreadsheet penjualan 3 bulan", "Laporan ringkasan"],
  },
  {
    id: 3,
    title: "Foto Produk Kerajinan Tangan",
    client: "Kerajinan Bambu Pak Suryo",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    category: "Fotografi",
    categoryIcon: Camera,
    completedDate: "2 Jun 2026",
    budget: "Rp 200.000",
    rating: 5,
    testimonial: "Foto produknya sangat profesional! Setelah pakai foto dari Andi, penjualan online kami naik 30%. Terima kasih banyak!",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
    skills: ["Fotografi Produk", "Lightroom", "Editing Foto"],
    deliverables: ["20 foto produk HD", "5 foto lifestyle"],
  },
];

const stats = {
  totalProjects: 3,
  totalEarnings: "Rp 450.000",
  avgRating: 4.7,
  totalClients: 3,
};

export default function PortfolioPage() {
  const [selectedEntry, setSelectedEntry] = useState<typeof portfolioEntries[0] | null>(null);
  const [aiSummary, setAiSummary] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  const [studentName, setStudentName] = useState("Mahasiswa");
  const [university, setUniversity] = useState("Universitas Islam Indonesia");
  const [major, setMajor] = useState("Teknik Informatika");
  const [readinessScore, setReadinessScore] = useState(75);
  const [skills, setSkills] = useState<string[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch user full_name
        const { data: userProfile } = await supabase
          .from("users")
          .select("full_name")
          .eq("id", user.id)
          .single();
          
        if (userProfile?.full_name) {
          setStudentName(userProfile.full_name);
        }

        // Fetch student profile details
        const { data: student } = await supabase
          .from("student_profiles")
          .select("university, major, readiness_score, skills")
          .eq("user_id", user.id)
          .single();

        if (student) {
          setUniversity(student.university || "Universitas Islam Indonesia");
          setMajor(student.major || "Teknik Informatika");
          setReadinessScore(student.readiness_score || 75);
          setSkills(student.skills || []);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    loadProfile();
  }, []);

  const handleGenerateSummary = () => {
    setGenerating(true);
    setLoadingStep("Mengambil data profil akademik...");
    
    setTimeout(() => {
      setLoadingStep("Menganalisis histori proyek & rating dari UMKM...");
      setTimeout(() => {
        setLoadingStep("Menghubungkan ke API Gemini untuk menyusun deskripsi...");
        setTimeout(() => {
          setAiSummary(
            `${studentName} adalah mahasiswa ${major} ${university} yang memiliki kompetensi kuat di bidang ${skills.length > 0 ? skills.slice(0, 3).join(', ') : 'Desain Grafis dan Administrasi Data'}. Melalui platform SkillGate, ${studentName} telah menunjukkan kinerja luar biasa dengan menyelesaikan 3 proyek micro-gig dengan rating rata-rata 4.7/5.0 dan skor kesiapan kerja (readiness score) mencapai ${readinessScore}%, menjadikannya talenta yang sangat mandiri dan siap berkolaborasi secara profesional dengan UMKM.`
          );
          setGenerating(false);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(aiSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <StudentLayout>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-10">
        
        {/* Hero / Header */}
        <section>
          <div className="bg-gradient-to-br from-primary via-[#4a2fbf] to-[#6e44ff] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-6 h-6" />
                  <span className="text-sm font-bold uppercase tracking-wider text-white/80">Portfolio Builder</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-3">Portofolio {studentName}</h1>
                <p className="text-white/80 text-lg max-w-xl">
                  Portofolio ini dibuat otomatis dari proyek-proyek yang telah Anda selesaikan di SkillGate. Bagikan ke calon klien atau lampirkan di CV Anda.
                </p>
              </div>
              
              <div className="flex gap-3 shrink-0">
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white font-semibold">
                  <Share2 className="w-4 h-4 mr-2" /> Bagikan
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white font-semibold">
                  <Download className="w-4 h-4 mr-2" /> Unduh PDF
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-border/40 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.totalProjects}</div>
            <div className="text-sm font-medium text-muted-foreground mt-1">Proyek Selesai</div>
          </div>
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-border/40 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.totalEarnings}</div>
            <div className="text-sm font-medium text-muted-foreground mt-1">Total Pendapatan</div>
          </div>
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-border/40 text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.avgRating}</div>
            <div className="text-sm font-medium text-muted-foreground mt-1">Rating Rata-rata</div>
          </div>
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-border/40 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.totalClients}</div>
            <div className="text-sm font-medium text-muted-foreground mt-1">Klien Dilayani</div>
          </div>
        </section>

        {/* AI Resume Summary Section */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border/40 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  Ringkasan Karir AI (AI Resume Summarizer)
                  <span className="bg-primary/15 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Gemini Powered</span>
                </h3>
                <p className="text-sm text-muted-foreground">Merangkum otomatis kompetensi akademik dan rekam jejak kerja Anda untuk draf CV.</p>
              </div>
            </div>
            {!aiSummary && !generating && (
              <Button 
                onClick={handleGenerateSummary}
                className="font-bold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Buat Ringkasan AI
              </Button>
            )}
          </div>

          {generating && (
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm font-semibold text-slate-800">{loadingStep}</p>
              <p className="text-xs text-muted-foreground">Sistem mengompilasi statistik kerja Anda di platform...</p>
            </div>
          )}

          {aiSummary && !generating && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative group/summary">
              <p className="text-sm text-slate-700 leading-relaxed pr-10">{aiSummary}</p>
              
              <div className="absolute top-4 right-4 opacity-100 md:opacity-0 md:group-hover/summary:opacity-100 transition-opacity">
                <button
                  onClick={handleCopy}
                  className="p-2 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 shadow-sm transition-colors text-muted-foreground hover:text-foreground"
                  title="Salin ke Clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200 text-xs text-muted-foreground">
                <span>Siap disalin ke LinkedIn atau CV Anda.</span>
                <button 
                  onClick={handleGenerateSummary}
                  className="text-primary hover:underline font-bold"
                >
                  Regenerasi Ringkasan
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Portfolio Grid */}
        <section>
          <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Karya Saya</h2>
              <p className="text-muted-foreground mt-1">Setiap entri dibuat otomatis saat proyek ditandai selesai oleh klien.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {portfolioEntries.map((entry) => {
              const CategoryIcon = entry.categoryIcon;
              return (
                <div
                  key={entry.id}
                  className="bg-white rounded-2xl shadow-sm border border-border/40 overflow-hidden group hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer flex flex-col"
                  onClick={() => setSelectedEntry(entry)}
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <img
                      src={entry.thumbnail}
                      alt={entry.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-foreground flex items-center gap-1.5">
                      <CategoryIcon className="w-3.5 h-3.5 text-primary" />
                      {entry.category}
                    </div>
                    
                    {/* View overlay */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <Eye className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    
                    {/* Rating on thumbnail */}
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      <span className="text-xs font-bold text-foreground">{entry.rating}.0</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 md:p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                      {entry.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-border/50">
                        <img src={entry.clientAvatar} alt={entry.client} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-muted-foreground font-medium">{entry.client}</span>
                    </div>

                    {/* Skills used */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {entry.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-primary/5 text-primary text-xs font-semibold rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    {/* Testimonial preview */}
                    <div className="bg-muted/30 rounded-lg p-3 mt-auto">
                      <div className="flex items-start gap-2">
                        <Quote className="w-4 h-4 text-primary/40 shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground italic line-clamp-2">{entry.testimonial}</p>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/30 text-xs font-semibold text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> {entry.completedDate}
                      </span>
                      <span className="text-primary font-bold">{entry.budget}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Detail Modal */}
        {selectedEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedEntry(null)} />
            
            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Image Header */}
              <div className="relative h-56 md:h-72 overflow-hidden rounded-t-3xl">
                <img src={selectedEntry.thumbnail} alt={selectedEntry.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-white transition-colors shadow-md"
                >
                  ✕
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-foreground">
                      {selectedEntry.category}
                    </span>
                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i <= selectedEntry.rating ? "text-amber-500 fill-current" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedEntry.title}</h2>
                </div>
              </div>
              
              <div className="p-6 md:p-8 space-y-8">
                {/* Client Info */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                      <img src={selectedEntry.clientAvatar} alt={selectedEntry.client} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{selectedEntry.client}</p>
                      <p className="text-xs text-muted-foreground">Klien UMKM</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{selectedEntry.budget}</p>
                    <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                      <Calendar className="w-3 h-3" /> {selectedEntry.completedDate}
                    </p>
                  </div>
                </div>
                
                {/* Skills Used */}
                <div>
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Skill yang Digunakan</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Deliverables */}
                <div>
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Output yang Diserahkan</h3>
                  <div className="space-y-2">
                    {selectedEntry.deliverables.map((d, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-sm font-medium text-foreground">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Testimonial */}
                <div className="bg-gradient-to-br from-primary/5 to-[#6e44ff]/5 rounded-2xl p-6 border border-primary/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Quote className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Testimoni Klien</h3>
                  </div>
                  <p className="text-foreground italic leading-relaxed mb-4">"{selectedEntry.testimonial}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
                      <img src={selectedEntry.clientAvatar} alt={selectedEntry.client} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{selectedEntry.client}</p>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`w-3 h-3 ${i <= selectedEntry.rating ? "text-amber-500 fill-current" : "text-gray-300"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 font-semibold">
                    <Share2 className="w-4 h-4 mr-2" /> Bagikan Karya Ini
                  </Button>
                  <Button variant="outline" className="flex-1 font-semibold">
                    <ExternalLink className="w-4 h-4 mr-2" /> Buka Link Publik
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA for more projects */}
        <section className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-border/40 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">Tambah Lebih Banyak Karya!</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Setiap proyek yang Anda selesaikan akan otomatis muncul di portofolio ini. Cari proyek baru dan perkuat CV Anda.
          </p>
          <Link href="/gigs">
            <Button className="px-8 py-6 font-bold text-base shadow-md hover:shadow-lg transition-all">
              <Briefcase className="w-5 h-5 mr-2" /> Jelajahi Proyek Baru
            </Button>
          </Link>
        </section>

      </div>
    </StudentLayout>
  );
}
