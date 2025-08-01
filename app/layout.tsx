import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Online Text Editor",
  description:
    "A complete browser-based text editor with rich formatting capabilities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
