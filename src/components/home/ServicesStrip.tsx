"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICES_DATA } from "@/data/works";
import { sound } from "@/lib/sound";

export function ServicesStrip() {
  const [activeServiceId, setActiveServiceId] = useState<string>(SERVICES_DATA[0].id);

  const activeService = SERVICES_DATA.find((s) => s.id === activeServiceId) || SERVICES_DATA[0];

  const handleSelectService = (id: string) => {
    sound.playClick();
    setActiveServiceId(id);
  };

  return (
    <section
      id="services"
      className="relative w-full border-t border-white/10 bg-[#070707] py-20 sm:py-28 text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-14">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2.5 font-mono-code text-xs text-orchid uppercase tracking-widest mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
              <span>{"// EXPERTISE & PRODUCTION"}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-bone uppercase break-words">
              CAPABILITIES
            </h2>
          </div>

          <p className="font-sans-ui text-xs sm:text-sm text-white/50 max-w-sm leading-relaxed">
            Full-spectrum visual engineering from initial treatment and camera rigging to final DCP master.
          </p>
        </div>

        {/* Responsive Services Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Interactive Capabilities List */}
          <div className="lg:col-span-7 flex flex-col gap-3.5 sm:gap-4">
            {SERVICES_DATA.map((service, idx) => {
              const isActive = service.id === activeServiceId;

              return (
                <div
                  key={service.id}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectService(service.id);
                    }
                  }}
                  onClick={() => handleSelectService(service.id)}
                  data-cursor="SELECT"
                  className={`group relative cursor-pointer rounded-xl border p-5 sm:p-7 md:p-8 transition-all duration-300 touch-manipulation select-none active:scale-[0.99] ${
                    isActive
                      ? "border-orchid/60 bg-[#121011] shadow-[0_0_30px_rgba(225,29,72,0.12)]"
                      : "border-white/5 bg-[#0b0a0a] hover:border-white/20 hover:bg-[#0f0e0e]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-baseline gap-3.5 sm:gap-4">
                      <span className="font-mono-code text-xs font-semibold text-orchid">
                        0{idx + 1}
                      </span>
                      <div>
                        <h3 className="font-display text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-bone uppercase break-words">
                          {service.title}
                        </h3>
                        <p className="mt-1 font-sans-ui text-xs sm:text-sm text-white/60">
                          {service.tagline}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight
                      strokeWidth={1.5}
                      className={`h-5 w-5 shrink-0 transition-all duration-300 ${
                        isActive
                          ? "rotate-45 text-orchid"
                          : "text-white/30 group-hover:text-white"
                      }`}
                    />
                  </div>

                  {/* Expanded content when active */}
                  {isActive && (
                    <div className="mt-5 sm:mt-6 border-t border-white/10 pt-5 sm:pt-6 animate-fadeIn">
                      <p className="font-sans-ui text-xs sm:text-sm text-white/70 leading-relaxed mb-5">
                        {service.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {service.deliverables.map((item, dIdx) => (
                          <div
                            key={dIdx}
                            className="flex items-center gap-2.5 font-mono-code text-[11px] text-white/80"
                          >
                            <span className="h-1 w-1 rounded-full bg-orchid shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      {/* Mobile-only preview image when active */}
                      <div className="mt-5 block lg:hidden relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-black">
                        <Image
                          src={service.featuredWorkImage}
                          alt={service.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 500px"
                          className="object-cover filter brightness-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Stage / Still Preview (Desktop & Tablet) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-28">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#111010] p-3 shadow-2xl">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-black">
                <Image
                  key={activeService.id}
                  src={activeService.featuredWorkImage}
                  alt={activeService.title}
                  fill
                  sizes="500px"
                  className="object-cover transition-opacity duration-700 filter brightness-90 contrast-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end">
                  <span className="font-mono-code text-[10px] tracking-widest text-orchid uppercase mb-1">
                    // CASE PREVIEW
                  </span>
                  <p className="font-display text-xl font-bold uppercase text-bone">
                    {activeService.title}
                  </p>
                  <p className="font-sans-ui text-xs text-white/60 mt-1 line-clamp-2">
                    {activeService.tagline}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono-code">
                    <span className="text-white/40">AVAILABLE WORLDWIDE</span>
                    <Link
                      href="/contact"
                      onClick={() => sound.playClick()}
                      className="text-orchid hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1 min-h-[44px]"
                    >
                      <span>INQUIRE</span>
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
