"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { WORKS_DATA } from "@/data/works";
import { WorkItem, StillItem } from "@/types";
import { VideoModal } from "@/components/ui/VideoModal";
import { Lightbox } from "@/components/ui/Lightbox";
import { Play, Camera, Film, Smartphone, ArrowUpRight } from "lucide-react";

type MainFilter = "all" | "photography" | "reels" | "short-films";
type PhotoSubFilter = "all-photo" | "portraits" | "fashion" | "architecture";

export default function GalleryPage() {
  const [mainFilter, setMainFilter] = useState<MainFilter>("all");
  const [photoSubFilter, setPhotoSubFilter] = useState<PhotoSubFilter>("all-photo");

  // Video modal state
  const [videoModalData, setVideoModalData] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
    aspectRatio: string;
  }>({
    isOpen: false,
    url: "",
    title: "",
    aspectRatio: "2.39:1",
  });

  // Lightbox state for photography
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    initialIndex: number;
    stills: StillItem[];
  }>({
    isOpen: false,
    initialIndex: 0,
    stills: [],
  });

  // Collect all photography stills across works
  const allStills = useMemo(() => {
    const list: StillItem[] = [];
    WORKS_DATA.forEach((w) => {
      if (w.category === "Photography" || w.stills.length > 0) {
        w.stills.forEach((s) => {
          list.push({
            ...s,
            caption: s.caption || `${w.title} — ${w.client}`,
          });
        });
      }
    });
    return list;
  }, []);

  // Filtered works
  const filteredWorks = useMemo(() => {
    if (mainFilter === "short-films") {
      return WORKS_DATA.filter((w) => w.category === "Short Film" || w.category === "Commercial");
    }
    if (mainFilter === "reels") {
      return WORKS_DATA.filter((w) => w.category === "Reels");
    }
    if (mainFilter === "photography") {
      return WORKS_DATA.filter((w) => {
        if (w.category !== "Photography") return false;
        if (photoSubFilter === "portraits") return w.subCategory?.toLowerCase().includes("portrait");
        if (photoSubFilter === "fashion") return w.subCategory?.toLowerCase().includes("fashion");
        if (photoSubFilter === "architecture") return w.subCategory?.toLowerCase().includes("architecture");
        return true;
      });
    }
    return WORKS_DATA;
  }, [mainFilter, photoSubFilter]);

  const openVideo = (url?: string, title?: string, aspectRatio?: string) => {
    if (!url) return;
    setVideoModalData({
      isOpen: true,
      url,
      title: title || "Red Orchid Cinema",
      aspectRatio: aspectRatio || "2.39:1",
    });
  };

  const openLightbox = (index: number) => {
    setLightboxData({
      isOpen: true,
      initialIndex: index,
      stills: allStills,
    });
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-14">
        {/* Page Title & Manifesto */}
        <div className="mb-14">
          <div className="flex items-center gap-2 font-mono-code text-xs text-orchid uppercase tracking-widest mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
            <span>// CATALOG & VISUAL REPOSITORY</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-bone">
            VISUAL ARCHIVE
          </h1>

          <p className="mt-4 font-sans-ui text-sm sm:text-base text-white/60 max-w-2xl leading-relaxed">
            Explorations across short films, medium format photography sets, and vertical cinematic reels. Every project captured with deliberate composition and tactile grain.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8 mb-12">
          {/* Main Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {[
              { id: "all", label: "All Works", icon: null },
              { id: "short-films", label: "Short Films & Commercials", icon: Film },
              { id: "photography", label: "Photography & Stills", icon: Camera },
              { id: "reels", label: "9:16 Vertical Reels", icon: Smartphone },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = mainFilter === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setMainFilter(tab.id as MainFilter)}
                  data-cursor="FILTER"
                  className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-mono-code uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? "border-orchid bg-orchid text-white font-semibold shadow-[0_0_20px_rgba(225,29,72,0.3)]"
                      : "border-white/10 bg-black/40 text-white/60 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-filters when Photography is selected */}
          {mainFilter === "photography" && (
            <div className="flex flex-wrap items-center gap-2 pt-2 animate-fadeIn">
              <span className="font-mono-code text-[11px] text-white/40 uppercase mr-2">
                SUB-CATEGORY:
              </span>
              {[
                { id: "all-photo", label: "All Stills" },
                { id: "portraits", label: "Portraits" },
                { id: "fashion", label: "Fashion / Editorial" },
                { id: "architecture", label: "Architecture / Spaces" },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setPhotoSubFilter(sub.id as PhotoSubFilter)}
                  className={`rounded-md border px-3 py-1 text-[11px] font-mono-code transition-colors ${
                    photoSubFilter === sub.id
                      ? "border-orchid/60 bg-orchid/20 text-white font-medium"
                      : "border-white/5 bg-white/5 text-white/50 hover:text-white"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Gallery Content Matrix */}

        {/* 1. PHOTOGRAPHY STILLS LIGHTBOX GRID */}
        {mainFilter === "photography" ? (
          <div>
            <div className="mb-6 flex items-center justify-between text-xs font-mono-code text-white/40">
              <span>CLICK ANY STILL TO ENTER CINEMA LIGHTBOX</span>
              <span>{allStills.length} STILLS ARCHIVED</span>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {allStills.map((still, idx) => (
                <div
                  key={still.id}
                  onClick={() => openLightbox(idx)}
                  data-cursor="EXPAND"
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#121110] break-inside-avoid transition-all duration-300 hover:border-white/30"
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-black">
                    <Image
                      src={still.url}
                      alt={still.caption || "Photography still"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="font-display text-sm font-semibold text-bone">
                        {still.caption}
                      </p>
                      {still.camera && (
                        <p className="font-mono-code text-[10px] text-white/50 mt-0.5">
                          {still.camera}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : mainFilter === "reels" ? (
          /* 2. REELS 9:16 VERTICAL CARDS (Plays on hover/tap) */
          <div>
            <div className="mb-6 flex items-center justify-between text-xs font-mono-code text-white/40">
              <span>VERTICAL 9:16 KINETIC SOCIAL CINEMA</span>
              <span>HOVER / TAP TO PLAY</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWorks.map((work) => (
                <div
                  key={work.id}
                  onClick={() => openVideo(work.videoUrl, work.title, "9:16")}
                  data-cursor="PLAY"
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#121110] aspect-[9/16] shadow-xl transition-all duration-300 hover:border-orchid"
                >
                  {/* Poster image */}
                  <Image
                    src={work.coverImage}
                    alt={work.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 350px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-85"
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  {/* Top tags */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="font-mono-code text-[10px] font-semibold uppercase tracking-wider rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-md text-white/90">
                      {work.category}
                    </span>
                    <span className="font-mono-code text-[10px] rounded-full bg-orchid/80 px-2.5 py-1 text-white font-bold">
                      {work.duration || "4K 9:16"}
                    </span>
                  </div>

                  {/* Big Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:bg-orchid">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom title & metadata */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="font-mono-code text-[10px] text-white/40 uppercase tracking-widest block mb-1">
                      {work.client}
                    </span>
                    <h3 className="font-display text-lg font-bold uppercase text-bone">
                      {work.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 3. ALL / SHORT FILMS CARDS (Widescreen + modal player) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredWorks.map((work) => (
              <article
                key={work.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111010] transition-all duration-500 hover:border-white/30"
              >
                {/* Visual Cover */}
                <div
                  className="relative aspect-[16/9] w-full overflow-hidden bg-black cursor-pointer"
                  onClick={() => {
                    if (work.videoUrl) {
                      openVideo(work.videoUrl, work.title, work.aspectRatio);
                    }
                  }}
                  data-cursor={work.videoUrl ? "PLAY" : "VIEW"}
                >
                  <Image
                    src={work.coverImage}
                    alt={work.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-90 group-hover:brightness-95"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono-code">
                    <span className="rounded-full border border-white/20 bg-black/70 px-3 py-1 backdrop-blur-md text-white/90">
                      {work.category}
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/70 px-2.5 py-1 backdrop-blur-md text-white/60">
                      {work.year}
                    </span>
                  </div>

                  {/* Center Play Button if has video */}
                  {work.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-orchid group-hover:bg-orchid">
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Runtime & Aspect Badge */}
                  <div className="absolute bottom-4 left-4 font-mono-code text-[10px] text-white/70 bg-black/60 px-2.5 py-1 rounded backdrop-blur-xs">
                    {work.aspectRatio} {work.duration ? `• ${work.duration}` : ""}
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 sm:p-8 flex flex-col justify-between">
                  <div className="mb-6">
                    <div className="font-mono-code text-[11px] text-white/40 uppercase mb-1">
                      CLIENT: {work.client}
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-bone uppercase group-hover:text-orchid transition-colors">
                      {work.title}
                    </h3>

                    <p className="mt-2.5 font-sans-ui text-xs sm:text-sm text-white/60 leading-relaxed line-clamp-2">
                      {work.synopsis}
                    </p>
                  </div>

                  {/* Bottom link row */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs font-mono-code">
                    {work.technicalSpecs?.camera ? (
                      <span className="text-white/40 truncate max-w-[220px]">
                        {work.technicalSpecs.camera}
                      </span>
                    ) : (
                      <span className="text-white/40">RED ORCHID PRODUCTION</span>
                    )}

                    <Link
                      href={`/work/${work.slug}`}
                      data-cursor="CASE STUDY"
                      className="group/btn flex items-center gap-1.5 text-white/80 hover:text-white transition-colors uppercase tracking-wider"
                    >
                      <span>CASE STUDY</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-orchid transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      <VideoModal
        isOpen={videoModalData.isOpen}
        onClose={() => setVideoModalData({ ...videoModalData, isOpen: false })}
        videoUrl={videoModalData.url}
        title={videoModalData.title}
        aspectRatio={videoModalData.aspectRatio}
      />

      {/* Photography Lightbox */}
      <Lightbox
        isOpen={lightboxData.isOpen}
        onClose={() => setLightboxData({ ...lightboxData, isOpen: false })}
        stills={lightboxData.stills}
        initialIndex={lightboxData.initialIndex}
      />
    </div>
  );
}
