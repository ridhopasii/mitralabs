"use client";

import { Star, MessageCircle, ArrowRight } from "lucide-react";
import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const { data } = useData();
  const { brand } = data;
  const testimonials = (data.testimonials || []).filter(
    (t: any) => t.is_published && t.name !== "Kamu Berikutnya?"
  );

  const waUrl = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Halo Mitralabs! Saya tertarik untuk menjadi klien Mitralabs.")}`;

  // Jika belum ada testimoni nyata, tampilkan placeholder jujur
  if (testimonials.length === 0) {
    return (
      <section className="py-24 md:py-40 bg-surface-container/30 px-6">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em] mb-6 block">
              Testimoni Klien
            </span>
            <h2 className="text-5xl md:text-7xl font-semibold tracking-tight text-on-surface mb-10 reveal-text">
              Kamu Bisa Jadi yang Pertama
            </h2>
            <p className="text-xl md:text-2xl text-secondary font-medium leading-relaxed mb-16">
              Sementara kami kumpulkan testimoni nyata dari klien kami, kamu punya kesempatan jadi cerita sukses pertama yang kami ceritakan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-apple flex items-center gap-3 text-lg px-12 py-5"
              >
                <MessageCircle size={20} />
                Chat Kami Sekarang
              </a>
              <a
                href="/layanan"
                className="btn-apple-secondary border border-outline/20 flex items-center gap-3 text-lg px-12 py-5"
              >
                Lihat Paket <ArrowRight size={18} />
              </a>
            </div>

            <div className="mt-16 flex items-center justify-center gap-3 text-secondary/50">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-amber-300 fill-amber-300" />
                ))}
              </div>
              <span className="text-sm font-bold uppercase tracking-widest">
                Berikan Ulasan Setelah Project Selesai
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Jika sudah ada testimoni nyata
  return (
    <section className="py-24 md:py-40 bg-surface-container/30 px-6">
      <div className="section-container">
        <div className="text-center mb-20">
          <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em] mb-6 block">
            Testimoni Klien
          </span>
          <h2 className="text-5xl md:text-7xl font-semibold tracking-tight text-on-surface mb-8 reveal-text">
            Apa Kata Mereka?
          </h2>
          <p className="text-xl text-secondary font-medium max-w-2xl mx-auto">
            Kepercayaan klien adalah bukti terbaik dari kualitas kami.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t: any, i: number) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-background rounded-[3rem] p-10 border border-outline/10 shadow-apple"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating || 5)].map((_, idx) => (
                  <Star key={idx} size={16} className="text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-on-surface font-medium leading-relaxed mb-8 italic">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="pt-6 border-t border-outline/10">
                <h4 className="font-bold text-on-surface">{t.name}</h4>
                <p className="text-sm text-primary font-semibold mt-1">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
