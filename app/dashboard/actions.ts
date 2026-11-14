"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function finish(message: string): never {
  revalidatePath("/dashboard");
  redirect("/dashboard?notice=" + encodeURIComponent(message));
}

function fail(message: string): never {
  redirect("/dashboard?error=" + encodeURIComponent(message));
}

export async function setUserRole(formData: FormData) {
  const client = await createSupabaseServerClient();
  const { error } = await client.rpc("owner_set_user_role", {
    target_user_id: String(formData.get("user_id") || ""),
    new_role: String(formData.get("role") || ""),
  });
  if (error) fail(error.message);
  finish("Role pengguna berhasil diperbarui.");
}

export async function updateStore(formData: FormData) {
  const client = await createSupabaseServerClient();
  const { error } = await client.rpc("owner_update_store", {
    new_name: String(formData.get("store_name") || ""),
    new_description: String(formData.get("store_description") || ""),
    new_contact: String(formData.get("support_contact") || ""),
    new_maintenance: formData.get("maintenance_mode") === "on",
  });
  if (error) fail(error.message);
  finish("Pengaturan toko berhasil disimpan.");
}

export async function saveService(formData: FormData) {
  const client = await createSupabaseServerClient();
  const rawId = String(formData.get("service_id") || "");
  const price = Number(formData.get("price"));
  if (!String(formData.get("name") || "").trim() || !Number.isFinite(price) || price < 0) {
    fail("Nama dan harga layanan harus valid.");
  }
  const { error } = await client.rpc("owner_save_service", {
    service_id: rawId || null,
    service_name: String(formData.get("name")),
    service_category: String(formData.get("category") || "Umum"),
    service_description: String(formData.get("description") || ""),
    service_price: price,
    service_active: formData.get("active") === "on",
  });
  if (error) fail(error.message);
  finish("Layanan berhasil disimpan.");
}

export async function deleteService(formData: FormData) {
  const client = await createSupabaseServerClient();
  const { error } = await client.from("services").delete().eq("id", String(formData.get("service_id") || ""));
  if (error) fail(error.message);
  finish("Layanan berhasil dihapus.");
}

export async function updateOrderStatus(formData: FormData) {
  const client = await createSupabaseServerClient();
  const { error } = await client.rpc("owner_update_order_status", {
    target_order_id: String(formData.get("order_id") || ""),
    new_status: String(formData.get("status") || ""),
  });
  if (error) fail(error.message);
  finish("Status pesanan berhasil diperbarui.");
}
