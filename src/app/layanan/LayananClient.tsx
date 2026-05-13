"use client";

import Footer from "@/components/Footer";
import { Check, X, ArrowRight } from "lucide-react";
import { useData } from "@/context/DataContext";
import Link from "next/link";
import FAQSection from "@/sections/home/FAQSection";
import CalculatorSection from "@/sections/services/CalculatorSection";
import { motion } from "framer-motion";

export default function LayananClient() {
  const { data } = useData();
  const { services, settings } = data;
  const { plans, notes } = services;

  const waUrl = `https://wa.me/${settings.waNumber}?text=${encodeURIComponent("Halo Mitralabs! Saya ingin bertanya tentang paket ")}`;

  return (
    <>
      <main className="bg-background">
        {/* Hero Section */}
        <header className="pt-40 pb-24 md:pt-60 md:pb-40 px-6">
          <div className="section-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-primary font-semibold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-6 block">
                {services.labels?.tagline || "Solusi Digital"}
              </span>
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-semibold text-on-surface mb-10 leading-[1.05] tracking-tight md:tracking-[-0.03em] reveal-text">
                {services.title}
              </h1>
              <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto font-medium leading-relaxed">
                {services.subtitle}
              </p>
            </motion.div>
          </div>
        </header>

        {/* Pricing Section */}
        <section className="py-24 md:py-40 px-6 bg-surface-container/30">
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-stretch">
              {plans.map((plan, idx) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex flex-col p-10 md:p-14 rounded-[3.5rem] bg-background border transition-all duration-700 ${
                    plan.highlight 
                    ? "border-primary shadow-apple-hover ring-4 ring-primary/5 z-10" 
                    : "border-outline/10 shadow-apple"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">
                      Paling Populer
                    </div>
                  )}
                  
                  <div className="mb-12">
                    <span className="text-secondary font-bold tracking-[0.2em] text-[10px] uppercase block mb-3">{plan.tier}</span>
                    <h3 className="text-4xl font-semibold tracking-tight text-on-background mb-8">{plan.name}</h3>
                    <div className="flex flex-col">
                      <span className="text-5xl md:text-6xl font-semibold tracking-tighter text-on-background">{plan.price}</span>
                      <span className="text-secondary text-[11px] font-bold uppercase tracking-widest mt-4">
                        {plan.duration} • {plan.pages}
                      </span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-outline/10 mb-12"></div>

                  <ul className="space-y-6 mb-12 flex-grow">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-4 text-base font-medium text-on-surface">
                        <div className="mt-1 w-5 h-5 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
                           <Check size={12} strokeWidth={3} />
                        </div>
                        {f}
                      </li>
                    ))}
                    {plan.missing.map((f, i) => (
                      <li key={i} className="flex items-start gap-4 text-base font-medium text-secondary opacity-40">
                        <div className="mt-1 w-5 h-5 rounded-full bg-outline/10 flex items-center justify-center text-secondary shrink-0">
                           <X size={12} strokeWidth={3} />
                        </div>
                        <span className="line-through">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`${waUrl}${plan.name}`}
                    target="_blank"
                    className={`w-full text-center py-5 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-400 ${
                      plan.highlight
                        ? "bg-on-background text-background hover:scale-[1.02] active:scale-[0.98] shadow-apple"
                        : "bg-surface-container text-on-surface hover:bg-on-background hover:text-background"
                    }`}
                  >
                    Pilih Paket
                  </a>
                </motion.div>
              ))}
            </div>

            <div className="mt-24 text-center text-secondary/50 text-[10px] font-bold uppercase tracking-[0.2em] space-y-3">
              {notes.map((note, i) => (
                <p key={i}>{note}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-32 md:py-48 px-6">
          <div className="section-container">
            <div className="text-center mb-32">
              <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
                {services.labels?.comparisonTagline || "Perbandingan Detail"}
              </span>
              <h2 className="text-5xl md:text-7xl font-semibold tracking-tight reveal-text mb-10">{services.comparisonTitle}</h2>
              <p className="text-xl md:text-2xl text-secondary font-medium max-w-2xl mx-auto">{services.comparisonSubtitle}</p>
            </div>
            
            <div className="overflow-x-auto no-scrollbar rounded-[3.5rem] border border-outline/10 shadow-apple">
              <table className="w-full border-collapse bg-background">
                <thead>
                  <tr className="border-b border-outline/10 text-left">
                    <th className="p-10 md:p-14 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary w-1/4">
                      {services.labels?.featureColumn || "Fitur"}
                    </th>
                    {plans.map(p => (
                      <th key={p.id} className="p-10 md:p-14 text-[11px] font-bold uppercase tracking-[0.2em] text-on-background">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline/10 text-lg font-medium text-on-surface">
                  <tr className="hover:bg-surface-container transition-colors">
                    <td className="p-10 md:p-14 text-secondary">
                      {services.labels?.durationLabel || "Waktu Pengerjaan"}
                    </td>
                    {plans.map(p => <td key={p.id} className="p-10 md:p-14">{p.duration}</td>)}
                  </tr>
                  <tr className="hover:bg-surface-container transition-colors">
                    <td className="p-10 md:p-14 text-secondary">
                      {services.labels?.pagesLabel || "Jumlah Halaman"}
                    </td>
                    {plans.map(p => <td key={p.id} className="p-10 md:p-14">{p.pages}</td>)}
                  </tr>
                  <tr className="hover:bg-surface-container transition-colors">
                    <td className="p-10 md:p-14 text-secondary font-semibold">
                      {services.labels?.investmentLabel || "Investasi"}
                    </td>
                    {plans.map(p => <td key={p.id} className="p-10 md:p-14 text-primary font-bold">{p.price}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>


        {/* Dynamic Price Calculator */}
        <CalculatorSection />

        {/* CTA Section */}
        <section className="py-24 md:py-48 px-6 mb-20">
           <div className="section-container">
             <div className="bg-surface-container p-16 md:p-32 rounded-[4rem] text-center relative overflow-hidden border border-outline/5 shadow-apple">
                <div className="relative z-10">
                  <h2 className="text-5xl md:text-8xl font-semibold mb-10 text-on-background tracking-tight reveal-text">
                    {services.labels?.ctaTitle || "Siap untuk Go-Digital?"}
                  </h2>
                  <p className="text-xl md:text-2xl text-secondary max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
                    {services.labels?.ctaSubtitle || "Konsultasikan kebutuhan bisnis Anda secara gratis dan dapatkan penawaran terbaik dari tim ahli kami."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-8 justify-center">
                    <Link href="/kontak" className="btn-apple text-lg px-12 py-5 flex items-center justify-center gap-3">
                      {services.labels?.ctaPrimary || "Konsultasi Gratis"} <ArrowRight size={20} />
                    </Link>
                    <Link href="/portfolio" className="btn-apple-secondary text-lg px-12 py-5 border border-outline/20">
                      {services.labels?.ctaSecondary || "Lihat Portfolio"}
                    </Link>
                  </div>
                </div>
             </div>
           </div>
        </section>

        <FAQSection />
      </main>

      <Footer />
    </>
  );
}
