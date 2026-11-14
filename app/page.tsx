const services = [
  { icon: "✦", title: "Social Media Strategy", desc: "Bangun kehadiran brand dengan strategi konten dan distribusi yang terarah.", tag: "Strategi" },
  { icon: "↗", title: "Digital Advertising", desc: "Jangkau audiens yang relevan melalui kampanye iklan yang transparan.", tag: "Promosi" },
  { icon: "◎", title: "Content & Creative", desc: "Materi kreatif yang konsisten untuk memperkuat identitas bisnismu.", tag: "Kreatif" },
];

const steps = [
  ["01", "Pilih layanan", "Temukan layanan digital sesuai kebutuhan brand."],
  ["02", "Konsultasi kebutuhan", "Tentukan target, cakupan, dan estimasi pengerjaan."],
  ["03", "Pantau progres", "Dapatkan informasi status dan riwayat pesanan secara jelas."],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[620px]" />
      <header className="container relative z-10 flex h-20 items-center justify-between border-b border-white/[.07]">
        <a href="#" className="flex items-center gap-3 font-bold tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-lg shadow-lg shadow-violet-950/40">W</span>
          <span className="text-lg">Wanz<span className="text-violet-400">Store</span></span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-[#a7a8ba] md:flex">
          <a className="transition hover:text-white" href="#layanan">Layanan</a>
          <a className="transition hover:text-white" href="#cara-kerja">Cara kerja</a>
          <a className="transition hover:text-white" href="#tentang">Tentang</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="/login" className="hidden rounded-xl px-4 py-2.5 text-sm text-[#c4c4d2] transition hover:text-white sm:block">Masuk</a>
          <a href="/register" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#111321] transition hover:bg-violet-100">Mulai sekarang <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <section className="container relative z-10 grid min-h-[610px] items-center gap-12 py-20 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[.08] px-3 py-2 text-xs font-medium text-violet-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            DIGITAL GROWTH PLATFORM
          </div>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-[-.045em] sm:text-6xl lg:text-[68px]">
            Grow your brand. <span className="gradient-text">Make it matter.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-[#a5a6b8] sm:text-lg">
            Solusi promosi dan layanan digital yang dirancang untuk membantu bisnis berkembang dengan strategi yang jelas, transparan, dan terukur.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#layanan" className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3.5 text-sm font-semibold shadow-lg shadow-violet-950/40 transition hover:-translate-y-0.5">Jelajahi layanan <span aria-hidden="true">→</span></a>
            <a href="#cara-kerja" className="rounded-xl border border-white/10 bg-white/[.04] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[.08]">Pelajari cara kerja</a>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-xs text-[#85879c]">
            <span>✓ Informasi harga transparan</span><span>✓ Proses terpantau</span><span>✓ Dukungan pelanggan</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[470px]">
          <div className="absolute -inset-8 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="glass relative rounded-3xl p-5 shadow-2xl shadow-black/40 sm:p-7">
            <div className="flex items-center justify-between border-b border-white/[.08] pb-5">
              <div><p className="text-xs text-[#85879c]">WORKSPACE PREVIEW</p><p className="mt-1 font-semibold">Campaign overview</p></div>
              <span className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">Preview</span>
            </div>
            <div className="mt-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/10 p-5">
              <p className="text-sm text-[#b6b3cf]">Your next growth starts here</p>
              <div className="mt-3 flex items-end justify-between"><span className="text-3xl font-bold tracking-tight">WanzStore</span><span className="text-2xl text-violet-300">✳</span></div>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-500 to-blue-400" /></div>
              <p className="mt-2 text-right text-xs text-[#a5a6b8]">A smarter digital workflow</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/[.07] bg-white/[.03] p-4"><span className="text-xl text-violet-300">◈</span><p className="mt-3 text-sm font-semibold">Layanan digital</p><p className="mt-1 text-xs text-[#85879c]">Solusi sesuai kebutuhan</p></div>
              <div className="rounded-2xl border border-white/[.07] bg-white/[.03] p-4"><span className="text-xl text-blue-300">⌁</span><p className="mt-3 text-sm font-semibold">Alur transparan</p><p className="mt-1 text-xs text-[#85879c]">Status mudah dipantau</p></div>
            </div>
            <p className="mt-4 text-center text-[10px] tracking-wide text-[#77798d]">ILUSTRASI ANTARMUKA • BUKAN DATA TRANSAKSI NYATA</p>
          </div>
        </div>
      </section>

      <section id="layanan" className="container relative py-20">
        <div className="max-w-xl"><p className="text-xs font-semibold tracking-[.2em] text-violet-300">APA YANG KAMI TAWARKAN</p><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Satu tempat untuk <span className="gradient-text">bertumbuh.</span></h2><p className="mt-4 leading-7 text-[#9295aa]">Fokus pada layanan promosi dan pengembangan digital yang mengutamakan kualitas serta transparansi.</p></div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {services.map((service) => <article key={service.title} className="glass rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-400/30"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-500/15 text-xl text-violet-300">{service.icon}</span><span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-[#a5a6b8]">{service.tag}</span></div><h3 className="mt-6 text-lg font-semibold">{service.title}</h3><p className="mt-3 text-sm leading-6 text-[#9295aa]">{service.desc}</p></article>)}
        </div>
      </section>

      <section id="cara-kerja" className="container py-20">
        <div className="text-center"><p className="text-xs font-semibold tracking-[.2em] text-violet-300">MULAI DENGAN MUDAH</p><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Langkah yang <span className="gradient-text">lebih sederhana.</span></h2></div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map(([number, title, desc]) => <div key={number} className="rounded-2xl border border-white/[.07] bg-white/[.025] p-6"><p className="text-sm font-semibold text-violet-300">{number}</p><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#9295aa]">{desc}</p></div>)}
        </div>
      </section>

      <section id="tentang" className="container py-16">
        <div className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-600/20 via-[#17152a] to-blue-600/10 p-8 sm:p-12">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="relative max-w-2xl"><p className="text-xs font-semibold tracking-[.2em] text-violet-200">WANZSTORE</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">Siap mengembangkan kehadiran digitalmu?</h2><p className="mt-4 leading-7 text-[#b2b1c4]">Mulai dengan memilih layanan yang tepat. Tim kami akan membantu menjelaskan proses dan kebutuhan sebelum pesanan dijalankan.</p><a href="/register" className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#111321] hover:bg-violet-100">Buat akun <span className="ml-2">→</span></a></div>
        </div>
      </section>

      <footer className="container mt-12 flex flex-col gap-4 border-t border-white/[.07] py-8 text-xs text-[#77798d] sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} WanzStore. All rights reserved.</span>
        <span>Digital growth, made simple.</span>
      </footer>
    </main>
  );
}