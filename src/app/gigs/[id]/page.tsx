"use client";

import { StudentLayout } from "@/components/layout/StudentLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { 
  ArrowLeft, Share2, Bookmark, Calendar, CheckCircle2, 
  Monitor, Palette, Users, Send, Star, Clock, Loader2 
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface GigDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  skills_required: string[];
  output_expected: string;
  budget: number;
  deadline: string;
  status: string;
  applicant_count: number;
  created_at: string;
  umkm: {
    full_name: string;
    umkm_profiles: {
      business_name: string;
      rating_avg: number;
      description: string;
    }[];
  };
}

const MOCK_GIG: GigDetail = {
  id: "demo",
  title: "Desain Feed Instagram untuk Koleksi Lebaran",
  description: "Kami adalah pengrajin Batik tradisional asal Sleman yang baru saja meluncurkan koleksi motif terbaru yang terinspirasi dari keanekaragaman flora lokal. Saat ini kami membutuhkan bantuan untuk membuat poster promosi digital yang segar namun tetap mempertahankan nuansa budaya yang kuat.\n\nPoster ini akan digunakan terutama di platform media sosial seperti Instagram dan WhatsApp Business. Kami menginginkan desain yang menonjolkan detail motif batik kami dengan cara yang modern agar dapat menarik minat pelanggan dari kalangan profesional muda.",
  category: "Desain Grafis",
  skills_required: ["Desain Grafis", "Canva", "Adobe Photoshop", "Typography"],
  output_expected: "Format Output: PNG/JPG resolusi tinggi\nUkuran: 1080x1080px (Square untuk Instagram Feed)\nNuansa Warna: Warm Tones (Cokelat, Krem, Jingga Lembut) yang sesuai dengan brand identity kami",
  budget: 75000,
  deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  status: "open",
  applicant_count: 12,
  created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  umkm: {
    full_name: "Bu Darmi",
    umkm_profiles: [{
      business_name: "Batik Sleman Asri",
      rating_avg: 4.8,
      description: "Batik Sleman telah berdiri selama 5 tahun sebagai pusat pelestarian motif batik khas Kabupaten Sleman. Kami berkomitmen memberdayakan pengrajin lokal dan memperkenalkan keindahan batik."
    }]
  }
};

export default function GigDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [gig, setGig] = useState<GigDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchGigDetail();
    } else {
      setGig(MOCK_GIG);
      setLoading(false);
    }
  }, [params?.id]);

  async function fetchGigDetail() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gigs")
        .select(`
          id, title, description, category, skills_required, output_expected, budget, deadline, status, applicant_count, created_at,
          umkm:umkm_id (
            full_name,
            umkm_profiles (business_name, rating_avg, description)
          )
        `)
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching gig details:", error);
        setGig(MOCK_GIG); // Fallback to mock
      } else if (data) {
        setGig(data as unknown as GigDetail);
      } else {
        setGig(MOCK_GIG);
      }
    } catch (e) {
      console.error(e);
      setGig(MOCK_GIG);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  const activeGig = gig || MOCK_GIG;
  const umkmProfile = activeGig.umkm?.umkm_profiles?.[0];
  const businessName = umkmProfile?.business_name || "UMKM Sleman";
  const rating = umkmProfile?.rating_avg || 4.8;
  const umkmDescription = umkmProfile?.description || "Deskripsi profil bisnis UMKM.";

  return (
    <StudentLayout>
      {/* Top Navigation specific to detail page */}
      <div className="bg-white border-b border-border/40 sticky top-0 z-30">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-2 -ml-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-foreground">Detail Proyek</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
        
        {/* Header Info Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/40 mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
              {activeGig.category}
            </span>
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              {activeGig.status === "open" ? "Terbuka" : "Berjalan"}
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">{activeGig.title}</h2>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-border bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{(activeGig.umkm?.full_name || "U")[0]}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{activeGig.umkm?.full_name}</p>
                <p className="text-sm text-muted-foreground mb-1">{businessName}</p>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold ml-0.5 text-foreground">{Number(rating).toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-8 border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-8">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Budget</span>
                <span className="text-xl font-bold text-emerald-600">Rp {activeGig.budget.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Tenggat Waktu</span>
                <div className="flex items-center gap-1.5 text-foreground font-semibold">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  {activeGig.deadline}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-24">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            
            {/* Brief Section */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/40">
              <h3 className="text-xl font-bold text-foreground mb-4">Deskripsi Proyek</h3>
              <div className="space-y-4 text-muted-foreground text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {activeGig.description}
              </div>
            </section>
            
            {/* Output Expected Section */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/40">
              <h3 className="text-xl font-bold text-foreground mb-4">Output yang Diharapkan</h3>
              <div className="p-4 bg-muted/40 rounded-xl whitespace-pre-wrap text-sm text-foreground">
                {activeGig.output_expected}
              </div>
            </section>
            
            {/* Skills Section */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/40">
              <h3 className="text-xl font-bold text-foreground mb-4">Keahlian yang Dibutuhkan</h3>
              <div className="flex flex-wrap gap-2">
                {activeGig.skills_required.map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-muted rounded-full text-sm font-semibold text-foreground">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
            
          </div>
          
          {/* Right Column: Sidebar */}
          <aside className="lg:col-span-4 space-y-6 md:space-y-8 sticky top-24">
            
            {/* About MSME */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-border/40">
              <h3 className="text-lg font-bold text-foreground mb-4">Tentang Klien</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {umkmDescription}
                </p>
              </div>
            </section>
            
            {/* Quick Stats Bento */}
            <section className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 text-center">
                <Users className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground mb-0.5">{activeGig.applicant_count || 0}</p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pelamar</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground mb-0.5">98%</p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kepuasan</p>
              </div>
            </section>

          </aside>
        </div>
      </div>

      {/* Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 md:left-64 lg:left-64 right-0 z-40 bg-white border-t border-border/40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] p-4 md:px-8">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Honorarium</span>
            <span className="text-2xl font-bold text-foreground">Rp {activeGig.budget.toLocaleString("id-ID")}</span>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" size="icon" className="shrink-0 h-12 w-12 rounded-xl">
              <Bookmark className="w-5 h-5" />
            </Button>
            {activeGig.status === "open" ? (
              <Link href={`/gigs/${activeGig.id}/proposal`} className={buttonVariants({ className: "flex-1 md:flex-none h-12 px-8 rounded-xl font-bold text-base shadow-sm" })}>
                <Send className="w-4 h-4 mr-2" /> Kirim Proposal Sekarang
              </Link>
            ) : (
              <Button disabled className="flex-1 md:flex-none h-12 px-8 rounded-xl font-bold text-base shadow-sm">
                Proyek Sedang Berjalan
              </Button>
            )}
          </div>
        </div>
      </div>
      
    </StudentLayout>
  );
}
