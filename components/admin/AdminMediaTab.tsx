"use client";

import React, { useState } from "react";

interface AdminMediaTabProps {
  neonStorage: {
    bucket: string;
    totalObjects: number;
    totalMegabytes: number;
    recentObjects?: {
      key: string;
      size: number;
      lastModified: string;
      url: string;
    }[];
  } | null;
}

export function AdminMediaTab({ neonStorage }: AdminMediaTabProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");

  const objects = neonStorage?.recentObjects || [];

  const filteredObjects = objects.filter((obj) =>
    obj.key.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleCopy = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="rounded-sm border border-[#EADFD0] bg-white p-7 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1F1A17]">
              Photos &amp; Cloud Media Vault
            </h2>
            <p className="text-xs text-[#6E6A63] mt-0.5">
              High-resolution lookbooks and editorial garment flatlays stored in Neon S3
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#2E6B35]">
              Bucket: {neonStorage?.bucket || "macklemore-fashions"}
            </span>
            <span className="text-xs text-[#6E6A63]">·</span>
            <span className="text-xs font-mono text-[#7A491D]">
              {neonStorage?.totalObjects || 44} Assets · {neonStorage?.totalMegabytes || 48} MB
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="pt-1">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search media files by name or key..."
            className="w-full max-w-md rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-4 py-3 text-xs text-[#1F1A17] placeholder:text-[#A8A29E] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Media Grid */}
      {filteredObjects.length === 0 ? (
        <div className="rounded-sm border border-[#EADFD0] bg-white p-16 text-center text-xs text-[#6E6A63]">
          No media objects found.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {filteredObjects.map((obj) => (
            <div
              key={obj.key}
              className="rounded-sm border border-[#EADFD0] bg-white overflow-hidden shadow-xs hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              {/* Thumbnail */}
              <div className="relative aspect-3/4 w-full bg-[#FAF9F6] overflow-hidden">
                <img
                  src={obj.url}
                  alt={obj.key}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80";
                  }}
                />
              </div>

              {/* Info & Copy */}
              <div className="p-3.5 space-y-2 border-t border-[#EADFD0]/60">
                <div className="text-xs font-medium text-[#1F1A17] truncate" title={obj.key}>
                  {obj.key.replace(/^products\//, "")}
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#6E6A63]">
                  <span>{(obj.size / 1024).toFixed(0)} KB</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(obj.url, obj.key)}
                    className="rounded-sm bg-[#FAF5EE] border border-[#EADFD0] px-2.5 py-1 text-[#7A491D] font-medium hover:bg-white transition-colors cursor-pointer"
                  >
                    {copiedKey === obj.key ? "Copied" : "Copy URL"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
