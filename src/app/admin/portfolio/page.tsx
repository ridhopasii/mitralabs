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
  Layout,
  Search,
  MoreVertical,
  Edit3,
  X,
  Globe,
  Tag,
  Calendar,
  Layers,
  ChevronRight,
  Filter
} from "lucide-react";
import { uploadImage } from "@/lib/supabase";
import Image from "next/image";

interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  image: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  client_name?: string;
  project_date?: string;
  live_link?: string;
  tech_stack?: string[];
  gallery_urls?: string[];
  status: string;
}

export default function PortfolioCMS() {
  const { data, updateData } = useData();
  const [projects, setProjects] = useState<Project[]>(data.portfolio.projects);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    setProjects(data.portfolio.projects);
  }, [data.portfolio.projects]);

  const handleSaveProject = () => {
    if (!editingProject) return;
    setIsSaving(true);
    
    const newProjects = projects.some(p => p.id === editingProject.id)
      ? projects.map(p => p.id === editingProject.id ? editingProject : p)
      : [...projects, { ...editingProject, id: Date.now() }];

    const newData = { ...data };
    newData.portfolio.projects = newProjects;

    setTimeout(() => {
      updateData(newData);
      setProjects(newProjects);
      setIsSaving(false);
      setShowSuccess(true);
      setEditingProject(null);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Hapus project ini secara permanen?")) return;
    const newProjects = projects.filter(p => p.id !== id);
    const newData = { ...data };
    newData.portfolio.projects = newProjects;
    updateData(newData);
    setProjects(newProjects);
  };

  const handleImageUpload = async (file: File, field: "image" | "gallery") => {
    setUploadingField(field);
    setIsUploading(true);
    const url = await uploadImage(file);
    if (url && editingProject) {
      if (field === "image") {
        setEditingProject({ ...editingProject, image: url });
      } else {
        const currentGallery = editingProject.gallery_urls || [];
        setEditingProject({ ...editingProject, gallery_urls: [...currentGallery, url] });
      }
    }
    setIsUploading(false);
    setUploadingField(null);
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const isPublished = status === "Published";
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
        isPublished ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
      }`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {showSuccess && (
        <div className="fixed top-10 right-10 z-[200] bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-500 font-bold">
          <CheckCircle2 size={24} />
          Portfolio Berhasil Diperbarui!
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-slate-900">Portfolio Hub</h2>
          <p className="text-slate-500 font-medium mt-2 text-lg">Manajemen karya kreatif dan hasil pengerjaan project.</p>
        </div>
        <button 
          onClick={() => setEditingProject({
            id: 0,
            slug: "",
            title: "Project Baru",
            category: "UMKM",
            image: "",
            description: "",
            challenge: "",
            solution: "",
            results: [],
            status: "Draft",
            tech_stack: [],
            gallery_urls: []
          })}
          className="bg-primary text-on-primary px-10 py-5 rounded-[2rem] font-black flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30"
        >
          <Plus size={24} /> Tambah Project
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total Project", value: projects.length, icon: Briefcase, color: "bg-blue-500" },
          { label: "Published", value: projects.filter(p => p.status === "Published").length, icon: CheckCircle2, color: "bg-emerald-500" },
          { label: "Draft", value: projects.filter(p => p.status !== "Published").length, icon: Edit3, color: "bg-amber-500" },
          { label: "Live Links", value: projects.filter(p => p.live_link).length, icon: Globe, color: "bg-indigo-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className={`w-14 h-14 ${stat.color}/10 text-${stat.color.split("-")[1]}-500 rounded-2xl flex items-center justify-center`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
              <h4 className="text-3xl font-black text-slate-900">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari project atau kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold transition-all"
            />
          </div>
          <div className="flex gap-4">
             <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary hover:border-primary transition-all">
                <Filter size={20} />
             </button>
             <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary hover:border-primary transition-all">
                <Layers size={20} />
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-10 py-6">Project Info</th>
                <th className="px-6 py-6">Category</th>
                <th className="px-6 py-6">Status</th>
                <th className="px-6 py-6">Links</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 relative shadow-sm">
                        {project.image ? (
                          <Image src={project.image} alt={project.title} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-300">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h5 className="font-black text-slate-900 group-hover:text-primary transition-colors">{project.title}</h5>
                        <p className="text-xs text-slate-400 font-bold tracking-tight mt-1">{project.slug || "No slug"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                     <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                       {project.category}
                     </span>
                  </td>
                  <td className="px-6 py-6">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex gap-2">
                      {project.live_link && (
                        <a href={project.live_link} target="_blank" className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                          <Tag size={14} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => setEditingProject(project)}
                        className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:border-primary hover:text-primary shadow-sm"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)}
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
          {filteredProjects.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto">
                <Search size={40} />
              </div>
              <p className="text-slate-400 font-bold">Tidak ada project yang ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
            {/* Modal Header */}
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-primary text-on-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40">
                    <Briefcase size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                      {editingProject.id === 0 ? "Tambah Project" : "Edit Project"}
                    </h3>
                    <p className="text-xs text-slate-400 font-black tracking-[0.2em] uppercase mt-1">Konfigurasi detail showcase portfolio</p>
                  </div>
               </div>
               <button onClick={() => setEditingProject(null)} className="p-5 bg-slate-100 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                  <X size={24} />
               </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
               <div className="grid lg:grid-cols-3 gap-12">
                  {/* Left Column: Media & Primary Actions */}
                  <div className="space-y-10 lg:col-span-1">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Featured Image</label>
                      <div className="relative group aspect-[16/10] rounded-[2.5rem] overflow-hidden border-4 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all">
                        {editingProject.image && <Image src={editingProject.image} alt="Preview" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                        <div className="relative z-10 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                          {isUploading && uploadingField === "image" ? <Loader2 size={32} className="animate-spin text-primary" /> : <Upload size={32} className="text-primary" />}
                          <p className="font-black text-[10px] uppercase tracking-widest text-slate-900">Upload Image</p>
                        </div>
                        {!editingProject.image && (
                          <div className="flex flex-col items-center gap-3 text-slate-200">
                             <ImageIcon size={64} strokeWidth={1} />
                             <p className="font-black text-[10px] uppercase tracking-widest">Click to browse</p>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], "image")} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Project Status</label>
                          <div className="grid grid-cols-2 gap-2 p-2 bg-white rounded-2xl border border-slate-100">
                             {["Draft", "Published"].map(status => (
                               <button 
                                 key={status}
                                 onClick={() => setEditingProject({...editingProject, status})}
                                 className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                   editingProject.status === status ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "text-slate-400 hover:text-slate-900"
                                 }`}
                               >
                                 {status}
                               </button>
                             ))}
                          </div>
                       </div>
                       
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Live URL</label>
                          <div className="relative">
                            <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                              type="text" 
                              value={editingProject.live_link || ""}
                              placeholder="https://example.com"
                              onChange={(e) => setEditingProject({...editingProject, live_link: e.target.value})}
                              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:border-primary transition-all"
                            />
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Right Column: Detailed Info */}
                  <div className="lg:col-span-2 space-y-12">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Judul Project</label>
                           <input 
                              type="text" 
                              value={editingProject.title}
                              onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                              className="w-full px-8 py-5 bg-white border border-slate-200 rounded-[2rem] outline-none font-black text-xl focus:border-primary transition-all shadow-sm"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Slug URL</label>
                           <input 
                              type="text" 
                              value={editingProject.slug}
                              onChange={(e) => setEditingProject({...editingProject, slug: e.target.value})}
                              placeholder="wonderful-toba"
                              className="w-full px-8 py-5 bg-white border border-slate-200 rounded-[2rem] outline-none font-bold text-lg focus:border-primary transition-all shadow-sm"
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Kategori</label>
                           <select 
                             value={editingProject.category}
                             onChange={(e) => setEditingProject({...editingProject, category: e.target.value})}
                             className="w-full px-6 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-primary appearance-none"
                           >
                             {["UMKM", "School", "Travel", "Business"].map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Client Name</label>
                           <input 
                              type="text" 
                              value={editingProject.client_name || ""}
                              onChange={(e) => setEditingProject({...editingProject, client_name: e.target.value})}
                              className="w-full px-6 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-primary"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Project Date</label>
                           <input 
                              type="text" 
                              value={editingProject.project_date || ""}
                              placeholder="Maret 2024"
                              onChange={(e) => setEditingProject({...editingProject, project_date: e.target.value})}
                              className="w-full px-6 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-primary"
                           />
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Deskripsi Project</label>
                           <textarea 
                              value={editingProject.description}
                              onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                              className="w-full px-8 py-6 bg-white border border-slate-200 rounded-[2.5rem] outline-none font-medium text-lg focus:border-primary h-40 transition-all shadow-sm"
                           />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">The Challenge</label>
                              <textarea 
                                 value={editingProject.challenge}
                                 onChange={(e) => setEditingProject({...editingProject, challenge: e.target.value})}
                                 className="w-full px-6 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-medium text-sm focus:border-primary h-32 transition-all shadow-sm"
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">The Solution</label>
                              <textarea 
                                 value={editingProject.solution}
                                 onChange={(e) => setEditingProject({...editingProject, solution: e.target.value})}
                                 className="w-full px-6 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-medium text-sm focus:border-primary h-32 transition-all shadow-sm"
                              />
                           </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center px-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Results (Key Outcome)</label>
                             <button 
                               onClick={() => setEditingProject({...editingProject, results: [...(editingProject.results || []), "Hasil baru..."]})}
                               className="text-xs font-black uppercase text-primary hover:underline"
                             >
                               + Add Result
                             </button>
                          </div>
                          <div className="space-y-3">
                             {(editingProject.results || []).map((res, idx) => (
                               <div key={idx} className="flex gap-4">
                                  <input 
                                    value={res}
                                    onChange={(e) => {
                                      const newRes = [...editingProject.results];
                                      newRes[idx] = e.target.value;
                                      setEditingProject({...editingProject, results: newRes});
                                    }}
                                    className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-sm focus:bg-white focus:border-primary transition-all"
                                  />
                                  <button 
                                    onClick={() => {
                                      const newRes = editingProject.results.filter((_, i) => i !== idx);
                                      setEditingProject({...editingProject, results: newRes});
                                    }}
                                    className="p-4 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                               </div>
                             ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Tech Stack (Separated by Comma)</label>
                          <input 
                             type="text" 
                             value={(editingProject.tech_stack || []).join(", ")}
                             onChange={(e) => setEditingProject({...editingProject, tech_stack: e.target.value.split(",").map(s => s.trim())})}
                             placeholder="Next.js, Tailwind, Prisma, Supabase"
                             className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-black text-lg focus:border-primary transition-all shadow-sm"
                          />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-6">
               <button 
                 onClick={() => setEditingProject(null)}
                 className="px-12 py-5 bg-white border border-slate-200 text-slate-600 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all shadow-sm"
               >
                 Batal
               </button>
               <button 
                 onClick={handleSaveProject}
                 disabled={isSaving}
                 className="px-16 py-5 bg-primary text-on-primary rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 disabled:opacity-50"
               >
                 {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                 {isSaving ? "Publishing..." : "Simpan Project"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
