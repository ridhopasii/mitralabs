"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase, logActivity } from "@/lib/supabase";
import {
  FolderKanban, FileText, Upload, Calendar, CheckCircle2,
  ExternalLink, BarChart3, AlertCircle, RotateCcw, Link2, Download, Trash2, Send, Target
} from "lucide-react";

export default function ClientManagement() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progressVal, setProgressVal] = useState(0);
  const [updateMsg, setUpdateMsg] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchClientProjects();
  }, []);

  const fetchClientProjects = async () => {
    setIsLoading(true);
    // Real fetching from ClientProject table joined with Client
    const { data, error } = await supabase
      .from('ClientProject')
      .select('*, client:Client(*), updates:ProjectUpdate(*), files:ProjectFile(*)')
      .order('created_at', { ascending: false });

    if (data) setProjects(data);
    if (data && data.length > 0 && !activeProject) {
      setActiveProject(data[0]);
      setProgressVal(data[0].progress || 0);
    }
    setIsLoading(false);
  };

  const handleUpdateProgress = async () => {
    if (!activeProject || !updateMsg.trim()) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const adminName = user?.email || "Superadmin Mitralabs";

      // Update DB project progress
      await supabase.from('ClientProject').update({ progress: progressVal, updated_at: new Date().toISOString() }).eq('id', activeProject.id);

      // Catat di Jurnal Proyek khusus Klien
      await supabase.from('ProjectUpdate').insert([{
        project_id: activeProject.id,
        title: `Progres Terkini (Tahap ${progressVal}%)`,
        description: updateMsg,
        progress: progressVal,
        created_by: adminName
      }]);

      await logActivity("Distribusi Status Klien", `Proyek: ${activeProject.project_name} Naik -> ${progressVal}%`);

      setShowSuccess(true);
      setUpdateMsg("");
      fetchClientProjects();
      setActiveProject({...activeProject, progress: progressVal});
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (e: any) { alert("Sistem Error: " + e.message); }
  };

  const handleFileUpload = async (file: File) => {
    if (!activeProject) return;
    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      // Mengambil file lokal (.pdf, .zip dari lokal D:/5.RIDHO/1.BISNIS/MITRALABS/Dokumen)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `client_docs/${activeProject.id}/${fileName}`;

      // Transmisi ke Bucket Aset
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('mitralabs_assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('mitralabs_assets')
        .getPublicUrl(filePath);

      await supabase.from('ProjectFile').insert([{
        project_id: activeProject.id,
        filename: file.name,
        file_url: publicUrl,
        file_size: file.size,
        file_type: file.type,
        uploaded_by: user?.email || "Superadmin"
      }]);

      await logActivity("Transmit Dokumen Client", `Proyek: ${activeProject.project_name} File: ${file.name}`);

      fetchClientProjects();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (e: any) {
      alert("Transmisi Payload Gagal: " + e.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (fileID: number, fileUrl: string) => {
     if(!confirm("Musnahkan aset dari brankas enkripsi riwayat klien?")) return;
     try {
       await supabase.from('ProjectFile').delete().eq('id', fileID);
       // Optional: Hapus dari storage array jika terpisah logic-nya.
       fetchClientProjects();
     } catch (e) { console.error(e); }
  }

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
            Distribusi Payload ke Dasbor Klien Berhasil Sempurna!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900">Advanced Client Director</h2>
          <p className="text-slate-500 mt-2 font-medium">Monitoring KPI, Distribusi Dokumen Offline, & Kontrol Relasi Transparan Klien.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Kolom Indeks Proyek Aktif */}
        <div className="lg:col-span-1 border border-slate-200 rounded-[2.5rem] bg-white overflow-hidden shadow-xl shadow-slate-200/40 flex flex-col h-[850px]">
           <div className="p-8 border-b border-slate-100 bg-slate-50/50">
             <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><FolderKanban className="text-primary"/> Index Hubungan Kerja</h3>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Daftar Eksekusi Real-time</p>
           </div>

           <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
             {isLoading ? (
               <div className="p-10 flex justify-center"><RotateCcw className="animate-spin text-primary opacity-50" /></div>
             ) : projects.length === 0 ? (
               <div className="p-10 text-center text-slate-400 flex flex-col items-center">
                 <FolderKanban size={32} className="opacity-20 mb-3" />
                 <p className="font-bold text-sm">Tidak Ditemukan Proyek</p>
                 <p className="text-xs opacity-80 mt-1 pb-4">Tautkan proyek masuk dari menu Pemesanan (Booking) ke skema Klien.</p>
               </div>
             ) : projects.map(p => (
               <button
                 key={p.id}
                 onClick={() => { setActiveProject(p); setProgressVal(p.progress || 0); }}
                 className={`w-full text-left p-6 rounded-2xl transition-all border outline-none ${activeProject?.id === p.id ? 'bg-slate-900 text-white border-transparent shadow-lg shadow-slate-900/10' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}
               >
                 <div className="flex justify-between items-start mb-3">
                    <p className="font-bold text-base line-clamp-1">{p.project_name}</p>
                 </div>

                 <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-80">
                     <span>Deployment %</span>
                     <span>{p.progress}%</span>
                   </div>
                   <div className="w-full bg-slate-200/20 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-1000 rounded-full" style={{ width: `${p.progress}%` }}></div>
                   </div>
                 </div>

                 <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest mt-4 pt-4 border-t border-current flex items-center justify-between">
                   <span className="truncate pr-2">Klien: {p.client?.company_name || p.client?.full_name || 'Personal'}</span>
                   <span className="shrink-0">{p.files?.length || 0} Aset</span>
                 </p>
               </button>
             ))}
           </div>
        </div>

        {/* Kolom Console/Dashboard Eksternal */}
        <div className="lg:col-span-2 space-y-8">
           {activeProject ? (
             <motion.div initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} className="space-y-8">

                {/* Visual Progress Sinkronisasi Klien */}
                <div className="bg-white p-10 lg:p-12 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

                   <div className="flex items-start justify-between mb-2">
                     <h3 className="font-bold text-3xl text-slate-900 tracking-tight">{activeProject.project_name}</h3>
                     <span className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl border ${activeProject.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{activeProject.status}</span>
                   </div>

                   <p className="text-slate-500 font-medium mb-12 flex items-center gap-2">
                      <Link2 size={16}/> Dasbor interaktif terhubung langsung ke Portal: <strong className="text-slate-900 border-b border-primary/30 pb-0.5">{activeProject.client?.full_name} ({activeProject.client?.email})</strong>
                   </p>

                   <div className="space-y-8 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                      <div className="flex flex-col gap-2">
                         <div className="flex justify-between items-end">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 border border-slate-200 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                             Status Integrasi Koding (0 - 100%)
                           </label>
                           <span className="text-4xl font-extrabold text-primary tracking-tighter">{progressVal}<span className="text-2xl text-slate-300">%</span></span>
                         </div>
                         <input
                           type="range" min="0" max="100"
                           value={progressVal}
                           onChange={(e) => setProgressVal(parseInt(e.target.value))}
                           className="w-full mt-4 accent-primary h-4 rounded-full bg-slate-200 appearance-none cursor-pointer hover:bg-slate-300 transition-colors"
                         />
                      </div>

                      <div className="border border-slate-200 rounded-[1.5rem] p-3 pl-8 bg-white flex gap-4 shadow-sm focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                         <input
                           type="text"
                           value={updateMsg}
                           onChange={(e)=>setUpdateMsg(e.target.value)}
                           placeholder="Laporkan update kepada klien secara real-time... (Contoh: Fitur API sudah terpasang sempurna)"
                           className="flex-1 bg-transparent outline-none font-bold text-sm text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
                         />
                         <button
                           onClick={handleUpdateProgress}
                           disabled={!updateMsg.trim()}
                           className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-3 shadow-md"
                         >
                           <Send size={16}/> Distribusikan KPI
                         </button>
                      </div>
                   </div>
                </div>

                {/* Serah Terima Dokumen (Manajemen File Offline ke Cloud) */}
                <div className="bg-white p-10 lg:p-12 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
                   <div className="flex justify-between items-center mb-10 pb-8 border-b border-slate-100">
                      <div>
                        <h3 className="font-bold text-2xl tracking-tight text-slate-900 flex items-center gap-3"><FileText className="text-primary"/> Cloud Dokumen Client</h3>
                        <p className="text-sm text-slate-500 font-medium mt-2">Unggah kontrak, berkas rilis `.zip`, laporan pajak, dari lokal (D:/...) menuju portal Brankas Aset Klien.</p>
                      </div>

                      <label className="cursor-pointer px-8 py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-primary/90 transition-all flex items-center gap-3 shadow-lg shadow-primary/20 shrink-0 outline-none">
                         {isUploading ? <RotateCcw size={16} className="animate-spin" /> : <Upload size={16} strokeWidth={2.5}/>}
                         Transfer Aset ke Cloud
                         <input type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
                      </label>
                   </div>

                   <div className="grid md:grid-cols-2 gap-6">
                     {activeProject.files?.length === 0 && (
                        <div className="col-span-2 py-20 border-2 border-dashed border-slate-200 rounded-[2rem] text-center bg-slate-50/30">
                           <div className="flex justify-center mb-4"><FolderKanban className="text-slate-300 w-16 h-16"/></div>
                           <p className="text-slate-600 font-bold text-lg">Brankas Transmisi Kosong</p>
                           <p className="text-slate-400 text-sm mt-1">Sistem belum mendeteksi jejak transmisi dokumen ke portal klien ini.</p>
                        </div>
                     )}
                     {activeProject.files?.map((f: any) => (
                        <div key={f.id} className="p-6 border border-slate-200 rounded-[1.5rem] bg-white flex items-center gap-5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all group">
                           <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                              <FileText size={28} strokeWidth={1.5} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-slate-900 truncate" title={f.filename}>{f.filename}</p>
                              <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                <span>{(f.file_size / 1024 / 1024).toFixed(2)} MB</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>{new Date(f.created_at).toLocaleDateString()}</span>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                             <a href={f.file_url} target="_blank" className="p-3 text-slate-400 hover:text-white hover:bg-slate-900 bg-slate-50 rounded-xl transition-all shadow-sm">
                                <Download size={16}/>
                             </a>
                             <button onClick={() => handleDeleteFile(f.id, f.file_url)} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 bg-slate-50 rounded-xl transition-all shadow-sm">
                                <Trash2 size={16}/>
                             </button>
                           </div>
                        </div>
                     ))}
                   </div>
                </div>

             </motion.div>
           ) : (
             <div className="h-[850px] border border-slate-200 rounded-[2.5rem] bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 p-10 text-center shadow-inner">
                 <Target size={64} strokeWidth={1} className="text-slate-300 mb-6 drop-shadow-sm"/>
                 <h2 className="text-2xl font-bold tracking-tight text-slate-500">Mode Idle Kriptografi</h2>
                 <p className="text-sm font-medium mt-3 max-w-md text-slate-400">Klik salah satu identitas klien pada navigasi matriks sebelah kiri untuk membuka Dasbor Transmisi data.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
