"use client";

import { useState, useMemo } from "react";
import { Calculator, Check, MessageCircle } from "lucide-react";
import { useData } from "@/context/DataContext";

const options = [
  { id: "pages", label: "Jumlah Halaman", type: "range", min: 1, max: 20, unit: "Hal", basePrice: 1500000 },
  { id: "cms", label: "Blog / Admin Panel", type: "checkbox", price: 1000000 },
  { id: "seo", label: "SEO Setup (Lengkap)", type: "checkbox", price: 500000 },
  { id: "domain", label: "Domain .com (1 Tahun)", type: "checkbox", price: 200000 },
  { id: "hosting", label: "Cloud Hosting (1 Tahun)", type: "checkbox", price: 300000 },
  { id: "booking", label: "Sistem Booking / Reservasi", type: "checkbox", price: 2000000 },
];

export default function CalculatorSection() {
  const { data } = useData();
  const { settings } = data;
  const [selections, setSelections] = useState<any>({
    pages: 1,
    cms: false,
    seo: false,
    domain: false,
    hosting: false,
    booking: false,
  });

  const totalPrice = useMemo(() => {
    let total = 1500000; // Base price for 1st page
    if (selections.pages > 1) {
      total += (selections.pages - 1) * 500000; // Extra pages
    }
    if (selections.cms) total += 1000000;
    if (selections.seo) total += 500000;
    if (selections.domain) total += 200000;
    if (selections.hosting) total += 300000;
    if (selections.booking) total += 2000000;
    return total;
  }, [selections]);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const toggleCheckbox = (id: string) => {
    setSelections((prev: any) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelections((prev: any) => ({ ...prev, pages: parseInt(e.target.value) }));
  };

  const WA_NUMBER = settings.waNumber;
  const WA_MESSAGE = `Halo Mitralabs! Saya sudah menghitung estimasi di website untuk:
- ${selections.pages} Halaman
- Admin Panel: ${selections.cms ? 'Ya' : 'Tidak'}
- SEO Setup: ${selections.seo ? 'Ya' : 'Tidak'}
- Domain .com: ${selections.domain ? 'Ya' : 'Tidak'}
- Hosting: ${selections.hosting ? 'Ya' : 'Tidak'}
- Sistem Booking: ${selections.booking ? 'Ya' : 'Tidak'}
Total Estimasi: ${formatCurrency(totalPrice)}
Saya ingin diskusi lebih lanjut.`;
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

  return (
    <section id="kalkulator" className="py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-inverse-surface rounded-[2rem] p-8 md:p-16 relative overflow-hidden shadow-premium">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_top_right,_#1A5CFF,_transparent)]"></div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Input */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-primary-fixed-dim text-sm font-bold mb-6">
                <Calculator size={14} />
                Kalkulator Harga
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-inverse-on-surface mb-8">
                Hitung Investasi <br/><span className="text-primary-fixed-dim">Digital Anda</span>
              </h2>
              <p className="text-surface-variant/70 mb-12 text-lg">
                Dapatkan transparansi harga instan. Pilih fitur sesuai kebutuhan bisnis Anda dan lihat estimasi pengerjaan secara real-time.
              </p>

              <div className="space-y-10">
                {/* Range Input */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-inverse-on-surface">
                    <span className="font-bold text-lg">{options[0].label}</span>
                    <span className="px-4 py-2 bg-primary-container text-on-primary-container rounded-xl font-extrabold text-xl">
                      {selections.pages} Hal
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={selections.pages}
                    onChange={handleRange}
                    className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-fixed-dim"
                  />
                  <div className="flex justify-between text-xs text-surface-variant/40 font-bold uppercase tracking-widest">
                    <span>1 Halaman</span>
                    <span>20 Halaman</span>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {options.slice(1).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => toggleCheckbox(opt.id)}
                      className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 text-left ${
                        selections[opt.id]
                          ? "bg-primary text-on-primary border-primary shadow-lg"
                          : "bg-white/5 border-white/10 text-surface-variant/60 hover:border-white/20"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                        selections[opt.id] ? "bg-white border-white" : "bg-transparent border-white/20"
                      }`}>
                        {selections[opt.id] && <Check size={14} className="text-primary" />}
                      </div>
                      <span className="text-sm font-bold">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Summary Card */}
            <div className="bg-surface-container-lowest rounded-[2rem] p-10 shadow-2xl border border-surface-container-highest">
              <h3 className="font-display text-2xl font-bold text-on-surface mb-8">
                Rincian Estimasi
              </h3>

              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-on-surface-variant">
                  <span className="font-medium">Pengerjaan Website ({selections.pages} Hal)</span>
                  <span className="font-bold text-on-surface">
                    {formatCurrency(1500000 + (selections.pages > 1 ? (selections.pages - 1) * 500000 : 0))}
                  </span>
                </div>
                {options.slice(1).map((opt) => (
                  selections[opt.id] && (
                    <div key={opt.id} className="flex justify-between text-on-surface-variant animate-in fade-in slide-in-from-bottom-2">
                      <span className="font-medium">{opt.label}</span>
                      <span className="font-bold text-on-surface">{formatCurrency(opt.price!)}</span>
                    </div>
                  )
                ))}
              </div>

              <div className="pt-8 border-t border-surface-container-highest mb-10">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Total Estimasi</p>
                    <span className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tighter">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-5 bg-primary text-on-primary rounded-2xl font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                >
                  <MessageCircle size={24} />
                  Klaim Harga Ini Sekarang
                </a>
                <p className="text-[11px] text-center text-on-surface-variant opacity-60 leading-relaxed">
                  *Estimasi di atas belum termasuk biaya langganan tahunan untuk domain/hosting (jika tidak dipilih). Harga final akan disepakati dalam Proposal Resmi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
