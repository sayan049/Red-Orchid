"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WorkItem } from "@/types";
import {
  ParallaxUnfurlingGallery,
  GalleryItem,
} from "@/components/ui/3d-parallax-unfurling-gallery";
import { sound } from "@/lib/sound";

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
      aria-label="Selected Filmography"
      className="relative w-full border-t border-white/10 bg-[#070707] pt-20 sm:pt-28 text-white"
    >
      {/* Section Header - Consistent with Trending Cinema, Capabilities, FAQ */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-14 mb-10 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 font-mono-code text-xs text-orchid uppercase tracking-widest mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
              <span>{"// SELECTED ARCHIVE - 3D MATRIX"}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-bone uppercase break-words">
              SELECTED FILMOGRAPHY
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono-code text-[11px] sm:text-xs text-white/40 uppercase tracking-widest hidden sm:inline">
              SCROLL TO UNFURL &amp; STRAIGHTEN &darr;
            </span>
            <Link
              href="/gallery"
              onClick={() => sound.playClick()}
              data-cursor="GALLERY"
              className="flex items-center gap-1.5 font-mono-code text-[11px] sm:text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/15 backdrop-blur-md transition-colors"
            >
              <span>VISUAL ARCHIVE</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3D Parallax Unfurling Gallery */}
      <ParallaxUnfurlingGallery items={galleryItems} />
    </section>
  );
}

export default SelectedWorks;
