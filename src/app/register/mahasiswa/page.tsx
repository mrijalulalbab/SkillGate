"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, ArrowRight, CheckCircle2, BookOpen, Clock,
  School, Briefcase, Trophy, ChevronRight, Star, Zap, Mail, Lock, Eye, EyeOff
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

function MinimalNav() {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-background/80 backdrop-blur-md border-b border-border/30">
      <Link href="/" className="font-bold text-xl text-primary hover:opacity-90 transition-opacity">
        SkillGate
      </Link>
      <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        Sudah punya akun? <span className="text-primary font-semibold">Login</span>
      </Link>
    </nav>
  );
}

const availableSkills = [
  "Desain Grafis", "Fotografi Produk", "Copywriting", "Social Media Management",
  "Digital Marketing", "Penyuntingan Video", "Analisis Data", "UI/UX Design", "Akuntansi & Pembukuan"
];
const availableInterests = [
  "Kuliner (F&B)", "Fashion & Retail", "Teknologi & Startup", "Kecantikan & Kesehatan", "Agrikultur", "Kerajinan Tangan"
];

const quizQuestions = [
  {
    id: 1,
    question: "Berapa lama pengalaman Anda dalam desain grafis?",
    options: ["Baru mulai belajar", "1–6 bulan", "6 bulan – 1 tahun", "Lebih dari 1 tahun"],
  },
  {
    id: 2,
    question: "Software apa yang paling Anda kuasai?",
    options: ["Canva (drag & drop)", "Adobe Illustrator", "Figma", "Adobe Photoshop"],
  },
  {
    id: 3,
    question: "Seberapa nyaman Anda bekerja dengan klien langsung?",
    options: ["Belum pernah, tapi ingin mencoba", "Cukup nyaman dengan bimbingan", "Sangat nyaman", "Pernah freelance sebelumnya"],
  },
  {
    id: 4,
    question: "Berapa jam per minggu yang bisa Anda dedikasikan?",
    options: ["< 5 jam", "5–10 jam", "10–20 jam", "> 20 jam"],
  },
  {
    id: 5,
    question: "Apa target utama Anda bergabung di SkillGate?",
    options: ["Tambah penghasilan", "Bangun portofolio", "Asah skill profesional", "Pengalaman kerja nyata"],
  },
];

export default function RegisterMahasiswaPage() {
  const router = useRouter();
  // steps: 0=entry, 1=buat akun, 2=data diri, 3=keahlian, 4=bio, 5=quiz intro, 6=quiz, 7=quiz results
  const [step, setStep] = useState(0);
  const [quizQ, setQuizQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    university: "",
    semester: "",
    major: "",
    skills: [] as string[],
    interests: [] as string[],
    hoursPerWeek: 10,
    bio: "",
  });

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter(s => s !== skill) : [...prev.skills, skill]
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) ? prev.interests.filter(i => i !== interest) : [...prev.interests, interest]
    }));
  };

  const handleQuizAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    if (quizQ + 1 < quizQuestions.length) {
      setQuizQ(quizQ + 1);
    } else {
      setStep(7); // quiz results
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length >= 8;

  const handleCompleteRegistration = async (targetPath: string, score: number) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: "mahasiswa",
            full_name: formData.fullName,
            university: formData.university,
            major: formData.major,
            semester: parseInt(formData.semester) || 1,
            skills: formData.skills,
            interests: formData.interests,
            bio: formData.bio,
            hours_per_week: formData.hoursPerWeek,
            readiness_score: score
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      router.push(targetPath);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal melakukan pendaftaran. Silakan coba lagi.");
      setLoading(false);
    }
  };

  // ENTRY PAGE
  if (step === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <MinimalNav />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  <School className="w-4 h-4" />
                  Untuk Mahasiswa Sleman
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
                  Mulai Karier Digitalmu Bersama SkillGate
                </h1>

                <p className="text-lg text-muted-foreground max-w-xl">
                  Bergabunglah dengan ribuan mahasiswa yang telah membangun portofolio nyata, mendapatkan penghasilan, dan membantu UMKM lokal bertransformasi digital.
                </p>

                <div className="space-y-4 py-2">
                  {[
                    { icon: <Briefcase className="w-5 h-5" />, text: "Proyek micro-gig yang fleksibel sesuai jadwal kuliah" },
                    { icon: <Star className="w-5 h-5" />, text: "Bangun portofolio profesional yang diakui industri" },
                    { icon: <Zap className="w-5 h-5" />, text: "Verifikasi keahlian melalui kuis adaptif" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                        {item.icon}
                      </div>
                      <span className="font-medium text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => setStep(1)}
                  className="w-full md:w-auto px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  Mulai Daftar — Gratis
                </Button>

                <p className="text-sm text-muted-foreground">
                  Sudah punya akun?{" "}
                  <Link href="/login" className="text-primary font-semibold hover:underline">Masuk di sini</Link>
                </p>
              </div>

              {/* Visual */}
              <div className="relative h-[420px] md:h-[560px] w-full">
                <div className="absolute inset-0 bg-primary/10 rounded-[3rem] rotate-3 translate-x-4 translate-y-4 -z-10"></div>
                <div className="absolute inset-0 overflow-hidden rounded-[3rem] shadow-xl border border-border">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfjWCwVg7ZwxiQ5U7NGSB7tkQHTqB_pEeGszjp0OK1UEnJFpxMPxk5P42KLCbwdQvnS1iJ1h7UZEDP7XTsHwm1KBt5cZ9JrTE5VtiWenS94sjNeRw1sAlrk2Uy2Ofwrsyumsmi3zBXBNS4mb4S8pHOwKDRiNzLL_w8cEGPJwvifcmDJiyZmummvy-nrCSKQf_6kAYqaN6Nv5wOruHKzDlWmz_B4OIMfR3gsdKNKjnpk7EqwnJbyWpM4aFPBJnGkv8fjVOgPKnu1rc"
                    alt="Students collaborating"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-4 md:-left-8 bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-lg max-w-xs border border-border">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary rounded-lg shrink-0">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Komunitas Aktif</p>
                      <p className="text-sm text-foreground font-medium">5,000+ mahasiswa telah mengerjakan proyek nyata bersama UMKM.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefit cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <BookOpen className="w-6 h-6" />, title: "Belajar dari Proyek Nyata", desc: "Setiap gig adalah pengalaman praktis yang langsung memperkaya CV dan portofoliomu." },
                { icon: <Star className="w-6 h-6" />, title: "Penilaian Objektif", desc: "Kuis verifikasi memastikan Anda mendapatkan proyek yang sesuai dengan level keahlian Anda." },
                { icon: <Clock className="w-6 h-6" />, title: "Fleksibel & On-Demand", desc: "Pilih proyek sesuai jadwal kuliahmu. Tidak ada komitmen jangka panjang yang memberatkan." },
              ].map((card, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-border/60 hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 mb-5 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">{card.title}</h3>
                  <p className="text-muted-foreground text-sm">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // STEP 1: BUAT AKUN (Email + Password)
  if (step === 1) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <MinimalNav />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-[640px] mx-auto px-4 mt-4">
            <div className="mb-10">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">Langkah 1 dari 4</span>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">Buat Akun Anda</h1>
                </div>
                <span className="text-sm font-bold text-primary">25% Selesai</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: '25%' }} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border">
              <p className="text-muted-foreground mb-8">Masukkan email dan buat password untuk akun SkillGate Anda.</p>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="contoh@mahasiswa.ac.id" className="pl-10" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Minimal 8 karakter" className="pl-10 pr-10" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.password.length > 0 && formData.password.length < 8 && (
                    <p className="text-xs text-destructive">Password harus minimal 8 karakter</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="confirm-password" type={showPassword ? "text" : "password"} placeholder="Ketik ulang password" className="pl-10" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                  </div>
                  {formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-destructive">Password tidak cocok</p>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-6">
                  <button type="button" onClick={() => setStep(0)} className="inline-flex items-center justify-center rounded-md border border-input h-10 px-4 text-sm font-medium hover:bg-accent transition-colors flex-1 order-2 md:order-1">
                    Kembali
                  </button>
                  <Button type="submit" className="flex-1 order-1 md:order-2" disabled={!passwordsMatch || !formData.email}>
                    Selanjutnya <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // REGISTRATION STEPS (2-4): Data Diri, Keahlian, Bio
  if (step >= 2 && step <= 4) {
    const innerStep = step - 1; // 1, 2, 3 for display
    const stepLabels = ["Data Diri", "Keahlian", "Bio"];
    const progressPct = ((innerStep + 1) / 4) * 100; // account step is 1/4 done already

    return (
      <div className="flex flex-col min-h-screen bg-background">
        <MinimalNav />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-[640px] mx-auto px-4 mt-4">
            {/* Progress */}
            <div className="mb-10">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">Langkah {innerStep + 1} dari 4</span>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {step === 2 && "Lengkapi Profil Kamu"}
                    {step === 3 && "Keahlian & Ketersediaan"}
                    {step === 4 && "Bio Singkat"}
                  </h1>
                </div>
                <span className="text-sm font-bold text-primary">{Math.round(progressPct)}% Selesai</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Step Indicators */}
              <div className="flex justify-between px-1 mt-5">
                {stepLabels.map((label, i) => {
                  const s = i + 1;
                  const isDone = s < innerStep;
                  const isActive = s === innerStep;
                  return (
                    <div key={s} className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isDone ? "bg-primary/20 text-primary" : isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : s}
                      </div>
                      <span className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 1 */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border">
                <p className="text-muted-foreground mb-8">Masukkan detail akademik agar kami bisa mencocokkanmu dengan proyek yang tepat.</p>
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Nama Lengkap</Label>
                    <Input id="full-name" placeholder="Contoh: Budi Santoso" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="university">Universitas</Label>
                      <select id="university" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" value={formData.university} onChange={(e) => setFormData({ ...formData, university: e.target.value })} required>
                        <option value="" disabled>Pilih Universitas</option>
                        <option value="UGM">Universitas Gadjah Mada (UGM)</option>
                        <option value="UNY">Universitas Negeri Yogyakarta (UNY)</option>
                        <option value="UII">Universitas Islam Indonesia (UII)</option>
                        <option value="UMY">Universitas Muhammadiyah Yogyakarta (UMY)</option>
                        <option value="Other">Lainnya</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester Saat Ini</Label>
                      <select id="semester" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} required>
                        <option value="" disabled>Pilih Semester</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>Semester {n}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="major">Program Studi / Jurusan</Label>
                    <Input id="major" placeholder="Contoh: Teknik Informatika" value={formData.major} onChange={(e) => setFormData({ ...formData, major: e.target.value })} required />
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 pt-6">
                    <button type="button" onClick={() => setStep(1)} className="inline-flex items-center justify-center rounded-md border border-input h-10 px-4 text-sm font-medium hover:bg-accent transition-colors flex-1 order-2 md:order-1">
                      Kembali
                    </button>
                    <Button type="submit" className="flex-1 order-1 md:order-2" disabled={!(formData.fullName && formData.university && formData.semester && formData.major)}>
                      Selanjutnya <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2 */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="text-primary w-6 h-6" />
                    <h2 className="text-xl font-bold">Keahlian Utama</h2>
                  </div>
                  <p className="text-muted-foreground mb-5 text-sm">Pilih minimal 1 keahlian yang paling Anda kuasai.</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map(skill => (
                      <button key={skill} type="button" onClick={() => toggleSkill(skill)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${formData.skills.includes(skill) ? "bg-primary text-white border-primary shadow-sm" : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"}`}>
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="text-primary w-6 h-6" />
                    <h2 className="text-xl font-bold">Minat Industri</h2>
                  </div>
                  <p className="text-muted-foreground mb-5 text-sm">Jenis bisnis apa yang membuat Anda bersemangat?</p>
                  <div className="flex flex-wrap gap-2">
                    {availableInterests.map(interest => (
                      <button key={interest} type="button" onClick={() => toggleInterest(interest)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${formData.interests.includes(interest) ? "bg-primary text-white border-primary shadow-sm" : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"}`}>
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="text-primary w-6 h-6" />
                    <h2 className="text-xl font-bold">Ketersediaan Waktu</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["< 5 jam/minggu", "5–10 jam/minggu", "10–20 jam/minggu", "> 20 jam/minggu"].map((opt, i) => {
                      const vals = [3, 7, 15, 25];
                      return (
                        <button key={i} type="button" onClick={() => setFormData({ ...formData, hoursPerWeek: vals[i] })} className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${formData.hoursPerWeek === vals[i] ? "bg-primary text-white border-primary" : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"}`}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <Button type="button" variant="outline" className="w-full md:w-auto px-8" onClick={() => setStep(2)}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Kembali
                  </Button>
                  <Button type="button" className="w-full md:w-auto px-12" onClick={() => setStep(4)} disabled={formData.skills.length === 0}>
                    Selanjutnya <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border">
                  <Label htmlFor="bio" className="text-base mb-2 block font-semibold">Bio Singkat</Label>
                  <p className="text-sm text-muted-foreground mb-4">Ceritakan tentang diri Anda, motivasi, dan apa yang ingin Anda capai bersama SkillGate.</p>
                  <Textarea
                    id="bio"
                    rows={6}
                    placeholder="Contoh: Mahasiswa semester 5 Akuntansi UGM yang antusias membantu UMKM dalam merapikan pembukuan digital..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="resize-none"
                  />
                  <div className="mt-2 text-right">
                    <span className={`text-xs font-medium ${formData.bio.length > 300 ? "text-destructive" : "text-muted-foreground"}`}>
                      {formData.bio.length} / 300 karakter
                    </span>
                  </div>
                </div>

                {/* Preview Card */}
                <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                  <div className="h-20 bg-gradient-to-r from-primary to-[#6e44ff]"></div>
                  <div className="px-6 pb-6 -mt-8">
                    <div className="w-16 h-16 rounded-full border-4 border-white bg-muted flex items-center justify-center overflow-hidden mb-3">
                      <img alt="Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDroRG3c1XwUHN7MPAVWhrX1I6FXFydMW8ostO4R53CNE4UQtPomMYWQrpziRxfkWeMefAOELyfPvaD8k833pFpHhZdJv4EiL747PGpfqoHysm-gQP9LJuQZAAj4yWmazXDbzRIHMBTo7ckzkFSlpQ2nKA_ncpQLdT-yZdztMlOCOqnraPSQ9o4ltI742j9icvS1L4cgrXB9Kwda2amcPlsIfB7UiQNyTf9wHPDmLY3hd4tbjxXYhXKQg3JVjcrktTjb2x8srCwAZY" />
                    </div>
                    <h3 className="text-lg font-bold">{formData.fullName || "Nama Anda"}</h3>
                    <p className="text-sm text-primary mb-3">{formData.major || "Program Studi"}</p>
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {formData.skills.slice(0, 4).map(s => (
                          <span key={s} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">{s}</span>
                        ))}
                      </div>
                    )}
                    {formData.bio && <p className="text-sm text-muted-foreground italic line-clamp-3">{formData.bio}</p>}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(3)}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Kembali
                  </Button>
                  <Button type="button" className="px-8" onClick={() => setStep(5)}>
                    Lanjut ke Kuis Kesiapan <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // QUIZ INTRO (step 5)
  if (step === 5) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <MinimalNav />
        <main className="flex-grow flex items-center justify-center pt-20 pb-16 px-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-border/60 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-[#6e44ff] p-10 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Kuis Kesiapan Skill</h1>
                <p className="text-white/90 text-lg">Kami perlu mengenal keahlian dan kesiapan Anda lebih dalam</p>
              </div>

              <div className="p-8 md:p-10">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: <BookOpen className="w-6 h-6" />, label: "5 Pertanyaan", sub: "Singkat & Relevan" },
                    { icon: <Clock className="w-6 h-6" />, label: "±3 Menit", sub: "Tidak membutuhkan waktu lama" },
                    { icon: <Star className="w-6 h-6" />, label: "Rekomendasi", sub: "Proyek yang sesuai" },
                  ].map((item, i) => (
                    <div key={i} className="text-center p-4 bg-muted/40 rounded-xl">
                      <div className="flex justify-center mb-2 text-primary">{item.icon}</div>
                      <div className="font-bold text-sm text-foreground">{item.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8">
                  <p className="text-sm text-primary font-medium text-center">
                    Tidak ada jawaban yang salah — jawab sejujurnya untuk hasil terbaik!
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(4)} className="flex-1">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Kembali
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 font-bold py-6"
                    onClick={() => { setQuizQ(0); setAnswers([]); setStep(6); }}
                  >
                    Mulai Kuis <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // QUIZ QUESTIONS (step 6)
  if (step === 6) {
    const q = quizQuestions[quizQ];
    const progress = ((quizQ + 1) / quizQuestions.length) * 100;
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <MinimalNav />
        <main className="flex-grow flex items-center justify-center pt-20 pb-16 px-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-border/60 p-8 md:p-10">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="font-semibold text-muted-foreground">Pertanyaan {quizQ + 1} dari {quizQuestions.length}</span>
                  <span className="font-bold text-primary">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-8">{q.question}</h2>

              <div className="space-y-3">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuizAnswer(i)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <span className="w-8 h-8 rounded-full border-2 border-border group-hover:border-primary flex items-center justify-center font-bold text-sm text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">{opt}</span>
                    <ChevronRight className="ml-auto w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // QUIZ RESULTS (step 7)
  if (step === 7) {
    // Calculate dynamic score based on answers
    // Let's sum weights: 
    // Q1: [10, 15, 20, 20]
    // Q2: [10, 20, 20, 20]
    // Q3: [10, 15, 20, 20]
    // Q4: [10, 15, 20, 20]
    // Q5: [20, 20, 20, 20]
    const q1Weights = [10, 15, 20, 20];
    const q2Weights = [10, 20, 20, 20];
    const q3Weights = [10, 15, 20, 20];
    const q4Weights = [10, 15, 20, 20];
    const q5Weights = [20, 20, 20, 20];

    const score = (answers[0] !== undefined ? q1Weights[answers[0]] : 20) +
                  (answers[1] !== undefined ? q2Weights[answers[1]] : 20) +
                  (answers[2] !== undefined ? q3Weights[answers[2]] : 20) +
                  (answers[3] !== undefined ? q4Weights[answers[3]] : 20) +
                  (answers[4] !== undefined ? q5Weights[answers[4]] : 20);

    const isPassed = score >= 65;
    const level = score >= 80 ? "Professional" : score >= 65 ? "Intermediate" : "Beginner (Perlu Belajar)";
    const levelColor = score >= 80 ? "text-emerald-600" : score >= 65 ? "text-primary" : "text-amber-600";
    const levelBg = score >= 80 ? "bg-emerald-100" : score >= 65 ? "bg-primary/10" : "bg-amber-100";

    const recommendedSkills = formData.skills.slice(0, 3);

    return (
      <div className="flex flex-col min-h-screen bg-background">
        <MinimalNav />
        <main className="flex-grow pt-20 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center font-medium shadow-sm">
                {errorMsg}
              </div>
            )}

            {/* Score Hero */}
            <div className={`rounded-2xl p-8 md:p-12 text-white text-center mb-8 shadow-xl bg-gradient-to-r ${isPassed ? "from-primary to-[#6e44ff]" : "from-amber-500 to-[#f9a826]"}`}>
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {isPassed ? "Selamat! Anda Siap Freelance" : "Terus Berlatih & Tingkatkan Skill"}
              </h1>
              <p className="text-white/90 mb-6">
                {isPassed 
                  ? "Hasil analisis menunjukkan Anda memiliki kesiapan yang baik untuk mengambil proyek nyata."
                  : "Anda membutuhkan sedikit peningkatan keterampilan sebelum dapat mengambil proyek berbayar."
                }</p>
              <div className="inline-flex items-baseline gap-2">
                <span className="text-7xl font-black">{score}</span>
                <span className="text-2xl font-bold opacity-80">/ 100</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Level Card */}
              <div className="bg-white rounded-xl border border-border/60 shadow-sm p-6 text-center">
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-bold mb-3 ${levelBg} ${levelColor}`}>
                  Level: {level}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Tingkat Kesiapan</h3>
                <p className="text-sm text-muted-foreground">Analisis menunjukkan pemahaman Anda berada pada tingkat {level}.</p>
              </div>

              {/* Skills Match */}
              <div className="bg-white rounded-xl border border-border/60 shadow-sm p-6">
                <h3 className="text-lg font-bold text-foreground mb-3">Rekomendasi Keahlian</h3>
                <div className="flex flex-wrap gap-2">
                  {(recommendedSkills.length > 0 ? recommendedSkills : ["Desain Grafis", "Canva"]).map((s) => (
                    <span key={s} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">{s}</span>
                  ))}
                </div>
              </div>

              {/* Gig Match */}
              <div className="bg-white rounded-xl border border-border/60 shadow-sm p-6 text-center flex flex-col justify-center items-center">
                <div className="text-4xl font-black text-primary mb-1">
                  {isPassed ? "12" : "0"}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">Proyek Cocok</h3>
                <p className="text-sm text-muted-foreground">
                  {isPassed ? "Proyek yang tersedia sesuai profil Anda" : "Selesaikan jalur pembelajaran untuk membuka proyek"}
                </p>
              </div>
            </div>

            {/* Recommendations / Learning Path */}
            {isPassed ? (
              <div className="bg-white rounded-xl border border-border/60 shadow-sm p-6 md:p-8 mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4">Rekomendasi Proyek untuk Anda</h2>
                <div className="space-y-4">
                  {[
                    { title: "Desain Poster Media Sosial", budget: "Rp 150.000", tag: "Desain Grafis", match: "95%" },
                    { title: "Pembuatan Konten Instagram UMKM", budget: "Rp 200.000", tag: "Social Media", match: "88%" },
                    { title: "Edit Video Promosi Produk", budget: "Rp 250.000", tag: "Video Editing", match: "82%" },
                  ].map((gig, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{gig.title}</p>
                        <div className="flex gap-2 mt-1">
                           <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">{gig.tag}</span>
                           <span className="text-xs text-emerald-600 font-semibold">{gig.budget}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-primary">{gig.match} match</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-border/60 shadow-sm p-6 md:p-8 mb-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Jalur Pembelajaran Rekomendasi</h2>
                  <p className="text-sm text-muted-foreground">Kami merekomendasikan kursus-kursus MOOC berikut secara gratis untuk membantumu meningkatkan kesiapan kerja sebelum melamar proyek.</p>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Dasar Desain Grafis dengan Canva & Photoshop", platform: "Coursera / Google", duration: "6 Jam", level: "Beginner" },
                    { title: "Komunikasi Bisnis & Negosiasi Klien untuk Pemula", platform: "Skillshare", duration: "4 Jam", level: "Beginner" },
                    { title: "Manajemen Waktu & Produktivitas Kerja Digital", platform: "Dicoding", duration: "3 Jam", level: "All Levels" },
                  ].map((course, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-border/50 bg-amber-50/20">
                      <div>
                        <h4 className="font-bold text-foreground text-sm">{course.title}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                          <span>Platform: <strong className="text-foreground">{course.platform}</strong></span>
                          <span>Durasi: {course.duration}</span>
                          <span>Level: {course.level}</span>
                        </div>
                      </div>
                      <Link href="/student/jalur-belajar">
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold whitespace-nowrap" disabled={loading}>Mulai Belajar</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button
                className="w-full md:w-auto px-10 py-6 font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                onClick={() => handleCompleteRegistration(isPassed ? "/dashboard/student" : "/student/jalur-belajar", score)}
                disabled={loading}
              >
                {loading ? "Memproses..." : (isPassed ? "Mulai Eksplorasi Proyek" : "Buka Jalur Belajar")} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" className="w-full md:w-auto px-8 py-6 font-semibold" onClick={() => { setStep(5); setAnswers([]); setQuizQ(0); setErrorMsg(""); }} disabled={loading}>
                Ulangi Kuis
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return null;
}
