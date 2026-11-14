import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ArrowRight, ClipboardList, CreditCard, LogOut, Package, ShieldCheck, Store, Users, Wallet } from "lucide-react";

const roles = {
  owner: { label: "Pemilik toko", description: "Kontrol penuh atas operasional WanzStore.", title: "Dashboard Pemilik Toko" },
  admin: { label: "Admin", description: "Kelola operasional dan pantau aktivitas toko.", title: "Dashboard Admin" },
  reseller: { label: "Mitra Reseller", description: "Kelola aktivitas reseller dan pantau pesanan.", title: "Dashboard Mitra Reseller" },
  customer: { label: "Pelanggan", description: "Kelola akun dan pantau pesanan top up kamu.", title: "Dashboard Pelanggan" },
} as const;

const roleFeatures = {
  owner: [
    { title: "Manajemen pengguna", detail: "Pantau akun dan peran pengguna WanzStore.", Icon: Users },
    { title: "Operasional toko", detail: "Ringkasan aktivitas dan pengelolaan layanan.", Icon: Store },
    { title: "Keamanan akses", detail: "Akses pemilik toko dengan hak tertinggi.", Icon: ShieldCheck },
    { title: "Pesanan", detail: "Pantau pesanan pelanggan dan reseller.", Icon: ClipboardList },
  ],
  admin: [
    { title: "Pengguna", detail: "Pantau aktivitas akun pengguna.", Icon: Users },
    { title: "Pesanan", detail: "Kelola dan pantau pesanan masuk.", Icon: ClipboardList },
    { title: "Katalog layanan", detail: "Area pengelolaan layanan toko.", Icon: Package },
  ],
  reseller: [
    { title: "Pesanan reseller", detail: "Pantau pesanan yang dibuat melalui akun reseller.", Icon: ClipboardList },
    { title: "Saldo reseller", detail: "Ringkasan saldo dan transaksi reseller.", Icon: Wallet },
    { title: "Layanan", detail: "Akses katalog layanan untuk mitra.", Icon: Package },
  ],
  customer: [
    { title: "Pesanan saya", detail: "Riwayat dan status pesanan akan tampil di sini.", Icon: ClipboardList },
    { title: "Saldo akun", detail: "Informasi saldo akun pelanggan.", Icon: Wallet },
    { title: "Katalog layanan", detail: "Jelajahi layanan yang tersedia di WanzStore.", Icon: Package },
  ],
} as const;

export default async function DashboardPage() {
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/login?setup=supabase");
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role && profile.role in roles
    ? profile.role as keyof typeof roles
    : "customer";
  const currentRole = roles[role];
  const features = roleFeatures[role];

  async function signOut() {
    "use server";
    const client = await createSupabaseServerClient();
    await client.auth.signOut();
    redirect("/login");
  }

  return (
    <main className="dashboard-shell">
      <header className="site-header">
        <div className="container flex h-[72px] items-center justify-between gap-3">
          <Link href="/" className="brand" aria-label="WanzStore beranda">
            <span className="brand-mark">W</span>
            <span>Wanz<span className="brand-accent">Store</span></span>
          </Link>
          <form action={signOut}>
            <button className="button button-secondary" type="submit"><LogOut size={16} /> Keluar</button>
          </form>
        </div>
      </header>

      <section className="dashboard-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold tracking-[.14em] text-violet-300">WANZSTORE / DASHBOARD</p>
          <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-200">{currentRole.label}</span>
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight">{currentRole.title}</h1>
        <p className="mt-2 text-sm text-slate-400">{currentRole.description}</p>
        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-500">AKUN AKTIF</p>
          <p className="mt-1 break-all text-sm font-medium text-slate-100">{profile?.username || user.email?.split("@")[0] || "Pengguna"}</p>
          <p className="mt-1 break-all text-xs text-slate-400">{user.email}</p>
        </div>
        <div className="mt-8 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Menu utama</h2>
          <span className="text-xs text-slate-500">{features.length} menu</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {features.map(({ title, detail, Icon }) => (
            <article key={title} className="rounded-xl border border-slate-700 bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-3">
                <Icon size={21} className="text-violet-300" />
                <ArrowRight size={16} className="text-slate-600" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">{detail}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-700/80 bg-slate-900/50 p-4">
          <CreditCard size={18} className="mt-0.5 shrink-0 text-violet-300" />
          <p className="text-xs leading-5 text-slate-400">Dashboard dan hak akses mengikuti role yang tersimpan di database. Fitur transaksi dan pengelolaan data akan aktif setelah modul terkait dihubungkan.</p>
        </div>
      </section>
    </main>
  );
}
