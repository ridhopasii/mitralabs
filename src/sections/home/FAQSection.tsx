"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQSection() {
  const { data } = useData();
  const faqs = data.faqs || [];
  const [openId, setOpenId] = useState<number | null>(null);

  // Group faqs by category
  const categories = [...new Set(faqs.map(f => f.category))];

  if (faqs.length === 0) return null;

  return (
    <section className="py-32 bg-surface-container-low">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-8">
            <HelpCircle size={14} />
            {data.home.faqLabels?.badge || "FAQ"}
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-black text-on-surface tracking-tighter mb-6">
            {data.home.faqLabels?.title || "Pertanyaan yang Sering Ditanyakan"}
          </h2>
          <p className="text-on-surface-variant font-medium text-lg max-w-2xl mx-auto leading-relaxed">
            {data.home.faqLabels?.subtitle || "Semua yang perlu Anda ketahui sebelum memulai project bersama kami."}
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="bg-white rounded-[2rem] border border-surface-container-highest shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full text-left p-8 flex items-center justify-between gap-6 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shrink-0 text-xs font-black">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60 block mb-1">{faq.category}</span>
                    <h3 className="font-bold text-on-surface text-lg leading-tight">{faq.question}</h3>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0 w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center"
                >
                  <ChevronDown size={20} className="text-on-surface-variant" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 pt-0 border-t border-surface-container-highest">
                      <p className="text-on-surface-variant leading-relaxed font-medium text-base pt-6">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-white p-10 rounded-[3rem] border border-surface-container-highest shadow-sm">
          <h3 className="text-2xl font-black mb-4">
            {data.home.faqLabels?.ctaTitle || "Masih punya pertanyaan lain?"}
          </h3>
          <p className="text-on-surface-variant font-medium mb-8">
            {data.home.faqLabels?.ctaSubtitle || "Tim kami siap membantu Anda menemukan solusi terbaik."}
          </p>
          <a
            href="/kontak"
            className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-on-primary rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            {data.home.faqLabels?.ctaButton || "Hubungi Kami"}
          </a>
        </div>
      </div>
    </section>
  );
}
