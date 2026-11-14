import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Percent, CreditCard, ShieldCheck, Save } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { saveStoreControls } from "./actions";

export const dynamic = "force-dynamic";

const money = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export default async function StoreControlsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "owner" && profile?.role !== "admin") redirect("/dashboard");

  const { data: settings, error } = await supabase.from("store_settings")
    .select("margin_mode, margin_value, hypetopup_enabled, hypetopup_environment, hypetopup_api_key, hypetopup_secret_key, hypetopup_webhook_secret")
    .eq("id", true).maybeSingle();
  const params = await searchParams;

  return <main className="dashboard-shell min-h-screen pb-12">
    <header className="site-header sticky top-0">
      <div className="container flex min-h-[68px] items-center justify-between gap-3">
        <Link href="/dashboard" className="brand"><span className="brand-mark">W</span><span>Wanz<span className="brand-accent">Store</span></span></Link>
        <Link href="/dashboard" className="button button-secondary"><ArrowLeft size={16}/> Dashboard</Link>
      </div>
    </header>
    <div className="container max-w-3xl pt-8">
      <p className="text-xs font-bold tracking-[.16em] text-slate-400">WANZSTORE / STORE CONTROLS</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Pengaturan Toko</h1>
      <p className="mt-2 text-sm text-slate-400">Kelola margin penjualan dan kredensial pembayaran dari satu tempat.</p>
      {params.saved && <p role="status" className="mt-5 rounded-lg border border-emerald-800 bg-emerald-950/30 p-3 text-sm text-emerald-200">Pengaturan berhasil disimpan.</p>}
      {params.error && <p role="alert" className="mt-5 rounded-lg border border-rose-800 bg-rose-950/30 p-3 text-sm text-rose-200">{params.error}</p>}
      {error && <p role="alert" className="mt-5 rounded-lg border border-amber-800 bg-amber-950/30 p-3 text-sm text-amber-200">Database belum siap. Jalankan migration 202611140008_store_pricing_and_hypetopup.sql di Supabase SQL Editor.</p>}
      {!error && settings && <form action={saveStoreControls} className="mt-7 grid gap-6">
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
          <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-emerald-950 text-emerald-300"><Percent size={20}/></span><div><h2 className="font-semibold">Margin Keuntungan</h2><p className="mt-1 text-xs text-slate-400">Atur margin standar toko.</p></div></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr]">
            <label className="grid gap-2 text-sm text-slate-300">Jenis margin
              <select name="margin_mode" defaultValue={settings.margin_mode} className="auth-input"><option value="percent">Persentase dari modal</option><option value="fixed">Nominal tetap</option></select>
            </label>
            <label className="grid gap-2 text-sm text-slate-300">Nilai margin
              <input name="margin_value" type="number" min="0" max={settings.margin_mode === "percent" ? "1000" : "100000000"} step="0.01" required defaultValue={settings.margin_value} className="auth-input"/>
            </label>
          </div>
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs font-semibold text-slate-400">CONTOH PERHITUNGAN</p>
            <p className="mt-2 text-sm text-slate-300">Jika modal layanan Rp10.000 dan margin yang dipilih {settings.margin_mode === "percent" ? settings.margin_value + "%" : money(Number(settings.margin_value))}:</p>
            <p className="mt-2 text-xl font-semibold tabular-nums">{money(settings.margin_mode === "percent" ? 10000 + 10000 * Number(settings.margin_value) / 100 : 10000 + Number(settings.margin_value))}</p>
            <p className="mt-1 text-xs text-slate-500">Simulasi mengikuti nilai yang tersimpan saat halaman dibuka.</p>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">Pengaturan margin disimpan sebagai kebijakan harga global. Penerapan otomatis ke katalog membutuhkan data harga modal provider yang valid.</p>
        </section>
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
          <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-slate-800 text-slate-200"><CreditCard size={20}/></span><div><h2 className="font-semibold">Pembayaran HypeTopup</h2><p className="mt-1 text-xs text-slate-400">Simpan kredensial API dengan akses server saja.</p></div></div>
          <label className="mt-5 flex min-h-11 items-center gap-3 text-sm text-slate-300"><input type="checkbox" name="hypetopup_enabled" defaultChecked={settings.hypetopup_enabled} className="size-4"/> Aktifkan HypeTopup</label>
          <label className="mt-4 grid gap-2 text-sm text-slate-300">API Key
            <input name="hypetopup_api_key" type="password" autoComplete="new-password" placeholder={settings.hypetopup_api_key ? "Tersimpan, kosongkan jika tidak diganti" : "Masukkan API Key"} className="auth-input"/>
          </label>
          <label className="mt-4 grid gap-2 text-sm text-slate-300">Secret Key
            <input name="hypetopup_secret_key" type="password" autoComplete="new-password" placeholder={settings.hypetopup_secret_key ? "Tersimpan, kosongkan jika tidak diganti" : "Masukkan Secret Key jika disediakan"} className="auth-input"/>
          </label>
          <label className="mt-4 grid gap-2 text-sm text-slate-300">Webhook Secret
            <input name="hypetopup_webhook_secret" type="password" autoComplete="new-password" placeholder={settings.hypetopup_webhook_secret ? "Tersimpan, kosongkan jika tidak diganti" : "Masukkan Webhook Secret jika disediakan"} className="auth-input"/>
          </label>
          <label className="mt-4 grid gap-2 text-sm text-slate-300">Lingkungan
            <select name="hypetopup_environment" defaultValue={settings.hypetopup_environment} className="auth-input"><option value="sandbox">Sandbox / Pengujian</option><option value="production">Production</option></select>
          </label>
          <div className="mt-5 flex gap-3 rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs leading-5 text-slate-400"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-emerald-300"/><p>Kredensial tidak dikirim ke browser sebagai nilai awal dan tidak ditampilkan kembali. Tombol tes koneksi serta pembuatan tagihan akan diaktifkan setelah endpoint dan format autentikasi resmi HypeTopup diverifikasi.</p></div>
        </section>
        <button type="submit" className="button button-primary min-h-12 w-full"><Save size={17}/> Simpan Pengaturan</button>
      </form>}
    </div>
  </main>;
}
