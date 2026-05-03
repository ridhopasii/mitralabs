import { 
  TrendingUp, 
  Users, 
  Eye, 
  MessageSquare,
  ArrowUpRight,
  Package,
  Calendar
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    { label: "Total Kunjungan", value: "2,543", change: "+12%", icon: Eye, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Leads Baru", value: "48", change: "+5%", icon: MessageSquare, color: "text-green-500", bg: "bg-green-50" },
    { label: "Project Aktif", value: "12", change: "+2", icon: Package, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Client Puas", value: "99%", change: "stable", icon: Users, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest p-8 rounded-3xl shadow-premium border border-surface-container-highest transition-all hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.includes('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-on-surface-variant font-bold text-sm uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-4xl font-black mt-1 tracking-tighter">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-[2rem] p-10 shadow-premium border border-surface-container-highest">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Leads Konsultasi Terbaru</h2>
            <button className="text-primary font-bold text-sm flex items-center gap-2 hover:underline">
              Lihat Semua <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-surface-container-low border border-surface-container transition-all hover:border-primary/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div>
                    <h4 className="font-bold">Client Potensial {i}</h4>
                    <p className="text-xs text-on-surface-variant">Minat: Paket Standard • 2 jam yang lalu</p>
                  </div>
                </div>
                <button className="px-5 py-2 bg-primary text-on-primary rounded-xl font-bold text-xs">
                  Hubungi WA
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Business Overview */}
        <div className="bg-inverse-surface text-inverse-on-surface rounded-[2rem] p-10 shadow-premium flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4">Mode Bisnis</h2>
            <div className="p-4 bg-primary/20 rounded-2xl border border-primary/30 mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-fixed-dim mb-1">Status Saat Ini</p>
              <p className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Mode Agresif (Open for Leads)
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-60">Avg. Response Time</span>
                <span className="font-bold text-primary-fixed-dim">15 Menit</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-60">Success Rate</span>
                <span className="font-bold text-primary-fixed-dim">84%</span>
              </div>
            </div>
          </div>
          <button className="mt-12 w-full py-4 bg-primary text-on-primary rounded-xl font-bold hover:brightness-110 transition-all">
            Ubah Pengaturan Bisnis
          </button>
        </div>
      </div>
    </div>
  );
}
