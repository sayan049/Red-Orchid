"use client";

import * as React from "react";
import { ArrowUpRight, ChevronDown, ChevronUp, Play, Maximize2 } from "lucide-react";
import { sound } from "@/lib/sound";

export interface ProjectData {
  title: string;
  image: string;
  category: string;
  year: string;
  description: string;
  videoUrl?: string;
  aspectRatio?: string;
  client?: string;
  slug?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const DEFAULT_PROJECT_DATA: ProjectData[] = [
  {
    title: "Redroom Gesture 14",
    image:
      "https://cdn.21st.dev/assets/mirror/b2/b226346ec34fe24bbe9082488ff7f2c84d7150de914648cac41eeabe17579811.jpg",
    category: "Concept Series",
    year: "2025",
    description: "Expressive motion study",
  },
  {
    title: "Shadowwear 6AM",
    image:
      "https://cdn.21st.dev/assets/mirror/e4/e4aa6feebdf90e8f95fd1b23df1134252323f1a8431bacf6cce347a6872a36b1.jpg",
    category: "Photography",
    year: "2024",
    description: "Urban portrait series",
  },
  {
    title: "Blur Formation 03",
    image:
      "https://cdn.21st.dev/assets/mirror/fb/fb1f483387b6207cca218e17983266d323e2c4b77cdfb689a697e465e659ad96.jpg",
    category: "Kinetic Study",
    year: "2024",
    description: "Motion blur experiment",
  },
  {
    title: "Sunglass Operator",
    image:
      "https://cdn.21st.dev/assets/mirror/77/775ac71e6498243369b483fc1e8fc660d968f60dc692cef40ca3a453615de65a.jpg",
    category: "Editorial Motion",
    year: "2023",
    description: "Fashion editorial piece",
  },
  {
    title: "Azure Figure 5",
    image:
      "https://cdn.21st.dev/assets/mirror/bc/bcfc0cf9a756c7a9efab688f3d4f64e16d88ca943b81056da21827a0e94c33a8.jpg",
    category: "Visual Research",
    year: "2024",
    description: "Color theory exploration",
  },
];

const CONFIG = {
  SCROLL_SPEED: 0.85,
  LERP_FACTOR: 0.1,
  BUFFER_SIZE: 4,
  MAX_VELOCITY: 120,
  SNAP_DURATION: 380,
};

const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor;

export interface ArgentLoopSliderProps {
  items?: ProjectData[];
  onItemClick?: (item: ProjectData) => void;
  className?: string;
}

export function ArgentLoopInfiniteSlider({
  items,
  onItemClick,
  className = "",
}: ArgentLoopSliderProps) {
  const dataset = items && items.length > 0 ? items : DEFAULT_PROJECT_DATA;
  const count = dataset.length;

  const [visibleRange, setVisibleRange] = React.useState({
    min: -CONFIG.BUFFER_SIZE,
    max: CONFIG.BUFFER_SIZE,
  });

  const [activeIndex, setActiveIndex] = React.useState(0);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const state = React.useRef({
    currentY: 0,
    targetY: 0,
    isDragging: false,
    isSnapping: false,
    snapStart: { time: 0, y: 0, target: 0 },
    lastScrollTime: Date.now(),
    dragStart: { y: 0, scrollY: 0, time: 0 },
    projectHeight: 650,
    minimapHeight: 180,
  });

  const projectsRef = React.useRef<Map<number, HTMLElement>>(new Map());
  const minimapRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const infoRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const requestRef = React.useRef<number | null>(null);

  const getProjectData = React.useCallback(
    (index: number) => {
      const i = ((Math.abs(index) % count) + count) % count;
      return dataset[i];
    },
    [count, dataset],
  );

  const getProjectNumber = React.useCallback(
    (index: number) => {
      const i = ((Math.abs(index) % count) + count) % count;
      return (i + 1).toString().padStart(2, "0");
    },
    [count],
  );

  const updateParallax = (
    img: HTMLImageElement | null,
    scroll: number,
    index: number,
    height: number,
  ) => {
    if (!img) return;
    const target = (-scroll - index * height) * 0.15;
    img.style.transform = `translateY(${target}px) scale(1.15)`;
  };

  const updatePositions = React.useCallback(() => {
    const s = state.current;
    if (!s.projectHeight) return;
    const minimapY = (s.currentY * s.minimapHeight) / s.projectHeight;

    projectsRef.current.forEach((el, index) => {
      const y = index * s.projectHeight + s.currentY;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
      const img = el.querySelector("img");
      updateParallax(img, s.currentY, index, s.projectHeight);
    });

    minimapRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
      const img = el.querySelector("img");
      if (img) {
        updateParallax(img, minimapY, index, s.minimapHeight);
      }
    });

    infoRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    });
  }, []);

  const updateSnap = () => {
    const s = state.current;
    const progress = Math.min(
      (Date.now() - s.snapStart.time) / CONFIG.SNAP_DURATION,
      1,
    );
    const eased = 1 - Math.pow(1 - progress, 3);
    s.targetY = s.snapStart.y + (s.snapStart.target - s.snapStart.y) * eased;
    if (progress >= 1) s.isSnapping = false;
  };

  const snapToProject = React.useCallback(() => {
    const s = state.current;
    if (!s.projectHeight) return;
    const current = Math.round(-s.targetY / s.projectHeight);
    const target = -current * s.projectHeight;
    s.isSnapping = true;
    s.snapStart = {
      time: Date.now(),
      y: s.targetY,
      target: target,
    };
  }, []);

  const animate = React.useCallback(() => {
    const s = state.current;
    if (!s.projectHeight) return;
    const now = Date.now();

    if (!s.isSnapping && !s.isDragging && now - s.lastScrollTime > 180) {
      const snapPoint = -Math.round(-s.targetY / s.projectHeight) * s.projectHeight;
      if (Math.abs(s.targetY - snapPoint) > 1) {
        snapToProject();
      }
    }

    if (s.isSnapping) {
      updateSnap();
    }

    if (s.isDragging) {
      // During active drag, smooth follow targetY directly
      s.currentY += (s.targetY - s.currentY) * 0.45;
    } else {
      s.currentY += (s.targetY - s.currentY) * CONFIG.LERP_FACTOR;
    }

    updatePositions();
  }, [snapToProject, updatePositions]);

  const renderedRange = React.useRef({
    min: -CONFIG.BUFFER_SIZE,
    max: CONFIG.BUFFER_SIZE,
  });

  const animationLoop = React.useCallback(() => {
    animate();

    const s = state.current;
    if (s.projectHeight) {
      const currentIndex = Math.round(-s.targetY / s.projectHeight);
      const min = currentIndex - CONFIG.BUFFER_SIZE;
      const max = currentIndex + CONFIG.BUFFER_SIZE;

      const normalizedIdx = ((Math.abs(currentIndex) % count) + count) % count;
      if (normalizedIdx !== activeIndex) {
        setActiveIndex(normalizedIdx);
      }

      if (min !== renderedRange.current.min || max !== renderedRange.current.max) {
        renderedRange.current = { min, max };
        setVisibleRange({ min, max });
      }
    }

    requestRef.current = requestAnimationFrame(animationLoop);
  }, [activeIndex, animate, count]);

  const stepNext = (e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
    sound.playClick();
    const s = state.current;
    if (!s.projectHeight) return;
    const currentIndex = Math.round(-s.targetY / s.projectHeight);
    const nextIndex = currentIndex + 1;
    const target = -nextIndex * s.projectHeight;
    s.isSnapping = true;
    s.snapStart = {
      time: Date.now(),
      y: s.currentY,
      target: target,
    };
    s.targetY = target;
    s.lastScrollTime = Date.now();
  };

  const stepPrev = (e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
    sound.playClick();
    const s = state.current;
    if (!s.projectHeight) return;
    const currentIndex = Math.round(-s.targetY / s.projectHeight);
    const prevIndex = currentIndex - 1;
    const target = -prevIndex * s.projectHeight;
    s.isSnapping = true;
    s.snapStart = {
      time: Date.now(),
      y: s.currentY,
      target: target,
    };
    s.targetY = target;
    s.lastScrollTime = Date.now();
  };

  // Pointer Drag handling (Works across Desktop Mouse & Mobile Touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag with primary mouse button or touch
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, select, textarea, [role='button']")) {
      return;
    }
    const s = state.current;
    s.isDragging = true;
    s.isSnapping = false;
    s.dragStart = {
      y: e.clientY,
      scrollY: s.targetY,
      time: performance.now(),
    };
    s.lastScrollTime = Date.now();
    if (e.currentTarget) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    if (!s.isDragging) return;
    const dy = e.clientY - s.dragStart.y;
    s.targetY = s.dragStart.scrollY + dy * 1.35;
    s.lastScrollTime = Date.now();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    if (!s.isDragging) return;
    s.isDragging = false;
    if (e.currentTarget && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    // Velocity fling
    const dt = Math.max(performance.now() - s.dragStart.time, 1);
    const dy = e.clientY - s.dragStart.y;
    const velocity = (dy / dt) * 1000;
    const momentum = Math.max(-s.projectHeight, Math.min(s.projectHeight, velocity * 0.25));
    s.targetY += momentum;

    snapToProject();
  };

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      if (container) {
        state.current.projectHeight = container.offsetHeight || 650;
      }
    };

    measure();

    const onResize = () => {
      measure();
    };

    window.addEventListener("resize", onResize);

    requestRef.current = requestAnimationFrame(animationLoop);

    return () => {
      window.removeEventListener("resize", onResize);
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, [animationLoop]);

  const indices: number[] = [];
  for (let i = visibleRange.min; i <= visibleRange.max; i++) {
    indices.push(i);
  }

  const currentActiveProject = dataset[activeIndex];

  const handleAction = () => {
    if (onItemClick) {
      onItemClick(currentActiveProject);
    } else if (currentActiveProject.onAction) {
      currentActiveProject.onAction();
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`parallax-container group relative select-none w-full h-[600px] sm:h-[680px] md:h-[740px] overflow-hidden rounded-2xl border border-white/10 bg-[#070707] cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* Background Project Slides List */}
      <ul className="project-list absolute inset-0 m-0 p-0 list-none overflow-hidden pointer-events-none">
        {indices.map((i) => {
          const data = getProjectData(i);
          return (
            <li
              key={i}
              className="project absolute inset-0 overflow-hidden will-change-transform"
              ref={(el) => {
                if (el) projectsRef.current.set(i, el);
                else projectsRef.current.delete(i);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.image}
                alt={data.title}
                draggable={false}
                className="h-full w-full object-cover select-none will-change-transform filter brightness-[0.72] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/60 pointer-events-none" />
            </li>
          );
        })}
      </ul>

      {/* Top Header Bar: Clean single flex row with NO overlap */}
      <div className="absolute top-4 sm:top-5 left-4 sm:left-6 right-4 sm:right-6 z-30 flex items-center justify-between pointer-events-none">
        {/* Left Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="h-2 w-2 rounded-full bg-orchid animate-pulse" />
          <span className="font-mono-code text-[11px] font-bold tracking-widest uppercase text-white/90 bg-black/60 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
            INFINITE PARALLAX REEL
          </span>
        </div>

        {/* Right Section: Hint + Buttons in unified flex container */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          <span className="font-mono-code text-[10px] text-white/50 uppercase tracking-wider hidden md:inline-block bg-black/50 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            DRAG OR USE ARROWS
          </span>

          <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-full border border-white/15 backdrop-blur-md">
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={stepPrev}
              aria-label="Previous Project"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md hover:border-white/40 hover:bg-white/15 transition-all cursor-pointer active:scale-90"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={stepNext}
              aria-label="Next Project"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md hover:border-white/40 hover:bg-white/15 transition-all cursor-pointer active:scale-90"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Focus Overlay (Bottom Left Title & Action) */}
      <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-8 z-30 max-w-lg pointer-events-auto">
        <div className="flex items-center gap-2 mb-2 font-mono-code text-xs text-white/80 uppercase tracking-widest">
          <span className="text-white/90 font-semibold">{currentActiveProject?.category}</span>
          <span className="text-white/30">•</span>
          <span className="text-white/60">{currentActiveProject?.year}</span>
        </div>

        <h2
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            handleAction();
          }}
          className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase text-bone tracking-tight cursor-pointer hover:text-white/90 transition-colors"
        >
          {currentActiveProject?.title}
        </h2>

        <p className="mt-2 font-sans-ui text-xs sm:text-sm text-white/70 line-clamp-2 max-w-md">
          {currentActiveProject?.description}
        </p>

        {(onItemClick || currentActiveProject?.onAction) && (
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              handleAction();
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 font-mono-code text-xs font-semibold text-white uppercase tracking-wider hover:border-white/40 hover:bg-white/20 transition-all cursor-pointer min-h-[44px] active:scale-95"
          >
            {currentActiveProject?.videoUrl ? (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>PLAY CINEMA REEL</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span>EXPAND STILL</span>
              </>
            )}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Minimap Synchronized Parallax Card (Bottom Right on Desktop) */}
      <div className="minimap hidden sm:block absolute bottom-6 right-6 z-30 w-[270px] md:w-[310px] h-[175px] rounded-xl overflow-hidden border border-white/15 bg-[#12100f]/85 backdrop-blur-xl pointer-events-none">
        <div className="minimap-wrapper relative flex w-full h-full">
          <div className="minimap-img-preview relative w-[95px] h-full overflow-hidden border-r border-white/10">
            {indices.map((i) => {
              const data = getProjectData(i);
              return (
                <div
                  key={i}
                  className="minimap-img-item absolute inset-0 w-full h-full overflow-hidden will-change-transform"
                  ref={(el) => {
                    if (el) minimapRef.current.set(i, el);
                    else minimapRef.current.delete(i);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.image}
                    alt={data.title}
                    draggable={false}
                    className="h-full w-full object-cover filter brightness-90 will-change-transform"
                  />
                </div>
              );
            })}
          </div>

          <div className="minimap-info-list relative flex-1 h-full overflow-hidden p-3.5">
            {indices.map((i) => {
              const data = getProjectData(i);
              const num = getProjectNumber(i);
              return (
                <div
                  key={i}
                  className="minimap-item-info absolute inset-0 w-full h-full flex flex-col justify-center px-4 space-y-2 will-change-transform"
                  ref={(el) => {
                    if (el) infoRef.current.set(i, el);
                    else infoRef.current.delete(i);
                  }}
                >
                  <div className="minimap-item-info-row flex justify-between items-center font-mono-code text-[11px] font-bold text-bone">
                    <span className="text-white/80">{num}</span>
                    <span className="truncate max-w-[130px]">{data.title}</span>
                  </div>
                  <div className="minimap-item-info-row flex justify-between items-center font-mono-code text-[10px] text-white/50 uppercase">
                    <span className="truncate max-w-[100px]">{data.category}</span>
                    <span>{data.year}</span>
                  </div>
                  <div className="minimap-item-info-row font-sans-ui text-[10px] text-white/60 line-clamp-2 leading-tight">
                    {data.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Component = ArgentLoopInfiniteSlider;
export default ArgentLoopInfiniteSlider;
