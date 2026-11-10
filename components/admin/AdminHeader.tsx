"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MacklemoreLogo } from "@/components/vectors/TribalVectors";

interface AdminHeaderProps {
  userName?: string;
  storageSource?: string;
}

export function AdminHeader({
  userName = "Executive Admin",
  storageSource = "Neon S3",
}: AdminHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      // ignore
    }
    router.push("/admin/login");
  };

  return (
    <header className="rounded-3xl border border-[#EADFD0] bg-white p-6 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Studio Title */}
      <div className="flex items-center gap-4">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <MacklemoreLogo className="h-10 sm:h-12" />
        </Link>
        <div className="h-8 w-[1px] bg-[#EADFD0] hidden sm:block" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-[#1F1A17]">
              Admin Studio
            </span>
            <span className="rounded-full bg-[#FAF5EE] border border-[#EADFD0] px-2.5 py-0.5 text-[10px] font-mono font-semibold tracking-wider text-[#7A491D] uppercase">
              Boutique Operations
            </span>
          </div>
          <p className="text-xs text-[#6E6A63] mt-0.5">
            Macklemore Fashion Flagship &amp; Dual-Hub Distribution Desk
          </p>
        </div>
      </div>

      {/* User, Vault & Actions */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        {/* Storage Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF9F6] border border-[#EADFD0] text-xs">
          <span className="w-2 h-2 rounded-full bg-[#2E6B35] animate-pulse" />
          <span className="text-[#6E6A63]">Storage:</span>
          <span className="font-semibold text-[#1F1A17]">{storageSource}</span>
        </div>

        {/* Admin Identity */}
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-xs font-semibold text-[#1F1A17]">{userName}</span>
          <span className="text-[10px] text-[#7A491D] font-mono">Executive Access</span>
        </div>

        {/* View Storefront Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2 text-xs font-medium text-[#1F1A17] hover:bg-white hover:border-[#7A491D] transition-all flex items-center gap-1.5"
        >
          <span>View Store</span>
          <span className="text-[#7A491D]">↗</span>
        </Link>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          type="button"
          className="rounded-xl border border-[#EADFD0] bg-white px-3.5 py-2 text-xs font-medium text-[#9E1015] hover:bg-[#FDF2F2] hover:border-[#E31E24]/30 transition-all cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

