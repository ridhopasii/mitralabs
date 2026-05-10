"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import {
  Database,
  Download,
  Upload,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FileJson,
  Receipt,
  Building2,
  CreditCard,
  Save,
  Phone,
  Briefcase
} from "lucide-react";
import { logActivity } from "@/lib/supabase";

export default function SettingsPage() {
  const { data, updateData } = useData();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [invoiceSettings, setInvoiceSettings] = useState(data.invoiceSettings || {
    companyName: "MITRALABS.ID",
    companyTagline: "Precision Web Engineering",
    companyAddress: "Jl. Contoh No. 123",
    companyCity: "Medan",
    companyProvince: "Sumatera Utara",
    companyPostalCode: "20111",
    companyPhone: "+62 823-8111-8520",
    companyEmail: "contact@mitralabs.id",
    companyWebsite: "www.mitralabs.id",
    companyNPWP: "00.000.000.0-000.000",
    bankName: "Bank Central Asia (BCA)",
    bankAccountNumber: "8000-7625-12",
    bankAccountName: "Ridho Robbi Pasi",
    bankBranch: "KCP Medan Petisah",
    taxRate: 0,
    taxLabel: "PPN (11%)",
    footerNote: "Verified by Mitralabs Cryptographic Protocol",
    termsAndConditions: "1. Pembayaran dilakukan maksimal 7 hari setelah invoice diterbitkan\n2. Pembayaran dapat dilakukan melalui transfer bank\n3. Konfirmasi pembayaran wajib disertai bukti transfer\n4. Garansi bug berlaku 3 bulan setelah serah terima",
    paymentInstructions: "Silakan transfer ke rekening yang tertera dan kirimkan bukti transfer ke WhatsApp kami untuk konfirmasi pembayaran."
  });

  const [globalSettings, setGlobalSettings] = useState(data.settings || {
    waNumber: "6282381118520",
    companyLogo: "/logo.png",
    companyFavicon: "/favicon.ico",
    businessMode: "agresif",
    waPromoMessage: "🔥 Promo Bulan Ini! Hubungi kami sekarang untuk penawaran spesial."
  });

  const exportData = () => {
    setIsExporting(true);
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      const exportFileDefaultName = `mitralabs_backup_${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      setSuccess("Backup berhasil diunduh!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError("Gagal melakukan backup.");
    } finally {
      setIsExporting(false);
    }
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (confirm("Apakah Anda yakin ingin me-restore data ini? Data saat ini akan ditimpa.")) {
          updateData(json);
          setSuccess("Data berhasil di-restore!");
          setTimeout(() => setSuccess(null), 3000);
        }
      } catch (err) {
        setError("File JSON tidak valid.");
        setTimeout(() => setError(null), 3000);
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };

  const saveInvoiceSettings = async () => {
    setIsSaving(true);
    try {
      const newData = { ...data, invoiceSettings, settings: globalSettings };
      updateData(newData);
      await logActivity("Update Settings", "Invoice & Global settings berhasil diperbarui");
      setSuccess("Pengaturan berhasil disimpan!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Gagal menyimpan pengaturan.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="max-w-4xl space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase mb-2">Pengaturan Sistem</h1>
          <p className="text-on-surface-variant font-medium opacity-60">Kelola invoice, backup, restore, dan integritas data website Anda.</p>
        </div>

        {success && (
          <div className="p-6 bg-green-500 text-white rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4">
            <CheckCircle2 size={24} />
            <p className="font-black">{success}</p>
          </div>
        )}

        {error && (
          <div className="p-6 bg-error text-white rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4">
            <AlertCircle size={24} />
            <p className="font-black">{error}</p>
          </div>
        )}

        {/* Global Settings Section */}
        <section className="bg-white rounded-[3.5rem] p-12 border border-surface-container-highest shadow-premium space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <Database size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Pengaturan Global Website</h3>
              <p className="text-sm font-bold opacity-40 uppercase tracking-widest mt-1">WhatsApp, Logo, dan Konfigurasi Umum</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* WhatsApp & Contact */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-slate-400">
                <Phone size={18} />
                <h4 className="text-sm font-bold uppercase tracking-widest">WhatsApp & Kontak</h4>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Nomor WhatsApp (untuk API)</label>
                  <input
                    type="text"
                    value={globalSettings.waNumber}
                    onChange={(e) => setGlobalSettings({...globalSettings, waNumber: e.target.value})}
                    placeholder="6282381118520"
                    className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">Format: 62xxx (tanpa +, tanpa spasi)</p>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Pesan Promo WhatsApp</label>
                  <input
                    type="text"
                    value={globalSettings.waPromoMessage}
                    onChange={(e) => setGlobalSettings({...globalSettings, waPromoMessage: e.target.value})}
                    placeholder="🔥 Promo Bulan Ini!"
                    className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Logo & Branding */}
            <div className="space-y-6 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-400">
                <Building2 size={18} />
                <h4 className="text-sm font-bold uppercase tracking-widest">Logo & Branding</h4>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">URL Logo Perusahaan</label>
                  <input
                    type="text"
                    value={globalSettings.companyLogo}
                    onChange={(e) => setGlobalSettings({...globalSettings, companyLogo: e.target.value})}
                    placeholder="/logo.png atau https://..."
                    className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">Path relatif atau URL lengkap</p>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">URL Favicon</label>
                  <input
                    type="text"
                    value={globalSettings.companyFavicon}
                    onChange={(e) => setGlobalSettings({...globalSettings, companyFavicon: e.target.value})}
                    placeholder="/favicon.ico"
                    className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Business Mode */}
            <div className="space-y-6 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-400">
                <Briefcase size={18} />
                <h4 className="text-sm font-bold uppercase tracking-widest">Mode Bisnis</h4>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Mode Operasional</label>
                <select
                  value={globalSettings.businessMode}
                  onChange={(e) => setGlobalSettings({...globalSettings, businessMode: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all appearance-none cursor-pointer"
                >
                  <option value="agresif">Agresif (Promo & CTA Kuat)</option>
                  <option value="profesional">Profesional (Formal & Elegan)</option>
                  <option value="santai">Santai (Friendly & Casual)</option>
                </select>
                <p className="text-[10px] text-slate-400 font-medium">Mempengaruhi tone komunikasi di website</p>
              </div>
            </div>
          </div>
        </section>

        {/* Invoice Settings Section */}
        <section className="bg-white rounded-[3.5rem] p-12 border border-surface-container-highest shadow-premium space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <Receipt size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Pengaturan Invoice</h3>
              <p className="text-sm font-bold opacity-40 uppercase tracking-widest mt-1">Konfigurasi Default Invoice</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-slate-400">
                <Building2 size={18} />
                <h4 className="text-sm font-bold uppercase tracking-widest">Informasi Perusahaan</h4>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Nama Perusahaan</label>
                  <input
                    type="text"
                    value={invoiceSettings.companyName}
                    onChange={(e) => setInvoiceSettings({...invoiceSettings, companyName: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Tagline</label>
                  <input
                    type="text"
                    value={invoiceSettings.companyTagline}
                    onChange={(e) => setInvoiceSettings({...invoiceSettings, companyTagline: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Alamat</label>
                <input
                  type="text"
                  value={invoiceSettings.companyAddress}
                  onChange={(e) => setInvoiceSettings({...invoiceSettings, companyAddress: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Telepon</label>
                  <input
                    type="text"
                    value={invoiceSettings.companyPhone}
                    onChange={(e) => setInvoiceSettings({...invoiceSettings, companyPhone: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</label>
                  <input
                    type="email"
                    value={invoiceSettings.companyEmail}
                    onChange={(e) => setInvoiceSettings({...invoiceSettings, companyEmail: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Bank Info */}
            <div className="space-y-6 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-400">
                <CreditCard size={18} />
                <h4 className="text-sm font-bold uppercase tracking-widest">Informasi Bank</h4>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Nama Bank</label>
                <input
                  type="text"
                  value={invoiceSettings.bankName}
                  onChange={(e) => setInvoiceSettings({...invoiceSettings, bankName: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Nomor Rekening</label>
                  <input
                    type="text"
                    value={invoiceSettings.bankAccountNumber}
                    onChange={(e) => setInvoiceSettings({...invoiceSettings, bankAccountNumber: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Nama Pemilik Rekening</label>
                  <input
                    type="text"
                    value={invoiceSettings.bankAccountName}
                    onChange={(e) => setInvoiceSettings({...invoiceSettings, bankAccountName: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Cabang Bank (Opsional)</label>
                <input
                  type="text"
                  value={invoiceSettings.bankBranch}
                  onChange={(e) => setInvoiceSettings({...invoiceSettings, bankBranch: e.target.value})}
                  placeholder="KCP Medan Petisah"
                  className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                />
              </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-6 pt-8 border-t border-slate-100">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Pajak (%)</label>
                  <input
                    type="number"
                    value={invoiceSettings.taxRate}
                    onChange={(e) => setInvoiceSettings({...invoiceSettings, taxRate: parseFloat(e.target.value) || 0})}
                    placeholder="11"
                    className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Label Pajak</label>
                  <input
                    type="text"
                    value={invoiceSettings.taxLabel}
                    onChange={(e) => setInvoiceSettings({...invoiceSettings, taxLabel: e.target.value})}
                    placeholder="PPN (11%)"
                    className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Catatan Footer</label>
                <input
                  type="text"
                  value={invoiceSettings.footerNote}
                  onChange={(e) => setInvoiceSettings({...invoiceSettings, footerNote: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Instruksi Pembayaran</label>
                <textarea
                  value={invoiceSettings.paymentInstructions}
                  onChange={(e) => setInvoiceSettings({...invoiceSettings, paymentInstructions: e.target.value})}
                  rows={3}
                  placeholder="Silakan transfer ke rekening yang tertera..."
                  className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Syarat & Ketentuan</label>
                <textarea
                  value={invoiceSettings.termsAndConditions}
                  onChange={(e) => setInvoiceSettings({...invoiceSettings, termsAndConditions: e.target.value})}
                  rows={5}
                  placeholder="1. Pembayaran dilakukan maksimal 7 hari..."
                  className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all resize-none"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={saveInvoiceSettings}
              disabled={isSaving}
              className="w-full py-6 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50"
            >
              {isSaving ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
              Simpan Semua Pengaturan (Global + Invoice)
            </button>
          </div>
        </section>

        {/* Backup & Restore Section */}
        <section className="bg-white rounded-[3.5rem] p-12 border border-surface-container-highest shadow-premium space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <Database size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Manajemen Data</h3>
              <p className="text-sm font-bold opacity-40 uppercase tracking-widest mt-1">Backup & Restore JSON Data</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Export */}
            <div className="p-8 bg-surface-container-low rounded-[2.5rem] border border-surface-container space-y-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary mb-6 shadow-sm">
                  <Download size={24} />
                </div>
                <h4 className="text-xl font-black mb-2">Ekspor Data (Backup)</h4>
                <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                  Unduh seluruh konfigurasi dan konten website dalam format file JSON.
                </p>
              </div>
              <button
                onClick={exportData}
                disabled={isExporting}
                className="w-full py-5 bg-on-surface text-surface rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-xl"
              >
                {isExporting ? <RefreshCcw size={18} className="animate-spin" /> : <FileJson size={18} />}
                Download Backup
              </button>
            </div>

            {/* Import */}
            <div className="p-8 bg-surface-container-low rounded-[2.5rem] border border-surface-container space-y-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-error mb-6 shadow-sm">
                  <Upload size={24} />
                </div>
                <h4 className="text-xl font-black mb-2">Impor Data (Restore)</h4>
                <p className="text-on-surface-variant text-sm font-medium leading-relaxed text-error/80 font-bold">
                  PERINGATAN: Mengunggah file akan menimpa seluruh konten website saat ini.
                </p>
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <button
                  className="w-full py-5 bg-error text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-xl shadow-error/20"
                >
                  <Upload size={18} />
                  Restore dari File
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Security Info */}
        <section className="bg-inverse-surface text-inverse-on-surface rounded-[3.5rem] p-12 shadow-premium flex flex-col md:flex-row items-center gap-10">
          <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl shadow-primary/40 rotate-3">
             <ShieldCheck size={48} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Keamanan Sistem</h3>
            <p className="opacity-60 font-medium leading-relaxed">
              Seluruh data Anda dienkripsi dan disimpan di infrastruktur Supabase yang aman. Pastikan Anda melakukan backup secara berkala sebelum melakukan perubahan besar pada struktur konten.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
