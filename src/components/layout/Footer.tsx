import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { LiveTime } from "@/components/ui/LiveTime";
import { STUDIO_CONFIG } from "@/data/works";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-[#070707] text-white">
      {/* Upper subtle film strip border */}
      <div className="flex h-3 w-full items-center justify-between border-b border-white/5 px-4 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 shrink-0 bg-white/10 rounded-xs" />
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 md:px-10 lg:px-14">
        {/* Massive closing prompt */}
        <div className="mb-16 border-b border-white/10 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-2 w-2 rounded-full bg-orchid animate-pulse" />
            <span className="font-mono-code text-xs tracking-widest text-white/50 uppercase">
              // READY FOR PRODUCTION
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-bone max-w-3xl leading-[0.95]">
              HAVE A VISION? <br />
              <span className="text-white/40 italic font-normal">LET&apos;S CRAFT</span>{" "}
              <span className="text-orchid">CINEMA.</span>
            </h2>

            <Link
              href="/contact"
              data-cursor="INQUIRE"
              className="group inline-flex items-center gap-4 rounded-full border border-white/20 bg-white/5 px-8 py-4 backdrop-blur-md transition-all duration-300 hover:border-orchid hover:bg-orchid hover:text-white"
            >
              <span className="font-display text-sm font-semibold tracking-widest uppercase">
                INITIATE PROJECT
              </span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>

        {/* Directory columns */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4 pb-16 border-b border-white/5">
          {/* Col 1: Studio info */}
          <div className="space-y-4">
            <BrandLogo showTagline={true} />
            <p className="font-sans-ui text-xs text-white/60 leading-relaxed pr-4 pt-2">
              Independent cinema atelier dedicated to 35mm celluloid, large format digital cinematography, and high-fashion editorial imagery.
            </p>
            <div className="pt-2">
              <LiveTime />
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <span className="font-mono-code text-[11px] tracking-widest text-orchid uppercase block">
              // INDEX
            </span>
            <ul className="space-y-2 text-xs font-sans-ui">
              <li>
                <Link href="/#works" className="text-white/70 hover:text-white transition-colors">
                  Featured Works
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-white/70 hover:text-white transition-colors">
                  Visual Archive & Stills
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-white/70 hover:text-white transition-colors">
                  Capabilities & Gear
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                  Production Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Capabilities */}
          <div className="space-y-3">
            <span className="font-mono-code text-[11px] tracking-widest text-white/40 uppercase block">
              // CAPABILITIES
            </span>
            <ul className="space-y-2 text-xs font-sans-ui text-white/60">
              <li>Narrative Short Films</li>
              <li>Medium Format Stills</li>
              <li>Kinetic 9:16 Vertical Reels</li>
              <li>Commercial & Brand Worlds</li>
              <li>ACEScct 35mm Color Grading</li>
            </ul>
          </div>

          {/* Col 4: Dispatch & Socials */}
          <div className="space-y-3">
            <span className="font-mono-code text-[11px] tracking-widest text-white/40 uppercase block">
              // DISPATCH
            </span>
            <div className="space-y-2 text-xs font-mono-code text-white/80">
              <p>
                <a
                  href={`mailto:${STUDIO_CONFIG.email}`}
                  className="hover:text-orchid transition-colors block truncate"
                >
                  {STUDIO_CONFIG.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${STUDIO_CONFIG.phone}`}
                  className="hover:text-orchid transition-colors"
                >
                  {STUDIO_CONFIG.phone}
                </a>
              </p>
              <p className="text-white/40 text-[11px] pt-1">
                {STUDIO_CONFIG.coordinates}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-3">
              <a
                href={STUDIO_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-code text-[11px] text-white/60 hover:text-orchid transition-colors uppercase"
              >
                Instagram
              </a>
              <span className="text-white/20">•</span>
              <a
                href={STUDIO_CONFIG.vimeo}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-code text-[11px] text-white/60 hover:text-orchid transition-colors uppercase"
              >
                Vimeo
              </a>
              <span className="text-white/20">•</span>
              <a
                href={STUDIO_CONFIG.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-code text-[11px] text-white/60 hover:text-orchid transition-colors uppercase"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[11px] font-mono-code text-white/40">
          <p>
            &copy; {currentYear} RED ORCHID FILMS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <span>2.39:1 / 4K / 35MM</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-white/50">NOT CONTENT, CINEMA.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
