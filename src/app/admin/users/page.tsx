"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Shield, 
  ShieldCheck, 
  User as UserIcon, 
  Search, 
  MoreVertical, 
  Mail, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Loader2,
  RefreshCcw
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    full_name: "",
    role: "staff"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("User")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // For now, we just create the User record. 
      // The person will still need to sign up/login via Supabase Auth with this email.
      const { error } = await supabase.from("User").insert([newUser]);
      if (error) throw error;
      
      setUsers([{ ...newUser, id: Math.random().toString(), created_at: new Date().toISOString(), is_active: true }, ...users]);
      setIsAddingUser(false);
      setNewUser({ email: "", full_name: "", role: "staff" });
    } catch (error: any) {
      alert("Gagal menambah user: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("User")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Gagal memperbarui role.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-900/10">
            <Users size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">User & Staff Management</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-0.5">Control Access & Permissions</p>
          </div>
        </div>

        <button 
          onClick={() => setIsAddingUser(true)}
          className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
        >
          <UserPlus size={16} /> Add New User/Staff
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-200/60 shadow-sm flex items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-4 bg-slate-50 border-none rounded-2xl outline-none font-semibold text-sm focus:bg-white transition-all"
          />
        </div>
        <button 
          onClick={fetchUsers}
          className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-10 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">User Profile</th>
              <th className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Access Role</th>
              <th className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Joined</th>
              <th className="px-10 py-6 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <Loader2 className="w-8 h-8 text-slate-200 animate-spin mx-auto mb-4" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Synchronizing Directory...</p>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <p className="text-slate-400 font-bold text-sm italic">No users found in this sector.</p>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 text-sm overflow-hidden">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          user.full_name?.charAt(0) || "U"
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 leading-none mb-1.5">{user.full_name || "Unknown User"}</p>
                        <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 italic">
                          <Mail size={12} className="opacity-60" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <RoleBadge role={user.role} />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${user.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {user.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={12} />
                      <span className="text-[11px] font-bold">{new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="p-2.5 text-slate-300 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingUser(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-slate-100 flex flex-col items-center text-center">
                 <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 text-slate-900">
                   <UserPlus size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Create New User</h3>
                 <p className="text-sm font-medium text-slate-400">Add a member to your organization manually</p>
              </div>

              <form onSubmit={handleAddUser} className="p-10 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={newUser.full_name}
                      onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-100" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-100" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Initial Role</label>
                    <select 
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:bg-white transition-all ring-1 ring-transparent focus:ring-slate-100 appearance-none cursor-pointer"
                    >
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : "Save User Data"}
                </button>
                
                <button 
                  type="button"
                  onClick={() => setIsAddingUser(false)}
                  className="w-full py-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-900 transition-all"
                >
                  Cancel
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Role Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-slate-100 flex flex-col items-center text-center">
                 <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 text-slate-900">
                   <Shield size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Update User Access</h3>
                 <p className="text-sm font-medium text-slate-400">Select the permission level for <span className="text-slate-900 font-bold">{editingUser.full_name}</span></p>
              </div>

              <div className="p-10 space-y-3">
                {["admin", "staff", "viewer"].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleUpdateRole(editingUser.id, role)}
                    className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all group ${
                      editingUser.role === role 
                        ? 'border-slate-900 bg-slate-900 text-white' 
                        : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${editingUser.role === role ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                        {role === 'admin' ? <ShieldCheck size={18} /> : role === 'staff' ? <UserIcon size={18} /> : <Clock size={18} />}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm uppercase tracking-widest">{role}</p>
                        <p className={`text-[10px] font-medium opacity-60 ${editingUser.role === role ? 'text-white' : 'text-slate-400'}`}>
                          {role === 'admin' ? 'Full system control' : role === 'staff' ? 'Manage orders & content' : 'Read-only access'}
                        </p>
                      </div>
                    </div>
                    {editingUser.role === role && <CheckCircle2 size={18} />}
                  </button>
                ))}
              </div>

              <div className="p-10 pt-0">
                <button 
                  onClick={() => setEditingUser(null)}
                  className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-all"
                >
                  Cancel & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const config: any = {
    admin: { icon: ShieldCheck, color: "text-emerald-500 bg-emerald-500/5", label: "Admin" },
    staff: { icon: Shield, color: "text-blue-500 bg-blue-500/5", label: "Staff" },
    viewer: { icon: Clock, color: "text-slate-400 bg-slate-400/5", label: "Viewer" },
  };

  const { icon: Icon, color, label } = config[role] || config.viewer;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${color}`}>
      <Icon size={12} strokeWidth={2.5} />
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </div>
  );
}
