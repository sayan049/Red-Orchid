"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WorkItem } from "@/types";
import { sound } from "@/lib/sound";
import {
  ParallaxUnfurlingGallery,
  GalleryItem,
} from "@/components/ui/3d-parallax-unfurling-gallery";

interface SelectedWorksProps {
  works: WorkItem[];
}

export function SelectedWorks({ works }: SelectedWorksProps) {
  // Convert WorkItems into GalleryItem format for the 3D Parallax Unfurling Matrix
  const galleryItems: GalleryItem[] = useMemo(() => {
    return works.map((w) => ({
      id: w.id,
      src: w.coverImage,
      title: w.title,
      slug: w.slug,
      client: w.client,
      category: w.category,
      year: w.year,
      camera: w.technicalSpecs?.camera,
      aspectRatio: w.aspectRatio,
    }));
  }, [works]);

  return (
    <section
      id="works"
      aria-label="Selected Works 3D Matrix"
      className="relative w-full border-t border-white/10 bg-[#070707] text-white overflow-hidden"
    >
      {/* Editorial Section Header */}
      <div className="pt-20 sm:pt-28 pb-8 px-4 sm:px-8 md:px-10 lg:px-14 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2.5 font-mono-code text-xs text-orchid uppercase tracking-widest mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
              <span>{"// SELECTED ARCHIVE"}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-bone uppercase break-words">
              SELECTED WORKS
            </h2>
          </div>

          <p className="font-sans-ui text-xs sm:text-sm text-white/50 max-w-sm leading-relaxed">
            Celluloid compositions, narrative direction, and international commissions unfurling in dynamic 3D space.
          </p>
        </div>
      </div>

      {/* 3D Parallax Unfurling Gallery (Scrolls smoothly into untilted, aligned state) */}
      <div className="w-full relative">
        <ParallaxUnfurlingGallery items={galleryItems} />
      </div>

      {/* View full gallery CTA */}
      <div className="py-14 sm:py-18 text-center border-t border-white/5 bg-[#070707] relative z-20">
        <Link
          href="/gallery"
          onClick={() => sound.playClick()}
          data-cursor="ARCHIVE"
          className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 sm:px-8 py-3.5 sm:py-4 backdrop-blur-md transition-all duration-300 hover:border-orchid hover:bg-orchid hover:text-white touch-manipulation cursor-pointer active:scale-95 min-h-[48px]"
        >
          <span className="font-mono-code text-xs font-semibold tracking-widest uppercase">
            VIEW COMPLETE VISUAL ARCHIVE
          </span>
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            strokeWidth={1.5}
          />
        </Link>
      </div>
    </section>
  );
}

export default SelectedWorks;
