"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Phone } from "lucide-react";
import { useData } from "@/context/DataContext";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingWhatsApp() {
  const { data } = useData();
  const { settings } = data;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Show notification after 5 seconds to entice user
    const timer = setTimeout(() => {
      if (!isOpen) setShowNotification(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) return null;

  const waUrl = `https://wa.me/${settings.waNumber}?text=${encodeURIComponent("Halo Mitralabs! Saya ingin berdiskusi tentang projek saya.")}`;

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end gap-4 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[350px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden border border-slate-100 mb-4"
          >
            {/* Header */}
            <div className="bg-[#1D1D1F] p-6 text-white flex justify-between items-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
               <div className="flex items-center gap-4 relative z-10">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center font-black text-primary">M</div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[#1D1D1F] rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-tight">Mitralabs Support</h4>
                    <div className="flex items-center gap-1.5 opacity-60 text-[10px] font-bold uppercase tracking-widest">
                       Online Now
                    </div>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                  <X size={16} />
               </button>
            </div>

            {/* Chat Body */}
            <div className="p-6 h-[250px] overflow-y-auto bg-slate-50/50 space-y-4 flex flex-col">
               <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 max-w-[85%]">
                  <p className="text-xs font-medium text-slate-700 leading-relaxed">
                    Halo! 👋 Ada yang bisa kami bantu hari ini? Tim kami siap menjawab pertanyaan Anda seputar pembuatan website & aplikasi.
                  </p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase mt-2">Just Now</p>
               </div>
               <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 max-w-[85%]">
                  <p className="text-xs font-medium text-slate-700 leading-relaxed">
                    Biasanya kami membalas dalam hitungan menit.
                  </p>
               </div>
            </div>

            {/* Footer / Input */}
            <div className="p-6 bg-white border-t border-slate-100">
               <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
               >
                 <MessageCircle size={16} /> Mulai Chat WhatsApp
               </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence>
          {showNotification && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-20 top-1/2 -translate-y-1/2 bg-white px-5 py-3 rounded-2xl shadow-xl border border-slate-100 whitespace-nowrap"
            >
              <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Butuh Bantuan? Chat Yuk! 👋</p>
              <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-t border-r border-slate-100 rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Button */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowNotification(false);
          }}
          className={`group relative flex items-center justify-center w-16 h-16 rounded-[1.5rem] shadow-2xl transition-all duration-500 ${
            isOpen ? 'bg-slate-900 rotate-90' : 'bg-[#25D366] hover:scale-110 active:scale-95'
          }`}
        >
          {!isOpen && <div className="absolute inset-0 bg-[#25D366] rounded-[1.5rem] animate-ping opacity-20"></div>}
          {isOpen ? (
            <X size={28} className="text-white" />
          ) : (
            <MessageCircle size={32} className="relative z-10 text-white group-hover:rotate-12 transition-transform" />
          )}
          
          {/* Unread dot */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 border-4 border-white rounded-full"></div>
          )}
        </button>
      </div>
    </div>
  );
}
