import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PeopleSheet - HR spreadsheet templates",
  description:
    "Practical HR spreadsheet templates for Indonesian teams. No login. No database. Just download and use.",
  metadataBase: new URL("https://peoplesheet.id"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "PeopleSheet - HR spreadsheet templates",
    description:
      "Practical HR spreadsheet templates for Indonesian teams. No login. No database. Just download and use.",
    url: "https://peoplesheet.id",
    siteName: "PeopleSheet",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PeopleSheet - HR spreadsheet templates",
    description:
      "Practical HR spreadsheet templates for Indonesian teams. No login. No database. Just download and use.",
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
    <html lang="en" className="h-full scroll-smooth antialiased">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
