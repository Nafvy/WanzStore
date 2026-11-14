const categories = [
  { icon: "◎", name: "Instagram", detail: "Followers · Likes · Views", color: "from-pink-500/20 to-orange-500/10" },
  { icon: "♪", name: "TikTok", detail: "Followers · Likes · Views", color: "from-cyan-400/20 to-pink-500/10" },
  { icon: "▶", name: "YouTube", detail: "Subscribers · Views · Likes", color: "from-red-500/20 to-orange-500/10" },
  { icon: "➤", name: "Telegram", detail: "Members · Views · Reactions", color: "from-sky-500/20 to-blue-500/10" },
  { icon: "f", name: "Facebook", detail: "Followers · Likes · Views", color: "from-blue-500/20 to-indigo-500/10" },
  { icon: "⌁", name: "Lainnya", detail: "Berbagai layanan sosial media", color: "from-violet-500/20 to-blue-500/10" },
];

const features = [
  ["⚡", "Proses otomatis", "Pesanan diteruskan ke provider setelah pembayaran dan validasi berhasil."],
  ["◈", "Harga transparan", "Detail layanan, harga, minimum, dan maksimum ditampilkan sebelum order."],
  ["⌁", "Pantau pesanan", "Lihat status pesanan dan riwayat transaksi dari satu dashboard."],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[650px]" />
      <header className="container relative z-10 flex h-[76px] items-center justify-between border-b border-white/[.07]">
        <a href="/" className="flex items-center gap-3 font-bold tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-lg shadow-lg shadow-violet-950/40">W</span>
          <span className="text-lg">Wanz<span className="text-violet-400">Store</span></span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-[#a7a8ba] md:flex">
          <a href="#kategori" className="hover:text-white">Kategori</a><a href="#keunggulan" className="hover:text-white">Keunggulan</a><a href="#cara-order" className="hover:text-white">Cara order</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href="/login" className="rounded-xl px-3 py-2.5 text-sm text-[#c4c4d2] hover:text-white">Masuk</a>
          <a href="/register" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#111321] hover:bg-violet-100">Daftar</a>
        </div>
      </header>

      <section className="container relative z-10 grid min-h-[570px] items-center gap-12 py-20 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[.08] px-3 py-2 text-xs font-medium text-violet-200"><span className="h-2 w-2 rounded-full bg-emerald-400" /> SMM BOOSTER PANEL</div>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-[-.045em] sm:text-6xl lg:text-[68px]">Boost your social. <span className="gradient-text">Grow your reach.</span></h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-[#a5a6b8] sm:text-lg">Beli layanan followers, likes, views, subscribers, dan kebutuhan sosial media lainnya dengan proses pemesanan praktis melalui WanzStore.</p>
          <div className="mt-9 flex flex-wrap gap-3"><a href="/register" className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3.5 text-sm font-semibold shadow-lg shadow-violet-950/40 hover:-translate-y-0.5">Mulai order <span>→</span></a><a href="/login" className="rounded-xl border border-white/10 bg-white/[.04] px-6 py-3.5 text-sm font-semibold hover:bg-white/[.08]">Login akun</a></div>
          <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-xs text-[#85879c]"><span>✓ Katalog layanan</span><span>✓ Riwayat pesanan</span><span>✓ Status order</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-[460px]">
          <div className="absolute -inset-8 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="glass relative rounded-3xl p-6 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between border-b border-white/[.08] pb-5"><div><p className="text-xs text-[#85879c]">WANZSTORE PANEL</p><p className="mt-1 font-semibold">Pilih platform favoritmu</p></div><span className="rounded-lg border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs text-violet-200">SMM</span></div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {categories.slice(0,4).map((item) => <div key={item.name} className={`rounded-2xl border border-white/[.07] bg-gradient-to-br ${item.color} p-4`}><span className="grid h-10 w-10 place-items-center rounded-xl bg-black/20 text-xl font-bold">{item.icon}</span><p className="mt-4 font-semibold">{item.name}</p><p className="mt-1 text-[11px] leading-5 text-[#a5a6b8]">{item.detail}</p></div>)}
            </div>
            <div className="mt-4 rounded-xl border border-white/[.07] bg-white/[.03] p-4"><div className="flex items-center justify-between text-sm"><span className="text-[#a5a6b8]">Alur pesanan</span><span className="text-emerald-300">Mudah & praktis</span></div><div className="mt-3 flex items-center gap-2 text-xs text-[#a5a6b8]"><span className="rounded-lg bg-violet-500/20 px-2 py-2 text-violet-200">Pilih</span><span>→</span><span className="rounded-lg bg-violet-500/20 px-2 py-2 text-violet-200">Bayar</span><span>→</span><span className="rounded-lg bg-violet-500/20 px-2 py-2 text-violet-200">Proses</span></div></div>
            <p className="mt-4 text-center text-[10px] tracking-wide text-[#77798d]">PRATINJAU TAMPILAN • BUKAN DATA TRANSAKSI</p>
          </div>
        </div>
      </section>

      <section id="kategori" className="container py-16"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold tracking-[.2em] text-violet-300">KATEGORI LAYANAN</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Semua kebutuhan sosial media.</h2></div><p className="max-w-sm text-sm leading-6 text-[#9295aa]">Daftar layanan dan harga akan dimuat dari provider SprintPedia setelah API dikonfigurasi.</p></div><div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-3">{categories.map((item) => <article key={item.name} className={`rounded-2xl border border-white/[.08] bg-gradient-to-br ${item.color} p-5 transition hover:-translate-y-1 hover:border-violet-400/30`}><span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-black/20 text-xl font-bold">{item.icon}</span><h3 className="mt-5 font-semibold">{item.name}</h3><p className="mt-1 text-xs text-[#9295aa]">{item.detail}</p></article>)}</div></section>

      <section id="keunggulan" className="container py-16"><div className="text-center"><p className="text-xs font-semibold tracking-[.2em] text-violet-300">KENAPA WANZSTORE</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">Order lebih praktis, pantau lebih mudah.</h2></div><div className="mt-10 grid gap-4 md:grid-cols-3">{features.map(([icon,title,desc]) => <article key={title} className="glass rounded-2xl p-6"><span className="text-2xl text-violet-300">{icon}</span><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#9295aa]">{desc}</p></article>)}</div></section>

      <section id="cara-order" className="container py-16"><div className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-600/20 via-[#17152a] to-blue-600/10 p-8 sm:p-12"><p className="text-xs font-semibold tracking-[.2em] text-violet-200">MULAI SEKARANG</p><h2 className="mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">Buat akun dan mulai pesan layanan SMM.</h2><p className="mt-4 max-w-xl leading-7 text-[#b2b1c4]">Daftar atau login untuk mengakses dashboard pelanggan, katalog layanan, saldo, dan riwayat pesanan.</p><div className="mt-7 flex flex-wrap gap-3"><a href="/register" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#111321] hover:bg-violet-100">Daftar gratis →</a><a href="/login" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/10">Sudah punya akun?</a></div></div></section>
      <footer className="container mt-10 flex flex-col gap-3 border-t border-white/[.07] py-8 text-xs text-[#77798d] sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} WanzStore.</span><span>SMM Booster Panel</span></footer>
    </main>
  );
}