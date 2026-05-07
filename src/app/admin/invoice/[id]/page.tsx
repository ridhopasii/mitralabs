import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Printer, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function InvoicePrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: invoice } = await supabase
    .from("Invoice")
    .select("*, project:Project(*)")
    .eq("id", id)
    .maybeSingle();

  const { data: config } = await supabase
    .from("SiteConfig")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (!invoice) notFound();

  const items = (invoice.items as any[]) || [];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      {/* Action Bar (Hidden on Print) */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
        <Link href="/admin/konten" className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Kembali ke Admin
        </Link>
        <div className="flex gap-4">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg"
          >
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden print:shadow-none print:rounded-none">
        <div className="p-16">
          {/* Header */}
          <div className="flex justify-between items-start mb-20">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">MITRALABS</h1>
              <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs">
                {config?.address || "Digital Solutions Partner"}<br />
                {config?.contact_email || "hello@mitralabs.id"}
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-6xl font-bold text-slate-100 mb-4">INVOICE</h2>
              <p className="font-bold text-slate-900">{invoice.invoice_number}</p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Date: {new Date(invoice.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-2 gap-20 mb-20">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4">Billed To</p>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{invoice.project?.client_name || "Client Name"}</h3>
              <p className="text-slate-500 font-medium text-sm">Project: {invoice.project?.title}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4">Payment Info</p>
              <p className="text-slate-900 font-bold mb-1">Due Date</p>
              <p className="text-slate-500 font-medium text-sm">{new Date(invoice.due_date).toLocaleDateString()}</p>
              <div className={`mt-4 inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {invoice.status}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-20">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="text-left py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</th>
                <th className="text-right py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-6 font-bold text-slate-900">{item.desc}</td>
                  <td className="py-6 text-right font-bold text-slate-900">Rp {item.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="pt-10 text-right text-slate-400 font-bold uppercase tracking-widest text-[10px]">Total Amount</td>
                <td className="pt-10 text-right text-3xl font-bold text-primary">Rp {invoice.amount.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div className="pt-20 border-t border-slate-100 text-center">
            <p className="text-slate-400 font-medium text-xs">Terima kasih atas kepercayaan Anda bermitra dengan Mitralabs.</p>
            <p className="text-slate-900 font-bold text-[10px] uppercase tracking-widest mt-2">www.mitralabs.id</p>
          </div>
        </div>
      </div>
    </div>
  );
}
