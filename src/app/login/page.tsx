"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isConfigured = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.session) {
        router.push("/admin");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Gagal masuk. Periksa kembali email dan password.");
      setLoading(false);
    }
  };

  return (
    <div data-login-page className="min-h-screen bg-on-background flex items-center justify-center p-6 relative overflow-hidden">
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

            {!isConfigured && (
              <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-2xl text-left">
                <p className="text-[10px] font-black text-error uppercase tracking-widest mb-1">Peringatan Sistem</p>
                <p className="text-xs font-bold text-on-surface-variant leading-relaxed">
                  Environment Variables belum diatur di Vercel. Silakan tambahkan <code className="text-error">NEXT_PUBLIC_SUPABASE_URL</code> dan <code className="text-error">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> di dashboard Vercel Anda.
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mitralabs.id"
                  className="w-full px-8 py-5 bg-surface-container-low border-2 border-transparent focus:border-primary rounded-[2rem] outline-none font-bold text-lg transition-all"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full px-8 py-5 bg-surface-container-low border-2 rounded-[2rem] outline-none font-black text-xl transition-all ${
                    error ? "border-error text-error" : "border-transparent focus:border-primary"
                  }`}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <p className="text-[10px] font-black text-error uppercase tracking-widest text-center px-4">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/40 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <ShieldCheck size={14} /> Supabase Auth Protected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
