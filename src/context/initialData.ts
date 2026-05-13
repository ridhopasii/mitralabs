import { AppData } from "./DataContext";

export const initialData: AppData = {
  navbar: {
    logo: "Mitralabs",
    links: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/layanan" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "About", href: "/tentang" },
      { label: "Contact", href: "/kontak" },
    ],
    buttonText: "Pesan Sekarang",
  },
  home: {
    hero: {
      tagline: "Precision Tech Agency",
      promo: "Special Launch Promo",
      title: "Solusi Digital Presisi Untuk Bisnis Anda.",
      subtitle: "Kami membangun infrastruktur digital yang tangguh untuk UMKM, Institusi Pendidikan, dan Industri Pariwisata. Fokus kami adalah fungsionalitas, kecepatan, dan konversi nyata.",
      image: "/mitralabs_hero_premium_1778227502346.png",
      stats: { label: "Success Projects", value: "240+", statusLabel: "Sistem Status", statusValue: "Aktif" }
    },
    problem: {
      title: "Masalah Umum Bisnis di Era Digital",
      subtitle: "Banyak bisnis kehilangan momentum karena infrastruktur digital yang dikelola secara amatir.",
      items: [
        { id: 1, title: "Kehilangan Trust", desc: "Calon klien ragu bertransaksi karena website terlihat ketinggalan zaman atau tidak aman." },
        { id: 2, title: "Konversi Rendah", desc: "Website hanya jadi pajangan tanpa sistem yang memudahkan pelanggan untuk membeli atau memesan." },
      ],
    },
    solution: {
      tagline: "Our Expertise",
      title: "Arsitektur Digital yang Menghasilkan Pertumbuhan",
      subtitle: "Setiap baris kode yang kami tulis bertujuan untuk memecahkan masalah spesifik di industri Anda.",
      cards: {
        umkm: {
          tag: "Most Requested",
          title: "Sistem Web UMKM",
          desc: "Integrasi WhatsApp, katalog produk dinamis, dan dashboard simpel untuk manajemen stok dan pesanan harian.",
          image: "/mitralabs_umkm_service_1778227528390.png"
        },
        travel: {
          title: "Portal Travel & Tour",
          desc: "Sistem manajemen paket wisata, kalender keberangkatan otomatis, dan formulir booking yang terintegrasi.",
          image: "/mitralabs_travel_service_1778227548373.png"
        },
        school: {
          title: "Platform Akademik",
          desc: "Pusat informasi sekolah, sistem PPDB Online, dan manajemen konten berita sekolah yang terstruktur.",
          image: "/mitralabs_school_service_1778227565941.png"
        },
        business: {
          title: "Corporate Identity",
          desc: "Company profile tingkat tinggi yang mencerminkan otoritas dan profesionalisme brand Anda di pasar global.",
          image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
        }
      }
    },
    process: {
      title: "Standard Operational Procedure",
      subtitle: "Kami bekerja dengan transparansi penuh untuk memastikan setiap ekspektasi Anda terpenuhi melampaui standar.",
      steps: [
        { id: 1, title: "Technical Onboarding", desc: "Pendalaman brief melalui form onboarding strategis untuk memetakan target audiens dan kompetitor." },
        { id: 2, title: "Agreement & Kickoff", desc: "Finalisasi kontrak, pembayaran DP 30%, dan penyusunan timeline pengerjaan yang ketat." },
        { id: 3, title: "Sprints & Updates", desc: "Proses development modular dengan laporan progres mingguan melalui grup koordinasi khusus." },
        { id: 4, title: "Quality Assurance", desc: "Pengujian performa (speed test), keamanan, dan responsivitas di berbagai perangkat." },
        { id: 5, title: "Handover & Warranty", desc: "Aktivasi website, serah terima aset, dan masa garansi bug untuk ketenangan pikiran Anda." },
      ],
    },
    stats: [
      { id: 1, label: "Live Projects", value: "240+", desc: "Digital Assets Live" },
      { id: 2, label: "Client Satisfaction", value: "4.9/5", desc: "Customer Rating" },
    ],
    cta: {
      title: "Siap Mewujudkan Visi Digital Anda?",
      subtitle: "Mari berkolaborasi membangun infrastruktur digital yang tangguh dan berorientasi pada hasil.",
      buttonText: "Jadwalkan Konsultasi Gratis",
      promoText: "Sesi Strategi Digital Gratis (Terbatas untuk 5 Klien/Bulan)",
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
    title: "Investasi Strategis Untuk Bisnis Anda",
    subtitle: "Kami menawarkan paket layanan yang fleksibel namun tetap mengedepankan kualitas teknis terbaik di kelasnya.",
    plans: [
      {
        id: 1,
        name: "Basic",
        price: "Rp 1.500.000",
        tier: "Essential",
        pages: "1 Halaman",
        duration: "3-5 Hari",
        features: ["Landing Page Modern", "Integrasi WhatsApp", "Domain & Hosting (1 Thn)", "Mobile Responsive", "SSL Security"],
        missing: ["Sistem Booking", "Dashboard Admin", "Custom Features"],
      },
      {
        id: 2,
        name: "Standard",
        price: "Rp 3.500.000",
        tier: "Professional",
        pages: "Sampai 5 Halaman",
        duration: "7-10 Hari",
        features: ["Multi-page Website", "Dashboard Admin", "Integrasi WhatsApp", "Sistem Galeri Pro", "SEO Basic", "Laporan Bulanan"],
        missing: ["Custom API Integrasi", "Prioritas Support 24/7"],
        highlight: true
      },
      {
        id: 3,
        name: "Premium",
        price: "Rp 7.000.000",
        tier: "Enterprise",
        pages: "Halaman Unlimited",
        duration: "14-21 Hari",
        features: ["Full Custom Website", "Sistem Booking/E-commerce", "High-End SEO", "Prioritas Support", "Custom Integrasi API", "Manual Book"],
        missing: [],
      }
    ],
    notes: ["Semua paket sudah termasuk GRATIS Domain .com/.id selama 1 tahun.", "Garansi maintenance bug selama 3 bulan pertama."],
    comparisonTitle: "Head-to-Head Comparison",
    comparisonSubtitle: "Lihat perbedaan mendetail antara paket layanan kami untuk menentukan pilihan terbaik bagi bisnis Anda.",
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
    categories: ["All", "UMKM", "Travel", "School", "Corporate"],
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
      buttonText: "Hubungi Kami"
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
      }
    ]
  },
  about: {
    hero: {
      tagline: "About Mitralabs",
      title: "Membangun Standar Baru Presisi Digital",
      subtitle: "Mitralabs lahir dari kebutuhan akan solusi teknologi yang tidak hanya estetis, tetapi juga tangguh secara teknis.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
    },
    stats: [
      { label: "Success Projects", value: "240+" },
      { label: "Client Satisfaction", value: "99%" }
    ],
    missionTitle: "Misi Kami",
    mission: [
      "Memberikan solusi digital yang presisi dan fungsional.",
      "Membantu UMKM dan institusi bertransformasi ke era digital.",
      "Menjamin kualitas teknis tertinggi dalam setiap baris kode."
    ],
    visionTitle: "Visi Kami",
    vision: "Menjadi mitra teknologi pilihan utama bagi bisnis yang ingin mendominasi pasar digital melalui presisi teknik dan desain.",
    teamTitle: "The Minds Behind Mitralabs",
    teamSubtitle: "Kombinasi antara kreativitas visual dan ketelitian kode.",
    team: [
      { id: 1, name: "Ridho Robbi", role: "CEO & Tech Lead", bio: "Fokus pada arsitektur sistem dan strategi pertumbuhan digital.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" },
      { id: 2, name: "Ghazy Muhalla", role: "Head of Operations", bio: "Memastikan setiap project berjalan tepat waktu dengan standar QA tertinggi.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
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
    tagline: "Precision Web Engineering",
    logo: "/logo.png",
    favicon: "/favicon.ico",
    phone: "6282381118520",
    whatsapp: "6282381118520",
    email: "contact@mitralabs.web.id",
    website: "www.mitralabs.web.id",
    address: "Jl. Contoh No. 123",
    city: "Medan",
    province: "Sumatera Utara",
    postalCode: "20111",
    npwp: "00.000.000.0-000.000",
    linkedin: "linkedin.com/company/mitralabs-id",
    instagram: "@mitralabs.id",
    mapsUrl: "https://maps.google.com/?q=Medan",
  },
  contact: {
    title: "Hubungi Kami",
    subtitle: "Siap mendiskusikan project Anda? Tim kami siap membantu 24/7.",
    phone: "6282381118520",
    email: "contact@mitralabs.web.id",
    instagram: "@mitralabs.id",
    address: "Medan, Sumatera Utara, Indonesia",
    mapsUrl: "https://maps.google.com/?q=Medan",
    labels: {
      tagline: "Kontak Kami",
      successTitle: "Pesan Terkirim",
      successSubtitle: "Terima kasih sudah menghubungi kami. Tim kami akan segera merespon pesan Anda.",
      sendAnother: "Kirim Pesan Lainnya",
    },
  },
  footer: {
    description: "Technical precision in every pixel.",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Contact Us", href: "/kontak" },
      { label: "Admin", href: "/admin" },
    ],
    socials: [
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "GitHub", href: "https://github.com" },
      { label: "Designed with precision in Medan, Indonesia.", href: "#designed-by" },
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
    companyTagline: "Precision Web Engineering",
    companyAddress: "Jl. Contoh No. 123",
    companyCity: "Medan",
    companyProvince: "Sumatera Utara",
    companyPostalCode: "20111",
    companyPhone: "+62 823-8111-8520",
    companyEmail: "contact@mitralabs.web.id",
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
    footerNote: "Verified by Mitralabs Cryptographic Protocol",
    termsAndConditions: "1. Pembayaran dilakukan maksimal 7 hari setelah invoice diterbitkan\n2. Pembayaran dapat dilakukan melalui transfer bank\n3. Konfirmasi pembayaran wajib disertai bukti transfer\n4. Garansi bug berlaku 3 bulan setelah serah terima",
    paymentInstructions: "Silakan transfer ke rekening yang tertera dan kirimkan bukti transfer ke WhatsApp kami untuk konfirmasi pembayaran.",
    signatureFields: {
      marketingName: "Ghazy Muhalla",
      marketingTitle: "Marketing Officer",
      marketingSignature: "",
      ownerName: "Ridho Robbi Pasi",
      ownerTitle: "Direktur Utama",
      ownerSignature: ""
    },
    stampDutyRequired: false,
    stampDutyAmount: 10000
  },
  testimonials: [
    {
      id: 1,
      name: "Andi Wijaya",
      role: "CEO Toba Dream",
      content: "Mitralabs membantu kami membangun sistem yang sangat efisien. Performa website luar biasa.",
      rating: 5,
      is_published: true,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
    }
  ],
  faqs: [
    {
      id: 1,
      question: "Apa saja yang perlu saya siapkan?",
      answer: "Anda hanya perlu menyiapkan Logo, foto produk/bisnis, dan rincian layanan Anda. Selebihnya akan kami bantu susun.",
      category: "Persiapan"
    },
    {
      id: 2,
      question: "Apakah website bisa saya edit sendiri nanti?",
      answer: "Tentu! Kami menyediakan Dashboard Admin yang sangat mudah digunakan bahkan bagi Anda yang tidak paham IT.",
      category: "Layanan"
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
