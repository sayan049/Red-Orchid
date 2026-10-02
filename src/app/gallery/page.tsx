"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { WORKS_DATA } from "@/data/works";
import { WorkItem, StillItem } from "@/types";
import { Lightbox } from "@/components/ui/Lightbox";
import { VideoModal } from "@/components/ui/VideoModal";
import { CoverflowCarousel, CoverflowSlide } from "@/components/ui/coverflow-carousel";
import { ArgentLoopInfiniteSlider, ProjectData } from "@/components/ui/argent-loop-infinite-slider";
import {
  Play,
  Pause,
  Camera,
  Film,
  Smartphone,
  ArrowUpRight,
  Volume2,
  VolumeX,
  Maximize2,
  LayoutGrid,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import { sound } from "@/lib/sound";

type MainFilter = "all" | "photography" | "reels" | "short-films";
type PhotoSubFilter = "all-photo" | "portraits" | "fashion" | "architecture";
type ViewMode = "grid" | "coverflow" | "slider";

export default function GalleryPage() {
  const [mainFilter, setMainFilter] = useState<MainFilter>("all");
  const [photoSubFilter, setPhotoSubFilter] = useState<PhotoSubFilter>("all-photo");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // In-place inline video player state (for Grid view)
  const [activeInlineVideoId, setActiveInlineVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Fullscreen video modal state
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

  // Lightbox state for photography stills
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

  // Filtered photography stills when subfilter is active
  const filteredStills = useMemo(() => {
    if (photoSubFilter === "all-photo") return allStills;
    return allStills.filter((s) => {
      const text = `${s.caption} ${s.camera || ""}`.toLowerCase();
      if (photoSubFilter === "portraits") return text.includes("portrait") || text.includes("face") || text.includes("model");
      if (photoSubFilter === "fashion") return text.includes("fashion") || text.includes("wardrobe") || text.includes("lookbook");
      if (photoSubFilter === "architecture") return text.includes("architecture") || text.includes("space") || text.includes("interior");
      return true;
    });
  }, [allStills, photoSubFilter]);

  // Filtered works by category
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
    setActiveInlineVideoId(null);
  };

  const handleSelectPhotoSub = (id: PhotoSubFilter) => {
    sound.playClick();
    setPhotoSubFilter(id);
  };

  const handleSelectViewMode = (mode: ViewMode) => {
    sound.playClick();
    setViewMode(mode);
    setActiveInlineVideoId(null);
  };

  const openLightbox = (index: number, stillsList: StillItem[] = allStills) => {
    sound.playClick();
    setLightboxData({
      isOpen: true,
      initialIndex: index,
      stills: stillsList,
    });
  };

  const openVideoModal = (url: string, title: string, aspectRatio: string = "2.39:1") => {
    sound.playClick();
    setModalVideoData({
      isOpen: true,
      url,
      title,
      aspectRatio,
    });
  };

  // -------------------------------------------------------------
  // Data Adaptor: Coverflow Slides
  // -------------------------------------------------------------
  const coverflowSlides: CoverflowSlide[] = useMemo(() => {
    if (mainFilter === "photography") {
      return filteredStills.map((still, idx) => ({
        src: still.url,
        alt: still.caption || "Photography Still",
        title: still.caption || "Analogue Emulsion Still",
        subtitle: still.camera ? `${still.camera}` : "Red Orchid Archive",
        category: "Photography",
        meta: [
          { label: "Format", value: still.aspectRatio || "4:5" },
          { label: "ISO", value: still.iso || "400" },
        ],
        onClick: () => openLightbox(idx, filteredStills),
      }));
    }

    return filteredWorks.map((work) => {
      const meta = [
        { label: "Year", value: work.year },
        { label: "Format", value: work.aspectRatio || "CinemaScope" },
      ];
      if (work.duration) {
        meta.push({ label: "Runtime", value: work.duration });
      }

      return {
        src: work.coverImage,
        alt: work.title,
        title: work.title,
        subtitle: `${work.client} — ${work.synopsis}`,
        category: work.category,
        client: work.client,
        videoUrl: work.videoUrl,
        slug: work.slug,
        meta,
        onClick: () => {
          if (work.videoUrl) {
            openVideoModal(work.videoUrl, work.title, work.aspectRatio);
          } else if (work.stills && work.stills.length > 0) {
            openLightbox(0, work.stills);
          }
        },
      };
    });
  }, [mainFilter, filteredStills, filteredWorks]);

  // -------------------------------------------------------------
  // Data Adaptor: Argent Loop Infinite Slider Items
  // -------------------------------------------------------------
  const sliderItems: ProjectData[] = useMemo(() => {
    if (mainFilter === "photography") {
      return filteredStills.map((still, idx) => ({
        title: still.caption || "Analogue Emulsion Still",
        image: still.url,
        category: "Photography",
        year: "2024",
        description: still.camera ? `${still.camera} • ISO ${still.iso || "400"}` : "Medium Format Emulsion Still",
        onAction: () => openLightbox(idx, filteredStills),
      }));
    }

    return filteredWorks.map((work) => ({
      title: work.title,
      image: work.coverImage,
      category: work.category,
      year: work.year,
      description: `${work.client} — ${work.synopsis}`,
      videoUrl: work.videoUrl,
      aspectRatio: work.aspectRatio,
      client: work.client,
      slug: work.slug,
      onAction: () => {
        if (work.videoUrl) {
          openVideoModal(work.videoUrl, work.title, work.aspectRatio);
        } else if (work.stills && work.stills.length > 0) {
          openLightbox(0, work.stills);
        }
      },
    }));
  }, [mainFilter, filteredStills, filteredWorks]);

  return (
    <div className="min-h-screen bg-[#070707] text-white pt-28 sm:pt-32 pb-20 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-14">
        {/* Page Title & Manifesto */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 font-mono-code text-xs text-orchid uppercase tracking-widest mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
            <span>{"// CATALOG & VISUAL REPOSITORY"}</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-bone break-words">
            VISUAL ARCHIVE
          </h1>

          <p className="mt-3 sm:mt-4 font-sans-ui text-xs sm:text-sm md:text-base text-white/60 max-w-2xl leading-relaxed">
            Explorations across short films, medium format photography sets, and vertical cinematic reels. Switch between Pinterest Grid, 3D Coverflow, and Parallax Loop Slider.
          </p>
        </div>

        {/* Toolbar: Category Filters + View Mode Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border-b border-white/10 pb-6 sm:pb-8 mb-8 sm:mb-12">
          {/* Left: Category Navigation Tabs */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
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
                  className={`flex items-center gap-2 rounded-full border px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-mono-code uppercase tracking-wider whitespace-nowrap shrink-0 transition-all duration-300 min-h-[42px] touch-manipulation cursor-pointer active:scale-95 ${
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

          {/* Right: View Mode Selector (Grid / Coverflow / Slider) */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono-code text-[10px] sm:text-[11px] text-white/40 uppercase tracking-widest hidden sm:inline-block mr-1">
              VIEW AS:
            </span>
            <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/70 p-1 backdrop-blur-md shadow-lg">
              <button
                type="button"
                onClick={() => handleSelectViewMode("grid")}
                aria-label="Pinterest Grid Layout"
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider transition-all min-h-[36px] cursor-pointer touch-manipulation active:scale-95 ${
                  viewMode === "grid"
                    ? "bg-orchid text-white font-semibold shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>GRID</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectViewMode("coverflow")}
                aria-label="3D Coverflow View"
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider transition-all min-h-[36px] cursor-pointer touch-manipulation active:scale-95 ${
                  viewMode === "coverflow"
                    ? "bg-orchid text-white font-semibold shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>COVERFLOW</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectViewMode("slider")}
                aria-label="Parallax Infinite Slider"
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider transition-all min-h-[36px] cursor-pointer touch-manipulation active:scale-95 ${
                  viewMode === "slider"
                    ? "bg-orchid text-white font-semibold shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>SLIDER</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-filters when Photography is selected */}
        {mainFilter === "photography" && (
          <div className="flex items-center gap-2 pt-1 mb-8 overflow-x-auto pb-1 scrollbar-none animate-in fade-in duration-200">
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
                className={`rounded-md border px-3 py-1.5 text-[11px] font-mono-code whitespace-nowrap transition-colors min-h-[34px] touch-manipulation cursor-pointer active:scale-95 ${
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

        {/* ========================================================= */}
        {/* VIEW MODE 1: PINTEREST GRID                               */}
        {/* ========================================================= */}
        {viewMode === "grid" && (
          <div>
            <div className="mb-6 flex items-center justify-between text-xs font-mono-code text-white/40">
              <span className="uppercase tracking-wider">
                {mainFilter === "photography"
                  ? "TAP ANY STILL TO ENTER LIGHTBOX"
                  : mainFilter === "reels"
                  ? "VERTICAL 9:16 KINETIC SOCIAL CINEMA • TAP TO PLAY"
                  : mainFilter === "short-films"
                  ? "LARGE-FORMAT NARRATIVE ARCHIVE • TAP TO PLAY"
                  : "PINTEREST MASONRY ARCHIVE • TAP ANY ITEM TO PREVIEW"}
              </span>
              <span>
                {mainFilter === "photography"
                  ? `${filteredStills.length} STILLS`
                  : `${filteredWorks.length} WORKS`}
              </span>
            </div>

            {/* Pinterest Multi-Column Masonry Layout */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
              {/* Category: Photography */}
              {mainFilter === "photography"
                ? filteredStills.map((still, idx) => (
                    <div
                      key={still.id}
                      onClick={() => openLightbox(idx, filteredStills)}
                      className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#121110] break-inside-avoid transition-all duration-300 hover:border-orchid/80 touch-manipulation active:scale-[0.99] shadow-lg"
                    >
                      <div className="relative w-full aspect-[4/5] overflow-hidden bg-black">
                        <Image
                          src={still.url}
                          alt={still.caption || "Photography still"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                  ))
                : /* Category: All Works, Reels, or Short Films */
                  filteredWorks.map((work) => {
                    const isReel = work.category === "Reels";
                    const isPlaying = activeInlineVideoId === work.id;

                    return (
                      <article
                        key={work.id}
                        className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111010] break-inside-avoid transition-all duration-300 hover:border-orchid/80 shadow-xl ${
                          isReel ? "aspect-[9/16]" : ""
                        }`}
                      >
                        {/* Visual Stage */}
                        <div
                          className={`relative w-full overflow-hidden bg-black cursor-pointer ${
                            isReel ? "h-full" : "aspect-[16/9]"
                          }`}
                          onClick={() => {
                            if (work.videoUrl) {
                              toggleInlineVideo(work.id);
                            } else if (work.stills && work.stills.length > 0) {
                              openLightbox(0, work.stills);
                            }
                          }}
                        >
                          <Image
                            src={work.coverImage}
                            alt={work.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className={`object-cover transition-transform duration-700 ease-out filter brightness-90 ${
                              isPlaying
                                ? "opacity-0 pointer-events-none"
                                : "opacity-100 group-hover:scale-105 group-hover:brightness-100"
                            }`}
                          />

                          {/* In-place Video Playing */}
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

                              <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between">
                                <span className="font-mono-code text-[10px] rounded-full bg-orchid px-2.5 py-1 text-white font-bold">
                                  PLAYING
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      sound.playClick();
                                      setIsMuted(!isMuted);
                                    }}
                                    className="rounded-full bg-black/75 p-2 text-white hover:text-orchid backdrop-blur-md cursor-pointer"
                                    aria-label={isMuted ? "Unmute" : "Mute"}
                                  >
                                    {isMuted ? (
                                      <VolumeX className="h-4 w-4" strokeWidth={1.5} />
                                    ) : (
                                      <Volume2 className="h-4 w-4 text-orchid" strokeWidth={1.5} />
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openVideoModal(work.videoUrl || "", work.title, work.aspectRatio);
                                    }}
                                    className="rounded-full bg-black/75 p-2 text-white hover:text-orchid backdrop-blur-md cursor-pointer"
                                    title="Fullscreen Cinema"
                                  >
                                    <Maximize2 className="h-4 w-4" strokeWidth={1.5} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Overlay when paused */}
                          {!isPlaying && (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent pointer-events-none" />

                              {/* Top Badges */}
                              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono-code pointer-events-none">
                                <span className="rounded-full border border-white/20 bg-black/70 px-2.5 py-1 backdrop-blur-md text-white/90">
                                  {work.category}
                                </span>
                                <span className="rounded-full border border-white/10 bg-black/70 px-2 py-1 backdrop-blur-md text-white/60">
                                  {work.duration || work.year}
                                </span>
                              </div>

                              {/* Play Button Indicator */}
                              {work.videoUrl && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-orchid group-hover:bg-orchid">
                                    <Play className="h-5 w-5 fill-current ml-0.5" />
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Text Content (if not a pure 9:16 full-card reel) */}
                        {!isReel ? (
                          <div className="p-4 sm:p-5">
                            <div className="font-mono-code text-[10px] text-white/40 uppercase mb-1">
                              {work.client}
                            </div>
                            <h3 className="font-display text-base sm:text-lg font-bold uppercase tracking-tight text-bone group-hover:text-orchid transition-colors">
                              {work.title}
                            </h3>
                            <p className="mt-1.5 font-sans-ui text-xs text-white/60 line-clamp-2 leading-relaxed">
                              {work.synopsis}
                            </p>

                            <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3 text-xs font-mono-code">
                              <span className="text-[10px] text-white/40">
                                {work.technicalSpecs?.camera || "35MM / ARRI LF"}
                              </span>
                              <Link
                                href={`/work/${work.slug}`}
                                onClick={() => sound.playClick()}
                                className="flex items-center gap-1 text-[11px] text-white/70 hover:text-white uppercase tracking-wider"
                              >
                                <span>CASE STUDY</span>
                                <ArrowUpRight className="h-3 w-3 text-orchid" strokeWidth={1.5} />
                              </Link>
                            </div>
                          </div>
                        ) : (
                          /* Reel Bottom Title Overlay */
                          <div className="absolute bottom-3 left-3 right-3 z-30 pointer-events-none">
                            <span className="font-mono-code text-[10px] text-white/50 uppercase tracking-widest block mb-0.5">
                              {work.client}
                            </span>
                            <h3 className="font-display text-sm font-bold uppercase text-bone">
                              {work.title}
                            </h3>
                          </div>
                        )}
                      </article>
                    );
                  })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW MODE 2: 3D COVERFLOW CAROUSEL                        */}
        {/* ========================================================= */}
        {viewMode === "coverflow" && (
          <div className="py-4">
            <div className="mb-4 flex items-center justify-between text-xs font-mono-code text-white/40">
              <span className="uppercase tracking-wider">
                DRAG OR USE ARROW KEYS TO CYCLE 3D COVERFLOW • CLICK TO INSPECT
              </span>
              <span>{coverflowSlides.length} ARCHIVED SLIDES</span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0c0b0b]/60 p-4 sm:p-8 backdrop-blur-md shadow-2xl">
              <CoverflowCarousel
                slides={coverflowSlides}
                showCaption
                showNavigation
                showPagination
                cardWidth="clamp(220px, 28vw, 340px)"
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW MODE 3: ARGENT LOOP INFINITE PARALLAX SLIDER         */}
        {/* ========================================================= */}
        {viewMode === "slider" && (
          <div className="py-4">
            <div className="mb-4 flex items-center justify-between text-xs font-mono-code text-white/40">
              <span className="uppercase tracking-wider">
                SCROLL OR DRAG TO RUN INFINITE PARALLAX FILMSTRIP • SYNCHRONIZED MINIMAP
              </span>
              <span>{sliderItems.length} SEQUENCES</span>
            </div>

            <ArgentLoopInfiniteSlider items={sliderItems} />
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
