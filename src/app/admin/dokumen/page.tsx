"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Search, 
  Plus, 
  FilePlus,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Filter,
  MoreVertical,
  Link as LinkIcon
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDokumenPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("ProjectFile")
        .select(`
          *,
          project:ClientProject (
            project_name,
            client:Client (full_name)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus dokumen ini secara permanen?")) return;
    try {
      const { error } = await supabase.from("ProjectFile").delete().eq("id", id);
      if (error) throw error;
      setFiles(files.filter(f => f.id !== id));
    } catch (error) {
      alert("Gagal menghapus file.");
    }
  };

  const filteredFiles = files.filter(f => 
    f.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.project?.project_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-900/10">
            <FileText size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Document Management</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-0.5">Contracts, Proposals & Assets</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-3.5 bg-slate-50 text-slate-600 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100">
            Template Manager
          </button>
          <button className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
            <FilePlus size={16} /> Upload New PDF
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: "Total Dokumen", val: files.length, icon: FileText, color: "text-blue-500" },
          { label: "Contracts Signed", val: "85%", icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Pending Review", val: 3, icon: Loader2, color: "text-amber-500" },
          { label: "Storage Used", val: "1.2 GB", icon: Upload, color: "text-slate-400" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-xl font-bold text-slate-900">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text"
            placeholder="Search documents by name or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-4 bg-slate-50 border-none rounded-2xl outline-none font-semibold text-sm focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center gap-2 px-4 border-l border-slate-100 hidden md:flex">
          <Filter size={18} className="text-slate-300" />
          <select className="bg-transparent font-bold text-xs uppercase tracking-widest text-slate-500 outline-none cursor-pointer">
            <option>All Types</option>
            <option>PDF Only</option>
            <option>Images</option>
          </select>
        </div>
      </div>

      {/* File List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-10 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">File Description</th>
              <th className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Linked Project</th>
              <th className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Format</th>
              <th className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Size</th>
              <th className="px-10 py-6 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <Loader2 className="w-8 h-8 text-slate-200 animate-spin mx-auto mb-4" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scanning Repository...</p>
                </td>
              </tr>
            ) : filteredFiles.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <p className="text-slate-400 font-bold text-sm italic">No records found in this vault.</p>
                </td>
              </tr>
            ) : (
              filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:text-red-500 transition-colors">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 leading-none mb-1.5">{file.filename}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-1.5">
                          <CheckCircle2 size={10} className="text-emerald-500" /> Verified Document
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {file.project ? (
                      <div className="space-y-1">
                        <p className="font-bold text-[13px] text-slate-900">{file.project.project_name}</p>
                        <p className="text-[10px] font-medium text-slate-400">{file.project.client?.full_name}</p>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Global Template</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-50 text-slate-400 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest">
                      {file.file_type || 'PDF'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[11px] font-bold text-slate-400">
                      {(file.file_size / 1024).toFixed(1)} KB
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={file.file_url} 
                        target="_blank" 
                        className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                      >
                        <Download size={18} />
                      </a>
                      <button 
                        onClick={() => handleDelete(file.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Template Documents Section (Static Reference from @Dokumen) */}
      <div className="pt-10 border-t border-slate-200/60">
        <div className="mb-8">
           <h3 className="text-xl font-bold">Standard Templates</h3>
           <p className="text-sm font-medium text-slate-400">Essential business documents for Mitralabs operations.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
           {[
             { name: "Company Profile & Rate Card", size: "11 KB", tag: "Marketing" },
             { name: "Surat Penawaran Harga (SPH)", size: "10 KB", tag: "Sales" },
             { name: "Surat Perintah Kerja (SPK)", size: "12 KB", tag: "Legal" },
             { name: "Memorandum of Understanding (MoU)", size: "10 KB", tag: "Legal" },
             { name: "Berita Acara Serah Terima (BAST)", size: "11 KB", tag: "Operations" },
             { name: "Standard Operating Procedure (SOP)", size: "11 KB", tag: "Internal" },
           ].map((doc, i) => (
             <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all group">
               <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                   <FileText size={24} />
                 </div>
                 <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-slate-900 transition-colors">{doc.tag}</span>
               </div>
               <h4 className="font-bold text-slate-900 mb-2 leading-snug">{doc.name}</h4>
               <p className="text-[11px] font-bold text-slate-400 mb-6">{doc.size} • PDF Document</p>
               <button className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all">
                 <Download size={14} /> Download PDF
               </button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
