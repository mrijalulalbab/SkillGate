"use client";

import { StudentLayout } from "@/components/layout/StudentLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { 
  FolderKanban, Clock, CheckCircle2, 
  ChevronRight, Calendar, Star, PlayCircle, Loader2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const tabs = ["Semua", "Menunggu", "Dalam Proses", "Selesai"];

interface MyProject {
  id: string;
  title: string;
  status: "Menunggu" | "Dalam Proses" | "Selesai";
  progress: number;
  budget: number;
  deadline: string;
  type: string;
  client: string;
  rating?: number;
}

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function getDeadlineLabel(deadline: string): string {
  const now = new Date();
  const dl = new Date(deadline);
  const diffMs = dl.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Sudah lewat";
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Besok";
  return `${diffDays} hari lagi`;
}

export default function ProyekSayaPage() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [projects, setProjects] = useState<MyProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyProjects();
  }, []);

  async function loadMyProjects() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const allProjects: MyProject[] = [];

      // 1. Fetch "Menunggu" — pending applications
      const { data: pendingApps } = await supabase
        .from("applications")
        .select(`
          id, gig_id, status,
          gig:gig_id (
            id, title, category, budget, deadline,
            umkm:umkm_id (
              full_name,
              umkm_profiles (business_name)
            )
          )
        `)
        .eq("student_id", user.id)
        .eq("status", "pending");

      if (pendingApps) {
        for (const app of pendingApps as any[]) {
          const gig = app.gig;
          if (!gig) continue;
          const businessName = gig.umkm?.umkm_profiles?.[0]?.business_name || gig.umkm?.full_name || "UMKM";
          allProjects.push({
            id: gig.id,
            title: gig.title,
            status: "Menunggu",
            progress: 0,
            budget: gig.budget,
            deadline: gig.deadline,
            type: gig.category,
            client: businessName,
          });
        }
      }

      // 2. Fetch "Dalam Proses" — accepted and in_progress gigs
      const { data: activeGigs } = await supabase
        .from("gigs")
        .select(`
          id, title, category, budget, deadline, progress_percent,
          umkm:umkm_id (
            full_name,
            umkm_profiles (business_name)
          )
        `)
        .eq("accepted_student_id", user.id)
        .eq("status", "in_progress");

      if (activeGigs) {
        for (const gig of activeGigs as any[]) {
          const businessName = gig.umkm?.umkm_profiles?.[0]?.business_name || gig.umkm?.full_name || "UMKM";
          allProjects.push({
            id: gig.id,
            title: gig.title,
            status: "Dalam Proses",
            progress: gig.progress_percent || 0,
            budget: gig.budget,
            deadline: gig.deadline,
            type: gig.category,
            client: businessName,
          });
        }
      }

      // 3. Fetch "Selesai" — completed gigs
      const { data: completedGigs } = await supabase
        .from("gigs")
        .select(`
          id, title, category, budget, deadline,
          umkm:umkm_id (
            full_name,
            umkm_profiles (business_name)
          )
        `)
        .eq("accepted_student_id", user.id)
        .eq("status", "completed");

      if (completedGigs) {
        for (const gig of completedGigs as any[]) {
          const businessName = gig.umkm?.umkm_profiles?.[0]?.business_name || gig.umkm?.full_name || "UMKM";
          
          // Fetch review rating if exists
          const { data: review } = await supabase
            .from("reviews")
            .select("rating")
            .eq("gig_id", gig.id)
            .eq("reviewee_id", user.id)
            .maybeSingle();

          allProjects.push({
            id: gig.id,
            title: gig.title,
            status: "Selesai",
            progress: 100,
            budget: gig.budget,
            deadline: gig.deadline,
            type: gig.category,
            client: businessName,
            rating: review?.rating,
          });
        }
      }

      setProjects(allProjects);
    } catch (e) {
      console.error("Error loading my projects:", e);
    } finally {
      setLoading(false);
    }
  }

  const filteredProjects = projects.filter(p => activeTab === "Semua" || p.status === activeTab);

  return (
    <StudentLayout>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
        
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 flex items-center gap-3">
            <FolderKanban className="w-8 h-8 md:w-12 md:h-12 text-primary" />
            Proyek Saya
          </h1>
          <p className="text-lg text-muted-foreground">Kelola semua proposal dan proyek micro-gig Anda di sini.</p>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-border/40 mb-8 pb-px">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {tab}
              {tab !== "Semua" && (
                <span className="ml-2 text-xs bg-muted rounded-full px-2 py-0.5">
                  {projects.filter(p => p.status === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Project List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border">
                <FolderKanban className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-foreground mb-2">Belum ada proyek di sini</h3>
                <p className="text-muted-foreground mb-6">Anda belum memiliki proyek dengan status {activeTab}.</p>
                <Link href="/gigs" className={buttonVariants()}>Cari Proyek Baru</Link>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div key={`${project.id}-${project.status}`} className="bg-white rounded-2xl shadow-sm border border-border/40 overflow-hidden flex flex-col md:flex-row">
                  
                  {/* Status indicator strip */}
                  <div className={`w-full md:w-2 shrink-0 h-2 md:h-auto ${
                    project.status === "Dalam Proses" ? "bg-primary" :
                    project.status === "Menunggu" ? "bg-amber-500" :
                    "bg-emerald-500"
                  }`} />

                  <div className="p-6 md:p-8 flex-1 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
                    
                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                          {project.type}
                        </span>
                        {project.status === "Dalam Proses" && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                            <PlayCircle className="w-3 h-3" /> Dalam Proses
                          </span>
                        )}
                        {project.status === "Menunggu" && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Menunggu Review
                          </span>
                        )}
                        {project.status === "Selesai" && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Selesai
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-1">{project.title}</h3>
                      <p className="text-sm font-medium text-muted-foreground mb-4">UMKM: <span className="text-foreground">{project.client}</span></p>
                      
                      {/* Progress Bar (only for Dalam Proses) */}
                      {project.status === "Dalam Proses" && (
                        <div className="max-w-md">
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-muted-foreground">Progress Pekerjaan</span>
                            <span className="text-primary">{project.progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }} />
                          </div>
                        </div>
                      )}

                      {project.status === "Selesai" && project.rating && (
                        <div className="flex items-center gap-1 text-amber-500 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < project.rating! ? "fill-current" : "opacity-30"}`} />
                          ))}
                          <span className="text-xs font-semibold text-muted-foreground ml-2">Rating dari klien</span>
                        </div>
                      )}
                    </div>

                    {/* Actions / Meta */}
                    <div className="flex flex-col md:items-end shrink-0 w-full md:w-auto gap-4 md:border-l border-border/40 md:pl-8">
                      <div className="flex md:flex-col justify-between w-full gap-4 md:text-right">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Honorarium</p>
                          <p className="text-lg font-bold text-emerald-600">{formatRupiah(project.budget)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tenggat</p>
                          <p className="text-sm font-semibold text-foreground flex items-center md:justify-end gap-1.5">
                            <Calendar className="w-4 h-4 text-muted-foreground" /> {getDeadlineLabel(project.deadline)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="w-full mt-2">
                        <Link 
                          href={project.status === "Dalam Proses" ? `/student/proyek/${project.id}` : 
                                project.status === "Menunggu" ? `/gigs/${project.id}` : "/student/portfolio"}
                          className={buttonVariants({ className: "w-full font-semibold group" })}
                        >
                          {project.status === "Dalam Proses" ? "Ruang Kerja" : 
                           project.status === "Menunggu" ? "Lihat Detail Proyek" : "Lihat Portofolio"}
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </StudentLayout>
  );
}
