"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Animated Tick (Checkmark) with Afro-Luxury Tribal Geometric Patterns
 * Incorporates Macklemore brand colors (Crimson, Gold, Teal, Bronze)
 * and sacred geometric tribal diamond/ring motifs.
 */
export function TribalAnimatedCheckmark({ className = "" }: { className?: string }) {
  const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Central Emblem Container */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Outer Rotating Tribal Dashed Gold Ring */}
        <motion.div
          initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 360, scale: 1, opacity: 1 }}
          transition={{
            rotate: { repeat: Infinity, duration: 28, ease: "linear" },
            scale: { duration: 0.5, ease: easeCurve },
            opacity: { duration: 0.3 },
          }}
          className="absolute inset-0 rounded-full border border-dashed border-[#D4860B]/50"
        />

        {/* Concentric Bronze Thin Ring */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 0.45, ease: easeCurve }}
          className="absolute inset-1.5 rounded-full border border-[#7A491D]/30"
        />

        {/* 4 Cardinal Tribal Diamond Accents in Macklemore Palette */}
        {/* Top: Crimson */}
        <motion.div
          initial={{ scale: 0, y: 4, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.35, ease: easeCurve }}
          className="absolute -top-1 w-2 h-2 rotate-45 bg-[#E31E24] shadow-2xs"
        />
        {/* Bottom: Deep Teal */}
        <motion.div
          initial={{ scale: 0, y: -4, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.35, ease: easeCurve }}
          className="absolute -bottom-1 w-2 h-2 rotate-45 bg-[#1A7A6E] shadow-2xs"
        />
        {/* Left: Royal Gold */}
        <motion.div
          initial={{ scale: 0, x: 4, opacity: 0 }}
          animate={{ scale: 1, x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.35, ease: easeCurve }}
          className="absolute -left-1 w-2 h-2 rotate-45 bg-[#D4860B] shadow-2xs"
        />
        {/* Right: Savannah Bronze */}
        <motion.div
          initial={{ scale: 0, x: -4, opacity: 0 }}
          animate={{ scale: 1, x: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.35, ease: easeCurve }}
          className="absolute -right-1 w-2 h-2 rotate-45 bg-[#7A491D] shadow-2xs"
        />

        {/* Inner Emerald Badge Container */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 340,
            damping: 22,
          }}
          className="w-13 h-13 rounded-full bg-[#EBF5ED] border border-[#2E6B35]/30 flex items-center justify-center shadow-xs"
        >
          {/* Animated SVG Checkmark Path (Draws itself smoothly) */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-7 h-7 text-[#2E6B35]"
            aria-hidden="true"
          >
            <motion.path
              d="M5.5 12.5L9.5 16.5L18.5 7.5"
              fill="none"
              stroke="#2E6B35"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                delay: 0.3,
                duration: 0.6,
                ease: easeCurve,
              }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Flanking Tribal Geometric Diamond Row */}
      <div className="flex items-center justify-center gap-2 mt-3.5">
        <span className="w-1.5 h-1.5 rotate-45 bg-[#E31E24]" />
        <span className="w-1.5 h-1.5 rotate-45 bg-[#D4860B]" />
        <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-[#D4860B]/60 to-transparent" />
        <span className="w-1.5 h-1.5 rotate-45 bg-[#1A7A6E]" />
        <span className="w-1.5 h-1.5 rotate-45 bg-[#7A491D]" />
      </div>
    </div>
  );
}
