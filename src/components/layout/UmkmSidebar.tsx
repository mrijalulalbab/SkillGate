"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderKanban, PlusCircle, CreditCard,
  MessageSquare, ChevronsLeft, ChevronsRight, LogOut, Settings, BarChart3
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const navItems = [
  { href: "/dashboard/umkm", label: "Dashboard", icon: LayoutDashboard },
  { href: "/umkm/proyek", label: "Kelola Proyek", icon: FolderKanban },
  { href: "/umkm/buat-proyek", label: "Buat Proyek", icon: PlusCircle },
  { href: "/umkm/laporan", label: "Laporan ROI", icon: BarChart3 },
  { href: "/umkm/pembayaran", label: "Pembayaran", icon: CreditCard },
  { href: "/umkm/chat", label: "Pesan", icon: MessageSquare },
  { href: "/umkm/settings", label: "Pengaturan", icon: Settings },
];

export function UmkmSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-border/40 shrink-0 transition-all duration-300 h-full ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {/* Logo + Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/30 shrink-0">
          {!collapsed && (
            <Link href="/" className="font-bold text-xl text-primary whitespace-nowrap">
              SkillGate
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors shrink-0"
            title={collapsed ? "Expand menu" : "Collapse menu"}
          >
            {collapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`flex items-center gap-4 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-secondary/10 text-secondary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-secondary" : ""}`} />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border/30">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
            className="w-full flex items-center gap-4 px-3 py-2.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-sm font-medium text-left cursor-pointer"
            title="Keluar"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-border/30 rounded-t-xl">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? "bg-secondary/10 text-secondary"
                  : "text-muted-foreground hover:text-secondary"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
