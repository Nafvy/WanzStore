import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WanzStore — Digital Growth, Made Simple",
  description: "Platform layanan digital dan promosi online yang transparan untuk membantu bisnis berkembang.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}