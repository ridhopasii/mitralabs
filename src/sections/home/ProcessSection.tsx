"use client";

import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";

export default function ProcessSection() {
  const { data } = useData();
  const { process } = data.home;

  return (
    <section className="py-40 bg-surface-container-lowest overflow-hidden">
      <div className="section-container">
        <div className="text-center mb-32">
          <h2 className="text-5xl md:text-7xl font-semibold text-on-surface mb-10 tracking-tight reveal-text">
            {process.title}
          </h2>
          <p className="text-secondary max-w-2xl mx-auto text-xl font-medium leading-relaxed">
            {process.subtitle}
          </p>
        </div>
        <div className="relative flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8">
          {/* Steps */}
          {process.steps.map((step, i) => (
            <motion.div 
              key={step.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="relative z-10 flex-1 text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-10 text-xl font-bold text-on-surface transition-all duration-500 group-hover:scale-110 group-hover:bg-on-background group-hover:text-background border border-outline/5 shadow-apple">
                {i + 1}
              </div>
              <h3 className="text-2xl font-semibold text-on-surface mb-6 tracking-tight">{step.title}</h3>
              <p className="text-secondary text-lg leading-relaxed font-medium">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
