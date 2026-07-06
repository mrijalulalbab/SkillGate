"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  Coins, Wallet, ArrowRight, ShieldCheck, 
  CheckCircle2, Loader2, PlayCircle, Clock 
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Transaction {
  id: string;
  title: string;
  budget: number;
  deadline: string;
  umkm: {
    full_name: string;
    umkm_profiles: {
      business_name: string;
    }[];
  };
  student?: {
    full_name: string;
  };
}

export default function AdminTransaksiPage() {
  const [completedProjects, setCompletedProjects] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gigs")
        .select(`
          id, title, budget, deadline,
          umkm:umkm_id (
            full_name,
            umkm_profiles (business_name)
          ),
          student:accepted_student_id (
            full_name
          )
        `)
        .eq("status", "completed");

      if (error) throw error;
      setCompletedProjects((data as unknown as Transaction[]) || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const totalVolume = completedProjects.reduce((acc, curr) => acc + Number(curr.budget), 0);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 max-w-[1400px] mx-auto">
        
        <section>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Coins className="w-8 h-8 text-amber-500" />
            Monitoring Transaksi
          </h1>
          <p className="text-slate-400 mt-1">Audit pembayaran escrow dari UMKM ke Mahasiswa pelaksana proyek.</p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Volume Transaksi</span>
            <div className="text-3xl font-bold text-emerald-400">Rp {totalVolume.toLocaleString("id-ID")}</div>
            <p className="text-[10px] text-slate-500">Berdasarkan akumulasi proyek selesai</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pencairan Sukses</span>
            <div className="text-3xl font-bold text-white">{completedProjects.length}</div>
            <p className="text-[10px] text-slate-500">Pembayaran aman terkirim ke e-wallet</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Escrow</span>
            <div className="text-3xl font-bold text-amber-500">100% Aman</div>
            <p className="text-[10px] text-slate-500">Dana tertahan di rekening penampung sementara</p>
          </div>
        </section>

        {/* List of Payments */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-amber-500" />
            Riwayat Pembayaran Proyek Selesai
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
            </div>
          ) : completedProjects.length === 0 ? (
            <p className="text-center text-slate-500 py-10">Belum ada pencairan dana proyek selesai saat ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                    <th className="pb-3">Proyek</th>
                    <th className="pb-3">Pengirim (UMKM)</th>
                    <th className="pb-3">Penerima (Mahasiswa)</th>
                    <th className="pb-3">Nominal</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {completedProjects.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 font-semibold text-white">{tx.title}</td>
                      <td className="py-4">{tx.umkm?.umkm_profiles?.[0]?.business_name || tx.umkm?.full_name}</td>
                      <td className="py-4">{tx.student?.full_name || "Mahasiswa"}</td>
                      <td className="py-4 text-emerald-400 font-bold">Rp {tx.budget.toLocaleString("id-ID")}</td>
                      <td className="py-4">
                        <span className="bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Selesai
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
