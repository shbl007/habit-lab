import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Geist variable font, bundled in app/fonts (SIL Open Font License) — no network or package needed.
const geist = localFont({
  src: "./fonts/GeistVariable.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fabil — Start Your Transformation",
  description: "Tell us about yourself and your goals.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#F1F2F4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
