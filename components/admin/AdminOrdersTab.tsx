"use client";

import React, { useState } from "react";
import { formatCurrencyValue, OrderRecord } from "@/lib/store-data";

interface AdminOrdersTabProps {
  orders: OrderRecord[];
  onUpdateOrderStatus: (orderId: string, newStatus: string) => void;
}

const STATUS_FILTERS = [
  "ALL",
  "ALLOCATED_TO_HUB",
  "PAID",
  "DISPATCHED",
  "DELIVERED",
];

export function AdminOrdersTab({
  orders,
  onUpdateOrderStatus,
}: AdminOrdersTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [copiedWaybill, setCopiedWaybill] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.waybillNumber || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "ALL" ||
      order.status.toLowerCase().includes(selectedStatus.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const handleCopyWaybill = (waybill: string) => {
    navigator.clipboard.writeText(waybill);
    setCopiedWaybill(waybill);
    setTimeout(() => setCopiedWaybill(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header & Filter Controls */}
      <div className="rounded-sm border border-[#EADFD0] bg-white p-7 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1F1A17]">
              Customer Orders
            </h2>
            <p className="text-xs text-[#6E6A63] mt-0.5">
              Review international orders, allocate fulfillment hubs, and dispatch waybills
            </p>
          </div>

          <div className="text-xs font-mono text-[#7A491D]">
            {orders.length} orders recorded
          </div>
        </div>

        {/* Search & Filter Buttons */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 pt-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, email, order #, or waybill..."
              className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-4 py-3 text-xs text-[#1F1A17] placeholder:text-[#A8A29E] focus:border-[#7A491D] focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {STATUS_FILTERS.map((st) => {
              const isSelected = selectedStatus === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`rounded-sm px-3.5 py-2 text-xs font-medium transition-all whitespace-nowrap cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#7A491D] text-white shadow-xs"
                      : "bg-[#FAF9F6] border border-[#EADFD0] text-[#6E6A63] hover:text-[#1F1A17] hover:bg-white"
                  }`}
                >
                  {st.replace(/_/g, " ")}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-sm border border-[#EADFD0] bg-white p-16 text-center text-xs text-[#6E6A63]">
          No orders found matching your search.
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const isAllocated = order.status === "ALLOCATED_TO_HUB";

            return (
              <div
                key={order.id}
                className="rounded-sm border border-[#EADFD0] bg-white p-7 shadow-xs hover:shadow-sm transition-all space-y-5"
              >
                {/* Top Bar: Order Number, Date, Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EADFD0]/60 pb-4">
                  <div className="flex items-center gap-4">
                    <span className="font-display text-lg font-bold text-[#1F1A17]">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-[#7A491D]">
                      {order.paymentProvider} · {order.currency}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-[#2E6B35]">
                      {order.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-[#6E6A63]">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                  {/* Client Info */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-[#6E6A63] block">
                      Client &amp; Destination
                    </span>
                    <div className="font-semibold text-sm text-[#1F1A17]">{order.customerName}</div>
                    <div className="text-[#6E6A63]">{order.customerEmail}</div>
                    <div className="text-[#6E6A63]">{order.customerPhone}</div>
                    <div className="text-[#1F1A17] font-medium pt-1">
                      {order.destinationCity}, {order.destinationCountry}
                    </div>
                  </div>

                  {/* Logistics & Waybill */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-[#6E6A63] block">
                      Logistics &amp; Hub
                    </span>
                    <div className="text-[#1F1A17] font-medium">
                      {order.assignedHub === "HUB_A_LAGOS"
                        ? "Lagos Hub (Nigeria)"
                        : "Toronto HQ (Canada)"}
                    </div>
                    <div className="text-[#6E6A63]">Courier: {order.courierPartner}</div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-mono text-xs font-bold text-[#7A491D]">
                        {order.waybillNumber || "Pending Generation"}
                      </span>
                      {order.waybillNumber && (
                        <button
                          type="button"
                          onClick={() => handleCopyWaybill(order.waybillNumber!)}
                          className="rounded-sm bg-[#FAF9F6] border border-[#EADFD0] px-2.5 py-1 text-[11px] text-[#6E6A63] hover:text-[#1F1A17] cursor-pointer"
                        >
                          {copiedWaybill === order.waybillNumber ? "Copied" : "Copy"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Financial Settlement */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-[#6E6A63] block">
                      Settlement Amount
                    </span>
                    <div className="font-display text-2xl font-bold text-[#1F1A17]">
                      {formatCurrencyValue(order.totalAmount, order.currency)}
                    </div>
                    <div className="text-xs text-[#6E6A63]">
                      Shipping: {formatCurrencyValue(order.shippingAmount, order.currency)} · Duties: {formatCurrencyValue(order.dutiesAmount, order.currency)}
                    </div>
                    <div className="text-[11px] text-[#2E6B35] font-mono pt-0.5">
                      Ref: {order.paymentReference}
                    </div>
                  </div>
                </div>

                {/* Items & Actions Row */}
                <div className="pt-4 border-t border-[#EADFD0]/60 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-[#6E6A63]">Items ({order.items.length}):</span>
                    {order.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="rounded-sm bg-[#FAF9F6] border border-[#EADFD0] px-3 py-1.5 text-xs text-[#1F1A17]"
                      >
                        {item.productTitle} (Size: {item.size}, Qty: {item.quantity})
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 ml-auto">
                    {isAllocated ? (
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(order.id, "DISPATCHED")}
                        className="rounded-sm bg-[#7A491D] px-5 py-2.5 text-xs font-semibold text-white uppercase hover:bg-[#5C3614] shadow-xs transition-all cursor-pointer"
                      >
                        Dispatch Waybill
                      </button>
                    ) : (
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                        className="rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-4 py-2 text-xs text-[#1F1A17] cursor-pointer focus:outline-none focus:border-[#7A491D]"
                      >
                        <option value="ALLOCATED_TO_HUB">Allocated to Hub</option>
                        <option value="DISPATCHED">Dispatched</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
