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

export async function createAdminOrder(formData: FormData) {
  const client = await createSupabaseServerClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await client.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin" && profile?.role !== "owner") fail("Akses admin diperlukan.");
  const serviceId = String(formData.get("service_id") || "");
  const target = String(formData.get("target") || "").trim();
  const quantity = Number(formData.get("quantity"));
  if (!serviceId || !target || target.length > 500 || !Number.isInteger(quantity) || quantity < 1 || quantity > 1000000) fail("Data pesanan tidak valid.");
  const { data: service, error: serviceError } = await client.from("services").select("id,price,active").eq("id", serviceId).maybeSingle();
  if (serviceError || !service || !service.active) fail("Layanan tidak tersedia.");
  const total = Number(service.price) * quantity;
  if (!Number.isFinite(total) || total < 0) fail("Total pesanan tidak valid.");
  const { error } = await client.from("orders").insert({ user_id: user.id, service_id: service.id, customer_email: user.email || "", target, quantity, total, status: "pending" });
  if (error) fail("Pesanan gagal dibuat: " + error.message);
  revalidatePath("/dashboard");
  redirect("/dashboard?tab=history&notice=" + encodeURIComponent("Pesanan berhasil dibuat."));
}

export async function updateAdminAccount(formData: FormData) {
  const client = await createSupabaseServerClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await client.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin" && profile?.role !== "owner") fail("Akses admin diperlukan.");
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  if (!username || username.length > 40) fail("Nama tampilan wajib diisi maksimal 40 karakter.");
  const { error: profileError } = await client.from("profiles").update({ username, updated_at: new Date().toISOString() }).eq("id", user.id);
  if (profileError) fail("Nama akun gagal diperbarui: " + profileError.message);
  if (password) {
    if (password.length < 8) fail("Kata sandi minimal 8 karakter.");
    const { error: passwordError } = await client.auth.updateUser({ password });
    if (passwordError) fail("Kata sandi gagal diperbarui: " + passwordError.message);
  }
  revalidatePath("/dashboard");
  redirect("/dashboard?tab=me&notice=" + encodeURIComponent("Pengaturan akun berhasil disimpan."));
}

export async function signOutAdmin() {
  const client = await createSupabaseServerClient();
  await client.auth.signOut();
  redirect("/login");
}
