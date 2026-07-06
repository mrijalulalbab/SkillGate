"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Home, HelpCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between text-foreground relative overflow-hidden">
      {/* Background blobs for premium feel */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-3xl -z-10 animate-pulse" style={{ animationDelay: "2s" }} />

      {/* Navbar */}
      <header className="w-full px-6 md:px-12 py-6 flex justify-between items-center max-w-[1280px] mx-auto z-10">
        <Link href="/" className="font-bold text-2xl text-primary">SkillGate</Link>
        <Link href="/auth" className={buttonVariants({ variant: "outline", size: "sm", className: "font-semibold" })}>
          Masuk / Register
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-lg mx-auto z-10">
        {/* Error Code Glow */}
        <div className="relative mb-6">
          <div className="text-8xl md:text-9xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent select-none filter drop-shadow-sm">
            404
          </div>
          <div className="absolute inset-0 text-8xl md:text-9xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent blur-xl opacity-30 select-none -z-10">
            404
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-4">Halaman Tidak Ditemukan</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed text-sm md:text-base">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan. Mari kembali ke jalur yang benar.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline" 
            className="w-full sm:w-auto py-6 px-8 rounded-xl font-semibold flex items-center justify-center gap-2 border-border/50 hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Button>
          <Link 
            href="/" 
            className={buttonVariants({ 
              className: "w-full sm:w-auto py-6 px-8 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md flex items-center justify-center gap-2" 
            })}
          >
            <Home className="w-4 h-4" /> Ke Halaman Utama
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 text-center border-t border-border/10 max-w-[1280px] mx-auto z-10">
        <p className="text-xs text-muted-foreground">
          © 2026 SkillGate. Menghubungkan Potensi Mahasiswa dengan UMKM Indonesia.
        </p>
      </footer>
    </div>
  );
}
