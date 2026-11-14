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
    .select("endpoint, api_key, enabled")
    .order("created_at", { ascending: true }).limit(1).maybeSingle();
  if (error) return NextResponse.json({ error: "Gagal membaca konfigurasi provider.", diagnostic: { code: error.code ?? null, message: error.message, hint: error.hint ?? null } }, { status: 500 });
  if (!config?.endpoint || !config.api_key) return NextResponse.json({ error: "Simpan URL Permintaan dan API Key terlebih dahulu." }, { status: 400 });
  if (!config.enabled) return NextResponse.json({ error: "Provider sedang dinonaktifkan." }, { status: 400 });

  let endpoint: URL;
  try { endpoint = new URL(config.endpoint); } catch { return NextResponse.json({ error: "URL Permintaan tidak valid." }, { status: 400 }); }
  if (endpoint.protocol !== "https:" || endpoint.hostname !== "sprintpedia.id" || endpoint.pathname !== "/api/profile") {
    return NextResponse.json({ error: "Endpoint harus https://sprintpedia.id/api/profile." }, { status: 400 });
  }

  try {
    const body = new URLSearchParams({ api_key: config.api_key });
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    const raw = await response.text();
    let result: { status?: boolean; data?: { username?: string; full_name?: string; balance?: number | string } | string };
    try { result = JSON.parse(raw); } catch {
      return NextResponse.json({ error: "SprintPedia mengirim respons yang bukan JSON." }, { status: 502 });
    }
    if (!response.ok || result.status !== true || !result.data || typeof result.data !== "object") {
      const message = typeof result.data === "string" ? result.data : "SprintPedia menolak permintaan. Periksa API Key.";
      return NextResponse.json({ error: message }, { status: 502 });
    }
    return NextResponse.json({
      success: true,
      profile: {
        username: result.data.username ?? null,
        full_name: result.data.full_name ?? null,
        balance: result.data.balance ?? null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Tidak dapat menghubungi SprintPedia. Coba lagi beberapa saat." }, { status: 502 });
  }
}
