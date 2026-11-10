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
import { LuxuryLoadingIndicator } from "@/components/motion/LuxuryLoadingIndicator";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check if session is already active
  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data?.authenticated) {
            router.replace("/admin");
          } else {
            setIsCheckingSession(false);
          }
        }
      })
      .catch(() => {
        if (isMounted) setIsCheckingSession(false);
      });

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

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-[#1F1A17]">
        <LuxuryLoadingIndicator
          size="lg"
          message="Verifying Studio Session"
          subMessage="Connecting to Macklemore Flagship Vault"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1F1A17] flex flex-col justify-between relative overflow-hidden selection:bg-[#EADFD0] selection:text-[#7A491D]">
      {/* Moving Multi-Color Tribal Geometric Ribbon at Top Border */}
      <TribalPatternRibbon className="h-2.5 sm:h-3 w-full shrink-0" />

      {/* Decorative Warm Tribal Watermarks in Corners */}
      <TribalCornerWatermark position="top-right" opacity={0.06} />
      <TribalCornerWatermark position="bottom-left" opacity={0.06} />

      {/* Top Boutique Bar */}
      <header className="px-6 py-6 sm:px-12 flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 group transition-transform hover:scale-[1.01]"
        >
          <MacklemoreLogo className="h-10" />
        </Link>
        <Link
          href="/"
          className="text-xs font-mono tracking-widest text-[#7A491D] hover:text-[#5C3614] transition-colors uppercase"
        >
          Back to Store
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg rounded-xl border border-[#EADFD0] bg-white p-8 sm:p-12 shadow-xl shadow-stone-200/50"
        >
          {/* Header */}
          <div className="text-center space-y-2.5 mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#1F1A17]">
              Admin Studio
            </h1>
            <p className="text-sm text-[#6E6A63] leading-relaxed">
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
                className="mb-6 overflow-hidden"
              >
                <div className="rounded-lg border border-[#E31E24]/20 bg-[#FDF2F2] p-3.5 text-xs text-[#9E1015] flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#E31E24] shrink-0 mt-1" />
                  <span>{errorMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full rounded-lg border border-[#EADFD0] bg-[#FAF9F6] px-4 py-3 text-sm text-[#1F1A17] placeholder:text-[#A8A29E] transition-all focus:border-[#7A491D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7A491D]/20"
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
                className="w-full rounded-lg border border-[#EADFD0] bg-[#FAF9F6] px-4 py-3 text-sm text-[#1F1A17] placeholder:text-[#A8A29E] transition-all focus:border-[#7A491D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7A491D]/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 rounded-lg bg-[#7A491D] py-3.5 px-6 font-display text-sm font-semibold tracking-widest text-white uppercase shadow-md shadow-[#7A491D]/20 transition-all hover:bg-[#5C3614] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Entering Studio...</span>
                </>
              ) : (
                <span>Enter Studio</span>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-[#EADFD0]/60 text-center">
            <p className="text-[11px] text-[#8C827A]">
              Protected Afro-Luxury Hub · Encrypted via Neon DB &amp; JWT
            </p>
          </div>
        </motion.div>
      </main>

      {/* Subtle Bottom Footer */}
      <footer className="px-6 py-4 text-center text-[11px] text-[#8C827A] z-10">
        © {new Date().getFullYear()} Macklemore Fashion · All Rights Reserved
      </footer>
    </div>
  );
}

