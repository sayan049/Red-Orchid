"use client";

import React from "react";
import { LogoMarquee, Logo } from "@/components/ui/logo-marquee";

// Helper to safely encode SVGs into crisp vector data URIs
function makeSvgDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Row 1: High-Fashion, Cinema Ateliers & Film Houses (Moving Left)
const CINEMA_CLIENTS: Logo[] = [
  {
    src: makeSvgDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 28" fill="white">
        <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia, serif" font-weight="900" font-size="20" letter-spacing="3">LEICA</text>
      </svg>`
    ),
    alt: "Leica Camera",
  },
  {
    src: makeSvgDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 28" fill="white">
        <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="16" letter-spacing="4">HASSELBLAD</text>
      </svg>`
    ),
    alt: "Hasselblad",
  },
  {
    src: makeSvgDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 28" fill="white">
        <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="Didot, 'Bodoni MT', serif" font-weight="900" font-style="italic" font-size="22" letter-spacing="2">VOGUE</text>
      </svg>`
    ),
    alt: "Vogue",
  },
  {
    src: makeSvgDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 28" fill="white">
        <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="Impact, 'Arial Black', sans-serif" font-weight="900" font-size="22" letter-spacing="4">A24</text>
      </svg>`
    ),
    alt: "A24",
  },
  {
    src: makeSvgDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 28" fill="white">
        <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="'Courier New', monospace" font-weight="800" font-size="16" letter-spacing="4">NOWNESS</text>
      </svg>`
    ),
    alt: "Nowness",
  },
  {
    src: makeSvgDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 28" fill="white">
        <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia, serif" font-weight="600" font-size="13" letter-spacing="3.5">MAISON MARGIELA</text>
      </svg>`
    ),
    alt: "Maison Margiela",
  },
  {
    src: makeSvgDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 28" fill="white">
        <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="19" letter-spacing="3">ARRI</text>
      </svg>`
    ),
    alt: "ARRI Cine",
  },
  {
    src: makeSvgDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 28" fill="white">
        <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="15" letter-spacing="3">SONY CINE</text>
      </svg>`
    ),
    alt: "Sony Cine",
  },
  {
    src: makeSvgDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 28" fill="white">
        <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="Impact, sans-serif" font-weight="900" font-size="19" letter-spacing="3">KODAK</text>
      </svg>`
    ),
    alt: "Kodak 35mm",
  },
  {
    src: makeSvgDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 28" fill="white">
        <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="'Arial Black', sans-serif" font-weight="900" font-size="18" letter-spacing="3">ARTE</text>
      </svg>`
    ),
    alt: "Arte France",
  },
];

// Row 2: Digital Innovators & Tech Partners from prompt (Moving Right)
const TECH_CLIENTS: Logo[] = [
  {
    src: "https://cdn.21st.dev/assets/mirror/bd/bdf5f3ae72bcfda892a686c03b7932985c694e9a9828643c980601bbc9e53cb4.svg",
    alt: "Nvidia",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/31/319eeae853dd1af99d442b6c16b6c38dc52a66a719f8e502c65f85d26255cbd3.svg",
    alt: "Supabase",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/2b/2bcdd4124223e3bf8e66bc08ce0ac32a6cc42ffe3584bbecfd377847176a188d.svg",
    alt: "OpenAI",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/56/5624b7c243ac8d60e848fb5ea222ec932c1600df54a2762238b37498372fb0c8.svg",
    alt: "Vercel",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/90/90f01a9537335666282ae5acc80bd4305f86d085a92d60904c3aa3ccc4414570.svg",
    alt: "GitHub",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/96/96517bce3574d648280ff639d01d9889f354b488b3f826db5df746d730232a0c.svg",
    alt: "Clerk",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/fc/fc7b090ebcfc468d24a1dc482b2db1fcbfd99ca14568552a30ce553d6dda7fcb.svg",
    alt: "Turso",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/e8/e8514b1206f79e1abdafcc1d2632393cc7cfbcbbe25426ac5143b17b184b56b8.svg",
    alt: "Claude",
  },
];

export function ClientsSection() {
  return (
    <section
      id="clients"
      aria-label="Our Clients and Collaborators"
      className="relative w-full border-t border-white/10 bg-[#070707] py-20 sm:py-24 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-14 mb-10 text-center relative z-10">
        {/* Section Tag */}
        <div className="inline-flex items-center gap-2 font-mono-code text-[11px] text-orchid uppercase tracking-widest mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
          <span>{"// PATRONS & PARTNERS"}</span>
        </div>

        {/* Section Title */}
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase text-bone tracking-tight">
          TRUSTED BY VISIONARY HOUSES
        </h2>

        {/* Subtitle */}
        <p className="mt-3 font-sans-ui text-xs sm:text-sm text-white/55 max-w-xl mx-auto leading-relaxed">
          From international cinema productions and fashion ateliers to bleeding-edge creative technologies, our celluloid works power distinctive brand narratives.
        </p>
      </div>

      {/* Two-Line Marquee moving in opposite directions */}
      <div className="relative z-10 w-full">
        <LogoMarquee
          logos={CINEMA_CLIENTS}
          secondRowLogos={TECH_CLIENTS}
          twoLines={true}
          gap={24}
          duration={50}
          durationOnHover={20}
        />
      </div>

      {/* Bottom subtle metadata strip */}
      <div className="mt-10 flex items-center justify-center gap-6 font-mono-code text-[10px] text-white/30 uppercase tracking-widest">
        <span>35MM CELLULOID</span>
        <span>•</span>
        <span>COMMERCIAL & EDITORIAL</span>
        <span>•</span>
        <span>GLOBAL SYNDICATION</span>
      </div>
    </section>
  );
}

export default ClientsSection;
