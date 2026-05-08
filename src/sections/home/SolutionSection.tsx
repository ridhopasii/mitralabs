"use client";

import { useData } from "@/context/DataContext";
import Image from "next/image";
import { motion } from "framer-motion";

export default function SolutionSection() {
  const { data } = useData();
  const { solution } = data.home;
  const { cards } = solution;

  const solutions = [
    { ...cards.umkm, icon: "Store" },
    { ...cards.travel, icon: "Plane" },
    { ...cards.school, icon: "School" },
    { ...cards.business, icon: "Building" }
  ];

  return (
    <section className="py-24 md:py-40 bg-background" id="services">
      <div className="section-container">
        <div className="text-center mb-20 md:mb-32">
          <h2 className="text-4xl md:text-7xl font-semibold text-on-background mb-6 md:mb-8 tracking-tight reveal-text">
            {solution.title}
          </h2>
          <p className="text-lg md:text-2xl text-secondary max-w-2xl mx-auto font-medium">
            {solution.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {solutions.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.01 }}
              className="group relative h-[500px] md:h-[750px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-surface-container shadow-apple hover:shadow-apple-hover transition-all duration-700"
            >
              {/* Image Layer */}
              <div className="absolute inset-0">
                <Image
                  src={item.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-2000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/80"></div>
              </div>

              {/* Content Layer */}
              <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                   {item.tag && (
                     <span className="bg-white/10 backdrop-blur-2xl px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em] border border-white/20">
                       {item.tag}
                     </span>
                   )}
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-all duration-500 translate-y-4 md:group-hover:translate-y-0">
                      <span className="text-xl md:text-2xl">&rarr;</span>
                   </div>
                </div>
                <div>
                  <h3 className="text-3xl md:text-5xl font-semibold mb-4 md:mb-6 tracking-tight leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-lg md:text-xl text-white/70 max-w-md font-medium leading-relaxed mb-6 md:mb-8 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-700">
                    {item.desc}
                  </p>
                  <div className="h-px w-0 md:group-hover:w-full bg-white/30 transition-all duration-1000"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
