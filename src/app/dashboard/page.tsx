"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Package, FileText, CheckCircle2, 
  Clock, LogOut, User as UserIcon, Loader2, FolderOpen,
  ArrowUpRight, Download, Phone
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClientDashboard() {
  const router = useRouter();
  const { data } = useData();

  // ALL useState hooks at the top — fixes Rules of Hooks violation
  const [client, setClient] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActivating, setIsActivating] = useState(false);
  const [activationForm, setActivationForm] = useState({ full_name: "", phone: "", company_name: "" });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: clientData } = await supabase
        .from("Client")
        .select(`
          *,
          projects:ClientProject (
            *,
            files:ProjectFile (*),
            updates:ProjectUpdate (*)
          ),
          bookings:Booking (*)
        `)
        .eq("email", user.email)
        .single();

      setClient(clientData || null);
      setProjects(clientData?.projects || []);
      setIsLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActivating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User session not found");
      const { error } = await supabase.from("Client").insert([{
        id: user.id, email: user.email,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-slate-200 animate-spin mb-4" />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Synchronizing Dashboard...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 space-y-8">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-900"><UserIcon size={32} /></div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Aktifkan Portal Client</h1>
            <p className="text-slate-500 text-sm leading-relaxed">Lengkapi data di bawah untuk mulai memantau projek Anda.</p>
          </div>
          <form onSubmit={handleActivate} className="space-y-4 text-left">
            {[
              { label: "Nama Lengkap", key: "full_name", type: "text", placeholder: "Contoh: Ridho Robbi", required: true },
              { label: "Nomor WhatsApp", key: "phone", type: "tel", placeholder: "0812...", required: true },
              { label: "Nama Perusahaan (Opsional)", key: "company_name", type: "text", placeholder: "Indo Digital", required: false },
            ].map(f => (
              <div key={f.key} className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">{f.label}</label>
                <input required={f.required} type={f.type} placeholder={f.placeholder}
                  value={(activationForm as any)[f.key]}
                  onChange={(e) => setActivationForm({...activationForm, [f.key]: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-100" />
              </div>
            ))}
            <button disabled={isActivating} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all">
              {isActivating ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              Aktifkan Portal Sekarang
            </button>
          </form>
          <button onClick={handleLogout} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Keluar / Sign Out</button>
        </motion.div>
      </div>
    );
  }

  const waNumber = data?.settings?.waNumber || "6282381118520";

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex font-sans text-slate-900">
      <aside className="w-80 bg-white border-r border-slate-200/60 flex-col z-50 overflow-hidden shadow-sm hidden lg:flex">
        <div className="p-10 pb-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-lg">M</div>
            <div>
              <span className="block font-bold text-sm">Mitralabs</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Client Portal</span>
            </div>
          </div>
        </div>
        <nav className="flex-grow px-6 space-y-2">
          <div className="flex items-center gap-4 px-5 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[13px] shadow-xl">
            <LayoutDashboard size={18} /> Dashboard
          </div>
          <Link href="/track" className="flex items-center gap-4 px-5 py-4 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl font-bold text-[13px] transition-all">
            <Package size={18} /> Lacak via Email
          </Link>
        </nav>
        <div className="p-8 mt-auto border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-4 px-4 mb-2">
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

      <main className="flex-grow overflow-y-auto h-screen p-6 lg:p-16">
        <header className="flex justify-between items-center mb-16">
           <div className="space-y-1">
             <h1 className="text-3xl font-bold tracking-tight">Selamat Datang, {client.full_name.split(' ')[0]}!</h1>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pantau semua projek Anda di sini.</p>
           </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-center">
               <h2 className="text-xl font-bold flex items-center gap-3"><FolderOpen size={20} className="text-slate-400" /> Projek Berjalan</h2>
               <Link href="/pesan-sekarang" className="px-5 py-2.5 bg-slate-100 text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                 Order Projek Baru
               </Link>
            </div>

            <div className="grid gap-6">
               {projects.length > 0 ? projects.map((proj) => (
                 <motion.div key={proj.id} whileHover={{ y: -4 }}
                   className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-2xl transition-all group">
                   <div className="flex flex-col md:flex-row justify-between gap-8">
                     <div className="space-y-4 flex-grow">
                       <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${proj.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                         {proj.status}
                       </div>
                       <h3 className="text-2xl font-bold tracking-tight">{proj.project_name}</h3>
                       <div className="space-y-2 pt-2">
                         <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                           <span>Progress</span><span className="text-slate-900">{proj.progress}%</span>
                         </div>
                         <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                           <motion.div initial={{ width: 0 }} animate={{ width: `${proj.progress}%` }} className="h-full bg-slate-900 rounded-full" />
                         </div>
                       </div>
                     </div>
                     <div className="flex md:flex-col justify-end gap-3 shrink-0">
                       <Link 
                         href={`/track?email=${encodeURIComponent(proj.booking?.customer_email || client.email)}&pass=${encodeURIComponent(proj.booking?.tracking_password || '')}`}
                         className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-lg"
                       >
                         View Details <ArrowUpRight size={14} />
                       </Link>
                     </div>
                   </div>

                   {proj.updates?.length > 0 && (
                     <div className="mt-10 pt-8 border-t border-slate-100">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6">Timeline</p>
                       <div className="space-y-5">
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
                     </div>
                   )}

                   {proj.files?.length > 0 && (
                     <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                       {proj.files.map((file: any) => (
                         <a key={file.id} href={file.file_url} target="_blank"
                           className="flex items-center justify-between p-4 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl transition-all group/file">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover/file:text-red-500 transition-colors">
                               <FileText size={18} />
                             </div>
                             <div>
                               <p className="text-[11px] font-bold text-slate-900 uppercase truncate max-w-[150px]">{file.filename}</p>
                               <p className="text-[9px] text-slate-400 uppercase">{file.file_type || 'PDF'}</p>
                             </div>
                           </div>
                           <Download size={14} className="text-slate-300 group-hover/file:text-slate-900" />
                         </a>
                       ))}
                     </div>
                   )}
                 </motion.div>
               )) : (
                 <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200/60">
                   <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Belum ada projek aktif.</p>
                   <Link href="/pesan-sekarang" className="mt-4 inline-block text-primary font-bold text-xs hover:underline uppercase tracking-widest">Pesan Website Pertama Anda</Link>
                 </div>
               )}
            </div>
          </div>

          <div className="space-y-10">
            <div className="bg-[#1D1D1F] text-white p-10 rounded-[2.5rem] shadow-2xl space-y-8">
               <h3 className="text-sm font-bold uppercase tracking-[0.2em] opacity-40">Financial Overview</h3>
               <div className="space-y-6">
                  {client.bookings?.map((b: any) => (
                    <div key={b.id} className="pt-6 border-t border-white/10 flex justify-between items-center">
                       <div>
                         <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1">Projek #{b.id}</p>
                         <p className="text-xl font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(b.total_price)}</p>
                       </div>
                       <div className={`w-3 h-3 rounded-full ${b.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                    </div>
                  ))}
                  {(!client.bookings || client.bookings.length === 0) && <p className="text-xs opacity-40 italic">Belum ada transaksi.</p>}
               </div>
               <Link href="/track" className="block w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-center font-bold text-[10px] uppercase tracking-[0.2em] transition-all">
                 Lacak &amp; Lihat Invoice
               </Link>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm space-y-6">
               <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Support Center</h3>
               <p className="text-xs text-slate-500 leading-relaxed">Butuh bantuan teknis atau konsultasi projek?</p>
               <a href={`https://wa.me/${waNumber}`} target="_blank"
                 className="w-full py-4 border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold text-[10px] uppercase tracking-widest">
                 <Phone size={16} /> WhatsApp Support
               </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
