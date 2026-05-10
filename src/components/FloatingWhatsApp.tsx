"use client";

import { MessageCircle } from "lucide-react";
import { useData } from "@/context/DataContext";

import { usePathname } from "next/navigation";

export default function FloatingWhatsApp() {
  const { data } = useData();
  const { settings } = data;
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) return null;

  const waUrl = `https://wa.me/${settings.waNumber}?text=${encodeURIComponent("Halo Mitralabs! Saya tertarik dengan promo bulan ini.")}`;

  return (
    <div className="fixed bottom-8 right-8 z-100 flex flex-col items-end gap-4">
      {/* Floating Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <div className="absolute inset-0 bg-[#25D366] rounded-2xl animate-ping opacity-20"></div>
        <MessageCircle size={32} className="relative z-10 group-hover:rotate-12 transition-transform" />
      </a>
    </div>
  );
}
