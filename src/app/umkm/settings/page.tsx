"use client";

import { UmkmLayout } from "@/components/layout/UmkmLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building, Phone, Bell, Save, 
  Upload, CheckCircle2, MapPin 
} from "lucide-react";
import { useState } from "react";

export default function UmkmSettingsPage() {
  const [activeTab, setActiveTab] = useState<"business" | "contact" | "notifications">("business");
  const [saved, setSaved] = useState(false);

  // Form states
  const [businessData, setBusinessData] = useState({
    name: "Batik Sleman Bu Darmi",
    description: "Kami adalah produsen batik tulis dan cap tradisional asal Sleman yang fokus pada motif khas daerah dengan pewarna alami ramah lingkungan.",
    address: "Jl. Kaliurang Km 10, Sleman, Yogyakarta",
    website: "www.batikbudarmi.com",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1xJkiSjkhsR7Lvz7cxZtY5aMCaT5fYwI3Wl0EsDez7_UFZFXqofnMfWC2UjhmoaubyZnvXO5D3t8-lJJX1FGKtlcjWM0WNvZMYGJvx4EsPGVzmdf6NjvhlWqY1UQADJ4k-OtvnRsP4WxE37ZpeAbdmLa0AaZFGMkRIGco38B6mCu9zD7-wJYxZSY66RotmrZRtCeT90rfxgsAdDYQnZYg3gMm6qD08-HqFiX1ou-F5YvvHnhQDGqTlIwb-Jvwx61gRjmb8cVPS9Y"
  });

  const [contactData, setContactData] = useState({
    email: "kontak@batikbudarmi.com",
    phone: "085643219876",
    owner: "Bu Darmi",
    industry: "Fashion & Tekstil",
    nib: "91200054321" // Nomor Induk Berusaha
  });

  const [notifData, setNotifData] = useState({
    newApplicants: true,
    chatMessages: true,
    workSubmission: true,
    weeklyReport: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <UmkmLayout>
      <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Pengaturan Bisnis</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola profil usaha, legalitas kontak, dan preferensi notifikasi UMKM Anda.</p>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-semibold">Pengaturan bisnis berhasil diperbarui!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Settings Tabs (Vertical) */}
          <div className="md:col-span-1 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible border-b md:border-b-0 md:border-r border-border/40 pb-4 md:pb-0 md:pr-4 gap-2 shrink-0">
            <button
              onClick={() => setActiveTab("business")}
              className={`flex items-center gap-2.5 px-4 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTab === "business" 
                  ? "bg-secondary/10 text-secondary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Building className="w-4 h-4" /> Profil Usaha
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`flex items-center gap-2.5 px-4 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTab === "contact" 
                  ? "bg-secondary/10 text-secondary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Phone className="w-4 h-4" /> Kontak & Legalitas
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-2.5 px-4 py-3 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTab === "notifications" 
                  ? "bg-secondary/10 text-secondary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Bell className="w-4 h-4" /> Preferensi Notifikasi
            </button>
          </div>

          {/* Form Content */}
          <div className="md:col-span-3">
            <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 md:p-8 border border-border/40 shadow-sm space-y-6">
              
              {activeTab === "business" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-foreground border-b border-border/30 pb-2">Informasi Usaha</h3>
                  
                  {/* Photo Profile */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-secondary/20 bg-muted shrink-0">
                      <img 
                        src={businessData.logo} 
                        alt="Logo Usaha" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button type="button" variant="outline" size="sm" className="font-semibold flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Unggah Logo Usaha
                      </Button>
                      <p className="text-xs text-muted-foreground">Maksimal 2MB. Format JPG, PNG.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold text-foreground uppercase">Nama Usaha / Toko</Label>
                    <Input 
                      id="name" 
                      className="h-11 rounded-xl"
                      value={businessData.name}
                      onChange={(e) => setBusinessData({...businessData, name: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-xs font-bold text-foreground uppercase flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Alamat Lengkap</Label>
                      <Input 
                        id="address" 
                        className="h-11 rounded-xl"
                        value={businessData.address}
                        onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-xs font-bold text-foreground uppercase">Website / Tautan Toko</Label>
                      <Input 
                        id="website" 
                        className="h-11 rounded-xl"
                        value={businessData.website}
                        onChange={(e) => setBusinessData({...businessData, website: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-xs font-bold text-foreground uppercase">Deskripsi Usaha</Label>
                    <Textarea 
                      id="description" 
                      rows={4}
                      className="resize-none rounded-xl"
                      value={businessData.description}
                      onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {activeTab === "contact" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-foreground border-b border-border/30 pb-2">Kontak & Informasi Legal</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="owner" className="text-xs font-bold text-foreground uppercase">Nama Pemilik Usaha</Label>
                      <Input 
                        id="owner" 
                        className="h-11 rounded-xl"
                        value={contactData.owner}
                        onChange={(e) => setContactData({...contactData, owner: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-xs font-bold text-foreground uppercase">Kategori Industri</Label>
                      <select 
                        id="industry"
                        className="w-full h-11 px-3 border border-input rounded-xl bg-background text-sm"
                        value={contactData.industry}
                        onChange={(e) => setContactData({...contactData, industry: e.target.value})}
                      >
                        <option>Fashion & Tekstil</option>
                        <option>Makanan & Minuman (F&B)</option>
                        <option>Kerajinan & Seni</option>
                        <option>Jasa & Retail</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold text-foreground uppercase">Email Bisnis</Label>
                      <Input 
                        id="email" 
                        type="email"
                        className="h-11 rounded-xl"
                        value={contactData.email}
                        onChange={(e) => setContactData({...contactData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-bold text-foreground uppercase">Nomor WhatsApp / Telepon</Label>
                      <Input 
                        id="phone" 
                        className="h-11 rounded-xl"
                        value={contactData.phone}
                        onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nib" className="text-xs font-bold text-foreground uppercase">Nomor Induk Berusaha (NIB) / Dokumen Izin Usaha</Label>
                    <Input 
                      id="nib" 
                      className="h-11 rounded-xl"
                      value={contactData.nib}
                      onChange={(e) => setContactData({...contactData, nib: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">Opsional. Membantu menaikkan tingkat verifikasi profil bisnis Anda.</p>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-foreground border-b border-border/30 pb-2">Preferensi Notifikasi</h3>
                  <p className="text-sm text-muted-foreground">Sesuaikan kapan saja Anda menerima pesan dan update tentang proyek Anda.</p>

                  <div className="space-y-4 pt-2">
                    {[
                      { key: "newApplicants", title: "Pelamar Baru", desc: "Kirim email saat ada mahasiswa mengirim proposal pada proyek Anda." },
                      { key: "chatMessages", title: "Pesan Masuk", desc: "Beritahu saya ketika ada pesan baru dari mahasiswa pelamar." },
                      { key: "workSubmission", title: "Pengiriman Hasil Kerja", desc: "Notifikasi saat mahasiswa telah mengupload/menyerahkan hasil kerja." },
                      { key: "weeklyReport", title: "Rangkuman Bulanan", desc: "Kirim ringkasan kemajuan pengerjaan proyek dari seluruh gig berjalan." },
                    ].map((item) => (
                      <div key={item.key} className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-border/40 hover:bg-muted/10 transition-colors">
                        <div className="space-y-1">
                          <label htmlFor={item.key} className="text-sm font-bold text-foreground cursor-pointer">{item.title}</label>
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                        </div>
                        <input 
                          id={item.key}
                          type="checkbox"
                          className="w-4.5 h-4.5 rounded border-input text-secondary focus:ring-secondary/20 shrink-0 mt-1 cursor-pointer"
                          checked={notifData[item.key as keyof typeof notifData]}
                          onChange={(e) => setNotifData({...notifData, [item.key]: e.target.checked})}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-border/40 flex justify-end">
                <Button type="submit" className="font-bold px-6 h-11 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground flex items-center gap-2">
                  <Save className="w-4 h-4" /> Simpan Perubahan
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </UmkmLayout>
  );
}
