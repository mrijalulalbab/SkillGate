"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  ArrowLeft, Search, HelpCircle, BookOpen, 
  MessageSquare, ShieldCheck, Mail, Send, ChevronDown, ChevronUp 
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

const faqs = [
  {
    category: "mahasiswa",
    question: "Apakah SkillGate gratis untuk mahasiswa?",
    answer: "Ya, SkillGate 100% gratis untuk seluruh mahasiswa aktif di Daerah Istimewa Yogyakarta. Tidak ada biaya pendaftaran maupun potongan biaya untuk proyek yang diselesaikan."
  },
  {
    category: "mahasiswa",
    question: "Apa itu Kuis Kesiapan Freelance?",
    answer: "Kuis Kesiapan Freelance adalah asesmen singkat berisi 5 pertanyaan untuk mengukur kesiapan kerja teknis, manajemen waktu, dan komunikasi Anda dengan klien. Jika skor Anda di bawah 65%, sistem akan menyarankan Jalur Pembelajaran khusus berupa kursus gratis sebelum Anda melamar proyek."
  },
  {
    category: "mahasiswa",
    question: "Bagaimana cara mencairkan honorarium setelah proyek selesai?",
    answer: "Setelah UMKM menyetujui hasil akhir pekerjaan Anda dan menandai proyek sebagai selesai, dana honorarium yang ditahan di sistem akan langsung didepositokan ke saldo Anda untuk kemudian dapat dicairkan via transfer bank atau dompet digital."
  },
  {
    category: "umkm",
    question: "Berapa minimal anggaran (budget) untuk memposting proyek?",
    answer: "Kami menetapkan anggaran minimum proyek micro-gig sebesar Rp 50.000 hingga Rp 250.000. Ini disesuaikan dengan jenis pekerjaan digital mikro yang cocok dikerjakan oleh mahasiswa di sela-sela waktu kuliah."
  },
  {
    category: "umkm",
    question: "Bagaimana jika hasil kerja mahasiswa tidak sesuai dengan kesepakatan?",
    answer: "SkillGate menyediakan sistem Ruang Kerja interaktif. Anda dapat meminta revisi hasil kerja maksimal 3 kali sebelum menyetujui. Uang Anda aman di sistem escrow kami dan hanya akan dilepaskan jika pekerjaan telah selesai disetujui."
  },
  {
    category: "keamanan",
    question: "Bagaimana SkillGate menjamin keamanan transaksi?",
    answer: "Kami menggunakan metode pembayaran aman di mana UMKM harus melakukan transfer honorarium terlebih dahulu sebelum proyek berjalan. Uang saku akan disimpan secara aman oleh platform dan baru disalurkan ke mahasiswa saat kedua belah pihak sepakat proyek telah selesai."
  }
];

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "mahasiswa" | "umkm" | "keamanan">("all");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: "", email: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/30 shadow-sm">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-bold text-xl text-primary">SkillGate</span>
          </div>
          <Link href="/auth" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Masuk / Register
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow max-w-[1000px] mx-auto px-4 md:px-8 py-10 md:py-16 w-full">
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Ada yang Bisa Kami Bantu?</h1>
          <p className="text-muted-foreground mb-8 text-sm md:text-base">Temukan jawaban atas pertanyaan populer atau hubungi tim bantuan kami langsung.</p>
          
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari kata kunci bantuan (mis. Kuis, Honor)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-border/60 rounded-2xl shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors"
            />
          </div>
        </div>

        {/* Categories Tab */}
        <div className="flex justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {[
            { id: "all", label: "Semua Kategori" },
            { id: "mahasiswa", label: "Untuk Mahasiswa" },
            { id: "umkm", label: "Untuk UMKM" },
            { id: "keamanan", label: "Pembayaran & Keamanan" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all whitespace-nowrap ${
                selectedCategory === tab.id 
                  ? "bg-primary text-white border-primary" 
                  : "bg-white text-muted-foreground border-border/50 hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-16">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" /> FAQ Terpopuler
            </h2>
            
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-dashed p-6">
                <p className="text-muted-foreground font-medium">Tidak ada FAQ yang cocok dengan pencarian Anda.</p>
              </div>
            ) : (
              filteredFaqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-border/40 overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full p-5 flex items-center justify-between text-left font-bold text-foreground hover:bg-muted/10 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {expandedFaq === i ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  {expandedFaq === i && (
                    <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground border-t border-border/20 leading-relaxed bg-muted/5">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Contact Support Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-border/40 shadow-sm">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" /> Kirim Pertanyaan
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Gagal menemukan jawaban? Hubungi admin support kami langsung.</p>
              
              {submitted ? (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100 text-xs font-semibold text-center animate-pulse">
                  Pesan Anda berhasil terkirim! Admin akan membalas via email.
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Nama Lengkap"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full h-10 px-3 text-xs bg-muted/30 border border-border/50 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Alamat Email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full h-10 px-3 text-xs bg-muted/30 border border-border/50 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <textarea 
                      placeholder="Tulis pertanyaan Anda..."
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full p-3 text-xs bg-muted/30 border border-border/50 rounded-xl focus:outline-none resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full text-xs font-semibold rounded-xl flex items-center justify-center gap-2">
                    <Send className="w-3.5 h-3.5" /> Kirim Pesan
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border/30 w-full shrink-0">
        <div className="max-w-[1100px] mx-auto py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <div className="font-bold text-lg text-foreground mb-1">SkillGate</div>
            <p className="text-sm text-muted-foreground">© 2026 SkillGate. Menghubungkan Potensi Mahasiswa dengan UMKM Indonesia.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/" className="text-xs font-semibold text-muted-foreground hover:text-primary hover:underline transition-all">Kembali Ke Home</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
