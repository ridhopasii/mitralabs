import React from 'react';
import { ChevronRight, Phone, Instagram, Mail } from 'lucide-react';

const CompanyProfileDoc = ({ data }: { data: any }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 px-4 font-sans text-[#1D1D1F] flex justify-center">
      <div className="w-full max-w-[800px] bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden print:shadow-none print:rounded-none">
        
        {/* Kop Surat */}
        <div className="p-10 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white text-3xl font-black italic">M</div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">MITRALABS.ID</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest tracking-[0.2em] leading-none mt-1">Mitra Digital Bisnis Mu</p>
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 text-right space-y-1 uppercase tracking-widest leading-none">
            <p>@mitralabs.id</p>
            <p>{data?.settings?.waNumber || "082381118520"}</p>
          </div>
        </div>

        <div className="p-10 md:p-16 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-black tracking-tighter uppercase italic">COMPANY PROFILE</h2>
            <p className="text-blue-600 font-bold tracking-[0.4em] uppercase text-[10px]">Edisi 2026</p>
          </div>

          <section className="space-y-6">
            <h3 className="text-xl font-bold border-l-4 border-slate-900 pl-4 uppercase tracking-wider">Tentang Kami</h3>
            <p className="text-sm leading-relaxed text-slate-600 font-medium">
              Mitralabs.id adalah digital agency yang bergerak di bidang jasa pembuatan website profesional untuk UMKM, usaha, sekolah, dan bisnis travel di Indonesia. Kami hadir dengan satu misi: membantu bisnis kamu tampil profesional di dunia digital tanpa ribet dan tanpa harga yang mencekik. Setiap website kami rancang untuk benar-benar bekerja — bukan sekadar terlihat bagus. Didirikan oleh anak muda yang percaya teknologi bisa menjadi alat pemerataan — agar bisnis kecil pun bisa bersaing di era digital.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-6">
              <h3 className="text-xl font-bold border-l-4 border-slate-900 pl-4 uppercase tracking-wider">Visi & Misi</h3>
              <div className="space-y-6 text-sm font-medium text-slate-600">
                <div className="p-5 bg-slate-50 rounded-2xl">
                  <p className="font-bold text-blue-600 uppercase text-[10px] mb-2 tracking-widest">Visi</p>
                  <p>Menjadi mitra digital terpercaya bagi pelaku usaha dan institusi di Indonesia dalam perjalanan transformasi digital mereka.</p>
                </div>
                <div className="space-y-3">
                  <p className="font-bold text-blue-600 uppercase text-[10px] tracking-widest">Misi</p>
                  <ul className="space-y-3">
                    <li className="flex gap-2 leading-relaxed"><ChevronRight size={16} className="text-blue-600 shrink-0" /> Menyediakan jasa pembuatan website yang profesional, terjangkau, dan tepat sasaran</li>
                    <li className="flex gap-2 leading-relaxed"><ChevronRight size={16} className="text-blue-600 shrink-0" /> Membangun hubungan jangka panjang dengan klien berbasis kepercayaan dan transparansi</li>
                    <li className="flex gap-2 leading-relaxed"><ChevronRight size={16} className="text-blue-600 shrink-0" /> Mendukung pertumbuhan UMKM dan institusi Indonesia melalui kehadiran digital yang kuat</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-bold border-l-4 border-slate-900 pl-4 uppercase tracking-wider">Layanan Kami</h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: '🌐', label: 'Website UMKM', desc: 'toko, warung, bengkel, laundry, dan usaha kecil lainnya' },
                  { icon: '🏫', label: 'Website Sekolah', desc: 'profil, pengumuman, galeri, dan info pendaftaran' },
                  { icon: '✈️', label: 'Website Travel', desc: 'paket wisata, galeri, form booking, profil tourguide' },
                  { icon: '🏢', label: 'Website Bisnis', desc: 'company profile, portofolio, dan landing page promosi' }
                ].map((item, i) => (
                  <div key={i} className="p-4 border border-slate-50 rounded-2xl flex gap-4 items-center">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-[11px] font-black uppercase text-slate-900">{item.label}</p>
                      <p className="text-[10px] font-medium text-slate-400 italic leading-none mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="space-y-8">
            <h3 className="text-xl font-bold border-l-4 border-slate-900 pl-4 uppercase tracking-wider">Tim Kami</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: data?.invoiceSettings?.signatureFields?.ownerName || 'Ridho Robbi Pasi', role: data?.invoiceSettings?.signatureFields?.ownerTitle || 'Engineer & Founder', desc: 'Pengembangan teknis, desain, dan kualitas website.', icon: '👨💻' },
                { name: data?.invoiceSettings?.signatureFields?.marketingName || 'Ghazy Muhalla', role: data?.invoiceSettings?.signatureFields?.marketingTitle || 'Marketing', desc: 'Komunikasi klien, strategi pemasaran, dan relasi bisnis.', icon: '📣' }
              ].map((m, i) => (
                <div key={i} className="flex gap-5 p-6 bg-slate-50 rounded-3xl">
                  <span className="text-3xl">{m.icon}</span>
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase">{m.name}</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{m.role}</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-2 leading-relaxed italic">"{m.desc}"</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <h3 className="text-xl font-bold border-l-4 border-slate-900 pl-4 uppercase tracking-wider">Nilai Kami</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              {['Transparansi', 'Kualitas', 'Kecepatan', 'Komunikasi', 'Integritas'].map((v, i) => (
                <div key={i} className="p-4 border border-slate-100 rounded-2xl space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-slate-900 leading-tight">{v}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-[#1D1D1F] p-12 text-center space-y-6">
          <p className="text-white font-bold text-[10px] uppercase tracking-[0.5em]">Hubungi Kami</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-slate-400 text-[11px] font-bold tracking-widest uppercase">
            <span className="flex items-center gap-2"><Phone size={14} className="text-blue-500"/> {data?.contact?.phone}</span>
            <span className="flex items-center gap-2"><Instagram size={14} className="text-blue-500"/> {data?.contact?.instagram}</span>
            <span className="flex items-center gap-2"><Mail size={14} className="text-blue-500"/> {data?.contact?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileDoc;
