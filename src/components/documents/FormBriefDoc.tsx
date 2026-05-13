import React from 'react';

const FormBriefDoc = ({ data, booking }: { data: any, booking?: any }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 px-4 font-sans text-[#1D1D1F] flex justify-center italic">
      <div className="w-full max-w-[800px] bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden italic">
        
        {/* Header Branding */}
        <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/30 italic">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white text-3xl font-black italic shadow-inner">M</div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">MITRALABS.ID</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">
                Mitra Digital Bisnis Mu  •  {data?.contact?.instagram}  •  {data?.settings?.waNumber}
              </p>
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 text-right space-y-1 italic uppercase tracking-widest leading-none">
            <p>Project Requirement</p>
            <p>Form Brief Klien 2026</p>
          </div>
        </div>

        <div className="p-10 md:p-16 space-y-10 italic">
          <div className="text-center space-y-3 italic">
             <h2 className="text-4xl font-black tracking-tighter uppercase italic border-b-4 border-slate-900 inline-block pb-1 leading-none italic">FORM BRIEF KLIEN</h2>
             <p className="text-blue-600 text-[11px] font-bold uppercase tracking-widest italic leading-none italic">Isi form ini sebelum pengerjaan dimulai</p>
          </div>

          <div className="grid grid-cols-1 gap-12 italic">
            
            {/* A. Identitas Klien */}
            <section className="space-y-6 italic">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-3 italic"><div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black">A</div> Identitas Klien</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 italic bg-slate-50 p-8 rounded-[32px] border border-slate-100 italic">
                 {[
                    { label: 'Nama Lengkap', value: booking?.customer_name },
                    { label: 'No. HP / WA', value: booking?.customer_phone },
                    { label: 'Email', value: booking?.customer_email },
                    { label: 'Nama Usaha / Bisnis', value: booking?.organization_name },
                    { label: 'Jenis Bisnis', value: booking?.business_industry },
                    { label: 'Alamat Usaha', value: booking?.client_address },
                    { label: 'Instagram / Sosmed', value: '' }
                 ].map((f, i) => (
                    <div key={i} className="border-b border-slate-200 pb-2 italic">
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic mb-1 leading-none">{f.label}</p>
                       <p className="text-xs font-black text-slate-900 italic">{f.value || '________________________________'}</p>
                    </div>
                 ))}
              </div>
            </section>

            {/* B. Kebutuhan Website */}
            <section className="space-y-6 italic">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-3 italic"><div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black">B</div> Kebutuhan Website</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 italic">
                 <div className="space-y-2 italic">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">Tujuan Website</p>
                    <p className="text-[10px] font-bold text-slate-900 italic">{booking?.service_type || 'Profil  /  Jualan  /  Booking  /  Portofolio  /  Lainnya'}</p>
                 </div>
                 <div className="space-y-2 italic">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">Paket Dipilih</p>
                    <p className="text-[10px] font-bold text-blue-600 italic">{booking?.plan_name || 'Basic (1.5jt)  /  Standard (3.5jt)  /  Premium (7jt)'}</p>
                 </div>
                 <div className="space-y-2 italic">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">Jumlah Halaman</p>
                    <p className="text-[10px] font-bold text-slate-900 italic underline decoration-slate-200">________________________________</p>
                 </div>
                 <div className="space-y-2 italic">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">Bahasa Website</p>
                    <p className="text-[10px] font-bold text-slate-900 italic">Indonesia  /  Inggris  /  Keduanya</p>
                 </div>
              </div>
            </section>

            {/* C. Fitur & D. Desain */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 italic">
               <div className="space-y-6 italic">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-950 italic border-l-4 border-slate-900 pl-3">C. Fitur & E. Timeline</h4>
                  <div className="h-40 border-2 border-dashed border-slate-100 rounded-[24px] flex items-center justify-center text-center p-6 italic">
                     <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Data dari Onboarding Brief</p>
                  </div>
               </div>
               <div className="space-y-6 italic">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-950 italic border-l-4 border-slate-900 pl-3">D. Desain & Branding</h4>
                  <div className="space-y-4 italic bg-slate-50 p-6 rounded-[24px] border border-slate-100 italic">
                     {[
                        { label: 'Warna Utama Brand', value: '' },
                        { label: 'Referensi Website', value: booking?.reference_websites },
                        { label: 'Gaya Desain', value: '' }
                     ].map((f, i) => (
                        <div key={i} className="border-b border-slate-200 pb-2 italic">
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic mb-1 leading-none">{f.label}</p>
                           <p className="text-xs font-black text-slate-900 italic">{f.value || '________________________________'}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </section>
          </div>

          <p className="text-[10px] font-black text-slate-400 text-center italic mt-12 italic leading-relaxed">
            Dengan mengisi form ini, klien menyatakan bahwa informasi yang diberikan adalah benar dan menjadi dasar pengerjaan project.
          </p>

          {/* Tanda Tangan */}
          <div className="pt-10 space-y-12 italic">
            <div className="flex justify-start pl-8 italic">
              <p className="text-xs font-bold text-slate-900 italic leading-none">Medan, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-16 italic">
              <div className="text-center space-y-20 italic">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none italic">Diterima oleh,</p>
                <div className="space-y-1 italic">
                   <div className="relative h-20 flex items-center justify-center">
                    {data?.invoiceSettings?.signatureFields?.ownerSignature && (
                       <img src={data.invoiceSettings.signatureFields.ownerSignature} alt="Owner Signature" className="max-h-full object-contain mix-blend-multiply" />
                    )}
                  </div>
                  <p className="text-sm font-black text-slate-900 italic leading-none">{data?.invoiceSettings?.signatureFields?.ownerName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">Engineer & Founder — Mitralabs.id</p>
                </div>
              </div>
              <div className="text-center space-y-20 italic">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic leading-none italic">Diisi oleh,</p>
                <div className="space-y-1 italic">
                  <div className="relative h-20 flex items-center justify-center">
                    {booking?.user_signature && (
                       <img src={booking.user_signature} alt="User Signature" className="max-h-full object-contain mix-blend-multiply" />
                    )}
                  </div>
                  <p className="text-sm font-black text-slate-900 italic underline underline-offset-8 decoration-slate-200 leading-none italic">({booking?.customer_name || '                                        '})</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic leading-none italic">Nama Klien</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="bg-[#1D1D1F] px-16 py-8 flex justify-between items-center italic">
          <div className="flex items-center gap-3 italic">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-black font-black text-xs italic">M</div>
            <span className="text-white font-bold text-[10px] tracking-widest uppercase italic leading-none tracking-[0.2em] italic leading-none italic">MITRALABS.ID</span>
          </div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic leading-none italic">Project Brief Registration • 2026</p>
        </div>
      </div>
    </div>
  );
};

export default FormBriefDoc;
