import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, Settings } from "lucide-react";

export function DashboardNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md shadow-sm border-b border-border/30">
      <div className="flex justify-between items-center px-4 md:px-8 h-16 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-xl text-primary hover:opacity-90 transition-opacity">
            SkillGate
          </Link>
          <div className="hidden md:flex gap-6 ml-8">
            <Link href="/gigs" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Cari Proyek</Link>
            <Link href="/dashboard/student" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Portofolio Saya</Link>
            <Link href="/dashboard/umkm" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Dashboard UMKM</Link>
            <Link href="/chat" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">Pesan</Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-accent transition-colors relative"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-background"></span>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </Button>
          <div className="w-9 h-9 rounded-full overflow-hidden border border-border cursor-pointer bg-primary/10 hover:opacity-80 transition-opacity">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuByRVVIa751XdT2gUmSwmH9QIQ5Qa5cdkrDpdQ6RWbuWHfUKidlZEkuIuCbWLPRVlRCOa7TpkylitHfI6a5xZcrYge7CNzrFHAcEMQVhT9I8srHOIw_e2nTsBm-WeftAMRjYmoX9Jzen-rfSckhVcRkfWJ-7zTItBnWKLk3EyQYztbSgZ2md-TZ_N0ZJpkgYN0nhJuVgYnj3h-B-wgd5DRNxs_XH0za2M0XfVZu3Z-fZYo-Ym829c8K86BpTuXtzOuXtspEvuad2ho"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
