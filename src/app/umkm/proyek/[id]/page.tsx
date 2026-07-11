"use client";

import { UmkmLayout } from "@/components/layout/UmkmLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { 
  ArrowLeft, CheckCircle2, Clock, FileText, 
  MessageSquare, UploadCloud, Users, Star, UserCheck, Loader2,
  Check, X, Award, Printer,
  Folder, FileSpreadsheet, Layers, Globe, Video, Palette, Link2
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/toast-notification";

interface StudentInfo {
  id: string;
  full_name: string;
  student_profiles: {
    major: string;
    university: string;
    skills: string[];
    readiness_score: number;
    rating_avg: number;
    projects_completed: number;
  }[];
}

interface Application {
  id: string;
  student_id: string;
  cover_letter: string;
  status: string;
  bid_amount: number;
  timeline_days: number;
  student: StudentInfo;
}

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
  accepted_student_id: string | null;
  skills_required: string[];
}

function getDeliverableDetails(url: string) {
  if (!url) return { label: "Hasil_Pekerjaan_Final.zip", type: "Tautan Eksternal / Hasil Terunggah", icon: Folder };
  if (url.includes("figma.com")) return { label: "Desain UI/UX (Figma File)", type: "Figma File Link", icon: Layers };
  if (url.includes("canva.com")) return { label: "Template Desain (Canva Link)", type: "Canva Design Link", icon: Palette };
  if (url.includes("instagram.com")) return { label: "Postingan Media Sosial (Instagram)", type: "Instagram Published Post", icon: Globe };
  if (url.includes("tiktok.com")) return { label: "Video Reels/TikTok (TikTok Video)", type: "TikTok Video Link", icon: Video };
  if (url.includes("dropbox.com")) return { label: "Arsip Aset (Dropbox Folder)", type: "Dropbox Shared Folder", icon: Folder };
  if (url.includes("onedrive") || url.includes("1drv.ms")) return { label: "Arsip Pekerjaan (OneDrive)", type: "OneDrive Shared Folder", icon: Folder };
  if (url.includes("docs.google.com/spreadsheets")) return { label: "Spreadsheet Data (Google Sheets)", type: "Google Sheets Spreadsheet", icon: FileSpreadsheet };
  if (url.includes("docs.google.com/document")) return { label: "Dokumen Teks (Google Docs)", type: "Google Docs Document", icon: FileText };
  if (url.includes("docs.google.com/forms")) return { label: "Kuesioner Digital (Google Forms)", type: "Google Forms Survey", icon: FileText };
  if (url.includes("drive.google.com")) return { label: "Folder Proyek (Google Drive)", type: "Google Drive Folder", icon: Folder };
  return { label: "Tautan Berkas Pekerjaan", type: "Tautan Kustom / Eksternal", icon: Link2 };
}

function calculateMatchScore(gig: Gig | null, app: Application) {
  if (!gig) return { totalScore: 0, breakdown: { skills: 0, readiness: 0, rating: 0 } };
  const gigSkills = gig.skills_required || [];
  const studentSkills = app.student?.student_profiles?.[0]?.skills || [];
  
  // 1. Skills Matching (40%)
  let skillMatchScore = 0;
  if (gigSkills.length > 0) {
    const matchingSkills = gigSkills.filter(skill => 
      studentSkills.some(sSkill => sSkill.toLowerCase().trim() === skill.toLowerCase().trim())
    );
    skillMatchScore = (matchingSkills.length / gigSkills.length) * 40;
  } else {
    skillMatchScore = 40; 
  }

  // 2. Readiness Score (35%)
  const readiness = app.student?.student_profiles?.[0]?.readiness_score || 0;
  const readinessMatchScore = (readiness / 100) * 35;

  // 3. Rating Average (25%)
  const rating = app.student?.student_profiles?.[0]?.rating_avg || 5.0;
  const ratingMatchScore = (rating / 5.0) * 25;

  const totalScore = Math.round(skillMatchScore + readinessMatchScore + ratingMatchScore);
  return {
    totalScore,
    breakdown: {
      skills: Math.round((skillMatchScore / 40) * 100),
      readiness: Math.round((readinessMatchScore / 35) * 100),
      rating: Math.round((ratingMatchScore / 25) * 100)
    }
  };
}

export default function UmkmProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { showToast } = useToast();
  
  const [gig, setGig] = useState<Gig | null>(null);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [activeFreelancer, setActiveFreelancer] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzingApp, setAnalyzingApp] = useState<Application | null>(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [businessName, setBusinessName] = useState("Mitra UMKM");
  
  // Rating and review states
  const [projectCompleted, setProjectCompleted] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    loadGigDetails();
  }, [id]);

  async function loadGigDetails() {
    setLoading(true);
    try {
      // Fetch UMKM profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: umkmProfile } = await supabase
          .from("umkm_profiles")
          .select("business_name")
          .eq("user_id", user.id)
          .single();
        if (umkmProfile) {
          setBusinessName(umkmProfile.business_name || "Mitra UMKM");
        }
      }

      // 1. Fetch Gig
      const { data: gigData, error: gigError } = await supabase
        .from("gigs")
        .select("*")
        .eq("id", id)
        .single();

      if (gigError) throw gigError;
      setGig(gigData as Gig);

      // 2. Fetch Applicants (pending)
      const { data: appsData, error: appsError } = await supabase
        .from("applications")
        .select(`
          id, student_id, cover_letter, status, bid_amount, timeline_days,
          student:student_id (
            id, full_name,
            student_profiles (major, university, skills, readiness_score, rating_avg, projects_completed)
          )
        `)
        .eq("gig_id", id);

      if (appsError) throw appsError;

      const normalizedApps = (appsData || []).map((app: any) => {
        if (app.student && app.student.student_profiles) {
          const profiles = app.student.student_profiles;
          app.student.student_profiles = Array.isArray(profiles) ? profiles : [profiles];
        }
        return app;
      });
      setApplicants(normalizedApps as unknown as Application[]);

      // 3. If in_progress or completed, fetch the accepted student's profile info
      if (gigData.accepted_student_id) {
        const { data: studentData } = await supabase
          .from("users")
          .select(`
            id, full_name,
            student_profiles (major, university, skills, readiness_score, rating_avg, projects_completed)
          `)
          .eq("id", gigData.accepted_student_id)
          .single();

        if (studentData) {
          const profiles = studentData.student_profiles;
          (studentData as any).student_profiles = Array.isArray(profiles) ? profiles : [profiles];
          setActiveFreelancer(studentData as unknown as StudentInfo);
        }
      }

      if (gigData.status === "completed") {
        setProjectCompleted(true);
      }

    } catch (e) {
      console.error("Error loading gig details:", e);
    } finally {
      setLoading(false);
    }
  }

  // Action: Accept Applicant
  async function handleAcceptApplicant(app: Application) {
    if (!gig) return;
    try {
      setLoading(true);
      
      // 1. Update Gig status and accepted freelancer
      const { error: gigUpdateError } = await supabase
        .from("gigs")
        .update({
          accepted_student_id: app.student_id,
          status: "in_progress",
          progress_percent: 10 // Start progress at 10%
        })
        .eq("id", gig.id);

      if (gigUpdateError) throw gigUpdateError;

      // 2. Update Application status
      const { error: appUpdateError } = await supabase
        .from("applications")
        .update({ status: "accepted" })
        .eq("id", app.id);

      if (appUpdateError) throw appUpdateError;

      // 3. Reject other applications for this gig
      await supabase
        .from("applications")
        .update({ status: "rejected" })
        .eq("gig_id", gig.id)
        .neq("id", app.id);

      // 4. Trigger a notification for the student
      await supabase.from("notifications").insert({
        user_id: app.student_id,
        title: "Proposal Diterima!",
        content: `Selamat! Proposal Anda untuk proyek "${gig.title}" telah diterima. Silakan masuk ke Ruang Kerja untuk memulai.`,
        is_read: false
      });

      showToast("Pekerja berhasil direkrut! Proyek sekarang masuk ke status 'Berjalan'.", "success");
      loadGigDetails();
    } catch (e) {
      console.error("Error accepting applicant:", e);
      showToast("Gagal menerima pelamar. Silakan coba lagi.", "error");
      setLoading(false);
    }
  }

  // Action: Complete Project and Send Review
  async function handleCompleteProject() {
    if (!gig || !gig.accepted_student_id) return;
    try {
      setLoading(true);

      // 1. Update Gig status to completed
      const { error: gigError } = await supabase
        .from("gigs")
        .update({ status: "completed", progress_percent: 100 })
        .eq("id", gig.id);

      if (gigError) throw gigError;

      setProjectCompleted(true);
      showToast("Proyek ditandai selesai! Harap isi ulasan di bawah.", "success");
      loadGigDetails();
    } catch (e) {
      console.error("Error completing project:", e);
      showToast("Gagal menyelesaikan proyek.", "error");
      setLoading(false);
    }
  }

  // Action: Submit Review
  async function handleSubmitReview() {
    if (!gig || !gig.accepted_student_id || !reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Insert review
      const { error: revError } = await supabase
        .from("reviews")
        .insert({
          gig_id: gig.id,
          reviewer_id: user.id,
          reviewee_id: gig.accepted_student_id,
          rating: rating,
          comment: reviewComment
        });

      if (revError) throw revError;

      // 2. Fetch current freelancer stats to update them
      const { data: profile } = await supabase
        .from("student_profiles")
        .select("projects_completed, rating_avg")
        .eq("user_id", gig.accepted_student_id)
        .single();

      if (profile) {
        const newCompleted = (profile.projects_completed || 0) + 1;
        const currentRatingAvg = profile.rating_avg || 5.0;
        // Calculate new moving average rating
        const newRatingAvg = Number(((currentRatingAvg * (newCompleted - 1) + rating) / newCompleted).toFixed(2));

        await supabase
          .from("student_profiles")
          .update({
            projects_completed: newCompleted,
            rating_avg: newRatingAvg
          })
          .eq("user_id", gig.accepted_student_id);
      }

      // 3. Update total_spent for UMKM
      const { data: umkmProfile } = await supabase
        .from("umkm_profiles")
        .select("total_spent")
        .eq("user_id", user.id)
        .single();
      
      if (umkmProfile) {
        await supabase
          .from("umkm_profiles")
          .update({
            total_spent: (umkmProfile.total_spent || 0) + gig.budget
          })
          .eq("user_id", user.id);
      }

      showToast("Ulasan berhasil dikirim! Reputasi mahasiswa telah terupdate.", "success");
      router.push("/umkm/proyek");
    } catch (e) {
      console.error("Error submitting review:", e);
      showToast("Gagal mengirimkan ulasan.", "error");
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) {
    return (
      <UmkmLayout>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        </div>
      </UmkmLayout>
    );
  }

  if (!gig) {
    return (
      <UmkmLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Proyek tidak ditemukan.</p>
        </div>
      </UmkmLayout>
    );
  }

  const isMenungguPelamar = gig.status === "open";
  const deadlineDate = new Date(gig.deadline).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <UmkmLayout>
      <div className="bg-white border-b border-border/40 sticky top-0 z-30">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/umkm/proyek")} 
              className="p-2 -ml-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-foreground">
              {isMenungguPelamar ? "Tinjau Pelamar" : "Ruang Kerja Proyek"}
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
              {isMenungguPelamar ? (
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span> Menunggu Pelamar
                </span>
              ) : gig.status === "completed" ? (
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span> Selesai
                </span>
              ) : (
                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Berjalan
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {gig.title}
            </h2>
            <p className="text-sm text-muted-foreground">Tenggat Waktu: <span className="font-bold text-foreground">{deadlineDate}</span></p>
            <p className="text-sm text-muted-foreground mt-1">Anggaran Proyek: <span className="font-bold text-emerald-600">Rp {gig.budget.toLocaleString("id-ID")}</span></p>
          </div>
          
          {!isMenungguPelamar && !projectCompleted && (
            <div className="flex flex-col gap-2 min-w-[200px]">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span>Progress Pengerjaan</span>
                <span className="text-secondary">{gig.progress_percent}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden mt-1">
                <div className="bg-secondary h-full rounded-full" style={{ width: `${gig.progress_percent}%` }}></div>
              </div>
            </div>
          )}
        </div>

        {isMenungguPelamar ? (
          /* STATE: Tinjau Pelamar */
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Users className="w-6 h-6 text-amber-500" />
                  Daftar Pelamar ({applicants.length})
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Diurutkan berdasarkan skor rekomendasi terbaik otomatis oleh sistem.</p>
              </div>
            </div>
            
            {applicants.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-border">
                <p className="text-muted-foreground">Belum ada mahasiswa yang mengirimkan proposal untuk proyek ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(() => {
                  // Precalculate scores and sort
                  const sortedApps = [...applicants].map(app => {
                    const match = calculateMatchScore(gig, app);
                    return { app, match };
                  }).sort((a, b) => b.match.totalScore - a.match.totalScore);

                  const highestScore = sortedApps[0]?.match.totalScore || 0;

                  return sortedApps.map(({ app, match }, index) => {
                    const sProfile = app.student?.student_profiles?.[0];
                    const readiness = sProfile?.readiness_score || 0;
                    const rating = sProfile?.rating_avg || 0;
                    const major = sProfile?.major || "Mahasiswa";
                    const isTopPick = index === 0 && match.totalScore >= 60;

                    // Match color
                    const matchColor = match.totalScore >= 80 
                      ? "text-emerald-600 bg-emerald-50 border-emerald-200" 
                      : match.totalScore >= 60 
                      ? "text-amber-600 bg-amber-50 border-amber-200" 
                      : "text-rose-600 bg-rose-50 border-rose-200";

                    return (
                      <div 
                        key={app.id} 
                        className={`bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-between relative transition-all border ${
                          isTopPick ? "border-secondary shadow-md ring-2 ring-secondary/15" : "border-border/40"
                        }`}
                      >
                        {isTopPick && (
                          <div className="absolute -top-3.5 left-6 bg-secondary text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-current" /> Rekomendasi Utama
                          </div>
                        )}
                        
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                <span className="font-bold text-primary">{(app.student?.full_name || "?")[0]}</span>
                              </div>
                              <div>
                                <h4 className="font-bold text-foreground leading-snug">{app.student?.full_name}</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">{major}</p>
                              </div>
                            </div>
                            
                            {/* Match Score Badge */}
                            <div className={`px-2.5 py-1 rounded-lg border text-center shrink-0 ${matchColor}`}>
                              <p className="text-[10px] font-bold uppercase tracking-wider leading-none">Match</p>
                              <p className="text-lg font-extrabold leading-none mt-1">{match.totalScore}%</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mb-4 text-xs font-semibold text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Readiness: {readiness}%
                            </span>
                            {rating > 0 && (
                              <span className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> {Number(rating).toFixed(1)}
                              </span>
                            )}
                          </div>
                          
                          <div className="bg-muted/30 p-4 rounded-xl mb-6 text-sm text-muted-foreground italic min-h-[90px] line-clamp-4 leading-relaxed">
                            &quot;{app.cover_letter}&quot;
                          </div>
                        </div>
                        
                        <div className="space-y-4 pt-4 border-t border-border/20">
                          <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                            <span>Penawaran: <strong className="text-emerald-600">Rp {app.bid_amount.toLocaleString("id-ID")}</strong></span>
                            <span>Estimasi: <strong>{app.timeline_days} Hari</strong></span>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              className="w-full text-xs font-bold text-primary border-primary/20 hover:bg-primary/5"
                              onClick={() => setAnalyzingApp(app)}
                            >
                              Analisis Kecocokan Pelamar
                            </Button>
                            
                            <Button 
                              onClick={() => handleAcceptApplicant(app)} 
                              className="w-full font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                            >
                              Terima & Mulai Proyek
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        ) : (
          /* STATE: Ruang Kerja (Berjalan) */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Submission & Workspace */}
            <div className="lg:col-span-2 space-y-6">
              
              {projectCompleted ? (
                <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Proyek Selesai!</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Anda telah mengkonfirmasi penyelesaian proyek ini. Honorarium sebesar Rp {gig.budget.toLocaleString("id-ID")} telah didepositkan dari Escrow ke saldo mahasiswa.
                  </p>
                  
                  {/* Rating Form */}
                  <div className="bg-white p-6 rounded-xl border border-border/40 w-full max-w-md text-left shadow-sm">
                    <h4 className="font-bold text-foreground mb-4">Berikan Penilaian untuk {activeFreelancer?.full_name}</h4>
                    <div className="flex justify-center gap-2 mb-6">
                      {[1,2,3,4,5].map(i => (
                        <Star 
                          key={i} 
                          onClick={() => setRating(i)}
                          className={`w-8 h-8 cursor-pointer hover:scale-110 transition-transform ${
                            i <= rating ? "text-amber-500 fill-current" : "text-muted-foreground"
                          }`} 
                        />
                      ))}
                    </div>
                    <textarea 
                      className="w-full p-3 rounded-lg border border-border/50 text-sm mb-4 resize-none focus:ring-secondary" 
                      rows={3} 
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Tulis ulasan Anda tentang hasil kerja mahasiswa..."
                    />
                    <Button 
                      onClick={handleSubmitReview}
                      disabled={submittingReview || !reviewComment.trim()}
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold"
                    >
                      {submittingReview ? "Mengirim..." : "Kirim Ulasan"}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/40">
                    <h3 className="text-xl font-bold text-foreground mb-6">Penyerahan Hasil Kerja</h3>
                    
                    {gig.deliverable_url ? (
                      <div>
                         {(() => {
                           const details = getDeliverableDetails(gig.deliverable_url);
                           const Icon = details.icon;
                           return (
                             <div className="border border-border/50 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 bg-muted/20 mb-6">
                               <div className="w-16 h-16 bg-white rounded-lg border border-border/50 flex items-center justify-center shrink-0">
                                 <Icon className="w-8 h-8 text-primary" />
                               </div>
                               <div className="flex-1 text-center sm:text-left">
                                 <h4 className="font-bold text-sm text-foreground">{details.label}</h4>
                                 <p className="text-xs text-muted-foreground">{details.type}</p>
                               </div>
                               <a 
                                 href={gig.deliverable_url} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className={buttonVariants({ variant: "outline", className: "w-full sm:w-auto font-semibold" })}
                               >
                                 Buka Tautan
                               </a>
                             </div>
                           );
                         })()}
                        
                        <p className="text-sm text-muted-foreground mb-8 p-4 bg-muted/30 rounded-xl italic">
                          &quot;{gig.deliverable_message || "Mahasiswa telah menyerahkan file pekerjaan mereka."}&quot;
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/40">
                          <Button 
                            onClick={async () => {
                              await supabase.from("gigs").update({ progress_percent: 70, deliverable_url: null }).eq("id", gig.id);
                              showToast("Permintaan revisi dikirim. Mahasiswa akan diberitahu.", "info");
                              loadGigDetails();
                            }}
                            variant="outline" 
                            className="flex-1 font-semibold flex items-center justify-center gap-2"
                          >
                            <MessageSquare className="w-4 h-4" /> Minta Revisi
                          </Button>
                          <Button 
                            onClick={handleCompleteProject}
                            className="flex-1 font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Terima Hasil & Selesai
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h4 className="font-semibold text-foreground">Menunggu Penyerahan Berkas</h4>
                        <p className="text-sm mt-1">Mahasiswa belum mengunggah hasil pekerjaan mereka.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* Right Col: Freelancer Info & Quick Chat */}
            <div className="lg:col-span-1 space-y-6">
              {/* Progress Milestones Tracker */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40">
                <h3 className="font-bold text-foreground mb-4">Milestone & Progres Proyek</h3>
                
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-muted-foreground">Progres dari Freelancer</span>
                    <span className="text-secondary font-bold">{gig.progress_percent || 10}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${gig.progress_percent || 10}%` }} 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { level: 25, label: "Tahap 1: Briefing & Perencanaan" },
                    { level: 50, label: "Tahap 2: Draf / Konsep Kasar" },
                    { level: 75, label: "Tahap 3: Revisi & Umpan Balik" },
                    { level: 90, label: "Tahap 4: Penyerahan Berkas" }
                  ].map((milestone) => {
                    const isDone = (gig.progress_percent || 10) >= milestone.level;
                    return (
                      <div key={milestone.level} className="flex items-center gap-3 text-sm">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-border bg-white"
                        }`}>
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`font-semibold ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>
                          {milestone.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40">
                <h3 className="font-bold text-foreground mb-4">Informasi Pekerja</h3>
                {activeFreelancer ? (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-full bg-secondary/15 flex items-center justify-center shrink-0 border border-secondary/20">
                        <span className="font-bold text-secondary">{(activeFreelancer.full_name || "?")[0]}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{activeFreelancer.full_name}</h4>
                        <p className="text-xs text-muted-foreground">{activeFreelancer.student_profiles?.[0]?.major}</p>
                      </div>
                    </div>
                    
                    <Link href="/umkm/chat" className={buttonVariants({ variant: "outline", className: "w-full font-semibold mb-2" })}>
                      <MessageSquare className="w-4 h-4 mr-2" /> Tanya Pekerja (Chat)
                    </Link>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Belum ada pekerja aktif untuk proyek ini.</p>
                )}
              </div>

              {activeFreelancer && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/40">
                  <h3 className="font-bold text-foreground mb-3">Dokumen & Kontrak Kerja</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Surat Perjanjian Kerja (SPK) digital resmi antara UMKM Anda dengan pelaksana mahasiswa.
                  </p>
                  <Button 
                    onClick={() => setShowContractModal(true)} 
                    variant="outline" 
                    className="w-full font-bold flex items-center justify-center gap-2 border-secondary/35 text-secondary hover:bg-secondary/5"
                  >
                    <FileText className="w-4 h-4" /> Lihat Kontrak SPK
                  </Button>
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
                    {(() => {
                      const signed = typeof window !== "undefined" && localStorage.getItem(`spk_signed_${id}`) === "true";
                      return (
                        <>
                          <span className={`w-2.5 h-2.5 rounded-full ${signed ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                          <span className={signed ? "text-emerald-700" : "text-amber-700"}>
                            {signed ? "Disetujui Kedua Belah Pihak" : "Menunggu Tanda Tangan Mahasiswa"}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        )}

        {/* Modal Analisis Kecocokan Rekomendasi Pelamar */}
        {analyzingApp && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200 relative">
              <button 
                onClick={() => setAnalyzingApp(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Analisis Kecocokan Pelamar</h3>
                  <p className="text-sm text-muted-foreground">Sistem Pendukung Keputusan (DSS) SkillGate</p>
                </div>
              </div>

              {/* Student Header */}
              <div className="p-4 bg-muted/30 border border-border/40 rounded-2xl mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-secondary">
                  {(analyzingApp.student?.full_name || "?")[0]}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{analyzingApp.student?.full_name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {analyzingApp.student?.student_profiles?.[0]?.major} • {analyzingApp.student?.student_profiles?.[0]?.university || "UII"}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <span className="text-xs text-muted-foreground block font-medium">Skor Total</span>
                  <span className="text-2xl font-black text-secondary">
                    {calculateMatchScore(gig, analyzingApp).totalScore}%
                  </span>
                </div>
              </div>

              {/* Analysis Breakdown */}
              <div className="space-y-6">
                {(() => {
                  const score = calculateMatchScore(gig, analyzingApp);
                  const sProfile = analyzingApp.student?.student_profiles?.[0];
                  const studentSkills = sProfile?.skills || [];
                  const gigSkills = gig?.skills_required || [];

                  return (
                    <>
                      {/* 1. Kriteria Keahlian */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-foreground">1. Kesesuaian Keahlian (Bobot: 40%)</span>
                          <span className="font-bold text-primary">{score.breakdown.skills}% Match</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${score.breakdown.skills}%` }} />
                        </div>
                        
                        {/* Skills breakdown checkboxes */}
                        <div className="pt-2">
                          <span className="text-xs font-semibold text-muted-foreground block mb-2">Perbandingan Keahlian yang Dibutuhkan:</span>
                          <div className="flex flex-wrap gap-2">
                            {gigSkills.length > 0 ? (
                              gigSkills.map((skill) => {
                                const hasSkill = studentSkills.some(s => s.toLowerCase().trim() === skill.toLowerCase().trim());
                                return (
                                  <span 
                                    key={skill} 
                                    className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 border ${
                                      hasSkill 
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                        : "bg-rose-50 text-rose-700 border-rose-200"
                                    }`}
                                  >
                                    {hasSkill ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                    {skill}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-xs text-muted-foreground italic">Proyek tidak mensyaratkan keahlian khusus secara spesifik.</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 2. Kriteria Kesiapan Kerja */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-foreground">2. Skor Kesiapan Kerja (Bobot: 35%)</span>
                          <span className="font-bold text-amber-500">{score.breakdown.readiness}% Match</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${score.breakdown.readiness}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Mahasiswa memiliki Skor Kesiapan Kerja sebesar <strong>{sProfile?.readiness_score || 0}%</strong> berdasarkan modul pembelajaran mandiri yang telah mereka selesaikan.
                        </p>
                      </div>

                      {/* 3. Kriteria Rating & Reputasi */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-foreground">3. Rating & Reputasi (Bobot: 25%)</span>
                          <span className="font-bold text-emerald-600">{score.breakdown.rating}% Match</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${score.breakdown.rating}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Rating rata-rata: <strong>{Number(sProfile?.rating_avg || 5.0).toFixed(1)}/5.0</strong>. Proyek diselesaikan: <strong>{sProfile?.projects_completed || 0} proyek</strong>.
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="mt-8">
                <Button 
                  onClick={() => setAnalyzingApp(null)} 
                  className="w-full font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground py-6 rounded-xl"
                >
                  Selesai Meninjau
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* MODAL KONTRAK KERJA / SPK */}
        {showContractModal && gig && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto text-left">
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
                    <p className="pl-4">Nama UMKM: {businessName}</p>
                    <p className="pl-4">Peran: Pemberi Kerja & Pemilik Proyek</p>
                    
                    <p className="mt-2"><strong>PIHAK KEDUA (Penerima Tugas):</strong></p>
                    <p className="pl-4">Nama Pelaksana: {activeFreelancer?.full_name || "Mahasiswa"}</p>
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
                        Pekerjaan harus diserahkan secara lengkap sebelum tanggal <strong>{new Date(gig.deadline).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</strong>. 
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
                        {(() => {
                          const signed = typeof window !== "undefined" && localStorage.getItem(`spk_signed_${id}`) === "true";
                          return (
                            <span className={`text-[10px] font-sans font-bold px-3 py-1.5 rounded-md uppercase tracking-wider border ${
                              signed 
                                ? "text-emerald-600 bg-emerald-50 border-emerald-200" 
                                : "text-amber-600 bg-amber-50 border-amber-200 animate-pulse"
                            }`}>
                              {signed ? "✓ SIGNED DIGITAL" : "WAITING SIGNATURE"}
                            </span>
                          );
                        })()}
                      </div>
                      <p className="font-bold underline text-xs">{activeFreelancer?.full_name || "Mahasiswa"}</p>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </UmkmLayout>
  );
}
