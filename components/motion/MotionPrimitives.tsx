"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * 1. INERTIAL SMOOTH SCROLL PROVIDER (Lenis Physics Engine)
 * Provides weighted, tactile editorial scroll dampening across the storefront.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    let rafId: number | null = null;
    let targetScroll = window.scrollY;
    let currentScroll = window.scrollY;
    let isTicking = false;
    const dampFactor = 0.11; // Weighted editorial inertia

    const onScroll = () => {
      if (!isTicking) {
        currentScroll = window.scrollY;
        targetScroll = window.scrollY;
      }
    };

    const update = () => {
      const diff = targetScroll - currentScroll;
      if (Math.abs(diff) > 0.5) {
        currentScroll += diff * dampFactor;
        window.scrollTo(0, currentScroll);
        rafId = requestAnimationFrame(update);
      } else {
        currentScroll = targetScroll;
        isTicking = false;
      }
    };

    const onWheel = (e: WheelEvent) => {
      // Allow native scrolling inside modal/drawer overflow containers
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-native-scroll='true']")) {
        return;
      }
      // Only apply on non-touch desktop precision wheel events
      if (Math.abs(e.deltaY) < 4) return;
      e.preventDefault();
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      targetScroll = Math.max(
        0,
        Math.min(maxScroll, targetScroll + e.deltaY * 0.92)
      );
      if (!isTicking) {
        isTicking = true;
        rafId = requestAnimationFrame(update);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <>{children}</>;
}

/**
 * 2. MASKED CURTAIN REVEAL
 * Initial: clipPath: 'inset(100% 0% 0% 0%)'
 * Target:  clipPath: 'inset(0% 0% 0% 0%)'
 * Easing:  cubic-bezier(0.16, 1, 0.3, 1) over 0.9s - 1.2s
 */
export function CurtainReveal({
  children,
  delay = 0,
  duration = 1.05,
  direction = "bottom-up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "bottom-up" | "top-down" | "left-right";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const initialClip =
    direction === "bottom-up"
      ? "inset(100% 0% 0% 0%)"
      : direction === "top-down"
      ? "inset(0% 0% 100% 0%)"
      : "inset(0% 100% 0% 0%)";

  return (
    <div
      ref={ref}
      className={`will-change-[clip-path,transform] ${className}`}
      style={{
        clipPath: revealed ? "inset(0% 0% 0% 0%)" : initialClip,
        transform: revealed ? "scale(1)" : "scale(1.04)",
        transitionProperty: "clip-path, transform",
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}

/**
 * 3. STAGGERED TEXT LIFT
 * Section headings and editorial manifestos reveal upward from overflow-hidden
 * containers, staggered at 0.04s intervals with cubic-bezier(0.16, 1, 0.3, 1).
 */
export function StaggeredText({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 0.04,
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const tokens = mode === "lines" ? text.split("\n") : text.split(" ");

  return (
    // @ts-expect-error Dynamic heading tag ref
    <Tag ref={ref} className={className} aria-label={text}>
      {tokens.map((token, idx) => (
        <span
          key={idx}
          className="inline-block overflow-hidden align-bottom mr-[0.26em] last:mr-0"
        >
          <span
            className="inline-block will-change-transform"
            style={{
              transform: visible ? "translate3d(0, 0%, 0)" : "translate3d(0, 112%, 0)",
              opacity: visible ? 1 : 0,
              transitionProperty: "transform, opacity",
              transitionDuration: "0.95s",
              transitionDelay: `${delay + idx * stagger}s`,
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {token}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * 4. SINGLE-AXIS EDITORIAL DRAWER
 * Slides on a single axis with zero rubber-band bounce, anchored by obsidian backdrop blur.
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
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-500 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      aria-hidden={!isOpen}
    >
      {/* Warm Soft Backdrop Blur */}
      <div
        onClick={onClose}
        className="absolute inset-0 backdrop-blur-sm bg-[#1F1A17]/30"
      />

      {/* Single-Axis Panel */}
      <aside
        data-native-scroll="true"
        className={`absolute top-0 right-0 bottom-0 w-full ${widthClass} bg-[#FFFDF9] text-[#1F1A17] border-l border-[#EADFD0] sm:rounded-l-lg shadow-2xl flex flex-col justify-between transition-transform duration-500`}
        style={{
          transform: isOpen ? "translate3d(0%, 0, 0)" : "translate3d(100%, 0, 0)",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#EADFD0] flex items-center justify-between bg-[#FAF5EE] sm:rounded-tl-lg">
          <div>
            {subtitle && (
              <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#7A491D] block">
                {subtitle}
              </span>
            )}
            <h3 className="font-display text-lg font-semibold tracking-tight text-[#1F1A17] mt-0.5">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md border border-[#E2D6C5] bg-white hover:bg-[#1F1A17] hover:text-white hover:border-[#1F1A17] text-[#1F1A17] text-xs font-medium transition-all duration-200 cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Drawer Body */}
        <div
          data-native-scroll="true"
          className="flex-1 overflow-y-auto divide-y divide-[#EADFD0]"
        >
          {children}
        </div>
      </aside>
    </div>
  );
}

