"use client";

import { Store, School, Plane, Building2, ArrowRight } from "lucide-react";
import { useData } from "@/context/DataContext";
import Image from "next/image";

export default function SolutionSection() {
  const { data } = useData();
  const { solution } = data.home;
  const { cards } = solution;

  return (
    <section className="py-24 bg-background" id="services">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="max-w-xl">
            <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-4 block">{solution.tagline}</span>
            <h2 className="font-display text-4xl md:text-6xl font-black text-on-surface leading-[0.95] tracking-tighter">
              {solution.title}
            </h2>
          </div>
          <div className="text-on-surface-variant max-w-sm text-lg font-medium">
            {solution.subtitle}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Large Feature: UMKM */}
          <div className="md:col-span-8 bg-surface-container-lowest p-12 rounded-[3rem] shadow-premium border border-surface-container-highest flex flex-col justify-between group">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-black uppercase tracking-widest mb-8 shadow-sm">
                <Store size={14} /> {cards.umkm.tag}
              </div>
              <h3 className="font-display text-4xl font-black text-on-surface mb-6 tracking-tight">{cards.umkm.title}</h3>
              <p className="text-on-surface-variant text-xl max-w-md font-medium leading-relaxed">
                {cards.umkm.desc}
              </p>
            </div>
            <div className="mt-12 rounded-[2rem] h-80 w-full overflow-hidden border border-surface-container-highest shadow-inner relative">
              <Image
                src={cards.umkm.image}
                alt={cards.umkm.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Travel Package Card */}
          <div className="md:col-span-4 bg-primary p-12 rounded-[3rem] text-on-primary flex flex-col justify-between shadow-premium group overflow-hidden relative">
             <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
               <Plane size={200} />
             </div>
            <div className="relative z-10">
              <Plane size={48} className="mb-8" />
              <h3 className="text-3xl font-black mb-6 tracking-tight">{cards.travel.title}</h3>
              <p className="text-lg opacity-80 font-medium leading-relaxed">
                {cards.travel.desc}
              </p>
            </div>
            <a href="/layanan" className="relative z-10 mt-12 flex items-center gap-3 font-black text-lg group-hover:translate-x-3 transition-transform">
              Lihat Paket <ArrowRight size={24} />
            </a>
          </div>

          {/* Bottom Row */}
          <div className="md:col-span-6 bg-surface-container-lowest p-10 rounded-[3rem] shadow-premium border border-surface-container-highest group flex items-center gap-8 hover:border-primary/20 transition-all">
            <div className="w-20 h-20 bg-secondary-container/30 rounded-[1.5rem] flex items-center justify-center text-secondary shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500 shadow-sm">
              <School size={36} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-on-surface mb-3 tracking-tight">{cards.school.title}</h3>
              <p className="text-on-surface-variant font-medium leading-relaxed">{cards.school.desc}</p>
            </div>
          </div>
          
          <div className="md:col-span-6 bg-surface-container-lowest p-10 rounded-[3rem] shadow-premium border border-surface-container-highest group flex items-center gap-8 hover:border-primary/20 transition-all">
            <div className="w-20 h-20 bg-secondary-container/30 rounded-[1.5rem] flex items-center justify-center text-secondary shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500 shadow-sm">
              <Building2 size={36} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-on-surface mb-3 tracking-tight">{cards.business.title}</h3>
              <p className="text-on-surface-variant font-medium leading-relaxed">{cards.business.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
