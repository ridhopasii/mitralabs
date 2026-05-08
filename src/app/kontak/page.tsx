"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import { Mail, Instagram, MessageCircle, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { useData } from "@/context/DataContext";
import { supabase } from "@/lib/supabase";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const { data } = useData();
  const { contact, settings } = data;
  
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [hcaptchaToken, setHcaptchaToken] = useState<string | null>(null);

  const waUrl = `https://wa.me/${settings.waNumber}?text=${encodeURIComponent("Halo Mitralabs! Saya ingin diskusi tentang project saya.")}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hcaptchaToken) {
      alert("Mohon selesaikan tantangan Captcha.");
      return;
    }
    
    const now = Date.now();
    if (now - lastSubmitTime < 60000) {
      const remaining = Math.ceil((60000 - (now - lastSubmitTime)) / 1000);
      alert(`Mohon tunggu ${remaining} detik sebelum mengirim pesan lagi.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('SiteMessage')
        .insert([{ 
          name: formData.name, 
          email: formData.email, 
          message: formData.message,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setIsSuccess(true);
      setLastSubmitTime(Date.now());
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Maaf, terjadi kesalahan. Silakan hubungi kami via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="bg-background min-h-screen">
        {/* Hero Section */}
        <header className="pt-40 pb-24 md:pt-60 md:pb-32 px-6">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-primary font-semibold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-6 block">Kontak Kami</span>
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-semibold text-on-surface mb-10 leading-[1.05] tracking-tight md:tracking-[-0.03em] reveal-text">
                {contact.title}
              </h1>
              <p className="text-xl md:text-2xl text-secondary max-w-3xl font-medium leading-relaxed">
                {contact.subtitle}
              </p>
            </motion.div>
          </div>
        </header>

        {/* Main Content Grid */}
        <section className="section-container pb-40 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
            
            {/* Contact Sidebar (Bento) */}
            <div className="lg:col-span-5 space-y-10">
              {/* Direct Connect Card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-surface-container p-10 md:p-14 rounded-[3.5rem] border border-outline/5 shadow-apple relative overflow-hidden"
              >
                <div className="relative z-10 space-y-10">
                  <div className="flex items-start gap-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shrink-0 shadow-apple border border-outline/5 transition-transform group-hover:scale-110">
                      <Mail className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mb-2">Kirim Email</p>
                      <p className="text-2xl font-semibold text-on-background tracking-tight">{contact.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shrink-0 shadow-apple border border-outline/5 transition-transform group-hover:scale-110">
                      <Instagram className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mb-2">Instagram</p>
                      <p className="text-2xl font-semibold text-on-background tracking-tight">{contact.instagram}</p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-4 bg-on-background text-background font-bold py-5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-apple text-lg"
                    >
                      <MessageCircle size={22} />
                      Diskusi via WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Location Card */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-surface-container rounded-[3.5rem] overflow-hidden shadow-apple border border-outline/5 group"
              >
                <div className="p-10 md:p-14">
                  <h3 className="text-3xl font-semibold mb-3 tracking-tight text-on-background">Studio Kami</h3>
                  <p className="text-secondary font-medium leading-relaxed">{contact.address}</p>
                </div>
                <div className="h-[300px] relative overflow-hidden bg-background">
                  <img
                    src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800"
                    alt="Office Location"
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-2000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary rounded-full animate-ping opacity-20"></div>
                    <div className="absolute w-6 h-6 bg-primary rounded-full border-4 border-background shadow-xl"></div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Form Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 bg-surface-container p-10 md:p-20 rounded-[4rem] border border-outline/5 shadow-apple relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20"
                  >
                    <div className="w-24 h-24 bg-success text-on-success rounded-[2.5rem] flex items-center justify-center shadow-apple ring-8 ring-success/10">
                      <CheckCircle2 size={48} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-on-background">Pesan Terkirim</h2>
                    <p className="text-secondary font-medium text-xl max-w-sm">
                      Terima kasih sudah menghubungi kami. Tim kami akan segera merespon pesan Anda.
                    </p>
                    <button 
                      onClick={() => setIsSuccess(false)}
                      className="text-primary font-bold uppercase tracking-[0.2em] text-[11px] hover:opacity-70 transition-all flex items-center gap-2"
                    >
                      Kirim Pesan Lainnya <ArrowRight size={14} />
                    </button>
                  </motion.div>
                ) : (
                  <form key="form" onSubmit={handleSubmit} className="space-y-12 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary ml-2">Nama Lengkap</label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-8 py-5 rounded-[1.5rem] bg-background border border-outline/5 focus:border-primary/30 transition-all outline-none font-medium text-lg placeholder:text-secondary/30"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary ml-2">Alamat Email</label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-8 py-5 rounded-[1.5rem] bg-background border border-outline/5 focus:border-primary/30 transition-all outline-none font-medium text-lg placeholder:text-secondary/30"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary ml-2">Pesan Anda</label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-8 py-5 rounded-[1.5rem] bg-background border border-outline/5 focus:border-primary/30 transition-all outline-none resize-none font-medium text-lg placeholder:text-secondary/30"
                        placeholder="Ceritakan tentang visi atau kebutuhan project Anda..."
                        rows={6}
                      ></textarea>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                      <div className="w-full md:w-auto">
                        <HCaptcha
                          sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001"}
                          onVerify={(token) => setHcaptchaToken(token)}
                        />
                      </div>
                      
                      <button
                        disabled={isSubmitting || !hcaptchaToken}
                        type="submit"
                        className="btn-apple w-full md:w-auto px-16 py-5 text-lg flex items-center justify-center gap-3 disabled:opacity-30"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Mengirim...
                          </>
                        ) : (
                          <>
                            Kirim Pesan <ArrowRight size={20} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
