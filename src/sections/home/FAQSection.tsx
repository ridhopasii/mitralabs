"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Berapa lama proses pembuatan satu website?",
    a: "Tergantung paket yang dipilih. Paket Basic biasanya selesai dalam 7-10 hari kerja, Standard 2-4 minggu, dan Premium disesuaikan dengan kompleksitas fitur.",
  },
  {
    q: "Apakah saya bisa update konten sendiri nanti?",
    a: "Tentu! Untuk paket Standard dan Premium, kami menyediakan CMS (Content Management System) yang user-friendly dan memberikan video panduan cara penggunaannya.",
  },
  {
    q: "Apakah ada biaya bulanan/tahunan?",
    a: "Hanya biaya perpanjangan Domain dan Hosting setiap tahunnya. Jika Anda mengambil paket maintenance, maka ada biaya langganan bulanan.",
  },
  {
    q: "Bagaimana dengan SEO? Apakah website saya akan muncul di Google?",
    a: "Ya, kami melakukan setup SEO On-Page standar di setiap website. Namun untuk mendominasi kata kunci kompetitif, kami menyarankan add-on SEO Optimization rutin.",
  },
  {
    q: "Apakah Mitralabs melayani klien di luar Medan?",
    a: "Tentu saja! Kami melayani klien dari seluruh Indonesia. Koordinasi bisa dilakukan secara online melalui WhatsApp, Zoom, atau Google Meet.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-[#faf8ff]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6">
            <HelpCircle size={14} />
            FAQ
          </div>
          <h2 className="font-manrope text-4xl font-extrabold text-[#131b2e] leading-tight mb-4">
            Pertanyaan yang <span className="text-gradient">Sering Diajukan</span>
          </h2>
          <p className="text-[#434656]">
            Temukan jawaban cepat untuk pertanyaan yang paling sering ditanyakan oleh klien kami.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl border transition-all duration-300 ${
                activeIndex === index ? "border-indigo-500 shadow-lg shadow-indigo-500/5" : "border-gray-100"
              }`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left"
              >
                <span className="font-manrope font-bold text-[#131b2e] pr-4">{faq.q}</span>
                <ChevronDown
                  size={20}
                  className={`text-indigo-500 transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index ? "max-h-48" : "max-h-0"
                }`}
              >
                <p className="px-8 pb-6 text-[#434656] text-sm leading-relaxed border-t border-gray-50 pt-4">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
