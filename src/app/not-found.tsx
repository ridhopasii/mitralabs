"use client";

import Link from "next/link";
import { MoveLeft, Home, Hammer } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-12">
        {/* Animated 404 Number */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative inline-block"
        >
          <h1 className="text-[12rem] md:text-[18rem] font-black tracking-tighter leading-none text-surface-container-highest opacity-20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-40 h-40 bg-primary rounded-[3rem] shadow-2xl shadow-primary/40 flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-500 group">
                <Hammer size={80} className="text-on-primary group-hover:scale-110 transition-transform" />
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-on-surface uppercase">
            Halaman <span className="text-primary">Hilang</span>
          </h2>
          <p className="text-on-surface-variant font-bold text-lg md:text-xl max-w-md mx-auto opacity-80 leading-relaxed">
            Sepertinya halaman yang Anda cari telah dipindahkan atau tidak pernah ada. Mari kembali ke jalur yang benar.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <Link
            href="/"
            className="px-10 py-5 bg-on-surface text-surface rounded-[2rem] font-black text-lg flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            <Home size={24} />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-10 py-5 border-2 border-surface-container-highest text-on-surface rounded-[2rem] font-black text-lg flex items-center gap-4 hover:bg-surface-container-low transition-all"
          >
            <MoveLeft size={24} />
            Go Back
          </button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-24 pt-12 border-t border-surface-container-highest/10 w-full max-w-xs flex justify-center grayscale opacity-30"
      >
        <span className="font-black tracking-widest text-xs uppercase">Mitralabs.web.id</span>
      </motion.div>
    </div>
  );
}
