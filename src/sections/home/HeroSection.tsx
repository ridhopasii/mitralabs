"use client";

import { MessageCircle, Zap } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function HeroSection() {
  const { data } = useData();
  const { hero } = data.home;
  const { settings } = data;
  
  const waUrl = `https://wa.me/${settings.waNumber}?text=${encodeURIComponent("Halo Mitralabs! Saya ingin konsultasi gratis untuk website bisnis saya.")}`;

  return (
    <section className="relative pt-24 pb-24 md:pt-40 md:pb-40 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="z-10 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
              {hero.tagline}
            </span>
            {settings.businessMode === "agresif" && (
              <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-red-500/20">
                <Zap size={10} className="fill-current" /> {hero.promo}
              </span>
            )}
          </div>
          <h1 className="font-display text-5xl md:text-8xl font-black text-on-surface mb-8 leading-[0.95] tracking-tight whitespace-pre-line">
            {hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant mb-10 max-w-lg leading-relaxed font-medium">
            {hero.subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-4 transition-all hover:scale-[1.05] active:scale-[0.95] ${
                settings.businessMode === "agresif"
                  ? "bg-primary text-on-primary shadow-2xl shadow-primary/40"
                  : "bg-on-surface text-surface rounded-full shadow-xl"
              }`}
            >
              <MessageCircle size={24} />
              Mulai Konsultasi Gratis
            </a>
            <a
              href="/layanan"
              className="border-2 border-surface-container-highest px-10 py-5 rounded-2xl font-black text-lg text-on-surface hover:bg-surface-container-low transition-all"
            >
              Lihat Paket
            </a>
          </div>
        </div>
        <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="bg-surface-container-lowest p-6 rounded-[3rem] shadow-premium relative z-10 border border-surface-container-highest">
            <img
              src={hero.image}
              alt="Hero Image"
              className="rounded-[2rem] w-full h-full object-cover aspect-square shadow-inner"
            />
          </div>
          <div className="absolute -bottom-10 -left-10 bg-surface-container-lowest p-8 rounded-[2rem] shadow-2xl z-20 border border-surface-container-highest max-w-[240px] animate-bounce duration-[3000ms]">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{hero.stats.label}</span>
            </div>
            <p className="text-3xl font-black tracking-tight text-on-surface">{hero.stats.value}</p>
            <p className="text-xs font-bold text-on-surface-variant">{hero.stats.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
