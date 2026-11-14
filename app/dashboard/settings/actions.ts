"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function fail(message: string): never {
  redirect("/dashboard/settings?error=" + encodeURIComponent(message));
}

export async function saveStoreControls(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "owner" && profile?.role !== "admin") fail("Akses Admin diperlukan.");

  const marginMode = String(formData.get("margin_mode") || "percent");
  const marginValue = Number(formData.get("margin_value"));
  if (!["percent", "fixed"].includes(marginMode) || !Number.isFinite(marginValue) || marginValue < 0 || marginValue > 100000000 || (marginMode === "percent" && marginValue > 1000)) {
    fail("Nilai margin tidak valid.");
  }

  const { data: current, error: readError } = await supabase.from("store_settings")
    .select("id, hypetopup_api_key, hypetopup_secret_key, hypetopup_webhook_secret")
    .eq("id", true).maybeSingle();
  if (readError) fail("Gagal membaca pengaturan toko: " + readError.message);
  if (!current) fail("Data pengaturan toko belum tersedia. Jalankan migration 202611140008_store_pricing_and_hypetopup.sql.");

  const apiKey = String(formData.get("hypetopup_api_key") || "").trim();
  const secretKey = String(formData.get("hypetopup_secret_key") || "").trim();
  const webhookSecret = String(formData.get("hypetopup_webhook_secret") || "").trim();
  const environment = String(formData.get("hypetopup_environment") || "sandbox");
  if (!["sandbox", "production"].includes(environment)) fail("Lingkungan pembayaran tidak valid.");
  if (apiKey.length > 2000 || secretKey.length > 2000 || webhookSecret.length > 2000) fail("Kredensial terlalu panjang.");

  const enabled = formData.get("hypetopup_enabled") === "on";
  if (enabled && !(apiKey || current.hypetopup_api_key) ) fail("API Key HypeTopup wajib diisi sebelum mengaktifkan pembayaran.");

  const { error } = await supabase.from("store_settings").update({
    margin_mode: marginMode,
    margin_value: marginValue,
    hypetopup_enabled: enabled,
    hypetopup_api_key: apiKey || current.hypetopup_api_key,
    hypetopup_secret_key: secretKey || current.hypetopup_secret_key,
    hypetopup_webhook_secret: webhookSecret || current.hypetopup_webhook_secret,
    hypetopup_environment: environment,
    updated_at: new Date().toISOString(),
  }).eq("id", true);
  if (error) fail("Pengaturan gagal disimpan: " + error.message);
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  redirect("/dashboard/settings?saved=1");
}
