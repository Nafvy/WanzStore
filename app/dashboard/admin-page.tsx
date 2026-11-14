import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminDashboard } from "./admin-panel";

export async function renderAdminDashboard(tab: "home" | "history" | "new" | "me") {
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/login?setup=supabase");
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("username, role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/dashboard");

  const [servicesResult, ordersResult] = await Promise.all([
    supabase.from("services").select("id,name,category,price,active").eq("active", true).order("name"),
    supabase.from("orders").select("id,order_code,customer_email,target,quantity,total,status,created_at").order("created_at", { ascending: false }).limit(200),
  ]);

  return <AdminDashboard
    tab={tab}
    email={user.email || ""}
    username={profile.username || ""}
    services={servicesResult.data || []}
    orders={ordersResult.data || []}
    error={servicesResult.error || ordersResult.error ? "Data halaman belum dapat dimuat. Pastikan migration database sudah dijalankan di Supabase." : undefined}
  />;
}
