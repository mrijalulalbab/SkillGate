"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, LogOut, ChevronRight } from "lucide-react";
import { StudentSidebar } from "./StudentSidebar";
import { useState } from "react";

interface StudentLayoutProps {
  children: React.ReactNode;
}

const pageTitles: Record<string, string> = {
  "/dashboard/student": "Dashboard",
  "/gigs": "Jelajahi Proyek",
  "/student/proyek-saya": "Proyek Saya",
  "/student/laporan": "Laporan Kinerja",
  "/student/portfolio": "Portofolio",
  "/student/jalur-belajar": "Jalur Pembelajaran",
  "/student/settings": "Pengaturan",
  "/chat": "Pesan",
  "/notifications": "Notifikasi",
};

export function StudentLayout({ children }: StudentLayoutProps) {
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Find page title from map (supports nested routes like /gigs/1)
  const pageTitle = Object.entries(pageTitles).find(([path]) =>
    pathname === path || pathname.startsWith(path + "/")
  )?.[1] || "SkillGate";

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-border/30 shrink-0 z-40">
        <div className="flex justify-between items-center w-full px-4 md:px-6 h-16">
          {/* Left: Mobile logo / Desktop breadcrumb */}
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <Link href="/" className="font-bold text-xl text-primary">SkillGate</Link>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground font-medium">Mahasiswa</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="font-bold text-foreground">{pageTitle}</span>
            </div>
          </div>

          {/* Center: Search Bar (desktop only) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari proyek, skill, atau UMKM..."
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors"
              />
            </div>
          </div>
          
          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/notifications"
              className="relative p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-white" />
            </Link>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVHOmSXI0bZt5WFsfbAvT2cNq-UX9NujpGCcQ3xjx8lG5Odl-Ahyxc5BfMclPKdHM1-W-Pj9-9m8Q6UlwZKun-rvsETy4XwqP5wvSOQUTHyjpNE9RNP6yxaN_bNctYin2MomQMFAgHFr8d37WkCZYlsGuA0EWcILsGt3rGhBIEHg-cluM_cAx_mmbuYuAqTblKs52EvFRw2VwLw9niYgG7DqVZtFLqUjUVOQbpkk3Lb6uyStIbSvKKGO8YqixNWpRdGxp-4Y8rJr4"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="hidden sm:block text-sm font-semibold text-foreground">Andi S.</span>
              </button>
              
              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-border/60 py-2 z-50">
                    <div className="px-4 py-3 border-b border-border/30">
                      <p className="text-sm font-bold text-foreground">Andi Setiawan</p>
                      <p className="text-xs text-muted-foreground">andi.setiawan@ugm.ac.id</p>
                    </div>
                    <Link href="/dashboard/student" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setShowProfileMenu(false)}>
                      Profil Saya
                    </Link>
                    <Link href="/student/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setShowProfileMenu(false)}>
                      Pengaturan Akun
                    </Link>
                    <Link href="/notifications" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setShowProfileMenu(false)}>
                      Notifikasi
                    </Link>
                    <div className="border-t border-border/30 mt-1 pt-1">
                      <Link href="/auth" className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors" onClick={() => setShowProfileMenu(false)}>
                        <LogOut className="w-4 h-4" /> Keluar
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Body: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="flex flex-col min-h-full">
            <div className="flex-1">
              {children}
            </div>

            {/* Footer - always at bottom */}
            <footer className="bg-white border-t border-border/30">
              <div className="w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <div className="font-bold text-lg text-foreground mb-1">SkillGate</div>
                  <p className="text-sm text-muted-foreground">© 2026 SkillGate. Menghubungkan Potensi Mahasiswa dengan UMKM Indonesia.</p>
                </div>
                <nav className="flex flex-wrap justify-center gap-6">
                  <Link href="#" className="text-xs font-semibold text-muted-foreground hover:text-primary hover:underline transition-all">Tentang Kami</Link>
                  <Link href="/help" className="text-xs font-semibold text-muted-foreground hover:text-primary hover:underline transition-all">Pusat Bantuan</Link>
                  <Link href="#" className="text-xs font-semibold text-muted-foreground hover:text-primary hover:underline transition-all">Syarat & Ketentuan</Link>
                  <Link href="#" className="text-xs font-semibold text-muted-foreground hover:text-primary hover:underline transition-all">Kebijakan Privasi</Link>
                </nav>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
