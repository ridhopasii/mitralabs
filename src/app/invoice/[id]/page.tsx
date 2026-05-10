"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { useParams } from "next/navigation";
import {
  Printer,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  Mail,
  Phone,
  Globe,
  ShieldCheck,
  CreditCard,
  Building2,
  Receipt
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PublicInvoicePage() {
  const { id } = useParams();
  const { data } = useData();
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");

        // Fetch invoice by invoice_number
        const { data: invoiceData, error } = await supabase
          .from("Invoice")
          .select("*")
          .eq("invoice_number", id)
          .single();

        if (error) {
          console.error("Error fetching invoice:", error);
        } else if (invoiceData) {
          // Parse items if it's a string
          const parsedInvoice = {
            ...invoiceData,
            items: typeof invoiceData.items === 'string'
              ? JSON.parse(invoiceData.items)
              : invoiceData.items
          };
          setInvoice(parsedInvoice);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const invoiceSettings = data.invoiceSettings || {
    companyName: "MITRALABS.ID",
    companyTagline: "Precision Web Engineering",
    companyAddress: "Medan, Sumatera Utara, Indonesia",
    companyPhone: "+62 823-8111-8520",
    companyEmail: "contact@mitralabs.id",
    bankName: "Bank Central Asia (BCA)",
    bankAccountNumber: "8000-7625-12",
    bankAccountName: "Ridho Robbi Pasi",
    taxRate: 0,
    footerNote: "Verified by Mitralabs Cryptographic Protocol"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-6"></div>
        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Loading Invoice...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-10 shadow-sm"
        >
          <AlertCircle size={40} strokeWidth={1.5} />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Document Not Found</h1>
        <p className="text-slate-500 font-medium max-w-sm mb-12 leading-relaxed">
          The requested financial document could not be located or has been archived by our security protocol.
        </p>
        <Link href="/" className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">
          Return to Portal
        </Link>
      </div>
    );
  }

  const isPaid = invoice.status === "Paid";

  return (
    <>
      <div className="min-h-screen bg-[#F5F5F7] py-12 md:py-24 px-4 md:px-6 font-sans selection:bg-primary/10">
        <div className="max-w-5xl mx-auto">
          {/* Navigation & Actions Layer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 no-print">
            <Link href="/admin/booking" className="flex items-center gap-4 text-slate-400 hover:text-slate-900 transition-all font-bold group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-200/50 group-hover:scale-105 transition-transform">
                <ChevronLeft size={20} />
              </div>
              <span className="text-sm uppercase tracking-widest">Exit to Dashboard</span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-10 py-5 bg-white text-slate-900 border border-slate-200/60 rounded-[1.5rem] font-bold text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm"
              >
                <Printer size={18} strokeWidth={1.5} /> Print
              </button>
              <button
                onClick={() => window.print()}
                className="px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold text-[11px] uppercase tracking-widest flex items-center gap-3 hover:opacity-90 transition-all shadow-2xl shadow-slate-900/20"
              >
                <Download size={18} strokeWidth={1.5} /> Save as PDF
              </button>
            </div>
          </div>

          {/* Premium Invoice Canvas */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-100"
          >
            {/* Design Element: Top Accent Bar */}
            <div className={`h-3 w-full ${isPaid ? 'bg-emerald-400' : 'bg-primary'}`} />

            {/* Inner Canvas Container */}
            <div className="p-10 md:p-24">
              {/* Header Grid */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <Receipt size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold tracking-tighter text-slate-900">{invoiceSettings.companyName}</h1>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">{invoiceSettings.companyTagline}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-slate-500 font-medium">
                    <p>{invoiceSettings.companyAddress}</p>
                    <p>{invoiceSettings.companyPhone}</p>
                    <p>{invoiceSettings.companyEmail}</p>
                  </div>
                </div>

                <div className="text-right space-y-6">
                  <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-[11px] uppercase tracking-widest border ${
                    isPaid ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${isPaid ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    {isPaid ? "Transaction Settled" : "Awaiting Settlement"}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Document Reference</p>
                    <p className="text-3xl font-bold text-slate-900 tracking-tight">{invoice.invoice_number}</p>
                  </div>
                </div>
              </div>

              {/* Stakeholder Info Grid */}
              <div className="grid md:grid-cols-2 gap-16 md:gap-32 mb-24 pb-16 border-b border-slate-50">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Building2 size={16} />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Bill To Stakeholder</p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">{invoice.client_name}</h3>
                      <p className="text-slate-500 font-medium">{invoice.client_email}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12">
                   <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Issue Date</p>
                      <p className="font-bold text-slate-900">{new Date(invoice.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Due Date</p>
                      <p className="font-bold text-rose-500">{new Date(invoice.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                   </div>
                </div>
              </div>

              {/* Line Items - Clean Minimalist Table */}
              <div className="mb-24">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-100">
                          <th className="pb-8 font-bold">Strategic Service Definition</th>
                          <th className="pb-8 text-center font-bold">Quantity</th>
                          <th className="pb-8 text-right font-bold">Unit Logic</th>
                          <th className="pb-8 text-right font-bold">Final Commitment</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {invoice.items.map((item: { desc: string; price: number; qty: number }, idx: number) => (
                         <tr key={idx} className="group">
                            <td className="py-10">
                               <p className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">{item.desc}</p>
                            </td>
                            <td className="py-10 text-center font-medium text-slate-500">{item.qty}</td>
                            <td className="py-10 text-right font-medium text-slate-500">Rp {item.price.toLocaleString()}</td>
                            <td className="py-10 text-right font-bold text-slate-900">Rp {(item.price * item.qty).toLocaleString()}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              {/* Financial Summary & Settlement Grid */}
              <div className="grid lg:grid-cols-12 gap-16 items-end">
                {/* Payment Instructions */}
                <div className="lg:col-span-7 bg-[#FBFBFD] p-10 rounded-[2.5rem] border border-slate-100 flex items-start gap-8">
                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm border border-slate-200/50">
                      <CreditCard size={24} strokeWidth={1.5} />
                   </div>
                   <div className="space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bank Settlement Protocol</h4>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 text-xl tracking-tight">{invoiceSettings.bankName}</p>
                        <p className="text-primary font-bold text-2xl tracking-tighter">{invoiceSettings.bankAccountNumber}</p>
                      </div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Account Name: {invoiceSettings.bankAccountName}</p>
                      {invoiceSettings.bankBranch && (
                        <p className="text-xs text-slate-400 font-medium">Branch: {invoiceSettings.bankBranch}</p>
                      )}
                   </div>
                </div>

                {/* Calculation Stack */}
                <div className="lg:col-span-5 space-y-6">
                   <div className="flex justify-between items-center px-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Strategic Subtotal</span>
                      <span className="font-bold text-slate-900">Rp {invoice.amount.toLocaleString()}</span>
                   </div>
                   {invoiceSettings.taxRate > 0 && (
                     <div className="flex justify-between items-center px-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{invoiceSettings.taxLabel || `Tax (${invoiceSettings.taxRate}%)`}</span>
                        <span className="font-bold text-slate-900">Rp {Math.round(invoice.amount * (invoiceSettings.taxRate / 100)).toLocaleString()}</span>
                     </div>
                   )}
                   <div className="pt-8 px-8 pb-8 bg-slate-900 text-white rounded-[2rem] flex justify-between items-center shadow-2xl shadow-slate-900/10">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-50">Total Amount Due</span>
                        <p className="text-3xl font-bold tracking-tighter">
                          Rp {(invoice.amount + (invoiceSettings.taxRate > 0 ? Math.round(invoice.amount * (invoiceSettings.taxRate / 100)) : 0)).toLocaleString()}
                        </p>
                      </div>
                      <ShieldCheck size={40} className="opacity-20" strokeWidth={1} />
                   </div>
                </div>
              </div>

              {/* Payment Instructions Section */}
              {invoiceSettings.paymentInstructions && (
                <div className="mt-16 p-10 bg-blue-50 border border-blue-100 rounded-[2.5rem]">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4">Payment Instructions</h4>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                    {invoiceSettings.paymentInstructions}
                  </p>
                </div>
              )}

              {/* Terms & Conditions Section */}
              {invoiceSettings.termsAndConditions && (
                <div className="mt-12 p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem]">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Terms & Conditions</h4>
                  <div className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                    {invoiceSettings.termsAndConditions}
                  </div>
                </div>
              )}

              {/* Secure Verification Footer */}
              <div className="mt-24 pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-3 text-slate-300">
                  <ShieldCheck size={20} strokeWidth={1.5} />
                  <p className="text-[9px] font-bold uppercase tracking-[0.4em]">{invoiceSettings.footerNote}</p>
                </div>
                <div className="flex gap-8 text-slate-400 hover:text-slate-900 transition-colors">
                   <Globe size={18} strokeWidth={1.5} />
                   <Mail size={18} strokeWidth={1.5} />
                   <Phone size={18} strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Verification Badge (Post-Print Layer) */}
          <div className="mt-12 text-center no-print opacity-30">
            <p className="text-[10px] font-bold uppercase tracking-[0.8em] text-slate-400">Authentic Digital Document</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            padding: 0 !important;
          }
          .max-w-5xl {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)], .shadow-lg, .shadow-2xl, .shadow-sm {
            box-shadow: none !important;
          }
          .border {
            border-color: #f1f1f1 !important;
          }
          .bg-[#F5F5F7] {
            background: white !important;
          }
          .rounded-[3.5rem] {
            border-radius: 0 !important;
          }
          .p-10, .p-24 {
            padding: 2rem !important;
          }
          .selection\:bg-primary\/10 {
            background: transparent !important;
          }
        }
      `}</style>
    </>
  );
}
