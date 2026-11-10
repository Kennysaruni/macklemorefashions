"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MacklemoreLogo,
  TribalCornerWatermark,
  TribalPatternRibbon,
} from "@/components/vectors/TribalVectors";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check if session is already active (silent background redirect, zero loading screen block)
  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data?.authenticated) {
          router.replace("/admin");
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both your email and administrator passkey.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data?.ok) {
        router.push("/admin");
      } else {
        setErrorMessage(
          data?.error || "Incorrect email or security passkey. Please verify and try again."
        );
        setIsSubmitting(false);
      }
    } catch {
      setErrorMessage("Unable to connect to the authentication service. Please check your network.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1F1A17] flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden selection:bg-[#EADFD0] selection:text-[#7A491D]">
      {/* Decorative Subtle Corner Watermarks */}
      <TribalCornerWatermark position="top-right" opacity={0.05} />
      <TribalCornerWatermark position="bottom-left" opacity={0.05} />

      {/* Main Login Card with Tribal Ribbon Crowned at Top */}
      <div className="w-full max-w-md rounded-sm border border-[#EADFD0] bg-white shadow-xl shadow-stone-200/40 overflow-hidden z-10">
        {/* Moving Multi-Color Tribal Geometric Ribbon directly on top of login card */}
        <TribalPatternRibbon className="h-3 w-full shrink-0" />

        {/* Card Content */}
        <div className="p-8 sm:p-10">
          {/* Logo in the middle beneath ribbon */}
          <div className="flex justify-center mb-6">
            <Link href="/" className="inline-flex transition-transform hover:scale-[1.02]">
              <MacklemoreLogo className="h-12 w-auto" />
            </Link>
          </div>

          {/* Heading */}
          <div className="text-center space-y-1.5 mb-7">
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-[#1F1A17]">
              Admin Studio
            </h1>
            <p className="text-xs text-[#6E6A63] leading-relaxed">
              Sign in to manage collections, live inventory, orders, and partner fashion houses.
            </p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 overflow-hidden"
              >
                <div className="rounded-sm border border-[#E31E24]/20 bg-[#FDF2F2] p-3 text-xs text-[#9E1015] flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#E31E24] shrink-0 mt-1" />
                  <span>{errorMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-xs font-medium tracking-wide text-[#4A4742]"
              >
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@macklemorefashions.com"
                className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#1F1A17] placeholder:text-[#A8A29E] transition-all focus:border-[#7A491D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7A491D]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-medium tracking-wide text-[#4A4742]"
                >
                  Security Passkey
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#7A491D] hover:underline cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#1F1A17] placeholder:text-[#A8A29E] transition-all focus:border-[#7A491D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7A491D]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 rounded-sm bg-[#7A491D] py-3 px-6 font-display text-xs font-semibold tracking-widest text-white uppercase shadow-sm transition-all hover:bg-[#5C3614] active:translate-y-0 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Entering Studio...</span>
                </>
              ) : (
                <span>Enter Studio</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Back to Storefront Link */}
      <div className="mt-6 text-center z-10">
        <Link
          href="/"
          className="text-xs font-mono tracking-widest text-[#7A491D] hover:text-[#5C3614] transition-colors uppercase"
        >
          Back to Storefront
        </Link>
      </div>
    </div>
  );
}
