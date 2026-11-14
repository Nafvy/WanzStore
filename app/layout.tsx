import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"WanzStore — SMM Booster Panel",description:"Panel pemesanan layanan sosial media WanzStore."};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="id"><body>{children}</body></html>;}
