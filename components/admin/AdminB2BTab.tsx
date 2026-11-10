"use client";

import React, { useState } from "react";
import { B2BInquiryRecord, B2BLeadStatus } from "@/lib/store-data";

interface AdminB2BTabProps {
  inquiries: B2BInquiryRecord[];
  onUpdateStatus: (inquiryId: string, newStatus: B2BLeadStatus) => void;
}

const STATUS_OPTIONS: B2BLeadStatus[] = [
  "NEW",
  "IN_REVIEW",
  "MEETING_SCHEDULED",
  "PARTNERED",
  "ARCHIVED",
];

export function AdminB2BTab({
  inquiries,
  onUpdateStatus,
}: AdminB2BTabProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const filteredInquiries = inquiries.filter((inq) => {
    if (selectedStatus === "ALL") return true;
    return inq.status === selectedStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-sm border border-[#EADFD0] bg-white p-7 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1F1A17]">
            B2B Wholesale &amp; Stockist Desk
          </h2>
          <p className="text-xs text-[#6E6A63] mt-0.5">
            Boutique inquiries, global department store stockists, and distribution leads
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {["ALL", ...STATUS_OPTIONS].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`rounded-sm px-3.5 py-2 text-xs font-medium transition-all whitespace-nowrap cursor-pointer select-none ${
                selectedStatus === st
                  ? "bg-[#7A491D] text-white shadow-xs"
                  : "bg-[#FAF9F6] border border-[#EADFD0] text-[#6E6A63] hover:text-[#1F1A17] hover:bg-white"
              }`}
            >
              {st.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      {filteredInquiries.length === 0 ? (
        <div className="rounded-sm border border-[#EADFD0] bg-white p-16 text-center text-xs text-[#6E6A63]">
          No B2B wholesale enquiries in this view.
        </div>
      ) : (
        <div className="space-y-5">
          {filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className="rounded-sm border border-[#EADFD0] bg-white p-7 shadow-xs hover:shadow-sm transition-all space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EADFD0]/60 pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#1F1A17]">
                    {inq.brandOrCompanyName}
                  </h3>
                  <div className="text-xs text-[#6E6A63]">
                    Contact: <span className="font-medium text-[#1F1A17]">{inq.contactName}</span> ({inq.contactRole}) · {inq.email} · {inq.phone}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={inq.status}
                    onChange={(e) =>
                      onUpdateStatus(inq.id, e.target.value as B2BLeadStatus)
                    }
                    className="rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-4 py-2 text-xs font-medium text-[#7A491D] cursor-pointer focus:outline-none focus:border-[#7A491D]"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>

                  <span className="text-xs text-[#6E6A63]">
                    {new Date(inq.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                <div>
                  <span className="text-xs font-medium text-[#6E6A63] block">
                    Headquarters
                  </span>
                  <div className="font-medium text-[#1F1A17] text-sm pt-0.5">{inq.headquartersCountry}</div>
                </div>

                <div>
                  <span className="text-xs font-medium text-[#6E6A63] block">
                    Volume Tier
                  </span>
                  <div className="font-medium text-[#1F1A17] text-sm pt-0.5">{inq.annualVolumeTier}</div>
                </div>

                <div>
                  <span className="text-xs font-medium text-[#6E6A63] block">
                    Store / Website
                  </span>
                  <div className="font-medium text-[#7A491D] text-sm pt-0.5 truncate">
                    {inq.websiteUrl || "Direct Showroom"}
                  </div>
                </div>
              </div>

              {inq.message && (
                <div className="rounded-sm border border-[#EADFD0] bg-[#FAF9F6] p-4 text-xs text-[#4A4742] leading-relaxed">
                  <span className="font-semibold text-[#1F1A17] block mb-1">
                    Boutique Proposal:
                  </span>
                  {inq.message}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
