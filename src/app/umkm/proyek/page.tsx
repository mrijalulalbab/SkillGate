"use client";

import { UmkmLayout } from "@/components/layout/UmkmLayout";
import { buttonVariants } from "@/components/ui/button";
import { 
  FolderKanban, PlusCircle, CheckCircle2,
  ChevronRight, Calendar, Users, PlayCircle, Loader2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const tabs = ["Semua", "Menunggu Pelamar", "Berjalan", "Selesai"];

interface Project {
  id: string;
  title: string;
  status: string;
  category: string;
  budget: number;
  deadline: string;
  progress_percent: number;
  applicant_count: number;
  student: { full_name: string } | null;
}

export default function KelolaProyekPage() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("gigs")
        .select(`
          id, title, status, category, budget, deadline, progress_percent, applicant_count,
          student:accepted_student_id (full_name)
        `)
        .eq("umkm_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      let projectsList = (data as unknown as Project[]) || [];

      // For open gigs, fetch real applicant counts from applications table
      const openGigIds = projectsList.filter(p => p.status === "open").map(p => p.id);
      if (openGigIds.length > 0) {
        const { data: appsData } = await supabase
          .from("applications")
          .select("gig_id")
          .in("gig_id", openGigIds)
          .eq("status", "pending");
        
        if (appsData) {
          // Count applications per gig
          const countMap: Record<string, number> = {};
          for (const app of appsData) {
            countMap[app.gig_id] = (countMap[app.gig_id] || 0) + 1;
          }
          // Override applicant_count with real count
          projectsList = projectsList.map(p => {
            if (p.status === "open" && countMap[p.id] !== undefined) {
              return { ...p, applicant_count: countMap[p.id] };
            }
            return p;
          });
        }
      }

      setProjects(projectsList);
    } catch (e) {
      console.error("Error loading projects:", e);
    } finally {
      setLoading(false);
    }
  }

  // Filter projects based on selected tab status
  const filteredProjects = projects.filter(p => {
    if (activeTab === "Semua") return true;
    if (activeTab === "Menunggu Pelamar") return p.status === "open";
    if (activeTab === "Berjalan") return p.status === "in_progress";
    if (activeTab === "Selesai") return p.status === "completed";
    return true;
  });

  return (
    <UmkmLayout>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
        
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8 md:mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 flex items-center gap-3">
              <FolderKanban className="w-8 h-8 md:w-12 md:h-12 text-secondary" />
              Kelola Proyek
            </h1>
            <p className="text-lg text-muted-foreground">Pantau progres, review pelamar, dan selesaikan pekerjaan.</p>
          </div>
          <Link href="/umkm/buat-proyek" className={buttonVariants({ variant: "secondary", className: "px-6 py-6 text-base font-semibold shadow-md rounded-xl" })}>
            <PlusCircle className="w-5 h-5 mr-2" />
            Buat Proyek Baru
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-border/40 mb-8 pb-px">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab 
                  ? "border-secondary text-secondary" 
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Project List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border">
            <FolderKanban className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-foreground mb-2">Belum ada proyek di sini</h3>
            <p className="text-muted-foreground mb-6">Anda belum memiliki proyek dengan status {activeTab}.</p>
            <Link href="/umkm/buat-proyek" className={buttonVariants({ variant: "secondary" })}>
              Buat Proyek Baru
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-border/40 overflow-hidden flex flex-col md:flex-row">
                
                {/* Status indicator strip */}
                <div className={`w-full md:w-2 shrink-0 h-2 md:h-auto ${
                  project.status === "in_progress" ? "bg-secondary" :
                  project.status === "open" ? "bg-amber-500" :
                  "bg-emerald-500"
                }`} />

                <div className="p-6 md:p-8 flex-1 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                        {project.category}
                      </span>
                      {project.status === "in_progress" && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary flex items-center gap-1">
                          <PlayCircle className="w-3 h-3" /> Berjalan
                        </span>
                      )}
                      {project.status === "open" && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                          <Users className="w-3 h-3" /> Menunggu Pelamar
                        </span>
                      )}
                      {project.status === "completed" && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Selesai
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-1">{project.title}</h3>
                    
                    {project.status === "open" ? (
                      <p className="text-sm font-medium text-amber-600 flex items-center gap-1 mb-4">
                        <Users className="w-4 h-4" /> {project.applicant_count || 0} Pelamar menunggu untuk direview
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-muted-foreground mb-4">
                        Dikerjakan oleh: <span className="text-foreground font-semibold">{project.student?.full_name || "N/A"}</span>
                      </p>
                    )}
                    
                    {/* Progress Bar (only for Berjalan/in_progress) */}
                    {project.status === "in_progress" && (
                      <div className="max-w-md">
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-muted-foreground">Progress dari Freelancer</span>
                          <span className="text-secondary">{project.progress_percent || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full" style={{ width: `${project.progress_percent || 0}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions / Meta */}
                  <div className="flex flex-col md:items-end shrink-0 w-full md:w-auto gap-4 md:border-l border-border/40 md:pl-8">
                    <div className="flex md:flex-col justify-between w-full gap-4 md:text-right">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Honorarium</p>
                        <p className="text-lg font-bold text-foreground">Rp {project.budget.toLocaleString("id-ID")}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tenggat</p>
                        <p className="text-sm font-semibold text-foreground flex items-center md:justify-end gap-1.5">
                          <Calendar className="w-4 h-4 text-muted-foreground" /> {new Date(project.deadline).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full mt-2">
                      <Link href={`/umkm/proyek/${project.id}`} className={buttonVariants({ variant: project.status === "open" ? "secondary" : "outline", className: "w-full font-semibold group" })}>
                        {project.status === "in_progress" ? "Ruang Kerja" : 
                         project.status === "open" ? "Tinjau Pelamar" : "Lihat Detail"}
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </UmkmLayout>
  );
}
