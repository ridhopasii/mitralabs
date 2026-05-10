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
import React from "react";

const defaultInvoiceSettings = {
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
};

const defaultGlobalSettings = {
  waNumber: "6282381118520",
  companyLogo: "/logo.png",
  companyFavicon: "/favicon.ico",
  businessMode: "agresif",
  waPromoMessage: "🔥 Promo Bulan Ini! Hubungi kami sekarang untuk penawaran spesial."
};

// Isolated Input Component to prevent parent re-renders
const FormInput = React.memo(({ label, value, onChange, placeholder, type = "text", description, className = "" }: any) => {
  const [localValue, setLocalValue] = React.useState(value);

  // Sync with prop if it changes externally
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</label>}
      <input
        type={type}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={() => onChange(localValue)}
        placeholder={placeholder}
        className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all"
      />
      {description && <p className="text-[10px] text-slate-400 font-medium">{description}</p>}
    </div>
  );
});

FormInput.displayName = "FormInput";

const FormTextarea = React.memo(({ label, value, onChange, placeholder, rows = 3, className = "" }: any) => {
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</label>}
      <textarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={() => onChange(localValue)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all resize-none"
      />
    </div>
  );
});

FormTextarea.displayName = "FormTextarea";

export default function SettingsPage() {
  const { data, updateData } = useData();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use state but only update on save to avoid massive re-renders while typing
  const [invoiceSettings, setInvoiceSettings] = useState(() => data.invoiceSettings || defaultInvoiceSettings);
  const [globalSettings, setGlobalSettings] = useState(() => data.settings || defaultGlobalSettings);

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
                <FormInput
                  label="Nomor WhatsApp (untuk API)"
                  value={globalSettings.waNumber}
                  onChange={(val: string) => setGlobalSettings({...globalSettings, waNumber: val})}
                  placeholder="6282381118520"
                  description="Format: 62xxx (tanpa +, tanpa spasi)"
                />
                <FormInput
                  label="Pesan Promo WhatsApp"
                  value={globalSettings.waPromoMessage}
                  onChange={(val: string) => setGlobalSettings({...globalSettings, waPromoMessage: val})}
                  placeholder="🔥 Promo Bulan Ini!"
                />
              </div>
            </div>

            {/* Logo & Branding */}
            <div className="space-y-6 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-400">
                <Building2 size={18} />
                <h4 className="text-sm font-bold uppercase tracking-widest">Logo & Branding</h4>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="URL Logo Perusahaan"
                  value={globalSettings.companyLogo}
                  onChange={(val: string) => setGlobalSettings({...globalSettings, companyLogo: val})}
                  placeholder="/logo.png atau https://..."
                  description="Path relatif atau URL lengkap"
                />
                <FormInput
                  label="URL Favicon"
                  value={globalSettings.companyFavicon}
                  onChange={(val: string) => setGlobalSettings({...globalSettings, companyFavicon: val})}
                  placeholder="/favicon.ico"
                />
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
                <FormInput
                  label="Nama Perusahaan"
                  value={invoiceSettings.companyName}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, companyName: val})}
                />
                <FormInput
                  label="Tagline"
                  value={invoiceSettings.companyTagline}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, companyTagline: val})}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="Alamat Lengkap"
                  value={invoiceSettings.companyAddress}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, companyAddress: val})}
                  placeholder="Jl. Jend. Sudirman Kav. 52"
                />
                <FormInput
                  label="Kota"
                  value={invoiceSettings.companyCity}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, companyCity: val})}
                  placeholder="Bandung"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="Provinsi"
                  value={invoiceSettings.companyProvince}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, companyProvince: val})}
                  placeholder="Jawa Barat"
                />
                <FormInput
                  label="Kode Pos"
                  value={invoiceSettings.companyPostalCode}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, companyPostalCode: val})}
                  placeholder="12190"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="Telepon"
                  value={invoiceSettings.companyPhone}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, companyPhone: val})}
                />
                <FormInput
                  label="Email"
                  type="email"
                  value={invoiceSettings.companyEmail}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, companyEmail: val})}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <FormInput
                  label="Website"
                  value={invoiceSettings.companyWebsite}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, companyWebsite: val})}
                  placeholder="www.mitralabs.id"
                />
                <FormInput
                  label="NPWP Perusahaan"
                  value={invoiceSettings.companyNPWP}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, companyNPWP: val})}
                  placeholder="01.234.567.8-901.000"
                />
                <FormInput
                  label="LinkedIn"
                  value={invoiceSettings.companyLinkedin || ""}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, companyLinkedin: val})}
                  placeholder="linkedin.com/company/mitralabs-id"
                />
              </div>

              <FormInput
                label="Instagram"
                value={invoiceSettings.companyInstagram || ""}
                onChange={(val: string) => setInvoiceSettings({...invoiceSettings, companyInstagram: val})}
                placeholder="@mitralabs.id"
              />
            </div>

            {/* Bank Info */}
            <div className="space-y-6 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-400">
                <CreditCard size={18} />
                <h4 className="text-sm font-bold uppercase tracking-widest">Informasi Bank</h4>
              </div>

              <FormInput
                label="Nama Bank"
                value={invoiceSettings.bankName}
                onChange={(val: string) => setInvoiceSettings({...invoiceSettings, bankName: val})}
                placeholder="Bank Central Asia (BCA)"
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="Nomor Rekening"
                  value={invoiceSettings.bankAccountNumber}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, bankAccountNumber: val})}
                />
                <FormInput
                  label="Nama Pemilik Rekening"
                  value={invoiceSettings.bankAccountName}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, bankAccountName: val})}
                />
              </div>

              <FormInput
                label="Cabang Bank (Opsional)"
                value={invoiceSettings.bankBranch}
                onChange={(val: string) => setInvoiceSettings({...invoiceSettings, bankBranch: val})}
                placeholder="KCP Medan Petisah"
              />
            </div>

            {/* Additional Settings */}
            <div className="space-y-6 pt-8 border-t border-slate-100">
              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="Pajak (%)"
                  type="number"
                  value={invoiceSettings.taxRate}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, taxRate: parseFloat(val) || 0})}
                  placeholder="0"
                  description="Set ke 0 untuk menghilangkan pajak di kwitansi"
                />
                <FormInput
                  label="Label Pajak"
                  value={invoiceSettings.taxLabel}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, taxLabel: val})}
                  placeholder="PPN (11%)"
                />
              </div>

              <FormInput
                label="Catatan Footer (Branding)"
                value={invoiceSettings.footerNote}
                onChange={(val: string) => setInvoiceSettings({...invoiceSettings, footerNote: val})}
                placeholder="Verified by Mitralabs Cryptographic Protocol"
              />

              <FormTextarea
                label="Instruksi Pembayaran"
                value={invoiceSettings.paymentInstructions}
                onChange={(val: string) => setInvoiceSettings({...invoiceSettings, paymentInstructions: val})}
                rows={3}
                placeholder="Silakan transfer ke rekening yang tertera..."
              />

              <FormTextarea
                label="Syarat & Ketentuan"
                value={invoiceSettings.termsAndConditions}
                onChange={(val: string) => setInvoiceSettings({...invoiceSettings, termsAndConditions: val})}
                rows={5}
                placeholder="Gunakan baris baru untuk setiap poin..."
              />
            </div>

            {/* Signature & Stamp Settings */}
            <div className="space-y-6 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-400">
                <ShieldCheck size={18} />
                <h4 className="text-sm font-bold uppercase tracking-widest">Tanda Tangan & Materai</h4>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="Nama Marketing Officer (Tanda Tangan 1)"
                  value={invoiceSettings.signatureFields?.marketing || ""}
                  onChange={(val: string) => setInvoiceSettings({
                    ...invoiceSettings,
                    signatureFields: { ...invoiceSettings.signatureFields, marketing: val }
                  })}
                  placeholder="Nama Marketing"
                />
                <FormInput
                  label="Nama Owner/Direktur (Tanda Tangan 2)"
                  value={invoiceSettings.signatureFields?.owner || ""}
                  onChange={(val: string) => setInvoiceSettings({
                    ...invoiceSettings,
                    signatureFields: { ...invoiceSettings.signatureFields, owner: val }
                  })}
                  placeholder="Nama Direktur Utama"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Materai Otomatis</label>
                  <select
                    value={invoiceSettings.stampDutyRequired ? "true" : "false"}
                    onChange={(e) => setInvoiceSettings({
                      ...invoiceSettings,
                      stampDutyRequired: e.target.value === "true"
                    })}
                    className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-sm focus:bg-white focus:border-slate-200 transition-all appearance-none cursor-pointer"
                  >
                    <option value="true">Ya, tampilkan materai jika total &gt; limit</option>
                    <option value="false">Jangan tampilkan materai</option>
                  </select>
                </div>
                <FormInput
                  label="Nominal Materai (Teks)"
                  type="text"
                  value={invoiceSettings.stampDutyAmount || "10.000"}
                  onChange={(val: string) => setInvoiceSettings({
                    ...invoiceSettings,
                    stampDutyAmount: val
                  })}
                  placeholder="10.000"
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
