import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Panaversity TODO | Hackathon II",
  description: "Evolution of TODO — 5 phases from console to cloud-native",
  keywords: ["todo", "panaversity", "hackathon", "nextjs", "fastapi"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
