import React from 'react';
import { Check, Phone, Instagram, Star } from 'lucide-react';

const RateCardDoc = ({ data }: { data: any }) => {
  const packages = [
    {
      name: "PAKET BASIC",
      price: "1.500.000",
      time: "3 hari kerja",
      pages: "1 halaman",
      features: ["Landing page profesional", "Mobile responsive", "Tombol WhatsApp", "2x revisi", "Garansi bug 7 hari"],
      usage: "Cocok untuk: Usaha baru yang butuh online presence cepat"
    },
    {
      name: "PAKET STANDARD",
      price: "3.500.000",
      time: "7 hari kerja",
      pages: "3–5 halaman",
      features: ["Semi-custom design", "Form kontak", "Google Maps", "Galeri foto", "SEO dasar", "2x revisi", "Garansi bug 7 hari"],
      usage: "Cocok untuk: UMKM, toko, sekolah yang ingin tampil lengkap",
      popular: true
    },
    {
      name: "PAKET PREMIUM",
      price: "7.000.000",
      time: "14 hari kerja",
      pages: "7–10 halaman",
      features: ["Full custom design", "Blog / artikel", "Sistem booking", "Animasi interaktif", "Domain .com (1 thn)", "Hosting (1 thn)", "1 bulan support gratis", "2x revisi", "Garansi bug 7 hari"],
      usage: "Cocok untuk: Bisnis travel, sekolah besar, usaha yang ingin tampil premium"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 px-4 font-sans text-[#1D1D1F] flex justify-center">
      <div className="w-full max-w-[850px] bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden print:shadow-none">
        
        {/* Header */}
        <div className="p-10 md:p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white text-3xl font-black italic">M</div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">MITRALABS.ID</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em] mt-1">RATE CARD 2026</p>
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 text-right space-y-1 tracking-widest uppercase">
            <p>Jasa Pembuatan Website</p>
            <p>{data?.settings?.waNumber}</p>
          </div>
        </div>

        <div className="p-10 md:p-16 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-black tracking-tighter uppercase italic text-slate-900">Investasi Digital</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em]">Solusi Tepat Untuk Bisnis Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <div key={i} className={`relative p-8 rounded-[32px] border transition-all ${pkg.popular ? 'border-blue-600 bg-blue-50/10 ring-4 ring-blue-50' : 'border-slate-100 bg-white shadow-sm'}`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black uppercase px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                    <Star size={12} fill="white"/> Recommended
                  </div>
                )}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pkg.name}</p>
                  <div className="space-y-1">
                    <p className="text-3xl font-black text-slate-900 italic tracking-tighter">Rp {pkg.price}</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{pkg.time} • {pkg.pages}</p>
                  </div>
                  <div className="h-[1px] bg-slate-100 w-full" />
                  <ul className="space-y-3 min-h-[320px]">
                    {pkg.features.map((f, j) => (
                      <li key={j} className="flex gap-2 text-[11px] font-semibold text-slate-600 leading-tight">
                        <Check size={14} className="text-blue-600 shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-medium italic text-slate-400 leading-relaxed leading-tight">{pkg.usage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes Area */}
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 italic">
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-4">Ketentuan & Catatan</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] font-bold text-slate-500">
              <li className="flex gap-2 leading-none"><span>*</span> Harga belum termasuk domain & hosting kecuali Paket Premium.</li>
              <li className="flex gap-2 leading-none"><span>*</span> Perbaikan bug setelah garansi: Rp 100.000 per sesi.</li>
              <li className="flex gap-2 leading-none"><span>*</span> DP 30% sebelum mulai, pelunasan 70% sebelum serah terima.</li>
              <li className="flex gap-2 text-blue-600 leading-none underline underline-offset-2 italic uppercase tracking-widest">Siap mulai? Hubungi kami sekarang 🚀</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#1D1D1F] p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#1D1D1F] font-black text-sm italic">M</div>
            <span className="text-white font-black text-[11px] tracking-tighter uppercase italic">MITRALABS.ID</span>
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400 italic">
            <span className="flex items-center gap-2"><Phone size={12}/> {data?.contact?.phone}</span>
            <span className="flex items-center gap-2"><Instagram size={12}/> {data?.contact?.instagram}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateCardDoc;
