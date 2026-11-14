import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { setUserRole, updateStore, saveService, deleteService, updateOrderStatus } from "./actions";
import { renderAdminDashboard } from "./admin-page";
import { Boxes, ClipboardList, Cog, LogOut, ShieldCheck, Store, Users, Activity, Package, Clock3, Zap, Home, History, ShoppingCart, UserRound } from "lucide-react";

const roles = {
  owner: { label: "Pemilik toko", title: "Dashboard Pemilik Toko", description: "Pusat kendali dan pengelolaan WanzStore." },
  admin: { label: "Admin", title: "Dashboard Admin", description: "Kelola operasional dan pantau aktivitas toko." },
  reseller: { label: "Mitra Reseller", title: "Dashboard Mitra Reseller", description: "Kelola aktivitas reseller dan pantau pesanan." },
  customer: { label: "Pelanggan", title: "Dashboard Pelanggan", description: "Kelola akun dan pantau pesanan top up kamu." },
} as const;

const money = (value: number | string | null) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
const date = (value: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Tanggal tidak tersedia" : new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(parsed);
};
const statusLabel: Record<string, string> = { pending: "Menunggu", processing: "Diproses", completed: "Selesai", failed: "Gagal", cancelled: "Dibatalkan" };

type Props = { searchParams: Promise<{ notice?: string; error?: string; tab?: string; view?: string }> };

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const ownerView = params.view || "overview";
  let supabase;
  try { supabase = await createSupabaseServerClient(); }
  catch { redirect("/login?setup=supabase"); }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("username, role").eq("id", user.id).maybeSingle();
  const role = profile?.role && profile.role in roles ? profile.role as keyof typeof roles : "customer";

  async function signOut() {
    "use server";
    const client = await createSupabaseServerClient();
    await client.auth.signOut();
    redirect("/login");
  }

  if (role === "admin") return renderAdminDashboard("home");

  if (role !== "owner") {
    const current = roles[role];
    return <main className="dashboard-shell min-h-screen"><header className="site-header"><div className="container flex h-[72px] items-center justify-between"><Link href="/dashboard?tab=home" className="brand"><span className="brand-mark">W</span><span>Wanz<span className="brand-accent">Store</span></span></Link><form action={signOut}><button className="button button-secondary" type="submit"><LogOut size={16}/> Keluar</button></form></div></header><section className="dashboard-card"><span className="text-xs font-semibold text-violet-300">{current.label}</span><h1 className="mt-4 text-3xl font-bold">{current.title}</h1><p className="mt-2 text-sm text-slate-400">{current.description}</p><div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-4"><p className="text-xs text-slate-500">AKUN AKTIF</p><p className="mt-2 text-sm">{user.email}</p></div></section></main>;
  }

  const [usersResult, settingsResult, servicesResult, ordersResult, logsResult] = await Promise.all([
    supabase.rpc("owner_list_users"),
    supabase.from("store_settings").select("*").eq("id", true).maybeSingle(),
    supabase.from("services").select("*").order("created_at", { ascending: false }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("owner_activity_logs").select("*").order("created_at", { ascending: false }).limit(30),
  ]);

  const users = usersResult.data ?? [];
  const services = servicesResult.data ?? [];
  const orders = ordersResult.data ?? [];
  const logs = logsResult.data ?? [];
  const settings = settingsResult.data ?? { store_name: "WanzStore", store_description: "", support_contact: "", maintenance_mode: false };
  const pendingOrders = orders.filter((order: { status: string }) => order.status === "pending").length;
  const activeServices = services.filter((service: { active: boolean }) => service.active).length;

  return (
    <main className="dashboard-shell min-h-screen pb-12">
      <header className="site-header sticky top-0">
        <div className="container flex min-h-[72px] items-center justify-between gap-3">
          <Link href="/dashboard" className="brand" aria-label="Kembali ke dashboard"><span className="brand-mark">W</span><span>Wanz<span className="brand-accent">Store</span></span></Link>
          <div className="flex items-center gap-3"><span className="hidden rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-2 text-xs font-semibold text-violet-200 sm:inline-flex">Pemilik toko</span><form action={signOut}><button className="button button-secondary" type="submit"><LogOut size={16}/> Keluar</button></form></div>
        </div>
      </header>

      <div id="overview" className="container pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-bold tracking-[.16em] text-violet-300">WANZSTORE / OWNER CONSOLE</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Dashboard Pemilik Toko</h1><p className="mt-2 text-sm text-slate-400">Selamat datang, {profile?.username || user.email?.split("@")[0] || "Pemilik"}.</p></div>
          <div className="text-right"><p className="text-xs text-slate-500">LOGIN SEBAGAI</p><p className="mt-1 max-w-[260px] break-all text-sm font-medium">{user.email}</p></div>
        </div>

        {params.notice && <div role="status" className="mt-5 rounded-xl border border-emerald-700/60 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200">{params.notice}</div>}
        {params.error && <div role="alert" className="mt-5 rounded-xl border border-rose-700/60 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">{params.error}</div>}
        {(usersResult.error || settingsResult.error || servicesResult.error || ordersResult.error || logsResult.error) && <div role="alert" className="mt-5 rounded-xl border border-amber-700/60 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">Modul database belum siap. Jalankan migration <strong>202611140004_owner_dashboard_modules.sql</strong> di Supabase SQL Editor, lalu muat ulang halaman.</div>}

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total pengguna", value: users.length, Icon: Users },
            { label: "Layanan aktif", value: activeServices, Icon: Package },
            { label: "Total pesanan", value: orders.length, Icon: ClipboardList },
            { label: "Pesanan menunggu", value: pendingOrders, Icon: Clock3 },
          ].map(({ label, value, Icon }) => <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/80 p-4"><div className="flex items-center justify-between text-slate-400"><span className="text-xs">{label}</span><Icon size={18} className="text-violet-300"/></div><p className="mt-3 text-2xl font-bold tabular-nums">{value}</p></div>)}
        </div>

        <nav aria-label="Menu pemilik toko" className="mt-7 grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-2 sm:grid-cols-3 lg:grid-cols-6">
          <Link href="/dashboard" className={ownerView === "overview" ? "flex min-h-11 items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white sm:text-sm" : "flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 sm:text-sm"}><Home size={17}/>Ringkasan</Link>
          <Link href="/dashboard/users" className={ownerView === "users" ? "flex min-h-11 items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white sm:text-sm" : "flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 sm:text-sm"}><Users size={17}/>Pengguna</Link>
          <Link href="/dashboard/store" className={ownerView === "store" ? "flex min-h-11 items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white sm:text-sm" : "flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 sm:text-sm"}><Store size={17}/>Operasional</Link>
          <Link href="/dashboard/security" className={ownerView === "security" ? "flex min-h-11 items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white sm:text-sm" : "flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 sm:text-sm"}><ShieldCheck size={17}/>Keamanan</Link>
          <Link href="/dashboard/orders" className={ownerView === "orders" ? "flex min-h-11 items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white sm:text-sm" : "flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 sm:text-sm"}><ClipboardList size={17}/>Pesanan</Link>
          <Link href="/dashboard/settings" className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 sm:text-sm"><Cog size={17}/>Margin & Pembayaran</Link>
        </nav>

        {ownerView === "users" && (        <section id="pengguna" className="scroll-mt-24 mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2 text-violet-300"><Users size={19}/><span className="text-xs font-bold tracking-wider">PENGELOLAAN AKUN</span></div><h2 className="mt-2 text-xl font-bold">Manajemen pengguna</h2><p className="mt-1 text-sm text-slate-400">Pantau akun dan atur peran setiap pengguna.</p></div><span className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300">{users.length} akun</span></div>
          <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="text-xs text-slate-500"><tr><th className="border-b border-slate-800 px-3 py-3 font-medium">Pengguna</th><th className="border-b border-slate-800 px-3 py-3 font-medium">Role</th><th className="border-b border-slate-800 px-3 py-3 font-medium">Terdaftar</th><th className="border-b border-slate-800 px-3 py-3 font-medium">Tindakan</th></tr></thead><tbody>{users.map((item: { id: string; email: string; username: string | null; role: string; created_at: string }) => <tr key={item.id} className="border-b border-slate-800/70 last:border-0"><td className="px-3 py-4"><p className="font-medium text-slate-100">{item.username || item.email?.split("@")[0] || "Pengguna"}</p><p className="mt-1 text-xs text-slate-500">{item.email}</p></td><td className="px-3 py-4"><span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">{roles[item.role as keyof typeof roles]?.label || item.role}</span></td><td className="px-3 py-4 text-xs text-slate-400">{date(item.created_at)}</td><td className="px-3 py-4">{item.role === "owner" || item.id === user.id ? <span className="text-xs text-slate-500">Dilindungi</span> : <form action={setUserRole} className="flex items-center gap-2"><input type="hidden" name="user_id" value={item.id}/><select name="role" defaultValue={item.role} aria-label={"Role untuk " + item.email} className="min-h-9 rounded-lg border border-slate-700 bg-slate-950 px-2 text-xs"><option value="admin">Admin</option><option value="reseller">Mitra Reseller</option><option value="customer">Pelanggan</option></select><button className="button button-secondary min-h-9 px-3 text-xs" type="submit">Simpan</button></form>}</td></tr>)}</tbody></table>{users.length === 0 && <p className="py-8 text-center text-sm text-slate-500">Belum ada data pengguna atau database belum siap.</p>}</div>
        </section>)}


        {ownerView === "store" && (        <section id="operasional" className="scroll-mt-24 mt-5 grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6"><div className="flex items-center gap-2 text-violet-300"><Store size={19}/><span className="text-xs font-bold tracking-wider">KONFIGURASI</span></div><h2 className="mt-2 text-xl font-bold">Operasional toko</h2><p className="mt-1 text-sm text-slate-400">Atur identitas dan status operasional WanzStore.</p>
            <form action={updateStore} className="mt-5 grid gap-4"><label className="grid gap-2 text-xs font-medium text-slate-300">Nama toko<input name="store_name" required maxLength={80} defaultValue={settings.store_name} className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white"/></label><label className="grid gap-2 text-xs font-medium text-slate-300">Deskripsi toko<textarea name="store_description" rows={3} maxLength={300} defaultValue={settings.store_description} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white"/></label><label className="grid gap-2 text-xs font-medium text-slate-300">Kontak dukungan<input name="support_contact" maxLength={120} defaultValue={settings.support_contact} placeholder="Email atau nomor WhatsApp" className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white"/></label><label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm"><input type="checkbox" name="maintenance_mode" defaultChecked={settings.maintenance_mode} className="size-4 accent-violet-500"/>Mode pemeliharaan</label><button className="button button-primary w-full" type="submit"><Cog size={16}/> Simpan pengaturan</button></form>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2 text-violet-300"><Boxes size={19}/><span className="text-xs font-bold tracking-wider">KATALOG</span></div><h2 className="mt-2 text-xl font-bold">Pengelolaan layanan</h2><p className="mt-1 text-sm text-slate-400">Tambah dan perbarui layanan beserta harga.</p></div><span className="text-xs text-slate-500">{services.length} layanan</span></div>
            <form action={saveService} className="mt-5 grid gap-3 sm:grid-cols-2"><input name="name" required maxLength={100} placeholder="Nama layanan" className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm"/><input name="category" maxLength={60} placeholder="Kategori" className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm"/><input name="price" type="number" min="0" step="1" required placeholder="Harga (IDR)" className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm"/><input name="description" maxLength={500} placeholder="Deskripsi layanan" className="min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm"/><label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" name="active" defaultChecked className="size-4 accent-violet-500"/>Aktif di katalog</label><button className="button button-primary sm:justify-self-end" type="submit"><Package size={16}/> Tambah layanan</button></form>
            <div className="mt-5 divide-y divide-slate-800">{services.map((service: { id: string; name: string; category: string; price: number; active: boolean }) => <div key={service.id} className="grid gap-2 border-b border-slate-800 py-4 last:border-0"><form action={saveService} className="grid gap-2 sm:grid-cols-2"><input type="hidden" name="service_id" value={service.id}/><input name="name" defaultValue={service.name} required aria-label="Nama layanan" className="min-h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm"/><input name="category" defaultValue={service.category} aria-label="Kategori" className="min-h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm"/><input name="price" type="number" min="0" step="1" defaultValue={service.price} required aria-label="Harga layanan" className="min-h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm"/><label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" name="active" defaultChecked={service.active} className="size-4 accent-violet-500"/>Tampilkan di katalog</label><button className="button button-secondary min-h-9 px-3 text-xs sm:col-span-2 sm:justify-self-start" type="submit">Simpan perubahan</button></form><form action={deleteService}><input type="hidden" name="service_id" value={service.id}/><button className="button button-secondary min-h-9 px-3 text-xs text-rose-300" type="submit">Hapus layanan</button></form></div>)}</div>
          </div>
        </section>)}


        {ownerView === "security" && (        <section id="keamanan" className="scroll-mt-24 mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-violet-300"><ShieldCheck size={19}/><span className="text-xs font-bold tracking-wider">KONTROL AKSES</span></div><h2 className="mt-2 text-xl font-bold">Keamanan akses</h2><p className="mt-1 text-sm text-slate-400">Ringkasan identitas pemilik dan jejak perubahan penting.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs text-slate-500">AKUN PEMILIK</p><p className="mt-2 break-all text-sm font-semibold">{user.email}</p><p className="mt-1 text-xs text-emerald-300">Role owner · hak tertinggi</p></div><div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs text-slate-500">PERLINDUNGAN ROLE</p><p className="mt-2 text-sm font-semibold">Promosi role dibatasi di database</p><p className="mt-1 text-xs leading-5 text-slate-400">Akun owner dan role owner tidak dapat diubah dari formulir pengguna.</p></div></div>
          <div className="mt-6 flex items-center gap-2"><Activity size={17} className="text-violet-300"/><h3 className="font-semibold">Aktivitas keamanan</h3></div><div className="mt-3 divide-y divide-slate-800">{logs.map((log: { id: number; action: string; detail: string; created_at: string }) => <div key={log.id} className="flex flex-wrap justify-between gap-2 py-3"><div><p className="text-sm font-medium">{log.action}</p><p className="mt-1 text-xs text-slate-400">{log.detail}</p></div><time className="text-xs text-slate-500">{date(log.created_at)}</time></div>)}{logs.length === 0 && <p className="py-5 text-sm text-slate-500">Belum ada aktivitas tercatat.</p>}</div>
        </section>)}


        {ownerView === "orders" && (        <section id="pesanan" className="scroll-mt-24 mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2 text-violet-300"><ClipboardList size={19}/><span className="text-xs font-bold tracking-wider">TRANSAKSI</span></div><h2 className="mt-2 text-xl font-bold">Pesanan</h2><p className="mt-1 text-sm text-slate-400">Pantau pesanan pelanggan dan reseller.</p></div><span className="text-xs text-slate-500">100 pesanan terbaru</span></div>
          <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="text-xs text-slate-500"><tr><th className="border-b border-slate-800 px-3 py-3 font-medium">ID pesanan</th><th className="border-b border-slate-800 px-3 py-3 font-medium">Pelanggan</th><th className="border-b border-slate-800 px-3 py-3 font-medium">Target</th><th className="border-b border-slate-800 px-3 py-3 font-medium">Total</th><th className="border-b border-slate-800 px-3 py-3 font-medium">Status</th><th className="border-b border-slate-800 px-3 py-3 font-medium">Perbarui</th></tr></thead><tbody>{orders.map((order: { id: string; order_code: string; customer_email: string; target: string; total: number; status: string }) => <tr key={order.id} className="border-b border-slate-800/70 last:border-0"><td className="px-3 py-4 font-mono text-xs">{order.order_code}</td><td className="px-3 py-4 text-xs">{order.customer_email || "—"}</td><td className="px-3 py-4 text-xs">{order.target || "—"}</td><td className="px-3 py-4 text-xs">{money(order.total)}</td><td className="px-3 py-4"><span className="rounded-md bg-slate-800 px-2 py-1 text-xs">{statusLabel[order.status] || order.status}</span></td><td className="px-3 py-4"><form action={updateOrderStatus} className="flex items-center gap-2"><input type="hidden" name="order_id" value={order.id}/><select name="status" defaultValue={order.status} aria-label={"Status " + order.order_code} className="min-h-9 rounded-lg border border-slate-700 bg-slate-950 px-2 text-xs">{Object.entries(statusLabel).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select><button className="button button-secondary min-h-9 px-3 text-xs" type="submit">Simpan</button></form></td></tr>)}</tbody></table>{orders.length === 0 && <p className="py-8 text-center text-sm text-slate-500">Belum ada pesanan masuk.</p>}</div>
        </section>)}

        <p className="mt-6 text-center text-xs text-slate-600">WanzStore Owner Console · Data dikelola melalui Supabase.</p>
      </div>

      <nav aria-label="Navigasi dashboard pemilik" className="dashboard-bottom-nav">
        <Link href="/dashboard"><Home size={18}/><span>Ringkasan</span></Link>
        <Link href="/dashboard/users"><Users size={18}/><span>Pengguna</span></Link>
        <Link href="/dashboard/store"><Store size={18}/><span>Operasional</span></Link>
        <Link href="/dashboard/orders"><ClipboardList size={18}/><span>Pesanan</span></Link>
      </nav>
    </main>
  );
}
