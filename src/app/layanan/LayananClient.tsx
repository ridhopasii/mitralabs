"use client";

import Footer from "@/components/Footer";
import { Check, X } from "lucide-react";
import { useData } from "@/context/DataContext";
import Link from "next/link";
import FAQSection from "@/sections/home/FAQSection";

export default function LayananClient() {
  const { data } = useData();
  const { services } = data;
  const { plans, notes } = services;

  return (
    <>
      <main className="bg-background">
        {/* Hero Section */}
        <header className="pt-40 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-6 block">Our Solutions</span>
            <h1 className="font-display text-5xl md:text-8xl font-black text-on-surface mb-8 leading-[0.9] tracking-tighter">
              {services.title}
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
              {services.subtitle}
            </p>
          </div>
        </header>

        {/* Pricing Section */}
        <section className="py-24 px-6 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, idx) => (
                <div
                  key={plan.id}
                  className={`bg-surface-container-lowest p-12 rounded-[3rem] shadow-premium border flex flex-col transition-all duration-500 animate-in fade-in slide-in-from-bottom-10 ${
                    plan.highlight ? "border-primary scale-105 z-10 shadow-2xl shadow-primary/20" : "border-surface-container-highest"
                  }`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {plan.highlight && (
                    <div className="bg-primary text-on-primary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest self-center mb-8 shadow-lg">
                      Paling Populer
                    </div>
                  )}
                  <div className="mb-12">
                    <span className="text-primary font-black tracking-[0.2em] text-[10px] uppercase block mb-2">{plan.tier}</span>
                    <h3 className="text-3xl font-black tracking-tight">{plan.name}</h3>
                    <div className="mt-6 flex flex-col">
                      <span className="text-5xl font-black tracking-tighter text-on-surface">{plan.price}</span>
                      <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mt-3 opacity-60">
                        {plan.duration} • {plan.pages}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-5 mb-12 flex-grow">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-4 text-sm font-bold">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                           <Check size={14} />
                        </div>
                        {f}
                      </li>
                    ))}
                    {plan.missing.map((f, i) => (
                      <li key={i} className="flex items-center gap-4 text-sm font-bold opacity-30">
                        <div className="w-6 h-6 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                           <X size={14} />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                      plan.highlight
                        ? "bg-primary text-on-primary hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
                        : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    Pilih Paket
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-20 text-center text-on-surface-variant/40 text-[10px] font-bold uppercase tracking-widest space-y-3">
              {notes.map((note, i) => (
                <p key={i}>{note}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Feature Matrix</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">{services.comparisonTitle}</h2>
              <p className="text-xl text-on-surface-variant font-medium max-w-2xl mx-auto opacity-60">{services.comparisonSubtitle}</p>
            </div>
            <div className="overflow-x-auto bg-surface-container-lowest rounded-[3rem] border border-surface-container-highest shadow-premium">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-surface-container-highest text-left">
                    <th className="p-10 text-[10px] font-black uppercase tracking-widest opacity-40 w-1/4">Fitur Utama</th>
                    {plans.map(p => (
                      <th key={p.id} className="p-10 text-[10px] font-black uppercase tracking-widest text-primary">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-highest text-sm font-bold">
                  <tr className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="p-10 opacity-60">Waktu Pengerjaan</td>
                    {plans.map(p => <td key={p.id} className="p-10">{p.duration}</td>)}
                  </tr>
                  <tr className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="p-10 opacity-60">Jumlah Halaman</td>
                    {plans.map(p => <td key={p.id} className="p-10">{p.pages}</td>)}
                  </tr>
                  <tr className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="p-10 opacity-60">Harga Estimasi</td>
                    {plans.map(p => <td key={p.id} className="p-10 text-primary font-black">{p.price}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 mb-40">
           <div className="max-w-7xl mx-auto bg-primary p-12 md:p-32 rounded-[4rem] text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1A5CFF_0%,_transparent_70%)] opacity-50"></div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-7xl font-black mb-8 text-on-primary tracking-tighter leading-none">Siap untuk Go-Digital?</h2>
                <p className="text-xl text-on-primary/70 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                  Konsultasikan kebutuhan bisnis Anda secara gratis dan dapatkan penawaran terbaik.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/kontak" className="bg-white text-primary px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-110 transition-all shadow-2xl">
                    Konsultasi Sekarang
                  </Link>
                  <Link href="/portfolio" className="border-2 border-white/20 text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                    Lihat Portfolio
                  </Link>
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
