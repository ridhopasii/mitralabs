"use client";

import { useState } from "react";
import { 
  Save, 
  Globe, 
  Smartphone, 
  Zap,
  Info,
  Eye,
  CheckCircle2,
  MessageSquare
} from "lucide-react";
import { useData } from "@/context/DataContext";

export default function SettingsPage() {
  const { data, updateData } = useData();
  const { settings } = data;
  
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateData({ ...data, settings: localSettings });
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-10 right-10 z-[200] bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-500">
          <CheckCircle2 size={24} />
          <p className="font-black">Pengaturan Berhasil Disimpan!</p>
        </div>
      )}

      {/* Business Mode Selection */}
      <section className="bg-surface-container-lowest p-12 rounded-[3rem] shadow-premium border border-surface-container-highest overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <Zap size={200} />
        </div>
        
        <div className="flex items-center gap-6 mb-12 relative z-10">
          <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center text-on-primary shadow-xl shadow-primary/20">
            <Zap size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter">Business Strategy Mode</h2>
            <p className="text-on-surface-variant font-medium">Otomasi respons UI berdasarkan strategi bisnis saat ini.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {[
            { id: "agresif", label: "Mode Agresif", desc: "Prioritas Leads & CTA Menonjol", icon: Zap },
            { id: "minimalis", label: "Mode Clean", desc: "Fokus pada Estetika & Portfolio", icon: Eye },
            { id: "maintenance", label: "Mode Libur", desc: "Tutup Sementara (Maintenance)", icon: Info },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setLocalSettings({ ...localSettings, businessMode: mode.id })}
              className={`p-10 rounded-[2.5rem] border-4 text-left transition-all duration-500 ${
                localSettings.businessMode === mode.id 
                  ? "bg-primary text-on-primary border-primary shadow-2xl shadow-primary/30 scale-105" 
                  : "bg-surface-container border-transparent text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <mode.icon size={32} className="mb-6" />
              <p className="font-black text-xl mb-2">{mode.label}</p>
              <p className={`text-xs font-medium leading-relaxed ${localSettings.businessMode === mode.id ? 'opacity-80' : 'opacity-40'}`}>
                {mode.desc}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Global Config */}
      <div className="grid md:grid-cols-2 gap-10">
        <section className="bg-surface-container-lowest p-12 rounded-[3rem] shadow-premium border border-surface-container-highest">
          <h3 className="text-2xl font-black mb-10 flex items-center gap-4 text-primary">
            <Smartphone size={24} /> Info Kontak
          </h3>
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 ml-2">WhatsApp Business</label>
              <input 
                type="text" 
                value={localSettings.waNumber} 
                onChange={(e) => setLocalSettings({ ...localSettings, waNumber: e.target.value })}
                className="w-full px-8 py-5 bg-surface-container-low border-2 border-transparent focus:border-primary rounded-[1.5rem] outline-none font-black text-lg transition-all" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 ml-2">Pesan Promo WhatsApp</label>
              <textarea 
                value={localSettings.waPromoMessage} 
                onChange={(e) => setLocalSettings({ ...localSettings, waPromoMessage: e.target.value })}
                className="w-full px-8 py-5 bg-surface-container-low border-2 border-transparent focus:border-primary rounded-[1.5rem] outline-none font-bold text-sm transition-all h-32" 
              />
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest p-12 rounded-[3rem] shadow-premium border border-surface-container-highest">
          <h3 className="text-2xl font-black mb-10 flex items-center gap-4 text-primary">
            <Globe size={24} /> SEO & Branding
          </h3>
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 ml-2">Meta Title Default</label>
              <input 
                type="text" 
                value="Mitralabs.id - Digital Agency" 
                readOnly
                className="w-full px-8 py-5 bg-surface-container-low border-2 border-transparent opacity-50 rounded-[1.5rem] outline-none font-black text-lg" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 ml-2">App Status</label>
              <div className="flex items-center gap-4 p-5 bg-surface-container-low rounded-2xl">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-black text-sm uppercase tracking-widest text-green-600">Sistem Online</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Save Action */}
      <div className="flex justify-end pt-12 pb-24">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-on-primary px-16 py-6 rounded-[2rem] font-black text-2xl shadow-2xl shadow-primary/40 flex items-center gap-5 hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-50 disabled:scale-100"
        >
          {isSaving ? "Sinkronisasi..." : "Simpan Pengaturan"}
        </button>
      </div>
    </div>
  );
}
