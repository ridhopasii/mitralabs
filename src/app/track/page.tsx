"use client";

import { useState, useEffect, Suspense } from "react";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2, Clock, FileText, ExternalLink, ChevronRight, ShieldCheck, Download, MessageCircle, BarChart3, CreditCard, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useData } from "@/context/DataContext";

function TrackContent() {
  const searchParams = useSearchParams();
  const { data } = useData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("progress");

  useEffect(() => {
    const urlEmail = searchParams.get("email");
    const urlPass = searchParams.get("pass");
    if (urlEmail && urlPass) {
      setEmail(urlEmail);
      setPassword(urlPass);
      setTimeout(() => {
        document.getElementById("track-submit-btn")?.click();
      }, 150);
    }
  }, [searchParams]);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data: result, error: dbErr } = await supabase
        .from("Booking")
        .select(`
          *,
          invoices (*),
          client_projects (
            *,
            files:ProjectFile (*),
            updates:ProjectUpdate (*)
          )
        `)
        .eq("customer_email", email)
        .eq("tracking_password", password)
        .single();

      if (dbErr || !result) throw new Error("Email atau Password salah. Pastikan sesuai dengan yang dimasukkan saat memesan.");
      setProjectData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const waNumber = data?.settings?.waNumber || "6282381118520";
  const proj = projectData?.client_projects?.[0];
  const tabs = [
    { id: "progress", label: "Progress", icon: BarChart3 },
    { id: "dokumen", label: "Dokumen", icon: FileText },
    { id: "kwitansi", label: "Kwitansi", icon: CreditCard },
    { id: "chat", label: "Chat", icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFD] font-sans text-slate-900 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            <ShieldCheck size={12} /> Secure Project Dashboard
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight">
            {projectData ? `Projek ${projectData.customer_name.split(' ')[0]}` : "Dashboard Projek Anda."}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-slate-500 font-medium max-w-xl mx-auto">
            Masukkan email pesanan dan password yang Anda buat saat memesan.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {!projectData ? (
            <motion.div key="search" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-md mx-auto">
              <form onSubmit={handleTrack} className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-2xl space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Email Pesanan</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-200" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Password Projek</label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-200" />
                    </div>
                  </div>
                </div>
                {error && (
                  <div className="p-4 bg-rose-50 text-rose-500 rounded-xl flex items-center gap-3">
                    <AlertCircle size={18} /><p className="text-[11px] font-bold">{error}</p>
                  </div>
                )}
                <button id="track-submit-btn" type="submit" disabled={isLoading}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50">
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                  Buka Dashboard Projek
                </button>
              </form>
              <div className="mt-8 text-center">
                <Link href="/login" className="text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest transition-all">
                  Punya Akun? Login di sini <ChevronRight size={12} className="inline ml-1" />
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Header Card */}
              <div className="bg-[#1D1D1F] text-white p-10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em] mb-2">Projek #{projectData.id}</p>
                  <h2 className="text-3xl font-bold tracking-tight">{projectData.plan_name} — {projectData.service_type}</h2>
                  <p className="text-slate-400 mt-2 font-medium">{projectData.customer_name} · {projectData.customer_email}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    projectData.status === 'Completed' ? 'bg-emerald-500' : 
                    projectData.status === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500'}`}>
                    {projectData.status}
                  </div>
                  <p className="text-[10px] opacity-40">Update: {new Date(projectData.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-[11px] uppercase tracking-widest whitespace-nowrap transition-all ${
                      activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400'}`}>
                    <tab.icon size={14} />{tab.label}
                  </button>
                ))}
              </div>

              {/* Tab: Progress */}
              {activeTab === "progress" && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="text-lg font-bold">Progres Pengerjaan</h3>
                      <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase">Live</div>
                    </div>
                    <div className="p-8 space-y-8">
                      {proj ? (
                        <>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm font-bold">
                              <span className="text-slate-500 uppercase text-xs tracking-widest">Total Completion</span>
                              <span className="text-2xl font-black">{proj.progress}%</span>
                            </div>
                            <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${proj.progress}%` }} className="h-full bg-slate-900 rounded-full" />
                            </div>
                          </div>
                          {proj.updates?.length > 0 && (
                            <div className="space-y-5 pt-4 border-t border-slate-100">
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Timeline Update</p>
                              {proj.updates.map((u: any, idx: number) => (
                                <div key={u.id} className="relative flex gap-4">
                                  {idx !== proj.updates.length - 1 && <div className="absolute left-[7px] top-4 bottom-[-20px] w-px bg-slate-100"></div>}
                                  <div className="w-4 h-4 rounded-full border-2 border-slate-900 bg-white z-10 shrink-0 mt-1"></div>
                                  <div>
                                    <p className="text-[11px] font-bold text-slate-900">{u.description}</p>
                                    <p className="text-[9px] text-slate-400 mt-0.5">{new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center py-12 text-center opacity-40">
                          <Clock size={40} className="mb-4" />
                          <p className="text-sm font-bold uppercase tracking-widest">Tim sedang mempersiapkan projek...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {[
                      { label: "Status Projek", value: projectData.status, color: "text-blue-600" },
                      { label: "Paket", value: projectData.plan_name },
                      { label: "Layanan", value: projectData.service_type },
                      { label: "Tanggal Order", value: new Date(projectData.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) },
                    ].map(item => (
                      <div key={item.label} className="bg-white p-6 rounded-[1.5rem] border border-slate-200/60 flex justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                        <p className={`font-bold text-sm ${item.color || 'text-slate-900'}`}>{item.value}</p>
                      </div>
                    ))}
                    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200/60">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Total Investasi</p>
                      <p className="text-2xl font-black text-slate-900">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(projectData.total_price)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Dokumen */}
              {activeTab === "dokumen" && (
                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-10 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold">Dokumen Projek</h3>
                    <p className="text-sm text-slate-500 mt-1">File, kontrak, dan dokumen yang dikirimkan tim Mitralabs untuk projek Anda.</p>
                  </div>
                  {proj?.files?.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {proj.files.map((file: any) => (
                        <a key={file.id} href={file.file_url} target="_blank"
                          className="flex items-center justify-between p-5 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-2xl transition-all group shadow-sm hover:shadow-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-red-500 transition-colors shadow-sm">
                              <FileText size={22} />
                            </div>
                            <div>
                              <p className="text-[12px] font-bold text-slate-900 uppercase">{file.filename}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{file.file_type || 'PDF'} · {(file.file_size / 1024).toFixed(0)} KB</p>
                            </div>
                          </div>
                          <Download size={16} className="text-slate-300 group-hover:text-slate-900" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                      <FileText size={40} className="mx-auto text-slate-200 mb-4" />
                      <p className="font-bold text-slate-400 text-sm">Belum ada dokumen yang dikirimkan.</p>
                      <p className="text-xs text-slate-300 mt-2">Dokumen akan muncul di sini setelah tim Mitralabs mengunggahnya.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Kwitansi */}
              {activeTab === "kwitansi" && (
                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-10 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold">Kwitansi &amp; Invoice</h3>
                    <p className="text-sm text-slate-500 mt-1">Riwayat tagihan dan status pembayaran projek Anda.</p>
                  </div>
                  <div className="bg-[#1D1D1F] text-white p-8 rounded-[2rem]">
                    <p className="text-[10px] opacity-40 uppercase tracking-[0.2em] mb-2">Total Nilai Projek</p>
                    <p className="text-4xl font-black">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(projectData.total_price)}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <div className={`w-2 h-2 rounded-full ${projectData.status === 'Paid' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{projectData.status}</p>
                    </div>
                  </div>
                  {projectData.invoices?.length > 0 ? (
                    <div className="space-y-3">
                      {projectData.invoices.map((inv: any) => (
                        <Link key={inv.id} href={`/invoice/${inv.invoice_number}`}
                          className="flex items-center justify-between p-5 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-2xl transition-all group shadow-sm hover:shadow-xl">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors shadow-sm">
                              <FileText size={22} />
                            </div>
                            <div>
                              <p className="text-[12px] font-bold text-slate-900 uppercase">{inv.invoice_number}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Jatuh tempo: {new Date(inv.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>{inv.status}</span>
                            <ExternalLink size={14} className="text-slate-300 group-hover:text-slate-900" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                      <p className="font-bold text-slate-400 text-sm">Belum ada invoice diterbitkan.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Chat / Support */}
              {activeTab === "chat" && (
                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-10 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold">Hubungi Tim Mitralabs</h3>
                    <p className="text-sm text-slate-500 mt-1">Ada pertanyaan tentang projek? Langsung chat dengan tim kami.</p>
                  </div>
                  <div className="bg-slate-50 rounded-3xl p-8 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">M</div>
                      <div className="bg-white rounded-2xl rounded-tl-none p-5 shadow-sm border border-slate-100 max-w-sm">
                        <p className="text-sm font-medium text-slate-700 leading-relaxed">Halo {projectData.customer_name.split(' ')[0]}! 👋 Tim Mitralabs siap membantu. Silakan hubungi kami via WhatsApp untuk diskusi lebih lanjut tentang projek Anda.</p>
                        <p className="text-[9px] text-slate-400 mt-2">Mitralabs Support</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo Mitralabs! Saya ${projectData.customer_name}, ingin bertanya tentang Projek #${projectData.id}.`)}`}
                      target="_blank"
                      className="flex items-center justify-center gap-3 py-5 bg-emerald-500 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                      <Phone size={18} /> Chat via WhatsApp
                    </a>
                    <button onClick={() => setProjectData(null)}
                      className="flex items-center justify-center gap-3 py-5 bg-slate-100 text-slate-700 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                      Keluar dari Dashboard
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-slate-400" size={40} /></div>}>
      <TrackContent />
    </Suspense>
  );
}
