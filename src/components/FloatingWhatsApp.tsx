"use client";

import { MessageCircle, X, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";

export default function FloatingWhatsApp() {
  const { data } = useData();
  const { settings } = data;
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    if (settings.businessMode === "agresif") {
      const timer = setTimeout(() => setShowPromo(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [settings.businessMode]);

  const waUrl = `https://wa.me/${settings.waNumber}?text=${encodeURIComponent("Halo Mitralabs! Saya tertarik dengan promo bulan ini.")}`;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      {/* Dynamic Promo Bubble */}
      {showPromo && (
        <div className="bg-white p-6 rounded-[2rem] shadow-premium max-w-[280px] border border-surface-container-highest animate-in slide-in-from-bottom-4 duration-500 relative group">
          <button 
            onClick={() => setShowPromo(false)}
            className="absolute -top-2 -left-2 w-8 h-8 bg-surface-container-highest rounded-full flex items-center justify-center hover:bg-error hover:text-white transition-all shadow-md"
          >
            <X size={14} />
          </button>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white shadow-lg animate-pulse">
               <Zap size={14} fill="currentColor" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Promo Aktif</span>
          </div>
          <p className="text-sm font-bold text-on-surface leading-relaxed">
            {settings.waPromoMessage}
          </p>
          <a 
            href={waUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 block text-center bg-primary text-on-primary py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all"
          >
            Klaim Sekarang
          </a>
        </div>
      )}

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
