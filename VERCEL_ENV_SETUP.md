# 🔧 Setup Environment Variables di Vercel

Panduan lengkap untuk setup environment variables di Vercel Dashboard.

---

## 📋 **Daftar Environment Variables**

### **1. NEXT_PUBLIC_SUPABASE_URL**
```
https://ztzicspqnvfpbnvhwilo.supabase.co
```
- **Environment**: Production, Preview, Development
- **Deskripsi**: URL Supabase project

---

### **2. NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY**
```
sb_publishable_aiRP-bNzsRmfBl9gV-ttPg_odY_PqiI
```
- **Environment**: Production, Preview, Development
- **Deskripsi**: Supabase publishable key (public, aman untuk client-side)

---

### **3. DATABASE_URL**
```
postgresql://postgres.ztzicspqnvfpbnvhwilo:astaghfirullah@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```
- **Environment**: Production, Preview, Development
- **Deskripsi**: Database connection URL dengan pooling (untuk Prisma)

---

### **4. DIRECT_URL**
```
postgresql://postgres.ztzicspqnvfpbnvhwilo:astaghfirullah@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```
- **Environment**: Production, Preview, Development
- **Deskripsi**: Direct database connection (untuk migrations)

---

### **5. NEXT_PUBLIC_APP_URL** (Production)
```
https://mitralabs-web.vercel.app
```
- **Environment**: Production only
- **Deskripsi**: URL production website

---

### **6. NODE_ENV** (Production)
```
production
```
- **Environment**: Production only
- **Deskripsi**: Node environment

---

### **7. NEXT_PUBLIC_HCAPTCHA_SITE_KEY** (Optional)
```
your_hcaptcha_site_key
```
- **Environment**: Production, Preview, Development
- **Deskripsi**: hCaptcha site key untuk anti-spam
- **Cara dapat**: Daftar gratis di https://www.hcaptcha.com/

---

### **8. HCAPTCHA_SECRET_KEY** (Optional)
```
your_hcaptcha_secret_key
```
- **Environment**: Production, Preview, Development
- **Deskripsi**: hCaptcha secret key (server-side)
- **Cara dapat**: Daftar gratis di https://www.hcaptcha.com/

---

## 🚀 **Cara Setup di Vercel Dashboard**

### **Step-by-Step:**

1. **Buka Vercel Dashboard**
   - Go to: https://vercel.com/dashboard
   - Pilih project: **mitralabs-web**

2. **Masuk ke Settings**
   - Klik tab **Settings** di atas
   - Klik **Environment Variables** di sidebar kiri

3. **Tambahkan Variable**
   - Klik tombol **Add New**
   - Isi **Name** (nama variable)
   - Isi **Value** (nilai dari list di atas)
   - Pilih **Environment** (Production, Preview, Development)
   - Klik **Save**

4. **Ulangi untuk Semua Variables**
   - Tambahkan semua 8 variables di atas
   - Pastikan environment yang dipilih sesuai

5. **Redeploy**
   - Setelah semua variables ditambahkan
   - Klik **Deployments** tab
   - Klik **...** (three dots) pada deployment terbaru
   - Klik **Redeploy**
   - Atau jalankan: `vercel --prod` di terminal

---

## 📸 **Screenshot Guide**

### **1. Buka Environment Variables**
```
Dashboard → mitralabs-web → Settings → Environment Variables
```

### **2. Klik "Add New"**
```
[Add New] button di kanan atas
```

### **3. Isi Form**
```
┌─────────────────────────────────────────┐
│ Name:  NEXT_PUBLIC_SUPABASE_URL         │
│                                         │
│ Value: https://ztzicspqnvfpbnvhwilo... │
│                                         │
│ Environment:                            │
│ ☑ Production                            │
│ ☑ Preview                               │
│ ☑ Development                           │
│                                         │
│ [Cancel]  [Save]                        │
└─────────────────────────────────────────┘
```

---

## ✅ **Checklist Setup**

Centang setelah selesai menambahkan:

- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- [ ] DATABASE_URL
- [ ] DIRECT_URL
- [ ] NEXT_PUBLIC_APP_URL (Production)
- [ ] NODE_ENV (Production)
- [ ] NEXT_PUBLIC_HCAPTCHA_SITE_KEY (Optional)
- [ ] HCAPTCHA_SECRET_KEY (Optional)
- [ ] Redeploy website

---

## 🔍 **Cara Verifikasi**

Setelah setup dan redeploy:

1. **Cek Build Logs**
   ```
   Vercel Dashboard → Deployments → Latest → View Function Logs
   ```

2. **Test Website**
   ```
   https://mitralabs-web.vercel.app
   ```

3. **Test Database Connection**
   ```
   https://mitralabs-web.vercel.app/api/health
   ```

   Response yang benar:
   ```json
   {
     "status": "healthy",
     "checks": {
       "database": "ok",
       "api": "ok"
     }
   }
   ```

4. **Test Admin Login**
   ```
   https://mitralabs-web.vercel.app/login
   ```

---

## ⚠️ **Troubleshooting**

### **Error: "Supabase client not initialized"**
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` sudah ditambahkan
- Pastikan environment dipilih: Production, Preview, Development
- Redeploy website

### **Error: "Database connection failed"**
- Pastikan `DATABASE_URL` dan `DIRECT_URL` sudah ditambahkan
- Cek password di connection string: `astaghfirullah`
- Pastikan Supabase database aktif

### **Error: "Environment variable not found"**
- Pastikan nama variable **PERSIS SAMA** (case-sensitive)
- Pastikan tidak ada spasi di awal/akhir value
- Redeploy setelah menambahkan variable

---

## 🎯 **Quick Copy-Paste**

Untuk copy-paste cepat ke Vercel:

```bash
# 1. NEXT_PUBLIC_SUPABASE_URL
https://ztzicspqnvfpbnvhwilo.supabase.co

# 2. NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
sb_publishable_aiRP-bNzsRmfBl9gV-ttPg_odY_PqiI

# 3. DATABASE_URL
postgresql://postgres.ztzicspqnvfpbnvhwilo:astaghfirullah@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# 4. DIRECT_URL
postgresql://postgres.ztzicspqnvfpbnvhwilo:astaghfirullah@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres

# 5. NEXT_PUBLIC_APP_URL (Production only)
https://mitralabs-web.vercel.app

# 6. NODE_ENV (Production only)
production
```

---

## 📞 **Butuh Bantuan?**

Jika ada masalah:
1. Cek dokumentasi Vercel: https://vercel.com/docs/environment-variables
2. Cek Supabase docs: https://supabase.com/docs
3. Contact: hello@mitralabs.id

---

**Last Updated**: December 2024
**Version**: 1.0.0
