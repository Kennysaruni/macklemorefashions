"use client";

import React from "react";

/**
 * Official Stripe Wordmark Logo
 * Exact vector from Stripe brand assets
 */
export function StripeLogo({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="54 36 360 150"
      fill="#635BFF"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Stripe"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M414,113.4c0-25.6-12.4-45.8-36.1-45.8c-23.8,0-38.2,20.2-38.2,45.6c0,30.1,17,45.3,41.4,45.3 c11.9,0,20.9-2.7,27.7-6.5v-20c-6.8,3.4-14.6,5.5-24.5,5.5c-9.7,0-18.3-3.4-19.4-15.2h48.9C413.8,121,414,115.8,414,113.4z M364.6,103.9c0-11.3,6.9-16,13.2-16c6.1,0,12.6,4.7,12.6,16H364.6z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M301.1,67.6c-9.8,0-16.1,4.6-19.6,7.8l-1.3-6.2h-22v116.6l25-5.3l0.1-28.3c3.6,2.6,8.9,6.3,17.7,6.3 c17.9,0,34.2-14.4,34.2-46.1C335.1,83.4,318.6,67.6,301.1,67.6z M295.1,136.5c-5.9,0-9.4-2.1-11.8-4.7l-0.1-37.1 c2.6-2.9,6.2-4.9,11.9-4.9c9.1,0,15.4,10.2,15.4,23.3C310.5,126.5,304.3,136.5,295.1,136.5z"
      />
      <polygon points="223.8,61.7 248.9,56.3 248.9,36 223.8,41.3" />
      <rect x="223.8" y="69.3" width="25.1" height="87.5" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M196.9,76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7,15.9-6.3,19-5.2v-23C214.5,68.1,202.8,65.9,196.9,76.7z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M146.9,47.6l-24.4,5.2l-0.1,80.1c0,14.8,11.1,25.7,25.9,25.7c8.2,0,14.2-1.5,17.5-3.3V135 c-3.2,1.3-19,5.9-19-8.9V90.6h19V69.3h-19L146.9,47.6z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M79.3,94.7c0-3.9,3.2-5.4,8.5-5.4c7.6,0,17.2,2.3,24.8,6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6 C67.5,67.6,54,78.2,54,95.9c0,27.6,38,23.2,38,35.1c0,4.6-4,6.1-9.6,6.1c-8.3,0-18.9-3.4-27.3-8v23.8c9.3,4,18.7,5.7,27.3,5.7 c20.8,0,35.1-10.3,35.1-28.2C117.4,100.6,79.3,105.9,79.3,94.7z"
      />
    </svg>
  );
}

/**
 * Official Paystack Logo
 * Official cyan triple horizontal bars with dark wordmark
 */
export function PaystackLogo({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
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
      <span className="font-bold text-base tracking-tight text-[#001C3F] lowercase">
        paystack
      </span>
    </div>
  );
}

/**
 * Official Visa Logo Badge
 */
export function VisaBadge({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-white border border-[#E0E0E0] shadow-2xs ${className}`}>
      <svg
        role="img"
        viewBox="0 0 24 24"
        fill="#1A1F71"
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-auto"
        aria-label="Visa"
      >
        <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" />
      </svg>
    </div>
  );
}

/**
 * Official Mastercard Logo Badge
 */
export function MastercardBadge({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-white border border-[#E0E0E0] shadow-2xs ${className}`}>
      <svg
        role="img"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-auto"
        aria-label="MasterCard"
      >
        <path
          d="M11.343 18.031c.058.049.12.098.181.146-1.177.783-2.59 1.238-4.107 1.238C3.32 19.416 0 16.096 0 12c0-4.095 3.32-7.416 7.416-7.416 1.518 0 2.931.456 4.105 1.238-.06.051-.12.098-.165.15C9.6 7.489 8.595 9.688 8.595 12c0 2.311 1.001 4.51 2.748 6.031z"
          fill="#EB001B"
        />
        <path
          d="M16.584 4.584c-1.52 0-2.931.456-4.105 1.238.06.051.12.098.165.15C14.4 7.489 15.405 9.688 15.405 12c0 2.31-1.001 4.507-2.748 6.031-.058.049-.12.098-.181.146 1.177.783 2.588 1.238 4.107 1.238C20.68 19.416 24 16.096 24 12c0-4.094-3.32-7.416-7.416-7.416z"
          fill="#F79E1B"
        />
        <path
          d="M12 6.174c-.096.075-.189.15-.28.231C10.156 7.764 9.169 9.765 9.169 12c0 2.236.987 4.236 2.551 5.595.09.08.185.158.28.232.096-.074.189-.152.28-.232 1.563-1.359 2.551-3.359 2.551-5.595 0-2.235-.987-4.236-2.551-5.595-.09-.08-.184-.156-.28-.231z"
          fill="#FF5F00"
        />
      </svg>
    </div>
  );
}

/**
 * Official Apple Pay Logo Badge
 */
export function ApplePayBadge({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center px-2 py-0.5 rounded bg-black border border-black shadow-2xs ${className}`}>
      <svg
        viewBox="0 0 512 210.2"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-auto"
        aria-label="Apple Pay"
      >
        <path d="M93.6,27.1C87.6,34.2,78,39.8,68.4,39c-1.2-9.6,3.5-19.8,9-26.1c6-7.3,16.5-12.5,25-12.9 C103.4,10,99.5,19.8,93.6,27.1 M102.3,40.9c-13.9-0.8-25.8,7.9-32.4,7.9c-6.7,0-16.8-7.5-27.8-7.3c-14.3,0.2-27.6,8.3-34.9,21.2 c-15,25.8-3.9,64,10.6,85c7.1,10.4,15.6,21.8,26.8,21.4c10.6-0.4,14.8-6.9,27.6-6.9c12.9,0,16.6,6.9,27.8,6.7 c11.6-0.2,18.9-10.4,26-20.8c8.1-11.8,11.4-23.3,11.6-23.9c-0.2-0.2-22.4-8.7-22.6-34.3c-0.2-21.4,17.5-31.6,18.3-32.2 C123.3,42.9,107.7,41.3,102.3,40.9 M182.6,11.9v155.9h24.2v-53.3h33.5c30.6,0,52.1-21,52.1-51.4c0-30.4-21.1-51.2-51.3-51.2H182.6z M206.8,32.3h27.9c21,0,33,11.2,33,30.9c0,19.7-12,31-33.1,31h-27.8V32.3z M336.6,169c15.2,0,29.3-7.7,35.7-19.9h0.5v18.7h22.4V90.2 c0-22.5-18-37-45.7-37c-25.7,0-44.7,14.7-45.4,34.9h21.8c1.8-9.6,10.7-15.9,22.9-15.9c14.8,0,23.1,6.9,23.1,19.6v8.6l-30.2,1.8 c-28.1,1.7-43.3,13.2-43.3,33.2C298.4,155.6,314.1,169,336.6,169z M343.1,150.5c-12.9,0-21.1-6.2-21.1-15.7c0-9.8,7.9-15.5,23-16.4 l26.9-1.7v8.8C371.9,140.1,359.5,150.5,343.1,150.5z M425.1,210.2c23.6,0,34.7-9,44.4-36.3L512,54.7h-24.6l-28.5,92.1h-0.5 l-28.5-92.1h-25.3l41,113.5l-2.2,6.9c-3.7,11.7-9.7,16.2-20.4,16.2c-1.9,0-5.6-0.2-7.1-0.4v18.7C417.3,210,423.3,210.2,425.1,210.2z" />
      </svg>
    </div>
  );
}

/**
 * Official Google Pay Logo Badge
 */
export function GooglePayBadge({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center px-2 py-0.5 rounded bg-white text-[#5F6368] border border-[#DADCE0] shadow-2xs ${className}`}>
      <div className="flex items-center gap-1 font-medium text-xs">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" aria-label="Google">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.67v3.05h3.87c2.27-2.09 3.675-5.17 3.675-9.16z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27a7.18 7.18 0 0 1 0-4.54V6.58H1.25a11.98 11.98 0 0 0 0 10.84l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z"
          />
        </svg>
        <span className="font-semibold text-[#3C4043] tracking-tight">Pay</span>
      </div>
    </div>
  );
}

/**
 * Official Link by Stripe Badge
 */
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

/**
 * Official Link by Stripe Logo with Brand Signature
 */
export function LinkLogo({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 font-bold tracking-tight text-[#0A2540] select-none ${className}`}>
      <div className="w-5 h-5 rounded-full bg-[#00D66F] flex items-center justify-center text-[#0A2540] shadow-2xs shrink-0">
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
          <path d="M6.354 5.5H4a2.5 2.5 0 000 5h2.354a.5.5 0 010 1H4a3.5 3.5 0 010-7h2.354a.5.5 0 110 1zM9.646 10.5H12a2.5 2.5 0 000-5H9.646a.5.5 0 010-1H12a3.5 3.5 0 010 7H9.646a.5.5 0 010-1z" />
          <path d="M5 8a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5A.5.5 0 015 8z" />
        </svg>
      </div>
      <span className="text-base font-bold text-[#0A2540] tracking-tight">link</span>
      <span className="text-[11px] font-semibold text-[#6E6A63] ml-0.5">by Stripe</span>
    </div>
  );
}

/**
 * Official Verve Card Badge (Nigerian Domestic Cards)
 */
export function VerveBadge({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-white border border-[#E0E0E0] shadow-2xs ${className}`}>
      <span className="font-extrabold text-[10px] tracking-tight text-[#E81B24]">verve</span>
    </div>
  );
}
