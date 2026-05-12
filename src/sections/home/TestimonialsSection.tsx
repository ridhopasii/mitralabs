"use client";

import { Star, Quote } from "lucide-react";
import { useData } from "@/context/DataContext";
import Image from "next/image";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const { data } = useData();
  const testimonials = (data.testimonials || []).filter((t: any) => t.is_published);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber-50 text-amber-600 text-xs font-black uppercase tracking-widest mb-8">
              <Star size={14} fill="currentColor" />
              Testimoni Klien
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-black text-on-surface leading-tight tracking-tighter">
              Apa Kata Mereka<br />
              <span className="text-primary">Tentang Mitralabs?</span>
            </h2>
          </div>
          <p className="text-on-surface-variant max-w-xs font-medium leading-relaxed">
            Kepercayaan klien adalah fondasi bisnis kami. Setiap cerita adalah bukti nyata.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-surface-container-low rounded-[3rem] p-10 border border-surface-container-highest relative group hover:shadow-premium hover:-translate-y-1 transition-all duration-500"
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 text-primary/10 group-hover:text-primary/20 transition-colors">
                <Quote size={48} fill="currentColor" />
              </div>

              {/* Stars */}
              <div className="flex gap-1.5 mb-8">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} size={16} className="text-amber-500 fill-amber-500" />
                ))}
              </div>

              {/* Content */}
              <p className="text-on-surface-variant leading-relaxed mb-10 font-medium relative z-10 text-base italic">
                &quot;{t.content}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-8 border-t border-surface-container-highest">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-surface-container-highest shrink-0">
                  <Image
                    src={t.image || `https://i.pravatar.cc/150?u=${t.name}`}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-black text-on-surface">{t.name}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-70">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-4 bg-surface-container-low px-10 py-5 rounded-2xl border border-surface-container-highest">
            <div className="flex -space-x-3">
              {testimonials.slice(0, 3).map((t, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative">
                  <Image
                    src={t.image || `https://i.pravatar.cc/150?u=${t.name}`}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-0.5 text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className="text-sm font-black text-on-surface">
              <span className="text-primary">{testimonials.length}+</span> Klien Puas
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
