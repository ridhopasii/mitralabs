"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { 
  Save, 
  Image as ImageIcon, 
  Type, 
  Layout, 
  CheckCircle2, 
  Smartphone, 
  Briefcase, 
  Package, 
  Upload,
  Link as LinkIcon,
  Globe,
  Users,
  Plus,
  Trash2,
  Info,
  Zap,
  Target,
  ListChecks,
  Loader2
} from "lucide-react";
import { uploadImage } from "@/lib/supabase";

export default function MasterCMS() {
  const { data, updateData } = useData();
  const [activeTab, setActiveTab] = useState("home");
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
    if (publicUrl) {
      updateField(path, publicUrl);
    }
    setUploadingPath(null);
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

  const SectionHeader = ({ icon: Icon, title, desc }: any) => (
    <div className="flex items-center gap-6 mb-12 p-8 bg-surface-container rounded-3xl border border-surface-container-highest">
      <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-on-primary shadow-xl shadow-primary/20">
        <Icon size={32} />
      </div>
      <div>
        <h3 className="text-3xl font-black tracking-tight uppercase">{title}</h3>
        <p className="text-on-surface-variant font-medium text-sm">{desc}</p>
      </div>
    </div>
  );

  const InputField = ({ label, path, value, type = "text", placeholder = "" }: any) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">{label}</label>
      {type === "textarea" ? (
        <textarea 
          value={value} 
          placeholder={placeholder}
          onChange={(e) => updateField(path, e.target.value)}
          className="w-full px-8 py-6 bg-surface-container-low border border-surface-container-highest rounded-2xl outline-none font-bold text-sm h-32 focus:border-primary transition-colors"
        />
      ) : (
        <input 
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => updateField(path, e.target.value)}
          className="w-full px-8 py-5 bg-surface-container-low border border-surface-container-highest rounded-2xl outline-none font-black text-sm focus:border-primary transition-colors"
        />
      )}
    </div>
  );

  const ImageInput = ({ label, path, value }: any) => {
    const isUploading = uploadingPath === path;
    
    return (
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">{label}</label>
        <div className="relative group aspect-video rounded-[2.5rem] overflow-hidden border-4 border-dashed border-surface-container-highest bg-surface-container-low flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all">
          {value ? <img src={value} className="absolute inset-0 w-full h-full object-cover" /> : null}
          <div className="relative z-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3">
            {isUploading ? (
              <Loader2 size={32} className="text-primary animate-spin" />
            ) : (
              <Upload size={32} className="text-primary" />
            )}
            <p className="font-black text-sm uppercase tracking-widest">
              {isUploading ? "Uploading..." : "Upload Image"}
            </p>
          </div>
          <input 
            type="file" 
            accept="image/*"
            disabled={isUploading}
            onChange={(e) => e.target.files && handleImageUpload(path, e.target.files[0])}
            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
          />
        </div>
      </div>
    );
  };

  const tabs = [
    { id: "home", label: "Homepage", icon: Layout },
    { id: "services", label: "Layanan", icon: Package },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
    { id: "about", label: "Tentang Kami", icon: Users },
    { id: "contact", label: "Kontak", icon: Smartphone },
    { id: "navfooter", label: "Nav & Footer", icon: Globe }
  ];

  return (
    <div className="flex gap-10 animate-in fade-in duration-500 pb-60">
      {showSuccess && (
        <div className="fixed top-10 right-10 z-[200] bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-500">
          <CheckCircle2 size={24} />
          <p className="font-black">Website Berhasil Diperbarui!</p>
        </div>
      )}

      {/* Sidebar Tabs */}
      <div className="w-80 shrink-0 space-y-3 sticky top-10 h-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full px-8 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-5 border-2 ${
              activeTab === tab.id 
                ? "bg-primary text-on-primary border-primary shadow-2xl shadow-primary/20 scale-105" 
                : "bg-surface-container-lowest text-on-surface-variant border-transparent hover:bg-surface-container"
            }`}
          >
            <tab.icon size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Master Content Area */}
      <div className="flex-1 bg-surface-container-lowest p-16 rounded-[4rem] shadow-premium border border-surface-container-highest">
        
        {/* HOME EDITOR */}
        {activeTab === "home" && (
          <div className="space-y-32">
            {/* Hero */}
            <section>
              <SectionHeader icon={Layout} title="Hero Section" desc="Bagian pertama yang dilihat pengunjung." />
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <InputField label="Hero Tagline" path="home.hero.tagline" value={formData.home.hero.tagline} />
                  <InputField label="Promo Badge" path="home.hero.promo" value={formData.home.hero.promo} />
                  <InputField label="Headline Utama" path="home.hero.title" value={formData.home.hero.title} type="textarea" />
                  <InputField label="Sub-headline" path="home.hero.subtitle" value={formData.home.hero.subtitle} type="textarea" />
                </div>
                <div className="space-y-8">
                  <ImageInput label="Hero Image" path="home.hero.image" value={formData.home.hero.image} />
                  <div className="p-8 bg-surface-container-low rounded-3xl border border-surface-container-highest grid grid-cols-2 gap-4">
                     <div className="col-span-2 text-[10px] font-black uppercase tracking-widest opacity-40">Hero Stats Card</div>
                     <InputField label="Label" path="home.hero.stats.label" value={formData.home.hero.stats.label} />
                     <InputField label="Value" path="home.hero.stats.value" value={formData.home.hero.stats.value} />
                  </div>
                </div>
              </div>
            </section>

            {/* Solution Cards */}
            <section className="pt-20 border-t border-surface-container-highest">
               <SectionHeader icon={Zap} title="Solution Cards" desc="Layanan spesifik yang Anda tawarkan di Beranda." />
               <div className="grid md:grid-cols-2 gap-10">
                 {/* UMKM Card */}
                 <div className="p-10 bg-surface-container-low rounded-[3rem] border border-surface-container-highest space-y-6">
                    <p className="font-black text-primary uppercase tracking-widest text-xs">Card 1: UMKM</p>
                    <InputField label="Tagline Card" path="home.solution.cards.umkm.tag" value={formData.home.solution.cards.umkm.tag} />
                    <InputField label="Judul" path="home.solution.cards.umkm.title" value={formData.home.solution.cards.umkm.title} />
                    <InputField label="Deskripsi" path="home.solution.cards.umkm.desc" value={formData.home.solution.cards.umkm.desc} type="textarea" />
                    <ImageInput label="Gambar Card" path="home.solution.cards.umkm.image" value={formData.home.solution.cards.umkm.image} />
                 </div>
                 {/* Travel Card */}
                 <div className="p-10 bg-surface-container-low rounded-[3rem] border border-surface-container-highest space-y-6">
                    <p className="font-black text-primary uppercase tracking-widest text-xs">Card 2: Travel</p>
                    <InputField label="Judul" path="home.solution.cards.travel.title" value={formData.home.solution.cards.travel.title} />
                    <InputField label="Deskripsi" path="home.solution.cards.travel.desc" value={formData.home.solution.cards.travel.desc} type="textarea" />
                 </div>
                 {/* School Card */}
                 <div className="p-10 bg-surface-container-low rounded-[3rem] border border-surface-container-highest space-y-6">
                    <p className="font-black text-primary uppercase tracking-widest text-xs">Card 3: Sekolah</p>
                    <InputField label="Judul" path="home.solution.cards.school.title" value={formData.home.solution.cards.school.title} />
                    <InputField label="Deskripsi" path="home.solution.cards.school.desc" value={formData.home.solution.cards.school.desc} type="textarea" />
                 </div>
                 {/* Business Card */}
                 <div className="p-10 bg-surface-container-low rounded-[3rem] border border-surface-container-highest space-y-6">
                    <p className="font-black text-primary uppercase tracking-widest text-xs">Card 4: Bisnis</p>
                    <InputField label="Judul" path="home.solution.cards.business.title" value={formData.home.solution.cards.business.title} />
                    <InputField label="Deskripsi" path="home.solution.cards.business.desc" value={formData.home.solution.cards.business.desc} type="textarea" />
                 </div>
               </div>
            </section>

            {/* SOP Steps */}
            <section className="pt-20 border-t border-surface-container-highest">
               <SectionHeader icon={ListChecks} title="Workflow SOP" desc="Langkah-langstep pengerjaan project." />
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {formData.home.process.steps.map((step, i) => (
                   <div key={step.id} className="p-8 bg-surface-container-low rounded-3xl border border-surface-container-highest space-y-4">
                      <span className="w-10 h-10 bg-primary text-on-primary rounded-xl flex items-center justify-center font-black">{i+1}</span>
                      <InputField label={`Step ${i+1} Title`} path={`home.process.steps.${i}.title`} value={step.title} />
                      <InputField label="Deskripsi" path={`home.process.steps.${i}.desc`} value={step.desc} type="textarea" />
                   </div>
                 ))}
               </div>
            </section>

            {/* Home CTA */}
            <section className="pt-20 border-t border-surface-container-highest">
               <SectionHeader icon={Target} title="Final CTA Section" desc="Ajakan terakhir di bagian bawah Beranda." />
               <div className="grid md:grid-cols-2 gap-10">
                  <InputField label="CTA Title" path="home.cta.title" value={formData.home.cta.title} />
                  <InputField label="CTA Subtitle" path="home.cta.subtitle" value={formData.home.cta.subtitle} />
                  <InputField label="Tombol Teks" path="home.cta.buttonText" value={formData.home.cta.buttonText} />
                  <InputField label="Promo Footer" path="home.cta.promoText" value={formData.home.cta.promoText} />
               </div>
            </section>
          </div>
        )}

        {/* SERVICES EDITOR */}
        {activeTab === "services" && (
          <div className="space-y-32">
            <section>
              <SectionHeader icon={Package} title="Pricing Plans" desc="Kelola paket harga dan fitur layanan Anda." />
              <div className="grid md:grid-cols-3 gap-8">
                {formData.services.plans.map((plan, i) => (
                  <div key={plan.id} className="p-10 bg-surface-container-low rounded-[3rem] border border-surface-container-highest space-y-6 relative overflow-hidden group">
                    <button 
                      onClick={() => removeItem("services.plans", i)}
                      className="absolute top-6 right-6 p-3 bg-error/10 text-error rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-error hover:text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                    {plan.highlight && <div className="absolute top-0 right-16 bg-primary text-on-primary px-4 py-1 text-[10px] font-black uppercase">Populer</div>}
                    <InputField label="Nama Paket" path={`services.plans.${i}.name`} value={plan.name} />
                    <InputField label="Harga" path={`services.plans.${i}.price`} value={plan.price} />
                    <InputField label="Tier" path={`services.plans.${i}.tier`} value={plan.tier} />
                    <InputField label="Halaman" path={`services.plans.${i}.pages`} value={plan.pages} />
                    <InputField label="Durasi" path={`services.plans.${i}.duration`} value={plan.duration} />
                    <InputField label="Fitur (Satu per baris)" path={`services.plans.${i}.features`} value={plan.features.join("\n")} type="textarea" />
                    <div className="flex items-center gap-3">
                       <input type="checkbox" checked={plan.highlight} onChange={(e) => updateField(`services.plans.${i}.highlight`, e.target.checked)} className="w-5 h-5 rounded" />
                       <span className="text-xs font-black uppercase">Highlight Paket</span>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => addItem("services.plans", { name: "New Plan", price: "Rp 0", tier: "Basic", pages: "1 page", duration: "1 day", features: [], missing: [], highlight: false })}
                  className="p-10 rounded-[3rem] border-4 border-dashed border-surface-container-highest flex flex-col items-center justify-center gap-4 hover:border-primary hover:text-primary transition-all text-on-surface-variant/40"
                >
                  <Plus size={48} />
                  <span className="font-black uppercase tracking-widest">Tambah Paket</span>
                </button>
              </div>
            </section>
            
            <section className="pt-20 border-t border-surface-container-highest">
               <SectionHeader icon={Info} title="Extra Notes" desc="Catatan syarat & ketentuan di bawah tabel harga." />
               <InputField label="Catatan Syarat (Satu per baris)" path="services.notes" value={formData.services.notes.join("\n")} type="textarea" />
            </section>
          </div>
        )}

        {/* PORTFOLIO EDITOR */}
        {activeTab === "portfolio" && (
          <div className="space-y-32">
            <section>
              <SectionHeader icon={Briefcase} title="Portfolio Page" desc="Kelola teks halaman galeri project." />
              <div className="grid md:grid-cols-2 gap-10">
                <InputField label="Headline Portfolio" path="portfolio.title" value={formData.portfolio.title} />
                <InputField label="Sub-headline" path="portfolio.subtitle" value={formData.portfolio.subtitle} type="textarea" />
                <InputField label="Kategori Filter (Pisahkan Koma)" path="portfolio.categories" value={formData.portfolio.categories.join(", ")} />
              </div>
            </section>
            
            <section className="pt-20 border-t border-surface-container-highest">
               <SectionHeader icon={Briefcase} title="Project Gallery" desc="Daftar hasil karya Anda." />
               <div className="grid md:grid-cols-2 gap-8">
                  {formData.portfolio.projects.map((project, i) => (
                    <div key={project.id} className="p-10 bg-surface-container-low rounded-[3rem] border border-surface-container-highest space-y-6 relative group">
                       <button 
                          onClick={() => removeItem("portfolio.projects", i)}
                          className="absolute top-6 right-6 p-3 bg-error/10 text-error rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-error hover:text-white"
                        >
                          <Trash2 size={16} />
                        </button>
                       <InputField label="Judul Project" path={`portfolio.projects.${i}.title`} value={project.title} />
                       <InputField label="Kategori" path={`portfolio.projects.${i}.category`} value={project.category} />
                       <ImageInput label="Foto Project" path={`portfolio.projects.${i}.image`} value={project.image} />
                    </div>
                  ))}
                  <button 
                    onClick={() => addItem("portfolio.projects", { title: "New Project", category: "UMKM", image: "", status: "Published" })}
                    className="p-10 rounded-[3rem] border-4 border-dashed border-surface-container-highest flex flex-col items-center justify-center gap-4 hover:border-primary hover:text-primary transition-all text-on-surface-variant/40"
                  >
                    <Plus size={48} />
                    <span className="font-black uppercase tracking-widest">Tambah Project</span>
                  </button>
               </div>
            </section>

            <section className="pt-20 border-t border-surface-container-highest">
               <SectionHeader icon={Target} title="Portfolio CTA" desc="Teks ajakan kolaborasi di halaman portfolio." />
               <div className="grid md:grid-cols-2 gap-10">
                  <InputField label="CTA Title" path="portfolio.cta.title" value={formData.portfolio.cta.title} />
                  <InputField label="CTA Button" path="portfolio.cta.buttonText" value={formData.portfolio.cta.buttonText} />
               </div>
            </section>
          </div>
        )}

        {/* ABOUT EDITOR */}
        {activeTab === "about" && (
          <div className="space-y-32">
            <section>
              <SectionHeader icon={Users} title="About Our Team" desc="Ceritakan siapa di balik Mitralabs." />
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <InputField label="Headline About" path="about.hero.title" value={formData.about.hero.title} />
                  <InputField label="Deskripsi Cerita" path="about.hero.subtitle" value={formData.about.hero.subtitle} type="textarea" />
                </div>
                <div className="space-y-8">
                   <ImageInput label="About Hero Image" path="about.hero.image" value={formData.about.hero.image} />
                </div>
              </div>
            </section>

            <section className="pt-20 border-t border-surface-container-highest">
               <SectionHeader icon={Target} title="Vision & Mission" desc="Tujuan dan standar kualitas perusahaan." />
               <div className="grid md:grid-cols-2 gap-10">
                  <InputField label="Visi Perusahaan" path="about.vision" value={formData.about.vision} type="textarea" />
                  <InputField label="Misi (Satu per baris)" path="about.mission" value={formData.about.mission.join("\n")} type="textarea" />
               </div>
            </section>

            <section className="pt-20 border-t border-surface-container-highest">
               <SectionHeader icon={Users} title="Team Members" desc="Profil pengembang dan pengelola." />
               <div className="grid md:grid-cols-2 gap-10">
                  {formData.about.team.map((member, i) => (
                    <div key={member.id} className="p-10 bg-surface-container-low rounded-[3rem] border border-surface-container-highest space-y-6 relative group">
                       <button 
                          onClick={() => removeItem("about.team", i)}
                          className="absolute top-6 right-6 p-3 bg-error/10 text-error rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-error hover:text-white"
                        >
                          <Trash2 size={16} />
                        </button>
                       <InputField label="Nama Lengkap" path={`about.team.${i}.name`} value={member.name} />
                       <InputField label="Jabatan" path={`about.team.${i}.role`} value={member.role} />
                       <InputField label="Bio Singkat" path={`about.team.${i}.bio`} value={member.bio} type="textarea" />
                       <ImageInput label="Foto Profil" path={`about.team.${i}.image`} value={member.image} />
                    </div>
                  ))}
                  <button 
                    onClick={() => addItem("about.team", { name: "New Member", role: "Staff", bio: "", image: "" })}
                    className="p-10 rounded-[3rem] border-4 border-dashed border-surface-container-highest flex flex-col items-center justify-center gap-4 hover:border-primary hover:text-primary transition-all text-on-surface-variant/40"
                  >
                    <Plus size={48} />
                    <span className="font-black uppercase tracking-widest">Tambah Tim</span>
                  </button>
               </div>
            </section>
          </div>
        )}

        {/* CONTACT EDITOR */}
        {activeTab === "contact" && (
          <div className="space-y-32">
            <section>
              <SectionHeader icon={Smartphone} title="Contact Information" desc="Kelola info studio dan akun sosial." />
              <div className="grid md:grid-cols-2 gap-10">
                <InputField label="Email Bisnis" path="contact.email" value={formData.contact.email} />
                <InputField label="Instagram Handle" path="contact.instagram" value={formData.contact.instagram} />
                <InputField label="Alamat Studio" path="contact.address" value={formData.contact.address} />
                <InputField label="Maps Embed Link (Optional)" path="contact.mapsUrl" value={formData.contact.mapsUrl} />
              </div>
            </section>
          </div>
        )}

        {/* NAV & FOOTER EDITOR */}
        {activeTab === "navfooter" && (
          <div className="space-y-32">
            <section>
              <SectionHeader icon={Globe} title="Global Branding" desc="Logo, navigasi, dan identitas website." />
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <InputField label="Brand Logo Text" path="navbar.logo" value={formData.navbar.logo} />
                  <InputField label="Footer Description" path="footer.description" value={formData.footer.description} type="textarea" />
                </div>
                <div className="space-y-8">
                   <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">Menu Navigasi</label>
                     {formData.navbar.links.map((link, i) => (
                        <div key={i} className="flex gap-4">
                           <input value={link.label} onChange={(e) => {
                             const newLinks = [...formData.navbar.links];
                             newLinks[i].label = e.target.value;
                             updateField("navbar.links", newLinks);
                           }} className="flex-1 px-4 py-3 bg-surface-container-low rounded-xl font-bold" />
                           <input value={link.href} onChange={(e) => {
                             const newLinks = [...formData.navbar.links];
                             newLinks[i].href = e.target.value;
                             updateField("navbar.links", newLinks);
                           }} className="flex-1 px-4 py-3 bg-surface-container-low rounded-xl text-xs" />
                        </div>
                     ))}
                   </div>
                </div>
              </div>
            </section>
          </div>
        )}

      </div>

      {/* Persistent Save Bar */}
      <div className="fixed bottom-12 left-[calc(20rem+10px)] right-10 bg-surface-container-lowest p-8 rounded-[3rem] shadow-2xl border border-surface-container-highest flex items-center justify-between animate-in slide-in-from-bottom-12 duration-700 z-[150]">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
            <Save size={32} />
          </div>
          <div>
            <p className="font-black text-xl tracking-tight uppercase">Master CMS v6</p>
            <p className="text-xs font-bold text-on-surface-variant">Sinkronisasi 100% dinamis ke seluruh ekosistem Mitralabs.</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right hidden md:block">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Status Sistem</p>
              <p className="text-xs font-bold text-green-600">Terhubung & Siap Sinkron</p>
           </div>
           <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-on-primary px-20 py-7 rounded-[2rem] font-black text-2xl flex items-center gap-5 hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-50 shadow-2xl shadow-primary/40 min-w-[300px] justify-center"
          >
            {isSaving ? (
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                Publishing...
              </div>
            ) : "Simpan & Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
