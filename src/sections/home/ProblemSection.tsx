"use client";

import { useData } from "@/context/DataContext";
import { AlertCircle } from "lucide-react";

export default function ProblemSection() {
  const { data } = useData();
  const { problem } = data.home;

  return (
    <section className="py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-on-surface mb-4">
            {problem.title}
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto text-lg">
            {problem.subtitle}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {problem.items.map((item, i) => (
            <div key={item.id} className="bg-surface-container-lowest p-10 rounded-[2.5rem] shadow-premium border border-surface-container-highest flex gap-6 group hover:border-primary/20 transition-all">
              <div className="w-14 h-14 bg-error-container text-on-error-container rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <AlertCircle size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-on-surface mb-3 tracking-tight">{item.title}</h3>
                <p className="text-on-surface-variant leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
