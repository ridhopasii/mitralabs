"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        router.replace("/admin");
      }
    });
  }, [router]);

  const isConfigured = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isConfigured) {
      setError("Supabase belum dikonfigurasi.");
      return;
    }

    setLoading(true);
    const { error: loginError, data: authData } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
       router.replace("/admin");
    }

    router.refresh();
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
            <h1 className="font-display text-4xl font-black tracking-tight text-on-surface mb-2">Mitralabs Portal</h1>
            <p className="text-on-surface-variant font-medium text-sm uppercase tracking-widest">Sign in to your account</p>

            {!isConfigured && (
              <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-2xl text-left">
                <p className="text-[10px] font-black text-error uppercase tracking-widest mb-1">Peringatan Sistem</p>
                <p className="text-xs font-bold text-on-surface-variant leading-relaxed">
                  Environment Variables belum diatur di Vercel. Silakan tambahkan <code className="text-error">NEXT_PUBLIC_SUPABASE_URL</code> dan <code className="text-error">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> di dashboard Vercel Anda.
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email admin"
              className="w-full px-6 py-5 bg-surface border border-surface-container-highest rounded-2xl outline-none focus:border-primary font-bold"
            />
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full px-6 py-5 bg-surface border border-surface-container-highest rounded-2xl outline-none focus:border-primary font-bold"
            />
            {error && (
              <p className="text-error text-xs font-bold text-left bg-error/10 border border-error/20 rounded-2xl p-4">
                {error}
              </p>
            )}
            
            {/* Display URL Errors */}
            {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('error') === 'unauthorized' && !error && (
              <p className="text-error text-xs font-bold text-left bg-error/10 border border-error/20 rounded-2xl p-4">
                Akun <span className="underline">{new URLSearchParams(window.location.search).get('email')}</span> tidak memiliki izin akses Admin. Silakan hubungi pengelola sistem.
              </p>
            )}
            {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('error') === 'db_error' && !error && (
              <p className="text-error text-xs font-bold text-left bg-error/10 border border-error/20 rounded-2xl p-4">
                Terjadi kesalahan pada database (RBAC). Silakan coba lagi nanti.
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/40 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <ArrowRight size={24} />}
              Sign In to Portal
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-surface-container-highest text-center space-y-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Belum punya akun? <Link href="/register" className="text-primary hover:underline">Daftar Sekarang</Link>
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Atau <Link href="/track" className="text-on-surface hover:text-primary transition-colors underline decoration-primary/30">Login via Email Pesanan</Link>
            </p>
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-20">
              <ShieldCheck size={14} /> Protected by Supabase Auth
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
