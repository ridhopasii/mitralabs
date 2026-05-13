import { supabase } from "./supabase";
// Dynamic import for browser-image-compression below

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  filename?: string;
  size?: number;
}

/**
 * Upload image to Supabase Storage with auto-compression
 */
export async function uploadImage(
  file: File,
  bucket: string = "images",
  folder: string = "uploads"
): Promise<UploadResult> {
  try {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File harus berupa gambar" };
    }

    // Compress image
    const imageCompression = (await import("browser-image-compression")).default;
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.name.split(".").pop();
    const filename = `${folder}/${timestamp}-${randomString}.${extension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, compressedFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filename);

    return {
      success: true,
      url: publicUrl,
      filename: data.path,
      size: compressedFile.size,
    };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, error: error.message || "Upload gagal" };
  }
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(
  filename: string,
  bucket: string = "images"
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filename]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Delete gagal" };
  }
}

/**
 * Get image dimensions
 */
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Validate image file
 */
export function validateImage(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File harus berupa gambar" };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: "Ukuran file maksimal 10MB" };
  }

  // Check file extension
  const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: "Format file harus JPG, PNG, GIF, atau WebP",
    };
  }

  return { valid: true };
}
