import React from 'react';

const MoUDoc = ({ data, booking }: { data: any, booking?: any }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 px-4 font-sans text-[#1D1D1F] flex justify-center">
      <div className="w-full max-w-[800px] bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        
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
            <p>MoU - Kesepakatan Awal</p>
            <p>No: MOU/MTL/{booking?.id || '____'}/2026</p>
          </div>
        </div>

        <div className="p-10 md:p-16 space-y-10">
          <div className="text-center space-y-3">
             <h2 className="text-3xl font-black tracking-tighter uppercase border-b-4 border-slate-900 inline-block pb-1 leading-none">MEMORANDUM OF UNDERSTANDING (MoU)</h2>
             <p className="text-[#0066cc] text-[11px] font-bold uppercase tracking-widest leading-none">Kesepakatan Awal Kerja Sama Pembuatan Website</p>
          </div>

          <div className="text-sm font-medium text-slate-600 leading-relaxed">
            MoU ini dibuat sebagai kesepakatan awal antara kedua pihak sebelum penandatanganan Surat Perjanjian Kerja Sama (SPK) resmi.
          </div>

          {/* Data Kesepakatan */}
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
             <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tanggal</p>
                  <p className="text-sm font-black text-slate-900">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pihak Pertama</p>
                  <p className="text-sm font-black text-slate-900">Mitralabs.id — {data?.invoiceSettings?.signatureFields?.ownerName}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pihak Kedua (Klien)</p>
                  <p className="text-sm font-black text-slate-900">{booking?.customer_name || '________________________________'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nama Usaha</p>
                  <p className="text-sm font-black text-slate-900">{booking?.organization_name || '________________________________'}</p>
                </div>
             </div>
          </div>

          {/* Isi Pasal */}
          <div className="space-y-10">
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#0066cc] rounded-full"/> Pasal 1 — Ruang Lingkup</h4>
              <div className="text-sm text-slate-600 pl-4 space-y-1 leading-relaxed">
                <p>(1) Pihak Pertama bersedia mengerjakan pembuatan website untuk Pihak Kedua sesuai kebutuhan yang telah dikomunikasikan.</p>
                <p>(2) Detail pekerjaan akan dituangkan dalam brief dan SPK yang ditandatangani setelah MoU ini.</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#0066cc] rounded-full"/> Pasal 2 — Paket & Harga Awal</h4>
              <div className="text-sm text-slate-600 pl-4 space-y-1 leading-relaxed">
                <p>(1) Paket yang disepakati sementara: {booking?.plan_name || '________________________________'}</p>
                <p>(2) Estimasi harga: {booking?.total_price ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(booking.total_price) : 'Rp ________________________________'}</p>
                <p>(3) Harga final akan dikonfirmasi dalam proposal dan SPK resmi.</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#0066cc] rounded-full"/> Pasal 3 — Panjar / DP</h4>
              <div className="text-sm text-slate-600 pl-4 space-y-1 leading-relaxed">
                <p>(1) Pihak Kedua bersedia membayar panjar/DP sebesar 30% dari total harga yang disepakati.</p>
                <p>(2) DP dibayarkan sebelum pengerjaan dimulai sebagai tanda jadi kerja sama.</p>
                <p>(3) DP hangus apabila Pihak Kedua tidak memberikan kejelasan dalam 14 hari kalender.</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#0066cc] rounded-full"/> Pasal 4 — Timeline</h4>
              <div className="text-sm text-slate-600 pl-4 space-y-1 leading-relaxed">
                <p>(1) Estimasi pengerjaan: {booking?.duration || '_______'} hari kerja setelah DP diterima dan brief lengkap.</p>
                <p>(2) Timeline final dikonfirmasi dalam SPK.</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#0066cc] rounded-full"/> Pasal 5 — Komitmen Bersama</h4>
              <div className="text-sm text-slate-600 pl-4 space-y-1 leading-relaxed">
                <p>(1) Kedua pihak berkomitmen untuk berkomunikasi secara aktif dan terbuka selama proses berlangsung.</p>
                <p>(2) MoU ini bersifat mengikat secara moral dan akan dilanjutkan dengan SPK resmi dalam waktu 3 hari kerja.</p>
                <p>(3) Apabila salah satu pihak membatalkan setelah MoU ditandatangani, pihak tersebut wajib memberikan pemberitahuan tertulis.</p>
              </div>
            </div>
          </div>

          <p className="text-sm font-black text-slate-900 text-center mt-12 underline decoration-blue-100 decoration-4">
            MoU ini dibuat dengan itikad baik dan kesadaran penuh dari kedua pihak.
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
                  <p className="text-sm font-black text-slate-900 leading-none underline decoration-slate-200">{data?.invoiceSettings?.signatureFields?.ownerName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{data?.invoiceSettings?.signatureFields?.ownerTitle}</p>
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
        <div className="bg-[#1D1D1F] px-16 py-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-black font-black text-xs">M</div>
            <span className="text-white font-bold text-[10px] tracking-widest uppercase leading-none">MITRALABS.ID</span>
          </div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none tracking-[0.2em]">Official Memorandum Agreement • 2026</p>
        </div>
      </div>
    </div>
  );
};

export default MoUDoc;
