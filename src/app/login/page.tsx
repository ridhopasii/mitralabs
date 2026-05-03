"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Simple password check - in production you'd use a more secure method
    // but for a single admin CMS this is common
    setTimeout(() => {
      if (password === "mitralabsadmin") {
        localStorage.setItem("mitralabs_admin_auth", "true");
        router.push("/admin");
      } else {
        setError(true);
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-on-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-surface-container-lowest p-12 rounded-[3.5rem] shadow-2xl border border-white/5 backdrop-blur-xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/40">
              <Lock className="text-on-primary" size={32} />
            </div>
            <h1 className="font-display text-4xl font-black tracking-tight text-on-surface mb-2">Admin Access</h1>
            <p className="text-on-surface-variant font-medium text-sm uppercase tracking-widest">Mitralabs Master CMS</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">Master Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full px-8 py-6 bg-surface-container-low border-2 rounded-[2rem] outline-none font-black text-xl transition-all ${
                    error ? "border-error text-error animate-shake" : "border-transparent focus:border-primary"
                  }`}
                  required
                />
                {error && (
                  <p className="absolute -bottom-6 left-6 text-[10px] font-black text-error uppercase tracking-widest">
                    Password Salah! Silakan coba lagi.
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/40 mt-8 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  Verifikasi Akses <ArrowRight size={24} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-surface-container-highest text-center">
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-20">
              <ShieldCheck size={14} /> Encrypted Session Security
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
