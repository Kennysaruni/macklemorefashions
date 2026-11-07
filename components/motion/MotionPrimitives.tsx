"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useInView,
  type Variants,
} from "framer-motion";
import Lenis from "lenis";

const EDITORIAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const FAST_EXIT_EASE: [number, number, number, number] = [0.32, 0, 0.67, 0];

/**
 * 1. GLOBAL LENIS SMOOTH SCROLL PROVIDER
 * Calibrated for 60fps+ hardware-accelerated rendering without scroll hitching.
 * Automatically disables wheel hijacking on touch devices so native momentum scrolling excels.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Disable smooth scrolling on touch devices or when reduced motion is preferred
    if (isTouchDevice || prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      autoRaf: false,
      prevent: (node: HTMLElement) =>
        node?.getAttribute("data-native-scroll") === "true" ||
        node?.hasAttribute("data-lenis-prevent"),
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

/**
 * 2. REUSABLE <CurtainImage /> PRIMITIVE
 * - Uses next/image with `fill` inside an explicit aspect-ratio / relative container so it never collapses to 0x0.
 * - Executes the Masked Clip-Path Curtain Reveal:
 *   Initial: clipPath: 'inset(100% 0% 0%)', scale: 1.06
 *   In-View: clipPath: 'inset(0% 0% 0%)', scale: 1
 *   Transition: duration 1.1s, cubic-bezier [0.16, 1, 0.3, 1]
 *   Viewport: { once: true, margin: "-10%" } observed on the unclipped outer container.
 * - Includes skeleton pulse while loading, automatic unoptimized fallback if remote proxy times out, and graceful 404 fallback UI.
 */
export function CurtainImage({
  src,
  secondarySrc,
  alt,
  aspectClass = "aspect-[3/4]",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  delay = 0,
  duration = 1.1,
  className = "",
  imgClassName = "object-cover object-top",
  children,
}: {
  src: string;
  secondarySrc?: string;
  alt: string;
  aspectClass?: string;
  sizes?: string;
  priority?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
  imgClassName?: string;
  children?: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [errorSrc, setErrorSrc] = useState<string | null>(null);
  const [revealedForSrc, setRevealedForSrc] = useState<string | null>(
    priority ? src : null
  );
  const [secondaryError, setSecondaryError] = useState(false);
  const [animComplete, setAnimComplete] = useState(false);

  const isLoaded = loadedSrc === src;
  const hasError = errorSrc === src;
  const isScrollRevealed = priority || revealedForSrc === src;

  // Trigger the curtain reveal strictly as the user scrolls the clothing item into the viewport
  useEffect(() => {
    if (typeof window === "undefined" || priority) return;
    const el = containerRef.current;
    if (!el) return;

    const initialScrollY = window.scrollY;
    let userHasScrolled = false;

    const checkViewportAndReveal = () => {
      if (!userHasScrolled) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      const visibleRatio = rect.height > 0 ? visibleHeight / rect.height : 0;

      // Reveal when at least 25% of the item is visible inside the viewport
      // and its top edge is at least 85px above the bottom of the screen
      if (rect.top <= vh - 85 && rect.bottom >= 60 && visibleRatio >= 0.25) {
        setRevealedForSrc(src);
      } else if (rect.top > vh + 20) {
        // Reset when scrolled back above the item so scrolling down again replays the transition
        setRevealedForSrc((prev) => (prev === src ? null : prev));
        setAnimComplete(false);
      }
    };

    const handleScroll = () => {
      if (Math.abs(window.scrollY - initialScrollY) >= 4) {
        userHasScrolled = true;
      }
      checkViewportAndReveal();
    };

    const handleGesture = () => {
      userHasScrolled = true;
      window.requestAnimationFrame(checkViewportAndReveal);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleGesture, { passive: true });
    window.addEventListener("touchmove", handleGesture, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleGesture);
      window.removeEventListener("touchmove", handleGesture);
    };
  }, [src, priority]);

  // Actively preload the image off-DOM so browser clip-path optimizations never delay image fetching
  useEffect(() => {
    if (typeof window === "undefined" || !src) return;
    let cancelled = false;
    const preloader = new window.Image();
    preloader.decoding = "async";
    preloader.onload = () => {
      if (!cancelled) setLoadedSrc(src);
    };
    preloader.onerror = () => {
      if (!cancelled) setErrorSrc(src);
    };
    preloader.src = src;

    if (preloader.complete && preloader.naturalWidth > 0) {
      const rafId = window.requestAnimationFrame(() => {
        if (!cancelled) setLoadedSrc(src);
      });
      return () => {
        cancelled = true;
        window.cancelAnimationFrame(rafId);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [src]);

  const hasDistinctSecondary =
    Boolean(secondarySrc) && secondarySrc !== src && !secondaryError;

  // Reveal only when the image has loaded AND the user has scrolled the item into the active viewport
  const shouldReveal = isScrollRevealed && (isLoaded || hasError);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-[#FAF5EE] ${aspectClass} ${className}`}
    >
      {/* Suspense-Style Warm Shimmer Placeholder ONLY while image bytes are actively loading */}
      {!isLoaded && !hasError && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center animate-pulse bg-gradient-to-br from-[#FAF5EE] via-[#F3EAE0] to-[#EADFD0]"
        >
          <span className="w-2.5 h-2.5 rotate-45 bg-[#D4860B]/40" />
        </div>
      )}

      {/* Masked Clip-Path Curtain Reveal Layer (Matches Homepage Hero Transition) */}
      <motion.div
        initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.06 }}
        animate={
          shouldReveal
            ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }
            : { clipPath: "inset(100% 0% 0% 0%)", scale: 1.06 }
        }
        transition={{
          duration,
          delay,
          ease: EDITORIAL_EASE,
        }}
        onAnimationComplete={() => {
          if (shouldReveal) setAnimComplete(true);
        }}
        className={`relative w-full h-full transform-gpu ${
          animComplete ? "" : "will-change-[clip-path,transform]"
        }`}
      >
        {hasError ? (
          /* Graceful Fallback Block if image URL returns 404 */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF5EE] p-6 text-center border border-[#EADFD0]">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rotate-45 bg-[#E31E24]" />
              <span className="w-2 h-2 rotate-45 bg-[#D4860B]" />
              <span className="w-2 h-2 rotate-45 bg-[#1A7A6E]" />
            </div>
            <span className="font-display text-xs font-semibold text-[#1F1A17] line-clamp-2 max-w-[200px]">
              {alt || "Macklemore Fashion"}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#7A491D] mt-1">
              Macklemore Archive
            </span>
          </div>
        ) : (
          <>
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              priority={priority}
              loading="eager"
              unoptimized
              ref={(node) => {
                if (node && node.complete && node.naturalWidth > 0 && !isLoaded) {
                  setLoadedSrc(src);
                }
              }}
              onLoad={() => setLoadedSrc(src)}
              onError={() => setErrorSrc(src)}
              className={`${imgClassName} transform-gpu scale-100 group-hover:scale-[1.04] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                hasDistinctSecondary
                  ? "opacity-100 group-hover:opacity-0"
                  : "opacity-100"
              }`}
            />

            {hasDistinctSecondary && secondarySrc && (
              <Image
                src={secondarySrc}
                alt={`${alt} alternate view`}
                fill
                sizes={sizes}
                loading="lazy"
                unoptimized
                onError={() => setSecondaryError(true)}
                className={`${imgClassName} transform-gpu scale-100 group-hover:scale-[1.04] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover:opacity-100`}
              />
            )}
          </>
        )}
      </motion.div>

      {/* Optional Overlay Badges / Captions */}
      {children}
    </div>
  );
}

/**
 * 3. MASKED CURTAIN REVEAL WRAPPER
 * Observed on an unclipped outer container so IntersectionObserver never deadlocks on inset(100%).
 * Initial: clipPath: 'inset(100% 0% 0%)', scale: 1.06
 * In-View: clipPath: 'inset(0% 0% 0%)', scale: 1
 * Transition: duration: 1.1s, ease: [0.16, 1, 0.3, 1]
 */
export function CurtainReveal({
  children,
  delay = 0,
  duration = 1.1,
  direction = "bottom-up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "bottom-up" | "top-down" | "left-right";
  className?: string;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [animComplete, setAnimComplete] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = outerRef.current;
    if (!el) return;

    const initialScrollY = window.scrollY;
    let userHasScrolled = false;

    const checkViewportAndReveal = () => {
      if (!userHasScrolled) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      const visibleRatio = rect.height > 0 ? visibleHeight / rect.height : 0;

      if (rect.top <= vh - 85 && rect.bottom >= 60 && visibleRatio >= 0.25) {
        setIsRevealed(true);
      } else if (rect.top > vh + 20) {
        setIsRevealed(false);
        setAnimComplete(false);
      }
    };

    const handleScroll = () => {
      if (Math.abs(window.scrollY - initialScrollY) >= 4) {
        userHasScrolled = true;
      }
      checkViewportAndReveal();
    };

    const handleGesture = () => {
      userHasScrolled = true;
      window.requestAnimationFrame(checkViewportAndReveal);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleGesture, { passive: true });
    window.addEventListener("touchmove", handleGesture, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleGesture);
      window.removeEventListener("touchmove", handleGesture);
    };
  }, []);

  const initialClip =
    direction === "bottom-up"
      ? "inset(100% 0% 0%)"
      : direction === "top-down"
      ? "inset(0% 0% 100% 0%)"
      : "inset(0% 100% 0% 0%)";

  const targetClip =
    direction === "bottom-up" ? "inset(0% 0% 0%)" : "inset(0% 0% 0% 0%)";

  return (
    <div ref={outerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ clipPath: initialClip, scale: 1.06 }}
        animate={
          isRevealed
            ? { clipPath: targetClip, scale: 1 }
            : { clipPath: initialClip, scale: 1.06 }
        }
        transition={{
          duration,
          delay,
          ease: EDITORIAL_EASE,
        }}
        onAnimationComplete={() => {
          if (isRevealed) setAnimComplete(true);
        }}
        className={`w-full h-full transform-gpu ${
          animComplete ? "" : "will-change-[clip-path,transform]"
        }`}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * 4. <TextReveal /> & <StaggeredText /> (STAGGERED MASKED TEXT LIFT)
 * - Container: staggerChildren: 0.05s, delayChildren: 0.1s
 * - Children (Words/Lines): y: "115%" to y: "0%"
 * - Transition: duration: 0.8s, easing curve [0.16, 1, 0.3, 1]
 */
export function TextReveal({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0.1,
  stagger = 0.05,
  mode = "words",
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  delay?: number;
  stagger?: number;
  mode?: "words" | "lines";
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [animDone, setAnimDone] = useState(false);

  const tokens = mode === "lines" ? text.split("\n") : text.split(" ");

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const childVariants: Variants = {
    hidden: { y: "115%" },
    visible: {
      y: "0%",
      transition: {
        duration: 0.8,
        ease: EDITORIAL_EASE,
      },
    },
  };

  return (
    // @ts-expect-error Dynamic heading tag ref
    <Tag ref={ref} className={className} aria-label={text}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        onAnimationComplete={() => {
          if (isInView) setAnimDone(true);
        }}
        className="inline"
      >
        {tokens.map((token, idx) => (
          <span
            key={`${token}-${idx}`}
            className="inline-block overflow-hidden align-bottom mr-[0.26em] last:mr-0 pb-[0.04em]"
          >
            <motion.span
              variants={childVariants}
              className={`inline-block transform-gpu ${
                animDone ? "" : "will-change-transform"
              }`}
            >
              {token}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

// Keep StaggeredText exported as an alias to TextReveal for backwards compatibility across all routes
export const StaggeredText = TextReveal;

/**
 * REUSABLE REACT SUSPENSE SKELETON FOR CLOTHING & COLLECTION GRIDS
 */
export function CatalogGridSuspenseFallback({
  count = 6,
  columnsClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}: {
  count?: number;
  columnsClass?: string;
}) {
  return (
    <div className={`grid ${columnsClass} gap-6`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-[#EADFD0] bg-white overflow-hidden"
        >
          <div className="aspect-[3/4] w-full animate-pulse bg-gradient-to-br from-[#FAF5EE] via-[#F3EAE0] to-[#EADFD0]" />
          <div className="p-5 space-y-3">
            <div className="h-3 w-24 rounded-sm bg-[#F3EAE0] animate-pulse" />
            <div className="h-4 w-3/4 rounded-sm bg-[#EADFD0] animate-pulse" />
            <div className="h-8 w-full rounded-md bg-[#FAF5EE] animate-pulse mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 5. <DrawDivider /> (EXPANDING HAIRLINE SEPARATORS & TRIBAL LINES)
 * - Initial: scaleX: 0, originX: 0
 * - In-View: scaleX: 1
 * - Transition: duration: 1.2s, easing curve [0.16, 1, 0.3, 1]
 */
export function DrawDivider({
  className = "h-[1px] w-full bg-[#EADFD0]",
  delay = 0,
  originX = 0,
}: {
  className?: string;
  delay?: number;
  originX?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [animDone, setAnimDone] = useState(false);

  return (
    <div ref={ref} className="w-full overflow-hidden">
      <motion.div
        initial={{ scaleX: 0, originX }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{
          duration: 1.2,
          delay,
          ease: EDITORIAL_EASE,
        }}
        onAnimationComplete={() => {
          if (isInView) setAnimDone(true);
        }}
        style={{ transformOrigin: `${originX * 100}% 50%` }}
        className={`transform-gpu ${
          animDone ? "" : "will-change-transform"
        } ${className}`}
      />
    </div>
  );
}

/**
 * 6. NON-BOUNCY WEIGHTED DRAWER (Cart, Navigation & Currency)
 * - Open: x: "0%", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
 * - Close: x: "100%", transition: { duration: 0.45, ease: [0.32, 0, 0.67, 0] }
 * - Backdrop fade: opacity: 0 to 1 over 0.3s
 */
export function EditorialDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  widthClass = "max-w-lg",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  widthClass?: string;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop Fade: opacity 0 -> 1 over 0.3s */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 backdrop-blur-sm bg-[#1F1A17]/30"
          />

          {/* Weighted Non-Bouncy Panel */}
          <motion.aside
            data-native-scroll="true"
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{
              x: "0%",
              transition: { duration: 0.7, ease: EDITORIAL_EASE },
            }}
            exit={{
              x: "100%",
              transition: { duration: 0.45, ease: FAST_EXIT_EASE },
            }}
            className={`absolute top-0 right-0 bottom-0 w-full max-w-[100vw] ${widthClass} bg-[#FFFDF9] text-[#1F1A17] border-l border-[#EADFD0] sm:rounded-l-lg shadow-2xl flex flex-col justify-between overflow-x-hidden transform-gpu will-change-transform`}
          >
            {/* Drawer Header */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#EADFD0] flex items-center justify-between gap-3 bg-[#FAF5EE] sm:rounded-tl-lg">
              <div className="min-w-0">
                {subtitle && (
                  <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#7A491D] block truncate">
                    {subtitle}
                  </span>
                )}
                <h3 className="font-display text-base sm:text-lg font-semibold tracking-tight text-[#1F1A17] mt-0.5 truncate">
                  {title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                className="w-9 h-9 shrink-0 rounded-md border border-[#E2D6C5] bg-white hover:border-[#E31E24] hover:bg-[#FAF5EE] flex items-center justify-center transition-all duration-200 cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
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
              </button>
            </div>

            {/* Drawer Body */}
            <div
              data-native-scroll="true"
              data-lenis-prevent
              className="flex-1 overflow-y-auto overflow-x-hidden divide-y divide-[#EADFD0]"
            >
              {children}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
