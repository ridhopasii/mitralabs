import React from 'react';
import { ClipboardList, ShieldCheck, Send, CheckCircle, MessageSquare } from 'lucide-react';

const SOPDoc = ({ data }: { data: any }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 px-4 font-sans text-[#1D1D1F] flex justify-center">
      <div className="w-full max-w-[800px] bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Header Branding */}
        <div className="p-10 md:p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white text-3xl font-black italic shadow-inner">M</div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">MITRALABS.ID</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em] mt-1">SOP OPERASIONAL</p>
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 text-right space-y-1 italic uppercase tracking-widest">
            <p>Versi 1.0 • Mei 2026</p>
            <p>{data?.settings?.waNumber}</p>
          </div>
        </div>

        <div className="p-10 md:p-16 space-y-16 italic">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic border-b-4 border-slate-900 inline-block pb-2">Standar Operasional Prosedur</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] italic">Prosedur Kerja Jasa Pembuatan Website</p>
          </div>

          {/* Section 01: Info Umum */}
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 text-xs">01</div> 
              Informasi Umum
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-[11px] font-bold text-slate-600 bg-slate-50 p-6 rounded-3xl border border-slate-100 italic">
               <div><p className="text-slate-400 uppercase text-[9px] mb-1">Agency</p>Mitralabs.id</div>
               <div><p className="text-slate-400 uppercase text-[9px] mb-1">Tagline</p>Mitra Digital Bisnis Mu</div>
               <div><p className="text-slate-400 uppercase text-[9px] mb-1">Instagram</p>{data?.contact?.instagram}</div>
               <div><p className="text-slate-400 uppercase text-[9px] mb-1">Engineer</p>{data?.invoiceSettings?.signatureFields?.ownerName}</div>
               <div><p className="text-slate-400 uppercase text-[9px] mb-1">Marketing</p>{data?.invoiceSettings?.signatureFields?.marketingName}</div>
               <div><p className="text-slate-400 uppercase text-[9px] mb-1">Pembayaran</p>Dana • BSI • Mandiri</div>
            </div>
          </section>

          {/* Section 03: Alur Kerja */}
          <section className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 text-xs">03</div> 
              Alur Kerja Proyek
            </h3>
            <div className="space-y-10 max-w-lg">
              {[
                { title: 'Onboarding', icon: <ClipboardList size={18}/>, desc: 'kirim form brief, tunggu diisi sebelum mulai' },
                { title: 'Proposal & Deal', icon: <ShieldCheck size={18}/>, desc: 'kirim proposal, tunggu konfirmasi + DP 30%' },
                { title: 'Pengerjaan', icon: <Send size={18}/>, desc: 'update progres 2x: saat 50% dan mendekati final' },
                { title: 'Revisi', icon: <CheckCircle size={18}/>, desc: 'maks 2x revisi gratis, ke-3 dst berbayar' },
                { title: 'Serah Terima', icon: <MessageSquare size={18}/>, desc: 'pelunasan masuk → akses/file diserahkan, garansi 7 hari aktif' }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-6 items-start group">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{step.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed italic">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 04: Ketentuan */}
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 text-xs">04</div> 
              Ketentuan Pembayaran & Komunikasi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 border border-slate-100 rounded-[32px] space-y-4">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-4">Pembayaran</p>
                <ul className="text-[11px] font-bold text-slate-600 space-y-3 italic">
                  <li>• DP 30% wajib sebelum pengerjaan dimulai</li>
                  <li>• Pelunasan 70% sebelum file/akses diserahkan</li>
                  <li>• DP hangus jika tidak ada kejelasan dalam 14 hari</li>
                  <li>• Pembatalan oleh klien setelah DP: DP tidak kembali</li>
                  <li>• Perbaikan bug setelah garansi: Rp 100.000 per sesi</li>
                </ul>
              </div>
              <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-4 italic">Standar Komunikasi</p>
                <ul className="text-[11px] font-bold text-slate-500 space-y-3 italic">
                  <li>• Gunakan 'kami' bukan 'aku' saat komunikasi</li>
                  <li>• Balas pesan klien maks 1x24 jam di hari kerja</li>
                  <li>• Update progres minimal 2x selama pengerjaan</li>
                  <li>• Semua kesepakatan wajib terdokumentasi via teks</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-[#1D1D1F] p-10 flex justify-between items-center italic">
          <div className="flex items-center gap-3 italic">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#1D1D1F] font-black text-sm italic shadow-inner">M</div>
            <span className="text-white font-black text-[11px] tracking-tighter uppercase italic">MITRALABS.ID</span>
          </div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.4em] italic">Official Operation Standard • 2026</p>
        </div>
      </div>
    </div>
  );
};

export default SOPDoc;
