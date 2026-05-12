"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  CheckCircle2,
  Building2,
  Phone
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Register to Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create User Record (for RBAC)
        const { error: userError } = await supabase.from("User").insert([{
          id: authData.user.id,
          email,
          full_name: fullName,
          role: "viewer" // Default for new clients
        }]);
        
        if (userError) throw userError;

        // 3. Create Client Record (for Portal)
        const { error: clientError } = await supabase.from("Client").insert([{
          id: authData.user.id,
          email,
          full_name: fullName,
          company_name: company,
          phone: phone
        }]);

        if (clientError) throw clientError;

        // 4. Link existing bookings if any
        await supabase.from("Booking")
          .update({ client_id: authData.user.id })
          .eq("customer_email", email);

        // 5. Auto sign-in and redirect directly to dashboard
        await supabase.auth.signInWithPassword({ email, password });
        router.push("/dashboard");
        return;
      }

      setIsSuccess(true);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-on-background flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-surface-container-lowest p-12 rounded-[3.5rem] text-center space-y-8 shadow-2xl"
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 text-white">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-4">
             <h2 className="text-3xl font-black text-on-surface">Akun Berhasil Dibuat!</h2>
             <p className="text-secondary font-medium leading-relaxed">Silakan cek email Anda untuk verifikasi, lalu masuk ke portal pelanggan kami.</p>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Redirecting to login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-on-background flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="w-full max-w-5xl relative z-10 grid lg:grid-cols-5 gap-12 items-center">
        
        {/* Info Column (Left) */}
        <div className="hidden lg:flex lg:col-span-2 flex-col justify-center space-y-10 pr-6">
           <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-md">
             <ShieldCheck className="text-primary" size={40} />
           </div>
           <div className="space-y-6">
              <h1 className="text-6xl font-black text-white tracking-tighter leading-[0.9]">Join the <br/><span className="text-primary">Ecosystem.</span></h1>
              <p className="text-slate-400 font-medium text-lg leading-relaxed">Buat akun untuk mengelola semua projek website Anda, akses dokumentasi eksklusif, dan monitoring progress realtime.</p>
           </div>
           <div className="pt-8 space-y-5">
              {["Realtime Progress Tracking", "Digital Invoice Center", "Priority Support"].map((f, i) => (
                <div key={i} className="flex items-center gap-4 text-xs font-bold text-white uppercase tracking-[0.2em] opacity-50">
                   <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div> {f}
                </div>
              ))}
           </div>
        </div>

        {/* Form Column (Right) */}
        <div className="lg:col-span-3 bg-white p-12 md:p-20 rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] border border-white/5 space-y-12">
          <div>
             <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h2>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">Start your digital journey</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required type="text" placeholder="Nama Lengkap" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:border-primary/30 font-bold transition-all" />
              </div>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required type="email" placeholder="Email Aktif" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:border-primary/30 font-bold transition-all" />
              </div>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input type="tel" placeholder="Nomor WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:border-primary/30 font-bold transition-all" />
              </div>
              <div className="relative">
                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input type="text" placeholder="Nama Perusahaan (Opsional)" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:border-primary/30 font-bold transition-all" />
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required type="password" placeholder="Password Minimal 8 Karakter" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:border-primary/30 font-bold transition-all" />
              </div>
            </div>

            {error && (
              <p className="p-4 bg-rose-50 text-rose-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                {error}
              </p>
            )}

            <button disabled={loading} className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
              Create My Account
            </button>
          </form>

          <div className="pt-6 border-t border-slate-100 text-center">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
               Sudah punya akun? <Link href="/login" className="text-primary hover:underline">Sign In</Link>
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
