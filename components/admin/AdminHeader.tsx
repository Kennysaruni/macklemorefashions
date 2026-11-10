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
    <header className="rounded-xl border border-[#EADFD0] bg-white p-6 lg:p-7 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Studio Title */}
      <div className="flex items-center gap-5">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <MacklemoreLogo className="h-11 sm:h-12" />
        </Link>
        <div className="h-9 w-[1px] bg-[#EADFD0] hidden sm:block" />
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1F1A17]">
            Admin Studio
          </h1>
          <p className="text-xs text-[#6E6A63] mt-0.5">
            Flagship operations &amp; dual-hub inventory
          </p>
        </div>
      </div>

      {/* User, Vault & Actions */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        {/* Storage Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#FAF9F6] border border-[#EADFD0] text-xs">
          <span className="w-2 h-2 rounded-full bg-[#2E6B35]" />
          <span className="text-[#6E6A63]">Storage:</span>
          <span className="font-semibold text-[#1F1A17]">{storageSource}</span>
        </div>

        {/* Admin Identity */}
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-xs font-semibold text-[#1F1A17]">{userName}</span>
          <span className="text-[11px] text-[#7A491D]">Executive Access</span>
        </div>

        {/* View Storefront Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-[#EADFD0] bg-[#FAF9F6] px-4 py-2.5 text-xs font-medium text-[#1F1A17] hover:bg-white hover:border-[#7A491D] transition-all flex items-center gap-1.5"
        >
          <span>View Store</span>
          <span className="text-[#7A491D]">→</span>
        </Link>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          type="button"
          className="rounded-lg border border-[#EADFD0] bg-white px-4 py-2.5 text-xs font-medium text-[#9E1015] hover:bg-[#FDF2F2] hover:border-[#E31E24]/30 transition-all cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
