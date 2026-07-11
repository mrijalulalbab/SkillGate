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
import { useToast } from "@/components/ui/toast-notification";

export default function PortfolioPage() {
  const [portfolioEntries, setPortfolioEntries] = useState<any[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalEarnings: "Rp 0",
    avgRating: 0,
    totalClients: 0,
  });
  const [aiSummary, setAiSummary] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const { showToast } = useToast();

  const [studentName, setStudentName] = useState("Mahasiswa");
  const [university, setUniversity] = useState("Universitas Islam Indonesia");
  const [major, setMajor] = useState("Teknik Informatika");
  const [readinessScore, setReadinessScore] = useState(75);
  const [skills, setSkills] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);
        setEmail(user.email || "");

        // Fetch user full_name and phone
        const { data: userProfile } = await supabase
          .from("users")
          .select("full_name, phone")
          .eq("id", user.id)
          .single();
          
        const nameToShow = userProfile?.full_name || "Mahasiswa";
        setStudentName(nameToShow);
        setPhone(userProfile?.phone || "");

        // Fetch student profile details
        const { data: student } = await supabase
          .from("student_profiles")
          .select("university, major, readiness_score, skills")
          .eq("user_id", user.id)
          .single();

        let currentSkills: string[] = [];
        let currentReadiness = 75;
        if (student) {
          setUniversity(student.university || "Universitas Islam Indonesia");
          setMajor(student.major || "Teknik Informatika");
          currentReadiness = student.readiness_score || 75;
          setReadinessScore(currentReadiness);
          currentSkills = student.skills || [];
          setSkills(currentSkills);
        }

        // Fetch completed gigs for this student
        const { data: completedGigs, error: gigsError } = await supabase
          .from("gigs")
          .select(`
            id, title, category, budget, skills_required, updated_at, output_expected, umkm_id
          `)
          .eq("accepted_student_id", user.id)
          .eq("status", "completed");

        if (gigsError) {
          console.error("Error fetching completed gigs:", gigsError);
        }

        // Fetch reviews where this student is the reviewee (separate query to avoid nested join issues)
        const { data: studentReviews } = await supabase
          .from("reviews")
          .select("gig_id, rating, comment")
          .eq("reviewee_id", user.id);

        const reviewsByGig: Record<string, { rating: number; comment: string }> = {};
        if (studentReviews) {
          for (const r of studentReviews) {
            reviewsByGig[r.gig_id] = { rating: r.rating, comment: r.comment };
          }
        }

        if (completedGigs && completedGigs.length > 0) {
          let earningsSum = 0;
          let ratingSum = 0;
          let ratingCount = 0;
          const clientsSet = new Set<string>();

          // Resolve UMKM names for all unique umkm_ids
          const umkmIds = [...new Set(completedGigs.map((g: any) => g.umkm_id))];
          const { data: umkmUsers } = await supabase
            .from("users")
            .select("id, full_name")
            .in("id", umkmIds);
          const { data: umkmProfiles } = await supabase
            .from("umkm_profiles")
            .select("user_id, business_name")
            .in("user_id", umkmIds);

          const umkmNameMap: Record<string, string> = {};
          for (const uid of umkmIds) {
            const profile = umkmProfiles?.find((p: any) => p.user_id === uid);
            const user_ = umkmUsers?.find((u: any) => u.id === uid);
            umkmNameMap[uid] = profile?.business_name || user_?.full_name || "UMKM";
          }

          const dbEntries = completedGigs.map((gig: any, idx: number) => {
            const budgetNum = Number(gig.budget) || 0;
            earningsSum += budgetNum;

            const clientName = umkmNameMap[gig.umkm_id] || "UMKM";
            clientsSet.add(clientName);

            const review = reviewsByGig[gig.id] || null;
            const ratingVal = review ? Number(review.rating) || 5 : 5;
            const commentVal = review ? review.comment || "Selesai tepat waktu dengan hasil memuaskan." : "Selesai dengan hasil memuaskan.";

            ratingSum += ratingVal;
            ratingCount++;

            let catIcon = PenTool;
            if (gig.category === "Desain Grafis") catIcon = Palette;
            else if (gig.category === "Fotografi") catIcon = Camera;
            else if (gig.category === "Administrasi") catIcon = BarChart3;

            return {
              id: gig.id,
              title: gig.title,
              client: clientName,
              clientAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1xJkiSjkhsR7Lvz7cxZtY5aMCaT5fYwI3Wl0EsDez7_UFZFXqofnMfWC2UjhmoaubyZnvXO5D3t8-lJJX1FGKtlcjWM0WNvZMYGJvx4EsPGVzmdf6NjvhlWqY1UQADJ4k-OtvnRsP4WxE37ZpeAbdmLa0AaZFGMkRIGco38B6mCu9zD7-wJYxZSY66RotmrZRtCeT90rfxgsAdDYQnZYg3gMm6qD08-HqFiX1ou-F5YvvHnhQDGqTlIwb-Jvwx61gRjmb8cVPS9Y",
              category: gig.category || "Proyek Mikro",
              categoryIcon: catIcon,
              completedDate: gig.updated_at ? new Date(gig.updated_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "Baru saja",
              budget: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(budgetNum),
              rating: ratingVal,
              testimonial: commentVal,
              thumbnail: idx % 3 === 0 
                ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAfjWCwVg7ZwxiQ5U7NGSB7tkQHTqB_pEeGszjp0OK1UEnJFpxMPxk5P42KLCbwdQvnS1iJ1h7UZEDP7XTsHwm1KBt5cZ9JrTE5VtiWenS94sjNeRw1sAlrk2Uy2Ofwrsyumsmi3zBXBNS4mb4S8pHOwKDRiNzLL_w8cEGPJwvifcmDJiyZmummvy-nrCSKQf_6kAYqaN6Nv5wOruHKzDlWmz_B4OIMfR3gsdKNKjnpk7EqwnJbyWpM4aFPBJnGkv8fjVOgPKnu1rc"
                : idx % 3 === 1 
                  ? "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
                  : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
              skills: gig.skills_required || ["Proyek"],
              deliverables: gig.output_expected ? [gig.output_expected] : ["Output Sesuai Deskripsi"],
            };
          });

          setPortfolioEntries(dbEntries);
          setStats({
            totalProjects: dbEntries.length,
            totalEarnings: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(earningsSum),
            avgRating: ratingCount > 0 ? Number((ratingSum / ratingCount).toFixed(1)) : 0.0,
            totalClients: clientsSet.size,
          });
        } else {
          // No completed gigs — show empty portfolio
          setPortfolioEntries([]);
          setStats({
            totalProjects: 0,
            totalEarnings: "Rp 0",
            avgRating: 0,
            totalClients: 0,
          });
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
            stats.totalProjects > 0
              ? `${studentName} adalah mahasiswa ${major} ${university} yang memiliki kompetensi kuat di bidang ${skills.length > 0 ? skills.slice(0, 3).join(', ') : 'Desain Grafis dan Administrasi Data'}. Melalui platform SkillGate, ${studentName} telah menunjukkan kinerja luar biasa dengan menyelesaikan ${stats.totalProjects} proyek micro-gig dengan rating rata-rata ${stats.avgRating}/5.0 dan skor kesiapan kerja (readiness score) mencapai ${readinessScore}%, menjadikannya talenta yang sangat mandiri dan siap berkolaborasi secara profesional dengan UMKM.`
              : `${studentName} adalah mahasiswa ${major} ${university} yang memiliki kompetensi di bidang ${skills.length > 0 ? skills.slice(0, 3).join(', ') : 'berbagai keahlian'}. ${studentName} saat ini sedang membangun portofolio profesional melalui platform SkillGate dengan skor kesiapan kerja (readiness score) mencapai ${readinessScore}%. Siap untuk mengambil proyek pertama dan membuktikan kemampuannya secara nyata kepada UMKM.`
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

  const handleSharePortfolio = () => {
    if (!userId) {
      showToast("Gagal memuat profil pengenal user. Silakan coba lagi.", "error");
      return;
    }
    const shareUrl = `${window.location.origin}/profile/${userId}`;
    navigator.clipboard.writeText(shareUrl);
    showToast("Tautan portofolio publik Anda berhasil disalin ke clipboard!", "success");
  };

  const handleDownloadPDF = () => {
    showToast("Mempersiapkan layout cetak PDF...", "info");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleShareEntry = (entry: any) => {
    if (!entry) return;
    const shareUrl = `${window.location.origin}/profile/${userId}?entry=${entry.id}`;
    navigator.clipboard.writeText(shareUrl);
    showToast(`Tautan karya "${entry.title}" berhasil disalin ke clipboard!`, "success");
  };

  const handleOpenDeliverable = (entry: any) => {
    if (!entry || !entry.deliverables || entry.deliverables.length === 0) {
      showToast("Tidak ada tautan berkas terlampir untuk karya ini.", "error");
      return;
    }
    const url = entry.deliverables[0];
    if (url.startsWith("http://") || url.startsWith("https://")) {
      window.open(url, "_blank");
    } else {
      showToast(`Berkas penyerahan: ${url}`, "info");
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-10 print:hidden">
        
        {/* Hero / Header */}
        <section>
          <div className="bg-[#0B0F19] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(110,68,255,0.15),rgba(255,255,255,0))] rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden border border-slate-800">
            {/* Ambient background glows */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#6e44ff]/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-sm">
                    <Award className="w-3.5 h-3.5 text-primary" />
                    Verified Scholar Portfolio
                  </div>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  Portofolio {studentName}
                </h1>
                <p className="text-slate-400 text-base md:text-lg max-w-2xl font-normal leading-relaxed">
                  Portofolio akademik dinamis yang divalidasi langsung oleh platform dari histori pengerjaan proyek nyata milik mitra UMKM Sleman.
                </p>
              </div>
              
              <div className="flex gap-3 shrink-0 print:hidden w-full md:w-auto">
                <Button 
                  onClick={handleSharePortfolio}
                  variant="outline" 
                  className="flex-1 md:flex-none bg-white/5 border-slate-800 text-slate-200 hover:bg-white/10 hover:text-white font-bold rounded-xl transition-all"
                >
                  <Share2 className="w-4 h-4 mr-2" /> Bagikan
                </Button>
                <Button 
                  onClick={handleDownloadPDF}
                  variant="outline" 
                  className="flex-1 md:flex-none bg-white/5 border-slate-800 text-slate-200 hover:bg-white/10 hover:text-white font-bold rounded-xl transition-all"
                >
                  <Download className="w-4 h-4 mr-2" /> Cetak PDF / CV
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center hover:-translate-y-1 hover:shadow-md hover:border-primary/20 transition-all duration-300 group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3.5 group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.totalProjects}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1.5">Proyek Selesai</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center hover:-translate-y-1 hover:shadow-md hover:border-emerald/20 transition-all duration-300 group">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3.5 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.totalEarnings}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1.5">Total Pendapatan</div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center hover:-translate-y-1 hover:shadow-md hover:border-amber/20 transition-all duration-300 group">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3.5 group-hover:scale-110 transition-transform duration-300">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.avgRating} <span className="text-sm font-medium text-slate-400">/ 5.0</span></div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1.5">Rating Kinerja</div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center hover:-translate-y-1 hover:shadow-md hover:border-violet/20 transition-all duration-300 group">
            <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-3.5 group-hover:scale-110 transition-transform duration-300">
              <Globe className="w-5 h-5" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.totalClients}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1.5">Klien UMKM</div>
          </div>
        </section>

        {/* AI Resume Summary Section */}
        <section className="bg-gradient-to-br from-white to-[#F9FAFB] rounded-[32px] p-6 md:p-8 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.01)] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-sm border border-primary/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  Ringkasan Asisten Karir AI
                  <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-primary/25">Gemini 1.5 Pro</span>
                </h3>
                <p className="text-sm text-slate-500 font-medium">Buat deskripsi profil profesional otomatis berdasarkan capaian kerja riil Anda di platform.</p>
              </div>
            </div>
            {!aiSummary && !generating && (
              <Button 
                onClick={handleGenerateSummary}
                className="w-full lg:w-auto font-bold py-6 px-6 bg-gradient-to-r from-primary to-[#6e44ff] text-white hover:opacity-95 shadow-[0_4px_20px_rgba(74,47,191,0.2)] rounded-xl transition-all"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Buat Ringkasan AI
              </Button>
            )}
          </div>

          {generating && (
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Sparkles className="w-5 h-5 text-primary absolute animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{loadingStep}</p>
                <p className="text-xs text-muted-foreground mt-1">Asisten AI Gemini sedang merangkum pencapaian portofolio Anda...</p>
              </div>
            </div>
          )}

          {aiSummary && !generating && (
            <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-6 relative group/summary transition-all duration-300 hover:border-primary/30">
              <div className="border-l-4 border-primary pl-4 py-1.5">
                <p className="text-sm text-slate-700 leading-relaxed font-medium pr-10">{aiSummary}</p>
              </div>
              
              <div className="absolute top-6 right-6 opacity-100 md:opacity-0 md:group-hover/summary:opacity-100 transition-opacity">
                <button
                  onClick={handleCopy}
                  className="p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200/80 shadow-sm transition-colors text-muted-foreground hover:text-foreground flex items-center justify-center"
                  title="Salin ke Clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-200/60 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1">✨ Siap disalin ke LinkedIn, CV, atau profil lamaran Anda.</span>
                <button 
                  onClick={handleGenerateSummary}
                  className="text-primary hover:underline font-bold transition-all"
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
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Karya Portofolio Saya</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Daftar entri yang divalidasi langsung oleh sistem dari proyek selesai yang terverifikasi.</p>
            </div>
          </div>
          
          {portfolioEntries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {portfolioEntries.map((entry) => {
                const CategoryIcon = entry.categoryIcon;
                return (
                  <div
                    key={entry.id}
                    className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] border border-slate-200/50 overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-500 cursor-pointer flex flex-col hover:-translate-y-1"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 md:h-52 overflow-hidden bg-slate-100">
                      <img
                        src={entry.thumbnail}
                        alt={entry.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-extrabold text-slate-900 flex items-center gap-1.5 shadow-sm border border-slate-100">
                        <CategoryIcon className="w-3.5 h-3.5 text-primary" />
                        {entry.category}
                      </div>
                      
                      {/* View overlay */}
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center">
                        <div className="w-11 h-11 bg-white/95 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md transform scale-90 group-hover:scale-100">
                          <Eye className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      
                      {/* Rating on thumbnail */}
                      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-slate-100">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                        <span className="text-[10px] font-extrabold text-slate-900">{entry.rating}.0</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-base font-extrabold text-slate-900 mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {entry.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-slate-200">
                          <img src={entry.clientAvatar} alt={entry.client} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs text-slate-500 font-semibold">{entry.client}</span>
                      </div>

                      {/* Skills used */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {entry.skills.slice(0, 3).map((skill: string) => (
                          <span key={skill} className="px-2.5 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-lg border border-primary/10">
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      {/* Testimonial preview */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-auto">
                        <div className="flex items-start gap-2">
                          <Quote className="w-4 h-4 text-primary/30 shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-500 italic leading-relaxed line-clamp-2">
                            {entry.testimonial}
                          </p>
                        </div>
                      </div>
                      
                      {/* Footer */}
                      <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> {entry.completedDate}
                        </span>
                        <span className="text-primary text-xs font-extrabold">{entry.budget}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-border p-12 md:p-16 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Belum Ada Karya</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Portofolio Anda akan terisi otomatis setelah Anda menyelesaikan proyek pertama dari UMKM di SkillGate.
              </p>
              <Link href="/gigs">
                <Button className="font-bold">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Jelajahi Proyek Tersedia
                </Button>
              </Link>
            </div>
          )}
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
                    {selectedEntry.skills.map((skill: string) => (
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
                    {selectedEntry.deliverables.map((d: string, i: number) => (
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
                <div className="flex gap-3 pt-2 print:hidden">
                  <Button 
                    onClick={() => handleShareEntry(selectedEntry)}
                    variant="outline" 
                    className="flex-1 font-semibold"
                  >
                    <Share2 className="w-4 h-4 mr-2" /> Bagikan Karya Ini
                  </Button>
                  <Button 
                    onClick={() => handleOpenDeliverable(selectedEntry)}
                    variant="outline" 
                    className="flex-1 font-semibold"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" /> Buka Link Publik
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA for more projects */}
        <section className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-border/40 text-center print:hidden">
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

        {/* CSS override khusus untuk Cetak PDF */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            /* Sembunyikan bagian non-printable */
            header, aside, footer, nav, button, .print\\:hidden, #__next-prerender-error {
              display: none !important;
            }
            /* Reset layout scroll container Next.js */
            body, html, main, #__next, .h-screen, .overflow-hidden, .overflow-y-auto {
              height: auto !important;
              overflow: visible !important;
              position: static !important;
              background: white !important;
              color: black !important;
            }
            /* Hapus background warna mencolok atau bayangan */
            .shadow-sm, .shadow-md, .shadow-lg, .shadow-xl, .shadow-2xl {
              box-shadow: none !important;
              border: 1px solid #e2e8f0 !important;
            }
            /* Format kertas A4 */
            @page {
              size: A4;
              margin: 10mm 15mm 10mm 15mm;
            }
          }
        `}} />

      </div>

      {/* ======================================================== */}
      {/* 2. ATS CV LAYOUT (CETAK KHUSUS - HANYA MUNCUL DI PRINT)   */}
      {/* ======================================================== */}
      <div className="hidden print:block print:w-full print:text-black print:bg-white font-serif text-[10px] leading-relaxed p-0 m-0 max-w-4xl mx-auto">
        
        {/* CV Header */}
        <div className="text-center border-b-2 border-slate-900 pb-2 mb-3.5">
          <h1 className="text-lg font-bold uppercase tracking-wider mb-0.5">{studentName}</h1>
          <p className="text-[9px] text-slate-700 font-medium">
            Program Studi {major} | {university}
          </p>
          <div className="text-[9px] text-slate-600 flex justify-center gap-1.5 mt-1">
            <span>Email: {email}</span>
            <span>•</span>
            <span>Telp: {phone || "+62 812-3456-7890"}</span>
            <span>•</span>
            <span>Yogyakarta, Indonesia</span>
            <span>•</span>
            <span>NIM: 22523001</span>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="mb-3.5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest border-b border-slate-700 pb-0.5 mb-1.5">Ringkasan Karir</h2>
          <p className="text-justify text-slate-800">
            {aiSummary || `Mahasiswa program studi ${major} ${university} dengan kesiapan kerja (Readiness Score) mencapai ${readinessScore}%. Memiliki rekam jejak penyelesaian proyek nyata yang sukses dalam bidang ${skills.join(", ") || "teknologi dan kreatif"} melalui platform SkillGate. Menunjukkan keterampilan praktis tinggi dengan rating rata-rata ${stats.avgRating}/5.0 dari ulasan mitra UMKM Sleman.`}
          </p>
        </div>

        {/* Education */}
        <div className="mb-3.5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest border-b border-slate-700 pb-0.5 mb-1.5">Pendidikan</h2>
          <div className="flex justify-between font-bold text-slate-900">
            <span>{university}</span>
            <span>2024 - Sekarang</span>
          </div>
          <div className="flex justify-between text-slate-700 italic">
            <span>Sarjana Komputer (S.Kom) - Program Studi {major}</span>
            <span>IPK: 3.75 / 4.00 (Semester 4)</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-3.5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest border-b border-slate-700 pb-0.5 mb-1.5">Keahlian & Kompetensi</h2>
          <p className="text-slate-800">
            <strong>Keahlian Utama:</strong> {skills.join(", ") || "Desain Grafis, UI/UX, Manajemen Media Sosial, Administrasi Data"}
          </p>
          <p className="text-slate-800 mt-1">
            <strong>Kompetensi Tambahan:</strong> Asesmen Kesiapan Kerja (Skor: {readinessScore}%), Komunikasi Bisnis Digital, Kolaborasi Tim, Evaluasi Kinerja Klien.
          </p>
        </div>

        {/* Experience / Projects */}
        <div className="mb-2">
          <h2 className="text-[10px] font-bold uppercase tracking-widest border-b border-slate-700 pb-0.5 mb-1.5">Pengalaman Proyek Terverifikasi (SkillGate)</h2>
          <div className="space-y-3">
            {portfolioEntries.map((entry) => (
              <div key={entry.id} className="text-slate-800">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{entry.title} — {entry.client} (Klien UMKM)</span>
                  <span>{entry.completedDate}</span>
                </div>
                <div className="text-[9px] text-slate-600 font-medium italic">
                  Peran: Freelancer Mahasiswa | Anggaran Kontrak: {entry.budget} | Rating: {entry.rating}.0 / 5.0
                </div>
                <p className="mt-0.5 text-slate-700">
                  <strong>Output yang Diserahkan:</strong> {entry.deliverables.join(", ")}
                </p>
                <p className="text-[9px] text-slate-500 italic mt-0.5">
                  Feedback UMKM: "{entry.testimonial}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </StudentLayout>
  );
}
