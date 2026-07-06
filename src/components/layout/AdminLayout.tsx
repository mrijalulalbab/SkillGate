"use client";

import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Bell, Shield } from "lucide-react";
import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden pb-16 md:pb-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 md:px-8 shrink-0 relative z-30">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-amber-500" />
            <span className="font-bold text-lg tracking-wide hidden sm:inline">SKILLGATE ADMINISTRATOR CONTROL</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full border border-slate-900"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <span className="text-amber-400 font-bold text-sm">A</span>
              </div>
              <span className="text-sm font-semibold text-slate-300 hidden md:inline">Super Admin</span>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-grow overflow-y-auto bg-slate-950 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
