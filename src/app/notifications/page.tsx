"use client";

import { StudentLayout } from "@/components/layout/StudentLayout";
import { Button } from "@/components/ui/button";
import { 
  Bell, CheckCircle2, MessageSquare, AlertCircle, Rocket
} from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "success",
    title: "Proposal Diterima!",
    message: "Selamat! Proposal Anda untuk proyek 'Admin Chat & Balas Komentar TikTok' telah diterima. Segera cek ruang kerja.",
    time: "2 jam yang lalu",
    unread: true,
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    id: 2,
    type: "message",
    title: "Pesan Baru",
    message: "Bu Darmi mengirimkan pesan: 'Halo Andi, untuk warnanya bisa...'",
    time: "5 jam yang lalu",
    unread: true,
    icon: MessageSquare,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    id: 3,
    type: "warning",
    title: "Tenggat Waktu Proyek",
    message: "Proyek 'Admin Chat' memiliki tenggat waktu 3 hari lagi. Pastikan Anda menyelesaikannya tepat waktu.",
    time: "Kemarin, 14:30",
    unread: false,
    icon: AlertCircle,
    color: "text-amber-500",
    bg: "bg-amber-50"
  },
  {
    id: 4,
    type: "system",
    title: "Rekomendasi Proyek Baru",
    message: "Ada 3 proyek baru yang sesuai dengan keahlian Desain Grafis Anda.",
    time: "2 hari yang lalu",
    unread: false,
    icon: Rocket,
    color: "text-blue-500",
    bg: "bg-blue-50"
  }
];

export default function NotificationsPage() {
  return (
    <StudentLayout>
      <div className="max-w-[800px] mx-auto px-4 md:px-8 py-8 md:py-12">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Bell className="w-8 h-8 text-primary" />
              Notifikasi
            </h1>
            <p className="text-muted-foreground">Pemberitahuan terkait aktivitas dan proyek Anda.</p>
          </div>
          <Button variant="outline" className="font-semibold text-sm">
            Tandai semua dibaca
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div 
                key={notif.id} 
                className={`relative bg-white rounded-2xl p-5 md:p-6 shadow-sm border transition-colors cursor-pointer hover:border-primary/30 ${
                  notif.unread ? "border-primary/20 shadow-md" : "border-border/40"
                }`}
              >
                {notif.unread && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-3 w-2 h-2 rounded-full bg-primary" />
                )}
                
                <div className={`flex gap-4 md:gap-5 ${notif.unread ? "pl-4" : ""}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.bg}`}>
                    <Icon className={`w-6 h-6 ${notif.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-1">
                      <h3 className={`text-base font-bold text-foreground ${notif.unread ? "" : "text-opacity-80"}`}>
                        {notif.title}
                      </h3>
                      <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                        {notif.time}
                      </span>
                    </div>
                    <p className={`text-sm ${notif.unread ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </StudentLayout>
  );
}
