"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string>("");
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Only run on non-touch devices with fine pointers
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isFinePointer || prefersReducedMotion) return;

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

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check if hovering over an element with custom cursor label
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

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth spring interpolation for the outer ring
    const render = () => {
      const speed = isHovered ? 0.22 : 0.16;
      ringX += (mouseX - ringX) * speed;
      ringY += (mouseY - ringY) * speed;

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
  }, [isVisible, isHovered]);

  return (
    <>
      {/* Inner precise dot */}
      <div
        ref={cursorDotRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-50 -ml-1 -mt-1 h-2 w-2 rounded-full bg-white transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isHovered && cursorText ? "opacity-0" : ""}`}
        style={{ willChange: "transform" }}
      />

      {/* Outer magnetic spring ring with dynamic mode */}
      <div
        ref={cursorRingRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-50 flex items-center justify-center rounded-full border transition-all duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${
          cursorText
            ? "-ml-9 -mt-9 h-18 w-18 border-orchid/80 bg-black/75 backdrop-blur-xs scale-100 shadow-[0_0_20px_rgba(225,29,72,0.3)]"
            : isHovered
            ? "-ml-6 -mt-6 h-12 w-12 border-orchid/60 bg-orchid/10 scale-105"
            : "-ml-4 -mt-4 h-8 w-8 border-white/30 scale-100"
        }`}
        style={{ willChange: "transform" }}
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
