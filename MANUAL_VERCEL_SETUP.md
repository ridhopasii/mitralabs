# 📝 Manual Setup Environment Variables di Vercel

Karena Vercel CLI memerlukan input interaktif, lebih mudah setup via **Vercel Dashboard**.

---

## 🌐 **Setup Via Vercel Dashboard (RECOMMENDED)**

### **Step 1: Buka Vercel Dashboard**
1. Buka browser: https://vercel.com/dashboard
2. Login dengan akun Anda
3. Pilih project: **mitralabs-web**

### **Step 2: Masuk ke Environment Variables**
1. Klik tab **Settings** (di atas)
2. Klik **Environment Variables** (di sidebar kiri)

### **Step 3: Tambahkan Variables Satu Per Satu**

Klik tombol **"Add New"** untuk setiap variable berikut:

---

#### **Variable 1: NEXT_PUBLIC_SUPABASE_URL**

```
Name: NEXT_PUBLIC_SUPABASE_URL

Value: https://ztzicspqnvfpbnvhwilo.supabase.co

Environment:
☑ Production
☑ Preview
☑ Development

[Save]
```

---

#### **Variable 2: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY**

```
Name: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

Value: sb_publishable_aiRP-bNzsRmfBl9gV-ttPg_odY_PqiI

Environment:
☑ Production
☑ Preview
☑ Development

[Save]
```

---

#### **Variable 3: DATABASE_URL**

```
Name: DATABASE_URL

Value: postgresql://postgres.ztzicspqnvfpbnvhwilo:astaghfirullah@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

Environment:
☑ Production
☑ Preview
☑ Development

[Save]
```

---

#### **Variable 4: DIRECT_URL**

```
Name: DIRECT_URL

Value: postgresql://postgres.ztzicspqnvfpbnvhwilo:astaghfirullah@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres

Environment:
☑ Production
☑ Preview
☑ Development

[Save]
```

---

#### **Variable 5: NEXT_PUBLIC_APP_URL** ✅ (Sudah ditambahkan)

```
Name: NEXT_PUBLIC_APP_URL
Value: https://mitralabs-web.vercel.app
Environment: Production only
Status: ✅ Already added
```

---

#### **Variable 6: NODE_ENV** ✅ (Sudah ditambahkan)

```
Name: NODE_ENV
Value: production
Environment: Production only
Status: ✅ Already added
```

---

### **Step 4: Verifikasi**

Setelah menambahkan semua variables, Anda akan melihat:

```
Environment Variables (6)

✅ NEXT_PUBLIC_SUPABASE_URL          Production, Preview, Development
✅ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  Production, Preview, Development
✅ DATABASE_URL                      Production, Preview, Development
✅ DIRECT_URL                        Production, Preview, Development
✅ NEXT_PUBLIC_APP_URL               Production
✅ NODE_ENV                          Production
```

---

### **Step 5: Redeploy**

Setelah semua variables ditambahkan:

**Option A: Via Dashboard**
1. Klik tab **Deployments**
2. Klik **...** (three dots) pada deployment terbaru
3. Klik **Redeploy**
4. Tunggu build selesai (~45 detik)

**Option B: Via CLI**
```powershell
vercel --prod
```

---

## ✅ **Checklist**

Centang setelah selesai:

- [ ] Variable 1: NEXT_PUBLIC_SUPABASE_URL (Production, Preview, Development)
- [ ] Variable 2: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (Production, Preview, Development)
- [ ] Variable 3: DATABASE_URL (Production, Preview, Development)
- [ ] Variable 4: DIRECT_URL (Production, Preview, Development)
- [x] Variable 5: NEXT_PUBLIC_APP_URL (Production) ✅
- [x] Variable 6: NODE_ENV (Production) ✅
- [ ] Redeploy website
- [ ] Test website: https://mitralabs-web.vercel.app

---

## 🧪 **Testing Setelah Deploy**

### **1. Test Homepage**
```
https://mitralabs-web.vercel.app
```
Harus load tanpa error

### **2. Test Health Check**
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

### **3. Test Admin Login**
```
https://mitralabs-web.vercel.app/login
```
Harus bisa buka halaman login

---

## 📸 **Screenshot Reference**

### **Tampilan Environment Variables Page:**

```
┌─────────────────────────────────────────────────────────┐
│ Settings > Environment Variables                        │
├─────────────────────────────────────────────────────────┤
│                                          [Add New]       │
│                                                          │
│ NEXT_PUBLIC_SUPABASE_URL                                │
│ Production, Preview, Development                         │
│ https://ztzicspqnvfpbnvhwilo.supabase.co               │
│ [Edit] [Remove]                                         │
│                                                          │
│ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY                    │
│ Production, Preview, Development                         │
│ sb_publishable_aiRP-bNzsRmfBl9gV-ttPg_odY_PqiI         │
│ [Edit] [Remove]                                         │
│                                                          │
│ DATABASE_URL                                            │
│ Production, Preview, Development                         │
│ postgresql://postgres.ztzicspqnvfpbnvhwilo:***         │
│ [Edit] [Remove]                                         │
│                                                          │
│ ... (dan seterusnya)                                    │
└─────────────────────────────────────────────────────────┘
```

---

## ⚠️ **Troubleshooting**

### **Problem: Variable tidak muncul setelah Save**
**Solution**:
- Refresh halaman browser
- Pastikan tidak ada error saat Save
- Cek apakah environment sudah dipilih

### **Problem: Build error setelah redeploy**
**Solution**:
- Cek build logs di Deployments tab
- Pastikan semua 6 variables sudah ditambahkan
- Pastikan tidak ada typo di nama variable (case-sensitive!)

### **Problem: Database connection error**
**Solution**:
- Pastikan DATABASE_URL dan DIRECT_URL sudah benar
- Cek password: `astaghfirullah`
- Pastikan Supabase database aktif

---

## 🎯 **Quick Reference**

### **Variables yang SUDAH ditambahkan:**
- ✅ NEXT_PUBLIC_APP_URL (Production)
- ✅ NODE_ENV (Production)

### **Variables yang PERLU ditambahkan:**
- ⏳ NEXT_PUBLIC_SUPABASE_URL (Production, Preview, Development)
- ⏳ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (Production, Preview, Development)
- ⏳ DATABASE_URL (Production, Preview, Development)
- ⏳ DIRECT_URL (Production, Preview, Development)

---

## 📞 **Need Help?**

Jika masih ada masalah:
1. Screenshot error yang muncul
2. Cek Vercel build logs
3. Contact: hello@mitralabs.id

---

**Estimated Time**: 5-10 menit
**Difficulty**: Easy ⭐⭐☆☆☆
