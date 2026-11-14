export default function InputCheckPage() {
  return (
    <main style={{ minHeight: "100svh", padding: 24, background: "#fff", color: "#111", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Tes Input WanzStore</h1>
      <p style={{ marginBottom: 24 }}>Ketik di kedua kolom ini. Halaman ini memakai input HTML biasa tanpa komponen login.</p>
      <label style={{ display: "grid", gap: 8, marginBottom: 20 }}>
        Email
        <input name="email" type="text" autoComplete="off" placeholder="Ketik di sini" style={{ display: "block", width: "100%", minHeight: 54, padding: 12, border: "2px solid #555", borderRadius: 8, background: "#fff", color: "#111", fontSize: 18, opacity: 1, WebkitTextFillColor: "#111" }} />
      </label>
      <label style={{ display: "grid", gap: 8 }}>
        Password
        <input name="password" type="text" autoComplete="off" placeholder="Ketik di sini" style={{ display: "block", width: "100%", minHeight: 54, padding: 12, border: "2px solid #555", borderRadius: 8, background: "#fff", color: "#111", fontSize: 18, opacity: 1, WebkitTextFillColor: "#111" }} />
      </label>
    </main>
  );
}
