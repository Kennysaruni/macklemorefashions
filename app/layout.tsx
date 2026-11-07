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
    "MACKLEMORE FASHION | Luxury Multi-Brand Storefront & African Distribution Hub",
  description:
    "Flagship digital headquarters of Macklemore Fashion (macklemorefashions.com). Blending high-fashion multi-brand curation with African streetwear comfort and heritage across Lagos, Nairobi, Accra, and Toronto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFFDF9] text-[#1F1A17]">
        <PlatformProvider>
          <SmoothScrollProvider>
            <Suspense fallback={<div className="min-h-screen bg-[#FFFDF9]" />}>
              <EditorialShell>{children}</EditorialShell>
            </Suspense>
          </SmoothScrollProvider>
        </PlatformProvider>
      </body>
    </html>
  );
}
