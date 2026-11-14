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
    .select("endpoint, api_key, secret_key, enabled")
    .order("created_at", { ascending: true }).limit(1).maybeSingle();
  if (error) return NextResponse.json({ error: "Gagal membaca konfigurasi. Pastikan migration SprintPedia terbaru sudah dijalankan." }, { status: 500 });
  if (!config?.endpoint || !config.api_key || !config.secret_key) {
    return NextResponse.json({ error: "Lengkapi URL Permintaan, API Key, dan Secret Key terlebih dahulu." }, { status: 400 });
  }
  if (!config.enabled) return NextResponse.json({ error: "Provider sedang dinonaktifkan." }, { status: 400 });

  // The sample response defines the response schema, not how credentials must be
  // sent. Do not guess request parameter names or leak credentials to an unknown API.
  return NextResponse.json({
    error: "Konfigurasi tersimpan. Untuk mengaktifkan tes saldo, masih diperlukan contoh format REQUEST dari dokumentasi SprintPedia: metode HTTP dan nama parameter/header untuk API Key, Secret Key, serta action cek saldo."
  }, { status: 501 });
}
