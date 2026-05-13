"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase, logActivity } from "@/lib/supabase";
import {
  ArrowLeft, Package, User, Mail, Phone, Calendar, CheckCircle2,
  Clock, AlertCircle, TrendingUp, Upload, FileText, Plus, MessageSquare,
  Loader2, Trash2, Link2, ExternalLink, Download, Target, Play, Send, Sparkles, Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");
  const [progressVal, setProgressVal] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [assetRequestName, setAssetRequestName] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isUploadingChatFile, setIsUploadingChatFile] = useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  const chatFileInputRef = React.useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === "chat") scrollToBottom();
  }, [activeTab, project]);

  const handleRequestAsset = async () => {
    if (!project || !assetRequestName.trim()) return;
    setIsUpdating(true);
    try {
      await supabase.from('ProjectAsset').insert([{
        project_id: project.id,
        name: assetRequestName,
        category: "Other",
        status: "Pending"
      }]);
      setAssetRequestName("");
      fetchData();
    } catch (e: any) {
      alert("Gagal request aset: " + e.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAsset = async (id: number) => {
    if (!confirm("Hapus request aset ini?")) return;
    await supabase.from('ProjectAsset').delete().eq('id', id);
    fetchData();
  };

  const fetchData = async () => {
    console.log("🔍 Fetching booking detail for ID:", bookingId, "Parsed:", parseInt(bookingId));
    setLoading(true);
    // Fetch booking and its related project, files, updates, invoices
    const { data: bData, error } = await supabase
      .from("Booking")
      .select(`
        *,
        invoices:Invoice (*),
        client_projects:ClientProject (
          *,
          files:ProjectFile (*),
          updates:ProjectUpdate (*),
          assets:ProjectAsset (*),
          chats:ProjectChat (*),
          documentRequests:DocumentRequest (*)
        )
      `)
      .eq("id", parseInt(bookingId))
      .single();

    if (error) {
      console.error("❌ Error fetching booking:", error);
    }

    if (bData) {
      setBooking(bData);
      if (bData.client_projects && bData.client_projects.length > 0) {
        setProject(bData.client_projects[0]);
        setProgressVal(bData.client_projects[0].progress || 0);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [bookingId]);

  const handleCreateProject = async () => {
    setIsUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let currentClientId = booking.client_id;

      // Auto-create client profile if missing
      const now = new Date().toISOString();
      if (!currentClientId) {
        currentClientId = crypto.randomUUID();
        await supabase.from('Client').insert([{
          id: currentClientId,
          email: booking.customer_email,
          full_name: booking.customer_name,
          company_name: booking.organization_name,
          phone: booking.customer_phone,
          created_at: now,
          updated_at: now
        }]);
        await supabase.from('Booking').update({ client_id: currentClientId }).eq('id', booking.id);
      }

      // Insert new ClientProject
      const { data: newProj, error } = await supabase.from('ClientProject').insert([{
        id: crypto.randomUUID(),
        booking_id: booking.id,
        client_id: currentClientId,
        project_name: `Projek ${booking.plan_name} - ${booking.customer_name.split(' ')[0]}`,
        description: `Workspace otomatis untuk pesanan ${booking.service_type}: ${booking.plan_name}. ${booking.project_brief || ''}`,
        status: "Active",
        progress: 0,
        created_at: now,
        updated_at: now
      }]).select().single();

      if (error) throw error;
      await logActivity("Create Project Workspace", `ID Booking: ${booking.id}`);
      fetchData();
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProgress = async () => {
    if (!project || !updateMsg.trim()) return;
    setIsUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const adminName = user?.email || "Admin";

      // Update progress
      await supabase.from('ClientProject').update({ progress: progressVal, updated_at: new Date().toISOString() }).eq('id', project.id);

      // Insert Update Log
      await supabase.from('ProjectUpdate').insert([{
        project_id: project.id,
        title: `Progres Terkini (${progressVal}%)`,
        description: updateMsg,
        progress: progressVal,
        created_by: adminName
      }]);

      await logActivity("Update Progres", `Proyek: ${project.project_name} -> ${progressVal}%`);
      setUpdateMsg("");
      fetchData();
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!project) return;
    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `client_docs/${project.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('mitralabs_assets').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('mitralabs_assets').getPublicUrl(filePath);

      await supabase.from('ProjectFile').insert([{
        project_id: project.id,
        filename: file.name,
        file_url: publicUrl,
        file_size: file.size,
        file_type: file.type,
        uploaded_by: user?.email || "Admin"
      }]);

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      fetchData();
    } catch (e: any) {
      alert("Upload gagal: " + e.message);
    } finally {
      setIsUploading(false);
    }
  };

  const togglePublic = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!project) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('ClientProject')
        .update({ is_public: !project.is_public })
        .eq('id', project.id);
      
      if (error) throw error;
      
      await fetchData();
      alert(project.is_public ? "Projek ditarik dari portofolio" : "Projek berhasil dipublikasi ke portofolio!");
    } catch (err: any) {
      console.error("Portfolio Error:", err);
      alert("Gagal update portfolio: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !project) return;

    setIsSendingMessage(true);
    try {
      const { data: newMessage, error } = await supabase
        .from('ProjectChat')
        .insert([{
          project_id: project.id,
          sender_type: 'admin',
          message: chatMessage.trim(),
          is_read: false
        }])
        .select()
        .single();

      if (error) throw error;

      // Local update
      setProject((prev: any) => ({
        ...prev,
        chats: [...(prev.chats || []), newMessage]
      }));

      setChatMessage("");
      setTimeout(scrollToBottom, 100);
    } catch (err: any) {
      alert("Gagal mengirim pesan: " + err.message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleChatFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !project) return;

    setIsUploadingChatFile(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${project.id}/${Date.now()}.${fileExt}`;
      const filePath = `chat/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('mitralabs_assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('mitralabs_assets')
        .getPublicUrl(filePath);

      // Send chat message with file
      const { data: newMessage, error: chatError } = await supabase.from('ProjectChat').insert([{
        project_id: project.id,
        sender_type: 'admin',
        message: `Admin mengirim file: ${file.name}`,
        file_url: publicUrl,
        file_type: file.type.startsWith('image/') ? 'image' : 'file'
      }]).select().single();

      if (chatError) throw chatError;
      
      setProject((prev: any) => ({
        ...prev,
        chats: [...(prev.chats || []), newMessage]
      }));
      setTimeout(scrollToBottom, 100);
    } catch (err: any) {
      alert("Gagal upload file: " + err.message);
    } finally {
      setIsUploadingChatFile(false);
      if (chatFileInputRef.current) chatFileInputRef.current.value = "";
    }
  };

  const handleUpdateDocRequestStatus = async (id: number, status: string) => {
    setIsUpdating(true);
    try {
      await supabase.from('DocumentRequest').update({ status }).eq('id', id);
      fetchData();
    } catch (e: any) {
      alert("Gagal update status: " + e.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteDocRequest = async (id: number) => {
    if (!confirm("Hapus request ini?")) return;
    await supabase.from('DocumentRequest').delete().eq('id', id);
    fetchData();
  };

  const handleDeleteFile = async (id: number) => {
    if (!confirm("Hapus dokumen ini?")) return;
    await supabase.from('ProjectFile').delete().eq('id', id);
    fetchData();
  };

  const updateBookingStatus = async (newStatus: string) => {
    await supabase.from('Booking').update({ status: newStatus }).eq('id', booking.id);
    fetchData();
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-slate-400" size={40} /></div>;
  if (!booking) return <div className="p-10 text-center text-slate-500">Booking tidak ditemukan.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24">
      {/* Header */}
      <div className="flex items-center gap-6">
        <Link href="/admin/booking" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm transition-all border border-slate-100">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            Manajemen Order #{booking.id}
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">{booking.plan_name} — {booking.customer_name}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-8">
             <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Informasi Klien</p>
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><User size={14} /></div>
                     <p className="text-sm font-bold text-slate-900">{booking.customer_name}</p>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Mail size={14} /></div>
                     <p className="text-sm font-medium text-slate-600">{booking.customer_email}</p>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Phone size={14} /></div>
                     <p className="text-sm font-medium text-slate-600">{booking.customer_phone}</p>
                   </div>
                </div>
             </div>

             <div className="pt-6 border-t border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Detail Order</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Layanan</span>
                    <span className="text-xs font-bold">{booking.service_type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Nilai Proyek</span>
                    <span className="text-sm font-black text-slate-900">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits:0 }).format(booking.total_price)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Status Pembayaran</span>
                    <select 
                      value={booking.status}
                      onChange={(e) => updateBookingStatus(e.target.value)}
                      className={`text-xs font-bold rounded-lg px-2 py-1 outline-none ${
                        booking.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
             </div>

             {/* Tracking Details for Admin */}
             <div className="pt-6 border-t border-slate-100 bg-slate-50 rounded-2xl p-4 mt-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Kredensial Tracking Klien</p>
                <p className="text-xs font-medium text-slate-600 mb-1">Email: <span className="font-bold">{booking.customer_email}</span></p>
                <p className="text-xs font-medium text-slate-600">Password: <span className="font-bold font-mono">{booking.tracking_password || "Belum diatur"}</span></p>
                <a href={`/track?email=${encodeURIComponent(booking.customer_email)}&pass=${encodeURIComponent(booking.tracking_password)}`} target="_blank" className="mt-3 block text-center py-2 bg-white rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-200 hover:border-slate-400 transition-all text-slate-600">Lihat Dashboard Klien</a>
             </div>

             {/* Portfolio Otonom */}
             {project && (
               <div className={`pt-6 border-t border-slate-100 rounded-2xl p-6 mt-6 transition-all ${project.is_public ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50'}`}>
                  <div className="flex items-center justify-between mb-4">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Portfolio Otonom</p>
                     {project.is_public && (
                       <span className="px-2 py-1 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-tighter rounded-md">LIVE</span>
                     )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-2">Tampilkan di Landing Page?</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed mb-4">Jika aktif, proyek ini akan otomatis muncul di portofolio publik Mitralabs sebagai bukti hasil pengerjaan.</p>
                  
                  <button 
                    onClick={togglePublic}
                    className={`w-full py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                      project.is_public 
                        ? 'bg-white text-emerald-600 border border-emerald-200 shadow-sm hover:bg-emerald-100' 
                        : 'bg-slate-900 text-white shadow-lg hover:bg-slate-800'
                    }`}
                  >
                    {project.is_public ? 'Tarik dari Portfolio' : 'Publish ke Portfolio'}
                  </button>
               </div>
             )}
          </div>
        </div>

        {/* Main Work Area */}
        <div className="lg:col-span-8 space-y-6">
          {!project ? (
            <div className="bg-white p-16 rounded-[2.5rem] border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                 <Package size={40} />
               </div>
               <h3 className="text-2xl font-bold tracking-tight mb-3">Workspace Belum Aktif</h3>
               <p className="text-slate-500 text-sm max-w-sm mb-8">Buat ruang kerja (workspace) untuk order ini agar Anda bisa mulai upload dokumen, buat laporan, dan memperbarui progres.</p>
               <button 
                 onClick={handleCreateProject}
                 disabled={isUpdating}
                 className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
               >
                 {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />} 
                 Aktivasi Workspace Projek
               </button>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               {/* Tabs */}
               <div className="flex border-b border-slate-100 p-2 gap-2 bg-slate-50/50">
                  {[
                    { id: "overview", label: "Progres & Laporan", icon: TrendingUp },
                    { id: "dokumen", label: "Dokumen Projek", icon: FileText },
                    { id: "assets", label: "Aset Klien", icon: Package },
                    { id: "invoices", label: "Kwitansi", icon: FileText },
                    { id: "chat", label: "Chat Klien", icon: MessageSquare }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-4 flex items-center justify-center gap-2 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all ${
                        activeTab === tab.id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                      }`}
                    >
                      <tab.icon size={14} /> {tab.label}
                    </button>
                  ))}
               </div>

               <div className="p-10">
                 {/* TAB 5: CHAT */}
                 {activeTab === "chat" && (
                   <div className="flex flex-col h-[600px]">
                     <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                       {project.chats?.length > 0 ? project.chats.map((chat: any) => (
                         <div key={chat.id} className={`flex items-start gap-3 ${chat.sender_type === 'admin' ? 'flex-row-reverse' : ''}`}>
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] shrink-0 shadow-sm ${
                             chat.sender_type === 'admin' ? 'bg-slate-900 text-white' : 'bg-primary text-white'
                           }`}>
                             {chat.sender_type === 'admin' ? 'M' : booking.customer_name.charAt(0)}
                           </div>
                           <div className={`p-5 rounded-2xl shadow-sm border max-w-[80%] ${
                             chat.sender_type === 'admin' 
                               ? 'bg-slate-900 text-white border-transparent rounded-tr-none' 
                                : 'bg-white text-slate-700 border-slate-200 rounded-tl-none'
                           }`}>
                             {chat.file_url && (
                                <div className="mb-3 rounded-xl overflow-hidden border border-white/10 shadow-sm">
                                  {chat.file_type === 'image' ? (
                                    <img src={chat.file_url} alt="Attachment" className="max-w-full h-auto object-cover" />
                                  ) : (
                                    <a href={chat.file_url} target="_blank" className={`flex items-center gap-3 p-4 ${chat.sender_type === 'admin' ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-600'}`}>
                                      <FileText size={18} />
                                      <div className="flex-1 overflow-hidden">
                                         <p className="text-[10px] font-black uppercase tracking-widest truncate">Download File</p>
                                         <p className="text-[8px] opacity-60">Klik untuk melihat</p>
                                      </div>
                                      <Download size={14} />
                                    </a>
                                  )}
                                </div>
                              )}
                             <p className="text-xs font-medium leading-relaxed">{chat.message}</p>
                             <p className={`text-[8px] font-bold uppercase mt-2 ${chat.sender_type === 'admin' ? 'text-white/40' : 'text-slate-400'}`}>
                               {new Date(chat.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                             </p>
                           </div>
                         </div>
                       )) : (
                         <div className="h-full flex flex-col items-center justify-center opacity-30">
                           <MessageSquare size={48} className="mb-4" />
                           <p className="font-bold text-[10px] uppercase tracking-widest text-center">Belum ada obrolan.<br/>Sapa klien untuk memulai diskusi.</p>
                         </div>
                       )}
                       <div ref={chatEndRef} />
                     </div>

                     <form onSubmit={handleSendMessage} className="mt-6 flex gap-4 items-center">
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
                         placeholder="Ketik balasan untuk klien..."
                         className="flex-grow bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-medium text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                       />
                       <button 
                         type="submit" 
                         disabled={isSendingMessage || !chatMessage.trim()}
                         className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg disabled:opacity-30 shrink-0"
                       >
                         {isSendingMessage ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                       </button>
                     </form>
                   </div>
                 )}

                 {/* TAB 1: PROGRES */}
                 {activeTab === "overview" && (
                   <div className="space-y-12">
                     <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                        <div className="flex justify-between items-end mb-6">
                           <div>
                             <h4 className="font-bold text-slate-900">Perbarui Status Pengerjaan</h4>
                             <p className="text-xs text-slate-500 mt-1">Klien akan melihat ini langsung di Dashboard mereka.</p>
                           </div>
                           <div className="text-3xl font-black text-slate-900">{progressVal}%</div>
                        </div>
                        <input type="range" min="0" max="100" value={progressVal} onChange={(e) => setProgressVal(Number(e.target.value))} className="w-full mb-6 accent-slate-900" />
                        <div className="space-y-4">
                           <textarea 
                             placeholder="Tuliskan detail progres atau laporan (contoh: Tahap desain UI telah selesai...)"
                             value={updateMsg}
                             onChange={(e) => setUpdateMsg(e.target.value)}
                             className="w-full p-5 rounded-2xl border border-slate-200 outline-none focus:border-slate-900 font-medium text-sm h-32 resize-none"
                           />
                           <button 
                             onClick={handleUpdateProgress}
                             disabled={isUpdating || !updateMsg.trim()}
                             className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                           >
                             {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Simpan & Publikasi Laporan
                           </button>
                        </div>
                     </div>

                     <div>
                        <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><Target size={18} className="text-slate-400" /> Riwayat Laporan</h4>
                        <div className="space-y-4">
                           {project.updates?.length > 0 ? project.updates.map((upd: any) => (
                             <div key={upd.id} className="p-6 border border-slate-100 rounded-2xl flex gap-6 group hover:border-slate-300 transition-all">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-black shrink-0">
                                  {upd.progress}%
                                </div>
                                <div>
                                   <p className="font-bold text-sm text-slate-900">{upd.title}</p>
                                   <p className="text-xs text-slate-500 mt-1 leading-relaxed">{upd.description}</p>
                                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mt-3">{new Date(upd.created_at).toLocaleString('id-ID')}</p>
                                </div>
                             </div>
                           )) : (
                             <p className="text-sm text-slate-400 italic">Belum ada riwayat laporan.</p>
                           )}
                        </div>
                     </div>
                   </div>
                 )}

                 {/* TAB 2: DOKUMEN */}
                 {activeTab === "dokumen" && (
                   <div className="space-y-10">
                     <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-slate-900">Dokumen Spesifik Projek</h4>
                          <p className="text-xs text-slate-500 mt-1">Upload SPK, MoU, atau Laporan khusus untuk klien ini.</p>
                        </div>
                        <label className="cursor-pointer px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                          {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                          {uploadSuccess ? 'Berhasil!' : 'Upload Dokumen'}
                          <input type="file" accept=".pdf,.doc,.docx,.zip,.jpg,.png" className="hidden" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
                        </label>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.files?.length > 0 ? project.files.map((file: any) => (
                          <div key={file.id} className="flex items-center justify-between p-5 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-2xl transition-all group shadow-sm">
                            <a href={file.file_url} target="_blank" className="flex items-center gap-4 min-w-0">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors shadow-sm shrink-0">
                                <FileText size={20} />
                              </div>
                              <div className="truncate">
                                <p className="text-xs font-bold text-slate-900 truncate">{file.filename}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{(file.file_size / 1024).toFixed(0)} KB</p>
                              </div>
                            </a>
                            <button onClick={() => handleDeleteFile(file.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors shrink-0">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )) : (
                          <div className="col-span-full py-16 border-2 border-dashed border-slate-200 rounded-3xl text-center flex flex-col items-center">
                            <Upload size={32} className="text-slate-200 mb-3" />
                            <p className="font-bold text-slate-400 text-sm">Belum ada dokumen yang diunggah.</p>
                          </div>
                        )}
                     </div>

                     {/* Client Document Requests */}
                      <div className="pt-10 border-t border-slate-100 space-y-6">
                         <div className="flex items-center gap-2">
                            <Sparkles className="text-amber-500" size={18} />
                            <h4 className="font-bold text-slate-900">Request Dokumen dari Klien</h4>
                         </div>
                         <div className="space-y-4">
                            {project.documentRequests?.length > 0 ? project.documentRequests.map((req: any) => (
                              <div key={req.id} className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100 flex flex-col md:flex-row justify-between gap-4">
                                 <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-900">{req.title}</p>
                                    <p className="text-xs text-slate-500 leading-relaxed">{req.description || "Tidak ada detail tambahan."}</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-amber-600 mt-2">Diminta pada: {new Date(req.created_at).toLocaleDateString('id-ID')}</p>
                                 </div>
                                 <div className="flex items-center gap-3 shrink-0">
                                    <select 
                                      value={req.status}
                                      onChange={(e) => handleUpdateDocRequestStatus(req.id, e.target.value)}
                                      className="px-4 py-2 bg-white border border-amber-200 rounded-xl text-[10px] font-bold uppercase outline-none"
                                    >
                                       <option value="Pending">Pending</option>
                                       <option value="Fulfilled">Fulfilled</option>
                                       <option value="Rejected">Rejected</option>
                                    </select>
                                    <button onClick={() => handleDeleteDocRequest(req.id)} className="p-2 text-amber-300 hover:text-rose-500 transition-colors">
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </div>
                            )) : (
                              <p className="text-xs text-slate-400 italic">Tidak ada request dokumen aktif dari klien.</p>
                            )}
                         </div>
                      </div>
                   </div>
                 )}

                 {/* TAB 3: ASSETS */}
                 {activeTab === "assets" && (
                   <div className="space-y-10">
                     <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-6">
                        <div>
                          <h4 className="font-bold text-slate-900">Request Kebutuhan Aset</h4>
                          <p className="text-xs text-slate-500 mt-1">Minta klien untuk mengunggah logo, konten, atau file pendukung lainnya.</p>
                        </div>
                        <div className="flex gap-4">
                           <input 
                             type="text" 
                             placeholder="Nama Aset (misal: Logo High-Res, Profil Perusahaan)"
                             value={assetRequestName}
                             onChange={(e) => setAssetRequestName(e.target.value)}
                             className="flex-1 p-4 rounded-xl border border-slate-200 outline-none focus:border-slate-900 font-medium text-sm"
                           />
                           <button 
                             onClick={handleRequestAsset}
                             disabled={isUpdating || !assetRequestName.trim()}
                             className="px-6 py-4 bg-slate-900 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                           >
                             {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Kirim Request
                           </button>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2"><Package size={18} className="text-slate-400" /> Daftar Request Aset</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {project.assets?.length > 0 ? project.assets.map((asset: any) => (
                             <div key={asset.id} className="p-6 bg-white border border-slate-100 rounded-2xl flex justify-between items-center group hover:border-slate-300 transition-all">
                                <div>
                                   <div className="flex items-center gap-2 mb-1">
                                      <p className="font-bold text-sm text-slate-900">{asset.name}</p>
                                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                        asset.status === 'Received' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                      }`}>
                                        {asset.status}
                                      </span>
                                   </div>
                                   {asset.url ? (
                                     <a href={asset.url} target="_blank" className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                                       <Download size={10} /> Lihat / Download File
                                     </a>
                                   ) : (
                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Menunggu Upload Klien</p>
                                   )}
                                </div>
                                <button onClick={() => handleDeleteAsset(asset.id)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors">
                                   <Trash2 size={16} />
                                </button>
                             </div>
                           )) : (
                             <p className="col-span-full py-10 text-center text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-slate-50/50 rounded-2xl">Belum ada request aset.</p>
                           )}
                        </div>
                     </div>
                   </div>
                 )}

                 {/* TAB 4: INVOICE */}
                 {activeTab === "invoices" && (
                   <div className="space-y-10">
                     <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-slate-900">Riwayat Kwitansi & Tagihan</h4>
                          <p className="text-xs text-slate-500 mt-1">Kwitansi akan muncul di dashboard klien jika ditautkan ke order ini.</p>
                        </div>
                        <Link href={`/admin/invoice/create?bookingId=${booking.id}`} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                          <Plus size={14} /> Buat Kwitansi Baru
                        </Link>
                     </div>

                     <div className="space-y-4">
                        {booking.invoices?.length > 0 ? booking.invoices.map((inv: any) => (
                          <div key={inv.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                             <div>
                               <p className="text-sm font-bold text-slate-900 uppercase">{inv.invoice_number}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits:0 }).format(inv.amount)}</p>
                             </div>
                             <div className="flex items-center gap-4">
                               <span className={`text-[10px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>{inv.status}</span>
                               <Link href={`/invoice/${inv.invoice_number}`} target="_blank" className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-slate-900 transition-colors">
                                 <ExternalLink size={16} />
                               </Link>
                             </div>
                          </div>
                        )) : (
                          <div className="py-16 text-center opacity-40">
                            <FileText size={40} className="mx-auto mb-4" />
                            <p className="font-bold text-sm uppercase tracking-widest">Tidak ada kwitansi tertaut.</p>
                          </div>
                        )}
                     </div>
                   </div>
                 )}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
