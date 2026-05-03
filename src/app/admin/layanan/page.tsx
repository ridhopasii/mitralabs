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
  ArrowUpRight
} from "lucide-react";

export default function ServicesCMS() {
  const { data, updateData } = useData();
  const [formData, setFormData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateData(formData);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const updateField = (path: string, value: any) => {
    const newData = JSON.parse(JSON.stringify(formData));
    const keys = path.split(".");
    let current: any = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
  };

  const addItem = (path: string, defaultValue: any) => {
    const newData = JSON.parse(JSON.stringify(formData));
    const keys = path.split(".");
    let current: any = newData;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    current.push({ ...defaultValue, id: Date.now() });
    setFormData(newData);
  };

  const removeItem = (path: string, index: number) => {
    const newData = JSON.parse(JSON.stringify(formData));
    const keys = path.split(".");
    let current: any = newData;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    current.splice(index, 1);
    setFormData(newData);
  };

  const InputField = ({ label, path, value, type = "text", placeholder = "" }: any) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">{label}</label>
      {type === "textarea" ? (
        <textarea 
          value={value} 
          placeholder={placeholder}
          onChange={(e) => updateField(path, e.target.value)}
          className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-medium text-sm h-32 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
        />
      ) : (
        <input 
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => updateField(path, e.target.value)}
          className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
        />
      )}
    </div>
  );

  return (
    <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700 pb-40">
      {showSuccess && (
        <div className="fixed top-10 right-10 z-[200] bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-emerald-200 flex items-center gap-4 animate-in slide-in-from-right-10 duration-500">
          <CheckCircle2 size={24} />
          <p className="font-bold">Layanan Berhasil Diperbarui!</p>
        </div>
      )}

      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900">Services Management</h2>
          <p className="text-slate-500 font-medium mt-2 text-lg">Kelola paket harga, fitur, dan penawaran layanan Anda.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-on-primary px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {isSaving ? "Publishing..." : "Simpan Perubahan"}
        </button>
      </div>

      <div className="grid gap-12">
        {/* Header Section */}
        <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold">Informasi Halaman</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <InputField label="Judul Utama" path="services.title" value={formData.services.title} />
            <InputField label="Sub-judul" path="services.subtitle" value={formData.services.subtitle} type="textarea" />
          </div>
        </section>

        {/* Plans Grid */}
        <section>
          <div className="flex justify-between items-center mb-8 px-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                <Package size={24} />
              </div>
              <h3 className="text-xl font-bold">Paket Layanan</h3>
            </div>
            <button 
              onClick={() => addItem("services.plans", { name: "Paket Baru", price: "Rp 0", tier: "Basic", pages: "1 page", duration: "1 day", features: [], missing: [], highlight: false })}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg"
            >
              <Plus size={18} />
              Tambah Paket
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {formData.services.plans.map((plan, i) => (
              <div key={plan.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
                <button 
                  onClick={() => removeItem("services.plans", i)}
                  className="absolute top-4 right-4 p-2 bg-rose-50 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                >
                  <Trash2 size={16} />
                </button>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">Paket #{i+1}</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={plan.highlight} 
                        onChange={(e) => updateField(`services.plans.${i}.highlight`, e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <span className="text-[10px] font-bold uppercase text-slate-400">Populer</span>
                    </div>
                  </div>

                  <InputField label="Nama Paket" path={`services.plans.${i}.name`} value={plan.name} />
                  <InputField label="Harga" path={`services.plans.${i}.price`} value={plan.price} />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Tier" path={`services.plans.${i}.tier`} value={plan.tier} />
                    <InputField label="Halaman" path={`services.plans.${i}.pages`} value={plan.pages} />
                  </div>

                  <InputField label="Durasi" path={`services.plans.${i}.duration`} value={plan.duration} />
                  <InputField label="Fitur (Satu per baris)" path={`services.plans.${i}.features`} value={plan.features.join("\n")} type="textarea" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Syarat & Ketentuan */}
        <section className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center">
                <Info size={24} />
              </div>
              <h3 className="text-xl font-bold">Syarat & Ketentuan</h3>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Catatan Tambahan (Satu per baris)</label>
              <textarea 
                value={formData.services.notes.join("\n")} 
                onChange={(e) => updateField("services.notes", e.target.value.split("\n"))}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-medium text-sm h-40 focus:border-primary transition-all text-white"
                placeholder="Masukkan catatan syarat & ketentuan..."
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
