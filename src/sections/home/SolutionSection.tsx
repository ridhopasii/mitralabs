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
    <section className="py-32 bg-background" id="services">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-semibold text-on-background mb-6 tracking-tight">
            {solution.title}
          </h2>
          <p className="text-xl text-secondary max-w-2xl mx-auto font-medium">
            {solution.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.01 }}
              className="group relative h-[600px] rounded-[3rem] overflow-hidden bg-surface-container"
            >
              {/* Image Layer */}
              <div className="absolute inset-0">
                <Image
                  src={item.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
              </div>

              {/* Content Layer */}
              <div className="absolute inset-0 p-12 flex flex-col justify-between text-white">
                <div>
                   {item.tag && (
                     <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/30">
                       {item.tag}
                     </span>
                   )}
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-semibold mb-4 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-lg text-white/80 max-w-sm font-medium leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {item.desc}
                  </p>
                  <button className="flex items-center gap-2 font-semibold text-white group-hover:underline">
                    Pelajari lebih lanjut <span>&rarr;</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
