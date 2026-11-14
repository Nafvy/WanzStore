"use client";

import { useState } from "react";
import { RefreshCw, ShieldCheck, Wifi } from "lucide-react";

type Profile = { username: string | null; full_name: string | null; balance: number | string | null };

export function SprintPediaConnectionTest({ configured }: { configured: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);

  async function testConnection() {
    setBusy(true); setMessage(""); setProfile(null);
    try {
      const response = await fetch("/api/admin/sprintpedia/test", { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error([result.error || "Koneksi gagal.", result.diagnostic?.code ? "Kode: " + result.diagnostic.code : "", result.diagnostic?.message || ""].filter(Boolean).join(" — "));
      setProfile(result.profile);
      setMessage("Koneksi SprintPedia berhasil.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan.");
    } finally { setBusy(false); }
  }

  return <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
    <div className="flex items-center gap-2 text-sm font-semibold"><Wifi size={17} className="text-violet-300"/> Tes koneksi API</div>
    <p className="mt-2 text-xs leading-6 text-slate-400">Mengirim POST dengan parameter api_key ke endpoint profil. Tidak membuat pesanan dan tidak memotong saldo.</p>
    <button type="button" onClick={testConnection} disabled={!configured || busy} className="button button-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50">
      {busy ? <RefreshCw size={16} className="animate-spin"/> : <ShieldCheck size={16}/>}
      {busy ? "Memeriksa..." : "Tes koneksi SprintPedia"}
    </button>
    {!configured && <p className="mt-3 text-xs text-amber-300">Simpan URL Permintaan dan API Key terlebih dahulu.</p>}
    {message && <div role="status" className="mt-3 rounded-lg border border-slate-700 p-3 text-xs text-slate-200">
      {message}
      {profile && <div className="mt-3 grid gap-2">
        <p>Username: <strong>{profile.username || "—"}</strong></p>
        <p>Provider: <strong>{profile.full_name || "—"}</strong></p>
        <p className="text-base font-bold text-emerald-300">Saldo: {profile.balance ?? "—"}</p>
      </div>}
    </div>}
  </div>;
}
