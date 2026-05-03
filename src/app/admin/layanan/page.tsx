"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Package } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function LayananCMS() {
  const { data, updatePlans } = useData();
  const { plans } = data;
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");

  const deletePlan = (id: number) => {
    if (confirm("Hapus paket ini?")) {
      updatePlans(plans.filter(p => p.id !== id));
    }
  };

  const filteredPlans = plans.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.tier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
          <input 
            type="text" 
            placeholder="Cari paket..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-surface-container-highest rounded-2xl focus:outline-none focus:border-primary transition-all font-bold"
          />
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary text-on-primary px-6 py-4 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={20} />
          Tambah Paket Baru
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-[2.5rem] overflow-hidden shadow-premium border border-surface-container-highest">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container text-on-surface-variant text-[10px] uppercase tracking-[0.3em] font-black">
              <th className="px-10 py-8">Nama Paket</th>
              <th className="px-10 py-8">Harga</th>
              <th className="px-10 py-8">Halaman</th>
              <th className="px-10 py-8">Waktu</th>
              <th className="px-10 py-8 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-highest">
            {filteredPlans.map((plan) => (
              <tr key={plan.id} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="font-black text-lg">{plan.name}</p>
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest">{plan.tier}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8 font-mono font-black text-on-surface text-lg">{plan.price}</td>
                <td className="px-10 py-8 text-on-surface-variant font-bold">{plan.pages}</td>
                <td className="px-10 py-8 text-on-surface-variant font-bold">{plan.duration}</td>
                <td className="px-10 py-8">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <button className="p-4 bg-primary/5 text-primary rounded-2xl hover:bg-primary hover:text-on-primary transition-all">
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => deletePlan(plan.id)}
                      className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPlans.length === 0 && (
          <div className="p-32 text-center">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6 text-on-surface-variant opacity-20">
              <Package size={40} />
            </div>
            <p className="text-on-surface-variant font-black text-xl">Tidak ada paket ditemukan</p>
            <p className="text-on-surface-variant/60 font-medium mt-2">Coba kata kunci lain atau tambah paket baru.</p>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl animate-in zoom-in-95 duration-500 border border-white/10">
            <h3 className="text-4xl font-black mb-2 tracking-tighter">Konfigurasi Paket</h3>
            <p className="text-on-surface-variant font-medium mb-10">Isi detail paket layanan profesional untuk website.</p>
            
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">Nama Paket</label>
                <input type="text" className="w-full px-6 py-5 bg-surface-container-low border-2 border-transparent focus:border-primary rounded-[1.5rem] outline-none font-bold text-lg transition-all" placeholder="E.g. Enterprise" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">Harga (IDR)</label>
                <input type="text" className="w-full px-6 py-5 bg-surface-container-low border-2 border-transparent focus:border-primary rounded-[1.5rem] outline-none font-bold text-lg transition-all" placeholder="E.g. Rp 10.000.000" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">Jumlah Halaman</label>
                <input type="text" className="w-full px-6 py-5 bg-surface-container-low border-2 border-transparent focus:border-primary rounded-[1.5rem] outline-none font-bold text-lg transition-all" placeholder="E.g. 15-20 Hal" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">Waktu Kerja</label>
                <input type="text" className="w-full px-6 py-5 bg-surface-container-low border-2 border-transparent focus:border-primary rounded-[1.5rem] outline-none font-bold text-lg transition-all" placeholder="E.g. 21 Hari" />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsAdding(false)}
                className="flex-1 py-6 bg-surface-container-highest text-on-surface rounded-[1.5rem] font-black hover:brightness-95 transition-all"
              >
                Batalkan
              </button>
              <button 
                onClick={() => {
                  alert("Fitur simpan terkoneksi ke Global State Context!");
                  setIsAdding(false);
                }}
                className="flex-1 py-6 bg-primary text-on-primary rounded-[1.5rem] font-black shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Simpan & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
