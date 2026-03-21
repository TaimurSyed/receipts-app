import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Receipts — Your behavior leaves a trail",
  description:
    "A forensic-feeling self-insight app that turns messy life data into patterns, contradictions, and weekly receipts.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
