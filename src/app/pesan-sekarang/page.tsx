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
import { logActivity, supabase } from "@/lib/supabase";
import { z } from "zod";

const bookingSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  organization: z.string().optional(),
  position: z.string().optional(),
  service: z.string(),
  plan: z.string(),
  desiredDomain: z.string().optional(),
  businessIndustry: z.string().optional(),
  referenceWeb: z.string().optional(),
  targetAudience: z.string().optional(),
  primaryCTA: z.string().optional(),
  competitors: z.string().optional(),
  integrations: z.string().optional(),
  expectation: z.string().optional(),
  customPrice: z.string().optional(),
  brief: z.string().min(10, "Brief minimal 10 karakter untuk hasil terbaik")
});

export default function PesanSekarang() {
  const { data, updateData } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const [trackingInfo, setTrackingInfo] = useState<{id: number, pass: string} | null>(null);

  const getPrice = () => {
    if (formData.customPrice) return parseInt(formData.customPrice);
    return formData.plan === "Premium" ? 7000000 : formData.plan === "Standard" ? 3500000 : 1500000;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      let clientId = null;

      if (user) {
        const { data: clientData } = await supabase
          .from("Client")
          .select("id")
          .eq("email", user.email)
          .single();
        if (clientData) clientId = clientData.id;
      }

      // 2. Generate tracking password (8 chars random)
      const generatedPass = Math.random().toString(36).substring(2, 10).toUpperCase();

      // 3. Save to Supabase
      const now = new Date().toISOString();
      const { data: insertedData, error } = await supabase.from("Booking").insert([{
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
        status: "Pending",
        total_price: getPrice(),
        tracking_password: generatedPass,
        client_id: clientId,
        created_at: now,
        updated_at: now
      }]).select();

      if (error) throw error;

      if (insertedData?.[0]) {
        const bookingId = insertedData[0].id;
        setTrackingInfo({ id: bookingId, pass: generatedPass });

        const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        await supabase.from("Invoice").insert([{
          booking_id: bookingId,
          invoice_number: invoiceNumber,
          amount: getPrice(),
          status: "Unpaid",
          due_date: dueDate,
          items: [
            {
              desc: `${formData.service} - ${formData.plan} Package`,
              price: getPrice(),
              qty: 1
            }
          ],
          client_name: formData.name,
          client_email: formData.email,
          created_at: now,
          updated_at: now
        }]);
      }

      setShowSuccess(true);
      setIsSubmitting(false);

    } catch (err: any) {
      console.error("🔥 Submission error:", err);
      alert(`Gagal mengirim pesanan: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    const waNumber = data.settings?.waNumber || "6282381118520";
    const waMessage = `Halo Mitralabs! Saya baru saja melakukan pemesanan website.\n\n*Nomor Projek:* #${trackingInfo?.id}\n*Nama:* ${formData.name}\n*Layanan:* ${formData.service}\n*Paket:* ${formData.plan}\n\nSaya ingin melanjutkan konsultasi via WA.`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-surface-container p-12 md:p-20 rounded-[3rem] md:rounded-[4rem] text-center space-y-10 border border-outline/5 shadow-apple"
        >
          <div className="w-20 h-20 bg-primary text-background rounded-[2rem] flex items-center justify-center mx-auto shadow-apple-hover">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-on-background uppercase">Order Transmitted!</h2>
            <p className="text-secondary text-base md:text-xl font-medium">Data Anda telah aman di sistem kami. Berikut adalah akses pelacakan projek Anda:</p>
          </div>

          <div className="bg-background/50 p-8 rounded-3xl border border-outline/10 grid grid-cols-2 gap-4">
            <div className="space-y-2 border-r border-outline/10">
               <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Nomor Projek</p>
               <p className="text-2xl font-black text-primary">#{trackingInfo?.id}</p>
            </div>
            <div className="space-y-2">
               <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Password Lacak</p>
               <p className="text-2xl font-black text-on-background tracking-widest">{trackingInfo?.pass}</p>
            </div>
          </div>

          <div className="p-6 bg-primary/5 rounded-2xl text-left flex gap-4 items-start border border-primary/10">
            <ShieldAlert size={20} className="text-primary shrink-0" />
            <p className="text-xs text-secondary leading-relaxed">
              <span className="font-bold text-primary uppercase">Penting:</span> Gunakan data di atas untuk melihat progres pengerjaan di halaman <b>Lacak Projek</b> tanpa perlu membuat akun.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <a
              href={waUrl}
              target="_blank"
              className="w-full sm:w-auto px-10 py-5 bg-emerald-500 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg flex items-center justify-center gap-3"
            >
              <Phone size={18} /> Lanjut ke WhatsApp
            </a>
            <Link
              href="/track"
              className="w-full sm:w-auto px-10 py-5 bg-on-background text-background rounded-full font-black text-xs uppercase tracking-widest hover:opacity-80 transition-all flex items-center justify-center gap-3"
            >
              Coba Lacak Sekarang
            </Link>
          </div>

          <p className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] opacity-40">
             &copy; 2026 Mitralabs Cryptographic Protocol
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
                         <input required type="text" placeholder="" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full pl-16 pr-8 py-6 bg-background border ${errors.name ? 'border-error/50' : 'border-outline/10'} rounded-[2rem] outline-none focus:border-primary/30 font-bold transition-all shadow-inner relative`} />
                      </div>
                      {errors.name && <p className="text-[10px] text-error font-bold ml-6 mt-2 uppercase tracking-widest">{errors.name}</p>}
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-4">Email Address</label>
                      <div className="relative group">
                         <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors z-10" size={18} />
                         <input required type="email" placeholder="" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`w-full pl-16 pr-8 py-6 bg-background border ${errors.email ? 'border-error/50' : 'border-outline/10'} rounded-[2rem] outline-none focus:border-primary/30 font-bold transition-all shadow-inner relative`} />
                      </div>
                      {errors.email && <p className="text-[10px] text-error font-bold ml-6 mt-2 uppercase tracking-widest">{errors.email}</p>}
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-4">WhatsApp Number</label>
                      <div className="relative group">
                         <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors z-10" size={18} />
                         <input required type="tel" placeholder="" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`w-full pl-16 pr-8 py-6 bg-background border ${errors.phone ? 'border-error/50' : 'border-outline/10'} rounded-[2rem] outline-none focus:border-primary/30 font-bold transition-all shadow-inner relative`} />
                      </div>
                      {errors.phone && <p className="text-[10px] text-error font-bold ml-6 mt-2 uppercase tracking-widest">{errors.phone}</p>}
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-secondary ml-4">Nama Instansi / Perusahaan</label>
                      <div className="relative group">
                         <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors z-10" size={18} />
                         <input type="text" placeholder="" value={formData.organization} onChange={(e) => setFormData({...formData, organization: e.target.value})} className="w-full pl-16 pr-8 py-6 bg-background border border-outline/10 rounded-[2rem] outline-none focus:border-primary/30 font-bold transition-all shadow-inner relative" />
                      </div>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
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
                     <textarea required placeholder="Contoh: Saya ingin website untuk toko furnitur dengan fitur katalog produk dan kalkulator ongkir..." value={formData.brief} onChange={(e) => setFormData({...formData, brief: e.target.value})} className={`w-full pl-16 pr-8 py-8 bg-background border ${errors.brief ? 'border-error/50' : 'border-outline/10'} rounded-[2.5rem] outline-none focus:border-primary/30 font-medium text-lg leading-relaxed h-48 transition-all shadow-inner relative resize-none`} />
                  </div>
                  {errors.brief && <p className="text-[10px] text-error font-bold ml-6 mt-2 uppercase tracking-widest">{errors.brief}</p>}
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
