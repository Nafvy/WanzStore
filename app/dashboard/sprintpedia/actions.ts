"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function fail(message: string): never {
  redirect("/dashboard/sprintpedia?error=" + encodeURIComponent(message));
}

export async function saveProviderConfig(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "owner" && profile?.role !== "admin") fail("Akses pemilik toko atau admin diperlukan.");

  const endpoint = String(formData.get("endpoint") || "").trim();
  const apiKey = String(formData.get("api_key") || "").trim();
  let parsed: URL;
  try { parsed = new URL(endpoint); } catch { fail("Endpoint API tidak valid."); }
  if (parsed.protocol !== "https:") fail("Endpoint API wajib menggunakan HTTPS.");
  const { data: existing, error: readError } = await supabase.from("provider_configs").select("id, api_key").order("created_at", { ascending: true }).limit(1).maybeSingle();
  if (readError) fail("Gagal membaca konfigurasi: " + readError.message);
  if (!existing && !apiKey) fail("API Key wajib diisi untuk konfigurasi pertama.");
  if (apiKey.length > 2000) fail("API Key terlalu panjang.");

  const payload = {
    provider_name: String(formData.get("provider_name") || "SprintPedia").trim().slice(0, 80),
    endpoint,
    ...(apiKey ? { api_key: apiKey } : {}),
    api_key_param: String(formData.get("api_key_param") || "key").trim().slice(0, 80),
    action_param: String(formData.get("action_param") || "action").trim().slice(0, 80),
    balance_action: String(formData.get("balance_action") || "balance").trim().slice(0, 80),
    services_action: String(formData.get("services_action") || "services").trim().slice(0, 80),
    add_action: String(formData.get("add_action") || "add").trim().slice(0, 80),
    status_action: String(formData.get("status_action") || "status").trim().slice(0, 80),
    request_method: "POST",
    enabled: formData.get("enabled") === "on",
    updated_at: new Date().toISOString(),
  };
  const query = existing
    ? supabase.from("provider_configs").update(payload).eq("id", existing.id)
    : supabase.from("provider_configs").insert(payload);
  const { error } = await query;
  if (error) fail("Konfigurasi gagal disimpan: " + error.message);
  revalidatePath("/dashboard/sprintpedia");
  redirect("/dashboard/sprintpedia?saved=1");
}
