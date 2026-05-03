"use client";

import { useData } from "@/context/DataContext";

export default function ProcessSection() {
  const { data } = useData();
  const { process } = data.home;

  return (
    <section className="py-24 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="font-display text-4xl md:text-5xl font-black text-on-surface mb-6 tracking-tight">
            {process.title}
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            {process.subtitle}
          </p>
        </div>
        <div className="relative flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Connector Line */}
          <div className="absolute top-10 left-0 w-full h-1 bg-surface-container-high -z-0 hidden md:block rounded-full"></div>

          {/* Steps */}
          {process.steps.map((step, i) => (
            <div key={step.id} className="relative z-10 flex-1 text-center group">
              <div className="w-20 h-20 bg-surface-container-lowest border-4 border-surface-container-high rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-premium text-3xl font-black text-primary group-hover:bg-primary group-hover:text-on-primary group-hover:rotate-6 transition-all duration-500">
                {i + 1}
              </div>
              <h3 className="text-2xl font-black text-on-surface mb-4 tracking-tight">{step.title}</h3>
              <p className="text-on-surface-variant text-base px-2 leading-relaxed font-medium">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
