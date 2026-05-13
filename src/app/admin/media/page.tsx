"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Loader2, 
  Search, 
  Filter, 
  Plus, 
  Grid, 
  List, 
  Maximize2,
  X,
  FileImage,
  Calendar,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUploader from "@/components/admin/ImageUploader";

interface UploadedImage {
  id: number;
  filename: string;
  original_name: string;
  storage_path: string;
  public_url: string;
  file_size: number;
  mime_type: string;
  width: number | null;
  height: number | null;
  created_at: string;
}

export default function MediaPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("UploadedImage")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = async (url: string, filename: string) => {
    try {
      const { error } = await supabase.from("UploadedImage").insert({
        filename,
        original_name: filename.split("/").pop() || filename,
        storage_path: filename,
        public_url: url,
        file_size: 0,
        mime_type: "image/jpeg",
      });

      if (error) throw error;
      await loadImages();
      setShowUploader(false);
    } catch (error) {
      console.error("Error saving image record:", error);
    }
  };

  const handleDelete = async (image: UploadedImage) => {
    if (!confirm(`Delete ${image.original_name}?`)) return;

    try {
      await supabase.storage.from("images").remove([image.storage_path]);
      const { error: dbError } = await supabase.from("UploadedImage").delete().eq("id", image.id);
      if (dbError) throw dbError;
      await loadImages();
      if (selectedImage?.id === image.id) setSelectedImage(null);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredImages = images.filter(img => 
    img.original_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-24">
      {/* Header Bento Section */}
      <div className="grid lg:grid-cols-12 gap-8 px-2">
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Media Library.</h1>
          <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-xl">
            Pusat penyimpanan aset visual premium Anda. Kelola gambar, logo, dan ikon dengan efisiensi tingkat tinggi.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
             <div className="relative group flex-grow max-w-md">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari aset visual..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-100 border-none rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-slate-200 font-bold text-sm transition-all"
                />
             </div>
             <button 
               onClick={() => setShowUploader(true)}
               className="h-[56px] px-8 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-4 hover:opacity-80 active:scale-95 transition-all shadow-xl"
             >
               <Plus size={20} /> Upload Asset
             </button>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                 <FileImage size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Assets</p>
                 <p className="text-3xl font-black text-slate-900">{images.length}</p>
              </div>
           </div>
           <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between text-white overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center relative z-10">
                 <Layers size={20} />
              </div>
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Storage Status</p>
                 <p className="text-3xl font-black tracking-tight">Active</p>
              </div>
           </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center px-4">
         <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <List size={18} />
            </button>
         </div>
      </div>

      {/* Main Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-2">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="aspect-square bg-slate-100 rounded-[2.5rem] animate-pulse" />
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="py-40 text-center space-y-6 opacity-20">
          <ImageIcon size={80} strokeWidth={1} className="mx-auto" />
          <p className="font-black uppercase tracking-[0.3em] text-[12px]">Library is currently empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 px-2">
          <AnimatePresence>
            {filteredImages.map((image, i) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                layoutId={`img-${image.id}`}
                onClick={() => setSelectedImage(image)}
                className="group relative aspect-square bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer"
              >
                <img
                  src={image.public_url}
                  alt={image.original_name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                   <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30">
                      <Maximize2 size={20} />
                   </div>
                </div>
                {/* Badge Info */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight truncate">{image.original_name}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Asset Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 lg:p-20">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
            />
            <motion.div 
              layoutId={`img-${selectedImage.id}`}
              className="bg-white w-full max-w-7xl rounded-[4rem] shadow-apple-hover flex flex-col lg:flex-row overflow-hidden relative z-10 border border-white/20"
            >
              {/* Image Preview Area */}
              <div className="flex-grow bg-slate-50 flex items-center justify-center p-12 lg:p-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
                <img 
                  src={selectedImage.public_url} 
                  alt="Preview" 
                  className="relative z-10 max-h-[60vh] object-contain shadow-2xl rounded-2xl"
                />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-10 left-10 p-4 bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all z-20 shadow-xl"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Sidebar Info Area */}
              <div className="w-full lg:w-[450px] p-12 lg:p-16 border-l border-slate-100 space-y-12 shrink-0 bg-white">
                <div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight truncate uppercase">{selectedImage.original_name}</h3>
                   <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mt-2">Visual Asset Registry</p>
                </div>

                <div className="space-y-6">
                   {[
                     { label: "File Type", value: selectedImage.mime_type, icon: FileImage },
                     { label: "Created At", value: new Date(selectedImage.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), icon: Calendar },
                     { label: "Dimensions", value: "Auto-Optimized", icon: Layers }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400">
                           <item.icon size={18} />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                           <p className="text-sm font-bold text-slate-900">{item.value}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => handleCopyUrl(selectedImage.public_url)}
                    className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 hover:opacity-80 active:scale-95 transition-all shadow-xl"
                  >
                    {copiedUrl === selectedImage.public_url ? <Check size={20} /> : <Copy size={20} />}
                    {copiedUrl === selectedImage.public_url ? "URL Copied!" : "Copy Public Link"}
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedImage)}
                    className="w-full py-6 bg-rose-50 text-rose-500 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 size={20} /> Delete from Storage
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Uploader Modal */}
      <AnimatePresence>
        {showUploader && (
          <div className="fixed inset-0 z-[700] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploader(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white w-full max-w-2xl rounded-[4rem] p-12 lg:p-20 shadow-2xl relative z-10 border border-slate-100"
            >
              <div className="flex justify-between items-center mb-12">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                       <Upload size={28} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 uppercase">Upload Engine.</h3>
                       <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-1">Multi-format support</p>
                    </div>
                 </div>
                 <button onClick={() => setShowUploader(false)} className="p-4 text-slate-400 hover:text-slate-900 transition-all">
                    <X size={24} />
                 </button>
              </div>
              <ImageUploader onUploadSuccess={handleUploadSuccess} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
