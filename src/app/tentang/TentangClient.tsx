"use client";

import React from "react";
import Footer from "@/components/Footer";
import { Rocket, ShieldCheck, Heart } from "lucide-react";
import { useData } from "@/context/DataContext";
import Image from "next/image";

export default function TentangClient() {
  const { data } = useData();
  const { about } = data;

  return (
    <>
      <main className="bg-background">
        {/* Hero & Story Section */}
        <section className="pt-40 pb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2 animate-in fade-in slide-in-from-left-8 duration-1000">
                <span className="text-primary font-black uppercase tracking-[0.3em] mb-6 block text-[10px]">{about.hero.tagline}</span>
                <h1 className="font-display text-5xl md:text-8xl font-black text-on-surface mb-8 leading-[0.85] tracking-tighter">
                  {about.hero.title}
                </h1>
                <p className="text-xl md:text-2xl text-on-surface-variant mb-12 leading-relaxed font-medium opacity-80">
                  {about.hero.subtitle}
                </p>
                <div className="flex flex-wrap gap-12">
                  {about.stats.map((stat, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-5xl font-black text-primary tracking-tighter">{stat.value}</span>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-black mt-2 opacity-40">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 relative animate-in fade-in zoom-in-95 duration-1000 delay-300">
                <div className="aspect-[4/3] rounded-[4rem] overflow-hidden shadow-premium border border-surface-container-highest relative">
                  <Image
                    alt="About Mitralabs"
                    fill
                    className="object-cover"
                    src={about.hero.image}
                  />
                </div>
                <div className="absolute -bottom-10 -left-10 bg-on-surface p-12 rounded-[3rem] hidden md:block shadow-2xl max-w-sm">
                  <p className="text-surface text-xl font-black italic tracking-tight leading-relaxed opacity-90">"{about.vision}"</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-32 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="p-12 bg-surface-container-lowest rounded-[3.5rem] shadow-premium border border-surface-container-highest group hover:border-primary/20 transition-all duration-500">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-10 text-primary group-hover:scale-110 transition-transform">
                  <Rocket size={32} />
                </div>
                <h2 className="text-2xl font-black text-on-surface mb-6 tracking-tight uppercase">{about.visionTitle}</h2>
                <p className="text-on-surface-variant leading-relaxed font-medium opacity-80">
                  {about.vision}
                </p>
              </div>
              <div className="p-12 bg-surface-container-lowest rounded-[3.5rem] shadow-premium border border-surface-container-highest md:col-span-2 group hover:border-primary/20 transition-all duration-500">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-10 text-primary group-hover:scale-110 transition-transform">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-2xl font-black text-on-surface mb-6 tracking-tight uppercase">{about.missionTitle}</h2>
                <ul className="text-on-surface-variant leading-relaxed font-medium space-y-6">
                  {about.mission.map((m, i) => (
                    <li key={i} className="flex items-center gap-6">
                      <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary font-black text-xs shrink-0">{i+1}</div>
                      <span className="opacity-80">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-40 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="text-primary font-black uppercase tracking-[0.3em] mb-6 block text-[10px]">The Minds Behind</span>
              <h2 className="font-display text-4xl md:text-7xl font-black text-on-surface mb-8 tracking-tighter leading-none">{about.teamTitle}</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-xl font-medium opacity-60 leading-relaxed">{about.teamSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 max-w-5xl mx-auto">
              {about.team.map((member, idx) => (
                <div key={member.id} className="group text-center animate-in fade-in slide-in-from-bottom-10" style={{ animationDelay: `${idx * 200}ms` }}>
                  <div className="aspect-square w-64 h-64 mx-auto rounded-[4rem] overflow-hidden mb-10 shadow-premium group-hover:scale-105 transition-transform duration-700 border border-surface-container-highest relative">
                    <Image
                      alt={member.name}
                      fill
                      className="object-cover"
                      src={member.image}
                    />
                  </div>
                  <h3 className="text-4xl font-black text-on-surface tracking-tighter">{member.name}</h3>
                  <p className="text-[10px] text-primary uppercase tracking-[0.2em] mt-3 font-black">{member.role}</p>
                  <p className="text-base text-on-surface-variant mt-8 leading-relaxed px-6 font-medium opacity-60 italic">"{member.bio}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
