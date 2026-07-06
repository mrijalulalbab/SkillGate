"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, ChevronLeft, ArrowRight, ArrowLeft, CheckCircle2, UploadCloud, Award, Search, TrendingUp, Store } from "lucide-react";
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

function ProgressSteps({ currentStep }: { currentStep: number }) {
  const steps = ["Akun", "Profil Bisnis", "Verifikasi"];
  return (
    <div className="flex items-center justify-between w-full max-w-sm mx-auto mb-10">
      {steps.map((label, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isDone = step < currentStep;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                isDone ? "bg-primary text-white shadow-[0_0_0_4px_rgba(0,91,191,0.15)]"
                : isActive ? "bg-primary text-white shadow-[0_0_0_4px_rgba(0,91,191,0.15)]"
                : "bg-muted text-muted-foreground"
              }`}>
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : step}
              </div>
              <span className={`text-xs font-semibold whitespace-nowrap ${isActive || isDone ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-1 flex-1 rounded-full mx-2 mb-6 transition-colors ${step < currentStep ? "bg-primary/50" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function UMKMRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = Entry, 1-3 = form steps
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    category: "",
    address: "",
    description: "",
  });

  const calculateStrength = (val: string) => {
    setFormData(prev => ({ ...prev, password: val }));
    let s = 0;
    if (val.length > 0) s = 1;
    if (val.length >= 8) s = 2;
    if (val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val)) s = 3;
    if (val.length >= 10 && /[A-Z]/.test(val) && /[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val)) s = 4;
    setPasswordStrength(s);
  };

  const strengthLabels = ["", "Sangat Lemah", "Cukup", "Kuat", "Sangat Aman"];
  const strengthColors = ["bg-muted", "bg-destructive", "bg-yellow-500", "bg-emerald-500", "bg-emerald-600"];

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (step < 3) {
      if (step === 1) {
        if (formData.password !== formData.confirmPassword) {
          setErrorMsg("Password dan konfirmasi password tidak cocok.");
          return;
        }
        if (formData.password.length < 8) {
          setErrorMsg("Password harus minimal 8 karakter.");
          return;
        }
      }
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        // 1. Sign out any existing session to prevent session mismatch/conflicts
        await supabase.auth.signOut();

        // 2. Sign up the new user
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              role: "umkm",
              full_name: formData.fullName,
              phone: formData.phone,
              business_name: formData.businessName,
              category: formData.category,
              address: formData.address,
              description: formData.description,
            }
          }
        });

        if (error) {
          throw new Error(error.message);
        }

        // 3. Attempt direct login to guarantee the session is properly active and correct
        if (data.user) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
          });
          if (signInError) {
            router.push("/login?message=Pendaftaran berhasil! Silakan masuk menggunakan akun baru Anda.");
            return;
          }
        }

        router.push("/dashboard/umkm");
      } catch (err: any) {
        setErrorMsg(err.message || "Terjadi kesalahan saat pendaftaran. Silakan coba lagi.");
        setLoading(false);
      }
    }
  };

  // ENTRY PAGE
  if (step === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <MinimalNav />

        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            {/* Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
                  <Store className="w-4 h-4" />
                  Peluang UMKM Baru
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
                  Daftarkan UMKM Anda di SkillGate
                </h1>

                <p className="text-lg text-muted-foreground max-w-xl">
                  Temukan talenta digital untuk usaha Anda. SkillGate menghubungkan Anda dengan mahasiswa berkompetensi untuk mengakselerasi pertumbuhan bisnis.
                </p>

                <div className="space-y-4 py-2">
                  {[
                    { icon: <Search className="w-5 h-5" />, text: "Akses talenta digital lokal yang terverifikasi" },
                    { icon: <Award className="w-5 h-5" />, text: "Budget terjangkau untuk UMKM" },
                    { icon: <TrendingUp className="w-5 h-5" />, text: "Transformasi digital bisnis Anda" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                        {item.icon}
                      </div>
                      <span className="font-medium text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => setStep(1)}
                  className="w-full md:w-auto px-8 py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  Mulai Daftar
                </Button>

                <p className="text-sm text-muted-foreground">
                  Sudah punya akun?{" "}
                  <Link href="/login" className="text-primary font-semibold hover:underline">
                    Masuk di sini
                  </Link>
                </p>
              </div>

              {/* Visual */}
              <div className="relative h-[420px] md:h-[560px] w-full">
                <div className="absolute inset-0 bg-emerald-200/50 rounded-[3rem] rotate-3 translate-x-4 translate-y-4 -z-10"></div>
                <div className="absolute inset-0 overflow-hidden rounded-[3rem] shadow-xl border border-border">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuASxk0A2VrAwMWUr3zf0cUzwLZy0JNvpagPrTS6e2oFliXtZ51Ovos24qV6qUx6SK8a6aIt9M9BnufInaP7RAcxRGCdM5o08Lo1vbGNXTNyrOT9Ji2B1_0XbBguiCEGMBfDCScP0BI5pDqK-1Er1jQ91lUnWWNyaMuHkz7s4EcwbibYzdV9B9cI-3-G2zQhOFg9NHjZvBSKeXn76XyoyIYESWtDGZcKhBqdieOuhfDYc6ELXj5VU7dHOPW0vb8pbTM8E5eOuVl_jqU"
                    alt="UMKM Owner"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-4 md:-left-8 bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-lg max-w-xs border border-border">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-600 rounded-lg shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Terverifikasi</p>
                      <p className="text-sm text-foreground font-medium">10,000+ UMKM telah bergabung di ekosistem SkillGate.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefit Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <Award className="w-6 h-6" />, title: "Talenta Terverifikasi", desc: "Setiap mahasiswa melalui proses kurasi ketat untuk memastikan keahlian teknis dan profesionalisme." },
                { icon: <TrendingUp className="w-6 h-6" />, title: "Proses Sederhana", desc: "Posting kebutuhan proyek Anda dan terima penawaran dalam hitungan jam tanpa proses yang rumit." },
                { icon: <CheckCircle2 className="w-6 h-6" />, title: "Hasil Memuaskan", desc: "Fokus pada kualitas output yang berdampak langsung pada peningkatan omzet dan efisiensi operasional." },
              ].map((card, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-border/60 hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 mb-5 bg-muted rounded-full flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
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

  // FORM STEPS (1–3)
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MinimalNav />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-12 items-start">

          {/* Left: sticky visual (desktop) */}
          <div className="hidden lg:flex flex-col w-[380px] shrink-0 sticky top-28">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-sm border border-border">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_M9NMXI2la_-rMJ9tmGvlJRCT8U300hgNfDZDVSkuc5-UcP_nOnPEwC1xz21THNufOaM_xUm0MGh2cjS5Tth-3WFanVq5vK9utImh_hzFedXYSd7x6x5WCc5NPZmtEsMlFIU2ar3kqgOt_adqxuvIFb_ZS17pbezBipK8grzE261UXtrklwpMqyD0w5HVHcMztzGR1l2sHOGzC6_cQm-6KV4LauNILkeuBzZsj3oz90TExXsqbmsA02KNJYWwnpm0HeqoHQCsOEY"
                alt="Registration"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xl font-bold mb-1">Akses Talenta Kampus</p>
                <p className="text-sm opacity-90">Kembangkan UMKM Anda dengan tenaga terampil dari universitas terbaik.</p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full flex-1">
            <ProgressSteps currentStep={step} />

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-1">
                {step === 1 && "Buat Akun UMKM"}
                {step === 2 && "Profil Bisnis Anda"}
                {step === 3 && "Verifikasi Identitas"}
              </h1>
              <p className="text-muted-foreground">
                Langkah {step} dari 3 — {step === 1 ? "Informasi akun Anda" : step === 2 ? "Detail usaha Anda" : "Pastikan keabsahan usaha"}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center font-medium shadow-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleNext} className="bg-white rounded-2xl shadow-sm p-6 md:p-10 border border-border/50 flex flex-col gap-8">

              {/* STEP 1: Account */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-semibold">Nama Lengkap</Label>
                    <Input id="fullName" placeholder="Sesuai dengan KTP" className="h-12 text-base" value={formData.fullName} onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))} disabled={loading} required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-semibold">Email</Label>
                      <Input id="email" type="email" placeholder="contoh@email.com" className="h-12 text-base" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} disabled={loading} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-semibold">Nomor WhatsApp</Label>
                      <div className="flex">
                        <span className="h-12 px-4 flex items-center bg-muted border border-r-0 border-input rounded-l-md text-muted-foreground font-medium text-sm">+62</span>
                        <Input id="phone" type="tel" placeholder="812xxxx" className="h-12 rounded-l-none text-base" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} disabled={loading} required />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="font-semibold">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Min. 8 karakter"
                          className="h-12 pr-12 text-base"
                          value={formData.password}
                          onChange={(e) => calculateStrength(e.target.value)}
                          disabled={loading}
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" disabled={loading}>
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordStrength > 0 && (
                        <>
                          <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4].map((level) => (
                              <div key={level} className={`h-1 flex-1 rounded-full ${passwordStrength >= level ? strengthColors[passwordStrength] : "bg-muted"}`}></div>
                            ))}
                          </div>
                          <p className={`text-xs font-semibold ${passwordStrength >= 3 ? "text-emerald-600" : "text-yellow-600"}`}>
                            Keamanan: {strengthLabels[passwordStrength]}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="font-semibold">Konfirmasi Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Masukkan ulang password"
                          className="h-12 pr-12 text-base"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          disabled={loading}
                          required
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" disabled={loading}>
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox id="terms" className="mt-1" disabled={loading} />
                    <Label htmlFor="terms" className="text-sm font-medium leading-relaxed text-muted-foreground">
                      Saya menyetujui{" "}
                      <Link href="#" className="text-primary hover:underline font-semibold">Syarat & Ketentuan</Link>
                      {" "}serta{" "}
                      <Link href="#" className="text-primary hover:underline font-semibold">Kebijakan Privasi</Link>
                      {" "}SkillGate.
                    </Label>
                  </div>
                </div>
              )}

              {/* STEP 2: Business Profile */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="font-semibold">Nama Usaha / Toko</Label>
                    <Input id="businessName" placeholder="Contoh: Kedai Kopi Sleman" className="h-12 text-base" value={formData.businessName} onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))} disabled={loading} required />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">Kategori Usaha</Label>
                    <Select value={formData.category} onValueChange={(val) => setFormData(prev => ({ ...prev, category: val || "" }))} disabled={loading} required>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kuliner">Kuliner (F&B)</SelectItem>
                        <SelectItem value="fashion">Fashion & Pakaian</SelectItem>
                        <SelectItem value="jasa">Jasa & Pelayanan</SelectItem>
                        <SelectItem value="retail">Retail / Toko Kelontong</SelectItem>
                        <SelectItem value="kriya">Kriya / Kerajinan</SelectItem>
                        <SelectItem value="lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="font-semibold">Alamat Usaha (Sleman)</Label>
                    <Textarea id="address" placeholder="Masukkan alamat lengkap usaha Anda di Sleman..." className="min-h-[100px] text-base resize-none" value={formData.address} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} disabled={loading} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-semibold">Deskripsi Singkat Usaha</Label>
                    <Textarea id="description" placeholder="Ceritakan apa yang membuat usaha Anda unik..." className="min-h-[100px] text-base resize-none" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} disabled={loading} />
                  </div>
                </div>
              )}

              {/* STEP 3: Verification */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900 mb-1">Verifikasi Identitas Anda</p>
                      <p className="text-sm text-blue-800/80">SkillGate memerlukan foto KTP dan NIB (opsional) untuk memastikan keamanan ekosistem bagi mahasiswa.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">Upload KTP</Label>
                    <label className={`border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/50"}`}>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-semibold text-foreground mb-1">Klik untuk upload foto KTP</p>
                      <p className="text-xs text-muted-foreground">Format .jpg, .png max 5MB</p>
                      <input type="file" accept="image/*" className="hidden" disabled={loading} />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">Upload NIB <span className="text-muted-foreground font-normal">(Opsional)</span></Label>
                    <label className={`border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/50"}`}>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-semibold text-foreground mb-1">Upload NIB Usaha Anda</p>
                      <p className="text-xs text-muted-foreground">Ini akan memberikan badge Terverifikasi++</p>
                      <input type="file" accept="image/*,.pdf" className="hidden" disabled={loading} />
                    </label>
                  </div>
                </div>
              )}

              {/* Nav Buttons */}
              <div className="flex flex-col-reverse md:flex-row items-center gap-4 pt-4 border-t border-border/40">
                {step > 1 ? (
                  <Button type="button" variant="outline" className="w-full md:w-auto h-12 px-8 font-semibold" onClick={() => setStep(step - 1)} disabled={loading}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Kembali
                  </Button>
                ) : (
                  <Link href="/auth" className={`w-full md:w-auto h-12 px-8 inline-flex items-center justify-center border border-input rounded-md text-sm font-semibold hover:bg-accent transition-colors ${loading ? "opacity-50 pointer-events-none" : ""}`}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                  </Link>
                )}
                <Button type="submit" className="w-full md:flex-1 h-12 font-bold text-base shadow-md hover:shadow-lg transition-all" disabled={loading}>
                  {loading ? "Memproses..." : (step === 3 ? "Selesaikan Pendaftaran" : "Selanjutnya")}
                  {!loading && step < 3 && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </form>

            {step === 1 && (
              <p className="mt-6 text-center text-muted-foreground text-sm">
                Sudah memiliki akun?{" "}
                <Link href="/login" className="text-primary font-bold hover:underline">Masuk di sini</Link>
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
