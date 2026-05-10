"use client";

import { useState, useEffect } from "react";
import { useData, Booking, Invoice } from "@/context/DataContext";
import Link from "next/link";
import { downloadInvoicePDF } from "@/lib/pdf-utils";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  Phone,
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Edit3,
  Trash2,
  FileText,
  CreditCard,
  Download,
  X,
  ChevronRight,
  Loader2,
  DollarSign,
  Printer,
  Send,
  ExternalLink,
  Package,
  Layers,
  ArrowUpRight,
  ChevronDown,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logActivity } from "@/lib/supabase";

export default function BookingCMS() {
  const { data, updateData } = useData();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState("logistics");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { supabase } = await import("@/lib/supabase");
      const { data: { user }, error } = await supabase.auth.getUser();

      console.log("🔐 Auth check:", { user: user?.email, error });
      setIsAuthenticated(!!user);

      if (!user) {
        setFetchError("Not authenticated. Please login first.");
      }
    };

    checkAuth();
  }, []);

  // Auto-refresh on mount to get latest data from Supabase
  useEffect(() => {
    const refreshData = async () => {
      console.log("🔄 Admin: Auto-refreshing bookings from Supabase...");
      setIsRefreshing(true);
      setFetchError(null);

      try {
        const { supabase } = await import("@/lib/supabase");

        // Check auth first
        const { data: { user } } = await supabase.auth.getUser();
        console.log("👤 Current user:", user?.email || "Not logged in");

        if (!user) {
          setFetchError("Not authenticated. Please login to view bookings.");
          setIsRefreshing(false);
          return;
        }

        // Try to fetch with Invoice relation first
        const { data: bookingsData, error } = await supabase
          .from("Booking")
          .select(`
            *,
            Invoice (*)
          `)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("❌ Admin: Error fetching bookings:", error);

          // If Invoice permission error, fallback to bookings only
          if (error.code === "42501" && error.message.includes("Invoice")) {
            console.warn("⚠️ Invoice permission denied, fetching bookings only...");
            const { data: bookingsOnly, error: bookingsError } = await supabase
              .from("Booking")
              .select("*")
              .order("created_at", { ascending: false });

            if (bookingsError) {
              setFetchError(`Database error: ${bookingsError.message}`);
            } else if (bookingsOnly) {
              const formattedBookings = bookingsOnly.map((b: any) => ({
                ...b,
                invoices: []
              }));
              setBookings(formattedBookings);
              setFetchError(null);
              console.log(`✅ Admin: Fetched ${formattedBookings.length} bookings (without invoices)`);
            }
          } else {
            setFetchError(`Database error: ${error.message}`);
          }
        } else {
          console.log(`✅ Admin: Fetched ${bookingsData?.length || 0} bookings with invoices`);

          if (bookingsData && bookingsData.length === 0) {
            setFetchError("No bookings found in database. Try submitting a test booking.");
          }

          if (bookingsData) {
            const formattedBookings = bookingsData.map((b: any) => ({
              ...b,
              invoices: b.Invoice || []
            }));

            setBookings(formattedBookings);
            setFetchError(null);
          }
        }
      } catch (err: any) {
        console.error("❌ Admin: Error refreshing bookings:", err);
        setFetchError(`Unexpected error: ${err.message}`);
      } finally {
        setIsRefreshing(false);
      }
    };

    refreshData();
  }, []); // Run once on mount

  const handleSaveBooking = async () => {
    if (!editingBooking) return;
    setIsSaving(true);

    try {
      const { supabase } = await import("@/lib/supabase");

      const isNew = !bookings.some(b => b.id === editingBooking.id);

      if (isNew) {
        // Create new booking
        const now = new Date().toISOString();
        const { data: insertedData, error } = await supabase.from("Booking").insert([{
          ...editingBooking,
          created_at: now,
          updated_at: now
        }]).select();

        if (!error && insertedData) {
          setBookings([insertedData[0], ...bookings]);
        }
      } else {
        // Update existing booking
        const { error } = await supabase
          .from("Booking")
          .update({
            ...editingBooking,
            updated_at: new Date().toISOString()
          })
          .eq("id", editingBooking.id);

        if (!error) {
          setBookings(bookings.map(b => b.id === editingBooking.id ? editingBooking : b));
        }
      }

      setShowSuccess(true);
      setEditingBooking(null);
      setTimeout(() => setShowSuccess(false), 3000);
      await logActivity(isNew ? "Create Booking" : "Update Booking", `Customer: ${editingBooking.customer_name}`);
    } catch (err) {
      console.error("Error saving booking:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.from("Booking").delete().eq("id", bookingId);

      if (!error) {
        setBookings(bookings.filter(b => b.id !== bookingId));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        await logActivity("Delete Booking", `Booking ID: ${bookingId}`);
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBookings(new Set());
    } else {
      setSelectedBookings(new Set(filteredBookings.map(b => b.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectBooking = (bookingId: number) => {
    const newSelected = new Set(selectedBookings);
    if (newSelected.has(bookingId)) {
      newSelected.delete(bookingId);
    } else {
      newSelected.add(bookingId);
    }
    setSelectedBookings(newSelected);
    setSelectAll(newSelected.size === filteredBookings.length);
  };

  const handleBulkDelete = async () => {
    if (selectedBookings.size === 0) return;
    if (!confirm(`Delete ${selectedBookings.size} selected bookings?`)) return;

    try {
      const { supabase } = await import("@/lib/supabase");
      const ids = Array.from(selectedBookings);

      const { error } = await supabase.from("Booking").delete().in("id", ids);

      if (!error) {
        setBookings(bookings.filter(b => !selectedBookings.has(b.id)));
        setSelectedBookings(new Set());
        setSelectAll(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        await logActivity("Bulk Delete", `Deleted ${ids.length} bookings`);
      }
    } catch (err) {
      console.error("Error bulk deleting:", err);
    }
  };

  const generateInvoice = (booking: Booking) => {
    const newInvoice: Invoice = {
      id: Date.now(),
      invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: booking.total_price,
      status: "Unpaid",
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        { desc: `Service: ${booking.service_type} (${booking.plan_name})`, price: booking.total_price, qty: 1 }
      ],
      client_name: booking.customer_name,
      client_email: booking.customer_email,
      created_at: new Date().toISOString()
    };

    const updatedBooking = {
      ...booking,
      invoices: [...(booking.invoices || []), newInvoice]
    };

    const newBookings = bookings.map(b => b.id === booking.id ? updatedBooking : b);
    const newData = { ...data };
    newData.bookings = newBookings;

    updateData(newData);
    setBookings(newBookings);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const filteredBookings = bookings.filter(b =>
    b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    b.customer_email.toLowerCase().includes(search.toLowerCase()) ||
    b.service_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 pb-24">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 right-8 z-[500] bg-white border border-slate-200/60 px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center gap-3 backdrop-blur-xl"
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
               <CheckCircle2 size={16} />
            </div>
            <span className="font-semibold text-slate-900 text-sm tracking-tight">Sync Complete.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 px-2">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Orders</h1>
          <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-md">
            Manage your project pipelines and financial operations with precision.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative group flex-grow md:flex-grow-0">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
             <input
               type="text"
               placeholder="Search orders..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="pl-12 pr-6 py-4 bg-slate-100 border-none rounded-2xl outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 font-medium text-[13px] w-full md:w-72 transition-all"
             />
          </div>
          <button
            onClick={async () => {
              setIsRefreshing(true);
              setFetchError(null);
              try {
                const { supabase } = await import("@/lib/supabase");

                // Try with Invoice relation first
                const { data: bookingsData, error } = await supabase
                  .from("Booking")
                  .select(`
                    *,
                    Invoice (*)
                  `)
                  .order("created_at", { ascending: false });

                if (error && error.code === "42501" && error.message.includes("Invoice")) {
                  // Fallback to bookings only
                  const { data: bookingsOnly, error: bookingsError } = await supabase
                    .from("Booking")
                    .select("*")
                    .order("created_at", { ascending: false });

                  if (!bookingsError && bookingsOnly) {
                    setBookings(bookingsOnly.map((b: any) => ({ ...b, invoices: [] })));
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 2000);
                  }
                } else if (!error && bookingsData) {
                  const formattedBookings = bookingsData.map((b: any) => ({
                    ...b,
                    invoices: b.Invoice || []
                  }));

                  setBookings(formattedBookings);
                  setShowSuccess(true);
                  setTimeout(() => setShowSuccess(false), 2000);
                }
              } catch (err) {
                console.error("Error refreshing bookings:", err);
              } finally {
                setIsRefreshing(false);
              }
            }}
            disabled={isRefreshing}
            className="h-[52px] px-6 bg-blue-600 text-white rounded-2xl font-semibold text-[13px] flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10 active:scale-[0.98] disabled:opacity-50"
            title="Refresh data from database"
          >
            {isRefreshing ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            {isRefreshing ? "Syncing..." : "Refresh"}
          </button>
          {selectedBookings.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="h-[52px] px-6 bg-rose-600 text-white rounded-2xl font-semibold text-[13px] flex items-center gap-2 hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/10 active:scale-[0.98]"
              title={`Delete ${selectedBookings.size} selected bookings`}
            >
              <Trash2 size={18} /> Delete ({selectedBookings.size})
            </button>
          )}
          <button
            onClick={() => { setEditingBooking({
              id: 0,
              customer_name: "",
              customer_email: "",
              customer_phone: "",
              service_type: "UMKM Website",
              plan_name: "Standard",
              project_brief: "",
              status: "Pending",
              created_at: new Date().toISOString(),
              total_price: 3500000,
              invoices: []
            }); setActiveTab("logistics"); }}
            className="h-[52px] px-8 bg-slate-900 text-white rounded-2xl font-semibold text-[13px] flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]"
          >
            <Plus size={18} /> New Order
          </button>
        </div>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        {[
          { label: "Gross Revenue", value: `Rp ${bookings.reduce((acc, b) => acc + b.total_price, 0).toLocaleString()}`, icon: DollarSign },
          { label: "Active Pipelines", value: bookings.length, icon: Briefcase },
          { label: "Pending Tasks", value: bookings.filter(b => b.status === "Pending").length, icon: Clock },
          { label: "Success Rate", value: "98.4%", icon: TrendingUp },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all">
             <div className="flex flex-col gap-5">
                <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center">
                   <stat.icon size={18} strokeWidth={1.5} />
                </div>
                <div>
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
                   <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden mx-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-6">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                </th>
                <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">Order ID</th>
                <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">Client</th>
                <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">Project</th>
                <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">Valuation</th>
                <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                  <td className="px-6 py-8">
                    <input
                      type="checkbox"
                      checked={selectedBookings.has(booking.id)}
                      onChange={() => handleSelectBooking(booking.id)}
                      className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-[11px] font-mono font-bold text-slate-300 group-hover:text-slate-900 transition-colors">#{booking.id.toString().slice(-6)}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                        {booking.customer_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-[14px] font-semibold text-slate-900 tracking-tight leading-none mb-1.5">{booking.customer_name}</h4>
                        <p className="text-[12px] text-slate-400 font-medium">{booking.customer_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-1.5">
                      <p className="text-[13px] font-semibold text-slate-900 tracking-tight">{booking.service_type}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{booking.plan_name} Tier</p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-2">
                       <p className="text-[14px] font-bold text-slate-900 tracking-tight leading-none">Rp {booking.total_price.toLocaleString()}</p>
                       <div className="flex gap-1.5">
                          {booking.invoices?.slice(0, 1).map(inv => (
                             <Link
                               key={inv.id}
                               href={`/invoice/${inv.invoice_number}`}
                               target="_blank"
                               className="text-[10px] font-bold text-blue-500 hover:underline"
                             >
                               {inv.invoice_number}
                             </Link>
                          ))}
                          {booking.invoices && booking.invoices.length > 1 && (
                             <span className="text-[10px] font-bold text-slate-300">+{booking.invoices.length - 1}</span>
                          )}
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <BookingStatusBadge status={booking.status} />
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {/* View Invoice Button */}
                       {booking.invoices && booking.invoices.length > 0 && (
                         <Link
                           href={`/invoice/${booking.invoices[0].invoice_number}`}
                           target="_blank"
                           className="p-3 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                           title="View Invoice"
                         >
                           <FileText size={16} />
                         </Link>
                       )}

                       {/* Download Invoice Button */}
                       {booking.invoices && booking.invoices.length > 0 && (
                         <button
                           onClick={() => {
                             if (booking.invoices && booking.invoices[0]) {
                               downloadInvoicePDF(booking.invoices[0].invoice_number);
                             }
                           }}
                           className="p-3 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                           title="Download Invoice PDF"
                         >
                           <Download size={16} />
                         </button>
                       )}

                       {/* Edit Button */}
                       <button
                         onClick={() => { setEditingBooking(booking); setActiveTab("logistics"); }}
                         className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all"
                         title="Edit Booking"
                       >
                         <Edit3 size={16} />
                       </button>

                       {/* Delete Button */}
                       <button
                         onClick={() => handleDeleteBooking(booking.id)}
                         className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                         title="Delete Booking"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
             <div className="py-40 text-center">
                {fetchError ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-3xl flex items-center justify-center">
                      <AlertCircle size={40} />
                    </div>
                    <div className="space-y-2">
                      <p className="font-bold text-lg text-slate-900">Error Loading Bookings</p>
                      <p className="text-sm text-slate-500 max-w-md mx-auto">{fetchError}</p>
                      {isAuthenticated === false && (
                        <p className="text-xs text-rose-500 font-bold mt-4">Please logout and login again</p>
                      )}
                    </div>
                    <button
                      onClick={async () => {
                        setIsRefreshing(true);
                        setFetchError(null);
                        try {
                          const { supabase } = await import("@/lib/supabase");
                          const { data: { user } } = await supabase.auth.getUser();

                          if (!user) {
                            setFetchError("Not authenticated");
                            return;
                          }

                          // Try with Invoice relation first
                          const { data: bookingsData, error } = await supabase
                            .from("Booking")
                            .select(`
                              *,
                              Invoice (*)
                            `)
                            .order("created_at", { ascending: false });

                          if (error && error.code === "42501" && error.message.includes("Invoice")) {
                            // Fallback to bookings only
                            const { data: bookingsOnly, error: bookingsError } = await supabase
                              .from("Booking")
                              .select("*")
                              .order("created_at", { ascending: false });

                            if (bookingsError) {
                              setFetchError(`Error: ${bookingsError.message}`);
                            } else if (bookingsOnly) {
                              setBookings(bookingsOnly.map((b: any) => ({ ...b, invoices: [] })));
                              setFetchError(null);
                            }
                          } else if (error) {
                            setFetchError(`Error: ${error.message}`);
                          } else if (bookingsData) {
                            setBookings(bookingsData.map((b: any) => ({ ...b, invoices: b.Invoice || [] })));
                            setFetchError(null);
                          }
                        } catch (err: any) {
                          setFetchError(`Error: ${err.message}`);
                        } finally {
                          setIsRefreshing(false);
                        }
                      }}
                      className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
                    >
                      <Download size={18} /> Retry Fetch
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 opacity-10">
                     <Package size={64} strokeWidth={1} />
                     <p className="font-bold uppercase tracking-widest text-[10px]">No orders in queue</p>
                  </div>
                )}
             </div>
          )}
        </div>
      </div>

      {/* Apple-style Modal */}
      <AnimatePresence>
        {editingBooking && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingBooking(null)}
              className="absolute inset-0 bg-slate-900/10 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden relative z-10 border border-slate-100"
            >
              <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-xl sticky top-0 z-20">
                 <div className="flex items-center gap-5">
                    <div className="w-11 h-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                       <Briefcase size={20} />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold tracking-tight text-slate-900">
                         {editingBooking.id === 0 ? "New Order" : "Order Logistics"}
                       </h3>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pipeline Protocol</p>
                    </div>
                 </div>
                 <button onClick={() => setEditingBooking(null)} className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                    <X size={20} />
                 </button>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                  <div className="md:w-56 border-r border-slate-50 p-6 space-y-1.5 shrink-0">
                     {[
                       { id: "logistics", label: "Client", icon: User },
                       { id: "technical", label: "Project", icon: FileText },
                       { id: "financial", label: "Financials", icon: CreditCard }
                     ].map((tab) => (
                       <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-5 py-3 rounded-xl text-[12px] font-bold transition-all flex items-center gap-4 ${activeTab === tab.id ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"}`}
                       >
                         <tab.icon size={15} /> {tab.label}
                       </button>
                     ))}
                  </div>

                  <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                     <AnimatePresence mode="wait">
                        {activeTab === "logistics" && (
                          <motion.div
                            key="logistics"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-10"
                          >
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                   <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Client Name</label>
                                   <input
                                      type="text"
                                      value={editingBooking.customer_name}
                                      onChange={(e) => setEditingBooking({...editingBooking, customer_name: e.target.value})}
                                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                                   />
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                   <input
                                      type="email"
                                      value={editingBooking.customer_email}
                                      onChange={(e) => setEditingBooking({...editingBooking, customer_email: e.target.value})}
                                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                                   />
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                   <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Phone</label>
                                   <input
                                      type="text"
                                      value={editingBooking.customer_phone}
                                      onChange={(e) => setEditingBooking({...editingBooking, customer_phone: e.target.value})}
                                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                                   />
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Status</label>
                                   <select
                                      value={editingBooking.status}
                                      onChange={(e) => setEditingBooking({...editingBooking, status: e.target.value as any})}
                                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none font-bold text-[12px] uppercase tracking-widest appearance-none cursor-pointer focus:bg-white focus:border-slate-200"
                                   >
                                      <option value="Pending">Pending</option>
                                      <option value="Confirmed">Confirmed</option>
                                      <option value="In-Progress">In Production</option>
                                      <option value="Completed">Success</option>
                                      <option value="Cancelled">Cancelled</option>
                                   </select>
                                </div>
                             </div>
                          </motion.div>
                        )}

                         {activeTab === "technical" && (
                           <motion.div
                             key="technical"
                             initial={{ opacity: 0, x: 10 }}
                             animate={{ opacity: 1, x: 0 }}
                             exit={{ opacity: 0, x: -10 }}
                             className="space-y-10"
                           >
                              <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                   <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Service Type</label>
                                   <select
                                     value={editingBooking.service_type}
                                     onChange={(e) => setEditingBooking({...editingBooking, service_type: e.target.value})}
                                     className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none font-bold text-[12px] uppercase tracking-widest focus:bg-white focus:border-slate-200 transition-all"
                                   >
                                      <option value="UMKM Website">UMKM Website</option>
                                      <option value="Travel Portal">Travel Portal</option>
                                      <option value="School CMS">School CMS</option>
                                      <option value="Business Profile">Business Profile</option>
                                   </select>
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Plan Tier</label>
                                   <select
                                     value={editingBooking.plan_name}
                                     onChange={(e) => setEditingBooking({...editingBooking, plan_name: e.target.value})}
                                     className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none font-bold text-[12px] uppercase tracking-widest focus:bg-white focus:border-slate-200 transition-all"
                                   >
                                      <option value="Basic">Basic</option>
                                      <option value="Standard">Standard</option>
                                      <option value="Premium">Premium</option>
                                   </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                   <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Desired Domain</label>
                                   <input
                                      type="text"
                                      value={editingBooking.desired_domain || ""}
                                      placeholder="e.g. www.toko.com"
                                      onChange={(e) => setEditingBooking({...editingBooking, desired_domain: e.target.value})}
                                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                                   />
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Industry</label>
                                   <input
                                      type="text"
                                      value={editingBooking.business_industry || ""}
                                      placeholder="e.g. F&B, Retail"
                                      onChange={(e) => setEditingBooking({...editingBooking, business_industry: e.target.value})}
                                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                                   />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                   <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Target Audience</label>
                                   <input
                                      type="text"
                                      value={editingBooking.target_audience || ""}
                                      placeholder="e.g. Gen Z, Business Owners"
                                      onChange={(e) => setEditingBooking({...editingBooking, target_audience: e.target.value})}
                                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                                   />
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Primary CTA</label>
                                   <input
                                      type="text"
                                      value={editingBooking.primary_cta || ""}
                                      placeholder="e.g. Buy Now, Contact WA"
                                      onChange={(e) => setEditingBooking({...editingBooking, primary_cta: e.target.value})}
                                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                                   />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                   <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Competitors</label>
                                   <input
                                      type="text"
                                      value={editingBooking.competitors_list || ""}
                                      placeholder="e.g. Brand X, Brand Y"
                                      onChange={(e) => setEditingBooking({...editingBooking, competitors_list: e.target.value})}
                                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                                   />
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">System Integrations</label>
                                   <input
                                      type="text"
                                      value={editingBooking.integrations_needed || ""}
                                      placeholder="e.g. Payment Gateway, CRM"
                                      onChange={(e) => setEditingBooking({...editingBooking, integrations_needed: e.target.value})}
                                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                                   />
                                </div>
                              </div>

                              <div className="space-y-3">
                                 <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Biggest Success Expectation</label>
                                 <input
                                    type="text"
                                    value={editingBooking.biggest_expectation || ""}
                                    placeholder="What does success look like for this project?"
                                    onChange={(e) => setEditingBooking({...editingBooking, biggest_expectation: e.target.value})}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                                 />
                              </div>

                              <div className="space-y-3">
                                 <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Project Brief</label>
                                 <textarea
                                    value={editingBooking.project_brief}
                                    onChange={(e) => setEditingBooking({...editingBooking, project_brief: e.target.value})}
                                    className="w-full px-6 py-6 bg-slate-50 border border-transparent rounded-2xl outline-none font-medium text-base leading-relaxed focus:bg-white focus:border-slate-200 h-48 transition-all resize-none"
                                    placeholder="Detail requirements..."
                                 />
                              </div>
                           </motion.div>
                         )}

                        {activeTab === "financial" && (
                          <motion.div
                            key="financial"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-10"
                          >
                             <div className="space-y-3">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Total Valuation (IDR)</label>
                                <input
                                   type="number"
                                   value={editingBooking.total_price}
                                   onChange={(e) => setEditingBooking({...editingBooking, total_price: Number(e.target.value)})}
                                   className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl outline-none font-bold text-3xl text-slate-900 focus:bg-white transition-all"
                                />
                             </div>

                             <div className="space-y-5">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Linked Invoices</label>
                                <div className="grid gap-3">
                                   {editingBooking.invoices?.map((inv, i) => (
                                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all group">
                                         <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                               <FileText size={14} className="text-slate-400" />
                                            </div>
                                            <div>
                                               <p className="font-bold text-xs text-slate-900">{inv.invoice_number}</p>
                                               <p className="text-[10px] text-slate-400 font-medium">Rp {inv.amount.toLocaleString()}</p>
                                            </div>
                                         </div>
                                         <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {inv.status}
                                         </div>
                                      </div>
                                   ))}
                                   <button
                                      onClick={() => generateInvoice(editingBooking)}
                                      className="w-full py-4 border border-dashed border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all flex items-center justify-center gap-2"
                                   >
                                      <Plus size={14} /> Add Invoice
                                   </button>
                                </div>
                             </div>
                          </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
              </div>

              <div className="px-10 py-8 border-t border-slate-50 bg-slate-50/20 flex justify-end gap-4">
                 <button
                   onClick={() => setEditingBooking(null)}
                   className="px-6 py-3 text-slate-500 font-bold text-[12px] hover:text-slate-900 transition-all"
                 >
                   Discard
                 </button>
                 <button
                   onClick={handleSaveBooking}
                   disabled={isSaving}
                   className="px-10 py-3 bg-slate-900 text-white rounded-xl font-bold text-[12px] flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                 >
                   {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                   {isSaving ? "Synchronizing..." : "Commit Order"}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

const BookingStatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { color: string, icon: any }> = {
    "Pending": { color: "text-amber-500 bg-amber-500/5", icon: Clock },
    "Confirmed": { color: "text-blue-500 bg-blue-500/5", icon: CheckCircle2 },
    "In-Progress": { color: "text-purple-500 bg-purple-500/5", icon: Briefcase },
    "Completed": { color: "text-emerald-500 bg-emerald-500/5", icon: CheckCircle2 },
    "Cancelled": { color: "text-slate-400 bg-slate-400/5", icon: AlertCircle },
  };

  const { color, icon: Icon } = config[status] || config["Pending"];

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full w-fit ${color}`}>
      <Icon size={12} strokeWidth={2.5} className={status === "In-Progress" ? "animate-pulse" : ""} />
      <span className="text-[10px] font-bold uppercase tracking-widest">
        {status}
      </span>
    </div>
  );
};



