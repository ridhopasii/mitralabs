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
  History,
  Trash2,
  FileJson
} from "lucide-react";

export default function SettingsPage() {
  const { data, updateData } = useData();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="space-y-12 pb-20">
      <div className="max-w-4xl space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase mb-2">Pengaturan Sistem</h1>
          <p className="text-on-surface-variant font-medium opacity-60">Kelola backup, restore, dan integritas data website Anda.</p>
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
