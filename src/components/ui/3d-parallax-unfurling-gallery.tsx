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
      className="group relative w-full h-[220px] sm:h-[320px] md:h-[400px] flex-shrink-0 rounded-2xl overflow-hidden bg-[#111010] border border-white/10 hover:border-white/40 transition-all duration-300 cursor-pointer will-change-transform backface-hidden"
    >
      {/* Background Image */}
      <Image
        src={item.src}
        alt={item.title || "Gallery Asset"}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        loading="lazy"
        onLoad={onLoad}
        className="w-full h-full object-cover filter brightness-[0.88] group-hover:brightness-100 group-hover:scale-105 transition-all duration-500 ease-out"
      />

      {/* Atmospheric Cinema Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Top badges (Category & Year) */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[9.5px] sm:text-[10px] font-mono-code transition-transform duration-300">
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
}

export default function ParallaxUnfurlingGallery({
  items = DEFAULT_IMAGES,
  className,
  onItemClick,
}: ParallaxUnfurlingGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setIsReady] = useState(false);
  const loadedCountRef = useRef(0);

  const handleItemLoad = useCallback(() => {
    loadedCountRef.current += 1;
    if (loadedCountRef.current >= 1) setIsReady(true);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 1000);
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

  // Track window scroll over this pinned container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Fast, responsive spring so it feels immediate with wheel/touch
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
    mass: 0.2,
  });

  // 1. OPEN EFFECT: Banner starts as framed floating card, expands to full viewport
  const bannerWidth = useTransform(smoothProgress, [0, 0.22], ["86vw", "100vw"]);
  const bannerHeight = useTransform(smoothProgress, [0, 0.22], ["72vh", "100vh"]);
  const bannerRadius = useTransform(smoothProgress, [0, 0.22], ["32px", "0px"]);
  const bannerBorderWidth = useTransform(smoothProgress, [0, 0.22], ["2px", "0px"]);

  // 2. TILT TO STRAIGHT: Rotates from dramatic 3D angles directly into PERFECT 0° UNTILTED view
  const rotateY = useTransform(smoothProgress, [0, 0.52], [-35, 0]);
  const rotateX = useTransform(smoothProgress, [0, 0.52], [22, 0]);
  const rotateZ = useTransform(smoothProgress, [0, 0.52], [12, 0]);
  const translateZ = useTransform(smoothProgress, [0, 0.52], [-650, 0]);

  // 3. Columns vertical parallax glide during scroll
  const yCol1 = useTransform(smoothProgress, [0, 0.52, 1], ["12%", "-18%", "-32%"]);
  const yCol2 = useTransform(smoothProgress, [0, 0.52, 1], ["-32%", "8%", "22%"]);
  const yCol3 = useTransform(smoothProgress, [0, 0.52, 1], ["18%", "-12%", "-28%"]);
  const yCol4 = useTransform(smoothProgress, [0, 0.52, 1], ["-22%", "12%", "26%"]);

  // Status indicator opacity
  const initialCueOpacity = useTransform(smoothProgress, [0.45, 0.55], [1, 0]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-[320vh] sm:h-[350vh] bg-[#070707] text-white",
        className
      )}
    >
      {/* Sticky 100vh stage: Stays PINNED while user scrolls through 320vh */}
      <div className="sticky top-0 h-screen w-full flex justify-center items-center overflow-hidden">
        {/* Banner Window: Opens from card to full viewport */}
        <motion.div
          style={{
            width: bannerWidth,
            height: bannerHeight,
            borderRadius: bannerRadius,
            borderWidth: bannerBorderWidth,
            borderColor: "rgba(255, 255, 255, 0.15)",
          }}
          className="relative bg-[#070707] overflow-hidden flex items-center justify-center max-w-[1920px] mx-auto will-change-transform backface-hidden preserve-3d"
        >
          {/* Top Floating Cinema HUD */}
          <div className="absolute top-5 left-5 right-5 sm:top-8 sm:left-10 sm:right-10 z-30 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2.5 font-mono-code text-[11px] text-orchid uppercase tracking-widest bg-black/60 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-orchid animate-pulse" />
              <span>{"// SELECTED ARCHIVE • 3D MATRIX"}</span>
            </div>

            {/* Dynamic Status: Shows scroll cue initially */}
            <div className="flex items-center gap-3">
              <motion.div
                style={{ opacity: initialCueOpacity }}
                className="hidden sm:flex items-center gap-2 font-mono-code text-[10px] text-white/60 uppercase tracking-widest bg-black/60 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md"
              >
                <span>SCROLL TO UNFURL & STRAIGHTEN</span>
                <span className="animate-bounce">&darr;</span>
              </motion.div>

              <Link
                href="/gallery"
                onClick={() => sound.playClick()}
                data-cursor="GALLERY"
                className="pointer-events-auto flex items-center gap-1.5 font-mono-code text-[10px] sm:text-[11px] text-white/80 hover:text-white bg-black/70 hover:bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md transition-colors"
              >
                <span>VISUAL ARCHIVE</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Perspective Container */}
          <div
            className="absolute inset-0 flex justify-center items-center pointer-events-none"
            style={{ perspective: "1100px" }}
          >
            {/* 3D Parallax Image Matrix: Tilts into 0° straight */}
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
                className="flex flex-col gap-4 sm:gap-6 md:gap-8 w-[23vw] min-w-[210px] max-w-[340px] pointer-events-auto"
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
                className="flex flex-col gap-4 sm:gap-6 md:gap-8 w-[23vw] min-w-[210px] max-w-[340px] pointer-events-auto"
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
                className="flex flex-col gap-4 sm:gap-6 md:gap-8 w-[23vw] min-w-[210px] max-w-[340px] pointer-events-auto"
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
                className="flex flex-col gap-4 sm:gap-6 md:gap-8 w-[23vw] min-w-[210px] max-w-[340px] pointer-events-auto"
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

          {/* Bottom Floating Info / Action Bar */}
          <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center pointer-events-none px-4">
            <div className="pointer-events-auto flex items-center gap-3 bg-black/75 px-4 sm:px-6 py-2 rounded-full border border-white/15 backdrop-blur-md">
              <span className="font-mono-code text-[10px] sm:text-[11px] text-white/60 uppercase tracking-widest">
                35MM & DIGITAL CINEMA ATELIER
              </span>
              <span className="text-white/20">•</span>
              <Link
                href="/gallery"
                onClick={() => sound.playClick()}
                className="font-mono-code text-[10px] sm:text-[11px] text-orchid hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors"
              >
                <span>VIEW ARCHIVE</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export { ParallaxUnfurlingGallery };
