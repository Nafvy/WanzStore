import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sesi login berakhir. Silakan login kembali." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "owner" && profile?.role !== "admin") return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });

  const { data: config, error } = await supabase.from("provider_configs")
    .select("endpoint, api_key, api_key_param, action_param, balance_action, enabled")
    .order("created_at", { ascending: true }).limit(1).maybeSingle();
  if (error) return NextResponse.json({ error: "Gagal membaca konfigurasi provider. Pastikan migrasi SQL sudah dijalankan." }, { status: 500 });
  if (!config?.endpoint || !config.api_key) return NextResponse.json({ error: "Simpan endpoint dan API Key provider terlebih dahulu." }, { status: 400 });
  if (!config.enabled) return NextResponse.json({ error: "Provider sedang dinonaktifkan." }, { status: 400 });

  let url: URL;
  try { url = new URL(config.endpoint); } catch { return NextResponse.json({ error: "Format endpoint API tidak valid." }, { status: 400 }); }
  if (url.protocol !== "https:") return NextResponse.json({ error: "Endpoint API harus menggunakan HTTPS." }, { status: 400 });

  try {
    const body = new URLSearchParams({
      [config.api_key_param]: config.api_key,
      [config.action_param]: config.balance_action,
    });
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body, cache: "no-store", signal: AbortSignal.timeout(12000) });
    const raw = await response.text();
    let data: Record<string, unknown>;
    try { data = JSON.parse(raw) as Record<string, unknown>; } catch { return NextResponse.json({ error: "Respons provider bukan JSON. Periksa format API resmi." }, { status: 502 }); }
    if (!response.ok || data.error || data.status === false) return NextResponse.json({ error: "Provider menolak permintaan. Periksa endpoint, API Key, dan format API." }, { status: 502 });
    const balance = data.balance == null ? null : String(data.balance);
    return NextResponse.json({ message: "Provider memberikan respons yang valid.", balance });
  } catch {
    return NextResponse.json({ error: "Tidak dapat menghubungi provider. Periksa endpoint atau coba lagi." }, { status: 502 });
  }
}
