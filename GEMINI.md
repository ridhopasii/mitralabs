# Mitralabs Project Instructions

## Rencana Implementasi Fitur Digital Approval & Workflow Otomatisasi (CRM)

Dokumen ini merinci rencana untuk mengimplementasikan fitur **Digital Approval (1.3)** dan **Otomatisasi Administrasi & CRM (3)** pada proyek Mitralabs.

### Objektif
1. **Digital Approval**: Memungkinkan klien menyetujui setiap milestone/update proyek langsung dari dashboard pelacakan, yang akan memicu pembuatan dokumen formal jika diperlukan.
2. **Workflow & CRM**:
    - **Kanban Board**: Mengelola data `Booking` (leads) dalam tampilan Kanban di dashboard Admin.
    - **Auto Doc Gen**: Secara otomatis menghasilkan dokumen SPK dan Proposal (PDF) saat klien mengisi form pemesanan.

### Perubahan Kode & File

#### 1. Database (Prisma)
- **File**: `prisma/schema.prisma`
- **Perubahan**:
    - Tambahkan field `is_approved` (Boolean, default: false) dan `approved_at` (DateTime, optional) ke model `ProjectUpdate`.
    - Tambahkan field `spk_url` dan `proposal_url` (String, optional) ke model `Booking` untuk menyimpan link dokumen yang di-generate.
    - Status: **TERIMPLEMENTASI**

#### 2. Digital Approval (Per-Milestone)
- **Backend API**:
    - Route `src/app/api/projects/updates/[id]/approve/route.ts` menangani aksi approval oleh klien.
- **Frontend (Client Tracking)**:
    - **File**: `src/app/track/page.tsx`
    - Menambahkan UI tombol "Setujui Update" pada setiap list item `ProjectUpdate`.
    - Menampilkan status "Approved ✅" dengan timestamp jika sudah disetujui.
    - Status: **TERIMPLEMENTASI**

#### 3. Workflow Otomatisasi (Document Generation)
- **Komponen PDF**:
    - `src/components/ProposalPDFGenerator.tsx`
    - `src/components/SPKPDFGenerator.tsx`
- **Integrasi Form Pemesanan**:
    - **File**: `src/app/pesan-sekarang/page.tsx`
    - Trigger `generateAndUploadDocs` setelah data `Booking` berhasil disimpan.
    - File Proposal dan SPK otomatis diunggah ke Supabase Storage.
    - Status: **TERIMPLEMENTASI**

#### 4. CRM Ringan (Kanban Board)
- **Halaman Admin**:
    - **File**: `src/app/admin/crm/page.tsx`
    - Implementasi Kanban Board untuk manajemen pipeline.
    - Kolom status: `Pending` (Leads), `Proposal`, `Contract`, `Active` (Proyek Berjalan), `Done`.
    - Status: **TERIMPLEMENTASI**

### Langkah Verifikasi & Testing
1. **Pemesanan Baru**: Isi form di `/pesan-sekarang` dan pastikan file SPK/Proposal ter-generate.
2. **CRM Check**: Buka `/admin/crm`, pastikan data booking masuk ke kolom `Pending` dan bisa dipindahkan antar kolom.
3. **Approval Test**: Buka dashboard pelacakan sebagai klien, klik "Setujui Update" pada salah satu progress, dan pastikan status berubah di dashboard admin maupun klien.

### Strategi Rollback
- Jika terjadi error pada database, lakukan `prisma migrate resolve` atau revert ke schema sebelumnya.
- Fitur PDF menggunakan `jspdf` di sisi klien, sehingga tidak membebani server.
