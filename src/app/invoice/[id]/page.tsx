"use client";

import { useState, useEffect, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { useParams, useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  Globe, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight, 
  Hash, 
  Info, 
  Linkedin, 
  Instagram, 
  Copy,
  Printer,
  Download,
  ChevronLeft,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function PublicInvoicePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: globalData } = useData();
  
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch Data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data, error } = await supabase
          .from("Invoice")
          .select("*")
          .eq("invoice_number", id)
          .single();

        if (error) throw error;
        if (data) {
          setInvoice({
            ...data,
            items: typeof data.items === 'string' ? JSON.parse(data.items) : data.items
          });
        }
      } catch (err) {
        console.error("Error fetching invoice:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Format Currency
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  // PDF Download Handler (Flexible Height - Identical to Designer's Intent)
  const handleDownloadPDF = async () => {
    const element = document.getElementById("invoice-content");
    if (!element) return;

    setIsGenerating(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      
      // Flexible PDF Height logic
      const imgWidth = 210; // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Kwitansi-${invoice?.invoice_number}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-slate-400 animate-spin mb-4" />
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Memuat Dokumen...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Dokumen Tidak Ditemukan</h1>
        <Link href="/" className="text-blue-600 font-bold hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  const total = invoice.items.reduce((acc: number, item: any) => acc + (item.qty * item.price), 0);

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 px-4 font-sans text-[#1D1D1F] flex flex-col items-center">
      
      {/* Action Buttons (Hidden on Print) */}
      <div className="w-full max-w-[800px] mb-8 flex justify-between items-center print:hidden">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-all">
          <ChevronLeft size={16} /> Kembali
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Printer size={16} /> Cetak
          </button>
          <button 
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="px-6 py-3 bg-[#1D1D1F] text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Download PDF
          </button>
        </div>
      </div>

      {/* Main Document Content */}
      <div id="invoice-content" className="w-full max-w-[800px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden print:shadow-none print:rounded-none relative border border-slate-100">
        
        {/* Top Copy Indicator */}
        <div className="bg-slate-50 px-10 py-2 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
            <Copy size={10} /> Lembar 1: Pelanggan
          </div>
          <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none italic">
            Original Receipt
          </div>
        </div>

        {/* Header Section */}
        <div className="p-10 md:p-16 border-b border-[#F2F2F7]">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-[#1D1D1F] rounded-2xl flex items-center justify-center text-white text-3xl font-semibold tracking-tighter shadow-xl shadow-slate-200">M</div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">{globalData.invoiceSettings.companyName}</h2>
                  <div className="flex items-center gap-2 text-[#0066FF] font-semibold text-[11px] uppercase tracking-[0.3em]">
                    <span className="w-1.5 h-1.5 bg-[#0066FF] rounded-full"></span>
                    {globalData.invoiceSettings.companyTagline}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2 text-[13px] text-[#86868B] font-medium leading-relaxed">
                <p className="flex items-center gap-2 italic"><Building2 size={14} className="text-[#D2D2D7]" /> {globalData.invoiceSettings.companyAddress}, {globalData.invoiceSettings.companyCity}</p>
                <div className="flex gap-4">
                  <p className="flex items-center gap-2"><Globe size={14} className="text-[#D2D2D7]" /> {globalData.invoiceSettings.companyWebsite}</p>
                  <p className="flex items-center gap-2"><Phone size={14} className="text-[#D2D2D7]" /> {globalData.invoiceSettings.companyPhone}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end text-left md:text-right w-full md:w-auto">
              <div className="mb-8">
                <h1 className="text-5xl font-bold tracking-tighter text-[#1D1D1F] leading-none mb-2 italic">{invoice.invoice_type || "Kwitansi"}</h1>
                <p className="text-[#86868B] text-[10px] font-bold tracking-[0.2em] uppercase">E-Verification Success</p>
              </div>

              <div className="w-full md:min-w-[220px]">
                <div className="flex justify-between items-center text-[11px] font-bold text-[#86868B] uppercase tracking-widest mb-1">
                  <span>No. Referensi</span>
                </div>
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-4 tracking-tight">{invoice.invoice_number}</h3>
                
                <div className="flex flex-wrap md:flex-col gap-4 md:gap-2">
                  <div className="bg-[#F5F5F7] px-3 py-2 rounded-lg inline-flex flex-col border border-slate-100">
                    <span className="text-[9px] font-bold text-[#86868B] uppercase mb-0.5 tracking-wider">Tanggal Terbit</span>
                    <span className="text-xs font-bold">{new Date(invoice.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="bg-[#E8F5E9] px-3 py-2 rounded-lg inline-flex flex-col border border-[#C8E6C9]/40">
                    <span className="text-[9px] font-bold text-[#2E7D32] uppercase mb-0.5 tracking-wider">Status</span>
                    <span className="text-xs font-bold text-[#2E7D32] flex items-center gap-1">
                      <CheckCircle2 size={12} /> {invoice.status === 'Paid' ? 'Lunas' : invoice.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client & Bank Details */}
        <div className="p-10 md:px-16 md:py-12 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <h4 className="text-[11px] font-bold text-[#86868B] uppercase tracking-[0.2em] flex items-center gap-2">
                Penerima Layanan <ChevronRight size={12} className="text-[#D2D2D7]" />
              </h4>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-[#1D1D1F] tracking-tight">{invoice.client_name}</p>
                <p className="text-[#0066FF] font-bold text-sm">{invoice.client_company || "-"}</p>
                <div className="pt-4 flex flex-col gap-1 text-sm text-[#86868B] font-medium leading-relaxed italic">
                  <p className="flex items-center gap-2"><Mail size={14} className="text-[#D2D2D7]" /> {invoice.client_email}</p>
                  <p className="max-w-xs">{invoice.client_address || "-"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] font-bold text-[#86868B] uppercase tracking-[0.2em] flex items-center gap-2">
                Metode Pembayaran <ChevronRight size={12} className="text-[#D2D2D7]" />
              </h4>
              <div className="bg-[#F5F5F7] p-6 rounded-[24px] space-y-4 border border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0066FF] shadow-sm border border-[#E8E8ED]">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#86868B] uppercase leading-none mb-1 tracking-tighter">Transfer Bank</p>
                    <p className="text-sm font-bold text-[#1D1D1F]">{globalData.invoiceSettings.bankName}</p>
                  </div>
                </div>
                <div className="space-y-3 pt-2 border-t border-[#E8E8ED]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#86868B] font-medium tracking-tight">Penerima</span>
                    <span className="font-bold text-[#1D1D1F]">{globalData.invoiceSettings.bankAccountName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#86868B] font-medium tracking-tight">No. Rekening</span>
                    <span className="font-bold text-[#1D1D1F] tracking-widest font-mono">{globalData.invoiceSettings.bankAccountNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Items */}
        <div className="px-10 md:px-16 py-6 min-h-[180px]">
          <div className="mb-4 flex items-center gap-2 text-[10px] font-bold text-[#86868B] uppercase tracking-widest">
            <Info size={12} className="text-[#0066FF]" />
            Periode Proyek: <span className="text-[#1D1D1F]">
              {invoice.project_period_start ? `${new Date(invoice.project_period_start).toLocaleDateString('id-ID')} - ${new Date(invoice.project_period_end || '').toLocaleDateString('id-ID')}` : "-"}
            </span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[#1D1D1F]">
                <th className="pb-6 text-left text-[11px] font-bold text-[#86868B] uppercase tracking-[0.2em]">Deskripsi Item</th>
                <th className="pb-6 px-4 text-center text-[11px] font-bold text-[#86868B] uppercase tracking-[0.2em]">Qty</th>
                <th className="pb-6 text-right text-[11px] font-bold text-[#86868B] uppercase tracking-[0.2em]">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {invoice.items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="py-6 pr-4">
                    <p className="font-bold text-[#1D1D1F] tracking-tight mb-1">{item.desc}</p>
                    <p className="text-[11px] text-[#86868B] font-medium leading-relaxed max-w-sm">{item.details}</p>
                  </td>
                  <td className="py-6 px-4 text-center font-bold text-[#86868B] tabular-nums">{item.qty}</td>
                  <td className="py-6 text-right font-bold text-[#1D1D1F] tabular-nums">{formatCurrency(item.qty * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="px-10 md:px-16 py-10 bg-[#F5F5F7]/40 border-t border-[#F2F2F7]">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-[340px] space-y-6">
              <div>
                <h5 className="text-[10px] font-bold text-[#1D1D1F] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#2E7D32]" /> Syarat & Ketentuan
                </h5>
                <ul className="space-y-1.5">
                  {globalData.invoiceSettings.termsAndConditions.split('\n').map((term: string, idx: number) => (
                    <li key={idx} className="text-[10px] text-[#86868B] leading-relaxed font-medium flex gap-2">
                      <span className="text-[#D2D2D7]">•</span> {term}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-full md:w-[280px] space-y-3">
              <div className="flex justify-between items-center text-sm font-bold border-b border-[#E8E8ED] pb-4">
                <span className="text-[#86868B] uppercase tracking-widest text-[10px]">Subtotal</span>
                <span className="text-[#1D1D1F] tabular-nums">{formatCurrency(total)}</span>
              </div>
              
              <div className="pt-4 flex flex-col items-end">
                <p className="text-[10px] font-bold text-[#0066FF] uppercase tracking-[0.3em] mb-2">Total Akhir</p>
                <span className="text-4xl font-bold text-[#1D1D1F] tracking-tighter tabular-nums leading-none">
                  {formatCurrency(total)}
                </span>
                <div className="mt-4 inline-flex items-center gap-2 text-[#2E7D32] bg-[#E8F5E9] px-3 py-1.5 rounded-full border border-[#C8E6C9]/40">
                  <CheckCircle2 size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none">Verified Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Area */}
        <div className="px-10 md:px-16 py-16 bg-white border-t border-[#F2F2F7]">
          <div className="grid grid-cols-3 gap-12 text-center">
            
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em]">Pelanggan,</p>
              <div className="h-28 flex flex-col justify-end">
                <div className="border-b border-[#D2D2D7] w-full mx-auto"></div>
                <p className="text-[11px] font-bold text-[#1D1D1F] mt-3 uppercase tracking-tight">{invoice.client_name}</p>
                <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter italic">Signature / Digital Verified</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em]">Marketing,</p>
              <div className="h-28 flex flex-col justify-end">
                <div className="border-b border-[#D2D2D7] w-full mx-auto"></div>
                <p className="text-[11px] font-bold text-[#1D1D1F] mt-3 uppercase tracking-tight italic">
                  {globalData.invoiceSettings.signatureFields?.marketing || "Marketing Officer"}
                </p>
                <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">Finance Department</p>
              </div>
            </div>

            <div className="space-y-4 relative">
              <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em]">Owner,</p>
              <div className="h-28 flex flex-col justify-end items-center">
                {total > 5000000 && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-24 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center -rotate-6 bg-slate-50/20 px-2 rounded-md">
                    <span className="text-[7px] text-slate-300 font-bold uppercase text-center leading-none mb-1">E-Stamp Duty</span>
                    <span className="text-[10px] text-slate-300 font-black uppercase text-center leading-tight">MATERAI<br/>10.000</span>
                  </div>
                )}
                <div className="border-b border-[#D2D2D7] w-full mx-auto z-10"></div>
                <p className="text-[11px] font-bold text-[#1D1D1F] mt-3 uppercase tracking-tight z-10">
                  {globalData.invoiceSettings.signatureFields?.owner || "Direktur Utama"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center gap-4">
            <div className="px-5 py-2 bg-[#F5F5F7] rounded-full inline-flex items-center gap-3 border border-slate-100">
               <Hash size={12} className="text-[#86868B]" />
               <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest leading-none">
                 NPWP: <span className="text-[#1D1D1F] ml-1">{globalData.invoiceSettings.companyNPWP}</span>
               </span>
            </div>
            <div className="flex gap-6 text-[#D2D2D7]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                <Linkedin size={12} /> {globalData.invoiceSettings.companyLinkedin}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                <Instagram size={12} /> {globalData.invoiceSettings.companyInstagram}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Branding Area */}
        <div className="bg-[#1D1D1F] px-16 py-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#1D1D1F] font-bold text-sm italic">M</div>
            <span className="text-white font-bold text-xs tracking-tighter uppercase italic tracking-[0.1em]">{globalData.invoiceSettings.companyName}</span>
          </div>
          <div className="flex items-center gap-8 text-[10px] font-bold text-[#86868B] tracking-widest uppercase">
            <div className="flex flex-col items-end">
              <span className="text-white mb-1">E-Verification</span>
              <span className="text-[9px] opacity-40">HASH: ML-{invoice.invoice_number}-SECURE</span>
            </div>
            <div className="w-[1px] h-8 bg-[#3A3A3C]" />
            <div className="flex flex-col items-end">
              <span className="text-white mb-1">Timestamp</span>
              <span className="text-[9px] opacity-40 italic font-mono uppercase">{new Date().toLocaleString('id-ID')} WIB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center space-y-2 print:hidden">
        <p className="text-[10px] text-[#86868B] font-bold uppercase tracking-[0.3em]">Hak Cipta &copy; 2026 PT MITRA LABS DIGITAL</p>
        <p className="text-[10px] text-[#D2D2D7] font-medium tracking-wide">Kwitansi ini diakui secara hukum sebagai bukti pelunasan digital yang sah.</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        body { font-family: 'Inter', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }

        @media print {
          @page { size: auto; margin: 0; }
          body { background: white !important; padding: 0 !important; }
          .min-h-screen { background: white !important; padding: 0 !important; }
          .max-w-[800px] { max-width: 100% !important; border: none !important; box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; }
          .bg-[#F5F5F7], .bg-white { background-color: white !important; }
          .bg-[#F5F5F7]\\/40 { background-color: #fafafa !important; -webkit-print-color-adjust: exact; }
          .bg-[#1D1D1F] { background-color: #1D1D1F !important; color: white !important; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
        }
      `}} />
    </div>
  );
}
