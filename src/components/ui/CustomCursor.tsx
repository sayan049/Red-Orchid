"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string>("");
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hasFinePointer, setHasFinePointer] = useState<boolean>(false);

  // Internal tracking refs to prevent re-attaching listeners and redundant re-renders
  const isVisibleRef = useRef(false);
  const isHoveredRef = useRef(false);
  const cursorTextRef = useRef("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isFinePointer =
      window.innerWidth >= 1024 &&
      !("ontouchstart" in window) &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isFinePointer || prefersReducedMotion) {
      setHasFinePointer(false);
      document.documentElement.classList.remove("has-custom-cursor");
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

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      // Instantaneous 1:1 hardware-accelerated tracking for dot
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check context label
      const target = e.target as HTMLElement | null;
      const cursorTarget = target?.closest("[data-cursor]") as HTMLElement | null;

      if (cursorTarget) {
        const text = cursorTarget.getAttribute("data-cursor") || "";
        if (text !== cursorTextRef.current) {
          cursorTextRef.current = text;
          setCursorText(text);
        }
        if (!isHoveredRef.current) {
          isHoveredRef.current = true;
          setIsHovered(true);
        }
      } else {
        const interactiveTarget = target?.closest("a, button, input, select, textarea, [role='button']");
        const nextHovered = !!interactiveTarget;

        if (cursorTextRef.current !== "") {
          cursorTextRef.current = "";
          setCursorText("");
        }

        if (nextHovered !== isHoveredRef.current) {
          isHoveredRef.current = nextHovered;
          setIsHovered(nextHovered);
        }
      }
    };

    const onMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    // Fast, ultra-responsive outer follower with velvety smoothness
    const render = () => {
      ringX += (mouseX - ringX) * 0.65;
      ringY += (mouseY - ringY) * 0.65;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave, { passive: true });
    document.addEventListener("mouseenter", onMouseEnter, { passive: true });
    animationFrameId = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!hasFinePointer) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none select-none">
      {/* Center pinpoint */}
      <div
        ref={cursorDotRef}
        style={{
          transform: "translate3d(-100px, -100px, 0)",
          willChange: "transform",
        }}
        className={`pointer-events-none fixed top-0 left-0 z-[9999] -ml-1 -mt-1 h-2 w-2 rounded-full bg-white transition-opacity duration-150 ${
          isVisible && !cursorText ? "opacity-90" : "opacity-0"
        }`}
      />

      {/* Floating magnetic / contextual aura */}
      <div
        ref={cursorRingRef}
        style={{
          transform: "translate3d(-100px, -100px, 0)",
          willChange: "transform",
        }}
        className={`pointer-events-none fixed top-0 left-0 z-[9999] flex items-center justify-center rounded-full border border-white/40 transition-[width,height,background-color,border-color,opacity] duration-200 ease-out backdrop-blur-[1px] ${
          !isVisible ? "opacity-0 scale-50" : "opacity-100 scale-100"
        } ${
          cursorText
            ? "-ml-9 -mt-9 h-[72px] w-[72px] border-orchid bg-orchid/20 backdrop-blur-md"
            : isHovered
            ? "-ml-5 -mt-5 h-10 w-10 border-white/60 bg-white/10"
            : "-ml-3.5 -mt-3.5 h-7 w-7 border-white/30 bg-white/[0.02]"
        }`}
      >
        {cursorText && (
          <span className="font-mono-code text-[9px] font-bold uppercase tracking-widest text-white animate-in fade-in zoom-in-75 duration-150">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}

export default CustomCursor;
