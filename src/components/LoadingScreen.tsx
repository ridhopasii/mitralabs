"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      <div className="relative">
        {/* Animated Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border-4 border-primary/10 rounded-full"
        ></motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-32 h-32 border-t-4 border-primary rounded-full"
        ></motion.div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="text-primary animate-spin" size={40} />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <h2 className="text-2xl font-black tracking-tight uppercase mb-2">Memuat Sistem</h2>
        <p className="text-on-surface-variant font-medium opacity-60">Mohon tunggu sebentar...</p>
      </motion.div>

      <div className="absolute bottom-10 left-10 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-on-primary font-black text-sm">M</div>
        <span className="font-black text-xs uppercase tracking-[0.3em] opacity-20">Mitralabs.id Core</span>
      </div>
    </div>
  );
}
