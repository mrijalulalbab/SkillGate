"use client";

import { StudentLayout } from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, GraduationCap, Bell, Save, 
  Upload, CheckCircle2, Link as LinkIcon 
} from "lucide-react";
import { useState } from "react";

export default function StudentSettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "academic" | "notifications">("profile");
  const [saved, setSaved] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    name: "Andi Setiawan",
    email: "andi.setiawan@mail.ugm.ac.id",
    phone: "081234567890",
    bio: "Mahasiswa DKV semester 5 yang passionate di bidang desain grafis dan branding. Berpengalaman mengerjakan proyek desain untuk UMKM lokal, mulai dari desain feed Instagram, poster promosi, hingga katalog produk digital.",
    location: "Sleman, Yogyakarta"
  });

  const [academicData, setAcademicData] = useState({
    university: "Universitas Gadjah Mada (UGM)",
    major: "Desain Komunikasi Visual",
    semester: "5",
    skills: "Desain Grafis, Canva, Adobe Photoshop, Adobe Illustrator",
    github: "github.com/andisetiawan",
    linkedin: "linkedin.com/in/andisetiawan"
  });

  const [notifData, setNotifData] = useState({
    newGigs: true,
    chatMessages: true,
    projectStatus: true,
    weeklyDigest: false
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <StudentLayout>
      <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Pengaturan Akun</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola profil, informasi akademis, dan notifikasi Anda.</p>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-semibold">Pengaturan berhasil diperbarui!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Settings Tabs (Vertical) */}
          <div className="md:col-span-1 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible border-b md:border-b-0 md:border-r border-border/40 pb-4 md:pb-0 md:pr-4 gap-2 shrink-0">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2.5 px-4 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTab === "profile" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <User className="w-4 h-4" /> Profil & Data Diri
            </button>
            <button
              onClick={() => setActiveTab("academic")}
              className={`flex items-center gap-2.5 px-4 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTab === "academic" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Akademis & Keahlian
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-2.5 px-4 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTab === "notifications" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Bell className="w-4 h-4" /> Preferensi Notifikasi
            </button>
          </div>

          {/* Form Content */}
          <div className="md:col-span-3">
            <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 md:p-8 border border-border/40 shadow-sm space-y-6">
              
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-foreground border-b border-border/30 pb-2">Informasi Profil</h3>
                  
                  {/* Photo Profile */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 bg-muted shrink-0">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVHOmSXI0bZt5WFsfbAvT2cNq-UX9NujpGCcQ3xjx8lG5Odl-Ahyxc5BfMclPKdHM1-W-Pj9-9m8Q6UlwZKun-rvsETy4XwqP5wvSOQUTHyjpNE9RNP6yxaN_bNctYin2MomQMFAgHFr8d37WkCZYlsGuA0EWcILsGt3rGhBIEHg-cluM_cAx_mmbuYuAqTblKs52EvFRw2VwLw9niYgG7DqVZtFLqUjUVOQbpkk3Lb6uyStIbSvKKGO8YqixNWpRdGxp-4Y8rJr4" 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button type="button" variant="outline" size="sm" className="font-semibold flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Unggah Foto Baru
                      </Button>
                      <p className="text-xs text-muted-foreground">Maksimal 2MB. Format JPG, PNG.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-bold text-foreground uppercase">Nama Lengkap</Label>
                      <Input 
                        id="name" 
                        className="h-11 rounded-xl"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold text-foreground uppercase">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        className="h-11 rounded-xl"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-bold text-foreground uppercase">Nomor Telepon</Label>
                      <Input 
                        id="phone" 
                        className="h-11 rounded-xl"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-xs font-bold text-foreground uppercase">Lokasi / Domisili</Label>
                      <Input 
                        id="location" 
                        className="h-11 rounded-xl"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-xs font-bold text-foreground uppercase">Biografi Singkat</Label>
                    <Textarea 
                      id="bio" 
                      rows={4}
                      className="resize-none rounded-xl"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {activeTab === "academic" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-foreground border-b border-border/30 pb-2">Informasi Akademis & Keahlian</h3>

                  <div className="space-y-2">
                    <Label htmlFor="university" className="text-xs font-bold text-foreground uppercase">Universitas / Institusi</Label>
                    <Input 
                      id="university" 
                      className="h-11 rounded-xl"
                      value={academicData.university}
                      onChange={(e) => setAcademicData({...academicData, university: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="major" className="text-xs font-bold text-foreground uppercase">Program Studi / Jurusan</Label>
                      <Input 
                        id="major" 
                        className="h-11 rounded-xl"
                        value={academicData.major}
                        onChange={(e) => setAcademicData({...academicData, major: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="semester" className="text-xs font-bold text-foreground uppercase">Semester</Label>
                      <select 
                        id="semester"
                        className="w-full h-11 px-3 border border-input rounded-xl bg-background text-sm"
                        value={academicData.semester}
                        onChange={(e) => setAcademicData({...academicData, semester: e.target.value})}
                      >
                        {[1,2,3,4,5,6,7,8].map(s => (
                          <option key={s} value={s.toString()}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-xs font-bold text-foreground uppercase">Keahlian Spesifik</Label>
                    <Input 
                      id="skills" 
                      className="h-11 rounded-xl"
                      value={academicData.skills}
                      onChange={(e) => setAcademicData({...academicData, skills: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">Pisahkan dengan koma.</p>
                  </div>

                  <h3 className="text-lg font-bold text-foreground border-b border-border/30 pb-2 pt-4">Portofolio & Media Sosial Eksternal</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="github" className="text-xs font-bold text-foreground uppercase flex items-center gap-1"><LinkIcon className="w-3.5 h-3.5" /> GitHub</Label>
                      <Input 
                        id="github" 
                        className="h-11 rounded-xl"
                        value={academicData.github}
                        onChange={(e) => setAcademicData({...academicData, github: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="text-xs font-bold text-foreground uppercase flex items-center gap-1"><LinkIcon className="w-3.5 h-3.5" /> LinkedIn</Label>
                      <Input 
                        id="linkedin" 
                        className="h-11 rounded-xl"
                        value={academicData.linkedin}
                        onChange={(e) => setAcademicData({...academicData, linkedin: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-foreground border-b border-border/30 pb-2">Preferensi Notifikasi</h3>
                  <p className="text-sm text-muted-foreground">Tentukan notifikasi apa saja yang ingin Anda terima via Email dan push notification.</p>

                  <div className="space-y-4 pt-2">
                    {[
                      { key: "newGigs", title: "Proyek Baru yang Cocok", desc: "Kirim email saat ada proyek baru yang sesuai dengan keahlian Anda." },
                      { key: "chatMessages", title: "Pesan Masuk", desc: "Beritahu saya ketika ada pesan baru dari UMKM." },
                      { key: "projectStatus", title: "Pembaruan Status Proyek", desc: "Notifikasi saat proposal diterima/ditolak atau proyek dinyatakan selesai." },
                      { key: "weeklyDigest", title: "Rangkuman Mingguan", desc: "Kirim ringkasan mingguan mengenai proyek populer dan pencapaian Anda." },
                    ].map((item) => (
                      <div key={item.key} className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-border/40 hover:bg-muted/10 transition-colors">
                        <div className="space-y-1">
                          <label htmlFor={item.key} className="text-sm font-bold text-foreground cursor-pointer">{item.title}</label>
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                        <input 
                          id={item.key}
                          type="checkbox"
                          className="w-4.5 h-4.5 rounded border-input text-primary focus:ring-primary/20 shrink-0 mt-1 cursor-pointer"
                          checked={notifData[item.key as keyof typeof notifData]}
                          onChange={(e) => setNotifData({...notifData, [item.key]: e.target.checked})}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-border/40 flex justify-end">
                <Button type="submit" className="font-bold px-6 h-11 rounded-xl flex items-center gap-2">
                  <Save className="w-4 h-4" /> Simpan Perubahan
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
