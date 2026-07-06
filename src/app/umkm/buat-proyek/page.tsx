"use client";

import { UmkmLayout } from "@/components/layout/UmkmLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  PlusCircle, ArrowLeft, Send, CheckCircle2, 
  Eye, Briefcase, MapPin, Clock, Star, Loader2 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/toast-notification";

export default function BuatProyekPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "preview" | "submitted">("form");
  const [loading, setLoading] = useState(false);
  const [clientProfile, setClientProfile] = useState<{ business_name: string; rating_avg: number; full_name: string } | null>(null);
  const { showToast } = useToast();
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    skills: "",
    description: "",
    output: "",
    budget: "",
    deadline: ""
  });

  useEffect(() => {
    fetchClientProfile();
  }, []);

  async function fetchClientProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const { data: umkmData } = await supabase
        .from("umkm_profiles")
        .select("business_name, rating_avg")
        .eq("user_id", user.id)
        .single();

      if (userData && umkmData) {
        setClientProfile({
          full_name: userData.full_name,
          business_name: umkmData.business_name,
          rating_avg: Number(umkmData.rating_avg)
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handlePublish() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showToast("Anda harus masuk terlebih dahulu!", "error");
        setLoading(false);
        return;
      }

      // Map deadline string option to date
      let days = 7;
      if (formData.deadline === "1 - 3 Hari") days = 3;
      else if (formData.deadline === "4 - 7 Hari") days = 7;
      else if (formData.deadline === "1 - 2 Minggu") days = 14;
      else if (formData.deadline === "Fleksibel") days = 30;

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);
      const deadlineDate = targetDate.toISOString().split("T")[0];

      // Parse skills
      const skillsArray = formData.skills
        ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const { data, error } = await supabase
        .from("gigs")
        .insert({
          umkm_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          skills_required: skillsArray,
          output_expected: formData.output,
          budget: Number(formData.budget),
          deadline: deadlineDate,
          status: "open",
        })
        .select()
        .single();

      if (error) throw error;

      // Create internal notification
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Proyek Dibuat",
        message: `Proyek "${formData.title}" Anda berhasil dipublikasikan.`,
        type: "success",
        related_gig_id: data.id,
      });

      setStep("submitted");
    } catch (e: any) {
      showToast(e.message || "Gagal mempublikasikan proyek", "error");
    } finally {
      setLoading(false);
    }
  }

  if (step === "submitted") {
    return (
      <UmkmLayout>
        <div className="flex-1 flex items-center justify-center h-[calc(100vh-64px)] px-4">
          <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-border/40 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">Proyek Berhasil Dibuat!</h1>
            <p className="text-muted-foreground mb-8">
              Proyek Anda kini sudah tayang dan bisa dilihat oleh mahasiswa. Anda akan menerima notifikasi saat ada pelamar.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/umkm/proyek" className={buttonVariants({ className: "w-full py-6 font-bold rounded-xl shadow-md bg-secondary hover:bg-secondary/90 text-secondary-foreground" })}>Lihat Daftar Proyek</Link>
              <Link href="/dashboard/umkm" className={buttonVariants({ variant: "outline", className: "w-full py-6 font-semibold rounded-xl" })}>Kembali ke Dashboard</Link>
            </div>
          </div>
        </div>
      </UmkmLayout>
    );
  }

  if (step === "preview") {
    const skillsList = formData.skills ? formData.skills.split(',').map(s => s.trim()) : [];
    
    return (
      <UmkmLayout>
        <div className="max-w-[800px] mx-auto px-4 md:px-8 py-8 md:py-12">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setStep("form")} 
                className="p-2 -ml-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                  <Eye className="w-6 h-6 md:w-8 md:h-8 text-secondary" /> Pratinjau Proyek
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Beginilah proyek Anda akan terlihat oleh mahasiswa pelamar.</p>
              </div>
            </div>
          </div>

          {/* Preview Card (Matches Student View) */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border/40 mb-8 relative overflow-hidden">
            {/* Banner top */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary to-[#f9a826]"></div>
            
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 mb-8 mt-2">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold">
                    {formData.category || "Kategori belum dipilih"}
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Proyek Terbuka
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 leading-snug">
                  {formData.title || "Judul Proyek Belum Diisi"}
                </h2>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-border/50 bg-secondary/10 flex items-center justify-center">
                    <span className="text-secondary font-bold text-lg">
                      {clientProfile ? clientProfile.full_name[0] : "B"}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground hover:underline cursor-pointer transition-colors">
                      {clientProfile ? `${clientProfile.full_name} (${clientProfile.business_name})` : "Bu Darmi (UMKM Batik Sleman)"}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Sleman, DIY</span>
                      <span className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star className="w-3 h-3 fill-current" /> {clientProfile ? clientProfile.rating_avg.toFixed(1) : "4.9"} (Demo)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-2xl p-5 md:min-w-[200px] border border-border/50 shrink-0">
                <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Anggaran</div>
                <div className="text-2xl font-black text-primary mb-4">Rp {formData.budget ? parseInt(formData.budget).toLocaleString('id-ID') : "0"}</div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{formData.deadline || "Tenggat belum dipilih"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">Project Base</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Deskripsi Proyek</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {formData.description || "Deskripsi proyek belum diisi."}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Output yang Diharapkan</h3>
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50 text-muted-foreground whitespace-pre-wrap">
                  {formData.output || "Output belum ditentukan."}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Skill yang Dibutuhkan</h3>
                <div className="flex flex-wrap gap-2">
                  {skillsList.length > 0 ? (
                    skillsList.map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 bg-primary/5 text-primary text-sm font-semibold rounded-lg border border-primary/10">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">Belum ada skill spesifik yang ditambahkan</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-end">
            <Button variant="outline" className="px-8 py-6 rounded-xl font-semibold" onClick={() => setStep("form")} disabled={loading}>
              Edit Kembali
            </Button>
            <Button 
              onClick={handlePublish}
              disabled={loading}
              className="px-8 py-6 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Ya, Publikasikan Proyek
            </Button>
          </div>

        </div>
      </UmkmLayout>
    );
  }

  // DEFAULT: FORM VIEW
  return (
    <UmkmLayout>
      <div className="max-w-[800px] mx-auto px-4 md:px-8 py-8 md:py-12">
        
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()} 
            className="p-2 -ml-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <PlusCircle className="w-6 h-6 md:w-8 md:h-8 text-secondary" /> Buat Proyek Baru
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Isi detail proyek untuk menarik minat mahasiswa terbaik.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-border/40 p-6 md:p-10 space-y-8">
          
          {/* Informasi Dasar */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-foreground border-b border-border/30 pb-2">1. Informasi Dasar</h2>
            
            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm font-bold text-foreground">Judul Proyek <span className="text-destructive">*</span></Label>
              <Input 
                id="title" 
                placeholder="Contoh: Desain Feed Instagram untuk Bulan Puasa" 
                className="h-12 rounded-xl"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="category" className="text-sm font-bold text-foreground">Kategori <span className="text-destructive">*</span></Label>
                <select 
                  id="category" 
                  className="w-full h-12 px-3 rounded-xl border border-input bg-background text-sm"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="" disabled>Pilih Kategori</option>
                  <option value="Desain Grafis">Desain Grafis</option>
                  <option value="Media Sosial">Media Sosial</option>
                  <option value="Administrasi">Administrasi</option>
                  <option value="Fotografi">Fotografi</option>
                  <option value="Penulisan / Copywriting">Penulisan / Copywriting</option>
                </select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="skills" className="text-sm font-bold text-foreground">Keahlian Spesifik</Label>
                <Input 
                  id="skills" 
                  placeholder="Contoh: Canva, Photoshop, Copywriting" 
                  className="h-12 rounded-xl"
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">Pisahkan dengan koma.</p>
              </div>
            </div>
          </div>

          {/* Deskripsi & Persyaratan */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-foreground border-b border-border/30 pb-2">2. Deskripsi Pekerjaan</h2>
            
            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-bold text-foreground">Penjelasan Proyek <span className="text-destructive">*</span></Label>
              <Textarea 
                id="description" 
                rows={5} 
                placeholder="Ceritakan secara detail apa yang harus dikerjakan..." 
                className="resize-none rounded-xl"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="output" className="text-sm font-bold text-foreground">Output yang Diharapkan <span className="text-destructive">*</span></Label>
              <Textarea 
                id="output" 
                rows={3} 
                placeholder="Contoh: 5 buah desain banner ukuran 1080x1080 format JPG/PNG." 
                className="resize-none rounded-xl"
                value={formData.output}
                onChange={(e) => setFormData({...formData, output: e.target.value})}
              />
            </div>
          </div>

          {/* Budget & Timeline */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-foreground border-b border-border/30 pb-2">3. Honorarium & Waktu</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="budget" className="text-sm font-bold text-foreground">Honorarium (Rp) <span className="text-destructive">*</span></Label>
                <Input 
                  id="budget" 
                  type="number" 
                  placeholder="Contoh: 150000" 
                  className="h-12 rounded-xl"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">Nominal uang saku/honorarium yang akan diberikan.</p>
              </div>
              <div className="space-y-3">
                <Label htmlFor="deadline" className="text-sm font-bold text-foreground">Tenggat Waktu Pekerjaan <span className="text-destructive">*</span></Label>
                <select 
                  id="deadline" 
                  className="w-full h-12 px-3 rounded-xl border border-input bg-background text-sm"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                >
                  <option value="" disabled>Pilih Tenggat Waktu</option>
                  <option value="1 - 3 Hari">1 - 3 Hari</option>
                  <option value="4 - 7 Hari">4 - 7 Hari</option>
                  <option value="1 - 2 Minggu">1 - 2 Minggu</option>
                  <option value="Fleksibel">Fleksibel</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-end">
          <Button variant="outline" className="px-8 py-6 rounded-xl font-semibold" onClick={() => router.back()}>
            Batal
          </Button>
          <Button 
            onClick={() => setStep("preview")}
            className="px-8 py-6 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            disabled={!formData.title || !formData.category || !formData.description || !formData.output || !formData.budget || !formData.deadline}
          >
            <Eye className="w-4 h-4 mr-2" /> Pratinjau Proyek
          </Button>
        </div>

      </div>
    </UmkmLayout>
  );
}
