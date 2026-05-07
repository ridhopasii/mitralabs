"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { 
  Save, 
  Package, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Loader2,
  Info,
  ChevronRight,
  Zap,
  ArrowUpRight,
  Search,
  Edit3,
  X,
  Target,
  Layers,
  Clock,
  Layout,
  Filter
} from "lucide-react";

interface Plan {
  id: number;
  name: string;
  price: string;
  tier: string;
  pages: string;
  duration: string;
  features: string[];
  missing: string[];
  highlight: boolean;
}

export default function ServicesCMS() {
  const { data, updateData } = useData();
  const [plans, setPlans] = useState<Plan[]>(data.services.plans);
  const [search, setSearch] = useState("");
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setPlans(data.services.plans);
  }, [data.services.plans]);

  const handleSavePlan = () => {
    if (!editingPlan) return;
    setIsSaving(true);
    
    const newPlans = plans.some(p => p.id === editingPlan.id)
      ? plans.map(p => p.id === editingPlan.id ? editingPlan : p)
      : [...plans, { ...editingPlan, id: Date.now() }];

    const newData = { ...data };
    newData.services.plans = newPlans;

    setTimeout(() => {
      updateData(newData);
      setPlans(newPlans);
      setIsSaving(false);
      setShowSuccess(true);
      setEditingPlan(null);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Hapus paket layanan ini?")) return;
    const newPlans = plans.filter(p => p.id !== id);
    const newData = { ...data };
    newData.services.plans = newPlans;
    updateData(newData);
    setPlans(newPlans);
  };

  const filteredPlans = plans.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.tier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {showSuccess && (
        <div className="fixed top-10 right-10 z-[200] bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-500 font-bold">
          <CheckCircle2 size={24} />
          Layanan Berhasil Diperbarui!
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-slate-900">Revenue Models</h2>
          <p className="text-slate-500 font-medium mt-2 text-lg">Kelola paket harga, fitur, dan penawaran layanan digital Anda.</p>
        </div>
        <button 
          onClick={() => setEditingPlan({
            id: 0,
            name: "Paket Baru",
            price: "Rp 0",
            tier: "Basic",
            pages: "1 Halaman",
            duration: "3 Hari",
            features: [],
            missing: [],
            highlight: false
          })}
          className="bg-primary text-on-primary px-10 py-5 rounded-[2rem] font-black flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30"
        >
          <Plus size={24} /> Tambah Paket
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari paket atau tier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:border-primary hover:text-primary transition-all">
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-10 py-6">Service Package</th>
                <th className="px-6 py-6">Tier</th>
                <th className="px-6 py-6 text-center">Price</th>
                <th className="px-6 py-6">Features</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className={`group hover:bg-slate-50/50 transition-all ${plan.highlight ? "bg-primary/[0.02]" : ""}`}>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${plan.highlight ? "bg-primary text-on-primary" : "bg-slate-100 text-slate-400"}`}>
                        <Package size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-black text-slate-900 group-hover:text-primary transition-colors">{plan.name}</h5>
                          {plan.highlight && <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[8px] font-black uppercase rounded-md">Popular</span>}
                        </div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{plan.duration} • {plan.pages}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                     <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                       {plan.tier}
                     </span>
                  </td>
                  <td className="px-6 py-6 text-center font-black text-slate-900">
                    {plan.price}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span className="text-xs font-bold text-slate-500">{plan.features.length} Features</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => setEditingPlan(plan)}
                        className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:border-primary hover:text-primary shadow-sm"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(plan.id)}
                        className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white shadow-sm"
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
            <div className="p-20 text-center space-y-4 text-slate-400">
              <Search size={48} className="mx-auto opacity-20" />
              <p className="font-bold">Tidak ada paket yang ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
            {/* Modal Header */}
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-primary text-on-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40">
                    <Zap size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                      {editingPlan.id === 0 ? "New Revenue Plan" : "Edit Plan Details"}
                    </h3>
                    <p className="text-xs text-slate-400 font-black tracking-[0.2em] uppercase mt-1">Struktur penawaran harga dan nilai bisnis</p>
                  </div>
               </div>
               <button onClick={() => setEditingPlan(null)} className="p-5 bg-slate-100 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                  <X size={24} />
               </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
               <div className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Package Name</label>
                           <input 
                              type="text" 
                              value={editingPlan.name}
                              onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                              className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-black text-xl focus:border-primary transition-all shadow-sm"
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Price Label</label>
                              <input 
                                 type="text" 
                                 value={editingPlan.price}
                                 onChange={(e) => setEditingPlan({...editingPlan, price: e.target.value})}
                                 className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-primary transition-all shadow-sm"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Tier Level</label>
                              <input 
                                 type="text" 
                                 value={editingPlan.tier}
                                 onChange={(e) => setEditingPlan({...editingPlan, tier: e.target.value})}
                                 className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-primary transition-all shadow-sm"
                              />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 text-center block">Pages Info</label>
                              <div className="relative">
                                 <Layout className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                 <input 
                                    type="text" 
                                    value={editingPlan.pages}
                                    onChange={(e) => setEditingPlan({...editingPlan, pages: e.target.value})}
                                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-primary transition-all"
                                 />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center block">Duration</label>
                              <div className="relative">
                                 <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                 <input 
                                    type="text" 
                                    value={editingPlan.duration}
                                    onChange={(e) => setEditingPlan({...editingPlan, duration: e.target.value})}
                                    className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-primary transition-all"
                                 />
                              </div>
                           </div>
                        </div>
                        <div className="pt-6">
                           <button 
                             onClick={() => setEditingPlan({...editingPlan, highlight: !editingPlan.highlight})}
                             className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                               editingPlan.highlight ? "bg-amber-100 text-amber-600 border border-amber-200" : "bg-slate-50 text-slate-400 border border-slate-100"
                             }`}
                           >
                             {editingPlan.highlight ? <Target size={18} /> : <Layers size={18} />}
                             {editingPlan.highlight ? "Highlighted as Popular" : "Set as Popular"}
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Included Features (One per line)</label>
                        <textarea 
                           value={editingPlan.features.join("\n")}
                           onChange={(e) => setEditingPlan({...editingPlan, features: e.target.value.split("\n")})}
                           placeholder="Mobile Responsive&#10;WhatsApp Buttons&#10;SEO Optimized"
                           className="w-full px-8 py-6 bg-white border border-slate-200 rounded-[2rem] outline-none font-medium text-lg focus:border-primary h-48 transition-all shadow-sm resize-none custom-scrollbar"
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Missing / Premium Features (One per line)</label>
                        <textarea 
                           value={editingPlan.missing.join("\n")}
                           onChange={(e) => setEditingPlan({...editingPlan, missing: e.target.value.split("\n")})}
                           placeholder="Full Custom Design&#10;Free Domain & Hosting"
                           className="w-full px-8 py-6 bg-white border border-slate-200 rounded-[2rem] outline-none font-medium text-lg focus:border-primary h-32 transition-all shadow-sm resize-none custom-scrollbar opacity-60"
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-6">
               <button 
                 onClick={() => setEditingPlan(null)}
                 className="px-12 py-5 bg-white border border-slate-200 text-slate-600 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all shadow-sm"
               >
                 Batal
               </button>
               <button 
                 onClick={handleSavePlan}
                 disabled={isSaving}
                 className="px-16 py-5 bg-primary text-on-primary rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 disabled:opacity-50"
               >
                 {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                 {isSaving ? "Menyimpan..." : "Simpan Paket"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
