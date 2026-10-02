"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Maximize2 } from "lucide-react";
import { WorkItem, StillItem } from "@/types";
import { VideoModal } from "@/components/ui/VideoModal";
import { Lightbox } from "@/components/ui/Lightbox";

interface WorkDetailClientProps {
  work: WorkItem;
}

export function WorkDetailClient({ work }: WorkDetailClientProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    initialIndex: number;
    stills: StillItem[];
  }>({
    isOpen: false,
    initialIndex: 0,
    stills: [],
  });

  const openLightbox = (index: number) => {
    setLightboxData({
      isOpen: true,
      initialIndex: index,
      stills: work.stills,
    });
  };

  return (
    <>
      {/* Hero Media Block */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d0b0a] shadow-2xl">
        <div
          className={`relative w-full ${
            work.aspectRatio === "2.39:1"
              ? "aspect-[21/9]"
              : work.aspectRatio === "9:16"
              ? "aspect-[16/10] max-h-[720px]"
              : "aspect-[16/9]"
          } overflow-hidden bg-black`}
        >
          <Image
            src={work.coverImage}
            alt={work.title}
            fill
            priority
            sizes="100vw"
            className="object-cover filter brightness-90"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Video trigger if video exists */}
          {work.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                data-cursor="PLAY"
                aria-label={`Play film ${work.title}`}
                className="group flex items-center gap-4 rounded-full border border-white/30 bg-black/60 px-6 py-4 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-orchid hover:bg-orchid hover:text-white"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:scale-110">
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                </div>
                <span className="font-mono-code text-xs font-bold tracking-widest text-white uppercase">
                  WATCH CINEMA MASTER ({work.duration || "PLAY"})
                </span>
              </button>
            </div>
          )}

          {/* Framing guides cue */}
          <div className="absolute top-4 right-4 font-mono-code text-[10px] text-white/50 bg-black/60 px-2.5 py-1 rounded backdrop-blur-xs">
            {work.aspectRatio} // MASTER PRINT
          </div>
        </div>
      </div>

      {/* Production Stills Gallery Section */}
      {work.stills && work.stills.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <span className="font-mono-code text-xs text-orchid uppercase tracking-widest">
              // PRODUCTION STILLS & FRAME GRABS
            </span>
            <span className="font-mono-code text-xs text-white/40">
              {work.stills.length} FRAMES ARCHIVED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {work.stills.map((still, idx) => (
              <div
                key={still.id}
                onClick={() => openLightbox(idx)}
                data-cursor="EXPAND"
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#111010] aspect-[16/10] transition-all duration-300 hover:border-white/30"
              >
                <Image
                  src={still.url}
                  alt={still.caption || `${work.title} still ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs">
                  <span className="font-mono-code text-[10px] text-white/80 truncate">
                    {still.caption || "Frame Grab"}
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white/80">
                    <Maximize2 className="h-3 w-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Modal Player */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={work.videoUrl}
        title={work.title}
        aspectRatio={work.aspectRatio}
      />

      {/* Lightbox for Stills */}
      <Lightbox
        isOpen={lightboxData.isOpen}
        onClose={() => setLightboxData({ ...lightboxData, isOpen: false })}
        stills={lightboxData.stills}
        initialIndex={lightboxData.initialIndex}
      />
    </>
  );
}
