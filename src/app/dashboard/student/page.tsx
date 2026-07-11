"use client";

import Link from "next/link";
import { StudentLayout } from "@/components/layout/StudentLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Compass, Briefcase, CheckCircle2, BrainCircuit, Wallet,
  Timer, Rocket, ArrowRight, Star, Clock, PlayCircle, GraduationCap, Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface StudentProfile {
  readiness_score: number;
  projects_completed: number;
  total_earned: number;
  rating_avg: number;
  skills: string[];
}

interface ActiveGig {
  id: string;
  title: string;
  deadline: string;
  progress_percent: number;
  umkm: { full_name: string; umkm_profiles: { business_name: string }[] };
}

interface RecommendedGig {
  id: string;
  title: string;
  category: string;
  budget: number;
  skills_required: string[];
  umkm: { full_name: string; umkm_profiles: { business_name: string }[] };
}

interface Review {
  rating: number;
  comment: string;
  gig: { title: string };
  reviewer: { full_name: string; umkm_profiles: { business_name: string }[] };
}

const MOCK = {
  name: "Andi",
  activeProjects: 1,
  completedProjects: 3,
  readinessScore: 78,
  totalEarned: 750000,
};

function formatRupiah(amount: number): string {
  if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1).replace('.0', '')}M`;
  if (amount >= 1000) return `Rp ${Math.round(amount / 1000)}K`;
  return `Rp ${amount}`;
}

function getDaysLeft(deadline: string): number {
  const now = new Date();
  const dl = new Date(deadline);
  const diff = Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export default function StudentDashboardPage() {
  const [userName, setUserName] = useState(MOCK.name);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [activeGigs, setActiveGigs] = useState<ActiveGig[]>([]);
  const [recommendedGigs, setRecommendedGigs] = useState<RecommendedGig[]>([]);
  const [latestReviews, setLatestReviews] = useState<Review[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalEarnedSum, setTotalEarnedSum] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      // Fetch user name
      const { data: userData } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id)
        .single();
      
      if (userData) {
        setUserName(userData.full_name.split(" ")[0] || MOCK.name);
      }

      // Fetch student profile
      const { data: profileData } = await supabase
        .from("student_profiles")
        .select("readiness_score, projects_completed, total_earned, rating_avg, skills")
        .eq("user_id", user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData as StudentProfile);
      }

      // Fetch completed gigs dynamically to guarantee sync with portfolio and projects sections
      const { data: completedData } = await supabase
        .from("gigs")
        .select("budget")
        .eq("accepted_student_id", user.id)
        .eq("status", "completed");

      if (completedData) {
        setCompletedCount(completedData.length);
        const sum = completedData.reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0);
        setTotalEarnedSum(sum);
      }

      // Fetch active gigs (where student is accepted)
      const { data: activeData } = await supabase
        .from("gigs")
        .select(`
          id, title, deadline, progress_percent,
          umkm:umkm_id (full_name, umkm_profiles (business_name))
        `)
        .eq("accepted_student_id", user.id)
        .eq("status", "in_progress");

      if (activeData) {
        setActiveGigs(activeData as unknown as ActiveGig[]);
      }

      // Fetch recommended open gigs based on skills
      const { data: recData } = await supabase
        .from("gigs")
        .select(`
          id, title, category, budget, skills_required,
          umkm:umkm_id (full_name, umkm_profiles (business_name))
        `)
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(3);

      if (recData) {
        setRecommendedGigs(recData as unknown as RecommendedGig[]);
      }

      // Fetch latest reviews for student
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select(`
          rating, comment,
          gig:gig_id (title),
          reviewer:reviewer_id (full_name, umkm_profiles (business_name))
        `)
        .eq("reviewee_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (reviewsData) {
        setLatestReviews(reviewsData as unknown as Review[]);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  const stats = {
    activeProjects: activeGigs.length,
    completedProjects: completedCount,
    readinessScore: profile?.readiness_score ?? MOCK.readinessScore,
    totalEarned: totalEarnedSum,
  };

  const calculateProjectMatch = (gigSkills: string[]) => {
    const studentSkills = profile?.skills || [];
    if (studentSkills.length === 0 || gigSkills.length === 0) return 0;
    const matching = gigSkills.filter(s => 
      studentSkills.some(ss => ss.toLowerCase().trim() === s.toLowerCase().trim())
    );
    return Math.round((matching.length / gigSkills.length) * 100);
  };

  const activeGig = activeGigs[0];
  const activeGigUmkm = activeGig?.umkm?.umkm_profiles?.[0]?.business_name || "UMKM";
  const activeGigDaysLeft = activeGig ? getDaysLeft(activeGig.deadline) : 0;
  const activeProgress = activeGig?.progress_percent ?? 0;

  return (
    <StudentLayout>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-12">
        
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">Halo, {userName}! 👋</h1>
            <p className="text-lg text-muted-foreground">
              Siap untuk mengembangkan keterampilanmu hari ini? Kamu memiliki {stats.activeProjects} proyek aktif.
            </p>
          </div>
          <Link href="/gigs" className={buttonVariants({ className: "px-6 py-6 text-base font-semibold shadow-md hover:shadow-lg transition-all rounded-xl" })}>
            <Compass className="w-5 h-5 mr-2" />
            Cari Proyek Baru
          </Link>
        </section>

        {/* Quick Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Stat 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Briefcase className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold">Proyek Aktif</span>
            </div>
            <div className="text-4xl font-bold text-foreground">{stats.activeProjects}</div>
          </div>
          
          {/* Stat 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold">Proyek Selesai</span>
            </div>
            <div className="text-4xl font-bold text-foreground">{stats.completedProjects}</div>
          </div>
          
          {/* Stat 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <BrainCircuit className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-semibold">Skor Kesiapan</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">{stats.readinessScore}%</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+5%</span>
            </div>
          </div>
          
          {/* Stat 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Wallet className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-semibold">Honorarium</span>
            </div>
            <div className="text-4xl font-bold text-foreground">{formatRupiah(stats.totalEarned)}</div>
          </div>
        </section>

        {/* Bento Grid Layout for Main Content */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Active Projects */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/40 flex flex-col">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6 border-b border-border/30 pb-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Rocket className="w-6 h-6 text-primary" />
                Proyek Berjalan ({activeGigs.length})
              </h2>
            </div>
            
            {activeGigs.length > 0 ? (
              <div className="space-y-6 flex-grow overflow-y-auto max-h-[450px] pr-2">
                {activeGigs.map((project) => {
                  const bizName = project.umkm?.umkm_profiles?.[0]?.business_name || "UMKM";
                  const daysLeft = getDaysLeft(project.deadline);
                  const progress = project.progress_percent ?? 0;

                  return (
                    <div key={project.id} className="p-5 rounded-2xl border border-border/50 bg-muted/5 hover:bg-white hover:shadow-sm transition-all flex flex-col gap-4">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-foreground leading-tight">
                            {project.title}
                          </h3>
                          <p className="text-xs font-semibold text-muted-foreground mt-1">
                            UMKM: <span className="text-slate-800">{bizName}</span>
                          </p>
                        </div>
                        <span className="bg-destructive/10 text-destructive text-xs font-bold py-1 px-2.5 rounded-md flex items-center gap-1">
                          <Timer className="w-3.5 h-3.5" /> {daysLeft} hari lagi
                        </span>
                      </div>

                      <div>
                        <div className="mb-1 flex justify-between items-end text-xs font-semibold">
                          <span className="text-muted-foreground">Progress Pekerjaan</span>
                          <span className="text-primary">{progress}% Selesai</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-1 pt-3 border-t border-border/20">
                        <Link href={`/student/proyek/${project.id}`} className={buttonVariants({ size: "sm", className: "font-bold px-4 rounded-lg" })}>
                          Update Progress
                        </Link>
                        <Link href="/chat" className={buttonVariants({ variant: "outline", size: "sm", className: "font-bold px-4 rounded-lg" })}>
                          Chat Klien
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center py-12 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground opacity-40 mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">Belum ada proyek berjalan</h3>
                <p className="text-muted-foreground max-w-sm mb-6">Kamu belum memiliki proyek berjalan saat ini. Silakan cari proyek baru di Gig Board.</p>
                <Link href="/gigs" className={buttonVariants({ className: "font-bold rounded-xl shadow-md" })}>
                  Jelajahi Gig Board
                </Link>
              </div>
            )}
          </div>
          
          {/* Learning Path */}
          <div className="lg:col-span-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 md:p-8 shadow-sm border border-primary/20 flex flex-col relative overflow-hidden group">
            {/* Decorative Element */}
            <div className="absolute -right-6 -top-6 text-primary/10 rotate-12 group-hover:rotate-6 transition-transform duration-500">
              <GraduationCap className="w-40 h-40" />
            </div>
            
            <div className="relative z-10 flex-grow flex flex-col">
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <Compass className="w-6 h-6" />
                Jalur Belajarmu
              </h2>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 mb-4 border border-white">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-primary text-xs font-bold uppercase tracking-wider">Level 3: Expert</span>
                  <span className="text-xs font-bold text-slate-700">75 / 100 XP</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-4 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
                </div>

                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2 block border-t border-border/20 pt-3">Modul Rekomendasi Selanjutnya</span>
                <h3 className="text-base font-bold text-foreground mb-2 leading-tight">Manajemen Proyek & Negosiasi</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">Tingkatkan efisiensi kerja digital dan selesaikan proyek tepat waktu dengan teknik modern.</p>
                <div className="flex items-center gap-3 text-muted-foreground text-xs font-semibold">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 2 Jam</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><PlayCircle className="w-4 h-4" /> 5 Video</span>
                </div>
              </div>
              
              <Link href="/student/jalur-belajar" className={buttonVariants({ className: "w-full font-semibold mt-auto shadow-sm" })}>
                Lanjutkan Belajar <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
          
        </section>

        {/* Bottom Section: Recommendations & Feedback */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Recommended Gigs */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500" />
                Rekomendasi Proyek
              </h2>
              <Link href="/gigs" className="text-sm font-semibold text-primary hover:underline">Lihat Semua</Link>
            </div>
            
            <div className="flex flex-col gap-4">
              {recommendedGigs.length > 0 ? (
                recommendedGigs.map((gig, index) => {
                  const bizName = gig.umkm?.umkm_profiles?.[0]?.business_name || "UMKM";
                  const matchPercent = calculateProjectMatch(gig.skills_required);
                  const iconBg = index === 0 ? "bg-primary/10" : "bg-emerald-50";
                  const iconColor = index === 0 ? "text-primary" : "text-emerald-600";

                  return (
                    <Link key={gig.id} href={`/gigs/${gig.id}`} className="bg-white rounded-2xl p-5 shadow-sm border border-border/40 hover:shadow-md hover:border-primary/30 transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center cursor-pointer group">
                      <div className={`w-16 h-16 rounded-xl ${iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                        <span className={`text-3xl font-bold ${iconColor}`}>
                          {gig.category === "Desain Grafis" ? "🎨" : gig.category === "Fotografi" ? "📸" : gig.category === "Media Sosial" ? "📱" : "📊"}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{gig.title}</h3>
                          {profile?.skills && gig.skills_required && (
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              matchPercent >= 75 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                : matchPercent >= 40 
                                ? "bg-amber-50 text-amber-700 border-amber-200" 
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}>
                              {matchPercent}% Match
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{bizName}</p>
                        
                        {/* Skills alignment */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {gig.skills_required.slice(0, 3).map((skill) => {
                            const isMatch = (profile?.skills || []).some(s => s.toLowerCase().trim() === skill.toLowerCase().trim());
                            return (
                              <span 
                                key={skill} 
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                                  isMatch 
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                    : "bg-muted text-muted-foreground border-transparent"
                                }`}
                              >
                                {skill}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/30 shrink-0">
                        <div className="text-lg font-bold text-primary mb-2">Rp {gig.budget.toLocaleString("id-ID")}</div>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto font-semibold">Lihat Detail</Button>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-center text-slate-500 py-8 bg-white border border-border/40 rounded-2xl">Tidak ada rekomendasi proyek saat ini.</p>
              )}
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500 fill-current" />
                Ulasan Terbaru
              </h2>
              {userId && (
                <Link href={`/profile/${userId}`} className="text-sm font-semibold text-primary hover:underline">
                  Lihat Semua
                </Link>
              )}
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40 flex-grow flex flex-col gap-6 overflow-y-auto max-h-[480px]">
              {latestReviews.length > 0 ? (
                latestReviews.map((review, idx) => (
                  <div key={idx} className="flex flex-col gap-3 pb-5 border-b border-border/30 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 overflow-hidden shrink-0 border border-border flex items-center justify-center">
                        <span className="text-sm font-bold text-secondary">
                          {review.reviewer?.full_name?.[0] || "D"}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-foreground">
                          {review.reviewer?.full_name}
                        </div>
                        <div className="text-[10px] font-medium text-muted-foreground leading-tight">
                          Pemilik &quot;{review.reviewer?.umkm_profiles?.[0]?.business_name || "UMKM"}&quot;
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex text-amber-500">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-xs text-foreground italic">
                      &quot;{review.comment}&quot;
                    </p>
                    
                    <div className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1 mt-1">
                      <Briefcase className="w-3.5 h-3.5" /> Proyek: {review.gig?.title}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center flex-grow py-8 text-center text-muted-foreground">
                  <Star className="w-8 h-8 opacity-40 mb-2" />
                  <p className="text-sm">Belum ada ulasan saat ini.</p>
                </div>
              )}
            </div>
          </div>
          
        </section>

      </div>
    </StudentLayout>
  );
}
