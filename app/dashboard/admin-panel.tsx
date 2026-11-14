import Link from "next/link";
import { Home, History, ShoppingCart, UserRound, Zap, LogOut, Package, ClipboardList, Clock3, Settings2 } from "lucide-react";
import { createAdminOrder, updateAdminAccount, signOutAdmin } from "./actions";

type Service = { id: string; name: string; category: string; price: number; active: boolean };
type Order = { id: string; order_code: string; customer_email: string; target: string; quantity: number; total: number; status: string; created_at: string };
type Props = { tab: string; email: string; username: string; services: Service[]; orders: Order[]; notice?: string; error?: string };

const money = (value: number | string | null) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
const date = (value: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Tanggal tidak tersedia" : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(parsed);
};
const status: Record<string, string> = { pending: "Menunggu", processing: "Diproses", completed: "Selesai", failed: "Gagal", cancelled: "Dibatalkan" };

const tabs = [
  { id: "home", label: "Beranda", href: "/dashboard?tab=home", Icon: Home },
  { id: "history", label: "Riwayat", href: "/dashboard?tab=history", Icon: History },
  { id: "new", label: "New Order", href: "/dashboard?tab=new", Icon: ShoppingCart },
  { id: "me", label: "Saya", href: "/dashboard?tab=me", Icon: UserRound },
];

export function AdminDashboard({ tab, email, username, services, orders, notice, error }: Props) {
  const activeTab = tabs.some(item => item.id === tab) ? tab : "home";
  const pending = orders.filter(order => order.status === "pending").length;
  const completed = orders.filter(order => order.status === "completed").length;
  const revenue = orders.filter(order => order.status === "completed").reduce((sum, order) => sum + Number(order.total || 0), 0);

  return <main className="dashboard-shell min-h-screen pb-28">
    <header className="site-header sticky top-0"><div className="container flex min-h-[68px] items-center justify-between gap-3"><Link href="/dashboard?tab=home" className="brand" aria-label="Beranda dashboard"><span className="brand-mark">W</span><span>Wanz<span className="brand-accent">Store</span></span></Link><div className="flex items-center gap-2"><Link href="/dashboard/settings" className="button button-secondary"><Settings2 size={16}/> Pengaturan</Link><Link href="/dashboard/sprintpedia" className="button button-secondary"><Zap size={16}/> SprintPedia</Link><form action={signOutAdmin}><button className="button button-secondary" type="submit"><LogOut size={16}/><span className="hidden sm:inline">Keluar</span></button></form></div></div></header>
    <div className="container max-w-6xl pt-7">
      {activeTab === "home" && <div className="mb-7"><h1 className="text-3xl font-bold">Beranda</h1><p className="mt-2 text-sm text-slate-400">Ringkasan aktivitas toko dan pesanan terbaru.</p></div>}
      {notice && <div role="status" className="mt-5 rounded-xl border border-emerald-700/60 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200">{notice}</div>}
      {error && <div role="alert" className="mt-5 rounded-xl border border-rose-700/60 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">{error}</div>}

      {activeTab === "home" && <section className="mt-7">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[{ label: "Total pesanan", value: orders.length, Icon: ClipboardList }, { label: "Menunggu diproses", value: pending, Icon: Clock3 }, { label: "Pesanan selesai", value: completed, Icon: Package }, { label: "Omzet pesanan selesai", value: money(revenue), Icon: Package }].map(({ label, value, Icon }) => <article key={label} className="rounded-lg border border-slate-700 bg-slate-900 p-4"><div className="flex items-center justify-between gap-2 text-slate-400"><span className="text-xs">{label}</span><Icon size={18} className="text-violet-300"/></div><p className="mt-3 text-2xl font-bold tabular-nums">{value}</p></article>)}
        </div>
        <div className="mt-5 rounded-xl border border-slate-700 bg-slate-900 p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Pesanan terbaru</h2><p className="mt-1 text-sm text-slate-400">Data pesanan terbaru dari database.</p></div><Link href="/dashboard?tab=history" className="text-sm font-semibold text-violet-300">Lihat semua</Link></div>
          {orders.slice(0,5).length ? <div className="mt-4 divide-y divide-slate-800">{orders.slice(0,5).map(order => <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-mono text-xs">{order.order_code}</p><p className="mt-1 text-xs text-slate-400">{order.customer_email || "—"} · {order.target || "—"}</p></div><div className="text-right"><p className="text-sm font-semibold">{money(order.total)}</p><p className="mt-1 text-xs text-slate-400">{status[order.status] || order.status}</p></div></div>)}</div> : <p className="py-7 text-center text-sm text-slate-500">Belum ada pesanan.</p>}
        </div>
        <Link href="/dashboard?tab=new" className="button button-primary mt-5 w-full sm:w-auto"><ShoppingCart size={16}/> Buat pesanan baru</Link>
      </section>}

      {activeTab === "history" && <section className="mt-7 rounded-xl border border-slate-700 bg-slate-900 p-5 sm:p-6"><h2 className="text-xl font-bold">Riwayat pesanan</h2><p className="mt-1 text-sm text-slate-400">Daftar transaksi yang tercatat di WanzStore.</p><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="text-xs text-slate-500"><tr>{["Order ID","Pelanggan","Target","Qty","Total","Status","Tanggal"].map(label => <th key={label} className="border-b border-slate-800 px-3 py-3 font-medium">{label}</th>)}</tr></thead><tbody>{orders.map(order => <tr key={order.id} className="border-b border-slate-800/70"><td className="px-3 py-4 font-mono text-xs">{order.order_code}</td><td className="px-3 py-4 text-xs">{order.customer_email || "—"}</td><td className="px-3 py-4 text-xs">{order.target || "—"}</td><td className="px-3 py-4 text-xs">{order.quantity}</td><td className="px-3 py-4 text-xs">{money(order.total)}</td><td className="px-3 py-4 text-xs">{status[order.status] || order.status}</td><td className="px-3 py-4 text-xs text-slate-400">{date(order.created_at)}</td></tr>)}</tbody></table>{orders.length === 0 && <p className="py-8 text-center text-sm text-slate-500">Belum ada riwayat pesanan.</p>}</div></section>}

      {activeTab === "new" && <section className="mt-7 max-w-2xl rounded-xl border border-slate-700 bg-slate-900 p-5 sm:p-6"><div className="flex items-center gap-2 text-violet-300"><ShoppingCart size={19}/><span className="text-xs font-bold tracking-wider">BUAT TRANSAKSI</span></div><h2 className="mt-2 text-xl font-bold">New Order</h2><p className="mt-1 text-sm text-slate-400">Buat pesanan manual menggunakan layanan aktif yang tersedia.</p>{services.length ? <form action={createAdminOrder} className="mt-5 grid gap-4"><label className="grid gap-2 text-sm text-slate-300">Layanan<select name="service_id" required className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white"><option value="">Pilih layanan</option>{services.filter(service => service.active).map(service => <option key={service.id} value={service.id}>{service.name} · {money(service.price)}</option>)}</select></label><label className="grid gap-2 text-sm text-slate-300">Target / username / URL<input name="target" required maxLength={500} placeholder="Masukkan target pesanan" className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white"/></label><label className="grid gap-2 text-sm text-slate-300">Jumlah<input name="quantity" type="number" required min="1" max="1000000" defaultValue="1" className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white"/></label><button type="submit" className="button button-primary w-full"><ShoppingCart size={16}/> Buat pesanan</button></form> : <p className="mt-5 rounded-lg border border-amber-700/40 bg-amber-950/20 p-3 text-sm text-amber-200">Belum ada layanan aktif. Minta Pemilik Toko menambahkan layanan terlebih dahulu.</p>}</section>}

      {activeTab === "me" && <section className="mt-7 max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6"><div className="flex items-center gap-2 text-violet-300"><UserRound size={19}/><span className="text-xs font-bold tracking-wider">PENGATURAN AKUN</span></div><h2 className="mt-2 text-xl font-bold">Profil Admin</h2><p className="mt-1 text-sm text-slate-400">Perbarui nama tampilan dan kata sandi akun.</p><div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 p-3"><p className="text-xs text-slate-500">EMAIL AKUN</p><p className="mt-1 break-all text-sm">{email}</p></div><form action={updateAdminAccount} className="mt-5 grid gap-4"><label className="grid gap-2 text-sm text-slate-300">Nama tampilan<input name="username" required maxLength={40} defaultValue={username} className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white"/></label><label className="grid gap-2 text-sm text-slate-300">Kata sandi baru <span className="text-xs text-slate-500">Kosongkan jika tidak ingin mengubah kata sandi.</span><input name="password" type="password" minLength={8} autoComplete="new-password" placeholder="Minimal 8 karakter" className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white"/></label><button type="submit" className="button button-primary w-full">Simpan perubahan akun</button></form></section>}
    </div>
    <nav aria-label="Navigasi admin" className="dashboard-bottom-nav">{tabs.map(({ id, label, href, Icon }) => <Link key={id} href={href} aria-current={activeTab === id ? "page" : undefined} className={activeTab === id ? "active" : ""}><Icon size={18}/><span>{label}</span></Link>)}</nav>
  </main>;
}
