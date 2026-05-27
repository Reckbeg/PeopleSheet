import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: "PeopleSheet – Template HR Gratis untuk UMKM Indonesia | Unduh XLSX 30 Detik",
  description:
    "Template spreadsheet HR gratis untuk UMKM Indonesia (5–50 karyawan). Termasuk rumus PPh21 TER, presensi, payroll. Unduh XLSX langsung tanpa login. Hemat 4+ jam per bulan.",
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "PeopleSheet – Template HR Gratis untuk UMKM Indonesia",
    description:
      "Udah capek bikin tabel HR dari nol? PeopleSheet siap pakai, gratis, tanpa database. 9 template buat payroll, presensi, cuti. Unduh dalam 30 detik.",
    url: SITE_URL,
    siteName: "PeopleSheet",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PeopleSheet – Template HR Gratis untuk UMKM Indonesia",
    description:
      "Template spreadsheet HR gratis untuk UMKM Indonesia. Rumus PPh21 TER, presensi, payroll. Unduh XLSX langsung tanpa login.",
  },
  other: {
    "theme-color": "#0F766E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full scroll-smooth antialiased">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
