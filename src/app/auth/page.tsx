import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function AuthGatewayPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Minimal nav for auth context */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-background/80 backdrop-blur-md border-b border-border/30 max-w-[1280px] mx-auto left-0 right-0">
        <Link href="/" className="font-bold text-xl text-primary hover:opacity-90 transition-opacity">
          SkillGate
        </Link>
        <div className="hidden md:flex gap-6 items-center text-sm text-muted-foreground">
          <Link href="#" className="hover:text-primary transition-colors">Tentang</Link>
          <Link href="#" className="hover:text-primary transition-colors">Bantuan</Link>
          <Link href="/login" className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
            Login
          </Link>
        </div>
        <Link href="/login" className="md:hidden bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-semibold">
          Login
        </Link>
      </nav>

      <main className="flex-grow flex items-center justify-center pt-20 pb-16 px-4">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
              Selamat Datang di <span className="text-primary">SkillGate</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Platform penghubung mahasiswa & UMKM Sleman. Membangun kolaborasi nyata antara talenta muda dan bisnis lokal.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Student Card */}
            <div className="group bg-white border border-border/60 p-8 md:p-10 rounded-2xl flex flex-col items-center text-center shadow-sm relative overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
              
              <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold mb-3 text-foreground">Mahasiswa</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Cari proyek & bangun portofolio dengan bekerja langsung pada tantangan nyata UMKM di Sleman.
              </p>
              
              <div className="w-full mt-auto">
                <Link
                  href="/register/mahasiswa"
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all active:scale-[0.98] group-hover:bg-primary/90"
                >
                  Daftar sebagai Mahasiswa
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-6 w-full h-40 rounded-xl overflow-hidden border border-border/40">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfjWCwVg7ZwxiQ5U7NGSB7tkQHTqB_pEeGszjp0OK1UEnJFpxMPxk5P42KLCbwdQvnS1iJ1h7UZEDP7XTsHwm1KBt5cZ9JrTE5VtiWenS94sjNeRw1sAlrk2Uy2Ofwrsyumsmi3zBXBNS4mb4S8pHOwKDRiNzLL_w8cEGPJwvifcmDJiyZmummvy-nrCSKQf_6kAYqaN6Nv5wOruHKzDlWmz_B4OIMfR3gsdKNKjnpk7EqwnJbyWpM4aFPBJnGkv8fjVOgPKnu1rc"
                  alt="Students collaborating"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* UMKM Card */}
            <div className="group bg-white border border-border/60 p-8 md:p-10 rounded-2xl flex flex-col items-center text-center shadow-sm relative overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
              
              <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-emerald-600">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold mb-3 text-foreground">Pemilik UMKM</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Temukan talenta digital untuk mengembangkan bisnis Anda. Akses solusi kreatif dari mahasiswa terbaik.
              </p>
              
              <div className="w-full mt-auto">
                <Link
                  href="/register/umkm"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all active:scale-[0.98] group-hover:bg-emerald-700"
                >
                  Daftar sebagai UMKM
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-6 w-full h-40 rounded-xl overflow-hidden border border-border/40">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7KeY-C27_zq-xl0SX7dfF_4NdD6dNg8sghwDQKxRKbQZvwD5eCRUKlrhlJ_-udMsR_tqB3YRg4mMekY9OzWT41nvaTDdK2A_C3XtAGVBs6SvqVERvDdSh9Fv_zYMw0NoWUnI_mqfjyayjfEu_9KBUJJ5iPH3V1SfrcqAaoZuIejj9xNx2i0mcT6oW1rEI20xvgrPzFSAH8is8sUbZziDMIWh0RswYxvQprZm6YzMGgqPk20MkcTSG-MVoXA1JhuKhs37__zGwu6k"
                  alt="UMKM business owner"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 text-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">Didukung oleh Ekosistem Pendidikan & Bisnis Sleman</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span className="text-sm font-semibold">Pemerintah Sleman</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-primary"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                <span className="text-sm font-semibold">Universitas Mitra</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-primary"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span className="text-sm font-semibold">Komunitas UMKM</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
