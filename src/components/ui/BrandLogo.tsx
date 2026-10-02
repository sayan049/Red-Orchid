"use client";

import Link from "next/link";
import Image from "next/image";
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
      className={`group flex items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-95 shrink-0 touch-manipulation cursor-pointer ${className}`}
    >
      {/* Brand Orchid Emblem */}
      <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center shrink-0">
        <Image
          src="/logo-orchid.png"
          alt="Red Orchid"
          width={36}
          height={36}
          className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 select-none"
          priority
        />
      </div>

      {/* Wordmark */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-display text-xs sm:text-sm font-bold tracking-[0.16em] sm:tracking-[0.22em] text-bone uppercase transition-colors group-hover:text-white leading-none">
            RED ORCHID
          </span>
          <span className="font-mono-code text-[8px] sm:text-[9px] font-semibold tracking-widest text-orchid uppercase leading-none">
            FILMS
          </span>
        </div>
        {showTagline && (
          <span className="font-sans-ui text-[8px] sm:text-[9px] font-normal tracking-[0.25em] text-muted uppercase mt-1 leading-none">
            Not content, Cinema.
          </span>
        )}
      </div>
    </Link>
  );
}

export default BrandLogo;
