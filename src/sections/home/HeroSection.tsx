"use client";

import { useData } from "@/context/DataContext";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  const { data } = useData();
  const { hero } = data.home;
  const { brand } = data;
  
  const waUrl = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Halo Mitralabs! Saya ingin konsultasi gratis untuk website bisnis saya.")}`;

  return (
    <section className="relative pt-20 pb-16 md:pt-44 md:pb-40 overflow-hidden bg-background">
      <div className="section-container text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="z-10 w-full"
        >
          <span className="text-primary font-bold text-[10px] md:text-xs tracking-[0.25em] uppercase mb-5 md:mb-8 block">
            {hero.tagline}
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-on-background mb-8 md:mb-12 leading-[1.05] tracking-tight md:tracking-[-0.04em] text-balance reveal-text">
            {hero.title}
          </h1>
          <p className="text-lg md:text-xl text-secondary mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed font-medium text-balance">
            {hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 mb-20 md:mb-28 px-4">
            <Link
              href="/layanan"
              className="btn-apple w-full sm:w-auto text-base text-center"
            >
              {data.navbar.buttonText}
            </Link>
            <Link
              href="/layanan"
              className="btn-apple-secondary w-full sm:w-auto text-base text-center group flex items-center justify-center gap-2"
            >
              Lihat Paket 
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-6xl mx-auto px-2 md:px-0"
        >
          <div className="rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-apple bg-surface-container border border-outline/5 p-1">
            <div className="rounded-[1.8rem] md:rounded-[3.2rem] overflow-hidden">
               <Image
                src={hero.image}
                alt="Hero Image"
                width={1400}
                height={800}
                priority
                className="w-full h-full object-cover aspect-[4/3] md:aspect-[21/9] transition-transform duration-2000 hover:scale-[1.03]"
              />
            </div>
          </div>
          
          {/* Subtle Stats Overlay - Optimized for mobile (shown as simple pill or hidden if too busy) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass-apple px-6 py-4 md:px-12 md:py-8 rounded-full md:rounded-[2.5rem] shadow-apple border border-outline/10 w-[90%] md:w-auto md:min-w-[400px]"
          >
            <div className="flex items-center justify-between md:justify-around gap-4 md:gap-12 md:divide-x divide-outline/10">
              <div className="text-left">
                <p className="text-[8px] md:text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-1 md:mb-2">{hero.stats.label}</p>
                <p className="text-lg md:text-3xl font-semibold text-on-background tracking-tight">{hero.stats.value}</p>
              </div>
              <div className="text-left md:pl-12">
                <p className="text-[8px] md:text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-1 md:mb-2">
                  {hero.stats.statusLabel || "Status"}
                </p>
                <div className="flex items-center gap-2 md:gap-3">
                   <div className="relative">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-success rounded-full"></div>
                    <div className="absolute inset-0 w-2 h-2 md:w-2.5 md:h-2.5 bg-success rounded-full animate-ping opacity-75"></div>
                   </div>
                   <p className="text-lg md:text-3xl font-semibold text-on-background tracking-tight">
                     {hero.stats.statusValue || "Aktif"}
                   </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
