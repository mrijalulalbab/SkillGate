"use client";

import Link from "next/link";
import { UmkmLayout } from "@/components/layout/UmkmLayout";
import { buttonVariants } from "@/components/ui/button";
import {
  FolderKanban, CheckCircle2, Wallet, Users,
  PlusCircle, ArrowRight, Star, Clock, AlertCircle, Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface UmkmStats {
  activeProjects: number;
  waitingApplicants: number;
  completedProjects: number;
  totalSpent: number;
}

interface Applicant {
  id: string;
  cover_letter: string;
  created_at: string;
  gig: { id: string; title: string; skills_required?: string[] };
  student: {
    id: string;
    full_name: string;
    student_profiles: {
      rating_avg: number;
      major: string;
      readiness_score: number;
      skills: string[];
      university: string;
    }[];
  };
}

interface ActiveProject {
  id: string;
  title: string;
  category: string;
  deadline: string;
  progress_percent: number;
}

const MOCK_STATS = {
  activeProjects: 2,
  waitingApplicants: 3,
  completedProjects: 5,
  totalSpent: 1200000,
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

function calculateMatchScore(gig: any, app: any) {
  if (!gig) return 0;
  const gigSkills = gig.skills_required || [];
  const sProfile = Array.isArray(app.student?.student_profiles)
    ? app.student?.student_profiles?.[0]
    : app.student?.student_profiles;

  const studentSkills = sProfile?.skills || [];
  
  // 1. Skills Matching (40%)
  let skillMatchScore = 0;
  if (gigSkills.length > 0) {
    const matchingSkills = gigSkills.filter((skill: string) => 
      studentSkills.some((sSkill: string) => sSkill.toLowerCase().trim() === skill.toLowerCase().trim())
    );
    skillMatchScore = (matchingSkills.length / gigSkills.length) * 40;
  } else {
    skillMatchScore = 40; 
  }

  // 2. Readiness Score (35%)
  const readiness = sProfile?.readiness_score || 0;
  const readinessMatchScore = (readiness / 100) * 35;

  // 3. Rating Average (25%)
  const rating = Number(sProfile?.rating_avg || 5.0);
  const ratingMatchScore = (rating / 5.0) * 25;

  return Math.round(skillMatchScore + readinessMatchScore + ratingMatchScore);
}

export default function UmkmDashboardPage() {
  const [userName, setUserName] = useState("Bu Darmi");
  const [stats, setStats] = useState<UmkmStats | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUmkmDashboardData();
  }, []);

  async function loadUmkmDashboardData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch user name
      const { data: userData } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id)
        .single();
      
      if (userData) {
        setUserName(userData.full_name.split(" ")[0] || "Bu Darmi");
      }

      // Fetch UMKM profile stats
      const { data: profileData } = await supabase
        .from("umkm_profiles")
        .select("projects_posted, rating_avg, total_spent")
        .eq("user_id", user.id)
        .single();

      // Fetch active & completed counts dynamically
      const { data: gigsCount } = await supabase
        .from("gigs")
        .select("id, status")
        .eq("umkm_id", user.id);

      const activeCount = gigsCount?.filter(g => g.status === 'in_progress').length || 0;
      const completedCount = gigsCount?.filter(g => g.status === 'completed').length || 0;

      // Fetch pending applicants dynamically
      const { data: appsData } = await supabase
        .from("applications")
        .select(`
          id, cover_letter, created_at, student_id,
          gig:gig_id (id, title, umkm_id, skills_required),
          student:student_id (
            id, full_name,
            student_profiles (rating_avg, major, readiness_score, skills, university)
          )
        `)
        .eq("status", "pending");

      // Filter applications that belong to this UMKM's gigs
      const filteredApps = (appsData || []).filter((app: any) => app.gig?.umkm_id === user.id);

      // Normalize student_profiles to array format
      const normalizedApps = filteredApps.map((app: any) => {
        if (app.student && app.student.student_profiles) {
          const profiles = app.student.student_profiles;
          app.student.student_profiles = Array.isArray(profiles) ? profiles : [profiles];
        }
        return app;
      });

      setApplicants(normalizedApps as unknown as Applicant[]);

      setStats({
        activeProjects: activeCount,
        waitingApplicants: filteredApps.length,
        completedProjects: completedCount,
        totalSpent: profileData ? Number(profileData.total_spent) : 0
      });

      // Fetch active projects
      const { data: activeGigs } = await supabase
        .from("gigs")
        .select("id, title, category, deadline, progress_percent")
        .eq("umkm_id", user.id)
        .eq("status", "in_progress");

      if (activeGigs) {
        setActiveProjects(activeGigs as unknown as ActiveProject[]);
      }

    } catch (err) {
      console.error("Failed to load UMKM dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <UmkmLayout>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        </div>
      </UmkmLayout>
    );
  }

  const finalStats = {
    activeProjects: stats?.activeProjects ?? 0,
    waitingApplicants: stats?.waitingApplicants ?? 0,
    completedProjects: stats?.completedProjects ?? 0,
    totalSpent: stats?.totalSpent ?? 0
  };

  const mainProject = activeProjects[0];
  const mainProjectDaysLeft = mainProject ? getDaysLeft(mainProject.deadline) : 0;

  return (
    <UmkmLayout>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-12">
        
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">Halo, {userName}! 👋</h1>
            <p className="text-lg text-muted-foreground">
              Selamat datang di Dashboard UMKM. Anda memiliki {finalStats.waitingApplicants} pelamar baru yang menunggu direview.
            </p>
          </div>
          <Link href="/umkm/buat-proyek" className={buttonVariants({ variant: "secondary", className: "px-6 py-6 text-base font-semibold shadow-md hover:shadow-lg transition-all rounded-xl" })}>
            <PlusCircle className="w-5 h-5 mr-2" />
            Buat Proyek Baru
          </Link>
        </section>

        {/* Quick Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Stat 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FolderKanban className="w-5 h-5 text-secondary" />
              <span className="text-sm font-semibold">Proyek Aktif</span>
            </div>
            <div className="text-4xl font-bold text-foreground">{finalStats.activeProjects}</div>
          </div>
          
          {/* Stat 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-semibold">Pelamar Menunggu</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">{finalStats.waitingApplicants}</span>
              {finalStats.waitingApplicants > 0 && (
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Perlu review</span>
              )}
            </div>
          </div>
          
          {/* Stat 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold">Proyek Selesai</span>
            </div>
            <div className="text-4xl font-bold text-foreground">{finalStats.completedProjects}</div>
          </div>
          
          {/* Stat 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Wallet className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-semibold">Total Pengeluaran</span>
            </div>
            <div className="text-4xl font-bold text-foreground">{formatRupiah(finalStats.totalSpent)}</div>
          </div>
        </section>

        {/* Bento Grid Layout for Main Content */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Pelamar Terbaru */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/40 flex flex-col">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Users className="w-6 h-6 text-amber-500" />
                Pelamar Terbaru
              </h2>
              <Link href="/umkm/proyek" className="text-sm font-semibold text-secondary hover:underline">
                Lihat Semua
              </Link>
            </div>
            
            <div className="space-y-4 flex-grow">
              {applicants.length > 0 ? (
                applicants.map((app) => {
                  const sProfile = app.student?.student_profiles?.[0];
                  const rating = sProfile?.rating_avg || 5.0;
                  const readiness = sProfile?.readiness_score || 0;
                  const major = sProfile?.major || "Mahasiswa";
                  const university = sProfile?.university || "UII";
                  const matchScore = calculateMatchScore(app.gig, app);

                  return (
                    <div key={app.id} className="p-5 rounded-2xl border border-border/50 hover:border-secondary/35 bg-muted/10 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 overflow-hidden shrink-0 border border-primary/20 flex items-center justify-center">
                            <span className="font-bold text-lg text-primary">{(app.student?.full_name || "?")[0]}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-base text-foreground leading-tight">{app.student?.full_name}</h3>
                            <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                              {major} • {university}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                              <span className="font-semibold text-slate-700">Proyek:</span>
                              <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                                {app.gig?.title || "Proyek"}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:ml-auto shrink-0 w-full sm:w-auto">
                          <Link href={`/umkm/proyek/${app.gig?.id}`} className={buttonVariants({ variant: "secondary", size: "sm", className: "w-full sm:w-auto font-bold py-5 px-4 rounded-xl" })}>
                            Tinjau Pelamar
                          </Link>
                        </div>
                      </div>
                      
                      {/* Metric Badges Row */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30 mt-1">
                        {/* Match Score Badge */}
                        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border ${
                          matchScore >= 80 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : matchScore >= 60 
                            ? "bg-amber-50 text-amber-700 border-amber-200" 
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}>
                          <span>Kecocokan:</span>
                          <strong>{matchScore}% Match</strong>
                        </div>

                        {/* Readiness Score Badge */}
                        <div className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border bg-blue-50 text-blue-700 border-blue-200">
                          <span>Kesiapan Kerja:</span>
                          <strong>{readiness}%</strong>
                        </div>

                        {/* Rating Badge */}
                        <div className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border bg-amber-50 text-amber-700 border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                          <span>Rating:</span>
                          <strong>{Number(rating).toFixed(1)}/5.0</strong>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground flex-grow">
                  <Users className="w-12 h-12 opacity-35 mb-3" />
                  <p className="text-sm font-semibold">Belum ada pelamar baru saat ini.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Proyek Berjalan */}
          <div className="lg:col-span-5 bg-gradient-to-br from-secondary/10 to-transparent rounded-2xl p-6 md:p-8 shadow-sm border border-secondary/20 flex flex-col relative overflow-hidden">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2 relative z-10">
              <FolderKanban className="w-6 h-6 text-secondary" />
              Proyek Berjalan
            </h2>
            
            {activeProjects.length > 0 ? (
              <div className="space-y-4 relative z-10 flex-grow overflow-y-auto max-h-[500px]">
                {activeProjects.map((project) => {
                  const daysLeft = getDaysLeft(project.deadline);
                  return (
                    <div key={project.id} className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-white shadow-sm flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                          {project.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-destructive bg-destructive/10 px-2 py-1 rounded-md">
                          <Clock className="w-3 h-3" /> {daysLeft} hari lagi
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-4 leading-tight">
                        {project.title}
                      </h3>
                      
                      <div className="mt-auto">
                        <div className="mb-2 flex justify-between items-end">
                          <span className="text-xs font-semibold text-foreground">Progress dari Freelancer</span>
                          <span className="text-xs font-bold text-secondary">{project.progress_percent}% Selesai</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 mb-5 overflow-hidden">
                          <div className="bg-secondary h-full rounded-full" style={{ width: `${project.progress_percent}%` }}></div>
                        </div>
                        
                        <Link href={`/umkm/proyek/${project.id}`} className={buttonVariants({ variant: "outline", className: "w-full font-semibold border-secondary/30 text-secondary hover:bg-secondary/10" })}>
                          Cek Ruang Kerja <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white shadow-sm relative z-10 flex-grow flex flex-col items-center justify-center text-center text-muted-foreground">
                <FolderKanban className="w-10 h-10 opacity-35 mb-3" />
                <p className="text-sm font-semibold mb-4">Belum ada proyek berjalan saat ini.</p>
                <Link href="/umkm/buat-proyek" className={buttonVariants({ variant: "secondary", size: "sm", className: "font-semibold" })}>Buat Proyek Baru</Link>
              </div>
            )}
          </div>
          
        </section>

      </div>
    </UmkmLayout>
  );
}
