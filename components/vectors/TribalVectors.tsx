"use client";

import React from "react";

/**
 * Official Macklemore Fashion Boutique Logo Asset
 * Uses the cropped /assets/fashion-Boutique-logo-1.svg asset directly.
 */
export function MacklemoreLogo({
  className = "",
  showSubline = false,
}: {
  className?: string;
  showWordmark?: boolean;
  showSubline?: boolean;
  theme?: "dark" | "light";
}) {
  return (
    <div className={`inline-flex flex-col justify-center select-none ${className}`}>
      <img
        src="/assets/fashion-Boutique-logo-1.svg"
        alt="Macklemore Fashion"
        className="h-11 sm:h-13 w-auto object-contain object-left transition-transform duration-300 hover:scale-[1.02]"
      />
      {showSubline && (
        <span className="text-[10px] tracking-[0.18em] uppercase text-[#7A491D] font-medium mt-1">
          Canada · Nigeria · Global Fashion
        </span>
      )}
    </div>
  );
}

/**
 * Multi-Color Tribal Geometric Ribbon
 * Reflects the exact warm colors of the Macklemore Fashion logo:
 * Crimson (#E31E24), Gold (#D4860B), Terracotta (#E05C1A), Savannah Bronze (#7A491D), and Teal (#1A7A6E).
 */
export function TribalPatternRibbon({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-3.5 sm:h-4"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="macklemore-tribal-weave"
            x="0"
            y="0"
            width="120"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            {/* Warm Cream Base */}
            <rect width="120" height="18" fill="#FAF5EE" />
            {/* Top & Bottom Gold Hairlines */}
            <line x1="0" y1="1" x2="120" y2="1" stroke="#D4860B" strokeWidth="1" strokeOpacity="0.45" />
            <line x1="0" y1="17" x2="120" y2="17" stroke="#7A491D" strokeWidth="1" strokeOpacity="0.35" />

            {/* Multi-Color Chevron & Diamond Motif from the Macklemore Logo */}
            <path d="M0 15L12 3L24 15H18L12 8L6 15H0Z" fill="#E31E24" />
            <polygon points="36,3 44,9 36,15 28,9" fill="#D4860B" />
            <polygon points="36,6 40,9 36,12 32,9" fill="#FFFDF9" />

            <path d="M48 15L60 3L72 15H66L60 8L54 15H48Z" fill="#7A491D" />
            <polygon points="84,3 92,9 84,15 76,9" fill="#E05C1A" />
            <polygon points="84,6 88,9 84,12 80,9" fill="#D4860B" />

            <path d="M96 15L104 4L112 15H96Z" fill="#1A7A6E" />
            <circle cx="116" cy="9" r="2.2" fill="#E31E24" />
          </pattern>
        </defs>
        <rect width="1200" height="18" fill="url(#macklemore-tribal-weave)" />
      </svg>
    </div>
  );
}

/**
 * Warm Tribal Section Separator with Colorful Logo Diamond Accents
 */
export function TribalSectionSeparator({
  label,
  className = "",
}: {
  label?: string;
  theme?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={`relative w-full flex items-center justify-center gap-4 py-4 select-none ${className}`}
      aria-hidden="true"
    >
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#E5DEC9] to-[#D4860B]/50" />

      <div className="flex items-center gap-2.5 px-3 py-1 rounded-md bg-[#FAF5EE] border border-[#EDE3D5]">
        <span className="w-2 h-2 rotate-45 bg-[#E31E24]" />
        <span className="w-2 h-2 rotate-45 bg-[#D4860B]" />
        {label && (
          <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#7A491D] px-1">
            {label}
          </span>
        )}
        <span className="w-2 h-2 rotate-45 bg-[#1A7A6E]" />
        <span className="w-2 h-2 rotate-45 bg-[#7A491D]" />
      </div>

      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#E5DEC9] to-[#D4860B]/50" />
    </div>
  );
}

/**
 * Vertical Tribal Divider
 */
export function TribalRailDivider({
  className = "",
}: {
  className?: string;
  theme?: "dark" | "light";
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-between self-stretch w-3 select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <span className="w-2 h-2 rotate-45 bg-[#D4860B]" />
      <div className="w-[1px] flex-1 bg-[#EAE0D2]" />
      <span className="w-2.5 h-2.5 rotate-45 bg-[#E31E24]" />
      <div className="w-[1px] flex-1 bg-[#EAE0D2]" />
      <span className="w-2 h-2 rotate-45 bg-[#1A7A6E]" />
    </div>
  );
}

/**
 * Warm Multi-Color Tribal Corner Watermark
 */
export function TribalCornerWatermark({
  position = "top-right",
  opacity = 0.08,
  className = "",
}: {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  opacity?: number;
  className?: string;
}) {
  const posClasses = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0 -scale-x-100",
    "bottom-right": "bottom-0 right-0 -scale-y-100",
    "bottom-left": "bottom-0 left-0 -scale-x-100 -scale-y-100",
  }[position];

  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
      className={`pointer-events-none select-none absolute w-48 h-48 sm:w-64 sm:h-64 ${posClasses} ${className}`}
      aria-hidden="true"
    >
      <circle cx="150" cy="70" r="56" stroke="#D4860B" strokeWidth="1.5" />
      <circle cx="150" cy="70" r="38" stroke="#7A491D" strokeWidth="1.2" />
      <circle cx="150" cy="70" r="20" stroke="#E05C1A" strokeWidth="1.5" />
      <circle cx="150" cy="70" r="6" fill="#E31E24" />
      <path
        d="M95 155L130 100L150 130L170 100L205 155"
        stroke="#E31E24"
        strokeWidth="2"
      />
      <path
        d="M106 155L133 114L150 138L167 114L194 155"
        stroke="#1A7A6E"
        strokeWidth="1.5"
      />
    </svg>
  );
}
