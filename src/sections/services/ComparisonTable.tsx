"use client";

import { Check, Minus } from "lucide-react";
import { useData } from "@/context/DataContext";

const featureMatrix = [
  { name: "Harga",            keys: ["price"] },
  { name: "Timeline",         keys: ["duration"] },
  { name: "Halaman",          keys: ["pages"] },
  { name: "Mobile Responsive", val: [true, true, true] },
  { name: "Tombol WhatsApp",  val: [true, true, true] },
  { name: "Form Kontak",      val: [false, true, true] },
  { name: "Google Maps",      val: [false, true, true] },
  { name: "Galeri Foto",      val: [false, true, true] },
  { name: "SEO Setup",        val: [false, "Basic", "Advanced"] },
  { name: "Dashboard Admin",  val: [false, true, true] },
  { name: "Sistem Booking",   val: [false, false, true] },
  { name: "Custom API Integrasi", val: [false, false, true] },
  { name: "Blog / Artikel",   val: [false, false, true] },
  { name: "Animasi Modern",   val: [false, false, true] },
  { name: "Domain .com/.id",  val: [false, "Gratis (1 Thn)", "Gratis (1 Thn)"] },
  { name: "Hosting",          val: [false, "Gratis (1 Thn)", "Gratis (1 Thn)"] },
  { name: "Revisi",           val: ["2x", "2x", "2x"] },
  { name: "Prioritas Support 24/7", val: [false, false, true] },
  { name: "Garansi Bug",      val: ["7 Hari", "7 Hari", "7 Hari"] },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value
      ? <Check className="mx-auto text-emerald-500" size={22} />
      : <Minus className="mx-auto text-surface-container-highest" size={22} />;
  }
  return <span className="font-bold">{value}</span>;
}

export default function ComparisonTable() {
  const { data } = useData();
  const { plans, comparisonTitle, comparisonSubtitle } = data.services;

  // Build rows from static matrix + dynamic plan data
  const rows = featureMatrix.map(f => {
    if (f.keys) {
      const key = f.keys[0] as keyof typeof plans[0];
      return { name: f.name, vals: plans.map(p => p[key] as string) };
    }
    return { name: f.name, vals: f.val! };
  });

  return (
    <section className="py-24 md:py-40 bg-surface-container/30 px-6">
      <div className="section-container">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
            {data.services.labels?.comparisonTagline || "Perbandingan Detail"}
          </span>
          <h2 className="text-5xl md:text-7xl font-semibold text-on-surface tracking-tight mb-8">
            {comparisonTitle}
          </h2>
          <p className="text-xl md:text-2xl text-secondary font-medium max-w-2xl mx-auto">{comparisonSubtitle}</p>
        </div>

        <div className="overflow-x-auto no-scrollbar rounded-[3.5rem] border border-outline/10 shadow-apple bg-background">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-container-highest">
                <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40 w-[35%]">Fitur</th>
                {plans.map((p, i) => (
                  <th
                    key={p.id}
                    className={`p-8 text-center ${p.highlight ? 'text-primary bg-primary/5' : 'text-on-surface'}`}
                  >
                    <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">{p.tier}</p>
                    <p className="text-2xl font-black tracking-tight">{p.name}</p>
                    <p className="text-xs font-black text-primary mt-1">{p.price}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest/50">
              {rows.map((row) => (
                <tr key={row.name} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="p-8 font-bold text-on-surface">{row.name}</td>
                  {row.vals.map((val, i) => (
                    <td
                      key={i}
                      className={`p-8 text-center text-on-surface-variant ${plans[i]?.highlight ? 'bg-primary/5' : ''}`}
                    >
                      <Cell value={val as boolean | string} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
