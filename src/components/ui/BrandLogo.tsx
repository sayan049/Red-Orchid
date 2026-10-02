"use client";

import Link from "next/link";
import { sound } from "@/lib/sound";

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
}

export function BrandLogo({ className = "", showTagline = false }: BrandLogoProps) {
  return (
    <Link
      href="/"
      onClick={() => sound.playClick()}
      aria-label="Red Orchid Films — Return to Homepage"
      data-cursor="HOME"
      className={`group flex items-center gap-2.5 sm:gap-3.5 transition-opacity hover:opacity-90 shrink-0 touch-manipulation cursor-pointer ${className}`}
    >
      {/* Bespoke Orchid Petal & Iris Glyph */}
      <div className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center shrink-0">
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full transition-transform duration-500 ease-out group-hover:rotate-45"
          aria-hidden="true"
        >
          {/* Outer cinema aperture iris */}
          <circle
            cx="18"
            cy="18"
            r="16.5"
            stroke="currentColor"
            strokeWidth="0.8"
            className="text-white/20 group-hover:text-orchid/60 transition-colors"
          />
          {/* Inner Orchid Petal Contour 1 */}
          <path
            d="M18 4C18 4 27 10 27 18C27 24 22 28 18 32C14 28 9 24 9 18C9 10 18 4 18 4Z"
            fill="none"
            stroke="#E11D48"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300 group-hover:fill-orchid/20"
          />
          {/* Overlapping Petal Contour 2 */}
          <path
            d="M4 18C4 18 10 9 18 9C26 9 32 18 32 18C32 18 26 27 18 27C10 27 4 18 4 18Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-white/40 group-hover:text-white/80 transition-colors"
          />
          {/* Central 35mm Core */}
          <circle cx="18" cy="18" r="2.5" fill="#E11D48" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="font-display text-xs sm:text-sm font-bold tracking-[0.16em] sm:tracking-[0.22em] text-bone uppercase transition-colors group-hover:text-white">
            RED ORCHID
          </span>
          <span className="font-mono-code text-[8px] sm:text-[9px] font-semibold tracking-widest text-orchid uppercase">
            FILMS
          </span>
        </div>
        {showTagline && (
          <span className="font-sans-ui text-[8px] sm:text-[9px] font-normal tracking-[0.25em] text-muted uppercase">
            Not content, Cinema.
          </span>
        )}
      </div>
    </Link>
  );
}
