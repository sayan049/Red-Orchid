"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { WORKS_DATA } from "@/data/works";
import { WorkItem, StillItem } from "@/types";
import { Lightbox } from "@/components/ui/Lightbox";
import { VideoModal } from "@/components/ui/VideoModal";
import { Play, Pause, Camera, Film, Smartphone, ArrowUpRight, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { sound } from "@/lib/sound";

type MainFilter = "all" | "photography" | "reels" | "short-films";
type PhotoSubFilter = "all-photo" | "portraits" | "fashion" | "architecture";

export default function GalleryPage() {
  const [mainFilter, setMainFilter] = useState<MainFilter>("all");
  const [photoSubFilter, setPhotoSubFilter] = useState<PhotoSubFilter>("all-photo");

  // In-place inline video player state
  const [activeInlineVideoId, setActiveInlineVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Optional full-screen modal if user clicks expand
  const [modalVideoData, setModalVideoData] = useState<{
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

  const toggleInlineVideo = (workId: string) => {
    sound.playClick();
    if (activeInlineVideoId === workId) {
      setActiveInlineVideoId(null);
    } else {
      setActiveInlineVideoId(workId);
    }
  };

  const handleSelectFilter = (id: MainFilter) => {
    sound.playClick();
    setMainFilter(id);
  };

  const handleSelectPhotoSub = (id: PhotoSubFilter) => {
    sound.playClick();
    setPhotoSubFilter(id);
  };

  const openLightbox = (index: number) => {
    sound.playClick();
    setLightboxData({
      isOpen: true,
      initialIndex: index,
      stills: allStills,
    });
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white pt-28 sm:pt-32 pb-20 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-14">
        {/* Page Title & Manifesto */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-2 font-mono-code text-xs text-orchid uppercase tracking-widest mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
            <span>{"// CATALOG & VISUAL REPOSITORY"}</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-bone break-words">
            VISUAL ARCHIVE
          </h1>

          <p className="mt-3 sm:mt-4 font-sans-ui text-xs sm:text-sm md:text-base text-white/60 max-w-2xl leading-relaxed">
            Explorations across short films, medium format photography sets, and vertical cinematic reels. Click any playable work to watch directly in-place.
          </p>
        </div>

        {/* Filter Navigation Tabs with Mobile Horizontal Scroll */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:pb-8 mb-8 sm:mb-12">
          {/* Main Category Tabs */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "all", label: "All Works", icon: null },
              { id: "short-films", label: "Short Films", icon: Film },
              { id: "photography", label: "Photography & Stills", icon: Camera },
              { id: "reels", label: "9:16 Reels", icon: Smartphone },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = mainFilter === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectFilter(tab.id as MainFilter)}
                  data-cursor="FILTER"
                  className={`flex items-center gap-2 rounded-full border px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-mono-code uppercase tracking-wider whitespace-nowrap shrink-0 transition-all duration-300 min-h-[44px] touch-manipulation cursor-pointer active:scale-95 ${
                    isActive
                      ? "border-orchid bg-orchid text-white font-semibold shadow-[0_0_20px_rgba(225,29,72,0.3)]"
                      : "border-white/10 bg-black/40 text-white/60 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-filters when Photography is selected */}
          {mainFilter === "photography" && (
            <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1 scrollbar-none animate-fadeIn">
              <span className="font-mono-code text-[10px] sm:text-[11px] text-white/40 uppercase whitespace-nowrap mr-1">
                FILTER:
              </span>
              {[
                { id: "all-photo", label: "All Stills" },
                { id: "portraits", label: "Portraits" },
                { id: "fashion", label: "Fashion / Editorial" },
                { id: "architecture", label: "Architecture / Spaces" },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSelectPhotoSub(sub.id as PhotoSubFilter)}
                  className={`rounded-md border px-3 py-1.5 text-[11px] font-mono-code whitespace-nowrap transition-colors min-h-[36px] touch-manipulation cursor-pointer active:scale-95 ${
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
              <span>TAP ANY STILL TO ENTER LIGHTBOX</span>
              <span>{allStills.length} STILLS ARCHIVED</span>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
              {allStills.map((still, idx) => (
                <div
                  key={still.id}
                  onClick={() => openLightbox(idx)}
                  data-cursor="EXPAND"
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#121110] break-inside-avoid transition-all duration-300 hover:border-white/30 touch-manipulation active:scale-[0.99]"
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-black">
                    <Image
                      src={still.url}
                      alt={still.caption || "Photography still"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
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
          /* 2. REELS 9:16 VERTICAL CARDS (Plays directly in-place on card!) */
          <div>
            <div className="mb-6 flex items-center justify-between text-xs font-mono-code text-white/40">
              <span>VERTICAL 9:16 KINETIC SOCIAL CINEMA</span>
              <span>TAP ANY CARD TO PLAY IN-PLACE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredWorks.map((work) => {
                const isPlaying = activeInlineVideoId === work.id;

                return (
                  <div
                    key={work.id}
                    onClick={() => toggleInlineVideo(work.id)}
                    data-cursor={isPlaying ? "PAUSE" : "PLAY IN-PLACE"}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#121110] aspect-[9/16] shadow-xl transition-all duration-300 hover:border-orchid touch-manipulation active:scale-[0.99]"
                  >
                    {/* Poster Image */}
                    <Image
                      src={work.coverImage}
                      alt={work.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 350px"
                      className={`object-cover transition-transform duration-700 filter brightness-85 ${
                        isPlaying ? "opacity-0 pointer-events-none" : "opacity-100 group-hover:scale-105"
                      }`}
                    />

                    {/* In-place video playback */}
                    {work.videoUrl && isPlaying && (
                      <div className="absolute inset-0 z-20 bg-black">
                        <video
                          src={work.videoUrl}
                          autoPlay
                          loop
                          muted={isMuted}
                          playsInline
                          className="h-full w-full object-cover"
                        />

                        {/* Top controls */}
                        <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between">
                          <span className="font-mono-code text-[10px] rounded-full bg-orchid px-2.5 py-1 text-white font-bold">
                            PLAYING
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              sound.playClick();
                              setIsMuted(!isMuted);
                            }}
                            className="rounded-full bg-black/70 p-2 text-white hover:text-orchid backdrop-blur-md"
                            aria-label={isMuted ? "Unmute" : "Mute"}
                          >
                            {isMuted ? <VolumeX className="h-4 w-4" strokeWidth={1.5} /> : <Volume2 className="h-4 w-4 text-orchid" strokeWidth={1.5} />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Gradient overlays when not playing */}
                    {!isPlaying && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                        {/* Top tags */}
                        <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between">
                          <span className="font-mono-code text-[10px] font-semibold uppercase tracking-wider rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-md text-white/90">
                            {work.category}
                          </span>
                          <span className="font-mono-code text-[10px] rounded-full bg-orchid/80 px-2.5 py-1 text-white font-bold">
                            {work.duration || "4K 9:16"}
                          </span>
                        </div>

                        {/* Big Play button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:bg-orchid">
                            <Play className="h-5 w-5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Bottom title & metadata */}
                    <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-30 pointer-events-none">
                      <span className="font-mono-code text-[10px] text-white/50 uppercase tracking-widest block mb-1">
                        {work.client}
                      </span>
                      <h3 className="font-display text-base sm:text-lg font-bold uppercase text-bone">
                        {work.title}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* 3. ALL / SHORT FILMS CARDS (Plays directly in-place on card!) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {filteredWorks.map((work) => {
              const isPlaying = activeInlineVideoId === work.id;

              return (
                <article
                  key={work.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111010] transition-all duration-500 hover:border-white/30"
                >
                  {/* Visual Cover Stage with In-Place Playback */}
                  <div
                    className="relative aspect-[16/9] w-full overflow-hidden bg-black cursor-pointer"
                    onClick={() => {
                      if (work.videoUrl) {
                        toggleInlineVideo(work.id);
                      }
                    }}
                    data-cursor={work.videoUrl ? (isPlaying ? "PAUSE" : "PLAY IN-PLACE") : "VIEW"}
                  >
                    {/* Poster image */}
                    <Image
                      src={work.coverImage}
                      alt={work.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className={`object-cover transition-transform duration-700 ease-out filter brightness-90 ${
                        isPlaying ? "opacity-0 pointer-events-none" : "opacity-100 group-hover:scale-105"
                      }`}
                    />

                    {/* In-place video player */}
                    {work.videoUrl && isPlaying && (
                      <div className="absolute inset-0 z-20 bg-black">
                        <video
                          src={work.videoUrl}
                          autoPlay
                          loop
                          muted={isMuted}
                          playsInline
                          className="h-full w-full object-cover"
                        />

                        {/* Inline playback controls */}
                        <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between rounded-lg bg-black/75 px-3 py-2 backdrop-blur-md text-xs font-mono-code">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleInlineVideo(work.id);
                              }}
                              className="text-white hover:text-orchid"
                            >
                              <Pause className="h-4 w-4 fill-current" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                sound.playClick();
                                setIsMuted(!isMuted);
                              }}
                              className="text-white hover:text-orchid"
                            >
                              {isMuted ? <VolumeX className="h-4 w-4" strokeWidth={1.5} /> : <Volume2 className="h-4 w-4 text-orchid" strokeWidth={1.5} />}
                            </button>
                            <span className="text-[10px] text-white/70 uppercase">IN-PLACE</span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              sound.playClick();
                              setModalVideoData({
                                isOpen: true,
                                url: work.videoUrl || "",
                                title: work.title,
                                aspectRatio: work.aspectRatio,
                              });
                            }}
                            className="text-white/60 hover:text-white"
                            title="Expand to Fullscreen Cinema"
                          >
                            <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Overlay when not playing */}
                    {!isPlaying && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between text-[10px] sm:text-[11px] font-mono-code pointer-events-none">
                          <span className="rounded-full border border-white/20 bg-black/70 px-2.5 sm:px-3 py-1 backdrop-blur-md text-white/90">
                            {work.category}
                          </span>
                          <span className="rounded-full border border-white/10 bg-black/70 px-2 sm:px-2.5 py-1 backdrop-blur-md text-white/60">
                            {work.year}
                          </span>
                        </div>

                        {/* Center Play Button if has video */}
                        {work.videoUrl && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-orchid group-hover:bg-orchid">
                              <Play className="h-5 w-5 fill-current ml-0.5" />
                            </div>
                          </div>
                        )}

                        {/* Runtime Badge */}
                        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 font-mono-code text-[9px] sm:text-[10px] text-white/70 bg-black/60 px-2.5 py-1 rounded backdrop-blur-xs">
                          {work.aspectRatio} {work.duration ? `• ${work.duration}` : ""}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Details Section */}
                  <div className="p-5 sm:p-7 md:p-8 flex flex-col justify-between">
                    <div className="mb-5 sm:mb-6">
                      <div className="font-mono-code text-[10px] sm:text-[11px] text-white/40 uppercase mb-1">
                        CLIENT: {work.client}
                      </div>

                      <h3 className="font-display text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-bone uppercase group-hover:text-orchid transition-colors break-words">
                        {work.title}
                      </h3>

                      <p className="mt-2 font-sans-ui text-xs sm:text-sm text-white/60 leading-relaxed line-clamp-2">
                        {work.synopsis}
                      </p>
                    </div>

                    {/* Bottom link row */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs font-mono-code">
                      {work.technicalSpecs?.camera ? (
                        <span className="text-white/40 truncate max-w-[200px] text-[11px]">
                          {work.technicalSpecs.camera}
                        </span>
                      ) : (
                        <span className="text-white/40 text-[11px]">RED ORCHID PRODUCTION</span>
                      )}

                      <Link
                        href={`/work/${work.slug}`}
                        onClick={() => sound.playClick()}
                        data-cursor="CASE STUDY"
                        className="group/btn flex items-center gap-1.5 text-white/80 hover:text-white transition-colors uppercase tracking-wider py-1"
                      >
                        <span>CASE STUDY</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-orchid transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" strokeWidth={1.5} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Expandable Cinema Modal if requested */}
      <VideoModal
        isOpen={modalVideoData.isOpen}
        onClose={() => setModalVideoData({ ...modalVideoData, isOpen: false })}
        videoUrl={modalVideoData.url}
        title={modalVideoData.title}
        aspectRatio={modalVideoData.aspectRatio}
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
