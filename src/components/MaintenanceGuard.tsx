"use client";

import React from "react";
import { useData } from "@/context/DataContext";
import { Hammer, Clock, Phone, Mail } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const { data } = useData();
  const pathname = usePathname();

  // Don't show maintenance mode on admin pages or login
  const isAdminPage = pathname?.startsWith("/admin") || pathname?.startsWith("/login");
  const isMaintenance = data.settings.businessMode === "maintenance";

  if (isMaintenance && !isAdminPage) {
    return (
      <div className="min-h-screen bg-on-background flex items-center justify-center p-6 text-on-primary">
        <div className="max-w-2xl w-full text-center space-y-12">
          {/* Animated Icon */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative w-32 h-32 bg-primary rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-primary/40 rotate-12 hover:rotate-0 transition-transform duration-500">
              <Hammer size={64} />
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              Under <br /> <span className="text-primary">Maintenance</span>
            </h1>
            <p className="text-on-surface-variant font-bold text-xl md:text-2xl max-w-lg mx-auto opacity-80">
              Kami sedang melakukan pembaruan infrastruktur untuk layanan yang lebih baik. Silakan cek kembali dalam beberapa saat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href={`https://wa.me/${data.settings.waNumber}`} 
              className="flex items-center justify-center gap-4 p-8 bg-surface-container-low rounded-3xl border border-surface-container-highest hover:bg-primary hover:text-on-primary transition-all group"
            >
              <Phone className="group-hover:animate-bounce" />
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Hubungi Kami</p>
                <p className="font-bold">WhatsApp Support</p>
              </div>
            </a>
            <div className="flex items-center justify-center gap-4 p-8 bg-surface-container-low rounded-3xl border border-surface-container-highest">
              <Clock />
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Estimasi Selesai</p>
                <p className="font-bold text-primary">Segera Hadir</p>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-surface-container-highest flex justify-center gap-12 opacity-40 grayscale">
            <img src="/logo.png" alt="Mitralabs" className="h-6" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
