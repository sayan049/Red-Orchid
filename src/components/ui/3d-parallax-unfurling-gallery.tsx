"use client";

import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { sound } from "@/lib/sound";

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  slug?: string;
  client?: string;
  category?: string;
  year?: string;
  camera?: string;
  aspectRatio?: string;
}

const DEFAULT_IMAGES: GalleryItem[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=1200",
    title: "CHRONICLES OF DUSK",
    slug: "chronicles-of-dusk",
    client: "Arte France",
    category: "35MM FILM",
    year: "2024",
    camera: "Arriflex 435 ES",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200",
    title: "SOLITUDE IN 35MM",
    slug: "solitude-in-35mm",
    client: "Maison Margiela",
    category: "EDITORIAL",
    year: "2024",
    camera: "Leica M6",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1200",
    title: "NEO-NOIR DRIFT",
    slug: "neo-noir-silent-drift",
    client: "Sony Music",
    category: "CINEMA",
    year: "2024",
    camera: "ARRI Alexa 35",
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1200",
    title: "THE VELVET HOUR",
    slug: "the-velvet-hour",
    client: "Vogue Italia",
    category: "STILLS",
    year: "2023",
    camera: "Hasselblad H6D",
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=1200",
    title: "ANALOGUE SHADOWS",
    slug: "solitude-in-35mm",
    client: "Nowness",
    category: "35MM FILM",
    year: "2023",
    camera: "Arri 35",
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200",
    title: "KINETIC CELLULOID",
    slug: "chronicles-of-dusk",
    client: "A24",
    category: "NARRATIVE",
    year: "2024",
    camera: "Panavision Millennium",
  },
  {
    id: "7",
    src: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&q=80&w=1200",
    title: "TUNGSTEN REFLECTION",
    slug: "the-velvet-hour",
    client: "Warner Bros.",
    category: "CINEMA",
    year: "2024",
    camera: "Sony Venice 2",
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200",
    title: "ECHOES OF THE GHATS",
    slug: "chronicles-of-dusk",
    client: "National Film Board",
    category: "DOCUMENTARY",
    year: "2023",
    camera: "Arriflex 435",
  },
  {
    id: "9",
    src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200",
    title: "MONOCHROME ESSENCE",
    slug: "solitude-in-35mm",
    client: "Hasselblad Masters",
    category: "STILLS",
    year: "2024",
    camera: "Hasselblad 500C/M",
  },
  {
    id: "10",
    src: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1200",
    title: "SILENT EMULSION",
    slug: "neo-noir-silent-drift",
    client: "Independent",
    category: "SHORT FILM",
    year: "2024",
    camera: "Kodak 500T 35mm",
  },
  {
    id: "11",
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
    title: "RITUALS OF LIGHT",
    slug: "the-velvet-hour",
    client: "Atelier RO",
    category: "CINEMA",
    year: "2023",
    camera: "ARRI Alexa LF",
  },
  {
    id: "12",
    src: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&q=80&w=1200",
    title: "NOCTURNAL VORTEX",
    slug: "chronicles-of-dusk",
    client: "MUBI",
    category: "35MM FILM",
    year: "2024",
    camera: "Cooke Anamorphic",
  },
];

interface ImageCardProps {
  item: GalleryItem;
  onLoad?: () => void;
  onItemClick?: (item: GalleryItem) => void;
}

const ImageCard = ({ item, onLoad, onItemClick }: ImageCardProps) => {
  const content = (
    <div
      onClick={() => {
        try {
          sound.playClick();
        } catch {}
        if (onItemClick) onItemClick(item);
      }}
      data-cursor="VIEW FILM"
      className="group relative w-full h-[220px] sm:h-[320px] md:h-[420px] flex-shrink-0 rounded-2xl overflow-hidden bg-[#111010] border border-white/10 hover:border-white/40 transition-all duration-500 shadow-xl cursor-pointer will-change-transform"
    >
      {/* Background Image */}
      <Image
        src={item.src}
        alt={item.title || "Gallery Asset"}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        loading="lazy"
        onLoad={onLoad}
        className="w-full h-full object-cover filter brightness-[0.88] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700 ease-out"
      />

      {/* Atmospheric Cinema Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Top badges (Category & Year) */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[9.5px] sm:text-[10px] font-mono-code transition-transform duration-300 group-hover:translate-y-0.5">
        {item.category && (
          <span className="rounded-full border border-white/15 bg-black/75 px-2.5 py-1 text-white backdrop-blur-md">
            {item.category}
          </span>
        )}
        {item.year && (
          <span className="rounded-full border border-white/10 bg-black/60 px-2 py-0.5 text-white/60 backdrop-blur-md">
            {item.year}
          </span>
        )}
      </div>

      {/* Bottom Information Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-5 flex flex-col justify-end">
        {item.client && (
          <p className="font-mono-code text-[9px] sm:text-[10.5px] text-white/50 uppercase tracking-widest mb-1 truncate">
            {item.client}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-xs sm:text-base md:text-lg font-bold uppercase tracking-tight text-bone group-hover:text-orchid transition-colors duration-200 truncate">
            {item.title}
          </h3>

          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all duration-300 group-hover:border-orchid group-hover:bg-orchid">
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {item.camera && (
          <p className="mt-2 hidden sm:block font-mono-code text-[8.5px] sm:text-[9.5px] text-white/35 uppercase tracking-wider border-t border-white/10 pt-2 truncate">
            {item.camera}
          </p>
        )}
      </div>
    </div>
  );

  if (item.slug && !onItemClick) {
    return (
      <Link href={`/work/${item.slug}`} className="block w-full">
        {content}
      </Link>
    );
  }

  return content;
};

export interface ParallaxUnfurlingGalleryProps {
  items?: GalleryItem[];
  className?: string;
  onItemClick?: (item: GalleryItem) => void;
  useInnerScroll?: boolean;
}

export default function ParallaxUnfurlingGallery({
  items = DEFAULT_IMAGES,
  className,
  onItemClick,
  useInnerScroll = false,
}: ParallaxUnfurlingGalleryProps) {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setIsReady] = useState(false);
  const loadedCountRef = useRef(0);

  const handleItemLoad = useCallback(() => {
    loadedCountRef.current += 1;
    if (loadedCountRef.current >= 1) setIsReady(true);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Split gallery items across 4 columns
  const colMedia = useMemo(() => {
    const list = items && items.length > 0 ? items : DEFAULT_IMAGES;
    const col1Base = list.filter((_, i) => i % 4 === 0);
    const col2Base = list.filter((_, i) => i % 4 === 1);
    const col3Base = list.filter((_, i) => i % 4 === 2);
    const col4Base = list.filter((_, i) => i % 4 === 3);

    return {
      col1: [...col1Base, ...col1Base],
      col2: [...col2Base, ...col2Base],
      col3: [...col3Base, ...col3Base],
      col4: [...col4Base, ...col4Base],
    };
  }, [items]);

  // LINKED SCROLL: Supports both normal page scroll (smooth integration) and inner container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    ...(useInnerScroll ? { container: scrollWrapperRef } : {}),
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  // Banner size unfurling
  const bannerWidth = useTransform(smoothProgress, [0, 0.15], ["92vw", "100vw"]);
  const bannerHeight = useTransform(smoothProgress, [0, 0.15], ["85vh", "100vh"]);
  const bannerRadius = useTransform(smoothProgress, [0, 0.15], ["40px", "0px"]);
  const bannerBorderWidth = useTransform(smoothProgress, [0, 0.15], ["2px", "0px"]);

  // 3D Matrix animations unfurling into PERFECT 0° UNTILTED alignment
  // By progress ~0.70, it rotates smoothly into 0 degrees (not tilted), allowing users to clearly view every item!
  const rotateY = useTransform(smoothProgress, [0.12, 0.72], [-32, 0]);
  const rotateX = useTransform(smoothProgress, [0.12, 0.72], [18, 0]);
  const rotateZ = useTransform(smoothProgress, [0.12, 0.72], [10, 0]);
  const translateZ = useTransform(smoothProgress, [0.12, 0.72], [-650, 0]);

  // Column vertical parallax movement
  const yCol1 = useTransform(smoothProgress, [0.12, 0.72, 1], ["10%", "-20%", "-35%"]);
  const yCol2 = useTransform(smoothProgress, [0.12, 0.72, 1], ["-30%", "10%", "20%"]);
  const yCol3 = useTransform(smoothProgress, [0.12, 0.72, 1], ["15%", "-15%", "-30%"]);
  const yCol4 = useTransform(smoothProgress, [0.12, 0.72, 1], ["-20%", "15%", "25%"]);

  // Dynamic status cue indicating when gallery is aligned
  const alignedOpacity = useTransform(smoothProgress, [0.65, 0.75], [0, 1]);

  return (
    <div
      ref={useInnerScroll ? scrollWrapperRef : undefined}
      className={cn(
        "w-full bg-[#070707] text-white",
        useInnerScroll ? "h-screen overflow-y-auto overflow-x-hidden" : "",
        className
      )}
    >
      <section
        ref={containerRef}
        className="relative w-full h-[380vh] sm:h-[420vh] bg-[#070707] text-white font-sans selection:bg-orchid selection:text-white"
      >
        {/* Sticky 100vh stage */}
        <div className="sticky top-0 h-screen w-full flex justify-center items-center overflow-hidden">
          <motion.div
            style={{
              width: bannerWidth,
              height: bannerHeight,
              borderRadius: bannerRadius,
              borderWidth: bannerBorderWidth,
              borderColor: "rgba(255, 255, 255, 0.12)",
            }}
            className="relative bg-[#070707] overflow-hidden flex items-center justify-center max-w-[1920px] mx-auto will-change-transform backface-hidden preserve-3d"
          >
            {/* Header Floating Info Bar */}
            <div className="absolute top-6 left-6 right-6 sm:top-8 sm:left-10 sm:right-10 z-30 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2.5 font-mono-code text-[11px] text-orchid uppercase tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
                <span>{"// 3D CELLULOID MATRIX"}</span>
              </div>

              {/* Status cue when aligned */}
              <motion.div
                style={{ opacity: alignedOpacity }}
                className="hidden sm:flex items-center gap-2 font-mono-code text-[10px] text-white/50 uppercase tracking-widest bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>ALIGNED • HOVER & EXPLORE</span>
              </motion.div>
            </div>

            <div
              className="absolute inset-0 flex justify-center items-center pointer-events-none"
              style={{ perspective: "1100px" }}
            >
              {/* Cinematic Vignette Shadow Box Edge Masking */}
              <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_120px_160px_-40px_rgba(7,7,7,1),inset_0_-120px_160px_-40px_rgba(7,7,7,1)]" />
              <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_160px_0_160px_-40px_rgba(7,7,7,1),inset_-160px_0_160px_-40px_rgba(7,7,7,1)]" />

              {/* 3D Parallax Image Matrix */}
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  rotateZ,
                  z: translateZ,
                  transformStyle: "preserve-3d",
                }}
                className="flex gap-4 sm:gap-6 md:gap-8 justify-center items-center w-[125vw] h-[160vh] origin-center opacity-100 will-change-transform backface-hidden"
              >
                {/* Column 1 */}
                <motion.div
                  style={{ y: yCol1 }}
                  className="flex flex-col gap-4 sm:gap-6 md:gap-8 w-[23vw] min-w-[220px] max-w-[340px] pointer-events-auto"
                >
                  {colMedia.col1.map((item, index) => (
                    <ImageCard
                      key={`col1-${item.id}-${index}`}
                      item={item}
                      onLoad={handleItemLoad}
                      onItemClick={onItemClick}
                    />
                  ))}
                </motion.div>

                {/* Column 2 */}
                <motion.div
                  style={{ y: yCol2 }}
                  className="flex flex-col gap-4 sm:gap-6 md:gap-8 w-[23vw] min-w-[220px] max-w-[340px] pointer-events-auto"
                >
                  {colMedia.col2.map((item, index) => (
                    <ImageCard
                      key={`col2-${item.id}-${index}`}
                      item={item}
                      onLoad={handleItemLoad}
                      onItemClick={onItemClick}
                    />
                  ))}
                </motion.div>

                {/* Column 3 */}
                <motion.div
                  style={{ y: yCol3 }}
                  className="flex flex-col gap-4 sm:gap-6 md:gap-8 w-[23vw] min-w-[220px] max-w-[340px] pointer-events-auto"
                >
                  {colMedia.col3.map((item, index) => (
                    <ImageCard
                      key={`col3-${item.id}-${index}`}
                      item={item}
                      onLoad={handleItemLoad}
                      onItemClick={onItemClick}
                    />
                  ))}
                </motion.div>

                {/* Column 4 */}
                <motion.div
                  style={{ y: yCol4 }}
                  className="flex flex-col gap-4 sm:gap-6 md:gap-8 w-[23vw] min-w-[220px] max-w-[340px] pointer-events-auto"
                >
                  {colMedia.col4.map((item, index) => (
                    <ImageCard
                      key={`col4-${item.id}-${index}`}
                      item={item}
                      onLoad={handleItemLoad}
                      onItemClick={onItemClick}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Bottom floating instruction banner */}
            <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center pointer-events-none">
              <span className="font-mono-code text-[10px] sm:text-[11px] text-white/40 uppercase tracking-widest bg-black/60 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                SCROLL TO UNFURL & ALIGN MATRIX // CLICK TO VIEW FILM
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export { ParallaxUnfurlingGallery };
