"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { WorkItem } from "@/types";
import { VideoModal } from "@/components/ui/VideoModal";
import { sound } from "@/lib/sound";

interface TrendingWorksProps {
  works: WorkItem[];
}

export function TrendingWorks({ works }: TrendingWorksProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [playingCardId, setPlayingCardId] = useState<string | null>(null);
  const [activeModalWork, setActiveModalWork] = useState<WorkItem | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const scroll = (direction: "left" | "right") => {
    sound.playClick();
    if (!scrollContainerRef.current) return;
    const scrollAmount = window.innerWidth > 768 ? 580 : window.innerWidth * 0.82;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const trendingItems = works.filter((w) => w.trending);

  const handleToggleInlinePlay = (e: React.MouseEvent, work: WorkItem) => {
    e.preventDefault();
    e.stopPropagation();
    sound.playClick();
    if (playingCardId === work.id) {
      setPlayingCardId(null);
    } else {
      setPlayingCardId(work.id);
    }
  };

  return (
    <section
      id="trending"
      className="relative w-full border-t border-white/10 bg-[#070707] py-20 sm:py-28 text-white overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-14">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <div className="flex items-center gap-2.5 font-mono-code text-xs text-orchid uppercase tracking-widest mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
              <span>{"// SPOTLIGHT ARCHIVE"}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-bone uppercase break-words">
              TRENDING CINEMA
            </h2>
          </div>

          {/* Slider controls & hint */}
          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            <span className="font-mono-code text-[11px] sm:text-xs text-white/40">
              TAP PLAY TO WATCH IN-PLACE
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll trending works left"
                className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll trending works right"
                className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Track - Perfectly aligned inside max-w-7xl with proper margins */}
        <div
          ref={scrollContainerRef}
          data-cursor="DRAG"
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {trendingItems.map((work) => {
            const isPlayingThis = playingCardId === work.id;

            return (
              <article
                key={work.id}
                className="group relative flex-none w-[85vw] sm:w-[480px] md:w-[560px] lg:w-[580px] snap-start overflow-hidden rounded-xl border border-white/10 bg-[#111010] transition-all duration-500 hover:border-white/30"
              >
                {/* Visual media container with in-place playback */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                  {/* Poster image */}
                  <Image
                    src={work.coverImage}
                    alt={work.title}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 480px, 580px"
                    className={`object-cover transition-transform duration-700 ease-out filter brightness-90 ${
                      isPlayingThis ? "opacity-0 pointer-events-none" : "opacity-100 group-hover:scale-105"
                    }`}
                  />

                  {/* Inline in-place video player */}
                  {work.videoUrl && isPlayingThis && (
                    <div className="absolute inset-0 z-20 bg-black">
                      <video
                        src={work.videoUrl}
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        className="h-full w-full object-cover"
                      />

                      {/* Inline video control overlay */}
                      <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between rounded-lg bg-black/75 px-3 py-2 backdrop-blur-md text-xs font-mono-code">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => handleToggleInlinePlay(e, work)}
                            className="text-white hover:text-orchid transition-colors"
                            aria-label="Pause video"
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
                            className="text-white hover:text-orchid transition-colors"
                            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                          >
                            {isMuted ? (
                              <VolumeX className="h-4 w-4" strokeWidth={1.5} />
                            ) : (
                              <Volume2 className="h-4 w-4 text-orchid" strokeWidth={1.5} />
                            )}
                          </button>
                          <span className="text-[10px] text-white/60 uppercase">IN-PLACE</span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            sound.playClick();
                            setActiveModalWork(work);
                          }}
                          className="text-white/70 hover:text-white transition-colors p-1"
                          aria-label="Expand to full screen cinema"
                          title="Expand cinema view"
                        >
                          <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Gradient vignette */}
                  {!isPlayingThis && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                  )}

                  {/* Top metadata tags */}
                  <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-10 flex items-center justify-between text-[10px] sm:text-[11px] font-mono-code pointer-events-none">
                    <span className="rounded-full border border-white/20 bg-black/70 px-2.5 sm:px-3 py-1 backdrop-blur-md text-white/90">
                      {work.category}
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/70 px-2 sm:px-2.5 py-1 backdrop-blur-md text-white/60">
                      {work.year}
                    </span>
                  </div>

                  {/* Play/Pause in-place action button */}
                  {work.videoUrl && !isPlayingThis && (
                    <button
                      type="button"
                      onClick={(e) => handleToggleInlinePlay(e, work)}
                      data-cursor="PLAY"
                      aria-label={`Play ${work.title} video directly in this card`}
                      className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/30 bg-black/80 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-orchid hover:bg-orchid"
                    >
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </button>
                  )}
                </div>

                {/* Bottom details */}
                <div className="p-5 sm:p-7 md:p-8 flex flex-col justify-between">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 font-mono-code text-[10px] sm:text-[11px] text-white/40 uppercase mb-2">
                      <span>CLIENT: {work.client}</span>
                      {work.technicalSpecs?.camera && (
                        <>
                          <span>•</span>
                          <span className="truncate">{work.technicalSpecs.camera}</span>
                        </>
                      )}
                    </div>

                    <h3 className="font-display text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-bone uppercase group-hover:text-orchid transition-colors break-words">
                      {work.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 font-sans-ui text-xs sm:text-sm text-white/60 leading-relaxed">
                      {work.synopsis}
                    </p>
                  </div>

                  {/* View case study link */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs font-mono-code">
                    <span className="text-white/40 text-[11px]">
                      {work.duration ? `RUNTIME: ${work.duration}` : `ASPECT: ${work.aspectRatio}`}
                    </span>

                    <Link
                      href={`/work/${work.slug}`}
                      onClick={() => sound.playClick()}
                      data-cursor="VIEW"
                      className="group/link inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
                    >
                      <span className="uppercase tracking-wider">PROJECT DETAILS</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 text-orchid" strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Video Modal trigger if user chooses to expand */}
      {activeModalWork && (
        <VideoModal
          isOpen={!!activeModalWork}
          onClose={() => setActiveModalWork(null)}
          videoUrl={activeModalWork.videoUrl}
          title={activeModalWork.title}
          aspectRatio={activeModalWork.aspectRatio}
        />
      )}
    </section>
  );
}
