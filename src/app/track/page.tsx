"use client";

import { useState } from "react";
import { 
  Search, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Download
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function TrackingPage() {
  const [bookingId, setBookingId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Find booking with password match
      const { data, error } = await supabase
        .from("Booking")
        .select(`
          *,
          invoices (*),
          client_projects (
            *,
            files:ProjectFile (*)
          )
        `)
        .eq("id", parseInt(bookingId))
        .eq("tracking_password", password)
        .single();

      if (error || !data) {
        throw new Error("Nomor Projek atau Password salah.");
      }

      setProjectData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] font-sans text-slate-900 selection:bg-primary/10 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Area */}
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
          >
            <ShieldCheck size={12} /> Secure Tracking Portal
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900"
          >
            Pantau Progres <span className="italic">Projek Anda.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 font-medium max-w-xl mx-auto leading-relaxed"
          >
            Masukkan nomor projek dan password yang Anda terima di email untuk melihat detail pengerjaan, dokumentasi, dan pembayaran.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {!projectData ? (
            <motion.div 
              key="search"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto"
            >
              <form onSubmit={handleTrack} className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-2xl space-y-6">
                <div className="space-y-4">
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Nomor Projek</label>
                     <div className="relative">
                       <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                         type="number"
                         required
                         value={bookingId}
                         onChange={(e) => setBookingId(e.target.value)}
                         placeholder="Contoh: 1042"
                         className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-200"
                       />
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Password Lacak</label>
                     <div className="relative">
                       <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                         type="password"
                         required
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         placeholder="••••••••"
                         className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-200"
                       />
                     </div>
                   </div>
                </div>

                {error && (
                  <div className="p-4 bg-rose-50 text-rose-500 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={18} />
                    <p className="text-[11px] font-bold uppercase tracking-widest">{error}</p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Mulai Melacak"}
                  <ArrowRight size={18} />
                </button>
              </form>
              
              <div className="mt-8 text-center">
                <Link href="/login" className="text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest transition-all">
                  Atau Masuk dengan Akun Client <ChevronRight size={12} className="inline ml-1" />
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              {/* Project Status Overview */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Projek</p>
                    <p className="text-xl font-bold text-slate-900">{projectData.status}</p>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Terakhir Update</p>
                    <p className="text-xl font-bold text-slate-900">{new Date(projectData.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</p>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Paket Layanan</p>
                    <p className="text-xl font-bold text-slate-900">{projectData.plan_name}</p>
                  </div>
                </div>
              </div>

              {/* Progress & Documentation Area */}
              <div className="grid lg:grid-cols-2 gap-10">
                
                {/* Progres Section */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-10 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Progres Pengerjaan</h3>
                    <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Live Updates</div>
                  </div>
                  <div className="p-10 flex-grow space-y-10">
                    {projectData.client_projects?.[0] ? (
                      <>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-500 uppercase tracking-widest text-xs">Total Completion</span>
                            <span className="text-slate-900">{projectData.client_projects[0].progress}%</span>
                          </div>
                          <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-1">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${projectData.client_projects[0].progress}%` }}
                              className="h-full bg-slate-900 rounded-full"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Tahapan Terbaru</p>
                           <div className="space-y-4">
                             {/* Mock updates if empty, otherwise real ones */}
                             <div className="flex gap-4 group">
                               <div className="w-0.5 bg-slate-100 relative">
                                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
                               </div>
                               <div className="pb-8">
                                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sekarang</p>
                                 <p className="font-bold text-slate-900">{projectData.client_projects[0].status === 'pending' ? 'Evaluasi Briefing' : 'Sedang Dikerjakan'}</p>
                                 <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed italic">{projectData.project_brief.substring(0, 100)}...</p>
                               </div>
                             </div>
                           </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                         <Clock size={40} className="mb-4" />
                         <p className="text-sm font-bold uppercase tracking-widest">Sistem Sedang Menyiapkan Pipeline...</p>
                      </div>
                    )}
                  </div>

                  {/* Guest Documents Section */}
                  {projectData.client_projects?.[0]?.files?.length > 0 && (
                    <div className="p-10 border-t border-slate-100 bg-slate-50/30">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6">Dokumen & File Projek</p>
                       <div className="grid gap-3">
                          {projectData.client_projects[0].files.map((file: any) => (
                            <a 
                              key={file.id} 
                              href={file.file_url} 
                              target="_blank"
                              className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-lg hover:shadow-slate-200/50 transition-all group"
                            >
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-red-500 transition-colors">
                                    <FileText size={18} />
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-bold text-slate-900 uppercase">{file.filename}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{file.file_type || 'PDF'}</p>
                                  </div>
                               </div>
                               <Download size={14} className="text-slate-300 group-hover:text-slate-900" />
                            </a>
                          ))}
                       </div>
                    </div>
                  )}
                </div>

                {/* Financials & Invoices */}
                <div className="space-y-6">
                  <div className="bg-[#1D1D1F] text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="relative z-10 space-y-6">
                       <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em]">Total Investasi</p>
                       <h4 className="text-4xl font-bold tracking-tight">
                         {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(projectData.total_price)}
                       </h4>
                       <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                          <span className="text-xs font-bold opacity-60 uppercase tracking-widest">Metode: Bank Transfer</span>
                          <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">Termin 1</div>
                       </div>
                    </div>
                  </div>

                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm space-y-8">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Daftar Kwitansi</h4>
                      <Link href={`/invoice/${projectData.invoices[0]?.invoice_number}`} className="p-2 bg-slate-50 rounded-lg text-slate-900">
                         <ExternalLink size={14} />
                      </Link>
                    </div>
                    
                    <div className="space-y-3">
                      {projectData.invoices.length > 0 ? (
                        projectData.invoices.map((inv: any) => (
                          <Link 
                            key={inv.id}
                            href={`/invoice/${inv.invoice_number}`}
                            className="flex items-center justify-between p-5 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 rounded-[1.5rem] transition-all group shadow-sm hover:shadow-xl hover:shadow-slate-200/40"
                          >
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors">
                                 <FileText size={18} />
                               </div>
                               <div>
                                 <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{inv.invoice_number}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{inv.status}</p>
                               </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        ))
                      ) : (
                        <p className="text-center py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Belum ada invoice diterbitkan.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-10">
                <button 
                  onClick={() => setProjectData(null)}
                  className="px-8 py-3 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest transition-all"
                >
                  Keluar dari Tracking
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding */}
      <div className="mt-20 text-center opacity-20 hover:opacity-100 transition-opacity duration-1000">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-900">Mitralabs Cryptographic Verification</p>
      </div>
    </div>
  );
}
