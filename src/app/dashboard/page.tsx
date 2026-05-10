"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ChevronRight,
  LogOut,
  User as UserIcon,
  Loader2,
  FolderOpen,
  ArrowUpRight,
  Download
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClientDashboard() {
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Fetch client data
      const { data: clientData, error: clientError } = await supabase
        .from("Client")
        .select(`
          *,
          projects:ClientProject (
            *,
            booking:Booking (*),
            files:ProjectFile (*)
          ),
          bookings:Booking (*)
        `)
        .eq("email", user.email)
        .single();

      if (clientError || !clientData) {
        // If not a registered client, maybe redirect or show guest message
        setIsLoading(false);
        return;
      }

      setClient(clientData);
      setProjects(clientData.projects || []);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-slate-200 animate-spin mb-4" />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Synchronizing Dashboard...</p>
      </div>
    );
  }

  const [isActivating, setIsActivating] = useState(false);
  const [activationForm, setActivationForm] = useState({
    full_name: "",
    phone: "",
    company_name: ""
  });

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActivating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User session not found");

      const { error } = await supabase.from("Client").insert([{
        id: user.id,
        email: user.email,
        full_name: activationForm.full_name || user.user_metadata?.full_name || "Client",
        phone: activationForm.phone,
        company_name: activationForm.company_name
      }]);

      if (error) throw error;
      window.location.reload();
    } catch (err: any) {
      alert("Gagal mengaktifkan portal: " + err.message);
    } finally {
      setIsActivating(false);
    }
  };

  if (!client) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 space-y-8"
        >
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-900 shadow-sm">
             <UserIcon size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Aktifkan Portal Client</h1>
            <p className="text-slate-500 text-sm leading-relaxed">Akun Anda belum terdaftar sebagai Client. Lengkapi data di bawah untuk mulai memantau projek Anda.</p>
          </div>

          <form onSubmit={handleActivate} className="space-y-4 text-left">
             <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Nama Lengkap</label>
               <input 
                 required
                 type="text" 
                 placeholder="Contoh: Ridho Robbi"
                 value={activationForm.full_name}
                 onChange={(e) => setActivationForm({...activationForm, full_name: e.target.value})}
                 className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-100" 
               />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Nomor WhatsApp</label>
               <input 
                 required
                 type="tel" 
                 placeholder="0812..."
                 value={activationForm.phone}
                 onChange={(e) => setActivationForm({...activationForm, phone: e.target.value})}
                 className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-100" 
               />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Nama Perusahaan (Opsional)</label>
               <input 
                 type="text" 
                 placeholder="Contoh: Indo Digital"
                 value={activationForm.company_name}
                 onChange={(e) => setActivationForm({...activationForm, company_name: e.target.value})}
                 className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-100" 
               />
             </div>
             
             <button disabled={isActivating} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
               {isActivating ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
               Aktifkan Portal Sekarang
             </button>
          </form>

          <button onClick={handleLogout} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Keluar / Sign Out</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex font-sans text-slate-900">
      
      {/* Client Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200/60 flex flex-col z-50 overflow-hidden shadow-sm hidden lg:flex">
        <div className="p-10 pb-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">M</div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight leading-none mb-1">Mitralabs</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Client Portal</span>
            </div>
          </div>
        </div>

        <nav className="flex-grow px-6 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-4 px-5 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[13px] shadow-xl shadow-slate-900/10 transition-all translate-x-2">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/track" className="flex items-center gap-4 px-5 py-4 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl font-bold text-[13px] transition-all">
            <Package size={18} /> Lacak Projek Lain
          </Link>
        </nav>

        <div className="p-8 mt-auto border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-4 px-4 mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 text-xs">
              {client.full_name?.charAt(0)}
            </div>
            <div className="overflow-hidden">
               <p className="text-sm font-bold truncate">{client.full_name}</p>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{client.company_name || 'Personal Client'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-500 font-bold text-[13px] hover:bg-rose-50 transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto h-screen p-6 lg:p-16">
        <header className="flex justify-between items-center mb-16">
           <div className="space-y-1">
             <h1 className="text-3xl font-bold tracking-tight">Selamat Datang, {client.full_name.split(' ')[0]}!</h1>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pantau semua projek Anda dalam satu tempat.</p>
           </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Projects Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-center">
               <h2 className="text-xl font-bold flex items-center gap-3">
                 <FolderOpen size={20} className="text-slate-400" /> Projek Berjalan
               </h2>
               <Link href="/pesan-sekarang" className="px-5 py-2.5 bg-slate-100 text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                 Order Projek Baru
               </Link>
            </div>

            <div className="grid gap-6">
               {projects.length > 0 ? (
                 projects.map((proj) => (
                   <motion.div 
                     key={proj.id}
                     whileHover={{ y: -4 }}
                     className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-slate-200/40 transition-all group"
                   >
                     <div className="flex flex-col md:flex-row justify-between gap-8">
                       <div className="space-y-4 flex-grow">
                          <div className="flex items-center gap-3">
                            <div className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                              ID: {proj.booking_id || 'PROJ'}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              proj.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                              {proj.status}
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">{proj.project_name}</h3>
                          <div className="space-y-4 pt-4">
                            <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                               <span>Development Progress</span>
                               <span className="text-slate-900">{proj.progress}%</span>
                            </div>
                            <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${proj.progress}%` }}
                                 className="h-full bg-slate-900 rounded-full"
                               />
                            </div>
                          </div>
                       </div>

                       <div className="flex md:flex-col justify-end gap-3 shrink-0">
                          <Link href={`/track?id=${proj.booking_id}`} className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10">
                            View Details <ArrowUpRight size={14} />
                          </Link>
                       </div>
                     </div>

                     {/* Documents for this project */}
                     {proj.files?.length > 0 && (
                       <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                         {proj.files.map((file: any) => (
                           <a 
                             key={file.id} 
                             href={file.file_url} 
                             target="_blank"
                             className="flex items-center justify-between p-4 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl transition-all group/file"
                           >
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover/file:text-red-500 transition-colors">
                                 <FileText size={18} />
                               </div>
                               <div>
                                 <p className="text-[11px] font-bold text-slate-900 uppercase truncate max-w-[150px]">{file.filename}</p>
                                 <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">{file.file_type || 'PDF'}</p>
                               </div>
                             </div>
                             <Download size={14} className="text-slate-300 group-hover/file:text-slate-900" />
                           </a>
                         ))}
                       </div>
                     )}
                   </motion.div>
                 ))
               ) : (
                 <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200/60">
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Belum ada projek aktif.</p>
                    <Link href="/pesan-sekarang" className="mt-4 inline-block text-primary font-bold text-xs hover:underline uppercase tracking-widest">Pesan Website Pertama Anda</Link>
                 </div>
               )}
            </div>

            {/* Global Resources Section */}
            <div className="mt-16 space-y-8">
               <h3 className="text-xl font-bold flex items-center gap-3">
                 <FileText size={20} className="text-slate-400" /> Resource & Panduan
               </h3>
               <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { name: "Company Profile Mitralabs", size: "11 MB", icon: FileText },
                    { name: "SOP Kerjasama & Revisi", size: "11 MB", icon: FileText },
                  ].map((res, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm flex items-center justify-between group">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                             <res.icon size={24} />
                          </div>
                          <div>
                             <p className="font-bold text-sm text-slate-900">{res.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{res.size} • PDF</p>
                          </div>
                       </div>
                       <button className="p-3 text-slate-300 hover:text-slate-900 transition-colors">
                          <Download size={20} />
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Right Column: Financials & Support */}
          <div className="space-y-10">
            <div className="bg-[#1D1D1F] text-white p-10 rounded-[2.5rem] shadow-2xl space-y-8">
               <h3 className="text-sm font-bold uppercase tracking-[0.2em] opacity-40">Financial Overview</h3>
               <div className="space-y-6">
                  {client.bookings?.map((b: any) => (
                    <div key={b.id} className="pt-6 border-t border-white/10 flex justify-between items-center">
                       <div>
                         <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1">Total Biaya Projek #{b.id}</p>
                         <p className="text-xl font-bold">
                           {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(b.total_price)}
                         </p>
                       </div>
                       <div className={`w-3 h-3 rounded-full ${b.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse'}`}></div>
                    </div>
                  ))}
                  {(!client.bookings || client.bookings.length === 0) && (
                    <p className="text-xs opacity-40 italic">Tidak ada transaksi tercatat.</p>
                  )}
               </div>
               <Link href="/dashboard/invoices" className="block w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-center font-bold text-[10px] uppercase tracking-[0.2em] transition-all">
                 View All Invoices
               </Link>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm space-y-6">
               <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Support Center</h3>
               <p className="text-xs text-slate-500 leading-relaxed">Butuh bantuan teknis atau ingin konsultasi projek?</p>
               <a 
                 href={`https://wa.me/6282381118520`} 
                 target="_blank"
                 className="w-full py-4 border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold text-[10px] uppercase tracking-widest"
               >
                 WhatsApp Dedicated Support
               </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
