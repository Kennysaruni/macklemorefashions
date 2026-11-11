"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CollectionRecord } from "@/lib/store-data";

interface AdminDropsTabProps {
  collections: CollectionRecord[];
  onToggleLive: (collectionId: string) => void;
  onAddNewDrop?: () => void;
  onDeleteDrop?: (collectionId: string, title: string) => Promise<void> | void;
}

export function AdminDropsTab({
  collections,
  onToggleLive,
  onAddNewDrop,
  onDeleteDrop,
}: AdminDropsTabProps) {
  const [confirmDeleteCol, setConfirmDeleteCol] = useState<CollectionRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!confirmDeleteCol || !onDeleteDrop) return;
    setIsDeleting(true);
    try {
      await onDeleteDrop(confirmDeleteCol.id, confirmDeleteCol.title);
      setConfirmDeleteCol(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-sm border border-[#EADFD0] bg-white p-7 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1F1A17]">
            Collections &amp; Capsule Drops
          </h2>
          <p className="text-xs text-[#6E6A63] mt-0.5">
            Curate seasonal drops, set release countdowns, and toggle live storefront availability
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/collections"
            target="_blank"
            className="rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-4 py-2.5 text-xs font-medium text-[#1F1A17] hover:bg-white hover:border-[#7A491D] transition-colors"
          >
            <span>View Public Storefront →</span>
          </Link>

          {onAddNewDrop && (
            <button
              onClick={onAddNewDrop}
              type="button"
              className="rounded-sm bg-[#7A491D] px-5 py-2.5 text-xs font-semibold tracking-wider text-white uppercase shadow-xs hover:bg-[#5C3614] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>+</span>
              <span>Publish New Drop</span>
            </button>
          )}
        </div>
      </div>

      {/* Drops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => {
          const isLive = col.isDropLive;

          return (
            <div
              key={col.id}
              className="rounded-sm border border-[#EADFD0] bg-white overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
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
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className={`rounded-sm px-2.5 py-1 text-xs font-medium uppercase ${
                        isLive
                          ? "bg-[#2E6B35] text-white"
                          : "bg-[#7A491D] text-white"
                      }`}
                    >
                      {isLive ? "Live on Storefront" : "Vault Locked"}
                    </span>
                    {col.isVipLocked && (
                      <span className="rounded-sm px-2.5 py-1 text-xs font-medium uppercase bg-[#FAF5EE] text-[#7A491D] border border-[#EADFD0]">
                        VIP Only
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#1F1A17]">
                      {col.title}
                    </h3>
                    <span className="text-xs font-mono text-[#7A491D]">
                      {col.seasonCode}
                    </span>
                  </div>

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
                      Fashion House:{" "}
                      <span className="font-medium text-[#1F1A17]">
                        {col.brandName || "Macklemore Fashion"}
                      </span>
                    </div>
                    <div>
                      Slug: <span className="font-mono text-xs text-[#7A491D]">/{col.slug}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-6 py-4 border-t border-[#EADFD0]/60 bg-[#FAF9F6]/50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onToggleLive(col.id)}
                  className={`rounded-sm px-3.5 py-2 text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                    isLive
                      ? "bg-[#FAF5EE] text-[#7A491D] border border-[#EADFD0] hover:bg-[#FDF2F2] hover:text-[#9E1015]"
                      : "bg-[#7A491D] text-white hover:bg-[#5C3614] shadow-xs"
                  }`}
                >
                  {isLive ? "Unpublish" : "Publish Live →"}
                </button>

                {onDeleteDrop && (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteCol(col)}
                    className="text-xs text-[#E31E24] hover:text-[#9E1015] font-medium transition-colors cursor-pointer"
                  >
                    Delete Drop
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteCol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-sm border border-[#EADFD0] bg-white p-7 shadow-2xl space-y-5">
            <div className="border-b border-[#EADFD0]/60 pb-3">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#1F1A17]">
                Delete Capsule Drop
              </h3>
              <p className="text-xs text-[#6E6A63] mt-1">
                Permanent catalog deletion
              </p>
            </div>

            <div className="text-xs text-[#4A4742] space-y-2 leading-relaxed">
              <p>
                Are you sure you want to delete the drop{" "}
                <span className="font-semibold text-[#1F1A17]">
                  &quot;{confirmDeleteCol.title}&quot;
                </span>
                ?
              </p>
              <p className="text-[#9E1015] bg-[#FDF2F2] border border-[#E31E24]/20 p-2.5 rounded-sm">
                Warning: Removing this capsule will remove its lookbook showcase and public storefront collection access.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setConfirmDeleteCol(null)}
                className="rounded-sm border border-[#EADFD0] bg-white px-4 py-2.5 text-xs font-medium text-[#1F1A17] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="rounded-sm bg-[#E31E24] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#B9151A] transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}