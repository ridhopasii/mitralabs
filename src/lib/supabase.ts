import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-to-avoid-crash.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder'

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
         !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
}

import imageCompression from 'browser-image-compression';

// Helper to upload image and return public URL
export const uploadImage = async (file: File) => {
  if (!isSupabaseConfigured()) return null;

  try {
    // 1. Compress Image
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    const compressedFile = await imageCompression(file, options);

    // 2. Upload
    const fileExt = compressedFile.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from('site-assets')
      .upload(filePath, compressedFile);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('site-assets')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    console.error("Critical Upload failure:", err);
    return null;
  }
}

export const logActivity = async (action: string, detail: string) => {
  try {
    const { error } = await supabase
      .from('AdminLog')
      .insert([{ action, detail, created_at: new Date().toISOString() }]);
    if (error) console.error("Logging error:", error);
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}
