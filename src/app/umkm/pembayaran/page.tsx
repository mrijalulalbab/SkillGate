"use client";

import { UmkmLayout } from "@/components/layout/UmkmLayout";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, Wallet, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle2, Download, Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/toast-notification";

interface Transaction {
  id: string;
  title: string;
  type: string;
  date: string;
  status: string;
  amount: number;
}

export default function PembayaranUmkmPage() {
  const [escrowBalance, setEscrowBalance] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentData();
  }, []);

  async function loadPaymentData() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch UMKM total spent
      const { data: profile } = await supabase
        .from("umkm_profiles")
        .select("total_spent")
        .eq("user_id", user.id)
        .single();
      
      if (profile) {
        setTotalSpent(profile.total_spent || 0);
      }

      // 2. Fetch gigs to compute escrow balance and transaction history
      const { data: gigs, error } = await supabase
        .from("gigs")
        .select("id, title, status, budget, created_at, updated_at")
        .eq("umkm_id", user.id);

      if (error) throw error;

      let computedEscrow = 0;
      const txList: Transaction[] = [];

      (gigs || []).forEach((gig) => {
        if (gig.status === "in_progress") {
          computedEscrow += gig.budget;
          txList.push({
            id: gig.id.substring(0, 8).toUpperCase(),
            title: gig.title,
            type: "Deposit Escrow",
            date: new Date(gig.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }),
            status: "Ditahan",
            amount: gig.budget
          });
        } else if (gig.status === "completed") {
          txList.push({
            id: gig.id.substring(0, 8).toUpperCase(),
            title: gig.title,
            type: "Pembayaran Dilepas",
            date: new Date(gig.updated_at || gig.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }),
            status: "Berhasil",
            amount: gig.budget
          });
        }
      });

      setEscrowBalance(computedEscrow);
      setTransactions(txList);

    } catch (e) {
      console.error("Error loading payment data:", e);
    } finally {
      setLoading(false);
    }
  }

  const { showToast } = useToast();

  const handleTopUp = () => {
    showToast("Metode pembayaran QRIS / Virtual Account bank Sleman simulasi berhasil dipicu! Saldo akan otomatis bertambah saat Anda mendanai proyek baru.", "success");
  };

  return (
    <UmkmLayout>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
        
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 flex items-center gap-3">
            <CreditCard className="w-8 h-8 md:w-12 md:h-12 text-secondary" />
            Pembayaran
          </h1>
          <p className="text-lg text-muted-foreground">Kelola saldo escrow, riwayat transaksi, dan tagihan proyek Anda.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        ) : (
          <>
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              
              {/* Escrow Balance */}
              <div className="bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 opacity-10">
                  <Wallet className="w-40 h-40" />
                </div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-2 text-secondary font-semibold mb-4">
                    <Clock className="w-5 h-5" />
                    Saldo Escrow (Ditahan)
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                    Rp {escrowBalance.toLocaleString("id-ID")}
                  </div>
                  <p className="text-sm text-muted-foreground mt-auto">Dana ini diamankan oleh SkillGate dan akan dilepas ke mahasiswa setelah proyek selesai.</p>
                </div>
              </div>
              
              {/* Total Paid */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-border/40 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                  Total Telah Dibayarkan
                </div>
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  Rp {totalSpent.toLocaleString("id-ID")}
                </div>
                <p className="text-sm text-muted-foreground mt-auto font-medium">Total pengeluaran Anda untuk proyek-proyek yang telah berhasil selesai.</p>
              </div>
              
              {/* Top Up Action */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-border/40 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 border border-border">
                  <CreditCard className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground">Top Up Saldo</h3>
                <p className="text-sm text-muted-foreground mb-6">Isi saldo Anda untuk mendanai proyek baru.</p>
                <Button onClick={handleTopUp} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-6 rounded-xl">Isi Saldo Sekarang</Button>
              </div>

            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-3xl border border-border/40 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-border/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-foreground">Riwayat Transaksi</h2>
                <Button onClick={() => showToast("Laporan transaksi berhasil diunduh (Format PDF).", "success")} variant="outline" className="font-semibold flex items-center gap-2">
                  <Download className="w-4 h-4" /> Unduh Laporan
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-bold">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-xl">ID Transaksi</th>
                      <th className="px-6 py-4">Tanggal</th>
                      <th className="px-6 py-4">Keterangan</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right rounded-tr-xl">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-muted-foreground">Belum ada riwayat transaksi escrow.</td>
                      </tr>
                    ) : (
                      transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 font-semibold text-foreground">#{tx.id}</td>
                          <td className="px-6 py-4 text-muted-foreground">{tx.date}</td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-foreground">{tx.type}</div>
                            <div className="text-xs text-muted-foreground">Proyek: {tx.title}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              tx.status === "Ditahan" ? "bg-amber-100 text-amber-700" : "bg-emerald-50 text-emerald-700"
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-foreground flex items-center justify-end gap-1">
                            {tx.status === "Ditahan" ? (
                              <ArrowDownRight className="w-4 h-4 text-amber-500" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 text-destructive" />
                            )}
                            Rp {tx.amount.toLocaleString("id-ID")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </UmkmLayout>
  );
}
