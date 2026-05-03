"use client";

import { useData } from "@/context/DataContext";
import { MessageCircle } from "lucide-react";

export default function CTASection() {
  const { data } = useData();
  const { cta } = data.home;
  const { settings } = data;

  const waUrl = `https://wa.me/${settings.waNumber}?text=${encodeURIComponent("Halo Mitralabs! Saya ingin konsultasi gratis untuk website bisnis saya.")}`;

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 text-center text-on-primary shadow-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-on-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-on-primary/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="relative z-10">
          <h2 className="font-display text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
            {cta.title}
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-80 max-w-2xl mx-auto font-medium leading-relaxed">
            {cta.subtitle}
          </p>
          <div className="flex flex-col items-center gap-6">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-on-primary text-primary px-12 py-6 rounded-2xl font-black text-xl shadow-2xl hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center gap-4"
            >
              <MessageCircle size={28} />
              {cta.buttonText}
            </a>
            <p className="text-sm font-bold opacity-60 tracking-widest uppercase">
              {cta.promoText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
