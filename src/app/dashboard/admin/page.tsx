"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  Users, ShieldAlert, FolderCheck, Coins, 
  ArrowRight, ShieldCheck, UserCheck, CheckCircle2, Clock, AlertTriangle, BarChart3, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface AdminDashboardStats {
  totalStudents: number;
  totalUmkm: number;
  totalGigs: number;
  pendingGigs: number;
  totalEscrowVolume: number;
  completionRate: number;
}

interface RecentUser {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface RecentGig {
  id: string;
  title: string;
  category: string;
  budget: number;
  status: string;
  created_at: string;
}

interface CategoryStats {
  category: string;
  count: number;
  percentage: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalStudents: 0,
    totalUmkm: 0,
    totalGigs: 0,
    pendingGigs: 0,
    totalEscrowVolume: 0,
    completionRate: 0
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentGigs, setRecentGigs] = useState<RecentGig[]>([]);
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDashboardData();
  }, []);

  async function fetchAdminDashboardData() {
    setLoading(true);
    try {
      // 1. Fetch user counts by role
      const { data: usersData } = await supabase
        .from("users")
        .select("role");

      const studentCount = (usersData || []).filter(u => u.role === "mahasiswa").length;
      const umkmCount = (usersData || []).filter(u => u.role === "umkm").length;

      // 2. Fetch gigs stats
      const { data: gigsData } = await supabase
        .from("gigs")
        .select("status, budget, category");

      const totalGigs = gigsData?.length || 0;
      const pendingGigs = gigsData?.filter(g => g.status === "open").length || 0;
      const completedGigs = gigsData?.filter(g => g.status === "completed").length || 0;
      
      // Calculate total escrow volume
      const totalEscrowVolume = gigsData?.reduce((acc, g) => acc + Number(g.budget || 0), 0) || 0;

      // Calculate completion rate
      const activeOrCompleted = gigsData?.filter(g => g.status === "in_progress" || g.status === "completed").length || 0;
      const completionRate = activeOrCompleted > 0 ? Math.round((completedGigs / activeOrCompleted) * 100) : 100;

      // Calculate category distribution
      const catCounts: Record<string, number> = {};
      if (gigsData) {
        gigsData.forEach(g => {
          catCounts[g.category] = (catCounts[g.category] || 0) + 1;
        });
      }
      const mappedCats = Object.entries(catCounts).map(([category, count]) => ({
        category,
        count,
        percentage: totalGigs > 0 ? Math.round((count / totalGigs) * 100) : 0
      })).sort((a, b) => b.count - a.count);

      setStats({
        totalStudents: studentCount,
        totalUmkm: umkmCount,
        totalGigs,
        pendingGigs,
        totalEscrowVolume,
        completionRate
      });

      setCategories(mappedCats);

      // 3. Fetch recent registrations
      const { data: recUsers } = await supabase
        .from("users")
        .select("id, full_name, role, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (recUsers) {
        setRecentUsers(recUsers as RecentUser[]);
      }

      // 4. Fetch recent gigs
      const { data: recGigs } = await supabase
        .from("gigs")
        .select("id, title, category, budget, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (recGigs) {
        setRecentGigs(recGigs as RecentGig[]);
      }

    } catch (e) {
      console.error("Error loading admin stats:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 max-w-[1400px] mx-auto">
        
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard Monitoring Makro</h1>
            <p className="text-slate-400 mt-1">Sistem Informasi Pengawasan Global & Metrik Volume Finansial Platform.</p>
          </div>
          <button 
            onClick={fetchAdminDashboardData}
            className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl hover:bg-slate-700 transition-colors text-sm font-semibold border border-slate-700"
          >
            Refresh Metrik
          </button>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between min-h-[140px] relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Volume Escrow</span>
              <Coins className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-black text-white">Rp {stats.totalEscrowVolume.toLocaleString("id-ID")}</div>
              <div className="text-xs text-slate-500 mt-1">Akumulasi seluruh anggaran terdaftar</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between min-h-[140px] relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Rasio Proyek Sukses</span>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black text-white">{stats.completionRate}%</div>
              <div className="text-xs text-slate-500 mt-1">Rasio penyelesaian proyek aktif</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between min-h-[140px] relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Pengguna Aktif</span>
              <Users className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black text-white">{stats.totalStudents + stats.totalUmkm}</div>
              <div className="text-xs text-slate-500 mt-1">{stats.totalStudents} Mhs • {stats.totalUmkm} UMKM</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between min-h-[140px] relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Tinjauan Moderasi</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black text-amber-500">{stats.pendingGigs} Proyek</div>
              <div className="text-xs text-slate-500 mt-1">Menunggu persetujuan admin</div>
            </div>
          </div>
        </section>

        {/* Bento Grid Content */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sebaran Kategori (5 Columns) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Sebaran Kategori Proyek Terpopuler
            </h2>
            <div className="space-y-5 flex-grow justify-center flex flex-col">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>{cat.category}</span>
                      <span>{cat.count} Proyek ({cat.percentage}%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all" 
                        style={{ width: `${cat.percentage}%` }} 
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-8">Belum ada data sebaran proyek.</p>
              )}
            </div>
          </div>

          {/* User Signups (7 Columns) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-500" />
              Log Pendaftaran Terkini
            </h2>

            <div className="space-y-4 flex-grow">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-800/30 border border-slate-800/50 hover:bg-slate-800/50 transition-all">
                    <div>
                      <p className="font-bold text-sm text-white">{user.full_name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Daftar pada: {new Date(user.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'mahasiswa' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-8">Belum ada pengguna terdaftar.</p>
              )}
            </div>
          </div>
        </section>

        {/* Recent Projects Table */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              Moderasi & Status Proyek Terkini
            </h2>
            <Link href="/dashboard/admin/moderasi" className="text-sm font-semibold text-amber-500 hover:underline flex items-center gap-1">
              Buka Manajemen Moderasi <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                  <th className="pb-3 px-2">Judul Proyek</th>
                  <th className="pb-3 px-2">Kategori</th>
                  <th className="pb-3 px-2">Anggaran</th>
                  <th className="pb-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentGigs.length > 0 ? (
                  recentGigs.map((gig) => (
                    <tr key={gig.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 px-2 font-semibold text-white truncate max-w-[340px]">{gig.title}</td>
                      <td className="py-4 px-2">{gig.category}</td>
                      <td className="py-4 px-2 text-emerald-400 font-bold">Rp {gig.budget.toLocaleString("id-ID")}</td>
                      <td className="py-4 px-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          gig.status === 'open' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                          gig.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                          'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        }`}>
                          {gig.status === 'open' ? 'Menunggu' : gig.status === 'in_progress' ? 'Aktif' : 'Selesai'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">Tidak ada proyek diposting.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </AdminLayout>
  );
}
