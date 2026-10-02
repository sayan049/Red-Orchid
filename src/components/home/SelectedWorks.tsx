"use client";

import React, { useMemo } from "react";
import { WorkItem } from "@/types";
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
      className="relative w-full border-t border-white/10 bg-[#070707] text-white"
    >
      {/* 3D Parallax Unfurling Gallery: Pins immediately at top-0, opens to full screen, and tilts straight */}
      <ParallaxUnfurlingGallery items={galleryItems} />
    </section>
  );
}

export default SelectedWorks;
