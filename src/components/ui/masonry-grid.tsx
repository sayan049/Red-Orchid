"use client";

import * as React from "react";
import Image from "next/image";
import {
  Share2,
  Check,
  MoreHorizontal,
  Bookmark,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Play,
} from "lucide-react";
import { sound } from "@/lib/sound";

export interface MasonryItem {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
  author?: string;
  avatar?: string;
  videoUrl?: string;
  category?: string;
  aspectRatio?: string;
  client?: string;
  camera?: string;
  slug?: string;
}

export interface MasonryGridProps {
  items: MasonryItem[];
  onItemClick?: (item: MasonryItem, index: number) => void;
  showMeta?: boolean;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
}

export function MasonryGrid({
  items,
  onItemClick,
  showMeta = true,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  className = "",
}: MasonryGridProps) {
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  // Infinite scroll intersection observer
  React.useEffect(() => {
    if (!onLoadMore || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: "300px" },
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, isLoading, onLoadMore]);

  // Lightbox keyboard controls
  React.useEffect(() => {
    if (selectedIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIdx(null);
      } else if (e.key === "ArrowRight") {
        setSelectedIdx((prev) => (prev !== null ? (prev + 1) % items.length : 0));
      } else if (e.key === "ArrowLeft") {
        setSelectedIdx((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : 0));
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [items.length, selectedIdx]);

  const handleShare = async (e: React.MouseEvent, item: MasonryItem) => {
    e.stopPropagation();
    try {
      sound.playClick();
      const shareUrl = typeof window !== "undefined" ? window.location.href : item.src;
      if (navigator.share) {
        await navigator.share({
          title: item.title || "Red Orchid Films",
          url: shareUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopiedId(item.id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(item.src).catch(() => {});
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    }
  };

  const handleItemPress = (item: MasonryItem, index: number) => {
    try {
      sound.playClick();
    } catch {}
    if (onItemClick) {
      onItemClick(item, index);
    } else {
      setSelectedIdx(index);
    }
  };

  const activeItem = selectedIdx !== null ? items[selectedIdx] : null;

  return (
    <div className={`w-full max-w-[1600px] mx-auto px-4 md:px-6 ${className}`}>
      {/* CSS Multi-Column Masonry Grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4">
        {items.map((item, index) => {
          return (
            <div
              key={item.id || index}
              className="break-inside-avoid mb-4 group cursor-zoom-in"
              onClick={() => handleItemPress(item, index)}
            >
              {/* Card Container with subtle scale */}
              <div
                className="relative overflow-hidden rounded-2xl bg-muted/40 transition-transform duration-200 ease-out will-change-transform group-hover:scale-[1.02] border border-white/5 hover:border-white/20"
                style={{
                  aspectRatio: `${item.width} / ${item.height}`,
                }}
              >
                {/* Lazy-Loaded Image */}
                <Image
                  src={item.src}
                  alt={item.alt || item.title || "Gallery photo"}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  loading="lazy"
                  decoding="async"
                  className="object-cover transition-opacity duration-300 filter brightness-95 group-hover:brightness-100"
                />

                {/* Video Play Indicator Badge if Video */}
                {item.videoUrl && (
                  <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    <span className="flex items-center gap-1 font-mono-code text-[10px] font-bold uppercase tracking-wider rounded-full bg-black/70 px-2.5 py-1 text-white backdrop-blur-md border border-white/10">
                      <Play className="h-2.5 w-2.5 fill-current text-rose-500" />
                      <span>{item.category || "CINEMA"}</span>
                    </span>
                  </div>
                )}

                {/* Desktop Hover Overlay (Hidden on touch devices via @media (hover: hover)) */}
                <div className="absolute inset-0 z-20 hidden md:flex flex-col justify-end p-3.5 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  {/* Bottom Row: Title + Workable Share Icon Button */}
                  <div className="flex items-center justify-between gap-3 pointer-events-auto">
                    <div className="truncate pr-1">
                      {item.title && (
                        <p className="font-display text-xs sm:text-sm font-semibold text-white truncate leading-tight">
                          {item.title}
                        </p>
                      )}
                      {item.client && (
                        <p className="font-mono-code text-[10px] text-white/70 uppercase truncate mt-0.5">
                          {item.client}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center">
                      <button
                        type="button"
                        onClick={(e) => handleShare(e, item)}
                        aria-label="Share"
                        title={copiedId === item.id ? "Link copied" : "Share"}
                        className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-90 ${
                          copiedId === item.id
                            ? "bg-white text-black scale-105"
                            : "bg-black/60 text-white/90 hover:bg-white hover:text-black border border-white/20"
                        }`}
                      >
                        {copiedId === item.id ? (
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                        ) : (
                          <Share2 className="h-3.5 w-3.5" strokeWidth={2} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Meta Below Image (Pinterest Style Title & Author) */}
              {showMeta && (item.title || item.author) && (
                <div className="mt-2 px-1 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    {/* Tiny avatar */}
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground uppercase overflow-hidden border border-white/10">
                      {item.avatar ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.avatar}
                          alt={item.author || "Author"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{(item.author || item.client || "RO")[0]}</span>
                      )}
                    </div>

                    <div className="flex flex-col truncate">
                      {item.title && (
                        <span className="font-sans-ui text-xs font-medium text-foreground truncate">
                          {item.title}
                        </span>
                      )}
                      {item.author && (
                        <span className="font-mono-code text-[10.5px] text-muted-foreground truncate">
                          {item.author}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Shimmering Skeleton Loading State */}
      {isLoading && (
        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 mt-4 animate-pulse">
          {[280, 420, 310, 500, 360, 460, 300, 400].map((h, i) => (
            <div
              key={i}
              className="break-inside-avoid mb-4 rounded-2xl bg-muted/30 overflow-hidden"
              style={{ height: `${h}px` }}
            >
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
          ))}
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      {hasMore && (
        <div ref={sentinelRef} className="py-8 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Built-in Lightbox Modal if onItemClick is not provided */}
      {selectedIdx !== null && activeItem && !onItemClick && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6 backdrop-blur-2xl select-none animate-in fade-in duration-200"
          onClick={() => setSelectedIdx(null)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setSelectedIdx(null)}
            aria-label="Close"
            className="absolute top-4 sm:top-6 right-4 sm:right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white hover:bg-white hover:text-black transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Prev Arrow */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIdx((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : 0));
              }}
              aria-label="Previous"
              className="absolute left-3 sm:left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white hover:border-white hover:scale-110 transition-all cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Next Arrow */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIdx((prev) => (prev !== null ? (prev + 1) % items.length : 0));
              }}
              aria-label="Next"
              className="absolute right-3 sm:right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white hover:border-white hover:scale-110 transition-all cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Main Large Image Centered */}
          <div
            className="relative max-h-[85vh] max-w-[90vw] h-full w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeItem.src}
              alt={activeItem.alt || activeItem.title || "Photo"}
              fill
              priority
              className="object-contain filter contrast-[1.02]"
              sizes="95vw"
            />
          </div>

          {/* Bottom Caption Bar */}
          <div
            className="absolute bottom-4 left-6 right-6 z-40 flex items-center justify-between text-xs font-mono-code text-white/60 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="truncate max-w-md">
              <span className="font-semibold text-white uppercase">{activeItem.title}</span>
              {activeItem.author && <span className="ml-2 text-white/50">// {activeItem.author}</span>}
            </div>
            <div>
              {selectedIdx + 1} / {items.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Generate 30 Demo items using picsum with varied heights between 300 and 700 as requested
export function generateDemoItems(count = 30): MasonryItem[] {
  const titles = [
    "Twilight Solitude",
    "Chiaroscuro Silhouette",
    "Neon Monolith",
    "Brutalist Angle 04",
    "Velvet Motion Blur",
    "Analog Emulsion Grain",
    "Rain on Tungsten Glass",
    "Tokyo Nocturne",
    "Hasselblad Portrait IV",
    "Kolkata Industrial Delta",
  ];

  const authors = [
    "Sayan Patra",
    "Aarav Sen",
    "Elena Rostova",
    "Kenji Takahashi",
    "Damian Thorne",
  ];

  return Array.from({ length: count }, (_, i) => {
    const width = 600;
    // Random height between 300 and 700 so heights vary
    const height = Math.floor(Math.random() * (700 - 300 + 1)) + 300;
    const title = titles[i % titles.length];
    const author = authors[i % authors.length];

    return {
      id: `demo-${i + 1}`,
      src: `https://picsum.photos/seed/${i + 1}/${width}/${height}`,
      alt: `${title} by ${author}`,
      width,
      height,
      title,
      author,
    };
  });
}
