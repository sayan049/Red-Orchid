"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface CoverflowSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  meta?: { label: string; value: string }[];
  id?: string;
  category?: string;
  slug?: string;
  videoUrl?: string;
  aspectRatio?: string;
  client?: string;
  onClick?: () => void;
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  /** Degrees the first neighbour tilts. */
  rotate?: number;
  /** How far the first neighbour recedes, as a fraction of card width. */
  depth?: number;
  /** Viewer distance as a multiple of card width — smaller is a wider lens. */
  perspective?: number;
  /** Exponent on distance. Below 1 the rake eases off as cards travel out. */
  falloff?: number;
  /** Opacity lost per step from the centre. */
  fade?: number;
  /** Any CSS length. Everything else is derived from it, so the rake scales. */
  cardWidth?: string;
  /** Space between cards, as a fraction of card width. */
  gap?: number;
  loop?: boolean;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  /** Names the carousel for assistive tech. */
  label?: string;
  className?: string;
  cardClassName?: string;
  onSlideClick?: (slide: CoverflowSlide, index: number) => void;
}

export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(190px, 26vw, 320px)",
  gap = 0.05,
  loop = true,
  showCaption = true,
  showPagination = true,
  showNavigation = true,
  label = "Cover carousel",
  className,
  cardClassName,
  onSlideClick,
}: CoverflowCarouselProps) {
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  /** Fractional card index at the centre. The single source of truth. */
  const posRef = React.useRef(0);
  /** Where the current settle is headed. Stepping off `pos` instead would
      swallow a keypress that lands mid-flight, before the round-off moves. */
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{
    id: number;
    x: number;
    pos: number;
    v: number;
    t: number;
  } | null>(null);

  const [selected, setSelected] = React.useState(0);

  /** Nearest whole card, folded back into 0..count-1. */
  const indexAt = React.useCallback(
    (pos: number) => {
      if (count === 0) return 0;
      return ((Math.round(pos) % count) + count) % count;
    },
    [count],
  );

  // Paint straight to the DOM. Sixty state updates a second would re-render
  // every card for numbers React never needs to see.
  const paint = React.useCallback(() => {
    if (count === 0) return;
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Fold the distance into the shorter way round the ring. This is the
      // whole looping mechanism — no cloned nodes, no shuffling the DOM.
      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      // Both the tilt and the recession ease off as cards travel out —
      // doubling the distance adds only about half again as much of each.
      // A linear ramp folds the second card shut; this keeps it readable.
      const ramp = Math.pow(distance, falloff);
      // Capped short of edge-on so a far card never turns its back.
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      // A card is teleported across the ring at exactly half a turn out, so it
      // has to be gone by then or the jump is visible.
      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      setSelected(indexAt(target));

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        // ponytail: exponential ease-out, not a spring. Swap in a spring only
        // if the settle needs overshoot.
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint],
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const goTo = React.useCallback(
    (index: number) => {
      if (count === 0) return;
      // Take the shorter way round rather than unwinding the whole ring.
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle],
  );

  const nudge = React.useCallback(
    (by: number) => {
      if (count === 0) return;
      settle(clamp(Math.round(targetRef.current) + by));
    },
    [clamp, count, settle],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (count === 0) return;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    // Cards per second, for the throw.
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    // Let a flick carry, but never more than two cards.
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  // Card width drives pitch, depth and perspective, so it is the only thing
  // worth measuring — and only when the box actually changes.
  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  if (count === 0) {
    return (
      <div className="py-20 text-center font-mono-code text-sm text-white/40">
        NO ITEMS IN ARCHIVE FOR THIS CATEGORY
      </div>
    );
  }

  const active = slides[selected];

  const handleCardClick = (slide: CoverflowSlide, index: number) => {
    if (selected === index) {
      if (onSlideClick) {
        onSlideClick(slide, index);
      } else if (slide.onClick) {
        slide.onClick();
      }
    } else {
      goTo(index);
    }
  };

  return (
    <div
      className={cn("w-full select-none", className)}
      style={{ ["--cf-card" as string]: cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          // Vertical padding keeps the drop shadows clear of the overflow clip.
          className="cursor-grab overflow-hidden py-12 outline-none active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            // Horizontal drag is ours; the page keeps vertical scrolling.
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: "calc(var(--cf-card) * 1.35)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => {
              const isCenter = index === selected;
              return (
                <div
                  key={`${slide.src}-${index}`}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  onClick={() => handleCardClick(slide, index)}
                  className={cn(
                    "absolute left-1/2 top-0 aspect-[3/4] overflow-hidden rounded-2xl bg-[#141211] shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/10 will-change-transform cursor-pointer transition-colors duration-300",
                    isCenter && "border-white/25 shadow-[0_25px_60px_rgba(0,0,0,0.95)]",
                    cardClassName,
                  )}
                  style={{ width: "var(--cf-card)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    draggable={false}
                    className="h-full w-full select-none object-cover transition-transform duration-500 hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Category badge */}
                  {slide.category && (
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="font-mono-code text-[10px] uppercase font-bold tracking-wider rounded-full bg-black/70 px-2.5 py-1 text-white/90 border border-white/15 backdrop-blur-md">
                        {slide.category}
                      </span>
                    </div>
                  )}

                  {/* Center hint when active */}
                  {isCenter && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <span className="font-mono-code text-[11px] font-bold uppercase tracking-wider rounded-full bg-black/80 border border-white/20 px-3.5 py-1.5 text-white shadow-xl backdrop-blur-md">
                        {slide.videoUrl ? "WATCH FILM" : "OPEN LIGHTBOX"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-2 sm:left-4 top-1/2 z-[200] -translate-y-1/2 rounded-full border border-white/20 bg-black/80 p-2.5 sm:p-3 text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/15 hover:scale-110 cursor-pointer shadow-xl active:scale-95"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-2 sm:right-4 top-1/2 z-[200] -translate-y-1/2 rounded-full border border-white/20 bg-black/80 p-2.5 sm:p-3 text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/15 hover:scale-110 cursor-pointer shadow-xl active:scale-95"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </>
        )}
      </div>

      {showCaption && active?.title && (
        <div
          key={selected}
          className="mt-4 sm:mt-6 flex flex-col items-center px-4 text-center duration-300 animate-in fade-in"
        >
          <div className="flex items-center gap-2 mb-2">
            {active.category && (
              <span className="font-mono-code text-[10px] uppercase tracking-widest text-white/80 px-2.5 py-0.5 rounded-full border border-white/15 bg-white/5">
                {active.category}
              </span>
            )}
            {active.client && (
              <span className="font-mono-code text-[10px] text-white/50 uppercase tracking-widest">
                // {active.client}
              </span>
            )}
          </div>

          <p className="font-display text-xl sm:text-3xl font-extrabold uppercase tracking-tight text-bone">
            {active.title}
          </p>

          {active.subtitle && (
            <p className="mt-1 font-sans-ui text-xs sm:text-sm text-white/60 max-w-lg">
              {active.subtitle}
            </p>
          )}

          {active.meta && active.meta.length > 0 && (
            <dl className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] font-mono-code text-white/60">
              {active.meta.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1"
                >
                  <dt className="text-white/40 uppercase">{row.label}:</dt>
                  <dd className="font-semibold text-white">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {(active.onClick || onSlideClick) && (
            <button
              type="button"
              onClick={() => handleCardClick(active, selected)}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2.5 font-mono-code text-xs font-semibold text-white uppercase tracking-wider hover:border-white/40 hover:bg-white/20 transition-all cursor-pointer min-h-[44px] active:scale-95"
            >
              <span>{active.videoUrl ? "WATCH IN CINEMA" : "VIEW FULL RESOLUTION"}</span>
              <span>&rarr;</span>
            </button>
          )}
        </div>
      )}

      {showPagination && count > 1 && (
        <div className="mt-6 sm:mt-8 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap max-w-md mx-auto px-4">
          {slides.slice(0, Math.min(count, 20)).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                index === selected
                  ? "w-7 bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                  : "w-2 bg-white/25 hover:bg-white/50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
