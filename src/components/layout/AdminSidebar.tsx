"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShieldAlert, FolderCheck, Coins,
  ChevronsLeft, ChevronsRight, LogOut, Settings
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const navItems = [
  { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/admin/moderasi", label: "Moderasi Proyek", icon: ShieldAlert },
  { href: "/dashboard/admin/verifikasi", label: "Verifikasi Pengguna", icon: FolderCheck },
  { href: "/dashboard/admin/transaksi", label: "Monitoring Transaksi", icon: Coins },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-slate-900 text-slate-100 border-r border-slate-800 shrink-0 transition-all duration-300 h-full ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {/* Logo + Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          {!collapsed && (
            <Link href="/" className="font-bold text-xl text-amber-500 whitespace-nowrap">
              SkillGate Admin
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 rounded-full transition-colors shrink-0"
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
                    ? "bg-amber-500/10 text-amber-400 font-semibold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-amber-400" : ""}`} />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
            className="w-full flex items-center gap-4 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium text-left cursor-pointer"
            title="Keluar"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-slate-900 text-slate-400 shadow-[0_-2px_10px_rgba(0,0,0,0.2)] border-t border-slate-800 rounded-t-xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? "bg-amber-500/10 text-amber-400"
                  : "hover:text-amber-400"
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
