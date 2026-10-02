"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // 1. Enforce manual scroll restoration globally so the browser never restores stale scroll positions
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // 2. Handle route changes & hash navigation
  useEffect(() => {
    if (typeof window === "undefined") return;

    let timer: NodeJS.Timeout | null = null;
    let attempts = 0;
    const maxAttempts = 35; // 35 * 60ms = 2.1s polling window

    const getHash = () => {
      let hash = window.location.hash;
      if (!hash) {
        try {
          hash = sessionStorage.getItem("target_scroll_hash") || "";
        } catch {
          // ignore
        }
      }
      return hash;
    };

    const targetHash = getHash();

    const doScrollToTarget = (hashStr: string) => {
      const cleanId = hashStr.replace(/^#/, "");
      const target = document.getElementById(cleanId) || document.querySelector(hashStr);

      if (target) {
        try {
          sessionStorage.removeItem("target_scroll_hash");
        } catch {
          // ignore
        }

        if (lenisRef.current) {
          lenisRef.current.scrollTo(target as HTMLElement, { offset: -80, immediate: false });
        } else {
          const y = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        }
        return true;
      }
      return false;
    };

    if (targetHash) {
      const poll = () => {
        if (doScrollToTarget(targetHash)) {
          return;
        }
        attempts++;
        if (attempts < maxAttempts) {
          timer = setTimeout(poll, 60);
        } else {
          // Fallback to top only if element is not found after polling
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true });
          }
        }
      };

      // Start polling
      poll();
    } else {
      // No hash at all: Unconditionally reset window & document scroll to top
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    }

    const handleHashChange = () => {
      const currentHash = window.location.hash;
      if (currentHash) {
        doScrollToTarget(currentHash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);

  useEffect(() => {
    // Respect accessibility settings
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      return;
    }

    // Do NOT run Lenis on mobile / touch devices.
    // Native mobile momentum scrolling on iOS and Android is hardware-accelerated
    // and running Lenis touch interception blocks tap and click events on buttons.
    const isTouchOrMobile =
      window.innerWidth < 1024 ||
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window;
    if (isTouchOrMobile) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <div className="relative min-h-screen">{children}</div>;
}
