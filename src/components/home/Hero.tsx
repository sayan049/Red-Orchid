"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowDown, Sparkles } from "lucide-react";
import { VideoModal } from "@/components/ui/VideoModal";
import { sound } from "@/lib/sound";

// Lazy load Three.js hero shader so it never blocks first paint
const HeroShader = dynamic(
  () => import("./HeroShader").then((mod) => mod.HeroShader),
  { ssr: false }
);

export function Hero() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  const handleOpenShowreel = () => {
    sound.playClick();
    setIsVideoModalOpen(true);
  };

  return (
    <>
      <section className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-[#070707] px-4 sm:px-8 md:px-12 lg:px-16 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 text-white">
        {/* Full-bleed Background Reel / Poster Fallback */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* High-priority poster image */}
          <Image
            src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=85&w=2000"
            alt="Red Orchid Films 35mm Cinematography"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35 filter brightness-75 contrast-110"
          />

          {/* Looping muted ambient video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-screen"
            poster="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=85&w=2000"
          >
            <source
              src="/videos/hero-reel.mp4"
              type="video/mp4"
            />
          </video>

          {/* Multi-tier cinematic vignette and gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#070707]/60 to-[#070707]" />

          {/* WebGL Film grain & chromatic dispersion */}
          <HeroShader />
        </div>

        {/* Top spacing indicator */}
        <div className="relative z-20 flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
            <span className="font-mono-code text-[10px] sm:text-[11px] font-medium tracking-wider text-white/80 uppercase">
              SHOWREEL // 2024–2025
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono-code text-xs text-white/50">
            <Sparkles className="h-3.5 w-3.5 text-orchid" />
            <span>EST. 2019 • KOLKATA // MUMBAI</span>
          </div>
        </div>

        {/* Center: Monumental Editorial Statement - Perfectly fitted, zero clipping on any device */}
        <div className="relative z-20 my-auto py-6 sm:py-10 max-w-7xl w-full">
          <p className="mb-2.5 sm:mb-4 font-mono-code text-[10px] sm:text-xs md:text-sm tracking-[0.25em] text-orchid uppercase">
            // BESPOKE PRODUCTION ATELIER
          </p>

          <h1 className="font-display text-hero-fluid font-black uppercase text-bone select-none tracking-tight leading-[0.98] sm:leading-[1.02]">
            <span className="block sm:inline">NOT CONTENT,</span>{" "}
            <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-bone via-white to-white/50">
              CINEMA.
            </span>
          </h1>

          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center gap-6 text-xs sm:text-sm md:text-base text-white/70 max-w-2xl font-sans-ui font-normal leading-relaxed">
            <p>
              Short films, medium format photography, 9:16 kinetic reels, and commercial worlds. 
              We craft images with deliberate patience, sculpted light, and uncompromising artistic gravity.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Interactive Reel Trigger + Scroll Cue */}
        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 border-t border-white/10 pt-4 sm:pt-6">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleOpenShowreel}
              data-cursor="PLAY"
              className="group flex w-full sm:w-auto items-center justify-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 sm:py-3.5 backdrop-blur-md transition-all duration-300 hover:border-orchid hover:bg-orchid hover:text-white"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:scale-110 group-hover:bg-black group-hover:text-white">
                <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
              </div>
              <span className="font-mono-code text-xs font-semibold tracking-widest uppercase">
                PLAY ATELIER REEL (02:15)
              </span>
            </button>

            <span className="hidden md:inline font-mono-code text-xs text-white/40">
              4K CINEMASCOPE • DOLBY 7.1
            </span>
          </div>

          <Link
            href="#trending"
            onClick={() => sound.playClick()}
            data-cursor="SCROLL"
            className="group flex items-center justify-center sm:justify-start gap-2 font-mono-code text-xs tracking-widest text-white/60 uppercase transition-colors hover:text-white py-1"
          >
            <span>DISCOVER WORKS</span>
            <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-1 text-orchid" />
          </Link>
        </div>
      </section>

      {/* Accessible Cinema Video Player Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl="/videos/hero-reel.mp4"
        title="Red Orchid Films — Annual Showreel 2024"
        aspectRatio="2.39:1"
      />
    </>
  );
}
