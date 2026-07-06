"use client";

import { StudentLayout } from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, BrainCircuit, PlayCircle, Star, 
  ArrowRight, Award, BookOpen, Target, CheckCircle2, AlertCircle, Loader2, ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/toast-notification";

interface Course {
  title: string;
  platform: string;
  duration: string;
  level: string;
  description: string;
  externalUrl: string;
  image: string;
  weight: number;
}

const COURSES: Course[] = [
  {
    title: "Panduan Negosiasi & Komunikasi Profesional Klien UMKM",
    platform: "Medium (Career Guide)",
    duration: "15 Menit Baca",
    level: "Beginner",
    description: "Panduan komprehensif menulis pesan lamaran kerja, menyelaraskan ekspektasi harga, serta melakukan negosiasi tenggat waktu pengerjaan proyek mikro secara taktis dan sopan.",
    externalUrl: "https://medium.com/career-guides/freelancer-client-communication-best-practices",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
    weight: 5
  },
  {
    title: "Manajemen Proyek Kanban & Time-Tracking Sederhana",
    platform: "Dev.to (Agile Guide)",
    duration: "20 Menit Baca",
    level: "Intermediate",
    description: "Artikel teknis untuk membagi brief pekerjaan besar menjadi tahapan milestone mikro 25%, 50%, 75% sampai 100% menggunakan Kanban board terstruktur.",
    externalUrl: "https://dev.to/projectmanagement/how-to-manage-micro-gigs-with-kanban",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800",
    weight: 8
  },
  {
    title: "Standar Penulisan Laporan & Dokumentasi Proyek",
    platform: "Hashnode (Technical Writing)",
    duration: "15 Menit Baca",
    level: "Intermediate",
    description: "Cara menyusun lampiran laporan pekerjaan, menyertakan tangkapan layar bukti uji coba, dan melampirkan tautan repositori agar lolos audit verifikasi UMKM.",
    externalUrl: "https://hashnode.com/blog/technical-documentation-standards-for-freelancers",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
    weight: 5
  },
  {
    title: "Kontrak Kerja Digital & Legalitas Kemitraan Mandiri",
    platform: "SkillGate Academy (E-Learning)",
    duration: "10 Menit Baca",
    level: "Beginner",
    description: "Panduan memahami dokumen Surat Perjanjian Kerja (SPK), hak kekayaan intelektual (HKI) hasil kerja mahasiswa, dan tanggung jawab hukum kemitraan UMKM.",
    externalUrl: "https://skillgate.com/academy/written-contracts-and-spk-guide",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
    weight: 5
  },
  {
    title: "UI/UX Landing Page Khusus UMKM Go-Digital",
    platform: "UX Collective (UI Design)",
    duration: "30 Menit Baca",
    level: "Advanced",
    description: "Analisis psikologi warna, layout e-commerce lokal, dan desain ramah pengguna untuk industri kecil agar tingkat konversi tinggi.",
    externalUrl: "https://uxdesign.cc/designing-effective-landing-pages-for-local-businesses",
    image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&q=80&w=800",
    weight: 12
  },
  {
    title: "Dasar Copywriting Penjualan Kreatif untuk Feed IG",
    platform: "Copyblogger (Marketing)",
    duration: "25 Menit Baca",
    level: "Intermediate",
    description: "Formula AIDA (Attention, Interest, Desire, Action) untuk menulis takarir (caption) produk UMKM Sleman agar diminati pelanggan lokal.",
    externalUrl: "https://copyblogger.com/copywriting-formula-for-social-media/",
    image: "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=800",
    weight: 10
  },
  {
    title: "Teknik Fotografi Produk Mini Studio Rumahan",
    platform: "Fstoppers (Photography)",
    duration: "35 Menit Baca",
    level: "Advanced",
    description: "Pengaturan pencahayaan alami jendela, background minimalis, dan sudut foto tas/sepatu UMKM agar estetika terlihat premium.",
    externalUrl: "https://fstoppers.com/education/how-shoot-diy-product-photography",
    image: "https://images.unsplash.com/photo-1506241539120-6dc80562b7eb?auto=format&fit=crop&q=80&w=800",
    weight: 15
  },
  {
    title: "Excel & Google Sheets untuk Laporan Keuangan UMKM",
    platform: "Hubspot Academy (Finance)",
    duration: "20 Menit Baca",
    level: "Intermediate",
    description: "Rumus dasar SUM, AVERAGE, dan Pivot Tables untuk menyusun jurnal penjualan mingguan yang rapi dan mudah dibaca oleh mitra.",
    externalUrl: "https://blog.hubspot.com/marketing/how-to-use-excel-reporting",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800",
    weight: 8
  }
];

export default function JalurPembelajaranPage() {
  const [readinessScore, setReadinessScore] = useState(78);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(new Set());
  const { showToast } = useToast();

  useEffect(() => {
    fetchStudentReadiness();
  }, []);

  async function fetchStudentReadiness() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      const { data: profile } = await supabase
        .from("student_profiles")
        .select("readiness_score")
        .eq("user_id", user.id)
        .single();
      
      if (profile) {
        setReadinessScore(profile.readiness_score || 78);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleStartCourse = (course: Course) => {
    if (completedCourses.has(course.title)) return;
    
    // Open external URL in a new tab
    window.open(course.externalUrl, "_blank", "noopener,noreferrer");
    
    // Show local confirmation modal to claim score increase
    setActiveCourse(course);
    setShowConfirmModal(true);
  };

  const handleConfirmCompletion = async () => {
    if (!userId || !activeCourse) return;
    
    // Prevent double-claiming
    if (completedCourses.has(activeCourse.title)) {
      setShowConfirmModal(false);
      setActiveCourse(null);
      return;
    }
    
    try {
      const newScore = Math.min(readinessScore + activeCourse.weight, 100);
      
      // Update database readiness score
      const { error } = await supabase
        .from("student_profiles")
        .update({ readiness_score: newScore })
        .eq("user_id", userId);

      if (error) throw error;

      setReadinessScore(newScore);
      setCompletedCourses(prev => new Set(prev).add(activeCourse.title));
      showToast(`Selamat! Modul "${activeCourse.title}" selesai. Skor Kesiapan Kerja meningkat menjadi ${newScore}%!`, "success");
    } catch (e) {
      console.error("Failed to update score:", e);
      showToast("Gagal memperbarui skor kesiapan.", "error");
    } finally {
      setShowConfirmModal(false);
      setActiveCourse(null);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
        
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 md:w-12 md:h-12 text-primary" />
            Jalur Pembelajaran
          </h1>
          <p className="text-lg text-muted-foreground">Tingkatkan skor kesiapanmu untuk mendapatkan lebih banyak proyek mikro.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Readiness Score & Progress */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Overall Score Card */}
            <div className="bg-gradient-to-b from-primary/10 to-transparent rounded-3xl p-8 border border-primary/20 text-center relative overflow-hidden shadow-sm">
              <BrainCircuit className="absolute -right-6 -top-6 w-32 h-32 text-primary/5 rotate-12" />
              
              <h2 className="text-lg font-bold text-foreground mb-6 relative z-10">Skor Kesiapan Kerja</h2>
              
              <div className="relative w-40 h-40 mx-auto flex items-center justify-center mb-6 z-10">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" className="stroke-muted fill-none" strokeWidth="12" />
                  <circle 
                    cx="80" cy="80" r="70" 
                    className="stroke-primary fill-none" 
                    strokeWidth="12" 
                    strokeDasharray="440" 
                    strokeDashoffset={440 - (440 * readinessScore) / 100}
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-foreground">{readinessScore}%</span>
                </div>
              </div>
              
              <p className="text-sm font-medium text-muted-foreground relative z-10">
                Skormu lebih tinggi dari <span className="font-bold text-foreground">65%</span> mahasiswa lain di bidangmu.
              </p>
            </div>
            
            {/* Breakdown Score */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40">
              <h3 className="text-lg font-bold text-foreground mb-6">Analisis Kemampuan</h3>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span>Hard Skills (Spesialisasi)</span>
                    <span className="text-primary">85%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span>Komunikasi Profesional</span>
                    <span className="text-amber-500">60%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Perlu ditingkatkan</p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span>Manajemen Waktu</span>
                    <span className="text-emerald-500">90%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '90%' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          {/* Right Column: Recommendations */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* MOOC Recommendations */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Katalog Modul & Web Tutorial (Self-Learning)
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {COURSES.map((course) => {
                  const isCompleted = completedCourses.has(course.title);
                  return (
                    <div key={course.title} className={`bg-white rounded-2xl shadow-sm border hover:border-primary/40 transition-colors group flex flex-col h-full overflow-hidden relative ${isCompleted ? 'border-emerald-200 opacity-80' : 'border-border/40'}`}>
                      <div className={`absolute top-4 left-4 z-10 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${isCompleted ? 'bg-emerald-500' : 'bg-emerald-600'}`}>
                        {isCompleted ? '✓ Sudah Diselesaikan' : `Meningkatkan Skor +${course.weight}%`}
                      </div>
                      <div className="aspect-video w-full bg-muted overflow-hidden relative">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {!isCompleted && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-primary" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex flex-wrap gap-x-3 gap-y-1 items-center mb-2 text-xs font-semibold text-muted-foreground">
                          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.platform}</span>
                          <span>•</span>
                          <span>{course.duration}</span>
                        </div>
                        <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-6 line-clamp-3">{course.description}</p>
                        
                        <Button 
                          onClick={() => handleStartCourse(course)}
                          disabled={isCompleted}
                          className={`w-full mt-auto font-semibold flex items-center justify-center gap-2 ${isCompleted ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 cursor-default' : ''}`}
                          variant={isCompleted ? "outline" : "default"}
                        >
                          {isCompleted ? (
                            <><CheckCircle2 className="w-4 h-4" /> Sudah Diselesaikan</>
                          ) : (
                            <>Baca Artikel Tutorial <ExternalLink className="w-4 h-4" /></>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && activeCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Konfirmasi Penyelesaian Modul</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Apakah Anda sudah selesai mempelajari modul eksternal <strong>&quot;{activeCourse.title}&quot;</strong>? Konfirmasi ini akan menaikkan Skor Kesiapan Kerja Anda sebesar <strong>+{activeCourse.weight}%</strong>!
            </p>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowConfirmModal(false);
                  setActiveCourse(null);
                }}
              >
                Belum Selesai
              </Button>
              <Button 
                onClick={handleConfirmCompletion}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
              >
                Ya, Konfirmasi Selesai
              </Button>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
