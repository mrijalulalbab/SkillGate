"use client";

import { StudentLayout } from "@/components/layout/StudentLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, CheckCircle2, Clock, FileText, 
  MessageSquare, UploadCloud, FileImage, Send, Loader2, Printer,
  Folder, FileSpreadsheet, Layers, Globe, Video, Palette, Link2
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/toast-notification";

interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  status: string;
  progress_percent: number;
  deliverable_url: string;
  deliverable_message: string;
  umkm: {
    full_name: string;
    umkm_profiles: {
      business_name: string;
      category: string;
    }[];
  };
}

const SUBMISSION_OPTIONS: Record<string, { value: string; label: string; placeholder: string; desc: string; icon: any }[]> = {
  "Desain Grafis": [
    { value: "figma", label: "Figma Link", placeholder: "https://www.figma.com/file/...", desc: "Tautan dokumen desain Figma aktif", icon: Layers },
    { value: "canva", label: "Canva Design Link", placeholder: "https://www.canva.com/design/...", desc: "Tautan template/desain Canva", icon: Palette },
    { value: "google_drive", label: "Google Drive Folder", placeholder: "https://drive.google.com/drive/folders/...", desc: "Folder Google Drive berisi aset desain", icon: Folder },
    { value: "other", label: "Tautan Kustom", placeholder: "https://...", desc: "Tautan eksternal lainnya", icon: Link2 },
  ],
  "Media Sosial": [
    { value: "instagram", label: "Instagram Post", placeholder: "https://www.instagram.com/p/...", desc: "Tautan postingan Instagram yang terbit", icon: Globe },
    { value: "tiktok", label: "Video TikTok", placeholder: "https://www.tiktok.com/@username/video/...", desc: "Tautan video TikTok yang diunggah", icon: Video },
    { value: "canva", label: "Canva Feed Link", placeholder: "https://www.canva.com/design/...", desc: "Tautan draf feed Canva", icon: Palette },
    { value: "google_drive", label: "Google Drive Folder", placeholder: "https://drive.google.com/drive/folders/...", desc: "Folder Google Drive berisi aset & copywriting", icon: Folder },
    { value: "other", label: "Tautan Kustom", placeholder: "https://...", desc: "Tautan eksternal lainnya", icon: Link2 },
  ],
  "Fotografi": [
    { value: "google_drive", label: "Google Drive Folder", placeholder: "https://drive.google.com/drive/folders/...", desc: "Folder Google Drive berisi foto asli HD", icon: Folder },
    { value: "dropbox", label: "Dropbox Folder", placeholder: "https://www.dropbox.com/sh/...", desc: "Folder Dropbox penyimpanan foto", icon: Folder },
    { value: "onedrive", label: "OneDrive Link", placeholder: "https://1drv.ms/f/...", desc: "Tautan folder OneDrive", icon: Folder },
    { value: "other", label: "Tautan Kustom", placeholder: "https://...", desc: "Tautan eksternal lainnya", icon: Link2 },
  ],
  "Administrasi": [
    { value: "google_sheets", label: "Google Sheets Link", placeholder: "https://docs.google.com/spreadsheets/d/...", desc: "Tautan spreadsheet data online", icon: FileSpreadsheet },
    { value: "google_docs", label: "Google Docs Link", placeholder: "https://docs.google.com/document/d/...", desc: "Tautan dokumen teks Google Docs", icon: FileText },
    { value: "google_forms", label: "Google Forms Link", placeholder: "https://docs.google.com/forms/d/...", desc: "Tautan kuesioner Google Form", icon: FileText },
    { value: "other", label: "Tautan Kustom", placeholder: "https://...", desc: "Tautan eksternal lainnya", icon: Link2 },
  ],
};

const DEFAULT_OPTIONS = [
  { value: "google_drive", label: "Google Drive", placeholder: "https://drive.google.com/...", desc: "Tautan folder Google Drive", icon: Folder },
  { value: "other", label: "Tautan Kustom", placeholder: "https://...", desc: "Tautan eksternal lainnya", icon: Link2 },
];

export default function DetailProyekStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { showToast } = useToast();
  
  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionType, setSubmissionType] = useState("google_drive");
  const [deliverableUrl, setDeliverableUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadGigDetails();
  }, [id]);

  const [showContractModal, setShowContractModal] = useState(false);
  const [studentSigned, setStudentSigned] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const signed = localStorage.getItem(`spk_signed_${id}`) === "true";
      setStudentSigned(signed);
    }
  }, [id]);

  const handleSignContract = () => {
    localStorage.setItem(`spk_signed_${id}`, "true");
    setStudentSigned(true);
    showToast("Kontrak SPK berhasil ditandatangani secara digital!", "success");
  };

  async function loadGigDetails() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gigs")
        .select(`
          id, title, description, category, budget, deadline, status, progress_percent, deliverable_url, deliverable_message,
          umkm:umkm_id (
            full_name,
            umkm_profiles (business_name, category)
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setGig(data as unknown as Gig);

      if (data.deliverable_url) {
        setSubmitted(true);
        setDeliverableUrl(data.deliverable_url);
        setMessage(data.deliverable_message || "");
        
        const url = data.deliverable_url;
        if (url.includes("figma.com")) setSubmissionType("figma");
        else if (url.includes("canva.com")) setSubmissionType("canva");
        else if (url.includes("instagram.com")) setSubmissionType("instagram");
        else if (url.includes("tiktok.com")) setSubmissionType("tiktok");
        else if (url.includes("dropbox.com")) setSubmissionType("dropbox");
        else if (url.includes("onedrive") || url.includes("1drv.ms")) setSubmissionType("onedrive");
        else if (url.includes("docs.google.com/spreadsheets")) setSubmissionType("google_sheets");
        else if (url.includes("docs.google.com/document")) setSubmissionType("google_docs");
        else if (url.includes("docs.google.com/forms")) setSubmissionType("google_forms");
        else if (url.includes("drive.google.com")) setSubmissionType("google_drive");
        else setSubmissionType("other");
      } else {
        if (data.category === "Desain Grafis") setSubmissionType("figma");
        else if (data.category === "Media Sosial") setSubmissionType("instagram");
        else if (data.category === "Fotografi") setSubmissionType("google_drive");
        else if (data.category === "Administrasi") setSubmissionType("google_sheets");
        else setSubmissionType("google_drive");
      }
    } catch (e) {
      console.error("Error loading gig details:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateProgress = async (newProgress: number) => {
    if (!gig) return;
    try {
      const { error } = await supabase
        .from("gigs")
        .update({ progress_percent: newProgress })
        .eq("id", gig.id);

      if (error) throw error;
      setGig(prev => prev ? { ...prev, progress_percent: newProgress } : null);
      showToast(`Progres pekerjaan diperbarui menjadi ${newProgress}%`, "success");
    } catch (e) {
      console.error("Error updating progress:", e);
      showToast("Gagal memperbarui progres.", "error");
    }
  };

  const handleSubmitWork = async () => {
    if (!deliverableUrl.trim() || !gig) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("gigs")
        .update({
          deliverable_url: deliverableUrl,
          deliverable_message: message,
          progress_percent: 90 // Set progress to 90% when submitted
        })
        .eq("id", gig.id);

      if (error) throw error;
      
      // Update local state
      setSubmitted(true);
      setGig(prev => prev ? { ...prev, progress_percent: 90, deliverable_url: deliverableUrl, deliverable_message: message } : null);
      showToast("Hasil pekerjaan berhasil diserahkan! Klien telah diberitahu.", "success");
    } catch (e) {
      console.error("Error submitting work:", e);
      showToast("Gagal mengirimkan pekerjaan.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  if (!gig) {
    return (
      <StudentLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Proyek tidak ditemukan.</p>
        </div>
      </StudentLayout>
    );
  }

  const deadlineDate = new Date(gig.deadline).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
  const umkmName = gig.umkm?.full_name || "UMKM";
  const businessName = gig.umkm?.umkm_profiles?.[0]?.business_name || "UMKM Partner";
  const currentProgress = gig.progress_percent || 10;

  // Define milestones and calculate state
  const milestones = [
    { level: 25, label: "Perencanaan & Diskusi Briefing", desc: "Menyelaraskan kebutuhan proyek dengan klien" },
    { level: 50, label: "Pengiriman Draf / Konsep Kasar", desc: "Mengirimkan draf atau sketsa awal pekerjaan" },
    { level: 75, label: "Proses Revisi & Umpan Balik", desc: "Melakukan perbaikan sesuai masukan klien" },
    { level: 90, label: "Penyerahan Berkas Akhir", desc: "Unggah berkas final atau tautan pekerjaan" }
  ];

  return (
    <StudentLayout>
      <div className="bg-white border-b border-border/40 sticky top-0 z-30">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/student/proyek-saya")} 
              className="p-2 -ml-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-foreground">
              Ruang Kerja Proyek
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* Project Header Info */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/40 mb-8 flex flex-col md:flex-row justify-between md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-semibold">{gig.category}</span>
              {gig.status === "completed" ? (
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span> Selesai
                </span>
              ) : (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Dalam Proses
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {gig.title}
            </h2>
            <p className="text-sm text-muted-foreground">Klien: <span className="font-bold text-foreground">{businessName} ({umkmName})</span></p>
          </div>
          
          <div className="flex flex-col gap-2 min-w-[200px]">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span>Tenggat Waktu</span>
              <span className="text-destructive flex items-center gap-1"><Clock className="w-4 h-4" /> {deadlineDate}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-semibold">
              <span>Honorarium</span>
              <span className="text-emerald-600 font-bold">Rp {gig.budget.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Col: Workspace / Submission */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Milestones Checklist Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/40">
              <h3 className="text-xl font-bold text-foreground mb-4">Milestone & Progres Pekerjaan</h3>
              <p className="text-sm text-muted-foreground mb-6">Centang setiap tahap setelah Anda menyelesaikannya untuk memperbarui progress proyek secara transparan kepada klien.</p>
              
              {/* Progress Bar Visual */}
              <div className="mb-8">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-muted-foreground">Status Progres Aktual</span>
                  <span className="text-primary font-bold text-sm">{currentProgress}% Selesai</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${currentProgress}%` }} 
                  />
                </div>
              </div>

              {/* Interactive Steps */}
              <div className="space-y-4">
                {milestones.map((milestone) => {
                  const isDone = currentProgress >= milestone.level;
                  const isFinalStep = milestone.level === 90;
                  
                  return (
                    <div 
                      key={milestone.level} 
                      className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                        isDone 
                          ? "bg-emerald-50/40 border-emerald-200" 
                          : "bg-white border-border/60 hover:border-border"
                      }`}
                    >
                      <button
                        onClick={() => {
                          if (gig.status === "completed") return;
                          if (isFinalStep) {
                            // Stage 4 requires using the submission form below
                            showToast("Silakan isi formulir Penyerahan Hasil Kerja di bawah untuk tahap ini.", "info");
                            return;
                          }
                          // Toggle logic
                          const nextProgress = isDone ? (milestone.level - 25 <= 0 ? 10 : milestone.level - 25) : milestone.level;
                          handleUpdateProgress(nextProgress);
                        }}
                        disabled={gig.status === "completed"}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                          isDone 
                            ? "bg-emerald-500 border-emerald-500 text-white" 
                            : "border-border hover:border-primary/50 bg-white"
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4 fill-emerald-500" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`font-bold text-sm leading-none ${isDone ? 'text-emerald-900 line-through opacity-80' : 'text-foreground'}`}>
                            {milestone.label}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'
                          }`}>
                            Target: {milestone.level}%
                          </span>
                        </div>
                        <p className={`text-xs mt-1.5 ${isDone ? 'text-emerald-700/70' : 'text-muted-foreground'}`}>
                          {milestone.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submission / Workspace */}
            {submitted ? (
              <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Hasil Kerja Berhasil Dikirim!</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Klien sedang meninjau hasil kerja Anda. Jika klien menyetujui, status proyek akan diubah menjadi Selesai dan dana akan dilepaskan ke dompet Anda.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setSubmitted(false)}>Kirim Ulang</Button>
                  <Link href="/dashboard/student" className={buttonVariants()}>Kembali ke Dashboard</Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/40">
                <h3 className="text-xl font-bold text-foreground mb-6 font-bold flex items-center gap-2">
                  <UploadCloud className="w-6 h-6 text-primary" />
                  Penyerahan Hasil Kerja (Tahap Final)
                </h3>
                
                <div className="space-y-6">
                  {/* Format Selector */}
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-3">Format Penyerahan Hasil Kerja</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {(SUBMISSION_OPTIONS[gig?.category || ""] || DEFAULT_OPTIONS).map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = submissionType === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setSubmissionType(opt.value);
                              // Clear URL if switching to prevent submitting invalid placeholder formats
                              setDeliverableUrl("");
                            }}
                            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all duration-250 hover:shadow-sm ${
                              isSelected
                                ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                                : "border-border/60 hover:border-border/80 text-foreground"
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs font-bold tracking-tight">{opt.label}</span>
                              <Icon className={`w-4 h-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                            </div>
                            <span className="text-[10px] text-muted-foreground leading-normal line-clamp-1">
                              {opt.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* URL Input */}
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5">
                      <span>Tautan Tautan Berkas ({
                        (SUBMISSION_OPTIONS[gig?.category || ""] || DEFAULT_OPTIONS).find(o => o.value === submissionType)?.label || "Tautan"
                      })</span>
                    </h4>
                    <Input 
                      type="url"
                      placeholder={
                        (SUBMISSION_OPTIONS[gig?.category || ""] || DEFAULT_OPTIONS).find(o => o.value === submissionType)?.placeholder || 
                        "https://..."
                      } 
                      className="rounded-xl border-border/60"
                      value={deliverableUrl}
                      onChange={(e) => setDeliverableUrl(e.target.value)}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-2">Pesan untuk Klien (Revisi / Catatan Pengerjaan)</h4>
                    <Textarea 
                      rows={4} 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="resize-none rounded-xl focus:ring-primary" 
                      placeholder="Jelaskan hasil pekerjaan Anda atau tambahkan catatan untuk klien..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-border/40">
                    <Button 
                      className="w-full font-bold py-6" 
                      disabled={!deliverableUrl.trim() || isSubmitting}
                      onClick={handleSubmitWork}
                    >
                      {isSubmitting ? "Mengirim..." : (
                        <><Send className="w-4 h-4 mr-2" /> Kirim Hasil Pekerjaan</>
                      )}
                    </Button>
                    {!deliverableUrl.trim() && (
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        Anda harus menyertakan tautan berkas pekerjaan untuk dapat menyerahkan hasil kerja.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Col: Client Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40">
              <h3 className="font-bold text-foreground mb-4">Informasi Klien</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <span className="font-bold text-primary">{umkmName[0]}</span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{businessName}</h4>
                  <p className="text-xs text-muted-foreground">{umkmName}</p>
                </div>
              </div>
              
              <Link href="/chat" className={buttonVariants({ variant: "outline", className: "w-full font-semibold mb-2" })}>
                <MessageSquare className="w-4 h-4 mr-2" /> Tanya Klien (Chat)
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40">
              <h3 className="font-bold text-foreground mb-3">Dokumen & Kontrak Kerja</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Surat Perjanjian Kerja (SPK) digital yang mengatur hak, kewajiban, dan honorarium proyek ini.
              </p>
              <Button 
                onClick={() => setShowContractModal(true)} 
                variant="outline" 
                className="w-full font-bold flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> Lihat Kontrak SPK
              </Button>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
                <span className={`w-2.5 h-2.5 rounded-full ${studentSigned ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                <span className={studentSigned ? "text-emerald-700" : "text-amber-700"}>
                  {studentSigned ? "Sudah Ditandatangani" : "Menunggu Tanda Tangan Anda"}
                </span>
              </div>
            </div>

            <div className="bg-muted/30 rounded-2xl p-6 border border-border/40">
              <h3 className="font-bold text-foreground mb-2 text-sm uppercase tracking-wider">Brief Proyek</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {gig.description}
              </p>
            </div>
          </div>
          
        </div>
      </div>

      {/* MODAL KONTRAK KERJA / SPK */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200 my-8">
            
            {/* Modal Actions (no-print) */}
            <div className="flex justify-end gap-2 mb-6 no-print">
              <Button onClick={() => window.print()} variant="outline" size="sm" className="font-semibold">
                <Printer className="w-4 h-4 mr-2" /> Cetak Kontrak
              </Button>
              <Button onClick={() => setShowContractModal(false)} variant="ghost" size="sm" className="font-semibold">
                Tutup
              </Button>
            </div>

            {/* Printable SPK Document Content */}
            <div className="border border-slate-300 p-8 md:p-12 bg-white text-black font-serif text-sm shadow-inner rounded-xl max-h-[60vh] overflow-y-auto print:max-h-none print:overflow-visible print:border-none print:shadow-none print:p-0">
              
              {/* Header Letterhead */}
              <div className="text-center border-b-2 border-black pb-4 mb-6">
                <h2 className="text-xl font-bold uppercase tracking-wide">SURAT PERJANJIAN KERJASAMA (SPK)</h2>
                <p className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-widest mt-1">Platform Hubungan Mahasiswa & UMKM Sleman • SkillGate</p>
                <p className="text-xs font-sans mt-0.5">Nomor: SG/SPK/{new Date().getFullYear()}/{gig.id.slice(0, 8).toUpperCase()}</p>
              </div>

              {/* Body */}
              <div className="space-y-4 leading-relaxed text-xs">
                <p>
                  Pada hari ini, yang bertanda tangan di bawah ini secara sah setuju untuk melakukan perikatan kontrak pengerjaan proyek mikro digital:
                </p>

                {/* Parties */}
                <div className="space-y-2 pl-4">
                  <p><strong>PIHAK PERTAMA (Pemberi Tugas):</strong></p>
                  <p className="pl-4">Nama UMKM: {businessName} ({umkmName})</p>
                  <p className="pl-4">Peran: Pemberi Kerja & Pemilik Proyek</p>
                  
                  <p className="mt-2"><strong>PIHAK KEDUA (Penerima Tugas):</strong></p>
                  <p className="pl-4">Nama Pelaksana: Andi Setiawan</p>
                  <p className="pl-4">Institusi: Universitas Islam Indonesia (Mahasiswa)</p>
                </div>

                <p>Kedua belah pihak sepakat untuk melakukan kerjasama pengerjaan proyek dengan ketentuan sebagai berikut:</p>

                {/* Pasals */}
                <div className="space-y-3">
                  <div>
                    <p className="font-bold">PASAL 1 - RUANG LINGKUP & PEKERJAAN</p>
                    <p className="pl-4">PIHAK KEDUA berkewajiban menyelesaikan pekerjaan digital dengan spesifikasi:</p>
                    <p className="pl-8 font-sans font-semibold mt-1">Judul: {gig.title}</p>
                    <p className="pl-8 font-sans mt-0.5">Kategori: {gig.category}</p>
                  </div>

                  <div>
                    <p className="font-bold">PASAL 2 - NILAI KONTRAK & PEMBAYARAN ESCROW</p>
                    <p className="pl-4">
                      Total honorarium proyek disepakati sebesar <strong>Rp {gig.budget.toLocaleString("id-ID")}</strong>. 
                      Dana saat ini telah didepositkan secara aman ke rekening Escrow SkillGate oleh PIHAK PERTAMA, dan akan dilepaskan secara otomatis ke saldo dompet PIHAK KEDUA setelah PIHAK PERTAMA mengonfirmasi penyelesaian tugas.
                    </p>
                  </div>

                  <div>
                    <p className="font-bold">PASAL 3 - TENGGAT WAKTU & REVISI</p>
                    <p className="pl-4">
                      Pekerjaan harus diserahkan secara lengkap sebelum tanggal <strong>{deadlineDate}</strong>. 
                      PIHAK PERTAMA berhak meminta revisi hasil pekerjaan apabila draf final tidak sesuai dengan kesepakatan brief awal.
                    </p>
                  </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-200">
                  <div className="text-center">
                    <p>PIHAK PERTAMA</p>
                    <p className="text-[10px] text-slate-500 font-sans mt-0.5">UMKM Partner</p>
                    <div className="my-4 h-12 flex items-center justify-center">
                      <span className="text-[10px] font-sans font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md uppercase tracking-wider">
                        ✓ SIGNED (UMKM)
                      </span>
                    </div>
                    <p className="font-bold underline text-xs">{businessName}</p>
                  </div>

                  <div className="text-center">
                    <p>PIHAK KEDUA</p>
                    <p className="text-[10px] text-slate-500 font-sans mt-0.5">Pelaksana Mahasiswa</p>
                    <div className="my-4 h-12 flex items-center justify-center">
                      {studentSigned ? (
                        <span className="text-[10px] font-sans font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md uppercase tracking-wider">
                          ✓ SIGNED DIGITAL
                        </span>
                      ) : (
                        <Button 
                          onClick={handleSignContract} 
                          size="sm" 
                          className="bg-primary hover:bg-primary/90 text-white font-bold text-[10px] px-3 py-1 no-print"
                        >
                          Tandatangani SPK
                        </Button>
                      )}
                    </div>
                    <p className="font-bold underline text-xs">Andi Setiawan</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
