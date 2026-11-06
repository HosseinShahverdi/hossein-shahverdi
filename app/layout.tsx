import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/syne/600.css";
import "@fontsource/syne/700.css";
import "@fontsource/syne/800.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import Providers from "@/components/core/Providers";

export const metadata: Metadata = {
  title: "Hossein Shahverdi — AI research & software engineering",
  description:
    "Portfolio of Hossein Shahverdi: efficient deep learning, medical AI and secure full-stack engineering.",
  openGraph: {
    title: "Hossein Shahverdi",
    description: "One scroll, two worlds: research & AI, and programming.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#040608",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-world="home"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        <noscript>
          <style>{`.hs-loader{display:none!important}`}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
