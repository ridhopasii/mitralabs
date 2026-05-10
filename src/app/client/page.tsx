"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Folder, ExternalLink, Calendar, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ClientDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 1. Fetch Projects
        const { data: clientData } = await supabase
          .from("Client")
          .select("id")
          .eq("email", user.email)
          .single();

        if (clientData) {
          const { data: projectData } = await supabase
            .from("ClientProject")
            .select("*, updates:ProjectUpdate(*), files:ProjectFile(*)")
            .eq("client_id", clientData.id)
            .order("created_at", { ascending: false });

          setProjects(projectData || []);
        }

        // 2. Fetch Invoices by Email
        const { data: invoiceData } = await supabase
          .from("Invoice")
          .select("*")
          .eq("client_email", user.email)
          .order("created_at", { ascending: false });

        setInvoices(invoiceData || []);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    } finally {
      setLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end bg-gradient-to-r from-slate-900 to-slate-800 p-10 rounded-[2.5rem] shadow-xl text-white">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Mitralabs Client Space</h1>
          <p className="text-slate-300 mt-2 text-lg">Selamat datang! Pantau progres real-time, dokumen, dan invoice Anda.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200 pb-2 overflow-x-auto custom-scrollbar">
        {["overview", "dokumen", "kwitansi", "chat"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all whitespace-nowrap
            ${activeTab === tab ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
        projects.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
            <Folder className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold">No Active Projects</h3>
            <p className="text-slate-500 mt-2">You don't have any ongoing projects at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={project.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{project.project_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                      ${project.status === 'completed' ? 'bg-green-100 text-green-700' :
                        project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'}`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Progress</span>
                        <span className="font-bold">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 px-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {project.updates?.length || 0} Updates
                  </span>
                  <button className="text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-2">
                    View Details
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : null}

      {activeTab === "dokumen" && (
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200">
          <h2 className="text-2xl font-bold mb-4">Dokumen Proyek Terkait</h2>
          <p className="text-slate-500 mb-8">Arsip file, aset logo, dan modul khusus yang diunggah oleh tim Mitralabs untuk Anda.</p>

          {projects.flatMap(p => p.files || []).length === 0 ? (
            <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center text-slate-400">
               Belum ada dokumen yang dikirimkan.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.flatMap(p => (p.files || []).map((file: any) => (
                <div key={file.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div>
                    <Folder className="text-primary mb-4" size={32} />
                    <p className="font-bold text-slate-900 line-clamp-1">{file.file_name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">{file.file_type || 'Document'}</p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-200/50 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400">{new Date(file.created_at).toLocaleDateString()}</span>
                    <a
                      href={file.file_url}
                      target="_blank"
                      className="text-primary font-bold text-xs hover:underline flex items-center gap-1"
                    >
                      Download <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )))}
            </div>
          )}
        </div>
      )}

      {activeTab === "kwitansi" && (
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200">
          <h2 className="text-2xl font-bold mb-4">Kwitansi & Tagihan</h2>
          <p className="text-slate-500 mb-8">Riwayat penagihan dan histori pembayaran layanan.</p>

          {invoices.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center text-slate-400">
               Belum ada tagihan yang diterbitkan.
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                      ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{inv.invoice_number}</p>
                      <p className="text-xs text-slate-500">Jatuh Tempo: {new Date(inv.due_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">Rp {inv.amount.toLocaleString()}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-widest
                      ${inv.status === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {inv.status}
                    </span>
                  </div>
                  <a
                    href={`/api/invoice/${inv.invoice_number}/pdf`}
                    target="_blank"
                    className="ml-6 p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary transition-all"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "chat" && (
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200">
          <h2 className="text-2xl font-bold mb-4">Pusat Bantuan (Chat)</h2>
          <p className="text-slate-500 mb-8">Bicarakan perubahan, revisi, dan kendala langsung dengan tim yang menangani proyek Anda.</p>
        </div>
      )}
    </div>
  );
}
