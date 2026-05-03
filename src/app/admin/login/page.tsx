"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "anjay") {
      localStorage.setItem("mitralabs_admin_auth", "true");
      router.push("/admin");
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/30">
            <ShieldCheck size={40} className="text-on-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase">Admin Portal</h1>
          <p className="text-on-surface-variant font-medium">Authentication required to access Mitralabs CMS.</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-10 rounded-[3rem] shadow-premium border border-surface-container-highest space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">Password Akses</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password..."
                className={`w-full pl-16 pr-8 py-6 bg-surface-container-low border-2 rounded-[2rem] outline-none font-black text-xl transition-all ${
                  error ? "border-error animate-shake" : "border-transparent focus:border-primary"
                }`}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary text-on-primary py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/30"
          >
            Masuk Sekarang <ArrowRight size={24} />
          </button>
        </form>

        <p className="text-center text-[10px] font-black uppercase tracking-widest opacity-20">
          Technical Precision & Security by Mitralabs.id
        </p>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
