import type { Metadata } from "next";
import "./globals.css";
import { AppBackground } from "@/components/AppBackground";

export const metadata: Metadata = {
  title: "NaNote Library",
  description: "Knowledge base & executive dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><AppBackground>{children}</AppBackground></body>
    </html>
  );
}
