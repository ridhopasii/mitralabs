"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase, logActivity } from "@/lib/supabase";
import {
  ArrowLeft, Package, User, Mail, Phone, Calendar, CheckCircle2,
  Clock, AlertCircle, TrendingUp, Upload, FileText, Plus, MessageSquare,
  Loader2, Trash2, Link2, ExternalLink, Download, Target, Play
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

  const fetchData = async () => {
    setLoading(true);
    // Fetch booking and its related project, files, updates, invoices
    const { data: bData, error } = await supabase
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
      .eq("id", bookingId)
      .single();

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
      // Insert new ClientProject
      const { data: newProj, error } = await supabase.from('ClientProject').insert([{
        booking_id: booking.id,
        client_id: booking.client_id, // Might be null if user didn't register
        project_name: `Projek ${booking.plan_name} - ${booking.customer_name.split(' ')[0]}`,
        status: "Active",
        progress: 0
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
                    { id: "invoices", label: "Kwitansi", icon: FileText }
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
                   </div>
                 )}

                 {/* TAB 3: INVOICE */}
                 {activeTab === "invoices" && (
                   <div className="space-y-10">
                     <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-slate-900">Riwayat Kwitansi & Tagihan</h4>
                          <p className="text-xs text-slate-500 mt-1">Kwitansi akan muncul di dashboard klien jika ditautkan ke order ini.</p>
                        </div>
                        <Link href="/admin/invoice/create" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
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
