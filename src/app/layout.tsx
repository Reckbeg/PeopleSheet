import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PeopleSheet - Template spreadsheet HR Indonesia",
  description:
    "Template spreadsheet HR praktis untuk tim Indonesia. Tanpa login, tanpa database, langsung unduh dan pakai.",
  metadataBase: new URL("https://peoplesheet.id"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "PeopleSheet - Template spreadsheet HR Indonesia",
    description:
      "Template spreadsheet HR praktis untuk tim Indonesia. Tanpa login, tanpa database, langsung unduh dan pakai.",
    url: "https://peoplesheet.id",
    siteName: "PeopleSheet",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PeopleSheet - Template spreadsheet HR Indonesia",
    description:
      "Template spreadsheet HR praktis untuk tim Indonesia. Tanpa login, tanpa database, langsung unduh dan pakai.",
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
