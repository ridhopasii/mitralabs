import React from 'react';
import { ChevronRight } from 'lucide-react';

const SPKDoc = ({ data, booking }: { data: any, booking?: any }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 px-4 font-sans text-[#1D1D1F] flex justify-center">
      <div className="w-full max-w-[850px] bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Header Branding */}
        <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white text-3xl font-black">M</div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">MITRALABS.ID</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">
                Mitra Digital Bisnis Mu  •  {data?.contact?.instagram}  •  {data?.settings?.waNumber}
              </p>
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 text-right space-y-1 uppercase tracking-widest leading-none">
            <p>Agreement Document</p>
            <p>No: SPK/MTL/{booking?.id || '____'}/2026</p>
          </div>
        </div>

        <div className="p-10 md:p-16 space-y-10">
          <div className="text-center space-y-3">
             <h2 className="text-3xl font-black tracking-tighter uppercase border-b-4 border-slate-900 inline-block pb-1 leading-none">SURAT PERJANJIAN KERJA SAMA</h2>
             <p className="text-[#0066cc] text-[11px] font-bold uppercase tracking-widest leading-none">Pembuatan Website Professional</p>
          </div>

          <div className="text-sm font-medium text-slate-600 leading-relaxed border-y border-slate-50 py-4">
            Surat Perjanjian Kerja Sama ini dibuat dan ditandatangani pada:<br/>
            <span className="font-black text-slate-950">Hari / Tanggal : {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span><br/>
            <span className="font-black text-slate-950">Tempat : Medan, Sumatera Utara</span>
          </div>

          {/* Para Pihak */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0066cc]">Pihak Pertama (Penyedia Jasa)</h4>
                <div className="text-xs font-bold text-slate-900 space-y-1">
                   <p>Mitralabs.id</p>
                   <p className="text-slate-500 font-medium uppercase">Diwakili : {data?.invoiceSettings?.signatureFields?.ownerName} ({data?.invoiceSettings?.signatureFields?.ownerTitle})</p>
                   <p className="text-slate-400 font-medium leading-none">Kontak: {data?.settings?.waNumber}</p>
                </div>
             </div>
             <div className="p-8 border border-slate-100 rounded-3xl space-y-3 shadow-sm bg-white">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Pihak Kedua (Klien)</h4>
                <div className="text-xs font-bold text-slate-900 space-y-3">
                   <p className="underline underline-offset-4 decoration-slate-300">Nama : {booking?.customer_name || '________________________________'}</p>
                   <p className="underline underline-offset-4 decoration-slate-300">Nama Usaha : {booking?.organization_name || '_________________________'}</p>
                   <p className="text-slate-400 font-medium leading-none">Kontak: {booking?.customer_phone || '_________________________'}</p>
                </div>
             </div>
          </div>

          {/* Isi Pasal */}
          <div className="space-y-12 text-sm font-medium text-slate-600 leading-relaxed">
            <p className="text-xs text-slate-500 leading-none">Kedua pihak sepakat untuk mengadakan perjanjian kerja sama pembuatan website dengan ketentuan sebagai berikut:</p>
            
            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-950 flex items-center gap-2"><ChevronRight size={14} className="text-[#0066cc]"/> Pasal 1 — Ruang Lingkup Pekerjaan</h4>
              <div className="pl-4 space-y-1 leading-relaxed">
                <p>(1) Pihak Pertama bersedia membuat website untuk Pihak Kedua sesuai dengan brief yang telah disepakati.</p>
                <p>(2) Detail pekerjaan tercantum dalam Lampiran Brief yang menjadi bagian tidak terpisahkan dari perjanjian ini.</p>
                <p>(3) Pekerjaan yang tidak tercantum dalam brief awal akan dihitung sebagai pekerjaan tambahan dengan biaya terpisah.</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-950 flex items-center gap-2"><ChevronRight size={14} className="text-[#0066cc]"/> Pasal 2 — Paket & Harga</h4>
              <div className="pl-4 space-y-1 leading-relaxed">
                <p>(1) Paket yang disepakati: {booking?.plan_name || '________________________________'}</p>
                <p>(2) Total harga pekerjaan: {booking?.total_price ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(booking.total_price) : 'Rp ______________________________'}</p>
                <p>(3) Harga tersebut sudah termasuk 2x revisi dan garansi bug 7 hari.</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-950 flex items-center gap-2"><ChevronRight size={14} className="text-[#0066cc]"/> Pasal 3 — Pembayaran</h4>
              <div className="pl-4 space-y-1 leading-relaxed">
                <p>(1) Pembayaran dilakukan dalam dua tahap: Panjar / DP 30% dimuka dan Pelunasan 70% sebelum serah terima.</p>
                <p>(2) Pembayaran dilakukan melalui rekening resmi Mitralabs.id (Dana / BSI / Mandiri / QRIS).</p>
                <p>(3) Pengerjaan baru dimulai setelah DP 30% diterima dan terkonfirmasi.</p>
                <p>(4) Akses domain, hosting, and source code hanya diserahkan setelah pelunasan penuh.</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-950 flex items-center gap-2"><ChevronRight size={14} className="text-[#0066cc]"/> Pasal 4 — Hangusnya Panjar</h4>
              <div className="pl-4 space-y-1 leading-relaxed">
                <p>(1) Apabila Pihak Kedua tidak memberikan kejelasan dalam waktu 14 hari kalender setelah DP, maka panjar dinyatakan hangus.</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-950 flex items-center gap-2"><ChevronRight size={14} className="text-[#0066cc]"/> Pasal 7 — Garansi & Perbaikan Bug</h4>
              <div className="pl-4 space-y-1 leading-relaxed">
                <p>(1) Pihak Pertama memberikan garansi bug teknis selama 7 hari kalender setelah serah terima.</p>
                <p>(2) Perbaikan bug setelah masa garansi berakhir dikenakan biaya sebesar Rp 100.000 per sesi.</p>
              </div>
            </div>
          </div>

          <p className="text-xs font-black text-slate-900 text-center mt-12 underline decoration-blue-100 decoration-4 uppercase tracking-widest">
            Demikian Surat Perjanjian Kerja Sama ini dibuat dengan penuh kesadaran dan tanpa paksaan.
          </p>

          {/* Tanda Tangan */}
          <div className="pt-10 space-y-12">
            <div className="flex justify-start pl-8">
              <p className="text-xs font-bold text-slate-900 leading-none">Medan, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-16">
              <div className="text-center space-y-20">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pihak Pertama,</p>
                <div className="space-y-1">
                  <div className="relative h-20 flex items-center justify-center">
                    {data?.invoiceSettings?.signatureFields?.ownerSignature && (
                       <img src={data.invoiceSettings.signatureFields.ownerSignature} alt="Owner Signature" className="max-h-full object-contain mix-blend-multiply" />
                    )}
                  </div>
                  <p className="text-sm font-black text-slate-900 leading-none">{data?.invoiceSettings?.signatureFields?.ownerName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{data?.invoiceSettings?.signatureFields?.ownerTitle} — Mitralabs.id</p>
                </div>
              </div>
              <div className="text-center space-y-20">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pihak Kedua,</p>
                <div className="space-y-1">
                  <div className="relative h-20 flex items-center justify-center">
                    {booking?.user_signature && (
                       <img src={booking.user_signature} alt="User Signature" className="max-h-full object-contain mix-blend-multiply" />
                    )}
                  </div>
                  <p className="text-sm font-black text-slate-900 underline underline-offset-8 decoration-slate-200 leading-none">({booking?.customer_name || '                                        '})</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Nama & Jabatan Klien</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="bg-[#1D1D1F] px-16 py-10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-[#1D1D1F] font-black text-sm">M</div>
            <span className="text-white font-bold text-[10px] tracking-widest uppercase leading-none tracking-[0.2em]">MITRALABS.ID</span>
          </div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Legal Partnership Agreement • 2026</p>
        </div>
      </div>
    </div>
  );
};

export default SPKDoc;
