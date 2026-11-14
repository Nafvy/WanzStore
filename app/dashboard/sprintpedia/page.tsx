import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, KeyRound, Server, ShieldCheck } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProviderConfigForm } from "./provider-config-form";
import { SprintPediaConnectionTest } from "./connection-test";

export const dynamic = "force-dynamic";

export default async function SprintPediaSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "owner" && profile?.role !== "admin") redirect("/dashboard");

  const { data: config } = await supabase.from("provider_configs")
    .select("id, endpoint, enabled")
    .order("created_at", { ascending: true }).limit(1).maybeSingle();
  const configured = Boolean(config?.endpoint);
  const params = await searchParams;
  return <main className="dashboard-shell min-h-screen pb-28">
    <header className="site-header sticky top-0"><div className="container flex h-[68px] items-center justify-between"><Link href="/dashboard" className="brand"><span className="brand-mark">W</span><span>Wanz<span className="brand-accent">Store</span></span></Link><Link href="/dashboard" className="button button-secondary"><ArrowLeft size={16}/> Dashboard</Link></div></header>
    <div className="container max-w-3xl pt-8">
      <p className="text-xs font-bold tracking-[.16em] text-violet-300">WANZSTORE / PROVIDER</p>
      <h1 className="mt-3 text-3xl font-bold">Integrasi API Provider</h1>
      <p className="mt-2 text-sm leading-6 text-slate-400">Masukkan tiga data dari SprintPedia: URL Permintaan, API Key, dan Secret Key. Kedua kunci disimpan di server dan tidak ditampilkan kembali.</p>
      {params.saved && <p role="status" className="mt-4 rounded-lg border border-emerald-800 bg-emerald-950/30 p-3 text-sm text-emerald-300">Konfigurasi API berhasil disimpan.</p>}
      {params.error && <p role="alert" className="mt-4 rounded-lg border border-rose-800 bg-rose-950/30 p-3 text-sm text-rose-300">{params.error}</p>}
      <section className="mt-7 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
        <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-violet-500/10 text-violet-300"><Server size={21}/></span><div><h2 className="font-semibold">Konfigurasi provider</h2><p className="mt-1 text-xs text-slate-400">Isi sesuai dokumentasi API resmi provider.</p></div></div>
        <div className="mt-5 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3"><span className="text-sm text-slate-300">Status konfigurasi</span><span className={configured ? "text-xs font-semibold text-emerald-300" : "text-xs font-semibold text-amber-300"}>{configured ? "Sudah tersimpan" : "Belum dikonfigurasi"}</span></div>
        <ProviderConfigForm config={config ? { ...config, has_api_key: true, has_secret_key: true } : null}/>
        <SprintPediaConnectionTest configured={configured}/>
      </section>
      <section className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-violet-300"><ShieldCheck size={18}/><h2 className="font-semibold text-slate-100">Keamanan dan format API</h2></div>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
          <li>API Key dan Secret Key disimpan di database Supabase dan tidak dikirim ke komponen browser.</li>
          <li>Akses konfigurasi dibatasi dengan Row Level Security untuk akun owner dan admin.</li>
          <li>Respons saldo SprintPedia menggunakan status dan data.balance. Format request perlu mengikuti dokumentasi resmi provider sebelum tes koneksi dan sinkronisasi diaktifkan.</li>
        </ul>
      </section>
    </div>
  </main>;
}
