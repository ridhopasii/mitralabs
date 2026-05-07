"use client";

import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";

export default function ProblemSection() {
  const { data } = useData();
  const { problem } = data.home;

  return (
    <section className="py-40 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-semibold text-on-background mb-8 tracking-tight">
            {problem.title}
          </h2>
          <p className="text-xl text-secondary max-w-2xl mx-auto font-medium">
            {problem.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {problem.items.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-semibold text-on-background tracking-tight">
                {item.title}
              </h3>
              <p className="text-lg text-secondary leading-relaxed font-medium">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
