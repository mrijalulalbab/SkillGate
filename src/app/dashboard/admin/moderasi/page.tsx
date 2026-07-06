"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  ShieldAlert, Trash2, CheckCircle2, Star, Clock, AlertTriangle, Loader2 
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/toast-notification";

interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  status: string;
  umkm: {
    full_name: string;
    umkm_profiles: {
      business_name: string;
    }[];
  };
}

export default function AdminModerasiPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchGigs();
  }, []);

  async function fetchGigs() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gigs")
        .select(`
          id, title, description, category, budget, deadline, status,
          umkm:umkm_id (
            full_name,
            umkm_profiles (business_name)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGigs((data as unknown as Gig[]) || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    setActioningId(id);
    try {
      const { error } = await supabase
        .from("gigs")
        .update({ status: "open" })
        .eq("id", id);
      
      if (error) throw error;
      showToast("Proyek berhasil disetujui!", "success");
      fetchGigs();
    } catch (e: any) {
      showToast(e.message || "Gagal menyetujui proyek", "error");
    } finally {
      setActioningId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus proyek ini? Proyek akan dihapus permanen dari sistem.")) return;
    setActioningId(id);
    try {
      const { error } = await supabase
        .from("gigs")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      showToast("Proyek berhasil dihapus!", "success");
      fetchGigs();
    } catch (e: any) {
      showToast(e.message || "Gagal menghapus proyek", "error");
    } finally {
      setActioningId(null);
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 max-w-[1400px] mx-auto">
        
        <section>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-amber-500" />
            Moderasi Proyek / Gigs
          </h1>
          <p className="text-slate-400 mt-1">Tinjau, setujui, atau hapus proyek UMKM yang diposting di platform.</p>
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : gigs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center">
            <CheckCircle2 className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Semua Bersih!</h3>
            <p className="text-slate-500">Tidak ada lowongan proyek yang perlu dimoderasi saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {gigs.map((gig) => {
              const businessName = gig.umkm?.umkm_profiles?.[0]?.business_name || "UMKM Sleman";
              return (
                <div key={gig.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden group">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold">
                        {gig.category}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        gig.status === 'open' ? 'bg-amber-500/10 text-amber-500' :
                        gig.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {gig.status === 'open' ? 'Terbuka' : gig.status === 'in_progress' ? 'Berjalan' : 'Selesai'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                        {gig.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Diposting oleh: <span className="font-bold text-slate-300">{gig.umkm?.full_name}</span> ({businessName})
                      </p>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed max-w-4xl line-clamp-3">
                      {gig.description}
                    </p>

                    <div className="flex flex-wrap gap-6 text-xs text-slate-500 font-semibold uppercase tracking-wider pt-2">
                      <div>Anggaran: <span className="text-emerald-400 font-bold">Rp {gig.budget.toLocaleString("id-ID")}</span></div>
                      <div>Tenggat: <span className="text-slate-300">{gig.deadline}</span></div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col justify-end gap-3 shrink-0 self-end md:self-center w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <button
                      onClick={() => handleApprove(gig.id)}
                      disabled={actioningId === gig.id}
                      className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Setujui
                    </button>
                    <button
                      onClick={() => handleDelete(gig.id)}
                      disabled={actioningId === gig.id}
                      className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-red-600/20 text-red-400 border border-red-500/30 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
