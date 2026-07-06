"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  FolderCheck, UserCheck, ShieldCheck, XCircle, 
  MapPin, GraduationCap, Building2, Loader2, Star 
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/toast-notification";

interface UserProfile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
  details: {
    nim?: string;
    university?: string;
    major?: string;
    business_name?: string;
    category?: string;
    address?: string;
  } | null;
}

export default function VerifikasiPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsersForVerification();
  }, []);

  async function fetchUsersForVerification() {
    setLoading(true);
    try {
      const { data: rawUsers, error } = await supabase
        .from("users")
        .select(`
          id, full_name, role, created_at,
          student_profiles (nim, university, major),
          umkm_profiles (business_name, category, address)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted: UserProfile[] = (rawUsers || []).map((u: any) => {
        let details = null;
        if (u.role === "mahasiswa" && u.student_profiles?.[0]) {
          details = {
            nim: u.student_profiles[0].nim,
            university: u.student_profiles[0].university,
            major: u.student_profiles[0].major,
          };
        } else if (u.role === "umkm" && u.umkm_profiles?.[0]) {
          details = {
            business_name: u.umkm_profiles[0].business_name,
            category: u.umkm_profiles[0].category,
            address: u.umkm_profiles[0].address,
          };
        }

        return {
          id: u.id,
          full_name: u.full_name,
          role: u.role,
          created_at: u.created_at,
          details
        };
      });

      setUsers(formatted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(id: string) {
    setActioningId(id);
    // Simulate verification (updates internal UI state or we could show success)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      showToast("Pengguna berhasil diverifikasi!", "success");
      setUsers(users.filter(u => u.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setActioningId(null);
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 max-w-[1400px] mx-auto">
        
        <section>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FolderCheck className="w-8 h-8 text-amber-500" />
            Verifikasi Identitas & Dokumen
          </h1>
          <p className="text-slate-400 mt-1">Verifikasi kartu identitas mahasiswa (KTM) dan NIB UMKM Sleman.</p>
        </section>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center">
            <ShieldCheck className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Semua Pengguna Terverifikasi</h3>
            <p className="text-slate-500">Tidak ada pengajuan verifikasi baru saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {users.map((u) => (
              <div key={u.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden group">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      u.role === 'mahasiswa' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {u.role === 'mahasiswa' ? 'Mahasiswa' : 'UMKM'}
                    </span>
                    <span className="bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      Dokumen Diunggah
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      {u.full_name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Daftar pada: {new Date(u.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>

                  {u.role === 'mahasiswa' && u.details && (
                    <div className="bg-slate-800/20 border border-slate-800/80 p-4 rounded-xl space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <GraduationCap className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                        <span>Universitas: <span className="font-bold text-white">{u.details.university}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <GraduationCap className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                        <span>Jurusan: <span className="font-bold text-white">{u.details.major}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <UserCheck className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                        <span>NIM / No. Mahasiswa: <span className="font-bold text-white">{u.details.nim}</span></span>
                      </div>
                    </div>
                  )}

                  {u.role === 'umkm' && u.details && (
                    <div className="bg-slate-800/20 border border-slate-800/80 p-4 rounded-xl space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Building2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                        <span>Nama Toko/Bisnis: <span className="font-bold text-white">{u.details.business_name}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Building2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                        <span>Kategori Usaha: <span className="font-bold text-white">{u.details.category}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <MapPin className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                        <span>Alamat Toko: <span className="font-bold text-white">{u.details.address}</span></span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-row md:flex-col justify-end gap-3 shrink-0 self-end md:self-center w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <button
                    onClick={() => handleVerify(u.id)}
                    disabled={actioningId === u.id}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-amber-500 text-slate-950 px-5 py-3 rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-50"
                  >
                    {actioningId === u.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    Verifikasi Akun
                  </button>
                  <button
                    onClick={() => handleVerify(u.id)}
                    disabled={actioningId === u.id}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-slate-800/80 text-slate-400 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-slate-700 hover:text-white transition-all disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Tolak / Blocker
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
