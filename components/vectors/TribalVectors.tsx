"use client";

import React from "react";
import { motion } from "framer-motion";
import { DrawDivider } from "@/components/motion/MotionPrimitives";

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
        className="h-9 sm:h-12 max-w-[165px] sm:max-w-none w-auto object-contain object-left transition-transform duration-300 hover:scale-[1.02]"
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
 * Multi-Color Tribal Geometric Ribbon (Infinite Left-to-Right Motion)
 * Reflects the exact warm colors of the Macklemore Fashion logo:
 * Crimson (#E31E24), Gold (#D4860B), Terracotta (#E05C1A), Savannah Bronze (#7A491D), and Teal (#1A7A6E).
 * Uses a single native SVG <pattern> tiled across a 2400px viewBox animated on the GPU compositor
 * (`translate3d(-50%, 0, 0)` -> `translate3d(0%, 0, 0)`) with `content-visibility: auto` so off-screen
 * ribbons pause painting automatically and consume minimal memory.
 */
export function TribalPatternRibbon({ className = "" }: { className?: string }) {
  const rawId = React.useId();
  const patternId = `macklemore-tribal-weave-${rawId.replace(/:/g, "")}`;

  return (
    <div
      className={`tribal-ribbon-viewport w-full overflow-hidden select-none bg-[#FAF5EE] ${className}`}
      aria-hidden="true"
    >
      <div className="animate-tribal-ltr">
        <svg
          viewBox="0 0 2400 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-3.5 sm:h-4 block"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id={patternId}
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
          <rect width="2400" height="18" fill={`url(#${patternId})`} />
        </svg>
      </div>
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
      <div className="flex-1">
        <DrawDivider
          originX={0}
          className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#E5DEC9] to-[#D4860B]/60"
        />
      </div>

      <div className="flex items-center gap-2.5 px-3 py-1 rounded-md bg-[#FAF5EE] border border-[#EDE3D5] shrink-0">
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

      <div className="flex-1">
        <DrawDivider
          originX={0}
          delay={0.08}
          className="h-[1px] w-full bg-gradient-to-l from-transparent via-[#E5DEC9] to-[#D4860B]/60"
        />
      </div>
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

/**
 * Morphing Luxury Hamburger <-> Close (X) Icon in Macklemore Fashion Logo Colors
 * Smoothly transitions the 3 bars (Crimson #E31E24, Gold #D4860B, Bronze #7A491D) and
 * diamond accents into an X close icon and back.
 */
export function MacklemoreMenuToggleIcon({
  isOpen,
  className = "w-6 h-6",
}: {
  isOpen: boolean;
  className?: string;
}) {
  const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Top Crimson Bar -> Morphs to Top-Left to Bottom-Right Diagonal */}
      <motion.line
        initial={false}
        animate={{
          x1: isOpen ? 5 : 3,
          y1: isOpen ? 5 : 6.5,
          x2: isOpen ? 19 : 17.5,
          y2: isOpen ? 19 : 6.5,
        }}
        transition={{ duration: 0.45, ease: easeCurve }}
        stroke="#E31E24"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <motion.polygon
        points="20,4.5 22,6.5 20,8.5 18,6.5"
        initial={false}
        animate={{
          opacity: isOpen ? 0 : 1,
          scale: isOpen ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: easeCurve }}
        fill="#D4860B"
      />

      {/* Middle Royal Gold Bar -> Collapses to Center while Diamond Glides to X Intersection */}
      <motion.line
        initial={false}
        animate={{
          x1: isOpen ? 12 : 5.5,
          y1: 12,
          x2: isOpen ? 12 : 21,
          y2: 12,
          opacity: isOpen ? 0 : 1,
        }}
        transition={{ duration: 0.35, ease: easeCurve }}
        stroke="#D4860B"
        strokeWidth="2.1"
        strokeLinecap="round"
      />

      {/* Bottom Savannah Bronze Bar -> Morphs to Bottom-Left to Top-Right Diagonal */}
      <motion.line
        initial={false}
        animate={{
          x1: isOpen ? 5 : 3,
          y1: isOpen ? 19 : 17.5,
          x2: isOpen ? 19 : 16.5,
          y2: isOpen ? 5 : 17.5,
          stroke: isOpen ? "#1F1A17" : "#7A491D",
        }}
        transition={{ duration: 0.45, ease: easeCurve }}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <motion.polygon
        points="19.5,15.5 21.5,17.5 19.5,19.5 17.5,17.5"
        initial={false}
        animate={{
          opacity: isOpen ? 0 : 1,
          scale: isOpen ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: easeCurve }}
        fill="#1A7A6E"
      />

      {/* Center Diamond Jewel -> Glides from left bar node into the center of the X */}
      <motion.polygon
        points="12,9.5 14.5,12 12,14.5 9.5,12"
        initial={false}
        animate={{
          x: isOpen ? 0 : -8.5,
          scale: isOpen ? 1 : 0.65,
          fill: isOpen ? "#D4860B" : "#E31E24",
        }}
        transition={{ duration: 0.45, ease: easeCurve }}
      />
    </svg>
  );
}

/**
 * Custom Luxury Hamburger Icon in Macklemore Fashion Logo Colors
 * Crimson (#E31E24), Royal Gold (#D4860B), Savannah Bronze (#7A491D), and Teal (#1A7A6E)
 */
export function MacklemoreHamburgerIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Top Crimson Bar with Gold Diamond Node */}
      <line
        x1="3"
        y1="6.5"
        x2="17"
        y2="6.5"
        stroke="#E31E24"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polygon points="20,4.5 22,6.5 20,8.5 18,6.5" fill="#D4860B" />

      {/* Middle Royal Gold Bar with Center Crimson Diamond */}
      <line
        x1="5"
        y1="12"
        x2="21"
        y2="12"
        stroke="#D4860B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polygon points="3.5,10.5 5,12 3.5,13.5 2,12" fill="#E31E24" />

      {/* Bottom Savannah Bronze Bar with Teal Diamond Node */}
      <line
        x1="3"
        y1="17.5"
        x2="16"
        y2="17.5"
        stroke="#7A491D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polygon points="19.5,15.5 21.5,17.5 19.5,19.5 17.5,17.5" fill="#1A7A6E" />
    </svg>
  );
}

/**
 * Custom Luxury Close (X) Icon in Macklemore Fashion Logo Colors
 */
export function MacklemoreCloseIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <line
        x1="5.5"
        y1="5.5"
        x2="18.5"
        y2="18.5"
        stroke="#1F1A17"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="18.5"
        y1="5.5"
        x2="5.5"
        y2="18.5"
        stroke="#E31E24"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polygon points="12,9.5 14.5,12 12,14.5 9.5,12" fill="#D4860B" />
    </svg>
  );
}

/**
 * Iconic Luxury Shopping Bag / Atelier Tote Icon
 */
export function MacklemoreBagIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Arched Handle */}
      <path
        d="M8.5 8V6.5C8.5 4.567 10.067 3 12 3C13.933 3 15.5 4.567 15.5 6.5V8"
        stroke="#D4860B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Sculpted Luxury Tote Body */}
      <path
        d="M4.8 8H19.2L20.4 20.2C20.46 20.68 20.08 21.1 19.6 21.1H4.4C3.92 21.1 3.54 20.68 3.6 20.2L4.8 8Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      {/* Signature Macklemore Diamond Clasp */}
      <polygon points="12,11.5 14.2,14 12,16.5 9.8,14" fill="#D4860B" />
      <polygon points="12,12.8 13,14 12,15.2 11,14" fill="#E31E24" />
    </svg>
  );
}

/**
 * Compact Luxury Currency / Globe Medallion Icon
 */
export function MacklemoreCurrencyIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7.5" stroke="#D4860B" strokeWidth="1.5" />
      <ellipse cx="10" cy="10" rx="3.6" ry="7.5" stroke="#7A491D" strokeWidth="1.2" />
      <line x1="2.8" y1="10" x2="17.2" y2="10" stroke="#7A491D" strokeWidth="1.2" />
      <polygon points="10,7.8 12.2,10 10,12.2 7.8,10" fill="#E31E24" />
    </svg>
  );
}
