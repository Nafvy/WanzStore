import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, KeyRound, Server, ShieldCheck } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SprintPediaConnectionTest } from "./connection-test";

export const dynamic = "force-dynamic";

export default async function SprintPediaSettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "owner" && profile?.role !== "admin") redirect("/dashboard");

  const configured = Boolean(process.env.SPRINTPEDIA_API_URL && process.env.SPRINTPEDIA_API_KEY);
  return <main className="dashboard-shell min-h-screen pb-28">
    <header className="site-header sticky top-0"><div className="container flex h-[68px] items-center justify-between"><Link href="/dashboard" className="brand"><span className="brand-mark">W</span><span>Wanz<span className="brand-accent">Store</span></span></Link><Link href="/dashboard" className="button button-secondary"><ArrowLeft size={16}/> Dashboard</Link></div></header>
    <div className="container max-w-3xl pt-8">
      <p className="text-xs font-bold tracking-[.16em] text-violet-300">WANZSTORE / PROVIDER</p>
      <h1 className="mt-3 text-3xl font-bold">Integrasi SprintPedia</h1>
      <p className="mt-2 text-sm leading-6 text-slate-400">Hubungkan WanzStore ke API provider untuk mengambil katalog layanan dan memproses pesanan otomatis.</p>
      <section className="mt-7 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
        <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-violet-500/10 text-violet-300"><Server size={21}/></span><div><h2 className="font-semibold">Status konfigurasi</h2><p className="mt-1 text-xs text-slate-400">Kredensial disimpan di server Vercel, bukan di browser.</p></div></div>
        <div className="mt-5 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3"><span className="text-sm text-slate-300">Environment Variables</span><span className={configured ? "text-xs font-semibold text-emerald-300" : "text-xs font-semibold text-amber-300"}>{configured ? "Terkonfigurasi" : "Belum lengkap"}</span></div>
        <div className="mt-5 grid gap-3">
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3"><div className="flex items-center gap-2 text-sm font-medium"><KeyRound size={15}/> SPRINTPEDIA_API_URL</div><p className="mt-1 text-xs text-slate-500">Alamat endpoint API resmi dari dashboard SprintPedia.</p></div>
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-3"><div className="flex items-center gap-2 text-sm font-medium"><KeyRound size={15}/> SPRINTPEDIA_API_KEY</div><p className="mt-1 text-xs text-slate-500">API key rahasia akun SprintPedia. Tidak ditampilkan di halaman.</p></div>
        </div>
        <SprintPediaConnectionTest configured={configured}/>
      </section>
      <section className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-violet-300"><ShieldCheck size={18}/><h2 className="font-semibold text-slate-100">Cara konfigurasi di Vercel</h2></div>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-slate-300">
          <li>Buka Project WanzStore di Vercel, lalu masuk ke Settings dan Environment Variables.</li>
          <li>Tambahkan <code className="text-violet-300">SPRINTPEDIA_API_URL</code> dengan endpoint API resmi dari SprintPedia.</li>
          <li>Tambahkan <code className="text-violet-300">SPRINTPEDIA_API_KEY</code> dengan API key akun SprintPedia sebagai Secret.</li>
          <li>Pilih target Production, Preview, dan Development sesuai kebutuhan, lalu simpan.</li>
          <li>Redeploy project dan kembali ke halaman ini untuk mengetes koneksi.</li>
        </ol>
        <p className="mt-5 rounded-lg border border-amber-700/40 bg-amber-950/20 p-3 text-xs leading-5 text-amber-200">Catatan: SprintPedia menyatakan menyediakan API untuk pemesanan otomatis, tetapi format endpoint dan parameter resminya belum dapat diverifikasi dari halaman publik. Jangan menebak endpoint. Gunakan URL persis dari menu API akun SprintPedia sebelum melakukan tes.</p>
      </section>
    </div>
  </main>;
}
