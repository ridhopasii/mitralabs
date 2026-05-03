"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { 
  Save, 
  Briefcase, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Loader2,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Target,
  Layout
} from "lucide-react";
import { uploadImage } from "@/lib/supabase";

export default function PortfolioCMS() {
  const { data, updateData } = useData();
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

  const ImageInput = ({ label, path, value }: any) => {
    const isUploading = uploadingPath === path;
    
    return (
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">{label}</label>
        <div className="relative group aspect-[16/10] rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/[0.02] transition-all">
          {value ? <img src={value} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : null}
          <div className="relative z-10 bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 border border-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
            {isUploading ? (
              <Loader2 size={18} className="text-primary animate-spin" />
            ) : (
              <Upload size={18} className="text-primary" />
            )}
            <p className="font-bold text-xs uppercase tracking-widest text-slate-900">
              {isUploading ? "Uploading..." : "Ganti Gambar"}
            </p>
          </div>
          {!value && !isUploading && (
             <div className="flex flex-col items-center gap-2 text-slate-400">
                <ImageIcon size={40} strokeWidth={1} />
                <p className="font-bold text-xs uppercase tracking-widest">Klik untuk Upload</p>
             </div>
          )}
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

  return (
    <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700 pb-40">
      {showSuccess && (
        <div className="fixed top-10 right-10 z-[200] bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-emerald-200 flex items-center gap-4 animate-in slide-in-from-right-10 duration-500">
          <CheckCircle2 size={24} />
          <p className="font-bold">Portfolio Berhasil Diperbarui!</p>
        </div>
      )}

      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900">Portfolio Hub</h2>
          <p className="text-slate-500 font-medium mt-2 text-lg">Tampilkan karya terbaik Anda kepada calon klien.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-on-primary px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {isSaving ? "Publishing..." : "Simpan Portfolio"}
        </button>
      </div>

      <div className="grid gap-12">
        {/* Intro Section */}
        <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
              <Layout size={24} />
            </div>
            <h3 className="text-xl font-bold">Pengantar Halaman</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
               <InputField label="Headline Portfolio" path="portfolio.title" value={formData.portfolio.title} />
               <InputField label="Kategori Filter (Pisahkan Koma)" path="portfolio.categories" value={formData.portfolio.categories.join(", ")} />
            </div>
            <InputField label="Sub-headline" path="portfolio.subtitle" value={formData.portfolio.subtitle} type="textarea" />
          </div>
        </section>

        {/* Gallery Section */}
        <section>
          <div className="flex justify-between items-center mb-8 px-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-bold">Project Gallery</h3>
            </div>
            <button 
              onClick={() => addItem("portfolio.projects", { title: "Project Baru", category: "UMKM", image: "", status: "Published" })}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg"
            >
              <Plus size={18} />
              Tambah Project
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {formData.portfolio.projects.map((project, i) => (
              <div key={project.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative">
                <button 
                  onClick={() => removeItem("portfolio.projects", i)}
                  className="absolute top-6 right-6 z-20 p-3 bg-rose-50 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Project #{i+1}</span>
                    <InputField label="Judul Project" path={`portfolio.projects.${i}.title`} value={project.title} />
                    <InputField label="Kategori" path={`portfolio.projects.${i}.category`} value={project.category} />
                    <div className="pt-4 flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                       {project.status}
                    </div>
                  </div>
                  <ImageInput label="Foto Project" path={`portfolio.projects.${i}.image`} value={project.image} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mb-48 -mr-48"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold">Call to Action</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <InputField label="CTA Title" path="portfolio.cta.title" value={formData.portfolio.cta.title} />
              <InputField label="Tombol Teks" path="portfolio.cta.buttonText" value={formData.portfolio.cta.buttonText} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
