"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WorkItem } from "@/types";
import { sound } from "@/lib/sound";

interface SelectedWorksProps {
  works: WorkItem[];
}

export function SelectedWorks({ works }: SelectedWorksProps) {
  const selectedList = works.slice(0, 6);

  return (
    <section
      id="works"
      className="relative w-full border-t border-white/10 bg-[#070707] py-20 sm:py-28 text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-14">
        {/* Editorial Section Header */}
        <div className="mb-14 sm:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2.5 font-mono-code text-xs text-orchid uppercase tracking-widest mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
              <span>// SELECTED ARCHIVE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-bone uppercase">
              SELECTED WORKS
            </h2>
          </div>

          <p className="font-sans-ui text-xs sm:text-sm text-white/50 max-w-sm leading-relaxed">
            Curated commissions across cinema, analogue photography, and high-impact commercial narratives.
          </p>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-10">
          {selectedList.map((work, idx) => {
            // Tablet-aware responsive column layout
            const colSpan =
              idx === 0
                ? "md:col-span-12 lg:col-span-8"
                : idx === 1
                ? "md:col-span-6 lg:col-span-4"
                : idx === 2
                ? "md:col-span-6 lg:col-span-5"
                : idx === 3
                ? "md:col-span-12 lg:col-span-7"
                : idx === 4
                ? "md:col-span-6 lg:col-span-6"
                : "md:col-span-6 lg:col-span-6";

            const aspectClass =
              work.aspectRatio === "4:5"
                ? "aspect-[4/5]"
                : work.aspectRatio === "9:16"
                ? "aspect-[9/16] max-h-[580px] sm:max-h-[640px]"
                : "aspect-[16/10]";

            return (
              <div key={work.id} className={`${colSpan} group relative`}>
                <Link
                  href={`/work/${work.slug}`}
                  onClick={() => sound.playClick()}
                  data-cursor="VIEW FILM"
                  className="block relative overflow-hidden rounded-xl border border-white/10 bg-[#111010] transition-all duration-500 hover:border-white/30"
                >
                  {/* Media wrapper */}
                  <div className={`relative w-full ${aspectClass} overflow-hidden bg-black`}>
                    <Image
                      src={work.coverImage}
                      alt={work.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-75 group-hover:opacity-85 transition-opacity duration-300" />

                    {/* Top tags */}
                    <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between text-[10px] sm:text-[11px] font-mono-code transition-opacity duration-300">
                      <span className="rounded-full border border-white/20 bg-black/70 px-2.5 sm:px-3 py-1 backdrop-blur-md text-white/90">
                        {work.category}
                      </span>
                      <span className="rounded-full border border-white/10 bg-black/70 px-2 sm:px-2.5 py-1 backdrop-blur-md text-white/50">
                        {work.year}
                      </span>
                    </div>

                    {/* Bottom floating preview */}
                    <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 md:p-8 flex flex-col justify-end">
                      <p className="font-mono-code text-[10px] sm:text-[11px] text-white/50 uppercase tracking-widest mb-1.5">
                        {work.client}
                      </p>

                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-bone uppercase transition-colors group-hover:text-orchid">
                          {work.title}
                        </h3>

                        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all duration-300 group-hover:border-orchid group-hover:bg-orchid">
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
                        </div>
                      </div>

                      {/* Technical metadata line */}
                      {work.technicalSpecs?.camera && (
                        <p className="mt-3 font-mono-code text-[9px] sm:text-[10px] text-white/40 tracking-wider uppercase border-t border-white/10 pt-2.5 truncate">
                          {work.technicalSpecs.camera} • {work.aspectRatio}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* View full gallery CTA */}
        <div className="mt-14 sm:mt-16 text-center border-t border-white/5 pt-10 sm:pt-12">
          <Link
            href="/gallery"
            onClick={() => sound.playClick()}
            data-cursor="ARCHIVE"
            className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 sm:px-8 py-3.5 sm:py-4 backdrop-blur-md transition-all duration-300 hover:border-orchid hover:bg-orchid hover:text-white"
          >
            <span className="font-mono-code text-xs font-semibold tracking-widest uppercase">
              VIEW COMPLETE VISUAL ARCHIVE
            </span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
