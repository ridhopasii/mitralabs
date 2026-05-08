"use client";

import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";

export default function StatsSection() {
  const { data } = useData();
  const { stats } = data.home;

  return (
    <section className="py-24 md:py-40 bg-background border-y border-outline/5">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-20">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-7xl font-semibold text-on-background mb-2 md:mb-3 tracking-tighter leading-none">
                {stat.value}
              </div>
              <div className="text-[9px] md:text-xs font-bold text-secondary uppercase tracking-[0.2em]">
                {stat.label}
              </div>
              <p className="text-[8px] md:text-[10px] text-secondary/60 mt-2 font-medium max-w-[100px] md:max-w-[120px] mx-auto leading-relaxed">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
