"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LandingSplashLoader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on client once per session to maintain snappy subsequent navigations
    try {
      const hasSeenSplash = sessionStorage.getItem("mkm_splash_seen");
      if (!hasSeenSplash) {
        sessionStorage.setItem("mkm_splash_seen", "true");
        const showTimer = setTimeout(() => {
          setIsVisible(true);
        }, 10);
        const hideTimer = setTimeout(() => {
          setIsVisible(false);
        }, 1800);
        return () => {
          clearTimeout(showTimer);
          clearTimeout(hideTimer);
        };
      }
    } catch {
      // Fallback if sessionStorage is disabled
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#FAF5EE] text-[#1F1A17] p-6 text-center select-none"
        >
          {/* Animated Concentric Orbits from macklemorefashions.com */}
          <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
            {/* Outer continuous rotating bronze hairline */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "linear" }}
              className="absolute inset-0 rounded-full border-t border-r border-[#7A491D] border-b-transparent border-l-transparent opacity-80"
            />
            {/* Outer counter-rotating dashed gold ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 4.2, ease: "linear" }}
              className="absolute -inset-1.5 rounded-full border border-dashed border-[#D4860B]/50"
            />
            {/* Inner counter-rotating ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 2.0, ease: "linear" }}
              className="absolute inset-3 rounded-full border-t border-l border-[#D4860B] border-b-transparent border-r-transparent opacity-90"
            />
            {/* Center pulsing diamond jewel */}
            <motion.div
              animate={{ scale: [0.92, 1.15, 0.92], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center"
            >
              <div className="w-3 h-3 rotate-45 bg-[#E31E24] shadow-sm shadow-[#E31E24]/40" />
              <div className="absolute w-1 h-1 rotate-45 bg-[#FAF5EE]" />
            </motion.div>
          </div>

          {/* Typography from macklemorefashions.com */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-3 max-w-md"
          >
            <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#7A491D]">
              Macklemore Fashion · Afro-Luxury
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1F1A17] uppercase">
              We&apos;re weaving something beautiful.
            </h1>
            <p className="text-sm font-medium tracking-wide text-[#7A491D]">
              Something good is coming.
            </p>
            <p className="text-xs text-[#6E6A63] leading-relaxed max-w-sm mx-auto pt-1">
              Crafted with the same care and artistry as our garments.
            </p>
            <div className="pt-2 text-[10px] uppercase font-bold tracking-[0.2em] text-[#A69E91]">
              Wear your culture. Own your story.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
