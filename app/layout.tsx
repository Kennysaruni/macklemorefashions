import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PlatformProvider } from "@/lib/platform-context";
import { SmoothScrollProvider } from "@/components/motion/MotionPrimitives";
import { EditorialShell } from "@/components/layout/EditorialShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "MACKLEMORE FASHION | International Luxury Storefront & Continental African Distribution Hub",
  description:
    "Flagship digital headquarters of Macklemore Fashion (macklemorefashions.com). Canadian-based luxury & streetwear enterprise with primary operational headquarters in Lagos, Nigeria, serving North America, UK, Europe, West Africa, and East Africa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0B0C] text-[#F6F5F1]">
        <PlatformProvider>
          <SmoothScrollProvider>
            <Suspense fallback={<div className="min-h-screen bg-[#0B0B0C]" />}>
              <EditorialShell>{children}</EditorialShell>
            </Suspense>
          </SmoothScrollProvider>
        </PlatformProvider>
      </body>
    </html>
  );
}
