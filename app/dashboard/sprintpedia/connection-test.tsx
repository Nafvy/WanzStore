"use client";

import { useState } from "react";
import { RefreshCw, ShieldCheck, Wifi } from "lucide-react";

export function SprintPediaConnectionTest({ configured }: { configured: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState<string | null>(null);

  async function testConnection() {
    setBusy(true); setMessage(""); setBalance(null);
    try {
      const response = await fetch("/api/admin/sprintpedia/test", { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Koneksi gagal.");
      setMessage(result.message || "Koneksi berhasil.");
      setBalance(typeof result.balance === "string" ? result.balance : null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan.");
    } finally { setBusy(false); }
  }

  return <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
    <div className="flex items-center gap-2 text-sm font-semibold"><Wifi size={17} className="text-violet-300"/> Tes koneksi API</div>
    <p className="mt-2 text-xs leading-6 text-slate-400">Tes ini hanya meminta informasi saldo provider. Tidak membuat pesanan dan tidak memotong saldo.</p>
    <button type="button" onClick={testConnection} disabled={!configured || busy} className="button button-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50">
      {busy ? <RefreshCw size={16} className="animate-spin"/> : <ShieldCheck size={16}/>}
      {busy ? "Memeriksa..." : "Tes koneksi SprintPedia"}
    </button>
    {!configured && <p className="mt-3 text-xs text-amber-300">Tambahkan kedua Environment Variables di Vercel lalu redeploy.</p>}
    {message && <div role="status" className="mt-3 rounded-lg border border-slate-700 p-3 text-xs text-slate-200">{message}{balance && <p className="mt-2 font-semibold text-emerald-300">Saldo provider: {balance}</p>}</div>}
  </div>;
}
