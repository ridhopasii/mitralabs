"use client";

import React from "react";
import Footer from "@/components/Footer";
import { Rocket, ShieldCheck, ArrowRight } from "lucide-react";
import { useData } from "@/context/DataContext";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TentangClient() {
  const { data } = useData();
  const { about } = data;

  return (
    <>
      <main className="bg-background min-h-screen">
        {/* Hero & Story Section */}
        <section className="pt-40 pb-24 md:pt-60 md:pb-40 relative overflow-hidden">
          <div className="section-container relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
              <div className="lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="text-primary font-semibold uppercase tracking-[0.2em] mb-6 block text-[10px] md:text-xs">{about.hero.tagline}</span>
                  <h1 className="text-5xl md:text-8xl lg:text-9xl font-semibold text-on-surface mb-10 leading-[1.05] tracking-tight md:tracking-[-0.03em] reveal-text">
                    {about.hero.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-secondary mb-14 leading-relaxed font-medium">
                    {about.hero.subtitle}
                  </p>
                  
                  <div className="flex flex-wrap gap-10 md:gap-16">
                    {about.stats.map((stat, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-4xl md:text-6xl font-semibold text-on-background tracking-tighter">{stat.value}</span>
                        <span className="text-[10px] md:text-xs text-secondary uppercase tracking-[0.2em] font-bold mt-2">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="lg:w-1/2 relative"
              >
                <div className="aspect-[4/3] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-apple border border-outline/5 relative bg-surface-container">
                  <Image
                    alt="About Mitralabs"
                    fill
                    priority
                    className="object-cover transition-transform duration-2000 hover:scale-105"
                    src={about.hero.image}
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 glass-apple p-10 md:p-14 rounded-[3rem] hidden md:block shadow-apple-hover border border-outline/10 max-w-sm">
                  <p className="text-on-background text-xl md:text-2xl font-medium italic tracking-tight leading-relaxed">
                    "{about.vision}"
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 md:py-40 bg-surface-container/30">
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-12 bg-background rounded-[3.5rem] shadow-apple border border-outline/5 group"
              >
                <div className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mb-10 text-on-background transition-all duration-500 group-hover:bg-on-background group-hover:text-background border border-outline/5">
                  <Rocket size={24} />
                </div>
                <h2 className="text-2xl font-semibold text-on-surface mb-6 tracking-tight uppercase tracking-[0.1em]">{about.visionTitle}</h2>
                <p className="text-secondary leading-relaxed font-medium text-lg">
                  {about.vision}
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-12 bg-background rounded-[3.5rem] shadow-apple border border-outline/5 md:col-span-2 group"
              >
                <div className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mb-10 text-on-background transition-all duration-500 group-hover:bg-on-background group-hover:text-background border border-outline/5">
                  <ShieldCheck size={24} />
                </div>
                <h2 className="text-2xl font-semibold text-on-surface mb-8 tracking-tight uppercase tracking-[0.1em]">{about.missionTitle}</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {about.mission.map((m, i) => (
                    <li key={i} className="flex items-start gap-5">
                      <div className="w-8 h-8 bg-surface-container rounded-lg flex items-center justify-center text-secondary font-bold text-[11px] shrink-0 border border-outline/5">{i+1}</div>
                      <span className="text-secondary font-medium leading-relaxed">{m}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 md:py-48 bg-background">
          <div className="section-container">
            <div className="text-center mb-32">
              <span className="text-primary font-semibold uppercase tracking-[0.3em] mb-6 block text-[10px] md:text-xs">
                {about.labels?.teamTagline || "Tim Ahli Kami"}
              </span>
              <h2 className="text-5xl md:text-7xl font-semibold text-on-surface mb-8 tracking-tight reveal-text">{about.teamTitle}</h2>
              <p className="text-secondary max-w-2xl mx-auto text-xl md:text-2xl font-medium leading-relaxed">{about.teamSubtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 max-w-5xl mx-auto">
              {about.team.map((member, idx) => (
                <motion.div 
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group text-center"
                >
                  <div className="aspect-square w-64 h-64 md:w-80 md:h-80 mx-auto rounded-[4rem] overflow-hidden mb-10 shadow-apple group-hover:shadow-apple-hover transition-all duration-700 border border-outline/5 relative bg-surface-container">
                    <Image
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      src={member.image}
                    />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-semibold text-on-background tracking-tight">{member.name}</h3>
                  <p className="text-[10px] md:text-xs text-primary uppercase tracking-[0.2em] mt-4 font-bold">{member.role}</p>
                  <p className="text-lg text-secondary mt-8 leading-relaxed px-6 font-medium italic opacity-70">"{member.bio}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="section-container py-24 md:py-48 mb-20">
           <div className="bg-surface-container p-16 md:p-32 rounded-[4rem] text-center relative overflow-hidden border border-outline/5 shadow-apple">
              <div className="relative z-10">
                <h2 className="text-5xl md:text-8xl font-semibold mb-10 text-on-background tracking-tight reveal-text">
                  {about.labels?.ctaTitle || "Siap Berkolaborasi?"}
                </h2>
                <p className="text-xl md:text-2xl text-secondary max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
                  {about.labels?.ctaSubtitle || "Mari wujudkan visi digital Anda bersama tim yang berdedikasi dan berpengalaman."}
                </p>
                <div className="flex flex-col sm:flex-row gap-8 justify-center">
                  <Link href="/kontak" className="btn-apple text-lg px-12 py-5 flex items-center justify-center gap-3">
                    {about.labels?.ctaPrimary || "Mulai Project"} <ArrowRight size={20} />
                  </Link>
                  <Link href="/layanan" className="btn-apple-secondary text-lg px-12 py-5 border border-outline/20">
                    {about.labels?.ctaSecondary || "Lihat Paket"}
                  </Link>
                </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
