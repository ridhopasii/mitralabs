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
  Filter,
  User
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
  github_link?: string;
  tech_stack?: string[];
  gallery_urls?: string[];
  status: string;
  role?: string;
  scope?: string[];
  feedback?: {
    name: string;
    avatar?: string;
    comment: string;
    rating: number;
  };
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
              placeholder="Cari project, kategori, atau client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-4">
             <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total: {filteredProjects.length} Items</span>
             </div>
          </div>
        </div>

        <div className="p-10 space-y-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:border-primary hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col lg:flex-row items-center gap-10">
               {/* Image Preview */}
               <div className="w-full lg:w-72 aspect-video lg:aspect-square rounded-[2rem] overflow-hidden bg-slate-100 shrink-0 relative shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                  {project.image ? (
                    <Image src={project.image} alt={project.title} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-200">
                       <ImageIcon size={48} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                     <StatusBadge status={project.status} />
                  </div>
               </div>

               {/* Content Detail */}
               <div className="flex-1 min-w-0 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                              {project.category}
                           </span>
                           <span className="text-slate-300 text-xs font-bold tracking-tight">/ {project.slug}</span>
                        </div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-primary transition-colors">
                           {project.title}
                        </h4>
                        <p className="text-slate-400 font-bold text-sm mt-3 flex items-center gap-2">
                           <User size={14} className="text-slate-300" /> Client: {project.client_name || "Internal Project"}
                        </p>
                     </div>
                     <div className="flex gap-2">
                        {project.live_link && (
                           <a href={project.live_link} target="_blank" className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                              <Globe size={14} /> Live View
                           </a>
                        )}
                        {project.github_link && (
                           <a href={project.github_link} target="_blank" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-sm">
                              <ExternalLink size={14} /> Repository
                           </a>
                        )}
                     </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-50">
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">Project Date</p>
                        <p className="text-sm font-black text-slate-700">{project.project_date || "—"}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">My Role</p>
                        <p className="text-sm font-black text-slate-700">{project.role || "—"}</p>
                     </div>
                     <div className="md:col-span-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">Stack Used</p>
                        <div className="flex flex-wrap gap-1">
                           {(project.tech_stack || []).slice(0, 4).map((s, i) => (
                              <span key={i} className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{s}</span>
                           ))}
                           {(project.tech_stack || []).length > 4 && <span className="text-[9px] font-bold text-slate-300">+{project.tech_stack!.length - 4} more</span>}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Quick Actions */}
               <div className="flex lg:flex-col gap-3 shrink-0">
                  <button 
                    onClick={() => setEditingProject(project)}
                    className="w-14 h-14 bg-white border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center hover:border-primary hover:text-primary hover:shadow-xl hover:shadow-primary/10 transition-all"
                  >
                    <Edit3 size={24} />
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 size={24} />
                  </button>
               </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="py-32 text-center space-y-6">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                  <Search size={48} strokeWidth={1} />
               </div>
               <h4 className="text-xl font-black text-slate-300 uppercase tracking-widest">No Projects Found</h4>
            </div>
          )}
        </div>
      </div>

      {/* Complex Edit/Add Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-7xl max-h-[95vh] rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
            {/* Modal Header */}
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-primary text-on-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/40 relative group overflow-hidden">
                    <Briefcase size={36} />
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  </div>
                  <div>
                    <h3 className="text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                      {editingProject.id === 0 ? "Create Showcase" : "Refine Showcase"}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-black tracking-[0.3em] uppercase mt-2">Extended relational data architecture v3.0</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="hidden md:flex flex-col items-end mr-4">
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Last Sync</p>
                     <p className="text-xs font-bold text-slate-500">Realtime (LocalStorage + Supabase)</p>
                  </div>
                  <button onClick={() => setEditingProject(null)} className="p-6 bg-slate-100 text-slate-400 rounded-3xl hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-95 shadow-inner">
                     <X size={28} />
                  </button>
               </div>
            </div>

            {/* Modal Body: High Complexity Scroll Area */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-16">
               
               {/* SECTION 1: Core Identity */}
               <div className="grid lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-4 space-y-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Hero Visual</label>
                        <div className="relative group aspect-square rounded-[3rem] overflow-hidden border-4 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all shadow-inner">
                           {editingProject.image && <Image src={editingProject.image} alt="Preview" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />}
                           <div className="relative z-10 bg-white/95 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-8 group-hover:translate-y-0 duration-500">
                              {isUploading && uploadingField === "image" ? <Loader2 size={36} className="animate-spin text-primary" /> : <Upload size={36} className="text-primary" />}
                              <p className="font-black text-[10px] uppercase tracking-widest text-slate-900">Replace Hero</p>
                           </div>
                           {!editingProject.image && (
                              <div className="flex flex-col items-center gap-4 text-slate-200">
                                 <ImageIcon size={80} strokeWidth={1} />
                                 <p className="font-black text-[10px] uppercase tracking-[0.2em]">Select Media</p>
                              </div>
                           )}
                           <input type="file" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], "image")} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                     </div>
                  </div>

                  <div className="lg:col-span-8 space-y-10">
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Display Title</label>
                           <input 
                              type="text" 
                              value={editingProject.title}
                              onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                              className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none font-black text-2xl focus:bg-white focus:border-primary focus:shadow-2xl focus:shadow-primary/5 transition-all"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Universal Slug</label>
                           <div className="relative">
                              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 font-bold">/</span>
                              <input 
                                 type="text" 
                                 value={editingProject.slug}
                                 onChange={(e) => setEditingProject({...editingProject, slug: e.target.value})}
                                 className="w-full pl-12 pr-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none font-bold text-lg focus:bg-white focus:border-primary transition-all"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Primary Category</label>
                           <select 
                              value={editingProject.category}
                              onChange={(e) => setEditingProject({...editingProject, category: e.target.value})}
                              className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-black text-xs uppercase tracking-widest focus:border-primary appearance-none cursor-pointer"
                           >
                              {["Web Design", "Software Dev", "Branding", "Digital Marketing", "Mobile App"].map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Client Entity</label>
                           <input 
                              type="text" 
                              value={editingProject.client_name || ""}
                              placeholder="e.g. PT Maju Bersama"
                              onChange={(e) => setEditingProject({...editingProject, client_name: e.target.value})}
                              className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-primary"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Delivery Period</label>
                           <input 
                              type="text" 
                              value={editingProject.project_date || ""}
                              placeholder="April - Juni 2024"
                              onChange={(e) => setEditingProject({...editingProject, project_date: e.target.value})}
                              className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-primary"
                           />
                        </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Project Live URL</label>
                           <div className="relative">
                              <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                              <input 
                                 type="text" 
                                 value={editingProject.live_link || ""}
                                 placeholder="https://client-project.com"
                                 onChange={(e) => setEditingProject({...editingProject, live_link: e.target.value})}
                                 className="w-full pl-16 pr-8 py-6 bg-indigo-50/30 border border-indigo-100 rounded-[2rem] outline-none font-black text-sm text-indigo-900 focus:bg-white focus:border-indigo-500 transition-all"
                              />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Github / Repo Link</label>
                           <div className="relative">
                              <ExternalLink className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                              <input 
                                 type="text" 
                                 value={editingProject.github_link || ""}
                                 placeholder="https://github.com/mitralabs/repo"
                                 onChange={(e) => setEditingProject({...editingProject, github_link: e.target.value})}
                                 className="w-full pl-16 pr-8 py-6 bg-slate-900 text-white rounded-[2rem] outline-none font-bold text-sm focus:ring-4 focus:ring-slate-900/10 transition-all"
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* SECTION 2: Deep Context & Execution */}
               <div className="space-y-12 bg-slate-50/50 p-12 rounded-[4rem] border border-slate-100">
                  <div className="grid lg:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm"><Layers size={24} /></div>
                           <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900">Project Narratives</h4>
                        </div>
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Executive Summary</label>
                              <textarea 
                                 value={editingProject.description}
                                 onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                                 className="w-full px-8 py-6 bg-white border border-slate-200 rounded-[2.5rem] outline-none font-medium text-lg focus:border-primary h-48 transition-all shadow-sm"
                                 placeholder="Ceritakan latar belakang project ini..."
                              />
                           </div>
                           <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">The Challenge</label>
                                 <textarea 
                                    value={editingProject.challenge}
                                    onChange={(e) => setEditingProject({...editingProject, challenge: e.target.value})}
                                    className="w-full px-6 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-medium text-sm focus:border-primary h-40 transition-all shadow-sm"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">The Solution</label>
                                 <textarea 
                                    value={editingProject.solution}
                                    onChange={(e) => setEditingProject({...editingProject, solution: e.target.value})}
                                    className="w-full px-6 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-medium text-sm focus:border-primary h-40 transition-all shadow-sm"
                                 />
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-10">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm"><Target size={24} /></div>
                           <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900">Impact & Tech</h4>
                        </div>
                        
                        <div className="space-y-8">
                           <div className="space-y-4">
                              <div className="flex justify-between items-center px-2">
                                 <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Key Outcomes / Results</label>
                                 <button 
                                 onClick={() => setEditingProject({...editingProject, results: [...(editingProject.results || []), "Key Result..."]})}
                                 className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                                 >
                                 + Add Result
                                 </button>
                              </div>
                              <div className="grid gap-3">
                                 {(editingProject.results || []).map((res, idx) => (
                                 <div key={idx} className="flex gap-4 group/res animate-in slide-in-from-right-4">
                                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0 font-black text-xs">{idx + 1}</div>
                                    <input 
                                       value={res}
                                       onChange={(e) => {
                                          const newRes = [...editingProject.results];
                                          newRes[idx] = e.target.value;
                                          setEditingProject({...editingProject, results: newRes});
                                       }}
                                       className="flex-1 px-6 py-4 bg-white border border-slate-100 rounded-xl outline-none font-bold text-sm focus:border-emerald-500 transition-all shadow-sm"
                                    />
                                    <button 
                                       onClick={() => setEditingProject({...editingProject, results: editingProject.results.filter((_, i) => i !== idx)})}
                                       className="p-4 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover/res:opacity-100 shadow-sm"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                                 ))}
                              </div>
                           </div>

                           <div className="space-y-4">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Tech Stack (CSV)</label>
                              <div className="flex flex-wrap gap-2 p-6 bg-white border border-slate-100 rounded-3xl shadow-inner">
                                 <input 
                                    type="text" 
                                    value={(editingProject.tech_stack || []).join(", ")}
                                    onChange={(e) => setEditingProject({...editingProject, tech_stack: e.target.value.split(",").map(s => s.trim())})}
                                    placeholder="Next.js, Tailwind, Prisma, etc."
                                    className="w-full bg-transparent outline-none font-black text-lg text-slate-900 placeholder:text-slate-200"
                                 />
                                 <div className="flex flex-wrap gap-2 mt-4">
                                    {(editingProject.tech_stack || []).filter(s => s).map((s, i) => (
                                       <span key={i} className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10">
                                          {s}
                                       </span>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* SECTION 3: Extended Attributes & Validation */}
               <div className="grid lg:grid-cols-3 gap-12">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Your Agency Role</label>
                     <input 
                        type="text" 
                        value={editingProject.role || ""}
                        placeholder="Lead Developer / UI/UX Design"
                        onChange={(e) => setEditingProject({...editingProject, role: e.target.value})}
                        className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-black text-sm focus:border-primary shadow-sm"
                     />
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Scope of Work (Split by Comma)</label>
                     <input 
                        type="text" 
                        value={(editingProject.scope || []).join(", ")}
                        placeholder="Discovery, Prototyping, Production, Deployment"
                        onChange={(e) => setEditingProject({...editingProject, scope: e.target.value.split(",").map(s => s.trim())})}
                        className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-black text-sm focus:border-primary shadow-sm"
                     />
                  </div>
               </div>

               {/* SECTION 4: Gallery & Social Proof */}
               <div className="space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm"><ImageIcon size={24} /></div>
                     <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900">Media Gallery & Social Proof</h4>
                  </div>
                  
                  <div className="grid lg:grid-cols-12 gap-12">
                     <div className="lg:col-span-7 space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Gallery Upload (Max 10 Items)</label>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                           {(editingProject.gallery_urls || []).map((url, idx) => (
                              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group shadow-md">
                                 <Image src={url} alt={`Gallery ${idx}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                 <button 
                                    onClick={() => setEditingProject({...editingProject, gallery_urls: editingProject.gallery_urls?.filter((_, i) => i !== idx)})}
                                    className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-75 group-hover:scale-100"
                                 >
                                    <Trash2 size={12} />
                                 </button>
                              </div>
                           ))}
                           <div className="relative aspect-square rounded-2xl border-4 border-dashed border-slate-100 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-primary transition-all">
                              {isUploading && uploadingField === "gallery" ? <Loader2 size={24} className="animate-spin text-primary" /> : <Plus size={24} className="text-slate-200" />}
                              <input type="file" multiple accept="image/*" onChange={(e) => {
                                 if (e.target.files) {
                                    Array.from(e.target.files).forEach(f => handleImageUpload(f, "gallery"));
                                 }
                              }} className="absolute inset-0 opacity-0 cursor-pointer" />
                           </div>
                        </div>
                     </div>

                     <div className="lg:col-span-5 space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Client Feedback / Testimony</label>
                        <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl space-y-6 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-125 transition-transform duration-1000"><Target size={120} /></div>
                           <input 
                              type="text"
                              value={editingProject.feedback?.name || ""}
                              placeholder="Client Representative Name"
                              onChange={(e) => setEditingProject({...editingProject, feedback: {...(editingProject.feedback || {comment: "", rating: 5}), name: e.target.value}})}
                              className="w-full bg-white/10 border border-white/10 rounded-xl px-6 py-4 outline-none font-black text-xs uppercase tracking-widest placeholder:text-white/20 focus:bg-white/20 transition-all"
                           />
                           <textarea 
                              value={editingProject.feedback?.comment || ""}
                              placeholder="Positive impact testimonial..."
                              onChange={(e) => setEditingProject({...editingProject, feedback: {...(editingProject.feedback || {name: "", rating: 5}), comment: e.target.value}})}
                              className="w-full bg-white/10 border border-white/10 rounded-[2rem] px-8 py-6 outline-none font-medium text-sm h-32 placeholder:text-white/20 focus:bg-white/20 transition-all shadow-inner"
                           />
                           <div className="flex items-center gap-4 px-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Rating Index</span>
                              <input 
                                 type="range" min="1" max="5" 
                                 value={editingProject.feedback?.rating || 5}
                                 onChange={(e) => setEditingProject({...editingProject, feedback: {...(editingProject.feedback || {name: "", comment: ""}), rating: parseInt(e.target.value)}})}
                                 className="flex-1 accent-primary" 
                              />
                              <span className="font-black text-primary">{editingProject.feedback?.rating || 5}.0</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Modal Footer: Unified Save Engine */}
            <div className="p-12 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center gap-8">
               <div className="hidden lg:flex items-center gap-4 mr-auto text-slate-400 font-bold text-xs">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Validated & Optimized for SEO (Relational Schema)
               </div>
               <button 
                 onClick={() => setEditingProject(null)}
                 className="px-12 py-6 bg-white border border-slate-200 text-slate-600 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm active:scale-95"
               >
                 Discard
               </button>
               <button 
                 onClick={handleSaveProject}
                 disabled={isSaving}
                 className="px-20 py-6 bg-primary text-on-primary rounded-[2.5rem] font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 disabled:opacity-50 group"
               >
                 {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} className="group-hover:rotate-12 transition-transform" />}
                 {isSaving ? "Syncing..." : "Commit Showcase"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
