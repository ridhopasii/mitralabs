import React from 'react';
import { Zap, Download, Phone, Instagram } from 'lucide-react';

const ProposalDoc = ({ data, booking }: { data: any, booking?: any }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 px-4 font-sans text-[#1D1D1F] flex justify-center">
      <div className="w-full max-w-[800px] bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Kop Surat */}
        <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white text-3xl font-black italic">M</div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">MITRALABS.ID</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">
                Mitra Digital Bisnis Mu  •  {data?.contact?.instagram}  •  {data?.settings?.waNumber}
              </p>
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 text-right space-y-1 italic uppercase tracking-widest leading-none">
            <p>Proposal Penawaran Jasa</p>
            <p>No: PRP/MTL/{booking?.id || '____'}/2026</p>
          </div>
        </div>

        <div className="p-10 md:p-16 space-y-12 italic">
          <div className="flex justify-between items-start">
             <div>
               <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-2 italic">PROPOSAL</h2>
               <p className="text-blue-600 text-[11px] font-bold uppercase tracking-[0.4em] italic">Pembuatan Website Profesional</p>
             </div>
             <div className="text-right space-y-1 italic">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Berlaku Hingga</p>
                <p className="text-sm font-black text-slate-900 italic">3 Hari Sejak Terbit</p>
             </div>
          </div>

          {/* Data Proposal */}
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 italic space-y-4">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ditujukan Kepada</p>
                  <p className="text-xs font-black text-slate-900">{booking?.customer_name || '_________________'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nama Usaha</p>
                  <p className="text-xs font-black text-slate-900">{booking?.organization_name || '_________________'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Paket</p>
                  <p className="text-xs font-black text-blue-600 uppercase">{booking?.plan_name || 'BASIC / STD / PREM'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimasi Harga</p>
                  <p className="text-sm font-black text-slate-950 italic tracking-tighter leading-none">
                    {booking?.total_price ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(booking.total_price) : 'Rp ............................'}
                  </p>
                </div>
             </div>
          </div>

          <section className="space-y-4 italic leading-relaxed text-sm font-medium text-slate-600">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 italic leading-none underline decoration-blue-100 decoration-4">Tentang Mitralabs.id</h4>
            <p>Mitralabs.id adalah digital agency yang fokus membantu UMKM, usaha, sekolah, dan bisnis travel untuk hadir secara profesional di dunia digital. Kami percaya setiap bisnis berhak punya website yang bagus dan fungsional — bukan sekadar pajangan online. Harga transparan, proses jelas, hasil nyata.</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['Pengerjaan cepat', 'Komunikasi aktif', 'Mobile-first', 'Transparan', 'Fokus hasil'].map((point, i) => (
              <div key={i} className="flex flex-col items-center gap-3 text-center p-4 border border-slate-50 rounded-2xl">
                 <Zap size={16} className="text-blue-600" />
                 <p className="text-[9px] font-black uppercase tracking-widest leading-tight">{point}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6 italic">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 italic border-l-4 border-slate-900 pl-3">Daftar Paket Layanan</h4>
            <div className="overflow-hidden rounded-2xl border border-slate-100">
               <table className="w-full text-[10px] font-bold italic">
                  <thead className="bg-slate-900 text-white italic uppercase tracking-widest">
                    <tr>
                      <th className="p-4 text-left">Spesifikasi</th>
                      <th className="p-4 text-center">BASIC</th>
                      <th className="p-4 text-center">STANDARD</th>
                      <th className="p-4 text-center">PREMIUM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 italic">
                    <tr className="bg-slate-50/30">
                      <td className="p-4 text-slate-900 uppercase">Harga Investasi</td>
                      <td className="p-4 text-center">Rp 1.500.000</td>
                      <td className="p-4 text-center text-blue-600">Rp 3.500.000</td>
                      <td className="p-4 text-center">Rp 7.000.000</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-400 uppercase">Timeline</td>
                      <td className="p-4 text-center">3 hari kerja</td>
                      <td className="p-4 text-center">7 hari kerja</td>
                      <td className="p-4 text-center">14 hari kerja</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-400 uppercase">Halaman</td>
                      <td className="p-4 text-center">1 halaman</td>
                      <td className="p-4 text-center">3–5 halaman</td>
                      <td className="p-4 text-center">7–10 halaman</td>
                    </tr>
                    <tr className="text-slate-600 italic">
                      <td className="p-4 text-slate-400 uppercase">Garansi Bug</td>
                      <td className="p-4 text-center">7 Hari</td>
                      <td className="p-4 text-center">7 Hari</td>
                      <td className="p-4 text-center">7 Hari + 1 Bln Support</td>
                    </tr>
                  </tbody>
               </table>
            </div>
            <p className="text-[9px] text-slate-400 font-bold uppercase italic text-right italic leading-none">* Perbaikan bug setelah garansi: Rp 100.000 per sesi.</p>
          </div>

          {/* Penutup */}
          <div className="pt-10 space-y-16 italic">
            <p className="text-[11px] font-black text-slate-900 italic tracking-tight text-center leading-none">
              Besar harapan kami untuk dapat bekerja sama dengan Bapak/Ibu. 🚀
            </p>
            
            <div className="flex justify-start italic">
              <p className="text-xs font-bold text-slate-900 italic leading-none">Medan, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-16 italic">
              <div className="text-center space-y-20 italic">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Hormat Kami,</p>
                <div className="space-y-1 italic">
                  <p className="text-sm font-black text-slate-900 italic leading-none">{data?.invoiceSettings?.signatureFields?.ownerName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{data?.invoiceSettings?.signatureFields?.ownerTitle}</p>
                </div>
              </div>
              <div className="text-center space-y-20 italic">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Menyetujui,</p>
                <div className="space-y-1 italic">
                  <p className="text-sm font-black text-slate-900 italic underline underline-offset-8 decoration-slate-200">({booking?.customer_name || '                                        '})</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Nama & Jabatan Klien</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="bg-[#1D1D1F] px-16 py-8 flex justify-between items-center italic">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-black font-black text-xs italic">M</div>
            <span className="text-white font-bold text-[10px] tracking-widest uppercase italic leading-none">MITRALABS.ID</span>
          </div>
          <div className="flex gap-8 text-[9px] text-slate-500 font-bold uppercase tracking-widest italic leading-none">
             <span className="flex items-center gap-1"><Phone size={10}/> {data?.contact?.phone}</span>
             <span className="flex items-center gap-1"><Instagram size={10}/> {data?.contact?.instagram}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDoc;
