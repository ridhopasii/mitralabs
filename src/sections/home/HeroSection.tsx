"use client";

import { useData } from "@/context/DataContext";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  const { data } = useData();
  const { hero } = data.home;
  const { settings } = data;
  
  const waUrl = `https://wa.me/${settings.waNumber}?text=${encodeURIComponent("Halo Mitralabs! Saya ingin konsultasi gratis untuk website bisnis saya.")}`;

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
      <div className="max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          <span className="text-primary font-semibold text-sm tracking-tight mb-4 block">
            {hero.tagline}
          </span>
          <h1 className="text-5xl md:text-8xl font-semibold text-on-background mb-8 leading-[1.1] tracking-tight text-balance">
            {hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-secondary mb-12 max-w-2xl mx-auto leading-relaxed font-medium text-balance">
            {hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-on-background text-background px-10 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-all shadow-apple"
            >
              Mulai Konsultasi Gratis
            </a>
            <a
              href="/layanan"
              className="text-primary font-semibold text-lg hover:underline transition-all flex items-center gap-1"
            >
              Lihat Paket <span>&rarr;</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full max-w-6xl mx-auto px-4"
        >
          <div className="rounded-[3rem] overflow-hidden shadow-apple bg-surface-container">
             <Image
              src={hero.image}
              alt="Hero Image"
              width={1400}
              height={800}
              priority
              className="w-full h-full object-cover aspect-[21/9] transition-transform duration-1000 hover:scale-[1.02]"
            />
          </div>
          
          {/* Subtle Stats Overlay */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-xl px-10 py-6 rounded-[2rem] shadow-apple border border-outline/10 hidden md:block">
            <div className="flex items-center gap-8 divide-x divide-outline/20">
              <div className="text-left">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">{hero.stats.label}</p>
                <p className="text-2xl font-semibold text-on-background tracking-tight">{hero.stats.value}</p>
              </div>
              <div className="text-left pl-8">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Status</p>
                <p className="text-2xl font-semibold text-success tracking-tight flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Online
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
