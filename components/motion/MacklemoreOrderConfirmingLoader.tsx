"use client";

import React from "react";
import { motion } from "framer-motion";

const THREAD_DOTS = [
  { color: "#D99427", delay: 0 },
  { color: "#217E73", delay: 0.2 },
  { color: "#E05C1A", delay: 0.4 },
  { color: "#35703B", delay: 0.6 },
  { color: "#BA512B", delay: 0.8 },
  { color: "#DEA03F", delay: 1.0 },
  { color: "#5D9E92", delay: 1.2 },
];

interface OrderConfirmingLoaderProps {
  message?: string;
  subMessage?: string;
}

/**
 * Authentic Macklemore Fashions pulsing thread beads loader
 * Directly matching macklemorefashions.com preloader
 */
export function MacklemoreOrderConfirmingLoader({
  message = "Confirming your order...",
  subMessage = "Securing settlement with the payment provider. Please do not close or refresh this page.",
}: OrderConfirmingLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF8ED]/95 backdrop-blur-md p-6 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="rounded-2xl border border-[#EADFD0] bg-white/95 px-8 py-10 shadow-2xl max-w-sm w-full text-center space-y-6"
      >
        {/* The 7 African Thread Beads from macklemorefashions.com */}
        <div className="flex items-center justify-center gap-2.5 py-4">
          {THREAD_DOTS.map((dot, idx) => (
            <motion.span
              key={idx}
              animate={{
                scaleY: [1, 2.5, 1],
                opacity: [0.85, 1, 0.85],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: "easeInOut",
                delay: dot.delay,
              }}
              style={{ backgroundColor: dot.color }}
              className="w-2.5 h-2.5 rounded-full inline-block origin-center"
            />
          ))}
        </div>

        {/* Status Message */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-[#7A491D]">
            Macklemore Fashion
          </div>
          <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#1F1A17]">
            {message}
          </h3>
          <p className="text-xs text-[#6E6A63] leading-relaxed">
            {subMessage}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
