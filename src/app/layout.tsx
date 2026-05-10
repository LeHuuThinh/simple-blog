import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
const inter = Inter({ subsets: ["latin", "vietnamese"] });
export const metadata: Metadata = {
  title: "Thịnh Blog",
  description: "A simple blog built with Next.JS and Supabase",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-slate-900`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
