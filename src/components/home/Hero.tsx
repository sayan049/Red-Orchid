"use client";

import dynamic from "next/dynamic";

// Dynamic import for WebGL Three.js interactive list slider
const LuminaInteractiveList = dynamic(
  () =>
    import("@/components/ui/lumina-interactive-list").then(
      (mod) => mod.LuminaInteractiveList
    ),
  {
    ssr: false,
    loading: () => (
      <div className="relative min-h-[100svh] w-full bg-[#070707] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-orchid border-t-transparent animate-spin" />
          <span className="font-mono-code text-[11px] text-white/40 tracking-widest uppercase">
            LOADING ATELIER REEL...
          </span>
        </div>
      </div>
    ),
  }
);

export function Hero() {
  return (
    <div id="home" className="relative w-full">
      <LuminaInteractiveList />
    </div>
  );
}

export default Hero;
