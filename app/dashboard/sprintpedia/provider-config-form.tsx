"use client";

import { useState } from "react";
import { saveProviderConfig } from "./actions";

type ProviderConfig = {
  provider_name: string;
  endpoint: string;
  api_key_param: string;
  action_param: string;
  balance_action: string;
  services_action: string;
  add_action: string;
  status_action: string;
  enabled: boolean;
  has_api_key: boolean;
};

export function ProviderConfigForm({ config }: { config: ProviderConfig | null }) {
  const [showKey, setShowKey] = useState(false);
  return (
    <form action={saveProviderConfig} className="mt-6 grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="provider_name" className="text-sm font-medium">Nama provider</label>
        <input id="provider_name" name="provider_name" defaultValue={config?.provider_name ?? "SprintPedia"} required maxLength={80} className="input w-full" placeholder="SprintPedia" />
      </div>
      <div className="grid gap-2">
        <label htmlFor="endpoint" className="text-sm font-medium">Endpoint API</label>
        <input id="endpoint" name="endpoint" type="url" defaultValue={config?.endpoint ?? ""} required placeholder="https://provider.example/api" className="input w-full" />
      </div>
      <div className="grid gap-2">
        <label htmlFor="api_key" className="text-sm font-medium">API Key</label>
        <input id="api_key" name="api_key" type={showKey ? "text" : "password"} autoComplete="new-password" required={!config?.has_api_key} placeholder={config?.has_api_key ? "Sudah tersimpan — kosongkan jika tidak ingin mengganti" : "Masukkan API Key"} className="input w-full" />
        <label className="flex items-center gap-2 text-xs text-slate-400"><input type="checkbox" checked={showKey} onChange={event => setShowKey(event.target.checked)} /> Tampilkan saat mengetik</label>
        {config?.has_api_key && <p className="text-xs text-emerald-300">API Key sudah tersimpan dan tidak ditampilkan demi keamanan.</p>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2"><label htmlFor="api_key_param" className="text-sm font-medium">Parameter API Key</label><input id="api_key_param" name="api_key_param" defaultValue={config?.api_key_param ?? "key"} required className="input w-full" /></div>
        <div className="grid gap-2"><label htmlFor="action_param" className="text-sm font-medium">Parameter action</label><input id="action_param" name="action_param" defaultValue={config?.action_param ?? "action"} required className="input w-full" /></div>
      </div>
      <div className="border-t border-slate-800 pt-4">
        <h3 className="text-sm font-semibold">Pemetaan action API</h3>
        <p className="mt-1 text-xs text-slate-400">Isi sesuai dokumentasi provider. Nilai ini disimpan untuk proses integrasi.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2"><label htmlFor="balance_action" className="text-sm">Cek saldo</label><input id="balance_action" name="balance_action" defaultValue={config?.balance_action ?? "balance"} required className="input w-full" /></div>
          <div className="grid gap-2"><label htmlFor="services_action" className="text-sm">Daftar layanan</label><input id="services_action" name="services_action" defaultValue={config?.services_action ?? "services"} required className="input w-full" /></div>
          <div className="grid gap-2"><label htmlFor="add_action" className="text-sm">Buat pesanan</label><input id="add_action" name="add_action" defaultValue={config?.add_action ?? "add"} required className="input w-full" /></div>
          <div className="grid gap-2"><label htmlFor="status_action" className="text-sm">Cek status pesanan</label><input id="status_action" name="status_action" defaultValue={config?.status_action ?? "status"} required className="input w-full" /></div>
        </div>
      </div>
      <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm"><input type="checkbox" name="enabled" defaultChecked={config?.enabled ?? true} className="size-4" /> Aktifkan provider ini</label>
      <button type="submit" className="button button-primary w-full">Simpan konfigurasi API</button>
    </form>
  );
}
