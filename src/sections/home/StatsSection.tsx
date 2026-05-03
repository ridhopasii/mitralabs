"use client";

import { useData } from "@/context/DataContext";

export default function StatsSection() {
  const { data } = useData();
  const { stats } = data.home;

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-inverse-surface rounded-[40px] p-12 md:p-20 text-inverse-on-surface relative overflow-hidden shadow-premium">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#1A5CFF,_transparent)]"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-center relative z-10">
            {stats.map((stat) => (
              <div key={stat.id}>
                <div className="text-6xl font-black mb-2 text-primary tracking-tighter leading-none">{stat.value}</div>
                <div className="text-surface-variant font-black uppercase tracking-[0.2em] opacity-80 text-[10px]">{stat.label}</div>
                <p className="text-[10px] opacity-40 mt-1 font-medium">{stat.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-20 border-t border-white/5 pt-12 text-center">
            <p className="text-surface-variant mb-8 text-[10px] opacity-40 uppercase tracking-[0.3em] font-black">
              Keunggulan Kompetitif Kami
            </p>
            <div className="flex flex-wrap justify-center gap-16 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-700 text-white font-black text-2xl tracking-tighter">
              <span>RELIABILITY</span>
              <span>SCALABILITY</span>
              <span>INNOVATION</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
