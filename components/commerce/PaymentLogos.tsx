"use client";

import React from "react";

export function StripeLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Stripe"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M59.64 14.28c0-4.48-2.18-8.02-6.52-8.02-4.36 0-6.98 3.54-6.98 8s2.88 8.04 7.42 8.04c2.2 0 3.86-.5 5.1-1.34v-3.32c-1.24.74-2.7 1.14-4.52 1.14-1.8 0-3.38-.68-3.62-2.5h9.12v-2zm-9.12-1.34c0-1.8 1.08-2.54 2.58-2.54 1.48 0 2.48.74 2.48 2.54h-5.06zm-7.9-6.42a4.42 4.42 0 00-3.2 1.34l-.2-1.08h-3.88v20.94l4.34-.92.02-5.18c.98.8 2.06 1.16 3.02 1.16 3.54 0 6.64-2.8 6.64-8.12 0-5.14-3.14-8.14-6.74-8.14zm-1.12 12.3c-1.14 0-1.84-.42-2.32-.98l-.04-6.24c.54-.6 1.24-1.02 2.36-1.02 1.76 0 2.92 1.68 2.92 4.1 0 2.48-1.16 4.14-2.92 4.14zM32.54 5.34l4.36-.92V.68l-4.36.92v3.74zm0 1.44h4.36v15.24h-4.36V6.78zm-6.26 1.78l-.26-1.78h-3.9v15.24h4.34v-9.6c1.02-1.34 2.74-1.1 3.28-.9v-4.14c-.6-.22-2.52-.46-3.46 1.18zm-8.8-6.14l-4.26.9v3.46h-2.5v3.66h2.5v7.24c0 3.84 2.54 5.2 6.14 5.2 1.94 0 3.4-.38 4.22-.84v-3.48c-.76.32-4.8 1.5-4.8-2.02v-6.1h4.8V8.68h-4.8V2.42l-1.24.26v-.26zm-11.4 8.7c-1.38-.72-2.3-1.18-2.3-2.04 0-.74.68-1.28 1.84-1.28 1.48 0 3.04.5 4.34 1.28V7.24C8.42 6.6 6.94 6.26 5.42 6.26 1.88 6.26 0 8.16 0 11.08c0 3.48 2.7 4.7 5.48 5.64 1.54.54 2.06.94 2.06 1.54 0 .76-.78 1.34-1.98 1.34-1.68 0-3.56-.7-5.06-1.64v3.68c1.66.78 3.46 1.14 5.06 1.14 3.74 0 5.86-1.84 5.86-4.82 0-3.34-2.48-4.6-5.34-5.64z"
        fill="#635BFF"
      />
    </svg>
  );
}

export function PaystackLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Official Paystack 3 horizontal rounded bars icon */}
      <svg
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 shrink-0"
        aria-hidden="true"
      >
        <rect y="2" width="28" height="4" rx="2" fill="#00C3F7" />
        <rect y="10" width="20" height="4" rx="2" fill="#00C3F7" />
        <rect y="18" width="28" height="4" rx="2" fill="#00C3F7" />
        <rect y="26" width="14" height="2" rx="1" fill="#00C3F7" />
      </svg>
      <span className="font-bold text-base tracking-tight text-[#001C3F]">
        paystack
      </span>
    </div>
  );
}

export function VisaBadge({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-white border border-[#E0E0E0] shadow-2xs ${className}`}>
      <svg
        viewBox="0 0 36 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-auto"
        aria-label="Visa"
      >
        <path
          d="M14.52 0.32L9.5 11.68H6.22L3.8 2.76C3.66 2.22 3.52 2.02 3.1 1.8C2.42 1.42 1.14 1.08 0 0.82L0.08 0.32H5.32C6.02 0.32 6.64 0.8 6.78 1.62L8.06 8.44L11.3 0.32H14.52ZM27.24 7.96C27.26 4.92 23.06 4.76 23.08 3.4C23.08 2.98 23.48 2.54 24.38 2.42C24.82 2.36 26.04 2.3 27.38 2.92L27.98 0.8C27.16 0.5 26.1 0.22 24.76 0.22C21.72 0.22 19.64 1.84 19.62 4.14C19.6 5.86 21.14 6.82 22.32 7.4C23.52 7.98 23.94 8.38 23.94 8.9C23.92 9.72 22.96 10.08 22.06 10.08C20.5 10.08 19.6 9.64 18.88 9.3L18.26 11.48C19.06 11.84 20.54 12.16 22.06 12.18C25.32 12.18 27.22 10.56 27.24 7.96ZM35.34 11.68H38.22L35.7 0.32H33.18C32.6 0.32 32.1 0.66 31.9 1.18L27.24 11.68H30.46L31.1 9.92H35.04L35.34 11.68ZM31.98 7.52L33.62 3.02L34.56 7.52H31.98ZM19.26 0.32L16.74 11.68H13.66L16.18 0.32H19.26Z"
          fill="#1A1F71"
        />
      </svg>
    </div>
  );
}

export function MastercardBadge({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-white border border-[#E0E0E0] shadow-2xs ${className}`}>
      <svg
        viewBox="0 0 24 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-auto"
        aria-label="Mastercard"
      >
        <circle cx="7" cy="8" r="7" fill="#EB001B" />
        <circle cx="17" cy="8" r="7" fill="#F79E1B" />
        <path
          d="M12 2.76A6.98 6.98 0 0114.7 8 6.98 6.98 0 0112 13.24 6.98 6.98 0 019.3 8 6.98 6.98 0 0112 2.76z"
          fill="#FF5F00"
        />
      </svg>
    </div>
  );
}

export function ApplePayBadge({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center px-2 py-0.5 rounded bg-[#111111] text-white border border-black shadow-2xs ${className}`}>
      <svg viewBox="0 0 38 16" fill="white" className="h-3.5 w-auto" aria-label="Apple Pay">
        {/* Apple icon */}
        <path d="M6.28 7.82c-.02-1.64 1.34-2.44 1.4-2.48-.76-1.12-1.96-1.28-2.38-1.3-1.02-.1-1.98.6-2.5.6-.52 0-1.32-.58-2.16-.58-1.12 0-2.14.64-2.72 1.64-1.16 2.02-.3 5.02.82 6.66.56.8 1.22 1.7 2.08 1.66.84-.04 1.16-.54 2.16-.54 1.02 0 1.3.54 2.18.52.9-.02 1.46-.82 2.02-1.62.64-.94.9-1.84.92-1.9-.02-.02-1.78-.68-1.82-2.66zM4.94 3.02c.46-.56.76-1.34.68-2.12-.66.02-1.46.44-1.92 1-.4.46-.76 1.26-.66 2.02.74.06 1.44-.34 1.9-.9z" />
        {/* Pay text */}
        <path d="M12.9 13V4.76h2.82c1.78 0 2.92 1.08 2.92 2.76 0 1.7-1.16 2.78-2.92 2.78h-1.6V13H12.9zm1.22-3.8h1.56c1.1 0 1.76-.62 1.76-1.68 0-1.04-.66-1.66-1.76-1.66h-1.56v3.34zm8.68 3.9c-.84 0-1.52-.34-1.86-.92h-.04v3.18h-1.2V7.42h1.16v.88h.04c.36-.6 1.04-.98 1.88-.98 1.44 0 2.44 1.16 2.44 2.89s-1 2.89-2.42 2.89zm-.26-1.06c.92 0 1.54-.74 1.54-1.83 0-1.08-.62-1.83-1.54-1.83-.92 0-1.54.74-1.54 1.83 0 1.1.62 1.83 1.54 1.83zm8.38-.82c0 1.6-1.2 2.66-2.9 2.66-1.44 0-2.48-.7-2.62-1.76h1.22c.12.5.64.84 1.4.84.86 0 1.46-.46 1.46-1.12v-.44l-1.92-.12c-1.62-.1-2.48-.78-2.48-1.98 0-1.28.98-2.08 2.36-2.08 1.06 0 1.86.42 2.18 1.08h.04V7.42h1.18v4.8h.06zm-1.22-1.5v-.54c-.26-.4-.82-.66-1.46-.66-.82 0-1.34.42-1.34 1.08 0 .6.48.98 1.4.98l1.4-.04v-.82zm7.98 2.22l-1.94-5.3h1.3l1.24 3.76h.04l1.24-3.76h1.28l-2.92 7.74h-1.26l1.02-2.44z" />
      </svg>
    </div>
  );
}

export function GooglePayBadge({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center px-2 py-0.5 rounded bg-white text-[#5F6368] border border-[#DADCE0] shadow-2xs ${className}`}>
      <div className="flex items-center gap-1 font-medium text-xs">
        {/* Google G */}
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" aria-label="Google Pay">
          <path
            fill="#4285F4"
            d="M14.8 8.18c0-.5-.04-1-.12-1.46H8v2.76h3.82a3.26 3.26 0 01-1.42 2.14v1.78h2.3c1.34-1.24 2.1-3.06 2.1-5.22z"
          />
          <path
            fill="#34A853"
            d="M8 15c1.92 0 3.52-.64 4.7-1.72l-2.3-1.78c-.64.42-1.46.68-2.4.68-1.84 0-3.4-1.24-3.96-2.92H1.66v1.84A7.04 7.04 0 008 15z"
          />
          <path
            fill="#FBBC05"
            d="M4.04 9.26A4.2 4.2 0 013.82 8c0-.44.08-.86.22-1.26V4.9H1.66A7.04 7.04 0 001 8c0 1.14.28 2.22.78 3.16l2.26-1.9z"
          />
          <path
            fill="#EA4335"
            d="M8 3.82c1.04 0 1.98.36 2.72 1.06l2.04-2.04C11.52 1.7 9.92 1 8 1 4.72 1 1.9 2.84.78 5.64l2.38 1.84c.56-1.68 2.12-2.92 3.96-2.92z"
          />
        </svg>
        <span className="font-semibold text-[#3C4043] tracking-tight">Pay</span>
      </div>
    </div>
  );
}

export function LinkBadge({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#00D66F] text-[#0A2540] font-bold text-xs tracking-tight shadow-2xs ${className}`}>
      <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
        <path d="M6.354 5.5H4a2.5 2.5 0 000 5h2.354a.5.5 0 010 1H4a3.5 3.5 0 010-7h2.354a.5.5 0 110 1zM9.646 10.5H12a2.5 2.5 0 000-5H9.646a.5.5 0 010-1H12a3.5 3.5 0 010 7H9.646a.5.5 0 010-1z" />
        <path d="M5 8a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5A.5.5 0 015 8z" />
      </svg>
      <span>link</span>
    </div>
  );
}
