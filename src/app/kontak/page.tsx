"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import { Mail, Instagram, MessageCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import { supabase } from "@/lib/supabase";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function ContactPage() {
  const { data } = useData();
  const { contact, settings } = data;
  
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [hcaptchaToken, setHcaptchaToken] = useState<string | null>(null);

  const waUrl = `https://wa.me/${settings.waNumber}?text=Halo Mitralabs! Saya ingin diskusi tentang project saya.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hcaptchaToken) {
      alert("Mohon selesaikan tantangan Captcha.");
      return;
    }
    
    // Rate Limiting: 60 seconds
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
      <main className="max-w-7xl mx-auto px-6 py-24 md:py-40">
        {/* Hero Section */}
        <section className="mb-24 text-center md:text-left">
          <h1 className="font-display text-5xl md:text-8xl font-black mb-6 text-on-background tracking-tighter leading-[0.95]">
            {contact.title}
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed font-medium">
            {contact.subtitle}
          </p>
        </section>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & WA */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-surface-container-lowest rounded-[3rem] p-10 shadow-premium border border-surface-container-highest relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <MessageCircle size={150} />
              </div>
              <h3 className="text-2xl font-black mb-10 text-primary uppercase tracking-widest text-sm">Direct Contact</h3>
              <div className="space-y-10 relative z-10">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="text-on-secondary-container" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 mb-2 font-black">Email Us</p>
                    <p className="text-2xl font-black text-on-background tracking-tight">{contact.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center shrink-0 shadow-sm">
                    <Instagram className="text-on-secondary-container" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 mb-2 font-black">Instagram</p>
                    <p className="text-2xl font-black text-on-background tracking-tight">{contact.instagram}</p>
                  </div>
                </div>
                <div className="pt-6">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-4 bg-[#25D366] text-white font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-green-500/20 text-lg"
                  >
                    <MessageCircle size={24} />
                    Chat via WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Location Map Bento Card */}
            <div className="bg-surface-container-lowest rounded-[3rem] overflow-hidden shadow-premium border border-surface-container-highest group">
              <div className="p-10">
                <h3 className="text-2xl font-black mb-2 tracking-tight">Our Studio</h3>
                <p className="text-on-surface-variant font-medium">{contact.address}</p>
              </div>
              <div className="h-[300px] bg-surface-container-high relative">
                <img
                  src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800"
                  alt="Office Location"
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary rounded-full animate-ping opacity-20"></div>
                  <div className="absolute w-6 h-6 bg-primary rounded-full border-4 border-white shadow-xl"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-[3.5rem] p-10 md:p-20 shadow-premium border border-surface-container-highest relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-[0.03]">
              <Mail size={300} />
            </div>
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500 relative z-10">
                <div className="w-24 h-24 bg-green-500 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/30">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-4xl font-black tracking-tight">Message Sent!</h2>
                <p className="text-on-surface-variant font-bold text-xl max-w-sm">
                  Terima kasih sudah menghubungi kami. Tim kami akan segera merespon pesan Anda.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="text-primary font-black uppercase tracking-widest text-sm hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">Full Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-8 py-5 rounded-2xl bg-surface-container-low border-2 border-transparent focus:border-primary transition-all outline-none font-bold text-lg"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-8 py-5 rounded-2xl bg-surface-container-low border-2 border-transparent focus:border-primary transition-all outline-none font-bold text-lg"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">Your Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-8 py-5 rounded-2xl bg-surface-container-low border-2 border-transparent focus:border-primary transition-all outline-none resize-none font-medium text-lg"
                    placeholder="Tell us about your vision..."
                    rows={6}
                  ></textarea>
                </div>
                <div className="space-y-3">
                   <HCaptcha
                     sitekey="10000000-ffff-ffff-ffff-000000000001" // Test key
                     onVerify={(token) => setHcaptchaToken(token)}
                   />
                </div>
                <button
                  disabled={isSubmitting || !hcaptchaToken}
                  type="submit"
                  className="w-full md:w-auto px-16 py-6 bg-primary text-on-primary font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.05] active:scale-[0.95] transition-all text-xl flex items-center justify-center gap-4 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Sending...
                    </>
                  ) : "Send Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
