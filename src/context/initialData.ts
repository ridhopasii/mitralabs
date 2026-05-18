import { AppData } from "./DataContext";

export const initialData: AppData = {
  navbar: {
    logo: "Mitralabs",
    links: [
      { label: "Beranda", href: "/" },
      { label: "Layanan", href: "/layanan" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Tentang", href: "/tentang" },
      { label: "Kontak", href: "/kontak" },
    ],
    buttonText: "💬 Chat Sekarang",
  },
  home: {
    hero: {
      tagline: "Jasa Website & Digital Agency",
      promo: "Promo Launching - Slot Terbatas!",
      title: "Website Profesional untuk Bisnis Kamu. Selesai 7 Hari. Harga Jelas. Tanpa Ribet.",
      subtitle: "Mitralabs.id hadir buat kamu yang capek bisnis bagus tapi tidak ada yang tahu. Kami buatkan website yang beneran kerja — bukan cuma bagus di mata, tapi menghasilkan di kantong.",
      image: "/mitralabs_hero_premium_1778227502346.png",
      stats: { label: "Project Selesai", value: "Puluhan", desc: "UMKM, Sekolah, dan Bisnis Lokal di Medan sudah dipercayakan ke kami", statusLabel: "Sistem Status", statusValue: "Aktif" }
    },
    problem: {
      title: "Kenapa Bisnis Kamu Perlu Website Sekarang?",
      subtitle: "Satu solusi untuk semua masalah ini. Website yang bekerja seperti sales 24 jam — bahkan saat kamu tidur.",
      items: [
        { id: 1, title: "😟 Bisnis Bagus, Tapi Tidak Terlihat", desc: "Pelanggan potensial cari di Google, tidak ketemu nama kamu. Yang ketemu? Saingan kamu." },
        { id: 2, title: "💸 Kehilangan Pelanggan Setiap Hari", desc: "Tanpa website, orang ragu. Mereka pikir bisnis kamu tidak serius. Uang mengalir ke yang lebih terlihat profesional." },
        { id: 3, title: "😓 Waktu Habis Jawab Chat yang Sama", desc: "\"Berapa harganya?\" \"Dimana lokasinya?\" \"Ada stok tidak?\" — pertanyaan yang sama terus diulang. Capek, kan?" },
        { id: 4, title: "📉 Saingan Sudah Online, Kamu Masih Menunggu", desc: "Setiap hari tanpa website adalah hari yang kamu hadiahkan untuk kompetitor. Mereka jalan, kamu diam." },
      ],
    },
    solution: {
      tagline: "Layanan Kami",
      title: "Solusi Website yang Bantu Bisnis Kamu Tumbuh",
      subtitle: "Kami buatkan website yang bukan cuma pajangan, tapi alat yang beneran bantu kerjaan kamu.",
      cards: {
        umkm: {
          tag: "Most Requested",
          title: "🛒 Website untuk UMKM & Toko",
          desc: "Produkmu tampil rapi, harga jelas, tombol pesan langsung ke WA. Pelanggan datang, langsung beli — tanpa bingung.",
          image: "/mitralabs_umkm_service_1778227528390.png"
        },
        travel: {
          title: "✈️ Website untuk Travel & Tour Guide",
          desc: "Paket wisata tampil keren, form booking otomatis, kalender jadwal tersedia. Klien bisa booking kapan saja, kamu tinggal konfirmasi.",
          image: "/mitralabs_travel_service_1778227548373.png"
        },
        school: {
          title: "🏫 Website untuk Sekolah & Lembaga",
          desc: "Profil sekolah profesional, info PPDB online, galeri kegiatan, dan pengumuman terstruktur. Wali murid percaya sejak pertama melihat.",
          image: "/mitralabs_school_service_1778227565941.png"
        },
        business: {
          title: "🏢 Website untuk Bisnis & Perusahaan",
          desc: "Company profile yang mencerminkan skala bisnis kamu. Tampil serius di depan klien, mitra, dan investor.",
          image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
        }
      }
    },
    process: {
      title: "Cara Kerja Kami",
      subtitle: "Proses transparan, tanpa ribet, dan selalu melibatkan kamu di setiap langkahnya.",
      steps: [
        { id: 1, title: "Langkah 1 — Ceritain Kebutuhan Kamu", desc: "Isi form brief singkat. Nama bisnis, layanan apa yang kamu jual, dan website seperti apa yang kamu bayangkan. Cuma 5 menit." },
        { id: 2, title: "Langkah 2 — Kita Sepakati Bersama", desc: "Kami kirimkan proposal + harga final. Kamu setuju, tanda tangan, bayar DP 30% — dan kita mulai." },
        { id: 3, title: "Langkah 3 — Kami Kerja, Kamu Tenang", desc: "Tim kami langsung kerjakan. Kamu update progres 2x — saat setengah jalan dan saat hampir selesai. Tidak ada kejutan." },
        { id: 4, title: "Langkah 4 — Kamu Cek, Kita Revisi", desc: "Website jadi, kamu review. Tidak puas? Ada 2x revisi gratis. Sampai kamu bilang \"ini dia yang aku mau.\"" },
        { id: 5, title: "Langkah 5 — Website Hidup, Bisnis Jalan", desc: "Lunas, akses diserahkan, website live. Garansi bug 7 hari aktif. Bisnis kamu resmi hadir di internet." },
      ],
    },
    stats: [
      { id: 1, label: "Live Projects", value: "10+", desc: "Digital Assets Live" },
      { id: 2, label: "Client Satisfaction", value: "100%", desc: "Customer Rating" },
    ],
    cta: {
      title: "Bisnis Kamu Butuh Website. Klien Kamu Butuh Alasan untuk Percaya. Kami Bantu Keduanya.",
      subtitle: "Konsultasi pertama GRATIS. Tidak ada kewajiban lanjut. Ceritakan bisnis kamu — kami siap dengarkan dan bantu carikan solusinya.",
      buttonText: "💬 Chat Sekarang — Gratis",
      promoText: "Terbatas 5 slot konsultasi per minggu.",
    },
    pricing: {
      badge: "Paket Harga",
      title: "Transparan, Terjangkau, Berkualitas",
      subtitle: "Pilih paket yang sesuai dengan kebutuhan bisnis kamu. Tidak ada biaya tersembunyi.",
    },
    faqLabels: {
      title: "Pertanyaan yang Sering Ditanyakan",
      subtitle: "Semua yang perlu Anda ketahui sebelum memulai project bersama kami.",
      badge: "FAQ",
      ctaTitle: "Masih punya pertanyaan lain?",
      ctaSubtitle: "Tim kami siap membantu Anda menemukan solusi terbaik.",
      ctaButton: "Hubungi Kami",
    },
  },
  services: {
    title: "Pilih Paket yang Pas untuk Bisnis Kamu",
    subtitle: "Tidak ada paket yang \"paling mahal = paling bagus.\" Yang ada adalah paket yang paling sesuai dengan kebutuhan kamu sekarang. Kalau masih bingung, konsultasi dulu — gratis.",
    plans: [
      {
        id: 1,
        name: "Basic",
        price: "Rp 1.500.000",
        tier: "Paket Awal",
        pages: "1 Halaman",
        duration: "3-5 Hari",
        features: ["Landing Page Modern", "Integrasi WhatsApp", "Mobile Responsive", "SSL Security"],
        missing: ["Domain & Hosting", "Sistem Booking", "Dashboard Admin"],
      },
      {
        id: 2,
        name: "Standard",
        price: "Rp 3.500.000",
        tier: "Paling Populer",
        pages: "Sampai 5 Halaman",
        duration: "7-10 Hari",
        features: ["Multi-page Website", "Dashboard Admin", "Integrasi WhatsApp", "Domain & Hosting Gratis 1 Thn", "Sistem Galeri Pro", "SEO Basic"],
        missing: ["Custom API Integrasi", "Prioritas Support 24/7"],
        highlight: true
      },
      {
        id: 3,
        name: "Premium",
        price: "Rp 7.000.000",
        tier: "Solusi Lengkap",
        pages: "Halaman Unlimited",
        duration: "14-21 Hari",
        features: ["Full Custom Website", "Sistem Booking/E-commerce", "Domain & Hosting Gratis 1 Thn", "SEO Lanjutan", "Prioritas Support", "Custom Integrasi API"],
        missing: [],
      }
    ],
    notes: ["Paket Standard & Premium sudah termasuk GRATIS Domain .com/.id selama 1 tahun.", "Garansi maintenance bug teknis selama 7 hari setelah serah terima.", "Semua harga sudah termasuk pajak. Tidak ada biaya tersembunyi."],
    comparisonTitle: "Perbandingan Lengkap Paket",
    comparisonSubtitle: "Lihat perbedaan detail antara paket kami dan tentukan mana yang paling cocok untuk bisnis kamu sekarang.",
    labels: {
      tagline: "Solusi Digital",
      comparisonTagline: "Perbandingan Detail",
      featureColumn: "Fitur",
      durationLabel: "Waktu Pengerjaan",
      pagesLabel: "Jumlah Halaman",
      investmentLabel: "Investasi",
      ctaTitle: "Siap untuk Go-Digital?",
      ctaSubtitle: "Konsultasikan kebutuhan bisnis Anda secara gratis dan dapatkan penawaran terbaik dari tim ahli kami.",
      ctaPrimary: "Konsultasi Gratis",
      ctaSecondary: "Lihat Portfolio",
    },
  },
  portfolio: {
    title: "Karya Terpilih Kami",
    subtitle: "Lihat bagaimana kami membantu berbagai industri membangun otoritas digital mereka.",
    categories: ["Semua", "UMKM", "Travel", "School", "Corporate"],
    projects: [
      {
        id: 1,
        slug: "toba-dream-travel",
        title: "Toba Dream Travel Portal",
        category: "Travel",
        image: "/mitralabs_travel_service_1778227548373.png",
        description: "Modernisasi portal wisata Danau Toba dengan sistem booking otomatis dan kalender keberangkatan.",
        challenge: "Menampilkan puluhan paket wisata dengan navigasi yang simpel namun lengkap.",
        solution: "Membangun sistem filter dinamis berbasis kategori dan destinasi wisata.",
        results: ["Peningkatan booking online sebesar 40%", "Waktu load website di bawah 2 detik"],
        status: "Completed",
        client_name: "Bpk. Andi Wijaya",
        project_date: "Januari 2024",
        live_link: "https://tobadreamtravel.com",
        tech_stack: ["Next.js", "Tailwind CSS", "Supabase"],
      },
      {
        id: 2,
        slug: "smk-penerbangan-medan",
        title: "Sistem Informasi SMK Penerbangan",
        category: "School",
        image: "/mitralabs_school_service_1778227565941.png",
        description: "Website profil sekolah yang dilengkapi sistem pendaftaran siswa baru (PPDB) terintegrasi.",
        challenge: "Mendigitalkan formulir pendaftaran yang kompleks agar mudah diakses wali murid.",
        solution: "Membangun sistem CMS khusus sekolah untuk update berita dan galeri kegiatan.",
        results: ["PPDB Online berjalan 100% digital", "Navigasi informasi lebih terstruktur"],
        status: "Completed",
        client_name: "Kepala Sekolah SMK Penerbangan",
        project_date: "Februari 2024",
        live_link: "https://smkpenerbanganmedan.sch.id",
        tech_stack: ["Next.js", "Prisma", "Supabase"],
      }
    ],
    cta: {
      title: "Mulai Project Anda",
      subtitle: "Konsultasikan kebutuhan digital Anda dengan tim ahli kami.",
      buttonText: "Hubungi Kami",
      promoText: "Gratis Konsultasi & Estimasi Biaya"
    },
    labels: {
      viewDetail: "Detail Project",
      searchPlaceholder: "Cari project...",
      emptyState: "Project tidak ditemukan",
      loadMore: "Lihat Lebih Banyak",
      tagline: "Karya Terpilih",
    },
  },
  blog: {
    title: "Insight & Strategi Digital",
    subtitle: "Pelajari bagaimana teknologi dapat mempercepat pertumbuhan bisnis Anda.",
    posts: [
      {
        id: 1,
        slug: "pentingnya-website-umkm",
        title: "Kenapa UMKM Medan Harus Punya Website di 2024?",
        excerpt: "Bukan sekadar tren, website adalah aset digital yang bekerja 24 jam untuk mendatangkan pelanggan.",
        content: "<p>Di era digital saat ini, kepercayaan adalah mata uang utama. Pelanggan cenderung mencari bisnis Anda di Google sebelum memutuskan untuk membeli...</p>",
        category: "Business",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
        date: "12 Feb 2024",
        author: "Ridho Robbi"
      },
      {
        id: 2,
        slug: "cara-meningkatkan-kepercayaan-pelanggan",
        title: "5 Cara Mudah Meningkatkan Kepercayaan Pelanggan Lewat Desain Website",
        excerpt: "Tampilan website yang profesional bisa meningkatkan konversi penjualan hingga 300%. Simak tipsnya.",
        content: "<p>Kesan pertama sangat penting. Jika website Anda terlihat berantakan atau lambat, pelanggan akan langsung meninggalkannya. Berikut adalah 5 elemen penting yang harus ada di website Anda untuk memastikan pelanggan percaya dan mau bertransaksi...</p>",
        category: "Design",
        image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&q=80&w=800",
        date: "25 Mar 2024",
        author: "Ghazy Muhalla"
      }
    ]
  },
  about: {
    hero: {
      tagline: "About Mitralabs",
      title: "Kenapa Mitralabs Ada?",
      subtitle: "Jujur — kami mulai ini karena kami lihat sendiri banyak bisnis bagus di Medan yang tidak terlihat online. Warung yang masakannya enak tapi tidak dikenal orang luar. Tourguide yang hafal setiap sudut Danau Toba tapi susah dapat klien. Sekolah yang programnya luar biasa tapi informasinya susah dicari. Semua masalah itu punya satu akar yang sama: mereka tidak punya kehadiran digital yang layak. Mitralabs lahir untuk mengubah itu. Bukan dengan jargon-jargon teknologi yang membingungkan. Tapi dengan solusi nyata, harga yang jujur, dan proses yang transparan. Kami mahasiswa yang percaya bahwa teknologi seharusnya bisa diakses semua orang — bukan hanya perusahaan besar dengan budget besar.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
    },
    stats: [
      { label: "Success Projects", value: "10+" },
      { label: "Client Satisfaction", value: "100%" }
    ],
    missionTitle: "Misi Kami",
    mission: [
      "Memberikan solusi digital yang jujur dan fungsional.",
      "Membantu UMKM dan institusi bertransformasi ke era digital tanpa ribet.",
      "Menjamin kualitas teknis tertinggi dengan harga yang masuk akal."
    ],
    visionTitle: "Visi Kami",
    vision: "Menjadi mitra teknologi pilihan utama bagi bisnis lokal di Medan yang ingin mendominasi pasar digital.",
    teamTitle: "The Minds Behind Mitralabs",
    teamSubtitle: "Kombinasi antara kreativitas visual dan ketelitian kode.",
    team: [
      { id: 1, name: "Ridho Robbi Pasi", role: "Engineer & Founder", bio: "Mahasiswa yang sudah jatuh cinta dengan dunia web development sejak SMA. Ridho yang bangun setiap baris kode di website klien Mitralabs — dari desain sampai deployment. \"Aku percaya website yang bagus bukan soal tampilan saja. Harus cepat, aman, dan beneran berguna untuk bisnis klien.\"", image: "/ridho.jpg" },
      { id: 2, name: "Ghazy Muhalla", role: "Marketing", bio: "Ghazy yang jaga komunikasi dengan klien dan mastiin setiap project berjalan sesuai ekspektasi. Dia yang jadi jembatan antara kebutuhan bisnis klien dan kemampuan teknis tim. \"Klien yang puas bukan yang websitenya bagus doang — tapi yang ngerasa didengar dan dibantu dari awal sampai akhir.\"", image: "/ghazy.jpg" },
    ],
    labels: {
      teamTagline: "Tim Ahli Kami",
      ctaTitle: "Siap Berkolaborasi?",
      ctaSubtitle: "Mari wujudkan visi digital Anda bersama tim yang berdedikasi dan berpengalaman.",
      ctaPrimary: "Mulai Project",
      ctaSecondary: "Lihat Paket",
    },
  },
  brand: {
    name: "Mitralabs",
    tagline: "Mitra Digital Bisnis Mu",
    logo: "/logo.png",
    favicon: "/favicon.ico",
    phone: "6282381118520",
    whatsapp: "6282381118520",
    email: "ridhorobbipasi@gmail.com",
    website: "www.mitralabs.web.id",
    address: "Medan, Sumatera Utara",
    city: "Medan",
    province: "Sumatera Utara",
    postalCode: "20111",
    npwp: "00.000.000.0-000.000",
    linkedin: "linkedin.com/company/mitralabs-id",
    instagram: "@mitralabs.id",
    mapsUrl: "https://maps.app.goo.gl/tkf2KxR8h9ZsskkL7",
  },
  contact: {
    title: "Ada yang Ingin Kamu Tanyakan?",
    subtitle: "Jangan ragu. Kami tidak gigit. 😄 Ceritakan bisnis kamu, layanan apa yang kamu butuhkan, dan budget yang kamu punya. Kami akan balas dalam 1x24 jam dan kasih saran yang jujur — bahkan kalau jawabannya adalah \"paket Basic sudah cukup untuk kamu.\"",
    phone: "6282381118520",
    email: "ridhorobbipasi@gmail.com",
    instagram: "@mitralabs.id",
    address: "Medan, Sumatera Utara",
    mapsUrl: "https://maps.app.goo.gl/tkf2KxR8h9ZsskkL7",
    labels: {
      tagline: "Kontak Kami",
      successTitle: "Pesan Terkirim",
      successSubtitle: "Terima kasih sudah menghubungi kami. Tim kami akan segera merespon pesan Anda.",
      sendAnother: "Kirim Pesan Lainnya",
    },
  },
  footer: {
    description: "Mitra Digital Bisnis Mu. Mitralabs.id — Medan, Indonesia.",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Contact Us", href: "/kontak" },
      { label: "Admin", href: "/admin" },
    ],
    socials: [
      { label: "Instagram", href: "https://instagram.com/mitralabs.id" },
      { label: "LinkedIn", href: "https://linkedin.com/company/mitralabs-id" },
      { label: "Designed with care in Medan, Indonesia.", href: "#designed-by" },
    ],
  },
  settings: {
    businessMode: "agresif",
    waPromoMessage: "🔥 Promo Bulan Ini! Hubungi kami sekarang untuk penawaran spesial.",
    metaTitle: "Mitralabs - Precision Web Engineering & Tech Agency",
    metaDescription: "Membangun infrastruktur digital yang tangguh, cepat, dan berfokus pada konversi untuk UMKM dan Industri.",
    metaKeywords: "jasa website, agency digital medan, software house medan, mitralabs",
    ogImage: "/mitralabs_hero_premium_1778227502346.png",
  },
  invoiceSettings: {
    companyName: "MITRALABS.WEB.ID",
    companyTagline: "Mitra Digital Bisnis Mu",
    companyAddress: "Medan",
    companyCity: "Medan",
    companyProvince: "Sumatera Utara",
    companyPostalCode: "20111",
    companyPhone: "+62 823-8111-8520",
    companyEmail: "ridhorobbipasi@gmail.com",
    companyWebsite: "www.mitralabs.web.id",
    companyNPWP: "00.000.000.0-000.000",
    companyLinkedin: "linkedin.com/company/mitralabs-id",
    companyInstagram: "@mitralabs.id",
    bankName: "Bank Central Asia (BCA)",
    bankAccountNumber: "8000-7625-12",
    bankAccountName: "Ridho Robbi Pasi",
    bankBranch: "KCP Medan Petisah",
    taxRate: 0,
    taxLabel: "PPN (11%)",
    footerNote: "Verified by Mitralabs",
    termsAndConditions: "1. Pembayaran DP 30% dilakukan sebelum proyek dimulai\n2. Pelunasan 70% dilakukan setelah website selesai dan sebelum serah terima\n3. Pembayaran dapat dilakukan melalui transfer bank\n4. Garansi bug berlaku 7 hari setelah serah terima",
    paymentInstructions: "Silakan transfer ke rekening yang tertera dan kirimkan bukti transfer ke WhatsApp kami untuk konfirmasi pembayaran.",
    signatureFields: {
      marketingName: "Ghazy Muhalla",
      marketingTitle: "Marketing",
      marketingSignature: "",
      ownerName: "Ridho Robbi Pasi",
      ownerTitle: "Engineer & Founder",
      ownerSignature: ""
    },
    stampDutyRequired: false,
    stampDutyAmount: 10000
  },
  testimonials: [
    {
      id: 1,
      name: "Kamu Berikutnya?",
      role: "Calon Klien Sukses",
      content: "Sementara kami kumpulkan testimoni nyata dari klien kami... Kamu bisa jadi yang pertama merasakannya.",
      rating: 5,
      is_published: true,
      image: "https://ui-avatars.com/api/?name=K&background=random"
    }
  ],
  faqs: [
    {
      id: 1,
      question: "Berapa lama website saya jadi?",
      answer: "Tergantung paket. Basic selesai 3 hari kerja, Standard 7 hari, Premium 14 hari — dihitung setelah DP masuk dan brief lengkap kami terima. Kami komit dengan timeline, dan selalu informasikan kalau ada kendala.",
      category: "Timeline"
    },
    {
      id: 2,
      question: "Apakah saya bisa edit sendiri nanti?",
      answer: "Ya! Semua website kami dilengkapi dashboard admin yang mudah dipakai. Ganti foto, update harga, tambah produk — bisa kamu lakukan sendiri tanpa perlu coding.",
      category: "Layanan"
    },
    {
      id: 3,
      question: "Bagaimana sistem pembayarannya?",
      answer: "DP 30% sebelum mulai, pelunasan 70% sebelum website diserahkan. Pembayaran via Dana, BSI, Mandiri, atau QRIS. Tidak ada biaya tersembunyi — semua tercantum di proposal.",
      category: "Pembayaran"
    },
    {
      id: 4,
      question: "Apakah ada garansi?",
      answer: "Ada. Garansi bug teknis 7 hari setelah serah terima. Kalau ada yang error dari sisi kami, langsung kami perbaiki tanpa biaya. Setelah masa garansi, perbaikan Rp 100.000 per sesi.",
      category: "Garansi"
    },
    {
      id: 5,
      question: "Saya tidak punya logo dan foto, apakah bisa tetap jalan?",
      answer: "Bisa. Kami bisa bantu carikan referensi desain dan menggunakan foto bebas royalti sementara. Idealnya kamu siapkan logo dan foto produk/usaha sendiri agar hasilnya lebih personal.",
      category: "Persiapan"
    },
    {
      id: 6,
      question: "Apakah bisa dicicil?",
      answer: "Saat ini sistem pembayaran kami adalah DP 30% di awal dan pelunasan 70% setelah website selesai. Belum ada cicilan, tapi harga sudah kami sesuaikan agar tetap terjangkau untuk semua ukuran bisnis.",
      category: "Pembayaran"
    }
  ],
  bookings: [
    {
      id: 1,
      customer_name: "Budi Santoso",
      customer_email: "budi@kedaikopi.com",
      customer_phone: "6281234567890",
      service_type: "UMKM Website",
      plan_name: "Standard",
      project_brief: "Saya butuh website untuk kedai kopi saya di Medan. Ingin ada menu online dan tombol WA.",
      status: "Confirmed",
      created_at: new Date().toISOString(),
      total_price: 3500000,
    }
  ],
  track: {
    title: "Dashboard Projek Anda.",
    subtitle: "Pantau progres pengerjaan proyek digital Anda secara real-time.",
    loginInstructions: "Masukkan email pesanan dan password yang Anda buat saat memesan.",
    labels: {
      secureBadge: "Secure Project Dashboard",
      emailLabel: "Email Pesanan",
      passwordLabel: "Password Projek",
      emailPlaceholder: "nama@email.com",
      submitButton: "Buka Dashboard Projek",
      helpText: "Lupa password atau butuh bantuan? Hubungi Admin",
      tabs: {
        progress: "Progress",
        assets: "Aset",
        documents: "Dokumen",
        invoices: "Kwitansi",
        chat: "Chat",
      },
      dashboard: {
        header: {
          projectNum: "Projek #",
          lastUpdate: "Update:",
          logoutTitle: "Keluar dari Dashboard",
        },
        stats: {
          status: "Status Projek",
          plan: "Paket",
          service: "Layanan",
          orderDate: "Tanggal Order",
          investment: "Total Investasi",
        },
        empty: {
          preparing: "Tim sedang mempersiapkan projek...",
        },
      },
    },
  },
  legal: {
    terms: "Mitralabs menyediakan jasa pembuatan website, pengembangan sistem informasi, dan konsultasi IT. Setiap proyek akan dikerjakan berdasarkan kesepakatan dalam SPK (Surat Perjanjian Kerja).\n\nPembayaran dilakukan dalam beberapa termin sesuai yang disepakati. Pekerjaan akan dimulai setelah Down Payment (DP) diterima. Invoice akan diterbitkan melalui sistem tracking kami.\n\nSetelah pelunasan pembayaran, hak atas kode sumber dan aset desain akan diserahkan sepenuhnya kepada klien, kecuali modul-modul pihak ketiga yang memiliki lisensi tersendiri.\n\nMitralabs tidak bertanggung jawab atas kerugian bisnis yang disebabkan oleh penggunaan website yang tidak semestinya oleh klien atau gangguan dari penyedia layanan hosting pihak ketiga.",
    privacy: "Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami saat melakukan pemesanan layanan, termasuk nama, alamat email, nomor telepon, dan detail proyek Anda.\n\nInformasi yang kami kumpulkan digunakan untuk memproses pesanan Anda, memberikan pembaruan status proyek melalui dashboard track, dan berkomunikasi dengan Anda mengenai layanan kami.\n\nKami mengimplementasikan langkah-langkah keamanan teknis yang sesuai untuk melindungi data pribadi Anda dari akses yang tidak sah, perubahan, atau penghapusan.\n\nAnda berhak untuk mengakses, memperbaiki, atau meminta penghapusan data pribadi Anda yang kami simpan di sistem kami kapan saja melalui kontak admin kami.",
    lastUpdated: "13 Mei 2026",
  },
};
