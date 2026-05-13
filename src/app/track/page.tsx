"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2, Clock, FileText, ExternalLink, ChevronRight, ShieldCheck, Download, MessageCircle, BarChart3, CreditCard, Phone, Package, Plus, Trash2, Image as ImageIcon, Sparkles, Send, LogOut, Building2, ClipboardList, Upload, Zap, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useData } from "@/context/DataContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { uploadImage } from "@/lib/imageUpload";

// Document Templates
import CompanyProfileDoc from "@/components/documents/CompanyProfileDoc";
import RateCardDoc from "@/components/documents/RateCardDoc";
import SOPDoc from "@/components/documents/SOPDoc";
import ProposalDoc from "@/components/documents/ProposalDoc";
import MoUDoc from "@/components/documents/MoUDoc";
import SPKDoc from "@/components/documents/SPKDoc";
import FormBriefDoc from "@/components/documents/FormBriefDoc";

function TrackContent() {
  const searchParams = useSearchParams();
  const { data } = useData();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState(searchParams.get("pass") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("progress");
  const [isApproving, setIsApproving] = useState<Record<number, boolean>>({});
  const [isUploadingAsset, setIsUploadingAsset] = useState<Record<number, boolean>>({});
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, content: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRequestingDoc, setIsRequestingDoc] = useState(false);
  const [docRequest, setDocRequest] = useState({ title: "", description: "" });
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);
  const [selectedChatFile, setSelectedChatFile] = useState<File | null>(null);
  const [isUploadingChatFile, setIsUploadingChatFile] = useState(false);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);
  
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  const chatFileInputRef = React.useRef<HTMLInputElement>(null);
  const reportRef = React.useRef<HTMLDivElement>(null);

  // Derived Data
  const proj = projectData?.client_projects?.[0];
  const waNumber = data?.brand?.whatsapp || "6282381118520";
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent("Halo Mitralabs! Saya butuh bantuan untuk melacak projek saya.")}`;
  
  const tabs = [
    { id: "progress", label: data.track?.labels?.tabs.progress || "Progress", icon: BarChart3 },
    { id: "assets", label: data.track?.labels?.tabs.assets || "Aset", icon: Package },
    { id: "dokumen", label: data.track?.labels?.tabs.documents || "Dokumen", icon: FileText },
    { id: "kwitansi", label: data.track?.labels?.tabs.invoices || "Kwitansi", icon: CreditCard },
    { id: "chat", label: data.track?.labels?.tabs.chat || "Chat", icon: MessageCircle },
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === "chat") scrollToBottom();
  }, [activeTab, projectData]);

  const handleAssetUpload = async (assetId: number, file: File) => {
    setIsUploadingAsset(prev => ({ ...prev, [assetId]: true }));
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `client_assets/${projectData.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('mitralabs_assets').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('mitralabs_assets').getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('ProjectAsset')
        .update({
          url: publicUrl,
          status: 'Received',
          file_size: file.size,
          file_type: file.type,
          uploaded_at: new Date().toISOString()
        })
        .eq('id', assetId);

      if (updateError) throw updateError;

      // Update local state
      setProjectData((prev: any) => {
        if (!prev) return prev;
        const newProjects = prev.client_projects.map((p: any) => ({
          ...p,
          assets: p.assets.map((a: any) => 
            a.id === assetId ? { ...a, url: publicUrl, status: 'Received' } : a
          )
        }));
        return { ...prev, client_projects: newProjects };
      });
    } catch (err: any) {
      alert("Upload gagal: " + err.message);
    } finally {
      setIsUploadingAsset(prev => ({ ...prev, [assetId]: false }));
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      const { error } = await supabase.from('Testimonial').insert([{
        name: projectData.customer_name,
        role: projectData.organization_name || "Client",
        content: reviewData.content,
        rating: reviewData.rating,
        image_url: projectData.client?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(projectData.customer_name)}&background=random`,
        is_published: false
      }]);

      if (error) throw error;
      setReviewSubmitted(true);
    } catch (err: any) {
      alert("Gagal mengirim ulasan: " + err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!chatMessage.trim() || !proj) return;

    setIsSendingMessage(true);
    try {
      const { data: newMessage, error } = await supabase
        .from('ProjectChat')
        .insert([{
          project_id: proj.id,
          sender_type: 'client',
          message: chatMessage.trim(),
          is_read: false
        }])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setProjectData((prev: any) => {
        if (!prev) return prev;
        const newProjects = prev.client_projects.map((p: any) => {
          if (p.id === proj.id) {
            return {
              ...p,
              chats: [...(p.chats || []), newMessage]
            };
          }
          return p;
        });
        return { ...prev, client_projects: newProjects };
      });

      setChatMessage("");
      setTimeout(scrollToBottom, 100);
    } catch (err: any) {
      alert("Gagal mengirim pesan: " + err.message);
    } finally {
      setIsSendingMessage(false);
    }
  }

  async function handleRequestDoc(e: React.FormEvent) {
    e.preventDefault();
    if (!docRequest.title || !proj) return;
    setIsSubmittingDoc(true);
    try {
      const { error } = await supabase.from('DocumentRequest').insert([{
        project_id: proj.id,
        title: docRequest.title,
        description: docRequest.description,
        status: 'Pending'
      }]);

      if (error) throw error;

      // Notify in Chat
      await supabase.from('ProjectChat').insert([{
        project_id: proj.id,
        sender_type: 'client',
        message: `📢 REQUEST DOKUMEN: ${docRequest.title}`
      }]);

      setIsRequestingDoc(false);
      setDocRequest({ title: "", description: "" });
      handleTrack(); // Refresh
    } catch (err: any) {
      alert("Gagal mengirim request: " + err.message);
    } finally {
      setIsSubmittingDoc(false);
    }
  }

  async function handleChatFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !proj) return;

    setIsUploadingChatFile(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${proj.id}/${Date.now()}.${fileExt}`;
      const filePath = `chat/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('mitralabs_assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('mitralabs_assets')
        .getPublicUrl(filePath);

      // Send chat message with file
      const { error: chatError } = await supabase.from('ProjectChat').insert([{
        project_id: proj.id,
        sender_type: 'client',
        message: `Mengirim file: ${file.name}`,
        file_url: publicUrl,
        file_type: file.type.startsWith('image/') ? 'image' : 'file'
      }]);

      if (chatError) throw chatError;
      handleTrack(); // Refresh to see message
    } catch (err: any) {
      alert("Gagal upload file: " + err.message);
    } finally {
      setIsUploadingChatFile(false);
      if (chatFileInputRef.current) chatFileInputRef.current.value = "";
    }
  }

  async function handleExportReport() {
    if (!projectData) return;
    setIsExporting(true);
    
    try {
      // Small delay to ensure all assets are ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const element = reportRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2]
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`Laporan_Proyek_${projectData.client_projects[0].project_name.replace(/\s+/g, '_')}.pdf`);
    } catch (err: any) {
      alert("Gagal mengekspor laporan: " + err.message);
    } finally {
      setIsExporting(false);
    }
  }

  async function handleApproveUpdate(updateId: number) {
    setIsApproving(prev => ({ ...prev, [updateId]: true }));
    try {
      const res = await fetch(`/api/projects/updates/${updateId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) throw new Error("Gagal menyetujui update");

      // Update local state
      setProjectData((prev: any) => {
        if (!prev) return prev;
        const newProjects = prev.client_projects.map((p: any) => ({
          ...p,
          updates: p.updates.map((u: any) => 
            u.id === updateId ? { ...u, is_approved: true, approved_at: new Date().toISOString() } : u
          )
        }));
        return { ...prev, client_projects: newProjects };
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsApproving(prev => ({ ...prev, [updateId]: false }));
    }
  }

  async function handleUserSignatureUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !projectData) return;

    setIsUploadingSignature(true);
    try {
      const result = await uploadImage(file, "signatures", `client_${projectData.id}`);
      if (result.success && result.url) {
        const { error: updateError } = await supabase
          .from('Booking')
          .update({ user_signature: result.url })
          .eq('id', projectData.id);

        if (updateError) throw updateError;

        setProjectData((prev: any) => ({ ...prev, user_signature: result.url }));
        alert("Tanda tangan berhasil disimpan!");
      } else {
        throw new Error(result.error || "Upload gagal");
      }
    } catch (err: any) {
      alert("Gagal upload tanda tangan: " + err.message);
    } finally {
      setIsUploadingSignature(false);
    }
  }

  async function handleTrack(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data: result, error: dbErr } = await supabase
        .from("Booking")
        .select(`
          *,
          invoices:Invoice (*),
          client_projects:ClientProject (
            *,
            files:ProjectFile (*),
            updates:ProjectUpdate (*),
            assets:ProjectAsset (*),
            chats:ProjectChat (*)
          )
        `)
        .ilike("customer_email", email)
        .eq("tracking_password", password)
        .maybeSingle();

      if (dbErr) {
        console.error("❌ Supabase Query Error:", dbErr);
        throw new Error(`Koneksi database bermasalah: ${dbErr.message}`);
      }
      
      if (!result) {
        throw new Error("Email atau Password salah. Pastikan sesuai dengan yang dimasukkan saat memesan.");
      }

      setProjectData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    setProjectData(null);
    setPassword("");
    // Optional: remove from URL
    window.history.replaceState({}, '', '/track');
  }

  useEffect(() => {
    const urlEmail = searchParams.get("email");
    const urlPass = searchParams.get("pass");
    if (urlEmail && urlPass && !projectData && !isLoading) {
      // Auto trigger handleTrack if params exist and we haven't loaded yet
      handleTrack();
    }
  }, [searchParams, projectData, isLoading]);

  return (
    <div className="min-h-screen bg-[#FBFBFD] font-sans text-slate-900 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            <ShieldCheck size={12} /> {data.track?.labels?.secureBadge || "Secure Project Dashboard"}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight">
            {projectData ? `Projek ${projectData.customer_name.split(' ')[0]}` : (data.track?.title || "Dashboard Projek Anda.")}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-slate-500 font-medium max-w-xl mx-auto">
            {data.track?.subtitle || "Masukkan email pesanan dan password yang Anda buat saat memesan."}
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {!projectData ? (
            <motion.div key="search" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-md mx-auto">
              <form onSubmit={handleTrack} className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-2xl space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">
                      {data.track?.labels?.emailLabel || "Email Pesanan"}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder={data.track?.labels?.emailPlaceholder || "nama@email.com"}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-200" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">
                      {data.track?.labels?.passwordLabel || "Password Projek"}
                    </label>
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
                  {data.track?.labels?.submitButton || "Buka Dashboard Projek"}
                </button>
              </form>
              <div className="mt-8 text-center">
                <a href={waUrl} target="_blank" className="text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest transition-all">
                  {data.track?.labels?.helpText || "Lupa password atau butuh bantuan? Hubungi Admin"} <ChevronRight size={12} className="inline ml-1" />
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Header Card */}
              <div className="bg-[#1D1D1F] text-white p-10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em] mb-2">
                    {data.track?.labels?.dashboard?.header.projectNum || "Projek #"} {projectData.id}
                  </p>
                  <h2 className="text-3xl font-bold tracking-tight">{projectData.plan_name} — {projectData.service_type}</h2>
                  <p className="text-slate-400 mt-2 font-medium">{projectData.customer_name} · {projectData.customer_email}</p>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleLogout}
                      className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                      title={data.track?.labels?.dashboard?.header.logoutTitle || "Keluar dari Dashboard"}
                    >
                      <LogOut size={18} />
                    </button>
                    <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      projectData.status === 'Completed' ? 'bg-emerald-500' : 
                      projectData.status === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500'}`}>
                      {projectData.status}
                    </div>
                  </div>
                  <p className="text-[10px] opacity-40">{data.track?.labels?.dashboard?.header.lastUpdate || "Update:"} {new Date(projectData.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
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
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start gap-4">
                                      <div>
                                        <p className="text-[11px] font-bold text-slate-900">{u.description}</p>
                                        <p className="text-[9px] text-slate-400 mt-0.5">{new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                      </div>
                                      {u.is_approved ? (
                                        <div className="flex flex-col items-end shrink-0">
                                          <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md flex items-center gap-1">
                                            <CheckCircle2 size={10} />
                                            <span className="text-[8px] font-black uppercase">Approved</span>
                                          </div>
                                          {u.approved_at && (
                                            <span className="text-[7px] text-slate-400 mt-1">
                                              {new Date(u.approved_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                          )}
                                        </div>
                                      ) : (
                                        <button 
                                          onClick={() => handleApproveUpdate(u.id)}
                                          disabled={isApproving[u.id]}
                                          className="shrink-0 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                                        >
                                          {isApproving[u.id] ? <Loader2 size={10} className="animate-spin" /> : "Setujui"}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center py-12 text-center opacity-40">
                          <Clock size={40} className="mb-4" />
                          <p className="text-sm font-bold uppercase tracking-widest">
                            {data.track?.labels?.dashboard?.empty.preparing || "Tim sedang mempersiapkan projek..."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {[
                      { label: data.track?.labels?.dashboard?.stats.status || "Status Projek", value: projectData.status, color: "text-blue-600" },
                      { label: data.track?.labels?.dashboard?.stats.plan || "Paket", value: projectData.plan_name },
                      { label: data.track?.labels?.dashboard?.stats.service || "Layanan", value: projectData.service_type },
                      { label: data.track?.labels?.dashboard?.stats.orderDate || "Tanggal Order", value: new Date(projectData.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) },
                    ].map(item => (
                      <div key={item.label} className="bg-white p-6 rounded-[1.5rem] border border-slate-200/60 flex justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                        <p className={`font-bold text-sm ${item.color || 'text-slate-900'}`}>{item.value}</p>
                      </div>
                    ))}
                    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200/60">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                        {data.track?.labels?.dashboard?.stats.investment || "Total Investasi"}
                      </p>
                      <p className="text-2xl font-black text-slate-900">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(projectData.total_price)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Assets Onboarding */}
              {activeTab === "assets" && (
                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-10 space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <h3 className="text-xl font-bold">Koleksi Aset Proyek</h3>
                      <p className="text-sm text-slate-500 mt-1">Unggah logo, foto, dan konten yang dibutuhkan untuk pengerjaan proyek Anda.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg">
                      <Plus size={14} /> Tambah Aset
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Pre-defined categories if empty */}
                    {(!proj?.assets || proj.assets.length === 0) && (
                      ["Logo Instansi", "Foto Utama", "Copywriting / Konten", "Referensi Desain"].map((cat) => (
                        <div key={cat} className="group p-6 bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4 hover:border-slate-400 transition-all cursor-pointer">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 group-hover:text-slate-900 transition-colors shadow-sm">
                            <ImageIcon size={20} />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-slate-900 uppercase">{cat}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Belum Diunggah</p>
                          </div>
                        </div>
                      ))
                    )}

                    {proj?.assets?.map((asset: any) => (
                      <div key={asset.id} className="p-6 bg-white border border-slate-200/60 rounded-[2rem] shadow-sm flex flex-col justify-between space-y-6 group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                             <Package size={18} />
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            asset.status === 'Received' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {asset.status}
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-slate-900 uppercase mb-1">{asset.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{asset.category}</p>
                        </div>
                        {asset.url ? (
                          <div className="flex gap-2">
                             <a href={asset.url} target="_blank" className="flex-1 py-3 bg-slate-50 text-slate-900 rounded-xl text-[9px] font-bold uppercase tracking-widest text-center hover:bg-slate-100 transition-all">Lihat</a>
                          </div>
                        ) : (
                          <label className="cursor-pointer w-full py-3 bg-slate-900 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all text-center flex items-center justify-center gap-2">
                             {isUploadingAsset[asset.id] ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                             Unggah Sekarang
                             <input type="file" className="hidden" onChange={(e) => e.target.files && handleAssetUpload(asset.id, e.target.files[0])} />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-amber-50/50 border border-amber-100 rounded-[2rem] flex gap-4 items-start">
                    <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-amber-900 uppercase">Pro-Tip: Kualitas Aset menentukan hasil akhir</p>
                      <p className="text-[10px] text-amber-700/80 leading-relaxed mt-1">Gunakan file beresolusi tinggi (PNG/SVG untuk logo) untuk memastikan tampilan website Anda tetap tajam dan profesional di semua layar.</p>
                    </div>
                  </div>

                   {/* Digital Signature Section */}
                  <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Otoritas Klien</p>
                       <h4 className="text-xl font-bold italic">Tanda Tangan Digital</h4>
                       <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest max-w-[300px]">Gunakan untuk menandatangani MoU, SPK, dan Proposal secara otomatis.</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                       {projectData.user_signature ? (
                         <div className="w-32 h-20 bg-white rounded-2xl flex items-center justify-center p-3 relative group">
                            <img src={projectData.user_signature} alt="Tanda Tangan" className="max-h-full object-contain mix-blend-multiply" />
                            <label className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center cursor-pointer">
                               <Plus size={20} className="text-white" />
                               <input type="file" className="hidden" onChange={handleUserSignatureUpload} />
                            </label>
                         </div>
                       ) : (
                         <label className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-3">
                            {isUploadingSignature ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                            Unggah Tanda Tangan (PNG)
                            <input type="file" className="hidden" onChange={handleUserSignatureUpload} />
                         </label>
                       )}
                    </div>
                  </div>

                  {/* Generated Documents List */}
                  <div className="space-y-4 pt-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Automated Generated Documents</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { id: 'mou', name: 'Memorandum of Understanding (MoU)', desc: 'Kesepakatan Awal', icon: <FileText className="text-blue-500" /> },
                          { id: 'spk', name: 'Surat Perjanjian Kerja Sama (SPK)', desc: 'Dokumen Legal Utama', icon: <ShieldCheck className="text-emerald-500" /> },
                          { id: 'proposal', name: 'Proposal Penawaran Resmi', desc: 'Detail Solusi & Paket', icon: <Zap className="text-amber-500" /> },
                          { id: 'profile', name: 'Company Profile Mitralabs', desc: 'Tentang Kami & Layanan', icon: <Building2 className="text-indigo-500" /> },
                          { id: 'ratecard', name: 'Rate Card & Investasi', desc: 'Daftar Harga & Paket', icon: <CreditCard className="text-rose-500" /> },
                          { id: 'sop', name: 'SOP Operasional', desc: 'Standar Prosedur Kerja', icon: <ClipboardList className="text-slate-500" /> },
                          { id: 'brief', name: 'Form Brief Klien', desc: 'Requirement & Identitas', icon: <Package className="text-slate-500" /> }
                        ].map((doc) => (
                          <div key={doc.id} className="p-6 bg-white border border-slate-200/60 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group">
                             <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                                   {doc.icon}
                                </div>
                                <div className="px-2 py-1 bg-slate-50 rounded text-[8px] font-black uppercase text-slate-400">Generated</div>
                             </div>
                             <div className="space-y-1 mb-6">
                                <h5 className="text-[11px] font-black text-slate-900 uppercase">{doc.name}</h5>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.desc}</p>
                             </div>
                             <button 
                               onClick={() => setViewingDoc(doc.id)}
                               className="w-full py-3 bg-slate-50 text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all"
                             >
                                Buka Dokumen
                             </button>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4 pt-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">File & Dokumen Tambahan</p>
                    {(proj?.files?.length > 0) ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {proj?.files?.map((file: any) => (
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
                        <p className="font-bold text-slate-400 text-sm">Belum ada file tambahan.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Kwitansi */}
              {activeTab === "kwitansi" && (
                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm p-10 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold">Kwitansi &amp; Invoice</h3>
                    <p className="text-sm text-slate-500 mt-1">Riwayat tagihan dan status pembayaran projek Anda.</p>
                    <button 
                      onClick={handleExportReport}
                      disabled={isExporting}
                      className="mt-4 flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                      {isExporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                      Export Project Report
                    </button>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-[700px]">
                  {/* Chat Header */}
                  <div className="p-8 bg-slate-900 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-black text-xl text-primary">M</div>
                      <div>
                        <h3 className="text-lg font-bold">Mitralabs Direct Chat</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                           <p className="text-[9px] font-black uppercase tracking-widest opacity-60">System Online</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">ID Projek</p>
                      <p className="text-xs font-black">#{projectData.id}</p>
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-grow overflow-y-auto p-8 space-y-6 bg-slate-50/50">
                    <div className="flex justify-center">
                       <span className="px-4 py-1.5 bg-slate-200/50 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">Awal Percakapan</span>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md">M</div>
                      <div className="bg-white p-5 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 max-w-[80%]">
                        <p className="text-sm font-medium text-slate-700 leading-relaxed">
                          Halo **{projectData.customer_name.split(' ')[0]}**! 👋 Selamat datang di chat langsung Mitralabs. Silakan tuliskan pertanyaan atau masukan Anda di sini. Tim kami akan membalas secepat mungkin.
                        </p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase mt-2">Sistem Mitralabs</p>
                      </div>
                    </div>

                    {proj?.chats?.map((chat: any) => (
                      <div key={chat.id} className={`flex items-start gap-4 ${chat.sender_type === 'client' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-md ${
                          chat.sender_type === 'client' ? 'bg-primary text-white' : 'bg-slate-900 text-white'
                        }`}>
                          {chat.sender_type === 'client' ? projectData.customer_name.charAt(0) : 'M'}
                        </div>
                        <div className={`p-5 rounded-2xl shadow-sm border max-w-[80%] ${
                          chat.sender_type === 'client' 
                            ? 'bg-primary text-white border-transparent rounded-tr-none' 
                            : 'bg-white text-slate-700 border-slate-100 rounded-tl-none'
                        }`}>
                          {chat.file_url && (
                            <div className="mb-3 rounded-xl overflow-hidden border border-white/10 shadow-sm">
                              {chat.file_type === 'image' ? (
                                <img src={chat.file_url} alt="Attachment" className="max-w-full h-auto object-cover" />
                              ) : (
                                <a href={chat.file_url} target="_blank" className={`flex items-center gap-3 p-4 ${chat.sender_type === 'client' ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-600'}`}>
                                  <FileText size={18} />
                                  <div className="flex-1 overflow-hidden">
                                     <p className="text-[10px] font-black uppercase tracking-widest truncate">Download Dokumen</p>
                                     <p className="text-[8px] opacity-60">Klik untuk membuka file</p>
                                  </div>
                                  <Download size={14} />
                                </a>
                              )}
                            </div>
                          )}
                          <p className="text-sm font-medium leading-relaxed">{chat.message}</p>
                          <p className={`text-[8px] font-bold uppercase mt-2 ${chat.sender_type === 'client' ? 'text-white/60' : 'text-slate-400'}`}>
                            {new Date(chat.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat Input */}
                  <div className="p-6 bg-white border-t border-slate-100 flex flex-col gap-4">
                    <form onSubmit={handleSendMessage} className="flex gap-4 items-center">
                      <button 
                        type="button"
                        onClick={() => chatFileInputRef.current?.click()}
                        disabled={isUploadingChatFile}
                        className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-all shrink-0"
                      >
                        {isUploadingChatFile ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={20} />}
                      </button>
                      <input type="file" ref={chatFileInputRef} className="hidden" onChange={handleChatFileUpload} accept="image/*,.pdf,.doc,.docx" />
                      
                      <input 
                        type="text" 
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Tulis pesan Anda di sini..."
                        className="flex-grow bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none font-medium text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-100"
                      />
                      <button 
                        type="submit" 
                        disabled={isSendingMessage || !chatMessage.trim()}
                        className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg disabled:opacity-30 shrink-0"
                      >
                        {isSendingMessage ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                      </button>
                    </form>
                    <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-[0.1em]">Tekan Enter untuk mengirim pesan</p>
                  </div>
                </div>
              )}

              {/* Review / Testimonial Section */}
              {(projectData.status === 'Completed' || projectData.status === 'Done' || (proj?.progress === 100)) && (
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 lg:p-16 space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                  
                  {reviewSubmitted ? (
                    <div className="text-center space-y-6 relative z-10">
                      <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <CheckCircle2 size={40} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-3xl font-bold tracking-tight">Terima Kasih!</h3>
                        <p className="text-slate-400 font-medium">Ulasan Anda sangat berharga bagi kami dan akan segera tampil di website.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid lg:grid-cols-2 gap-12 relative z-10">
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">Feedback Loop</div>
                        <h2 className="text-4xl font-bold tracking-tight leading-tight">Projek Selesai.<br/>Bagaimana Pengalaman Anda?</h2>
                        <p className="text-slate-400 text-lg font-medium">Bagikan pendapat Anda tentang kerjasama kita. Testimoni Anda membantu kami terus berkembang.</p>
                      </div>

                      <form onSubmit={handleSubmitReview} className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rating Pengalaman</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} type="button" onClick={() => setReviewData({ ...reviewData, rating: star })}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                  reviewData.rating >= star ? 'bg-primary text-white scale-110' : 'bg-white/10 text-slate-500'
                                }`}>
                                <Sparkles size={20} fill={reviewData.rating >= star ? 'currentColor' : 'none'} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pesan / Kesan</label>
                          <textarea 
                            required
                            placeholder="Tuliskan pengalaman Anda menggunakan layanan Mitralabs..."
                            value={reviewData.content}
                            onChange={(e) => setReviewData({ ...reviewData, content: e.target.value })}
                            className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-primary text-white font-medium text-sm h-32 resize-none"
                          />
                        </div>

                        <button disabled={isSubmittingReview} className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-100 transition-all shadow-xl">
                          {isSubmittingReview ? <Loader2 size={18} className="animate-spin" /> : "Kirim Ulasan Sekarang"}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Document Viewer Modal */}
        <AnimatePresence>
          {viewingDoc && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex flex-col items-center p-4 md:p-10"
            >
              <div className="w-full max-w-4xl flex justify-between items-center mb-6">
                 <div className="flex items-center gap-4 text-white">
                    <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-black italic shadow-lg shadow-primary/20">M</div>
                    <div>
                       <h4 className="font-black uppercase tracking-tight leading-none">Document Preview</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Generated by Mitralabs Engine</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <button 
                     onClick={() => window.print()}
                     className="px-6 py-2.5 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all"
                   >
                     Cetak Dokumen
                   </button>
                   <button 
                     onClick={() => setViewingDoc(null)}
                     className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                   >
                     <X size={20} />
                   </button>
                 </div>
              </div>
              
              <div className="w-full flex-grow overflow-y-auto rounded-[2.5rem] bg-slate-100/50 p-2 md:p-4 print:p-0">
                 <div className="origin-top transform scale-100 print:scale-100">
                    {viewingDoc === 'mou' && <MoUDoc data={data} booking={projectData} />}
                    {viewingDoc === 'spk' && <SPKDoc data={data} booking={projectData} />}
                    {viewingDoc === 'proposal' && <ProposalDoc data={data} booking={projectData} />}
                    {viewingDoc === 'brief' && <FormBriefDoc data={data} booking={projectData} />}
                    {viewingDoc === 'profile' && <CompanyProfileDoc data={data} />}
                    {viewingDoc === 'ratecard' && <RateCardDoc data={data} />}
                    {viewingDoc === 'sop' && <SOPDoc data={data} />}
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODAL: Request Document */}
      <AnimatePresence>
        {isRequestingDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsRequestingDoc(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                    <Plus size={24} />
                  </div>
                  <button onClick={() => setIsRequestingDoc(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                    <ChevronRight size={24} />
                  </button>
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight text-slate-900">Request Dokumen</h3>
                  <p className="text-slate-500 font-medium mt-2">Beri tahu tim Mitralabs dokumen apa yang Anda butuhkan untuk projek ini.</p>
                </div>
                <form onSubmit={handleRequestDoc} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nama Dokumen</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: Invoice Pelunasan, SPK Versi 2, dll."
                      value={docRequest.title}
                      onChange={(e) => setDocRequest({ ...docRequest, title: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Alasan / Detail (Opsional)</label>
                    <textarea 
                      placeholder="Jelaskan kebutuhan Anda secara singkat..."
                      value={docRequest.description}
                      onChange={(e) => setDocRequest({ ...docRequest, description: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-medium text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-200 h-32 resize-none"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmittingDoc || !docRequest.title}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
                  >
                    {isSubmittingDoc ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    Kirim Request
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HIDDEN REPORT TEMPLATE FOR EXPORT */}
      {projectData && (
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
          <div ref={reportRef} style={{ width: '800px', backgroundColor: '#ffffff', padding: '80px', color: '#0f172a', fontFamily: 'sans-serif' }}>
             {/* Header */}
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: '40px', marginBottom: '40px' }}>
                <div>
                   <h1 style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '-0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>Project Report</h1>
                   <p style={{ color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}>Mitralabs Official Document</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <p style={{ fontWeight: '900', fontSize: '18px' }}>MITRALABS</p>
                   <p style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Digital Solutions & Creative Studio</p>
                </div>
             </div>

             {/* Summary Section */}
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '64px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                   <div>
                      <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0066cc', marginBottom: '4px' }}>Project Name</p>
                      <p style={{ fontSize: '20px', fontWeight: '700' }}>{projectData.client_projects?.[0]?.project_name || "N/A"}</p>
                   </div>
                   <div>
                      <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0066cc', marginBottom: '4px' }}>Client Name</p>
                      <p style={{ fontSize: '18px', fontWeight: '700' }}>{projectData.full_name || projectData.customer_name}</p>
                   </div>
                   <div>
                      <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0066cc', marginBottom: '4px' }}>Company</p>
                      <p style={{ fontSize: '18px', fontWeight: '700' }}>{projectData.company_name || projectData.organization_name || '-'}</p>
                   </div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                   <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '8px' }}>Final Completion</p>
                   <p style={{ fontSize: '60px', fontWeight: '900' }}>{projectData.client_projects?.[0]?.progress || 0}%</p>
                   <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#10b981', marginTop: '8px' }}>Status: {projectData.client_projects?.[0]?.status || "Pending"}</p>
                </div>
             </div>

             {/* Timeline Section */}
             <div style={{ marginBottom: '64px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>Development Timeline</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                   {projectData.client_projects?.[0]?.updates?.slice(0, 5).map((upd: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', gap: '24px' }}>
                         <div style={{ width: '64px', fontSize: '10px', fontWeight: '900', color: '#cbd5e1', paddingTop: '4px' }}>
                            {new Date(upd.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                         </div>
                         <div>
                            <p style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>{upd.title}</p>
                            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>{upd.description}</p>
                         </div>
                      </div>
                   ))}
                   {(!projectData.client_projects?.[0]?.updates || projectData.client_projects[0].updates.length === 0) && (
                     <p style={{ fontSize: '12px', color: '#94a3b8' }}>Belum ada riwayat pembaruan.</p>
                   )}
                </div>
             </div>

             {/* Asset Summary */}
             <div style={{ marginBottom: '64px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>Project Documents</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                   {projectData.client_projects?.[0]?.files?.slice(0, 6).map((file: any, idx: number) => (
                      <div key={idx} style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                         <div style={{ width: '32px', height: '32px', backgroundColor: '#ffffff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                            <FileText size={14} />
                         </div>
                         <p style={{ fontSize: '10px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.filename}</p>
                      </div>
                   ))}
                   {(!projectData.client_projects?.[0]?.files || projectData.client_projects[0].files.length === 0) && (
                     <p style={{ fontSize: '12px', color: '#94a3b8' }}>Belum ada dokumen proyek.</p>
                   )}
                </div>
             </div>

             {/* Footer */}
             <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                   <p style={{ fontSize: '10px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px' }}>Generated On</p>
                   <p style={{ fontSize: '12px', fontWeight: '700' }}>{new Date().toLocaleString('id-ID')}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <p style={{ fontSize: '10px', fontWeight: '700', color: '#cbd5e1', marginBottom: '8px' }}>Digital Signature</p>
                   <p style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '24px', color: '#0f172a' }}>Mitralabs.id</p>
                </div>
             </div>
          </div>
        </div>
      )}
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
