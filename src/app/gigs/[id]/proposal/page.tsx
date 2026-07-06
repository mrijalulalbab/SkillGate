"use client";

import { StudentLayout } from "@/components/layout/StudentLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, UploadCloud, FileImage, FileText, 
  CheckCircle2, Clock, Calendar, Send, Loader2,
  Check, X, Info, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/toast-notification";

interface GigDetail {
  id: string;
  title: string;
  budget: number;
  umkm_id: string;
  deadline: string;
  applicant_count: number;
  skills_required: string[];
}

export default function ProposalSubmissionPage() {
  const router = useRouter();
  const params = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [gig, setGig] = useState<GigDetail | null>(null);
  const { showToast } = useToast();

  const [studentSkills, setStudentSkills] = useState<string[]>([]);
  const [readinessScore, setReadinessScore] = useState<number>(0);
  const [pastProjects, setPastProjects] = useState<any[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  // Form State
  const [coverLetter, setCoverLetter] = useState("");
  const [timelineDays, setTimelineDays] = useState(3);
  const [bidAmount, setBidAmount] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<{name: string, size: string, type: 'image' | 'pdf'}[]>([]);

  useEffect(() => {
    if (params?.id) {
      fetchGigDetails();
      fetchStudentProfile();
    }
  }, [params?.id]);

  async function fetchStudentProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("student_profiles")
          .select("skills, readiness_score")
          .eq("user_id", user.id)
          .single();
        if (profile) {
          setStudentSkills(profile.skills || []);
          setReadinessScore(profile.readiness_score || 0);
        }

        // Fetch student's completed projects
        const { data: gigsData } = await supabase
          .from("gigs")
          .select("id, title, category, budget")
          .eq("accepted_student_id", user.id)
          .eq("status", "completed");
        if (gigsData) {
          setPastProjects(gigsData);
        }
      }
    } catch (e) {
      console.error("Error fetching student profile for proposal:", e);
    }
  }

  async function fetchGigDetails() {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from("gigs")
        .select("id, title, budget, umkm_id, deadline, applicant_count, skills_required")
        .eq("id", params.id)
        .single();
      
      if (error) throw error;
      if (data) {
        setGig(data as GigDetail);
        setBidAmount(data.budget.toString());
      }
    } catch (e) {
      console.error("Error fetching gig details:", e);
    } finally {
      setFetching(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => {
        const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
        const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
        return {
          name: file.name,
          size: `${sizeInMb} MB`,
          type: isPdf ? 'pdf' as const : 'image' as const
        };
      });
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  async function handleSubmitProposal() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showToast("Anda harus masuk terlebih dahulu!", "error");
        setLoading(false);
        return;
      }

      if (!gig) {
        showToast("Informasi proyek tidak ditemukan!", "error");
        setLoading(false);
        return;
      }

      // Check if student already applied to this gig
      const { data: existingApp } = await supabase
        .from("applications")
        .select("id")
        .eq("gig_id", gig.id)
        .eq("student_id", user.id)
        .maybeSingle();

      if (existingApp) {
        showToast("Anda sudah mengirimkan proposal untuk proyek ini sebelumnya!", "error");
        setLoading(false);
        return;
      }

      // Format cover letter with highlighted projects if any
      let finalCoverLetter = coverLetter;
      if (selectedProjects.length > 0) {
        const selectedGigs = pastProjects.filter(p => selectedProjects.includes(p.id));
        const highlightText = selectedGigs.map(p => `- ${p.title} (${p.category})`).join("\n");
        finalCoverLetter += `\n\n---\n📌 PROYEK RELEVAN DARI HISTORI KERJA:\n${highlightText}`;
      }

      // Insert into applications table
      const { error } = await supabase
        .from("applications")
        .insert({
          gig_id: gig.id,
          student_id: user.id,
          cover_letter: finalCoverLetter,
          timeline_days: Number(timelineDays),
          bid_amount: Number(bidAmount),
          status: "pending"
        });

      if (error) throw error;

      // Update gig applicant_count
      const nextCount = (gig.applicant_count || 0) + 1;
      await supabase
        .from("gigs")
        .update({ applicant_count: nextCount })
        .eq("id", gig.id);

      // Create notification for UMKM
      await supabase.from("notifications").insert({
        user_id: gig.umkm_id,
        title: "Pelamar Baru",
        message: `Seorang mahasiswa telah mengirimkan proposal untuk proyek "${gig.title}" Anda.`,
        type: "gig_update",
        related_gig_id: gig.id
      });

      setSubmitted(true);
    } catch (e: any) {
      showToast(e.message || "Gagal mengirimkan proposal.", "error");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  if (submitted) {
    return (
      <StudentLayout>
        <div className="flex-1 flex items-center justify-center h-[calc(100vh-64px)] px-4">
          <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-border/40 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">Proposal Terkirim!</h1>
            <p className="text-muted-foreground mb-8">
              Klien akan segera meninjau proposal Anda. Anda dapat melacak statusnya di halaman Proyek Saya.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard/student" className={buttonVariants({ className: "w-full py-6 font-bold rounded-xl shadow-md" })}>Kembali ke Dashboard</Link>
              <Link href="/gigs" className={buttonVariants({ variant: "outline", className: "w-full py-6 font-semibold rounded-xl" })}>Kembali ke Cari Proyek</Link>
            </div>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="max-w-[800px] mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()} 
            className="p-2 -ml-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Kirim Proposal</h1>
            <p className="text-sm text-muted-foreground">{gig?.title || "Proyek Detail"}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border/40 p-6 md:p-8 space-y-8">
          
          {/* Analisis Kriteria Kelayakan */}
          {gig && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Analisis Kriteria Kelayakan Proyek
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sistem Informasi SkillGate mencocokkan profil akademis dan keahlian terdaftar Anda dengan kriteria yang ditentukan oleh UMKM.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Skills Match */}
                <div className="bg-white p-3 rounded-lg border border-slate-100 flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kecocokan Keahlian</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {gig.skills_required && gig.skills_required.length > 0 ? (
                      gig.skills_required.map((skill: string) => {
                        const isMatch = studentSkills.some(s => s.toLowerCase().trim() === skill.toLowerCase().trim());
                        return (
                          <div 
                            key={skill} 
                            className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${
                              isMatch 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                : "bg-rose-50 text-rose-600 border-rose-200"
                            }`}
                          >
                            {isMatch ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            {skill}
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-xs font-bold text-slate-500">Tidak ada syarat khusus</span>
                    )}
                  </div>
                </div>

                {/* Readiness Score Match */}
                <div className="bg-white p-3 rounded-lg border border-slate-100 flex flex-col justify-center">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Skor Kesiapan Kerja</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-xl font-bold text-slate-800">{readinessScore}%</strong>
                    <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                      {readinessScore >= 70 ? "Siap Kerja" : "Perlu Bimbingan"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Status Anda otomatis diperbarui berdasarkan pembelajaran aktif.</p>
                </div>
              </div>
            </div>
          )}

          {/* Cover Letter */}
          <div className="space-y-3">
            <Label htmlFor="coverLetter" className="text-base font-bold text-foreground">Pendekatan & Deskripsi Kerja</Label>
            <p className="text-sm text-muted-foreground">Ceritakan bagaimana Anda akan menyelesaikan proyek ini dan mengapa Anda cocok.</p>
            <Textarea 
              id="coverLetter" 
              rows={8}
              placeholder="Halo Bu Darmi, saya tertarik dengan proyek ini karena..."
              className="resize-none rounded-xl"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>

          {/* Upload Portfolio */}
          <div className="space-y-3">
            <Label className="text-base font-bold text-foreground">Lampiran Portofolio / Sampel (Opsional)</Label>
            
            <div className="flex gap-2 p-3 bg-blue-50/50 text-blue-700 rounded-xl border border-blue-100 text-xs leading-relaxed mb-3">
              <Info className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />
              <div>
                <strong>Profil & Portofolio Digital Terintegrasi:</strong> UMKM secara otomatis dapat melihat riwayat akademis, skor kesiapan, keahlian, dan portofolio utama yang terdaftar pada profil SkillGate Anda saat meninjau proposal ini. Unggah file tambahan hanya jika diperlukan sampel spesifik.
              </div>
            </div>

            <p className="text-sm text-muted-foreground pt-1">Unggah karya tambahan sebelumnya jika diperlukan (Maks. 5MB per file).</p>
            
            <div 
              className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-muted/20"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-sm font-semibold text-foreground mb-1">Klik untuk unggah atau seret file ke sini</p>
              <p className="text-xs text-muted-foreground">Mendukung PDF, JPG, PNG</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple 
                accept=".pdf,.jpg,.jpeg,.png" 
              />
            </div>
            
            {/* Attached Files List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border/50">
                    <div className="p-2 bg-white rounded-md shrink-0">
                      {f.type === 'pdf' ? <FileText className="w-5 h-5 text-red-500" /> : <FileImage className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{f.size}</p>
                    </div>
                    <button 
                      onClick={() => removeFile(i)}
                      className="text-xs font-semibold text-destructive hover:underline p-1"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pilihan Histori Proyek Relevan */}
          {pastProjects.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-border/40">
              <Label className="text-base font-bold text-foreground">Sematkan Histori Kerja Relevan (Highlight)</Label>
              <p className="text-sm text-muted-foreground">Pilih proyek yang pernah Anda selesaikan di platform untuk ditonjolkan kepada UMKM:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pastProjects.map((p) => {
                  const isChecked = selectedProjects.includes(p.id);
                  return (
                    <label 
                      key={p.id} 
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked 
                          ? "border-primary bg-primary/5 shadow-sm" 
                          : "border-border/60 hover:bg-muted/30 bg-white"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedProjects(selectedProjects.filter(id => id !== p.id));
                          } else {
                            setSelectedProjects([...selectedProjects, p.id]);
                          }
                        }}
                        className="w-4.5 h-4.5 text-primary rounded border-border focus:ring-primary mt-0.5"
                      />
                      <div>
                        <span className="text-sm font-bold text-slate-800 block leading-tight">{p.title}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1 block">
                          {p.category} • Rp {p.budget.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Timeline & Price Confirmation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40">
            <div className="space-y-3">
              <Label htmlFor="timeline" className="text-base font-bold text-foreground">Estimasi Pengerjaan</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select 
                  id="timeline" 
                  className="w-full pl-10 h-10 rounded-md border border-input bg-background text-sm"
                  value={timelineDays}
                  onChange={(e) => setTimelineDays(Number(e.target.value))}
                >
                  <option value={1}>1 Hari</option>
                  <option value={3}>3 Hari</option>
                  <option value={7}>7 Hari</option>
                  <option value={14}>14 Hari</option>
                  <option value={30}>30 Hari</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="bidAmount" className="text-base font-bold text-foreground">Penawaran Harga (Rp)</Label>
              <Input
                id="bidAmount"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="h-10 rounded-md"
              />
              <p className="text-xs text-muted-foreground">Anggaran Klien: Rp {gig?.budget?.toLocaleString("id-ID") || "0"}</p>
            </div>
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-end">
          <Button variant="outline" className="px-8 py-6 rounded-xl font-semibold" onClick={() => router.back()} disabled={loading}>
            Batal
          </Button>
          <Button 
            onClick={handleSubmitProposal}
            disabled={loading || !coverLetter || !bidAmount}
            className="px-8 py-6 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Kirim Proposal
          </Button>
        </div>

      </div>
    </StudentLayout>
  );
}
