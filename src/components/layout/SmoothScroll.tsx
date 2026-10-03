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
  const isInitialMountRef = useRef(true);

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
    const maxAttempts = 40; // 40 * 60ms = 2.4s polling window

    const isReload = () => {
      try {
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0) {
          const nav = navEntries[0] as PerformanceNavigationTiming;
          return nav.type === "reload";
        }
        return (
          (window.performance as unknown as { navigation?: { type: number } })
            ?.navigation?.type === 1
        );
      } catch {
        return false;
      }
    };

    const resetScrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    };

    const isFirstMount = isInitialMountRef.current;
    if (isFirstMount) {
      isInitialMountRef.current = false;
    }

    // On hard page reload of the initial document:
    // Only reset to top if there is NO explicit navigation intent stored
    if (isFirstMount && isReload()) {
      let storedHash = "";
      try {
        storedHash = sessionStorage.getItem("target_scroll_hash") || "";
      } catch {
        // ignore
      }

      if (!storedHash) {
        if (window.location.hash) {
          try {
            window.history.replaceState(null, "", window.location.pathname);
          } catch {
            // ignore
          }
        }

        resetScrollToTop();
        requestAnimationFrame(resetScrollToTop);
        setTimeout(resetScrollToTop, 60);
        setTimeout(resetScrollToTop, 200);
        return;
      }
    }

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

        // Force Lenis to recalculate page dimensions if active
        if (lenisRef.current) {
          lenisRef.current.resize();
        }

        const rect = target.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;
        const targetY = Math.max(0, absoluteTop - 80);

        if (lenisRef.current) {
          lenisRef.current.scrollTo(targetY, { immediate: false, duration: 1.2 });
        }

        // Also perform window.scrollTo for native/fallback
        window.scrollTo({ top: targetY, behavior: "smooth" });

        // Re-adjust after layout stabilizes from dynamic components (WebGL Canvas / images)
        setTimeout(() => {
          if (lenisRef.current) lenisRef.current.resize();
          const updatedRect = target.getBoundingClientRect();
          if (Math.abs(updatedRect.top - 80) > 40) {
            const newY = Math.max(0, updatedRect.top + window.scrollY - 80);
            if (lenisRef.current) {
              lenisRef.current.scrollTo(newY, { immediate: false, duration: 0.8 });
            }
            window.scrollTo({ top: newY, behavior: "smooth" });
          }
        }, 350);

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
          resetScrollToTop();
        }
      };

      // Start polling
      poll();
    } else {
      // No hash at all: Unconditionally reset window & document scroll to top
      resetScrollToTop();
    }

    const handleHashChange = () => {
      const currentHash = window.location.hash;
      if (currentHash) {
        doScrollToTarget(currentHash);
      }
    };

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted || isReload()) {
        try {
          sessionStorage.removeItem("target_scroll_hash");
          if (window.location.hash) {
            window.history.replaceState(null, "", window.location.pathname);
          }
        } catch {
          // ignore
        }
        resetScrollToTop();
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("pageshow", handlePageShow);
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
