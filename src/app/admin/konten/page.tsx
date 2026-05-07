"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { 
  Save, 
  Layout, 
  CheckCircle2, 
  Globe, 
  Upload,
  Loader2,
  Settings,
  X,
  Type,
  Phone,
  Instagram,
  MapPin,
  Sparkles,
  Zap
} from "lucide-react";
import { uploadImage } from "@/lib/supabase";

export default function SiteSettingsCMS() {
  const { data, updateData } = useData();
  const [activeTab, setActiveTab] = useState("branding");
  const [formData, setFormData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadingPath, setUploadingPath] = useState<string | null>(null);

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

  const handleImageUpload = async (path: string, file: File) => {
    setUploadingPath(path);
    const publicUrl = await uploadImage(file);
    if (publicUrl) updateField(path, publicUrl);
    setUploadingPath(null);
  };

  const InputField = ({ label, path, value, type = "text", placeholder = "", icon: Icon }: any) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />}
        {type === "textarea" ? (
          <textarea 
            value={value} 
            placeholder={placeholder}
            onChange={(e) => updateField(path, e.target.value)}
            className={`w-full ${Icon ? 'pl-16' : 'px-8'} py-5 bg-white border border-slate-200 rounded-3xl outline-none font-bold text-sm focus:border-primary transition-all shadow-sm h-32 resize-none`}
          />
        ) : (
          <input 
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => updateField(path, e.target.value)}
            className={`w-full ${Icon ? 'pl-16' : 'px-8'} py-5 bg-white border border-slate-200 rounded-3xl outline-none font-bold text-sm focus:border-primary transition-all shadow-sm`}
          />
        )}
      </div>
    </div>
  );

  const ImageInput = ({ label, path, value }: any) => {
    const isUploading = uploadingPath === path;
    return (
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{label}</label>
        <div className="relative aspect-video rounded-[3rem] overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all group shadow-inner">
          {value ? <img src={value} className="absolute inset-0 w-full h-full object-cover" /> : null}
          <div className="relative z-10 bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-2xl flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
            {isUploading ? <Loader2 size={24} className="animate-spin text-primary" /> : <Upload size={24} className="text-primary" />}
            <span className="font-black text-[10px] uppercase tracking-widest">{isUploading ? "Uploading..." : "Ganti Gambar"}</span>
          </div>
          <input 
            type="file" 
            accept="image/*"
            disabled={isUploading}
            onChange={(e) => e.target.files && handleImageUpload(path, e.target.files[0])}
            className="absolute inset-0 opacity-0 cursor-pointer" 
          />
        </div>
      </div>
    );
  };

  const tabs = [
    { id: "branding", label: "Branding", icon: Globe },
    { id: "hero", label: "Hero Sections", icon: Sparkles },
    { id: "contact", label: "Kontak & Lokasi", icon: MapPin },
    { id: "about", label: "About Page", icon: Type },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-12 pb-40 animate-in fade-in duration-700">
      {showSuccess && (
        <div className="fixed top-10 right-10 z-[200] bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 font-bold">
          <CheckCircle2 size={24} />
          Pengaturan Situs Disimpan!
        </div>
      )}

      {/* Sidebar Nav */}
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky top-10 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full px-8 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-4 ${
                activeTab === tab.id 
                  ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/20" 
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 space-y-12">
        
        {activeTab === "branding" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-10">
                <div className="flex items-center gap-6 pb-10 border-b border-slate-50">
                   <div className="w-16 h-16 bg-primary text-on-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30"><Globe size={32} /></div>
                   <div>
                      <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">Global Branding</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Identitas visual dan navigasi utama</p>
                   </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <InputField label="Logo Text" path="navbar.logo" value={formData.navbar.logo} icon={Type} />
                  <InputField label="Navbar Button" path="navbar.buttonText" value={formData.navbar.buttonText} icon={Zap} />
                </div>
                <InputField label="Footer Description" path="footer.description" value={formData.footer.description} type="textarea" />
             </div>
          </div>
        )}

        {activeTab === "hero" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-10">
                <div className="flex items-center gap-6 pb-10 border-b border-slate-50">
                   <div className="w-16 h-16 bg-amber-500 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/30"><Sparkles size={32} /></div>
                   <div>
                      <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">Home Hero</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Headline utama dan visual pertama</p>
                   </div>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <InputField label="Promo Badge" path="home.hero.promo" value={formData.home.hero.promo} />
                    <InputField label="Tagline" path="home.hero.tagline" value={formData.home.hero.tagline} />
                    <InputField label="Headline Utama" path="home.hero.title" value={formData.home.hero.title} type="textarea" />
                    <InputField label="Sub-headline" path="home.hero.subtitle" value={formData.home.hero.subtitle} type="textarea" />
                  </div>
                  <div className="space-y-8">
                    <ImageInput label="Hero Image Visual" path="home.hero.image" value={formData.home.hero.image} />
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 grid grid-cols-2 gap-6">
                       <InputField label="Stats Label" path="home.hero.stats.label" value={formData.home.hero.stats.label} />
                       <InputField label="Stats Value" path="home.hero.stats.value" value={formData.home.hero.stats.value} />
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-10">
                <div className="flex items-center gap-6 pb-10 border-b border-slate-50">
                   <div className="w-16 h-16 bg-rose-500 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-500/30"><MapPin size={32} /></div>
                   <div>
                      <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">Kontak & Lokasi</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Informasi jangkauan klien</p>
                </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <InputField label="Business Email" path="contact.email" value={formData.contact.email} icon={Globe} />
                  <InputField label="WhatsApp Number" path="settings.waNumber" value={formData.settings.waNumber} icon={Phone} />
                  <InputField label="Instagram User" path="contact.instagram" value={formData.contact.instagram} icon={Instagram} />
                  <InputField label="Lokasi Studio" path="contact.address" value={formData.contact.address} icon={MapPin} />
                </div>
             </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-10">
                <div className="flex items-center gap-6 pb-10 border-b border-slate-50">
                   <div className="w-16 h-16 bg-indigo-500 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30"><Type size={32} /></div>
                   <div>
                      <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">About Content</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Visi dan cerita brand</p>
                   </div>
                </div>
                <div className="space-y-8">
                  <InputField label="About Tagline" path="about.hero.tagline" value={formData.about.hero.tagline} />
                  <InputField label="About Title" path="about.hero.title" value={formData.about.hero.title} />
                  <InputField label="Detailed Subtitle / Bio" path="about.hero.subtitle" value={formData.about.hero.subtitle} type="textarea" />
                  <ImageInput label="About Hero Visual" path="about.hero.image" value={formData.about.hero.image} />
                </div>
             </div>
          </div>
        )}

      </div>

      {/* Floating Save */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-[100]">
        <div className="bg-slate-900/90 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-2xl border border-white/10 flex items-center justify-between">
           <div className="flex items-center gap-6 ml-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20"><Settings size={24} /></div>
              <div>
                 <p className="text-white font-black text-sm uppercase tracking-tight">Configuration Engine</p>
                 <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Global site parameters</p>
              </div>
           </div>
           <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-4 shadow-2xl shadow-primary/40"
           >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? "Syncing..." : "Apply Settings"}
           </button>
        </div>
      </div>
    </div>
  );
}
