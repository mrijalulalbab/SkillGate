"use client";

import { UmkmLayout } from "@/components/layout/UmkmLayout";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, Wallet, Clock, TrendingUp, 
  CheckCircle2, AlertCircle, Printer, Download, Loader2, ArrowUpRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface ROIStats {
  totalSpent: number;
  activeEscrow: number;
  avgBudget: number;
  completedCount: number;
  efficiencyRate: number;
  estimatedSavings: number;
}

interface CategoryExpense {
  category: string;
  total: number;
  percentage: number;
}

export default function UmkmLaporanPage() {
  const [stats, setStats] = useState<ROIStats | null>(null);
  const [categories, setCategories] = useState<CategoryExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("Mitra UMKM");

  useEffect(() => {
    loadROIReport();
  }, []);

  async function loadROIReport() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch UMKM profile
      const { data: umkmProfile } = await supabase
        .from("umkm_profiles")
        .select("business_name, total_spent")
        .eq("user_id", user.id)
        .single();
      if (umkmProfile) {
        setBusinessName(umkmProfile.business_name);
      }

      // Fetch all gigs posted by UMKM
      const { data: gigs } = await supabase
        .from("gigs")
        .select("id, budget, status, category, deadline, updated_at")
        .eq("umkm_id", user.id);

      let totalSpent = 0;
      let activeEscrow = 0;
      let completedCount = 0;
      let onTimeCount = 0;
      const catSpend: Record<string, number> = {};

      if (gigs) {
        for (const gig of gigs) {
          const budget = Number(gig.budget || 0);
          if (gig.status === "completed") {
            totalSpent += budget;
            completedCount++;

            // Check if completed on time
            const compDate = new Date(gig.updated_at);
            const deadDate = new Date(gig.deadline);
            if (compDate <= deadDate) {
              onTimeCount++;
            }

            catSpend[gig.category] = (catSpend[gig.category] || 0) + budget;
          } else if (gig.status === "in_progress") {
            activeEscrow += budget;
          }
        }
      }

      const totalCompleted = completedCount;
      const efficiencyRate = totalCompleted > 0 ? Math.round((onTimeCount / totalCompleted) * 100) : 100;
      
      // Calculate average budget per project
      const avgBudget = totalCompleted > 0 ? Math.round(totalSpent / totalCompleted) : 0;

      // Estimate savings: Standard agency cost is estimated at 2.5x the student micro-gig cost
      const estimatedSavings = Math.round(totalSpent * 1.5);

      // Category breakdown
      const totalSpendAll = Object.values(catSpend).reduce((acc, curr) => acc + curr, 0);
      const mappedCats = Object.entries(catSpend).map(([category, amt]) => ({
        category,
        total: amt,
        percentage: totalSpendAll > 0 ? Math.round((amt / totalSpendAll) * 100) : 0
      })).sort((a, b) => b.total - a.total);

      setStats({
        totalSpent: umkmProfile?.total_spent || totalSpent,
        activeEscrow,
        avgBudget,
        completedCount: totalCompleted,
        efficiencyRate,
        estimatedSavings
      });

      setCategories(mappedCats);
    } catch (e) {
      console.error("Error loading ROI report:", e);
    } finally {
      setLoading(false);
    }
  }

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <UmkmLayout>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        </div>
      </UmkmLayout>
    );
  }

  return (
    <UmkmLayout>
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
        
        {/* Header no-print */}
        <div className="flex justify-between items-center border-b border-border/40 pb-6 no-print">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-secondary" />
              Laporan Pengeluaran & ROI Proyek
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Analisis Efisiensi Anggaran dan Ketepatan Waktu Kerja Mahasiswa.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handlePrint} variant="outline" className="font-bold border-secondary/20 text-secondary hover:bg-secondary/5">
              <Printer className="w-4 h-4 mr-2" /> Cetak Laporan
            </Button>
          </div>
        </div>

        {/* Printable Official Header */}
        <div className="hidden print:flex flex-col items-center justify-center border-b-4 border-double border-foreground pb-6 mb-8 text-center">
          <h2 className="text-2xl font-black uppercase tracking-widest text-black">LAPORAN ROI & ANGGARAN PROYEK</h2>
          <p className="text-xs font-semibold text-black uppercase tracking-wider mt-1">Sistem Informasi Kolaborasi Mahasiswa & UMKM Sleman</p>
          <div className="w-full mt-4 grid grid-cols-2 text-left text-xs border-t border-black/10 pt-4">
            <div>
              <p><strong>Nama UMKM:</strong> {businessName}</p>
              <p><strong>Status Kemitraan:</strong> Aktif Terverifikasi</p>
            </div>
            <div className="text-right">
              <p><strong>Tanggal Cetak:</strong> {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p><strong>Metode Pembayaran:</strong> Escrow QRIS / VA</p>
            </div>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 print-card flex flex-col justify-between">
            <div className="flex justify-between items-start text-muted-foreground mb-3">
              <span className="text-sm font-semibold">Total Pengeluaran</span>
              <Wallet className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-3xl font-black text-foreground">Rp {(stats?.totalSpent || 0).toLocaleString("id-ID")}</p>
              <p className="text-xs text-muted-foreground mt-1">Akumulasi biaya proyek selesai</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 print-card flex flex-col justify-between">
            <div className="flex justify-between items-start text-muted-foreground mb-3">
              <span className="text-sm font-semibold">Dana Escrow Aktif</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-3xl font-black text-foreground">Rp {(stats?.activeEscrow || 0).toLocaleString("id-ID")}</p>
              <p className="text-xs text-muted-foreground mt-1">Dana teramankan di sistem berjalan</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 print-card flex flex-col justify-between">
            <div className="flex justify-between items-start text-muted-foreground mb-3">
              <span className="text-sm font-semibold">Rasio Ketepatan Waktu</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-black text-foreground">{stats?.efficiencyRate || 100}%</p>
              <p className="text-xs text-muted-foreground mt-1">Proyek selesai sebelum tenggat</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 print-card flex flex-col justify-between">
            <div className="flex justify-between items-start text-muted-foreground mb-3">
              <span className="text-sm font-semibold">Estimasi Penghematan</span>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-3xl font-black text-emerald-600">Rp {(stats?.estimatedSavings || 0).toLocaleString("id-ID")}</p>
              <p className="text-xs text-muted-foreground mt-1">Penghematan dibanding jasa agensi (150%)</p>
            </div>
          </div>
        </div>

        {/* ROI Breakdown & Category Cost Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          
          {/* Expenditure Breakdown Chart */}
          <div className="md:col-span-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-border/40 print-card">
            <h3 className="text-lg font-bold text-foreground mb-6">Distribusi Pengeluaran Kategori</h3>
            
            {categories.length > 0 ? (
              <div className="space-y-5">
                {categories.map((cat) => (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-foreground">
                      <span>{cat.category}</span>
                      <span>Rp {cat.total.toLocaleString("id-ID")} ({cat.percentage}%)</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-secondary rounded-full transition-all" 
                        style={{ width: `${cat.percentage}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground text-sm">
                Belum ada data pengeluaran proyek yang selesai.
              </div>
            )}
          </div>

          {/* ROI Efficiency Analysis Card */}
          <div className="md:col-span-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-border/40 print-card flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">Analisis Efisiensi & Dampak Bisnis (ROI)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Dengan bermitra dengan mahasiswa melalui SkillGate, usaha Anda berkontribusi pada pengembangan talenta lokal sekaligus menghemat biaya operasional digital.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
                <ArrowUpRight className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">Efisiensi Biaya</h4>
                  <p className="text-xs text-emerald-800">Usaha Anda berjalan lebih hemat <strong>60%</strong> dibanding tarif agensi profesional.</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-blue-950">Efisiensi Operasional</h4>
                  <p className="text-xs text-blue-800">Tingkat ketepatan penyelesaian proyek mahasiswa berada di angka <strong>{stats?.efficiencyRate || 100}%</strong>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Print Signature Block */}
        <div className="hidden print:grid grid-cols-2 text-xs mt-20 pt-8 border-t border-black/10">
          <div>
            <p className="italic text-muted-foreground">Laporan finansial & efisiensi ini dihasilkan oleh platform manajemen SkillGate secara akurat.</p>
          </div>
          <div className="text-right">
            <p>Sleman, {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="mt-16 font-bold underline">{businessName}</p>
            <p className="text-muted-foreground">Perwakilan Mitra UMKM</p>
          </div>
        </div>

      </div>
    </UmkmLayout>
  );
}
