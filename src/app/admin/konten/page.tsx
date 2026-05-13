"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { 
  Save, 
  Globe, 
  Upload,
  Loader2,
  Settings,
  Type,
  Phone,
  Instagram,
  MapPin,
  Sparkles,
  Zap,
  Briefcase,
  Users,
  MessageCircle,
  List,
  Trash2,
  Plus,
  CheckCircle2,
  Database,
  BarChart3,
  CreditCard,
  Flag,
  FileText,
  Mail,
  Linkedin,
  Monitor,
  Search,
  Image as ImageIcon
} from "lucide-react";
import { uploadImage } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

// Helper for deep property access/update
const getDeepValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const setDeepValue = (obj: any, path: string, value: any) => {
  const newData = JSON.parse(JSON.stringify(obj));
  const keys = path.split(".");
  let current: any = newData;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return newData;
};

// --- Reusable UI Components ---

const SectionTitle = ({ title, subtitle, icon: Icon }: any) => (
  <div className="flex items-center gap-6 pb-8 border-b border-outline/5 mb-8">
    <div className="w-12 h-12 bg-on-background/5 text-on-background rounded-2xl flex items-center justify-center">
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-xl font-black tracking-tight text-on-background uppercase leading-none">{title}</h3>
      <p className="text-[10px] font-bold text-secondary mt-2 uppercase tracking-widest">{subtitle}</p>
    </div>
  </div>
);

const InputField = ({ label, path, value, type = "text", placeholder = "", icon: Icon, onChange }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary ml-2">{label}</label>
    <div className="relative group">
      {Icon && <Icon className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/40 group-focus-within:text-primary transition-colors" size={18} />}
      {type === "textarea" ? (
        <textarea 
          value={value || ""} 
          placeholder={placeholder}
          onChange={(e) => onChange(path, e.target.value)}
          className={`w-full ${Icon ? 'pl-16' : 'px-8'} py-5 bg-background border border-outline/10 rounded-[1.5rem] outline-none font-medium text-sm focus:border-primary/30 transition-all shadow-sm h-32 resize-none`}
        />
      ) : (
        <input 
          type={type}
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(path, e.target.value)}
          className={`w-full ${Icon ? 'pl-16' : 'px-8'} py-5 bg-background border border-outline/10 rounded-[1.5rem] outline-none font-medium text-sm focus:border-primary/30 transition-all shadow-sm`}
        />
      )}
    </div>
  </div>
);

const ImageInput = ({ label, path, value, isUploading, onUpload }: any) => {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary ml-2">{label}</label>
      <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-outline/10 bg-background/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 transition-all group shadow-inner">
        {value ? <img src={value} className="absolute inset-0 w-full h-full object-cover" alt="" /> : null}
        <div className="relative z-10 glass-apple p-5 rounded-2xl shadow-apple-hover flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 border border-outline/10">
          {isUploading ? <Loader2 size={24} className="animate-spin text-primary" /> : <Upload size={24} className="text-primary" />}
          <span className="font-bold text-[10px] uppercase tracking-widest">{isUploading ? "Uploading..." : "Ganti Gambar"}</span>
        </div>
        <input 
          type="file" 
          accept="image/*"
          disabled={isUploading}
          onChange={(e) => e.target.files && onUpload(path, e.target.files[0])}
          className="absolute inset-0 opacity-0 cursor-pointer" 
        />
      </div>
    </div>
  );
};

const ArrayEditor = ({ label, items, onUpdate, renderItem }: any) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center px-4">
      <label className="text-[11px] font-black uppercase tracking-widest text-secondary">{label}</label>
      <button 
        onClick={() => onUpdate([...items, {}])}
        className="w-10 h-10 rounded-full bg-on-background/5 text-on-background flex items-center justify-center hover:bg-on-background hover:text-background transition-all"
      >
        <Plus size={20} />
      </button>
    </div>
    <div className="space-y-4">
      {items.map((item: any, idx: number) => (
        <div key={idx} className="relative group p-6 bg-background border border-outline/5 rounded-[2rem] shadow-inner">
          <button 
            onClick={() => onUpdate(items.filter((_: any, i: number) => i !== idx))}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-error/5 text-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={16} />
          </button>
          {renderItem(item, idx)}
        </div>
      ))}
    </div>
  </div>
);

// --- Main CMS Page ---

export default function GlobalContentCMS() {
  const { data, updateData } = useData();
  const [activeTab, setActiveTab] = useState("identity");
  const [formData, setFormData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadingPath, setUploadingPath] = useState<string | null>(null);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateData(formData);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Save failed:", err);
      setIsSaving(false);
    }
  };

  const updateField = (path: string, value: any) => {
    setFormData(setDeepValue(formData, path, value));
  };

  const handleImageUpload = async (path: string, file: File) => {
    setUploadingPath(path);
    const publicUrl = await uploadImage(file);
    if (publicUrl) updateField(path, publicUrl);
    setUploadingPath(null);
  };

  const tabs = [
    { id: "identity", label: "Identity", icon: Globe },
    { id: "home", label: "Beranda", icon: Sparkles },
    { id: "layanan", label: "Layanan", icon: Briefcase },
    { id: "portfolio", label: "Portfolio", icon: List },
    { id: "about", label: "Tentang", icon: Users },
    { id: "contact", label: "Kontak", icon: MapPin },
    { id: "footer", label: "Footer", icon: List },
    { id: "track", label: "Dashboard", icon: Monitor },
    { id: "seo", label: "SEO & Marketing", icon: Search },
    { id: "legal", label: "Legal & Policy", icon: FileText },
    { id: "finance", label: "Keuangan", icon: CreditCard },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-12 pb-60">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-10 right-10 z-[200] bg-on-background text-background px-8 py-4 rounded-2xl shadow-apple flex items-center gap-4 font-bold border border-outline/10"
          >
            <CheckCircle2 size={24} className="text-primary" />
            Global Sync Complete!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Nav */}
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky top-10 space-y-2 bg-surface-container/30 p-4 rounded-[3rem] border border-outline/5 shadow-inner">
          <p className="px-6 text-[10px] font-black uppercase tracking-[0.25em] text-secondary mb-6 mt-2">Engine Modules</p>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full px-8 py-5 rounded-[2rem] font-black text-xs transition-all flex items-center gap-5 uppercase tracking-widest ${
                activeTab === tab.id 
                  ? "bg-on-background text-background shadow-apple scale-105" 
                  : "text-secondary hover:bg-on-background/5 hover:text-on-background"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 space-y-12 max-w-5xl">
        
        <AnimatePresence mode="wait">
          
          {/* 1. IDENTITY & BRANDING */}
          {activeTab === "identity" && (
            <motion.div key="identity" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Corporate Branding" subtitle="Logo, favicon, dan identitas inti perusahaan." icon={Globe} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Logo Text" path="brand.name" value={formData.brand?.name} icon={Type} />
                    <InputField onChange={updateField} label="Website Tagline" path="brand.tagline" value={formData.brand?.tagline} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-12">
                    <ImageInput onUpload={handleImageUpload} isUploading={uploadingPath === "brand.logo"} label="Primary Logo Image" path="brand.logo" value={formData.brand?.logo} />
                    <ImageInput onUpload={handleImageUpload} isUploading={uploadingPath === "brand.favicon"} label="Site Favicon" path="brand.favicon" value={formData.brand?.favicon} />
                  </div>
               </div>

               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Social & Integration" subtitle="Tautan media sosial dan nomor WhatsApp utama." icon={Linkedin} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="WhatsApp Number" path="brand.whatsapp" value={formData.brand?.whatsapp} icon={Phone} />
                    <InputField onChange={updateField} label="WhatsApp Promo Message" path="settings.waPromoMessage" value={formData.settings.waPromoMessage} type="textarea" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Instagram Handle" path="brand.instagram" value={formData.brand?.instagram} icon={Instagram} />
                    <InputField onChange={updateField} label="LinkedIn Handle" path="brand.linkedin" value={formData.brand?.linkedin} icon={Linkedin} />
                  </div>
                  <div className="pt-8 border-t border-outline/5 space-y-6">
                    <SectionTitle title="Business Strategy" subtitle="Pengaturan tone dan mode operasional bisnis." icon={Briefcase} />
                    <div className="space-y-4">
                      <label className="text-[11px] font-black uppercase tracking-widest text-secondary ml-4">Operational Mode</label>
                      <select
                        value={formData.settings.businessMode || "agresif"}
                        onChange={(e) => updateField("settings.businessMode", e.target.value)}
                        className="w-full px-10 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none font-black text-lg focus:border-primary/30 transition-all shadow-inner appearance-none cursor-pointer"
                      >
                        <option value="agresif">Agresif (Promo & CTA Kuat)</option>
                        <option value="profesional">Profesional (Formal & Elegan)</option>
                        <option value="santai">Santai (Friendly & Casual)</option>
                      </select>
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-widest ml-4">Mempengaruhi tone komunikasi otomatis di website</p>
                    </div>
                  </div>
               </div>
            </motion.div>
          )}
          {/* 1.5 SEO & MARKETING */}
          {activeTab === "seo" && (
            <motion.div key="seo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Search Engine Intelligence" subtitle="Optimasi bagaimana website Anda muncul di Google." icon={Search} />
                  <div className="space-y-10">
                    <InputField onChange={updateField} label="Global Meta Title" path="settings.metaTitle" value={formData.settings.metaTitle} />
                    <InputField onChange={updateField} label="Meta Description" path="settings.metaDescription" value={formData.settings.metaDescription} type="textarea" />
                    <InputField onChange={updateField} label="Keywords (Comma separated)" path="settings.metaKeywords" value={formData.settings.metaKeywords} />
                  </div>
               </div>

               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Social Share (Open Graph)" subtitle="Gambar yang muncul saat link dibagikan di media sosial." icon={Sparkles} />
                  <div className="grid md:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <p className="text-sm font-bold text-slate-500 leading-relaxed">
                          Gunakan gambar dengan rasio 1200x630 piksel untuk hasil terbaik di WhatsApp, Instagram, dan LinkedIn.
                        </p>
                        <ImageInput onUpload={handleImageUpload} isUploading={uploadingPath === "settings.ogImage"} label="OG Image (Share Preview)" path="settings.ogImage" value={formData.settings.ogImage} />
                     </div>
                     <div className="bg-background rounded-3xl border border-outline/10 p-8 flex items-center justify-center">
                        {formData.settings.ogImage ? (
                          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                             <img src={formData.settings.ogImage} className="w-full h-full object-cover" alt="OG Preview" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                <div className="text-white space-y-1">
                                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Social Preview</p>
                                   <p className="font-bold truncate">{formData.settings.metaTitle}</p>
                                </div>
                             </div>
                          </div>
                        ) : (
                          <div className="text-center opacity-20 space-y-4">
                             <ImageIcon size={48} className="mx-auto" />
                             <p className="text-[10px] font-black uppercase tracking-widest">No Image Selected</p>
                          </div>
                        )}
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
          {/* 2. BERANDA */}
          {activeTab === "home" && (
            <motion.div key="home" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Hero Architecture" subtitle="Bagian pembuka halaman depan." icon={Sparkles} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <InputField onChange={updateField} label="Hero Promo Tag" path="home.hero.promo" value={formData.home.hero.promo} />
                      <InputField onChange={updateField} label="Strategic Title" path="home.hero.title" value={formData.home.hero.title} type="textarea" />
                      <InputField onChange={updateField} label="Context Subtitle" path="home.hero.subtitle" value={formData.home.hero.subtitle} type="textarea" />
                    </div>
                    <div className="space-y-8">
                      <ImageInput onUpload={handleImageUpload} isUploading={uploadingPath === "home.hero.image"} label="Hero Visual" path="home.hero.image" value={formData.home.hero.image} />
                      <div className="grid grid-cols-2 gap-6">
                        <InputField onChange={updateField} label="Stat Label" path="home.hero.stats.label" value={formData.home.hero.stats.label} />
                        <InputField onChange={updateField} label="Stat Value" path="home.hero.stats.value" value={formData.home.hero.stats.value} />
                        <InputField onChange={updateField} label="Status Label" path="home.hero.stats.statusLabel" value={formData.home.hero.stats.statusLabel} />
                        <InputField onChange={updateField} label="Status Value" path="home.hero.stats.statusValue" value={formData.home.hero.stats.statusValue} />
                      </div>
                    </div>
                  </div>
               </div>

               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Problem & Strategy" subtitle="Memaparkan masalah dan solusi yang ditawarkan." icon={MessageCircle} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Problem Section Title" path="home.problem.title" value={formData.home.problem.title} />
                    <InputField onChange={updateField} label="Problem Section Subtitle" path="home.problem.subtitle" value={formData.home.problem.subtitle} />
                  </div>
                  <ArrayEditor 
                    label="Problem Items" 
                    items={formData.home.problem.items} 
                    onUpdate={(val: any) => updateField("home.problem.items", val)}
                    renderItem={(item: any, idx: number) => (
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField label="Item Title" value={item.title} onChange={(p: string, v: any) => {
                          const newItems = [...formData.home.problem.items];
                          newItems[idx].title = v;
                          updateField("home.problem.items", newItems);
                        }} />
                        <InputField label="Item Description" value={item.desc} onChange={(p: string, v: any) => {
                          const newItems = [...formData.home.problem.items];
                          newItems[idx].desc = v;
                          updateField("home.problem.items", newItems);
                        }} />
                      </div>
                    )}
                  />
               </div>

               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Solution Ecosystem" subtitle="Empat pilar solusi utama." icon={Zap} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Solution Tagline" path="home.solution.tagline" value={formData.home.solution.tagline} />
                    <InputField onChange={updateField} label="Solution Title" path="home.solution.title" value={formData.home.solution.title} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-12">
                    {(Object.keys(formData.home.solution.cards) as Array<keyof typeof formData.home.solution.cards>).map((key) => (
                      <div key={key} className="p-8 bg-background border border-outline/5 rounded-[2.5rem] shadow-inner space-y-6">
                        <p className="text-[11px] font-black uppercase text-primary tracking-widest">{key} Card</p>
                        <InputField label="Title" value={formData.home.solution.cards[key].title} onChange={(p: string, v: any) => updateField(`home.solution.cards.${key}.title`, v)} />
                        <InputField label="Description" value={formData.home.solution.cards[key].desc} onChange={(p: string, v: any) => updateField(`home.solution.cards.${key}.desc`, v)} type="textarea" />
                        <ImageInput onUpload={handleImageUpload} isUploading={uploadingPath === `home.solution.cards.${key}.image`} label="Visual" path={`home.solution.cards.${key}.image`} value={formData.home.solution.cards[key].image} />
                      </div>
                    ))}
                  </div>
               </div>

               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Process & Methodology" subtitle="Langkah-langkah pengerjaan proyek." icon={Database} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Process Title" path="home.process.title" value={formData.home.process.title} />
                    <InputField onChange={updateField} label="Process Subtitle" path="home.process.subtitle" value={formData.home.process.subtitle} />
                  </div>
                  <ArrayEditor 
                    label="Process Steps" 
                    items={formData.home.process.steps} 
                    onUpdate={(val: any) => updateField("home.process.steps", val)}
                    renderItem={(item: any, idx: number) => (
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField label="Step Title" value={item.title} onChange={(p: string, v: any) => {
                          const newItems = [...formData.home.process.steps];
                          newItems[idx].title = v;
                          updateField("home.process.steps", newItems);
                        }} />
                        <InputField label="Step Description" value={item.desc} onChange={(p: string, v: any) => {
                          const newItems = [...formData.home.process.steps];
                          newItems[idx].desc = v;
                          updateField("home.process.steps", newItems);
                        }} />
                      </div>
                    )}
                  />
               </div>

               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Corporate Achievements" subtitle="Statistik dan angka pencapaian." icon={BarChart3} />
                  <ArrayEditor 
                    label="Achievement Stats" 
                    items={formData.home.stats} 
                    onUpdate={(val: any) => updateField("home.stats", val)}
                    renderItem={(item: any, idx: number) => (
                      <div className="grid md:grid-cols-3 gap-6">
                        <InputField label="Label" value={item.label} onChange={(p: string, v: any) => {
                          const newItems = [...formData.home.stats];
                          newItems[idx].label = v;
                          updateField("home.stats", newItems);
                        }} />
                        <InputField label="Value" value={item.value} onChange={(p: string, v: any) => {
                          const newItems = [...formData.home.stats];
                          newItems[idx].value = v;
                          updateField("home.stats", newItems);
                        }} />
                        <InputField label="Description" value={item.desc} onChange={(p: string, v: any) => {
                          const newItems = [...formData.home.stats];
                          newItems[idx].desc = v;
                          updateField("home.stats", newItems);
                        }} />
                      </div>
                    )}
                  />
               </div>

               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Call to Action (CTA)" subtitle="Penutup halaman beranda." icon={CheckCircle2} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="CTA Title" path="home.cta.title" value={formData.home.cta.title} type="textarea" />
                    <InputField onChange={updateField} label="CTA Subtitle" path="home.cta.subtitle" value={formData.home.cta.subtitle} type="textarea" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Button Text" path="home.cta.buttonText" value={formData.home.cta.buttonText} />
                    <InputField onChange={updateField} label="Promo / Footnote Text" path="home.cta.promoText" value={formData.home.cta.promoText} />
                  </div>
               </div>

               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Pricing Header" subtitle="Teks pengantar harga di beranda." icon={BarChart3} />
                  <div className="grid md:grid-cols-3 gap-12">
                    <InputField onChange={updateField} label="Price Badge" path="home.pricing.badge" value={formData.home.pricing?.badge} />
                    <InputField onChange={updateField} label="Price Title" path="home.pricing.title" value={formData.home.pricing?.title} />
                    <InputField onChange={updateField} label="Price Subtitle" path="home.pricing.subtitle" value={formData.home.pricing?.subtitle} type="textarea" />
                  </div>
               </div>
            </motion.div>
          )}

          {/* 3. LAYANAN */}
          {activeTab === "layanan" && (
            <motion.div key="layanan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Pricing Strategy Header" subtitle="Teks pengantar paket harga." icon={Briefcase} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Main Title" path="services.title" value={formData.services.title} />
                    <InputField onChange={updateField} label="Subtitle Narrative" path="services.subtitle" value={formData.services.subtitle} type="textarea" />
                  </div>
               </div>
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Comparison Matrix" subtitle="Teks untuk tabel perbandingan paket." icon={BarChart3} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Matrix Title" path="services.comparisonTitle" value={formData.services.comparisonTitle} />
                    <InputField onChange={updateField} label="Matrix Subtitle" path="services.comparisonSubtitle" value={formData.services.comparisonSubtitle} type="textarea" />
                  </div>
               </div>
            </motion.div>
          )}

          {/* 4. PORTFOLIO & BLOG */}
          {activeTab === "portfolio" && (
            <motion.div key="portfolio" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Portfolio Header" subtitle="Judul dan deskripsi galeri proyek." icon={List} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Gallery Title" path="portfolio.title" value={formData.portfolio.title} />
                    <InputField onChange={updateField} label="Gallery Subtitle" path="portfolio.subtitle" value={formData.portfolio.subtitle} type="textarea" />
                  </div>
               </div>
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Portfolio Conversion" subtitle="CTA di bagian bawah halaman portfolio." icon={CheckCircle2} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="CTA Title" path="portfolio.cta.title" value={formData.portfolio.cta.title} />
                    <InputField onChange={updateField} label="CTA Subtitle" path="portfolio.cta.subtitle" value={formData.portfolio.cta.subtitle} type="textarea" />
                  </div>
               </div>
            </motion.div>
          )}

          {/* 5. TENTANG KAMI */}
          {activeTab === "about" && (
            <motion.div key="about" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Corporate Narrative" subtitle="Cerita dan visual utama tentang perusahaan." icon={Users} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <InputField onChange={updateField} label="Hero Tagline" path="about.hero.tagline" value={formData.about.hero.tagline} />
                      <InputField onChange={updateField} label="Executive Title" path="about.hero.title" value={formData.about.hero.title} />
                      <InputField onChange={updateField} label="Company Narrative" path="about.hero.subtitle" value={formData.about.hero.subtitle} type="textarea" />
                    </div>
                    <div className="space-y-8">
                      <ImageInput onUpload={handleImageUpload} isUploading={uploadingPath === "about.hero.image"} label="Narrative Visual" path="about.hero.image" value={formData.about.hero.image} />
                    </div>
                  </div>
               </div>
               
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Mission & Vision" subtitle="Visi misi dan nilai inti." icon={Flag} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <InputField onChange={updateField} label="Vision Title" path="about.visionTitle" value={formData.about.visionTitle} />
                       <InputField onChange={updateField} label="Vision Narrative" path="about.vision" value={formData.about.vision} type="textarea" />
                    </div>
                    <div className="space-y-8">
                       <InputField onChange={updateField} label="Mission Title" path="about.missionTitle" value={formData.about.missionTitle} />
                       <ArrayEditor 
                        label="Mission Points" 
                        items={formData.about.mission} 
                        onUpdate={(val: any) => updateField("about.mission", val)}
                        renderItem={(item: any, idx: number) => (
                          <InputField label={`Point ${idx + 1}`} value={item} onChange={(p: string, v: any) => {
                            const newMissions = [...formData.about.mission];
                            newMissions[idx] = v;
                            updateField("about.mission", newMissions);
                          }} />
                        )}
                      />
                    </div>
                  </div>
               </div>

               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Human Capital" subtitle="Tim inti dibalik Mitralabs." icon={Users} />
                  <ArrayEditor 
                    label="Team Members" 
                    items={formData.about.team} 
                    onUpdate={(val: any) => updateField("about.team", val)}
                    renderItem={(item: any, idx: number) => (
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                           <InputField label="Name" value={item.name} onChange={(p: string, v: any) => {
                             const newTeam = [...formData.about.team];
                             newTeam[idx].name = v;
                             updateField("about.team", newTeam);
                           }} />
                           <InputField label="Role" value={item.role} onChange={(p: string, v: any) => {
                             const newTeam = [...formData.about.team];
                             newTeam[idx].role = v;
                             updateField("about.team", newTeam);
                           }} />
                           <InputField label="Brief Bio" value={item.bio} onChange={(p: string, v: any) => {
                             const newTeam = [...formData.about.team];
                             newTeam[idx].bio = v;
                             updateField("about.team", newTeam);
                           }} type="textarea" />
                        </div>
                        <ImageInput onUpload={handleImageUpload} isUploading={uploadingPath === `about.team.${idx}.image`} label="Profile Photo" path={`about.team.${idx}.image`} value={item.image} />
                      </div>
                    )}
                  />
               </div>
            </motion.div>
          )}

          {/* 6. KONTAK */}
          {activeTab === "contact" && (
            <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Contact Protocol" subtitle="Informasi korespondensi resmi." icon={Mail} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Main Title" path="contact.title" value={formData.contact.title} />
                    <InputField onChange={updateField} label="Subtitle Narrative" path="contact.subtitle" value={formData.contact.subtitle} type="textarea" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Official Email" path="contact.email" value={formData.contact.email} icon={Mail} />
                    <InputField onChange={updateField} label="Official Address" path="contact.address" value={formData.contact.address} icon={MapPin} />
                  </div>
               </div>
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Operational Intelligence" subtitle="Konfigurasi teknis kontak." icon={Settings} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Maps Embed/URL" path="contact.mapsUrl" value={formData.contact.mapsUrl} icon={MapPin} />
                    <InputField onChange={updateField} label="Form Success Message" path="contact.labels.successTitle" value={formData.contact.labels.successTitle} />
                  </div>
               </div>
            </motion.div>
          )}

          {/* 7. FOOTER */}
          {activeTab === "footer" && (
            <motion.div key="footer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Footer Narrative" subtitle="Teks deskripsi di bagian bawah website." icon={Type} />
                  <InputField onChange={updateField} label="Footer Description" path="footer.description" value={formData.footer.description} type="textarea" />
               </div>
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Footer Socials" subtitle="Tautan media sosial di footer." icon={Linkedin} />
                  <ArrayEditor 
                    label="Social Links" 
                    items={formData.footer.socials} 
                    onUpdate={(val: any) => updateField("footer.socials", val)}
                    renderItem={(item: any, idx: number) => (
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField label="Platform Label" value={item.label} onChange={(p: string, v: any) => {
                          const newSocials = [...formData.footer.socials];
                          newSocials[idx].label = v;
                          updateField("footer.socials", newSocials);
                        }} />
                        <InputField label="URL / Href" value={item.href} onChange={(p: string, v: any) => {
                          const newSocials = [...formData.footer.socials];
                          newSocials[idx].href = v;
                          updateField("footer.socials", newSocials);
                        }} />
                      </div>
                    )}
                  />
               </div>
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Footer Links" subtitle="Tautan navigasi tambahan (Legal, dll)." icon={List} />
                  <ArrayEditor 
                    label="Navigation Links" 
                    items={formData.footer.links} 
                    onUpdate={(val: any) => updateField("footer.links", val)}
                    renderItem={(item: any, idx: number) => (
                      <div className="grid md:grid-cols-2 gap-6">
                        <InputField label="Link Label" value={item.label} onChange={(p: string, v: any) => {
                          const newLinks = [...formData.footer.links];
                          newLinks[idx].label = v;
                          updateField("footer.links", newLinks);
                        }} />
                        <InputField label="Path / Href" value={item.href} onChange={(p: string, v: any) => {
                          const newLinks = [...formData.footer.links];
                          newLinks[idx].href = v;
                          updateField("footer.links", newLinks);
                        }} />
                      </div>
                    )}
                  />
               </div>
            </motion.div>
          )}

          {/* 8. DASHBOARD TRACK */}
          {activeTab === "track" && (
            <motion.div key="track" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Track Dashboard Labels" subtitle="Semua teks di halaman /track." icon={Monitor} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Main Title" path="track.title" value={formData.track.title} />
                    <InputField onChange={updateField} label="Subtitle" path="track.subtitle" value={formData.track.subtitle} type="textarea" />
                    <InputField onChange={updateField} label="Login Header" path="track.labels.secureBadge" value={formData.track.labels.secureBadge} />
                    <InputField onChange={updateField} label="Submit Button" path="track.labels.submitButton" value={formData.track.labels.submitButton} />
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 bg-background rounded-3xl border border-outline/5 shadow-inner">
                    {Object.keys(formData.track.labels.tabs).map((key) => (
                      <InputField key={key} label={`Tab ${key}`} value={formData.track.labels.tabs[key]} onChange={(p: string, v: any) => updateField(`track.labels.tabs.${key}`, v)} />
                    ))}
                  </div>
               </div>
            </motion.div>
          )}

          {/* 9. LEGAL & POLICY */}
          {activeTab === "legal" && (
            <motion.div key="legal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Legal Documents" subtitle="Syarat layanan dan kebijakan privasi." icon={FileText} />
                  <div className="space-y-10">
                    <InputField onChange={updateField} label="Terms of Service" path="legal.terms" value={formData.legal?.terms} type="textarea" />
                    <InputField onChange={updateField} label="Privacy Policy" path="legal.privacy" value={formData.legal?.privacy} type="textarea" />
                    <InputField onChange={updateField} label="Last Updated" path="legal.lastUpdated" value={formData.legal?.lastUpdated} />
                  </div>
               </div>
            </motion.div>
          )}

          {/* 10. KEUANGAN / INVOICE */}
          {activeTab === "finance" && (
            <motion.div key="finance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Banking & Revenue" subtitle="Informasi rekening untuk invoice." icon={CreditCard} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Bank Name" path="invoiceSettings.bankName" value={formData.invoiceSettings.bankName} />
                    <InputField onChange={updateField} label="Account Number" path="invoiceSettings.bankAccountNumber" value={formData.invoiceSettings.bankAccountNumber} />
                    <InputField onChange={updateField} label="Account Holder" path="invoiceSettings.bankAccountName" value={formData.invoiceSettings.bankAccountName} />
                    <InputField onChange={updateField} label="Bank Branch" path="invoiceSettings.bankBranch" value={formData.invoiceSettings.bankBranch} />
                  </div>
               </div>
               <div className="bg-surface-container p-12 md:p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <SectionTitle title="Legal & Tax" subtitle="Konfigurasi pajak dan identitas legal." icon={FileText} />
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Tax Label (e.g. PPN 11%)" path="invoiceSettings.taxLabel" value={formData.invoiceSettings.taxLabel} />
                    <InputField onChange={updateField} label="Tax Rate (Decimal, e.g. 0.11)" path="invoiceSettings.taxRate" value={formData.invoiceSettings.taxRate} />
                    <InputField onChange={updateField} label="Company NPWP" path="invoiceSettings.companyNPWP" value={formData.invoiceSettings.companyNPWP} />
                    <InputField onChange={updateField} label="Invoice Terms" path="invoiceSettings.termsAndConditions" value={formData.invoiceSettings.termsAndConditions} type="textarea" />
                  </div>
               </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* Floating Save Bar */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-5xl px-8 z-[120]">
        <div className="glass-apple p-8 rounded-[3rem] shadow-apple-hover border border-outline/10 flex items-center justify-between">
           <div className="flex items-center gap-8 ml-6">
              <div className="w-14 h-14 bg-on-background text-background rounded-2xl flex items-center justify-center shadow-apple animate-pulse"><Settings size={26} /></div>
              <div className="hidden sm:block">
                 <p className="text-on-background font-black text-lg leading-none uppercase tracking-tighter">Content Core Engine</p>
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-2">Active Data Synchronization Enabled</p>
              </div>
           </div>
           <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-on-background text-background px-16 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:opacity-80 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-6 shadow-apple"
           >
              {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
              {isSaving ? "Syncing Nodes..." : "Deploy Global Changes"}
           </button>
        </div>
      </div>
    </div>
  );
}
