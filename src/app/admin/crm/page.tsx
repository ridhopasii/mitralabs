"use client";

import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { 
  Users, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  MoreVertical, 
  ArrowRight,
  ArrowLeft,
  Loader2,
  Search,
  Plus,
  TrendingUp,
  Phone,
  Mail,
  Receipt,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type BookingStatus = "Pending" | "Proposal" | "Contract" | "Active" | "Done";

const columns: { id: BookingStatus; label: string; icon: any; color: string; bgColor: string }[] = [
  { id: "Pending", label: "New Leads", icon: Zap, color: "text-amber-500", bgColor: "bg-amber-50" },
  { id: "Proposal", label: "Proposal", icon: FileText, color: "text-blue-500", bgColor: "bg-blue-50" },
  { id: "Contract", label: "SPK / Kontrak", icon: ShieldCheck, color: "text-indigo-500", bgColor: "bg-indigo-50" },
  { id: "Active", label: "Project Aktif", icon: Clock, color: "text-emerald-500", bgColor: "bg-emerald-50" },
  { id: "Done", label: "Completed", icon: CheckCircle2, color: "text-slate-900", bgColor: "bg-slate-100" },
];

export default function CRMPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("Booking")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: number, newStatus: BookingStatus) => {
    setIsUpdating(id);
    try {
      const { error } = await supabase
        .from("Booking")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.organization_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const calculateColumnTotal = (status: BookingStatus) => {
    return bookings.filter(b => b.status === status).reduce((sum, b) => sum + (b.total_price || 0), 0);
  };

  return (
    <div className="space-y-12 pb-32">
      {/* Header Bento Section */}
      <div className="grid lg:grid-cols-12 gap-8 px-4">
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Sales Pipeline.</h1>
          <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-xl">
            Visualisasikan alur bisnis Mitralabs secara real-time. Pantau setiap deal dari leads awal hingga sukses.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
             <div className="relative group flex-grow max-w-md">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari klien atau instansi..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-100 border-none rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-slate-200 font-bold text-sm transition-all"
                />
             </div>
             <div className="flex bg-slate-100 p-1 rounded-2xl">
                <div className="px-6 py-3 bg-white rounded-xl shadow-sm">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Total Pipeline</p>
                   <p className="text-sm font-black text-slate-900">{formatCurrency(bookings.reduce((sum, b) => sum + (b.total_price || 0), 0))}</p>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                 <TrendingUp size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Active Projects</p>
                 <p className="text-3xl font-black text-slate-900">{bookings.filter(b => b.status === "Active").length}</p>
              </div>
           </div>
           <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between text-white overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center relative z-10">
                 <Users size={20} />
              </div>
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Clients</p>
                 <p className="text-3xl font-black tracking-tight">{Array.from(new Set(bookings.map(b => b.customer_email))).length}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="px-4 overflow-x-auto pb-12 custom-scrollbar">
        <div className="flex gap-8 min-w-[1500px]">
          {columns.map(col => (
            <div key={col.id} className="w-[320px] shrink-0 flex flex-col gap-6">
              {/* Column Header */}
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${col.bgColor} ${col.color} rounded-xl flex items-center justify-center`}>
                    <col.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 leading-none">{col.label}</h3>
                    <p className="text-[10px] font-bold text-slate-300 mt-1">{formatCurrency(calculateColumnTotal(col.id))}</p>
                  </div>
                </div>
                <span className="w-8 h-8 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black flex items-center justify-center">
                  {filteredBookings.filter(b => b.status === col.id).length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="bg-slate-50/50 p-4 rounded-[3rem] border border-slate-100 min-h-[700px] space-y-5">
                <AnimatePresence mode="popLayout">
                  {filteredBookings
                    .filter(b => b.status === col.id)
                    .map(booking => (
                      <motion.div
                        key={booking.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">ORDER #{booking.id}</p>
                             <h4 className="font-black text-slate-900 tracking-tight leading-tight text-lg">{booking.customer_name}</h4>
                             <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{booking.organization_name || "Personal Client"}</p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                             <MoreVertical size={16} className="text-slate-300 cursor-pointer" />
                          </div>
                        </div>

                        <div className="space-y-4 mb-8">
                           <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400">
                                 <Zap size={14} />
                              </div>
                              <div className="min-w-0">
                                 <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Service Type</p>
                                 <p className="text-[11px] font-bold text-slate-600 truncate">{booking.service_type} - {booking.plan_name}</p>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-6 px-2">
                              <div className="flex items-center gap-2 text-slate-300 group-hover:text-slate-600 transition-colors">
                                 <Phone size={12} />
                                 <span className="text-[10px] font-bold">Call</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-300 group-hover:text-slate-600 transition-colors">
                                 <Mail size={12} />
                                 <span className="text-[10px] font-bold">Mail</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                          <div>
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Value</p>
                             <p className="text-sm font-black text-slate-900">
                                {formatCurrency(booking.total_price)}
                             </p>
                          </div>
                          <div className="flex gap-2">
                            {col.id !== "Pending" && (
                              <button 
                                onClick={() => updateStatus(booking.id, columns[columns.findIndex(c => c.id === col.id) - 1].id)}
                                className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-xl text-slate-300 hover:text-slate-900 transition-all border border-slate-50"
                              >
                                <ArrowLeft size={16} />
                              </button>
                            )}
                            {col.id !== "Done" && (
                              <button 
                                onClick={() => updateStatus(booking.id, columns[columns.findIndex(c => c.id === col.id) + 1].id)}
                                className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                              >
                                <ArrowRight size={16} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Quick Actions Overlay (Mobile/Hover) */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                           <Link href={`/admin/booking`} className="p-2 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-lg block mb-2 shadow-sm transition-all">
                              <Receipt size={14} />
                           </Link>
                        </div>

                        {isUpdating === booking.id && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-[2rem] z-20">
                            <Loader2 size={24} className="animate-spin text-slate-900" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                </AnimatePresence>
                
                {filteredBookings.filter(b => b.status === col.id).length === 0 && (
                  <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2.5rem] opacity-30 space-y-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                       <Plus size={18} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Queue Empty</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Strategy Card */}
      <div className="px-4">
         <div className="bg-white rounded-[4rem] p-12 lg:p-20 border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center gap-12 group overflow-hidden relative">
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-50 rounded-full -mr-40 -mb-40 transition-transform duration-1000 group-hover:scale-150" />
            <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center shrink-0 relative z-10 shadow-2xl group-hover:-rotate-12 transition-transform">
               <TrendingUp size={40} />
            </div>
            <div className="relative z-10 space-y-4 text-center lg:text-left">
               <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Revenue Pipeline Optimized.</h4>
               <p className="text-slate-400 text-lg leading-relaxed font-medium max-w-2xl">
                  Gunakan visualisasi Kanban ini untuk memastikan tidak ada leads yang terlewat. Tim operasional dapat memindahkan kartu untuk memicu alur kerja otomatis di sistem belakang layar.
               </p>
               <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                  <div className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                     Smart Tracking
                  </div>
                  <div className="px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                     Instant Invoicing
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
