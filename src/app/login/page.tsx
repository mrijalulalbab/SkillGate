"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("Pengguna tidak ditemukan");
      }

      // Fetch user role from public.users table
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        throw new Error("Gagal mengambil data profil pengguna.");
      }

      if (userProfile?.role === "umkm") {
        router.push("/dashboard/umkm");
      } else if (userProfile?.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/student");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat masuk. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Minimal Nav */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-background/80 backdrop-blur-md border-b border-border/30">
        <Link href="/" className="font-bold text-xl text-primary hover:opacity-90 transition-opacity">
          SkillGate
        </Link>
      </nav>

      <main className="flex-grow flex items-center justify-center pt-20 pb-16 px-4">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>

          <div className="bg-white border border-border/60 rounded-2xl shadow-sm p-8 md:p-10">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-1">Masuk ke SkillGate</h1>
              <p className="text-sm text-muted-foreground">Masukkan email dan kata sandi Anda</p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center font-medium">
                {errorMsg}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold text-sm">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nama@email.com" 
                  className="h-12" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-semibold text-sm">Kata Sandi</Label>
                  <Link href="#" className="text-xs font-medium text-primary hover:underline">
                    Lupa kata sandi?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  className="h-12" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full h-12 font-semibold text-base mt-2" disabled={loading}>
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/40 text-center">
              <p className="text-sm text-muted-foreground mb-4">Belum punya akun?</p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/register/mahasiswa"
                  className="inline-flex items-center justify-center w-full py-3 px-4 border-2 border-primary text-primary rounded-xl text-sm font-semibold hover:bg-primary/5 transition-colors"
                >
                  Daftar sebagai Mahasiswa
                </Link>
                <Link
                  href="/register/umkm"
                  className="inline-flex items-center justify-center w-full py-3 px-4 border-2 border-emerald-600 text-emerald-600 rounded-xl text-sm font-semibold hover:bg-emerald-50 transition-colors"
                >
                  Daftar sebagai UMKM
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
