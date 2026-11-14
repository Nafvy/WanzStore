"use client";

import { useState } from "react";
import { saveProviderConfig } from "./actions";

type ProviderConfig = {
  endpoint: string;
  enabled: boolean;
  has_api_key: boolean;
  has_secret_key: boolean;
};

export function ProviderConfigForm({ config }: { config: ProviderConfig | null }) {
  const [showSecrets, setShowSecrets] = useState(false);
  return (
    <form action={saveProviderConfig} className="mt-6 grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="endpoint" className="text-sm font-medium">URL Permintaan</label>
        <input id="endpoint" name="endpoint" type="url" defaultValue={config?.endpoint ?? ""} required placeholder="https://..." className="auth-input" />
      </div>
      <div className="grid gap-2">
        <label htmlFor="api_key" className="text-sm font-medium">API Key</label>
        <input id="api_key" name="api_key" type={showSecrets ? "text" : "password"} autoComplete="new-password" required={!config?.has_api_key} placeholder={config?.has_api_key ? "Sudah tersimpan — kosongkan jika tidak ingin mengganti" : "Masukkan API Key"} className="auth-input" />
        {config?.has_api_key && <p className="text-xs text-emerald-300">API Key tersimpan. Nilai rahasia tidak ditampilkan kembali.</p>}
      </div>
      <div className="grid gap-2">
        <label htmlFor="secret_key" className="text-sm font-medium">Secret Key</label>
        <input id="secret_key" name="secret_key" type={showSecrets ? "text" : "password"} autoComplete="new-password" required={!config?.has_secret_key} placeholder={config?.has_secret_key ? "Sudah tersimpan — kosongkan jika tidak ingin mengganti" : "Masukkan Secret Key"} className="auth-input" />
        {config?.has_secret_key && <p className="text-xs text-emerald-300">Secret Key tersimpan. Nilai rahasia tidak ditampilkan kembali.</p>}
      </div>
      <label className="flex items-center gap-2 text-xs text-slate-400"><input type="checkbox" checked={showSecrets} onChange={event => setShowSecrets(event.target.checked)} /> Tampilkan saat mengetik</label>
      <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm"><input type="checkbox" name="enabled" defaultChecked={config?.enabled ?? true} className="size-4" /> Aktifkan provider ini</label>
      <button type="submit" className="button button-primary w-full">Simpan konfigurasi SprintPedia</button>
    </form>
  );
}
