"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { StillItem } from "@/types";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  stills: StillItem[];
  initialIndex?: number;
}

export function Lightbox({
  isOpen,
  onClose,
  stills,
  initialIndex = 0,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Synchronize initialIndex when opening
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % stills.length);
  }, [stills.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + stills.length) % stills.length);
  }, [stills.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // Minimum swipe threshold 50px
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
  };

  if (!isOpen || stills.length === 0) return null;

  const currentStill = stills[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photography Lightbox Viewer"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 p-4 sm:p-6 backdrop-blur-3xl select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono-code text-xs text-orchid font-semibold">
            {String(currentIndex + 1).padStart(2, "0")} / {String(stills.length).padStart(2, "0")}
          </span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="font-mono-code text-xs text-white/60 hidden sm:inline uppercase">
            35MM STILL ARCHIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            data-cursor="CLOSE"
            aria-label="Close Lightbox"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative my-auto flex flex-1 items-center justify-center overflow-hidden py-4">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous still image"
          className="absolute left-2 sm:left-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/80 backdrop-blur-md transition-all hover:scale-110 hover:border-orchid hover:text-white"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next still image"
          className="absolute right-2 sm:right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/80 backdrop-blur-md transition-all hover:scale-110 hover:border-orchid hover:text-white"
        >
          <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
        </button>

        {/* Centered Image */}
        <div className="relative max-h-[76vh] max-w-[85vw] h-full w-full flex items-center justify-center">
          <Image
            key={currentStill.id}
            src={currentStill.url}
            alt={currentStill.caption || "Red Orchid Films still"}
            fill
            sizes="90vw"
            priority
            className="object-contain transition-opacity duration-300 filter contrast-105"
          />
        </div>
      </div>

      {/* Bottom Metadata Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10 pt-4">
        <div>
          {currentStill.caption && (
            <p className="font-display text-sm sm:text-base text-bone font-medium">
              {currentStill.caption}
            </p>
          )}
          {currentStill.camera && (
            <div className="flex items-center gap-2 font-mono-code text-[11px] text-white/50 mt-1">
              <Camera className="h-3 w-3 text-orchid" strokeWidth={1.5} />
              <span>{currentStill.camera}</span>
              {currentStill.iso && <span>• ISO {currentStill.iso}</span>}
            </div>
          )}
        </div>

        <div className="font-mono-code text-[10px] text-white/40 uppercase hidden sm:block">
          USE ARROWS OR SWIPE TO NAVIGATE • ESC TO CLOSE
        </div>
      </div>
    </div>
  );
}
