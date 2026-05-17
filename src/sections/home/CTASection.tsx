"use client";

import { useData } from "@/context/DataContext";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  const { data } = useData();
  const { cta } = data.home;
  const { brand } = data;

  return (
    <section className="py-24 md:py-40 px-4 md:px-6">
      <div className="max-w-6xl mx-auto bg-surface-container rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-32 text-center shadow-apple relative overflow-hidden border border-outline/5">
        <div className="relative z-10">
          <h2 className="text-4xl md:text-8xl font-semibold mb-6 md:mb-10 leading-[1.1] tracking-tight text-on-background text-balance reveal-text">
            {cta.title}
          </h2>
          <p className="text-lg md:text-2xl mb-10 md:mb-14 text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
            {cta.subtitle}
          </p>
          <div className="flex flex-col items-center gap-6 md:gap-8">
            <a
              href={`https://wa.me/${brand.whatsapp || "6282381118520"}?text=${encodeURIComponent("Halo Mitralabs! Saya tertarik untuk konsultasi gratis.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-apple w-full sm:w-auto text-lg md:text-xl px-12 py-4 md:py-5"
            >
              {cta.buttonText}
            </a>
            <p className="text-[8px] md:text-[10px] font-bold text-secondary tracking-[0.2em] uppercase">
              {cta.promoText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
