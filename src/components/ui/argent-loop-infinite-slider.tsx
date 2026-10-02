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
  SCROLL_SPEED: 0.75,
  LERP_FACTOR: 0.065,
  BUFFER_SIZE: 5,
  MAX_VELOCITY: 150,
  SNAP_DURATION: 500,
};

// Utility functions
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

  // Refs for state that changes frequently (animation loop)
  const state = React.useRef({
    currentY: 0,
    targetY: 0,
    isDragging: false,
    isSnapping: false,
    snapStart: { time: 0, y: 0, target: 0 },
    lastScrollTime: Date.now(),
    dragStart: { y: 0, scrollY: 0 },
    projectHeight: 650, // default container height
    minimapHeight: 200, // Fixed height for minimap card
  });

  // Refs to store DOM elements
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

  // Parallax updater
  const updateParallax = (
    img: HTMLImageElement | null,
    scroll: number,
    index: number,
    height: number,
  ) => {
    if (!img) return;
    if (!img.dataset.parallaxCurrent) {
      img.dataset.parallaxCurrent = "0";
    }

    let current = parseFloat(img.dataset.parallaxCurrent);
    const target = (-scroll - index * height) * 0.18;
    current = lerp(current, target, 0.1);

    if (Math.abs(current - target) > 0.01) {
      img.style.transform = `translateY(${current}px) scale(1.15)`;
      img.dataset.parallaxCurrent = current.toString();
    }
  };

  const updateSnap = () => {
    const s = state.current;
    const progress = Math.min(
      (Date.now() - s.snapStart.time) / CONFIG.SNAP_DURATION,
      1,
    );
    const eased = 1 - Math.pow(1 - progress, 3);
    s.targetY =
      s.snapStart.y + (s.snapStart.target - s.snapStart.y) * eased;
    if (progress >= 1) s.isSnapping = false;
  };

  const snapToProject = () => {
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
  };

  const updatePositions = () => {
    const s = state.current;
    if (!s.projectHeight) return;
    const minimapY = (s.currentY * s.minimapHeight) / s.projectHeight;

    // Update Projects
    projectsRef.current.forEach((el, index) => {
      const y = index * s.projectHeight + s.currentY;
      el.style.transform = `translateY(${y}px)`;
      const img = el.querySelector("img");
      updateParallax(img, s.currentY, index, s.projectHeight);
    });

    // Update Minimap Images
    minimapRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translateY(${y}px)`;
      const img = el.querySelector("img");
      if (img) {
        updateParallax(img, minimapY, index, s.minimapHeight);
      }
    });

    // Update Info
    infoRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translateY(${y}px)`;
    });
  };

  const animate = () => {
    const s = state.current;
    if (!s.projectHeight) return;
    const now = Date.now();

    if (!s.isSnapping && !s.isDragging && now - s.lastScrollTime > 120) {
      const snapPoint =
        -Math.round(-s.targetY / s.projectHeight) * s.projectHeight;
      if (Math.abs(s.targetY - snapPoint) > 1) snapToProject();
    }

    if (s.isSnapping) updateSnap();
    if (!s.isDragging) {
      s.currentY += (s.targetY - s.currentY) * CONFIG.LERP_FACTOR;
    }

    updatePositions();
  };

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
  }, [activeIndex, count]);

  const stepProject = (direction: -1 | 1) => {
    sound.playClick();
    const s = state.current;
    s.isSnapping = false;
    s.lastScrollTime = Date.now();
    s.targetY += direction * s.projectHeight;
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

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const s = state.current;
      s.isSnapping = false;
      s.lastScrollTime = Date.now();
      const delta = Math.max(
        Math.min(e.deltaY * CONFIG.SCROLL_SPEED, CONFIG.MAX_VELOCITY),
        -CONFIG.MAX_VELOCITY,
      );
      s.targetY -= delta;
    };

    const onTouchStart = (e: TouchEvent) => {
      const s = state.current;
      s.isDragging = true;
      s.isSnapping = false;
      s.dragStart = { y: e.touches[0].clientY, scrollY: s.targetY };
      s.lastScrollTime = Date.now();
    };

    const onTouchMove = (e: TouchEvent) => {
      const s = state.current;
      if (!s.isDragging) return;
      s.targetY =
        s.dragStart.scrollY + (e.touches[0].clientY - s.dragStart.y) * 1.5;
      s.lastScrollTime = Date.now();
    };

    const onTouchEnd = () => {
      state.current.isDragging = false;
    };

    const onResize = () => {
      measure();
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onResize);

    requestRef.current = requestAnimationFrame(animationLoop);

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, [animationLoop]);

  // Generate range of indices
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
      className={`parallax-container group relative select-none w-full h-[650px] sm:h-[720px] md:h-[780px] overflow-hidden rounded-2xl border border-white/10 bg-[#070707] shadow-2xl cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* Background Project Slides List */}
      <ul className="project-list absolute inset-0 m-0 p-0 list-none overflow-hidden">
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
                className="h-full w-full object-cover select-none will-change-transform filter brightness-[0.75] contrast-[1.05]"
              />
              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/60 pointer-events-none" />
            </li>
          );
        })}
      </ul>

      {/* Top Header Bar on Slider */}
      <div className="absolute top-5 left-5 right-5 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-orchid animate-pulse" />
          <span className="font-mono-code text-[11px] font-bold tracking-widest uppercase text-white/90 bg-black/60 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
            INFINITE PARALLAX REEL
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => stepProject(1)}
            aria-label="Previous Project"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md hover:border-orchid hover:bg-orchid transition-all cursor-pointer shadow-lg active:scale-90"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => stepProject(-1)}
            aria-label="Next Project"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md hover:border-orchid hover:bg-orchid transition-all cursor-pointer shadow-lg active:scale-90"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Focus Overlay (Bottom Left Title & Action) */}
      <div className="absolute bottom-6 left-5 sm:left-8 z-30 max-w-lg pointer-events-auto">
        <div className="flex items-center gap-2 mb-2 font-mono-code text-xs text-orchid uppercase tracking-widest">
          <span>{currentActiveProject?.category}</span>
          <span className="text-white/30">•</span>
          <span className="text-white/60">{currentActiveProject?.year}</span>
        </div>

        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase text-bone tracking-tight drop-shadow-md">
          {currentActiveProject?.title}
        </h2>

        <p className="mt-2 font-sans-ui text-xs sm:text-sm text-white/70 line-clamp-2 max-w-md">
          {currentActiveProject?.description}
        </p>

        {(onItemClick || currentActiveProject?.onAction) && (
          <button
            type="button"
            onClick={handleAction}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-orchid bg-orchid px-5 py-2.5 font-mono-code text-xs font-semibold text-white uppercase tracking-wider shadow-[0_0_25px_rgba(225,29,72,0.4)] hover:bg-orchid-dark hover:scale-105 transition-all cursor-pointer min-h-[44px] active:scale-95"
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

      {/* Minimap Synchronized Parallax Card (Bottom Right on Desktop, Hidden or compact on tiny mobile) */}
      <div className="minimap hidden sm:block absolute bottom-6 right-6 z-30 w-[280px] md:w-[320px] h-[190px] rounded-xl overflow-hidden border border-white/20 bg-[#12100f]/85 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] pointer-events-none">
        <div className="minimap-wrapper relative flex w-full h-full">
          {/* Synchronized Thumbnail Column */}
          <div className="minimap-img-preview relative w-[100px] h-full overflow-hidden border-r border-white/10">
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

          {/* Synchronized Metadata Column */}
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
                    <span className="text-orchid">{num}</span>
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

      {/* Touch / Scroll Hint */}
      <div className="absolute top-5 right-24 hidden md:flex items-center gap-1.5 font-mono-code text-[10px] text-white/40 pointer-events-none uppercase tracking-wider">
        <span>SCROLL / DRAG TO CYCLE</span>
      </div>
    </div>
  );
}

// Export Component alias as requested in prompt demo
export const Component = ArgentLoopInfiniteSlider;
export default ArgentLoopInfiniteSlider;
