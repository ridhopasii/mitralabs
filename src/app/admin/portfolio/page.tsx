"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, ExternalLink, Filter, Grid, List, Briefcase } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function PortfolioCMS() {
  const { data, updateProjects } = useData();
  const { projects } = data;
  const [view, setView] = useState<"grid" | "list">("grid");

  const deleteProject = (id: number) => {
    if (confirm("Hapus project dari portfolio?")) {
      updateProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4 bg-surface-container-lowest p-3 rounded-2xl border border-surface-container-highest shadow-sm">
          <button 
            onClick={() => setView("grid")}
            className={`p-3 rounded-xl transition-all ${view === "grid" ? "bg-primary text-on-primary shadow-lg" : "text-on-surface-variant hover:bg-surface-container"}`}
          >
            <Grid size={20} />
          </button>
          <button 
            onClick={() => setView("list")}
            className={`p-3 rounded-xl transition-all ${view === "list" ? "bg-primary text-on-primary shadow-lg" : "text-on-surface-variant hover:bg-surface-container"}`}
          >
            <List size={20} />
          </button>
          <div className="w-px h-8 bg-surface-container-highest mx-2"></div>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all">
            <Filter size={16} /> Filter
          </button>
        </div>
        <button 
          className="bg-primary text-on-primary px-8 py-5 rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.98] transition-all"
        >
          <Plus size={24} />
          Upload Project Baru
        </button>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="group bg-surface-container-lowest rounded-[2.5rem] overflow-hidden shadow-premium border border-surface-container-highest transition-all hover:translate-y-[-8px]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                  <div className="flex gap-3">
                    <button className="flex-1 py-4 bg-white/20 backdrop-blur-md text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/30 transition-all border border-white/10">
                      View Site
                    </button>
                    <button className="p-4 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition-all border border-white/10">
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </div>
                <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                  project.status === "Published" ? "bg-green-500 text-white" : "bg-orange-500 text-white"
                }`}>
                  {project.status}
                </div>
              </div>
              <div className="p-10">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{project.category}</span>
                <h3 className="text-2xl font-black mt-2 mb-8 tracking-tight leading-tight">{project.title}</h3>
                <div className="flex gap-3 pt-8 border-t border-surface-container-highest">
                  <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary/5 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all">
                    <Edit2 size={16} /> Edit
                  </button>
                  <button 
                    onClick={() => deleteProject(project.id)}
                    className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Card */}
          <button className="border-4 border-dashed border-surface-container-highest rounded-[2.5rem] flex flex-col items-center justify-center p-12 group hover:border-primary/40 hover:bg-primary/5 transition-all min-h-[450px]">
            <div className="w-20 h-20 bg-surface-container rounded-[2rem] flex items-center justify-center text-on-surface-variant mb-6 group-hover:bg-primary group-hover:text-on-primary transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-primary/20">
              <Plus size={40} />
            </div>
            <p className="font-black text-xl text-on-surface-variant group-hover:text-primary transition-all tracking-tight">Upload New Project</p>
            <p className="text-xs text-on-surface-variant/40 font-bold mt-2">Max file size: 5MB</p>
          </button>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-[2.5rem] shadow-premium border border-surface-container-highest overflow-hidden">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">
                  <th className="px-10 py-8">Project</th>
                  <th className="px-10 py-8">Category</th>
                  <th className="px-10 py-8">Status</th>
                  <th className="px-10 py-8 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <img src={p.image} className="w-12 h-12 rounded-xl object-cover" />
                        <span className="font-black text-lg">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-[10px] font-bold uppercase tracking-widest">{p.category}</span>
                    </td>
                    <td className="px-10 py-6 font-bold text-sm text-green-600">{p.status}</td>
                    <td className="px-10 py-6 text-right">
                       <div className="flex justify-end gap-2">
                        <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><Edit2 size={16} /></button>
                        <button onClick={() => deleteProject(p.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"><Trash2 size={16} /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
}
