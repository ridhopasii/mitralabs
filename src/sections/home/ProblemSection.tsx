"use client";

import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";

export default function ProblemSection() {
  const { data } = useData();
  const { problem } = data.home;

  return (
    <section className="py-24 md:py-40 bg-white dark:bg-black">
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20 md:mb-32">
            <h2 className="text-4xl md:text-7xl font-semibold text-on-background mb-6 md:mb-10 tracking-tight reveal-text">
              {problem.title}
            </h2>
            <p className="text-lg md:text-2xl text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
              {problem.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 md:gap-y-16">
            {problem.items.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="space-y-3 md:space-y-4"
              >
                <h3 className="text-xl md:text-2xl font-semibold text-on-background tracking-tight">
                  {item.title}
                </h3>
                <p className="text-base md:text-lg text-secondary leading-relaxed font-medium">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
