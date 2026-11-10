"use client";

import React from "react";
import Link from "next/link";
import { CollectionRecord } from "@/lib/store-data";

interface AdminDropsTabProps {
  collections: CollectionRecord[];
  onToggleLive: (collectionId: string) => void;
}

export function AdminDropsTab({
  collections,
  onToggleLive,
}: AdminDropsTabProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-xl border border-[#EADFD0] bg-white p-7 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1F1A17]">
            Collections &amp; Capsule Drops
          </h2>
          <p className="text-xs text-[#6E6A63] mt-0.5">
            Curate seasonal drops, set release countdowns, and toggle live storefront availability
          </p>
        </div>

        <Link
          href="/collections"
          target="_blank"
          className="rounded-lg border border-[#EADFD0] bg-[#FAF9F6] px-5 py-2.5 text-xs font-medium text-[#1F1A17] hover:bg-white hover:border-[#7A491D] transition-colors"
        >
          View Public Collections →
        </Link>
      </div>

      {/* Drops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => {
          const isLive = col.isDropLive;

          return (
            <div
              key={col.id}
              className="rounded-xl border border-[#EADFD0] bg-white overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                {/* Hero Banner */}
                <div className="relative aspect-16/9 w-full bg-[#FAF9F6] overflow-hidden border-b border-[#EADFD0]/60">
                  <img
                    src={col.heroImageUrl}
                    alt={col.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-medium uppercase ${
                        isLive
                          ? "bg-[#2E6B35] text-white"
                          : "bg-[#7A491D] text-white"
                      }`}
                    >
                      {isLive ? "Live on Storefront" : "Vault Locked"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3.5">
                  <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#1F1A17]">
                    {col.title}
                  </h3>
                  <p className="text-xs text-[#6E6A63] line-clamp-2 leading-relaxed">
                    {col.manifesto}
                  </p>

                  <div className="pt-2 text-xs text-[#6E6A63] space-y-1">
                    <div>
                      Launch Date:{" "}
                      <span className="font-medium text-[#1F1A17]">
                        {new Date(col.releaseDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div>
                      Season: <span className="font-medium text-[#1F1A17]">{col.seasonCode}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggle Live Action */}
              <div className="px-6 py-4 border-t border-[#EADFD0]/60 bg-[#FAF9F6]/50 flex items-center justify-between">
                <span className="text-xs text-[#6E6A63]">Storefront Visibility:</span>
                <button
                  type="button"
                  onClick={() => onToggleLive(col.id)}
                  className={`rounded-lg px-4.5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                    isLive
                      ? "bg-[#FAF5EE] text-[#7A491D] border border-[#EADFD0] hover:bg-[#FDF2F2] hover:text-[#9E1015]"
                      : "bg-[#7A491D] text-white hover:bg-[#5C3614] shadow-xs"
                  }`}
                >
                  {isLive ? "Unpublish Drop" : "Publish Live →"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
