"use client";

import { useState, useEffect } from "react";
import { useData, Project } from "@/context/DataContext";
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
  Edit3,
  X,
  Globe,
  Tag,
  Calendar,
  Layers,
  ChevronRight,
  Filter,
  User,
  Clock,
  Settings,
  Zap
} from "lucide-react";
import { uploadImage } from "@/lib/supabase";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function PortfolioCMS() {
  const { data, updateData } = useData();
  const [projects, setProjects] = useState<Project[]>(data.portfolio.projects);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("identity");

  useEffect(() => {
    setProjects(data.portfolio.projects);
  }, [data.portfolio.projects]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  const handleSaveProject = () => {
    if (!editingProject) return;
    setIsSaving(true);
    
    const finalProject = {
      ...editingProject,
      slug: editingProject.slug || generateSlug(editingProject.title)
    };
    
    const newProjects = projects.some(p => p.id === finalProject.id)
      ? projects.map(p => p.id === finalProject.id ? finalProject : p)
      : [{ ...finalProject, id: Date.now() }, ...projects];

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

  return (
    <div className="space-y-10 pb-20">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-10 right-10 z-[300] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 font-bold border border-white/10"
          >
            <CheckCircle2 size={24} className="text-primary" />
            Portfolio Synchronized Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 leading-none">Portfolio Hub.</h2>
          <p className="text-slate-400 font-medium mt-3 text-lg">Kelola pengerjaan project dan katalog digital dengan kontrol penuh.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="relative group flex-grow md:flex-grow-0">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Cari project..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-primary/30 font-bold text-sm w-full md:w-80 transition-all shadow-sm"
              />
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
            className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-4 hover:opacity-90 active:scale-95 transition-all shadow-xl"
          >
            <Plus size={20} /> Create Project
          </button>
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white border border-slate-200/60 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">Project Details</th>
                <th className="px-10 py-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">Categorization</th>
                <th className="px-10 py-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">Visibility</th>
                <th className="px-10 py-8 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">Operational</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 relative shrink-0">
                        {project.image ? (
                          <Image src={project.image} alt={project.title} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-200">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 tracking-tight leading-none mb-1.5">{project.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">/{project.slug || "no-slug"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                     <span className="px-4 py-1.5 bg-slate-50 text-slate-600 text-[9px] font-bold uppercase tracking-widest rounded-full border border-slate-100">
                        {project.category}
                     </span>
                  </td>
                  <td className="px-10 py-8">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => { setEditingProject(project); setActiveTab("identity"); }}
                        className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-primary hover:border-primary transition-all shadow-sm"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)}
                        className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-rose-500 hover:border-rose-500 transition-all shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Project Console Modal */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProject(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 20 }}
              className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative z-10 border border-slate-200"
            >
              {/* Modal Header */}
              <div className="p-8 lg:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <Settings size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
                        {editingProject.id === 0 ? "Project Blueprint" : "Advanced Project Console"}
                      </h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1 flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-primary" /> Master Data Controller v3.0
                      </p>
                    </div>
                 </div>
                 <button onClick={() => setEditingProject(null)} className="p-3 text-slate-400 hover:text-slate-900 transition-all bg-white border border-slate-200 rounded-xl">
                    <X size={20} />
                 </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                  {/* Modal Sidebar */}
                  <div className="lg:w-64 border-r border-slate-100 p-8 bg-slate-50/30 space-y-2 shrink-0 overflow-y-auto">
                     <p className="px-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Configuration Clusters</p>
                     {[
                       { id: "identity", label: "Identity", icon: User },
                       { id: "content", label: "Narrative", icon: Target },
                       { id: "media", label: "Media Hub", icon: ImageIcon },
                       { id: "technical", label: "Logical", icon: Layers }
                     ].map((tab) => (
                       <button 
                        key={tab.id} 
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-5 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-4 ${activeTab === tab.id ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" : "text-slate-500 hover:bg-white hover:text-slate-900"}`}
                       >
                         <tab.icon size={16} /> {tab.label}
                       </button>
                     ))}
                  </div>

                  {/* Form Content Area */}
                  <div className="flex-1 overflow-y-auto p-10 lg:p-14 custom-scrollbar bg-white">
                    {activeTab === "identity" && (
                      <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-2">
                           <h4 className="text-lg font-bold text-slate-900">Project Identity Matrix</h4>
                           <p className="text-xs text-slate-400 font-medium">Define the core metadata and public identifiers for this deployment.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-3">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Display Title</label>
                             <input 
                                type="text" 
                                value={editingProject.title}
                                onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-lg focus:border-primary/50 focus:bg-white transition-all"
                                placeholder="Enter project name..."
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Permanent Link Slug</label>
                             <div className="relative group">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-sm">/</span>
                                <input 
                                  type="text" 
                                  value={editingProject.slug}
                                  onChange={(e) => setEditingProject({...editingProject, slug: e.target.value})}
                                  className="w-full pl-10 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-primary/50 focus:bg-white transition-all text-primary"
                                  placeholder="unique-project-slug"
                                />
                                <button 
                                  onClick={() => setEditingProject({...editingProject, slug: generateSlug(editingProject.title)})}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-primary transition-all"
                                  title="Auto-generate from title"
                                >
                                  <Zap size={14} />
                                </button>
                             </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Market Sector</label>
                              <select 
                                 value={editingProject.category}
                                 onChange={(e) => setEditingProject({...editingProject, category: e.target.value})}
                                 className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-[11px] uppercase tracking-widest appearance-none cursor-pointer focus:border-primary/50"
                              >
                                 {["UMKM", "School", "Travel", "Business", "E-commerce", "Health", "Tech"].map(c => <option key={c} value={c}>{c} Sector</option>)}
                              </select>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Visibility State</label>
                              <select 
                                 value={editingProject.status}
                                 onChange={(e) => setEditingProject({...editingProject, status: e.target.value})}
                                 className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-[11px] uppercase tracking-widest appearance-none cursor-pointer focus:border-emerald-500 text-emerald-600"
                              >
                                 <option value="Draft">Restricted (Draft)</option>
                                 <option value="Published">Public Deployment</option>
                              </select>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Stakeholder</label>
                              <input 
                                 type="text" 
                                 value={editingProject.client_name || ""}
                                 onChange={(e) => setEditingProject({...editingProject, client_name: e.target.value})}
                                 className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-primary/50"
                                 placeholder="Client Name"
                              />
                           </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "content" && (
                      <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-3">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Executive Case Narrative</label>
                           <textarea 
                              value={editingProject.description}
                              onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                              className="w-full px-8 py-8 bg-slate-50 border border-slate-200 rounded-3xl outline-none font-medium text-lg leading-relaxed focus:border-primary/50 focus:bg-white h-64 transition-all resize-none"
                              placeholder="Describe the project journey..."
                           />
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">The Strategic Challenge</label>
                              <textarea 
                                value={editingProject.challenge || ""}
                                onChange={(e) => setEditingProject({...editingProject, challenge: e.target.value})}
                                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm h-32"
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">The Innovation / Solution</label>
                              <textarea 
                                value={editingProject.solution || ""}
                                onChange={(e) => setEditingProject({...editingProject, solution: e.target.value})}
                                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm h-32"
                              />
                           </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "media" && (
                      <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-4">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Featured Master Media (Cover)</label>
                           <div className="relative aspect-[21/9] rounded-[2rem] overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all group">
                              {editingProject.image && <Image src={editingProject.image} alt="Hero" fill className="object-cover" />}
                              <div className="relative z-10 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-xl flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                 {isUploading && uploadingField === "image" ? <Loader2 size={16} className="animate-spin text-primary" /> : <Upload size={16} className="text-primary" />}
                                 <span className="font-bold text-[10px] uppercase tracking-widest">Update Master Asset</span>
                              </div>
                              <input type="file" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], "image")} className="absolute inset-0 opacity-0 cursor-pointer" />
                           </div>
                        </div>
                        
                        <div className="space-y-6">
                           <div className="flex justify-between items-center">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Project Evidence Gallery</label>
                              <label className="cursor-pointer px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all">
                                 Add Images
                                 <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                                    if (e.target.files) Array.from(e.target.files).forEach(f => handleImageUpload(f, "gallery"));
                                 }} />
                              </label>
                           </div>
                           <div className="grid grid-cols-4 lg:grid-cols-5 gap-6">
                              {(editingProject.gallery_urls || []).map((url, idx) => (
                                 <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm">
                                    <Image src={url} alt="Gallery" fill className="object-cover" />
                                    <button 
                                       onClick={() => setEditingProject({...editingProject, gallery_urls: editingProject.gallery_urls?.filter((_, i) => i !== idx)})}
                                       className="absolute inset-0 bg-rose-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                                    >
                                       <Trash2 size={24} />
                                    </button>
                                 </div>
                              ))}
                              <label className="relative aspect-square rounded-2xl border-2 border-slate-100 border-dashed flex items-center justify-center text-slate-200 hover:text-primary hover:border-primary/50 transition-all cursor-pointer">
                                 <Plus size={32} />
                                 <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                                    if (e.target.files) Array.from(e.target.files).forEach(f => handleImageUpload(f, "gallery"));
                                 }} />
                              </label>
                           </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "technical" && (
                      <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid md:grid-cols-2 gap-10">
                           <div className="space-y-4">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Logic Environment Link</label>
                              <div className="relative">
                                 <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                 <input 
                                    type="text" 
                                    value={editingProject.live_link || ""}
                                    onChange={(e) => setEditingProject({...editingProject, live_link: e.target.value})}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-primary/50 text-primary"
                                    placeholder="https://example.com"
                                 />
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Integrated Technologies</label>
                              <input 
                                 type="text" 
                                 value={(editingProject.tech_stack || []).join(", ")}
                                 onChange={(e) => setEditingProject({...editingProject, tech_stack: e.target.value.split(",").map(t => t.trim())})}
                                 className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm"
                                 placeholder="React, Next.js, PostgreSQL..."
                              />
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div className="flex justify-between items-center">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Success Benchmarks (Results)</label>
                              <button 
                                onClick={() => setEditingProject({...editingProject, results: [...(editingProject.results || []), ""]})}
                                className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline"
                              >
                                Add Benchmark
                              </button>
                           </div>
                           <div className="space-y-3">
                              {(editingProject.results || []).map((res, idx) => (
                                 <div key={idx} className="flex gap-4 items-center">
                                    <input 
                                       value={res}
                                       onChange={(e) => {
                                          const newRes = [...editingProject.results];
                                          newRes[idx] = e.target.value;
                                          setEditingProject({...editingProject, results: newRes});
                                       }}
                                       className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium text-sm focus:bg-white"
                                       placeholder="e.g. 50% increase in traffic"
                                    />
                                    <button 
                                       onClick={() => setEditingProject({...editingProject, results: editingProject.results.filter((_, i) => i !== idx)})} 
                                       className="p-3 text-slate-300 hover:text-rose-500 transition-colors"
                                    >
                                       <Trash2 size={18} />
                                    </button>
                                 </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 lg:p-10 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-6">
                 <button 
                   onClick={() => setEditingProject(null)}
                   className="px-10 py-4 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:text-slate-900 transition-all"
                 >
                   Discard
                 </button>
                 <button 
                   onClick={handleSaveProject}
                   disabled={isSaving}
                   className="px-16 py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                 >
                   {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                   {isSaving ? "Syncing..." : "Commit To Database"}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const StatusBadge = ({ status }: { status: string }) => {
  const isPublished = status === "Published";
  return (
    <div className="flex items-center gap-2.5">
       <div className={`w-2 h-2 rounded-full ${isPublished ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
       <span className={`text-[10px] font-bold uppercase tracking-widest ${
         isPublished ? "text-emerald-600" : "text-amber-600"
       }`}>
         {status}
       </span>
    </div>
  );
};
