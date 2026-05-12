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
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

type BookingStatus = "Pending" | "Proposal" | "Contract" | "Active" | "Done";

const columns: { id: BookingStatus; label: string; icon: any; color: string }[] = [
  { id: "Pending", label: "Leads / Baru", icon: Zap, color: "bg-amber-500" },
  { id: "Proposal", label: "Proposal", icon: FileText, color: "bg-blue-500" },
  { id: "Contract", label: "Kontrak (SPK)", icon: ShieldCheck, color: "bg-indigo-500" },
  { id: "Active", label: "Proyek Aktif", icon: Clock, color: "bg-emerald-500" },
  { id: "Done", label: "Selesai", icon: CheckCircle2, color: "bg-slate-900" },
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
      alert("Gagal memperbarui status");
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.organization_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FBFBFD] p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">CRM & PIPELINE</h1>
            <p className="text-slate-500 font-medium">Kelola leads dan alur kerja projek Mitralabs.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari klien atau instansi..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium text-sm"
              />
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start overflow-x-auto pb-8">
          {columns.map(col => (
            <div key={col.id} className="min-w-[300px] flex flex-col gap-4">
              {/* Column Header */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${col.color}`} />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{col.label}</h3>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[9px] font-bold">
                    {filteredBookings.filter(b => b.status === col.id).length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="bg-slate-50/50 p-3 rounded-[2rem] border border-slate-100 min-h-[600px] space-y-4">
                <AnimatePresence>
                  {filteredBookings
                    .filter(b => b.status === col.id)
                    .map(booking => (
                      <motion.div
                        key={booking.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">#{booking.id}</p>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical size={14} className="text-slate-400 cursor-pointer" />
                          </div>
                        </div>
                        
                        <h4 className="font-bold text-slate-900 leading-tight mb-1">{booking.customer_name}</h4>
                        <p className="text-[10px] font-medium text-slate-500 mb-4">{booking.organization_name || "Personal"}</p>
                        
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                            <Zap size={12} /> {booking.service_type}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                            <FileText size={12} /> {booking.plan_name}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <p className="text-[11px] font-black text-slate-900">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(booking.total_price)}
                          </p>
                          <div className="flex gap-1">
                            {col.id !== "Pending" && (
                              <button 
                                onClick={() => updateStatus(booking.id, columns[columns.findIndex(c => c.id === col.id) - 1].id)}
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                              >
                                <ArrowLeft size={14} />
                              </button>
                            )}
                            {col.id !== "Done" && (
                              <button 
                                onClick={() => updateStatus(booking.id, columns[columns.findIndex(c => c.id === col.id) + 1].id)}
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-900 transition-colors bg-slate-50"
                              >
                                <ArrowRight size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {isUpdating === booking.id && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                            <Loader2 size={20} className="animate-spin text-slate-900" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                </AnimatePresence>
                
                {filteredBookings.filter(b => b.status === col.id).length === 0 && (
                  <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Kosong</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
