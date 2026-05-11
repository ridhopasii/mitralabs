"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  FileText, 
  Calendar as CalendarIcon,
  User,
  DollarSign,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function CreateInvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [booking, setBooking] = useState<any>(null);

  // Form States
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState([{ desc: "", price: 0, qty: 1 }]);
  const [status, setStatus] = useState("Unpaid");

  useEffect(() => {
    // Generate Invoice Number
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    setInvoiceNumber(`INV-${year}-${random}`);

    // Set Default Due Date (7 days from now)
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    setDueDate(sevenDaysLater.toISOString().split("T")[0]);

    // Fetch Booking Data if ID is provided
    if (bookingId) {
      const fetchBooking = async () => {
        setIsFetching(true);
        const { data, error } = await supabase
          .from("Booking")
          .select("*")
          .eq("id", bookingId)
          .single();
        
        if (data) {
          setBooking(data);
          setClientName(data.customer_name);
          setClientEmail(data.customer_email);
          setClientCompany(data.organization_name || "");
          setItems([{ 
            desc: `${data.service_type} - ${data.plan_name} Package`, 
            price: data.total_price || 0, 
            qty: 1 
          }]);
        }
        setIsFetching(false);
      };
      fetchBooking();
    }
  }, [bookingId]);

  const addItem = () => setItems([...items, { desc: "", price: 0, qty: 1 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from("Invoice").insert([{
        booking_id: bookingId ? parseInt(bookingId) : null,
        invoice_number: invoiceNumber,
        amount: calculateTotal(),
        status: status,
        due_date: new Date(dueDate).toISOString(),
        items: items,
        client_name: clientName,
        client_email: clientEmail,
        client_company: clientCompany,
        client_address: clientAddress,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

      if (error) throw error;

      alert("Kwitansi berhasil dibuat!");
      if (bookingId) {
        router.push(`/admin/booking/${bookingId}`);
      } else {
        router.push("/admin/invoice");
      }
    } catch (err: any) {
      alert("Gagal membuat kwitansi: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-6 mb-12">
        <button onClick={() => router.back()} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100 transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Buat Kwitansi Baru</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Sistem Penagihan Digital Mitralabs</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Client Details Card */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <User size={18} className="text-primary" /> Detail Penerima
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Nama Klien</label>
                <input required type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-200" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Email Klien</label>
                <input required type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-200" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Perusahaan (Opsional)</label>
                <input type="text" value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-200" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Alamat Klien (Opsional)</label>
                <textarea value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-200 h-24 resize-none" />
              </div>
            </div>
          </div>

          {/* Invoice Info Card */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileText size={18} className="text-primary" /> Pengaturan Dokumen
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Nomor Kwitansi</label>
                <input required type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-200" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Jatuh Tempo</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input required type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-200" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Status Pembayaran</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-200 appearance-none cursor-pointer">
                  <option value="Unpaid">Belum Lunas (Unpaid)</option>
                  <option value="Paid">Lunas (Paid)</option>
                  <option value="Cancelled">Dibatalkan (Cancelled)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Briefcase size={18} className="text-primary" /> Rincian Pekerjaan
            </h3>
            <button type="button" onClick={addItem} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
              <Plus size={14} /> Tambah Item
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-12 md:col-span-6 space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-2">Deskripsi Layanan</label>
                  <input required type="text" value={item.desc} onChange={(e) => updateItem(index, "desc", e.target.value)} placeholder="Contoh: Pembuatan Landing Page" className="w-full px-5 py-4 bg-slate-50 border-none rounded-xl outline-none font-bold text-xs focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-200" />
                </div>
                <div className="col-span-6 md:col-span-3 space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-2">Harga (IDR)</label>
                  <input required type="number" value={item.price} onChange={(e) => updateItem(index, "price", parseInt(e.target.value))} className="w-full px-5 py-4 bg-slate-50 border-none rounded-xl outline-none font-bold text-xs focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-200" />
                </div>
                <div className="col-span-4 md:col-span-2 space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-2">Qty</label>
                  <input required type="number" value={item.qty} onChange={(e) => updateItem(index, "qty", parseInt(e.target.value))} className="w-full px-5 py-4 bg-slate-50 border-none rounded-xl outline-none font-bold text-xs focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-200" />
                </div>
                <div className="col-span-2 md:col-span-1 pb-1">
                  <button type="button" onClick={() => removeItem(index)} className="w-full py-4 text-rose-300 hover:text-rose-500 transition-colors flex justify-center">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Total Penagihan</p>
              <h2 className="text-4xl font-black text-slate-900">Rp {calculateTotal().toLocaleString()}</h2>
            </div>
            <button disabled={isLoading} className="w-full md:w-auto px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50">
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              {isLoading ? "Saving Data..." : "Simpan Kwitansi"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CreateInvoicePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>}>
      <CreateInvoiceContent />
    </Suspense>
  );
}
