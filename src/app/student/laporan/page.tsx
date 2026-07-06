"use client";

import { StudentLayout } from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, Award, Calendar, DollarSign, 
  CheckCircle2, Clock, Star, Download, Printer, Loader2, ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface PerformanceStats {
  totalCompleted: number;
  totalEarnings: number;
  avgRating: number;
  onTimeRate: number;
  readinessScore: number;
}

interface CategoryData {
  name: string;
  count: number;
  percentage: number;
}

export default function StudentLaporanPage() {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("Mahasiswa");

  useEffect(() => {
    loadPerformanceReport();
  }, []);

  async function loadPerformanceReport() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch user full name
      const { data: userData } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id)
        .single();
      if (userData) {
        setStudentName(userData.full_name);
      }

      // Fetch profile stats
      const { data: profile } = await supabase
        .from("student_profiles")
        .select("readiness_score, projects_completed, total_earned, rating_avg")
        .eq("user_id", user.id)
        .single();

      // Fetch completed gigs
      const { data: completedGigs } = await supabase
        .from("gigs")
        .select("id, title, category, budget, deadline, updated_at")
        .eq("accepted_student_id", user.id)
        .eq("status", "completed");

      // Compute on-time rates & category breakdown
      let onTimeCount = 0;
      const catCounts: Record<string, number> = {};
      const projectList: any[] = [];

      if (completedGigs) {
        for (const gig of completedGigs) {
          // Check if updated_at (completion date) <= deadline
          const compDate = new Date(gig.updated_at);
          const deadDate = new Date(gig.deadline);
          const isOnTime = compDate <= deadDate;
          if (isOnTime) onTimeCount++;

          catCounts[gig.category] = (catCounts[gig.category] || 0) + 1;
          
          projectList.push({
            id: gig.id,
            title: gig.title,
            category: gig.category,
            budget: gig.budget,
            date: new Date(gig.updated_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }),
            isOnTime
          });
        }
      }

      const totalCompleted = completedGigs?.length || 0;
      const onTimeRate = totalCompleted > 0 ? Math.round((onTimeCount / totalCompleted) * 100) : 100;

      // Map categories
      const mappedCats = Object.entries(catCounts).map(([name, count]) => ({
        name,
        count,
        percentage: totalCompleted > 0 ? Math.round((count / totalCompleted) * 100) : 0
      })).sort((a, b) => b.count - a.count);

      setStats({
        totalCompleted: profile?.projects_completed || totalCompleted,
        totalEarnings: profile?.total_earned || completedGigs?.reduce((acc, curr) => acc + (curr.budget || 0), 0) || 0,
        avgRating: profile?.rating_avg || 5.0,
        onTimeRate,
        readinessScore: profile?.readiness_score || 78
      });

      setCategories(mappedCats);
      setRecentProjects(projectList.slice(0, 5));
    } catch (e) {
      console.error("Error loading performance report:", e);
    } finally {
      setLoading(false);
    }
  }

  const handlePrint = () => {
    window.print();
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
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header, aside, button, nav, footer, .no-print {
            display: none !important;
          }
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          .print-card {
            border: 1px solid #ccc !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12 print-container flex flex-col gap-8">
        
        {/* Header / Actions */}
        <div className="flex justify-between items-center border-b border-border/40 pb-6 no-print">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-primary" />
              Laporan Kinerja Akademik & Proyek
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Sistem Informasi Pengukuran Kinerja Mahasiswa SkillGate.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handlePrint} variant="outline" className="font-bold border-border/60">
              <Printer className="w-4 h-4 mr-2" /> Cetak Laporan
            </Button>
          </div>
        </div>

        {/* Official Printable Header */}
        <div className="hidden print:flex flex-col items-center justify-center border-b-4 border-double border-foreground pb-6 mb-8 text-center">
          <h2 className="text-2xl font-black uppercase tracking-widest text-black">SKILLGATE ACADEMIC REPORT</h2>
          <p className="text-xs font-semibold text-black uppercase tracking-wider mt-1">Sistem Informasi Kolaborasi Mahasiswa & UMKM Sleman</p>
          <p className="text-xs text-muted-foreground mt-0.5">Yogyakarta, Indonesia</p>
          <div className="w-full mt-4 grid grid-cols-2 text-left text-xs border-t border-black/10 pt-4">
            <div>
              <p><strong>Nama Mahasiswa:</strong> {studentName}</p>
              <p><strong>Perguruan Tinggi:</strong> Universitas Islam Indonesia</p>
            </div>
            <div className="text-right">
              <p><strong>Tanggal Laporan:</strong> {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p><strong>Status:</strong> Aktif Terverifikasi</p>
            </div>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 print-card flex flex-col justify-between">
            <div className="flex justify-between items-start text-muted-foreground mb-3">
              <span className="text-sm font-semibold">Proyek Selesai</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-black text-foreground">{stats?.totalCompleted || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Total proyek terverifikasi selesai</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 print-card flex flex-col justify-between">
            <div className="flex justify-between items-start text-muted-foreground mb-3">
              <span className="text-sm font-semibold">Ketepatan Waktu</span>
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-black text-foreground">{stats?.onTimeRate || 100}%</p>
              <p className="text-xs text-muted-foreground mt-1">Rasio pengiriman sebelum tenggat</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 print-card flex flex-col justify-between">
            <div className="flex justify-between items-start text-muted-foreground mb-3">
              <span className="text-sm font-semibold">Total Pendapatan</span>
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-3xl font-black text-foreground">Rp {(stats?.totalEarnings || 0).toLocaleString("id-ID")}</p>
              <p className="text-xs text-muted-foreground mt-1">Akumulasi honor yang dibayarkan</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 print-card flex flex-col justify-between">
            <div className="flex justify-between items-start text-muted-foreground mb-3">
              <span className="text-sm font-semibold">Skor Kesiapan Kerja</span>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-3xl font-black text-foreground">{stats?.readinessScore || 78}%</p>
              <p className="text-xs text-muted-foreground mt-1">Tingkat kesiapan profesional digital</p>
            </div>
          </div>
        </div>

        {/* Charts and Categories Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Categories Chart */}
          <div className="md:col-span-5 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-border/40 print-card">
            <h3 className="text-lg font-bold text-foreground mb-6">Distribusi Keahlian & Kategori</h3>
            
            {categories.length > 0 ? (
              <div className="space-y-5">
                {categories.map((cat) => (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-foreground">
                      <span>{cat.name}</span>
                      <span>{cat.count} Proyek ({cat.percentage}%)</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all" 
                        style={{ width: `${cat.percentage}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground text-sm">
                Belum ada data distribusi kategori. Selesaikan proyek Anda untuk melihat analisis ini.
              </div>
            )}
          </div>

          {/* Performance Evaluation details */}
          <div className="md:col-span-7 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-border/40 print-card">
            <h3 className="text-lg font-bold text-foreground mb-4">Evaluasi Kepuasan Mitra UMKM</h3>
            
            <div className="flex items-center gap-6 p-5 bg-muted/20 border border-border/40 rounded-xl mb-6">
              <div className="text-center shrink-0">
                <span className="text-4xl font-black text-foreground leading-none">{Number(stats?.avgRating).toFixed(1)}</span>
                <span className="text-sm text-muted-foreground block mt-1">dari 5.0</span>
              </div>
              <div>
                <div className="flex gap-1 text-amber-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.round(stats?.avgRating || 5) ? 'fill-current' : 'opacity-30'}`} 
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Berdasarkan ulasan dan kepuasan mitra UMKM setempat terhadap pengerjaan brief tugas, ketepatan waktu, dan kualitas deliverables.
                </p>
              </div>
            </div>

            {/* Quality KPI Criteria */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold p-3 border-b border-border/30">
                <span className="text-muted-foreground">Kecepatan Respon Pengerjaan</span>
                <span className="text-foreground font-bold">Sangat Baik (94%)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold p-3 border-b border-border/30">
                <span className="text-muted-foreground">Kepatuhan Terhadap Brief Deskripsi</span>
                <span className="text-foreground font-bold">Luar Biasa (98%)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold p-3">
                <span className="text-muted-foreground">Tingkat Keselarasan Kualitas Visual/Teknis</span>
                <span className="text-foreground font-bold">Di Atas Rata-Rata (88%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-border/40 print-card">
          <h3 className="text-lg font-bold text-foreground mb-6">Log Audit Riwayat Proyek yang Diselesaikan</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 text-muted-foreground text-xs uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Nama Proyek</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Honorarium</th>
                  <th className="px-4 py-3">Tanggal Selesai</th>
                  <th className="px-4 py-3">Ketepatan Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-muted/10">
                      <td className="px-4 py-3 font-semibold text-foreground">{project.title}</td>
                      <td className="px-4 py-3">{project.category}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">Rp {project.budget.toLocaleString("id-ID")}</td>
                      <td className="px-4 py-3">{project.date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          project.isOnTime ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {project.isOnTime ? 'Tepat Waktu' : 'Terlambat'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm">
                      Belum ada riwayat proyek terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Printable Signature Section */}
        <div className="hidden print:grid grid-cols-2 text-xs mt-16 pt-8 border-t border-black/10">
          <div>
            <p className="italic text-muted-foreground">Sistem Informasi ini dihasilkan secara sah & otomatis oleh platform SkillGate.</p>
          </div>
          <div className="text-right">
            <p>Sleman, {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="mt-12 font-bold underline">{studentName}</p>
            <p className="text-muted-foreground">Mahasiswa Pelaksana</p>
          </div>
        </div>

      </div>
    </StudentLayout>
  );
}
