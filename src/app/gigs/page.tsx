"use client";

import { StudentLayout } from "@/components/layout/StudentLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Calendar, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface GigWithUmkm {
  id: string;
  title: string;
  description: string;
  category: string;
  skills_required: string[];
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
    }[];
  };
}

const CATEGORIES = ["Semua", "Desain Grafis", "Fotografi", "Administrasi", "Media Sosial"];

const categoryColorMap: Record<string, { bg: string; text: string }> = {
  "Desain Grafis": { bg: "bg-primary/10", text: "text-primary" },
  "Fotografi": { bg: "bg-emerald-100", text: "text-emerald-700" },
  "Administrasi": { bg: "bg-purple-100", text: "text-purple-700" },
  "Media Sosial": { bg: "bg-blue-100", text: "text-blue-700" },
};

function formatBudget(amount: number): string {
  if (amount >= 1000000) return `Rp${(amount / 1000000).toFixed(1).replace('.0', '')}jt`;
  if (amount >= 1000) return `Rp${Math.round(amount / 1000)}rb`;
  return `Rp${amount}`;
}

function getDeadlineLabel(deadline: string): { text: string; urgent: boolean; diffDays: number } {
  const now = new Date();
  const dl = new Date(deadline);
  const diffMs = dl.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: "Sudah lewat", urgent: true, diffDays };
  if (diffDays === 0) return { text: "Hari ini", urgent: true, diffDays };
  if (diffDays === 1) return { text: "Besok", urgent: true, diffDays };
  if (diffDays <= 3) return { text: `${diffDays} hari lagi`, urgent: true, diffDays };
  return { text: `${diffDays} hari lagi`, urgent: false, diffDays };
}

function isNewGig(createdAt: string): boolean {
  const now = new Date();
  const created = new Date(createdAt);
  const diffDays = Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 3;
}

export default function GigsPage() {
  const [gigs, setGigs] = useState<GigWithUmkm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxBudget, setMaxBudget] = useState(5000000);
  const [selectedDeadline, setSelectedDeadline] = useState("flexible");
  const [sortBy, setSortBy] = useState("Kecocokan Tertinggi");
  const [studentSkills, setStudentSkills] = useState<string[]>([]);

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  useEffect(() => {
    fetchGigs();
  }, [selectedCategory]);

  async function fetchStudentProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("student_profiles")
          .select("skills")
          .eq("user_id", user.id)
          .single();
        if (profile && profile.skills) {
          setStudentSkills(profile.skills);
        }
      }
    } catch (e) {
      console.error("Error fetching student profile for matching:", e);
    }
  }

  function calculateProjectMatch(gigSkills: string[]) {
    if (studentSkills.length === 0 || gigSkills.length === 0) return 0;
    const matching = gigSkills.filter(s => 
      studentSkills.some(ss => ss.toLowerCase().trim() === s.toLowerCase().trim())
    );
    return Math.round((matching.length / gigSkills.length) * 100);
  }

  async function fetchGigs() {
    setLoading(true);
    try {
      let query = supabase
        .from("gigs")
        .select(`
          id, title, description, category, skills_required, budget, deadline, status, applicant_count, created_at,
          umkm:umkm_id (
            full_name,
            umkm_profiles (business_name, rating_avg)
          )
        `)
        .in("status", ["open", "in_progress"])
        .order("created_at", { ascending: false });

      if (selectedCategory !== "Semua") {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching gigs:", error);
        setGigs([]);
      } else {
        setGigs((data as unknown as GigWithUmkm[]) || []);
      }
    } catch (err) {
      console.error("Failed to fetch gigs:", err);
      setGigs([]);
    } finally {
      setLoading(false);
    }
  }

  // Filter client-side based on Budget, Deadline, and Search query
  let filteredGigs = gigs.filter((gig) => {
    // 1. Budget Filter
    if (gig.budget > maxBudget) return false;

    // 2. Deadline Filter
    if (selectedDeadline !== "flexible") {
      const deadlineInfo = getDeadlineLabel(gig.deadline);
      if (selectedDeadline === "today" && deadlineInfo.diffDays > 0) return false;
      if (selectedDeadline === "3days" && deadlineInfo.diffDays > 3) return false;
      if (selectedDeadline === "1week" && deadlineInfo.diffDays > 7) return false;
    }

    // 3. Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        gig.title.toLowerCase().includes(q) ||
        gig.category.toLowerCase().includes(q) ||
        gig.skills_required.some((s) => s.toLowerCase().includes(q))
      );
    }

    return true;
  });

  // Sort Gigs
  filteredGigs = [...filteredGigs].sort((a, b) => {
    if (sortBy === "Kecocokan Tertinggi") {
      const matchA = calculateProjectMatch(a.skills_required);
      const matchB = calculateProjectMatch(b.skills_required);
      return matchB - matchA;
    }
    if (sortBy === "Budget Tertinggi") {
      return b.budget - a.budget;
    }
    if (sortBy === "Deadline Terdekat") {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    // Default: Terbaru (created_at desc)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <StudentLayout>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* Hero Section */}
        <section className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">Cari Proyek Micro-Gig</h1>
          <p className="text-lg text-muted-foreground">Temukan proyek dari UMKM Sleman yang sesuai dengan keahlianmu</p>
          
          {/* Search & Filter Bar */}
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                className="w-full pl-12 pr-4 py-6 rounded-xl border-border/60 focus-visible:ring-primary/20 bg-white text-base shadow-sm" 
                placeholder="Cari proyek, kategori, atau skill..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar Filter */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-6 h-fit sticky top-24">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40">
              <h3 className="text-sm font-semibold text-foreground mb-4">Kategori</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full font-semibold text-xs border transition-colors ${
                      selectedCategory === cat
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 border-transparent"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40">
              <h3 className="text-sm font-semibold text-foreground mb-4">Budget Maksimal</h3>
              <input 
                type="range" 
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary mb-3" 
                min="50000" 
                max="5000000" 
                step="50000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
              />
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Rp50rb</span>
                <span className="text-primary font-bold">Rp {maxBudget.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40">
              <h3 className="text-sm font-semibold text-foreground mb-4">Tenggat Waktu</h3>
              <div className="space-y-3">
                {[
                  { id: 'today', label: 'Hari ini' },
                  { id: '3days', label: '3 Hari' },
                  { id: '1week', label: '1 Minggu' },
                  { id: 'flexible', label: 'Fleksibel' }
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="deadline" 
                      value={opt.id}
                      checked={selectedDeadline === opt.id}
                      onChange={() => setSelectedDeadline(opt.id)}
                      className="w-4 h-4 border-border text-primary focus:ring-primary" 
                    />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => {
                setSelectedCategory("Semua");
                setMaxBudget(5000000);
                setSelectedDeadline("flexible");
                setSearchQuery("");
              }}
              variant="outline"
              className="w-full py-6 font-semibold rounded-xl border-border/60 hover:bg-muted"
            >
              Reset Filter
            </Button>
          </aside>

          {/* Project Listing */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-sm font-medium text-muted-foreground">
                Menampilkan <span className="text-foreground font-bold">{filteredGigs.length} proyek</span>
              </h2>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span>Urutkan:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 font-bold text-foreground cursor-pointer"
                >
                  <option value="Kecocokan Tertinggi">Kecocokan Tertinggi</option>
                  <option value="Terbaru">Terbaru</option>
                  <option value="Budget Tertinggi">Budget Tertinggi</option>
                  <option value="Deadline Terdekat">Deadline Terdekat</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 animate-pulse flex flex-col gap-4">
                    <div className="flex justify-between">
                      <div className="h-6 w-24 bg-muted rounded-full" />
                      <div className="h-6 w-16 bg-muted rounded-full" />
                    </div>
                    <div className="h-6 w-3/4 bg-muted rounded-lg" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted" />
                      <div className="h-4 w-32 bg-muted rounded" />
                    </div>
                    <div className="mt-auto space-y-3">
                      <div className="h-8 w-28 bg-muted rounded" />
                      <div className="flex gap-2 pt-2">
                        <div className="h-6 w-16 bg-muted rounded" />
                        <div className="h-6 w-16 bg-muted rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredGigs.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-border/40 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">Tidak ada proyek ditemukan</h3>
                <p className="text-muted-foreground">Coba ubah filter atau kata kunci pencarian</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGigs.map((gig) => {
                  const deadlineInfo = getDeadlineLabel(gig.deadline);
                  const isNew = isNewGig(gig.created_at);
                  const catColor = categoryColorMap[gig.category] || { bg: "bg-muted", text: "text-muted-foreground" };
                  const umkmProfile = gig.umkm?.umkm_profiles?.[0];
                  const businessName = umkmProfile?.business_name || "UMKM";
                  const rating = umkmProfile?.rating_avg || 0;

                  return (
                    <Link
                      key={gig.id}
                      href={`/gigs/${gig.id}`}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 hover:shadow-md hover:border-primary/40 transition-all group flex flex-col cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full ${catColor.bg} ${catColor.text} font-semibold text-xs`}>
                          {gig.category}
                        </span>
                        
                        {/* Match Score Badge */}
                        {studentSkills.length > 0 && gig.skills_required.length > 0 && (
                          (() => {
                            const matchPercent = calculateProjectMatch(gig.skills_required);
                            return (
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                matchPercent >= 75 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                  : matchPercent >= 40 
                                  ? "bg-amber-50 text-amber-700 border-amber-200" 
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}>
                                {matchPercent}% Match
                              </span>
                            );
                          })()
                        )}
                      </div>
                      <h3 className="text-lg font-bold leading-tight text-foreground mb-3 group-hover:text-primary transition-colors">
                        {gig.title}
                      </h3>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center border border-border/50 shrink-0">
                          <span className="text-sm font-bold text-secondary">
                            {(gig.umkm?.full_name || "?")[0]}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          <span className="font-bold text-foreground">{gig.umkm?.full_name || "UMKM"}</span> • {businessName}
                        </span>
                        {rating > 0 && (
                          <div className="ml-auto flex items-center text-amber-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-xs font-bold text-muted-foreground ml-1">
                              {Number(rating).toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-auto space-y-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Budget</p>
                            <p className="text-xl font-bold text-emerald-600">{formatBudget(gig.budget)}</p>
                          </div>
                          <div className={`flex items-center gap-1.5 font-semibold text-xs ${
                            deadlineInfo.urgent ? "text-destructive" : "text-muted-foreground"
                          }`}>
                            <Calendar className="w-4 h-4" />
                            <span>Tenggat: {deadlineInfo.text}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 border-t border-border/30 pt-4">
                          {gig.skills_required.slice(0, 4).map((skill) => {
                            const isMatch = studentSkills.some(s => s.toLowerCase().trim() === skill.toLowerCase().trim());
                            return (
                              <span 
                                key={skill} 
                                className={`px-2.5 py-1 rounded-md font-semibold text-xs border ${
                                  isMatch 
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                    : "bg-muted text-muted-foreground border-transparent"
                                }`}
                              >
                                {skill}
                              </span>
                            );
                          })}
                          {gig.skills_required.length > 4 && (
                            <span className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-semibold text-xs">
                              +{gig.skills_required.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
