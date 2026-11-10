"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LuxuryLoadingIndicatorProps {
  message?: string;
  subMessage?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  blurBackdrop?: boolean;
  className?: string;
}

/**
 * Afro-Luxury Macklemore Loading Indicator
 * Features rotating savannah bronze & gold hairline orbits, center emblem pulse,
 * and warm editorial text transitions for high-end boutique state transitions.
 */
export function LuxuryLoadingIndicator({
  message,
  subMessage,
  size = "md",
  fullScreen = false,
  blurBackdrop = true,
  className = "",
}: LuxuryLoadingIndicatorProps) {
  const sizeConfig = {
    sm: {
      outerSize: "w-10 h-10",
      innerSize: "w-6 h-6",
      centerDot: "w-1.5 h-1.5",
      textSize: "text-xs",
    },
    md: {
      outerSize: "w-16 h-16",
      innerSize: "w-10 h-10",
      centerDot: "w-2.5 h-2.5",
      textSize: "text-sm",
    },
    lg: {
      outerSize: "w-24 h-24",
      innerSize: "w-16 h-16",
      centerDot: "w-3.5 h-3.5",
      textSize: "text-base",
    },
  }[size];

  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-4 text-center select-none ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Animated Concentric Orbits */}
      <div className={`relative ${sizeConfig.outerSize} flex items-center justify-center`}>
        {/* Outer Continuous Rotating Bronze Hairline */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 2.4,
            ease: "linear",
          }}
          className="absolute inset-0 rounded-full border-t border-r border-[#7A491D] border-b-transparent border-l-transparent opacity-80"
        />

        {/* Outer Counter-Rotating Gold Dash Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            repeat: Infinity,
            duration: 3.6,
            ease: "linear",
          }}
          className="absolute -inset-1 rounded-full border border-dashed border-[#D4860B]/40"
        />

        {/* Inner Counter-Rotating Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
            ease: "linear",
          }}
          className={`absolute ${sizeConfig.innerSize} rounded-full border-t border-l border-[#D4860B] border-b-transparent border-r-transparent opacity-90`}
        />

        {/* Center Pulsing Monogram Jewel Motif */}
        <motion.div
          animate={{
            scale: [0.92, 1.12, 0.92],
            opacity: [0.75, 1, 0.75],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative flex items-center justify-center"
        >
          {/* Diamond Jewel */}
          <div className={`${sizeConfig.centerDot} rotate-45 bg-[#E31E24] shadow-sm shadow-[#E31E24]/30`} />
          <div className="absolute w-1 h-1 rotate-45 bg-[#FAF5EE]" />
        </motion.div>

        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 rounded-full bg-radial from-[#D4860B]/10 to-transparent blur-sm pointer-events-none" />
      </div>

      {/* Editorial Message Animation */}
      {(message || subMessage) && (
        <div className="space-y-1 max-w-xs">
          {message && (
            <AnimatePresence mode="wait">
              <motion.div
                key={message}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className={`font-display font-medium tracking-[0.14em] uppercase text-[#1F1A17] ${sizeConfig.textSize}`}
              >
                {message}
              </motion.div>
            </AnimatePresence>
          )}

          {subMessage && (
            <AnimatePresence mode="wait">
              <motion.div
                key={subMessage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="font-mono text-[11px] tracking-wider text-[#7A491D]/80"
              >
                {subMessage}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-6 ${
          blurBackdrop
            ? "backdrop-blur-md bg-[#FAF9F6]/85"
            : "bg-[#FAF9F6]"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border border-[#EADFD0] bg-white/90 p-8 shadow-2xl shadow-stone-300/40"
        >
          {content}
        </motion.div>
      </div>
    );
  }

  return content;
}

