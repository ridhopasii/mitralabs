"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Trash2, Copy, Check, Image as ImageIcon, Loader2 } from "lucide-react";
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
    // Save to database
    try {
      const { error } = await supabase.from("UploadedImage").insert({
        filename,
        original_name: filename.split("/").pop() || filename,
        storage_path: filename,
        public_url: url,
        file_size: 0, // We'll update this later if needed
        mime_type: "image/jpeg", // Default, can be improved
      });

      if (error) throw error;

      // Reload images
      await loadImages();
      setShowUploader(false);
    } catch (error) {
      console.error("Error saving image record:", error);
    }
  };

  const handleDelete = async (image: UploadedImage) => {
    if (!confirm(`Delete ${image.original_name}?`)) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("images")
        .remove([image.storage_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("UploadedImage")
        .delete()
        .eq("id", image.id);

      if (dbError) throw dbError;

      // Reload images
      await loadImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Media Library
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your uploaded images
          </p>
        </div>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
        >
          <Upload className="w-5 h-5" />
          Upload Image
        </button>
      </div>

      {/* Uploader */}
      {showUploader && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Upload New Image
          </h3>
          <ImageUploader onUploadSuccess={handleUploadSuccess} />
        </div>
      )}

      {/* Images Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No images yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Upload your first image to get started
          </p>
          <button
            onClick={() => setShowUploader(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 font-medium"
          >
            <Upload className="w-5 h-5" />
            Upload Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video relative bg-gray-100 dark:bg-gray-900">
                <img
                  src={image.public_url}
                  alt={image.original_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(image.public_url)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl === image.public_url ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-700" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(image)}
                    className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
                  {image.original_name}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatFileSize(image.file_size)}</span>
                  {image.width && image.height && (
                    <span>
                      {image.width} × {image.height}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {new Date(image.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
