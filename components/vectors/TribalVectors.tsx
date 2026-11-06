"use client";

import React from "react";

/**
 * Digitized Pure-Vector Reconstruction of the Macklemore Fashion Boutique Logo
 * Extracted from the official macklemorefashions.com M + M + African print master mark:
 * - Double-peaked geometric M monogram with internal Savannah Bronze (#7A491D) chevron rail,
 *   Macklemore Crimson (#E31E24) & Terracotta (#E05C1A) Ankara geometric weave, and right triangular monolith.
 * - Custom architectural wordmark M/\CKLEMO̲RE with open-apex chevron 'A' and underlined 'O'.
 */
export function MacklemoreLogo({
  className = "h-10 w-auto",
  showWordmark = true,
  showSubline = false,
  theme = "dark",
}: {
  className?: string;
  showWordmark?: boolean;
  showSubline?: boolean;
  theme?: "dark" | "light";
}) {
  const textColor = theme === "dark" ? "#F6F5F1" : "#0B0B0C";

  return (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      {/* Double-M Geometric Crest */}
      <svg
        viewBox="0 0 120 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-9 w-auto shrink-0"
        aria-label="Macklemore Fashion Monogram"
      >
        {/* Left Outer Peak (Ankara Crimson + Gold Geometric Weave) */}
        <path
          d="M8 66L44 8L64 38L84 8L90 17L64 56L44 26L19 66H8Z"
          fill="#E31E24"
        />
        {/* Crisp 1px Tribal Geometric Striations inside Left Peak */}
        <path
          d="M22 44H34M28 34H40M35 23H48M50 28L58 28M70 28H80"
          stroke="#D4860B"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {/* Inner Parallel Chevron Rail (Savannah Bronze #7A491D from Swatch 3) */}
        <path
          d="M24 66L46 31L64 58L93 14"
          stroke="#D4860B"
          strokeWidth="2.5"
          strokeLinecap="square"
        />
        <path
          d="M28 66L47 36L64 61L95 16"
          stroke="#7A491D"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
        {/* Right Solid Triangular Monolith with African Geometric Teeth */}
        <path d="M66 66L96 20L116 66H66Z" fill="#E05C1A" />
        <path
          d="M72 62H110M76 54H106M82 44H101M88 34H96"
          stroke="#D4860B"
          strokeWidth="1.2"
        />
        {/* Base Triangular Teeth inside Monolith */}
        <path
          d="M73 66L77 58L81 66M83 66L87 58L91 66M93 66L97 58L101 66M103 66L107 58L111 66"
          stroke="#E31E24"
          strokeWidth="1.4"
        />
        <line
          x1="66"
          y1="66"
          x2="116"
          y2="66"
          stroke="#F6F5F1"
          strokeWidth="1"
          strokeOpacity="0.6"
        />
      </svg>

      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline tracking-[0.14em] font-display font-bold text-base sm:text-lg">
            <span style={{ color: textColor }}>M</span>
            {/* Stylized Open-Apex Chevron 'A' from Logo */}
            <span className="inline-block text-[#E31E24] font-extrabold mx-[1px]">
              /\
            </span>
            <span style={{ color: textColor }}>CKLEM</span>
            <span className="relative inline-block text-[#E31E24]">
              O
              <span className="absolute left-0 right-0 -bottom-[2px] h-[1.5px] bg-[#D4860B]" />
            </span>
            <span style={{ color: textColor }}>RE</span>
          </div>
          {showSubline ? (
            <div className="flex items-center gap-2 mt-1">
              <span className="h-[1px] w-3 bg-[#7A491D]" />
              <span className="font-mono text-[9px] tracking-[0.26em] uppercase text-stone-400">
                FASHION BOUTIQUE // TORONTO · LAGOS
              </span>
              <span className="h-[1px] w-3 bg-[#7A491D]" />
            </div>
          ) : (
            <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#D4860B] mt-0.5">
              [ LAGOS // TORONTO ]
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Horizontal 1px Hairline Tribal Section Separator
 * Digitized from the .divider & .pattern-bg geometry on macklemorefashions.com
 */
export function TribalSectionSeparator({
  label,
  theme = "dark",
  className = "",
}: {
  label?: string;
  theme?: "dark" | "light";
  className?: string;
}) {
  const lineClass =
    theme === "dark" ? "bg-stone-800" : "bg-neutral-300";
  const tickStroke = theme === "dark" ? "#3F3D3A" : "#C7C3B8";

  return (
    <div
      className={`relative w-full flex items-center justify-between py-3 select-none ${className}`}
      aria-hidden="true"
    >
      {/* Left Geometric Node */}
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rotate-45 border border-[#D4860B]" />
        <svg className="w-8 h-3" viewBox="0 0 32 12" fill="none">
          <path
            d="M0 6H32M6 1L11 6L6 11M16 1L21 6L16 11"
            stroke={tickStroke}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Left Hairline */}
      <div className={`flex-1 h-[1px] ${lineClass}`} />

      {/* Center Ankara Diamond & Optional Technical Label */}
      <div className="px-4 flex items-center gap-3">
        <svg className="w-5 h-3" viewBox="0 0 20 12" fill="none">
          <path
            d="M2 6H18M12 1L17 6L12 11"
            stroke="#D4860B"
            strokeWidth="1"
            strokeOpacity="0.6"
          />
        </svg>
        <span className="w-2 h-2 rotate-45 bg-[#E05C1A] border border-[#D4860B]" />
        {label && (
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#D4860B]">
            {label}
          </span>
        )}
        {label && (
          <span className="w-2 h-2 rotate-45 bg-[#E31E24] border border-[#D4860B]" />
        )}
        <svg className="w-5 h-3" viewBox="0 0 20 12" fill="none">
          <path
            d="M2 6H18M8 1L3 6L8 11"
            stroke="#D4860B"
            strokeWidth="1"
            strokeOpacity="0.6"
          />
        </svg>
      </div>

      {/* Right Hairline */}
      <div className={`flex-1 h-[1px] ${lineClass}`} />

      {/* Right Geometric Node */}
      <div className="flex items-center gap-1.5">
        <svg className="w-8 h-3" viewBox="0 0 32 12" fill="none">
          <path
            d="M0 6H32M26 1L21 6L26 11M16 1L11 6L16 11"
            stroke={tickStroke}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="w-1.5 h-1.5 rotate-45 border border-[#D4860B]" />
      </div>
    </div>
  );
}

/**
 * Vertical 1px Hairline Rail Divider for Editorial Columns
 */
export function TribalRailDivider({
  className = "",
  theme = "dark",
}: {
  className?: string;
  theme?: "dark" | "light";
}) {
  const strokeColor = theme === "dark" ? "#292524" : "#D6D3CD";
  return (
    <div
      className={`relative flex flex-col items-center justify-between self-stretch w-[12px] select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <span className="w-1.5 h-1.5 rotate-45 border border-[#D4860B]/60 bg-[#0B0B0C]" />
      <div
        className="w-[1px] flex-1"
        style={{ backgroundColor: strokeColor }}
      />
      <svg className="w-3 h-8 my-1 shrink-0" viewBox="0 0 12 32" fill="none">
        <path
          d="M6 0V32M1 8L6 13L11 8M1 24L6 19L11 24"
          stroke="#D4860B"
          strokeOpacity="0.55"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <rect
          x="6"
          y="13.5"
          width="3.5"
          height="3.5"
          transform="rotate(45 6 13.5)"
          fill="#E05C1A"
        />
      </svg>
      <div
        className="w-[1px] flex-1"
        style={{ backgroundColor: strokeColor }}
      />
      <span className="w-1.5 h-1.5 rotate-45 border border-[#D4860B]/60 bg-[#0B0B0C]" />
    </div>
  );
}

/**
 * Low-Opacity (5-8%) Architectural Tribal Corner Watermark
 * Digitized directly from the 80x80 SVG pattern on macklemorefashions.com:
 * concentric circles (r=16, r=8, r=3), cardinal axes, diagonal ticks, and quadratic arcs,
 * fused with the Macklemore chevron lattice.
 */
export function TribalCornerWatermark({
  position = "top-right",
  opacity = 0.06,
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
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
      className={`pointer-events-none select-none absolute w-56 h-56 sm:w-72 sm:h-72 ${posClasses} ${className}`}
      aria-hidden="true"
    >
      {/* Outer Architectural Grid Frame */}
      <path
        d="M0 1H239V240M40 0V240M80 0V240M120 0V240M160 0V240M200 0V240M0 40H240M0 80H240M0 120H240M0 160H240M0 200H240"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeDasharray="2 4"
      />
      {/* Concentric Ankara Rings from macklemorefashions.com pattern-bg */}
      <circle cx="160" cy="80" r="64" stroke="#D4860B" strokeWidth="1" />
      <circle cx="160" cy="80" r="42" stroke="currentColor" strokeWidth="1" />
      <circle cx="160" cy="80" r="20" stroke="#E05C1A" strokeWidth="1" />
      <circle cx="160" cy="80" r="6" stroke="#E31E24" strokeWidth="1" />

      {/* Cardinal Axis Lines */}
      <line x1="160" y1="0" x2="160" y2="160" stroke="currentColor" strokeWidth="1" />
      <line x1="80" y1="80" x2="240" y2="80" stroke="currentColor" strokeWidth="1" />

      {/* Diagonal Craft Ticks & Quadratic Arcs */}
      <path
        d="M96 16L124 44M224 16L196 44M96 144L124 116M224 144L196 116"
        stroke="#D4860B"
        strokeWidth="1"
      />
      <path
        d="M120 0 Q160 40 200 0M120 160 Q160 120 200 160"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Double-M Chevron Watermark Overlay */}
      <path
        d="M110 190L145 130L165 162L185 130L220 190"
        stroke="#D4860B"
        strokeWidth="1"
      />
      <path
        d="M120 190L145 146L165 174L185 146L210 190"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

