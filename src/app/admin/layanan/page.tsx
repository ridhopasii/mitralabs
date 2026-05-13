"use client";

import { useState, useEffect } from "react";
import { useData, Plan } from "@/context/DataContext";
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
  Filter,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="space-y-10 pb-20">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-10 right-10 z-[200] bg-on-background text-background px-8 py-4 rounded-2xl shadow-apple flex items-center gap-4 font-bold border border-outline/10"
          >
            <CheckCircle2 size={24} className="text-primary" />
            Layanan Synchronized Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-on-background leading-none">Revenue Models.</h2>
          <p className="text-secondary font-medium mt-3 text-lg">Kelola paket harga, fitur, dan penawaran layanan.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Cari paket..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-16 pr-8 py-5 bg-surface-container border border-outline/5 rounded-[2rem] outline-none focus:border-primary/30 font-bold text-sm w-80 transition-all shadow-inner"
              />
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
            className="bg-on-background text-background px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest flex items-center gap-4 hover:opacity-80 active:scale-95 transition-all shadow-apple"
          >
            <Plus size={20} /> Create Package
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface-container rounded-[4rem] border border-outline/5 shadow-apple overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline/5 bg-background/50 text-[11px] font-black uppercase tracking-[0.2em] text-secondary">
                <th className="px-10 py-8">Service Package</th>
                <th className="px-8 py-8">Tier Level</th>
                <th className="px-8 py-8">Valuation</th>
                <th className="px-8 py-8">Feature Set</th>
                <th className="px-10 py-8 text-right">Operational</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/5">
              {plans.length === 0 ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-on-background/5" />
                        <div className="space-y-3">
                           <div className="w-40 h-4 bg-on-background/5 rounded-full" />
                           <div className="w-24 h-2 bg-on-background/5 rounded-full" />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8"><div className="w-24 h-8 bg-on-background/5 rounded-xl" /></td>
                    <td className="px-8 py-8"><div className="w-32 h-6 bg-on-background/5 rounded-full" /></td>
                    <td className="px-8 py-8"><div className="w-20 h-4 bg-on-background/5 rounded-full" /></td>
                    <td className="px-10 py-8 text-right"><div className="ml-auto w-12 h-12 bg-on-background/5 rounded-2xl" /></td>
                  </tr>
                ))
              ) : (
                filteredPlans.map((plan) => (
                  <tr key={plan.id} className={`group hover:bg-on-background/[0.02] transition-all ${plan.highlight ? "bg-primary/[0.03]" : ""}`}>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-apple ${plan.highlight ? "bg-primary text-on-primary" : "bg-background text-secondary"}`}>
                          <Package size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h5 className="text-lg font-black text-on-background leading-none">{plan.name}</h5>
                            {plan.highlight && (
                              <span className="px-3 py-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-secondary font-bold uppercase tracking-widest mt-2">{plan.duration} Deployment • {plan.pages}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                       <span className="px-4 py-2 bg-background text-secondary rounded-xl text-[10px] font-black uppercase tracking-widest border border-outline/10 shadow-inner">
                         {plan.tier}
                       </span>
                    </td>
                    <td className="px-8 py-8 font-black text-on-background text-lg">
                      {plan.price}
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-success/10 text-success rounded-lg flex items-center justify-center">
                          <CheckCircle2 size={16} />
                        </div>
                        <span className="text-[11px] font-black text-secondary uppercase tracking-widest">{plan.features.length} Components</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => setEditingPlan(plan)}
                          className="p-4 bg-background border border-outline/10 text-secondary rounded-2xl hover:text-on-background hover:border-on-background shadow-apple transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(plan.id)}
                          className="p-4 bg-error/5 text-error border border-error/10 rounded-2xl hover:bg-error hover:text-on-error shadow-apple transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {filteredPlans.length === 0 && (
            <div className="p-32 text-center space-y-6 text-secondary opacity-20">
              <Search size={64} strokeWidth={1} className="mx-auto" />
              <p className="font-black uppercase tracking-[0.3em] text-[10px]">No packages match the repository search</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Modal - Advanced Architecture */}
      <AnimatePresence>
        {editingPlan && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingPlan(null)}
              className="absolute inset-0 bg-background/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-surface-container w-full max-w-6xl max-h-[92vh] rounded-[4rem] shadow-apple-hover flex flex-col overflow-hidden relative z-10 border border-outline/5"
            >
              {/* Modal Header */}
              <div className="p-12 border-b border-outline/5 flex justify-between items-center bg-background/20">
                 <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-on-background text-background rounded-3xl flex items-center justify-center shadow-apple">
                      <Settings size={32} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black tracking-tighter text-on-background uppercase leading-none">
                        {editingPlan.id === 0 ? "Package Blueprint" : "Advanced Revenue Console"}
                      </h3>
                      <p className="text-[11px] font-black uppercase tracking-[0.25em] text-primary mt-2 flex items-center gap-2">
                        <Zap size={12} /> Pricing Strategy & Feature Logic
                      </p>
                    </div>
                 </div>
                 <button onClick={() => setEditingPlan(null)} className="p-6 text-secondary hover:text-on-background transition-all bg-background/50 rounded-full">
                    <X size={28} />
                 </button>
              </div>

              {/* Modal Body - Segmented Control */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid lg:grid-cols-12 min-h-full">
                  {/* Internal Sidebar */}
                  <div className="lg:col-span-3 border-r border-outline/5 p-12 bg-background/10 space-y-3">
                     <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-8">Service Data</p>
                     {[
                       { id: "identity", label: "Core Identity", icon: Package },
                       { id: "value", label: "Value Prop", icon: Zap },
                       { id: "features", label: "Feature Set", icon: Layers }
                     ].map((cluster) => (
                       <button key={cluster.id} className={`w-full text-left px-8 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all flex items-center gap-4 ${cluster.id === "identity" ? "bg-on-background text-background shadow-apple" : "text-secondary hover:bg-background/50"}`}>
                         <cluster.icon size={16} /> {cluster.label}
                       </button>
                     ))}
                  </div>

                  {/* Operational Form */}
                  <div className="lg:col-span-9 p-16 space-y-24">
                    {/* Identity Matrix */}
                    <section className="space-y-12">
                       <div className="flex items-center gap-6 border-b border-outline/5 pb-6">
                          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                             <Package size={20} />
                          </div>
                          <h4 className="text-lg font-black uppercase tracking-widest text-on-background">Identity Matrix</h4>
                       </div>
                       <div className="grid md:grid-cols-2 gap-12">
                          <div className="space-y-4">
                             <label className="text-[11px] font-black uppercase tracking-widest text-secondary ml-4">Package Name</label>
                             <input 
                                type="text" 
                                value={editingPlan.name}
                                onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                                className="w-full px-10 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none font-black text-2xl focus:border-primary/30 transition-all shadow-inner"
                             />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[11px] font-black uppercase tracking-widest text-secondary ml-4">Service Tier</label>
                             <input 
                                type="text" 
                                value={editingPlan.tier}
                                onChange={(e) => setEditingPlan({...editingPlan, tier: e.target.value})}
                                className="w-full px-10 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none font-black text-lg focus:border-primary/30 transition-all shadow-inner text-primary"
                                placeholder="Basic / Professional / Enterprise"
                             />
                          </div>
                       </div>
                    </section>

                    {/* Value Prop */}
                    <section className="space-y-12">
                       <div className="flex items-center gap-6 border-b border-outline/5 pb-6">
                          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                             <Zap size={20} />
                          </div>
                          <h4 className="text-lg font-black uppercase tracking-widest text-on-background">Value Proposition</h4>
                       </div>
                       <div className="grid md:grid-cols-2 gap-12">
                          <div className="space-y-4">
                             <label className="text-[11px] font-black uppercase tracking-widest text-secondary ml-4">Valuation (Price)</label>
                             <input 
                                type="text" 
                                value={editingPlan.price}
                                onChange={(e) => setEditingPlan({...editingPlan, price: e.target.value})}
                                className="w-full px-10 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none font-black text-2xl focus:border-primary/30 transition-all shadow-inner"
                             />
                          </div>
                          <div className="grid grid-cols-2 gap-8">
                             <div className="space-y-4">
                                <label className="text-[11px] font-black uppercase tracking-widest text-secondary ml-4 text-center block">Scope (Pages)</label>
                                <div className="relative">
                                   <Layout className="absolute left-10 top-1/2 -translate-y-1/2 text-secondary/30" size={20} />
                                   <input 
                                      type="text" 
                                      value={editingPlan.pages}
                                      onChange={(e) => setEditingPlan({...editingPlan, pages: e.target.value})}
                                      className="w-full pl-20 pr-10 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none font-black text-sm focus:border-primary/30 transition-all shadow-inner"
                                   />
                                </div>
                             </div>
                             <div className="space-y-4">
                                <label className="text-[11px] font-black uppercase tracking-widest text-secondary text-center block">Deployment (Duration)</label>
                                <div className="relative">
                                   <Clock className="absolute left-10 top-1/2 -translate-y-1/2 text-secondary/30" size={20} />
                                   <input 
                                      type="text" 
                                      value={editingPlan.duration}
                                      onChange={(e) => setEditingPlan({...editingPlan, duration: e.target.value})}
                                      className="w-full pl-20 pr-10 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none font-black text-sm focus:border-primary/30 transition-all shadow-inner"
                                   />
                                </div>
                             </div>
                          </div>
                       </div>
                       <div className="pt-8">
                          <button 
                            onClick={() => setEditingPlan({...editingPlan, highlight: !editingPlan.highlight})}
                            className={`w-full py-8 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-6 transition-all ${
                              editingPlan.highlight 
                                ? "bg-amber-500 text-white shadow-[0_0_40px_rgba(245,158,11,0.3)] border-2 border-amber-400" 
                                : "bg-background text-secondary border border-outline/10 hover:bg-amber-500/5"
                            }`}
                          >
                            {editingPlan.highlight ? <Target size={24} /> : <Layers size={24} />}
                            {editingPlan.highlight ? "Featured High-Value Plan" : "Set as High-Value Plan"}
                          </button>
                       </div>
                    </section>

                    {/* Feature Set */}
                    <section className="space-y-12">
                       <div className="flex items-center gap-6 border-b border-outline/5 pb-6">
                          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                             <Layers size={20} />
                          </div>
                          <h4 className="text-lg font-black uppercase tracking-widest text-on-background">Feature Architecture</h4>
                       </div>
                       <div className="space-y-8">
                          <label className="text-[11px] font-black uppercase tracking-widest text-secondary ml-4">Active Logic Components (Features)</label>
                          <textarea 
                             value={editingPlan.features.join("\n")}
                             onChange={(e) => setEditingPlan({...editingPlan, features: e.target.value.split("\n")})}
                             placeholder="Satu fitur per baris..."
                             className="w-full px-12 py-10 bg-background border border-outline/10 rounded-[3rem] outline-none font-medium text-xl leading-relaxed focus:border-primary/30 h-64 transition-all resize-none custom-scrollbar shadow-inner"
                          />
                       </div>
                       <div className="space-y-8">
                          <label className="text-[11px] font-black uppercase tracking-widest text-secondary ml-4">Restricted Logic (Missing Features)</label>
                          <textarea 
                             value={editingPlan.missing.join("\n")}
                             onChange={(e) => setEditingPlan({...editingPlan, missing: e.target.value.split("\n")})}
                             placeholder="Satu fitur per baris..."
                             className="w-full px-12 py-10 bg-background border border-outline/10 rounded-[3rem] outline-none font-medium text-xl leading-relaxed focus:border-primary/30 h-48 transition-all resize-none custom-scrollbar shadow-inner opacity-40 grayscale"
                          />
                       </div>
                    </section>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-12 border-t border-outline/5 bg-background/20 flex justify-end gap-8">
                 <button 
                   onClick={() => setEditingPlan(null)}
                   className="px-14 py-6 bg-background border border-outline/10 text-secondary rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:text-on-background transition-all active:scale-95 shadow-sm"
                 >
                   Discard Changes
                 </button>
                 <button 
                   onClick={handleSavePlan}
                   disabled={isSaving}
                   className="px-24 py-6 bg-on-background text-background rounded-[2rem] font-black uppercase tracking-widest text-[11px] flex items-center gap-6 hover:opacity-80 active:scale-95 transition-all shadow-apple disabled:opacity-50"
                 >
                   {isSaving ? <Loader2 size={24} className="animate-spin" /> : <CheckCircle2 size={24} />}
                   {isSaving ? "Syncing Logic..." : "Commit To Database"}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
