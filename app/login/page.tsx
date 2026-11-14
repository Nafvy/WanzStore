import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-12">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
      <section className="glass relative w-full max-w-md rounded-3xl p-7 shadow-2xl shadow-black/40 sm:p-9">
        <Link href="/" className="flex items-center gap-3 font-bold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500">W</span><span className="text-lg">Wanz<span className="text-violet-400">Store</span></span></Link>
        <p className="mt-9 text-xs font-semibold tracking-[.2em] text-violet-300">SELAMAT DATANG KEMBALI</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Login akun</h1>
        <p className="mt-2 text-sm leading-6 text-[#9295aa]">Masuk untuk mengelola saldo dan pesanan SMM kamu.</p>
        <form className="mt-8 space-y-4">
          <label className="block text-sm text-[#c8c8d5]">Email<input type="email" name="email" autoComplete="email" placeholder="nama@email.com" required className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none placeholder:text-[#66697d] focus:border-violet-400" /></label>
          <label className="block text-sm text-[#c8c8d5]">Password<input type="password" name="password" autoComplete="current-password" placeholder="Masukkan password" required className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none placeholder:text-[#66697d] focus:border-violet-400" /></label>
          <button type="button" disabled className="w-full cursor-not-allowed rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3.5 text-sm font-semibold opacity-70">Login segera tersedia</button>
        </form>
        <p className="mt-5 text-center text-sm text-[#9295aa]">Belum punya akun? <Link href="/register" className="font-semibold text-violet-300 hover:text-violet-200">Daftar sekarang</Link></p>
        <p className="mt-7 rounded-xl border border-amber-400/15 bg-amber-400/[.06] p-3 text-xs leading-5 text-amber-100/80">Autentikasi sedang disiapkan. Login akan aktif setelah konfigurasi Supabase selesai.</p>
        <Link href="/" className="mt-6 block text-center text-xs text-[#77798d] hover:text-white">← Kembali ke beranda</Link>
      </section>
    </main>
  );
}