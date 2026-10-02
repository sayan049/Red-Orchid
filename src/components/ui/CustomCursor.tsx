"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string>("");
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hasFinePointer, setHasFinePointer] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isFinePointer || prefersReducedMotion) {
      setHasFinePointer(false);
      return;
    }

    setHasFinePointer(true);

    document.documentElement.classList.add("has-custom-cursor");

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instantaneous 1:1 tracking for the dot - zero delay
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check context label
      const target = e.target as HTMLElement | null;
      const cursorTarget = target?.closest("[data-cursor]") as HTMLElement | null;
      if (cursorTarget) {
        const text = cursorTarget.getAttribute("data-cursor") || "";
        setCursorText(text);
        setIsHovered(true);
      } else {
        const interactiveTarget = target?.closest("a, button, input, select, textarea, [role='button']");
        if (interactiveTarget) {
          setCursorText("");
          setIsHovered(true);
        } else {
          setCursorText("");
          setIsHovered(false);
        }
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Fast, ultra-responsive outer follower with zero lag
    const render = () => {
      // High responsiveness factor (0.65) ensures instant reaction with velvety smoothness
      ringX += (mouseX - ringX) * 0.65;
      ringY += (mouseY - ringY) * 0.65;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!hasFinePointer) {
    return null;
  }

  return (
    <>
      {/* Precision Center Dot - Zero Lag, Instantaneous 1:1 tracking */}
      <div
        ref={cursorDotRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-50 -ml-1 -mt-1 h-2 w-2 rounded-full bg-white ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isHovered && cursorText ? "opacity-0" : ""}`}
        style={{
          willChange: "transform",
          transition: "opacity 0.15s ease",
        }}
      />

      {/* Responsive Outer Ring - Follows snugly without transform lag */}
      <div
        ref={cursorRingRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-50 flex items-center justify-center rounded-full border ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${
          cursorText
            ? "-ml-9 -mt-9 h-18 w-18 border-orchid/90 bg-black/80 backdrop-blur-xs shadow-[0_0_20px_rgba(225,29,72,0.35)]"
            : isHovered
            ? "-ml-5 -mt-5 h-10 w-10 border-orchid/80 bg-orchid/15"
            : "-ml-4 -mt-4 h-8 w-8 border-white/40"
        }`}
        style={{
          willChange: "transform",
          // Strictly DO NOT animate transform with CSS transitions - that was causing the drag lag!
          transition: "width 0.15s ease, height 0.15s ease, margin 0.15s ease, border-color 0.15s ease, background-color 0.15s ease, opacity 0.15s ease",
        }}
      >
        {cursorText && (
          <span className="text-[9px] font-mono-code font-bold tracking-widest text-white uppercase select-none">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
}
