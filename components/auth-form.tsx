"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, LockKeyhole, Mail, UserRound } from "lucide-react";

type AuthMode = "login" | "register";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isRegister = mode === "register";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const username = String(formData.get("username") ?? "").trim();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      setError("Supabase belum dikonfigurasi. Periksa Environment Variables Vercel.");
      return;
    }

    setBusy(true);
    try {
      const supabase = createBrowserClient(url, key);

      if (isRegister) {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, username }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Pendaftaran gagal.");
        const { error: sessionError } = await supabase.auth.setSession(result.session);
        if (sessionError) throw sessionError;
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Link href="/" className="brand">
          <span className="brand-mark">W</span>
          <span>Wanz<span className="brand-accent">Store</span></span>
        </Link>

        <h1 className="auth-title">{isRegister ? "Buat akun baru" : "Login akun"}</h1>
        <p className="auth-subtitle">
          {isRegister
            ? "Daftar untuk mulai menggunakan panel layanan sosial media."
            : "Masuk untuk mengelola saldo dan pesanan SMM kamu."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label className="auth-label">
              <span className="flex items-center gap-2"><UserRound size={16} /> Nama pengguna</span>
              <input className="auth-input" name="username" autoComplete="username" minLength={3} maxLength={30} placeholder="Nama pengguna" required />
            </label>
          )}

          <label className="auth-label">
            <span className="flex items-center gap-2"><Mail size={16} /> Email</span>
            <input className="auth-input" type="email" name="email" autoComplete="email" maxLength={254} placeholder="nama@email.com" required />
          </label>

          <label className="auth-label">
            <span className="flex items-center gap-2"><LockKeyhole size={16} /> Password</span>
            <input className="auth-input" type="password" name="password" autoComplete={isRegister ? "new-password" : "current-password"} minLength={isRegister ? 8 : 1} placeholder={isRegister ? "Minimal 8 karakter" : "Masukkan password"} required />
          </label>

          {error && <p className="auth-message auth-error" role="alert">{error}</p>}

          <button className="auth-submit" type="submit" disabled={busy}>
            {busy ? "Memproses..." : isRegister ? "Buat akun" : "Masuk ke akun"}
          </button>
        </form>

        <p className="auth-footer">
          {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <Link href={isRegister ? "/login" : "/register"}>
            {isRegister ? "Login" : "Daftar sekarang"}
          </Link>
        </p>

        <Link href="/" className="auth-back">
          <ArrowLeft className="mr-1 inline" size={14} /> Kembali ke beranda
        </Link>
      </section>
    </main>
  );
}
