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
  Zap,
  HelpCircle,
  Briefcase,
  Star,
  Users,
  MessageCircle,
  List,
  Trash2,
  Plus
} from "lucide-react";
import { uploadImage } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

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
      if (!current[keys[i]]) current[keys[i]] = {};
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

  const tabs = [
    { id: "branding", label: "Branding", icon: Globe },
    { id: "navigation", label: "Navigation", icon: List },
    { id: "home", label: "Beranda", icon: Sparkles },
    { id: "services", label: "Layanan", icon: Briefcase },
    { id: "portfolio", label: "Portfolio", icon: List },
    { id: "about", label: "Tentang", icon: Users },
    { id: "contact", label: "Kontak", icon: MapPin },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-12 pb-40">
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
          <p className="px-6 text-[10px] font-black uppercase tracking-[0.25em] text-secondary mb-6 mt-2">Console Nodes</p>
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
          {activeTab === "branding" && (
            <motion.div 
              key="branding"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
               <div className="bg-surface-container p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <div className="flex items-center gap-8 pb-12 border-b border-outline/5">
                     <div className="w-16 h-16 bg-on-background text-background rounded-3xl flex items-center justify-center shadow-apple"><Globe size={28} /></div>
                     <div>
                        <h2 className="text-3xl font-black tracking-tighter text-on-background uppercase leading-none">Global Identity.</h2>
                        <p className="text-[11px] font-black text-secondary mt-3 uppercase tracking-widest">Branding dan metadata inti sistem.</p>
                     </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Master Logo Label" path="navbar.logo" value={formData.navbar.logo} icon={Type} />
                    <InputField onChange={updateField} label="Primary CTA Label" path="navbar.buttonText" value={formData.navbar.buttonText} icon={Zap} />
                  </div>
                  <InputField onChange={updateField} label="Corporate Mission Statement (Footer)" path="footer.description" value={formData.footer.description} type="textarea" />
               </div>
            </motion.div>
          )}

          {activeTab === "navigation" && (
            <motion.div 
              key="navigation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
               <div className="bg-surface-container p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <div className="flex items-center gap-8 pb-12 border-b border-outline/5">
                     <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center shadow-apple"><List size={28} /></div>
                     <div>
                        <h2 className="text-3xl font-black tracking-tighter text-on-background uppercase leading-none">Navigation Matrix.</h2>
                        <p className="text-[11px] font-black text-secondary mt-3 uppercase tracking-widest">Kelola struktur menu dan tautan sistem.</p>
                     </div>
                  </div>
                  
                  <div className="space-y-6">
                    <label className="text-[11px] font-black uppercase tracking-widest text-secondary ml-4">Integrated Navigation Nodes</label>
                    <div className="grid gap-6">
                      {(formData.navbar.links || []).map((link: any, idx: number) => (
                        <div key={idx} className="flex gap-6 items-center p-4 bg-background border border-outline/5 rounded-[2.5rem] shadow-inner group">
                          <div className="w-12 h-12 bg-on-background/5 text-on-background rounded-2xl flex items-center justify-center font-black text-xs shrink-0">{idx + 1}</div>
                          <div className="grid grid-cols-2 gap-4 flex-1">
                             <input 
                                value={link.label}
                                onChange={(e) => {
                                   const newLinks = [...formData.navbar.links];
                                   newLinks[idx].label = e.target.value;
                                   updateField("navbar.links", newLinks);
                                }}
                                className="px-6 py-4 bg-transparent outline-none font-black text-sm text-on-background"
                                placeholder="Link Label"
                             />
                             <input 
                                value={link.href}
                                onChange={(e) => {
                                   const newLinks = [...formData.navbar.links];
                                   newLinks[idx].href = e.target.value;
                                   updateField("navbar.links", newLinks);
                                }}
                                className="px-6 py-4 bg-transparent outline-none font-bold text-xs text-primary"
                                placeholder="/path"
                             />
                          </div>
                          <button 
                             onClick={() => {
                                const newLinks = formData.navbar.links.filter((_: any, i: number) => i !== idx);
                                updateField("navbar.links", newLinks);
                             }}
                             className="p-4 text-secondary/20 hover:text-error transition-all"
                          >
                             <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                           const newLinks = [...(formData.navbar.links || []), { label: "New Page", href: "/" }];
                           updateField("navbar.links", newLinks);
                        }}
                        className="w-full py-8 border-2 border-outline/10 border-dashed rounded-[3rem] text-[11px] font-black uppercase tracking-[0.3em] text-secondary hover:bg-background hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-6"
                      >
                         <Plus size={20} /> Inject Navigation Node
                      </button>
                    </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === "home" && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
               <div className="bg-surface-container p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-16">
                  <div className="flex items-center gap-8 pb-12 border-b border-outline/5">
                     <div className="w-16 h-16 bg-amber-500/10 text-amber-600 rounded-3xl flex items-center justify-center shadow-apple"><Sparkles size={28} /></div>
                     <h2 className="text-3xl font-black tracking-tighter text-on-background uppercase leading-none">Home Architecture.</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-16">
                    <div className="space-y-10">
                      <InputField onChange={updateField} label="Hero Signal (Promo)" path="home.hero.promo" value={formData.home.hero.promo} />
                      <InputField onChange={updateField} label="Strategic Tagline" path="home.hero.tagline" value={formData.home.hero.tagline} />
                      <InputField onChange={updateField} label="Executive Headline" path="home.hero.title" value={formData.home.hero.title} type="textarea" />
                      <InputField onChange={updateField} label="Sub-strategic Context" path="home.hero.subtitle" value={formData.home.hero.subtitle} type="textarea" />
                    </div>
                    <div className="space-y-10">
                      <ImageInput onUpload={handleImageUpload} isUploading={uploadingPath === formData.home?.hero?.image || uploadingPath === formData.about?.hero?.image || uploadingPath === "home.hero.image" || uploadingPath === "about.hero.image"} label="Master Hero Visual" path="home.hero.image" value={formData.home.hero.image} />
                      <div className="p-12 bg-background rounded-[3.5rem] border border-outline/5 grid grid-cols-2 gap-12 shadow-inner">
                         <InputField onChange={updateField} label="Core KPI Label" path="home.hero.stats.label" value={formData.home.hero.stats.label} />
                         <InputField onChange={updateField} label="KPI Metric Value" path="home.hero.stats.value" value={formData.home.hero.stats.value} />
                      </div>
                    </div>
                  </div>
               </div>

               <div className="bg-surface-container p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <div className="flex items-center gap-8 pb-12 border-b border-outline/5">
                     <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center shadow-apple"><MessageCircle size={28} /></div>
                     <h2 className="text-3xl font-black tracking-tighter text-on-background uppercase leading-none">Problem & Logic.</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Challenge Title" path="home.problem.title" value={formData.home.problem.title} />
                    <InputField onChange={updateField} label="Challenge Subtitle" path="home.problem.subtitle" value={formData.home.problem.subtitle} />
                    <InputField onChange={updateField} label="Strategic Solution Tag" path="home.solution.tagline" value={formData.home.solution.tagline} />
                    <InputField onChange={updateField} label="Solution Headline" path="home.solution.title" value={formData.home.solution.title} />
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === "services" && (
            <motion.div 
              key="services"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
               <div className="bg-surface-container p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <div className="flex items-center gap-8 pb-12 border-b border-outline/5">
                     <div className="w-16 h-16 bg-indigo-500/10 text-indigo-600 rounded-3xl flex items-center justify-center shadow-apple"><Briefcase size={28} /></div>
                     <h2 className="text-3xl font-black tracking-tighter text-on-background uppercase leading-none">Service Ecosystem.</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Core Section Title" path="services.title" value={formData.services.title} />
                    <InputField onChange={updateField} label="Executive Subtitle" path="services.subtitle" value={formData.services.subtitle} type="textarea" />
                    <InputField onChange={updateField} label="Comparison Matrix Title" path="services.comparisonTitle" value={formData.services.comparisonTitle} />
                    <InputField onChange={updateField} label="Comparison Sub-context" path="services.comparisonSubtitle" value={formData.services.comparisonSubtitle} type="textarea" />
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === "portfolio" && (
            <motion.div 
              key="portfolio"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
               <div className="bg-surface-container p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <div className="flex items-center gap-8 pb-12 border-b border-outline/5">
                     <div className="w-16 h-16 bg-rose-500/10 text-rose-600 rounded-3xl flex items-center justify-center shadow-apple"><List size={28} /></div>
                     <h2 className="text-3xl font-black tracking-tighter text-on-background uppercase leading-none">Portfolio Strategy.</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Exhibition Title" path="portfolio.title" value={formData.portfolio.title} />
                    <InputField onChange={updateField} label="Gallery Subtitle" path="portfolio.subtitle" value={formData.portfolio.subtitle} type="textarea" />
                    <InputField onChange={updateField} label="Conversion CTA Title" path="portfolio.cta.title" value={formData.portfolio.cta.title} />
                    <InputField onChange={updateField} label="Conversion Sub-context" path="portfolio.cta.subtitle" value={formData.portfolio.cta.subtitle} type="textarea" />
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === "about" && (
            <motion.div 
              key="about"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
               <div className="bg-surface-container p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <div className="flex items-center gap-8 pb-12 border-b border-outline/5">
                     <div className="w-16 h-16 bg-indigo-500/10 text-indigo-600 rounded-3xl flex items-center justify-center shadow-apple"><Users size={28} /></div>
                     <h2 className="text-3xl font-black tracking-tighter text-on-background uppercase leading-none">Corporate Narrative.</h2>
                  </div>
                  <div className="space-y-16">
                    <div className="grid md:grid-cols-2 gap-12">
                      <InputField onChange={updateField} label="Brand Tagline" path="about.hero.tagline" value={formData.about.hero.tagline} />
                      <InputField onChange={updateField} label="Executive Story Title" path="about.hero.title" value={formData.about.hero.title} />
                    </div>
                    <InputField onChange={updateField} label="Comprehensive Storytelling" path="about.hero.subtitle" value={formData.about.hero.subtitle} type="textarea" />
                    <ImageInput onUpload={handleImageUpload} isUploading={uploadingPath === formData.home?.hero?.image || uploadingPath === formData.about?.hero?.image || uploadingPath === "home.hero.image" || uploadingPath === "about.hero.image"} label="Operational Visual (Hero)" path="about.hero.image" value={formData.about.hero.image} />
                    <div className="grid md:grid-cols-2 gap-16 border-t border-outline/5 pt-16">
                       <InputField onChange={updateField} label="Visionary Objective" path="about.visionTitle" value={formData.about.visionTitle} />
                       <InputField onChange={updateField} label="Vision Statement" path="about.vision" value={formData.about.vision} type="textarea" />
                       <InputField onChange={updateField} label="Mission Protocol" path="about.missionTitle" value={formData.about.missionTitle} />
                    </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === "contact" && (
            <motion.div 
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
               <div className="bg-surface-container p-16 rounded-[4rem] border border-outline/5 shadow-apple space-y-12">
                  <div className="flex items-center gap-8 pb-12 border-b border-outline/5">
                     <div className="w-16 h-16 bg-rose-500/10 text-rose-600 rounded-3xl flex items-center justify-center shadow-apple"><MapPin size={28} /></div>
                     <h2 className="text-3xl font-black tracking-tighter text-on-background uppercase leading-none">Contact Protocol.</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-12">
                    <InputField onChange={updateField} label="Protocol Title" path="contact.title" value={formData.contact.title} />
                    <InputField onChange={updateField} label="Protocol Subtitle" path="contact.subtitle" value={formData.contact.subtitle} type="textarea" />
                    <InputField onChange={updateField} label="Corporate Email" path="contact.email" value={formData.contact.email} icon={Globe} />
                    <InputField onChange={updateField} label="WhatsApp Interface" path="settings.waNumber" value={formData.settings.waNumber} icon={Phone} />
                    <InputField onChange={updateField} label="Instagram Channel" path="contact.instagram" value={formData.contact.instagram} icon={Instagram} />
                    <InputField onChange={updateField} label="Operational Studio" path="contact.address" value={formData.contact.address} icon={MapPin} />
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
              {isSaving ? "Syncing Nodes..." : "Deploy Changes"}
           </button>
        </div>
      </div>
    </div>
  );
}
