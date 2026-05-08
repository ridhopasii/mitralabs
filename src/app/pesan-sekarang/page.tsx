"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import { 
  CheckCircle2, 
  Send, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Layers, 
  ChevronRight,
  ArrowRight,
  Loader2,
  Sparkles,
  Zap,
  Globe,
  Briefcase,
  Link as LinkIcon,
  Building2,
  Award,
  Users,
  MousePointer2,
  ShieldAlert,
  Puzzle,
  Heart,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logActivity } from "@/lib/supabase";

export default function PesanSekarang() {
  const { data, updateData } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    service: "UMKM Website",
    plan: "Standard",
    desiredDomain: "",
    businessIndustry: "",
    referenceWeb: "",
    targetAudience: "",
    primaryCTA: "",
    competitors: "",
    integrations: "",
    expectation: "",
    customPrice: "",
    brief: ""
  });

  const getPrice = () => {
    if (formData.customPrice) return parseInt(formData.customPrice);
    return formData.plan === "Premium" ? 7000000 : formData.plan === "Standard" ? 3500000 : 1500000;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingId = Date.now();
    const newBooking = {
      id: bookingId,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      organization_name: formData.organization,
      position: formData.position,
      service_type: formData.service,
      plan_name: formData.plan,
      project_brief: formData.brief,
      desired_domain: formData.desiredDomain,
      business_industry: formData.businessIndustry,
      reference_websites: formData.referenceWeb,
      target_audience: formData.targetAudience,
      primary_cta: formData.primaryCTA,
      competitors_list: formData.competitors,
      integrations_needed: formData.integrations,
      biggest_expectation: formData.expectation,
      status: "Pending" as const,
      created_at: new Date().toISOString(),
      total_price: getPrice(),
      invoices: []
    };

    const newData = { ...data };
    newData.bookings = [newBooking, ...(data.bookings || [])];

    // WhatsApp Redirect Logic
    const waNumber = data.settings?.waNumber || "6282381118520";
    const waMessage = `Halo Mitralabs! Saya ingin melakukan pemesanan website.\n\n*Detail Klien:*\n- Nama: ${formData.name}\n- Instansi: ${formData.organization}\n- Jabatan: ${formData.position}\n\n*Detail Project:*\n- Layanan: ${formData.service}\n- Paket: ${formData.plan} (Rp ${getPrice().toLocaleString()})\n- Domain: ${formData.desiredDomain || '-'}\n- Industri: ${formData.businessIndustry || '-'}\n- Target Audiens: ${formData.targetAudience || '-'}\n- Utama CTA: ${formData.primaryCTA || '-'}\n- Kompetitor: ${formData.competitors || '-'}\n- Integrasi: ${formData.integrations || '-'}\n- Harapan: ${formData.expectation || '-'}\n- Brief: ${formData.brief}`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

    setTimeout(async () => {
      updateData(newData);
      await logActivity("New Web Order", `Pemesanan dari ${formData.name} (${formData.organization})`);
      setIsSubmitting(false);
      setShowSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Automatic redirect after 2 seconds
      setTimeout(() => {
        window.open(waUrl, "_blank");
      }, 2000);
    }, 1500);
  };

  if (showSuccess) {
    const waNumber = data.settings?.waNumber || "6282381118520";
    const waMessage = `Halo Mitralabs! Saya ingin melakukan pemesanan website.\n\n*Detail Klien:*\n- Nama: ${formData.name}\n- Instansi: ${formData.organization}\n- Jabatan: ${formData.position}\n\n*Detail Project:*\n- Layanan: ${formData.service}\n- Paket: ${formData.plan} (Rp ${getPrice().toLocaleString()})\n- Domain: ${formData.desiredDomain || '-'}\n- Industri: ${formData.businessIndustry || '-'}\n- Target Audiens: ${formData.targetAudience || '-'}\n- Utama CTA: ${formData.primaryCTA || '-'}\n- Kompetitor: ${formData.competitors || '-'}\n- Integrasi: ${formData.integrations || '-'}\n- Harapan: ${formData.expectation || '-'}\n- Brief: ${formData.brief}`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-surface-container p-20 rounded-[4rem] text-center space-y-10 border border-outline/5 shadow-apple"
        >
          <div className="w-24 h-24 bg-primary text-background rounded-[2.5rem] flex items-center justify-center mx-auto shadow-apple-hover">
            <CheckCircle2 size={48} />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tighter text-on-background uppercase">Order Transmitted!</h2>
            <p className="text-secondary text-xl font-medium">Data Anda telah masuk ke sistem kami. Kami sedang mengarahkan Anda ke WhatsApp untuk konsultasi langsung.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href={waUrl}
              target="_blank"
              className="w-full sm:w-auto px-12 py-6 bg-emerald-500 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3"
            >
              <Phone size={18} /> Hubungi via WhatsApp
            </a>
            <button 
              onClick={() => window.location.href = "/"}
              className="w-full sm:w-auto px-12 py-6 bg-on-background text-background rounded-full font-black text-sm uppercase tracking-widest hover:opacity-80 transition-all shadow-apple"
            >
              Back to Home
            </button>
          </div>
          
          <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] opacity-40">
            Redirecting automatically in a few seconds...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-20">
        
        {/* Left Side: Strategic Info */}
        <div className="lg:col-span-4 space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles size={16} className="text-primary" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Strategic Onboarding</span>
            </div>
            <h1 className="text-7xl font-black tracking-tighter text-on-background leading-[0.9]">Mulai Visi Digital Anda.</h1>
            <p className="text-secondary text-xl font-medium">Langkah awal untuk transformasi bisnis yang lebih profesional. Isi detail rincian untuk membantu kami memahami kebutuhan Anda.</p>
          </div>

          <div className="bg-surface-container p-10 rounded-[3rem] border border-outline/5 space-y-8">
             <div>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-4">Investment Summary</p>
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-3xl font-black text-on-background">Rp {getPrice().toLocaleString()}</p>
                      <p className="text-[11px] font-bold text-primary uppercase tracking-widest">{formData.plan} Tier</p>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-bold text-on-background">{formData.service}</p>
                      <p className="text-[10px] text-secondary font-medium">Estimated Launch: 7-14 Days</p>
                   </div>
                </div>
             </div>
             <div className="pt-6 border-t border-outline/5 space-y-4">
                <div className="flex items-center gap-3 text-secondary">
                   <CheckCircle2 size={14} className="text-success" />
                   <span className="text-xs font-bold">Cloud Infrastructure Included</span>
                </div>
                <div className="flex items-center gap-3 text-secondary">
                   <CheckCircle2 size={14} className="text-success" />
                   <span className="text-xs font-bold">Professional Support 24/7</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className="lg:col-span-8">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-container p-12 md:p-20 rounded-[4rem] border border-outline/5 shadow-apple relative overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-20 relative z-10">
              
              {/* Section 1: Personal & Organization */}
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-on-background text-background rounded-2xl flex items-center justify-center font-bold">01</div>
                   <h3 className="text-2xl font-black tracking-tight">Identitas & Instansi</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-4">Full Name</label>
                      <div className="relative group">
                         <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors z-10" size={18} />
                         <input required type="text" placeholder="" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full pl-16 pr-8 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none focus:border-primary/30 font-bold transition-all shadow-inner relative" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-4">WhatsApp Number</label>
                      <div className="relative group">
                         <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors z-10" size={18} />
                         <input type="tel" placeholder="" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full pl-16 pr-8 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none focus:border-primary/30 font-bold transition-all shadow-inner relative" />
                      </div>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-4">Nama Instansi / Perusahaan</label>
                      <div className="relative group">
                         <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors z-10" size={18} />
                         <input type="text" placeholder="" value={formData.organization} onChange={(e) => setFormData({...formData, organization: e.target.value})} className="w-full pl-16 pr-8 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none focus:border-primary/30 font-bold transition-all shadow-inner relative" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-4">Jabatan / Role</label>
                      <div className="relative group">
                         <Award className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors z-10" size={18} />
                         <input type="text" placeholder="" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="w-full pl-16 pr-8 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none focus:border-primary/30 font-bold transition-all shadow-inner relative" />
                      </div>
                   </div>
                </div>
              </div>

              {/* Section 2: Project Strategy */}
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-on-background text-background rounded-2xl flex items-center justify-center font-bold">02</div>
                   <h3 className="text-2xl font-black tracking-tight">Strategi & Kebutuhan</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-4">Jenis Layanan</label>
                      <div className="relative group">
                         <Layers className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors z-10" size={18} />
                         <select value={formData.service} onChange={(e) => setFormData({...formData, service: e.target.value})} className="w-full pl-16 pr-8 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none focus:border-primary/30 font-bold transition-all shadow-inner relative appearance-none cursor-pointer">
                            <option>UMKM Website</option>
                            <option>School Website</option>
                            <option>Travel Portal</option>
                            <option>Business Profile</option>
                         </select>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-4">Target Audiens</label>
                      <div className="relative group">
                         <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors z-10" size={18} />
                         <input type="text" placeholder="" value={formData.targetAudience} onChange={(e) => setFormData({...formData, targetAudience: e.target.value})} className="w-full pl-16 pr-8 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none focus:border-primary/30 font-bold transition-all shadow-inner relative" />
                      </div>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-4">Call to Action Utama</label>
                      <div className="relative group">
                         <MousePointer2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors z-10" size={18} />
                         <input type="text" placeholder="" value={formData.primaryCTA} onChange={(e) => setFormData({...formData, primaryCTA: e.target.value})} className="w-full pl-16 pr-8 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none focus:border-primary/30 font-bold transition-all shadow-inner relative" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-4">Daftar Kompetitor</label>
                      <div className="relative group">
                         <ShieldAlert className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors z-10" size={18} />
                         <input type="text" placeholder="" value={formData.competitors} onChange={(e) => setFormData({...formData, competitors: e.target.value})} className="w-full pl-16 pr-8 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none focus:border-primary/30 font-bold transition-all shadow-inner relative" />
                      </div>
                   </div>
                </div>
              </div>

              {/* Section 3: Technical & Final */}
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-on-background text-background rounded-2xl flex items-center justify-center font-bold">03</div>
                   <h3 className="text-2xl font-black tracking-tight">Detail Teknis & Harapan</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-4">Domain yang Diinginkan</label>
                      <div className="relative group">
                         <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors z-10" size={18} />
                         <input type="text" placeholder="" value={formData.desiredDomain} onChange={(e) => setFormData({...formData, desiredDomain: e.target.value})} className="w-full pl-16 pr-8 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none focus:border-primary/30 font-bold transition-all shadow-inner relative" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-4">Kebutuhan Integrasi</label>
                      <div className="relative group">
                         <Puzzle className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors z-10" size={18} />
                         <input type="text" placeholder="" value={formData.integrations} onChange={(e) => setFormData({...formData, integrations: e.target.value})} className="w-full pl-16 pr-8 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none focus:border-primary/30 font-bold transition-all shadow-inner relative" />
                      </div>
                   </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-4">Harapan Terbesar (Success Goal)</label>
                    <div className="relative group">
                       <Heart className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors z-10" size={18} />
                       <input type="text" placeholder="" value={formData.expectation} onChange={(e) => setFormData({...formData, expectation: e.target.value})} className="w-full pl-16 pr-8 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none focus:border-primary/30 font-bold transition-all shadow-inner relative" />
                    </div>
                </div>

                <div className="space-y-8">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-4">Pilih Paket Website</label>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Atau Isi Budget Sendiri Di Bawah</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 md:gap-6">
                     {["Basic", "Standard", "Premium"].map((p) => (
                       <button key={p} type="button" onClick={() => setFormData({...formData, plan: p, customPrice: ""})} className={`py-6 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all border shadow-sm ${formData.plan === p && !formData.customPrice ? "bg-on-background text-background border-on-background shadow-apple" : "bg-background text-secondary border-outline/10 hover:border-primary/30"}`}>
                         {p}
                       </button>
                     ))}
                  </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-4">Budget / Penawaran Harga (Opsional)</label>
                    <div className="relative group">
                       <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors z-10" size={18} />
                       <input 
                        type="number" 
                        placeholder="" 
                        value={formData.customPrice} 
                        onChange={(e) => setFormData({...formData, customPrice: e.target.value})} 
                        className="w-full pl-16 pr-8 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none focus:border-primary/30 font-bold transition-all shadow-inner relative" 
                       />
                    </div>
                    <p className="text-[9px] text-secondary font-medium ml-4 italic opacity-60">*Jika dikosongkan, harga akan mengikuti paket yang dipilih.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-4">Project Brief & Details</label>
                  <div className="relative group">
                     <MessageSquare className="absolute left-6 top-8 text-slate-300 group-focus-within:text-primary transition-colors z-10" size={18} />
                     <textarea placeholder="" value={formData.brief} onChange={(e) => setFormData({...formData, brief: e.target.value})} className="w-full pl-16 pr-8 py-8 bg-background border border-outline/10 rounded-[2.5rem] outline-none focus:border-primary/30 font-medium text-lg leading-relaxed h-48 transition-all shadow-inner relative resize-none" />
                  </div>
                </div>
              </div>

              <button disabled={isSubmitting} className="w-full py-10 bg-on-background text-background rounded-[3rem] font-black text-sm uppercase tracking-[0.4em] flex items-center justify-center gap-6 hover:opacity-90 active:scale-95 transition-all shadow-apple disabled:opacity-50">
                {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                {isSubmitting ? "TRANSMITTING DATA..." : "DEPLOY ORDER REQUEST"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
