"use client";

import Footer from "@/components/Footer";
import { Check, X } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function ServicesPage() {
  const { data } = useData();
  const { services } = data;
  const { plans, notes } = services;

  return (
    <>
      <main>
        {/* Hero Section */}
        <header className="pt-24 pb-16 px-6">
          <div className="max-w-7xl auto text-center">
            <h1 className="font-display text-5xl md:text-7xl font-extrabold text-on-surface mb-6 leading-tight">
              {services.title}
            </h1>
            <p className="text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              {services.subtitle}
            </p>
          </div>
        </header>

        {/* Pricing Section */}
        <section className="py-24 px-6 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-surface-container-lowest p-10 rounded-xl shadow-premium border flex flex-col transition-all duration-300 ${
                    plan.highlight ? "border-primary scale-105 z-10" : "border-outline-variant/30"
                  }`}
                >
                  {plan.highlight && (
                    <div className="bg-primary text-on-primary px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest self-center mb-6">
                      Paling Populer
                    </div>
                  )}
                  <div className="mb-10">
                    <span className="text-primary font-bold tracking-widest text-xs uppercase">{plan.tier}</span>
                    <h3 className="text-3xl font-bold mt-2">{plan.name}</h3>
                    <div className="mt-4 flex flex-col">
                      <span className="text-4xl font-extrabold">{plan.price}</span>
                      <span className="text-on-surface-variant text-sm mt-1">{plan.duration} • {plan.pages}</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-10 flex-grow">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-base">
                        <Check size={18} className="text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                    {plan.missing.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-base text-on-surface-variant/40">
                        <X size={18} className="opacity-30 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-4 rounded-lg font-bold transition-all ${
                      plan.highlight
                        ? "bg-primary text-on-primary hover:brightness-110"
                        : "border border-outline text-on-surface hover:bg-surface-container-highest"
                    }`}
                  >
                    Pilih Paket
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-16 text-center text-on-surface-variant text-sm space-y-2">
              {notes.map((note, i) => (
                <p key={i}>{note}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">{services.comparisonTitle}</h2>
              <p className="text-lg text-on-surface-variant">{services.comparisonSubtitle}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant text-left">
                    <th className="py-6 text-2xl font-bold w-1/4 text-on-surface">Fitur</th>
                    {plans.map(p => (
                      <th key={p.id} className="py-6 text-sm font-bold text-primary">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 text-sm">
                  <tr>
                    <td className="py-5 font-bold">Waktu Pengerjaan</td>
                    {plans.map(p => <td key={p.id} className="py-5">{p.duration}</td>)}
                  </tr>
                  <tr>
                    <td className="py-5 font-bold">Jumlah Halaman</td>
                    {plans.map(p => <td key={p.id} className="py-5">{p.pages}</td>)}
                  </tr>
                  <tr>
                    <td className="py-5 font-bold">Harga</td>
                    {plans.map(p => <td key={p.id} className="py-5 font-bold text-primary">{p.price}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-primary text-on-primary">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-5xl md:text-7xl font-extrabold mb-6">Siap untuk Go-Digital?</h2>
            <p className="text-xl md:text-2xl mb-12 opacity-80 leading-relaxed">
              Konsultasikan kebutuhan bisnis Anda secara gratis dan dapatkan penawaran terbaik.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-on-primary text-primary px-10 py-5 rounded-lg font-bold hover:shadow-xl transition-all">
                Konsultasi Sekarang
              </button>
              <button className="border border-on-primary/30 px-10 py-5 rounded-lg font-bold hover:bg-on-primary/10 transition-all">
                Lihat Portfolio
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
