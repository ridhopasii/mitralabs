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
import { uploadImage } from "@/lib/imageUpload";
import React from "react";

const defaultInvoiceSettings = {
  companyName: "MITRALABS.ID",
  companyTagline: "Precision Web Engineering",
  companyAddress: "Medan, Sumatera Utara",
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
  termsAndConditions: "1. Pembayaran DP 30% dilakukan sebelum proyek dimulai\n2. Pelunasan 70% dilakukan setelah website selesai dan sebelum serah terima\n3. Pembayaran dapat dilakukan melalui transfer bank\n4. Garansi bug berlaku 7 hari setelah serah terima",
  paymentInstructions: "Silakan transfer ke rekening yang tertera dan kirimkan bukti transfer ke WhatsApp kami untuk konfirmasi pembayaran."
};

const defaultGlobalSettings = {
  waNumber: "6282381118520",
  logo_url: "/logo.png",
  favicon_url: "/favicon.ico",
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
    <div className={`space-y-4 ${className}`}>
      {label && <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{label}</label>}
      <input
        type={type}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={() => onChange(localValue)}
        placeholder={placeholder}
        className="w-full px-10 py-6 bg-slate-50 border border-transparent rounded-[2rem] outline-none font-black text-lg focus:bg-white focus:border-slate-200 focus:shadow-xl transition-all shadow-inner"
      />
      {description && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-4">{description}</p>}
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
    <div className={`space-y-4 ${className}`}>
      {label && <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{label}</label>}
      <textarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={() => onChange(localValue)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-10 py-8 bg-slate-50 border border-transparent rounded-[2.5rem] outline-none font-medium text-lg leading-relaxed focus:bg-white focus:border-slate-200 focus:shadow-xl transition-all resize-none shadow-inner"
      />
    </div>
  );
});

FormTextarea.displayName = "FormTextarea";

const ImageUploadField = ({ label, value, onChange, description }: any) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadImage(file, "images", "branding");
      if (result.success && result.url) {
        onChange(result.url);
      } else {
        alert(result.error || "Upload gagal");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</label>
      <div className="flex items-center gap-6 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] group hover:bg-white hover:border-slate-200 transition-all">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm relative">
           {value ? (
             <img src={value} alt="Preview" className="w-full h-full object-contain p-2" />
           ) : (
             <Upload className="text-slate-300" size={24} />
           )}
           {uploading && (
             <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
               <RefreshCcw size={20} className="animate-spin text-primary" />
             </div>
           )}
        </div>
        
        <div className="flex-grow space-y-2">
          <div className="relative">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            />
            <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
              {uploading ? "Uploading..." : "Ganti Gambar"}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">URL: {value || "Belum ada gambar"}</p>
        </div>
      </div>
      {description && <p className="text-[10px] text-slate-400 font-medium">{description}</p>}
    </div>
  );
};

export default function SettingsPage() {
  const { data, updateData } = useData();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize from centralized brand or default empty values
  const [brandSettings, setBrandSettings] = useState(() => data.brand || {
    name: "",
    tagline: "",
    logo: "",
    favicon: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    npwp: "",
    linkedin: "",
    instagram: "",
    mapsUrl: "",
  });

  const [invoiceSettings, setInvoiceSettings] = useState(() => data.invoiceSettings || defaultInvoiceSettings);
  const [globalSettings, setGlobalSettings] = useState(() => data.settings || defaultGlobalSettings);
  const [legalSettings, setLegalSettings] = useState(() => data.legal || {
    terms: "",
    privacy: "",
    lastUpdated: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  });

  // CRITICAL: Sync local state when dynamic data arrives from DataContext
  React.useEffect(() => {
    if (data && data.brand) {
      setBrandSettings(data.brand);
      setInvoiceSettings(data.invoiceSettings || defaultInvoiceSettings);
      setGlobalSettings(data.settings || defaultGlobalSettings);
      setLegalSettings(data.legal || {
        terms: "",
        privacy: "",
        lastUpdated: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      });
    }
  }, [data]);

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

  const saveAllSettings = async () => {
    setIsSaving(true);
    try {
      // Synchronize brand settings to legacy fields for backward compatibility
      const syncedInvoiceSettings = {
        ...invoiceSettings,
        companyName: brandSettings.name,
        companyTagline: brandSettings.tagline,
        companyAddress: brandSettings.address,
        companyCity: brandSettings.city,
        companyProvince: brandSettings.province,
        companyPostalCode: brandSettings.postalCode,
        companyPhone: brandSettings.phone,
        companyEmail: brandSettings.email,
        companyWebsite: brandSettings.website,
        companyNPWP: brandSettings.npwp,
        companyLinkedin: brandSettings.linkedin,
        companyInstagram: brandSettings.instagram,
      };

      const syncedContact = {
        ...data.contact,
        phone: brandSettings.phone,
        email: brandSettings.email,
        instagram: brandSettings.instagram,
        address: brandSettings.address,
        mapsUrl: brandSettings.mapsUrl,
      };

      const newData = { 
        ...data, 
        brand: brandSettings,
        invoiceSettings: syncedInvoiceSettings, 
        settings: globalSettings,
        contact: syncedContact,
        navbar: {
          ...data.navbar,
          logo: brandSettings.name // Sync logo text if needed
        },
        legal: {
          ...legalSettings,
          lastUpdated: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        }
      };

      updateData(newData);
      await logActivity("Update Settings", "Brand & System settings berhasil diperbarui secara terpusat");
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight uppercase mb-2">Pusat Konfigurasi</h1>
            <p className="text-on-surface-variant font-medium opacity-60">Single Source of Truth untuk identitas brand dan operasional sistem.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={saveAllSettings}
              disabled={isSaving}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
            >
              {isSaving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
              Simpan Perubahan
            </button>
          </div>
        </div>

        {success && (
          <div className="p-6 bg-green-500 text-white rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4">
            <CheckCircle2 size={24} />
            <p className="font-black">{success}</p>
          </div>
        )}

        {/* 1. Brand Identity Section (NEW & CENTRALIZED) */}
        <section className="bg-white rounded-[4rem] p-12 md:p-16 border border-slate-100 shadow-apple space-y-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
              <Building2 size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Identitas Brand</h3>
              <p className="text-sm font-bold opacity-40 uppercase tracking-widest mt-1">Informasi Dasar & Branding Utama</p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
              <ImageUploadField
                label="Logo Utama"
                value={brandSettings.logo}
                onChange={(url: string) => setBrandSettings({ ...brandSettings, logo: url })}
                description="Muncul di Navbar dan Dokumen Resmi"
              />
              <ImageUploadField
                label="Favicon"
                value={brandSettings.favicon}
                onChange={(url: string) => setBrandSettings({ ...brandSettings, favicon: url })}
                description="Ikon kecil di tab browser (16x16 / 32x32)"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormInput
                label="Nama Perusahaan / Brand"
                value={brandSettings.name}
                onChange={(val: string) => setBrandSettings({ ...brandSettings, name: val })}
              />
              <FormInput
                label="Tagline Profesional"
                value={brandSettings.tagline}
                onChange={(val: string) => setBrandSettings({ ...brandSettings, tagline: val })}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FormInput
                label="WhatsApp"
                value={brandSettings.whatsapp}
                onChange={(val: string) => setBrandSettings({ ...brandSettings, whatsapp: val })}
                placeholder="628..."
              />
              <FormInput
                label="Email Bisnis"
                value={brandSettings.email}
                onChange={(val: string) => setBrandSettings({ ...brandSettings, email: val })}
              />
              <FormInput
                label="Website URL"
                value={brandSettings.website}
                onChange={(val: string) => setBrandSettings({ ...brandSettings, website: val })}
              />
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-50">
               <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="Alamat Kantor"
                  value={brandSettings.address}
                  onChange={(val: string) => setBrandSettings({ ...brandSettings, address: val })}
                />
                <FormInput
                  label="Kota"
                  value={brandSettings.city}
                  onChange={(val: string) => setBrandSettings({ ...brandSettings, city: val })}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <FormInput
                  label="Provinsi"
                  value={brandSettings.province}
                  onChange={(val: string) => setBrandSettings({ ...brandSettings, province: val })}
                />
                <FormInput
                  label="Kode Pos"
                  value={brandSettings.postalCode}
                  onChange={(val: string) => setBrandSettings({ ...brandSettings, postalCode: val })}
                />
                <FormInput
                  label="NPWP"
                  value={brandSettings.npwp}
                  onChange={(val: string) => setBrandSettings({ ...brandSettings, npwp: val })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
              <FormInput
                label="LinkedIn URL"
                value={brandSettings.linkedin}
                onChange={(val: string) => setBrandSettings({ ...brandSettings, linkedin: val })}
              />
              <FormInput
                label="Instagram Handle"
                value={brandSettings.instagram}
                onChange={(val: string) => setBrandSettings({ ...brandSettings, instagram: val })}
              />
            </div>
          </div>
        </section>

        {/* 2. Operational & Finance Section */}
        <section className="bg-white rounded-[4rem] p-12 md:p-16 border border-slate-100 shadow-apple space-y-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <Receipt size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Finansial & Dokumen</h3>
              <p className="text-sm font-bold opacity-40 uppercase tracking-widest mt-1">Rekening Bank & Aturan Invoice</p>
            </div>
          </div>

          <div className="space-y-10">
            {/* Bank Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-slate-400">
                <CreditCard size={18} />
                <h4 className="text-sm font-bold uppercase tracking-widest">Informasi Bank</h4>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <FormInput
                  label="Nama Bank"
                  value={invoiceSettings.bankName}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, bankName: val})}
                />
                <FormInput
                  label="Nomor Rekening"
                  value={invoiceSettings.bankAccountNumber}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, bankAccountNumber: val})}
                />
                <FormInput
                  label="Atas Nama"
                  value={invoiceSettings.bankAccountName}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, bankAccountName: val})}
                />
              </div>
            </div>

            {/* Tax & Terms */}
            <div className="space-y-6 pt-10 border-t border-slate-100">
               <div className="grid md:grid-cols-2 gap-6">
                <FormInput
                  label="Pajak (%)"
                  type="number"
                  value={invoiceSettings.taxRate}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, taxRate: parseFloat(val) || 0})}
                />
                <FormInput
                  label="Label Pajak"
                  value={invoiceSettings.taxLabel}
                  onChange={(val: string) => setInvoiceSettings({...invoiceSettings, taxLabel: val})}
                />
              </div>

              <FormTextarea
                label="Syarat & Ketentuan Dokumen"
                value={invoiceSettings.termsAndConditions}
                onChange={(val: string) => setInvoiceSettings({...invoiceSettings, termsAndConditions: val})}
                rows={5}
              />
            </div>
          </div>
        </section>

        {/* 3. Authority & Signatures Section */}
        <section className="bg-slate-900 text-white rounded-[4rem] p-12 md:p-16 shadow-2xl space-y-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Otoritas Digital</h3>
              <p className="text-sm font-bold opacity-40 uppercase tracking-widest mt-1">Penandatangan Resmi Dokumen</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Authority 1 */}
            <div className="space-y-8 p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Otoritas 01 (Marketing)</p>
                <Briefcase size={16} className="opacity-40" />
              </div>
              
              <div className="space-y-6">
                <FormInput
                  label="Nama Pejabat"
                  value={invoiceSettings.signatureFields?.marketingName || ""}
                  onChange={(val: string) => setInvoiceSettings({
                    ...invoiceSettings,
                    signatureFields: { ...invoiceSettings.signatureFields, marketingName: val }
                  })}
                  className="!text-white"
                />
                <FormInput
                  label="Jabatan"
                  value={invoiceSettings.signatureFields?.marketingTitle || ""}
                  onChange={(val: string) => setInvoiceSettings({
                    ...invoiceSettings,
                    signatureFields: { ...invoiceSettings.signatureFields, marketingTitle: val }
                  })}
                />
                <ImageUploadField
                  label="Tanda Tangan"
                  value={invoiceSettings.signatureFields?.marketingSignature || ""}
                  onChange={(url: string) => setInvoiceSettings({
                    ...invoiceSettings,
                    signatureFields: { ...invoiceSettings.signatureFields, marketingSignature: url }
                  })}
                />
              </div>
            </div>

            {/* Authority 2 */}
            <div className="space-y-8 p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Otoritas 02 (Owner)</p>
                <ShieldCheck size={16} className="opacity-40" />
              </div>

              <div className="space-y-6">
                <FormInput
                  label="Nama Pejabat"
                  value={invoiceSettings.signatureFields?.ownerName || ""}
                  onChange={(val: string) => setInvoiceSettings({
                    ...invoiceSettings,
                    signatureFields: { ...invoiceSettings.signatureFields, ownerName: val }
                  })}
                />
                <FormInput
                  label="Jabatan"
                  value={invoiceSettings.signatureFields?.ownerTitle || ""}
                  onChange={(val: string) => setInvoiceSettings({
                    ...invoiceSettings,
                    signatureFields: { ...invoiceSettings.signatureFields, ownerTitle: val }
                  })}
                />
                <ImageUploadField
                  label="Tanda Tangan"
                  value={invoiceSettings.signatureFields?.ownerSignature || ""}
                  onChange={(url: string) => setInvoiceSettings({
                    ...invoiceSettings,
                    signatureFields: { ...invoiceSettings.signatureFields, ownerSignature: url }
                  })}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. Legal & Policy Section (NEW) */}
        <section className="bg-white rounded-[4rem] p-12 md:p-16 border border-slate-100 shadow-apple space-y-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Legal & Kebijakan</h3>
              <p className="text-sm font-bold opacity-40 uppercase tracking-widest mt-1">Syarat Layanan & Privasi Klien</p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-6">
              <FormTextarea
                label="Syarat & Ketentuan (Terms of Service)"
                value={legalSettings.terms}
                onChange={(val: string) => setLegalSettings({ ...legalSettings, terms: val })}
                rows={10}
                placeholder="Tuliskan syarat dan ketentuan layanan di sini..."
              />
            </div>

            <div className="space-y-6 pt-10 border-t border-slate-100">
              <FormTextarea
                label="Kebijakan Privasi (Privacy Policy)"
                value={legalSettings.privacy}
                onChange={(val: string) => setLegalSettings({ ...legalSettings, privacy: val })}
                rows={10}
                placeholder="Tuliskan kebijakan privasi data di sini..."
              />
            </div>
            
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Terakhir Diperbarui Otomatis</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{legalSettings.lastUpdated}</p>
            </div>
          </div>
        </section>

        {/* 5. Backup & Restore Section */}
        <section className="bg-white rounded-[4rem] p-12 md:p-16 border border-slate-100 shadow-apple space-y-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center">
              <Database size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Manajemen Data</h3>
              <p className="text-sm font-bold opacity-40 uppercase tracking-widest mt-1">Backup & Restore Seluruh Sistem</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <button
              onClick={exportData}
              disabled={isExporting}
              className="flex flex-col items-start p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Download size={24} />
              </div>
              <h4 className="text-xl font-black mb-2 uppercase tracking-tight">Ekspor Backup</h4>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed text-left">
                Download JSON data untuk keamanan arsip.
              </p>
            </button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-start p-10 bg-red-50/50 rounded-[2.5rem] border border-red-100 hover:bg-white hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Upload size={24} />
                </div>
                <h4 className="text-xl font-black mb-2 uppercase tracking-tight text-red-600">Impor Restore</h4>
                <p className="text-red-400 text-xs font-bold uppercase tracking-widest leading-relaxed text-left">
                  Upload file backup untuk menimpa data saat ini.
                </p>
              </div>
            </div>
          </div>
        </section>

        <button
          onClick={saveAllSettings}
          disabled={isSaving}
          className="w-full py-8 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-6 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/40 disabled:opacity-50"
        >
          {isSaving ? <RefreshCcw size={24} className="animate-spin" /> : <CheckCircle2 size={24} />}
          Konfirmasi & Simpan Seluruh Perubahan
        </button>
      </div>
    </div>
  );
}
