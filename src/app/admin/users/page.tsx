"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase, logActivity } from "@/lib/supabase";
import {
  Shield, ShieldAlert, ShieldCheck, UserPlus, Search, Edit3, Trash2,
  Mail, X, Save, CheckCircle2, RotateCcw, UserCircle
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setUsers(data);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!editUser) return;
    setIsSaving(true);

    try {
      const isNew = !editUser.id;

      if (isNew) {
        // Create new RBAC entry
        const { error } = await supabase.from('User').insert([{
          full_name: editUser.full_name,
          email: editUser.email,
          role: editUser.role,
          is_active: editUser.is_active,
        }]);
        if (error) throw error;
        await logActivity("Create Staff", `Registered ${editUser.role}: ${editUser.email}`);
      } else {
        const { error } = await supabase.from('User').update({
          full_name: editUser.full_name,
          role: editUser.role,
          is_active: editUser.is_active,
        }).eq('id', editUser.id);
        if (error) throw error;
        await logActivity("Update Staff", `Updated ${editUser.role}: ${editUser.email}`);
      }

      setShowSuccess(true);
      setEditUser(null);
      fetchUsers();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Cabut akses ${name} secara permanen?`)) return;
    try {
      const { error } = await supabase.from('User').delete().eq('id', id);
      if (error) throw error;
      await logActivity("Revoke Access", `Deleted user: ${name}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-10 right-10 z-[300] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 font-bold border border-white/10"
          >
            <CheckCircle2 size={24} className="text-primary" />
            Konfigurasi Sistem Akses Tersimpan Sempurna!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900">Privilege & RBAC Protocol</h2>
          <p className="text-slate-500 mt-2 font-medium">Beri hak akses internal staf secara selektif. Lindungi otoritas sistem klien Anda.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative group flex-grow md:flex-grow-0">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                placeholder="Cari kredensial staf..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-16 pr-8 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-primary/30 font-bold text-sm w-full md:w-80 transition-all shadow-sm"
              />
           </div>
          <button
            onClick={() => setEditUser({ full_name: "", email: "", role: "viewer", is_active: true })}
            className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-slate-800 transition-all"
          >
            <UserPlus size={18} /> Register Agen Baru
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-10 py-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Agen / Kredensial</th>
              <th className="px-10 py-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Class (Role Basis)</th>
              <th className="px-10 py-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Aktivitas Sistem</th>
              <th className="px-10 py-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase text-right">Operasi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-bold">Memuat Matriks Enkripsi Data...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-bold">Belum ada staff terdaftar.</td></tr>
            ) : filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-slate-50 p-4 hover:bg-slate-50/50 transition-all">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-lg border border-slate-200 shadow-inner">
                      {user.full_name?.charAt(0) || <UserCircle size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-base">{user.full_name}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Mail size={10}/> {user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <span className={`px-4 py-2 rounded-full text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest w-max border
                    ${user.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20' :
                      user.role === 'editor' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    {user.role === 'admin' ? <ShieldCheck size={14} /> : user.role === 'editor' ? <Edit3 size={14} /> : <Shield size={14} />}
                    {user.role}
                  </span>
                </td>
                <td className="px-10 py-6">
                  {user.is_active ? (
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Authorized Network
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest flex items-center gap-2">
                       <ShieldAlert size={12}/> Suspended Access
                    </span>
                  )}
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Histori Ping: {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Belum Pernah Login'}</p>
                </td>
                <td className="px-10 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditUser(user)} className="p-3 text-slate-400 bg-white border border-slate-200 rounded-xl hover:border-primary hover:text-primary transition-all shadow-sm"><Edit3 size={16} /></button>
                    <button onClick={() => handleDelete(user.id, user.full_name)} className="p-3 text-slate-400 bg-white border border-slate-200 rounded-xl hover:border-rose-500 hover:text-rose-500 transition-all shadow-sm"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL PENYUNTINGAN */}
      <AnimatePresence>
        {editUser && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditUser(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 20 }} className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center"><ShieldCheck size={24}/></div>
                   <div>
                     <h3 className="text-xl font-bold tracking-tight text-slate-900">{editUser.id ? "Modifikasi Akses Sistem" : "Otorisasi Agen Baru"}</h3>
                     <p className="text-xs text-slate-400 font-medium">Sistem Penugasan RBAC Sempurna</p>
                   </div>
                </div>
                <button onClick={() => setEditUser(null)} className="p-2 text-slate-400 hover:text-slate-900 bg-white rounded-lg border border-slate-200"><X size={20} /></button>
              </div>

              <div className="p-10 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nama Lengkap Staff</label>
                  <input type="text" value={editUser.full_name} onChange={(e) => setEditUser({...editUser, full_name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-900 focus:border-primary/50" placeholder="John Doe" />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Kredensial Email (Unik)</label>
                  <input type="email" disabled={!!editUser.id} value={editUser.email} onChange={(e) => setEditUser({...editUser, email: e.target.value})} className={`w-full px-6 py-4 border border-slate-200 rounded-2xl outline-none font-bold ${editUser.id ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-50 text-slate-900 focus:border-primary/50'}`} placeholder="admin@mitralabs.id" />
                   {editUser.id && <p className="text-xs text-slate-400 font-medium pt-1">Identitas email absolut. Tidak dapat diedit menyangkut relasi basis data.</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Otoritas Kelas (Role)</label>
                    <select value={editUser.role} onChange={(e) => setEditUser({...editUser, role: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-[11px] uppercase tracking-widest text-slate-900 appearance-none cursor-pointer">
                      <option value="viewer">Viewer (Read-Only)</option>
                      <option value="editor">Editor (CMS Ops)</option>
                      <option value="admin">Superadmin (Master)</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Jalur Akses Login</label>
                    <select value={editUser.is_active ? 'active' : 'suspended'} onChange={(e) => setEditUser({...editUser, is_active: e.target.value === 'active'})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-[11px] uppercase tracking-widest text-slate-900 appearance-none cursor-pointer">
                      <option value="active">Active (Izinkan)</option>
                      <option value="suspended">Suspended (Blokir)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                <button onClick={handleSave} disabled={isSaving} className="px-10 py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 hover:opacity-90 active:scale-95 transition-all w-full justify-center shadow-lg">
                  {isSaving ? <RotateCcw size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSaving ? "Sinkronisasi Enkripsi Keamanan..." : "Terapkan Konfigurasi Penugasan"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
